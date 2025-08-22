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
import type { PropertiesState } from "../Designer/interfaces"
import ERPToast from "../../../components/ERPComponents/erp-toast"

interface PrinterInfo {
  name: string
  id: any
  isConnected: boolean
  isNetwork: boolean
  status?: string
}

interface usePrinterProps {
  templateData: any
  t?: any
  handlePagePropsChange?: (property: keyof PropertiesState, value: any) => void
}

export enum InstallationStatus {
  CHECKING = "checking",
  NOT_INSTALLED = "not_installed",
  INSTALLING = "installing",
  INSTALLED = "installed",
  ERROR = "error",
}

export const AccessPrinterList = ({ templateData, t, handlePagePropsChange }: usePrinterProps) => {
  const [printers, setPrinters] = useState<PrinterInfo[]>([])
  const [jspmStatus, setJspmStatus] = useState<WSStatus | null>(null)
  const [installationStatus, setInstallationStatus] = useState<InstallationStatus>(InstallationStatus.CHECKING)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

    // Helper to wait
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const checkJSPrintManagerInstallation = useCallback(async () => {
    setInstallationStatus(InstallationStatus.CHECKING)
    setError(null)

    try {
      // Initialize JSPrintManager
      JSPrintManager.auto_reconnect = true
      JSPrintManager.start()

      // Wait a bit for initialization
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!JSPrintManager.WS) {
        setInstallationStatus(InstallationStatus.NOT_INSTALLED);
        return;
      }

        JSPrintManager.WS.onStatusChanged = () => {
        setJspmStatus(JSPrintManager.websocket_status);
        if (JSPrintManager.websocket_status === WSStatus.Open) {
          setInstallationStatus(InstallationStatus.INSTALLED);
          fetchPrinters();
        } else {
          setInstallationStatus(InstallationStatus.NOT_INSTALLED);
        }
      };
              // Check current status
        if (JSPrintManager.websocket_status === WSStatus.Open) {
          setInstallationStatus(InstallationStatus.INSTALLED)
          fetchPrinters()
        } else {
          setInstallationStatus(InstallationStatus.NOT_INSTALLED)
        }

    } catch (error) {
      console.error("Error checking JSPrintManager:", error)
      setInstallationStatus(InstallationStatus.ERROR)
      setError("Failed to check printer manager status")
    }
  },[]);

   const fetchPrinters = useCallback(async () => {
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
    // 1. Trigger a background download
    const downloadUrl = "https://www.neodynamic.com/downloads/jspm/";  // or .dmg/.deb
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = ""; // let browser infer filename
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Prompt user to run installer
    setError("Installer downloaded. Please run it from your downloads folder.");

    // 3. Poll for installation success
    const maxRetries = 30;
    for (let i = 0; i < maxRetries; i++) {
      await wait(1000);

      try {
        await JSPrintManager.start();
        if (JSPrintManager.websocket_status === WSStatus.Open) {
          setInstallationStatus(InstallationStatus.INSTALLED);
          setError(null);
          fetchPrinters();
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
  }, [fetchPrinters, t]);

  // --- Mount: check on startup ---
  useEffect(() => {
    checkJSPrintManagerInstallation();
  }, [checkJSPrintManagerInstallation]);

  const renderInstallationUI = () => {
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
                  <InfoIcon  color="warning" />
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
    if (installationStatus !== InstallationStatus.INSTALLED) {
      return null
    }

    return (
      <Box sx={{ mb: 1 }}>
        <Stack spacing={2}>
          {/* Connection Status */}
          <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircle color="green" size={16} />
            <Typography color="green">{t("Printer Manager Connected")}</Typography>
            <Chip
              label={`${printers.length} ${t("printers found")}`}
              size="small"
              variant="outlined"
              icon={<PrinterIconMUI />}
            />
          </Stack>

          {/* Printer Selection */}
          {isLoading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={16} />
              <Typography variant="body2">{t("Loading printers...")}</Typography>
            </Stack>
          ) : printers.length > 0 ? (
            <ERPDataCombobox
              id="printer"
              data={templateData?.propertiesState}
              label={t("select_printer")}
              field={{
                id: "printer",
                valueKey: "value",
                labelKey: "value",
              }}
              options={printers.map((p) => ({
                value: p.name,
                label: `${p.name} ${p.isConnected ? "(Ready)" : "(Offline)"}`,
              }))}
              onChange={(e) =>handlePagePropsChange && handlePagePropsChange("printer", e.value)}
            />
          ) : (
            <Alert severity="warning">
              <Typography variant="body2">
                {t("No printers found. Please check your printer connections and try refreshing.")}
              </Typography>
              <Button size="small" startIcon={<RefreshCw />} onClick={fetchPrinters} sx={{ mt: 1 }}>
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
