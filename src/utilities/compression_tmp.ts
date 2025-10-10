// Advanced Compression for Large JSON Payloads (30MB+)
// Includes chunking, streaming, and Web Worker support

import pako from 'pako';
import LZString from 'lz-string';

// ============================================
// 1. LARGE DATA COMPRESSION ANALYZER
// ============================================

export class CompressionAnalyzer {
  static analyze(data: any): {
    originalSize: number;
    estimatedGzip: number;
    estimatedLZ: number;
    recommendedMethod: string;
    expectedFinalSize: number;
  } {
    const jsonString = JSON.stringify(data);
    const originalSize = new Blob([jsonString]).size;
    
    // Sample compression on small portion to estimate
    const sample = jsonString.slice(0, 10000);
    const gzipSample = pako.gzip(sample);
    const lzSample = LZString.compressToBase64(sample);
    
    const gzipRatio = gzipSample.length / sample.length;
    const lzRatio = lzSample.length / sample.length;
    
    return {
      originalSize,
      estimatedGzip: Math.round(originalSize * gzipRatio),
      estimatedLZ: Math.round(originalSize * lzRatio),
      recommendedMethod: gzipRatio < lzRatio ? 'gzip' : 'lz',
      expectedFinalSize: Math.round(originalSize * Math.min(gzipRatio, lzRatio))
    };
  }
}

// ============================================
// 2. CHUNKED COMPRESSION FOR 30MB+ DATA
// ============================================

export interface ChunkMetadata {
  totalChunks: number;
  chunkIndex: number;
  originalSize: number;
  compressedSize: number;
  checksum: string;
}

export class ChunkedCompressor {
  private readonly CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  
  /**
   * Compress large data in chunks to avoid memory issues
   */
  async compressInChunks(
    data: any,
    onProgress?: (progress: number) => void
  ): Promise<{
    chunks: Array<{ data: string; metadata: ChunkMetadata }>;
    totalSize: number;
    compressionRatio: number;
  }> {
    const jsonString = JSON.stringify(data);
    const totalSize = jsonString.length;
    const chunks: Array<{ data: string; metadata: ChunkMetadata }> = [];
    
    const numChunks = Math.ceil(totalSize / this.CHUNK_SIZE);
    let compressedTotal = 0;
    
    for (let i = 0; i < numChunks; i++) {
      const start = i * this.CHUNK_SIZE;
      const end = Math.min(start + this.CHUNK_SIZE, totalSize);
      const chunk = jsonString.slice(start, end);
      
      // Compress chunk with GZIP (best for large data)
      const compressed = pako.gzip(chunk, { level: 9 });
      const base64 = btoa(String.fromCharCode(...compressed));
      
      const metadata: ChunkMetadata = {
        totalChunks: numChunks,
        chunkIndex: i,
        originalSize: chunk.length,
        compressedSize: base64.length,
        checksum: await this.generateChecksum(chunk)
      };
      
      chunks.push({ data: base64, metadata });
      compressedTotal += base64.length;
      
      if (onProgress) {
        onProgress((i + 1) / numChunks * 100);
      }
    }
    
    return {
      chunks,
      totalSize: compressedTotal,
      compressionRatio: (1 - compressedTotal / totalSize) * 100
    };
  }
  
  /**
   * Decompress chunks back to original data
   */
  async decompressChunks(
    chunks: Array<{ data: string; metadata: ChunkMetadata }>,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    // Sort chunks by index to ensure correct order
    chunks.sort((a, b) => a.metadata.chunkIndex - b.metadata.chunkIndex);
    
    let decompressed = '';
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Decode base64 to binary
      const binaryString = atob(chunk.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let j = 0; j < binaryString.length; j++) {
        bytes[j] = binaryString.charCodeAt(j);
      }
      
      // Decompress with pako
      const decompressedChunk = pako.ungzip(bytes, { to: 'string' });
      decompressed += decompressedChunk;
      
      if (onProgress) {
        onProgress((i + 1) / chunks.length * 100);
      }
    }
    
