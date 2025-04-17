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
      freeProductName: ""
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
}

export const FOCScheme: React.FC = () => {
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<FOCSchemeData[]>([]);
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
  } = useFormManager<FOCSchemeData>({
    initialData: initialFOCScheme,
    useApiClient: true,
  });

  const handleLoad = useCallback(async () => {
     try {
          debugger;
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
            debugger;
            const obj = getFieldProps("*");
            if (isNullOrUndefinedOrEmpty(obj.barCode)) {
             
              return;
            }
            setIsDataLoading(true);
            
            const url = `${Urls.select_product_by_barcode_foc}${obj.barCode}`;
            const response = await api.get(url);
            handleResponse(response, () =>{
                handleDataChange(
                    {
                        ...obj,
                        unitID: response.unitId,
                        unitName: response.unit,
                        productName:  response.productName,
                        stdSalesPrice:  response.StdSalesPrice,
                        stdPurchasePrice:  response.StdPurchasePrice,

                    } as FOCSchemeData
                )
            }, () =>{} ,false)
          } catch (error) {
            console.error("Error loading data:", error);
            setIsDataLoading(false);
          }
      }, [getFieldProps]);
      const fetchByFreeItemBarcode = useCallback(async () => {
         try {
              debugger;
              const obj = getFieldProps("*");
              if (isNullOrUndefinedOrEmpty(obj.freeItemBarcode)) {
               
                return;
              }
              setIsDataLoading(true);
              
              const url = `${Urls.select_product_by_barcode_foc}${obj.freeItemBarcode}`;
              const response = await api.get(url);
              handleResponse(response, () =>{
                handleDataChange(
                    {
                        ...obj,
                        // unitID: response.unitId,
                        // unitName: response.unit,
                        freeProductName:  response.productName,
                        freeStdSalesPrice:  response.StdSalesPrice,
                        freeStdPurchasePrice:  response.StdPurchasePrice,

                    } as FOCSchemeData
                )
            }, () =>{} ,false)
              setIsDataLoading(false);
            } catch (error) {
              console.error("Error loading data:", error);
              setIsDataLoading(false);
            }
        }, [getFieldProps]);

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
  }, [formState.data, gridData, getFieldProps]);

  const handleClear = useCallback(() => {
    clearForm();
  }, [clearForm]);

  const handleRemoveRow = useCallback((rowId: number) => {
    
  }, [getFieldProps]);

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
    <>
      <div className="grid grid-cols-1 gap-4">
        <ERPDataCombobox
          {...getFieldProps("schemeID")}
          field={{
            id: "schemeID",
            getListUrl: Urls.select_quantity_schemes_for_combo,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("scheme")}
          onChangeData={(data: any) => handleFieldChange("schemeID", data.schemeID)}
        />
        <div className="grid grid-cols-8 gap-4">
          

          <ERPInput
            {...getFieldProps("quantity")}
            label={t("quantity")}
            type="number"
            onChangeData={(data: any) =>
              handleFieldChange("quantity", parseFloat(data.quantity))
            }
          />

          <ERPInput
            {...getFieldProps("freeQuantity")}
            label={t("free_quantity")}
            type="number"
            onChangeData={(data: any) =>
              handleFieldChange("freeQuantity", parseFloat(data.freeQuantity))
            }
          />

          <ERPInput
            {...getFieldProps("stdSalesPrice")}
            label={t("std_sales_price")}
            type="number"
            onChangeData={(data: any) =>
              handleFieldChange("stdSalesPrice", parseFloat(data.stdSalesPrice))
            }
          />

          <ERPInput
            {...getFieldProps("barCode")}
            label={t("item_barcode")}
            onChangeData={(data: any) =>
              handleFieldChange("barCode", data.barCode)
            }
          />

          <ERPInput
            {...getFieldProps("freeItemBarcode")}
            label={t("free_item_barcode")}
            onChangeData={(data: any) =>
              handleFieldChange("freeItemBarcode", data.freeItemBarcode)
            }
          />

          <ERPInput
            {...getFieldProps("itemUnit")}
            label={t("item_unit")}
            onChangeData={(data: any) =>
              handleFieldChange("itemUnit", data.itemUnit)
            }
          />

          <ERPInput
            {...getFieldProps("stdPurchasePrice")}
            label={t("std_purchase_price")}
            type="number"
            onChangeData={(data: any) =>
              handleFieldChange(
                "stdPurchasePrice",
                parseFloat(data.stdPurchasePrice)
              )
            }
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-end gap-2">
            <ERPInput
              {...getFieldProps("nameCode")}
              label={t("name_code")}
              className="flex-grow"
              onChangeData={(data: any) =>
                handleFieldChange("nameCode", data.nameCode)
              }
            />
            <ERPCheckbox
              {...getFieldProps("code")}
              label={t("code")}
              onChangeData={(data: any) => handleFieldChange("code", data.code)}
            />
          </div>
          <ERPInput
            {...getFieldProps("remarks")}
            label={t("remarks")}
            onChangeData={(data: any) =>
              handleFieldChange("remarks", data.remarks)
            }
          />

          <ERPInput
            {...getFieldProps("itemName")}
            label={t("item_name")}
            onChangeData={(data: any) =>
              handleFieldChange("itemName", data.itemName)
            }
          />
          <ERPInput
            {...getFieldProps("freeItemName")}
            label={t("free_item_name")}
            onChangeData={(data: any) =>
              handleFieldChange("freeItemName", data.freeItemName)
            }
          />
        </div>
      </div>
      <div className="w-full modal-content flex flex-col gap-4">
        {/* <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-3">
                    <ERPDataCombobox
                        {...getFieldProps("scheme")}
                        field={{
                            id: "scheme",
                            getListUrl: Urls.data_parties,
                            valueKey: "id",
                            labelKey: "name",
                        }}
                        label={t("scheme")}
                        onChangeData={(data: any) => handleFieldChange("scheme", data.scheme)}
                    />

                    <ERPInput
                        {...getFieldProps("quantity")}
                        label={t("quantity")}
                        type="number"
                        onChangeData={(data: any) => handleFieldChange("quantity", parseFloat(data.quantity))}
                    />

                    <ERPInput
                        {...getFieldProps("freeQuantity")}
                        label={t("free_quantity")}
                        type="number"
                        onChangeData={(data: any) => handleFieldChange("freeQuantity", parseFloat(data.freeQuantity))}
                    />

                    <ERPInput
                        {...getFieldProps("stdSalesPrice")}
                        label={t("std_sales_price")}
                        type="number"
                        onChangeData={(data: any) => handleFieldChange("stdSalesPrice", parseFloat(data.stdSalesPrice))}
                    />

                    <ERPInput
                        {...getFieldProps("itemBarcode")}
                        label={t("item_barcode")}
                        onChangeData={(data: any) => handleFieldChange("itemBarcode", data.itemBarcode)}
                    />

                    <ERPInput
                        {...getFieldProps("freeItemBarcode")}
                        label={t("free_item_barcode")}
                        onChangeData={(data: any) => handleFieldChange("freeItemBarcode", data.freeItemBarcode)}
                    />

                    <ERPInput
                        {...getFieldProps("itemUnit")}
                        label={t("item_unit")}
                        onChangeData={(data: any) => handleFieldChange("itemUnit", data.itemUnit)}
                    />

                    <ERPInput
                        {...getFieldProps("stdPurchasePrice")}
                        label={t("std_purchase_price")}
                        type="number"
                        onChangeData={(data: any) => handleFieldChange("stdPurchasePrice", parseFloat(data.stdPurchasePrice))}
                    />

                    <div className="flex items-end gap-2">
                        <ERPInput
                            {...getFieldProps("nameCode")}
                            label={t("name_code")}
                            className="flex-grow"
                            onChangeData={(data: any) => handleFieldChange("nameCode", data.nameCode)}
                        />
                        <ERPCheckbox
                            {...getFieldProps("code")}
                            label={t("code")}
                            onChangeData={(data: any) => handleFieldChange("code", data.code)}
                        />
                    </div>
                    <ERPInput
                        {...getFieldProps("remarks")}
                        label={t("remarks")}
                        onChangeData={(data: any) => handleFieldChange("remarks", data.remarks)}
                    />

                    <ERPInput
                        {...getFieldProps("itemName")}
                        label={t("item_name")}
                        onChangeData={(data: any) => handleFieldChange("itemName", data.itemName)}
                    />
                    <ERPInput
                        {...getFieldProps("freeItemName")}
                        label={t("free_item_name")}
                        onChangeData={(data: any) => handleFieldChange("freeItemName", data.freeItemName)}
                    />
                </div> */}

        <div className="flex justify-end gap-4 mt-4">
          <ERPButton
            title={t("load")}
            variant="secondary"
            onClick={handleLoad}
            disabled={isDataLoading}
          />
          <ERPButton title={t("add")} variant="secondary" onClick={handleAdd} />
          <ERPButton
            title={t("clear")}
            variant="secondary"
            onClick={handleClear}
          />
        </div>

        <div>
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
    </>
  );
};

export default FOCScheme;
