import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero } from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { lowerFirst } from "lodash";
import { handleResponse } from "../../../../utilities/HandleResponse";

const api = new APIClient();

export const initialQuantitySlab = {
    data: {
        qtySlabID: 0,
        productName: "",
        productID:null,
        type: "Perc",
        value: 0,
        qtyFrom: 0,
        qtyTo: 0,
        branchID:null
    },
    validations: {
        ProductName: "",
        type: "",
        value: "",
        qtyFrom: "",
        qtyTo: ""
    }
};

export interface QuantitySlabData {
    branchID:number|null;
    qtySlabID: number;
    productName: string;
    productID:number | null;
    type: string;
    value: number;
    qtyFrom: number
    qtyTo: number;
}

export const QuantitySlabOffer: React.FC = () => {
    const { t } = useTranslation('inventory');
    const [gridData, setGridData] = useState<QuantitySlabData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [loadAllSlabs, setLoadAllSlabs] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const {
        isEdit,
        handleSubmit,
        handleFieldChange,
        handleClear: clearForm,
        getFieldProps,
        isLoading,
        formState,
    } = useFormManager<QuantitySlabData>({
        initialData: initialQuantitySlab,
        useApiClient: true,
    });
    

      // New function to fetch all LoadAllSlabs when LoadAllSlabs is checked
  const fetchLoadAllSlabs = useCallback(async () => {
    setIsDataLoading(true);
    try {
        const url = `${Urls.qty_slab_offer}`;
           const response = await api.getAsync(url); //url need to update Urls.quantity_slab_offer
      setGridData(response);
    } catch (error) {
      console.error("Error fetching LoadAllSlabs:", error);
      ERPAlert.show({
        title: "",
        icon: "error",
        text: "Failed to load LoadAllSlabs.",
      });
    } finally {
      setIsDataLoading(false);
    }
  }, []);

    const handleAdd = useCallback(() => {
   const formData = formState?.data ;
   console.log("slabform",formData);
   
        if(isNullOrUndefinedOrEmpty(formData.type)){
            ERPAlert.show({
                    title: "",
                    icon: "warning",
                    text: "Invalid Value Type. Please select Any of Amt or Percent",
                });
            return;
        }
        if(!isNullOrUndefinedOrZero(formData.qtyFrom)&& !isNullOrUndefinedOrZero(formData.qtyTo)
        && formData.qtyFrom <= formData.qtyTo
        ){
            if(!isNullOrUndefinedOrZero(formData.productID)){
                const newItem: QuantitySlabData = {

                    ...formData,
                    qtySlabID: gridData.length > 0 ? Math.max(...gridData.map(item => item.qtySlabID)) + 1 : 1
                };
                setGridData(prevData => [...prevData, newItem]);
                clearForm();
            }
            else{
                ERPAlert.show({
                    title: "",
                    icon: "warning",
                    text: "Invalid Item",
                });
            return;  
            }
       
        }else{
            ERPAlert.show({
                title: "",
                icon: "warning",
                text: "Invalid Qty Range",
            });
        return; 
        }
     
    }, [formState.data, gridData]);

    const handleClear = useCallback(() => {
        setGridData([]);
        setLoadAllSlabs(false)
        clearForm();
    }, [clearForm,gridData]);

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
            const payload: Partial<QuantitySlabData> [] = gridData.map(item => ({
                branchID: item.branchID ?? 0, // Default to 0 for manual data
                productID: item.productID,
                type: item.type,
                value: item.value,
                qtyFrom: item.qtyFrom,
                qtyTo: item.qtyTo,
            }));
            const response = await api.post(Urls.qty_slab_offer, payload);
            handleResponse(response, () =>   handleClear());
        }catch(error){
            console.error("Error saving data:", error);
        }
    }, [gridData]);

