import { useEffect, useState } from "react";
import { JSPrintManager, WSStatus ,PrintersInfoLevel,PrinterIcon } from 'jsprintmanager';
import { Box } from "@mui/material";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { PropertiesState } from "../Designer/interfaces";
interface PrinterInfo {
  name: string;
  id:any;
  isConnected: boolean;
  isNetwork: boolean;
}
interface usePrinterProps{
  templateData:any;
  t:any;
   handlePagePropsChange: (property: keyof PropertiesState, value: any) => void;
}

export const AccessPrinterList = ({templateData,t,handlePagePropsChange}: usePrinterProps) => {
  const [printers, setPrinters] = useState<PrinterInfo[]>([]);
  const [jspmStatus, setJspmStatus] = useState<WSStatus | null>(null);
  useEffect(() => {
    // 1. Initialize JSPrintManager (as previously discussed)
    JSPrintManager.auto_reconnect = true;
    JSPrintManager.start();

    if (JSPrintManager.WS) { // Check if WS is defined
      JSPrintManager.WS.onStatusChanged = () => {
        setJspmStatus(JSPrintManager.websocket_status);
        if (JSPrintManager.websocket_status === WSStatus.Open) {
          // 2. Get printers once connected
          getPrinters();
        }
      };
    } else {
      console.warn("JSPrintManager.WS is undefined. Ensure the client app is running and initialized."); // Log a warning if WS is undefined
    }

    // Cleanup function
    return () => {
      JSPrintManager.stop();
    };
  }, []);


const getPrinters = async () => {
  try {
    const printersList = (await JSPrintManager.getPrintersInfo(
      PrintersInfoLevel.Extended,
      "",
      PrinterIcon.None
    )) as any[];

    setPrinters(
      printersList.map((printer: any) => ({
        name: printer.Name || printer.name || "Unnamed Printer",
        id: printer.Name || printer.name || "unknown",
        status: printer.Status || "Unknown",
        isNetwork: false,
        isConnected: true,
      }))
    );
  } catch (error) {
    console.error("Error fetching printers:", error);
  }
};


  // return { printers, jspmStatus };
  return(
    <>
                    <Box sx={{ mb: 1 }}>
                      <ERPDataCombobox
                        id="printer"
                        data={templateData?.propertiesState}
                        label={t("Printer")}
                        field={{
                          id: "printer",
                          valueKey: "value",
                          labelKey: "value",
                        }}
                        options={printers.map((p) => ({ value: p.name }))}
                        onChange={(e) => handlePagePropsChange("printer", e.value)}
                      />
                    </Box>
                </>
  )
};

