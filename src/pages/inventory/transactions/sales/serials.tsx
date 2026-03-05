import React, { useState, useEffect, useRef, useCallback } from "react";
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
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";

const api = new APIClient();
interface SerialItem {
  slNo: number;
  serial: string;
  id?: string;
}

interface SerialsProps {
  isOpen: boolean;
  data: string;
  productId: number | null;
  onClose: () => void;
  rowIndex: number;
  t: (key: string) => string;
  productName: string;
}

const Serials: React.FC<SerialsProps> = ({ data, isOpen, productId, onClose, rowIndex, t,productName}) => {
  const [serialData, setSerialData] = useState<SerialItem[]>([{ slNo: 1, serial: "" },]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const dataGridRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [skipAndContinue, setSkipAndContinue] = useState(false);

  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.InventoryTransaction);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Get the qty value from the row
      const rowQty = formState.transaction.details[rowIndex]?.qty || 1;

      if (data && data !== "") {
        const formattedData = data
          .split(",")
          .map((serial: string, index: number) => ({
            slNo: index + 1,
            serial: serial.trim() || "",
          }));
        setSerialData(formattedData);
      } else {
        // Create rows based on rowQty
        const initialRows = Array.from({ length: rowQty }, (_, i) => ({
          slNo: i + 1,
          serial: "",
        }));

        setSerialData(initialRows);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          if (dataGridRef.current) {
            dataGridRef.current.instance.editCell(0, 1);
          }
        }, 100);
      }
    }
  }, [isOpen, data, rowIndex, formState.transaction.details]);


  // Validate serial duplicates when skip true
  const validateSerials = (): boolean => {
    if (skipAndContinue) return true;
    const seen = new Map<string, number>();
    for (let i = 0; i < serialData.length; i++) {
      const serial = serialData[i]?.serial?.trim();
      if (!serial) continue;
      if (seen.has(serial)) {
        const firstRow = seen.get(serial)!;
        ERPAlert.show({
          title: t("warning"),
          text:t("product_serial_of") +" " +(firstRow + 1) +" " +t("and") +" " +(i + 1) +" " +t("are_equal_please_check_and_try_again"),
          showCancelButton: false,
        });
        return false;
      }
      seen.set(serial, i);
    }
    return true;
  };

  const handleSaveButtonClick = async () => {
    if(!validateSerials()) return;
    try {
      const validSerials = serialData.filter((item) => item.serial && item.serial.trim() !== "");
      const dataToSaveString = validSerials.map((item) => item.serial.trim()).join(",");
      const lt = validSerials.length;

      const slNo = formState.transaction.details[rowIndex].slNo;
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            serialNoEntryData: { visible: false, data: "", rowIndex: -1 },
            transaction: {
              details: [
                {
                  productDescription: dataToSaveString,
                  qty: lt,
                  slNo: slNo,
                },
              ],
            },
          },
          updateOnlyGivenDetailsColumns: true,
          rowIndex,
        })
      );
      onClose(); // Close modal on successful save
    } catch (error) {
      console.error("Error saving serials:", error);
      ERPAlert.show({
        title: t("error"),
        text: t("failed_to_save_serials"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const checkForDuplicate = useCallback((value: string, excludeIndex?: number) => {
    const normalized = value.trim().toUpperCase();
    const foundIndex = serialData.findIndex((item, index) => {
      if (excludeIndex !== undefined && index === excludeIndex) return false;
      return item.serial.trim().toUpperCase() === normalized;
    });
    return foundIndex;
    },
    [serialData]
  );

  const onEditorPreparing = (e: any) => {
    if (e.parentType === "dataRow" && e.dataField === "serial") {
      e.editorOptions.onValueChanged = async (args: any) => {
        const value = args.value ?? "";
        const rowIdx = e.row.rowIndex;

        try {
          const payload = {
            serial: String(value),
            oldInvTransMasterID:
              formState.transaction.master.invTransactionMasterID,
            voucherType: formState.transaction.master.voucherType,
            isEdit: formState.isEdit,
          };

          const response = await api.postAsync(
            `${Urls.inv_transaction_base}${formState.transactionType}/CheckSerial`,
            payload
          );

          if (response.isOk === false) {
            ERPAlert.show({
              title: t("warning"),
              text: t(response.message),
              showCancelButton: false,
            });
          }
        } catch (error) {
          console.error("CheckSerial API error:", error);
        }

        const dupIndex = checkForDuplicate(value, rowIdx);
        if (value.trim() !== "" && dupIndex !== -1) {
          ERPAlert.show({
            title: t("warning"),
            text:t("product_serial_exists_in_row") +" " +(dupIndex + 1) +". " +t("please_check_and_try_again"),
            showCancelButton: false,
          });

          // args.component.option("value", serialData[rowIdx]?.serial ?? "");
        }

        setSerialData((prev) => {
          const updated = [...prev];
          updated[rowIdx] = {
            ...updated[rowIdx],
            serial: value,
          };
          return updated;
        });
      };

      // CHECK AGAIN WHEN LEAVING CELL
      e.editorOptions.onFocusOut = (args: any) => {
        const value = args.component.option("value") ?? "";
        const rowIdx = e.row.rowIndex;

        const dupIndex = checkForDuplicate(value, rowIdx);

        if (value.trim() !== "" && dupIndex !== -1) {
          ERPAlert.show({
            title: t("warning"),
            text:t("product_serial_exists_in_row") +" " +(dupIndex + 1) +". " +t("please_check_and_try_again"),
            showCancelButton: false,
          });

          // args.component.option("value", serialData[rowIdx]?.serial ?? "");
        }
      };
    }
  };

  // const onContentReady = (e: any) => {
  //   // Only focus on initial load, not on every content ready
  //   if (serialData.length > 0 && dataGridRef.current && !isSaving) {
  //     const lastRowIndex = serialData.length - 1;
  //     const lastRowSerial = serialData[lastRowIndex]?.serial;
  //     // Only focus if the last row is empty
  //     if (!lastRowSerial || lastRowSerial.trim() === "") {
  //       if (timeoutRef.current) {
  //         clearTimeout(timeoutRef.current);
  //       }
  //       timeoutRef.current = setTimeout(() => {
  //         if (dataGridRef.current) {
  //           e.component.editCell(lastRowIndex, 1);
  //         }
  //       }, 50);
  //     }
  //   }
  // };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("serials")}
      width={200}
      height={430}
      content={
        <>
          <h6 className="text-blue-800 text-md font-bold text-center">{productName}</h6>
          <div className="w-full flex flex-col items-center gap-4 p-4">
            <DataGrid
              ref={dataGridRef}
              keyExpr="slNo"
              dataSource={serialData}
              // onContentReady={onContentReady}
              className="custom-data-grid-dark-only"
              focusedRowEnabled={false}
              showBorders={true}
              columnAutoWidth={true}
              rowAlternationEnabled={true}
              onEditorPreparing={onEditorPreparing}
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
                enterKeyAction={"moveFocus"}
                enterKeyDirection={"column"}
              />

              <Column
                dataField="slNo"
                caption={t("slNo")}
                width={50}
                allowEditing={false}
              />

              <Column
                dataField="serial"
                width={310}
                caption={t("serials")}
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
        <div className="absolute -bottom-0 h-[42px] pt-[4px] pb-[2px] left-0 w-full flex items-center justify-between dark:!border-dark-border dark:!bg-dark-bg bg-white border-t z-10 px-[10px] my-2 rounded-b-md">
        <ERPCheckbox
          id="skipAndContinue"
          label={t("skip_and_continue")}
          checked={skipAndContinue}
          onChange={(e: any) => {
            setSkipAndContinue(e.target.checked);
          }}
        />
        <div className="flex space-x-2">
          <ERPSubmitButton
            type="reset"
            onClick={onClose}
            className="max-w-[115px]"
            variant="secondary"
            disabled={isSaving}
          >
            {t("cancel")}
          </ERPSubmitButton>
          <ERPSubmitButton
            type="button"
            className="max-w-[115px]"
            variant="primary"
            onClick={handleSaveButtonClick}
            disabled={isSaving}
          >
            {t("save")}
          </ERPSubmitButton>
        </div>
      </div>
      }
      disableOutsideClickClose={false}
    />
  );
};

export default Serials;