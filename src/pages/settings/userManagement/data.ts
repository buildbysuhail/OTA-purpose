export interface UserRight { 
  id: number;
  headId: number;
  name: string;
  fullName: string;
  formCode: string;
  treeNode: number;
  description: string;
};
export const userRightsgcc: UserRight[] = [
  // Accounts Module
  { id: 1, headId: 0, name: "Accounts_Main", fullName: "Accounts", formCode: "ACC", treeNode: 1, description: "Main Accounts Module" },
  //#region accounts
    //#region  Accounts Master
   

     //#region Accounts Transaction
  { id: 102, headId: 1, name: "AccTransact", fullName: "Transactions", formCode: "ACCT", treeNode: 2, description: "Account Transactions" },


  { id: 10201, headId: 102, name: "AccTransact_CP", fullName: "Cash Payments", formCode: "CP", treeNode: 3, description: "Manage Cash Payments" },
  { id: 1020101, headId: 10201, name: "AccTransact_CP_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Cash Payment" },
  { id: 1020102, headId: 10201, name: "AccTransact_CP_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Cash Payment" },
  { id: 1020103, headId: 10201, name: "AccTransact_CP_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Cash Payment" },
  { id: 1020104, headId: 10201, name: "AccTransact_CP_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Cash Payment" },

  //#endregion Web dash board
];