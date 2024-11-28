export interface ApplicationAccountSettings {
    defaultCashAcc: number;
    defaultSuspenseAcc: number;
    defaultServiceAccount: number;
    defaultBankAcc: number;
    defaultCreditCardAcc: number;
    defaultCostCenterID: number;
    defaultCustomerLedgerID: number;
    defaultOpeningStockValueAcc: number;
    supervisorPassword: string;
    defaultLoanAcc: number;
    defaultIncentiveAcc1: number;
    defaultIncentiveAcc2: number;
    defaultIndirectExpenseAccount: string;
    defaultPurchaseAssetsAccount: string;
    //not updating to db
    defaultPDCReceivableAccount: number;
    defaultPDCPayableAccount: number;
    defaultBankChargeAccount: number;
    // defaultExcessAccount: number;
    // defaultShortageAccount: number;
    // maxShortageAmount: string;
    minimumShiftDuration: number;
    // Checkbox fields
    allowMinimumShiftDuration: boolean;
    blockOnCreditLimit: 'Ignore' | 'Block';
    maintainCostCenter: boolean;
    allowSalesCounter: boolean;
    maintainProjectSite: boolean;
    maintainBillwiseAccount: boolean;
    printAccAftersave: boolean;
    allowUserwiseCounter: boolean;
    showTenderDialogInSales: boolean;
    maintainMultiCurrencyTransactions: boolean;
    doNotPostAccountsForEachCashSales: boolean;
    unPostSPDeductionstoAccount: boolean;
    loadCostcentrewiseEmployeesForSalaryProcess: boolean;
    enableAuthorizationforShiftClose: boolean;
    billwiseMandatory: boolean;
    setDefaultCustomerInSales: boolean;
    allowPostPDC: boolean;
    showEmployeesInSales: boolean;
    showPartyBalanceInSales: boolean;
    enable24Hours: boolean;
    allowMultiPayments: boolean;
    enableCPEandCRE: boolean;
}

export const ApplicationAccountSettingsInitialState: ApplicationAccountSettings = {
    defaultCashAcc: 1,
    defaultSuspenseAcc: 9,
    defaultServiceAccount: 20,
    defaultBankAcc: 21,
    defaultCreditCardAcc: 21,
    defaultCostCenterID: 1,
    defaultCustomerLedgerID: 0,
    defaultOpeningStockValueAcc: 26,
    supervisorPassword: '',
    defaultLoanAcc: 0,
    defaultIncentiveAcc1: 0,
    defaultIncentiveAcc2: 0,
    defaultIndirectExpenseAccount: "All",
    defaultPurchaseAssetsAccount: "All",
    //not updating to db
    defaultPDCReceivableAccount: 1,
    defaultPDCPayableAccount: 0,
    defaultBankChargeAccount: 0,
    // defaultExcessAccount: 1,
    // defaultShortageAccount: 1,
    // maxShortageAmount: '',
    minimumShiftDuration: 12,
    // Checkboxes
    allowMinimumShiftDuration: true,
    blockOnCreditLimit: 'Ignore',
    maintainCostCenter: false,
    allowSalesCounter: false,
    maintainProjectSite: false,
    maintainBillwiseAccount: true,
    printAccAftersave: false,
    allowUserwiseCounter: false,
    showTenderDialogInSales: false,
    maintainMultiCurrencyTransactions: false,
    doNotPostAccountsForEachCashSales: false,
    unPostSPDeductionstoAccount: false,
    loadCostcentrewiseEmployeesForSalaryProcess: false,
    enableAuthorizationforShiftClose: false,
    billwiseMandatory: false,
    setDefaultCustomerInSales: false,
    allowPostPDC: false,
    showEmployeesInSales: false,
    showPartyBalanceInSales: false,
    enable24Hours: false,
    allowMultiPayments: false,
    enableCPEandCRE: false,
};