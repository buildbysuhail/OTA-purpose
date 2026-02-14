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
import { DesignerElementType, PlacedComponent, TemplateState } from "../../pages/InvoiceDesigner/Designer/interfaces";
import { BarcodePDFDocument } from "../../pages/LabelDesigner/download-preview-barcode";
import ERPAlert from "../../components/ERPComponents/erp-sweet-alert";
import { printJobLoaderReducer, toggleSelectPrinterPopup } from "../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import SharedDownloadTemplate from "../../pages/InvoiceDesigner/DownloadPreview/Shared";
import { loadPrintData } from "../../pages/use-print";
import { generateQRCodeDataUrl } from "../../pages/InvoiceDesigner/utils/qrSvgToImg";
import { useNumberToWords } from "../number-to-words";
import { saveAs } from "file-saver";
import { PrintData } from "../../pages/use-print-type";
import { useAppSelector } from "./useAppDispatch";
import { RootState } from "../../redux/store";
interface DirectPrintArgs {

  template?: TemplateState<unknown>;
  data?: any
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
  isDirectDownload?: boolean;
}

export const useDirectPrint = () => {
  const { t } = useTranslation("system");
  const dispatch = useDispatch();
  const adviceTem = ["PARP", "RARP"];
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const printMethodForBrowser = applicationSettings?.printerSettings?.directPrintMethodForBrowser ?? "PrintDialog";
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
  const startPrintJob = () => {
    dispatch(printJobLoaderReducer({ isPrinting: true }));
  }
  const closePrintJob = () => {
    dispatch(printJobLoaderReducer({ isPrinting: false }));
  }
  // Function to fetch template data (extracted from useTemplateDesigner)
  const fetchTemplateData = async (params: DirectPrintArgs) => {
    try {
      debugger;
      let printData: PrintData = params.data;
      if (params.masterIDParam && params.masterIDParam != 0 && !printData) {
        const data = (await loadPrintData(
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
        printData = {
          data: data,
          kind: "voucher"
        }
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
        amountInArabic: convertAmountToArabic,
        amountInEnglish: convertAmountToEnglish
      };
    } catch (error) {
      console.error("Error fetching template data:", error);
      throw error;
    }
  };

  const directPrint = useCallback(async (params: DirectPrintArgs) => {
    try {
      debugger;
      startPrintJob();
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
      }
      //  else if (adviceTem.includes(template?.templateGroup ?? "")) {
      //   // Handle advice templates
      //   // TODO: Implement advice template handling
      //   console.warn("Advice template handling not yet implemented");
      //   return { success: false, reason: "not-implemented" };
      // }
       else if (template?.templateGroup === "Cheque") {
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
            printData={templateData.data}
            qrCodeImages={templateData.qrCodeImages}
            AmountToArabic={templateData.amountInArabic}
            AmountToEnglish={templateData.amountInEnglish}
          />
        );
      }
      const blob = await pdf(pdfDocument).toBlob();

      if (params.isDirectDownload) {

        //  Download the file using FileSaver
        const fileName =
          `${template?.templateGroup || "document"}.pdf`;
        saveAs(blob, fileName);
        return { success: true };
      }
      // 2️⃣ Convert the React PDF document into a Blob
if (printMethodForBrowser === "PrintDialog") {
  return await new Promise((resolve) => {
    const blobURL = URL.createObjectURL(blob);
    const printFrame = document.createElement("iframe");

    Object.assign(printFrame.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "0",
      height: "0",
      border: "none",
    });

    printFrame.src = blobURL;
    document.body.appendChild(printFrame);

    let cleanedUp = false;
    
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      
      setTimeout(() => {
        URL.revokeObjectURL(blobURL);
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 300);
    };

    // ✅ Fallback timeout in case onafterprint doesn't fire
    const fallbackTimeout = setTimeout(() => {
      console.warn("Print dialog timeout - closing loader");
      cleanup();
      resolve({ success: true, reason: "timeout" });
    }, 60000); // 60 seconds fallback

    printFrame.onload = () => {
      const targetWindow = printFrame.contentWindow;

      if (!targetWindow) {
        clearTimeout(fallbackTimeout);
        cleanup();
        closePrintJob(); // ✅ Close on error
        resolve({ success: false, reason: "window_null" });
        return;
      }

      targetWindow.onafterprint = () => {
        clearTimeout(fallbackTimeout);
        cleanup();
        resolve({ success: true, reason: "printed" });
      };

      targetWindow.onbeforeunload = () => {
        clearTimeout(fallbackTimeout);
        cleanup();
        resolve({ success: true, reason: "printed" });
      };

      // ✅ HIDE THE INDICATOR BEFORE SHOWING PRINT DIALOG
      closePrintJob();
      
      // Small delay to ensure the indicator is hidden before print dialog shows
      setTimeout(() => {
        targetWindow.focus();
        targetWindow.print();
      }, 100);
    };
  });
}
      else if (printMethodForBrowser === "JSPrinter") {
        // 2. If no printer detected, ask user
        if (!PrinterName || PrinterName.trim() === "") {
          await ERPAlert.show({
            text: t("Oops! No printer detected. Please set a printer before continuing."),
            title: t("select_a_printer"),
            icon: "warning",
            confirmButtonText: t("set_printer"),
            cancelButtonText: t("cancel"),
            onConfirm: async () => {
              const templateData = await fetchTemplateData(params);
              dispatch?.(
                toggleSelectPrinterPopup({ isOpen: true, template, data })
              );
              setPrinter = true;
            },
            onCancel: () => {
              noDefaultPrint = true;
            },
          });
        }



        if (setPrinter) return { success: true, reason: "setPrinter" };
        if (noDefaultPrint) {
          return await new Promise((resolve) => {
            const blobURL = URL.createObjectURL(blob);
            const printFrame = document.createElement('iframe');

            Object.assign(printFrame.style, {
              position: 'fixed',
              right: '0',
              bottom: '0',
              width: '0',
              height: '0',
              border: 'none'
            });

            printFrame.src = blobURL;
            document.body.appendChild(printFrame);

            printFrame.onload = () => {
              const targetWindow = printFrame.contentWindow;

              if (targetWindow) {
                // We use onafterprint to know when the user closed the dialog
                targetWindow.onafterprint = () => {
                  setTimeout(() => {
                    URL.revokeObjectURL(blobURL);
                    if (document.body.contains(printFrame)) {
                      document.body.removeChild(printFrame);
                    }
                  }, 1000);
                  resolve({ success: true, reason: "printed" });
                };

                targetWindow.focus();
                targetWindow.print();
              } else {
                console.error("Print Failed: Iframe contentWindow is null.");
                URL.revokeObjectURL(blobURL);
                document.body.removeChild(printFrame);
                resolve({ success: false, reason: "window_null" });
              }
            };
          });
        }

        // // 4. Ensure JSPM agent is running
        if (!JSPrintManager.WS || JSPrintManager.websocket_status !== WSStatus.Open) {
          try {
            await JSPrintManager.start();
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

        // // 5. Create & send silent print job
        const cpj = new ClientPrintJob();
        cpj.clientPrinter =
          PrinterName && PrinterName.trim() !== ""
            ? new InstalledPrinter(PrinterName)
            : new DefaultPrinter();
        cpj.files.push(
          new PrintFilePDF(blob, FileSourceType.BLOB, "document.pdf", 1)
        );

        cpj.onUpdated = (status) => console.log("Print job status update:", status);
        cpj.onFinished = (result) => {
          console.log("Print job finished:", result);
          if (!result.success) console.error("Print job failed:", result.error);
        };

        await cpj.sendToClient();

        return { success: true, reason: "printed" };
      }

    } catch (error) {
      console.error("Error printing:", error);
      return { success: false, reason: "error", error };
    } finally {
       if (printMethodForBrowser !== "PrintDialog") {
    closePrintJob();
  }
    }
  }, []);

  return { directPrint };
};