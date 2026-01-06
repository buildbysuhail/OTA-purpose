import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

// GitHub API URLs for OTA updates (private repo)
// Using GitHub API instead of raw.githubusercontent.com for private repo access
const GITHUB_OWNER = 'mahirpolosys';
const GITHUB_REPO = 'live-update';
const GITHUB_BRANCH = 'main';
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;
const METADATA_URL = `${GITHUB_API_BASE}/metadata.json?ref=${GITHUB_BRANCH}`;
const BUNDLE_DIR = 'live-update-bundles';
const CURRENT_BUNDLE_KEY = 'ota_current_bundle';
const PENDING_BUNDLE_KEY = 'ota_pending_bundle';

// GitHub token injected at build time via environment variable
declare const __GITHUB_TOKEN__: string;
const GITHUB_TOKEN = typeof __GITHUB_TOKEN__ !== 'undefined' ? __GITHUB_TOKEN__ : '';

// Get GitHub token for authentication
function getGitHubToken(): string | null {
  const token = GITHUB_TOKEN || null;
  // Debug: log token presence (not the actual token for security)
  console.log('[OTA] GitHub token present:', token ? `Yes (${token.length} chars)` : 'No');
  return token;
}

// Get headers for GitHub API requests (private repo authentication)
function getGitHubHeaders(): HeadersInit {
  const token = getGitHubToken();
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[OTA] Using GitHub token for authentication');
  } else {
    console.warn('[OTA] No GitHub token available - private repos will fail');
  }
  return headers;
}

