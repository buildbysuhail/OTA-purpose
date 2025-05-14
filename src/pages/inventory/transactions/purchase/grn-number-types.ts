export interface LoadData {
  formType?: any;
  vPrefix?: any;
  vNumber?: number | string;
}

export interface UserConfig {
  inputBoxStyle?: string;
}

export interface GrnNumberData {
  userConfig?: UserConfig;
  loadData?: LoadData;
  // Add other fields if needed
}

export const initialGrnNumber: GrnNumberData = {
  userConfig: {
    inputBoxStyle: "default", // or whatever default
  },
  loadData: {
    formType: "",
    vPrefix: "",
    vNumber: "",
  },
};
