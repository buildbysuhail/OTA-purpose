const { contextBridge, ipcRenderer } = require("electron");

console.log('[PRELOAD] Script loaded, injecting electron API...');

contextBridge.exposeInMainWorld("electron", {
  appVersion: () => process.version,
  
  // Printer functions
  getPrinters: async () => {
    try {
      console.log('Requesting printers from main process...');
      const printers = await ipcRenderer.invoke('get-printers');
      console.log('Received printers:', printers);
      return printers || [];
    } catch (error) {
      console.error('Error getting printers from main process:', error);
      throw new Error(`Failed to fetch printers: ${error.message}`);
    }
  },

  print: async (options) => {
    try {
      console.log(
        '[PRELOAD-PRINT] Called with printer:',
        options?.printerName,
        'PDF base64 size:',
        options?.pdfBase64?.length,
        'PDF bytes size:',
        options?.pdfBytes?.length
      );
      const result = await ipcRenderer.invoke('silent-print', options);
      console.log('[PRELOAD-PRINT] Result:', result);
      return result;
    } catch (error) {
      console.error('[PRELOAD-PRINT] Error:', error?.message || error);
      throw error;
    }
  }
});

console.log('[PRELOAD] electron API injected successfully');
