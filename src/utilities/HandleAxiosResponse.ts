import SBToast from "../components/ERPComponents/erp-toast";

export const handleAxiosResponse = (res: any, action?: () => void) => {
  if (res != undefined && res != null) {
    if (res?.payload != undefined && res?.payload != null) {
      if (res.payload.isOk) {
        SBToast.showWith(res?.payload.message, "success");
        action && action();
      } else {
        SBToast.showWith(res?.payload?.data?.message, "warning");
      }
    }
    else
    {
      if (res.message) {
        SBToast.showWith(res?.message, "warning");
      }
      else if(res.error != undefined && res.error != null)
      {
        if (res.error.message) {
        SBToast.showWith(res.error.message, "warning");
      }
      }
    }
  }
  else {
    SBToast.showWith("Somthing went wrong", "warning");
  }
  
};
