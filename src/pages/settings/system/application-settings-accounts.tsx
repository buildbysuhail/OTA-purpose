import React, { useState, useEffect } from 'react';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';
import ERPButton from '../../../components/ERPComponents/erp-button';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import Urls from '../../../redux/urls';
import Pageheader from '../../../components/common/pageheader/pageheader';
import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';
import { getAction, postAction } from '../../../redux/slices/app-thunks';


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
  const dispatch = useAppDispatch();
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
      const response = await dispatch(getAction({apiUrl: `${Urls.application_settings}accounts`}) as any
      
      
    ).unwrap();
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
        const currentValue = formState[key as keyof AccountSettingsState];
        const prevValue = formStatePrev[key as keyof AccountSettingsState];
  
        if (currentValue !== prevValue) {
          acc.push({
            settingsName: key,
            settingsValue: currentValue
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: any }[]);
      const response = await dispatch(postAction({apiUrl: `${Urls.application_settings}accounts`,data:modifiedSettings}) as any
    ).unwrap();
      if (response.ok) {
        console.log('Settings saved successfully');
        setFormStatePrev({});
      } else {
        console.error('Error saving settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

 
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    
   
      {/* Second Column of Select Inputs */}
      <div className='grid grid-cols-4 gap-5'>
        <ERPInput
          id="blockOnCreditLimit"
          value={formState?.blockOnCreditLimit}
          data={formState}
          label="Supervisor Password"
          onChangeData={(data) => handleFieldChange('blockOnCreditLimit', data)}
        />
       
      </div>

      {/* Minimum Shift Duration */}
      

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
