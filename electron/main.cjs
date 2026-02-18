const { autoUpdater } = require("electron-updater");
const { app, BrowserWindow, protocol, session, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const { execSync, execFile } = require("child_process");
const os = require("os");

console.log("APP PATH:", process.cwd());

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});

// Allow file access
app.commandLine.appendSwitch("allow-file-access-from-files");

// Register custom protocol BEFORE ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function createWindow() {
  const isDev = !app.isPackaged;

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, 'electron\favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
    },
  });

  if (isDev) {
    // Adjust dev URL as needed
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "http://192.168.20.3:5173");
  } else {
    mainWindow.loadURL("app://./index.html");
  }

  return mainWindow;
}

let mainWindow = null;

app.whenReady().then(() => {
  const distPath = path.join(app.getAppPath(), "dist");

  // Fix CORS for API (optional) - echo request Origin or fallback to dev server
  const ses = session.defaultSession;
  ses.webRequest.onHeadersReceived((details, callback) => {
    let headers = details.responseHeaders || {};
    if (details.url.startsWith("https://api.poldev.work/")) {
      // Determine request origin header (support different casing)
      const reqHeaders = details.requestHeaders || {};
      const reqOrigin = reqHeaders['Origin'] || reqHeaders['origin'] || 'http://192.168.20.3:5173';

      // Remove any existing CORS headers (case-insensitive) to avoid multiple values
      const cleanedHeaders = {};
      for (const key of Object.keys(headers)) {
        if ([
          'access-control-allow-origin',
          'access-control-allow-credentials',
          'access-control-allow-methods',
          'access-control-allow-headers',
          'access-control-max-age'
        ].includes(key.toLowerCase())) {
          continue; // skip existing CORS headers
        }
        cleanedHeaders[key] = headers[key];
      }

      // Set comprehensive CORS headers to allow all custom headers from client
      cleanedHeaders['Access-Control-Allow-Origin'] = [reqOrigin];
      cleanedHeaders['Access-Control-Allow-Credentials'] = ['true'];
      cleanedHeaders['Access-Control-Allow-Methods'] = ['GET,POST,PUT,DELETE,OPTIONS,PATCH'];
      // Allow all common and custom headers - use wildcard-like approach with specific headers
      cleanedHeaders['Access-Control-Allow-Headers'] = [
        'Content-Type, Authorization, X-Requested-With, X-Client-Date, X-Software-Date, Accept, x-custom-header'
      ];
      cleanedHeaders['Access-Control-Max-Age'] = ['86400'];

      headers = cleanedHeaders;
    }
    callback({ responseHeaders: headers });
  });

  protocol.registerFileProtocol("app", (request, callback) => {
    let urlPath = request.url.replace("app://./", "");

    if (!urlPath || urlPath === "/") {
      urlPath = "index.html";
    }

    const filePath = path.join(distPath, urlPath);

    callback({
      path: fs.existsSync(filePath)
        ? filePath
        : path.join(distPath, "index.html"), // fallback for React routes
    });
  });

  mainWindow = createWindow();
});

// Helper function to get printers using system command
function getPrintersFromSystem() {
  try {
    if (os.platform() === 'win32') {
      // Windows: Use PowerShell to get printers
      const command = `Get-Printer | Select-Object -Property Name, DriverName, Shared | ConvertTo-Json`;
      const result = execSync(`powershell -Command "${command}"`, { encoding: 'utf-8' });
      
      if (!result || result.trim() === '') {
        return [];
      }
      
      try {
        // Handle both single printer (object) and multiple printers (array)
        const parsed = JSON.parse(result);
        const printerList = Array.isArray(parsed) ? parsed : [parsed];
        
        return printerList.map(printer => ({
          name: printer.Name,
          displayName: printer.Name,
          description: printer.DriverName || '',
          isDefault: false,
          isNetwork: printer.Shared || false
        }));
      } catch (parseErr) {
        console.error('Error parsing printer JSON:', parseErr);
        return [];
      }
    } else if (os.platform() === 'darwin') {
      // macOS: Use lpstat
      const result = execSync('lpstat -p -d', { encoding: 'utf-8' });
      const printers = [];
      const lines = result.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('printer')) {
          const name = line.split(/\s+/)[1];
          if (name) {
            printers.push({
              name: name,
              displayName: name,
              description: '',
              isDefault: line.includes('default'),
              isNetwork: false
            });
          }
        }
      }
      return printers;
    } else {
      // Linux: Use lpstat
      const result = execSync('lpstat -p -d', { encoding: 'utf-8' });
      const printers = [];
      const lines = result.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('printer')) {
          const name = line.split(/\s+/)[1];
          if (name) {
            printers.push({
              name: name,
              displayName: name,
              description: '',
              isDefault: line.includes('default'),
              isNetwork: false
            });
          }
        }
      }
      return printers;
    }
  } catch (error) {
    console.error('Error getting printers from system:', error);
    return [];
  }
}

