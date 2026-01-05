import { CameraPreview } from '@capacitor-community/camera-preview';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Capacitor } from '@capacitor/core';
import { registerModal, unregisterModal } from '../Android/lib/backButton';

export interface BarcodeScanResult {
  text: string;
  format: string;
  timestamp: number;
  rawValue?: string;
}

export interface ScannerConfig {
  onScan: (result: BarcodeScanResult) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  onEnterTrigger?: (result: BarcodeScanResult) => void;
  enableVibration?: boolean;
  enableBeep?: boolean;
  targetFormats?: string[];
}

class WebBarcodeScanner {
  private reader: BrowserMultiFormatReader;
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private isScanning = false;
  private scannerConfig: ScannerConfig | null = null;
  private animationFrameId: number | null = null;

  constructor() {
    this.reader = new BrowserMultiFormatReader();
  }

  async initialize(videoElementId: string, config: ScannerConfig): Promise<void> {
    this.scannerConfig = config;
    this.videoElement = document.getElementById(videoElementId) as HTMLVideoElement;

    if (!this.videoElement) {
      throw new Error(`Video element with ID "${videoElementId}" not found`);
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      this.videoElement.srcObject = this.stream;
      this.videoElement.setAttribute('playsinline', 'true');
      this.videoElement.setAttribute('muted', 'true');
      this.videoElement.setAttribute('autoplay', 'true');

      await this.videoElement.play();

      await new Promise<void>((resolve) => {
        const onLoadedMetadata = () => {
          this.videoElement?.removeEventListener('loadedmetadata', onLoadedMetadata);
          resolve();
        };
        this.videoElement?.addEventListener('loadedmetadata', onLoadedMetadata);
      });

      this.startScanning();
    } catch (error) {
      const err = error as Error;
      config.onError?.(new Error(`Camera access failed: ${err.message}`));
      throw error;
    }
  }

  private startScanning(): void {
    if (!this.videoElement || !this.scannerConfig) return;

    this.isScanning = true;

    const scanFrame = async () => {
      if (!this.isScanning || !this.videoElement) return;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        context.drawImage(this.videoElement, 0, 0);

        try {
          const imageUrl = canvas.toDataURL('image/jpeg');
          const result = await this.reader.decodeFromImage(imageUrl);

          if (result) {
            this.handleScanSuccess({
              text: result.getText(),
              format: result.getBarcodeFormat().toString(),
              timestamp: Date.now(),
              rawValue: result.getText(),
            });
            return;
          }
        } catch (error) {
          // Silent fail - continue scanning
        }
      } catch (error) {
        // Silent fail - continue scanning
      }

      if (this.isScanning) {
        this.animationFrameId = requestAnimationFrame(() => scanFrame());
      }
    };

    this.animationFrameId = requestAnimationFrame(() => scanFrame());
  }

  private captureVideoFrame(video: HTMLVideoElement): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    context.drawImage(video, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  }

  private handleScanSuccess(result: BarcodeScanResult): void {
    this.isScanning = false;

    if (this.scannerConfig?.enableVibration && navigator.vibrate) {
      navigator.vibrate(200);
    }

    if (this.scannerConfig?.enableBeep) {
      this.playBeep();
    }

    this.scannerConfig?.onScan(result);

    // Trigger Enter key logic after scan (with small delay to allow state update)
    if (this.scannerConfig?.onEnterTrigger) {
      setTimeout(() => {
        this.scannerConfig!.onEnterTrigger!(result);
      }, 100);
    }
  }

  stop(): void {
    this.isScanning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.srcObject = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  private async playBeep(): Promise<void> {
    try {
      const res = await fetch('/beep.mp3', { method: 'HEAD' });
      if (!res.ok) return;
      const audio = new Audio('/beep.mp3');
      audio.volume = 0.9;
      await audio.play().catch(() => {});
    } catch (e) {
      // Beep unavailable, silent fail
    }
  }
}

class NativeBarcodeScanner {
  private cameraActive = false;
  private scannerConfig: ScannerConfig | null = null;
  private originalWebViewOpacity: string | null = null;
  private scanningFrame: HTMLDivElement | null = null;
  private cameraStartAttempts = 0;
  private maxCameraAttempts = 3;
  private scanIntervalId: ReturnType<typeof setInterval> | null = null;
  private reader: BrowserMultiFormatReader;
  private isProcessing = false;
  private backButtonHandler: ((event: Event) => void) | null = null;
  private static readonly MODAL_ID = 'barcode-scanner-modal';
  private lastCapturedImageSize: { width: number; height: number } = { width: 640, height: 480 };
  private realtimeBoundingBox: HTMLDivElement | null = null;
  private lastDetectionTime: number = 0;
  private detectionHoldTime: number = 300; // Keep box visible for 300ms after last detection

