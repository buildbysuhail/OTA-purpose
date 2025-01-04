import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialSchemesData, SchemesData } from "./schemes-type";
import { toggleSchemes } from "../../../../redux/slices/popup-reducer";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";

export const SchemesManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<SchemesData>({
    url: Urls.vehicles,
    onSuccess: useCallback(
      () => dispatch(toggleSchemes({ isOpen: false, key: null, reload: true })),
      [dispatch]
    ),
    onClose:useCallback(() => dispatch(toggleSchemes({ isOpen: false, key: null,reload: false })), [dispatch]),
    key: rootState.PopupData.vehicles.key,
    useApiClient: true,
    initialData: initialSchemesData
  });

  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("schemeCode")}
          label={t("scheme_code")}
          placeholder={t("scheme_code")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("schemeCode", data.schemeCode);
          }}
        />
        <ERPInput
          {...getFieldProps("schemeName")}
          label={t("scheme_name")}
          placeholder={t("scheme_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("schemeName", data.schemeName)}
        />
        <ERPDateInput
          {...getFieldProps("fromDate")}
          label={t("from_date")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
        />
        <ERPDateInput
          {...getFieldProps("toDate")}
          label={t("to_date")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
        />
        <ERPDataCombobox
          {...getFieldProps("schemeType")}
          id="schemeType"
          field={{
            id: "schemeType",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("scheme_type")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("schemeType", data.schemeType)}
        />
        <ERPInput
          {...getFieldProps("discPec")}
          label={t("disc_%")}
          placeholder={t("disc_%")}
          onChangeData={(data: any) => handleFieldChange("discPec", data.discPec)}
        />
        <ERPInput
          {...getFieldProps("qtyLimit")}
          label={t("qty_limit")}
          placeholder={t("qty_limit")}
          onChangeData={(data: any) => handleFieldChange("qtyLimit", data.qtyLimit)}
        />
        <ERPInput
          {...getFieldProps("freeQty")}
          label={t("free_qty")}
          placeholder={t("free_qty")}
          onChangeData={(data: any) => handleFieldChange("freeQty", data.freeQty)}
        />
        <ERPDataCombobox
          {...getFieldProps("status")}
          field={{
            id: "status",
            valueKey: "value",
            labelKey: "label",
          }}
          onChangeData={(data: any) => handleFieldChange("status", data.status)}
          label={t('status')}
          options={[
            { value: 'Active', label: t('active') },
            { value: 'Inactive', label: t('inactive') },
          ]}
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
