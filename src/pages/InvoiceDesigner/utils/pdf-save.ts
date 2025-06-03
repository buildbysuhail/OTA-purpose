import { pdf } from "@react-pdf/renderer";
import * as pdfjsLib from 'pdfjs-dist'

  export const generatePdfBlob = async (Component: React.ReactElement) => {
      const blob = await pdf(Component).toBlob();
      return blob;
    };

 export const convertPdfBlobToImage = async (pdfBlob: Blob) => {
      try {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdfDocument = await loadingTask.promise;
        const page = await pdfDocument.getPage(1);
        const defaultViewport = page.getViewport({ scale: 1.5 });
        const maxHeight = 400; // Maximum height in pixels
        const scale = maxHeight / defaultViewport.height;
        // Get the viewport with the adjusted scale
        const viewport = page.getViewport({ scale });
        // Create a canvas and set its dimensions
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
  
        if (!context) {
          throw new Error('Failed to get canvas context');
        }
  
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        // Render the PDF page into the canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
  
        await page.render(renderContext).promise;
        const imageDataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(pdfUrl); // Clean up the object URL
        return imageDataUrl;
      }
      catch (error) {
        console.error('Error converting PDF blob to image:', error);
        throw error;
      }
    };   