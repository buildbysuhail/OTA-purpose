import { FC, Fragment, useEffect, useState } from "react";
import { CheckBox, DataGrid, Toolbar } from "devextreme-react";
import {
  Column,
  Paging,
  Scrolling,
  DataGridTypes,
  ColumnFixing,
  FilterRow,
  SearchPanel,
  Item,
  Summary,
  TotalItem,
  KeyboardNavigation,
} from "devextreme-react/cjs/data-grid";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useDispatch } from "react-redux";
import _cloneDeep from "lodash/cloneDeep";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { CheckCircle2 } from "lucide-react";
import ERPButton from "../../../components/ERPComponents/erp-button";

interface BillWisePopupProps {
  isMaximized?: boolean;
  modalHeight?: any;
  onMaximizeChange?: (maximized: boolean) => void;
}

const BillWisePopup: FC<BillWisePopupProps> = ({
  isMaximized,
  modalHeight,
  onMaximizeChange,
}) => {
  const dispatch = useDispatch();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [gridHeight, setGridHeight] = useState<number>(500);
  const [store, setStore] = useState<any>(
    JSON.parse(JSON.stringify(formState.billwiseData))
  );

  useEffect(() => {
    if (isMaximized && onMaximizeChange) {
      onMaximizeChange(true);
    }
  }, [isMaximized, onMaximizeChange]);

  useEffect(() => {
    let wh = modalHeight;
    let gridHeightWindows = wh - 230;
    setGridHeight(gridHeightWindows);
  }, [isMaximized, modalHeight]);

  useEffect(() => {
    const clonedData = JSON.parse(JSON.stringify(formState.billwiseData));
    setStore(clonedData);
  }, [formState.billwiseData]);

  const handleSelectionChange = (e: any) => {};

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

  const handleCheckboxChange = (checked: boolean, rowData: any) => {
    const updatedStore = store.map((item: any) =>
      item.slNo === rowData.slNo
        ? {
            ...item,
            isSelected: checked,
            billwiseAmount: checked ? item.amount : 0,
          }
        : item
    );
    setStore(updatedStore);
  };

  //  ==========================================================================================
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="">
              <div className="grid grid-cols-1 gap-3">
                <Toolbar className="!bg-[#f6f6f6] rounded-tl-[10px] rounded-tr-[10px] !p-[1rem]">
                  <Item location="before">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                        {formState.ledgerData?.imageUrl ? (
                          <img
                            src={formState.ledgerData?.partyPhoto}
                            alt="Ledger"
                            className="w-8 h-8 object-cover rounded"
                          />
                        ) : (
                          <div className="text-lg font-medium text-gray-600">
                            {formState.ledgerData?.name?.[0] || "-"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formState.row.ledgerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">
                            {formState.ledgerData?.code || "-"}
                          </span>
                          {formState.ledgerData?.isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Item>
                  <Item location="after">
                    <ERPCheckbox
                      label="Show debit transaction also"
                      className="text-[12px] font-medium p-3"
                      id={""}
                    />
                  </Item>
                  <Item location="after">
                    <p className="text-[12px] font-medium p-3 mx-2">
                      Amount to adjust : {formState.row.amount}
                    </p>
                  </Item>
                </Toolbar>
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
                  remoteOperations = {{filtering:false, grouping:false, groupPaging:false, paging:false, sorting:false, summary:false}}
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
                  <SearchPanel visible={false} />
                  <ColumnFixing enabled={true} />
                  <Scrolling mode="standard" />
                  <Paging enabled={false} />
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
                    dataField="isSelected"
                    caption="Select"
                    dataType="boolean"
                    width={70}
                    allowFiltering={false}
                    allowSearch={false}
                    allowEditing={true}
                    cellRender={(cellData: any) => (
                      <CheckBox
                        value={cellData.value}
                        onValueChanged={(e) => {
                          handleCheckboxChange(e.value, cellData.data);
                        }}
                      />
                    )}
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

                  {/* Add Summary for "Amount" column */}
                  <Summary>
                    <TotalItem
                      column="amount"
                      summaryType="sum"
                      displayFormat="{0}"
                    />

                    <TotalItem
                      column="adjustedAmount"
                      summaryType="sum"
                      displayFormat="{0}"
                    />

                    <TotalItem
                      column="balance"
                      summaryType="sum"
                      displayFormat="{0}"
                    />

                    <TotalItem
                      column="billwiseAmount"
                      summaryType="sum"
                      displayFormat="{0}"
                    />

                    <TotalItem
                      column="balance"
                      summaryType="sum"
                      displayFormat="{0}"
                    />
                  </Summary>
                </DataGrid>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex justify-center items-center mt-4 p-4 bg-gray-100 rounded-md max-w-60">
                  <strong className="mr-3">Net Adjustment</strong>
                  <span className="">
                    {store.reduce(
                      (total: number, item: any) =>
                        total + (item.billwiseAmount || 0),
                      0
                    )}
                  </span>
                </div>
                <div>
                  <ERPButton title="Auto save" className="mr-2" />
                  <ERPButton title="Save" className="mr-2" />
                  <ERPButton title="Cancel" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BillWisePopup;
