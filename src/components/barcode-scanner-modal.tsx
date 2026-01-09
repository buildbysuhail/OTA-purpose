import React, { useEffect, useRef, useState } from 'react';
import { X, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import {
  barcodeScanner,
  type BarcodeScanResult,
} from '../utilities/barcode-scanner-service';

interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: BarcodeScanResult) => void;
  onEnterTrigger?: (result: BarcodeScanResult) => void;
  title?: string;
}

// Check platform once at module load
const isNativePlatform = Capacitor.isNativePlatform();

const BarcodeModalScanner: React.FC<BarcodeModalProps> = ({
  isOpen,
  onClose,
  onScan,
  onEnterTrigger,
  title = 'Scan Barcode',
}) => {
  const { t } = useTranslation('transaction');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerInitializedRef = useRef(false);
  const mountedRef = useRef(true);
  const initializingRef = useRef(false);

  // Store callbacks in refs to avoid dependency issues
  const onScanRef = useRef(onScan);
  const onCloseRef = useRef(onClose);
  const onEnterTriggerRef = useRef(onEnterTrigger);

  // Update refs when callbacks change
  useEffect(() => {
    onScanRef.current = onScan;
    onCloseRef.current = onClose;
    onEnterTriggerRef.current = onEnterTrigger;
  }, [onScan, onClose, onEnterTrigger]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (scannerInitializedRef.current) {
        barcodeScanner.stopScanning();
        scannerInitializedRef.current = false;
      }
      initializingRef.current = false;
      setError(null);
      return;
    }

    const initializeScanner = async () => {
      // Prevent double initialization
      if (initializingRef.current || scannerInitializedRef.current) {
        console.log('⚠️ Modal: Scanner already initializing or initialized, skipping');
        return;
      }

      if (!mountedRef.current) return;

      initializingRef.current = true;

      // Only show loading for web platform
      if (!isNativePlatform) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Configure scanner callbacks
        const scannerConfig = {
          onScan: (result: BarcodeScanResult) => {
            if (mountedRef.current) {
              console.log('📷 Barcode scanned:', result.text);

              // First call the scan handler to update the barcode value
              onScanRef.current(result);

              // Close the modal first so UI is responsive
              onCloseRef.current();

              // Then trigger Enter key logic after a delay to allow:
              // 1. Modal to close
              // 2. State to update with barcode value
              // 3. React re-render to complete
              if (onEnterTriggerRef.current) {
                const enterTrigger = onEnterTriggerRef.current;
                // Use requestAnimationFrame + setTimeout to ensure React has finished updating
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    console.log('⌨️ Triggering Enter key logic for barcode:', result.text);
                    enterTrigger(result);
                  }, 100);
                });
              }
            }
          },
          onClose: () => {
            // Called when native scanner closes (back button, etc.)
            if (mountedRef.current) {
              onCloseRef.current();
            }
          },
          onEnterTrigger: (result: BarcodeScanResult) => {
            // This is called by the scanner service after successful scan
            // We handle Enter trigger in onScan callback above for better control
          },
          onError: (err: Error) => {
            // On native, errors are handled by the native scanner UI
            // Only set error state for web platform
            if (mountedRef.current && !isNativePlatform) {
              setError(err.message);
            }
          },
          enableVibration: true,
          enableBeep: true,
        };

        // On native platform, don't pass video element ID - native scanner handles its own UI
        // On web, pass the video element ID for camera stream
        await barcodeScanner.startScanning(
          scannerConfig,
          isNativePlatform ? undefined : 'barcode-video'
        );

        scannerInitializedRef.current = true;
      } catch (err) {
        const error = err as Error;
        // On native, don't show error modal - native scanner handles errors
        if (mountedRef.current && !isNativePlatform) {
          setError(error.message);
        }
        // On native, if scanner fails, just close
        if (isNativePlatform && mountedRef.current) {
          console.error('Native scanner error:', error.message);
          onCloseRef.current();
        }
      } finally {
        initializingRef.current = false;
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initializeScanner();

    return () => {
      if (scannerInitializedRef.current) {
        barcodeScanner.stopScanning();
        scannerInitializedRef.current = false;
      }
      initializingRef.current = false;
    };
  }, [isOpen]); // Only depend on isOpen

  // Don't render anything if not open
  if (!isOpen) return null;

  // Native platform: return null - native scanner creates its own fullscreen UI overlay
  // The scanner service handles everything including the UI
  if (isNativePlatform) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-dark-bg-card rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10 flex justify-between items-center">
          <h2 className="text-white font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Video/Loading Area */}
        <div className="relative w-full h-96 bg-black overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="flex flex-col items-center gap-3">
                <Loader className="w-8 h-8 text-white animate-spin" />
                <p className="text-white text-sm">Initializing camera...</p>
              </div>
            </div>
          )}

          {/* {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20 p-4">
              <div className="bg-red-600 text-white p-6 rounded-lg max-w-sm text-center">
                <p className="font-semibold mb-2">Camera Error</p>
                <p className="text-sm mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white text-red-600 rounded font-semibold hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )} */}

          {!isLoading && !error && (
            <>
              <video
                ref={videoRef}
                id="barcode-video"
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Scan Frame Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-72 h-72">
                  {/* Border */}
                  <div className="absolute inset-0 border-4 border-green-500 rounded-xl shadow-lg" />

                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br" />

                  {/* Scan Line */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div
                      className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"
                      style={{
                        animation: 'scan-movement 2s linear infinite',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                <p className="text-white text-sm font-medium drop-shadow-lg">
                  Align barcode in frame
                </p>
              </div>
            </>
          )}
        </div>

        <style>{`
          @keyframes scan-movement {
            0% { transform: translateY(0%); }
            100% { transform: translateY(100%); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BarcodeModalScanner;
