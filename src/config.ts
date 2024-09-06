interface GoogleConfig {
  API_KEY: string;
  CLIENT_ID: string;
  SECRET: string;
}

interface FacebookConfig {
  APP_ID: string;
}

interface ApiConfig {
  APP_API_URL: string;
}

interface Config {
  google: GoogleConfig;
  facebook: FacebookConfig;
  api: ApiConfig;
}

const config: Config = {
  google: {
    API_KEY: "",
    CLIENT_ID: "",
    SECRET: "",
  },
  facebook: {
    APP_ID: "",
  },
  api: {
    // APP_API_URL: "https://192.65.25.12",
    // APP_API_URL: "https://localhost:7213" 
    APP_API_URL: "https://polosys-001-site1.ctempurl.com"
  },
};

export default config;