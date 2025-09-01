import { pdf } from "@react-pdf/renderer";
import { ClientPrintJob, InstalledPrinter, DefaultPrinter, PrintFilePDF, FileSourceType, JSPrintManager, WSStatus } from "jsprintmanager"; 
import { Dispatch } from "@reduxjs/toolkit";
import { generateBarcodeDataUrl, generateBarcodePages } from "./barcode";
import { DesignerElementType } from "../pages/InvoiceDesigner/Designer/interfaces";
import { BarcodePDFDocument } from "../pages/LabelDesigner/download-preview-barcode";
import { renderSelectedTemplate } from "../pages/accounts/transactions/acc-renderSelected-template";
import ERPAlert from "../components/ERPComponents/erp-sweet-alert";
import { toggleSelectPrinterPopup } from "../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./hooks/useAppDispatch";
import { RootState } from "../redux/store";
import useCurrentBranch from "./hooks/use-current-branch";
import { useTranslation } from "react-i18next";

// 🔹 Define function props for better typing
interface HandleDirectPrintProps {
  template: any;
  data?: any;
  page?: any;
  DefaultPrinterName?: string;
  formState?: any;
  t: (key: string) => string;
  dispatch?: Dispatch;
  userSession?: any;
  currentBranch?: any;
}

export const handleDirectPrint = async ({
  template,
  data,
  page,
  DefaultPrinterName,
  formState,
   t,           
  dispatch,    
  userSession, 
  currentBranch, 
}: HandleDirectPrintProps) => {

  let pdfDocument;
  let noDefaultPrint: boolean = false;
  const columnsPerRow = Number(template?.barcodeState?.labelState?.columnsPerRow) ?? 1;
  const rowsPerPage = Number(template?.barcodeState?.labelState?.rowsPerPage) ?? 1;
  const PrinterName = DefaultPrinterName || template?.propertiesState?.printer;
  console.log("PrinterName is:", PrinterName);
  console.log("Condition:", !PrinterName || PrinterName?.trim() === "");


  const generateBarcodeImagesForPrint = async (pages: any[], template: any) => {
      const images: { [key: string]: string } = {};
      if (template?.barcodeState?.placedComponents && pages) {
    // Iterate over the pages structure instead of data
    pages.forEach((page: any) => {
      page.forEach((row: any) => {
        row.forEach((item: any) => {
          template.barcodeState?.placedComponents?.forEach((comp: any) => {
            if (comp.type === DesignerElementType.barcode && comp.barcodeProps) {
              const key = `${item.siNo}-${comp.id}`;
              if (!images[key]) {
                images[key] = generateBarcodeDataUrl(
                  item.autoBarcode || '',
                  comp.barcodeProps,
                  comp.width,
                  comp.height
                );
              }
            }
          });
        });
      });
    });
  }
     return images;
  };

  if (template?.templateGroup === "barcode") {
    const TotalPage = page ?? generateBarcodePages(data ?? [], columnsPerRow, rowsPerPage);
    const barcodeImagesForPrint = await generateBarcodeImagesForPrint(TotalPage, template);

    pdfDocument = (
   <BarcodePDFDocument template={template} data={TotalPage} barcodeImages={barcodeImagesForPrint} />
    );
  } else {
    pdfDocument = renderSelectedTemplate({
      template,
      data: formState?.transaction,
      currentBranch,
      userSession,
    });
  }

  try {
    // 1. Create a PDF blob
    const blob = await pdf(pdfDocument).toBlob();

    // 2. Handle no printer case
    if (!PrinterName ) {
      await ERPAlert.show({
        text: t("Oops! No printer detected. Please set a printer before continuing."),
        title: t("select_a_printer"),
        icon: "warning",
        confirmButtonText: t("set_printer"),
        cancelButtonText: t("cancel"),
        onConfirm: () => dispatch?.(toggleSelectPrinterPopup({ isOpen: true, template ,data,formState})),
        onCancel: () => {
          noDefaultPrint = true;
        },
      });
    }else{
        // 3. If printer name exists, print silently via JSPM
       if (JSPrintManager.websocket_status !== WSStatus.Open) {
        JSPrintManager.auto_reconnect = true;
        JSPrintManager.start();
      }

      const cpj = new ClientPrintJob();

      if (PrinterName && PrinterName.trim() !== "") {
        cpj.clientPrinter = new InstalledPrinter(PrinterName);
      } else {
        cpj.clientPrinter = new DefaultPrinter();
      }

      cpj.files.push(
        new PrintFilePDF(
          blob,
          FileSourceType.BLOB,
          "barcode-labels.pdf",
          1
        )
      );

      cpj.onUpdated = (status) => {
        console.log("Print job status update:", status);
      };
      cpj.onFinished = (result) => {
        console.log("Print job finished:", result);
        if (!result.success) {
          console.error("Print job failed:", result.error);
        }
      };

      await cpj.sendToClient();
    }

    if (noDefaultPrint) {
      // Fallback: open in browser print dialog
      const pdfUrl = URL.createObjectURL(blob);
      const printWindow = window.open(pdfUrl);

      if (!printWindow) {
        console.error("Failed to open print window. Please check your browser settings.");
        alert("Failed to open print window. Please allow popups and try again.");
        return;
      }

      printWindow.onload = () => {
        printWindow.print();
      };
      return;
    }

  

  } catch (error) {
    console.error("Error printing voucher:", error);
  }
};


