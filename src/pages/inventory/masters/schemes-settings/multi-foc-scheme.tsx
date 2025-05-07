import React, { useState, useCallback, useEffect, useRef } from "react";
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
import MultiFocSchemeBatchGrid from "./multi-foc-scheme-batch-grid";
import ERPProductSearch from "../../../../components/ERPComponents/erp-searchbox";

const api = new APIClient();

export const initialFOCScheme = {
  data: {
    schemeID: 0,
    productBatchID: 0,
    loadAllMultiFos: false,
    qtyLimit: 1,
    freeQty: 1,
    freeProductBatchID: 0,
    remarks: "",
    unitID: 0,
    barCode: "0",
    freeItemBarcode: "0",
    unitName: "",
    productName: "",
    productID: 0,
    freeProductID: 0,
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
  productID: number;
  freeProductID: number;
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
    handleFieldChange,
    handleDataChange,
    handleClear,
    getFieldProps,
    formState,
  } = useFormManager<FOCSchemeData>({
    initialData: initialFOCScheme,
    useApiClient: true,
  });

  // Determine if form and button should be disabled based on loadAllMultiFos
  const isFormDisabled = formState.data.loadAllMultiFos;
const handleSave = useCallback(async () => {
        console.log("Saving data:", gridData);
         // Check if gridData is empty
                  if (gridData.length === 0) {
                    ERPAlert.show({
                      title: "",
                      icon: "warning",
                      text: "No data to save. Please add items to the grid.",
                    });
                    return;
                  }
        try{
            const payload = gridData;
            const response = await api.post(Urls.qty_slab_offer, payload);
            handleResponse(response, () =>   handleClear());
        }catch(error){
            console.error("Error saving data:", error);
        }
    }, [gridData]);
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
            productBatchID: response.productBatchID,
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
      productID: obj.productID,
      freeProductID: obj.freeProductID,
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
  }, [formState.data.loadAllMultiFos, fetchAllMultiFosData]);

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
    <div className="w-full p-2 bg-gray-100">
      <div className="bg-white p-2 max-w-[900px] rounded-md shadow-sm mb-4">
        {/* Main container with border and gray background */}
        <div className="border border-gray-300 rounded">
          {/* Header with dotted border */}
          <div className="border-b border-dotted border-gray-400 bg-gray-300 px-2 py-1">
            <h6 className="text-[#991B1B] font-medium m-0">{t("product_details")}</h6>
          </div>

          {/* Main form content */}
          <div className="p-2">
            {/* Scheme and LoadAll row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2 items-center">
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("scheme")}</label>
              </div>
              {getFieldProps("schemeID").value}
              <div className="md:col-span-6">
                <ERPDataCombobox
                  {...getFieldProps("schemeID")}
                  field={{
                    id: "schemeID",
                    getListUrl: Urls.select_quantity_schemes_for_combo_MultiFOC,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  noLabel={true}
                  className="w-full max-w-[350px]"
                  onChangeData={(data: any) => {
                    debugger;
                    handleFieldChange("schemeID", data.schemeID);
                  }}
                  disabled={isFormDisabled}
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <ERPCheckbox
                  {...getFieldProps("loadAllMultiFos")}
                  label={t("Load All Multi FOC")}
                  onChangeData={(data: any) => {
                    handleFieldChange("loadAllMultiFos", data.loadAllMultiFos);
                  }}
                />
              </div>
            </div>

            {/* Product Barcode and Name row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("product_barcode")}</label>
              </div>
              <div className="md:col-span-4">
                <ERPInput
                  {...getFieldProps("barCode")}
                  noLabel={true}
                  className="w-full lg:w-36  max-md:w-[200px] max-sm:w-full"
                  onChangeData={(data: any) => handleFieldChange("barCode", data.barCode)}
                  disabled={isFormDisabled}
                  onBlur={() => fetchByBarcode()}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("product_name")}</label>
              </div>
              <div className="md:col-span-4">
              <ERPProductSearch
              value={getFieldProps("nameOrCode").value}
              onChange={(e) => {
                handleFieldChange({
                  nameOrCode: e.target.value,
                    });
                  }}
                    type="text"
                    id="test"
                    keyId="testserch"
                    placeholder="Search Here"
                    productDataUrl={Urls.load_product_details_multi_foc}
                    onRowSelected={(data: any) => {
                      const obj = getFieldProps("*");
                      handleDataChange({
                        ...obj,
                        productBatchID: data.productBatchID,
                        unitID: data.unitID,
                        unitName: data.unit,
                        barCode: data.autoBarcode,
                      } as FOCSchemeData);
                    }}
                    onProductSelected={(data: any) => {
                      debugger;
                      const obj = getFieldProps("*");
                      handleDataChange({
                        ...obj,
                        productName: formState.data.productName,
                        testserch: data.productName,
                        productID: data.productID,
                      } as FOCSchemeData);
                    }}
                    batchDataUrl={Urls.select_foc_product_batch_grid_multi_foc}
                    clearAfterSelection={false}
                  />
              
              </div>
            </div>

            {/* Qty Limit and Unit row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("qty_limit")}</label>
              </div>
              <div className="md:col-span-4">
                <div className="w-24">
                  <ERPInput
                    {...getFieldProps("qtyLimit")}
                    noLabel={true}
                    type="number"
                    className="w-full"
                    onChangeData={(data: any) => handleFieldChange("qtyLimit", parseFloat(data.qtyLimit))}
                    disabled={isFormDisabled}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("item_unit")}</label>
              </div>
              <div className="md:col-span-4">
                <ERPDataCombobox
                  {...getFieldProps("unitID")}
                  field={{
                    id: "unitID",
                    getListUrl: Urls.data_units,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  noLabel={true}
                  className="w-full lg:w-36  max-md:w-[200px] max-sm:w-full"
                  onChangeData={(data: any) => handleFieldChange("unitID", data.id)}
                  disabled={isFormDisabled}
                />
              </div>
            </div>
          </div>

          {/* Free Product Details section */}
          <div className="border-t border-gray-400 border-dotted mt-1">
            <div className="border-b border-dotted border-gray-400 bg-gray-300 px-2 py-1">
              <h6 className="text-[#991B1B] font-medium m-0">{t("free_product_details")}</h6>
            </div>

            <div className="p-2">
              {/* Free Product Barcode and Name row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                <div className="md:col-span-2">
                  <label className="text-left font-medium">{t("product_barcode")}</label>
                </div>
                <div className="md:col-span-4">
                  <ERPInput
                    {...getFieldProps("freeItemBarcode")}
                    noLabel={true}
                    className="w-full max-w-[350px]"
                    onChangeData={(data: any) => handleFieldChange("freeItemBarcode", data.freeItemBarcode)}
                    disabled={isFormDisabled}
                    onBlur={() => fetchByFreeItemBarcode()}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-left font-medium">{t("product_name")}</label>
                </div>
                <div className="md:col-span-4">
                 

<ERPProductSearch
              value={getFieldProps("nameOrCode_free").value}
              onChange={(e) => {
                handleFieldChange({
                  nameOrCode_free: e.target.value,
                    });
                  }}
                    type="text"
                    id="test"
                    keyId="testSearchFree"
                    placeholder="Search Here"
                    productDataUrl={Urls.load_product_details_multi_foc}
                    onRowSelected={(data: any) => {
                      const obj = getFieldProps("*");
                      handleDataChange({
                        ...obj,
                        freeProductBatchID: data.productBatchID,
                        freeUnitID: data.unitID,
                        freeUnitName: data.unit,
                        freeItemBarcode: data.autoBarcode,
                      } as FOCSchemeData);
                    }}
                    onProductSelected={(data: any) => {
                      debugger;
                      const obj = getFieldProps("*");
                      handleDataChange({
                        ...obj,
                        freeProductName: formState.data.productName,
                        freeProductID: data.productID,
                      } as FOCSchemeData);
                    }}
                    batchDataUrl={Urls.select_foc_product_batch_grid_multi_foc}
                  />
                </div>
              </div>

              {/* Free Qty and Unit row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                <div className="md:col-span-2">
                  <label className="text-left font-medium">{t("free_qty")}</label>
                </div>
                <div className="md:col-span-4">
                  <div className="w-24">
                    <ERPInput
                      {...getFieldProps("freeQty")}
                      noLabel={true}
                      type="number"
                      className="w-full"
                      onChangeData={(data: any) => handleFieldChange("freeQty", parseFloat(data.freeQty))}
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-left font-medium">{t("item_unit")}</label>
                </div>
                <div className="md:col-span-4 flex items-center justify-between">
                  <div className="flex-grow">
                    <ERPDataCombobox
                      {...getFieldProps("freeUnitID")}
                      field={{
                        id: "freeUnitID",
                        getListUrl: Urls.data_units,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      noLabel={true}
                      className="w-full lg:w-36  max-md:w-[200px] max-sm:w-full"
                      onChangeData={(data: any) => handleFieldChange("freeUnitID", data.id)}
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="ml-2">
                    <ERPButton
                      title={t("add")}
                      variant="primary"
                      className="bg-blue-600 text-white h-9 px-8"
                      onClick={handleAdd}
                      disabled={isFormDisabled || isDataLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid section */}
      <div className="overflow-x-auto">
        <DataGrid
          dataSource={gridData}
          showBorders={true}
          rowAlternationEnabled={true}
          className="w-full"
        >
          <Paging defaultPageSize={10} />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={false}
            allowAdding={false}
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
      <div className="flex flex-row max-md:flex-col items-center mt-2">
                <p className="text-[#F87171] text-sm font-medium mr-auto">{t("this_offer_price_is_only_applicable_on_standard_price")}</p>
                <div className="flex items-center">
               
                    <div className="flex gap-2 ml-4">
                       
                        <ERPButton
                            title={t("clear")}
                            variant="secondary"
                            onClick={handleClear}
                        />
                        <ERPButton
                            title={t("save")}
                            variant="primary"
                            onClick={handleSave}
                        />
                    </div>
                </div>
            </div>
      {/* Batch Grid Modal */}
      
    </div>
  );
};

export default MultiFOCScheme;