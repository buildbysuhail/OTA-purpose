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

  // Masters
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

  { id: 10107, headId: 101, name: "AccMaster_Customers", fullName: "Customers", formCode: "PARTIES", treeNode: 3, description: "Manage Customers" },
  { id: 1010701, headId: 10107, name: "AccMaster_Customers_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Customer" },
  { id: 1010702, headId: 10107, name: "AccMaster_Customers_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Customer" },
  { id: 1010703, headId: 10107, name: "AccMaster_Customers_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Customer" },
  { id: 1010704, headId: 10107, name: "AccMaster_Customers_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Customer" },

  { id: 10108, headId: 101, name: "AccMaster_Suppliers", fullName: "Suppliers", formCode: "PARTIES", treeNode: 3, description: "Manage Suppliers" },
  { id: 1010801, headId: 10108, name: "AccMaster_Suppliers_Add", fullName: "Add", formCode: "A", treeNode: 4, description: "Add Supplier" },
  { id: 1010802, headId: 10108, name: "AccMaster_Suppliers_Edit", fullName: "Edit", formCode: "E", treeNode: 4, description: "Edit Supplier" },
  { id: 1010803, headId: 10108, name: "AccMaster_Suppliers_Delete", fullName: "Delete", formCode: "D", treeNode: 4, description: "Delete Supplier" },
  { id: 1010804, headId: 10108, name: "AccMaster_Suppliers_Print", fullName: "Print", formCode: "P", treeNode: 4, description: "Print Supplier" },

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

  // Transactions
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

  // Reports
  // Account Reports Main
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

  // Utilities
  { id: 104, headId: 1, name: "AccUtilities", fullName: "Utilities", formCode: "ACCU", treeNode: 2, description: "Account Utilities" },
  { id: 10401, headId: 104, name: "ndFinancialYearSelection", fullName: "Financial Year Selection/Change", formCode: "FY_CHG", treeNode: 1, description: "Financial Year Selection/Change Menu Item" },
  { id: 1041101, headId: 10401, name: "ndFinancialYearSelection_Show_List", fullName: "Show List", formCode: "S", treeNode: 1, description: "Show List Menu Item" },
  { id: 10411001, headId: 1041101, name: "ndFinancialYearSelection_Show_List_show", fullName: "Show", formCode: "S", treeNode: 1, description: "Show Menu Item" },
  { id: 1041102, headId: 10401, name: "ndFinancialYearSelection_Add", fullName: "Add", formCode: "A", treeNode: 1, description: "Add Menu Item" },
  { id: 10402, headId: 104, name: "ndPrePostDatedTransModify", fullName: "Pre/Post Dated Transaction Modify", formCode: "PRE_POST", treeNode: 1, description: "Pre/Post Dated Transaction Modify Menu Item" },
  { id: 1041201, headId: 10402, name: "ndPrePostDatedTransModify_Block", fullName: "Block Add,Edit,Delete", formCode: "B", treeNode: 1, description: "Block Add,Edit,Delete Menu Item" },
  { id: 10412001, headId: 1041201, name: "Node0", fullName: "", formCode: "", treeNode: 1, description: "" },
];