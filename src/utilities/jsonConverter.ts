export function customJsonParse<T>(jsonString: string): T {
  try {
    const utf8Decoder = new TextDecoder("utf-8");
    return JSON.parse(
      utf8Decoder.decode(
        new Uint8Array([...jsonString].map((char) => char.charCodeAt(0)))
      ),
      (key, value) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          const newObj: { [key: string]: any } = {};
          for (const k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              newObj[toCamelCase(k)] = value[k];
            }
          }
          return newObj;
        }
        return value;
      }
    );
  } catch (error) {
    return {} as T;
  }
}
export function modelToBase64<T>(model: T): string {
  try {
    // Convert the model to a JSON string
    const jsonString = JSON.stringify(model);

    // Encode the JSON string to base64
    const base64String = btoa(jsonString);

    return modelToBase64Unicode(model);
  } catch (error) {
    console.log(error);
    
    console.error("Error converting model to base64:", error);
    throw new Error("Failed to convert model to base64");
  }
}
function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, "");
}

export function modelToBase64Unicode(model: any): string {
  try {
    const jsonString = JSON.stringify(model);
    const encoded = new TextEncoder().encode(jsonString);
    const base64 = btoa(String.fromCharCode(...encoded));
    return base64;
  } catch (error) {
    console.error("Error converting model to base64:", error);
    throw error;
  }
}
export function base64ToModelUnicode(base64String: string): string {
  try {
    const binaryString = atob(base64String); // Decode Base64 to binary string
    const bytes = new Uint8Array(
      binaryString.split("").map((char) => char.charCodeAt(0))
    );
    const decodedString = new TextDecoder().decode(bytes); // Convert UTF-8 bytes to string
    const jsonObject = JSON.parse(decodedString);
    return jsonObject;
  } catch (error) {
    console.error("Error decoding base64:", error);
    throw error;
  }
}
export const base64UnicodeToModel = (base64: string): any | undefined => {
  try {
    const decodedString = atob(base64);
    return customJsonParse(decodedString)
  } catch (error) {
    console.error("Error converting base64 to model:", error);
    return undefined;
  }
};
