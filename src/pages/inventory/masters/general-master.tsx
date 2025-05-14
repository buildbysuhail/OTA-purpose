import React, { useState, useEffect, useRef } from 'react';
import DataGrid, { Column, KeyboardNavigation, Editing } from 'devextreme-react/data-grid';
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from '../../../redux/urls';
import axios from 'axios';
import ERPButton from '../../../components/ERPComponents/erp-button';
import { APIClient } from '../../../helpers/api-client';

interface MasterItem {
  sino: number;
  description: string;
  id?: string;
  masterType?: string;
}

const api = new APIClient();
const GeneralMaster: React.FC = () => {
  const [masterType, setMasterType] = useState<string>("");
  const [masterData, setMasterData] = useState<MasterItem[]>([{ sino: 1, description: '' }]);
  const [focusCell, setFocusCell] = useState<{ rowIndex: number, colIndex: number } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const dataGridRef = useRef<any>(null);

  const fetchMasterData = async (type: string) => {
    try {
      if (!type) {
        setMasterData([{ sino: 1, description: '' }]);
        return;
      }

      const response = await api.getAsync(`${Urls.generalMaster}?masterType=${type}`);
      const formattedData = response?.map((item: any, index: number) => ({
        sino: index + 1,
        description: item.masterName || item.description,
        id: item.id,
        masterType: type
      }));

      formattedData.push({
        sino: formattedData.length + 1,
        description: ''
      });

      setMasterData(formattedData);
    } catch (error) {
      console.error("Error fetching master data:", error);
      setMasterData([{ sino: 1, description: '' }]);
    }
  };

  useEffect(() => {
    if (masterType) {
      fetchMasterData(masterType);
    }
  }, [masterType]);

  const handleSaveButtonClick = async () => {
    if (!masterType) {
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = masterData
        .filter(item => item.description && item.description.trim() !== '')
        .map(item => ({
          id: item.id,
          masterType: masterType,
          masterName: item.description
        }));

      if (dataToSave.length > 0) {
        await api.postAsync(Urls.generalMaster, dataToSave);
        // await fetchMasterData(masterType);
        setMasterType("");
        setMasterData([]);
      }
    } catch (error) { }
    finally {
      setIsSaving(false);
    }
  };


  const onEditorPreparing = (e: any) => {
    if (e.parentType === 'dataRow' && e.dataField === 'description') {
      const originalKeyDown = e.editorOptions.onKeyDown;
      e.editorOptions.onKeyDown = (event: any) => {
        if (originalKeyDown) {
          originalKeyDown(event);
        }
        if (event.event.key === 'Enter' && event.component) {
          const currentValue = event.component.option('text');
          if (currentValue && currentValue.trim() !== '') {
            const rowIndex = e.row.rowIndex;
            const isLastRow = rowIndex === masterData.length - 1;
            if (isLastRow) {
              const updatedData = [...masterData];
              updatedData[rowIndex].description = currentValue;
              updatedData.push({ sino: masterData.length + 1, description: '' });
              setMasterData(updatedData);
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
        grid.editCell(focusCell.rowIndex, 'description');
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
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex items-center'>
        <ERPDataCombobox
          id="masterType"
          value={masterType}
          label="Master Type"
          field={{
            id: "masterType",
            getListUrl: Urls.data_general_master,
            valueKey: "id",
            labelKey: "name",
          }}
          onChange={({ value }) => {
            setMasterType(value);
          }}
        />
      </div>

      <DataGrid
        ref={dataGridRef}
        dataSource={masterData}
        className='custom-data-grid-dark-only'
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        onEditorPreparing={onEditorPreparing}
        onContentReady={onContentReady}
        repaintChangesOnly={true}
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
          dataField="sino"
          caption="SI No"
          width={100}
          allowEditing={false}
        />
        <Column
          dataField="description"
          caption="Description"
          allowEditing={true}
        />
      </DataGrid>

      <div className='flex items-center justify-end'>
        <ERPButton
          title='save'
          variant='primary'
          onClick={handleSaveButtonClick}
          disabled={isSaving || !masterType}
        />
      </div>
    </div>
  );
};

export default GeneralMaster;