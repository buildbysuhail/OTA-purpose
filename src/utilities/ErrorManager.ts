import Cookies from "js-cookie";
import ERPToast from "../components/ERPComponents/erp-toast";
import HttpCodeMessages from "./HttpCodeMessages";

const ErrorManager = {
  
  handle(error: any) {
    
    var msg = "";
    if (error?.toJSON().message === "Network Error") {
      ERPToast.show("Network Error, No Internet Connection", "error");
      // const json=JSON.stringify(error.toJSON());
      // ERPToast.show(json);
      // ERPToast.show(error, "error");

      // const blob=new Blob([json],{type:'application/json'})
      // const href =  URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = href;
      // link.download = "file.xlsx";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // const json1=JSON.stringify(error);
      // const blob1=new Blob([json1],{type:'application/json'})
      // const href1 =  URL.createObjectURL(blob1);
      // const link1 = document.createElement('a');
      // link1.href = href1;
      // link1.download = "file.xlsx";
      // document.body.appendChild(link1);
      // link1.click();
      // document.body.removeChild(link1);
      return;
    }

    if (error?.response) {
      // Request made and server responded
      const url = error?.config?.url;
      if (error?.response?.status >= 500) {
        const codeMsg = HttpCodeMessages[error?.response?.status] || "Servre Error";
        msg = error?.response?.data?.message || `${codeMsg}: Something went wrong, Please try again later`;
        ERPToast.show(msg, "error");
        return;
      }

      if (error?.response?.status == 400) {
        const codeMsg = HttpCodeMessages[error?.response?.status] || "Bad Request";
         msg = error?.response?.data?.message || `${codeMsg}: Something went wrong, Please try again later`;
        const msgKeys = Object.keys(error?.response?.data);
        if (msgKeys?.length > 0) {
          msgKeys.forEach((key) => {
            const msgData = error?.response?.data?.[key];
            const msg = typeof msgData === "string" ? msgData : (msgData?.[0] as string);
            msg?.toLowerCase()?.includes(key?.toLowerCase()) ? ERPToast.show(msg, "error") : ERPToast.show(`${key} : ${msg}`, "error");
          });
          return;
        }
        ERPToast.show(msg, "error");
        return;
      }

      if (error?.response?.status === 401) {
        msg = "You are not authorized to perform this action.\nPlease login again";
        if (url === "/token/") {
          msg = "Invalid Username or Password";
          msg = error?.response?.data?.detail || msg;
        }
        ERPToast.show(msg, "error");
        // localStorage.removeItem("token");
        return;
      }

      if (error?.response?.status === 404) {
        ERPToast.show(`Resource doesn't exist`, "error");
        return;
      }

      if (error?.response?.status > 404 || error?.response?.status === 403 || error?.response?.status === 402) {
        const codeMsg = HttpCodeMessages[error?.response?.status] || "Bad Request";
        msg = error?.response?.statusText || `${codeMsg}: Something went wrong, Please try again later`;
        const msgKeys = Object.keys(error?.response?.data);
        if (msgKeys?.length > 0) {
          msgKeys.forEach((key) => {
            const msg = error?.response?.data?.[key];
            msg.includes(key) ? ERPToast.show(msg, "error") : ERPToast.show(`${key} : ${msg}`, "error");
          });
          return;
        }
        ERPToast.show(msg, "error");
        return;
      }

      msg = error?.response?.data?.message;
      msg && ERPToast.show(msg, "error");

      if (error?.response?.status >= 300) {
        const codeMsg = HttpCodeMessages[error?.response?.status] || "Bad Request";
        const msg = error?.response?.statusText || `${codeMsg}: Something went wrong, Please try again later`;
        ERPToast.show(msg, "error");
      }
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
      msg = error?.message;
      if (error.toJSON().message === "Network Error") {
        ERPToast.show("Network Error, Something went wrong", "error");
        return;
      }
      ERPToast.show(msg, "error");
      return;
    }
  },
  logOut() {
    localStorage.removeItem("token");
  },
};

export default ErrorManager;
