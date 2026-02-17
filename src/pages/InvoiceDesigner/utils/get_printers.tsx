"use client"

import { useCallback, useEffect, useState } from "react"
import { JSPrintManager, WSStatus, PrintersInfoLevel, PrinterIcon } from "jsprintmanager"
import { Box, Button, Typography, Alert, CircularProgress, Card, CardContent, Chip, Stack, Link } from "@mui/material"
import {
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Printer as PrinterIconMUI,
  Info as InfoIcon,
} from "lucide-react";

import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import type { PropertiesState, TemplateState } from "../Designer/interfaces"
import ERPToast from "../../../components/ERPComponents/erp-toast"
import ERPFormButtons from "../../../components/ERPComponents/erp-form-buttons";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { toggleSelectPrinterPopup } from "../../../redux/slices/popup-reducer";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import { RootState } from "../../../redux/store";
import { useTranslation } from "react-i18next";
import { useDirectPrint } from "../../../utilities/hooks/use-direct-print";

interface PrinterInfo {
  name: string
  id: any
  isConnected: boolean
  isNetwork: boolean
  status?: string
}

interface usePrinterProps {
  templateData: any
  data?:any
  handlePagePropsChange?: (property: keyof PropertiesState, value: any) => void
  restInRoot?:boolean
  formState?:any
}

export enum InstallationStatus {
  CHECKING = "checking",
  NOT_INSTALLED = "not_installed",
  INSTALLING = "installing",
  INSTALLED = "installed",
  ERROR = "error",
  READY = "ready",
  LOADING = "loading",
}

export const AccessPrinterList = ({ templateData, handlePagePropsChange,restInRoot,data,formState}: usePrinterProps) => {
  const { t } = useTranslation("labelDesigner");
  const [printers, setPrinters] = useState<PrinterInfo[]>([])
  const { directPrint } = useDirectPrint();
  const [onChangePrinter, setOnChangePrinter] = useState<string>("");
  const [jspmStatus, setJspmStatus] = useState<WSStatus | null>(null)
  const [installationStatus, setInstallationStatus] = useState<InstallationStatus>(InstallationStatus.CHECKING)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isElectron, setIsElectron] = useState(false)
  const dispatch = useAppDispatch();
  const currentBranch = useCurrentBranch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);

const handlePrinterSet = (  value: any) => {
  setOnChangePrinter(value);
};

const handleSubmit = async() => {
   if (!onChangePrinter) return;
   
   // If Electron, use native print
   if (isElectron && (window as any).electron) {
     try {
       console.log(`Printing to printer: ${onChangePrinter}`);
       await (window as any).electron.print({
         template: templateData,
         data,
         printerName: onChangePrinter,
       });
       console.log('Print successful');
       onClose();
     } catch (err) {
       const errorMsg = err instanceof Error ? err.message : String(err);
       console.error('Print error:', errorMsg);
       setError(`Failed to print: ${errorMsg}`);
     }
   } else {
     // Use traditional method
     try {
       await directPrint({
         template: templateData,
         data,
         DefaultPrinterName: onChangePrinter,
       });
       onClose();
     } catch (err) {
       const errorMsg = err instanceof Error ? err.message : String(err);
       console.error('Print error:', errorMsg);
       setError(`Failed to print: ${errorMsg}`);
     }
   }
}

const onClose = () => {
  dispatch(toggleSelectPrinterPopup({ isOpen: false }));
}

// Helper to wait
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ============ ELECTRON PATH ============
const checkElectronAndFetchPrinters = useCallback(async () => {
  setInstallationStatus(InstallationStatus.CHECKING)
  setError(null)

  try {
    if ((window as any).electron && typeof (window as any).electron.getPrinters === 'function') {
      setIsElectron(true);
      await new Promise(r => setTimeout(r, 500));
      fetchElectronPrinters();
    } else {
      setIsElectron(false);
      checkJSPrintManagerInstallation();
    }
  } catch (error) {
    console.error("Error checking Electron:", error)
    setInstallationStatus(InstallationStatus.ERROR)
    setError("Failed to initialize printer system")
  }
}, []);