;

    const handleDelete = useCallback(async () => {
        if (selectedRows.length === 0){
            ERPAlert.show({
                title: "",
                icon: "warning",
                text: "Please Select a row to remove",
              });
              return;
        }
    
        try {
          
            const selectedItems = gridData.filter(item => selectedRows.includes(item.qtySlabID));

            const payload = selectedItems.map(item => ({
                productID: item.productID ,
                qtySlabID: item.qtySlabID,
                branchID: item.branchID ?? 0, 
            }));
    

            const response = await api.delete(Urls.qty_slab_offer, {data:payload});
            handleResponse(response, () => {
                fetchLoadAllSlabs()
                setSelectedRows([]);
            });
        } catch (error) {
            console.error("Error deleting items:", error);
        }
    }, [selectedRows, gridData]);

    const handleRemoveRow = useCallback((rowData: any) => {
        ERPAlert.show({
            title: "",
            icon: "warning",
            text: "Are you sure you want to delete this row?",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                try {
                    const isManualData = rowData.branchID === null || rowData.branchID === 0;
                    if (isManualData) {
                        setGridData(prevData => prevData.filter(item => item.qtySlabID !== rowData.qtySlabID));
                    } else {
                        const payload = [{
                            productID: rowData.productID,
                            qtySlabID: rowData.qtySlabID,
                            branchID: rowData.branchID ?? 0,
                        }];

                        const response = await api.delete(Urls.qty_slab_offer, { data: payload });
                        handleResponse(response, () => {
                            fetchLoadAllSlabs();
                        });
                    }
                } catch (error) {
                    console.error("Error deleting row:", error);
                }
            },
            onCancel: () => {
                console.log("Deletion cancelled for row:", rowData.qtySlabID);
            },
        });
    }, []);

    const handleRowSelection = useCallback((rowId: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedRows(prev => [...prev, rowId]);
        } else {
            setSelectedRows(prev => prev.filter(id => id !== rowId));
        }
    }, []);

    const renderDeleteCell = (cellData: any) => {
        return (
            <div className="text-center">
                <button className="text-[#ef4444] font-bold px-2" onClick={() => handleRemoveRow(cellData.data)}>X</button>
            </div>
        );
    };

    const renderSelectionCell = (cellData: any) => {
        const { qtySlabID, branchID } = cellData.data;
        const isManualData = branchID === null || branchID === 0;
    
        if (isManualData) {
            return (
                <div className="flex justify-center items-center h-full">
                    <span>{qtySlabID}</span>
                </div>
            );
        }
    
        const isSelected = selectedRows.includes(qtySlabID);
        return (
            <div className="flex justify-center items-center h-full">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleRowSelection(qtySlabID, e.target.checked)}
                />
            </div>
        );
    };
    
  useEffect(() => {
    if (loadAllSlabs) {
      fetchLoadAllSlabs();
    } else {
      setGridData([]);
    }
  }, [loadAllSlabs]);
    return (
        <div className="w-full modal-content flex flex-col gap-4">
            <div className="flex justify-end mb-2">
                <ERPCheckbox
                    checked={loadAllSlabs}
                    onChange={(e) => setLoadAllSlabs(e.target.checked)}
                    label={t("load_all_qty_slab_offer")}
                    id={""}
                />
            </div>

            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 items-end gap-3">
                <ERPDataCombobox
                    {...getFieldProps("productID")}
                    label={t("item_name")}
                    field={{
                        id: "productID",
                        getListUrl: Urls.data_productgroup,
                        valueKey: "id",
                        labelKey: "name",
                        required: true
                    }}
                    onChange={(data: any) => handleFieldChange({ 
                        productID:data.value,
                        productName:data.name,
                       })}
                    disabled={loadAllSlabs}
                />

                <ERPDataCombobox
                    {...getFieldProps("type")}
                    field={{
                        id: "type",
                        valueKey: "value",
                        labelKey: "label",
                    }}
                    onChangeData={(data: any) =>
                        handleFieldChange("type", data.type)
                    }
                    label={t("type")}
                    enableClearOption={false}
                    initialValue={formState.data.type}
                    options={[
                        { value: "Amt", label: t("amt") },
                        { value: "Perc", label: t("perc") },
                    ]}
                    disabled={loadAllSlabs}
                />

                <ERPInput
                    {...getFieldProps("value")}
                    label={t("value")}
                    type="number"
                    disabled={loadAllSlabs}
                    onChangeData={(data: any) => handleFieldChange("value", parseFloat(data.value))}
                />

                <ERPInput
                    {...getFieldProps("qtyFrom")}
                    label={t("qty_from")}
                    type="number"
                    disabled={loadAllSlabs}
                    onChangeData={(data: any) => handleFieldChange("qtyFrom", parseFloat(data.qtyFrom))}
                />

                <ERPInput
                    {...getFieldProps("qtyTo")}
                    label={t("qty_to")}
                    type="number"
                    disabled={loadAllSlabs}
                    onChangeData={(data: any) => handleFieldChange("qtyTo", parseFloat(data.qtyTo))}
                />
            </div>

            <div className="flex justify-end">
                <ERPButton
                    disabled={loadAllSlabs}
                    title={t("add")}
                    variant="primary"
                    onClick={handleAdd}
                />
            </div>

            <div>
                <DataGrid
                    dataSource={gridData}
                    showBorders={true}
                    rowAlternationEnabled={true}
                    className="w-full">
                    <Paging defaultPageSize={10} />
                    <Editing
                        mode="cell"
                        allowUpdating={true}
                        allowDeleting={false}
                        allowAdding={false}
                    />
                    <Column
                        caption={t("si")}
                        cellRender={renderSelectionCell}
                        width={40}
                    />
                    <Column
                        caption={t("clear")}
                        width={60}
                    />
                    <Column
                        dataField="productName"
                        width={350}
                        caption={t("product")}
                    />
                    <Column
                        dataField="type"
                        width={100}
                        caption={t("amt_perc")}
                    />
                    <Column
                        dataField="value"
                        width={100}
                        caption={t("value")}
                    />
                    <Column
                        dataField="qtyFrom"
                        width={100}
                        caption={t("qty_from")}
                    />
                    <Column
                        dataField="qtyTo"
                        width={100}
                        caption={t("qty_to")}
                    />
                    <Column
                        caption={t("X")}
                        cellRender={renderDeleteCell}
                        width={40}
                    />
                </DataGrid>
            </div>

            <div className="flex flex-row max-md:flex-col items-center mt-2">
                <p className="text-[#F87171] text-sm font-medium mr-auto">{t("this_offer_price_is_only_applicable_on_standard_price")}</p>
                <div className="flex items-center">
               
                    <div className="flex gap-2 ml-4">
                        <ERPButton
                            title={t("delete")}
                            onClick={handleDelete}
                            disabled={!loadAllSlabs && selectedRows.length === 0}
                        />
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

export default QuantitySlabOffer;