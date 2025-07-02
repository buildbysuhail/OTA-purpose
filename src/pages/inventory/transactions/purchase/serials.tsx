import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "devextreme-react";
import { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling } from "devextreme-react/data-grid";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPSubmitButton from "../../../../components/ERPComponents/erp-submit-button";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";

interface SerialItem {
  slNo: number;
  serial: string;
  id?: string;
}

interface SerialsProps {
  isOpen: boolean;
  productId: number | null;
  onClose: () => void;
  api: APIClient;
  t: (key: string) => string;
}

const Serials: React.FC<SerialsProps> = ({ isOpen, productId, onClose, api, t }) => {
  const [serialData, setSerialData] = useState<SerialItem[]>([{ slNo: 1, serial: '' }]);
  const [focusCell, setFocusCell] = useState<{ rowIndex: number, colIndex: number } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const dataGridRef = useRef<any>(null);

  const fetchSerialData = async () => {
    try {
      if (!productId) {
        setSerialData([{ slNo: 1, serial: '' }]);
        setTimeout(() => setFocusCell({ rowIndex: 0, colIndex: 1 }), 100);
        return;
      }

      const response = await api.getAsync(`${Urls.products}GetSerials/${productId}`);
      handleResponse(response);

      const formattedData = response?.map((serial: string, index: number) => ({
        slNo: index + 1,
        serial: serial || '',
        id: `${productId}_${index}` 
      })) || [];

      formattedData.push({
        slNo: formattedData.length + 1,
        serial: ''
      });

      setSerialData(formattedData);

      const lastEmptyRowIndex = formattedData.length - 1;
      setTimeout(() => setFocusCell({ rowIndex: lastEmptyRowIndex, colIndex: 1 }), 100);
    } catch (error) {
      console.error("Error fetching serial data:", error);
      setSerialData([{ slNo: 1, serial: '' }]);
      setTimeout(() => setFocusCell({ rowIndex: 0, colIndex: 1 }), 100);
    }
  };

  useEffect(() => {
    if (isOpen && productId) {
      fetchSerialData();
    } else if (isOpen) {
      setSerialData([{ slNo: 1, serial: '' }]);
      setTimeout(() => setFocusCell({ rowIndex: 0, colIndex: 1 }), 100);
    }
  }, [isOpen, productId]);

  const handleSaveButtonClick = async () => {
    if (!productId) {
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = serialData
        .filter(item => item.serial && item.serial.trim() !== '')
        .map(item => item.serial);

      if (dataToSave.length > 0) {
        const response = await api.post(`${Urls.products}AddSerials`, {
          productID: productId,
          serials: dataToSave,
        });

        handleResponse(response, () => {
          onClose();
        });
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error saving serials:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onEditorPreparing = (e: any) => {
    if (e.parentType === 'dataRow' && e.dataField === 'serial') {
      const originalKeyDown = e.editorOptions.onKeyDown;
      e.editorOptions.onKeyDown = (event: any) => {
        if (originalKeyDown) {
          originalKeyDown(event);
        }
        if (event.event.key === 'Enter' && event.component) {
          const currentValue = event.component.option('text');
          if (currentValue && currentValue.trim() !== '') {
            const rowIndex = e.row.rowIndex;
            const isLastRow = rowIndex === serialData.length - 1;
            if (isLastRow) {
              const updatedData = [...serialData];
              updatedData[rowIndex].serial = currentValue;
              updatedData.push({ slNo: serialData.length + 1, serial: '' });
              setSerialData(updatedData);
              setFocusCell({ rowIndex: rowIndex + 1, colIndex: 1 });
            } else {
              setFocusCell({ rowIndex: rowIndex + 1, colIndex: 1 });
            }
            event.event.preventDefault();
          }
        }
      };
    }
  };

  const onContentReady = (e: any) => {
    if (focusCell) {
      const grid = e.component;
      try {
        grid.focus(grid.getCellElement(focusCell.rowIndex, focusCell.colIndex));
        grid.editCell(focusCell.rowIndex, 'serial');
        setTimeout(() => {
          const cell = grid.getCellElement(focusCell.rowIndex, focusCell.colIndex);
          if (cell) {
            const input = cell.querySelector('input');
            if (input) {
              input.focus();
              input.select();
            }
          }
        }, 50);
      } catch (err) {
        console.error("Error focusing cell:", err);
      }
      setFocusCell(null);
    }
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("serials")}
      content={
        <>
          <div className="w-full flex flex-col gap-4 p-4">
            <DataGrid
              ref={dataGridRef}
              dataSource={serialData}
              className='custom-data-grid-dark-only'
              showBorders={true}
              columnAutoWidth={true}
              rowAlternationEnabled={true}
              onEditorPreparing={onEditorPreparing}
              onContentReady={onContentReady}
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
                dataField="slNo"
                caption={t("sl.no")}
                width={50}
                allowEditing={false}
              />

              <Column
                dataField="serial"
                width={170}
                caption={t("serials")}
                allowEditing={true}
              />

              <Paging
                pageSize={100}
              />

              <Scrolling
                mode="standard"
              />

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
            disabled={isSaving || !productId}
          >
            {t("save")}
          </ERPSubmitButton>
        </div>
      }
      width={300}
      height={470}
      disableOutsideClickClose={false}
    />
  );
};

export default Serials;