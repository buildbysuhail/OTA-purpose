import { BarcodeScanner as CommunityBarcodeScanner } from '@capacitor-community/barcode-scanner';

export interface ScanResult {
  text: string;
}

const OVERLAY_ID = 'capacitor-scanner-overlay';

const createOverlay = () => {
  // don't duplicate
  if (document.getElementById(OVERLAY_ID)) return;
  const d = document.createElement('div');
  d.id = OVERLAY_ID;
  d.className = 'scanner-overlay';
  // improved overlay: explicit corners + instructions
  d.innerHTML = `
    <div class="scan-rect">
      <div class="corner-tl"></div>
      <div class="corner-tr"></div>
      <div class="corner-bl"></div>
      <div class="corner-br"></div>
      <div class="scan-line"></div>
    </div>
    <div class="scan-instructions">Align the barcode inside the box</div>
  `;
  document.body.appendChild(d);
};

const removeOverlay = () => {
  const el = document.getElementById(OVERLAY_ID);
  if (el) el.remove();
};

const addBodyClass = () => document.body.classList.add('scanner-active');
const removeBodyClass = () => document.body.classList.remove('scanner-active');

const playBeep = async () => {
  try {
    // guard: only attempt play if file exists
    const res = await fetch('/beep.mp3', { method: 'HEAD' });
    if (!res.ok) return;
    const audio = new Audio('/beep.mp3');
    audio.volume = 0.9;
    await audio.play().catch(() => {});
  } catch (e) {}
};

export const BarcodeScanner = {
  async scan(): Promise<ScanResult> {
    // plugin availability check (more robust than window/Capacitor flag)
    if (!CommunityBarcodeScanner || typeof CommunityBarcodeScanner.startScan !== 'function') {
      const manual = window.prompt?.('Enter barcode (manual):');
      if (manual) return { text: manual };
      throw new Error('Barcode scanner unavailable on this platform');
    }

    // request/check permission if available
    if (typeof CommunityBarcodeScanner.checkPermission === 'function') {
      const perm = await CommunityBarcodeScanner.checkPermission({ force: true });
      if (!perm || (perm as any).granted !== true) {
        throw new Error('Camera permission denied');
      }
    }

    // Prepare native scanner, then reveal native preview and make webview transparent
    try {
      await CommunityBarcodeScanner.prepare();

      try {
        await CommunityBarcodeScanner.hideBackground().catch(() => {});
      } catch (e) {
        // ignore if not supported
      }

      addBodyClass();
      createOverlay();

      const result = await CommunityBarcodeScanner.startScan({
        // request torch where supported to improve speed; cast to any to avoid strict plugin type mismatches
        torch: true
      } as any);

      // stop native preview immediately (stop before restoring background)
      try {
        await CommunityBarcodeScanner.stopScan();
      } catch (e) {}

      try {
        await CommunityBarcodeScanner.showBackground();
      } catch (e) {}

      removeOverlay();
      removeBodyClass();

      if (result && (result as any).hasContent) {
        // feedback
        try { if (navigator?.vibrate) navigator.vibrate(120); } catch {}
        await playBeep();
        return { text: (result as any).content };
      }

      throw new Error('No barcode content');
    } catch (err) {
      // ensure cleanup on error/cancel: stop scan first, then restore background
      try {
        await CommunityBarcodeScanner.stopScan().catch(() => {});
        await CommunityBarcodeScanner.showBackground().catch(() => {});
      } catch (e) {}
      removeOverlay();
      removeBodyClass();
      throw err;
    }
  },
};