function printPdfDirectWindows(pdfPath, printerName) {
  return new Promise((resolve, reject) => {
    const escapedPdfPath = String(pdfPath || "").replace(/'/g, "''");
    const escapedPrinter = String(printerName || "").replace(/'/g, "''");

    const psScript = `
$pdfPath = '${escapedPdfPath}'
$printer = '${escapedPrinter}'
if (-not (Test-Path $pdfPath)) { throw "PDF file not found: $pdfPath" }
if ([string]::IsNullOrWhiteSpace($printer)) { throw "Printer name is required for direct print." }
$hasPrintJobCmd = $null -ne (Get-Command Get-PrintJob -ErrorAction SilentlyContinue)
$beforeIds = @()
if ($hasPrintJobCmd) {
  try { $beforeIds = @(Get-PrintJob -PrinterName $printer -ErrorAction Stop | Select-Object -ExpandProperty ID) } catch {}
}
$p = Start-Process -FilePath $pdfPath -Verb PrintTo -ArgumentList ('"' + $printer + '"') -PassThru
$jobDetected = $false
for ($i = 0; $i -lt 24; $i++) {
  Start-Sleep -Milliseconds 250
  if ($hasPrintJobCmd) {
    try {
      $currentIds = @(Get-PrintJob -PrinterName $printer -ErrorAction Stop | Select-Object -ExpandProperty ID)
      foreach ($id in $currentIds) {
        if ($beforeIds -notcontains $id) { $jobDetected = $true; break }
      }
      if ($jobDetected) { break }
    } catch {}
  }
  if ($p -and $p.HasExited -and $i -ge 6) { break }
}
if ($jobDetected) {
  Write-Output "PRINT_JOB_DETECTED"
} elseif ($p -and -not $p.HasExited) {
  Write-Output "PRINT_PROCESS_RUNNING"
} else {
  Write-Output "PRINT_PROCESS_EXITED_NO_JOB"
}
`;

    execFile(
      "powershell",
      ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", psScript],
      { windowsHide: true, timeout: 20000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message || "Windows direct print failed"));
          return;
        }
        resolve({ success: true, stdout: stdout?.trim() || "" });
      }
    );
  });
}

const PT_TO_MICRONS = 352.778;
const toMicronsFromPt = (pt) => {
  const numeric = Number(pt);
  if (!Number.isFinite(numeric) || numeric <= 0) return undefined;
  return Math.round(numeric * PT_TO_MICRONS);
};

