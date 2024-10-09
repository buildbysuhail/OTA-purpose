import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import Urls from '../../../redux/urls';
import Pageheader from '../../../components/common/pageheader/pageheader';
import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';
import { getAction, postAction } from '../../../redux/slices/app-thunks';
import { LedgerType } from '../../../enums/ledger-types';
import { useDispatch } from 'react-redux';
import { APIClient } from '../../../helpers/api-client';
import ERPToast from '../../../components/ERPComponents/erp-toast';
import { handleResponse } from '../../../utilities/HandleResponse';


interface AccountSettingsState {
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
}
const api = new APIClient();
const ApplicationSettingsAccounts = () => {
  const initialState: AccountSettingsState = {
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
  };
  const dispatch = useDispatch();
  const [formState, setFormState] = useState<AccountSettingsState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<AccountSettingsState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.application_settings}accounts`)
    debugger;
    console.log(formState);
    setFormStatePrev(response);
      setFormState(response);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = ((settingName: any, value: any) => {
    setFormState((prevSettings = {} as AccountSettingsState) => ({
      ...prevSettings,
      [settingName]: value ?? ''
    }));
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue = formState?.[key as keyof AccountSettingsState];
        const prevValue = formStatePrev[key as keyof AccountSettingsState];
       
        if (currentValue !== prevValue) {
          debugger;
          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString()
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);
      
      const response = await api.put(Urls.application_settings,{type: 'accounts', updateList:  modifiedSettings}) as  any
      handleResponse(response);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

 
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    
    <div className='grid grid-cols-4 gap-6'>
        <ERPDataCombobox
          id="defaultCashAcc"
          value={formState?.defaultCashAcc}
          data={formState}
          label="Default Cash Account"
          field={{
            id: "defaultCashAcc",
            //required: true,
            getListUrl: Urls.data_CashLedgers,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultCashAcc', data.defaultCashAcc)}
        />
        <ERPDataCombobox
          id="defaultSuspenseAcc"
          value={formState.defaultSuspenseAcc}
          data={formState}
          label="Default Suspense Account"
          field={{
            id: "defaultSuspenseAcc",
            //required: true,
            getListUrl: Urls.data_SuspenseAccount,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultSuspenseAcc', data.defaultSuspenseAcc)}
        />
        <ERPDataCombobox
          id="defaultServiceAccount"
          value={formState.defaultServiceAccount}
          data={formState}
          label="Default Service Account"
          field={{
            id: "defaultServiceAccount",
            //required: true,
            getListUrl: Urls.data_SalesAccount,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultServiceAccount', data.defaultServiceAccount)}
        />
        <ERPDataCombobox
          id="defaultBankAcc"
          value={formState.defaultBankAcc}
          data={formState}
          label="Default Bank Account"
          field={{
            id: "defaultBankAcc",
            //required: true,
            getListUrl: Urls.data_BankAccounts,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultBankAcc', data.defaultBankAcc)}
        />
        <ERPDataCombobox
          id="defaultCreditCardAcc"
          value={formState.defaultCreditCardAcc}
          data={formState}
          label="Default Credit Card Account"
          field={{
            id: "defaultCreditCardAcc",
            //required: true,
            getListUrl: Urls.data_BankAccounts,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultCreditCardAcc', data.defaultCreditCardAcc)}
        />
        <ERPDataCombobox
          id="defaultCostCenterID"
          value={formState.defaultCostCenterID}
          data={formState}
          label="Default Cost Center"
          field={{
            id: "defaultCostCenterID",
            //required: true,
            getListUrl: Urls.data_costcentres,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultCostCenterID', data.defaultCostCenterID)}
        />
        <ERPDataCombobox
          id="defaultCustomerLedgerID"
          value={formState.defaultCustomerLedgerID}
          data={formState}
          label="Default Customer Ledger"
          field={{
            id: "defaultCustomerLedgerID",
            //required: true,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultCustomerLedgerID', data.defaultCustomerLedgerID)}
        />
        <ERPDataCombobox
          id="defaultOpeningStockValueAcc"
          value={formState.defaultOpeningStockValueAcc}
          data={formState}
          label="Default Opening StockLedger"
          field={{
            id: "defaultOpeningStockValueAcc",
            //required: true,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.Current_Assets}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultOpeningStockValueAcc', data.defaultOpeningStockValueAcc)}
        />
      </div>

      {/* Second Column of Select Inputs */}
      <div className='grid grid-cols-4 gap-5'>
        <ERPInput
          id="supervisorPassword"
          value={formState.supervisorPassword}
          data={formState}
          label="Supervisor Password"
          onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
        />
        <ERPDataCombobox
          id="defaultLoanAcc"
          value={formState.defaultLoanAcc}
          data={formState}
          label="Default Loan Account"
          field={{
            id: "defaultLoanAcc",
            //required: true,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultLoanAcc', data.defaultLoanAcc)}
        />
        <ERPDataCombobox
          id="defaultIncentiveAcc1"
          value={formState.defaultIncentiveAcc1}
          data={formState}
          label="Default Incentive Account 1"
          field={{
            id: "defaultIncentiveAcc1",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultIncentiveAcc1', data.defaultIncentiveAcc1)}
        />
        <ERPDataCombobox
          id="defaultIncentiveAcc2"
          value={formState.defaultIncentiveAcc2}
          data={formState}
          label="Default Incentive Account 2"
          field={{
            id: "defaultIncentiveAcc2",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultIncentiveAcc2', data.defaultIncentiveAcc2)}
        /> 
        <ERPDataCombobox
          id="defaultPDCReceivableAccount"
          value={formState.defaultPDCReceivableAccount}
          data={formState}
          label="Default PDC Receivable Account"
          field={{
            id: "defaultPDCReceivableAccount",
            //required: true,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultPDCReceivableAccount', data.defaultPDCReceivableAccount)}
        />
          <ERPDataCombobox
          id="defaultPDCPayableAccount"
          value={formState.defaultPDCPayableAccount}
          data={formState}
          label="Default PDC Payable Account"
          field={{
            id: "defaultPDCPayableAccount",
            //required: true,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultPDCPayableAccount', data.defaultPDCPayableAccount)}
        />
          <ERPDataCombobox
          id="defaultBankChargeAccount"
          value={formState.defaultBankChargeAccount}
          data={formState}
          label="Default Bank Charge Account"
          field={{
            id: "defaultBankChargeAccount",
            //required: true,
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID = 0 & ledgerType=${LedgerType.All}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data) => handleFieldChange('defaultBankChargeAccount', data.defaultBankChargeAccount)}
        />
          <ERPDataCombobox
          id="defaultIndirectExpenseAccount"
          value={formState.defaultIndirectExpenseAccount}
          data={formState}
          label="Default Indirect Expense Account"
          options={[
            { value: 'All', label: 'All' },
            { value: 'Customer', label: 'Customer' },
            { value: 'Supplier', label: 'Supplier' },
            { value: 'ReferalAgent', label: 'Referal Agent' },
            { value: 'CashInHand', label: 'Cash In Hand' },
            { value: 'BankAccount', label: 'Bank Account' },
            { value: 'SuspenseAccount', label: 'Suspense Account' },
            { value: 'CustomerAndSupplier', label: 'Customer and Supplier' },
            { value: 'Cash_Bank', label: 'Cash & Bank' },
            { value: 'Cash_Bank_Suppliers', label: 'Cash & Bank - Suppliers' },
            { value: 'Cash_Bank_Customers', label: 'Cash & Bank - Customers' },
            { value: 'Cash_Bank_Suppliers_Customers', label: 'Cash & Bank - Suppliers & Customers' },
            { value: 'Sales_Account', label: 'Sales Account' },
            { value: 'Purchase_Account', label: 'Purchase Account' },
            { value: 'Salaries', label: 'Salaries' },
            { value: 'Discount_Received', label: 'Discount Received' },
            { value: 'Discount_Given', label: 'Discount Given' },
            { value: 'Incentive_Given', label: 'Incentive Given' },
            { value: 'Salary_Account', label: 'Salary Account' },
            { value: 'Job_Works', label: 'Job Works' },
            { value: 'Branch_Receivable', label: 'Branch Receivable' },
            { value: 'SalesAndDirectIncome', label: 'Sales and Direct Income' },
            { value: 'PurchaseAndDirectExpense', label: 'Purchase and Direct Expense' },
            { value: 'Cash_Bank_Suppliers_Customers_Employees', label: 'Cash & Bank - Suppliers, Customers & Employees' },
            { value: 'Cash_Bank_Customers_Employees', label: 'Cash & Bank - Customers & Employees' },
            { value: 'Branch_Payable', label: 'Branch Payable' },
            { value: 'Branch_Recv_Payable', label: 'Branch Receivable & Payable' },
            { value: 'Expenses', label: 'Expenses' },
            { value: 'Incomes', label: 'Incomes' },
            { value: 'Credit_Note_Ledgers', label: 'Credit Note Ledgers' },
            { value: 'DebitNote_Note_Ledgers', label: 'Debit Note Ledgers' },
            { value: 'Liabilities_Expenses_All_Without_Salaries', label: 'Liabilities & Expenses (Excl. Salaries)' },
            { value: 'Current_Assets', label: 'Current Assets' },
            { value: 'Fixed_Assets', label: 'Fixed Assets' },
            { value: 'Indirect_Expenses', label: 'Indirect Expenses' },
            { value: 'Indirect_Income', label: 'Indirect Income' },
          ]}
          onChangeData={(data) => handleFieldChange('defaultIndirectExpenseAccount', data.defaultIndirectExpenseAccount)}
        />
           <ERPDataCombobox
          id="defaultPurchaseAssetsAccount"
          value={formState.defaultPurchaseAssetsAccount}
          data={formState}
          label="Default Purchase Assets Account"
          options={[
            { value: 'All', label: 'All' },
            { value: 'Customer', label: 'Customer' },
            { value: 'Supplier', label: 'Supplier' },
            { value: 'ReferalAgent', label: 'Referal Agent' },
            { value: 'CashInHand', label: 'Cash In Hand' },
            { value: 'BankAccount', label: 'Bank Account' },
            { value: 'SuspenseAccount', label: 'Suspense Account' },
            { value: 'CustomerAndSupplier', label: 'Customer and Supplier' },
            { value: 'Cash_Bank', label: 'Cash & Bank' },
            { value: 'Cash_Bank_Suppliers', label: 'Cash & Bank - Suppliers' },
            { value: 'Cash_Bank_Customers', label: 'Cash & Bank - Customers' },
            { value: 'Cash_Bank_Suppliers_Customers', label: 'Cash & Bank - Suppliers & Customers' },
            { value: 'Sales_Account', label: 'Sales Account' },
            { value: 'Purchase_Account', label: 'Purchase Account' },
            { value: 'Salaries', label: 'Salaries' },
            { value: 'Discount_Received', label: 'Discount Received' },
            { value: 'Discount_Given', label: 'Discount Given' },
            { value: 'Incentive_Given', label: 'Incentive Given' },
            { value: 'Salary_Account', label: 'Salary Account' },
            { value: 'Job_Works', label: 'Job Works' },
            { value: 'Branch_Receivable', label: 'Branch Receivable' },
            { value: 'SalesAndDirectIncome', label: 'Sales and Direct Income' },
            { value: 'PurchaseAndDirectExpense', label: 'Purchase and Direct Expense' },
            { value: 'Cash_Bank_Suppliers_Customers_Employees', label: 'Cash & Bank - Suppliers, Customers & Employees' },
            { value: 'Cash_Bank_Customers_Employees', label: 'Cash & Bank - Customers & Employees' },
            { value: 'Branch_Payable', label: 'Branch Payable' },
            { value: 'Branch_Recv_Payable', label: 'Branch Receivable & Payable' },
            { value: 'Expenses', label: 'Expenses' },
            { value: 'Incomes', label: 'Incomes' },
            { value: 'Credit_Note_Ledgers', label: 'Credit Note Ledgers' },
            { value: 'DebitNote_Note_Ledgers', label: 'Debit Note Ledgers' },
            { value: 'Liabilities_Expenses_All_Without_Salaries', label: 'Liabilities & Expenses (Excl. Salaries)' },
            { value: 'Current_Assets', label: 'Current Assets' },
            { value: 'Fixed_Assets', label: 'Fixed Assets' },
            { value: 'Indirect_Expenses', label: 'Indirect Expenses' },
            { value: 'Indirect_Income', label: 'Indirect Income' },
          ]}
          onChangeData={(data) => handleFieldChange('defaultPurchaseAssetsAccount', data.defaultPurchaseAssetsAccount)}
        />


        {/* <ERPDataCombobox
          id="defaultExcessAccount"
          value={formState.defaultExcessAccount}
          data={formState}
          label="Default Excess Account"
          onChangeData={(data) => handleFieldChange('defaultExcessAccount', data.)}
        />
        <ERPDataCombobox
          id="defaultShortageAccount"
          value={formState.defaultShortageAccount}
          data={formState}
          label="Default Shortage Account"
          onChangeData={(data) => handleFieldChange('defaultShortageAccount', data.)}
        />
        <ERPInput
          id="maxShortageAmount"
          value={formState.maxShortageAmount}
          data={formState}
          label="Max Shortage Amount"
          onChangeData={(data) => handleFieldChange('maxShortageAmount', data.)}
        />
      

      {/* Minimum Shift Duration */}
       </div>
      <div className='flex justify-start gap-5'>
      <ERPCheckbox
          id="minimumShiftDuration"
          value={formState.minimumShiftDuration}
          data={formState}
          label="Minimum Shift Duration"
          onChangeData={(data) => handleFieldChange('minimumShiftDuration', data.minimumShiftDuration)}
        />
        <ERPInput
          id="minimumShiftDuration"
          value={formState.minimumShiftDuration}
          data={formState}
        
          type="number"
          onChangeData={(data) => handleFieldChange('minimumShiftDuration', data.minimumShiftDuration)}
        />
      </div>

      {/* Checkboxes */}
      <div className='grid grid-cols-3 justify-start gap-5'>
      <ERPCheckbox
  id="blockOnCreditLimit"
  checked={formState.blockOnCreditLimit === 'Block'}
  data={formState}
  label="Block On Credit Limit"
  onChangeData={(data) => handleFieldChange('blockOnCreditLimit', data.blockOnCreditLimit === 'Block' ? 'Block' : 'Ignore')}
/>

<ERPCheckbox
  id="maintainCostCenter"
  checked={formState.maintainCostCenter}
  data={formState}
  label="Maintain Cost Center"
  onChangeData={(data) => handleFieldChange('maintainCostCenter', data.maintainCostCenter)}
/>

<ERPCheckbox
  id="allowSalesCounter"
  checked={formState.allowSalesCounter}
  data={formState}
  label="Allow Sales Counter"
  onChangeData={(data) => handleFieldChange('allowSalesCounter', data.allowSalesCounter)}
/>

<ERPCheckbox
  id="maintainProjectSite"
  checked={formState.maintainProjectSite}
  data={formState}
  label="Maintain Project Site"
  onChangeData={(data) => handleFieldChange('maintainProjectSite', data.maintainProjectSite)}
/>

<ERPCheckbox
  id="maintainBillwiseAccount"
  checked={formState.maintainBillwiseAccount}
  data={formState}
  label="Maintain Billwise Account"
  onChangeData={(data) => handleFieldChange('maintainBillwiseAccount', data.maintainBillwiseAccount)}
/>

<ERPCheckbox
  id="printAccAftersave"
  checked={formState.printAccAftersave}
  data={formState}
  label="Print Acc After Save"
  onChangeData={(data) => handleFieldChange('printAccAftersave', data.printAccAftersave)}
/>

<ERPCheckbox
  id="allowUserwiseCounter"
  checked={formState.allowUserwiseCounter}
  data={formState}
  label="Allow User-wise Counter"
  onChangeData={(data) => handleFieldChange('allowUserwiseCounter', data.allowUserwiseCounter)}
/>

<ERPCheckbox
  id="showTenderDialogInSales"
  checked={formState.showTenderDialogInSales}
  data={formState}
  label="Show Tender Dialog In Sales"
  onChangeData={(data) => handleFieldChange('showTenderDialogInSales', data.showTenderDialogInSales)}
/>

<ERPCheckbox
  id="maintainMultiCurrencyTransactions"
  checked={formState.maintainMultiCurrencyTransactions}
  data={formState}
  label="Maintain Multi Currency Transactions"
  onChangeData={(data) => handleFieldChange('maintainMultiCurrencyTransactions', data.maintainMultiCurrencyTransactions)}
/>

<ERPCheckbox
  id="doNotPostAccountsForEachCashSales"
  checked={formState.doNotPostAccountsForEachCashSales}
  data={formState}
  label="Do Not Post Accounts For Each Cash Sales"
  onChangeData={(data) => handleFieldChange('doNotPostAccountsForEachCashSales', data.doNotPostAccountsForEachCashSales)}
/>

<ERPCheckbox
  id="unPostSPDeductionstoAccount"
  checked={formState.unPostSPDeductionstoAccount}
  data={formState}
  label="Unpost SP Deductions To Account"
  onChangeData={(data) => handleFieldChange('unPostSPDeductionstoAccount', data.unPostSPDeductionstoAccount)}
/>

<ERPCheckbox
  id="loadCostcentrewiseEmployeesForSalaryProcess"
  checked={formState.loadCostcentrewiseEmployeesForSalaryProcess}
  data={formState}
  label="Load Cost-centre Wise Employees For Salary Process"
  onChangeData={(data) => handleFieldChange('loadCostcentrewiseEmployeesForSalaryProcess', data.loadCostcentrewiseEmployeesForSalaryProcess)}
/>

<ERPCheckbox
  id="enableAuthorizationforShiftClose"
  checked={formState.enableAuthorizationforShiftClose}
  data={formState}
  label="Enable Authorization For Shift Close"
  onChangeData={(data) => handleFieldChange('enableAuthorizationforShiftClose', data.enableAuthorizationforShiftClose)}
/>

<ERPCheckbox
  id="billwiseMandatory"
  checked={formState.billwiseMandatory}
  data={formState}
  label="Billwise Mandatory"
  onChangeData={(data) => handleFieldChange('billwiseMandatory', data.billwiseMandatory)}
/>

<ERPCheckbox
  id="setDefaultCustomerInSales"
  checked={formState.setDefaultCustomerInSales}
  data={formState}
  label="Set Default Customer In Sales"
  onChangeData={(data) => handleFieldChange('setDefaultCustomerInSales', data.setDefaultCustomerInSales)}
/>

<ERPCheckbox
  id="allowPostPDC"
  checked={formState.allowPostPDC}
  data={formState}
  label="Allow Post PDC"
  onChangeData={(data) => handleFieldChange('allowPostPDC', data.allowPostPDC)}
/>

<ERPCheckbox
  id="showEmployeesInSales"
  checked={formState.showEmployeesInSales}
  data={formState}
  label="Show Employees In Sales"
  onChangeData={(data) => handleFieldChange('showEmployeesInSales', data.showEmployeesInSales)}
/>

<ERPCheckbox
  id="showPartyBalanceInSales"
  checked={formState.showPartyBalanceInSales}
  data={formState}
  label="Show Party Balance In Sales"
  onChangeData={(data) => handleFieldChange('showPartyBalanceInSales', data.showPartyBalanceInSales)}
/>

<ERPCheckbox
  id="enable24Hours"
  checked={formState.enable24Hours}
  data={formState}
  label="Enable 24 Hours"
  onChangeData={(data) => handleFieldChange('enable24Hours', data.enable24Hours)}
/>

<ERPCheckbox
  id="allowMultiPayments"
  checked={formState.allowMultiPayments}
  data={formState}
  label="Allow Multi Payments"
  onChangeData={(data) => handleFieldChange('allowMultiPayments', data.allowMultiPayments)}
/>

      </div>
      

        <div className="flex justify-end">
          <ERPButton
            title="Save Settings"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
  );
};

export default ApplicationSettingsAccounts;
