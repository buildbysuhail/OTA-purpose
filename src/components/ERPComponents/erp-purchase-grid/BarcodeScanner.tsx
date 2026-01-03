import React from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

interface MobileBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const MobileBarcodeScanner: React.FC<MobileBarcodeScannerProps> = ({
  onScan,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-3">Scan Barcode</h2>

        <BarcodeScannerComponent
          width={300}
          height={300}
          facingMode="environment"
          onUpdate={(err: unknown, result?: any) => {
            if (result) {
              const scannedText: string = result.getText();
              onScan(scannedText);
              onClose();
            }
          }}
          onError={(error) => {
            console.error("Scanner Error:", error);
          }}
        />

        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MobileBarcodeScanner;
