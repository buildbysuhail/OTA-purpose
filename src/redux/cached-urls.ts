import config from "../config";
import Urls from "./urls";

export const domain = config.api.APP_API_URL;
export const signupUrl = import.meta.env.VITE_SIGNUP;
export const companyName = import.meta.env.VITE_COMPANY_NAME;

export const cdnUrl = import.meta.env.VITE_CDN_URL;
export const projectName = import.meta.env.VITE_PROJECT_NAME;

const CachedUrls: string[] = [
  Urls.data_acc_ledgers,Urls.data_costcentres
]

export default CachedUrls;
