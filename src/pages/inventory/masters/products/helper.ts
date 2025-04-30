import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

function mrpSaleRateCompare({
    mrp,
    salesPrice,
    mrpSetting,
    ref
  }: {
    mrp: number;
    salesPrice: number;
    mrpSetting: "Warn" | "Block" | string;
    ref: any
  }): boolean {
    if (salesPrice > mrp && mrp !== 0) {
      if (mrpSetting === "Warn") {
        ERPAlert.show({
          text: "MRP is less than Sales Price. Do you want to continue?",
          title: "Warning",
          type: "warn",
          onCancel: () => {
            onWarnCancel.current.focus()
          }, 
        });
        return true;
      } else if (mrpSetting === "Block") {
        ERPAlert.show({
          text: "MRP is less than Sales Price!",
          title: "Error",
          type: "error",
          onCancel: () => {
            onWarnCancel.current.focus()
          }, 
        });
        return true;
      }
    }
  
    return false;
  }