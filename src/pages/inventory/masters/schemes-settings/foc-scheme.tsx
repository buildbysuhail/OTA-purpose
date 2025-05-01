import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero } from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";
import ERPProductSearch from "../../../../components/ERPComponents/erp-searchbox";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const api = new APIClient();

export const initialFOCScheme: {
  data: FOCSchemeData;
  validations: any;
  [key: string]: any;
} = {
  data: {
    schemeID: 0,
    productBatchID: 0,
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
    searchByCode: false
  },
  validations: {},
};

export interface FOCSchemeData {
  schemeID: number;
  productBatchID: number;
  qtyLimit: number;
  freeQty: number;
  freeProductBatchID: number;
  remarks: string;
  unitID: number;
  stdSalesPrice: number;
  freeStdSalesPrice: number;
  stdPurchasePrice: number;
  freeStdPurchasePrice: number;
  barCode: string;
  unitName: string;
  productName: string;
  freeProductName: string;
  freeItemBarcode: string;
  searchByCode: boolean;
}

const FOCScheme: React.FC = () => {
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<FOCSchemeData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const clientSession = useSelector((state: RootState) => state.ClientSession)

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    handleDataChange,
    handleClear: clearForm,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<FOCSchemeData>({
    initialData: initialFOCScheme,
    useApiClient: true,
  });

  const handleLoad = useCallback(async () => {
    try {
      const obj = getFieldProps("*");
      if (isNullOrUndefinedOrZero(obj.schemeID)) {
        ERPAlert.show({
          title: "",
          icon: "warning",
          text: "Please Select Any Scheme..!",
        });
        return;
      }
      setIsDataLoading(true);

      const url = `${Urls.select_quantity_discount_scheme_by_scheme_id}${obj.schemeID}`;
      const response = await api.get(url);
      if (response) {
        setGridData(response);
      }
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [getFieldProps]);
  const fetchByBarcode = useCallback(async () => {
    try {
      const obj = getFieldProps("*");
      if (isNullOrUndefinedOrEmpty(obj.barCode)) {
        return;
      }
      setIsDataLoading(true);

      const url = `${Urls.select_product_by_barcode_foc}${obj.barCode}`;
      const response = await api.get(url);
      handleDataChange(
        {
          ...obj,
          productBatchID: response.productBatchID,
          unitID: response.unitId,
          unitName: response.unit,
          productName: response.productName,
          stdSalesPrice: response.stdSalesPrice,
          stdPurchasePrice: response.stdPurchasePrice,

        } as FOCSchemeData);
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

      const url = `${Urls.select_product_by_barcode_foc}${obj.freeItemBarcode}`;
      const response = await api.get(url);
      handleDataChange({
        ...obj,
        freeProductBatchID: response.productBatchID,
        freeProductName: response.productName,
        freeStdSalesPrice: response.stdSalesPrice,
        freeStdPurchasePrice: response.stdPurchasePrice,
      } as FOCSchemeData);
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [getFieldProps, handleDataChange]);

  const handleAdd = useCallback(async () => {
    const obj: FOCSchemeData = getFieldProps("*");

    if (isNullOrUndefinedOrZero(obj.schemeID)) {
      ERPAlert.show({
        title: "",
        icon: "warning",
        text: "Please Select Any Scheme..!",
      });
      return false;
    }

    const payload = {
      schemeID: obj.schemeID,
      productBatchID: obj.productBatchID,
      qtyLimit: obj.qtyLimit,
      freeQty: obj.freeQty,
      freeProductBatchID:
        obj.freeProductBatchID !== 0
          ? obj.freeProductBatchID
          : obj.productBatchID,
      remarks: obj.remarks,
      unitID: obj.unitID,
    };

    const url = `${Urls.insert_quantity_discount_scheme}`;
    const response = await api.postAsync(url, payload);

    handleResponse(response, () => {
      handleLoad();
    });
  }, [getFieldProps, handleLoad]);

  const handleClear = useCallback(() => {
    clearForm();
  }, [clearForm]);

  const handleRemoveRow = useCallback((rowId: number) => {
    // Implementation for removing rows
  }, []);

  const renderDeleteCell = (cellData: any) => {
    return (
      <div className="flex justify-center">
        <button
          className="text-[#ef4444] font-bold px-2"
          onClick={() => handleRemoveRow(cellData.data.focSchemeID)}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div className="w-full p-2 bg-gray-100">
      <div className="bg-white p-2 max-w-[900px] rounded-md shadow-sm mb-4">
        <div className="grid grid-cols-1 gap-3">
          {/* Left column */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                <label>{t("scheme")}:</label>
              </div>
              <div className="flex-1">
                <ERPDataCombobox
                  {...getFieldProps("schemeID")}
                  field={{
                    id: "schemeID",
                    getListUrl: Urls.select_quantity_schemes_for_combo,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  noLabel={true}
                  className="max-w-[350px]"
                  onChangeData={async (data: any) => {
                    const obj = getFieldProps("*");
                    const res = await api.getAsync(`${Urls.select_scheme_qty_details_by_id}${data.schemeID}`);
                    debugger
                    handleDataChange({
                      ...obj,
                      qtyLimit: res.QtyLimit,
                      freeQty: res.FreeQty,
                      schemeID: data.schemeID,
                    } as FOCSchemeData);
                  }}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("quantity")}:</label>
                </div>
                <div className="flex-1">
                  <ERPInput
                    {...getFieldProps("qtyLimit")}
                    readOnly
                    noLabel={true}
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("qtyLimit", data.qtyLimit)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("free_quantity")}:</label>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-full sm:w-32 mb-2 sm:mb-0">
                    <ERPInput
                      {...getFieldProps("freeQty")}
                      noLabel={true}
                      type="number"
                      readOnly
                      className="w-full"
                      onChangeData={(data: any) =>
                        handleFieldChange("freeQty", parseFloat(data.freeQty))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("std_sales_price")}:</label>
                </div>
                <div className="flex-1">
                  <span className="text-[#dc2626]">{formState.data.stdSalesPrice}</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("item_barcode")}:</label>
                </div>
                <div className="flex-1">
                  <ERPInput
                    {...getFieldProps("barCode")}
                    noLabel={true}
                    className="w-full"
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        fetchByBarcode();
                      }
                    }}
                    disableEnterNavigation
                    onChangeData={(data: any) =>
                      handleFieldChange("barCode", data.barCode)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("item_unit")}:</label>
                </div>
                <div className="flex-1">
                  <ERPInput
                    {...getFieldProps("unitName")}
                    noLabel={true}
                    readOnly
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("unitName", data.unitName)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("std_purchase_price")}:</label>
                </div>
                <div className="flex-1">
                  <span className="text-[#dc2626]">{formState.data.stdPurchasePrice}</span>
                </div>
              </div>
            </div>
{clientSession.isAppGlobal &&
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("free_item_barcode")}:</label>
                </div>
                <div className="flex-1">
                  <ERPInput
                    {...getFieldProps("freeItemBarcode")}
                    noLabel={true}
                    className="w-full"
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        fetchByFreeItemBarcode();
                      }
                    }}
                    disableEnterNavigation
                    onChangeData={(data: any) =>
                      handleFieldChange("freeItemBarcode", data.freeItemBarcode)
                    }
                  />
                </div>
              </div>
            </div>
}
            <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("name_code")}:</label>
                </div>
                <div>
                  <ERPProductSearch
                    type="text"
                    id="test"
                    keyId="testserch"
                    placeholder="Search Here"
                    productDataUrl={Urls.load_product_details_foc}
                    onRowSelected={(data: any) => {
                      const obj = getFieldProps("*");
                      handleDataChange({
                        ...obj,
                        productBatchID: data.productBatchID,
                        unitID: data.unitID,
                        unitName: data.unit,
                        barCode: data.autoBarcode,
                        stdSalesPrice: data.sPrice,
                        stdPurchasePrice: data.pPrice,
                        productName: data.productName,
                      } as FOCSchemeData);
                    }}
                    batchDataUrl={Urls.select_foc_product_batch_grid_foc}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("remarks")}:</label>
                </div>
                <div className="flex-1">
                  <ERPInput
                    {...getFieldProps("remarks")}
                    noLabel={true}
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("remarks", data.remarks)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("item_name")}:</label>
                </div>
                <div className="flex-1">
                  <span className="text-[#dc2626]">{formState.data?.productName}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("free_item_name")}:</label>
                </div>
                <div className="flex-1">
                  <span className="text-[#dc2626]">{formState.data?.freeProductName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 mt-2">
          <ERPButton
            title={t("load")}
            variant="secondary"
            onClick={handleLoad}
            disabled={isDataLoading}
          />
          <ERPButton
            title={t("add")}
            variant="secondary"
            onClick={handleAdd}
          />
          <ERPButton
            title={t("clear")}
            variant="secondary"
            onClick={handleClear}
          />
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
          <Column dataField="buyItem" width={300} caption={t("name")} />
          <Column dataField="autoBarcode" width={100} caption={t("barcode")} />
          <Column dataField="stdSalesPrice" width={80} caption={t("sales_price")} />
          <Column dataField="unitName" width={80} caption={t("unit")} />
          <Column dataField="qtyLimit" width={70} caption={t("qty")} />
          <Column dataField="freeItem" width={100} caption={t("free_item")} />
          <Column dataField="freeQty" width={70} caption={t("free_qty")} />
          <Column dataField="qtyDiscountID" width={100} caption={t("qty_discount_id")} visible={false} />
          <Column caption="X" cellRender={renderDeleteCell} width={30} />
        </DataGrid>
      </div>
    </div>
  );
};

export default FOCScheme;