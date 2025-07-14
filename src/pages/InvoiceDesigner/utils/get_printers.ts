import { useEffect, useState } from "react";

declare global {
  interface USBDevice {
    productName?: string;
    vendorId?: number;
    productId?: number;
  }

  interface USB {
    getDevices(): Promise<USBDevice[]>;
    requestDevice(options: { filters: USBDeviceFilter[] }): Promise<USBDevice>;
  }

  interface Navigator {
    usb: USB;
  }

  interface USBDeviceFilter {
    vendorId?: number;
    classCode?: number;
  }
}

export interface PrinterInfo {
  name: string;
  status: string;
  type: string;
  method: string;
  vendorId?: number;
  productId?: number;
}


export const usePrinters = () => {
  const [printers, setPrinters] = useState<PrinterInfo[]>([]);
  const [printerLoading, setPrinterLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // On initial load, check for already granted devices
    const fetchExistingDevices = async () => {
      if (!("usb" in navigator)) return;

      try {
        const devices = await navigator.usb.getDevices();

        if (devices.length > 0) {
          const printerList: PrinterInfo[] = devices.map((device) => ({
            name: device.productName || "Unknown Printer",
            status: "Connected via USB",
            type: "USB",
            method: "WebUSB API",
            vendorId: device.vendorId,
            productId: device.productId,
          }));

          setPrinters(printerList);
          setHasPermission(true);
        }
      } catch (err: any) {
        console.error("Error fetching existing devices:", err);
      }
    };

    fetchExistingDevices();
  }, []);

  const requestPrinterPermission = async (): Promise<void> => {
    if (!("usb" in navigator)) {
      alert("WebUSB is not supported in this browser.");
      return;
    }

    setPrinterLoading(true);
    setError("");

    try {
      const device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x04b8 }, // Epson
          { vendorId: 0x03f0 }, // HP
          { classCode: 0x07 },  // Printer generic class
        ],
      });

      const newPrinter: PrinterInfo = {
        name: device.productName || "Unknown Printer",
        status: "Connected via USB",
        type: "USB",
        method: "WebUSB API",
        vendorId: device.vendorId,
        productId: device.productId,
      };

      setPrinters((prev) => [...prev, newPrinter]);
      setHasPermission(true);
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        console.log("User canceled printer selection.");
      } else {
        console.error("Error requesting printer:", err);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setPrinterLoading(false);
    }
  };

  return {
    printers,
    printerLoading,
    error,
    hasPermission,
    requestPrinterPermission,
  };
};

