import { ResponseModel } from "../base/response-model";
import SBToast from "../components/ERPComponents/erp-toast";

export const handleResponse = (res: any, action?: () => void, failAction?: () => void) => {
  if (res != undefined && res != null) {
    if (res?.isOk != undefined && res?.isOk != null) {
      if (res.isOk) {
        SBToast.showWith(res?.message, "success");
        action && action();
      } else {
        SBToast.showWith(res?.message, "warning");
        failAction && failAction();
      }
    }
    else
    {
      if (res.message) {
        SBToast.showWith(res?.message, "warning"); 
      }
      failAction && failAction();
    }
  }
  else {
    failAction && failAction();
    SBToast.showWith("Somthing went wrong", "warning");
  }
  
};
