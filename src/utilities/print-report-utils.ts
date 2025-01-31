// utils/printUtils.ts
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import ERPAlert from '../components/ERPComponents/erp-sweet-alert';
 // Adjust the import path as needed

 interface PrintPdfOptions<T> {
    PDFComponent: React.ComponentType<T>; // Generic PDF component
    documentProps: T; // Props for the PDF component
  }
  
  export const printPdf = async <T extends {}>(options: PrintPdfOptions<T>) => {
    const { PDFComponent, documentProps } = options;
  
    try {
      // Create the PDF document using the provided component and props
      const pdfDocument = React.createElement(
        PDFComponent as React.ComponentType<T>, // Type assertion to ensure compatibility
        documentProps
      );
      const blob = await pdf(pdfDocument).toBlob();
      const pdfUrl = URL.createObjectURL(blob);
  
      // Open the PDF in a new tab for printing
      const printWindow = window.open(pdfUrl);
      if (!printWindow) {
        console.error("Failed to open print window. Please check your browser settings.");
        ERPAlert.show({
          title: "Error",
          text: "Failed to print",
          icon: "error",
        });
        return;
      }
  
      // Wait for the PDF to load in the new tab
      printWindow.onload = () => {
        printWindow.print(); // Trigger print
      };
    } catch (error) {
      console.error("Error printing PDF:", error);
      ERPAlert.show({
        title: "Warning",
        text: "An error occurred while printing. Please try again.",
        icon: "warning",
      });
    }
  };