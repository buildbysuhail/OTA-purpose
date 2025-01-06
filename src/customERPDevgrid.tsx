import React, { useEffect, useState } from 'react';
import DataGrid, { 
  Column,
  Paging,
  Pager,
  FilterRow,
  HeaderFilter,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  Item
} from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import CustomStore from 'devextreme/data/custom_store';
import axios from 'axios';

interface ErpDevGridProps {
  columns: any[];
  gridHeader: string;
  dataUrl: string;
  gridId: string;
  popupAction?: any;
  gridAddButtonType?: string;
  changeReload?: (reload: boolean) => void;
  reload?: boolean;
  gridAddButtonIcon?: string;
  pageSize?: number;
}

const CustomErpDevGrid: React.FC<ErpDevGridProps> = ({
  columns,
  gridHeader,
  dataUrl,
  gridId,
  popupAction,
  gridAddButtonType,
  changeReload,
  reload,
  gridAddButtonIcon,
  pageSize = 10
}) => {
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataGridInstance, setDataGridInstance] = useState<any>(null);

  const store = new CustomStore({
    key: 'id',
    load: async (loadOptions: any) => {
      try {
        const response = await axios.get(dataUrl);
        const responseData = response.data.data || response.data;
        const totalCount = Array.isArray(responseData) ? responseData.length : 0;
        setTotalRowCount(totalCount);
        return {
          data: responseData,
          totalCount: totalCount
        };
      } catch (error) {
        console.error('Error loading data:', error);
        return {
          data: [],
          totalCount: 0
        };
      } finally {
        setIsLoading(false);
      }
    }
  });

  useEffect(() => {
    if (reload) {
      store.load();
      changeReload && changeReload(false);
    }
  }, [reload]);

  const handleAddNew = () => {
    if (popupAction) {
      popupAction({ isOpen: true, key: null, reload: false });
    }
  };

  const onGridReady = (e: any) => {
    setDataGridInstance(e.component);
    setTotalRowCount(e.component.totalCount());
  };

  const onOptionChanged = (e: any) => {
    if (e.fullName === 'dataSource' && dataGridInstance) {
      setTotalRowCount(dataGridInstance.totalCount());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{gridHeader}</h2>
          {gridAddButtonType === 'popup' && (
            <Button
              icon={gridAddButtonIcon}
              text="Add New"
              onClick={handleAddNew}
              className="bg-blue-500 text-white"
            />
          )}
        </div>
        
        <DataGrid
          id={gridId}
          dataSource={store}
          showBorders={true}
          remoteOperations={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          onInitialized={onGridReady}
          onOptionChanged={onOptionChanged}
        >
          <Selection mode="single" />
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} />
          <Export enabled={true} />
          <Paging defaultPageSize={pageSize} />
          <Pager
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
          />
          <Toolbar>
            <Item name="searchPanel" />
            <Item name="exportButton" />
          </Toolbar>

          {columns.map((column) => (
            <Column
              key={column.dataField}
              {...column}
            />
          ))}
        </DataGrid>

        {/* Total Records Display */}
        <div className="mt-4 p-3 bg-gray rounded-md border border-gray">
          <span className="text-gray font-semibold">Total Records: </span>
          <span className="text-gray">{totalRowCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomErpDevGrid;