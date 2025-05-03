import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { toggleTaxCategoryIndia } from "../../../../redux/slices/popup-reducer";
import { initialTaxCategoryData, TaxCategory } from "./tax-category-type-india";

export const TaxCategoryManageIndia: React.FC = React.memo(() => {
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
  } = useFormManager<TaxCategory>({
    url: Urls.gstCategory,
    onClose: useCallback(() => dispatch(toggleTaxCategoryIndia({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleTaxCategoryIndia({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.taxCategoryIndia.key,
    useApiClient: true,
    initialData: initialTaxCategoryData
  });

  const { t } = useTranslation('inventory');

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps("taxCategoryName")}
          label={t("gst_category")}
          placeholder={t("gst_category")}
          onChangeData={(data: any) => {
            handleFieldChange("taxCategoryName", data.taxCategoryName);
          }}
        />

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center font-medium">{t("sales_tax_%")}</div>
          <div className="col-span-1 text-center font-medium">{t("purchase_tax_%")}</div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 flex items-center">
            <label className="text-gray-700">{t("sgst_%")}</label>
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("s_SGSTPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("s_SGSTPerc", data.s_SGSTPerc)}
            />
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("p_SGSTPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("p_SGSTPerc", data.p_SGSTPerc)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 flex items-center">
            <label className="text-gray-700">{t("cgst_%")}</label>
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("s_CGSTPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("s_CGSTPerc", data.s_CGSTPerc)}
            />
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("p_CGSTPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("p_CGSTPerc", data.p_CGSTPerc)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 flex items-center">
            <label className="text-gray-700">{t("igst_%")}</label>
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("s_IGSTPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("s_IGSTPerc", data.s_IGSTPerc)}
            />
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("p_IGSTPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("p_IGSTPerc", data.p_IGSTPerc)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 flex items-center">
            <label className="text-gray-700">{t("cess_%")}</label>
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("s_CessPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("s_CessPerc", data.s_CessPerc)}
            />
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("p_CessPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("p_CessPerc", data.p_CessPerc)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 flex items-center">
            <label className="text-gray-700">{t("additional_cess_%")}</label>
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("s_AdditionalCessPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("s_AdditionalCessPerc", data.s_AdditionalCessPerc)}
            />
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("p_AdditionalCessPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("p_AdditionalCessPerc", data.p_AdditionalCessPerc)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 flex items-center">
            <label className="text-gray-700">{t("calamity_cess_%")}</label>
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("s_CalamityCessPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("s_CalamityCessPerc", data.s_CalamityCessPerc)}
            />
          </div>
          <div className="col-span-1">
            <ERPInput
              {...getFieldProps("p_CalamityCessPerc")}
              type="number"
              placeholder="0.00"
              noLabel={true}
              onChangeData={(data: any) => handleFieldChange("p_CalamityCessPerc", data.p_CalamityCessPerc)}
            />
          </div>
        </div>
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