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
import store from "devextreme/data/odata/store";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
interface BillWisePopupProps {
  isMaximized?: boolean; 
  modalHeight?:any // Add isMaximized as an optional prop
}

const BillWisePopup: FC<BillWisePopupProps> = ({ isMaximized,modalHeight}) => {
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [gridHeight, setGridHeight] = useState<number>(500);
  useEffect(() => {
    let wh = modalHeight;
    let gridHeightWindows = wh - 230; 
    setGridHeight(gridHeightWindows);
  }, [isMaximized,modalHeight]);

  const handleSelectionChange = (e: any) => {
    const { data } = e;
    const updatedStore = formState.billwiseData .map((item: any) => {
      if (item.SiNo === data.SiNo) {
        return {
          ...item,
          Select: data.Select,
          AmountToAssign: data.Select ? item.Amount : 0,
          BalanceAfter: data.Select ? 0 : item.Balance
        };
      }
      return item;
    });
    // setStore(updatedStore);
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
                  height={gridHeight}
                  dataSource={formState.billwiseData}
                  className="custom-data-grid"
                  showBorders={true}
                  columnAutoWidth={true}
                  showColumnLines={false}
                  showRowLines={true}
                  allowColumnResizing={true}
                  allowColumnReordering={true}
                  onRowUpdated={handleSelectionChange}
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
                    dataField="slNo"
                    caption="SiNo"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={50}
                  />
                  <Column
                    dataField="voucherType"
                    caption="VoucherType"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="voucherNumber"
                    caption="BillNo"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                  />
                  <Column
                    dataField="transactionDate"
                    caption="TransactionDate"
                    dataType="date"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="amount"
                    caption="Amount"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="adjustedAmount"
                    caption="Adjusted Amount"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                  />
                  <Column
                    dataField="billwiseAmount"
                    caption="Amount To Set"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={100}
                  />
                  <Column
                    dataField="referenceNumber"
                    caption="ReferenceNumber"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                  />
                  <Column
                    dataField="financialYearID"
                    caption="FinancialYearID"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    width={130}
                  />
                  <Column
                    dataField="formType"
                    caption="FormType"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                  />
                  <Column
                    dataField="voucherPrefix"
                    caption="VoucherPrefix"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={130}
                  />
                  <Column
                    dataField="partyName"
                    caption="PartyName"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                    visible={false}
                  />
                  <Column
                    dataField="referenceDate"
                    caption="Reference Date"
                    dataType="date"
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
                    dataField="balance"
                    caption="Balance After"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    width={150}
                    visible={false}
                  />
                  <Column
                    dataField="drCr"
                    caption="DrCr"
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
                <span className="">{formState.billwiseData?.reduce((total, item) => total + (item.AmountToAssign || 0), 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BillWisePopup;
