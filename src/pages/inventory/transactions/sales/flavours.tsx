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

// This is dummy data need to set for floavours
const Flavours: React.FC<ImfProps> = ({ data, isOpen, productId, onClose, rowIndex, t, }) => {
  const [flavourData, setFlavourData] = useState<FlavoursItem[]>([{ id: 1,flavours: "test", qty: 3 }]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const dataGridRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [quantity, setQuantity] = useState<number>(0)

  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.InventoryTransaction);


  //dummy code need to set for thuis
  const handleApplyAll = () => {
    console.log("Clicked")
    dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            serialNoEntryData: { visible: false, data: "", SlNo: -1 },
            transaction: {
              details: [{
                // productDescription: dataToSaveString,
                // qty: lt,
                // slNo: slNo
              }]
            }
          },
          updateOnlyGivenDetailsColumns: true,
          rowIndex
        })
      );
      
      onClose(); // Close modal on successful save
  }



  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("flavours")}
      content={
        <>
          <div className="flex flex-row gap-2 px-4 items-center justify-between">
           <ERPDataCombobox
                // {...getFieldProps("flavours")}pCode
                id="id"
                field={{
                required: true,
                getListUrl: `${Urls.product_flavours}${10003}`,// nt this
                valueKey: "name",
                labelKey: "name",
                }}
                onChangeData={(data: any) => {
                 // handleFieldChange("faxNumber", data.faxNumber);
                }}
                label={t("flavour")}
                className="w-60"
                //  disabled={rootState.PopupData.parties.mode == "view"}
                //  fetching={formState?.loading !== false ? true : false}
            />
            <ERPInput
                id="qty"
                type="number"
                placeholder={t("qty")}
                required={true}
                // data={postDataEmail?.data}
                // onChangeData={(data: any) => { setPostDataEmail((prevData: any) => ({ ...prevData, data: data, })); }}
                // value={postDataEmail?.data?.newValue}
                onChange={(e:any)=> setQuantity(e.target.value)}
                width={40}
                value={quantity}
            />
            <ERPButton
                type="button"
                className="primary"
                // loading={isLoading}
                // onClick={onSubmit}
                title={t("add")}
            />

          </div>
          <div className="px-4 pt-2">{t("total")} : {quantity}</div>
          <div className="w-full flex flex-col gap-4 px-4 py-2">
            <DataGrid
              ref={dataGridRef}
              keyExpr="id"
              dataSource={flavourData}
              //   onContentReady={onContentReady}
              className='custom-data-grid-dark-only'
              focusedRowEnabled={false}
              showBorders={true}
              columnAutoWidth={true}
              rowAlternationEnabled={true}
              //   onEditorPreparing={onEditorPreparing}
              repaintChangesOnly={true}
              height={300}
            >
              <Editing
                mode="cell"
                allowAdding={false}
                allowUpdating={true}
                selectTextOnEditStart={true}
              />

              <KeyboardNavigation
                editOnKeyPress={true}
                enterKeyAction={"moveFocus"}
                enterKeyDirection={"column"}
              />

              <Column
                dataField="flavours"
                caption={t("flavours")}
                width={200}
                allowEditing={false}
              />

              <Column
                dataField="qty"
                width={150}
                caption={t("qty")}
                allowEditing={true}
              />
              <Column
                dataField="action"
                width={150}
                caption={t("action")}
                allowEditing={true}
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
        <div className="absolute -bottom-0 h-[42px] pt-[4px] pb-[2px] left-0 w-full flex justify-end space-x-2 dark:!border-dark-border dark:!bg-dark-bg bg-white border-t z-10 pr-[10px] rounded-b-md">

          <ERPSubmitButton
            type="button"
            className="max-w-[115px]"
            variant="primary"
            onClick={handleApplyAll}
            disabled={isSaving}
          >
            {t("apply_all")}
          </ERPSubmitButton>
        </div>
      }
      width={550}
      height={500}
      disableOutsideClickClose={false}
    />
  );
};

export default Flavours;