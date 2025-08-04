import JsBarcode from 'jsbarcode';

export interface BarcodeProps {
  format: string;
  field: string;
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
 * @param widthPt - Display width in points
 * @param heightPt - Display height in points
 * @param forPDF - Whether rendering for PDF (to avoid drawing error messages)
 */
const ptToPx = (pt: number) => pt * (96 / 72);
export function renderBarcode(
  canvas: HTMLCanvasElement,
  text: string,
  props: BarcodeProps,
  widthPt: number,
  heightPt: number,
  forPDF: boolean = false
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context from canvas');
  }


  // Convert points to pixels for canvas rendering
  const scale = window.devicePixelRatio || 1;
  const widthPx  = ptToPx(widthPt);
  const heightPx = ptToPx(heightPt);

  // Set canvas dimensions in pixels for high-DPI rendering
  canvas.width = widthPx * scale;
  canvas.height = heightPx * scale;
  // Set CSS dimensions in points for consistent display
  canvas.style.width = `${widthPt}px`;
  canvas.style.height = `${heightPt}px`;
  // Scale the context for high-DPI displays
  ctx.scale(scale, scale);

  try {
    JsBarcode(canvas, text, {
      ...props,
      width: props.barWidth ?? 1,
      height: heightPx, // Use height in points
      margin: props.margin,
      // marginBottom: 0,
      textMargin: props.textMargin ?? 1,
      displayValue: props.showText,
      fontSize: props.fontSize,
      font: props.font || 'Roboto',
      textAlign: props.textAlign ?? 'center',
      textPosition: 'bottom',
      background: props.background ?? '#ffffff',
      lineColor: props.lineColor ?? '#000000',
      valid: (valid: boolean) => {
        if (!valid) {
          throw new Error(`Invalid barcode for text: ${text}`);
        }
      },
    });
  } catch (error) {
    console.error('Error generating barcode:', error);
    if (!forPDF) {
      // Draw error message only for designer canvas, not PDF
      ctx.fillStyle = '#ff0000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Barcode Error', widthPx / 2, heightPx / 2);
    }
    throw error; // Re-throw to allow caller to handle
  }
}

/**
 * Generates a data URL for a barcode.
 * @param text - The string content for the barcode
 * @param props - Barcode rendering options
 * @param widthPt - Display width in points
 * @param heightPt - Display height in points
 * @returns Data URL for the barcode image
 */
export function generateBarcodeDataUrl(
  text: string,
  props: BarcodeProps,
  widthPt: number,
  heightPt: number
): string {
  const canvas = document.createElement('canvas');
  renderBarcode(canvas, text, props, widthPt, heightPt, true); // Pass true for PDF rendering
  return canvas.toDataURL('image/png', 1.0);
}

// utils/barcodePaging.ts
export function generateBarcodePages<T>(
  items: T[],
  columnsPerRow: number,
  rowsPerPage: number
): T[][][] {
  // 1) Expand each item by its labelCount
   if (!items.length) {
    return [];
  }
  const expanded: (T & { uniqueId: string })[] = [];
  items.forEach((item: any) => {
    const count = item.labelCount ?? 1;
    for (let i = 0; i < count; i++) {
      expanded.push({ ...item, uniqueId: `${item.siNo}-${i}` });
    }
  });

  // 2) Slice into rows of `columnsPerRow`
  const chunked: (T & { uniqueId: string })[][] = [];
  for (let i = 0; i < expanded.length; i += columnsPerRow) {
    chunked.push(expanded.slice(i, i + columnsPerRow));
  }

  // 3) Group rows into pages of `rowsPerPage` rows
  const pages: (T & { uniqueId: string })[][][] = [];
  for (let i = 0; i < chunked.length; i += rowsPerPage) {
    pages.push(chunked.slice(i, i + rowsPerPage));
  }

  return pages;
}
