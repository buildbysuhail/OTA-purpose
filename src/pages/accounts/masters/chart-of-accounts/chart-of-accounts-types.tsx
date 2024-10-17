export const initialChartOfAccounts = {
  data: {
    accountGroup: "",
    aliasName: "",
    code: "",
    isGroup: 1,
    balance: "",
    parentID: 1,
    createdUser: "",
    createdDate: "",
  },
  validations: {
    accountGroup: "",
    aliasName: "",
    code: "",
    isGroup: "",
    balance: "",
    parentID: "",
    createdUser: "",
    createdDate: "",
  },
};

export interface ChartOfAccountsData {
  accountGroup: string,
  aliasName: string,
  code: string,
  isGroup: number,
  balance: string,
  parentID: number,
  createdUser: string,
  createdDate: string,
}