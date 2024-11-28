export interface ApplicationBackupSettings {
    backupMethods: string;
    backUpPath: string;
    backupDuration: number;
    compressBackupFile: boolean;
  }
  
  export const ApplicationBackupSettingsInitialState: ApplicationBackupSettings = {
    backupMethods: "",
    backUpPath: "",
    backupDuration: 0,
    compressBackupFile: false,
  };