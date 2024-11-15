export const initialUpi = {
    data: {
      branchID: 0,
      paymentName: "",
      paymentType: "",
      createdUserID: 0,
      ledgerID: 0,
      remark: "",
      paymentTypeID: 0
    },
    validations: {
      branchID: "",
      paymentName: "",
      paymentType: "",
      createdUserID: "",
      ledgerID: "",
      remark: "",
      paymentTypeID: ""
    },
  };
  
  export interface UpiData {
    branchID: number,
    paymentName: string,
    paymentType: string,
    createdUserID: number,
    ledgerID: number,
    remark: string,
    paymentTypeID: number
  }