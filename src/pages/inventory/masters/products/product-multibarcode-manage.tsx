import React, { useCallback, useState } from "react";
import Urls from "../../../../redux/urls";
import ErpInput from "../../../../components/ERPComponents/erp-input";
import ErpDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { useTranslation } from "react-i18next";
import { MultiBarcodeState } from "./products-manage";


interface ProductMultiBarcodeManageProps {
  multiBarcode: MultiBarcodeState;
  setMultiBarcode: React.Dispatch<React.SetStateAction<MultiBarcodeState>>;
}

export const ProductMultiBarcodeManage: React.FC<ProductMultiBarcodeManageProps> = React.memo(({multiBarcode,setMultiBarcode}) => {
  const { t } = useTranslation("inventory");
  const [formData,setFormData] = useState({
    unitID: 0,
    unit:"",
    barcode:""
  })
  const handleAdd = () => {
    if (!formData.unit || !formData.barcode) {
      // alert(t("Please fill all required fields."));
      return;
    }

    setMultiBarcode((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          unit: formData.unit,
          barcode: formData.barcode,
        },
      ],
    }));

    setFormData({
      unitID: 0,
      unit: "",
      barcode: "",
    });
  };
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
            customSize={"md"}
            className="w-full"
          />
        <ErpInput
          id="unitID"
          value={formData.barcode}
          label="barcode"
          onChange={(e)=>{
            setFormData((prev)=>({
              ...prev,
              barcode:e.target.value
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
      //  onClick={() =>}
      />
       
           
      </div>

      {/* <div className="w-full">
                                        <DataGrid
                                          dataSource={flavorsOpen.data}
                                          height={300}
                                          key="barcode"
                                          showBorders={true}
                                          showRowLines={true}
                                          // onFocusedCellChanging={onFocusedCellChanging}
                                          onEditorPrepared={(e) => {
                                            if (e.parentType === "dataRow") {
                                              const currentRowData = e.row?.data;
                                           
                                                e.editorElement.removeEventListener(
                                                  "keydown",
                                                  (e.editorElement as any)._onBarcodeKeyDown
                                                );
                        
                                                const barcodeKeyDownHandler = (
                                                  event: KeyboardEvent
                                                ) => {
                                                  if (event.key === "Enter") {
                                                    setFlavorsOpen((prev: any) => {
                                                      const newRow = { flavor: "" };
                                                      return { ...prev, data: [...prev.data, newRow] };
                                                    });
                                                  }
                                                };
                                                (e.editorElement as any)._onBarcodeKeyDown =
                                                  barcodeKeyDownHandler;
                                                e.editorElement.addEventListener(
                                                  "keydown",
                                                  barcodeKeyDownHandler
                                                );
                                              
                                            }
                                          }}
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
                                            dataField="productId"
                                            caption={t("si_no")}
                                            allowEditing={false}
                                            dataType="string"
                                            width={150}
                                          />
                        
                                          <Column
                                            dataField="flavor"
                                            caption={t("flavor")}
                                            dataType="string"
                                            allowEditing={true}
                                            minWidth={150}
                                          />
                        
                                          <Editing
                                            allowUpdating={true}
                                            allowAdding={false}
                                            allowDeleting={false}
                                            mode="cell"
                                          />
                                        </DataGrid>
                                      </div> */}
    </div>
  );
});