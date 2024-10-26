export const initialBranchLedger = {
  data: {
    branchLedgerID: 0,
    branchID: 0,
    refBranchID: 0,
    purchaseLedgerID: 0,
    receivableLedgerID: 4070,
    branchPayableLedgerID: 0
  },
  validations: {
    branchLedgerID: "",
    branchID: "",
    refBranchID: "",
    purchaseLedgerID: "",
    receivableLedgerID: "",
    branchPayableLedgerID: ""
  },
};

export interface BranchLedgerData {
  branchLedgerID: number,
  branchID: number,
  refBranchID: number,
  purchaseLedgerID: number,
  receivableLedgerID: number,
  branchPayableLedgerID: number
}