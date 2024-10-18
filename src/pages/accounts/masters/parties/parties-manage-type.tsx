export interface PartiesData {
  branchID: number,
  ledgerID: number,
  showInCustomers: boolean,
  showInSuppliers: boolean
}
export const initialPartiesData = {
  data: {
    branchID: 0,
    ledgerID: 0,
    showInCustomers: false,
    showInSuppliers: false
  },
  validations: {
    branchID: "",
    ledgerID: "",
    showInCustomers: "",
    showInSuppliers: ""
  },
};
