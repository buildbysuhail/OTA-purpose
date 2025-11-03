import { pdf } from "@react-pdf/renderer";
import {
  ClientPrintJob,
  InstalledPrinter,
  DefaultPrinter,
  PrintFilePDF,
  FileSourceType,
  JSPrintManager,
  WSStatus,
} from "jsprintmanager";
import { useDispatch } from "react-redux";
import { generateBarcodeDataUrl, generateBarcodePages } from "../barcode";
import { DesignerElementType, PlacedComponent } from "../../pages/InvoiceDesigner/Designer/interfaces";
import { BarcodePDFDocument } from "../../pages/LabelDesigner/download-preview-barcode";
import ERPAlert from "../../components/ERPComponents/erp-sweet-alert";
import { toggleSelectPrinterPopup } from "../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import SharedDownloadTemplate from "../../pages/InvoiceDesigner/DownloadPreview/Shared";
import { loadPrintData } from "../../pages/use-print";
import { generateQRCodeDataUrl } from "../../pages/InvoiceDesigner/utils/qrSvgToImg";
import { useNumberToWords } from "../number-to-words";
import { saveAs } from "file-saver";
interface DirectPrintArgs {
  template?: any;
  data?: any;
  page?: any;
  DefaultPrinterName?: string;
  masterIDParam?: number;
  voucherTypeParam?: string;
  isInvTrans?: boolean;
  isSalesView?: boolean;
  isServiceTrans?: boolean;
  transDate?: string;
  printCopies?: number;
  isReprint?: boolean;
  isPOSPrinting?: boolean;
  isFromSalesReceipt?: boolean;
  isPackingSlipPrint?: boolean;
  warehouseID?: number;
  kitchenIDParam?: number;
  kitchenPrinterNameParam?: string;
  kitchenNameParam?: string;
  commonKitchenProductGroupIDParam?: number;
  transactionType?: string;
  dbIdValue?: string;
  voucherType?: string;
  isAppGlobal?: boolean;
}

