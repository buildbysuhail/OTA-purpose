import React, { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

interface Props {
  onScan: (code: string) => void;
  onClose: () => void;
}

const ZXingScanner: React.FC<Props> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState("Put the code into the frame.");
  const [format, setFormat] = useState<string>("---");

  useEffect(() => {
  const hints = new Map();

  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODABAR,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.ITF,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.AZTEC,
    BarcodeFormat.PDF_417,
    BarcodeFormat.RSS_14,
    BarcodeFormat.RSS_EXPANDED,
    BarcodeFormat.MAXICODE,
  ]);

  // Allowed constructor (only hints)
  const reader = new BrowserMultiFormatReader(hints);
  readerRef.current = reader;

  let lastScanTime = 0;  // manual delay controller

  reader.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {

    const now = Date.now();

    // throttle scanning manually to reduce noise
    if (now - lastScanTime < 150) return;
    lastScanTime = now;

    if (result) {
      setFormat(result.getBarcodeFormat().toString());
      setStatus("Code detected!");

      setTimeout(() => {
        onScan(result.getText());
        onClose();
      }, 120);
    } else {
      setStatus("Scanning...");
    }
  });

  return () => reader.reset();
}, []);



  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const z = Number(e.target.value);
    setZoom(z);
    if (videoRef.current) {
      videoRef.current.style.transform = `scale(${z})`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">

      <div className="relative bg-black rounded-xl p-4 shadow-lg">
        
        {/* Video */}
        <div className="relative w-[320px] h-[320px] overflow-hidden rounded-xl border-2 border-white/30">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom})`,
              transition: "0.2s ease",
            }}
          />

          {/* Frame corners */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white"></div>
          </div>

          {/* Animated scanning line */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="scanline"></div>
          </div>
        </div>

        {/* CSS for animation */}
        <style>
          {`
            .scanline {
              position: absolute;
              top: 0;
              height: 2px;
              width: 100%;
              background: rgba(255, 255, 255, 0.8);
              animation: scan 2s linear infinite;
            }

            @keyframes scan {
              0% { top: 0; }
              100% { top: 100%; }
            }
          `}
        </style>

        {/* Status */}
        <p className="text-center text-white mt-3 text-sm">{status}</p>

        {/* Format display */}
        <p className="text-center text-gray-300 text-xs">
          Format: <span className="text-green-400">{format}</span>
        </p>

        {/* Zoom control */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-white text-xs">🔍</span>
          <input
            type="range"
            min="1"
            max="2"
            step="0.1"
            value={zoom}
            onChange={handleZoom}
            className="w-full"
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ZXingScanner;
