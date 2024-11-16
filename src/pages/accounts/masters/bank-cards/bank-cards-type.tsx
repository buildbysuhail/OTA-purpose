export const initialBankCards = {
  data: {
   
    paymentName: "",
    paymentType: "",
    createdUserID: 0,
    ledgerID: 0,
    remark: "",
    paymentTypeID: 0
  },
  validations: {
   
    paymentName: "",
    paymentType: "",
    createdUserID: "",
    ledgerID: "",
    remark: "",
    paymentTypeID: ""
  },
};

export interface BankCardsData {
  paymentName: string,
  paymentType: string,
  createdUserID: number,
  ledgerID: number,
  remark: string,
  paymentTypeID: number
}