const fetchElectronPrinters = useCallback(async () => {
  setIsLoading(true)
  setError(null);
  
  try {
    if ((window as any).electron && typeof (window as any).electron.getPrinters === 'function') {
      console.log('Fetching printers from Electron...');
      const printersList = await (window as any).electron.getPrinters();
      console.log('Printers list received:', printersList);
      
      if (!printersList || printersList.length === 0) {
        setError("No printers detected. Please ensure your printer is connected, powered on, and installed in Windows.");
        setInstallationStatus(InstallationStatus.ERROR);
        setIsLoading(false);
        return;
      }
      
      const mappedPrinters = printersList.map((printer: any) => ({
        name: printer.name || printer.displayName || "Unnamed Printer",
        id: printer.name || "unknown",
        status: printer.isDefault ? "Default" : "Ready",
        isNetwork: printer.isNetwork || false,
        isConnected: true,
      }));
      
      console.log('Mapped printers:', mappedPrinters);
      setPrinters(mappedPrinters);
      setInstallationStatus(InstallationStatus.READY);
    }
  } catch (error) {
    console.error("Error fetching printers:", error)
    const errorMsg = error instanceof Error ? error.message : String(error);
    setError(`Failed to fetch printers: ${errorMsg}`)
    setInstallationStatus(InstallationStatus.ERROR);
  } finally {
    setIsLoading(false)
  }
}, []);

// ============ JSPRINTMANAGER PATH (OLD) ============
const checkJSPrintManagerInstallation = useCallback(async () => {
  setInstallationStatus(InstallationStatus.CHECKING)
  setError(null)

  try {
    JSPrintManager.auto_reconnect = true
    JSPrintManager.start()

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!JSPrintManager.WS) {
      setInstallationStatus(InstallationStatus.NOT_INSTALLED);
      return;
    }

    JSPrintManager.WS.onStatusChanged = () => {
      setJspmStatus(JSPrintManager.websocket_status);
      if (JSPrintManager.websocket_status === WSStatus.Open) {
        setInstallationStatus(InstallationStatus.INSTALLED);
        fetchJSPMPrinters();
      } else {
        setInstallationStatus(InstallationStatus.NOT_INSTALLED);
      }
    };

    if (JSPrintManager.websocket_status === WSStatus.Open) {
      setInstallationStatus(InstallationStatus.INSTALLED)
      fetchJSPMPrinters()
    } else {
      setInstallationStatus(InstallationStatus.NOT_INSTALLED)
    }

  } catch (error) {
    console.error("Error checking JSPrintManager:", error)
    setInstallationStatus(InstallationStatus.ERROR)
    setError("Failed to check printer manager status")
  }
}, []);

const fetchJSPMPrinters = useCallback(async () => {
  setIsLoading(true)
  setError(null);
  try {
    const printersList = (await JSPrintManager.getPrintersInfo(
      PrintersInfoLevel.Extended,
      "",
      PrinterIcon.None,
    )) as any[];

    setPrinters(
      printersList.map((printer: any) => ({
        name: printer.Name || printer.name || "Unnamed Printer",
        id: printer.Name || printer.name || "unknown",
        status: printer.Status || "Ready",
        isNetwork: printer.IsNetwork || false,
        isConnected: printer.Status !== "Offline",
      })),
    )
  } catch (error) {
    console.error("Error fetching printers:", error)
    setError("Failed to fetch printers")
  } finally {
    setIsLoading(false)
  }
}, []);

const handleInstallJSPrintManager = useCallback(async () => {
  setInstallationStatus(InstallationStatus.INSTALLING);
  setError(null);

  try {
    const downloadUrl = "https://www.neodynamic.com/downloads/jspm/";
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setError("Installer downloaded. Please run it from your downloads folder.");

    const maxRetries = 30;
    for (let i = 0; i < maxRetries; i++) {
      await wait(1000);

      try {
        await JSPrintManager.start();
        if (JSPrintManager.websocket_status === WSStatus.Open) {
          setInstallationStatus(InstallationStatus.INSTALLED);
          setError(null);
          fetchJSPMPrinters();
          return;
        }
      } catch {
        // still not installed
      }
    }

    throw new Error("Installation not detected. Please run the installer.");

  } catch (err: any) {
    console.error("Installation error:", err);
    setInstallationStatus(InstallationStatus.ERROR);
    setError(err.message || "Installation failed. Please retry.");
  }
}, []);

// --- Mount: check on startup ---
useEffect(() => {
  checkElectronAndFetchPrinters();
}, [checkElectronAndFetchPrinters]);

