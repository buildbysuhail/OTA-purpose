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
    formState,
    isLoading,
    handleClose
  } = useFormManager<SchemesData>({
    url: Urls.schemes,
    onSuccess: useCallback(() => dispatch(toggleSchemes({ isOpen: false, key: null, reload: true })), [dispatch]),
    onClose: useCallback(() => dispatch(toggleSchemes({ isOpen: false, key: null, reload: false })), [dispatch]),
    key: rootState.PopupData.schemes.key,
    useApiClient: true,
    initialData: initialSchemesData
  });

  const { t } = useTranslation('inventory');

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("schemeCode")}
          label={t("scheme_code")}
          placeholder={t("scheme_code")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("schemeCode", data.schemeCode);
          }}
          readOnly={rootState.PopupData.schemes.mode == "view"}
          autoFocus={true}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("schemeName")}
          label={t("scheme_name")}
          placeholder={t("scheme_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("schemeName", data.schemeName)}
          readOnly={rootState.PopupData.schemes.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPDateInput
          {...getFieldProps("dateFrom")}
          label={t("from_date")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateFrom", data.dateFrom)}
          readOnly={rootState.PopupData.schemes.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPDateInput
          {...getFieldProps("dateTo")}
          label={t("to_date")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("dateTo", data.dateTo)}
          readOnly={rootState.PopupData.schemes.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPDataCombobox
          {...getFieldProps("schemeType")}
          id="schemeType"
          field={{
            id: "schemeType",
            required: true,
            getListUrl: Urls.data_scheme_master,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("scheme_type")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("schemeType", data.schemeType)}
          disabled={rootState.PopupData.schemes.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("discPercentage")}
          label={t("disc_%")}
          placeholder={t("disc_%")}
          onChangeData={(data: any) => handleFieldChange("discPercentage", data.discPercentage)}
          readOnly={rootState.PopupData.schemes.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("qtyLimit")}
          label={t("qty_limit")}
          placeholder={t("qty_limit")}
          onChangeData={(data: any) => handleFieldChange("qtyLimit", data.qtyLimit)}
          readOnly={rootState.PopupData.schemes.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPInput
          {...getFieldProps("freeQty")}
          label={t("free_qty")}
          placeholder={t("free_qty")}
          onChangeData={(data: any) => handleFieldChange("freeQty", data.freeQty)}
          readOnly={rootState.PopupData.schemes.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />

        <ERPDataCombobox
          {...getFieldProps("schemeStatus")}
          field={{
            id: "schemeStatus",
            valueKey: "value",
            labelKey: "label",
          }}
          onChangeData={(data: any) => handleFieldChange("schemeStatus", data.schemeStatus)}
          label={t('status')}
          options={[
            { value: 'Active', label: t('active') },
            { value: 'Inactive', label: t('inactive') },
          ]}
          disabled={rootState.PopupData.schemes.mode == "view"}
          fetching={formState?.loading !== false ? true : false}
        />
      </div>

      <ERPFormButtons
        onClear={rootState.PopupData.schemes.mode == "view"? undefined : formState?.loading !== false ? undefined : handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={rootState.PopupData.schemes.mode == "view"? undefined : formState?.loading !== false ? undefined : handleSubmit}
      />
    </div>
  );
});
