import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import ERPDataCombobox from '../../../components/ERPComponents/erp-select';
import Urls from '../../../redux/urls';
import Pageheader from '../../../components/common/pageheader/pageheader';


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
  defaultExcessAccount: number;
  defaultShortageAccount: number;
  maxShortageAmount: string;
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
    defaultExcessAccount: 1,
    defaultShortageAccount: 1,
    maxShortageAmount: '',
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
  const [formState, setFormState] = useState<AccountSettingsState>(initialState);
  const [changedSettings, setChangedSettings] = useState<Partial<AccountSettingsState>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      const data: AccountSettingsState = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = ((settingName: any, value: any) => {
    setSettings((prevSettings = {} as Settings) => ({
      ...prevSettings,
      [settingName]: value ?? ''
    }));
    
    setChangedSettings((prevChangedSettings = {} as Settings) => ({
      ...prevChangedSettings,
      [settingName]: value ?? ''
    }));
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedSettings),
      });
      if (response.ok) {
        console.log('Settings saved successfully');
        setChangedSettings({});
      } else {
        console.error('Error saving settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Loading settings?...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    
    <div>
        <ERPDataCombobox
          id="defaultCashAcc"
          value={formState.defaultCashAcc}
          data={formState}
          label="Default Cash Account"
          onChangeData={(data) => handleFieldChange('defaultCashAcc', data)}
        />
        <ERPDataCombobox
          id="defaultSuspenseAcc"
          value={formState.defaultSuspenseAcc}
          data={formState}
          label="Default Suspense Account"
          onChangeData={(data) => handleFieldChange('defaultSuspenseAcc', data)}
        />
        <ERPDataCombobox
          id="defaultServiceAccount"
          value={formState.defaultServiceAccount}
          data={formState}
          label="Default Service Account"
          onChangeData={(data) => handleFieldChange('defaultServiceAccount', data)}
        />
        <ERPDataCombobox
          id="defaultBankAcc"
          value={formState.defaultBankAcc}
          data={formState}
          label="Default Bank Account"
          onChangeData={(data) => handleFieldChange('defaultBankAcc', data)}
        />
        <ERPDataCombobox
          id="defaultCreditCardAcc"
          value={formState.defaultCreditCardAcc}
          data={formState}
          label="Default Credit Card Account"
          onChangeData={(data) => handleFieldChange('defaultCreditCardAcc', data)}
        />
        <ERPDataCombobox
          id="defaultCostCenterID"
          value={formState.defaultCostCenterID}
          data={formState}
          label="Default Cost Center"
          onChangeData={(data) => handleFieldChange('defaultCostCenterID', data)}
        />
        <ERPDataCombobox
          id="defaultCustomerLedgerID"
          value={formState.defaultCustomerLedgerID}
          data={formState}
          label="Default Customer Ledger"
          onChangeData={(data) => handleFieldChange('defaultCustomerLedgerID', data)}
        />
        <ERPDataCombobox
          id="defaultOpeningStockValueAcc"
          value={formState.defaultOpeningStockValueAcc}
          data={formState}
          label="Default Opening Stock Ledger"
          onChangeData={(data) => handleFieldChange('defaultOpeningStockValueAcc', data)}
        />
      </div>

      {/* Second Column of Select Inputs */}
      <div>
        <ERPInput
          id="supervisorPassword"
          value={formState.supervisorPassword}
          data={formState}
          label="Supervisor Password"
          onChangeData={(data) => handleFieldChange('supervisorPassword', data)}
        />
        <ERPDataCombobox
          id="defaultLoanAcc"
          value={formState.defaultLoanAcc}
          data={formState}
          label="Default Loan Account"
          onChangeData={(data) => handleFieldChange('defaultLoanAcc', data)}
        />
        <ERPDataCombobox
          id="defaultIncentiveAcc1"
          value={formState.defaultIncentiveAcc1}
          data={formState}
          label="Default Incentive Account 1"
          onChangeData={(data) => handleFieldChange('defaultIncentiveAcc1', data)}
        />
        <ERPDataCombobox
          id="defaultIncentiveAcc2"
          value={formState.defaultIncentiveAcc2}
          data={formState}
          label="Default Incentive Account 2"
          onChangeData={(data) => handleFieldChange('defaultIncentiveAcc2', data)}
        />
        <ERPDataCombobox
          id="defaultExcessAccount"
          value={formState.defaultExcessAccount}
          data={formState}
          label="Default Excess Account"
          onChangeData={(data) => handleFieldChange('defaultExcessAccount', data)}
        />
        <ERPDataCombobox
          id="defaultShortageAccount"
          value={formState.defaultShortageAccount}
          data={formState}
          label="Default Shortage Account"
          onChangeData={(data) => handleFieldChange('defaultShortageAccount', data)}
        />
        <ERPInput
          id="maxShortageAmount"
          value={formState.maxShortageAmount}
          data={formState}
          label="Max Shortage Amount"
          onChangeData={(data) => handleFieldChange('maxShortageAmount', data)}
        />
      </div>

      {/* Minimum Shift Duration */}
      <div>
        <ERPInput
          id="minimumShiftDuration"
          value={formState.minimumShiftDuration}
          data={formState}
          label="Minimum Shift Duration"
          type="number"
          onChangeData={(data) => handleFieldChange('minimumShiftDuration', data)}
        />
      </div>

      {/* Checkboxes */}
      <div>
        <ERPCheckbox
          id="maintainCostCenter"
          value={formState.maintainCostCenter}
          data={formState}
          label="Maintain Cost Center"
          onChangeData={(data) => handleFieldChange('maintainCostCenter', data)}
        />
        <ERPCheckbox
          id="allowSalesCounter"
          value={formState.allowSalesCounter}
          data={formState}
          label="Allow Sales Counter"
          onChangeData={(data) => handleFieldChange('allowSalesCounter', data)}
        />
        <ERPCheckbox
          id="maintainBillwiseAccount"
          value={formState.maintainBillwiseAccount}
          data={formState}
          label="Maintain Billwise Account"
          onChangeData={(data) => handleFieldChange('maintainBillwiseAccount', data)}
        />
        <ERPCheckbox
          id="printAccAftersave"
          value={formState.printAccAftersave}
          data={formState}
          label="Print After Save"
          onChangeData={(data) => handleFieldChange('printAccAftersave', data)}
        />
        <ERPCheckbox
          id="enableAuthorizationforShiftClose"
          value={formState.enableAuthorizationforShiftClose}
          data={formState}
          label="Enable Authorization for Shift Close"
          onChangeData={(data) => handleFieldChange('enableAuthorizationforShiftClose', data)}
        />
        <ERPCheckbox
          id="allowMultiPayments"
          value={formState.allowMultiPayments}
          data={formState}
          label="Allow Multi-Payments"
          onChangeData={(data) => handleFieldChange('allowMultiPayments', data)}
        />
        <ERPCheckbox
          id="enable24Hours"
          value={formState.enable24Hours}
          data={formState}
          label="Enable 24 Hours Business"
          onChangeData={(data) => handleFieldChange('enable24Hours', data)}
        />
        <ERPCheckbox
          id="setDefaultCustomerInSales"
          value={formState.setDefaultCustomerInSales}
          data={formState}
          label="Set Default Customer in Sales"
          onChangeData={(data) => handleFieldChange('setDefaultCustomerInSales', data)}
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
