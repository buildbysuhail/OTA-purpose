export const getTailwindColor = (className) => {
  const tempElement = document.createElement('div');
  tempElement.className = className;
  document.body.appendChild(tempElement);
  const computedStyle = window.getComputedStyle(tempElement);
  const backgroundColor = computedStyle.backgroundColor;
  document.body.removeChild(tempElement);
  return backgroundColor;
};