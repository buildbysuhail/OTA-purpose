export const initialBankCards = {
  data: {
    branchID: 0,
    paymentName: "",
    paymentType: "",
    createdUserID: 0,
    ledgerID: 0,
    remarks: "",
    paymentTypeID: 0
  },
  validations: {
    branchID: "",
    paymentName: "",
    paymentType: "",
    createdUserID: "",
    ledgerID: "",
    remarks: "",
    paymentTypeID: ""
  },
};

export interface BankCardsData {
  branchID: number,
  paymentName: string,
  paymentType: string,
  createdUserID: number,
  ledgerID: number,
  remarks: string,
  paymentTypeID: number
}