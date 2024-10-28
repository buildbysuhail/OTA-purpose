import { ResponseModel } from "../base/response-model";
import ERPToast from "../components/ERPComponents/erp-toast";

export const handleResponse = (
  res: any,
  action?: () => void,
  failAction?: () => void,
  warn: boolean = true,
  showSuccess: boolean = true
) => {
  
  if (res != undefined && res != null) {
    if (res?.isOk != undefined && res?.isOk != null) {
      if (res.isOk) {
        if (showSuccess) ERPToast.showWith(res?.message, "success");
        action && action();
      } else {
        if (warn) ERPToast.showWith(res?.message, "warning");
        failAction && failAction();
      }
    } else {
      if (res.message) {
        if (warn) ERPToast.showWith(res?.message, "warning");
      }
      failAction && failAction();
    }
  } else {
    failAction && failAction();
    if (warn) ERPToast.showWith("Somthing went wrong", "warning");
  }
};
export const handlePlainResponse = (
  res: any,
  action?: () => void,
  failAction?: () => void,
  warn: boolean = true,
  showSuccess: boolean = true
) => {
  if (res != undefined && res != null) {
    if (showSuccess) ERPToast.showWith(res?.message, "success");
    action && action();
  } else {
    failAction && failAction();
    if (warn) ERPToast.showWith("Somthing went wrong", "warning");
  }
};
