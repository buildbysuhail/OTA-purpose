// src/utils/compression.util.ts
import LZString from "lz-string";

/**
 * Compresses a JSON-serializable object to a Base64 string.
 * Automatically uses native CompressionStream if supported.
 */
export async function compressData(obj: any): Promise<string> {
  const json = JSON.stringify(obj);

  //  Try native browser compression first
  if (typeof CompressionStream !== "undefined") {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(json);

      const cs = new CompressionStream("gzip");
      const writer = cs.writable.getWriter();
      writer.write(data);
      writer.close();

      const compressedArrayBuffer = await new Response(cs.readable).arrayBuffer();
      return btoa(String.fromCharCode(...new Uint8Array(compressedArrayBuffer)));
    } catch (error) {
      console.warn("⚠️ Native compression failed, falling back to LZString:", error);
    }
  }

  // Fallback: use LZString compression
  return LZString.compressToBase64(json);
}

/**
 * Decompresses a Base64 string back to its original JSON object.
 * Automatically detects which compression method was used.
 */
export async function decompressData(base64: string): Promise<any> {
  if (!base64) return null;

  //  Try native decompression first
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
      console.warn("⚠️ Native decompression failed, using LZString:", error);
    }
  }

  //  Fallback: LZString decompression
  const decompressed = LZString.decompressFromBase64(base64);
  if (!decompressed) {
    console.error("❌ Failed to decompress data — data may be corrupted");
    return null;
  }
  return JSON.parse(decompressed);
}

