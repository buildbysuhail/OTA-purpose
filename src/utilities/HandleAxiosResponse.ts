import ERPToast from "../components/ERPComponents/erp-toast";

export const handleAxiosResponse = (res: any, action?: () => void) => {
  if (res != undefined && res != null) {
    if (res?.payload != undefined && res?.payload != null) {
      if (res.payload.isOk) {
        ERPToast.showWith(res?.payload.message, "success");
        action && action();
      } else {
        ERPToast.showWith(res?.payload?.data?.message, "warning");
      }
    }
    else
    {
      if (res.message) {
        ERPToast.showWith(res?.message, "warning");
      }
      else if(res.error != undefined && res.error != null)
      {
        if (res.error.message) {
        ERPToast.showWith(res.error.message, "warning");
      }
      }
    }
  }
  else {
    ERPToast.showWith("Somthing went wrong", "warning");
  }
  
};
