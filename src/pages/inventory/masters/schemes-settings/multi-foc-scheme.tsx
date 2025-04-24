import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import {
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";
import CustomStore from "devextreme/data/custom_store";

const api = new APIClient();

export const initialFOCScheme: {
  data: FOCSchemeData;
  validations: any;
  [key: string]: any;
} = {
  data: {
    schemeID: 0,
    productBatchID: 0,
    loadAllMultiFos: false,
    qtyLimit: 0,
    freeQty: 0,
    freeProductBatchID: 0,
    remarks: "",
    unitID: 0,
    barCode: "",
    freeItemBarcode: "",
    unitName: "",
    productName: "",
    stdSalesPrice: 0,
    freeStdSalesPrice: 0,
    stdPurchasePrice: 0,
    freeStdPurchasePrice: 0,
    freeProductName: "",
    searchByCode: false,
    freeUnitID: 0,
    freeUnitName: "",
  },
  validations: {},
};

export interface FOCSchemeData {
  schemeID: number;
  loadAllMultiFos: boolean;
  productBatchID: number;
  freeProductBatchID: number;
  qtyLimit: number;
  freeQty: number;
  remarks: string;
  unitID: number;
  unitName: string;
  freeUnitID: number;
  freeUnitName: string;
  productName: string;
  freeProductName: string;
  barCode: string;
  freeItemBarcode: string;
  stdSalesPrice: number;
  freeStdSalesPrice: number;
  stdPurchasePrice: number;
  freeStdPurchasePrice: number;
  searchByCode: boolean;
}

const MultiFOCScheme: React.FC = () => {
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<FOCSchemeData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    handleDataChange,
    handleClear,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<FOCSchemeData>({
    initialData: initialFOCScheme,
    useApiClient: true,
  });

  // Determine if form and button should be disabled based on loadAllMultiFos
  const isFormDisabled = formState.data.loadAllMultiFos;

  const fetchByBarcode = useCallback(async () => {
    try {
      const obj = getFieldProps("*");
      if (isNullOrUndefinedOrEmpty(obj.barCode)) {
        return;
      }
      setIsDataLoading(true);
      const url = `${Urls.select_product_by_barcode_multi_foc}${obj.barCode}`;
      const response = await api.get(url);
      handleResponse(
        response,
        () => {
          handleDataChange({
            ...obj,
            // productBatchID: response.productBatchID,
            productID: response.productID,
          } as FOCSchemeData);
        },
        () => { },
        false
      );
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [getFieldProps, handleDataChange]);

  const fetchByFreeItemBarcode = useCallback(async () => {
    try {
      const obj = getFieldProps("*");
      if (isNullOrUndefinedOrEmpty(obj.freeItemBarcode)) {
        return;
      }
      setIsDataLoading(true);
      const url = `${Urls.select_product_by_barcode_multi_foc}${obj.freeItemBarcode}`;
      const response = await api.get(url);
      handleResponse(
        response,
        () => {
          handleDataChange({
            ...obj,
            freeProductBatchID: response.productBatchID,
            freeProductName: response.productName,
            freeStdSalesPrice: response.StdSalesPrice,
            freeStdPurchasePrice: response.StdPurchasePrice,
          } as FOCSchemeData);
        },
        () => { },
        false
      );
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [getFieldProps, handleDataChange]);

  // New function to fetch all MultiFOS data when loadAllMultiFos is checked
  const fetchAllMultiFosData = useCallback(async (schemeID: number) => {
    
    setIsDataLoading(true);
    try {
      const url = `${Urls.get_all__multi_foc}`;
      const response = await api.getAsync(url);
      setGridData(response);
    } catch (error) {
      console.error("Error fetching MultiFOS data:", error);
      ERPAlert.show({
        title: "",
        icon: "error",
        text: "Failed to load MultiFOS data.",
      });
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  const handleAdd = useCallback(async () => {
    const obj: FOCSchemeData = getFieldProps("*");
    console.log("Form state before adding:", obj);
    if (isNullOrUndefinedOrZero(obj.schemeID)) {
      ERPAlert.show({
        title: "",
        icon: "warning",
        text: "Please Select Any Scheme..!",
      });
      return;
    }

    const newSchemeData: FOCSchemeData = {
      schemeID: obj.schemeID,
      loadAllMultiFos: obj.loadAllMultiFos,
      productBatchID: obj.productBatchID,
      freeProductBatchID:
        obj.freeProductBatchID !== 0 ? obj.freeProductBatchID : obj.productBatchID,
      qtyLimit: obj.qtyLimit,
      freeQty: obj.freeQty,
      remarks: obj.remarks,
      unitID: obj.unitID,
      unitName: obj.unitName,
      freeUnitID: obj.freeUnitID,
      freeUnitName: obj.freeUnitName,
      productName: obj.productName,
      freeProductName: obj.freeProductName,
      barCode: obj.barCode,
      freeItemBarcode: obj.freeItemBarcode,
      stdSalesPrice: obj.stdSalesPrice,
      freeStdSalesPrice: obj.freeStdSalesPrice,
      stdPurchasePrice: obj.stdPurchasePrice,
      freeStdPurchasePrice: obj.freeStdPurchasePrice,
      searchByCode: obj.searchByCode,
    };

    setGridData((prevGridData) => {
      if (prevGridData instanceof CustomStore) {
        return [newSchemeData]; // Reset to array with new data
      }
      return [...prevGridData, newSchemeData];
    });
    handleClear();
  }, [getFieldProps, handleClear]);


  useEffect(() => {
    if (formState.data.loadAllMultiFos) {
      fetchAllMultiFosData(formState.data.schemeID);
    } else {
      setGridData([]);
    }
  }, [formState.data.loadAllMultiFos]);


  const handleRemoveRow = useCallback((schemeID: number) => {
    setGridData((prevGridData) => {
      if (prevGridData instanceof CustomStore) {
        return []; // Reset to empty array if CustomStore this not complete the implement need to work on it
      }
      return prevGridData.filter((item: FOCSchemeData) => item.schemeID !== schemeID);
    });
  }, []);

  const renderDeleteCell = (cellData: any) => {
    return (
      <div className="flex justify-center">
        <button
          className="text-[#ef4444] font-bold px-2"
          onClick={() => handleRemoveRow(cellData.data.schemeID)}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <h6>{t("product_details")}</h6>

        <div className="flex gap-4">
          {/* <ERPDataCombobox
            {...getFieldProps("schemeID")}
            field={{
              id: "schemeID",
              getListUrl: Urls.select_quantity_schemes_for_combo,
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("scheme")}
            // disabled={isFormDisabled}
            onChangeData={async (data: any) => {
              const obj = getFieldProps("*");
              const res = await api.getAsync(
                `${Urls.select_scheme_qty_details_by_id}${data.schemeID}`
              );
              handleDataChange({
                ...obj,
                qtyLimit: res.qtyLimit,
                freeQty: res.freeQty,
                schemeID: data.schemeID,
              } as FOCSchemeData);     
            }}
          /> */}
          <ERPDataCombobox
            {...getFieldProps("schemeID")}
            field={{
              id: "schemeID",
              getListUrl: Urls.select_quantity_schemes_for_combo,
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("scheme")}
            onChangeData={(data: any) => {
              handleFieldChange("schemeID", data.schemeID);
            }}
          />

          <ERPCheckbox
            {...getFieldProps("loadAllMultiFos")}
            label={t("loadAll_MultiFos")}
            onChangeData={(data: any) => {
              handleFieldChange("loadAllMultiFos", data.loadAllMultiFos);
            }}
          />
          {/* <ERPDataCombobox
            {...getFieldProps("schemeID")}
            field={{
              id: "schemeID",
              getListUrl: Urls.select_quantity_schemes_for_combo,
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("scheme")}
            onChangeData={(data: any) => {
              handleFieldChange("schemeID", data.schemeID);
              if (formState.data.loadAllMultiFos) {
                fetchAllMultiFosData(data.schemeID);
              }
            }}
          />
          <ERPCheckbox
            {...getFieldProps("loadAllMultiFos")}
            label={t("loadAll_MultiFos")}
            onChangeData={(data: any) => {
              handleFieldChange("loadAllMultiFos", data.loadAllMultiFos);
              // If checked, fetch data; if unchecked, clear DataGrid for manual entry
              if (data.loadAllMultiFos) {
                setGridData([]);// Clear all previous data
                const obj = getFieldProps("*");
                fetchAllMultiFosData(obj.schemeID);
              } else {
                setGridData([]);// Clear API-loaded data for manual entry
              }
            }}
          /> */}
        </div>
        <div className="grid grid-cols-4 gap-4">
          <ERPInput
            {...getFieldProps("barCode")}
            label={t("product_barcode")}
            onChange={(e: any) => handleFieldChange("barCode", e.target.value)}
            disabled={isFormDisabled}
            onBlur={() => fetchByBarcode()}
          />
          <ERPDataCombobox
            {...getFieldProps("productName")}
            field={{
              id: "productName",
              getListUrl: Urls.data_products, // Update with correct URL
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("product_name")}
            disabled={isFormDisabled}
            onChangeData={(data: any) =>
              handleFieldChange("productName", data.name)
            }
          />
          <ERPInput
            {...getFieldProps("qtyLimit")}
            label={t("qty")}
            type="number"
            onChange={(e) =>
              handleFieldChange("qtyLimit", parseFloat(e.target.value))
            }
            disabled={isFormDisabled}
          />
          <ERPDataCombobox
            {...getFieldProps("unitID")}
            field={{
              id: "unitID",
              getListUrl: Urls.data_units, // Update with correct URL
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("unit_id")}
            disabled={isFormDisabled}
            onChangeData={(data: any) => handleFieldChange("unitID", data.id)}
          />
        </div>
        <h6>{t("free_product_details")}</h6>
        <div className="grid grid-cols-4 gap-4">
          <ERPInput
            {...getFieldProps("freeItemBarcode")}
            label={t("freeItemBarcode")}
            onChange={(e: any) =>
              handleFieldChange("freeItemBarcode", e.target.value)
            }
            disabled={isFormDisabled}
            onBlur={() => fetchByFreeItemBarcode()}
          />
          <ERPDataCombobox
            {...getFieldProps("freeProductName")}
            field={{
              id: "freeProductName",
              getListUrl: Urls.data_products, // Update with correct URL
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("free_product_name")}
            disabled={isFormDisabled}
            onChangeData={(data: any) =>
              handleFieldChange("freeProductName", data.name)
            }
          />
          <ERPInput
            {...getFieldProps("freeQty")}
            label={t("qty")}
            type="number"
            onChange={(e) =>
              handleFieldChange("freeQty", parseFloat(e.target.value))
            }
            disabled={isFormDisabled}
          />
          <ERPDataCombobox
            {...getFieldProps("freeUnitID")}
            field={{
              id: "freeUnitID",
              getListUrl: Urls.data_units, // Update with correct URL
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("unit_id")}
            disabled={isFormDisabled}
            onChangeData={(data: any) =>
              handleFieldChange("freeUnitID", data.id)
            }
          />
        </div>
      </div>
      <div className="w-full modal-content flex flex-col gap-4">
        <div className="flex justify-end gap-4 mt-4">
          <ERPButton
            title={t("add")}
            variant="secondary"
            onClick={handleAdd}
            disabled={isFormDisabled || isDataLoading}
          />
        </div>
        <div>
          <DataGrid
            dataSource={gridData}
            showBorders={true}
            rowAlternationEnabled={true}
            className="w-full"
            keyExpr="qtyDiscountID"
          >
            <Paging defaultPageSize={10} />
            <Editing
              mode="cell"
              allowUpdating={true}
              allowDeleting={false}
              allowAdding={false}
            />
            <Column
              dataField="schemeID"
              dataType="string"
              width={100}
              caption={t("schemeID")}
            />
            <Column
              dataField="barCode"
              dataType="string"
              width={100}
              caption={t("barcode")}
            />
            <Column
              dataField="productName"
              dataType="string"
              width={300}
              caption={t("name")}
            />
            <Column
              dataField="unitName"
              dataType="string"
              width={80}
              caption={t("unit")}
            />
            <Column
              dataField="qtyLimit"
              dataType="number"
              width={70}
              caption={t("qty")}
            />
            <Column
              dataField="freeItemBarcode"
              dataType="string"
              width={100}
              caption={t("free_barcode")}
            />
            <Column
              dataField="freeProductName"
              dataType="string"
              width={300}
              caption={t("free_item")}
            />
            <Column
              dataField="freeUnitName"
              dataType="string"
              width={80}
              caption={t("free_unit")}
            />
            <Column
              dataField="freeQty"
              dataType="number"
              width={70}
              caption={t("free_qty")}
            />
            <Column caption="X" cellRender={renderDeleteCell} width={30} />
          </DataGrid>
        </div>
      </div>
    </>
  );
};

export default MultiFOCScheme;