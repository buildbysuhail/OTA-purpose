import config from "../config";

export const domain = config.api.APP_API_URL;
export const signupUrl = import.meta.env.VITE_SIGNUP;
export const companyName = import.meta.env.VITE_COMPANY_NAME;

export const cdnUrl = import.meta.env.VITE_CDN_URL;
export const projectName = import.meta.env.VITE_PROJECT_NAME;

console.log(`Urls,  : project_name_data`, projectName);

const Urls = {
  domain,
  upload: "/",
  user: "/user",
  imgBaseUrl: "/",
  host: `${domain}/`,
  baseUrl: `${domain}/api`,

  // Dropdown

  language: "/settings/language/",
  country: "/core/data/countries/",
  state: "/Subscription/auth/MigrateCRMDb/",

  // Auth

  login: "/login/",
  password_reset: "/passwordReset",
  password_reset_confirm: "/resetPassword/",
  social_signup: "/socialSignup",

  // App
  getUserAppSetting: "/User/getUserAppSetting",
  updateUserAppSetting: "/User/updateUserAppSetting",

  // AccountSettings
  updateUserBasicInfo: "/Subscription/Profile/ChangeBasicInfo/",
  getUserBasicInfo: "/Subscription/Profile/GetBasicInfo/"
  
};

export default Urls;
