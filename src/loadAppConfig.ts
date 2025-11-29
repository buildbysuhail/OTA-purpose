export type AppConfig = {
  api: {
    APP_API_URL: string;
  };
};

let config: AppConfig | null = null;

export const loadAppConfig = async (): Promise<AppConfig> => {
  if (!config) {
    const response = await fetch('/config.json');
    config = await response.json();
  }
  return config as AppConfig;
};