import React, { useState, useEffect, useRef } from 'react';
import DataGrid, { Column, KeyboardNavigation, Editing } from 'devextreme-react/data-grid';
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from '../../../redux/urls';
import axios from 'axios';

interface MasterItem {
  sino: number;
  description: string;
}

const GeneralMaster: React.FC = () => {
  const [masterType, setMasterType] = useState<string>("");
  const [masterData, setMasterData] = useState<any[]>([{ sino: 1, description: '' }]);
  const [focusCell, setFocusCell] = useState<{ rowIndex: number, colIndex: number } | null>(null);
  const dataGridRef = useRef<any>(null);

useEffect(() => {
  debugger;
  const fetchData = async () => {
    await fetchMasterData(masterType);
  };

  fetchData();
}, [masterType]);
  const fetchMasterData = async (type: string) => {
    try {
      const response = await axios.get(`${Urls.generalMaster}/${type}`);
      const formattedData = response.data.map((item: any, index: number) => ({
        sino: index + 1,
        masterType: type,
        masterName: item.id
      }));
      formattedData.push({ sino: formattedData.length + 1, description: '' });
      setMasterData(formattedData);
    } catch (error) {
      console.error("Error fetching master data:", error);
      setMasterData([{ sino: 1, description: '' }]);
    }
  };

  const handleSaveRow = async (e: any) => {
    if (e.changes && e.changes.length > 0) {
      const { type, data } = e.changes[0];
      if ((type === 'insert' || type === 'update') && data.description && data.description.trim() !== '') {
        try {
          await axios.post(Urls.generalMaster, [{
            masterType: masterType,
            masterName: data.description
          }]);
        } catch (error) {
          console.error("Error saving master data:", error);
        }
      }
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

  useEffect(() => {
    if (masterData.length === 0) {
      setMasterData([{ sino: 1, description: '' }]);
    }
  }, [masterData]);

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex items-center'>
        <ERPDataCombobox
          id="masterType"
          label="Master Type"
          field={{
            id: "masterType",
            getListUrl: Urls.data_general_master,
            valueKey: "id",
            labelKey: "name",
          }}
          onChange={(data: any) => {
            debugger;
            setMasterType(data.target.value)
          }}
        />
      </div>

      <DataGrid
        ref={dataGridRef}
        dataSource={masterData}
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        onSaved={handleSaveRow}
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
    </div>
  );
};

export default GeneralMaster;