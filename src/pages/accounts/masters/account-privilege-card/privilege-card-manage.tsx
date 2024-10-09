import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {togglePrivilegeCardPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { initialPrivilegeCard, PrivilegeCardData } from "./privilege-card-types";
import { useTranslation } from "react-i18next";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

export const PrivilegeCardManage : React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    isLoading,
  } = useFormManager<PrivilegeCardData>({
    url: Urls.account_privilege_card,
    onSuccess: useCallback(() => dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null, reload: true  })), [dispatch]),
    key: rootState.PopupData.voucher.key,
    useApiClient: true,
    initialData:initialPrivilegeCard
  });

  const onClose = useCallback(() => {
    dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null }));
  }, []);
  
 const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps('cardNumber')}
          label="Card Number"
          placeholder="Card Number"
          required={true}
          onChangeData={(data: any) => {  handleFieldChange('cardNumber', data) }}
        />
        <ERPInput
          {...getFieldProps('cardHolderName')}
          label="Card Holder Name"
          placeholder="Card Holder Name"
          required={true}
          onChangeData={(data: any) => handleFieldChange('cardHolderName', data)}
        />
        <ERPInput
          {...getFieldProps('address1')}
          label="Address1"
          placeholder="Address1"
          required={true}
          onChangeData={(data: any) => handleFieldChange('address1', data)}
        />
         <ERPInput
          {...getFieldProps('address2')}
          label="Address2"
          placeholder="Address2"
          required={true}
          onChangeData={(data: any) => handleFieldChange('address2', data)}
        />
        <ERPInput
          {...getFieldProps('phone')}
          label="Phone"
          placeholder="Phone"
          required={true}
          onChangeData={(data: any) => handleFieldChange('phone', data)}
        />
        <ERPInput
          {...getFieldProps('mobile')}
          label="Mobile"
          placeholder="Mobile"
          required={true}
          onChangeData={(data: any) => handleFieldChange('mobile', data)}
        />
        <ERPDataCombobox
          {...getFieldProps("priceCategoryID")}
          field={{
            id: "priceCategoryID",
            required: true,
            getListUrl: Urls.data_pricectegory,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("priceCategoryID", data)
          }}
          label="Price Category"
        />

        <ERPDataCombobox
          {...getFieldProps("cardType")}
          field={{
            id: "cardType",
            required: true,
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("cardType", data)
          }}
          label="Card Type"
        />
       
        <ERPInput
          {...getFieldProps('opBalance')}
          label="Op Balance"
          placeholder="Op Balance"
          type="number"
          required={true}
          onChangeData={(data: any) => handleFieldChange('opBalance', data)}
        />
         <ERPDateInput
          {...getFieldProps("activateDate")}
          type="date"
          id="activateDate"
          label="Activate Date"
          onChangeData={(data: any) => handleFieldChange("activateDate", data)}
        />
        <ERPDateInput
          {...getFieldProps("expiryDate")}
          type="date"
          id="expiryDate"
          label="Expiry Date"
          onChangeData={(data: any) => handleFieldChange("expiryDate", data)}
        />
        
      </div>
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});