import React, { useCallback, useState } from "react";
import Urls from "../../../../redux/urls";
import ErpInput from "../../../../components/ERPComponents/erp-input";
import ErpDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { useTranslation } from "react-i18next";
import { MultiBarcodeState } from "./products-manage";
import { DataGrid } from "devextreme-react";
import { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling } from "devextreme-react/cjs/data-grid";
import { ProductUnitInputDto } from "./products-type";
import ERPFormButtons from "../../../../components/ERPComponents/erp-form-buttons";
import { APIClient } from "../../../../helpers/api-client";
import { handleResponse } from "../../../../utilities/HandleResponse";


interface ProductMultiBarcodeManageProps {
  multiBarcode: MultiBarcodeState;
  setMultiBarcode: React.Dispatch<React.SetStateAction<MultiBarcodeState>>;
  units: ProductUnitInputDto[];
}
const api = new APIClient();
export const ProductMultiBarcodeManage: React.FC<ProductMultiBarcodeManageProps> = React.memo(({multiBarcode,setMultiBarcode,units}) => {
  const { t } = useTranslation("inventory");
  const [loading,setLoading]=useState(false)
  const [formData,setFormData] = useState({
    unitID: 0,
    unit:"",
    barcodes:""
  })
  const handleAdd = () => {
    if (!formData.unit || !formData.barcodes) {
      alert(t("Please fill all required fields."));
      return;
    }
    setMultiBarcode((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          unitCode: formData.unit,
          barcodes: formData.barcodes,
          unitID:formData.unitID
        },
      ],
    }));

    setFormData({
      unitID: 0,
      unit: "",
      barcodes: "",
    });
  };

  const handleSubmit =async()=>{
    setLoading(true)
    try {
      console.log("multibarcode",multiBarcode);
      
      const response = await api.postAsync(Urls.productBarcode,multiBarcode);
      handleResponse(response,()=>{
        setMultiBarcode((prev)=>({
          open:false,
          data:[]
        }))
      })

    } catch (error) {
      console.error("Error loading flavors:", error);
    }
  finally{
    setLoading(false)
  }
  }

  const handleClear =()=>{

    setFormData({
      unitID: 0,
      unit: "",
      barcodes: "",
    });

    setMultiBarcode((prev)=>({
      ...prev,
      data:[]
    }))

  }
    // Map units to options for ERPDataCombobox
    const unitOptions = units.map((unit) => ({
      value: unit.unitID ?? 0,
      label: unit.unit ?? "",
    }));

    const handleRowUpdating = useCallback((e: any) => {
      const updatedData = { ...e.oldData, ...e.newData };
      setMultiBarcode((prev) => ({
        ...prev,
        data: prev.data.map((item, index) =>
          index === e.key ? updatedData : item
        ),
      }));
    }, [setMultiBarcode]);
  return (
    <div className="w-full modal-content">
      <div className="flex items-end justify-center gap-4">
         <ErpDataCombobox
              id="unitID"
              value={formData.unitID}
              label="unit"
              field={{
                id: "unitID",
                getListUrl: Urls.data_units,
                labelKey: "name",
                valueKey: "id",
              }}
            data={formData}
            onChange={(e) => {
              setFormData((prev)=>({
                ...prev,
                unitID: e.value,
                unit: e.name,
              }))
            }}
            // options={unitOptions}
            customSize={"md"}
            className="w-full"
          />
        <ErpInput
          id="unitID"
          value={formData.barcodes}
          label="barcodes"
          onChange={(e)=>{
            setFormData((prev)=>({
              ...prev,
              barcodes:e.target.value
            }))
          }}
          required={true} 
          customSize={"md"}
            className="w-full"
          />
      <ERPButton
       title="Add"
       variant="primary"
       startIcon="ri-add-line"
      className="h-[2rem]  w-20"
      onClick={handleAdd}
      />
       
           
      </div>

      <div className="w-full mt-4">
        <DataGrid
          dataSource={multiBarcode.data}
          height={300}
          key="multiBarcode"
          showBorders={true}
          showRowLines={true}
          // onFocusedCellChanging={onFocusedCellChanging}
          onRowUpdating={handleRowUpdating} 

        >
          <KeyboardNavigation
            editOnKeyPress={true}
            enterKeyAction={"moveFocus"}
            enterKeyDirection={"column"}
          />

          <Paging pageSize={100} />

          <Scrolling mode="standard" />

          <RemoteOperations
            filtering={false}
            sorting={false}
            paging={false}
          />

          <Column
            dataField="barcodes"
            caption={t("barcodes")}
            allowEditing={true}
            dataType="string"
            width={150}
          />
        <Column
            dataField="unitID"
            caption={t("unitID")}
            dataType="number"
            allowEditing={false}
            minWidth={150}
            visible={false}
          />
          <Column
            dataField="unitCode"
            caption={t("unit")}
            dataType="string"
            allowEditing={false}
            minWidth={150}
          />

          <Editing
            allowUpdating={true}
            allowAdding={false}
            allowDeleting={false}
            mode="cell"
          />
        </DataGrid>
      </div>
         <ERPFormButtons
              onClear={handleClear}
              isLoading={loading}
              onSubmit={handleSubmit}
        />
    </div>
  );
});