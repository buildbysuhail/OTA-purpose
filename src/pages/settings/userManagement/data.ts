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
  { id: 1020903, headId: 10209, name: "AccTransact_PDC_Report", fullName: "Report", formCode: "CQRpt", treeNode: 4, description: "View PDC Reports" },

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
  { id: 103, headId: 1, name: "AccReports", fullName: "Reports", formCode: "ACCR", treeNode: 2, description: "Account Reports" },
  { id: 10301, headId: 103, name: "AccReports_DayBook", fullName: "Day Book", formCode: "DAYBOOK", treeNode: 3, description: "View Day Book Report" },
  { id: 10302, headId: 103, name: "AccReports_CashBook", fullName: "Cash Book", formCode: "CASHBOOK", treeNode: 3, description: "View Cash Book Report" },
  { id: 10303, headId: 103, name: "AccReports_BankBook", fullName: "Bank Book", formCode: "BANKBOOK", treeNode: 3, description: "View Bank Book Report" },
  { id: 10304, headId: 103, name: "AccReports_JournalBook", fullName: "Journal Book", formCode: "JRNLBOOK", treeNode: 3, description: "View Journal Book Report" },
  { id: 10305, headId: 103, name: "AccReports_LedgerBook", fullName: "Ledger Book", formCode: "LDGRBOOK", treeNode: 3, description: "View Ledger Book Report" },
  { id: 10306, headId: 103, name: "AccReports_TrialBalance", fullName: "Trial Balance", formCode: "TRLBAL", treeNode: 3, description: "View Trial Balance Report" },
  { id: 10307, headId: 103, name: "AccReports_ProfitLoss", fullName: "Profit & Loss", formCode: "PNL", treeNode: 3, description: "View Profit & Loss Report" },
  { id: 10308, headId: 103, name: "AccReports_BalanceSheet", fullName: "Balance Sheet", formCode: "BALSHEET", treeNode: 3, description: "View Balance Sheet Report" },
  { id: 10309, headId: 103, name: "AccReports_CashFlow", fullName: "Cash Flow", formCode: "CASHFLOW", treeNode: 3, description: "View Cash Flow Report" },
  { id: 10310, headId: 103, name: "AccReports_FundFlow", fullName: "Fund Flow", formCode: "FUNDFLOW", treeNode: 3, description: "View Fund Flow Report" },
  { id: 10311, headId: 103, name: "AccReports_ReceivablePayable", fullName: "Receivable & Payable", formCode: "RECPAY", treeNode: 3, description: "View Receivable & Payable Report" },
  { id: 10312, headId: 103, name: "AccReports_AgingAnalysis", fullName: "Aging Analysis", formCode: "AGEANAL", treeNode: 3, description: "View Aging Analysis Report" },
  { id: 10313, headId: 103, name: "AccReports_CostCenterReport", fullName: "Cost Center Report", formCode: "COSTCNTR", treeNode: 3, description: "View Cost Center Report" },
  { id: 10314, headId: 103, name: "AccReports_BudgetReport", fullName: "Budget Report", formCode: "BUDGET", treeNode: 3, description: "View Budget Report" },
  { id: 10315, headId: 103, name: "AccReports_VATReport", fullName: "VAT Report", formCode: "VAT", treeNode: 3, description: "View VAT Report" },
  { id: 10316, headId: 103, name: "AccReports_TaxReport", fullName: "Tax Report", formCode: "TAX", treeNode: 3, description: "View Tax Report" },
  { id: 10317, headId: 103, name: "AccReports_BankReconciliation", fullName: "Bank Reconciliation", formCode: "BANKREC", treeNode: 3, description: "View Bank Reconciliation Report" },
  { id: 10318, headId: 103, name: "AccReports_PDCReport", fullName: "PDC Report", formCode: "PDC", treeNode: 3, description: "View PDC Report" },
  { id: 10319, headId: 103, name: "AccReports_CashTenderReport", fullName: "Cash Tender Report", formCode: "CASHTENDER", treeNode: 3, description: "View Cash Tender Report" },
  { id: 10320, headId: 103, name: "AccReports_TaxOnExpensesReport", fullName: "Tax On Expenses Report", formCode: "TAXEXP", treeNode: 3, description: "View Tax On Expenses Report" },

  // Utilities
  { id: 104, headId: 1, name: "AccUtilities", fullName: "Utilities", formCode: "ACCU", treeNode: 2, description: "Account Utilities" },
  { id: 10401, headId: 104, name: "AccUtilities_YearEnd", fullName: "Year End", formCode: "YEAREND", treeNode: 3, description: "Perform Year End Closing" },
  { id: 10402, headId: 104, name: "AccUtilities_DataBackup", fullName: "Data Backup", formCode: "BACKUP", treeNode: 3, description: "Perform Data Backup" },
  { id: 10403, headId: 104, name: "AccUtilities_DataRestore", fullName: "Data Restore", formCode: "RESTORE", treeNode: 3, description: "Perform Data Restore" },
  { id: 10404, headId: 104, name: "AccUtilities_DataExport", fullName: "Data Export", formCode: "EXPORT", treeNode: 3, description: "Perform Data Export" },
  { id: 10405, headId: 104, name: "AccUtilities_DataImport", fullName: "Data Import", formCode: "IMPORT", treeNode: 3, description: "Perform Data Import" },
  { id: 10406, headId: 104, name: "AccUtilities_AuditTrail", fullName: "Audit Trail", formCode: "AUDIT", treeNode: 3, description: "View Audit Trail" },
  { id: 10407, headId: 104, name: "AccUtilities_UserRights", fullName: "User Rights", formCode: "USERRIGHTS", treeNode: 3, description: "Manage User Rights" },
  { id: 10408, headId: 104, name: "AccUtilities_SystemSettings", fullName: "System Settings", formCode: "SETTINGS", treeNode: 3, description: "Manage System Settings" },
  { id: 10409, headId: 104, name: "AccUtilities_CompanyInfo", fullName: "Company Info", formCode: "COMPINFO", treeNode: 3, description: "Manage Company Information" },
  { id: 10410, headId: 104, name: "AccUtilities_FinancialYear", fullName: "Financial Year", formCode: "FINYEAR", treeNode: 3, description: "Manage Financial Year" },
  { id: 10411, headId: 104, name: "AccUtilities_TaxSettings", fullName: "Tax Settings", formCode: "TAXSETTINGS", treeNode: 3, description: "Manage Tax Settings" },
  { id: 10412, headId: 104, name: "AccUtilities_CurrencySettings", fullName: "Currency Settings", formCode: "CURRSETTINGS", treeNode: 3, description: "Manage Currency Settings" },
  { id: 10413, headId: 104, name: "AccUtilities_DocumentNumbering", fullName: "Document Numbering", formCode: "DOCNUM", treeNode: 3, description: "Manage Document Numbering" },
  { id: 10414, headId: 104, name: "AccUtilities_EmailSettings", fullName: "Email Settings", formCode: "EMAILSETTINGS", treeNode: 3, description: "Manage Email Settings" },
  { id: 10415, headId: 104, name: "AccUtilities_SMSSettings", fullName: "SMS Settings", formCode: "SMSSETTINGS", treeNode: 3, description: "Manage SMS Settings" },
  { id: 10416, headId: 104, name: "AccUtilities_PrintSettings", fullName: "Print Settings", formCode: "PRINTSETTINGS", treeNode: 3, description: "Manage Print Settings" },
  { id: 10417, headId: 104, name: "AccUtilities_DatabaseMaintenance", fullName: "Database Maintenance", formCode: "DBMAINT", treeNode: 3, description: "Perform Database Maintenance" },
  { id: 10418, headId: 104, name: "AccUtilities_LicenseInfo", fullName: "License Info", formCode: "LICENSE", treeNode: 3, description: "View License Information" },
  { id: 10419, headId: 104, name: "AccUtilities_Help", fullName: "Help", formCode: "HELP", treeNode: 3, description: "Access Help Documentation" },
  { id: 10420, headId: 104, name: "AccUtilities_About", fullName: "About", formCode: "ABOUT", treeNode: 3, description: "View About Information" }
];