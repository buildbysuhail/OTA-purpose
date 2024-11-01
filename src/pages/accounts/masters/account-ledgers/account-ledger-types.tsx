export const initialAccountLedger = {
  data: {
    ledgerID: 0,
    ledgerName: "",
    accGroupID: 0,
    ledgerCode: "",
    aliasName: "",
    isEditable: true,
    isBillwiseApplicable: true,
    isDeletable: true,
    remarks: "",
    isIncomeLedger: true,
    isActive: true,
    isProtected: true,
    isCommon: true,
    accTransactionID: 0,
    isCostCentreApplicable: true,
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