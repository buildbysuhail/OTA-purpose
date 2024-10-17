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

export const PrivilegeCardManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    handleClear,
    isLoading,
  } = useFormManager<PrivilegeCardData>({
    url: Urls.account_privilege_card,
    onSuccess: useCallback(() => dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null, reload: true  })), [dispatch]),
    key: rootState.PopupData.privilegeCard.key,
    useApiClient: true,
    initialData:initialPrivilegeCard.data,
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
          label={t("card_number")}
          placeholder={t("card_number")}
          required={true}
          onChangeData={(data: any) => {  handleFieldChange('cardNumber', data) }}
        />
        <ERPInput
          {...getFieldProps('cardHolderName')}
          label={t("card_holder_name")}
          placeholder={t("card_holder_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('cardHolderName', data)}
        />
        <ERPInput
          {...getFieldProps('address1')}
          label={t("address1")}
          placeholder={t("address1")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('address1', data)}
        />
         <ERPInput
          {...getFieldProps('address2')}
          label={t("address2")}
          placeholder={t("address2")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('address2', data)}
        />
        <ERPInput
          {...getFieldProps('phone')}
          label={t("phone")}
          placeholder={t("phone")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('phone', data)}
        />
        <ERPInput
          {...getFieldProps('mobile')}
          label={t("mobile")}
          placeholder={t("mobile")}
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
          label={t("price_category")}
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
          label={t("card_type")}
        />
       
        <ERPInput
          {...getFieldProps('opBalance')}
          label={t("op_balance")}
          placeholder={t("op_balance")}
          type="number"
          required={true}
          onChangeData={(data: any) => handleFieldChange('opBalance', data)}
        />
         <ERPDateInput
          {...getFieldProps("activateDate")}
          type="date"
          id="activateDate"
          label={t("activate_date")}
          onChangeData={(data: any) => handleFieldChange("activateDate", data)}
        />
        <ERPDateInput
          {...getFieldProps("expiryDate")}
          type="date"
          id="expiryDate"
          label={t("expiry_date")}
          onChangeData={(data: any) => handleFieldChange("expiryDate", data)}
        />
        
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}