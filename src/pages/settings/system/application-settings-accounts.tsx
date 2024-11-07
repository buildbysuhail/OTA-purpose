import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import Urls from '../../../redux/urls';
import { LedgerType } from '../../../enums/ledger-types';
import { useDispatch } from 'react-redux';
import { APIClient } from '../../../helpers/api-client';
import { handleResponse } from '../../../utilities/HandleResponse';
import { t } from 'i18next';
import { Countries } from '../../../redux/slices/user-session/reducer';
import { useAppSelector } from '../../../utilities/hooks/useAppDispatch';
import { RootState } from '../../../redux/store';
import { BusinessType } from '../../../enums/business-types';
import useApplicationSetting from '../../../utilities/hooks/use-application-settings';


export interface AccountSettingsState {
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
const api = new APIClient();
const ApplicationSettingsAccounts = () => {
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
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
  const dispatch = useDispatch();
  const [formState, setFormState] = useState<AccountSettingsState>(initialState);
  const [formStatePrev, setFormStatePrev] = useState<Partial<AccountSettingsState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isScrollingDisabled, setIsScrollingDisabled] = useState(false);
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.application_settings}accounts`)

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
  // const handleSubmit = async () => {
  //   setIsSaving(true);
  //   try {
  //     const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
  //       const currentValue = formState[key as keyof ApplicationBranchSettings];
  //       const prevValue = formStatePrev[key as keyof ApplicationBranchSettings];

  //       if (currentValue !== prevValue ||
  //         (currentValue === false && prevValue === true) ||
  //         (currentValue === true && prevValue === false)) {
  //         acc.push({
  //           settingsName: key,
  //           settingsValue: currentValue === false ? "false" :
  //             currentValue === true ? "true" :
  //               (currentValue ?? "").toString(),
  //         });
  //       }
  //       return acc;
  //     }, [] as { settingsName: string; settingsValue: string }[]);

  //     if (modifiedSettings.length > 0) {
  //       const response = await api.put(Urls.application_settings, {
  //         type: "branch",
  //         updateList: modifiedSettings,
  //       });
  //       handleResponse(
  //         response,
  //         () => {
  //           setFormStatePrev(formState);
  //         },
  //         () => { },
  //         false
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error saving settings:", error);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const handleSubmit = async () => {
    setIsSaving(true);
    try {
 
      const modifiedSettings = Object.keys(formState).reduce((acc, key) => {
        const currentValue = formState?.[key as keyof AccountSettingsState];
        const prevValue = formStatePrev[key as keyof AccountSettingsState];

        if (currentValue !== prevValue || (currentValue === false && prevValue === true) ||
        (currentValue === true && prevValue === false)) {

          acc.push({
            settingsName: key,
            settingsValue: currentValue === false ? "false" :
            currentValue === true ? "true" :
            (currentValue ?? "").toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);
      const response = modifiedSettings && modifiedSettings.length > 0 ? (await api.put(Urls.application_settings, { type: 'accounts', updateList: modifiedSettings })) as any : null
      handleResponse(response, () => {setFormStatePrev(formState)}, () => { }, false);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="h-screen max-h-dvh flex flex-col overflow-hidden">
      <form className="overflow-y-auto scrollbar scrollbar-thick scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto h-full mb-[53px]">
        <div className='p-6 space-y-6 '>
          <div className='border rounded-lg  p-4'>
            <div className='grid xxl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
              <ERPDataCombobox
                id="defaultCashAcc"
                value={formState.defaultCashAcc}
                data={formState}
                label={t("default_cash_account")}
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
                label={t("default_suspense_account")}
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
                id="blockOnCreditLimit"
                value={formState.blockOnCreditLimit}
                data={formState}
                label={t("credit_limit")}
                field={{
                  id: "blockOnCreditLimit",
                  valueKey: "value",
                  labelKey: "label",
                }}
                options={[
                  { value: 'Block', label: 'Block' },
                  { value: 'Warn', label: 'Warn' },
                  { value: 'Ignore', label: 'Ignore' },
                  { value: 'Allow Cash Sales', label: 'Allow Cash Sales' },
                ]}
                onChangeData={(data) =>
                  handleFieldChange("blockOnCreditLimit", data.blockOnCreditLimit)
                }
              />
              <ERPDataCombobox
                id="defaultServiceAccount"
                value={formState.defaultServiceAccount}
                data={formState}
                label={t("default_service_account")}
                field={{
                  id: "defaultServiceAccount",
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
                label={t("default_bank_account")}
                field={{
                  id: "defaultBankAcc",
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
                label={t("default_credit_card_account")}
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
                label={t("default_cost_center")}
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
                label={t("default_customer")}
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
                label={t("default_opening_stock_ledger")}
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
              {/* Second Column of Select Inputs */}
              <ERPDataCombobox
                id="defaultLoanAcc"
                value={formState.defaultLoanAcc}
                data={formState}
                label={t("default_loan_account")}
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
                label={t("default_incentive_account_1")}
                field={{
                  id: "defaultIncentiveAcc1",
                  hasCloseButton: true,
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
                label={t("default_incentive_account_2")}
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
                disabled={!formState?.allowPostPDC}
                value={formState.defaultPDCReceivableAccount}
                data={formState}
                label={t("default_PDC_receivable_account")}
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
                disabled={!formState?.allowPostPDC}
                value={formState.defaultPDCPayableAccount}
                data={formState}
                label={t("default_PDC_payable_account")}
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
                label={t("default_bank_charge_account")}
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
              {userSession.countryId == Countries.India &&
                <>
                  <ERPDataCombobox
                    id="defaultIndirectExpenseAccount"
                    value={formState.defaultIndirectExpenseAccount}
                    field={{
                      id: "defaultIndirectExpenseAccount",
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    data={formState}
                    label={t("default_indirect_expense_account")}
                    onChangeData={(data) =>
                      handleFieldChange('defaultIndirectExpenseAccount', data.defaultIndirectExpenseAccount)
                    }
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

                  />
                  <ERPDataCombobox
                    id="defaultPurchaseAssetsAccount"
                    value={formState.defaultPurchaseAssetsAccount}
                    field={{
                      id: "defaultPurchaseAssetsAccount",
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    data={formState}
                    label={t("default_purchase_assets_account")}
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
                </>

              }

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
              <div className='flex items-center justify-between'>
                <ERPCheckbox
                  id="allowMinimumShiftDuration"
                  checked={formState.allowMinimumShiftDuration}
                  data={formState}
                  label={t("minimum_shift_duration")}
                  onChangeData={(data) => handleFieldChange('allowMinimumShiftDuration', data.allowMinimumShiftDuration)}
                />
                <ERPInput
                  id="minimumShiftDuration"
                  value={formState.minimumShiftDuration}
                  label=' '
                  data={formState}
                  type="number"
                  disabled={!formState.allowMinimumShiftDuration}
                  onChangeData={(data) => handleFieldChange('minimumShiftDuration', data.minimumShiftDuration)}
                />
                &nbsp;Hours
              </div>
            </div>
          </div>

          <div className='grid grid-cols-4 gap-6 border rounded-lg p-4'>
            <ERPInput
              id="supervisorPassword"
              value={formState.supervisorPassword}
              data={formState}
              label={t("supervisor_password")}
              onChangeData={(data) => handleFieldChange('supervisorPassword', data.supervisorPassword)}
            />
          </div>

          {/* Checkboxes */}
          <div className='border  rounded-lg p-4 !mb-[4rem]'>
            <div className='grid xxl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 justify-start gap-6'>
              <ERPCheckbox
                id="allowSalesCounter"
                checked={formState.allowSalesCounter}
                data={formState}
                label={t("allow_sales_counter")}
                onChangeData={(data) => handleFieldChange('allowSalesCounter', data.allowSalesCounter)}
              />

              <ERPCheckbox
                id="maintainBillwiseAccount"
                checked={formState.maintainBillwiseAccount}
                data={formState}
                label={t("maintain_billwise_account")}
                onChangeData={(data) => handleFieldChange('maintainBillwiseAccount', data.maintainBillwiseAccount)}
              />

              <ERPCheckbox
                id="printAccAftersave"
                checked={formState.printAccAftersave}
                data={formState}
                label={t("print_after_save")}
                onChangeData={(data) => handleFieldChange('printAccAftersave', data.printAccAftersave)}
              />

              <ERPCheckbox
                id="showTenderDialogInSales"
                checked={formState.showTenderDialogInSales}
                data={formState}
                label={t("show_tender_window_in_sales")}
                onChangeData={(data) => handleFieldChange('showTenderDialogInSales', data.showTenderDialogInSales)}
              />

              <ERPCheckbox
                id="allowMultiPayments"
                checked={formState.allowMultiPayments}
                data={formState}
                label={t("allow_multipayment_mode")}
                onChangeData={(data) => handleFieldChange('allowMultiPayments', data.allowMultiPayments)}
              />

              <ERPCheckbox
                id="unPostSPDeductionstoAccount"
                checked={formState.unPostSPDeductionstoAccount}
                data={formState}
                label={t("unpost_SP_deductions_to_account")}
                onChangeData={(data) => handleFieldChange('unPostSPDeductionstoAccount', data.unPostSPDeductionstoAccount)}
              />

              <ERPCheckbox
                id="doNotPostAccountsForEachCashSales"
                checked={formState.doNotPostAccountsForEachCashSales}
                data={formState}
                label={t("do_not_post_accounts_for_each_cash_sales")}
                onChangeData={(data) => handleFieldChange('doNotPostAccountsForEachCashSales', data.doNotPostAccountsForEachCashSales)}
              />

              <ERPCheckbox
                id="loadCostcentrewiseEmployeesForSalaryProcess"
                checked={formState.loadCostcentrewiseEmployeesForSalaryProcess}
                data={formState}
                label={t("load_costcentre_wise_employees_for_salary_process")}
                onChangeData={(data) => handleFieldChange('loadCostcentrewiseEmployeesForSalaryProcess', data.loadCostcentrewiseEmployeesForSalaryProcess)}
              />

              <ERPCheckbox
                id="enableAuthorizationforShiftClose"
                disabled={!formState.allowSalesCounter}
                checked={!formState.allowSalesCounter ? false : formState.enableAuthorizationforShiftClose}
                data={formState}
                label={t("enable_authorization_for_shift_close")}
                onChangeData={(data) => handleFieldChange('enableAuthorizationforShiftClose', data.enableAuthorizationforShiftClose)}
              />

              <ERPCheckbox
                id="billwiseMandatory"
                checked={formState.billwiseMandatory}
                data={formState}
                label={t("billwise_mandatory")}
                onChangeData={(data) => handleFieldChange('billwiseMandatory', data.billwiseMandatory)}
              />

              <ERPCheckbox
                id="maintainProjectSite"
                checked={formState.maintainProjectSite}
                data={formState}
                label={t("maintain_projects/job")}
                onChangeData={(data) => handleFieldChange('maintainProjectSite', data.maintainProjectSite)}
              />

              <ERPCheckbox
                id="maintainCostCenter"
                checked={formState.maintainCostCenter}
                data={formState}
                label={t("maintain_cost_center")}
                onChangeData={(data) => handleFieldChange('maintainCostCenter', data.maintainCostCenter)}
              />

              <ERPCheckbox
                id="maintainMultiCurrencyTransactions"
                checked={formState.maintainMultiCurrencyTransactions}
                data={formState}
                label={t("maintain_multi_currency_transactions")}
                onChangeData={(data) => handleFieldChange('maintainMultiCurrencyTransactions', data.maintainMultiCurrencyTransactions)}
              />

              {applicationSettings != undefined && (applicationSettings?.mainSettings?.maintainBusinessType == BusinessType.Hypermarket || applicationSettings?.mainSettings?.maintainBusinessType == BusinessType.Supermarket) &&
                <ERPCheckbox
                  id="showPartyBalanceInSales"
                  checked={formState.showPartyBalanceInSales}
                  data={formState}
                  label={t("show_party_balance_in_sales")}
                  onChangeData={(data) => handleFieldChange('showPartyBalanceInSales', data.showPartyBalanceInSales)}
                />
              }
              <ERPCheckbox
                id="allowUserwiseCounter"
                disabled={!formState.allowSalesCounter}
                checked={!formState.allowSalesCounter ? false : formState.allowUserwiseCounter}
                data={formState}
                label={t("allow_user_wise_counter")}
                onChangeData={(data) => handleFieldChange('allowUserwiseCounter', data.allowUserwiseCounter)}
              />

              <ERPCheckbox
                id="setDefaultCustomerInSales"
                checked={formState.setDefaultCustomerInSales}
                data={formState}
                label={t("set_default_customer_in_sales")}
                onChangeData={(data) => handleFieldChange('setDefaultCustomerInSales', data.setDefaultCustomerInSales)}
              />
              {userSession.countryId == Countries.India &&
                <ERPCheckbox
                  id="allowPostPDC"
                  checked={formState.allowPostPDC}
                  data={formState}
                  label={t("allow_PDC_to_post")}
                  onChangeData={(data) => handleFieldChange('allowPostPDC', data.allowPostPDC)}
                />
              }
              <ERPCheckbox
                id="showEmployeesInSales"
                checked={formState.showEmployeesInSales}
                data={formState}
                label={t("show_employees_in_sales")}
                onChangeData={(data) => handleFieldChange('showEmployeesInSales', data.showEmployeesInSales)}
              />

              <ERPCheckbox
                id="enable24Hours"
                checked={formState.enable24Hours}
                data={formState}
                label={t("enable_24_hours_business")}
                onChangeData={(data) => handleFieldChange('enable24Hours', data.enable24Hours)}
              />
              {userSession.countryId == Countries.India &&
                <ERPCheckbox
                  id="enableCPEandCRE"
                  disabled
                  checked={formState.enableCPEandCRE}
                  data={formState}
                  label={t("enable_estimate_for_payments_and_receipts")}
                  onChangeData={(data) => handleFieldChange('enableCPEandCRE', data.enableCPEandCRE)}
                />
              }
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-end items-center py-1 px-8 fixed bottom-0 right-0 bg-[#fafafa] w-full shadow-[0_0.2rem_0.4rem_rgba(0,0,0,0.5)]">
        <ERPButton
          title={t("save_settings")}
          variant="primary"
          loading={isSaving}
          disabled={isSaving}
          type="button"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ApplicationSettingsAccounts;
