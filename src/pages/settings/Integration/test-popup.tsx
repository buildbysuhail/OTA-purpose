import { FC, Fragment, useEffect, useState } from "react";
import { DataGrid, Toolbar } from "devextreme-react";
import {
  Column,
  Paging,
  Scrolling,
  DataGridTypes,
  ColumnFixing,
  LoadPanel,
  FilterRow,
  SearchPanel,
  Item,
  Summary,
  TotalItem,
} from "devextreme-react/cjs/data-grid";
import { TestData, TestDataItem } from "./testData";

const TestPopup: FC = () => {
  const [store, setStore] = useState<TestDataItem[]>(TestData);
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200;
    let gridHeightWindows = wh - 260;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);

  const calculateNetAdjustment = () => {
    return store.reduce((total, item) => total + (item.AmountToAssign || 0), 0);
  };

  const handleEditingStart = (e: any) => {
    if (e.column.dataField === "Select") {
      const updatedStore = [...store];
      const row = updatedStore[e.rowIndex];
  
      if (row) {  
        if (e.value) {
          row.AmountToAssign = row.Amount;
        } else {
          row.AmountToAssign = 0;
        }
  
        setStore(updatedStore);
      }
    }
  };
  //  ==========================================================================================
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <DataGrid
                  id="TestPopup"
                  height={gridHeight.windows}
                  dataSource={store}
                  className="custom-data-grid"
                  showBorders={true}
                  columnAutoWidth={true}
                  showColumnLines={false}
                  showRowLines={true}
                  allowColumnResizing={true}
                  allowColumnReordering={true}
                  onEditingStart={handleEditingStart} 
                  editing={{
                    allowUpdating: true,
                    mode: "cell", 
                    allowAdding: false,
                    allowDeleting: false,
                  }}
                >
                  <FilterRow visible={true} />
                  <SearchPanel visible={true} />
                  <ColumnFixing enabled={true} />
                  <Scrolling mode="standard" />
                  <Paging defaultPageSize={100} />
                  {/* <LoadPanel visible={true} /> */}

                  <Column
                    dataField="SiNo"
                    caption="SiNo"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={50}
                  />
                  <Column
                    dataField="Select"
                    caption="Select"
                    dataType="boolean"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="VrType"
                    caption="Voucher Type"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                  />
                  <Column
                    dataField="BillNo"
                    caption="Bill No"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="Date"
                    caption="Date"
                    dataType="date"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="Amount"
                    caption="Amount"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="AdjAmount"
                    caption="Adjusted Amount"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                  />
                  <Column
                    dataField="Balance"
                    caption="Balance"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="AmountToAssign"
                    caption="Amount to Assign"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                  />
                  <Column
                    dataField="BalanceAfter"
                    caption="Balance After"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={130}
                  />
                  <Column
                    dataField="PartyName"
                    caption="Party Name"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                  />
                  <Column
                    dataField="RefDate"
                    caption="Reference Date"
                    dataType="date"
                    allowFiltering={true}
                    allowSearch={true}
                    width={130}
                  />
                  <Column
                    dataField="AccTransDetailID"
                    caption="Account Transaction ID"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                    visible={false}
                  />
                  <Column
                    dataField="RafNo"
                    caption="Raf No"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                    visible={false}
                  />
                  <Column
                    dataField="FormType"
                    caption="Form Type"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                    visible={false}
                  />
                  <Column
                    dataField="FinancilaYearID"
                    caption="Financial Year ID"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                    visible={false}
                  />
                  <Column
                    dataField="VoucherPrefix"
                    caption="Voucher Prefix"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                    visible={false}
                  />
                  <Toolbar>
                    <Item name="searchPanel" />
                  </Toolbar>

                  {/* Add Summary for "Amount" column */}
                  <Summary>
                    <TotalItem
                      column="Amount"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                    <TotalItem
                      column="AdjAmount"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                    <TotalItem
                      column="Balance"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                    <TotalItem
                      column="AmountToAssign"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                    <TotalItem
                      column="BalanceAfter"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                  </Summary>
                </DataGrid>
              </div>
              <div className="flex justify-center items-center mt-4 p-4 bg-gray-100 rounded-md max-w-60">
                <strong className="mr-3">Net Adjustment </strong>
                <span className="">{store.reduce((total, item) => total + (item.AmountToAssign || 0), 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TestPopup;
