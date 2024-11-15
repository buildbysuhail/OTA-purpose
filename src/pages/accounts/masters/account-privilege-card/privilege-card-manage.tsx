import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { togglePrivilegeCardPopup } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { initialPrivilegeCard, PrivilegeCardData } from "./privilege-card-types";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";

export const PrivilegeCardManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    isEdit,
    handleSubmit,
    formState,
    handleFieldChange,
    getFieldProps,
    handleClear,
    isLoading,
    handleClose
  } = useFormManager<PrivilegeCardData>({
    url: Urls.account_privilege_card,
    onSuccess: useCallback(
      () => dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    onClose:useCallback(() => dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null,})), [dispatch]),
    key: rootState.PopupData.privilegeCard.key,
    keyField:"privilegeCardsID",
    useApiClient: true,
    initialData: initialPrivilegeCard
  });

 

  const handleDateChange = (field: string, value: string | null) => {
    if (value) {
      const date = new Date(value);
      if (date.getFullYear() < 1753) {
        handleFieldChange(field, '1753-01-01T00:00:00Z');
      } else {
        handleFieldChange(field, value);
      }
    } else {
      handleFieldChange(field, null);
    }
  };

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ERPInput
          {...getFieldProps('cardNumber')}
          label={t("card_number")}
          placeholder={t("card_number")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('cardNumber', data.cardNumber)}
        />
        <ERPInput
          {...getFieldProps('cardHolderName')}
          label={t("card_holder_name")}
          placeholder={t("card_holder_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange('cardHolderName', data.cardHolderName)}
        />
        <ERPInput
          {...getFieldProps('address1')}
          label={t("address1")}
          placeholder={t("address1")}
          onChangeData={(data: any) => handleFieldChange('address1', data.address1)}
        />
        <ERPInput
          {...getFieldProps('address2')}
          label={t("address2")}
          placeholder={t("address2")}
          required={false}
          onChangeData={(data: any) => handleFieldChange('address2', data.address2)}
        />
        <ERPInput
          {...getFieldProps('phone')}
          label={t("phone")}
          placeholder={t("phone")}
          onChangeData={(data: any) => handleFieldChange('phone', data.phone)}
        />
        <ERPInput
          {...getFieldProps('mobile')}
          label={t("mobile")}
          placeholder={t("mobile")}
          onChangeData={(data: any) => handleFieldChange('mobile', data.mobile)}
        />
        <ERPInput
          {...getFieldProps('email')}
          label={t("email")}
          placeholder={t("email")}
          required={false}
          onChangeData={(data: any) => handleFieldChange('email', data.email)}
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
          onChangeData={(data: any) => handleFieldChange("priceCategoryID", data.priceCategoryID)}
          label={t("price_category")}
        />
        <ERPDataCombobox
          {...getFieldProps("cardType")}
          field={{
            id: "cardType",
            valueKey: "value",
            labelKey: "label",
          }}
          options={[
            { value: "Privilege", label: "Privilege" },
            { value: "Gift Card", label: "Gift Card" },
            { value: "Cash Card", label: "Cash Card" },
            { value: "Voucher", label: "Voucher" },
          ]}
          onChangeData={(data: any) => handleFieldChange("cardType", data.cardType)}
          label={t("card_type")}
        />
        <ERPInput
          {...getFieldProps('oBalance')}
          label={formState?.data.cardType == "Privilege" ? t("op_balance") : t("amount")}
          placeholder={formState?.data.cardType == "Privilege" ? t("op_balance") : t("amount")}
          type="number"
          onChangeData={(data: any) => handleFieldChange('oBalance', data.oBalance)}
        />
        <ERPDateInput
          {...getFieldProps("activateDate")}
          label={t("activate_date")}
          onChangeData={(data: any) => handleDateChange("activateDate", data.activateDate)}
        />
        <ERPDateInput
          {...getFieldProps("expiryDate")}
          label={t("expiry_date")}
          onChangeData={(data: any) => handleDateChange("expiryDate", data.expiryDate)}
        />
        {/* <ERPDateInput
          {...getFieldProps("dob")}
          required={false}
          label={t("date_of_birth")}
          onChangeData={(data: any) => handleDateChange("dob", data.dob)}
        /> */}
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default PrivilegeCardManage;