export interface UserRight {
  id: number;
  headId: number;
  name: string;
  fullName: string;
  formCode: string;
  treeNode: number;
  description: string;
};
export const userRights: UserRight[] = [
  // Accounts Module
  { id: 1, headId: 0, name: "Accounts_Main", fullName: "Accounts", formCode: "ACC", treeNode: 1, description: "Main Accounts Module" },
  //#region accounts
    //#region  Accounts Master
    { id: 101, headId: 1, name: "AccMaster", fullName: "Masters", formCode: "ACCM", treeNode: 2, description: "Accounts Masters" },
    { id: 10101, headId: 101, name: "AccMaster_AccGroup", fullName: "Account Group", formCode: "ACCGRP", treeNode: 3, description: "Manage Account Group" },
    { id: 1010101, headId: 10101, name: "AccMaster_AccGroup_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Account Group" },
    { id: 1010102, headId: 10101, name: "AccMaster_AccGroup_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Account Group" },
    { id: 1010103, headId: 10101, name: "AccMaster_AccGroup_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Account Group" },
    { id: 1010104, headId: 10101, name: "AccMaster_AccGroup_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Account Group" },
  
    { id: 10102, headId: 101, name: "AccMaster_AccLedger", fullName: "Account Ledger", formCode: "ACCLDGR", treeNode: 3, description: "Manage Account Ledger" },
    { id: 1010201, headId: 10102, name: "AccMaster_AccLedger_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Account Ledger" },
    { id: 1010202, headId: 10102, name: "AccMaster_AccLedger_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Account Ledger" },
    { id: 1010203, headId: 10102, name: "AccMaster_AccLedger_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Account Ledger" },
    { id: 1010204, headId: 10102, name: "AccMaster_AccLedger_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Account Ledger" },
  
    { id: 10103, headId: 101, name: "AccMaster_BranchLedger", fullName: "Branch Ledger", formCode: "BLED", treeNode: 3, description: "Manage Branch Ledger" },
    { id: 1010301, headId: 10103, name: "AccMaster_BranchLedger_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Branch Ledger" },
    { id: 1010302, headId: 10103, name: "AccMaster_BranchLedger_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Branch Ledger" },
    { id: 1010303, headId: 10103, name: "AccMaster_BranchLedger_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Branch Ledger" },
    { id: 1010304, headId: 10103, name: "AccMaster_BranchLedger_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Branch Ledger" },
  
    { id: 10104, headId: 101, name: "AccMaster_Currency", fullName: "Currencies", formCode: "CURRNCS", treeNode: 3, description: "Manage Currencies" },
    { id: 1010401, headId: 10104, name: "AccMaster_Currency_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Currency" },
    { id: 1010402, headId: 10104, name: "AccMaster_Currency_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Currency" },
    { id: 1010403, headId: 10104, name: "AccMaster_Currency_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Currency" },
    { id: 1010404, headId: 10104, name: "AccMaster_Currency_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Currency" },
  
    { id: 10105, headId: 101, name: "AccMaster_ExchRate", fullName: "Exchange Rate", formCode: "EXGRTS", treeNode: 3, description: "Manage Exchange Rates" },
    { id: 1010501, headId: 10105, name: "AccMaster_ExchRate_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Exchange Rate" },
    { id: 1010502, headId: 10105, name: "AccMaster_ExchRate_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Exchange Rate" },
    { id: 1010503, headId: 10105, name: "AccMaster_ExchRate_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Exchange Rate" },
    { id: 1010504, headId: 10105, name: "AccMaster_ExchRate_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Exchange Rate" },
  
    { id: 10106, headId: 101, name: "AccMaster_PartyCat", fullName: "Party Category", formCode: "PARTCATGRY", treeNode: 3, description: "Manage Party Categories" },
    { id: 1010601, headId: 10106, name: "AccMaster_PartyCat_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Party Category" },
    { id: 1010602, headId: 10106, name: "AccMaster_PartyCat_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Party Category" },
    { id: 1010603, headId: 10106, name: "AccMaster_PartyCat_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Party Category" },
    { id: 1010604, headId: 10106, name: "AccMaster_PartyCat_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Party Category" },
  
    { id: 10107, headId: 101, name: "AccMaster_Customers", fullName: "Customers & Supplier", formCode: "PARTIES", treeNode: 3, description: "Manage Customers" },
    { id: 1010701, headId: 10107, name: "AccMaster_Customers_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Customer" },
    { id: 1010702, headId: 10107, name: "AccMaster_Customers_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Customer" },
    { id: 1010703, headId: 10107, name: "AccMaster_Customers_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Customer" },
    { id: 1010704, headId: 10107, name: "AccMaster_Customers_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Customer" },
  
    // { id: 10108, headId: 101, name: "AccMaster_Suppliers", fullName: "Suppliers", formCode: "PARTIES", treeNode: 3, description: "Manage Suppliers" },
    // { id: 1010801, headId: 10108, name: "AccMaster_Suppliers_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Supplier" },
    // { id: 1010802, headId: 10108, name: "AccMaster_Suppliers_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Supplier" },
    // { id: 1010803, headId: 10108, name: "AccMaster_Suppliers_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Supplier" },
    // { id: 1010804, headId: 10108, name: "AccMaster_Suppliers_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Supplier" },
  
    { id: 10109, headId: 101, name: "AccMaster_CostCenter", fullName: "Cost Center", formCode: "COSCNTR", treeNode: 3, description: "Manage Cost Centers" },
    { id: 1010901, headId: 10109, name: "AccMaster_CostCenter_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Cost Center" },
    { id: 1010902, headId: 10109, name: "AccMaster_CostCenter_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Cost Center" },
    { id: 1010903, headId: 10109, name: "AccMaster_CostCenter_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Cost Center" },
    { id: 1010904, headId: 10109, name: "AccMaster_CostCenter_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Cost Center" },
  
    { id: 10110, headId: 101, name: "AccMaster_PrivilageCards", fullName: "Privilege Cards", formCode: "PRCRD", treeNode: 3, description: "Manage Privilege Cards" },
    { id: 1011001, headId: 10110, name: "AccMaster_PrivilageCards_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Privilege Card" },
    { id: 1011002, headId: 10110, name: "AccMaster_PrivilageCards_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Privilege Card" },
    { id: 1011003, headId: 10110, name: "AccMaster_PrivilageCards_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Privilege Card" },
    { id: 1011004, headId: 10110, name: "AccMaster_PrivilageCards_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Privilege Card" },
  
    { id: 10111, headId: 101, name: "AccMaster_ProjectSite", fullName: "Project Sites", formCode: "PRJSITE", treeNode: 3, description: "Manage Project Sites" },
    { id: 1011101, headId: 10111, name: "AccMaster_ProjectSite_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Project Site" },
    { id: 1011102, headId: 10111, name: "AccMaster_ProjectSite_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Project Site" },
    { id: 1011103, headId: 10111, name: "AccMaster_ProjectSite_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Project Site" },
    { id: 1011104, headId: 10111, name: "AccMaster_ProjectSite_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Project Site" },
  
    { id: 10112, headId: 101, name: "AccMaster_AccountPrivilages", fullName: "Account Privileges", formCode: "ACCPRIVLG", treeNode: 3, description: "Manage Account Privileges" },
    { id: 1011201, headId: 10112, name: "AccMaster_AccountPrivilages_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Account Privilege" },
    //#endregion End Accounts Master




     //#region Accounts Transaction
  { id: 102, headId: 1, name: "AccTransact", fullName: "Transactions", formCode: "ACCT", treeNode: 2, description: "Account Transactions" },


  { id: 10201, headId: 102, name: "AccTransact_CP", fullName: "Cash Payments", formCode: "CP", treeNode: 3, description: "Manage Cash Payments" },
  { id: 1020101, headId: 10201, name: "AccTransact_CP_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Cash Payment" },
  { id: 1020102, headId: 10201, name: "AccTransact_CP_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Cash Payment" },
  { id: 1020103, headId: 10201, name: "AccTransact_CP_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Cash Payment" },
  { id: 1020104, headId: 10201, name: "AccTransact_CP_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Cash Payment" },

  { id: 10202, headId: 102, name: "AccTransact_CR", fullName: "Cash Receipts", formCode: "CR", treeNode: 3, description: "Manage Cash Receipts" },
  { id: 1020201, headId: 10202, name: "AccTransact_CR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Cash Receipt" },
  { id: 1020202, headId: 10202, name: "AccTransact_CR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Cash Receipt" },
  { id: 1020203, headId: 10202, name: "AccTransact_CR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Cash Receipt" },
  { id: 1020204, headId:  10202, name: "AccTransact_CR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Cash Receipt" },

  { id: 10203, headId: 102, name: "AccTransact_BP", fullName: "Bank Payment", formCode: "BP", treeNode: 3, description: "Manage Bank Payments" },
  { id: 1020301, headId: 10203, name: "AccTransact_BP_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Bank Payment" },
  { id: 1020302, headId: 10203, name: "AccTransact_BP_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Bank Payment" },
  { id: 1020303, headId: 10203, name: "AccTransact_BP_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Bank Payment" },
  { id: 1020304, headId: 10203, name: "AccTransact_BP_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Bank Payment" },

  { id: 10204, headId: 102, name: "AccTransact_BR", fullName: "Bank Receipt", formCode: "BR", treeNode: 3, description: "Manage Bank Receipts" },
  { id: 1020401, headId: 10204, name: "AccTransact_BR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Bank Receipt" },
  { id: 1020402, headId: 10204, name: "AccTransact_BR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Bank Receipt" },
  { id: 1020403, headId: 10204, name: "AccTransact_BR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Bank Receipt" },
  { id: 1020404, headId: 10204, name: "AccTransact_BR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Bank Receipt" },

  { id: 10205, headId: 102, name: "AccTransact_OB", fullName: "Opening Balance", formCode: "OB", treeNode: 3, description: "Manage Opening Balances" },
  { id: 1020501, headId: 10205, name: "AccTransact_OB_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Opening Balance" },
  { id: 1020502, headId: 10205, name: "AccTransact_OB_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Opening Balance" },
  { id: 1020503, headId: 10205, name: "AccTransact_OB_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Opening Balance" },
  { id: 1020504, headId: 10205, name: "AccTransact_OB_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Opening Balance" },

  { id: 10206, headId: 102, name: "AccTransact_JE", fullName: "Journal Entry", formCode: "JV", treeNode: 3, description: "Manage Journal Entries" },
  { id: 1020601, headId: 10206, name: "AccTransact_JE_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Journal Entry" },
  { id: 1020602, headId: 10206, name: "AccTransact_JE_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Journal Entry" },
  { id: 1020603, headId: 10206, name: "AccTransact_JE_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Journal Entry" },
  { id: 1020604, headId: 10206, name: "AccTransact_JE_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Journal Entry" },

  { id: 10207, headId: 102, name: "AccTransact_DN", fullName: "Debit Note", formCode: "DN", treeNode: 3, description: "Manage Debit Notes" },
  { id: 1020701, headId: 10207, name: "AccTransact_DN_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Debit Note" },
  { id: 1020702, headId: 10207, name: "AccTransact_DN_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Debit Note" },
  { id: 1020703, headId: 10207, name: "AccTransact_DN_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Debit Note" },
  { id: 1020704, headId: 10207, name: "AccTransact_DN_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Debit Note" },

  { id: 10208, headId: 102, name: "AccTransact_CN", fullName: "Credit Note", formCode: "CN", treeNode: 3, description: "Manage Credit Notes" },
  { id: 1020801, headId: 10208, name: "AccTransact_CN_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Credit Note" },
  { id: 1020802, headId: 10208, name: "AccTransact_CN_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Credit Note" },
  { id: 1020803, headId: 10208, name: "AccTransact_CN_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Credit Note" },
  { id: 1020804, headId: 10208, name: "AccTransact_CN_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Credit Note" },

  { id: 10209, headId: 102, name: "AccTransact_PDC", fullName: "Post Dated Cheques", formCode: "PDC", treeNode: 3, description: "Manage Post Dated Cheques" },
  { id: 1020901, headId: 10209, name: "AccTransact_PDC_Payments", fullName: "Payment", formCode: "CQP", treeNode: 4, description: "Manage PDC Payments" },
  { id: 102090101, headId: 1020901, name: "AccTransact_PDC_Payments_Add", fullName: "Add", formCode: "A", treeNode: 5, description: "Add PDC Payment" },
  { id: 102090102, headId: 1020901, name: "AccTransact_PDC_Payments_Edit", fullName: "Edit", formCode: "E", treeNode: 5, description: "Edit PDC Payment" },
  { id: 102090103, headId: 1020901, name: "AccTransact_PDC_Payments_Delete", fullName: "Delete", formCode: "D", treeNode: 5, description: "Delete PDC Payment" },
  { id: 102090104, headId: 1020901, name: "AccTransact_PDC_Payments_Print", fullName: "Print", formCode: "P", treeNode: 5, description: "Print PDC Payment" },
  { id: 1020902, headId: 10209, name: "AccTransact_PDC_Receipt", fullName: "Receipt", formCode: "CQR", treeNode: 4, description: "Manage PDC Receipts" },
  { id: 102090201, headId: 1020902, name: "AccTransact_PDC_Receipt_Add", fullName: "Add", formCode: "A", treeNode: 5, description: "Add PDC Receipt" },
  { id: 102090202, headId: 1020902, name: "AccTransact_PDC_Receipt_Edit", fullName: "Edit", formCode: "E", treeNode: 5, description: "Edit PDC Receipt" },
  { id: 102090203, headId: 1020902, name: "AccTransact_PDC_Receipt_Delete", fullName: "Delete", formCode: "D", treeNode: 5, description: "Delete PDC Receipt" },
  { id: 102090204, headId: 1020902, name: "AccTransact_PDC_Receipt_Print", fullName: "Print", formCode: "P", treeNode: 5, description: "Print PDC Receipt" },
  //{ id: 1020903, headId: 10209, name: "AccTransact_PDC_Report", fullName: "Report", formCode: "CQRpt", treeNode: 4, description: "View PDC Reports" },

  { id: 10210, headId: 102, name: "AccTransact_BankRec", fullName: "Bank Reconciliation", formCode: "BRC", treeNode: 3, description: "Manage Bank Reconciliations" },
  { id: 1021001, headId: 10210, name: "AccTransact_BankRec_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Bank Reconciliation" },
  { id: 1021002, headId: 10210, name: "AccTransact_BankRec_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Bank Reconciliation" },
  { id: 1021003, headId: 10210, name: "AccTransact_BankRec_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Bank Reconciliation" },
  { id: 1021004, headId: 10210, name: "AccTransact_BankRec_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Bank Reconciliation" },

  { id: 10211, headId: 102, name: "AccTransact_FundTrans", fullName: "Fund Transfer", formCode: "FT", treeNode: 3, description: "Manage Fund Transfers" },
  { id: 1021101, headId: 10211, name: "AccTransact_FundTrans_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Fund Transfer" },
  { id: 1021102, headId: 10211, name: "AccTransact_FundTrans_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Fund Transfer" },
  { id: 1021103, headId: 10211, name: "AccTransact_FundTrans_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Fund Transfer" },
  { id: 1021104, headId: 10211, name: "AccTransact_FundTrans_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Fund Transfer" },

  { id: 10212, headId: 102, name: "AccTransact_CloseBal", fullName: "Closing Balance", formCode: "CB", treeNode: 3, description: "Manage Closing Balances" },
  { id: 1021201, headId: 10212, name: "AccTransact_CloseBal_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Closing Balance" },
  { id: 1021202, headId: 10212, name: "AccTransact_CloseBal_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Closing Balance" },
  { id: 1021203, headId: 10212, name: "AccTransact_CloseBal_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Closing Balance" },
  { id: 1021204, headId: 10212, name: "AccTransact_CloseBal_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Closing Balance" },

  { id: 10213, headId: 102, name: "AccTransact_PDC", fullName: "PDC", formCode: "PDC", treeNode: 3, description: "Manage PDC" },
  { id: 1021301, headId: 10213, name: "AccTransact_PDC_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add PDC" },
  { id: 1021302, headId: 10213, name: "AccTransact_PDC_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit PDC" },
  { id: 1021303, headId: 10213, name: "AccTransact_PDC_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete PDC" },
  { id: 1021304, headId: 10213, name: "AccTransact_PDC_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print PDC" },

  { id: 10214, headId: 102, name: "AccTransact_CashTender", fullName: "Cash Tender", formCode: "TD", treeNode: 3, description: "Manage Cash Tender" },
  { id: 1021401, headId: 10214, name: "AccTransact_CashTender_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Cash Tender" },

  { id: 10215, headId: 102, name: "AccTransact_MultiJournal", fullName: "Multi Journal", formCode: "MJV", treeNode: 3, description: "Manage Multi Journal" },
  { id: 1021501, headId: 10215, name: "AccTransact_MultiJournal_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Multi Journal" },
  { id: 1021502, headId: 10215, name: "AccTransact_MultiJournal_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Multi Journal" },
  { id: 1021503, headId: 10215, name: "AccTransact_MultiJournal_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Multi Journal" },
  { id: 1021504, headId: 10215, name: "AccTransact_MultiJournal_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Multi Journal" },

  { id: 10216, headId: 102, name: "AccTransact_TaxOnExpenses", fullName: "Tax On Expenses", formCode: "TXEXP", treeNode: 3, description: "Manage Tax On Expenses" },
  { id: 1021601, headId: 10216, name: "AccTransact_TaxOnExpenses_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Tax On Expenses" },
  { id: 1021602, headId: 10216, name: "AccTransact_TaxOnExpenses_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Tax On Expenses" },
  { id: 1021603, headId: 10216, name: "AccTransact_TaxOnExpenses_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Tax On Expenses" },
  { id: 1021604, headId: 10216, name: "AccTransact_TaxOnExpenses_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Tax On Expenses" },

    //#endregion End Accounts Transaction
    //#region  Accounts Reports Starts
    { id: 103, headId: 1, name: "AccReports", fullName: "Reports", formCode: "ACCR", treeNode: 2, description: "Account Reports" },
  
  
    // Ledger Report Group
    { id: 10301, headId: 103, name: "TrReports_LedgerReport", fullName: "Ledger Report", formCode: "LEDGRRPT", treeNode: 3, description: "View Ledger Report" },
    { id: 1031101, headId: 10301, name: "TrReports_LedgerReport_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Ledger Report" },
    { id: 1031102, headId: 10301, name: "TrReports_LedgerReport_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Ledger Report" },
    { id: 1031103, headId: 10301, name: "TrReports_LedgerReport_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Ledger Report" },
  
    // Salary Report Group
    { id: 10302, headId: 103, name: "TrReports_Salary", fullName: "Ledger Report(Hide Salary Ledger)", formCode: "LEDRSRY", treeNode: 3, description: "View Ledger Report (Hide Salary Ledger)" },
    { id: 1031201, headId: 10302, name: "TrReports_Salary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Ledger Report" },
    { id: 1031202, headId: 10302, name: "TrReports_Salary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Ledger Report" },
    { id: 1031203, headId: 10302, name: "TrReports_Salary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Ledger Report" },
  
    // Cash Book Group
    { id: 10303, headId: 103, name: "TrReports_CB", fullName: "Cash Book", formCode: "CPRPT", treeNode: 3, description: "View Cash Book" },
    { id: 1031301, headId: 10303, name: "TrReports_CB_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Cash Book" },
    { id: 1031302, headId: 10303, name: "TrReports_CB_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Cash Book" },
    { id: 1031303, headId: 10303, name: "TrReports_CB_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Cash Book" },
  
    // Day Book Group
    { id: 10304, headId: 103, name: "TrReports_DB", fullName: "Day Book", formCode: "DBRPT", treeNode: 3, description: "View Day Book" },
    { id: 1031401, headId: 10304, name: "TrReports_DB_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Day Book" },
    { id: 1031402, headId: 10304, name: "TrReports_DB_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Day Book" },
    { id: 1031403, headId: 10304, name: "TrReports_DB_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Day Book" },
  
    // Payments Report Group
    { id: 10305, headId: 103, name: "TrReports_Payments", fullName: "Payments Report", formCode: "PAYMRPT", treeNode: 3, description: "View Payments Report" },
    { id: 1031501, headId: 10305, name: "TrReports_Payments_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Payments Report" },
    { id: 1031502, headId: 10305, name: "TrReports_Payments_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Payments Report" },
    { id: 1031503, headId: 10305, name: "TrReports_Payments_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Payments Report" },
  
    // Collection Report Group
    { id: 10306, headId: 103, name: "TrReports_Collection", fullName: "Collection Report", formCode: "COLLRPT", treeNode: 3, description: "View Collection Report" },
    { id: 1031601, headId: 10306, name: "TrReports_Collection_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Collection Report" },
    { id: 1031602, headId: 10306, name: "TrReports_Collection_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Collection Report" },
    { id: 1031603, headId: 10306, name: "TrReports_Collection_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Collection Report" },
  
    // Cash Summary Report Group
    { id: 10307, headId: 103, name: "NdCashSumrpt", fullName: "Cash Summary Report", formCode: "RPTCASHSUM", treeNode: 3, description: "View Cash Summary Report" },
    { id: 1031701, headId: 10307, name: "NdCashSumrpt_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Cash Summary Report" },
    { id: 1031702, headId: 10307, name: "NdCashSumrpt_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Cash Summary Report" },
    { id: 1031703, headId: 10307, name: "NdCashSumrpt_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Cash Summary Report" },
  
    // Transaction Report Group
    { id: 10308, headId: 103, name: "TrReports_Transaction", fullName: "Transaction Report", formCode: "TRANSRPT", treeNode: 3, description: "View Transaction Report" },
    { id: 1031801, headId: 10308, name: "TrReports_Transaction_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Transaction Report" },
    { id: 1031802, headId: 10308, name: "TrReports_Transaction_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Transaction Report" },
    { id: 1031803, headId: 10308, name: "TrReports_Transaction_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Transaction Report" },
  
    // Transaction History Group
    { id: 10309, headId: 103, name: "TrReports_TransHistory", fullName: "Transaction History", formCode: "RPTTRAHST", treeNode: 3, description: "View Transaction History" },
    { id: 1031901, headId: 10309, name: "TrReports_TransHistory_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Transaction History" },
    { id: 1031902, headId: 10309, name: "TrReports_TransHistory_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Transaction History" },
    { id: 1031903, headId: 10309, name: "TrReports_TransHistory_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Transaction History" },
  
    // Bill Wise Group
    { id: 10310, headId: 103, name: "TrReports_OSTBillwise", fullName: "Bill Wise", formCode: "OSTDBILLW", treeNode: 3, description: "View Bill Wise" },
    { id: 1032001, headId: 10310, name: "TrReports_OSTBillwise_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Bill Wise" },
    { id: 1032002, headId: 10310, name: "TrReports_OSTBillwise_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Bill Wise" },
    { id: 1032003, headId: 10310, name: "TrReports_OSTBillwise_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Bill Wise" },
  
    // Account Payable Group
    { id: 10311, headId: 103, name: "TrReports_RPTAccPayable", fullName: "Account Payable", formCode: "RPTACCPAY", treeNode: 3, description: "View Account Payable" },
    { id: 1032101, headId: 10311, name: "TrReports_RPTAccPayable_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Account Payable" },
    { id: 1032102, headId: 10311, name: "TrReports_RPTAccPayable_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Account Payable" },
    { id: 1032103, headId: 10311, name: "TrReports_RPTAccPayable_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Account Payable" },
  
    // Account Receivable Group
    { id: 10312, headId: 103, name: "TrReports_RPTAccReceivable", fullName: "Account Receivable", formCode: "RPTACCREC", treeNode: 3, description: "View Account Receivable" },
    { id: 1032201, headId: 10312, name: "TrReports_RPTAccReceivable_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Account Receivable" },
    { id: 1032202, headId: 10312, name: "TrReports_RPTAccReceivable_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Account Receivable" },
    { id: 1032203, headId: 10312, name: "TrReports_RPTAccReceivable_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Account Receivable" },
  
    // Aging Report Group
    { id: 10313, headId: 103, name: "TrReports_Aging", fullName: "Aging Report", formCode: "RPTAGNG", treeNode: 3, description: "View Aging Report" },
    { id: 1032301, headId: 10313, name: "TrReports_Aging_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Aging Report" },
    { id: 1032302, headId: 10313, name: "TrReports_Aging_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Aging Report" },
    { id: 1032303, headId: 10313, name: "TrReports_Aging_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Aging Report" },
  
    // Account Receivable Aging Report Group
    { id: 10314, headId: 103, name: "TrReports_AccRecAging", fullName: "Account Receivable Aging Report", formCode: "ARAGINGRPT", treeNode: 3, description: "View Account Receivable Aging Report" },
    { id: 1032401, headId: 10314, name: "TrReports_AccRecAging_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Account Receivable Aging Report" },
    { id: 1032402, headId: 10314, name: "TrReports_AccRecAging_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Account Receivable Aging Report" },
    { id: 1032403, headId: 10314, name: "TrReports_AccRecAging_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Account Receivable Aging Report" },
  
    // Account Payable Aging Report Group
    { id: 10315, headId: 103, name: "TrReports_AccPayAging", fullName: "Account Payable Aging Report", formCode: "APAGINGRPT", treeNode: 3, description: "View Account Payable Aging Report" },
    { id: 1032501, headId: 10315, name: "TrReports_AccPayAging_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Account Payable Aging Report" },
    { id: 1032502, headId: 10315, name: "TrReports_AccPayAging_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Account Payable Aging Report" },
    { id: 1032503, headId: 10315, name: "TrReports_AccPayAging_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Account Payable Aging Report" },
  
    // Outstanding Report Group
    { id: 10316, headId: 103, name: "TrReports_Outstanding", fullName: "Outstanding Report", formCode: "OSTD", treeNode: 3, description: "View Outstanding Report" },
    { id: 1032601, headId: 10316, name: "TrReports_Outstanding_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Outstanding Report" },
    { id: 1032602, headId: 10316, name: "TrReports_Outstanding_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Outstanding Report" },
    { id: 1032603, headId: 10316, name: "TrReports_Outstanding_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Outstanding Report" },
  
    // Account Payable Group
    { id: 10317, headId: 103, name: "TrReports_AccPayable", fullName: "Account Payable", formCode: "ACCPAYBLE", treeNode: 3, description: "View Account Payable" },
    { id: 1032701, headId: 10317, name: "TrReports_AccPayable_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Account Payable" },
    { id: 1032702, headId: 10317, name: "TrReports_AccPayable_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Account Payable" },
    { id: 1032703, headId: 10317, name: "TrReports_AccPayable_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Account Payable" },
  
    // Account Receivable Group
    { id: 10318, headId: 103, name: "TrReports_AccReceivable", fullName: "Account Receivable", formCode: "ACCRECRPT", treeNode: 3, description: "View Account Receivable" },
    { id: 1032801, headId: 10318, name: "TrReports_AccReceivable_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Account Receivable" },
    { id: 1032802, headId: 10318, name: "TrReports_AccReceivable_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Account Receivable" },
    { id: 1032803, headId: 10318, name: "TrReports_AccReceivable_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Account Receivable" },
  
    // Cash Flow Group
    { id: 10319, headId: 103, name: "TrReports_Cashflow", fullName: "Cash Flow", formCode: "CashFlwRpt", treeNode: 3, description: "View Cash Flow" },
    { id: 1032901, headId: 10319, name: "TrReports_Cashflow_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Cash Flow" },
    { id: 1032902, headId: 10319, name: "TrReports_Cashflow_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Cash Flow" },
    { id: 1032903, headId: 10319, name: "TrReports_Cashflow_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Cash Flow" },
  
    // Bank Statement Group
    { id: 10320, headId: 103, name: "nd_bankStatement", fullName: "Bank Statement", formCode: "BKSTMT", treeNode: 3, description: "View Bank Statement" },
    { id: 1033001, headId: 10320, name: "nd_bankStatement_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Bank Statement" },
    { id: 1033002, headId: 10320, name: "nd_bankStatement_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Bank Statement" },
    { id: 1033003, headId: 10320, name: "nd_bankStatement_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Bank Statement" },
  
    // Expense Report Group
    { id: 10321, headId: 103, name: "TrReports_Expense", fullName: "Expense Report", formCode: "ExpRpt", treeNode: 3, description: "View Expense Report" },
    { id: 1033101, headId: 10321, name: "TrReports_Expense_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Expense Report" },
    { id: 1033102, headId: 10321, name: "TrReports_Expense_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Expense Report" },
    { id: 1033103, headId: 10321, name: "TrReports_Expense_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Expense Report" },
  
    // Income Report Group
    { id: 10322, headId: 103, name: "TrReports_Income", fullName: "Income Report", formCode: "IcmRpt", treeNode: 3, description: "View Income Report" },
    { id: 1033201, headId: 10322, name: "TrReports_Income_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Income Report" },
    { id: 1033202, headId: 10322, name: "TrReports_Income_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Income Report" },
    { id: 1033203, headId: 10322, name: "TrReports_Income_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Income Report" },
  
    // Daily Summary Report Group
    { id: 10323, headId: 103, name: "TrReports_DailyAccStatement", fullName: "Daily Summary Report", formCode: "DSUMRPT", treeNode: 3, description: "View Daily Summary Report" },
    { id: 1033301, headId: 10323, name: "TrReports_DailyAccStatement_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Daily Summary Report" },
    { id: 1033302, headId: 10323, name: "TrReports_DailyAccStatement_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Daily Summary Report" },
    { id: 1033303, headId: 10323, name: "TrReports_DailyAccStatement_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Daily Summary Report" },
  
    // Profit Report Group
    { id: 10324, headId: 103, name: "TrReports_Profit", fullName: "Profit Report", formCode: "PFTRPT", treeNode: 3, description: "View Profit Report" },
    { id: 1033401, headId: 10324, name: "TrReports_Profit_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Profit Report" },
    { id: 1033402, headId: 10324, name: "TrReports_Profit_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Profit Report" },
    { id: 1033403, headId: 10324, name: "TrReports_Profit_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Profit Report" },
  
    // Party Summary Group
    { id: 10325, headId: 103, name: "TrReports_PartySummary", fullName: "Party Summary", formCode: "PRTSUM", treeNode: 3, description: "View Party Summary" },
    { id: 1033501, headId: 10325, name: "TrReports_PartySummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Party Summary" },
    { id: 1033502, headId: 10325, name: "TrReports_PartySummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Party Summary" },
    { id: 1033503, headId: 10325, name: "TrReports_PartySummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Party Summary" },
  
    // PDC Report Group
    { id: 10326, headId: 103, name: "NdPDCReport", fullName: "PDC Report", formCode: "PDCRPT", treeNode: 3, description: "View PDC Report" },
    { id: 1033601, headId: 10326, name: "NdPDCReport_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print PDC Report" },
    { id: 1033602, headId: 10326, name: "NdPDCReport_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings PDC Report" },
    { id: 1033603, headId: 10326, name: "NdPDCReport_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export PDC Report" },
  
    // Trial Balance Group
    { id: 10327, headId: 103, name: "TrReports_TrialBalance", fullName: "Trial Balance", formCode: "TBRpt", treeNode: 3, description: "View Trial Balance" },
    { id: 1033701, headId: 10327, name: "TrReports_TrialBalance_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Trial Balance" },
    { id: 1033702, headId: 10327, name: "TrReports_TrialBalance_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Trial Balance" },
    { id: 1033703, headId: 10327, name: "TrReports_TrialBalance_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Trial Balance" },
  
    // Profit And Loss Account Group
    { id: 10328, headId: 103, name: "TrReports_PandLAccount", fullName: "Profit And Loss Account", formCode: "PLRPT", treeNode: 3, description: "View Profit And Loss Account" },
    { id: 1033801, headId: 10328, name: "TrReports_PandLAccount_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Profit And Loss Account" },
    { id: 1033802, headId: 10328, name: "TrReports_PandLAccount_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Profit And Loss Account" },
    { id: 1033803, headId: 10328, name: "TrReports_PandLAccount_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Profit And Loss Account" },

// Balance Sheet Group
{ id: 10329, headId: 103, name: "TrReports_BalanceSheet", fullName: "Balance Sheet", formCode: "BSRPT", treeNode: 3, description: "View Balance Sheet" },
{ id: 1033901, headId: 10329, name: "TrReports_BalanceSheet_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Balance Sheet" },
{ id: 1033902, headId: 10329, name: "TrReports_BalanceSheet_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Balance Sheet" },
{ id: 1033903, headId: 10329, name: "TrReports_BalanceSheet_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Balance Sheet" },

// Income Expense Statement Group
{ id: 10330, headId: 103, name: "NdIncomeExpenseStatement", fullName: "Income Expense Statement", formCode: "INCEXPSMT", treeNode: 3, description: "View Income Expense Statement" },
{ id: 1034001, headId: 10330, name: "TrReports_IncomeExpense_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Income Expense Statement" },
{ id: 1034002, headId: 10330, name: "TrReports_IncomeExpense_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Settings Income Expense Statement" },
{ id: 1034003, headId: 10330, name: "TrReports_IncomeExpense_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Export Income Expense Statement" },

// POST Section
{ id: 10331, headId: 103, name: "TrReports_Post", fullName: "POST", formCode: "POST", treeNode: 3, description: "POST Actions" },
{ id: 1034101, headId: 10331, name: "TrReports_Post_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print POST Report" },


    //#endregion Accounts Reports Ends
//#region other Utilities
     //{ id: 104, headId: 1, name: "AccUtilities", fullName: "Utilities", formCode: "ACCU", treeNode: 2, description: "Account Utilities" },
  { id: 10401, headId: 1, name: "ndFinancialYearSelection", fullName: "Financial Year Selection/Change", formCode: "FY_CHG", treeNode: 1, description: "Financial Year Selection/Change Menu Item" },
  { id: 1041101, headId: 10401, name: "ndFinancialYearSelection_Show_List", fullName: "Show List", formCode: "S", treeNode: 1, description: "Show List Menu Item" },
  { id: 10411001, headId: 1041101, name: "ndFinancialYearSelection_Show_List_show", fullName: "Show", formCode: "S", treeNode: 1, description: "Show Menu Item" },
  { id: 1041102, headId: 10401, name: "ndFinancialYearSelection_Add", fullName: "Add", formCode: "A", treeNode: 1, description: "Add Menu Item" },
 
  { id: 10402, headId: 1, name: "ndPrePostDatedTransModify", fullName: "Pre/Post Dated Transaction Modify", formCode: "PRE_POST", treeNode: 1, description: "Pre/Post Dated Transaction Modify Menu Item" },
  { id: 1041201, headId: 10402, name: "ndPrePostDatedTransModify_Block", fullName: "Block Add,Edit,Delete", formCode: "B", treeNode: 1, description: "Block Add,Edit,Delete Menu Item" },
  // { id: 10412001, headId: 1041201, name: "Node0", fullName: "", formCode: "", treeNode: 1, description: "" }, 
//#endregion other Utilities

  //#endregion accounts
 //#region Inventory
 //#region Inventory Master Start
 { id: 2, headId: 0, name: "Inventory_Main", fullName: "Inventory", formCode: "INV", treeNode: 1, description: "Main Inventory Module" },
  

 { id: 201, headId: 2, name: "InvMaster", fullName: "Masters", formCode: "INVM", treeNode: 2, description: "Inventory Masters" },
 
 { id: 20101, headId: 201, name: "Products", fullName: "Products", formCode: "INVPRODUCT", treeNode: 3, description: "Manage Products" },
{ id: 2010101, headId: 20101, name: "Products_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Products" },
{ id: 2010102, headId: 20101, name: "Products_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Products" },
{ id: 2010103, headId: 20101, name: "Products_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Products" },
{ id: 2010104, headId: 20101, name: "Products_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Products" },

{ id: 20102, headId: 201, name: "ProductGroups", fullName: "Product Groups", formCode: "INVPDTGRP", treeNode: 3, description: "Manage Product Groups" },
{ id: 2010201, headId: 20102, name: "ProductGroups_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Product Groups" },
{ id: 2010202, headId: 20102, name: "ProductGroups_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Product Groups" },
{ id: 2010203, headId: 20102, name: "ProductGroups_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Product Groups" },
{ id: 2010204, headId: 20102, name: "ProductGroups_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Product Groups" },

{ id: 20103, headId: 201, name: "ProductCategory", fullName: "Product Catagory", formCode: "INVPDTCAT", treeNode: 3, description: "Manage Product Catagory" },
{ id: 2010301, headId: 20103, name: "ProductCategory_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Product Catagory" },
{ id: 2010302, headId: 20103, name: "ProductCategory_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Product Catagory" },
{ id: 2010303, headId: 20103, name: "ProductCategory_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Product Catagory" },
{ id: 2010304, headId: 20103, name: "ProductCategory_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Product Catagory" },

{ id: 20104, headId: 201, name: "Brands", fullName: "Brands", formCode: "INVBRND", treeNode: 3, description: "Manage Brands" },
{ id: 2010401, headId: 20104, name: "Brands_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Brands" },
{ id: 2010402, headId: 20104, name: "Brands_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Brands" },
{ id: 2010403, headId: 20104, name: "Brands_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Brands" },
{ id: 2010404, headId: 20104, name: "Brands_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Brands" },

{ id: 20105, headId: 201, name: "PriceCategory", fullName: "Price Catagory", formCode: "INVPRCCAT", treeNode: 3, description: "Manage Price Catagory" },
{ id: 2010501, headId: 20105, name: "PriceCategory_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Price Catagory" },
{ id: 2010502, headId: 20105, name: "PriceCategory_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Price Catagory" },
{ id: 2010503, headId: 20105, name: "PriceCategory_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Price Catagory" },
{ id: 2010504, headId: 20105, name: "PriceCategory_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Price Catagory" },

{ id: 20106, headId: 201, name: "UnitOfMeasures", fullName: "Unit Of Mesures", formCode: "INVUNTMEAS", treeNode: 3, description: "Manage Unit Of Mesures" },
{ id: 2010601, headId: 20106, name: "UnitOfMeasures_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Unit Of Mesures" },
{ id: 2010602, headId: 20106, name: "UnitOfMeasures_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Unit Of Mesures" },
{ id: 2010603, headId: 20106, name: "UnitOfMeasures_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Unit Of Mesures" },
{ id: 2010604, headId: 20106, name: "UnitOfMeasures_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Unit Of Mesures" },

{ id: 20107, headId: 201, name: "Shelfs", fullName: "Shelfs", formCode: "INVSHLF", treeNode: 3, description: "Manage Shelfs" },
{ id: 2010701, headId: 20107, name: "Shelfs_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Shelfs" },
{ id: 2010702, headId: 20107, name: "Shelfs_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Shelfs" },
{ id: 2010703, headId: 20107, name: "Shelfs_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Shelfs" },
{ id: 2010704, headId: 20107, name: "Shelfs_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Shelfs" },

{ id: 20108, headId: 201, name: "Vehicles", fullName: "Vehicles", formCode: "VEHC", treeNode: 3, description: "Manage Vehicles" },
{ id: 2010801, headId: 20108, name: "Vehicles_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Vehicles" },
{ id: 2010802, headId: 20108, name: "Vehicles_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Vehicles" },
{ id: 2010803, headId: 20108, name: "Vehicles_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Vehicles" },
{ id: 2010804, headId: 20108, name: "Vehicles_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Vehicles" },

{ id: 20109, headId: 201, name: "Warehouse", fullName: "Warehouse", formCode: "INVWRHS", treeNode: 3, description: "Manage Warehouse" },
{ id: 2010901, headId: 20109, name: "Warehouse_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Warehouse" },
{ id: 2010902, headId: 20109, name: "Warehouse_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Warehouse" },
{ id: 2010903, headId: 20109, name: "Warehouse_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Warehouse" },
{ id: 2010904, headId: 20109, name: "Warehouse_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Warehouse" },

{ id: 20110, headId: 201, name: "TaxCategory", fullName: "Tax Category", formCode: "TAXCATGRY", treeNode: 3, description: "Manage Tax Category" },
{ id: 2011001, headId: 20110, name: "TaxCategory_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Tax Category" },
{ id: 2011002, headId: 20110, name: "TaxCategory_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Tax Category" },
{ id: 2011003, headId: 20110, name: "TaxCategory_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Tax Category" },
{ id: 2011004, headId: 20110, name: "TaxCategory_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Tax Category" },

{ id: 20111, headId: 201, name: "ProductPrices", fullName: "Product Prices", formCode: "PPRICE", treeNode: 3, description: "Manage Product Prices" },
{ id: 2011101, headId: 20111, name: "ProductPrices_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Product Prices" },
{ id: 2011102, headId: 20111, name: "ProductPrices_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Product Prices" },
{ id: 2011103, headId: 20111, name: "ProductPrices_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Product Prices" },
{ id: 2011104, headId: 20111, name: "ProductPrices_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Product Prices" },

{ id: 20112, headId: 201, name: "SalesRoute", fullName: "Sales Route", formCode: "SLRUT", treeNode: 3, description: "Manage Sales Route" },
{ id: 2011201, headId: 20112, name: "SalesRoute_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Route" },
{ id: 2011202, headId: 20112, name: "SalesRoute_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Route" },
{ id: 2011203, headId: 20112, name: "SalesRoute_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Route" },
{ id: 2011204, headId: 20112, name: "SalesRoute_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Route" },

{ id: 20113, headId: 201, name: "SalesmanRoute", fullName: "Salesman Route", formCode: "SLMRUT", treeNode: 3, description: "Manage Salesman Route" },
{ id: 2011301, headId: 20113, name: "SalesmanRoute_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Salesman Route" },
{ id: 2011302, headId: 20113, name: "SalesmanRoute_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Salesman Route" },
{ id: 2011303, headId: 20113, name: "SalesmanRoute_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Salesman Route" },
{ id: 2011304, headId: 20113, name: "SalesmanRoute_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Salesman Route" },

{ id: 20114, headId: 201, name: "Schemes", fullName: "Schemes", formCode: "INVSCHM", treeNode: 3, description: "Manage Schemes" },
{ id: 2011401, headId: 20114, name: "Schemes_Show", fullName: "Show", formCode: "V", treeNode: 4, description: "Show Schemes" },
{ id: 2011402, headId: 20114, name: "Schemes_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Schemes" },
{ id: 2011403, headId: 20114, name: "Schemes_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Schemes" },
{ id: 2011404, headId: 20114, name: "Schemes_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Schemes" },

  //#endregion Inventory Master End
  //#region Inventory Transaction
  { id: 202, headId: 2, name: "InvTransact", fullName: "Transactions", formCode: "INVT", treeNode: 2, description: "Inventory Transactions" },


  { id: 20201, headId: 202, name: "InvTransact_PI", fullName: "Purchase Invoice", formCode: "PI", treeNode: 3, description: "Manage Purchase Invoice" },
  { id: 2020101, headId: 20201, name: "InvTransact_PI_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Purchase Invoice" },
  { id: 2020102, headId: 20201, name: "InvTransact_PI_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Purchase Invoice" },
  { id: 2020103, headId: 20201, name: "InvTransact_PI_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Purchase Invoice" },
  { id: 2020104, headId: 20201, name: "InvTransact_PI_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Purchase Invoice" },

  { id: 20202, headId: 202, name: "InvTransact_PIVAT", fullName: "Purchase VAT Invoice", formCode: "PIVAT", treeNode: 3, description: "Manage Purchase Invoice VAT" },
  { id: 2020201, headId: 20202, name: "InvTransact_PI_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Purchase Invoice VAT" },
  { id: 2020202, headId: 20202, name: "InvTransact_PI_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Purchase Invoice VAT" },
  { id: 2020203, headId: 20202, name: "InvTransact_PI_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Purchase Invoice VAT" },
  { id: 2020204, headId: 20202, name: "InvTransact_PI_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Purchase Invoice VAT" },

  { id: 20203, headId: 202, name: "InvTransact_PR", fullName: "Purchase Return", formCode: "PR", treeNode: 3, description: "Manage Purchase Return" },
  { id: 2020301, headId: 20203, name: "InvTransact_PR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Purchase Return" },
  { id: 2020302, headId: 20203, name: "InvTransact_PR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Purchase Return" },
  { id: 2020303, headId: 20203, name: "InvTransact_PR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Purchase Return" },
  { id: 2020304, headId: 20203, name: "InvTransact_PR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Purchase Return" },
  
  { id: 20204, headId: 202, name: "InvTransact_PRVAT", fullName: "Purchase Return VAT", formCode: "PRVAT", treeNode: 3, description: "Manage Purchase Return VAT" },
  { id: 2020401, headId: 20204, name: "InvTransact_PRVAT_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Purchase Return VAT" },
  { id: 2020402, headId: 20204, name: "InvTransact_PRVAT_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Purchase Return VAT" },
  { id: 2020403, headId: 20204, name: "InvTransact_PRVAT_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Purchase Return VAT" },
  { id: 2020404, headId: 20204, name: "InvTransact_PRVAT_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Purchase Return VAT" },
  
  { id: 20205, headId: 202, name: "InvTransact_PE", fullName: "Purchase Estimate", formCode: "PE", treeNode: 3, description: "Manage Purchase Estimate" },
  { id: 2020501, headId: 20205, name: "InvTransact_PE_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Purchase Estimate" },
  { id: 2020502, headId: 20205, name: "InvTransact_PE_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Purchase Estimate" },
  { id: 2020503, headId: 20205, name: "InvTransact_PE_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Purchase Estimate" },
  { id: 2020504, headId: 20205, name: "InvTransact_PE_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Purchase Estimate" },
  
  { id: 20206, headId: 202, name: "InvTransact_PO", fullName: "Purchase Order", formCode: "PO", treeNode: 3, description: "Manage Purchase Order" },
  { id: 2020601, headId: 20206, name: "InvTransact_PO_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Purchase Order" },
  { id: 2020602, headId: 20206, name: "InvTransact_PO_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Purchase Order" },
  { id: 2020603, headId: 20206, name: "InvTransact_PO_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Purchase Order" },
  { id: 2020604, headId: 20206, name: "InvTransact_PO_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Purchase Order" },
  
  { id: 20207, headId: 202, name: "InvTransact_PQ", fullName: "Purchase Quotation", formCode: "PQ", treeNode: 3, description: "Manage Purchase Quotation" },
  { id: 2020701, headId: 20207, name: "InvTransact_PQ_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Purchase Quotation" },
  { id: 2020702, headId: 20207, name: "InvTransact_PQ_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Purchase Quotation" },
  { id: 2020703, headId: 20207, name: "InvTransact_PQ_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Purchase Quotation" },
  { id: 2020704, headId: 20207, name: "InvTransact_PQ_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Purchase Quotation" },
  
  { id: 20208, headId: 202, name: "InvTransact_RFQ", fullName: "Request For Quotation", formCode: "RFQ", treeNode: 3, description: "Manage Request For Quotation" },
  { id: 2020801, headId: 20208, name: "InvTransact_RFQ_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Request For Quotation" },
  { id: 2020802, headId: 20208, name: "InvTransact_RFQ_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Request For Quotation" },
  { id: 2020803, headId: 20208, name: "InvTransact_RFQ_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Request For Quotation" },
  { id: 2020804, headId: 20208, name: "InvTransact_RFQ_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Request For Quotation" },
  
  { id: 20209, headId: 202, name: "InvTransact_SI", fullName: "Sales Invoice", formCode: "SI", treeNode: 3, description: "Manage Sales Invoice" },
  { id: 2020901, headId: 20209, name: "InvTransact_SI_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Invoice" },
  { id: 2020902, headId: 20209, name: "InvTransact_SI_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Invoice" },
  { id: 2020903, headId: 20209, name: "InvTransact_SI_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Invoice" },
  { id: 2020904, headId: 20209, name: "InvTransact_SI_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Invoice" },
  { id: 2020905, headId: 20209, name: "InvTransact_SI_BlockDiscount", fullName: "Block Discount", formCode: "BD", treeNode: 4, description: "Block Discount for Sales Invoice" },
  
  { id: 20210, headId: 202, name: "InvTransact_SIVAT", fullName: "Sales VAT Invoice", formCode: "SIVAT", treeNode: 3, description: "Manage Sales VAT Invoice" },
  { id: 2021001, headId: 20210, name: "InvTransact_SIVAT_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales VAT Invoice" },
  { id: 2021002, headId: 20210, name: "InvTransact_SIVAT_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales VAT Invoice" },
  { id: 2021003, headId: 20210, name: "InvTransact_SIVAT_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales VAT Invoice" },
  { id: 2021004, headId: 20210, name: "InvTransact_SIVAT_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales VAT Invoice" },
  { id: 2021005, headId: 20210, name: "InvTransact_SIVAT_BlockDiscount", fullName: "Block Discount", formCode: "BD", treeNode: 4, description: "Block Discount for Sales VAT Invoice" },
  
  { id: 20211, headId: 202, name: "InvTransact_CSV", fullName: "Cash Sales VAT", formCode: "CSIVAT", treeNode: 3, description: "Manage Cash Sales VAT" },
  { id: 2021101, headId: 20211, name: "InvTransact_CSV_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Cash Sales VAT" },
  { id: 2021102, headId: 20211, name: "InvTransact_CSV_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Cash Sales VAT" },
  { id: 2021103, headId: 20211, name: "InvTransact_CSV_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Cash Sales VAT" },
  { id: 2021104, headId: 20211, name: "InvTransact_CSV_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Cash Sales VAT" },
  { id: 2021105, headId: 20211, name: "InvTransact_CSV_BlockDiscount", fullName: "Block Discount", formCode: "BD", treeNode: 4, description: "Block Discount for Cash Sales VAT" },
  
  { id: 20212, headId: 202, name: "InvTransact_SR", fullName: "Sales Return", formCode: "SR", treeNode: 3, description: "Manage Sales Return" },
  { id: 2021201, headId: 20212, name: "InvTransact_SR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Return" },
  { id: 2021202, headId: 20212, name: "InvTransact_SR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Return" },
  { id: 2021203, headId: 20212, name: "InvTransact_SR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Return" },
  { id: 2021204, headId: 20212, name: "InvTransact_SR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Return" },
  { id: 2021205, headId: 20212, name: "InvTransact_SR_BlockDiscount", fullName: "Block Discount", formCode: "BD", treeNode: 4, description: "Block Discount for Sales Return" },
  
  { id: 20213, headId: 202, name: "InvTransact_SRVAT", fullName: "Sales Return VAT", formCode: "SRVAT", treeNode: 3, description: "Manage Sales Return VAT" },
  { id: 2021301, headId: 20213, name: "InvTransact_SRVAT_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Return VAT" },
  { id: 2021302, headId: 20213, name: "InvTransact_SRVAT_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Return VAT" },
  { id: 2021303, headId: 20213, name: "InvTransact_SRVAT_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Return VAT" },
  { id: 2021304, headId: 20213, name: "InvTransact_SRVAT_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Return VAT" },
  { id: 2021305, headId: 20213, name: "InvTransact_SRVAT_BlockDiscount", fullName: "Block Discount", formCode: "BD", treeNode: 4, description: "Block Discount for Sales Return VAT" },
  
  { id: 20214, headId: 202, name: "InvTransact_SE", fullName: "Sales Estimate", formCode: "SE", treeNode: 3, description: "Manage Sales Estimate" },
  { id: 2021401, headId: 20214, name: "InvTransact_SE_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Estimate" },
  { id: 2021402, headId: 20214, name: "InvTransact_SE_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Estimate" },
  { id: 2021403, headId: 20214, name: "InvTransact_SE_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Estimate" },
  { id: 2021404, headId: 20214, name: "InvTransact_SE_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Estimate" },
  
  { id: 20215, headId: 202, name: "InvTransact_SO", fullName: "Sales Order", formCode: "SO", treeNode: 3, description: "Manage Sales Order" },
  { id: 2021501, headId: 20215, name: "InvTransact_SO_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Order" },
  { id: 2021502, headId: 20215, name: "InvTransact_SO_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Order" },
  { id: 2021503, headId: 20215, name: "InvTransact_SO_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Order" },
  { id: 2021504, headId: 20215, name: "InvTransact_SO_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Order" },
  { id: 2021505, headId: 20215, name: "InvTransact_SO_BlockDiscount", fullName: "Block Discount", formCode: "BD", treeNode: 4, description: "Block Discount for Sales Order" },
  
  { id: 20216, headId: 202, name: "InvTransact_GR", fullName: "Goods Request", formCode: "GR", treeNode: 3, description: "Manage Goods Request" },
  { id: 2021601, headId: 20216, name: "InvTransact_GR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Goods Request" },
  { id: 2021602, headId: 20216, name: "InvTransact_GR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Goods Request" },
  { id: 2021603, headId: 20216, name: "InvTransact_GR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Goods Request" },
  { id: 2021604, headId: 20216, name: "InvTransact_GR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Goods Request" },
  
  { id: 20217, headId: 202, name: "InvTransact_SQ", fullName: "Sales Quotation", formCode: "SQ", treeNode: 3, description: "Manage Sales Quotation" },
  { id: 2021701, headId: 20217, name: "InvTransact_SQ_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Quotation" },
  { id: 2021702, headId: 20217, name: "InvTransact_SQ_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Quotation" },
  { id: 2021703, headId: 20217, name: "InvTransact_SQ_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Quotation" },
  { id: 2021704, headId: 20217, name: "InvTransact_SQ_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Quotation" },
  
  { id: 20218, headId: 202, name: "InvTransact_StockJourn", fullName: "Stock Journal", formCode: "SJ", treeNode: 4, description: "Stock Journal" },

  { id: 2021801, headId: 20218, name: "InvTransact_OS", fullName: "Opening Stock", formCode: "OS", treeNode: 3, description: "Manage Opening Stock" },
  { id: 202180101, headId: 2021801, name: "InvTransact_OS_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Opening Stock" },
  { id: 202180102, headId: 2021801, name: "InvTransact_OS_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Opening Stock" },
  { id: 202180103, headId: 2021801, name: "InvTransact_OS_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Opening Stock" },
  { id: 202180104, headId: 2021801, name: "InvTransact_OS_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Opening Stock" },
  
  { id: 2021802, headId: 20218, name: "InvTransact_ST", fullName: "Stock Transfer", formCode: "ST", treeNode: 3, description: "Manage Stock Transfer" },
  { id: 202180201, headId: 2021802, name: "InvTransact_ST_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Transfer" },
  { id: 202180202, headId: 2021802, name: "InvTransact_ST_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Transfer" },
  { id: 202180203, headId: 2021802, name: "InvTransact_ST_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Transfer" },
  { id: 202180204, headId: 2021802, name: "InvTransact_ST_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Transfer" },
  
  { id: 2021803, headId: 20218, name: "InvTransact_DE", fullName: "Damage Entry", formCode: "DMG", treeNode: 3, description: "Manage Damage Entry" },
  { id: 202180301, headId: 2021803, name: "InvTransact_DE_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Damage Entry" },
  { id: 202180302, headId: 2021803, name: "InvTransact_DE_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Damage Entry" },
  { id: 202180303, headId: 2021803, name: "InvTransact_DE_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Damage Entry" },
  { id: 202180304, headId: 2021803, name: "InvTransact_DE_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Damage Entry" },
  
  { id: 2021804, headId: 20218, name: "InvTransact_ES", fullName: "Excess Stock", formCode: "EX", treeNode: 3, description: "Manage Excess Stock" },
  { id: 202180401, headId: 2021804, name: "InvTransact_ES_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Excess Stock" },
  { id: 202180402, headId: 2021804, name: "InvTransact_ES_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Excess Stock" },
  { id: 202180403, headId: 2021804, name: "InvTransact_ES_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Excess Stock" },
  { id: 202180404, headId: 2021804, name: "InvTransact_ES_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Excess Stock" },
  
  { id: 2021805, headId: 20218, name: "InvTransact_SS", fullName: "Shortage Stock", formCode: "SH", treeNode: 3, description: "Manage Shortage Stock" },
  { id: 202180501, headId: 2021805, name: "InvTransact_SS_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Shortage Stock" },
  { id: 202180502, headId: 2021805, name: "InvTransact_SS_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Shortage Stock" },
  { id: 202180503, headId: 2021805, name: "InvTransact_SS_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Shortage Stock" },
  { id: 202180504, headId: 2021805, name: "InvTransact_SS_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Shortage Stock" },

  { id: 2021806, headId: 20218, name: "InvTransact_SA", fullName: "Stock Adjuster", formCode: "SA", treeNode: 3, description: "Manage Stock Adjuster" },
  { id: 202180601, headId: 2021806, name: "InvTransact_SA_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Adjuster" },
  { id: 202180602, headId: 2021806, name: "InvTransact_SA_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Adjuster" },
  { id: 202180603, headId: 2021806, name: "InvTransact_SA_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Adjuster" },
  { id: 202180604, headId: 2021806, name: "InvTransact_SA_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Adjuster" },

  { id: 2021807, headId: 20218, name: "InvTransact_BTO", fullName: "Branch Transfer Out", formCode: "BTO", treeNode: 3, description: "Manage Branch Transfer Out" },
  { id: 202180701, headId: 2021807, name: "InvTransact_BTO_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Branch Transfer Out" },
  { id: 202180702, headId: 2021807, name: "InvTransact_BTO_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Branch Transfer Out" },
  { id: 202180703, headId: 2021807, name: "InvTransact_BTO_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Branch Transfer Out" },
  { id: 202180704, headId: 2021807, name: "InvTransact_BTO_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Branch Transfer Out" },

  { id: 2021808, headId: 20218, name: "InvTransact_BTI", fullName: "Branch Transfer In", formCode: "BTI", treeNode: 3, description: "Manage Branch Transfer In" },
  { id: 202180801, headId: 2021808, name: "InvTransact_BTI_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Branch Transfer In" },
  { id: 202180802, headId: 2021808, name: "InvTransact_BTI_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Branch Transfer In" },
  { id: 202180803, headId: 2021808, name: "InvTransact_BTI_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Branch Transfer In" },
  { id: 202180804, headId: 2021808, name: "InvTransact_BTI_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Branch Transfer In" },

  { id: 2021809, headId: 20218, name: "InvTransact_STTB", fullName: "Stock Transfer To Branch", formCode: "SIBT", treeNode: 3, description: "Manage Stock Transfer To Branch" },
  { id: 202180901, headId: 2021809, name: "InvTransact_STTB_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Transfer To Branch" },
  { id: 202180902, headId: 2021809, name: "InvTransact_STTB_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Transfer To Branch" },
  { id: 202180903, headId: 2021809, name: "InvTransact_STTB_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Transfer To Branch" },
  { id: 202180904, headId: 2021809, name: "InvTransact_STTB_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Transfer To Branch" },

  { id: 2021810, headId: 20218, name: "InvTransact_STFB", fullName: "Stock Transfer From Branch", formCode: "PIBT", treeNode: 3, description: "Manage Stock Transfer From Branch" },
  { id: 202181001, headId: 2021810, name: "InvTransact_STFB_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Transfer From Branch" },
  { id: 202181002, headId: 2021810, name: "InvTransact_STFB_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Transfer From Branch" },
  { id: 202181003, headId: 2021810, name: "InvTransact_STFB_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Transfer From Branch" },
  { id: 202181004, headId: 2021810, name: "InvTransact_STFB_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Transfer From Branch" },

  { id: 2021811, headId: 20218, name: "InvTransact_ILR", fullName: "Item Load Request", formCode: "ILR", treeNode: 3, description: "Manage Item Load Request" },
  { id: 202181101, headId: 2021811, name: "InvTransact_ILR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Item Load Request" },
  { id: 202181102, headId: 2021811, name: "InvTransact_ILR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Item Load Request" },
  { id: 202181103, headId: 2021811, name: "InvTransact_ILR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Item Load Request" },
  { id: 202181104, headId: 2021811, name: "InvTransact_ILR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Item Load Request" },

  { id: 2021812, headId: 20218, name: "InvTransact_SC", fullName: "Stock Count", formCode: "SC", treeNode: 3, description: "Manage Stock Count" },
  { id: 202181201, headId: 2021812, name: "InvTransact_SC_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Count" },
  { id: 202181202, headId: 2021812, name: "InvTransact_SC_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Count" },
  { id: 202181203, headId: 2021812, name: "InvTransact_SC_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Count" },
  { id: 202181204, headId: 2021812, name: "InvTransact_SC_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Count" },


  // { id: 2021801, headId: 20218, name: "InvTransact_OS", fullName: "Opening Stock", formCode: "OS", treeNode: 3, description: "Manage Opening Stock" },
  // { id: 202180101, headId: 2021801, name: "InvTransact_OS_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Opening Stock" },
  // { id: 202180102, headId: 2021801, name: "InvTransact_OS_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Opening Stock" },
  // { id: 202180103, headId: 2021801, name: "InvTransact_OS_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Opening Stock" },
  // { id: 202180104, headId: 2021801, name: "InvTransact_OS_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Opening Stock" },
  
  // { id: 2021802, headId: 20218, name: "InvTransact_ST", fullName: "Stock Transfer", formCode: "ST", treeNode: 3, description: "Manage Stock Transfer" },
  // { id: 202180201, headId: 2021802, name: "InvTransact_ST_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Transfer" },
  // { id: 202180202, headId: 2021802, name: "InvTransact_ST_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Transfer" },
  // { id: 202180203, headId: 2021802, name: "InvTransact_ST_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Transfer" },
  // { id: 202180204, headId: 2021802, name: "InvTransact_ST_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Transfer" },
  
//   { id: 20220, headId: 202, name: "InvTransact_DE", fullName: "Damage Entry", formCode: "DMG", treeNode: 3, description: "Manage Damage Entry" },
//   { id: 2022001, headId: 20220, name: "InvTransact_DE_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Damage Entry" },
//   { id: 2022002, headId: 20220, name: "InvTransact_DE_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Damage Entry" },
//   { id: 2022003, headId: 20220, name: "InvTransact_DE_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Damage Entry" },
//   { id: 2022004, headId: 20220, name: "InvTransact_DE_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Damage Entry" },
  
//   { id: 20221, headId: 202, name: "InvTransact_ES", fullName: "Excess Stock", formCode: "EX", treeNode: 3, description: "Manage Excess Stock" },
//   { id: 2022101, headId: 20221, name: "InvTransact_ES_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Excess Stock" },
//   { id: 2022102, headId: 20221, name: "InvTransact_ES_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Excess Stock" },
//   { id: 2022103, headId: 20221, name: "InvTransact_ES_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Excess Stock" },
//   { id: 2022104, headId: 20221, name: "InvTransact_ES_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Excess Stock" },
  
//   { id: 20222, headId: 202, name: "InvTransact_SS", fullName: "Shortage Stock", formCode: "SH", treeNode: 3, description: "Manage Shortage Stock" },
//   { id: 2022201, headId: 20222, name: "InvTransact_SS_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Shortage Stock" },
//   { id: 2022202, headId: 20222, name: "InvTransact_SS_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Shortage Stock" },
//   { id: 2022203, headId: 20222, name: "InvTransact_SS_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Shortage Stock" },
//   { id: 2022204, headId: 20222, name: "InvTransact_SS_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Shortage Stock" },

//   { id: 20223, headId: 202, name: "InvTransact_SA", fullName: "Stock Adjuster", formCode: "SA", treeNode: 3, description: "Manage Stock Adjuster" },
// { id: 2022301, headId: 20223, name: "InvTransact_SA_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Adjuster" },
// { id: 2022302, headId: 20223, name: "InvTransact_SA_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Adjuster" },
// { id: 2022303, headId: 20223, name: "InvTransact_SA_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Adjuster" },
// { id: 2022304, headId: 20223, name: "InvTransact_SA_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Adjuster" },

// { id: 20224, headId: 202, name: "InvTransact_BTO", fullName: "Branch Transfer Out", formCode: "BTO", treeNode: 3, description: "Manage Branch Transfer Out" },
// { id: 2022401, headId: 20224, name: "InvTransact_BTO_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Branch Transfer Out" },
// { id: 2022402, headId: 20224, name: "InvTransact_BTO_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Branch Transfer Out" },
// { id: 2022403, headId: 20224, name: "InvTransact_BTO_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Branch Transfer Out" },
// { id: 2022404, headId: 20224, name: "InvTransact_BTO_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Branch Transfer Out" },

// { id: 20225, headId: 202, name: "InvTransact_BTI", fullName: "Branch Transfer In", formCode: "BTI", treeNode: 3, description: "Manage Branch Transfer In" },
// { id: 2022501, headId: 20225, name: "InvTransact_BTI_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Branch Transfer In" },
// { id: 2022502, headId: 20225, name: "InvTransact_BTI_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Branch Transfer In" },
// { id: 2022503, headId: 20225, name: "InvTransact_BTI_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Branch Transfer In" },
// { id: 2022504, headId: 20225, name: "InvTransact_BTI_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Branch Transfer In" },

// { id: 20226, headId: 202, name: "InvTransact_STTB", fullName: "Stock Transfer To Branch", formCode: "SIBT", treeNode: 3, description: "Manage Stock Transfer To Branch" },
// { id: 2022601, headId: 20226, name: "InvTransact_STTB_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Transfer To Branch" },
// { id: 2022602, headId: 20226, name: "InvTransact_STTB_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Transfer To Branch" },
// { id: 2022603, headId: 20226, name: "InvTransact_STTB_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Transfer To Branch" },
// { id: 2022604, headId: 20226, name: "InvTransact_STTB_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Transfer To Branch" },

// { id: 20227, headId: 202, name: "InvTransact_STFB", fullName: "Stock Transfer From Branch", formCode: "PIBT", treeNode: 3, description: "Manage Stock Transfer From Branch" },
// { id: 2022701, headId: 20227, name: "InvTransact_STFB_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Transfer From Branch" },
// { id: 2022702, headId: 20227, name: "InvTransact_STFB_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Transfer From Branch" },
// { id: 2022703, headId: 20227, name: "InvTransact_STFB_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Transfer From Branch" },
// { id: 2022704, headId: 20227, name: "InvTransact_STFB_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Transfer From Branch" },

// { id: 20228, headId: 202, name: "InvTransact_ILR", fullName: "Item Load Request", formCode: "ILR", treeNode: 3, description: "Manage Item Load Request" },
// { id: 2022801, headId: 20228, name: "InvTransact_ILR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Item Load Request" },
// { id: 2022802, headId: 20228, name: "InvTransact_ILR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Item Load Request" },
// { id: 2022803, headId: 20228, name: "InvTransact_ILR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Item Load Request" },
// { id: 2022804, headId: 20228, name: "InvTransact_ILR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Item Load Request" },

// { id: 20229, headId: 202, name: "InvTransact_SC", fullName: "Stock Count", formCode: "SC", treeNode: 3, description: "Manage Stock Count" },
// { id: 2022901, headId: 20229, name: "InvTransact_SC_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Stock Count" },
// { id: 2022902, headId: 20229, name: "InvTransact_SC_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Stock Count" },
// { id: 2022903, headId: 20229, name: "InvTransact_SC_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Stock Count" },
// { id: 2022904, headId: 20229, name: "InvTransact_SC_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Stock Count" },







{ id: 20230, headId: 202, name: "InvTransact_SV", fullName: "Sales View", formCode: "SVW", treeNode: 3, description: "Manage Sales View" },
{ id: 2023001, headId: 20230, name: "InvTransact_SV_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales View" },
{ id: 2023002, headId: 20230, name: "InvTransact_SV_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales View" },

{ id: 20231, headId: 202, name: "InvTransact_SR", fullName: "Sales Receipt", formCode: "SLRCPT", treeNode: 3, description: "Manage Sales Receipt" },
{ id: 2023101, headId: 20231, name: "InvTransact_SR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Receipt" },
{ id: 2023102, headId: 20231, name: "InvTransact_SR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Receipt" },
{ id: 2023103, headId: 20231, name: "InvTransact_SR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Receipt" },
{ id: 2023104, headId: 20231, name: "InvTransact_SR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Receipt" },

{ id: 20232, headId: 202, name: "InvTransact_PT", fullName: "Post Transactions", formCode: "PTRANS", treeNode: 3, description: "Manage Post Transactions" },
{ id: 2023201, headId: 20232, name: "InvTransact_PT_Show", fullName: "Show", formCode: "S", treeNode: 4, description: "Show Post Transactions" },

{ id: 20233, headId: 202, name: "InvTransact_SVC", fullName: "Service", formCode: "SERV", treeNode: 3, description: "Manage Service" },
{ id: 2023301, headId: 20233, name: "InvTransact_SVC_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Service" },
{ id: 2023302, headId: 20233, name: "InvTransact_SVC_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Service" },
{ id: 2023303, headId: 20233, name: "InvTransact_SVC_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Service" },
{ id: 2023304, headId: 20233, name: "InvTransact_SVC_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Service" },

{ id: 20234, headId: 202, name: "InvTransact_SVCI", fullName: "Service Invoice", formCode: "SRVI", treeNode: 3, description: "Manage Service Invoice" },
{ id: 2023401, headId: 20234, name: "InvTransact_SVCI_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Service Invoice" },
{ id: 2023402, headId: 20234, name: "InvTransact_SVCI_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Service Invoice" },
{ id: 2023403, headId: 20234, name: "InvTransact_SVCI_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Service Invoice" },
{ id: 2023404, headId: 20234, name: "InvTransact_SVCI_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Service Invoice" },

{ id: 20235, headId: 202, name: "InvTransact_SVCR", fullName: "Service Return", formCode: "SVRT", treeNode: 3, description: "Manage Service Return" },
{ id: 2023501, headId: 20235, name: "InvTransact_SVCR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Service Return" },
{ id: 2023502, headId: 20235, name: "InvTransact_SVCR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Service Return" },
{ id: 2023503, headId: 20235, name: "InvTransact_SVCR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Service Return" },
{ id: 2023504, headId: 20235, name: "InvTransact_SVCR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Service Return" },

{ id: 20236, headId: 202, name: "InvTransact_SUB", fullName: "Substitute", formCode: "SUB", treeNode: 3, description: "Manage Substitute" },
{ id: 2023601, headId: 20236, name: "InvTransact_SUB_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Substitute" },
{ id: 2023602, headId: 20236, name: "InvTransact_SUB_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Substitute" },
{ id: 2023603, headId: 20236, name: "InvTransact_SUB_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Substitute" },
{ id: 2023604, headId: 20236, name: "InvTransact_SUB_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Substitute" },

{ id: 20237, headId: 202, name: "InvTransact_GD", fullName: "Goods Delivery", formCode: "GD", treeNode: 3, description: "Manage Goods Delivery" },
{ id: 2023701, headId: 20237, name: "InvTransact_GD_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Goods Delivery" },
{ id: 2023702, headId: 20237, name: "InvTransact_GD_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Goods Delivery" },
{ id: 2023703, headId: 20237, name: "InvTransact_GD_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Goods Delivery" },
{ id: 2023704, headId: 20237, name: "InvTransact_GD_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Goods Delivery" },
{ id: 2023705, headId: 20237, name: "InvTransact_GD_BlockDiscount", fullName: "Block Discount", formCode: "B", treeNode: 4, description: "Block Discount for Goods Delivery" },

{ id: 20238, headId: 202, name: "InvTransact_GDR", fullName: "Goods Delivery Return", formCode: "DR", treeNode: 3, description: "Manage Goods Delivery Return" },
{ id: 2023801, headId: 20238, name: "InvTransact_GDR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Goods Delivery Return" },
{ id: 2023802, headId: 20238, name: "InvTransact_GDR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Goods Delivery Return" },
{ id: 2023803, headId: 20238, name: "InvTransact_GDR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Goods Delivery Return" },
{ id: 2023804, headId: 20238, name: "InvTransact_GDR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Goods Delivery Return" },

{ id: 20239, headId: 202, name: "InvTransact_GR", fullName: "Goods Receipt", formCode: "GRN", treeNode: 3, description: "Manage Goods Receipt" },
{ id: 2023901, headId: 20239, name: "InvTransact_GR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Goods Receipt" },
{ id: 2023902, headId: 20239, name: "InvTransact_GR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Goods Receipt" },
{ id: 2023903, headId: 20239, name: "InvTransact_GR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Goods Receipt" },
{ id: 2023904, headId: 20239, name: "InvTransact_GR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Goods Receipt" },

{ id: 20240, headId: 202, name: "InvTransact_GRR", fullName: "Goods Receipt Return", formCode: "GRR", treeNode: 3, description: "Manage Goods Receipt Return" },
{ id: 2024001, headId: 20240, name: "InvTransact_GRR_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Goods Receipt Return" },
{ id: 2024002, headId: 20240, name: "InvTransact_GRR_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Goods Receipt Return" },
{ id: 2024003, headId: 20240, name: "InvTransact_GRR_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Goods Receipt Return" },
{ id: 2024004, headId: 20240, name: "InvTransact_GRR_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Goods Receipt Return" },

{ id: 20241, headId: 202, name: "InvTransact_JT", fullName: "Job Track", formCode: "JT", treeNode: 3, description: "Manage Job Track" },
{ id: 2024101, headId: 20241, name: "InvTransact_JT_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Job Track" },

{ id: 20242, headId: 202, name: "InvTransact_SD", fullName: "Sales Discount", formCode: "SD", treeNode: 3, description: "Manage Sales Discount" },
{ id: 2024201, headId: 20242, name: "InvTransact_SD_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Sales Discount" },
{ id: 2024202, headId: 20242, name: "InvTransact_SD_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Sales Discount" },
{ id: 2024203, headId: 20242, name: "InvTransact_SD_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Sales Discount" },
{ id: 2024204, headId: 20242, name: "InvTransact_SD_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Sales Discount" },

{ id: 20243, headId: 202, name: "ServiceInvoice", fullName: "Service Invoice", formCode: "SVI", treeNode: 3, description: "Manage Service Invoice" },
{ id: 2024301, headId: 20243, name: "ServiceInvoice_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Service Invoice" },
{ id: 2024302, headId: 20243, name: "ServiceInvoice_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Service Invoice" },
{ id: 2024303, headId: 20243, name: "ServiceInvoice_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Service Invoice" },
{ id: 2024304, headId: 20243, name: "ServiceInvoice_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Service Invoice" },

{ id: 20244, headId: 202, name: "InvTransact_SF", fullName: "Staff Food", formCode: "STF", treeNode: 3, description: "Manage Staff Food" },
{ id: 2024401, headId: 20244, name: "InvTransact_SF_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Staff Food" },
{ id: 2024402, headId: 20244, name: "InvTransact_SF_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Staff Food" },
{ id: 2024403, headId: 20244, name: "InvTransact_SF_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Staff Food" },
{ id: 2024404, headId: 20244, name: "InvTransact_SF_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Staff Food" },

{ id: 20245, headId: 202, name: "InvTransact_PI", fullName: "Purchase Import", formCode: "PIIMPORT", treeNode: 3, description: "Manage Purchase Import" },
{ id: 2024501, headId: 20245, name: "InvTransact_PI_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Purchase Import" },
{ id: 2024502, headId: 20245, name: "InvTransact_PI_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Purchase Import" },
{ id: 2024503, headId: 20245, name: "InvTransact_PI_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Purchase Import" },
{ id: 2024504, headId: 20245, name: "InvTransact_PI_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Purchase Import" },
  //#endregion Inventory Transaction


  //#region Inventory Reports
 { id: 203, headId: 2, name: "InvReports", fullName: "Reports", formCode: "INVR", treeNode: 2, description: "Inventory Reports" },


 { id: 20301, headId: 203, name: "NdPrdLists", fullName: "Product List", formCode: "PL", treeNode: 3, description: "Manage Product List" },
{ id: 2030101, headId: 20301, name: "NdPrdLists_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Product List Print" },
{ id: 2030102, headId: 20301, name: "NdPrdLists_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Product List Settings" },
{ id: 2030103, headId: 20301, name: "NdPrdLists_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Product List Export" },
//#region Sales Report sepearte Menu
{ id: 20302, headId: 203, name: "NdSales", fullName: "Sales", formCode: "SALERPT", treeNode: 2, description: "Sales Reports main" },

{ id: 2030201, headId: 20302, name: "NdSalesSummary", fullName: "Sales Summary", formCode: "RPTSLSUM", treeNode: 3, description: "Manage Sales Summary" },
{ id: 203020101, headId: 2030201, name: "NdSalesSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales Summary Print" },
{ id: 203020102, headId: 2030201, name: "NdSalesSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales Summary Settings" },
{ id: 203020103, headId: 2030201, name: "NdSalesSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales Summary Export" },

{ id: 2030202, headId: 20302, name: "NdSalesRegistry", fullName: "Sales Register", formCode: "RPTSRSUM", treeNode: 3, description: "Manage Sales Registry" },
{ id: 203020201, headId: 2030202, name: "NdSalesRegistry_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales Registry Print" },
{ id: 203020202, headId: 2030202, name: "NdSalesRegistry_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales Registry Settings" },
{ id: 203020203, headId: 2030202, name: "NdSalesRegistry_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales Registry Export" },

{ id: 2030203, headId: 20302, name: "NdPartyWiseSales", fullName: "Party Wise Sales", formCode: "RPTPRTSL", treeNode: 3, description: "Manage Party Wise Sales" },
{ id: 203020301, headId: 2030203, name: "NdPartyWiseSales_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Party Wise Sales Print" },
{ id: 203020302, headId: 2030203, name: "NdPartyWiseSales_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Party Wise Sales Settings" },
{ id: 203020303, headId: 2030203, name: "NdPartyWiseSales_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Party Wise Sales Export" },

{ id: 2030204, headId: 20302, name: "NdSlTaxReport", fullName: "Tax Report", formCode: "RPTSITAX", treeNode: 3, description: "Manage Tax Report" },
{ id: 203020401, headId: 2030204, name: "NdTaxReport_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Tax Report Print" },
{ id: 203020402, headId: 2030204, name: "NdTaxReport_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Tax Report Settings" },
{ id: 203020403, headId: 2030204, name: "NdTaxReport_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Tax Report Export" },

{ id: 2030205, headId: 20302, name: "NdSalesReturnSummary", fullName: "Sales Return Summary", formCode: "RPTSRSUM", treeNode: 3, description: "Manage Sales Return Summary" },
{ id: 203020501, headId: 2030205, name: "NdSalesReturnSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales Return Summary Print" },
{ id: 203020502, headId: 2030205, name: "NdSalesReturnSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales Return Summary Settings" },
{ id: 203020503, headId: 2030205, name: "NdSalesReturnSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales Return Summary Export" },

{ id: 2030206, headId: 20302, name: "NdSalesReturnRegistry", fullName: "Sales Return Register", formCode: "RPTSRREG", treeNode: 3, description: "Manage Sales Return Registry" },
{ id: 203020601, headId: 2030206, name: "NdSalesReturnRegistry_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales Return Registry Print" },
{ id: 203020602, headId: 2030206, name: "NdSalesReturnRegistry_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales Return Registry Settings" },
{ id: 203020603, headId: 2030206, name: "NdSalesReturnRegistry_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales Return Registry Export" },

{ id: 2030207, headId: 20302, name: "NdSalesAndSalesReturn", fullName: "Sales and Sales Return", formCode: "RPTSSR", treeNode: 3, description: "Manage Sales and Sales Return" },
{ id: 203020701, headId: 2030207, name: "NdSalesAndSalesReturn_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales and Sales Return Print" },
{ id: 203020702, headId: 2030207, name: "NdSalesAndSalesReturn_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales and Sales Return Settings" },
{ id: 203020703, headId: 2030207, name: "NdSalesAndSalesReturn_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales and Sales Return Export" },

{ id: 2030208, headId: 20302, name: "NdOrderSummary", fullName: "Order Summary", formCode: "RPTORDSM", treeNode: 3, description: "Manage Order Summary" },
{ id: 203020801, headId: 2030208, name: "NdOrderSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Order Summary Settings" },
{ id: 203020802, headId: 2030208, name: "NdOrderSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Order Summary Print" },
{ id: 203020803, headId: 2030208, name: "NdOrderSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Order Summary Export" },

{ id: 2030209, headId: 20302, name: "NdAreaWiseSales", fullName: "Area Wise Sales", formCode: "RPTARWS", treeNode: 3, description: "Manage Area Wise Sales" },
{ id: 203020901, headId: 2030209, name: "NdAreaWiseSales_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Area Wise Sales Settings" },
{ id: 203020902, headId: 2030209, name: "NdAreaWiseSales_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Area Wise Sales Print" },
{ id: 203020903, headId: 2030209, name: "NdAreaWiseSales_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Area Wise Sales Export" },

{ id: 2030210, headId: 20302, name: "NdSalesEstimateSummary", fullName: "Sales Estimate Summary", formCode: "RPTSES", treeNode: 3, description: "Manage Sales Estimate Summary" },
{ id: 203021001, headId: 2030210, name: "NdSalesEstimateSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales Estimate Summary Print" },
{ id: 203021002, headId: 2030210, name: "NdSalesEstimateSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales Estimate Summary Settings" },
{ id: 203021003, headId: 2030210, name: "NdSalesEstimateSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales Estimate Summary Export" },

{ id: 2030211, headId: 20302, name: "NdSalesQuotationSummary", fullName: "Sales Quotation Summary", formCode: "RPTSQS", treeNode: 3, description: "Manage Sales Quotation Summary" },
{ id: 203021101, headId: 2030211, name: "NdSalesQuotationSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales Quotation Summary Print" },
{ id: 203021102, headId: 2030211, name: "NdSalesQuotationSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales Quotation Summary Settings" },
{ id: 203021103, headId: 2030211, name: "NdSalesQuotationSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales Quotation Summary Export" },

{ id: 2030212, headId: 20302, name: "NdBookingSummary", fullName: "Booking Summary", formCode: "RPTBKSSUM", treeNode: 3, description: "Manage Booking Summary" },
{ id: 203021201, headId: 2030212, name: "NdBookingSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Booking Summary Print" },

{ id: 2030213, headId: 20302, name: "NdSubstituteReport", fullName: "Substitute Report", formCode: "RPTSUB", treeNode: 3, description: "Manage Substitute Report" },
{ id: 203021301, headId: 2030213, name: "NdSubstituteReport_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Substitute Report Print" },
{ id: 203021302, headId: 2030213, name: "NdSubstituteReport_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Substitute Report Settings" },
{ id: 203021303, headId: 2030213, name: "NdSubstituteReport_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Substitute Report Export" },

{ id: 2030214, headId: 20302, name: "NdGroupWiseSalesReport", fullName: "Group Wise Sales Report", formCode: "GRPWSSLRPT", treeNode: 3, description: "Manage Group Wise Sales Report" },
{ id: 203021401, headId: 2030214, name: "NdGroupWiseSalesReport_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Group Wise Sales Report Print" },

{ id: 2030215, headId: 20302, name: "NdOtherSalesReports", fullName: "Other Sales Reports", formCode: "RPTOTHSLS", treeNode: 3, description: "Manage Other Sales Reports" },

{ id: 2030216, headId: 2030215, name: "NdCouponSalesReport", fullName: "Coupon Sales Report", formCode: "COUPSALRPT", treeNode: 4, description: "Manage Coupon Sales Report" },
{ id: 203021601, headId: 2030216, name: "NdCouponSalesReport_Print", fullName: "Print", formCode: "P", treeNode: 5, description: "Coupon Sales Report Print" },
{ id: 203021602, headId: 2030216, name: "NdCouponSalesReport_Show", fullName: "Show", formCode: "S", treeNode: 5, description: "Coupon Sales Report Show" },

{ id: 2030217, headId: 2030215, name: "NdSchemeWiseSalesReport", fullName: "Scheme Wise Sales Report", formCode: "ITMSCMSRPT", treeNode: 4, description: "Manage Scheme Wise Sales Report" },
{ id: 203021701, headId: 2030217, name: "NdSchemeWiseSalesReport_Show", fullName: "Show", formCode: "S", treeNode: 5, description: "Scheme Wise Sales Report Show" },
{ id: 203021702, headId: 2030217, name: "NdSchemeWiseSalesReport_Print", fullName: "Print", formCode: "P", treeNode: 5, description: "Scheme Wise Sales Report Print" },
//#endregion Sales Report sepearte Menu

//#region Purchase Report sepearte Menu
{ id: 20303, headId: 203, name: "NdPurchase", fullName: "Purchase", formCode: "PURCRPT", treeNode: 2, description: "Sales Reports main" },

{ id: 2030301, headId: 20303, name: "NdPurchaseSummary", fullName: "Purchase Summary", formCode: "RPTPURSUM", treeNode: 3, description: "Manage Purchase Summary" },
{ id: 203030101, headId: 2030301, name: "NdPurchaseSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Purchase Summary Print" },
{ id: 203030102, headId: 2030301, name: "NdPurchaseSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Purchase Summary Settings" },
{ id: 203030103, headId: 2030301, name: "NdPurchaseSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Purchase Summary Export" },

{ id: 2030302, headId: 20303, name: "NdPurchaseRegistry", fullName: "Purchase Register", formCode: "RPTPURREG", treeNode: 3, description: "Manage Purchase Registry" },
{ id: 203030201, headId: 2030302, name: "NdPurchaseRegistry_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Purchase Registry Print" },
{ id: 203030202, headId: 2030302, name: "NdPurchaseRegistry_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Purchase Registry Settings" },
{ id: 203030203, headId: 2030302, name: "NdPurchaseRegistry_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Purchase Registry Export" },

{ id: 2030303, headId: 20303, name: "NdPartyWisePurchase", fullName: "Party Wise Purchase", formCode: "RPTPWP", treeNode: 3, description: "Manage Party Wise Purchase" },
{ id: 203030301, headId: 2030303, name: "NdPartyWisePurchase_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Party Wise Purchase Print" },
{ id: 203030302, headId: 2030303, name: "NdPartyWisePurchase_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Party Wise Purchase Settings" },
{ id: 203030303, headId: 2030303, name: "NdPartyWisePurchase_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Party Wise Purchase Export" },

{ id: 2030304, headId: 20303, name: "NdPurchaseTaxReport", fullName: "Tax Report", formCode: "RPTPITX", treeNode: 3, description: "Manage Purchase Tax Report" },
{ id: 203030401, headId: 2030304, name: "NdPurchaseTaxReport_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Purchase Tax Report Print" },
{ id: 203030402, headId: 2030304, name: "NdPurchaseTaxReport_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Purchase Tax Report Settings" },
{ id: 203030403, headId: 2030304, name: "NdPurchaseTaxReport_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Purchase Tax Report Export" },

{ id: 2030305, headId: 20303, name: "NdPurchaseReturnSummary", fullName: "Purchase Return Summary", formCode: "RPTPRSUM", treeNode: 3, description: "Manage Purchase Return Summary" },
{ id: 203030501, headId: 2030305, name: "NdPurchaseReturnSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Purchase Return Summary Print" },
{ id: 203030502, headId: 2030305, name: "NdPurchaseReturnSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Purchase Return Summary Settings" },
{ id: 203030503, headId: 2030305, name: "NdPurchaseReturnSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Purchase Return Summary Export" },

{ id: 2030306, headId: 20303, name: "NdPurchaseReturnRegister", fullName: "Purchase Return Register", formCode: "RPTPRREG", treeNode: 3, description: "Manage Purchase Return Register" },
{ id: 203030601, headId: 2030306, name: "NdPurchaseReturnRegister_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Purchase Return Register Print" },
{ id: 203030602, headId: 2030306, name: "NdPurchaseReturnRegister_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Purchase Return Register Settings" },
{ id: 203030603, headId: 2030306, name: "NdPurchaseReturnRegister_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Purchase Return Register Export" },

{ id: 2030307, headId: 20303, name: "NdPurchaseEstimateSummary", fullName: "Purchase Estimate Summary", formCode: "RPTPES", treeNode: 3, description: "Manage Purchase Estimate Summary" },
{ id: 203030701, headId: 2030307, name: "NdPurchaseEstimateSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Purchase Estimate Summary Print" },
{ id: 203030702, headId: 2030307, name: "NdPurchaseEstimateSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Purchase Estimate Summary Settings" },
{ id: 203030703, headId: 2030307, name: "NdPurchaseEstimateSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Purchase Estimate Summary Export" },

{ id: 2030308, headId: 20303, name: "NdPurchaseOrderSummary", fullName: "Purchase Order Summary", formCode: "RPTPOS", treeNode: 3, description: "Manage Purchase Order Summary" },
{ id: 203030801, headId: 2030308, name: "NdPurchaseOrderSummary_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Purchase Order Summary Print" },
{ id: 203030802, headId: 2030308, name: "NdPurchaseOrderSummary_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Purchase Order Summary Settings" },
{ id: 203030803, headId: 2030308, name: "NdPurchaseOrderSummary_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Purchase Order Summary Export" },

//#endregion Purchase Report sepearte Menu
{ id: 20304, headId: 203, name: "trTaxReports", fullName: "Tax Reports", formCode: "TAXRPT", treeNode: 3, description: "Manage Tax Reports" },
{ id: 2030401, headId: 20304, name: "trTaxReports_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Tax Reports Print" },
{ id: 2030402, headId: 20304, name: "trTaxReports_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Tax Reports Settings" },
{ id: 2030403, headId: 20304, name: "trTaxReports_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Tax Reports Export" },
  //#region Itemwise report
  { id: 20305, headId: 203, name: "NdItemSumm", fullName: "Item Wise Summary", formCode: "ITWSUM", treeNode: 2, description: "Item Wise Summary main" },

{ id: 2030501, headId: 20305, name: "NdSalesItem", fullName: "Sales", formCode: "ITSIRPT", treeNode: 3, description: "Manage Sales Itemwsie" },
{ id: 203050101, headId: 2030501, name: "NdSalesItem_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales Itemwsie Print" },
{ id: 203050102, headId: 2030501, name: "NdSalesItem_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales Itemwsie Settings" },
{ id: 203050103, headId: 2030501, name: "NdSalesItem_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales Itemwsie Export" },

{ id: 2030502, headId: 20305, name: "NdSalesItem", fullName: "Sales", formCode: "ITSIRPT", treeNode: 3, description: "Manage Sales Itemwsie" },
{ id: 203050201, headId: 2030502, name: "NdSalesItem_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Sales Itemwsie Print" },
{ id: 203050202, headId: 2030502, name: "NdSalesItem_Settings", fullName: "Settings", formCode: "S", treeNode: 4, description: "Sales Itemwsie Settings" },
{ id: 203050203, headId: 2030502, name: "NdSalesItem_Export", fullName: "Export", formCode: "X", treeNode: 4, description: "Sales Itemwsie Export" },
  //#endregion Itemwise Report








  //#endregion Inventory Reports
 //#endregion Inventory
 //customer supplier seperate for 
  
  // Reports
  // Account Reports Main


  
 
];