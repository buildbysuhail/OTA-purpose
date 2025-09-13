// storage-utils.t
import localforage from "localforage";
import LZString from "lz-string";

// Save a string (compress before storage)
export async function setStorageString(key: string, value: string): Promise<void> {
  try {
    const compressed = LZString.compressToUTF16(value);
    await localforage.setItem(key, compressed);
  } catch (error) {
    console.error("setStorageString error:", error);
  }
}

// Get a string (decompress after retrieval)
export async function getStorageString(key: string): Promise<string | null> {
  try {
    const compressed = await localforage.getItem<string>(key);
    if (!compressed) return null;
    return LZString.decompressFromUTF16(compressed) ?? null;
  } catch (error) {
    console.error("getStorageString error:", error);
    return null;
  }
}
