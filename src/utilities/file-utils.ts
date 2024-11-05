export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        resolve(base64String);
      } else {
        reject("File conversion failed");
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};