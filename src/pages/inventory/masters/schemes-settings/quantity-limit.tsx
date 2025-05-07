import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import DataGrid, { Column, Editing, Paging, Scrolling } from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero } from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

const api = new APIClient();
export const initialQuantityLimit = {
    data: {
        sectionID: -2,
        section: "",
        productCategoryId: 0,
        productCategory: "",
        productGroupId: 0,
        productGroup: "",
        selectedOption: "department",
        barcode: "",
        quantityLimit: 0,
        itemData: []
    },
    validations: {
        department: "",
        category: "",
        productGroup: "",
        barcode: "",
        quantityLimit: ""
    }
};

export interface QuantityLimitData {
    id: number;
    selectedOption: string;
    department: string;
    category: string;
    productGroup: string;
    productGroupID:number;
    barcode: string;
    quantityLimit: number;
    itemData: any[];
}

export interface QuantityLimitItemData {
    id: number;
    sl: number;
    barcode: string;
    product: string;
    qtyLimit: number;
}

export const QuantityLimit: React.FC = () => {
    const { t } = useTranslation('inventory');
    const [gridData, setGridData] = useState<QuantityLimitItemData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    const {
        isEdit,
        handleSubmit,
        handleFieldChange,
        handleClear: clearForm,
        getFieldProps,
        isLoading,
        formState,
    } = useFormManager<QuantityLimitData>({
        initialData: initialQuantityLimit,
        useApiClient: true,
    });
   
    const handleOptionChange = (option: string) => {
        handleFieldChange("selectedOption", option);
    };

    const handleLoad = useCallback(async () => {
        const obj = getFieldProps("*");
debugger;
       let payload ={
             sectionID:isNullOrUndefinedOrZero(obj.sectionID)?-1: obj.sectionID, 
             productCategoryId:isNullOrUndefinedOrZero(obj.productCategoryId)?-1: obj.productCategoryId,
             productGroupId:isNullOrUndefinedOrZero(obj.productGroupId)?-1:obj.productGroupId ,
             barcode: isNullOrUndefinedOrEmpty(obj.barcode)?"": obj.barcode,
             isBarcode: isNullOrUndefinedOrEmpty(obj.barcode)? false : true ,
        }
        let queryString = Object.entries(payload)
  .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
  .join("&");
        try {
          setIsDataLoading(true);

        //   const response = await api.get(`${Urls.select_products_for_product_qty_limit}?${payload}`)
           const response = await api.getAsync(`${Urls.select_products_for_product_qty_limit}?${queryString}`)
          if (response) {
            const transformedData: QuantityLimitItemData[] = response.map(
              (item: any, index: number) => ({
                id: item.id || index + 1,
                sl: index + 1,
                barcode: item.barcode ,
                product: item.product ,
                qtyLimit: item.qtyLimit,
              })
            );
            setGridData(transformedData);
          } else {
            ERPAlert.show({
              title: "",
              icon: "info",
              text: "No data found for the provided input.",
            });
            setGridData([]);
          }
        } catch (error) {
          console.error(`Error fetching data for`, error);
          setGridData([]);
        } finally {
          setIsDataLoading(false);
        }
      }, [formState.data]);

    const handleClear = useCallback(() => {
        clearForm();
    }, [clearForm]);

    const handleClearAll = useCallback(() => {
        setGridData([]);
    }, []);

    const handleDelete = useCallback(() => {
        if (selectAll) {
            setGridData([]);
        }
    }, [selectAll]);

    const handleRemoveRow = useCallback((rowId: number) => {
        setGridData(prevData => prevData.filter(item => item.id !== rowId));
    }, []);

    const handleSave = useCallback(() => {
        console.log("Saving data:", gridData);
        // select_products_for_product_qty_limit
    }, [gridData]);

    const handleSelectAllToDelete = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(e.target.checked);
    }, []);

    const renderDeleteCell = (cellData: any) => {
        return (
            <div className="flex justify-center">
                <button className="text-[#ef4444] font-bold px-2" onClick={() => handleRemoveRow(cellData.data.id)}>X</button>
            </div>
        );
    };



    return (
        <div className="w-full modal-content flex flex-col gap-4">
            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 items-end gap-3">
                <div >
                    <ERPRadio
                        id="department"
                        name="limitOption"
                        label={t("department")}
                        checked={formState.data.selectedOption === "department"}
                        className="w-full"
                        onChange={() => handleOptionChange("department")}
                    />
                    <ERPDataCombobox
                        {...getFieldProps("sectionID")}
                        value={formState.data.department}
                        noLabel={true}
                        field={{
                            id: "sectionID",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl:Urls.data_sections
                        }}
                        disabled={formState.data.selectedOption !== "department"}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("sectionID", data.sectionID)}
                    />
                </div>

                <div>
                    <ERPRadio
                        id="category"
                        name="limitOption"
                        label={t("category")}
                        className="w-full"
                        checked={formState.data.selectedOption === "category"}
                        onChange={() => handleOptionChange("category")}
                    />
                    <ERPDataCombobox
                        {...getFieldProps("productCategoryId")}
                        value={formState.data.category}
                        noLabel={true}
                        field={{
                            id: "productCategoryId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl:Urls.data_productcategory
                        }}
                        disabled={formState.data.selectedOption !== "category"}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("productCategoryId", data.productCategoryId)}
                    />
                </div>

                <div>
                    <ERPRadio
                        id="productGroup"
                        name="limitOption"
                        label={t("product_group")}
                        className="w-full"
                        checked={formState.data.selectedOption === "productGroup"}
                        onChange={() => handleOptionChange("productGroup")}
                    />
                    <ERPDataCombobox
                        {...getFieldProps("productGroupId")}
                        value={formState.data.productGroup}
                        noLabel={true}
                        field={{
                            id: "productGroupId",
                            valueKey: "id",
                            labelKey: "name",
                            getListUrl: Urls.data_productgroup
                        }}
                        disabled={formState.data.selectedOption !== "productGroup"}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("productGroupId", data.productGroupId)}
                    />
                </div>

                <div>
                    <ERPRadio
                        id="barcode"
                        name="barcode"
                        label={t("barcode")}
                        className="w-full"
                        checked={formState.data.selectedOption === "barcode"}
                        onChange={() => handleOptionChange("barcode")}
                    />
                    <ERPInput
                        {...getFieldProps("barcode")}
                        value={formState.data.barcode}
                        noLabel={true}
                        disabled={formState.data.selectedOption !== "barcode"}
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
                    />
                </div>

                <div>
                    <ERPInput
                        name="quantityLimit"
                        {...getFieldProps("quantityLimit")}
                        value={formState.data.quantityLimit}
                        label={t("quantity_limit")}
                        type="number"
                        className="w-full"
                        onChangeData={(data: any) => handleFieldChange("quantityLimit", parseInt(data.quantityLimit))}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <ERPButton
                    title={t("delete")}
                    variant="primary"
                    onClick={handleDelete}
                />
                  <ERPButton
                    title={t("load")}
                    variant="primary"
                    onClick={handleLoad}
                />
                <ERPButton
                    title={t("save")}
                    variant="primary"
                    // onClick={handleAdd}
                />
                <ERPButton
                    title={t("clear")}
                    variant="primary"
                    onClick={handleClear}
                />
            </div>

            <div className="bg-white border border-gray-300 mt-4">
                <DataGrid
                    dataSource={gridData}
                    showBorders={true}
                    rowAlternationEnabled={true}
                    className="w-full">
                    <Paging defaultPageSize={30} />
                    <Scrolling mode="virtual"></Scrolling>
                    <Editing
                        mode="cell"
                        allowUpdating={true}
                        allowDeleting={false}
                        allowAdding={false}
                    />
                    <Column
                        caption={t("si")}
                        width={40}
                        cellRender={(data) => data.rowIndex + 1}
                    />
                    <Column
                        dataField="autoBarcode"
                        width={100}
                        caption={t("barcode")}
                    />
                    <Column
                        dataField="productBatchID"
                        width={100}
                        caption={t("productBatchID")}
                    />
                    <Column
                        dataField="productID"
                        width={100}
                        caption={t("productID")}
                    />
                    <Column
                        dataField="itemQtyLimitID"
                        width={100}
                        caption={t("itemQtyLimitID")}
                    />
                    <Column
                        dataField="productName"
                        width={200}
                        caption={t("product")}
                    />
                    <Column
                        dataField="qtyLimit"
                        width={80}
                        caption={t("qty_limit")}
                    />
                    <Column
                        caption={t("X")}
                        cellRender={renderDeleteCell}
                        width={40}
                    />
                </DataGrid>
            </div>

            {/* <div className="flex items-center mt-2">
                <ERPCheckbox
                    id="selectAll"
                    label={t("select_all_to_delete")}
                    checked={selectAll}
                    onChange={handleSelectAllToDelete}
                />
            </div> */}
        </div>
    );
};

export default QuantityLimit;