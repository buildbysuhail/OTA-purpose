import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { useFormManager } from '../../../utilities/hooks/useFormManagerOptions';
import Urls from '../../../redux/urls';
import { toggleMiscellaneousSettingsPopup } from '../../../redux/slices/popup-reducer';
import { ActionType } from '../../../redux/types';
import { useTranslation } from 'react-i18next';
import ERPDateInput from '../../../components/ERPComponents/erp-date-input';
import { ERPFormButtons } from '../../../components/ERPComponents/erp-form-buttons';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';
import ERPInput from '../../../components/ERPComponents/erp-input';
import ERPDataCombobox from '../../../components/ERPComponents/erp-data-combobox';


interface DeleteInactiveTransactionManageData {
    date: string;
    isAgree: boolean;
  }
const ApplicationMiscellaneousSettingsPop : React.FC = React.memo(() => {
    const dispatch = useDispatch();
  
    const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading,handleClose } =
      useFormManager<DeleteInactiveTransactionManageData>({
        url: Urls.deleteInactiveTransactions,
        onClose:useCallback(() => dispatch(toggleMiscellaneousSettingsPopup({ isOpen: false, key: null,})), [dispatch]),
        onSuccess: useCallback(
          () =>
            dispatch(
              toggleMiscellaneousSettingsPopup({ isOpen: false,  })
            ),
          [dispatch]
        ),
        method: ActionType.POST,
        useApiClient: true,
        loadDataRequired: false
      });
  

  
    const { t } = useTranslation();
  
    return (
      <div className="w-full pt-4">
        <div className="grid grid-cols-1  sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("remarks", data)}
        />
         <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("remarks", data)}
        />
         <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("remarks", data)}
        />
         <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("enter_remarks")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("remarks", data)}
        />
         <ERPDataCombobox
          {...getFieldProps("companyID")}
          field={{
            id: "companyID",
            required: true,
            // getListUrl: Urls.data_company_id,
            valueKey: "companyID",
            labelKey: "companyID",
          }}
          onChange={(data: any) =>
            handleFieldChange("companyID", data.companyID)
          }
          label={t("company_id")}
        />
        </div>
        <ERPFormButtons
          isEdit={isEdit}
          title={t("delete_all")}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          onClear={handleClear}
        />
      </div>
    );
  });

export default ApplicationMiscellaneousSettingsPop
