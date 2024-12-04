export {}; // Makes this file a module, enabling global augmentations

declare global {
  interface Date {
    toDatePartString(): string; // Declare the method on the Date interface
  }
}

Date.prototype.toDatePartString = function (): string {
  const year = this.getFullYear();
  const month = String(this.getMonth() + 1).padStart(2, "0");
  const day = String(this.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // Example: "2024-12-04"
};