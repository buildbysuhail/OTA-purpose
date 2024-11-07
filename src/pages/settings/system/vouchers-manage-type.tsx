export interface VoucherData {
    formType: string;
    voucherType: string;
    descriptions: string;
    lastVoucherPrefix: string;
    lastVoucherNumber: number;
    isDefault: boolean;
    voucherID: number;
    printDesignFileName: string;
  }
  
  
  export const initialDataVoucher = {
    data: {
      formType: "",
      voucherType: "",
      descriptions: "",
      lastVoucherPrefix: "",
      lastVoucherNumber: "0",
      isDefault: false,
      voucherID: 0,
      printDesignFileName: "",
    },
    validations: {
      formType: "",
      voucherType: "",
      descriptions: "",
      lastVoucherPrefix: "",
      lastVoucherNumber: "",
      isDefault: "",
      voucherID: "",
      printDesignFileName: "",
    },
  };
  