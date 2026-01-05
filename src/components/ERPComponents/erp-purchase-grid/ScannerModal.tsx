import React from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { BarcodeFormat } from "@zxing/library";


interface ScannerModalProps {
  onScan: (scanned: string) => void;
  onClose: () => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ onScan, onClose }) => {
  const handleUpdate = (err: any, result: any) => {
    if (result) {
      const textValue: string = result.text;
      onScan(textValue);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-3">Scan Barcode</h2>
        {/* <BarcodeScannerComponent
          width={300}
          height={300}
          onUpdate={handleUpdate}
          delay={1500}
        /> */}
       <BarcodeScannerComponent
  width={400}
  height={400}
  facingMode="environment"
  formats={[
     // 1D Barcodes
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODABAR,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.ITF,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,

  // 2D Barcodes
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.AZTEC,
  BarcodeFormat.PDF_417,

  // RSS / GS1
  BarcodeFormat.RSS_14,
  BarcodeFormat.RSS_EXPANDED,

  // Other
  BarcodeFormat.MAXICODE,
  ]}
  onUpdate={(err, result) => {
    if (result) {
      onScan(result.getText());
    }
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

export default ScannerModal;
