import { ResponseModel } from "../base/response-model";
import ERPToast from "../components/ERPComponents/erp-toast";

export const handleResponse = (res: any, action?: () => void, failAction?: () => void) => {
  if (res != undefined && res != null) {
    if (res?.isOk != undefined && res?.isOk != null) {
      if (res.isOk) {
        ERPToast.showWith(res?.message, "success");
        action && action();
      } else {
        ERPToast.showWith(res?.message, "warning");
        failAction && failAction();
      }
    }
    else
    {
      if (res.message) {
        ERPToast.showWith(res?.message, "warning"); 
      }
      failAction && failAction();
    }
  }
  else {
    failAction && failAction();
    ERPToast.showWith("Somthing went wrong", "warning");
  }
  
};
