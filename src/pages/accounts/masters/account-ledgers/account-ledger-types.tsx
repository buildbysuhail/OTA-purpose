export const initialAccountLedger = {
  data: {
    ledgerID: 0,
    ledgerName: "",
    accGroupID: 0,
    ledgerCode: "",
    aliasName: "",
    isEditable: true,
    isBillwiseApplicable: false,
    isDeletable: true,
    remarks: "",
    isIncomeLedger: false,
    isActive: true,
    isProtected: false,
    isCommon: false,
    accTransactionID: 0,
    isCostCentreApplicable: false,
    arabicName: "",
    opBalance: 0,
    drCr: ""
  },
  validations: {
    ledgerName: "",
    ledgerCode: "",
    accGroupID: "",
  },
};

export interface AccountLedgerData {
  ledgerID: number,
  ledgerName: string,
  accGroupID: number,
  ledgerCode: string,
  aliasName: string,
  isEditable: boolean,
  isBillwiseApplicable: boolean,
  isDeletable: boolean,
  remarks: string,
  isIncomeLedger: boolean,
  isActive: boolean,
  isProtected: boolean,
  isCommon: boolean,
  accTransactionID: number,
  isCostCentreApplicable: boolean,
  arabicName: string,
  opBalance: number,
  drCr: string
}