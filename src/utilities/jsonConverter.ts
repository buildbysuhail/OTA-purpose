export function customJsonParse<T>(jsonString: string): T {
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
}
function toCamelCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
  ).replace(/\s+/g, '');
}