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
import { isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero, } from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";
import ERPProductSearch from "../../../../components/ERPComponents/erp-searchbox";

const api = new APIClient();

export const initialSpecialPrice: {
  data: SpecialPriceData;
  validations: any;
  [key: string]: any;
} = {
  data: {
    isGroup: false,
    groupID: "",
    schemeID: 0,
    barcode: "",
    unitID: 0,
    salesPrice: 0,
    groupPrice: 0,
    nameCode: "",
    searchByCode: false,
    product: "",
    batchID: 0,
    stdSalesPrice: 0,
    stdPurchasePrice: 0,
    unitName: ""
  },
  validations: {
    group: "",
    scheme: "",
    barcode: "",
    salesPrice: "",
  },
};

export interface SpecialPriceData {
  schemeID: number;
  isGroup: boolean;
  groupID: string;
  barcode: string;
  unitID: number;
  unitName: string;
  salesPrice: number;
  groupPrice: number;
  nameCode: string;
  searchByCode: boolean;
  product: string;
  batchID: number;
  stdSalesPrice: number;
  stdPurchasePrice: number;
}

export const SpecialPrice: React.FC = () => {
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<SpecialPriceData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    handleDataChange,
    handleClear: clearForm,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<SpecialPriceData>({
    initialData: initialSpecialPrice,
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
      const queryString = `schemeId=${encodeURIComponent(
        obj.schemeID
      )}&productGroupID=${encodeURIComponent(obj.groupID)}`;
      const url = `${Urls.select_special_price_scheme_by_scheme_id}?${queryString}`;
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

  const onBarcodeKeyDown = useCallback(async (e: any) => {
    debugger;
    if(e.code != "Enter") {
      return
    }
    try {
      const obj = getFieldProps("*");
      if (isNullOrUndefinedOrZero(obj.barcode)) {
       
        return;
      }
      setIsDataLoading(true);
      const url = `${Urls.select_product_by_barcode}${obj.barcode}`;
      const response = await api.get(url);
      debugger;
      handleDataChange({
        ...obj,
        productBatchId: response.productBatchId,
        productName: response.productName,
        unitId: response.unitId,
        unitName: response.unit,
        stdSalesPrice: response.stdSalesPrice,
        stdPurchasePrice: response.stdPurchasePrice,
        salesPrice: response.specialPrice ?? 0,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [getFieldProps]);
  const handleAdd = useCallback(async () => {
    const obj: SpecialPriceData = getFieldProps("*");

    if (isNullOrUndefinedOrZero(obj.schemeID)) {
      ERPAlert.show({
        title: "",
        icon: "warning",
        text: "Please Select Any Scheme..!",
      });
      return false;
    }
    if (obj.isGroup) {
      if (isNullOrUndefinedOrZero(obj.groupID)) {
        ERPAlert.show({
          title: "",
          icon: "warning",
          text: "Please Select Any group..!",
        });
        return false;
      }
      const payload = {
        groupPrice: obj.groupPrice,
        schemeID: obj.schemeID,
        GroupID: obj.groupID,
      };
      const url = `${Urls.insert_special_price_scheme_by_group_id}ByGroup`;
      const response = await api.postAsync(url, payload);
      handleResponse(response, () => {
        debugger;
        setGridData((prev: any) => [...prev, ...response.items]);
        // handleLoad();
      });
    } else {
      const payload = {
        schemeID: obj.schemeID,
        productBatchID: obj.batchID,
        salesPrice: obj.salesPrice,
        groupID: isNullOrUndefinedOrEmpty(obj.groupID) ? 0 : obj.groupID,
        unitID: isNullOrUndefinedOrEmpty(obj.unitID) ? 0 : obj.unitID,
      };
      const url = `${Urls.insert_special_price_scheme}`;
      const response = await api.postAsync(url, payload);
      handleResponse(response, () => {
        handleLoad();
      });
    }
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
          onClick={() => handleRemoveRow(cellData.data.specialPriceID)}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div className="w-full p-2 bg-gray-100">
      <div className="bg-white p-2 max-w-[900px] rounded-md shadow-sm mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
          {/* Left column */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="w-full sm:w-16 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                <ERPCheckbox
                  {...getFieldProps("isGroup")}
                  label={t("group")}
                  onChangeData={(data: any) =>
                    handleFieldChange("isGroup", data.isGroup)
                  }
                />
              </div>
              <div className="flex-1">
                <ERPDataCombobox
                  {...getFieldProps("groupID")}
                  noLabel={true}
                  disabled={!formState.data.isGroup}
                  field={{
                    id: "groupID",
                    getListUrl: Urls.data_productgroup,
                    valueKey: "id",
                    labelKey: "name",
                    required: true,
                  }}
                  className="w-full"
                  onChangeData={(data: any) =>
                    handleFieldChange("groupID", data.groupID)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="w-full sm:w-16 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                <label>{t("scheme")}:</label>
              </div>
              <div className="flex-1">
                <ERPDataCombobox
                  {...getFieldProps("schemeID")}
                  field={{
                    id: "schemeID",
                    getListUrl: Urls.select_price_schemes_for_combo,
                    valueKey: "id",
                    labelKey: "name",
                  }}
                  noLabel={true}
                  className="w-full"
                  onChangeData={(data: any) => {
                    handleFieldChange("schemeID", data.schemeID);
                  }}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-16 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("barcode")}:</label>
                </div>
                <div className="flex-1">
                  <ERPInput
                    {...getFieldProps("barcode")}
                    noLabel={true}
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("barcode", data.barcode)
                    }
                    disableEnterNavigation
                    onKeyDown={onBarcodeKeyDown}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-16 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("price")}:</label>
                </div>
                <div className="flex-1">
                  <ERPInput
                    {...getFieldProps("salesPrice")}
                    noLabel={true}
                    type="number"
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("salesPrice", parseFloat(data.salesPrice))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-16 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("unit")}:</label>
                </div>
                <div className="flex-1">
                  <ERPInput
                    {...getFieldProps("unitName")}
                    noLabel={true}
                    disabled
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("unitName", data.unitName)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full sm:w-16 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("product")}:</label>
                </div>
                <div className="flex-1">
                  <span className="text-[#dc2626]">{getFieldProps("productName").value??"Item"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="w-full sm:w-28 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                <label>{t("group_price")}:</label>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-full sm:w-32 mb-2 sm:mb-0">
                  <ERPInput
                    {...getFieldProps("groupPrice")}
                    noLabel={true}
                    type="number"
                    className="w-full"
                    onChangeData={(data: any) =>
                      handleFieldChange("groupPrice", parseFloat(data.groupPrice))
                    }
                  />
                </div>
                <div className="sm:ml-4">
                  <ERPCheckbox
                    {...getFieldProps("searchByCode")}
                    label={t("Code")}
                    onChangeData={(data: any) => handleFieldChange("searchByCode", data.searchByCode)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-28 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                  <label>{t("name_code")}:</label>
                </div>
                <div className="flex-1">
                  <ERPProductSearch
                    type="text"
                    id="test"
                    keyId="testserch"
                    placeholder="Search Here"
                    productDataUrl={Urls.load_product_details}
                    searchByCode={getFieldProps("searchByCode").value}
                    onRowSelected={(data: any) => {
                      const obj = getFieldProps("*");
                      handleDataChange({
                        ...obj,
                        unitID: data.unitID,
                        unitName: data.unit,
                        barcode: data.autoBarcode,
                        salesPrice: data.sPrice,
                        stdSalesPrice: data.sPrice,
                        stdPurchasePrice: data.pPrice,
                        batchID: data.productBatchID,
                      } as SpecialPriceData);
                    }}
                    onProductSelected={(data: any) => {
                      const obj = getFieldProps("*");
                      handleDataChange({
                        ...obj,
                        productName: data.productName,
                        productID: data.productID,
                      } as SpecialPriceData);
                    }}
                    batchDataUrl={Urls.select_foc_product_batch_grid}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                <label>{t("std_sales_price")}:</label>
              </div>
              <div className="flex-1">
                <span className="text-[#dc2626]">{getFieldProps("stdSalesPrice").value}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="w-full sm:w-32 sm:text-right sm:pr-2 mb-1 sm:mb-0">
                <label>{t("std_purchase_price")}:</label>
              </div>
              <div className="flex-1">
                <span className="text-[#dc2626]">{getFieldProps("stdPurchasePrice").value}</span>
              </div>
            </div>
            <div className="flex justify-end flex-wrap gap-2">
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
          <Paging defaultPageSize={5} />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={false}
            allowAdding={false}
          />
          <Column
            dataField="productName"
            width={375}
            caption={t("name")}
          />
          <Column
            dataField="autoBarcode"
            width={125}
            caption={t("barcode")}
          />
          <Column
            dataField="unitName"
            width={60}
            caption={t("unit")}
          />
          <Column
            dataField="productBatchID"
            width={60}
            caption={t("product_batch_id")}
          />
          <Column
            dataField="specialPriceID"
            width={100}
            caption={t("special_price_id")}
          />
          <Column
            dataField="stdSalesPrice"
            width={100}
            caption={t("salesPrice")}
          />
          <Column
            dataField="salesPrice"
            width={100}
            caption={t("scheme_price")}
          />
          <Column
            caption="X"
            cellRender={renderDeleteCell}
            width={30}
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default SpecialPrice;