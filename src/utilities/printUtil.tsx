import { pdf } from "@react-pdf/renderer";
import { ClientPrintJob, InstalledPrinter, DefaultPrinter, PrintFilePDF, FileSourceType, JSPrintManager, WSStatus } from "jsprintmanager"; 
import { Dispatch } from "@reduxjs/toolkit";
import { generateBarcodeDataUrl, generateBarcodePages } from "./barcode";
import { DesignerElementType } from "../pages/InvoiceDesigner/Designer/interfaces";
import { BarcodePDFDocument } from "../pages/LabelDesigner/download-preview-barcode";
import { renderSelectedTemplate } from "../pages/accounts/transactions/acc-renderSelected-template";
import ERPAlert from "../components/ERPComponents/erp-sweet-alert";
import { toggleSelectPrinterPopup } from "../redux/slices/popup-reducer";


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


try{
  let pdfDocument;
  let noDefaultPrint: boolean = false;
  let setPrinter:boolean = false;
  const columnsPerRow = Number(template?.barcodeState?.labelState?.columnsPerRow) ?? 1;
  const rowsPerPage = Number(template?.barcodeState?.labelState?.rowsPerPage) ?? 1;
  const PrinterName = DefaultPrinterName || template?.propertiesState?.printer;
    // 1. Build PDF document
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
 // 2. If no printer detected, ask user
   if (!PrinterName || PrinterName.trim() === "") {
      await ERPAlert.show({
        text: t("Oops! No printer detected. Please set a printer before continuing."),
        title: t("select_a_printer"),
        icon: "warning",
        confirmButtonText: t("set_printer"),
        cancelButtonText: t("cancel"),
        onConfirm: () =>{
         dispatch?.(
            toggleSelectPrinterPopup({ isOpen: true, template, data, formState })
          )
          setPrinter = true;
        },
          
        onCancel: () => {
          noDefaultPrint = true;
        },
      });
    }
// 3. Build PDF blob
    const blob = await pdf(pdfDocument).toBlob();
    if (setPrinter) return { success: true, reason: "setPrinter" };
    if (noDefaultPrint) {
      const pdfUrl = URL.createObjectURL(blob);
      const printWindow = window.open(pdfUrl);
      if (!printWindow) {
        console.error("Failed to open print window. Please allow popups.");
        alert("Failed to open print window. Please allow popups and try again.");
        return;
      }
      printWindow.onload = () => printWindow.print();
      return;
    }

// Ensure JSPM agent is running
if (!JSPrintManager.WS || JSPrintManager.websocket_status !== WSStatus.Open) {
  try {
    await JSPrintManager.start(); // try to start/reconnect
  } catch {
    await ERPAlert.show({
      text: t("JSPrintManager is not installed or not running. Please install it before printing."),
      title: t("install_jsprintmanager"),
      icon: "warning",
      confirmButtonText: t("download"),
      cancelButtonText: t("cancel"),
      onConfirm: () => {
        window.open("https://www.neodynamic.com/downloads/jspm", "_blank");
      },
    });
    return { success: false, reason: "jspm-missing" };
  }
}

    // 5. Create & send silent print job
    const cpj = new ClientPrintJob();
    cpj.clientPrinter = PrinterName && PrinterName.trim() !== ""
      ? new InstalledPrinter(PrinterName)
      : new DefaultPrinter();
    cpj.files.push(new PrintFilePDF(blob, FileSourceType.BLOB, "barcode-labels.pdf", 1));
    cpj.onUpdated = (status) => console.log("Print job status update:", status);
    cpj.onFinished = (result) => {
      console.log("Print job finished:", result);
      if (!result.success) console.error("Print job failed:", result.error);
    };

    // Send the print job silently
    await cpj.sendToClient();
    
    return { success: true, reason: "printed" };
  } catch (error) {
    console.error("Error printing:", error);
  }
};


