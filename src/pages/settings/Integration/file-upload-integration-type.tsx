export const initialFileUploadIntegration = {
  validations: {
    provider: null,
    channel: null,
    configJson: null,
  },
  items: [],
  isOk: true,
  item: {
    id: 0,
    branchId: 0,
    provider: 5, 
    channel: 5, 
    configJson: 'string',
    isEnable: true,
  },
};

export interface FileUploadIntegrationData {
  id: number;
  provider: number;
  isDefault?: boolean;
  description?: string;
  name: string;
  channel: number;
  configJson: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset: string;
  };
  isEnable: boolean;
}

export interface information {
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
  cloudName: string;
  file?: File;
}