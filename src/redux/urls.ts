import config from "../config";
import { getUserSession } from "./slices/auth/UserRights/thunk";

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
  currency: "/core/data/Currencies/",
  industry: "/core/data/Industries/",
  state: "/Subscription/auth/MigrateCRMDb/",

  // Auth

  login: "/login/",
  logout: "/logout/",
  password_reset: "/passwordReset",
  password_reset_confirm: "/resetPassword/",
  social_signup: "/socialSignup",
  set_branch:"/Subscription/Auth/SetBranch",

  // App
  getUserAppSetting: "/User/getUserAppSetting",
  updateUserAppSetting: "/User/updateUserAppSetting",

  // AccountSettings/Profile
  uploadUserImage: "/Subscription/Profile/UploadUserImage/",
  changeEmailRequest_profile: "/Subscription/Profile/ChangeEmailRequest/",
  verifyEmail_profile: "/Subscription/Profile/VerifyEmail/",
  changePhoneRequest_profile: "/Subscription/Profile/ChangePhoneRequest/",
  changePhone: "/Subscription/Profile/ChangePhone/",
  verifyPhone_profile: "/Subscription/Profile/VerifyPhone/",
  updateUserBasicInfo: "/Subscription/Profile/ChangeBasicInfo/",
  getUserBasicInfo: "/Subscription/Profile/GetBasicInfo/",
  getEmail_profile: "/Subscription/Profile/GetEmail/",
  getPhone_profile: "/Subscription/Profile/GetPhone/",
  getImage_profile: "/Subscription/Profile/GetProfileImage/",
  getUserSession: "/Core/LoginSessions/GetAllAsync",

  logoutUserSession: "/Core/LoginSessions/InActiveSession",
     

uploadCompanyLogo: "/Subscription/WorkSpace/UploadCompanyLogo/",
changeEmailRequest_workspace : "/Subscription/WorkSpace/ChangeEmailRequest/",
verifyEmail_workspace : "/Subscription/WorkSpace/VerifyEmail/",
updateCompanyEmail_workspace : "/Subscription/WorkSpace/UpdateCompanyEmailAsync/",
UpdateCompanyPhone_workspace: "/Subscription/WorkSpace/UpdateCompanyPhoneAsync/",
changePhoneRequest_workspace : "/Subscription/WorkSpace/ChangePhoneRequest/",
changePhone_workspace : "/Subscription/WorkSpace/UpdateCompanyPhoneAsync/",
verifyPhone_workspace : "/Subscription/WorkSpace/VerifyPhone/",
changeBasicInfo_workspace : "/Subscription/WorkSpace/ChangeBasicInfo/",
changeAddress_workspace : "/Subscription/WorkSpace/ChangeAddress/",
getBasicInfo_workspace : "/Subscription/WorkSpace/GetBasicInfo/",
getEmail_workspace : "/Subscription/WorkSpace/GetEmail/",
getPhone_workspace : "/Subscription/WorkSpace/GetPhone/",
getLogo_workspace : "/Subscription/WorkSpace/GetLogo/",
getAddress_workspace : "/Subscription/WorkSpace/GetAddress/",
delete_workspace:"/Subscription/WorkSpace/DeleteWorkspace",
get_members:"/Subscription/WorkSpace/GetMembers",
  // AccountSettings/Security
  updatePassword: "/Subscription/AccountSettings/Security/ResetPassword/",

  // AccountSettings/Preferences
  updateLanguage: "/Core/Preferences/UpdateLanguage/",
  updatePreference: "/Core/Preferences/UpdatePreference/",
  updateDateRegion: "/Core/Preferences/UpdateDateRegion/",
  updateUserThemes: "/Core/Preferences/UpdateUserThemes/",
  getLanguage: "/Core/Preferences/GetLanguage/",
  getPreference: "/Core/Preferences/GetPreference/",
  getDateRegion: "/Core/Preferences/GetDateRegion/",
  getUserThemes: "/Core/Preferences/GetUserThemes/",

  // AccountSettings/UserBranches
  userBranches: "/Core/UserBranches/",
  deleteUserBranches: "/Core/UserBranches/{Id}/",
 //setting
    //setting/userManagement
    getUserSubscriped:"/Subscription/User/GetUsersForGrid",
    getUserTypes:"/Core/UserType/GetUsersTypeForGrid",
    postUserTypes:"/Core/UserType/AddUserType",
    //setting/Administrations
    getCompayProfiles:"/Core/CompanyProfile/GetCompanyProfile",
    postCompayProfiles:"/Core/CompanyProfile/AddCompanyProfile",
    postBankPosSettings:"/Core/BankPOS/AddCounter",
    //setting/deleteinactive transactions
    deleteInactiveTransactions:"/Core/DeleteInActive/DeleteInActive",

    //setting/system
    getSystemCounters:"/Core/Counter/GetCounterForGrid"
};

export default Urls;
