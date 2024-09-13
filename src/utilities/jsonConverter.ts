export function customJsonParse<T>(jsonString: string): T {
    try {
        return JSON.parse(jsonString, (key, value) => {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const newObj: { [key: string]: any } = {};
                for (const k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        newObj[toCamelCase(k)] = value[k];
                    }
                }
                return newObj;
            }
            return value;
        });
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
      
      return base64String;
    } catch (error) {
      console.error('Error converting model to base64:', error);
      throw new Error('Failed to convert model to base64');
    }
  }
function toCamelCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
  ).replace(/\s+/g, '');
}