    return JSON.parse(decompressed);
  }
  
  private async generateChecksum(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// ============================================
// 3. STREAMING COMPRESSION
// ============================================

export class StreamingCompressor {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  
  /**
   * Create a compression stream for very large data
   */
  createCompressionStream(): TransformStream<any, Uint8Array> {
    const deflate = new pako.Deflate({ level: 9 });
    let isFirst = true;
    
    return new TransformStream({
      transform(chunk, controller) {
        // Handle both objects and strings
        let stringChunk: string;
        if (typeof chunk === 'string') {
          stringChunk = chunk;
        } else {
          // For objects, handle array streaming
          if (isFirst) {
            stringChunk = '[' + JSON.stringify(chunk);
            isFirst = false;
          } else {
            stringChunk = ',' + JSON.stringify(chunk);
          }
        }
        
        const input = new TextEncoder().encode(stringChunk);
        deflate.push(input, false);
        
        // Get compressed data so far
        if (deflate.chunks.length > 0) {
          const compressed = deflate.chunks[deflate.chunks.length - 1];
          controller.enqueue(compressed);
        }
      },
      
      flush(controller) {
        if (!isFirst) {
          // Close the JSON array
          const closing = new TextEncoder().encode(']');
          deflate.push(closing, false);
        }
        
        // Finish compression
        deflate.push(new Uint8Array(), true);
        
        // Output remaining compressed data
        for (const chunk of deflate.chunks) {
          controller.enqueue(chunk);
        }
      }
    });
  }
  
  /**
   * Stream compress large array data
   */
  async streamCompressArray(
    data: any[],
    batchSize: number = 100
  ): Promise<Blob> {
    const chunks: Uint8Array[] = [];
    const stream = this.createCompressionStream();
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    // Start reading compressed output
    const readPromise = (async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    })();
    
    // Write data in batches
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length));
      for (const item of batch) {
        await writer.write(item);
      }
    }
    
    await writer.close();
    await readPromise;
    
    return new Blob(chunks as any, { type: 'application/octet-stream' });
  }
}

// ============================================
// 4. WEB WORKER FOR BACKGROUND COMPRESSION
// ============================================

// Worker code as a string (would normally be in separate file)
const workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js');

