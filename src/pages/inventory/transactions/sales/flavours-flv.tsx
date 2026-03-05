import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  KeyboardNavigation,
  Paging,
  RemoteOperations,
  Scrolling,
} from "devextreme-react/data-grid";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPSubmitButton from "../../../../components/ERPComponents/erp-submit-button";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";

interface FlavourRow {
  slNo: number;
  flavour: string;
  qty: number | null;
}

interface FlavourProps {
    data: string;
  isOpen: boolean;
  productId: number | null;
  onClose: () => void;
  rowIndex: number;
  t: (key: string) => string;
  productName: string;
}

const api = new APIClient();

const FlavoursFlv: React.FC<FlavourProps> = ({
  data,
  isOpen,
  productId,
  onClose,
  t,
  productName,
  rowIndex
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [flavourData, setFlavourData] = useState<FlavourRow[]>([]);
  const dataGridRef = useRef<any>(null);
  const dispatch = useDispatch();

  const formState = useSelector(
    (state: RootState) => state.InventoryTransaction
  );

  useEffect(() => {
    if (!productId) return;

    const loadFlavours = async () => {
      try {
        const response = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/ProductFlavors/${productId}`);
        const formatted: FlavourRow[] = response.map(
          (item: string, index: number) => ({
            slNo: index + 1,
            flavour: item,
            qty: null,
          })
        );

        setFlavourData(formatted);
      } catch (error) {
        console.error("Error loading flavours:", error);
      }
    };

    loadFlavours();
  }, [productId]);

  // Handle Qty Edit
  const handleCellValueChanged = (e: any) => {
    if (e.dataField === "qty" && e.parentType === "dataRow") {
      const defaultOnValueChanged = e.editorOptions.onValueChanged;

      e.editorOptions.onValueChanged = (args: any) => {
        defaultOnValueChanged?.(args);

        setFlavourData((prev) =>
          prev.map((row) =>
            row.slNo === e.row.data.slNo
              ? { ...row, qty: args.value }
              : row
          )
        );
      };
    }
  };

  // Save
  const handleSaveButtonClick = async () => {
    if (flavourData && flavourData.length > 0) {
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                flavoursSelectedData: JSON.stringify({
                  rowIndex: rowIndex,
                  data: flavourData,
                }),
              },
            })
          );
        }
    onClose();
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("flavours")}
      width={350}
      height={420}
      content={
        <div className="w-full flex items-center flex-col justify-center">
            <h6 className="text-center text-blue-800 text-md font-bold">
                {productName}
            </h6>

          <div className="w-full flex flex-col gap-4 p-4">
            <DataGrid
              ref={dataGridRef}
              keyExpr="slNo"
              dataSource={flavourData}
              onEditorPreparing={handleCellValueChanged}
              className="custom-data-grid-dark-only"
              focusedRowEnabled={false}
              showBorders={true}
              columnAutoWidth={true}
              rowAlternationEnabled={true}
              repaintChangesOnly={true}
              height={250}
            >
              <Editing
                mode="cell"
                allowAdding={false}
                allowUpdating={true}
                selectTextOnEditStart={true}
              />

              <KeyboardNavigation
                editOnKeyPress={true}
                enterKeyAction="moveFocus"
                enterKeyDirection="column"
              />

              <Column
                dataField="slNo"
                caption={t("slNo")}
                width={50}
                allowEditing={false}
              />

              <Column
                dataField="flavour"
                caption={t("flavour")}
                width={200}
                allowEditing={false}
              />

              <Column
                dataField="qty"
                caption={t("qty")}
                width={120}
                allowEditing={true}
                dataType="number"
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
        </div>
      }
      footer={
        <div className="absolute -bottom-0 h-[42px] pt-[4px] pb-[2px] left-0 w-full flex justify-end space-x-2 bg-white border-t z-10 pr-[10px] rounded-b-md">
          <ERPSubmitButton
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSaving}
            className="w-16"
          >
            {t("cancel")}
          </ERPSubmitButton>

          <ERPSubmitButton
            type="button"
            variant="primary"
            onClick={handleSaveButtonClick}
            disabled={isSaving}
            className="w-16"
          >
            {t("save")}
          </ERPSubmitButton>
        </div>
      }
    />
  );
};

export default FlavoursFlv;