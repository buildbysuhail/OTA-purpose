import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
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
    multiFocSchemeID:0,
    stdPurchasePrice: 0,
    freeStdPurchasePrice: 0,
    freeProductName: "",
    searchByCode: false,
    freeUnitID: 0,
    freeUnitName: "",
    nameOrCode: "",
    nameOrCode_free: "",
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
  multiFocSchemeID:number;
  productID: number;
  freeProductID: number;
  barCode: string;
  freeItemBarcode: string;
  stdSalesPrice: number;
  freeStdSalesPrice: number;
  stdPurchasePrice: number;
  freeStdPurchasePrice: number;
  searchByCode: boolean;
  nameOrCode: string;
  nameOrCode_free: string;
}

const MultiFOCScheme: React.FC = () => {
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<FOCSchemeData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [focSchemeForm, setFocSchemeForm] = useState(initialFOCScheme);

  const isFormDisabled = focSchemeForm.data.loadAllMultiFos;

  const handleSave = useCallback(async () => {
    if (gridData.length === 0) {
      ERPAlert.show({
        title: "",
        icon: "warning",
        text: "No data to save. Please add items to the grid.",
      });
      return;
    }
    try {
      const payload = gridData;
      const response = await api.post(Urls.insert_multi_foc_details, payload);
      handleResponse(response, () => handleClear());
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [gridData]);

  const fetchByBarcode = useCallback(async () => {
    try {
      const obj = focSchemeForm.data;
      if (isNullOrUndefinedOrEmpty(obj.barCode)) {
        return;
      }
      setIsDataLoading(true);
      const url = `${Urls.select_product_by_barcode_multi_foc}${obj.barCode}`;
      const response = await api.get(url);
      handleResponse(
        response,
        () => {
          setFocSchemeForm((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              productBatchID: response.productBatchID,
            },
          }));
        },
        // () => {},
        // false
      );
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [focSchemeForm]);

  const fetchByFreeItemBarcode = useCallback(async () => {
    try {
      const obj = focSchemeForm.data;
      if (isNullOrUndefinedOrEmpty(obj.freeItemBarcode)) {
        return;
      }
      setIsDataLoading(true);
      const url = `${Urls.select_product_by_barcode_multi_foc}${obj.freeItemBarcode}`;
      const response = await api.get(url);
      handleResponse(
        response,
        () => {
          setFocSchemeForm((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              freeProductBatchID: response.productBatchID,
            },
          }));
        },
        // () => {},
        // false
      );
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [focSchemeForm]);

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
    const obj: FOCSchemeData = focSchemeForm.data;
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
      multiFocSchemeID:obj.multiFocSchemeID,
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
      nameOrCode: obj.nameOrCode,
      nameOrCode_free: obj.nameOrCode_free,
    };

    setGridData((prevGridData) => {
      if (prevGridData instanceof CustomStore) {
        return [newSchemeData];
      }
      return [...prevGridData, newSchemeData];
    });
    handleClear();
  }, [focSchemeForm]);

  const handleClear = useCallback(() => {
    setFocSchemeForm(initialFOCScheme);
  }, []);

  const handleRemoveRow = useCallback((schemeID: number) => {
    setGridData((prevGridData) => {
      if (prevGridData instanceof CustomStore) {
        return [];
      }
      return prevGridData.filter((item: FOCSchemeData) => item.multiFocSchemeID !== schemeID);
    });
  }, []);

  useEffect(() => {
    if (focSchemeForm.data.loadAllMultiFos) {
      fetchAllMultiFosData(focSchemeForm.data.schemeID);
    } else {
      setGridData([]);
    }
  }, [focSchemeForm.data.loadAllMultiFos, fetchAllMultiFosData]);

  const renderDeleteCell = (cellData: any) => {
    return (
      <div className="flex justify-center">
        <button
          className="text-[#ef4444] font-bold px-2"
          onClick={() => handleRemoveRow(cellData.data.multiFocSchemeID)}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div className="w-full p-2 bg-gray-100">
      <div className="bg-white p-2 max-w-[900px] rounded-md shadow-sm mb-4">
        <div className="border border-gray-300 rounded">
          <div className="border-b border-dotted border-gray-400 bg-gray-300 px-2 py-1">
            <h6 className="text-[#991B1B] font-medium m-0">{t("product_details")}</h6>
          </div>

          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2 items-center">
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("scheme")}</label>
              </div>
              <div className="md:col-span-6">
                <ERPDataCombobox
                  id="schemeID"
                  field={{
                    id: "schemeID",
                    getListUrl: Urls.select_quantity_schemes_for_combo_MultiFOC,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  noLabel
                  data={focSchemeForm.data}
                  value={focSchemeForm.data.schemeID}
                  className="w-full max-w-[350px]"
                  onChangeData={(data: any) => {
                    setFocSchemeForm((prev) => ({
                      ...prev,
                      data: { ...prev.data, schemeID: data.schemeID },
                    }));
                  }}
                  disabled={isFormDisabled}
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <ERPCheckbox
                  id="loadAllMultiFos"
                  label={t("Load All Multi FOC")}
                  data={focSchemeForm.data}
                  checked={focSchemeForm.data.loadAllMultiFos}
                  onChangeData={(data: any) => {
                    setFocSchemeForm((prev) => ({ ...prev, data }));
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("product_barcode")}</label>
              </div>
              <div className="md:col-span-4">
                <ERPInput
                  id="barCode"
                  noLabel
                  value={focSchemeForm.data.barCode}
                  className="w-full lg:w-36 max-md:w-[200px] max-sm:w-full"
                  data={focSchemeForm.data}
                  onChangeData={(data: any) => {
                    setFocSchemeForm((prev) => ({ ...prev, data }));
                  }}
                  disabled={isFormDisabled}
                  onBlur={async (e) => {
                    await fetchByBarcode();
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("product_name")}</label>
              </div>
              <div className="md:col-span-4">
                <ERPProductSearch
                  value={focSchemeForm.data.nameOrCode}
                  onChange={(e) => {
                    setFocSchemeForm((prev) => ({
                      ...prev,
                      data: { ...prev.data, nameOrCode: e.target.value },
                    }));
                  }}
                  type="text"
                  id="test"
                  keyId="testserch"
                  placeholder="Search Here"
                  productDataUrl={Urls.load_product_details_multi_foc}
                  onRowSelected={(data: any) => {
                    debugger;
                    setFocSchemeForm((prev) => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        productBatchID: data.productBatchID,
                        unitID: data.unitID,
                        unitName: data.unit,
                        barCode: data.autoBarcode,
                      },
                    }));
                  }}
                  onProductSelected={(data: any) => {
                    debugger;
                    setFocSchemeForm((prev) => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        productName: data.productName,
                        nameOrCode: data.productName,
                        productID: data.productID,
                      },
                    }));
                  }}
                  batchDataUrl={Urls.select_foc_product_batch_grid_multi_foc}
                  clearAfterSelection={false}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("qty_limit")}</label>
              </div>
              <div className="md:col-span-4">
                <div className="w-24">
                  <ERPInput
                    id="qtyLimit"
                    noLabel
                    type="number"
                    value={focSchemeForm.data.qtyLimit}
                    className="w-full"
                    data={focSchemeForm.data}
                    onChangeData={(data: any) => {
                      setFocSchemeForm((prev) => ({ ...prev, data }));
                    }}
                    disabled={isFormDisabled}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-left font-medium">{t("item_unit")}</label>
              </div>
              <div className="md:col-span-4">
                <ERPDataCombobox
                  id="unitID"
                  field={{
                    id: "unitID",
                    getListUrl: Urls.data_units,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  noLabel
                  data={focSchemeForm.data}
                  value={focSchemeForm.data.unitID}
                  className="w-full lg:w-36 max-md:w-[200px] max-sm:w-full"
                  onChangeData={(data: any) => {
                    setFocSchemeForm((prev) => ({
                      ...prev,
                      data: { ...prev.data, unitID: data.id },
                    }));
                  }}
                  disabled={isFormDisabled}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-400 border-dotted mt-1">
            <div className="border-b border-dotted border-gray-400 bg-gray-300 px-2 py-1">
              <h6 className="text-[#991B1B] font-medium m-0">{t("free_product_details")}</h6>
            </div>

            <div className="p-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                <div className="md:col-span-2">
                  <label className="text-left font-medium">{t("product_barcode")}</label>
                </div>
                <div className="md:col-span-4">
                  <ERPInput
                    id="freeItemBarcode"
                    noLabel
                    value={focSchemeForm.data.freeItemBarcode}
                    className="w-full max-w-[350px]"
                    data={focSchemeForm.data}
                    onChangeData={(data: any) => {
                      setFocSchemeForm((prev) => ({ ...prev, data }));
                    }}
                    disabled={isFormDisabled}
                    onBlur={() => fetchByFreeItemBarcode()}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-left font-medium">{t("product_name")}</label>
                </div>
                <div className="md:col-span-4">
                  <ERPProductSearch
                    value={focSchemeForm.data.nameOrCode_free}
                    onChange={(e) => {
                      setFocSchemeForm((prev) => ({
                        ...prev,
                        data: { ...prev.data, nameOrCode_free: e.target.value },
                      }));
                    }}
                    type="text"
                    id="test"
                    keyId="testSearchFree"
                    placeholder="Search Here"
                    productDataUrl={Urls.load_product_details_multi_foc}
                    onRowSelected={(data: any) => {
                      setFocSchemeForm((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          freeProductBatchID: data.productBatchID,
                          freeUnitID: data.unitID,
                          freeUnitName: data.unit,
                          freeItemBarcode: data.autoBarcode,
                        },
                      }));
                    }}
                    onProductSelected={(data: any) => {
                      setFocSchemeForm((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          freeProductName: data.productName,
                          nameOrCode_free: data.productName,
                          freeProductID: data.productID,
                        },
                      }));
                    }}
                    batchDataUrl={Urls.select_foc_product_batch_grid_multi_foc}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                <div className="md:col-span-2">
                  <label className="text-left font-medium">{t("free_qty")}</label>
                </div>
                <div className="md:col-span-4">
                  <div className="w-24">
                    <ERPInput
                      id="freeQty"
                      noLabel
                      type="number"
                      value={focSchemeForm.data.freeQty}
                      className="w-full"
                      data={focSchemeForm.data}
                      onChangeData={(data: any) => {
                        setFocSchemeForm((prev) => ({ ...prev, data }));
                      }}
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
                      id="freeUnitID"
                      field={{
                        id: "freeUnitID",
                        getListUrl: Urls.data_units,
                        valueKey: "id",
                        labelKey: "name",
                      }}
                      noLabel
                      data={focSchemeForm.data}
                      value={focSchemeForm.data.freeUnitID}
                      className="w-full lg:w-36 max-md:w-[200px] max-sm:w-full"
                      onChangeData={(data: any) => {
                        setFocSchemeForm((prev) => ({
                          ...prev,
                          data: { ...prev.data, freeUnitID: data.id },
                        }));
                      }}
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
    </div>
  );
};

export default MultiFOCScheme;