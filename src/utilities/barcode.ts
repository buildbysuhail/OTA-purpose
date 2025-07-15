/* utils/barcode.ts */
import JsBarcode from 'jsbarcode';

export interface BarcodeProps {
 format: string;
    field:string;
    barWidth: number;
    height: number;
    margin: number;
    background: string;
    lineColor: string;
    showText: boolean;
    textAlign: "left" | "center" | "right";
    font: string;
    fontSize: number;
    textMargin: number;
    fontStyle: "normal" | "bold" | "italic";
}

/**
 * Renders a barcode on a given canvas element.
 * @param canvas - HTMLCanvasElement to draw on
 * @param text - The string content for the barcode
 * @param props - Barcode rendering options
 * @param widthPx - Display width in CSS pixels
 * @param heightPx - Display height in CSS pixels
 */
export function renderBarcode(
  canvas: HTMLCanvasElement,
  text: string,
  props: BarcodeProps,
  widthPx: number,
  heightPx: number
): void {
  const ctx = canvas.getContext('2d');
    if (!ctx) {
    console.error('Could not get 2D context from canvas');
    return;
  }
  const scale = window.devicePixelRatio || 1;
  // set true pixel size
//   canvas.width = widthPx * scale;
  canvas.height = heightPx * scale;
  // scale back to CSS pixels
//   canvas.style.width = `${widthPx}px`;
  canvas.style.height = `${heightPx}px`;
//  Scale the context for high DPI displays
  ctx.scale(scale, scale);
try{
JsBarcode(canvas, text, {
    ...props,
    width: props.barWidth ?? 2,
    height: heightPx ,
    margin: props.margin,
    marginBottom:0,
    textMargin: props.textMargin ?? 2,
    displayValue: props.showText,
    fontSize: props.fontSize,
    font: props.font || 'Roboto',
    textAlign: props.textAlign ?? 'center',
    textPosition: 'bottom',
    background: props.background ?? '#ffffff',
    lineColor: props.lineColor ?? '#000000',
    valid: (valid: boolean) => {
      if (!valid) {
        console.warn(`Invalid barcode for text: ${text}`);
      }
    },

  });
}catch (error) {
    console.error('Error generating barcode:', error);
    // Draw error message on canvas
    ctx.fillStyle = '#ff0000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Barcode Error', widthPx / 2, heightPx / 2);
  }
  
}


export function generateBarcodeDataUrl(
  text: string,
  props: BarcodeProps,
  widthPx: number,
  heightPx: number
): string {
  const canvas = document.createElement('canvas');
  renderBarcode(canvas, text, props, widthPx, heightPx);
  return canvas.toDataURL('image/png', 2.0);;
}