function getThermalRollWidthMicrons(printerName) {
  const name = (printerName || '').toLowerCase();
  if (name.includes('58')) return 58000;
  if (name.includes('72')) return 72000;
  if (name.includes('76')) return 76000;
  // Do not force TM-T88 width. Driver/paper profiles vary and forced width can offset output.
  if (name.includes('80')) return 80000;
  return undefined;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForPdfRender(win) {
  // Chromium PDF viewer can finish navigation before page content is actually ready to print.
  // A short stabilization wait prevents blank/strip prints on thermal devices.
  await delay(1500);
  try {
    await win.webContents.executeJavaScript("document.readyState");
  } catch (e) {
    // Ignore JS probing failures from built-in PDF viewer context.
  }
}

function getPdfMediaBoxSizePt(pdfFilePath) {
  try {
    const raw = fs.readFileSync(pdfFilePath);
    const text = raw.toString('latin1');
    const mediaBoxRegex = /\/MediaBox\s*\[\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\]/;
    const match = text.match(mediaBoxRegex);
    if (!match) return null;

    const x1 = Number(match[1]);
    const y1 = Number(match[2]);
    const x2 = Number(match[3]);
    const y2 = Number(match[4]);
    const widthPt = Math.abs(x2 - x1);
    const heightPt = Math.abs(y2 - y1);

    if (!Number.isFinite(widthPt) || !Number.isFinite(heightPt) || widthPt <= 0 || heightPt <= 0) {
      return null;
    }
    return { widthPt, heightPt };
  } catch (error) {
    return null;
  }
}

// IPC Handlers for Printer Management
ipcMain.handle('get-printers', async (event) => {
  try {
    console.log('Getting printers...');
    
    // Try new Electron API first
    if (mainWindow && mainWindow.webContents && typeof mainWindow.webContents.getPrinters === 'function') {
      try {
        const printers = await mainWindow.webContents.getPrinters();
        if (printers && printers.length > 0) {
          console.log('Printers from Electron API:', printers);
          return printers.map(printer => ({
            name: printer.name,
            displayName: printer.displayName || printer.name,
            description: printer.description || '',
            isDefault: printer.isDefault || false,
            isNetwork: printer.isNetwork || false
          }));
        }
      } catch (electronErr) {
        console.warn('Electron API not available, falling back to system command:', electronErr.message);
      }
    }
    
    // Fallback to system command
    const printers = getPrintersFromSystem();
    console.log('Printers from system command:', printers);
    
    if (!printers || printers.length === 0) {
      console.warn('No printers found on system');
    }
    
    return printers;
  } catch (error) {
    console.error('Error getting printers:', error);
    throw new Error(`Failed to get printers: ${error.message}`);
  }
});

ipcMain.handle('silent-print', async (event, options) => {
  console.log('[IPC] silent-print handler called');
  try {
    console.log('[IPC] Handler started, mainWindow exists:', !!mainWindow);
    if (!mainWindow) {
      throw new Error('Main window not available');
    }

    const { template, data, printerName, pdfBase64, pdfBytes, pdfPath, layout } = options || {};
    console.log('[IPC] Options received:', {
      hasPdfBase64: !!pdfBase64,
      hasPdfBytes: !!pdfBytes,
      hasPdfPath: !!pdfPath,
      printerName,
    });
    const normalizedPrinter = (printerName || '').toLowerCase();
    const isThermalPrinter =
      normalizedPrinter.includes('tm-') ||
      normalizedPrinter.includes('receipt') ||
      normalizedPrinter.includes('pos') ||
      normalizedPrinter.includes('epson');
    const layoutWidthMicrons = toMicronsFromPt(layout?.widthPt);
    const layoutHeightMicrons = toMicronsFromPt(layout?.heightPt);
    const configuredRollWidth = getThermalRollWidthMicrons(printerName);
    console.log('[PRINT] Layout metadata:', {
      pageSize: layout?.pageSize,
      isAutoHeight: layout?.isAutoHeight,
      widthPt: layout?.widthPt,
      heightPt: layout?.heightPt,
      layoutWidthMicrons,
      layoutHeightMicrons,
      configuredRollWidth,
    });

    const buildPrintSettings = (pdfSizePt) => {
      const pdfWidthMicrons = toMicronsFromPt(pdfSizePt?.widthPt);
      const pdfHeightMicrons = toMicronsFromPt(pdfSizePt?.heightPt);

      if (isThermalPrinter) {
        // Prefer PDF's own physical size first. Only shrink when a known explicit roll width is available.
        const sourceWidthMicrons = pdfWidthMicrons || layoutWidthMicrons || configuredRollWidth;
        const sourceHeightMicrons = pdfHeightMicrons || layoutHeightMicrons;
        const maxRollWidthMicrons = configuredRollWidth;

        let targetWidthMicrons = sourceWidthMicrons;
        let targetHeightMicrons = sourceHeightMicrons;
        let downscaleRatio = 1;

        if (maxRollWidthMicrons && sourceWidthMicrons && sourceWidthMicrons > maxRollWidthMicrons) {
          downscaleRatio = maxRollWidthMicrons / sourceWidthMicrons;
          targetWidthMicrons = maxRollWidthMicrons;
          if (sourceHeightMicrons) {
            targetHeightMicrons = Math.round(sourceHeightMicrons * downscaleRatio);
          }
        }

        const scaleFactor = Math.max(35, Math.min(100, Math.round(downscaleRatio * 100)));

        const thermalSettings = {
          silent: true,
          printBackground: true,
          deviceName: printerName,
          margins: {
            marginType: 1,
            topMargin: 0,
            bottomMargin: 0,
            leftMargin: 0,
            rightMargin: 0,
          },
          landscape: false,
          scaleFactor,
          copies: 1,
        };

        if (targetWidthMicrons) {
          // Keep explicit page size for thermal drivers; avoids Chromium default-page clipping.
          const resolvedHeightMicrons =
            targetHeightMicrons || (layout?.isAutoHeight ? 250000 : 400000);
          thermalSettings.pageSize = {
            width: targetWidthMicrons,
            height: Math.max(20000, resolvedHeightMicrons),
          };
        }

        console.log('[PRINT] Thermal sizing resolved:', {
          pdfWidthMicrons,
          pdfHeightMicrons,
          layoutWidthMicrons,
          layoutHeightMicrons,
          configuredRollWidth,
          targetWidthMicrons,
          targetHeightMicrons,
          scaleFactor,
        });

        return thermalSettings;
      }

      if (
        layout &&
        (String(layout?.pageSize || '').toUpperCase() === 'CUSTOM' ||
          String(layout?.pageSize || '').toUpperCase().startsWith('ROLL')) &&
        (pdfWidthMicrons || layoutWidthMicrons)
      ) {
        return {
          silent: true,
          printBackground: true,
          deviceName: printerName,
          margins: {
            marginType: 1,
            topMargin: 0,
            bottomMargin: 0,
            leftMargin: 0,
            rightMargin: 0,
          },
          landscape: false,
          scaleFactor: 100,
          pageSize: {
            width: pdfWidthMicrons || layoutWidthMicrons,
            height: pdfHeightMicrons || layoutHeightMicrons || 400000,
          },
          copies: 1,
        };
      }

      return {
        silent: true,
        printBackground: true,
        deviceName: printerName,
        margins: {
          marginType: 1,
          topMargin: 0,
          bottomMargin: 0,
          leftMargin: 0,
          rightMargin: 0,
        },
        pageSize: 'A4',
        landscape: false,
        copies: 1,
      };
    };

    // If renderer sent raw PDF bytes, write directly and print using the same computed settings path.
    if (pdfBytes) {
      console.log('[IPC] PDF bytes detected, proceeding with direct byte print');
      const buffer = Buffer.isBuffer(pdfBytes) ? pdfBytes : Buffer.from(pdfBytes);
      const tmpFile = path.join(app.getPath('temp'), `polosys-print-${Date.now()}.pdf`);

      try {
        fs.writeFileSync(tmpFile, buffer);
      } catch (writeErr) {
        console.error('Failed to write temp PDF file from bytes:', writeErr);
        throw writeErr;
      }

      const printWin = new BrowserWindow({
        show: false,
        paintWhenInitiallyHidden: true,
        width: 800,
        height: 600,
        webPreferences: {
          contextIsolation: true,
          sandbox: false,
        },
      });

      try {
        if (os.platform() === 'win32' && printerName) {
          console.log('[PRINT] Trying Windows direct PDF print (PrintTo verb) for bytes...');
          try {
            const directResult = await printPdfDirectWindows(tmpFile, printerName);
            console.log('[PRINT] Windows direct print dispatched:', directResult);
            if (
              String(directResult?.stdout || '').includes('PRINT_JOB_DETECTED') ||
              String(directResult?.stdout || '').includes('PRINT_PROCESS_RUNNING')
            ) {
              return { success: true, method: 'windows-printto', pdfPath: tmpFile };
            }
            console.warn('[PRINT] Windows direct print did not confirm a spool job. Falling back to Electron print.');
          } catch (directErr) {
            console.warn('[PRINT] Windows direct print failed for bytes, falling back to Electron print:', directErr.message);
          }
        }

        console.log(`[PRINT] Loading PDF from bytes file: ${tmpFile}`);
        console.log(`[PRINT] Target printer: ${printerName}`);

        await Promise.race([
          printWin.loadURL(`file://${tmpFile}`),
          new Promise((_, reject) => setTimeout(() => reject(new Error('PDF load timed out')), 15000)),
        ]);
        await waitForPdfRender(printWin);
        console.log('[PRINT] PDF loaded in hidden window');

        const pdfSizePt = getPdfMediaBoxSizePt(tmpFile);
        console.log('[PRINT] Parsed PDF page size (pt):', pdfSizePt);
        const printSettings = buildPrintSettings(pdfSizePt);

        console.log('[PRINT] Sending direct-byte print job with settings:', JSON.stringify(printSettings));

        await new Promise((resolve, reject) => {
          let done = false;
          printWin.webContents.print(printSettings, (success, failureReason) => {
            done = true;
            console.log(`[PRINT] Callback received - Success: ${success}, Reason: ${failureReason}`);
            if (success) resolve(true);
            else reject(new Error(failureReason || 'Unknown print error'));
          });

          setTimeout(() => {
            if (!done) reject(new Error('Print operation timed out'));
          }, 30000);
        });

        try { printWin.close(); } catch (e) {}
        console.log('[PRINT] Temp PDF kept for verification at:', tmpFile);
        return { success: true, pdfPath: tmpFile };
      } catch (err) {
        try { printWin.close(); } catch (e) {}
        console.log('[PRINT] Temp PDF kept for debugging at:', tmpFile);
        console.error('[PRINT] Error printing PDF bytes file:', err);
        throw err;
      }
    }

    // If renderer sent a PDF base64, write it to temp and print from a hidden BrowserWindow
    if (pdfBase64) {
      console.log('[IPC] PDF base64 detected, proceeding with print');
      const buffer = Buffer.from(pdfBase64, 'base64');
      const tmpFile = path.join(app.getPath('temp'), `polosys-print-${Date.now()}.pdf`);
      try {
        fs.writeFileSync(tmpFile, buffer);
      } catch (writeErr) {
        console.error('Failed to write temp PDF file:', writeErr);
        throw writeErr;
      }

      // Create a hidden window to load the PDF
      const printWin = new BrowserWindow({
        show: false,
        paintWhenInitiallyHidden: true,
        width: 800,
        height: 600,
        webPreferences: {
          contextIsolation: true,
          sandbox: false,
        },
      });

      try {
        if (os.platform() === 'win32' && printerName) {
          console.log('[PRINT] Trying Windows direct PDF print (PrintTo verb)...');
          try {
            const directResult = await printPdfDirectWindows(tmpFile, printerName);
            console.log('[PRINT] Windows direct print dispatched:', directResult);
            if (
              String(directResult?.stdout || '').includes('PRINT_JOB_DETECTED') ||
              String(directResult?.stdout || '').includes('PRINT_PROCESS_RUNNING')
            ) {
              return { success: true, method: 'windows-printto' };
            }
            console.warn('[PRINT] Windows direct print did not confirm a spool job. Falling back to Electron print.');
          } catch (directErr) {
            console.warn('[PRINT] Windows direct print failed, falling back to Electron print:', directErr.message);
          }
        }

        console.log(`[PRINT] Loading PDF from: ${tmpFile}`);
        console.log(`[PRINT] Target printer: ${printerName}`);

        await Promise.race([
          printWin.loadURL(`file://${tmpFile}`),
          new Promise((_, reject) => setTimeout(() => reject(new Error('PDF load timed out')), 15000)),
        ]);
        await waitForPdfRender(printWin);
        console.log('[PRINT] PDF loaded in hidden window');

        const pdfSizePt = getPdfMediaBoxSizePt(tmpFile);
        console.log('[PRINT] Parsed PDF page size (pt):', pdfSizePt);
        const printSettings = buildPrintSettings(pdfSizePt);

        console.log('[PRINT] Sending print job with settings:', JSON.stringify(printSettings));
        
        let printCompleted = false;
        await new Promise((resolve, reject) => {
          printWin.webContents.print(printSettings, (success, failureReason) => {
            printCompleted = true;
            console.log(`[PRINT] Callback received - Success: ${success}, Reason: ${failureReason}`);
            if (success) {
              console.log('[PRINT] PDF print successful');
              resolve(true);
            }
            else {
              console.error('[PRINT] PDF print failed:', failureReason);
              reject(new Error(failureReason || 'Unknown print error'));
            }
          });

          // Show which window we're printing from
          console.log('[PRINT] Print command sent to Electron WebContents');

          // Increased timeout for thermal printers
          setTimeout(() => {
            if (!printCompleted) {
              console.error('[PRINT] Print operation timed out after 30 seconds');
              reject(new Error('Print operation timed out'));
            }
          }, 30000);
        });

        console.log('[PRINT] Closing print window');
        printWin.close();
        
        // attempt to remove temp file
        try { 
        //   fs.unlinkSync(tmpFile);
        //   console.log('[PRINT] Temp file deleted');
        } catch (e) { 
          console.warn('[PRINT] Could not delete temp file:', e.message);
        }
        
        return { success: true };
      } catch (err) {
        console.error('[PRINT] Error block caught:', err.message);
        try { printWin.close(); } catch (e) {}
        try { fs.unlinkSync(tmpFile); } catch (e) {}
        console.error('[PRINT] Error printing PDF file:', err);
        throw err;
      }
    }

    // If a pdfPath was provided, print that file directly
    if (pdfPath) {
      const absolute = path.isAbsolute(pdfPath) ? pdfPath : path.join(app.getAppPath(), pdfPath);
      const win = new BrowserWindow({
        show: false,
        paintWhenInitiallyHidden: true,
        webPreferences: { contextIsolation: true },
      });
      try {
        if (os.platform() === 'win32' && printerName) {
          console.log('[PRINT] Trying Windows direct PDF print (PrintTo verb)...');
          try {
            const directResult = await printPdfDirectWindows(absolute, printerName);
            console.log('[PRINT] Windows direct print dispatched:', directResult);
            if (
              String(directResult?.stdout || '').includes('PRINT_JOB_DETECTED') ||
              String(directResult?.stdout || '').includes('PRINT_PROCESS_RUNNING')
            ) {
              return { success: true, method: 'windows-printto' };
            }
            console.warn('[PRINT] Windows direct print did not confirm a spool job. Falling back to Electron print.');
          } catch (directErr) {
            console.warn('[PRINT] Windows direct print failed, falling back to Electron print:', directErr.message);
          }
        }

        await Promise.race([
          win.loadURL(`file://${absolute}`),
          new Promise((_, reject) => setTimeout(() => reject(new Error('PDF load timed out')), 15000)),
        ]);
        await waitForPdfRender(win);
        await new Promise((resolve, reject) => {
          const pdfSizePt = getPdfMediaBoxSizePt(absolute);
          console.log('[PRINT] Parsed PDF page size (pt):', pdfSizePt);
          const printSettings = buildPrintSettings(pdfSizePt);
          win.webContents.print(printSettings, (success, failureReason) => {
            if (success) resolve(true);
            else reject(new Error(failureReason || 'Unknown print error'));
          });
          setTimeout(() => reject(new Error('Print operation timed out')), 30000);
        });
        win.close();
        return { success: true };
      } catch (err) {
        try { win.close(); } catch (e) {}
        console.error('Error printing pdfPath:', err);
        throw err;
      }
    }

    // Default behavior: print current mainWindow contents
    console.log(`Sending print job to printer: ${printerName}`);
    const printSettings = {
      silent: true,
      printBackground: true,
      deviceName: printerName,
      margins: { marginType: 1 },
      pageSize: 'A4'
    };

    return new Promise((resolve, reject) => {
      mainWindow.webContents.print(printSettings, (success, failureReason) => {
        if (success) {
          console.log('Print job sent successfully');
          resolve({ success: true, message: 'Print job sent successfully' });
        } else {
          console.error('Silent print failed:', failureReason);
          reject(new Error(`Print failed: ${failureReason}`));
        }
      });

      setTimeout(() => reject(new Error('Print operation timed out')), 30000);
    });
  } catch (error) {
    console.error('Error during silent print:', error);
    throw error;
  }
});
