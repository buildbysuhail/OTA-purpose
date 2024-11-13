import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { toggleVoucherPopup } from "../../../redux/slices/popup-reducer";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { initialDataVoucher, VoucherData } from "./vouchers-manage-type";
import { useTranslation } from "react-i18next";

export const VoucherManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading,handleClose } =
    useFormManager<VoucherData>({
      url: Urls.Voucher,
      onClose:useCallback(() => dispatch(toggleVoucherPopup({ isOpen: false, key: null,})), [dispatch]),
      onSuccess: useCallback(
        () => dispatch(toggleVoucherPopup({ isOpen: false, key: null ,reload:true})),
        [dispatch]
      ),
      key: rootState.PopupData.voucher.key,
      useApiClient: true,
      initialData: initialDataVoucher
    });

 

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDataCombobox
          {...getFieldProps("voucherType")}
          id="voucherType"
          field={{
            id: "voucherType",
            required: true,
            getListUrl: Urls.data_vouchertype,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("voucher_type")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("voucherType", data.voucherType)}
        />
         <ERPInput
          {...getFieldProps("formType")}
          label={t("form_type")}
          placeholder={t("form_type")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("formType", data.formType)}
        />
        <ERPInput
          {...getFieldProps("descriptions")}
          label={t("descriptions")}
          placeholder={t("descriptions")}
          onChangeData={(data: any) => handleFieldChange("descriptions", data.descriptions)}
        />
        <ERPInput
          {...getFieldProps("lastVoucherPrefix")}
          label={t("lastVoucher_prefix")}
          placeholder={t("lastVoucher_prefix")}
          onChangeData={(data: any) => handleFieldChange("lastVoucherPrefix", data.lastVoucherPrefix)}
        />
        <ERPInput
          {...getFieldProps("lastVoucherNumber")}
          label={t("lastVoucher_number")}
          type="number"
          placeholder={t("lastVoucher_number")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("lastVoucherNumber", data.lastVoucherNumber)}
        />

        <ERPCheckbox
          {...getFieldProps('isDefault')}
          label={t("is_default")}
          onChangeData={(data: any) => handleFieldChange('isDefault', data.isDefault)}
        />
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
