import React, { useState, useEffect, useRef, useCallback } from "react";
import { DataGrid } from "devextreme-react";
import { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling } from "devextreme-react/data-grid";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPSubmitButton from "../../../../components/ERPComponents/erp-submit-button";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

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

const Serials: React.FC<SerialsProps> = ({ data, isOpen, productId, onClose, rowIndex, t ,productName}) => {
  const [serialData, setSerialData] = useState<SerialItem[]>([{ slNo: 1, serial: '' }]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const dataGridRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    if (isOpen && data && data !== "") {
      const formattedData = data.split(',').map((serial: string, index: number) => ({
        slNo: index + 1,
        serial: serial.trim() || ''
      }));
      
      setSerialData(formattedData);
      
      // Focus on the last row with proper cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (dataGridRef.current && formattedData.length > 0) {
          dataGridRef.current.instance.editCell(formattedData.length - 1, 1);
        }
      }, 100);
    } else if (isOpen) {
      setSerialData([{ slNo: 1, serial: '' }]);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (dataGridRef.current) {
          dataGridRef.current.instance.editCell(0, 1);
        }
      }, 100);
    }
  }, [isOpen, data]);

  const handleSaveButtonClick = async () => {
    setIsSaving(true);
    try {
      const validSerials = serialData.filter(item => item.serial && item.serial.trim() !== '');
      const dataToSaveString = validSerials.map(item => item.serial.trim()).join(',');
      const lt = validSerials.length;

      const slNo = formState.transaction.details[rowIndex].slNo;
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            serialNoEntryData: { visible: false, data: "", rowIndex: -1 },
            transaction: {
              details: [{
                productDescription: dataToSaveString,
                qty: lt,
                slNo: slNo
              }]
            }
          },
          updateOnlyGivenDetailsColumns: true,
          rowIndex
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

  const checkForDuplicate = useCallback((value: string, excludeIndex?: number): boolean => {
    const normalizedValue = value.trim().toUpperCase();
    return serialData.some((item, index) => {
      if (excludeIndex !== undefined && index === excludeIndex) return false;
      return item.serial.trim().toUpperCase() === normalizedValue;
    });
  }, [serialData]);

  const onEditorPreparing = (e: any) => {
    if (e.parentType === 'dataRow' && e.dataField === 'serial') {
      const originalKeyDown = e.editorOptions.onKeyDown;
      e.editorOptions.onKeyDown = (event: any) => {
        if (originalKeyDown) {
          originalKeyDown(event);
        }
        
        if (["Enter", "ArrowUp", "ArrowDown"].includes(event.event.key) && event.component) {
          const currentValue = event.component.option('text');
          
          if (currentValue && currentValue.trim() !== '') {
            // Check for duplicates
            if (checkForDuplicate(currentValue, e.row.rowIndex)) {
              ERPAlert.show({
                title: t("warning"),
                text: t("duplicate_serial"),
              });
          event.event.preventDefault();
              return;
            }
            
            const rowIndex = e.row.rowIndex;
            const isLastRow = rowIndex === serialData.length - 1;
            
            // Update the current row's serial
            setSerialData(prevData => {
              const updatedData = [...prevData];
              updatedData[rowIndex] = { ...updatedData[rowIndex], serial: currentValue.trim() };
              
              // Add new row if this is the last row
              if (isLastRow && ["Enter", "ArrowDown"].includes(event.event.key)) {
                updatedData.push({ slNo: updatedData.length + 1, serial: '' });
              }
              
              return updatedData;
            });
            
            // Move to next row
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = setTimeout(() => {
              if (dataGridRef.current) {
                const nextRowIndex = isLastRow ? rowIndex + 1 : rowIndex + 1;
                dataGridRef.current.instance.editCell(nextRowIndex, 1);
              }
            }, 50);
          }
          
          event.event.preventDefault();
        }
      };
    }
  };

  const onContentReady = (e: any) => {
    // Only focus on initial load, not on every content ready
    if (serialData.length > 0 && dataGridRef.current && !isSaving) {
      const lastRowIndex = serialData.length - 1;
      const lastRowSerial = serialData[lastRowIndex]?.serial;
      
      // Only focus if the last row is empty
      if (!lastRowSerial || lastRowSerial.trim() === '') {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          if (dataGridRef.current) {
            e.component.editCell(lastRowIndex, 1);
          }
        }, 50);
      }
    }
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("serials")}
      width={200}
      height={430}
      content={
        <>
          <h6 className="text-blue-800 text-md font-bold">{productName}</h6>
          <div className="w-full flex flex-col gap-4 p-4">
            <DataGrid
              ref={dataGridRef}
              keyExpr="slNo"
              dataSource={serialData}
              onContentReady={onContentReady}
              className='custom-data-grid-dark-only'
              focusedRowEnabled={false}
              showBorders={true}
              columnAutoWidth={true}
              rowAlternationEnabled={true}
              onEditorPreparing={onEditorPreparing}
              repaintChangesOnly={true}
              height={220}
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
                caption={t("sl.no")}
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
          <ERPCheckbox
            id="skipAndContinue"
            label={t("skip_and_continue")}
          />
        </>
      }
      footer={
        <div className="absolute -bottom-0 h-[42px] pt-[4px] pb-[2px] left-0 w-full flex justify-end space-x-2 dark:!border-dark-border dark:!bg-dark-bg bg-white border-t z-10 pr-[10px] rounded-b-md">
          <ERPSubmitButton
            type="reset"
            onClick={onClose}
            className="dark:text-dark-hover-text w-28 bg-[#808080] text-[#404040] max-w-[115px]"
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
      }
      disableOutsideClickClose={false}
    />
  );
};

export default Serials;