export const useDirectPrint = () => {
  const { t } = useTranslation("system");
  const dispatch = useDispatch();
  const adviceTem = ["PARP", "RARP"];
  const { convertAmountToEnglish, convertAmountToArabic } = useNumberToWords();
  const generateBarcodeImagesForPrint = async (pages: any[], template: any) => {
    const images: { [key: string]: string } = {};
    if (template?.barcodeState?.placedComponents && pages) {
      pages.forEach((page: any) => {
        page.forEach((row: any) => {
          row.forEach((item: any) => {
            template.barcodeState?.placedComponents?.forEach((comp: any) => {
              if (comp.type === DesignerElementType.barcode && comp.barcodeProps) {
                const key = `${item.siNo}-${comp.id}`;
                if (!images[key]) {
                  images[key] = generateBarcodeDataUrl(
                    item.autoBarcode || "",
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

  // Function to fetch template data (extracted from useTemplateDesigner)
  const fetchTemplateData = async (params: DirectPrintArgs) => {
    try {
      let printData = params.data;
      if (params.masterIDParam && params.masterIDParam !=0){
        printData = (await loadPrintData(
          params.masterIDParam ?? 0,
          params.voucherTypeParam ?? "",
          params.isInvTrans,
          params.isSalesView,
          params.isServiceTrans,
          params.transDate,
          params.printCopies,
          params.isReprint,
          params.isPOSPrinting,
          params.isFromSalesReceipt,
          params.isPackingSlipPrint,
          params.warehouseID,
          params.kitchenIDParam,
          params.kitchenPrinterNameParam,
          params.kitchenNameParam,
          params.commonKitchenProductGroupIDParam,
          params.transactionType,
          params.dbIdValue,
          params.voucherType,
          params.isAppGlobal
        )) as any;
      }
      // Generate QR codes
      const elements: PlacedComponent[] = [
        ...(params.template?.headerState?.customElements?.elements ?? []),
        ...(params.template?.footerState?.customElements?.elements ?? []),
      ].filter(comp => comp.type === DesignerElementType.qrCode);

      const qrImages: { [key: string]: string } = {};
      for (const comp of elements) {
        if (comp.qrCodeProps) {
          qrImages[comp.id] = await generateQRCodeDataUrl(comp.qrCodeProps);
        }
      }

      return {
        template: params.template,
        data: printData,
        qrCodeImages: qrImages,
        amountInArabic:convertAmountToArabic,
        amountInEnglish:convertAmountToEnglish
      };
    } catch (error) {
      console.error("Error fetching template data:", error);
      throw error;
    }
  };

  const directPrint = useCallback(async (params: DirectPrintArgs) => {
    try {
      let pdfDocument;
      let noDefaultPrint: boolean = false;
      let setPrinter: boolean = false;

      const {
        template,
        data,
        page,
        DefaultPrinterName,
      } = params;

      const columnsPerRow =
        Number(template?.barcodeState?.labelState?.columnsPerRow) ?? 1;
      const rowsPerPage =
        Number(template?.barcodeState?.labelState?.rowsPerPage) ?? 1;
      const PrinterName =
        DefaultPrinterName || template?.propertiesState?.printer;

      // 1. Build PDF document
      if (template?.templateGroup === "barcode") {
        const TotalPage =
          page ?? generateBarcodePages(data ?? [], columnsPerRow, rowsPerPage);
        const barcodeImagesForPrint = await generateBarcodeImagesForPrint(
          TotalPage,
          template
        );

        pdfDocument = (
          <BarcodePDFDocument
            template={template}
            data={TotalPage}
            barcodeImages={barcodeImagesForPrint}
          />
        );
      } else if (adviceTem.includes(template?.templateGroup)) {
        // Handle advice templates
        // TODO: Implement advice template handling
        console.warn("Advice template handling not yet implemented");
        return { success: false, reason: "not-implemented" };
      } else if (template?.templateGroup === "Cheque") {
        // Handle cheque templates
        // TODO: Implement cheque template handling
        console.warn("Cheque template handling not yet implemented");
        return { success: false, reason: "not-implemented" };
      } else {
        
        // For standard templates, fetch the data
        console.log("Fetching template data for printing...");
        const templateData = await fetchTemplateData(params);

        pdfDocument = (
          <SharedDownloadTemplate
            template={templateData.template}
            data={templateData.data}
            qrCodeImages={templateData.qrCodeImages}
            AmountToArabic={templateData.amountInArabic}
            AmountToEnglish={templateData.amountInEnglish}
          />
        );
      }
        
        // 2️⃣ Convert the React PDF document into a Blob
      const blob = await pdf(pdfDocument).toBlob();

      // 3️⃣ Download the file using FileSaver
      const fileName =
        template?.propertiesState?.fileName ||
        `${template?.templateGroup || "document"}.pdf`;
      saveAs(blob, fileName);
      return { success: true };

        // const pdfUrl = URL.createObjectURL(blob);
        // const printWindow = window.open(pdfUrl);
        // if (!printWindow) {
        //   console.error("Failed to open print window. Please allow popups.");
        //   alert("Failed to open print window. Please allow popups and try again.");
        //   return { success: false, reason: "popup-blocked" };
        // }
        // printWindow.onload = () => printWindow.print();
        // return { success: true, reason: "browser-print" };
      

      // 2. If no printer detected, ask user
      // if (!PrinterName || PrinterName.trim() === "") {
      //   await ERPAlert.show({
      //     text: t("Oops! No printer detected. Please set a printer before continuing."),
      //     title: t("select_a_printer"),
      //     icon: "warning",
      //     confirmButtonText: t("set_printer"),
      //     cancelButtonText: t("cancel"),
      //     onConfirm: async() => {
      //       const templateData = await fetchTemplateData(params);
      //       dispatch?.(
      //         toggleSelectPrinterPopup({ isOpen: true, template, data })
      //       );
      //       setPrinter = true;
      //     },
      //     onCancel: () => {
      //       noDefaultPrint = true;
      //     },
      //   });
      // }

      // // 3. Build PDF blob
      // const blob = await pdf(pdfDocument).toBlob();

      // if (setPrinter) return { success: true, reason: "setPrinter" };
      // if (noDefaultPrint) {
      //   const pdfUrl = URL.createObjectURL(blob);
      //   const printWindow = window.open(pdfUrl);
      //   if (!printWindow) {
      //     console.error("Failed to open print window. Please allow popups.");
      //     alert("Failed to open print window. Please allow popups and try again.");
      //     return { success: false, reason: "popup-blocked" };
      //   }
      //   printWindow.onload = () => printWindow.print();
      //   return { success: true, reason: "browser-print" };
      // }

      // // 4. Ensure JSPM agent is running
      // if (!JSPrintManager.WS || JSPrintManager.websocket_status !== WSStatus.Open) {
      //   try {
      //     await JSPrintManager.start();
      //   } catch {
      //     await ERPAlert.show({
      //       text: t("JSPrintManager is not installed or not running. Please install it before printing."),
      //       title: t("install_jsprintmanager"),
      //       icon: "warning",
      //       confirmButtonText: t("download"),
      //       cancelButtonText: t("cancel"),
      //       onConfirm: () => {
      //         window.open("https://www.neodynamic.com/downloads/jspm", "_blank");
      //       },
      //     });
      //     return { success: false, reason: "jspm-missing" };
      //   }
      // }

      // // 5. Create & send silent print job
      // const cpj = new ClientPrintJob();
      // cpj.clientPrinter =
      //   PrinterName && PrinterName.trim() !== ""
      //     ? new InstalledPrinter(PrinterName)
      //     : new DefaultPrinter();
      // cpj.files.push(
      //   new PrintFilePDF(blob, FileSourceType.BLOB, "document.pdf", 1)
      // );

      // cpj.onUpdated = (status) => console.log("Print job status update:", status);
      // cpj.onFinished = (result) => {
      //   console.log("Print job finished:", result);
      //   if (!result.success) console.error("Print job failed:", result.error);
      // };

      // await cpj.sendToClient();

      // return { success: true, reason: "printed" };
    } catch (error) {
      console.error("Error printing:", error);
      return { success: false, reason: "error", error };
    }
  }, []);

  return { directPrint };
};