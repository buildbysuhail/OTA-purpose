import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { initialSalesRouteData, SalesRouteData } from "./sales-route-type";
import { toggleSalesRoute } from "../../../../redux/slices/popup-reducer";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";

interface SalesRouteRadio {
  subRoute: boolean;
  mainRoute: boolean;
}

const initialState: SalesRouteRadio = {
  subRoute: true,
  mainRoute: false,
};

export const SalesRouteManage: React.FC = React.memo(() => {
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
  } = useFormManager<SalesRouteData>({
    url: Urls.salesRoute,
    onClose: useCallback(() => dispatch(toggleSalesRoute({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleSalesRoute({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.salesRoute.key,
    useApiClient: true,
    initialData: initialSalesRouteData,
  });

  const [gridType, setGridType] = useState<SalesRouteRadio>(initialState);
  const { t } = useTranslation('inventory');

  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("routeName")}
          label={t("route_name")}
          placeholder={t("route_name")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("routeName", data.routeName)}
        />

        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("short_name")}
          onChangeData={(data: any) => handleFieldChange("shortName", data.shortName)}
        />

        <ERPDataCombobox
          {...getFieldProps("parentRoute")}
          id="parentRoute"
          field={{
            id: "parentRoute",
            required: true,
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("parent_route")}
          onChangeData={(data: any) => handleFieldChange("parentRoute", data.parentRoute)}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
        />

        <ERPInput
          {...getFieldProps("creditLimit")}
          label={t("credit_limit")}
          placeholder={t("credit_limit")}
          onChangeData={(data: any) => handleFieldChange("creditLimit", data.creditLimit)}
        />

        <ERPDataCombobox
          {...getFieldProps("salesMan")}
          id="salesMan"
          field={{
            id: "salesMan",
            required: true,
            getListUrl: Urls.data_salesRoute,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("salesman")}
          onChangeData={(data: any) => handleFieldChange("salesMan", data.salesMan)}
        />

        <ERPDataCombobox
          {...getFieldProps("warehouse")}
          id="warehouse"
          field={{
            id: "warehouse",
            required: true,
            getListUrl: Urls.data_warehouse,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("warehouse")}
          onChangeData={(data: any) => handleFieldChange("warehouse", data.warehouse)}
        />
      </div>

      <div className="grid grid-cols-3 mt-5 gap-6">
        <ERPRadio
          id="mainRoute"
          name="mainRoute"
          data={gridType}
          checked={gridType.mainRoute}
          onChange={() => setGridType({ mainRoute: true, subRoute: false })}
          label={t("main_route")}
        />

        <ERPRadio
          id="subRoute"
          name="subRoute"
          data={gridType}
          checked={gridType.subRoute}
          onChange={() => setGridType({ mainRoute: false, subRoute: true })}
          label={t("sub_route")}
        />

        <ERPCheckbox
          {...getFieldProps("isActive")}
          label={t("is_active")}
          onChangeData={(data: any) => handleFieldChange("isActive", data.isActive)}
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
