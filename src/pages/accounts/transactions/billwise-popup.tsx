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
  KeyboardNavigation,
} from "devextreme-react/cjs/data-grid";
import store from "devextreme/data/odata/store";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useDispatch } from "react-redux";
import { accFormStateBillWiseRowUpdate } from "./reducer";
import { BillwiseData } from "./acc-transaction-types";
import _cloneDeep from "lodash/cloneDeep";
interface BillWisePopupProps {
  isMaximized?: boolean;
  modalHeight?: any; // Add isMaximized as an optional prop
}

const BillWisePopup: FC<BillWisePopupProps> = ({
  isMaximized,
  modalHeight,
}) => {
  const dispatch = useDispatch();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [gridHeight, setGridHeight] = useState<number>(500);
  const [store, setStore] = useState<any>(JSON.parse(JSON.stringify(formState.billwiseData)));

  useEffect(() => {
    let wh = modalHeight;
    let gridHeightWindows = wh - 230;
    setGridHeight(gridHeightWindows);
  }, [isMaximized, modalHeight]);

  useEffect(() => {
    const clonedData = JSON.parse(JSON.stringify(formState.billwiseData));
    setStore(clonedData);
  }, [formState.billwiseData]);
  const handleSelectionChange = (e: any) => {
  
  };

  const [enterKeyAction, setEnterKeyAction] =
    useState<DataGridTypes.EnterKeyAction>("startEdit");
  const [enterKeyDirection, setEnterKeyDirection] =
    useState<DataGridTypes.EnterKeyDirection>("row");
  const onRowUpdating = (e: any) => {
    const updatedRow = { ...e.oldData, ...e.newData };

    setStore((prevStore: any) =>
      prevStore.map((item: any) =>
        item.slNo === updatedRow.slNo ? updatedRow : item
      )
    );
    e.newData = updatedRow;
  };

  //  ==========================================================================================
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="">
              {formState.row.amount}
              <div className="grid grid-cols-1 gap-3">
                Safvan {store.length}
                <DataGrid
                  id="TestPopup"
                  height={gridHeight}
                  dataSource={store}
                  className="custom-data-grid"
                  showBorders={true}
                  columnAutoWidth={true}
                  showColumnLines={false}
                  showRowLines={true}
                  allowColumnResizing={true}
                  allowColumnReordering={true}
                  onRowUpdated={handleSelectionChange}
                  // onSelectionChanged={handleSelectionChange}
                  onRowUpdating={onRowUpdating}
                  editing={{
                    allowUpdating: true,
                    mode: "cell",
                    allowAdding: false,
                    allowDeleting: false,
                  }}
                >
                  <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={"startEdit"}
                    enterKeyDirection={"column"}
                  />

                  <FilterRow visible={true} />
                  <SearchPanel visible={true} />
                  <ColumnFixing enabled={true} />
                  <Scrolling mode="standard" />
                  <Paging defaultPageSize={100} />
                  {/* <LoadPanel visible={true} /> */}

                  <Column
                    dataField="slNo"
                    caption="SiNo"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={50}
                  />
                  <Column
                    dataField="voucherType"
                    caption="VoucherType"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={100}
                  />
                  <Column
                    dataField="voucherNumber"
                    caption="BillNo"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={150}
                  />
                  <Column
                    dataField="transactionDate"
                    caption="TransactionDate"
                    dataType="date"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={100}
                  />
                  <Column
                    dataField="amount"
                    caption="Amount"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={100}
                  />
                  <Column
                    dataField="adjustedAmount"
                    caption="Adjusted Amount"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={150}
                  />
                  <Column
                    dataField="billwiseAmount"
                    caption="Amount To Set"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={100}
                  />
                  <Column
                    dataField="referenceNumber"
                    caption="ReferenceNumber"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={150}
                  />
                  <Column
                    dataField="financialYearID"
                    caption="FinancialYearID"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={130}
                  />
                  <Column
                    dataField="formType"
                    caption="FormType"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                  />
                  <Column
                    dataField="voucherPrefix"
                    caption="VoucherPrefix"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={130}
                  />
                  <Column
                    dataField="partyName"
                    caption="PartyName"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={150}
                    visible={false}
                  />
                  <Column
                    dataField="referenceDate"
                    caption="Reference Date"
                    dataType="date"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={100}
                    visible={false}
                  />
                  <Column
                    dataField="FormType"
                    caption="Form Type"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={100}
                    visible={false}
                  />
                  <Column
                    dataField="balance"
                    caption="Balance After"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
                    width={150}
                    visible={false}
                  />
                  <Column
                    dataField="drCr"
                    caption="DrCr"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={true}
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
                      column="Adjusted Amount"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                    <TotalItem
                      column="Balance"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                    <TotalItem
                      column="Amount to Set"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                    <TotalItem
                      column="Balance After"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                  </Summary>
                </DataGrid>
              </div>
              <div className="flex justify-center items-center mt-4 p-4 bg-gray-100 rounded-md max-w-60">
                <strong className="mr-3">Net Adjustment </strong>
                <span className="">
                  {formState.billwiseData?.reduce(
                    (total, item) => total + (item.AmountToAssign || 0),
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BillWisePopup;
