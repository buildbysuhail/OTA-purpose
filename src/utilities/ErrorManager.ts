import Cookies from "js-cookie";
import SBToast from "../components/ERPComponents/erp-toast";
import HttpCodeMessages from "./HttpCodeMessages";

const ErrorManager = {
  
  handle(error: any) {
    
    var msg = "";
    console.log(`ErrorManager,  : error?.response `, error?.response);
    if (error.toJSON().message === "Network Error") {
      SBToast.show("Network Error, No Internet Connection", "error");
      return;
    }

    if (error?.response) {
      // Request made and server responded
      const url = error?.config?.url;
      console.log(`ErrorManager,  : url`, url);
      if (error?.response?.status >= 500) {
        const codeMsg = HttpCodeMessages[error?.response?.status] || "Servre Error";
        msg = error?.response?.data?.message || `${codeMsg}: Something went wrong, Please try again later`;
        SBToast.show(msg, "error");
        return;
      }

      if (error?.response?.status == 400) {
        const codeMsg = HttpCodeMessages[error?.response?.status] || "Bad Request";
         msg = error?.response?.data?.message || `${codeMsg}: Something went wrong, Please try again later`;
        const msgKeys = Object.keys(error?.response?.data);
        console.log(`ErrorManager,  :  msgKeys `, msgKeys);
        if (msgKeys?.length > 0) {
          msgKeys.forEach((key) => {
            const msgData = error?.response?.data?.[key];
            const msg = typeof msgData === "string" ? msgData : (msgData?.[0] as string);
            msg?.toLowerCase()?.includes(key?.toLowerCase()) ? SBToast.show(msg, "error") : SBToast.show(`${key} : ${msg}`, "error");
          });
          return;
        }
        SBToast.show(msg, "error");
        return;
      }

      if (error?.response?.status === 401) {
        msg = "You are not authorized to perform this action.\nPlease login again";
        console.log(`ErrorManager,  : url `, url);
        console.log(`ErrorManager,  : error?.response?.data `, error?.response?.data?.detail);
        if (url === "/token/") {
          msg = "Invalid Username or Password";
          msg = error?.response?.data?.detail || msg;
        }
        SBToast.show(msg, "error");
        Cookies.remove("token");
        return;
      }

      if (error?.response?.status === 404) {
        SBToast.show(`Resource doesn't exist`, "error");
        return;
      }

      if (error?.response?.status > 404 || error?.response?.status === 403 || error?.response?.status === 402) {
        const codeMsg = HttpCodeMessages[error?.response?.status] || "Bad Request";
        msg = error?.response?.statusText || `${codeMsg}: Something went wrong, Please try again later`;
        const msgKeys = Object.keys(error?.response?.data);
        if (msgKeys?.length > 0) {
          msgKeys.forEach((key) => {
            const msg = error?.response?.data?.[key];
            msg.includes(key) ? SBToast.show(msg, "error") : SBToast.show(`${key} : ${msg}`, "error");
          });
          return;
        }
        SBToast.show(msg, "error");
        return;
      }

      msg = error?.response?.data?.message;
      msg && SBToast.show(msg, "error");

      if (error?.response?.status >= 300) {
        const codeMsg = HttpCodeMessages[error?.response?.status] || "Bad Request";
        const msg = error?.response?.statusText || `${codeMsg}: Something went wrong, Please try again later`;
        SBToast.show(msg, "error");
      }
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
      msg = error?.message;
      if (error.toJSON().message === "Network Error") {
        SBToast.show("Network Error, Something went wrong", "error");
        return;
      }
      SBToast.show(msg, "error");
      return;
    }
  },
  logOut() {
    Cookies.remove("token");
  },
};

export default ErrorManager;
