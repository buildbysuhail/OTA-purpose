import React, { useState, useEffect, useRef, useCallback } from "react";
import { DataGrid } from "devextreme-react";
import { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling } from "devextreme-react/data-grid";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPSubmitButton from "../../../../components/ERPComponents/erp-submit-button";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { Trash2, Edit } from "lucide-react";


interface FlavoursItem {
  flavours: string;
  qty: number;
  id: number;
}

interface ImfProps {
  isOpen: boolean;
  data: string;
  productId: number | null;
  onClose: () => void;
  rowIndex: number;
  t: (key: string) => string;
}

const Flavours: React.FC<ImfProps> = ({ data, isOpen, productId, onClose, rowIndex, t, }) => {
  const [flavourData, setFlavourData] = useState<FlavoursItem[]>([]);
  const dataGridRef = useRef<any>(null);
  const [quantity, setQuantity] = useState<number>(0)
  const [flavoursFactors, setFlavoursFactors] = useState<FlavoursItem>({ flavours: "", qty: 0, id: 0,});
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.InventoryTransaction);

  const handleFieldChange = (field: keyof FlavoursItem, value: number | boolean ) => {
    setFlavoursFactors((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
   if(true){ //qtyDesc
      // const parts = qtyDesc.split('/ X |\/');
      // const parts = qtyDesc.split(/\s*X\s*|\s*\/\s*/).map(p => p.trim());
          setFlavoursFactors((prev) => ({
        ...prev,
        // flavours:(parts[0]),
        // qty: Number(parts[1]),
      }));
      // setIsEditMode(true)
    }
   }, [])

  const handleAddClick = () => {
    const newRow = {
      id: Date.now(),
      flavours: flavoursFactors.flavours,
      qty: flavoursFactors.qty,
    };

    setFlavourData(prev => [...prev, newRow]);
  };

     const handleDelete = (rowData: FlavoursItem) => {
        setFlavourData((prev) => {
          const newData = prev.filter((item) => item.id !== rowData.id);
          return newData.map((item, index) => ({ ...item, slNo: index + 1 }));
        });
      };

      // Need to update this function
  const handleApplyAll = () => {
    try {
    let description = "";
    let qty = 0

    for (let i = 0; i < flavourData.length; i++) {
      const row = flavourData[i];

      const itemFlavour = row?.flavours?.toString() ?? "";

      description += `${itemFlavour} - ${row.qty},`;
      qty = qty +row.qty;
    }

    // Set description
    dispatch(
      formStateHandleFieldChangeKeysOnly({
        fields: { transaction: { details: [{slNo:formState.imfData.rowIndex, productDescription: description.replace(/,$/, ""), qty: qty}] } },
      })
    );
    // close popup
    // closePopup();
  } catch (err) {
    // ignore
  }
    }
      // Or test submit
      // dispatch(
      //         formStateHandleFieldChangeKeysOnly({
      //           fields: {
      //             imfData: JSON.stringify({
      //               rowIndex: rowIndex,
      //               data: flavourData,
      //             }),
      //           },
      //         })
      //       );
      
      // onClose();
  // }

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("flavours")}
      content={
        <>
          <div className="flex flex-row gap-2 px-4 items-center justify-between">
            {/* This is dummy data comboBox, need to change by api end point */}
           <ERPDataCombobox
                // {...getFieldProps("flavours")}
                id="id"
                field={{
                id:"flavour",
                required: true,
                // getListUrl: `${Urls.product_flavours}${20797}`,// This is not the right api call // inventory/sales/ data/ flavors
                valueKey: "value",
                labelKey: "label",
                }}
                options={[
                  { value: 0, label: "red" },
                  { value: 1, label: "white" },
                  { value: 2, label: "black" },
                  { value: 3, label: "green" },
                ]}
                onChange={(data: any) => {
                handleFieldChange("flavours", data.label);
                }}
                label={t("flavour")}
                className="w-60"
                autoFocus={true}
            />
            <ERPInput
                id="qty"
                type="number"
                placeholder={t("qty")}
                required={true}
                onChange={(data: any) => { handleFieldChange("qty",data.target.value); }}
                width={40}
                value={flavoursFactors.qty}
            />
            <ERPButton
                type="button"
                className="primary"
                onClick={()=>handleAddClick()}
                title={t("add")}
            />

          </div>
          <div className="px-4 pt-2">{t("total")} : {quantity}</div>
          <div className="w-full flex flex-col gap-4 px-4 py-2">
            <DataGrid
              ref={dataGridRef}
              keyExpr="id"
              dataSource={flavourData}
              className='custom-data-grid-dark-only'
              focusedRowEnabled={false}
              showBorders={true}
              columnAutoWidth={true}
              rowAlternationEnabled={true}
              repaintChangesOnly={true}
              height={300}
            >
              <Column
                dataField="flavours"
                caption={t("flavours")}
                width={250}
              />

              <Column
                dataField="qty"
                width={150}
                caption={t("qty")}
              />
              <Column
                dataField="action"
                width={70}
                caption={t("action")}
                allowEditing={true}
                cellRender={(cellData) => (
                <button
                  onClick={() => handleDelete(cellData.data)}
                  className="p-1 text-red-600 hover:text-red-800"
                ><Trash2 size={16} /></button>
                )}
              />

              <Paging pageSize={100} />
              <Scrolling mode="standard" />
              <RemoteOperations
                filtering={false}
                sorting={false}
                paging={false}
              />
            </DataGrid>
          </div>

        </>
      }
      footer={
        <div className="flex justify-end">
          <ERPSubmitButton
            type="button"
            className="max-w-[115px]"
            variant="primary"
            onClick={handleApplyAll}
          >
            {t("apply_all")}
          </ERPSubmitButton>
        </div>
      }
      width={500}
      height={500}
      disableOutsideClickClose={false}
    />
  );
};

export default Flavours;