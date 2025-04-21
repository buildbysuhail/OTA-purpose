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

const api = new APIClient();

export const initialFOCScheme: {
  data: FOCSchemeData;
  validations: any;
  [key: string]: any;
} = {
  data: {
    schemeID: 0,
    productBatchID: 0,
    loadAllMultiFos:false,
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
    freeUnitName: ""
  },
  validations: {},
};

export interface FOCSchemeData {
  schemeID: number;
  loadAllMultiFos:boolean;
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
                        productBatchID: response.productBatchID,
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
                        freeProductBatchID: response.productBatchID,
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
        <h6>{t("product_details")}</h6>
        <div className="flex gap-4">
        <ERPDataCombobox
          {...getFieldProps("schemeID")}
          field={{
            id: "schemeID",
            getListUrl: Urls.select_quantity_schemes_for_combo,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("scheme")}
          onChangeData={async(data: any) => {
            const obj = getFieldProps("*")
            const res = await api.getAsync(`${Urls.select_scheme_qty_details_by_id}${data.schemeID}`) ;
            handleDataChange(
                {
                    ...obj,
                    qtyLimit: res.qtyLimit,
                    freeQty: res.freeQty,
                    schemeID:data.schemeID

                } as FOCSchemeData
            )
          }}
        />
        <ERPCheckbox
            {...getFieldProps("loadAllMultiFos")}
            label={t("loadAll_MultiFos")}
            onChangeData={(data: any) => handleFieldChange("loadAllMultiFos", data.loadAllMultiFos)}
          />
        </div>
       
        <div className="grid grid-cols-4 gap-4">
          <ERPInput
            {...getFieldProps("barCode")}
            label={t("product_barcode")}
          
            onChangeData={(data: any) =>
              handleFieldChange("barCode", data.barCode)
            }
          />

          <ERPDataCombobox
          {...getFieldProps("productName")}
          field={{
            id: "productName",
            getListUrl: Urls.select_quantity_schemes_for_combo,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("product_name")}
          // onChangeData={async(data: any) => {
          //   const obj = getFieldProps("*")
          //   const res = await api.getAsync(`${Urls.select_scheme_qty_details_by_id}${data.schemeID}`) ;
          //   handleDataChange(
          //       {
          //           ...obj,
          //           qtyLimit: res.qtyLimit,
          //           freeQty: res.freeQty,
          //           schemeID:data.schemeID

          //       } as FOCSchemeData
          //   )
          // }}
        />
     
          <ERPInput
            {...getFieldProps("qtyLimit")}
            label={t("qty")}
            type="number"
        
            onChangeData={(data: any) =>
              handleFieldChange("qtyLimit", parseFloat(data.qtyLimit))
            }
          />

       <ERPDataCombobox
          {...getFieldProps("unitID")}
          field={{
            id: "unitID",
            getListUrl: Urls.select_quantity_schemes_for_combo,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("unit_id")}
          // onChangeData={async(data: any) => {
          //   const obj = getFieldProps("*")
          //   const res = await api.getAsync(`${Urls.select_scheme_qty_details_by_id}${data.schemeID}`) ;
          //   handleDataChange(
          //       {
          //           ...obj,
          //           qtyLimit: res.qtyLimit,
          //           freeQty: res.freeQty,
          //           schemeID:data.schemeID

          //       } as FOCSchemeData
          //   )
          // }}
        />

          
        </div>
        <h6>{t("free_product_details")}</h6>
        <div className="grid grid-cols-4 gap-4">

          <ERPInput
            {...getFieldProps("freeItemBarcode")}
            label={t("freeItemBarcode")}
            onChangeData={(data: any) =>
              handleFieldChange("freeItemBarcode", data.freeItemBarcode)
            }
          />

            
        <ERPDataCombobox
          {...getFieldProps("freeProductName")}
          field={{
            id: "freeProductName",
            getListUrl: Urls.select_quantity_schemes_for_combo,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("free_product_name")}
          // onChangeData={async(data: any) => {
          //   const obj = getFieldProps("*")
          //   const res = await api.getAsync(`${Urls.select_scheme_qty_details_by_id}${data.schemeID}`) ;
          //   handleDataChange(
          //       {
          //           ...obj,
          //           qtyLimit: res.qtyLimit,
          //           freeQty: res.freeQty,
          //           schemeID:data.schemeID

          //       } as FOCSchemeData
          //   )
          // }}
        />
         <ERPInput
             {...getFieldProps("freeQty")}
            label={t("qty")}
            type="number"
          
            onChangeData={(data: any) =>
              handleFieldChange("freeQty", parseFloat(data.freeQty))
            }
           />
  
            <ERPDataCombobox
          {...getFieldProps("freeUnitID")}
          field={{
            id: "freeUnitID",
            getListUrl: Urls.select_quantity_schemes_for_combo,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("unit_id")}
          // onChangeData={async(data: any) => {
          //   const obj = getFieldProps("*")
          //   const res = await api.getAsync(`${Urls.select_scheme_qty_details_by_id}${data.schemeID}`) ;
          //   handleDataChange(
          //       {
          //           ...obj,
          //           qtyLimit: res.qtyLimit,
          //           freeQty: res.freeQty,
          //           schemeID:data.schemeID

          //       } as FOCSchemeData
          //   )
          // }}
        />
        </div>
      </div>
      <div className="w-full modal-content flex flex-col gap-4">
       

        <div className="flex justify-end gap-4 mt-4">
          <ERPButton title={t("add")} variant="secondary" onClick={handleAdd} />
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


            <Column dataField="barCode" width={100} caption={t("barcode")} />
           <Column dataField="ProductName" width={300} caption={t("name")} />
            <Column dataField="unitName" width={80} caption={t("unit")} />
            <Column dataField="qtyLimit" width={70} caption={t("qty")} />

            <Column dataField="freeItemBarcode" width={100} caption={t("free_barcode")} />
            <Column dataField="freeProductName" width={300} caption={t("free_item")} />        
            <Column dataField="unitName" width={80} caption={t("free_unit")} />
            <Column dataField="freeQty" width={70} caption={t("free_qty")} />
            

            
            <Column caption="X" cellRender={renderDeleteCell} width={30} />
          </DataGrid>
        </div>

      </div>
    </>
  );
};

export default MultiFOCScheme;