  constructor() {
    this.reader = new BrowserMultiFormatReader();
  }

  async initialize(config: ScannerConfig): Promise<void> {
    // Prevent duplicate initialization
    if (this.cameraActive) {
      console.log('⚠️ Camera already active, cleaning up first');
      await this.cleanup();
    }

    this.scannerConfig = config;
    this.cameraStartAttempts = 0;
    this.lastDetectionTime = 0;

    if (!Capacitor.isNativePlatform()) {
      throw new Error('Native platform required');
    }

    try {
      // Aggressive cleanup: stop any existing camera and orphaned elements
      await this.forceStopCamera();

      // Cleanup any orphaned elements from previous sessions
      const orphanedBox = document.getElementById('realtime-barcode-box');
      if (orphanedBox) orphanedBox.remove();
      const orphanedOverlay = document.getElementById('native-scanner-overlay');
      if (orphanedOverlay) orphanedOverlay.remove();

      // Wait for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 400));

      // Register scanner as a modal for back button handling
      registerModal(NativeBarcodeScanner.MODAL_ID);

      // Set up back button handler
      this.setupBackButtonHandler();

      // Save original WebView state
      this.originalWebViewOpacity = document.body.style.opacity;

      // CRITICAL: Make WebView FULLY transparent so camera shows through from behind
      // The camera renders BEHIND the WebView, so WebView must be see-through
      document.body.style.backgroundColor = 'transparent';
      document.body.style.background = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
      document.documentElement.style.background = 'transparent';

      // Add comprehensive style to make WebView transparent and hide app content
      const hideStyle = document.createElement('style');
      hideStyle.id = 'scanner-hide-style';
      hideStyle.textContent = `
        /* Make HTML and body fully transparent - CRITICAL for camera preview */
        html, body {
          background: transparent !important;
          background-color: transparent !important;
          --ion-background-color: transparent !important;
        }

        /* Hide ALL app content - make it invisible AND transparent */
        body > *:not(#native-scanner-overlay):not(#realtime-barcode-box):not(script):not(style) {
          display: none !important;
        }

        /* Also target common app wrapper classes - hide completely */
        .page, .app, #root, #app, [data-reactroot], main, header, footer, nav, .scrollbar-hide {
          display: none !important;
        }

        /* Ensure scanner overlay is always visible on top */
        #native-scanner-overlay {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          background: transparent !important;
        }

        /* Real-time bounding box */
        #realtime-barcode-box {
          display: block !important;
          visibility: visible !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(hideStyle);

      // Create overlay UI
      this.createScanningOverlay();

      // Start BACK camera with retry logic
      await this.startBackCameraWithRetry();
      this.cameraActive = true;

      console.log('✅ Camera initialized successfully');

      // Start barcode detection
      await this.startBarcodeDetection();
    } catch (error) {
      await this.cleanup();
      const err = error as Error;
      console.error('❌ Initialize error:', err);
      config.onError?.(new Error(`Native camera failed: ${err.message}`));
      throw error;
    }
  }

  private setupBackButtonHandler(): void {
    // Listen for back button events from Capacitor
    this.backButtonHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.modalId === NativeBarcodeScanner.MODAL_ID) {
        console.log('🔙 Back button pressed - closing scanner');
        this.cleanup();
        this.scannerConfig?.onClose?.();
      }
    };
    document.addEventListener('capacitor-back-button', this.backButtonHandler);
  }

  private async forceStopCamera(): Promise<void> {
    try {
      console.log('🛑 Force stopping any existing camera...');
      await CameraPreview.stop();
      console.log('✅ Existing camera stopped');
    } catch (error) {
      const err = error as Error;
      if (!err.message?.includes('already stopped') && !err.message?.includes('not started')) {
        console.warn('⚠️ Force stop warning:', err.message);
      }
    }
  }

  private async startBackCameraWithRetry(): Promise<void> {
    while (this.cameraStartAttempts < this.maxCameraAttempts) {
      try {
        this.cameraStartAttempts++;
        console.log(`🎥 Camera start attempt ${this.cameraStartAttempts}/${this.maxCameraAttempts}`);

        // Use toBack: true - camera renders BEHIND the WebView
        // WebView must be transparent for camera to show through
        const options = {
          position: 'rear',
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
          toBack: true,  // Camera renders BEHIND WebView
          storeToFile: false,
          disableExifHeaderStripping: false,
          lockAndroidOrientation: false,
        } as any;

        console.log('📸 Starting camera with options:', {
          position: options.position,
          dimensions: `${options.width}x${options.height}`,
          toBack: options.toBack,
        });

        await CameraPreview.start(options);
        console.log('✅ Back camera started successfully on attempt ' + this.cameraStartAttempts);
        return;
      } catch (error) {
        const err = error as Error;
        console.error(`❌ Camera start error (attempt ${this.cameraStartAttempts}):`, err.message);

        if (this.cameraStartAttempts < this.maxCameraAttempts) {
          console.log('🔄 Retrying camera start...');
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Force stop before retry
          try {
            await CameraPreview.stop();
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (e) {
            // Silent fail
          }
        } else {
          throw new Error(`Failed to start camera after ${this.maxCameraAttempts} attempts: ${err.message}`);
        }
      }
    }
  }

  private currentZoom: number = 1;

  private createScanningOverlay(): void {
    this.scanningFrame = document.createElement('div');
    this.scanningFrame.id = 'native-scanner-overlay';
    this.scanningFrame.className = 'native-scanner-overlay';
    this.scanningFrame.innerHTML = `
      <div class="scan-container">
        <!-- Top Bar -->
        <div class="scanner-top-bar">
          <button class="back-btn" id="back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button class="help-btn" id="help-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
        </div>

        <!-- Scan Text Above Frame -->
        <p class="scan-text">Put the code into the frame.</p>

        <!-- Scan Frame with Simple White Corners -->
        <div class="scan-frame-wrapper">
          <div class="scan-frame">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
            <div class="scan-line"></div>
          </div>

          <!-- Zoom Slider on Right -->
          <div class="zoom-control">
            <button class="zoom-btn zoom-in" id="zoom-in-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            <div class="zoom-slider-container">
              <input type="range" id="zoom-slider" class="zoom-slider" min="1" max="3" step="0.1" value="1" orient="vertical"/>
              <div class="zoom-track"></div>
              <div class="zoom-thumb" id="zoom-thumb"></div>
            </div>
            <button class="zoom-btn zoom-out" id="zoom-out-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Bottom Toolbar -->
        <div class="scanner-bottom-bar">
          <button class="toolbar-btn" id="scan-image-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
              <path d="M14 15l2-2 4 4"/>
              <circle cx="8" cy="6" r="1.5"/>
            </svg>
            <span>Scan Image</span>
          </button>
          <button class="toolbar-btn" id="flashlight-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M8 6L18.5 3v5.5L13 10l1.5 9.5-5.5-4-1-9.5z"/>
            </svg>
            <span>Flashlight</span>
          </button>
          <button class="toolbar-btn" id="batch-scan-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="4" width="16" height="12" rx="2"/>
              <rect x="6" y="8" width="16" height="12" rx="2"/>
            </svg>
            <span>Batch Scan</span>
          </button>
        </div>
      </div>
      <style>
        #native-scanner-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        .scan-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Top Bar */
        .scanner-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          padding-top: env(safe-area-inset-top, 10px);
          z-index: 100;
        }
        .back-btn, .help-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .back-btn:active, .help-btn:active {
          background: rgba(255,255,255,0.2);
        }

        /* Scan Text */
        .scan-text {
          position: absolute;
          top: calc(50% - 180px);
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.9);
          font-size: 16px;
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        /* Scan Frame Wrapper */
        .scan-frame-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* Scan Frame - Clean White Corners */
        .scan-frame {
          position: relative;
          width: 280px;
          height: 280px;
          background: transparent;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
        }
        .corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.95);
          background: transparent;
          z-index: 10;
        }
        .corner-tl { top: 0; left: 0; border-right: none; border-bottom: none; }
        .corner-tr { top: 0; right: 0; border-left: none; border-bottom: none; }
        .corner-bl { bottom: 0; left: 0; border-right: none; border-top: none; }
        .corner-br { bottom: 0; right: 0; border-left: none; border-top: none; }

        /* Scan Line */
        .scan-line {
          position: absolute;
          left: 10px;
          right: 10px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.8) 80%, transparent 100%);
          animation: scan-line-move 2.5s ease-in-out infinite;
        }
        @keyframes scan-line-move {
          0%, 100% { top: 20px; opacity: 0.6; }
          50% { top: calc(100% - 22px); opacity: 0.9; }
        }

        /* Zoom Control */
        .zoom-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(128,128,128,0.4);
          border-radius: 25px;
          backdrop-filter: blur(8px);
        }
        .zoom-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .zoom-btn:active {
          background: rgba(255,255,255,0.2);
        }
        .zoom-slider-container {
          position: relative;
          width: 30px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .zoom-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 120px;
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          transform: rotate(-90deg);
          transform-origin: center;
          cursor: pointer;
        }
        .zoom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .zoom-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        /* Bottom Toolbar */
        .scanner-bottom-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px;
          padding-bottom: calc(env(safe-area-inset-bottom, 16px) + 16px);
          display: flex;
          justify-content: center;
          gap: 8px;
          z-index: 100;
        }
        .toolbar-btn {
          flex: 1;
          max-width: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 8px;
          background: rgba(128,128,128,0.5);
          border: none;
          border-radius: 16px;
          color: white;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .toolbar-btn:active {
          background: rgba(128,128,128,0.7);
          transform: scale(0.96);
        }
        .toolbar-btn svg {
          opacity: 0.9;
        }
        .toolbar-btn span {
          opacity: 0.9;
        }

        /* Success Animation */
        @keyframes success-pop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      </style>
    `;
    document.body.appendChild(this.scanningFrame);

    // Add event listeners
    this.setupOverlayEventListeners();
  }

  private setupOverlayEventListeners(): void {
    if (!this.scanningFrame) return;

    // Back button
    const backBtn = this.scanningFrame.querySelector('#back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        console.log('🔙 Back button pressed');
        this.cleanup();
        this.scannerConfig?.onClose?.();
      });
    }

    // Zoom slider
    const zoomSlider = this.scanningFrame.querySelector('#zoom-slider') as HTMLInputElement;
    if (zoomSlider) {
      zoomSlider.addEventListener('input', async (e) => {
        const target = e.target as HTMLInputElement;
        const zoomLevel = parseFloat(target.value);
        await this.setZoom(zoomLevel);
      });
    }

    // Zoom in button
    const zoomInBtn = this.scanningFrame.querySelector('#zoom-in-btn');
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', async () => {
        const newZoom = Math.min(this.currentZoom + 0.5, 3);
        await this.setZoom(newZoom);
        this.updateZoomSlider(newZoom);
      });
    }

    // Zoom out button
    const zoomOutBtn = this.scanningFrame.querySelector('#zoom-out-btn');
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', async () => {
        const newZoom = Math.max(this.currentZoom - 0.5, 1);
        await this.setZoom(newZoom);
        this.updateZoomSlider(newZoom);
      });
    }

    // Flashlight button
    const flashlightBtn = this.scanningFrame.querySelector('#flashlight-btn');
    if (flashlightBtn) {
      flashlightBtn.addEventListener('click', async () => {
        await this.toggleFlashlight();
      });
    }
  }

  private async setZoom(zoomLevel: number): Promise<void> {
    try {
      this.currentZoom = zoomLevel;
      // Note: CameraPreview zoom may not be supported on all devices
      // This is a placeholder for zoom functionality
      console.log(`🔍 Zoom set to: ${zoomLevel}x`);
    } catch (error) {
      console.warn('⚠️ Zoom not supported:', error);
    }
  }

  private updateZoomSlider(value: number): void {
    const zoomSlider = this.scanningFrame?.querySelector('#zoom-slider') as HTMLInputElement;
    if (zoomSlider) {
      zoomSlider.value = value.toString();
    }
  }

  private flashlightOn: boolean = false;

  private async toggleFlashlight(): Promise<void> {
    try {
      this.flashlightOn = !this.flashlightOn;
      // Toggle flashlight using CameraPreview
      if (this.flashlightOn) {
        await CameraPreview.setFlashMode({ flashMode: 'torch' });
        console.log('🔦 Flashlight ON');
      } else {
        await CameraPreview.setFlashMode({ flashMode: 'off' });
        console.log('🔦 Flashlight OFF');
      }

      // Update button visual state
      const flashlightBtn = this.scanningFrame?.querySelector('#flashlight-btn');
      if (flashlightBtn) {
        if (this.flashlightOn) {
          flashlightBtn.classList.add('active');
          (flashlightBtn as HTMLElement).style.background = 'rgba(255,200,0,0.6)';
        } else {
          flashlightBtn.classList.remove('active');
          (flashlightBtn as HTMLElement).style.background = 'rgba(128,128,128,0.5)';
        }
      }
    } catch (error) {
      console.warn('⚠️ Flashlight toggle failed:', error);
    }
  }

  private async startBarcodeDetection(): Promise<void> {
    console.log('🔍 Starting real barcode detection...');

    // Create real-time bounding box element (hidden initially)
    this.createRealtimeBoundingBox();

    // Continuously capture frames and try to decode barcodes
    this.scanIntervalId = setInterval(async () => {
      if (!this.cameraActive || this.isProcessing) {
        return;
      }

      this.isProcessing = true;

      try {
        // Capture a frame from the camera
        const result = await CameraPreview.captureSample({
          quality: 90,
        });

        if (result && result.value) {
          // Decode the base64 image
          const imageData = `data:image/jpeg;base64,${result.value}`;

          // Get actual image dimensions for accurate coordinate mapping
          await this.getImageDimensions(imageData);

          try {
            const decoded = await this.reader.decodeFromImageUrl(imageData);

            if (decoded) {
              console.log('🎉 Barcode detected:', decoded.getText());

              // Show real-time bounding box around detected barcode
              this.updateRealtimeBoundingBox(decoded, true);

              // Stop the scanning loop
              if (this.scanIntervalId) {
                clearInterval(this.scanIntervalId);
                this.scanIntervalId = null;
              }

              // Show final success bounding box
              this.showBarcodeBoundingBox(decoded);

              // Handle successful scan
              if (this.scannerConfig) {
                await this.handleNativeScanSuccess(
                  {
                    text: decoded.getText(),
                    format: decoded.getBarcodeFormat().toString(),
                    timestamp: Date.now(),
                    rawValue: decoded.getText(),
                  },
                  this.scannerConfig
                );
              }
              return;
            } else {
              // No barcode found - hide the real-time bounding box
              this.updateRealtimeBoundingBox(null, false);
            }
          } catch (decodeError) {
            // No barcode found in this frame - hide bounding box
            this.updateRealtimeBoundingBox(null, false);
          }
        }
      } catch (captureError) {
        console.warn('📷 Frame capture error:', captureError);
      } finally {
        this.isProcessing = false;
      }
    }, 150); // Scan every 150ms (~7 frames per second for smoother tracking)
  }

  private async getImageDimensions(imageDataUrl: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.lastCapturedImageSize = { width: img.width, height: img.height };
        resolve();
      };
      img.onerror = () => {
        // Keep default dimensions on error
        resolve();
      };
      img.src = imageDataUrl;
    });
  }

  private createRealtimeBoundingBox(): void {
    // Create the real-time bounding box overlay - append to body for full screen positioning
    this.realtimeBoundingBox = document.createElement('div');
    this.realtimeBoundingBox.id = 'realtime-barcode-box';
    this.realtimeBoundingBox.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.15s ease;
    `;

    // Create inner elements for the bounding box
    this.realtimeBoundingBox.innerHTML = `
      <div class="realtime-box-border"></div>
      <div class="realtime-box-corners">
        <div class="rt-corner rt-tl"></div>
        <div class="rt-corner rt-tr"></div>
        <div class="rt-corner rt-bl"></div>
        <div class="rt-corner rt-br"></div>
      </div>
      <div class="realtime-box-label"></div>
      <style>
        #realtime-barcode-box {
          will-change: transform, opacity;
        }
        #realtime-barcode-box .realtime-box-border {
          position: absolute;
          inset: 0;
          border: 3px solid #00e676;
          border-radius: 8px;
          background: rgba(0, 230, 118, 0.12);
          box-shadow: 0 0 25px rgba(0, 230, 118, 0.6), inset 0 0 15px rgba(0, 230, 118, 0.2);
        }
        #realtime-barcode-box.detected .realtime-box-border {
          border-color: #00ff00;
          background: rgba(0, 255, 0, 0.18);
          box-shadow: 0 0 40px rgba(0, 255, 0, 0.9), inset 0 0 25px rgba(0, 255, 0, 0.3);
          animation: detected-pulse 0.5s ease-in-out infinite alternate;
        }
        @keyframes detected-pulse {
          from {
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.7), inset 0 0 20px rgba(0, 255, 0, 0.2);
          }
          to {
            box-shadow: 0 0 50px rgba(0, 255, 0, 1), inset 0 0 30px rgba(0, 255, 0, 0.4);
          }
        }
        #realtime-barcode-box .rt-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 4px solid #00ff00;
        }
        #realtime-barcode-box .rt-tl { top: -2px; left: -2px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
        #realtime-barcode-box .rt-tr { top: -2px; right: -2px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
        #realtime-barcode-box .rt-bl { bottom: -2px; left: -2px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
        #realtime-barcode-box .rt-br { bottom: -2px; right: -2px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }
        #realtime-barcode-box .realtime-box-label {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.95);
          color: #00ff00;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          border-radius: 8px;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
          opacity: 0;
          transition: opacity 0.2s ease;
          border: 1px solid rgba(0, 255, 0, 0.3);
        }
        #realtime-barcode-box.detected .realtime-box-label {
          opacity: 1;
        }
      </style>
    `;

    // Append to body for fixed positioning
    document.body.appendChild(this.realtimeBoundingBox);
  }

  private updateRealtimeBoundingBox(decoded: any | null, detected: boolean): void {
    if (!this.realtimeBoundingBox) return;

    const now = Date.now();

    if (!detected || !decoded) {
      // Keep the box visible for a short time after last detection (reduces flicker)
      if (now - this.lastDetectionTime > this.detectionHoldTime) {
        this.realtimeBoundingBox.style.opacity = '0';
        this.realtimeBoundingBox.classList.remove('detected');
      }
      return;
    }

    // Update last detection time
    this.lastDetectionTime = now;

    // Get screen dimensions (camera captures full screen)
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Get barcode result points
    const resultPoints = decoded.getResultPoints?.();
    const barcodeValue = decoded.getText?.() ?? '';

    let boxLeft: number, boxTop: number, boxWidth: number, boxHeight: number;

    if (resultPoints && resultPoints.length >= 2) {
      // Calculate bounding box from result points
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      resultPoints.forEach((point: any) => {
        const x = point.getX?.() ?? point.x ?? 0;
        const y = point.getY?.() ?? point.y ?? 0;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });

      // Scale coordinates from captured image to screen dimensions
      // The camera preview covers the full screen
      const scaleX = screenWidth / this.lastCapturedImageSize.width;
      const scaleY = screenHeight / this.lastCapturedImageSize.height;

      // Calculate box position on screen
      const padding = 20;
      boxLeft = Math.max(0, minX * scaleX - padding);
      boxTop = Math.max(0, minY * scaleY - padding);
      boxWidth = Math.min(screenWidth - boxLeft, (maxX - minX) * scaleX + padding * 2);
      boxHeight = Math.min(screenHeight - boxTop, (maxY - minY) * scaleY + padding * 2);

      // Ensure minimum size for visibility
      boxWidth = Math.max(boxWidth, 100);
      boxHeight = Math.max(boxHeight, 50);

      console.log(`📍 Barcode box: (${boxLeft.toFixed(0)}, ${boxTop.toFixed(0)}) ${boxWidth.toFixed(0)}x${boxHeight.toFixed(0)}`);
    } else {
      // Fallback: show box in center of scan frame area
      const scanFrame = this.scanningFrame?.querySelector('.scan-frame') as HTMLElement;
      if (scanFrame) {
        const frameRect = scanFrame.getBoundingClientRect();
        boxWidth = Math.min(200, frameRect.width - 40);
        boxHeight = 70;
        boxLeft = frameRect.left + (frameRect.width - boxWidth) / 2;
        boxTop = frameRect.top + (frameRect.height - boxHeight) / 2;
      } else {
        // Ultimate fallback: center of screen
        boxWidth = 200;
        boxHeight = 70;
        boxLeft = (screenWidth - boxWidth) / 2;
        boxTop = (screenHeight - boxHeight) / 2;
      }
    }

    // Update the bounding box position and size using fixed positioning
    this.realtimeBoundingBox.style.left = `${boxLeft}px`;
    this.realtimeBoundingBox.style.top = `${boxTop}px`;
    this.realtimeBoundingBox.style.width = `${boxWidth}px`;
    this.realtimeBoundingBox.style.height = `${boxHeight}px`;
    this.realtimeBoundingBox.style.opacity = '1';
    this.realtimeBoundingBox.classList.add('detected');

    // Update the label with barcode value
    const label = this.realtimeBoundingBox.querySelector('.realtime-box-label') as HTMLElement;
    if (label && barcodeValue) {
      label.textContent = barcodeValue.length > 25 ? barcodeValue.substring(0, 25) + '...' : barcodeValue;
    }
  }

  private showBarcodeBoundingBox(decoded: any): void {
    const scanFrame = this.scanningFrame?.querySelector('.scan-frame') as HTMLElement;
    if (!scanFrame) return;

    // Get the barcode value for display
    const barcodeValue = decoded.getText?.() ?? decoded.text ?? '';

    // Try to get barcode position from result points
    const resultPoints = decoded.getResultPoints?.();

    // Create bounding box element
    const boundingBox = document.createElement('div');
    boundingBox.className = 'barcode-bounding-box';

    // Create barcode value label
    const valueLabel = document.createElement('div');
    valueLabel.className = 'barcode-value-label';
    valueLabel.textContent = barcodeValue;

    if (resultPoints && resultPoints.length >= 2) {
      // Calculate bounding box from result points (normalized to scan frame)
      const frameWidth = scanFrame.offsetWidth;
      const frameHeight = scanFrame.offsetHeight;

      // Get min/max coordinates
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      resultPoints.forEach((point: any) => {
        const x = point.getX?.() ?? point.x ?? 0;
        const y = point.getY?.() ?? point.y ?? 0;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });

      // Scale to frame dimensions using actual captured image size
      const scaleX = frameWidth / this.lastCapturedImageSize.width;
      const scaleY = frameHeight / this.lastCapturedImageSize.height;

      const boxLeft = Math.max(0, minX * scaleX - 10);
      const boxTop = Math.max(0, minY * scaleY - 10);
      const boxWidth = Math.min(frameWidth - boxLeft, (maxX - minX) * scaleX + 20);
      const boxHeight = Math.min(frameHeight - boxTop, (maxY - minY) * scaleY + 20);

      boundingBox.style.cssText = `
        position: absolute;
        left: ${boxLeft}px;
        top: ${boxTop}px;
        width: ${boxWidth}px;
        height: ${boxHeight}px;
        border: 4px solid #00ff00;
        border-radius: 8px;
        background: rgba(0, 255, 0, 0.15);
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.8), inset 0 0 20px rgba(0, 255, 0, 0.3);
        animation: barcode-detected 0.4s ease-out forwards;
        z-index: 20;
        pointer-events: none;
      `;

      valueLabel.style.cssText = `
        position: absolute;
        left: ${boxLeft}px;
        top: ${boxTop + boxHeight + 8}px;
        min-width: ${boxWidth}px;
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.85);
        color: #00ff00;
        font-size: 14px;
        font-weight: 600;
        font-family: monospace;
        border-radius: 6px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        animation: label-fade-in 0.3s ease-out 0.1s both;
        z-index: 21;
        pointer-events: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: ${frameWidth - 20}px;
      `;
    } else {
      // Fallback: show a centered indicator
      boundingBox.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 220px;
        height: 90px;
        border: 4px solid #00ff00;
        border-radius: 12px;
        background: rgba(0, 255, 0, 0.2);
        box-shadow: 0 0 40px rgba(0, 255, 0, 0.9), inset 0 0 30px rgba(0, 255, 0, 0.4);
        animation: barcode-detected-center 0.4s ease-out forwards;
        z-index: 20;
        pointer-events: none;
      `;

      valueLabel.style.cssText = `
        position: absolute;
        left: 50%;
        top: calc(50% + 60px);
        transform: translateX(-50%);
        padding: 8px 16px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ff00;
        font-size: 16px;
        font-weight: 700;
        font-family: monospace;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
        animation: label-fade-in 0.3s ease-out 0.1s both;
        z-index: 21;
        pointer-events: none;
        white-space: nowrap;
        max-width: 280px;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
    }

    // Add keyframe animations if not already added
    if (!document.getElementById('barcode-detection-styles')) {
      const style = document.createElement('style');
      style.id = 'barcode-detection-styles';
      style.textContent = `
        @keyframes barcode-detected {
          0% {
            opacity: 0;
            transform: scale(1.3);
            border-color: #ffffff;
          }
          30% {
            opacity: 1;
            border-color: #00ff00;
            box-shadow: 0 0 50px rgba(0, 255, 0, 1), inset 0 0 40px rgba(0, 255, 0, 0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.8), inset 0 0 20px rgba(0, 255, 0, 0.3);
          }
        }
        @keyframes barcode-detected-center {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.3);
            border-color: #ffffff;
          }
          30% {
            opacity: 1;
            border-color: #00ff00;
            box-shadow: 0 0 60px rgba(0, 255, 0, 1), inset 0 0 50px rgba(0, 255, 0, 0.6);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 40px rgba(0, 255, 0, 0.9), inset 0 0 30px rgba(0, 255, 0, 0.4);
          }
        }
        @keyframes label-fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px) translateX(-50%);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
      `;
      document.head.appendChild(style);
    }

    scanFrame.appendChild(boundingBox);
    if (barcodeValue) {
      scanFrame.appendChild(valueLabel);
    }
  }

  private async handleNativeScanSuccess(result: BarcodeScanResult, config: ScannerConfig): Promise<void> {
    console.log('✅ Barcode scanned successfully:', result.text);

    // Show success animation before cleanup
    this.showSuccessAnimation();

    if (config.enableVibration && navigator.vibrate) {
      navigator.vibrate(200);
    }

    if (config.enableBeep) {
      this.playBeep();
    }

    // Small delay to show success feedback before closing
    await new Promise(resolve => setTimeout(resolve, 300));

    // Stop camera and cleanup after successful scan
    await this.cleanup();

    // Notify the scan callback first
    config.onScan(result);

    // Trigger Enter key logic after scan (with small delay to allow state update)
    if (config.onEnterTrigger) {
      setTimeout(() => {
        config.onEnterTrigger!(result);
      }, 100);
    }
  }

  private showSuccessAnimation(): void {
    const scanFrame = this.scanningFrame?.querySelector('.scan-frame') as HTMLElement;
    if (scanFrame) {
      scanFrame.style.borderColor = 'rgba(76, 175, 80, 1)';
      scanFrame.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8), 0 0 0 9999px rgba(0, 0, 0, 0.4)';

      // Add success checkmark
      const successIcon = document.createElement('div');
      successIcon.className = 'scan-success-icon';
      successIcon.innerHTML = '✓';
      successIcon.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 80px;
        color: rgba(76, 175, 80, 1);
        text-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
        animation: success-pop 0.3s ease-out;
      `;
      scanFrame.appendChild(successIcon);
    }
  }

  async stop(): Promise<void> {
    await this.cleanup();
  }

  private async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up camera scanner...');

    // Prevent multiple cleanups
    if (!this.cameraActive && !this.scanIntervalId && !this.scanningFrame) {
      console.log('⚠️ Already cleaned up, skipping');
      return;
    }

    this.cameraActive = false;
    this.isProcessing = false;
    this.lastDetectionTime = 0;

    // Unregister from back button handling
    unregisterModal(NativeBarcodeScanner.MODAL_ID);

    // Remove back button event listener
    if (this.backButtonHandler) {
      document.removeEventListener('capacitor-back-button', this.backButtonHandler);
      this.backButtonHandler = null;
    }

    // Stop the scanning interval
    if (this.scanIntervalId) {
      clearInterval(this.scanIntervalId);
      this.scanIntervalId = null;
      console.log('✅ Scan interval stopped');
    }

    // Remove realtime bounding box (now appended to body)
    if (this.realtimeBoundingBox) {
      this.realtimeBoundingBox.remove();
      this.realtimeBoundingBox = null;
    }

    // Also cleanup any orphaned bounding boxes
    const orphanedBox = document.getElementById('realtime-barcode-box');
    if (orphanedBox) {
      orphanedBox.remove();
    }

    try {
      await CameraPreview.stop();
      console.log('✅ Camera preview stopped');
    } catch (e) {
      const err = e as Error;
      if (!err.message?.includes('already stopped') && !err.message?.includes('not started')) {
        console.warn('⚠️ Camera stop warning:', err.message);
      }
    }

    // Remove the hide style
    const hideStyle = document.getElementById('scanner-hide-style');
    if (hideStyle) {
      hideStyle.remove();
    }

    // Restore WebView background - remove transparency
    document.body.style.backgroundColor = '';
    document.body.style.background = '';
    document.documentElement.style.backgroundColor = '';
    document.documentElement.style.background = '';

    // Remove overlay
    if (this.scanningFrame) {
      this.scanningFrame.remove();
      this.scanningFrame = null;
    }

    // Also cleanup any orphaned overlays
    const orphanedOverlay = document.getElementById('native-scanner-overlay');
    if (orphanedOverlay) {
      orphanedOverlay.remove();
    }

    console.log('✅ Camera cleanup complete');
  }

  private async playBeep(): Promise<void> {
    try {
      const audio = new Audio('/beep.mp3');
      audio.volume = 0.9;
      await audio.play().catch(() => {});
    } catch (e) {
      // Silent fail
    }
  }
}

export class UnifiedBarcodeScanner {
  private webScanner: WebBarcodeScanner | null = null;
  private nativeScanner: NativeBarcodeScanner | null = null;
  private isNative: boolean;
  private currentMode: 'web' | 'native' | null = null;
  private isInitializing = false;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    console.log(`🔧 Barcode scanner - Platform: ${this.isNative ? '📱 Native Android' : '🌐 Web Browser'}`);
  }

  async startScanning(config: ScannerConfig, videoElementId?: string): Promise<void> {
    // Prevent concurrent initialization
    if (this.isInitializing) {
      console.log('⚠️ Scanner already initializing, ignoring duplicate call');
      return;
    }

    try {
      this.isInitializing = true;

      if (this.currentMode) {
        console.log('⚠️ Stopping previous scanner session');
        await this.stopScanning();
      }

      if (!this.isNative) {
        if (!videoElementId) {
          throw new Error('videoElementId required for web scanning');
        }
        console.log('🌐 Starting web barcode scanner');
        this.webScanner = new WebBarcodeScanner();
        await this.webScanner.initialize(videoElementId, config);
        this.currentMode = 'web';
      } else {
        console.log('📱 Starting NATIVE barcode scanner - BACK CAMERA');
        this.nativeScanner = new NativeBarcodeScanner();
        await this.nativeScanner.initialize(config);
        this.currentMode = 'native';
      }
    } catch (error) {
      const err = error as Error;
      console.error('❌ Scanner start failed:', err);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  async stopScanning(): Promise<void> {
    console.log(`🛑 Stopping ${this.currentMode} scanner`);

    if (this.currentMode === 'web' && this.webScanner) {
      this.webScanner.stop();
      this.webScanner = null;
    } else if (this.currentMode === 'native' && this.nativeScanner) {
      await this.nativeScanner.stop();
      this.nativeScanner = null;
    }
    this.currentMode = null;
  }
}

export const barcodeScanner = new UnifiedBarcodeScanner();