self.onmessage = async function(e) {
  const { action, data, options } = e.data;
  
  try {
    if (action === 'compress') {
      const jsonString = JSON.stringify(data);
      const compressed = pako.gzip(jsonString, { level: options.level || 9 });
      const base64 = btoa(String.fromCharCode(...compressed));
      
      self.postMessage({
        success: true,
        result: base64,
        stats: {
          originalSize: jsonString.length,
          compressedSize: base64.length,
          ratio: (1 - base64.length / jsonString.length) * 100
        }
      });
    } else if (action === 'decompress') {
      const binaryString = atob(data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decompressed = pako.ungzip(bytes, { to: 'string' });
      const result = JSON.parse(decompressed);
      
      self.postMessage({
        success: true,
        result
      });
    }
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message
    });
  }
};
`;

export class WorkerCompressor {
  private worker: Worker | null = null;
  
  constructor() {
    if (typeof Worker !== 'undefined') {
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
    }
  }
  
  async compress(data: any, options: { level?: number } = {}): Promise<{
    compressed: string;
    stats: {
      originalSize: number;
      compressedSize: number;
      ratio: number;
    };
  }> {
    if (!this.worker) {
      throw new Error('Web Workers not supported');
    }
    
    return new Promise((resolve, reject) => {
      this.worker!.onmessage = (e) => {
        if (e.data.success) {
          resolve({
            compressed: e.data.result,
            stats: e.data.stats
          });
        } else {
          reject(new Error(e.data.error));
        }
      };
      
      this.worker!.postMessage({
        action: 'compress',
        data,
        options
      });
    });
  }
  
  async decompress(compressed: string): Promise<any> {
    if (!this.worker) {
      throw new Error('Web Workers not supported');
    }
    
    return new Promise((resolve, reject) => {
      this.worker!.onmessage = (e) => {
        if (e.data.success) {
          resolve(e.data.result);
        } else {
          reject(new Error(e.data.error));
        }
      };
      
      this.worker!.postMessage({
        action: 'decompress',
        data: compressed
      });
    });
  }
  
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// ============================================
// 5. OPTIMIZED API CLIENT FOR 30MB PAYLOADS
// ============================================

import axios, { AxiosProgressEvent } from 'axios';

export interface LargePayloadOptions {
  method?: 'chunk' | 'stream' | 'worker';
  chunkSize?: number;
  compressionLevel?: number;
  onUploadProgress?: (progress: number) => void;
  onCompressionProgress?: (progress: number) => void;
}

export class LargePayloadAPI {
  private chunkedCompressor = new ChunkedCompressor();
  private streamingCompressor = new StreamingCompressor();
  private workerCompressor = new WorkerCompressor();
  
  /**
   * Send large JSON payload with optimal compression
   */
  async sendLargePayload(
    url: string,
    data: any,
    options: LargePayloadOptions = {}
  ): Promise<any> {
    const method = options.method || 'chunk';
    
    // Analyze data to determine best approach
    const analysis = CompressionAnalyzer.analyze(data);
    console.log('Payload Analysis:', analysis);
    
    if (analysis.originalSize > 50 * 1024 * 1024) { // > 50MB
      console.warn('Payload exceeds 50MB. Consider pagination or data reduction.');
    }
    
    switch (method) {
      case 'chunk':
        return this.sendChunked(url, data, options);
      case 'stream':
        return this.sendStreamed(url, data, options);
      case 'worker':
        return this.sendWithWorker(url, data, options);
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }
  
  private async sendChunked(
    url: string,
    data: any,
    options: LargePayloadOptions
  ): Promise<any> {
    // Compress in chunks
    const compressed = await this.chunkedCompressor.compressInChunks(
      data,
      options.onCompressionProgress
    );
    
    console.log(`Compressed to ${compressed.chunks.length} chunks`);
    console.log(`Total size: ${(compressed.totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Compression ratio: ${compressed.compressionRatio.toFixed(2)}%`);
    
    // Send chunks sequentially or in parallel
    const responses = [];
    for (let i = 0; i < compressed.chunks.length; i++) {
      const chunk = compressed.chunks[i];
      
      const response = await axios.post(`${url}/chunk`, {
        chunk: chunk.data,
        metadata: chunk.metadata
      }, {
        headers: {
          'X-Chunk-Index': chunk.metadata.chunkIndex.toString(),
          'X-Total-Chunks': chunk.metadata.totalChunks.toString(),
          'X-Compression': 'gzip-chunked'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (options.onUploadProgress && progressEvent.total) {
            const chunkProgress = progressEvent.loaded / progressEvent.total;
            const totalProgress = (i + chunkProgress) / compressed.chunks.length * 100;
            options.onUploadProgress(totalProgress);
          }
        }
      });
      
      responses.push(response);
    }
    
    // Final request to combine chunks on server
    return axios.post(`${url}/combine`, {
      totalChunks: compressed.chunks.length
    });
  }
  
  private async sendStreamed(
    url: string,
    data: any,
    options: LargePayloadOptions
  ): Promise<any> {
    let blob: Blob;
    
    if (Array.isArray(data)) {
      blob = await this.streamingCompressor.streamCompressArray(data);
    } else {
      // For non-array data, compress as single block
      const jsonString = JSON.stringify(data);
      const compressed = pako.gzip(jsonString, { level: 9 });
      blob = new Blob([compressed], { type: 'application/octet-stream' });
    }
    
    console.log(`Streamed compression size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
    
    const formData = new FormData();
    formData.append('data', blob, 'payload.gz');
    
    return axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Compression': 'gzip-stream'
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (options.onUploadProgress && progressEvent.total) {
          options.onUploadProgress(progressEvent.loaded / progressEvent.total * 100);
        }
      }
    });
  }
  
  private async sendWithWorker(
    url: string,
    data: any,
    options: LargePayloadOptions
  ): Promise<any> {
    // Compress in background thread
    const { compressed, stats } = await this.workerCompressor.compress(data, {
      level: options.compressionLevel || 9
    });
    
    console.log('Worker compression stats:', stats);
    
    return axios.post(url, {
      compressed,
      encoding: 'gzip-base64',
      originalSize: stats.originalSize
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Compression': 'gzip-worker'
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (options.onUploadProgress && progressEvent.total) {
          options.onUploadProgress(progressEvent.loaded / progressEvent.total * 100);
        }
      }
    });
  }
  
  cleanup() {
    this.workerCompressor.terminate();
  }
}

// ============================================
// 6. REACT HOOK FOR 30MB PAYLOADS
// ============================================

import { useState, useCallback, useEffect } from 'react';

export const useLargePayloadUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<any>(null);
  
  const apiClient = new LargePayloadAPI();
  
  const upload = useCallback(async (
    url: string,
    data: any,
    options: LargePayloadOptions = {}
  ) => {
    setUploading(true);
    setError(null);
    setCompressionProgress(0);
    setUploadProgress(0);
    
    try {
      // Analyze payload first
      const analysis = CompressionAnalyzer.analyze(data);
      setStats(analysis);
      
      // Choose method based on size
      let method: 'chunk' | 'stream' | 'worker' = options.method || 'chunk';
      if (analysis.originalSize > 10 * 1024 * 1024) { // > 10MB
        method = 'chunk';
      } else if (analysis.originalSize > 5 * 1024 * 1024) { // > 5MB
        method = 'worker';
      }
      
      const response = await apiClient.sendLargePayload(url, data, {
        ...options,
        method,
        onCompressionProgress: setCompressionProgress,
        onUploadProgress: setUploadProgress
      });
      
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);
  
  useEffect(() => {
    return () => {
      apiClient.cleanup();
    };
  }, []);
  
  return {
    upload,
    uploading,
    compressionProgress,
    uploadProgress,
    error,
    stats
  };
};
