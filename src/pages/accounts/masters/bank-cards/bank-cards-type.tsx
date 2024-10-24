export const initialBankCards = {
  data: {
   
    paymentName: "",
    paymentType: "",
    createdUserID: 0,
    ledgerID: 0,
    remarks: "",
    paymentTypeID: 0
  },
  validations: {
   
    paymentName: "",
    paymentType: "",
    createdUserID: "",
    ledgerID: "",
    remarks: "",
    paymentTypeID: ""
  },
};

export interface BankCardsData {
  paymentName: string,
  paymentType: string,
  createdUserID: number,
  ledgerID: number,
  remarks: string,
  paymentTypeID: number
}