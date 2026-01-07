import { registerPlugin } from '@capacitor/core';

export interface ExtractZipOptions {
  zipPath: string;
  destPath: string;
}

export interface SetWebViewPathOptions {
  path: string;
}

export interface OTAPluginInterface {
  extractZip(options: ExtractZipOptions): Promise<void>;
  setWebViewPath(options: SetWebViewPathOptions): Promise<void>;
  resetWebViewPath(): Promise<void>;
  getWebViewPath(): Promise<{ path: string | null }>;
  restartApp(): Promise<void>;
}

export const OTAPlugin = registerPlugin<OTAPluginInterface>('OTAPlugin');
