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

    if (!Capacitor.isNativePlatform()) {
      throw new Error('Native platform required');
    }

    try {
      // Aggressive cleanup: stop any existing camera and orphaned elements
      await this.forceStopCamera();
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
        </div>

        <!-- Flashlight Button -->
        <div class="scanner-bottom-bar">
          <button class="toolbar-btn" id="flashlight-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M8 6L18.5 3v5.5L13 10l1.5 9.5-5.5-4-1-9.5z"/>
            </svg>
            <span>Flashlight</span>
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
          justify-content: flex-start;
          align-items: center;
          padding: 10px 16px;
          padding-top: env(safe-area-inset-top, 10px);
          z-index: 100;
        }
        .back-btn {
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
        .back-btn:active {
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
          justify-content: center;
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
          z-index: 100;
        }
        .toolbar-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 24px;
          background: rgba(128,128,128,0.5);
          border: none;
          border-radius: 16px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .toolbar-btn:active {
          background: rgba(128,128,128,0.7);
          transform: scale(0.96);
        }
        .toolbar-btn.active {
          background: rgba(255,200,0,0.6);
        }
      </style>
    `;
    document.body.appendChild(this.scanningFrame);

    // Add event listeners
    this.setupOverlayEventListeners();
  }

  private flashlightOn: boolean = false;

  private async toggleFlashlight(): Promise<void> {
    try {
      this.flashlightOn = !this.flashlightOn;
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
        } else {
          flashlightBtn.classList.remove('active');
        }
      }
    } catch (error) {
      console.warn('⚠️ Flashlight toggle failed:', error);
    }
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

    // Flashlight button
    const flashlightBtn = this.scanningFrame.querySelector('#flashlight-btn');
    if (flashlightBtn) {
      flashlightBtn.addEventListener('click', () => {
        this.toggleFlashlight();
      });
    }
  }

  private async startBarcodeDetection(): Promise<void> {
    console.log('🔍 Starting real barcode detection...');

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

          try {
            const decoded = await this.reader.decodeFromImageUrl(imageData);

            if (decoded) {
              console.log('🎉 Barcode detected:', decoded.getText());

              // Stop the scanning loop
              if (this.scanIntervalId) {
                clearInterval(this.scanIntervalId);
                this.scanIntervalId = null;
              }

              // Show green bounding box around detected barcode
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
            }
          } catch (decodeError) {
            // No barcode found in this frame - continue scanning
          }
        }
      } catch (captureError) {
        console.warn('📷 Frame capture error:', captureError);
      } finally {
        this.isProcessing = false;
      }
    }, 150); // Scan every 150ms (~7 frames per second)
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
    // No checkmark - just visual feedback through corners turning green
    const scanFrame = this.scanningFrame?.querySelector('.scan-frame') as HTMLElement;
    if (scanFrame) {
      // Turn corners green
      const corners = scanFrame.querySelectorAll('.corner');
      corners.forEach((corner) => {
        (corner as HTMLElement).style.borderColor = '#00ff00';
      });
      // Add green glow to scan frame
      scanFrame.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.6), 0 0 0 9999px rgba(0, 0, 0, 0.5)';
    }
  }

  private showBarcodeBoundingBox(decoded: any): void {
    // Create green bounding box overlay
    const boundingBox = document.createElement('div');
    boundingBox.id = 'barcode-detection-box';
    boundingBox.style.cssText = `
      position: fixed;
      z-index: 10001;
      pointer-events: none;
      border: 3px solid #00ff00;
      border-radius: 8px;
      background: rgba(0, 255, 0, 0.15);
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
      animation: barcode-box-appear 0.3s ease-out;
    `;

    // Try to position based on barcode result points
    const resultPoints = decoded.getResultPoints?.();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (resultPoints && resultPoints.length >= 2) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      resultPoints.forEach((point: any) => {
        const x = point.getX?.() ?? point.x ?? 0;
        const y = point.getY?.() ?? point.y ?? 0;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });

      // Scale to screen (assuming 640x480 capture)
      const scaleX = screenWidth / 640;
      const scaleY = screenHeight / 480;
      const padding = 15;

      boundingBox.style.left = `${Math.max(0, minX * scaleX - padding)}px`;
      boundingBox.style.top = `${Math.max(0, minY * scaleY - padding)}px`;
      boundingBox.style.width = `${Math.min(screenWidth, (maxX - minX) * scaleX + padding * 2)}px`;
      boundingBox.style.height = `${Math.min(screenHeight, (maxY - minY) * scaleY + padding * 2)}px`;
    } else {
      // Fallback: show centered box
      boundingBox.style.left = '50%';
      boundingBox.style.top = '50%';
      boundingBox.style.transform = 'translate(-50%, -50%)';
      boundingBox.style.width = '200px';
      boundingBox.style.height = '80px';
    }

    // Add barcode value label
    const barcodeValue = decoded.getText?.() ?? '';
    if (barcodeValue) {
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.85);
        color: #00ff00;
        font-size: 14px;
        font-weight: 600;
        font-family: monospace;
        border-radius: 6px;
        white-space: nowrap;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
      `;
      label.textContent = barcodeValue.length > 20 ? barcodeValue.substring(0, 20) + '...' : barcodeValue;
      boundingBox.appendChild(label);
    }

    // Add animation keyframes
    if (!document.getElementById('barcode-box-style')) {
      const style = document.createElement('style');
      style.id = 'barcode-box-style';
      style.textContent = `
        @keyframes barcode-box-appear {
          0% { opacity: 0; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(boundingBox);
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

    // Remove bounding box if exists
    const boundingBox = document.getElementById('barcode-detection-box');
    if (boundingBox) {
      boundingBox.remove();
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