// Get headers for downloading raw content from GitHub API
function getGitHubDownloadHeaders(): HeadersInit {
  const token = getGitHubToken();
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.raw+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Parse GitHub API response - handles both JSON wrapper and raw content
async function parseGitHubContent(response: Response): Promise<string> {
  const text = await response.text();

  // Try to parse as GitHub API JSON response (contains base64 content)
  try {
    const json = JSON.parse(text);
    if (json.content && json.encoding === 'base64') {
      // Decode base64 content
      return atob(json.content.replace(/\n/g, ''));
    }
  } catch {
    // Not JSON, treat as raw content
  }

  return text;
}

// Convert bundle filename to full GitHub API URL for download
function getBundleUrl(bundleFilename: string): string {
  // If already a full URL, return as-is
  if (bundleFilename.startsWith('http://') || bundleFilename.startsWith('https://')) {
    return bundleFilename;
  }
  // Otherwise, construct GitHub API URL for the bundle file
  return `${GITHUB_API_BASE}/bundles/${bundleFilename}?ref=${GITHUB_BRANCH}`;
}

// Check if auto-update is enabled from API
export async function isAutoUpdateEnabled(): Promise<boolean> {
  try {
    // Fetch from API - single source of truth
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[OTA] No auth token, defaulting to enabled');
      return true;
    }

    // Get base URL from config.json (loaded at runtime)
    const configResponse = await fetch('/config.json');
    if (!configResponse.ok) {
      console.warn('[OTA] Failed to load config.json');
      return true;
    }
    const config = await configResponse.json();
    const baseUrl = config?.api?.APP_API_URL || '';

    if (!baseUrl) {
      console.warn('[OTA] No API URL configured');
      return true;
    }

    const response = await fetch(`${baseUrl}/api/Core/Preferences/AutoUpdate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn('[OTA] Failed to fetch auto-update setting, status:', response.status);
      return true; // Default enabled on error
    }

    const result = await response.json();
    // Handle boolean or string response
    if (typeof result === 'boolean') {
      return result;
    } else if (typeof result === 'string') {
      return result.toLowerCase() === 'true';
    }
    return true; // Default enabled
  } catch (e) {
    console.error('[OTA] Error fetching auto-update setting from API:', e);
    return true; // Default enabled on error
  }
}

interface OTAMetadata {
  appId: string;
  channel: string;
  version: string;      // APK version (e.g., "10.0.1") - only changes with new APK
  bundleId?: string;    // OTA bundle identifier (e.g., "10.0.1-ota.1") - changes with every OTA update
  bundleUrl: string;
  checksum?: string;
}

// Sanitize JSON text - remove control characters and fix common issues
function sanitizeJson(text: string): string {
  // Remove all control characters (ASCII 0-31 and 127) except standard whitespace
  // This includes characters that cause "Bad control character in string literal" errors
  let cleaned = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Keep: tab (9), newline (10), carriage return (13), and printable chars (32-126, 128+)
    // Exclude: 0-8, 11-12, 14-31, and 127 (DEL)
    if (charCode === 9 || charCode === 10 || charCode === 13 ||
        (charCode >= 32 && charCode <= 126) || charCode >= 128) {
      cleaned += text[i];
    }
  }

  return cleaned
    // Remove trailing commas before } or ]
    .replace(/,(\s*[}\]])/g, '$1')
    // Trim whitespace
    .trim();
}

interface BundleInfo {
  version: string;      // APK version for display
  bundleId: string;     // OTA bundle identifier for comparison
  path: string;
  timestamp: number;
}

/**
 * Custom Self-Hosted OTA Update System
 *
 * Flow:
 * 1. Fetch metadata.json from server
 * 2. Compare version with current bundle
 * 3. Download ZIP bundle if newer version available
 * 4. Extract ZIP to app storage
 * 5. Set pending bundle for next reload
 * 6. Reload WebView to apply update
 */

// ============================================================================
// STORAGE HELPERS - Use native Preferences as primary storage (persists across WebView path changes)
// localStorage is WebView-path specific and gets reset when OTA bundle loads
// ============================================================================

// Get stored bundle info - reads from native Preferences (async)
async function getCurrentBundleInfoAsync(): Promise<BundleInfo | null> {
  // On native platform, use Preferences (persists across WebView path changes)
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await Preferences.get({ key: CURRENT_BUNDLE_KEY });
      if (result.value) {
        const info = JSON.parse(result.value);
        // Also sync to localStorage for fast synchronous access later
        localStorage.setItem(CURRENT_BUNDLE_KEY, result.value);
        return info;
      }
    } catch (err) {
      console.warn('[OTA] Failed to read current bundle from Preferences:', err);
    }
  }
  // Fallback to localStorage (for web or if Preferences fails)
  try {
    const stored = localStorage.getItem(CURRENT_BUNDLE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Save current bundle info to both native Preferences and localStorage
async function setCurrentBundleInfoAsync(info: BundleInfo): Promise<void> {
  const json = JSON.stringify(info);
  localStorage.setItem(CURRENT_BUNDLE_KEY, json);

  // Save to native Preferences (primary storage - persists across WebView changes)
  if (Capacitor.isNativePlatform()) {
    try {
      await Preferences.set({ key: CURRENT_BUNDLE_KEY, value: json });
      console.log('[OTA] Saved current bundle to native Preferences:', info.bundleId);
    } catch (err) {
      console.warn('[OTA] Failed to save to native Preferences:', err);
    }
  }
}

// Get pending bundle - reads from native Preferences (async)
async function getPendingBundleAsync(): Promise<BundleInfo | null> {
  // On native platform, use Preferences (persists across WebView path changes)
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await Preferences.get({ key: PENDING_BUNDLE_KEY });
      if (result.value) {
        const info = JSON.parse(result.value);
        // Also sync to localStorage
        localStorage.setItem(PENDING_BUNDLE_KEY, result.value);
        return info;
      }
    } catch (err) {
      console.warn('[OTA] Failed to read pending bundle from Preferences:', err);
    }
  }
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(PENDING_BUNDLE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Set pending bundle to both native Preferences and localStorage
async function setPendingBundleAsync(info: BundleInfo | null): Promise<void> {
  if (info) {
    const json = JSON.stringify(info);
    localStorage.setItem(PENDING_BUNDLE_KEY, json);

    if (Capacitor.isNativePlatform()) {
      try {
        await Preferences.set({ key: PENDING_BUNDLE_KEY, value: json });
        console.log('[OTA] Saved pending bundle to native Preferences:', info.bundleId);
      } catch (err) {
        console.warn('[OTA] Failed to save pending to native Preferences:', err);
      }
    }
  } else {
    localStorage.removeItem(PENDING_BUNDLE_KEY);

    if (Capacitor.isNativePlatform()) {
      try {
        await Preferences.remove({ key: PENDING_BUNDLE_KEY });
        console.log('[OTA] Cleared pending bundle from native Preferences');
      } catch (err) {
        console.warn('[OTA] Failed to remove pending from native Preferences:', err);
      }
    }
  }
}

// ============================================================================
// VERSION COMPARISON
// ============================================================================

function isNewerVersion(newVersion: string, currentVersion: string): boolean {
  const parseVersion = (v: string) => v.split('.').map(n => parseInt(n, 10) || 0);
  const newParts = parseVersion(newVersion);
  const currentParts = parseVersion(currentVersion);

  for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
    const newPart = newParts[i] || 0;
    const currentPart = currentParts[i] || 0;
    if (newPart > currentPart) return true;
    if (newPart < currentPart) return false;
  }
  return false;
}

// Compare bundleIds (e.g., "10.0.1-ota.1" vs "10.0.1-ota.2")
// Format: <version>-ota.<build> or just <version>
function isNewerBundleId(newBundleId: string, currentBundleId: string): boolean {
  // If they're exactly the same, not newer
  if (newBundleId === currentBundleId) return false;

  // Parse bundleId format: "10.0.1-ota.2" -> { version: "10.0.1", otaBuild: 2 }
  const parseBundleId = (id: string) => {
    const otaMatch = id.match(/^(.+)-ota\.(\d+)$/);
    if (otaMatch) {
      return { version: otaMatch[1], otaBuild: parseInt(otaMatch[2], 10) };
    }
    // No -ota suffix, treat as base version with otaBuild 0
    return { version: id, otaBuild: 0 };
  };

  const newParsed = parseBundleId(newBundleId);
  const currentParsed = parseBundleId(currentBundleId);

  // First compare base versions
  if (isNewerVersion(newParsed.version, currentParsed.version)) {
    return true;
  }

  // If base versions are equal, compare OTA build numbers
  if (newParsed.version === currentParsed.version ||
      (!isNewerVersion(newParsed.version, currentParsed.version) &&
       !isNewerVersion(currentParsed.version, newParsed.version))) {
    return newParsed.otaBuild > currentParsed.otaBuild;
  }

  return false;
}

// ============================================================================
// FILE SYSTEM HELPERS
// ============================================================================

async function ensureBundleDir(): Promise<void> {
  console.log('[OTA] Ensuring bundle directory exists...');
  try {
    await Filesystem.mkdir({
      path: BUNDLE_DIR,
      directory: Directory.Data,
      recursive: true
    });
    console.log('[OTA] Bundle directory created/exists');
  } catch (err: any) {
    if (!err.message?.includes('exists')) {
      console.error('[OTA] Failed to create bundle directory:', err);
      throw err;
    }
    console.log('[OTA] Bundle directory already exists');
  }
}

async function downloadFile(url: string, onProgress?: (percent: number) => void): Promise<string> {
  console.log('[OTA] Starting download from:', url);
  const startTime = Date.now();

  // Use GitHub API headers for private repo access
  const headers = getGitHubDownloadHeaders();
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Download failed with status: ${response.status}`);
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  console.log('[OTA] Content length:', total, 'bytes');

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to get response reader');
  }

  const chunks: ArrayBuffer[] = [];
  let downloaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value.buffer as ArrayBuffer);
    downloaded += value.length;

    if (total > 0 && onProgress) {
      const percent = Math.round((downloaded / total) * 100);
      onProgress(percent);
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[OTA] Download complete: ${downloaded} bytes in ${elapsed}ms`);

  // Convert to base64
  const blob = new Blob(chunks.map(buf => new Uint8Array(buf)));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      console.log('[OTA] Converted to base64, length:', base64.length);
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to convert to base64'));
    reader.readAsDataURL(blob);
  });
}

async function extractZip(zipPath: string, destPath: string): Promise<void> {
  console.log('[OTA] Extracting ZIP...');
  console.log('[OTA]   Source:', zipPath);
  console.log('[OTA]   Destination:', destPath);

  if (!Capacitor.isNativePlatform()) {
    throw new Error('ZIP extraction only available on native platforms');
  }

  const { OTAPlugin } = await import('./otaPlugin');
  await OTAPlugin.extractZip({ zipPath, destPath });
  console.log('[OTA] ZIP extraction complete');
}

async function cleanupOldBundles(keepVersions: string[]): Promise<void> {
  console.log('[OTA] Cleaning up old bundles, keeping:', keepVersions);
  try {
    const result = await Filesystem.readdir({
      path: BUNDLE_DIR,
      directory: Directory.Data
    });

    for (const file of result.files) {
      if (file.type === 'directory' && !keepVersions.includes(file.name)) {
        console.log('[OTA] Deleting old bundle:', file.name);
        await Filesystem.rmdir({
          path: `${BUNDLE_DIR}/${file.name}`,
          directory: Directory.Data,
          recursive: true
        });
      }
    }
    console.log('[OTA] Cleanup complete');
  } catch (err) {
    console.warn('[OTA] Cleanup error (non-fatal):', err);
  }
}

async function getBundlePath(version: string): Promise<string> {
  const uri = await Filesystem.getUri({
    path: `${BUNDLE_DIR}/${version}`,
    directory: Directory.Data
  });
  console.log('[OTA] Bundle path for version', version, ':', uri.uri);
  return uri.uri;
}

// ============================================================================
// MAIN OTA FUNCTIONS
// ============================================================================

export async function checkLiveUpdate(onProgress?: (percent: number) => void, forceUpdate: boolean = false): Promise<{
  available: boolean;
  version?: string;
  downloaded?: boolean;
  error?: string;
}> {
  console.log('');
  console.log('========================================');
  console.log('[OTA] CHECK LIVE UPDATE STARTED');
  console.log('========================================');
  console.log('[OTA] Timestamp:', new Date().toISOString());
  console.log('[OTA] Platform:', Capacitor.getPlatform());
  console.log('[OTA] Is native:', Capacitor.isNativePlatform());
  console.log('[OTA] Force update (manual):', forceUpdate);

  // Check if auto-update is enabled from API (single source of truth)
  const autoUpdateEnabled = await isAutoUpdateEnabled();
  console.log('[OTA] Auto-update enabled:', autoUpdateEnabled);
  console.log('[OTA] Metadata URL:', METADATA_URL);

  if (!Capacitor.isNativePlatform()) {
    console.log('[OTA] SKIPPED - Not a native platform');
    console.log('========================================');
    return { available: false };
  }

  // Skip auto-update check ONLY if NOT forced (manual update bypasses this check)
  if (!forceUpdate && !autoUpdateEnabled) {
    console.log('[OTA] SKIPPED - Auto-update is disabled by user (use forceUpdate=true to bypass)');
    console.log('========================================');
    return { available: false };
  }

  if (forceUpdate) {
    console.log('[OTA] MANUAL UPDATE - bypassing auto-update setting');
  }

  try {
    // Step 1: Fetch metadata
    console.log('');
    console.log('[OTA] STEP 1: Fetching metadata...');
    console.log('[OTA] Attempting fetch to:', METADATA_URL);

    let res: Response;
    try {
      // Use GitHub API headers for private repo access
      const headers = getGitHubHeaders();
      res = await fetch(METADATA_URL, {
        cache: 'no-store',
        headers
      });
      console.log('[OTA] Fetch completed, status:', res.status);
    } catch (fetchError) {
      console.error('[OTA] FETCH ERROR:', fetchError);
      return { available: false, error: `Fetch failed: ${fetchError}` };
    }

    if (!res.ok) {
      console.error('[OTA] Metadata fetch failed with status:', res.status);
      return { available: false, error: `Metadata fetch failed: ${res.status}` };
    }

    // Parse metadata - handle GitHub API response (base64 encoded) or raw content
    const text = await parseGitHubContent(res);
    const cleanJson = sanitizeJson(text);
    const metadata: OTAMetadata = JSON.parse(cleanJson);
    // Use bundleId for OTA versioning (falls back to version if bundleId not provided)
    const serverBundleId = metadata.bundleId || metadata.version;

    console.log('[OTA] Metadata received:');
    console.log('[OTA]   appId:', metadata.appId);
    console.log('[OTA]   channel:', metadata.channel);
    console.log('[OTA]   version (APK):', metadata.version);
    console.log('[OTA]   bundleId (OTA):', serverBundleId);
    console.log('[OTA]   bundleUrl:', metadata.bundleUrl);

    // Step 2: Validate metadata
    console.log('');
    console.log('[OTA] STEP 2: Validating metadata...');

    if (metadata.appId !== 'com.polosys.app') {
      console.error('[OTA] VALIDATION FAILED: App ID mismatch');
      console.error('[OTA]   Expected: com.polosys.app');
      console.error('[OTA]   Received:', metadata.appId);
      return { available: false, error: 'App ID mismatch' };
    }

    if (metadata.channel !== 'development' && metadata.channel !== 'production') {
      console.error('[OTA] VALIDATION FAILED: Channel mismatch');
      console.error('[OTA]   Expected: development or production');
      console.error('[OTA]   Received:', metadata.channel);
      return { available: false, error: 'Channel mismatch' };
    }

    if (!metadata.version || !metadata.bundleUrl) {
      console.error('[OTA] VALIDATION FAILED: Missing version or bundleUrl');
      return { available: false, error: 'Invalid metadata' };
    }

    console.log('[OTA] Metadata validation PASSED');

    // Step 3: Compare bundleIds (OTA version identifier)
    console.log('');
    console.log('[OTA] STEP 3: Comparing bundle IDs...');

    const currentBundle = await getCurrentBundleInfoAsync();
    // Use bundleId for comparison, fallback to version for backward compatibility
    const currentBundleId = currentBundle?.bundleId || currentBundle?.version || '0.0.0';

    console.log('[OTA]   Current bundleId:', currentBundleId);
    console.log('[OTA]   Server bundleId:', serverBundleId);

    // Compare bundleIds - if they're different and server is newer, update is available
    if (currentBundleId === serverBundleId) {
      console.log('[OTA] Already on latest bundle');
      console.log('========================================');
      return { available: false };
    }

    // Check if server bundleId is actually newer
    if (!isNewerBundleId(serverBundleId, currentBundleId)) {
      console.log('[OTA] Server bundle is not newer');
      console.log('========================================');
      return { available: false };
    }

    console.log('[OTA] NEW BUNDLE AVAILABLE!');

    // Step 4: Check if already downloaded
    console.log('');
    console.log('[OTA] STEP 4: Checking pending downloads...');

    const pendingBundle = await getPendingBundleAsync();
    const pendingBundleId = pendingBundle?.bundleId || pendingBundle?.version || null;
    console.log('[OTA]   Pending bundleId:', pendingBundleId || 'none');

    if (pendingBundleId === serverBundleId) {
      console.log('[OTA] Update already downloaded, pending restart');
      console.log('========================================');
      return { available: true, version: metadata.version, downloaded: true };
    }

    // Step 5: Prepare directories
    console.log('');
    console.log('[OTA] STEP 5: Preparing directories...');
    await ensureBundleDir();

    // Step 6: Download bundle
    console.log('');
    console.log('[OTA] STEP 6: Downloading bundle...');

    // Convert bundle URL to full GitHub raw URL if needed
    const bundleDownloadUrl = getBundleUrl(metadata.bundleUrl);
    console.log('[OTA] Bundle download URL:', bundleDownloadUrl);
    const zipBase64 = await downloadFile(bundleDownloadUrl, onProgress);

    // Step 7: Save ZIP file
    console.log('');
    console.log('[OTA] STEP 7: Saving ZIP file...');

    const zipPath = `${BUNDLE_DIR}/temp_${serverBundleId}.zip`;
    await Filesystem.writeFile({
      path: zipPath,
      data: zipBase64,
      directory: Directory.Data
    });
    console.log('[OTA] ZIP saved to:', zipPath);

    // Step 8: Extract ZIP
    console.log('');
    console.log('[OTA] STEP 8: Extracting ZIP...');

    const extractPath = `${BUNDLE_DIR}/${serverBundleId}`;

    const zipUri = await Filesystem.getUri({
      path: zipPath,
      directory: Directory.Data
    });
    const extractUri = await Filesystem.getUri({
      path: extractPath,
      directory: Directory.Data
    });

    console.log('[OTA]   ZIP URI:', zipUri.uri);
    console.log('[OTA]   Extract URI:', extractUri.uri);

    await extractZip(zipUri.uri, extractUri.uri);

    // Step 9: Delete temp ZIP
    console.log('');
    console.log('[OTA] STEP 9: Cleaning up temp ZIP...');

    await Filesystem.deleteFile({
      path: zipPath,
      directory: Directory.Data
    });
    console.log('[OTA] Temp ZIP deleted');

    // Step 10: Verify extraction
    console.log('');
    console.log('[OTA] STEP 10: Verifying extraction...');

    try {
      const stat = await Filesystem.stat({
        path: `${extractPath}/index.html`,
        directory: Directory.Data
      });
      console.log('[OTA] index.html found, size:', stat.size);
    } catch {
      console.error('[OTA] VERIFICATION FAILED: index.html not found');
      throw new Error('Bundle extraction verification failed - index.html not found');
    }

    // Step 11: Set as pending bundle AND set WebView path for next restart
    console.log('');
    console.log('[OTA] STEP 11: Setting pending bundle...');

    const bundlePath = await getBundlePath(serverBundleId);
    const newBundleInfo: BundleInfo = {
      version: metadata.version,      // APK version for display
      bundleId: serverBundleId,       // OTA bundle identifier for comparison
      path: bundlePath,
      timestamp: Date.now()
    };

    await setPendingBundleAsync(newBundleInfo);
    console.log('[OTA] Pending bundle set:', newBundleInfo);

    // IMPORTANT: Set the WebView path in native SharedPreferences
    // This is what MainActivity.loadOTABundle() reads on app restart
    console.log('[OTA] Setting WebView path for next restart...');
    const { OTAPlugin } = await import('./otaPlugin');
    await OTAPlugin.setWebViewPath({ path: bundlePath });
    console.log('[OTA] WebView path set to:', bundlePath);

    // Step 12: Cleanup old bundles
    console.log('');
    console.log('[OTA] STEP 12: Cleaning up old bundles...');

    const keepBundleIds = [currentBundleId, serverBundleId].filter(v => v && v !== '0.0.0');
    await cleanupOldBundles(keepBundleIds);

    console.log('');
    console.log('========================================');
    console.log('[OTA] UPDATE DOWNLOADED SUCCESSFULLY!');
    console.log('[OTA] Version:', metadata.version);
    console.log('[OTA] Restart app to apply');
    console.log('========================================');

    return { available: true, version: metadata.version, downloaded: true };

  } catch (err) {
    console.error('');
    console.error('========================================');
    console.error('[OTA] UPDATE FAILED!');
    console.error('[OTA] Error:', err);
    console.error('========================================');
    return { available: false, error: String(err) };
  }
}

// Apply pending update (called on app restart - does NOT force reload)
export async function applyPendingUpdate(forceReload: boolean = false): Promise<boolean> {
  console.log('');
  console.log('[OTA] APPLYING PENDING UPDATE...');

  const pendingBundle = await getPendingBundleAsync();
  if (!pendingBundle) {
    console.log('[OTA] No pending update to apply');
    return false;
  }

  console.log('[OTA] Pending bundle:', pendingBundle);

  try {
    // Update current bundle info
    await setCurrentBundleInfoAsync(pendingBundle);
    await setPendingBundleAsync(null);

    console.log('[OTA] Bundle info updated');

    // Set WebView path via native plugin
    if (Capacitor.isNativePlatform()) {
      const { OTAPlugin } = await import('./otaPlugin');
      await OTAPlugin.setWebViewPath({ path: pendingBundle.path });
      console.log('[OTA] WebView path set to:', pendingBundle.path);

      // Only reload if explicitly requested
      if (forceReload) {
        console.log('[OTA] Reloading app...');
        window.location.reload();
      } else {
        console.log('[OTA] Update will be applied on next app restart');
      }
    }

    return true;
  } catch (err) {
    console.error('[OTA] Failed to apply update:', err);
    return false;
  }
}

// Reset to default bundle
export async function resetToDefaultBundle(): Promise<void> {
  console.log('[OTA] Resetting to default bundle...');

  localStorage.removeItem(CURRENT_BUNDLE_KEY);
  localStorage.removeItem(PENDING_BUNDLE_KEY);

  if (Capacitor.isNativePlatform()) {
    try {
      await Preferences.remove({ key: CURRENT_BUNDLE_KEY });
      await Preferences.remove({ key: PENDING_BUNDLE_KEY });
    } catch (err) {
      console.warn('[OTA] Failed to clear native Preferences:', err);
    }

    const { OTAPlugin } = await import('./otaPlugin');
    await OTAPlugin.resetWebViewPath();
    console.log('[OTA] WebView path reset');

    window.location.reload();
  }
}

// Initialize OTA on app startup
// This function should be called when the app starts to:
// 1. Promote pending bundle to current bundle (after restart with new bundle loaded)
// 2. Log current OTA status
export async function initOTA(): Promise<void> {
  console.log('');
  console.log('[OTA] INITIALIZING OTA...');
  console.log('[OTA] Platform:', Capacitor.getPlatform());

  if (!Capacitor.isNativePlatform()) {
    console.log('[OTA] Skipping - not native platform');
    return;
  }

  // Check for pending updates (already downloaded, waiting to be promoted to current)
  // IMPORTANT: Use async version to read from native Preferences (persists across WebView changes)
  const pendingBundle = await getPendingBundleAsync();
  if (pendingBundle) {
    console.log('[OTA] Found pending bundle:', pendingBundle.bundleId);
    console.log('[OTA] Promoting pending bundle to current bundle...');

    // Move pending bundle to current bundle (the app has restarted with this bundle)
    await setCurrentBundleInfoAsync(pendingBundle);
    await setPendingBundleAsync(null);

    console.log('[OTA] Bundle promotion complete. Current bundleId:', pendingBundle.bundleId);
    return;
  }

  // Log current status
  const currentBundle = await getCurrentBundleInfoAsync();
  if (currentBundle) {
    console.log('[OTA] Current bundleId:', currentBundle.bundleId);
  } else {
    console.log('[OTA] No OTA bundle applied - using built-in APK version');
  }
}

// Initialize OTA with background check (for auto-update mode)
export async function initOTAWithBackgroundCheck(): Promise<void> {
  console.log('');
  console.log('[OTA] INITIALIZING OTA WITH BACKGROUND CHECK...');
  console.log('[OTA] Platform:', Capacitor.getPlatform());

  if (!Capacitor.isNativePlatform()) {
    console.log('[OTA] Skipping - not native platform');
    return;
  }

  // First, promote any pending bundle to current (app has restarted with new bundle)
  const pendingBundle = await getPendingBundleAsync();
  if (pendingBundle) {
    console.log('[OTA] Found pending bundle:', pendingBundle.bundleId);
    console.log('[OTA] Promoting pending bundle to current bundle...');

    await setCurrentBundleInfoAsync(pendingBundle);
    await setPendingBundleAsync(null);

    console.log('[OTA] Bundle promotion complete. Current bundleId:', pendingBundle.bundleId);
    // Don't check for new updates immediately after applying one
    return;
  }

  // Check for new updates in background (only if auto-update enabled)
  console.log('[OTA] Checking for updates in background...');
  checkLiveUpdate()
    .then(result => {
      console.log('[OTA] Background check complete:', result);
      if (result.available && result.downloaded) {
        console.log('[OTA] Update ready! Restart to apply version:', result.version);
      } else if (result.error) {
        console.error('[OTA] Background check error:', result.error);
      } else {
        console.log('[OTA] No update available');
      }
    })
    .catch(err => {
      console.error('[OTA] Background check FAILED:', err);
    });
}

// Mark bundle as working (for rollback protection)
export async function markBundleAsWorking(): Promise<void> {
  const currentBundle = await getCurrentBundleInfoAsync();
  if (currentBundle) {
    console.log('[OTA] Bundle marked as working:', currentBundle.bundleId);
  }
}

// Get OTA status (async version)
export async function getOTAStatus(): Promise<{
  currentVersion: string | null;
  currentBundleId: string | null;
  pendingVersion: string | null;
  pendingBundleId: string | null;
  isNative: boolean;
}> {
  const currentBundle = await getCurrentBundleInfoAsync();
  const pendingBundle = await getPendingBundleAsync();
  const status = {
    currentVersion: currentBundle?.version || null,
    currentBundleId: currentBundle?.bundleId || null,
    pendingVersion: pendingBundle?.version || null,
    pendingBundleId: pendingBundle?.bundleId || null,
    isNative: Capacitor.isNativePlatform()
  };
  console.log('[OTA] Status:', status);
  return status;
}

// Restart the app (close and relaunch) - for applying OTA updates
export async function restartApp(): Promise<void> {
  console.log('[OTA] Restarting app to apply update...');

  if (!Capacitor.isNativePlatform()) {
    console.log('[OTA] Not native platform, using window.location.reload()');
    window.location.reload();
    return;
  }

  try {
    const { OTAPlugin } = await import('./otaPlugin');
    await OTAPlugin.restartApp();
  } catch (err) {
    console.error('[OTA] Failed to restart app:', err);
    // Fallback to reload
    window.location.reload();
  }
}

// Built-in app version - injected by Vite at build time from package.json
declare const __APP_VERSION__: string;
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';

export interface VersionInfo {
  builtInVersion: string;        // APK version from package.json (e.g., "10.0.3")
  currentBundleId: string | null; // Current OTA bundleId if OTA applied (e.g., "10.0.3-ota.1")
  effectiveVersion: string;       // What to display as current version (bundleId if OTA, else builtIn)
  serverVersion: string | null;   // Server's bundleId (e.g., "10.0.3-ota.2")
  pendingVersion: string | null;  // Pending bundleId waiting to be applied
  updateAvailable: boolean;
  updateReady: boolean;
  isNative: boolean;
}

// Check version info
export async function checkVersionInfo(): Promise<VersionInfo> {
  console.log('');
  console.log('[OTA] CHECKING VERSION INFO...');

  // IMPORTANT: Use async versions to read from native Preferences (persists across WebView changes)
  const currentBundle = await getCurrentBundleInfoAsync();
  const pendingBundle = await getPendingBundleAsync();
  const isNative = Capacitor.isNativePlatform();

  const builtInVersion = APP_VERSION;
  // Use bundleId for tracking (e.g., "10.0.3-ota.1"), not just APK version
  const currentBundleId = currentBundle?.bundleId || null;
  // Effective version = current bundleId (if OTA applied) OR built-in APK version
  const effectiveVersion = currentBundleId || builtInVersion;
  const pendingVersion = pendingBundle?.bundleId || null;

  let serverVersion: string | null = null;
  let updateAvailable = false;

  try {
    // Use GitHub API headers for private repo access
    const headers = getGitHubHeaders();
    const res = await fetch(METADATA_URL, {
      cache: 'no-store',
      headers
    });
    if (res.ok) {
      // Parse GitHub API response (base64 encoded) or raw content
      const text = await parseGitHubContent(res);
      const cleanJson = sanitizeJson(text);
      const metadata: OTAMetadata = JSON.parse(cleanJson);
      // Accept both 'development' and 'production' channels
      if (metadata.appId === 'com.polosys.app' && (metadata.channel === 'development' || metadata.channel === 'production')) {
        serverVersion = metadata.bundleId || metadata.version;
        // Compare bundleIds: current effective version vs server version
        updateAvailable = isNewerBundleId(serverVersion, effectiveVersion);
      }
    }
  } catch (err) {
    console.warn('[OTA] Failed to fetch server version:', err);
  }

  // Update is ready if pending version exists and is newer than current
  const updateReady = pendingVersion !== null && isNewerBundleId(pendingVersion, effectiveVersion);

  const info: VersionInfo = {
    builtInVersion,
    currentBundleId,
    effectiveVersion,
    serverVersion,
    pendingVersion,
    updateAvailable,
    updateReady,
    isNative
  };

  console.log('[OTA] Version Info:');
  console.log('  Built-in version:    ', builtInVersion);
  console.log('  Current bundleId:    ', currentBundleId || '(none - using built-in)');
  console.log('  Effective version:   ', effectiveVersion);
  console.log('  Server version:      ', serverVersion || '(unavailable)');
  console.log('  Pending version:     ', pendingVersion || '(none)');
  console.log('  Update available:    ', updateAvailable ? 'YES' : 'NO');
  console.log('  Update ready:        ', updateReady ? 'YES' : 'NO');
  console.log('  Native platform:     ', isNative ? 'YES' : 'NO');

  return info;
}