const renderInstallationUI = () => {
  // ELECTRON PATH
  if (isElectron) {
    switch (installationStatus) {
      case InstallationStatus.CHECKING:
        return (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={24} />
                <Typography variant="body2">{t("Initializing printer system...")}</Typography>
              </Stack>
            </CardContent>
          </Card>
        )

      case InstallationStatus.READY:
        return (
          <Card variant="outlined" sx={{ mb: 2, border: "2px solid", borderColor: "success.main" }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle color="green" size={20} />
                  <Typography variant="h6" color="success.main">
                    {t("Printer System Ready")}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t("Using Electron native printing - Silent print enabled")}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )

      case InstallationStatus.ERROR:
        return (
          <Card variant="outlined" sx={{ mb: 2, borderColor: "error.main" }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AlertCircle color="red" size={20} />
                  <Typography variant="h6" color="error">
                    {t("Printer System Error")}
                  </Typography>
                </Stack>
                <Typography variant="body2">{error}</Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshCw size={18}/>} 
                  onClick={checkElectronAndFetchPrinters}
                >
                  {t("Retry")}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        );

      default:
        return null
    }
  }

  // JSPRINTMANAGER PATH (OLD)
  switch (installationStatus) {
    case InstallationStatus.CHECKING:
      return (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={24} />
              <Typography variant="body2">{t("Checking printer manager status...")}</Typography>
            </Stack>
          </CardContent>
        </Card>
      )

    case InstallationStatus.NOT_INSTALLED:
      return (
        <Card variant="outlined" sx={{ mb: 2, border: "2px dashed", borderColor: "warning.main" }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon color="warning" />
                <Typography variant="h6" color="warning.main">
                  {t("Printer Manager Required")}
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {t(
                  "To access your local printers, you need to install JSPrintManager. This is a one-time installation that enables secure printer access from your browser.",
                )}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleInstallJSPrintManager}
                  sx={{ minWidth: 140 }}
                >
                  {t("Install Now")}
                </Button>

                <Link
                  href="https://neodynamic.com/products/printing/js-print-manager/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {t("Learn more")}
                </Link>
              </Stack>

              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="caption">
                  {t(
                    "After installation, the page will automatically detect your printers. If not, please refresh the page.",
                  )}
                </Typography>
              </Alert>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </CardContent>
        </Card>
      )

    case InstallationStatus.INSTALLING:
      return (
        <Card variant="outlined" sx={{ mb: 2, bgcolor: "action.hover" }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={24} />
                <Typography variant="h6">{t("Installing Printer Manager...")}</Typography>
              </Stack>

              <Alert severity="info">{t("Download complete. Please run the installer now.")}</Alert>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </CardContent>
        </Card>
      )

    case InstallationStatus.ERROR:
      return (
        <Card variant="outlined" sx={{ mb: 2, borderColor: "error.main" }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AlertCircle color="red" />
                <Typography variant="h6" color="error">
                  {t("Installation Error")}
                </Typography>
              </Stack>
              <Typography variant="body2">{error}</Typography>
              <Button variant="outlined" startIcon={<RefreshCw size={18}/>} onClick={checkJSPrintManagerInstallation}>
                {t("Retry")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      );

    default:
      return null
  }
}

const renderPrinterSelection = () => {
  // For Electron: show when READY
  if (isElectron) {
    if (installationStatus !== InstallationStatus.READY) {
      return null
    }
  } else {
    // For JSPrintManager: show when INSTALLED
    if (installationStatus !== InstallationStatus.INSTALLED) {
      return null
    }
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Stack spacing={1}>
        {/* Connection Status */}
        <Stack direction="row" spacing={1} alignItems="center">
          <CheckCircle color="green" size={16} />
          <Typography color="green" variant="body2">
            {isElectron ? t("Printer System Connected") : t("Printer Manager Connected")}
          </Typography>
          <Chip
            label={`${printers.length} ${t("printers found")}`}
            size="small"
            variant="outlined"
            icon={<PrinterIconMUI size={16}/>}
          />
        </Stack>

        {/* Printer Selection */}
        {isLoading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={16} />
            <Typography variant="body2">{t("Loading printers...")}</Typography>
          </Stack>
        ) : printers.length > 0 ? (
          <Stack sx={{px:1}}>
          <ERPDataCombobox
            id="printer"
            data={templateData?.propertiesState}
            value={templateData?.propertiesState?.printer??""}
            defaultValue={templateData?.propertiesState?.printer??""}
            label={t("select_printer")}
            field={{
              id: "printer",
              valueKey: "value",
              labelKey: "value",
            }}
            options={printers.map((p) => ({
              value: p.name,
              label: `${p.name} ${p.status === "Default" || p.isConnected ? "(Ready)" : "(Offline)"}`,
            }))}
            onChange={(e) =>handlePagePropsChange && !restInRoot ?handlePagePropsChange("printer", e.value): handlePrinterSet(e.value)}
          />
           </Stack>
        ) : (
          <Alert severity="warning">
            <Typography variant="body2">
              {t("No printers found. Please check your printer connections and try refreshing.")}
            </Typography>
            <Button 
              size="small" 
              startIcon={<RefreshCw />} 
              onClick={isElectron ? fetchElectronPrinters : fetchJSPMPrinters} 
              sx={{ mt: 1 }}
            >
              {t("Refresh Printers")}
            </Button>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </Stack>
     
        {restInRoot &&(
        <ERPFormButtons
          submitDisabled={isLoading}
          isLoading={isLoading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
        )}
   

    </Box>
  )
}

return (
  <Box>
    {renderInstallationUI()}
    {renderPrinterSelection()}
  </Box>
)
}
