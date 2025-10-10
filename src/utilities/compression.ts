// src/utils/compression.util.ts
import LZString from "lz-string";

const COMPRESSION_PREFIX = {
  GZIP: "GZIP:",
  LZSTRING: "LZ:",
  NONE: "RAW:",
};

/**
 * Compresses a JSON-serializable object to a prefixed Base64 string.
 * Automatically uses native CompressionStream if supported.
 */
export async function compressData(obj: any): Promise<string> {
  const json = JSON.stringify(obj);

  // Try native browser compression first (web/Electron)
  if (typeof CompressionStream !== "undefined") {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(json);

      const cs = new CompressionStream("gzip");
      const writer = cs.writable.getWriter();
      writer.write(data);
      writer.close();

      const compressedArrayBuffer = await new Response(cs.readable).arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(compressedArrayBuffer)));
      
      return `${COMPRESSION_PREFIX.GZIP}${base64}`;
    } catch (error) {
      console.warn("⚠️ Native compression failed, falling back to LZString:", error);
    }
  }

  // Fallback: use LZString compression (Capacitor/older browsers)
  const compressed = LZString.compressToBase64(json);
  return `${COMPRESSION_PREFIX.LZSTRING}${compressed}`;
}

/**
 * Decompresses a Base64 string back to its original JSON object.
 * Automatically detects which compression method was used via prefix.
 * Handles legacy uncompressed data.
 */
export async function decompressData(data: string): Promise<any> {
  if (!data) return null;

  // Check for compression prefix
  if (data.startsWith(COMPRESSION_PREFIX.GZIP)) {
    // Native gzip decompression
    const base64 = data.substring(COMPRESSION_PREFIX.GZIP.length);
    
    if (typeof DecompressionStream !== "undefined") {
      try {
        const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        const ds = new DecompressionStream("gzip");
        const writer = ds.writable.getWriter();
        writer.write(binary);
        writer.close();

        const text = await new Response(ds.readable).text();
        return JSON.parse(text);
      } catch (error) {
        console.error("❌ Failed to decompress GZIP data:", error);
        return null;
      }
    }
  }

  if (data.startsWith(COMPRESSION_PREFIX.LZSTRING)) {
    // LZString decompression
    const base64 = data.substring(COMPRESSION_PREFIX.LZSTRING.length);
    const decompressed = LZString.decompressFromBase64(base64);
    
    if (!decompressed) {
      console.error("❌ Failed to decompress LZString data");
      return null;
    }
    return JSON.parse(decompressed);
  }

  if (data.startsWith(COMPRESSION_PREFIX.NONE)) {
    // Explicitly marked as uncompressed
    const json = data.substring(COMPRESSION_PREFIX.NONE.length);
    return JSON.parse(json);
  }

  // Legacy support: try to parse as raw JSON (old templates)
  try {
    return JSON.parse(data);
  } catch {
    // If raw JSON fails, try LZString (might be old compressed data)
    try {
      const decompressed = LZString.decompressFromBase64(data);
      if (decompressed) {
        return JSON.parse(decompressed);
      }
    } catch (error) {
      console.error("❌ Failed to decompress legacy data:", error);
    }
  }

//   console.error("❌ Data format not recognized and all decompression attempts failed");
  return null;
}