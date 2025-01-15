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
  Selection,
} from "devextreme-react/cjs/data-grid";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useDispatch } from "react-redux";
import _cloneDeep from "lodash/cloneDeep";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { CheckCircle2 } from "lucide-react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { Card, CardContent, CardHeader } from "@mui/material";

interface BillwiseProps {
  ledgerName: string;
  amount: number;
  ledgerId: string;
  drCr: string;
  accTransactionDetailId: number;
  billwiseString?: string;
  onSave: (billwiseDetails: string, totalAmount: number, vrNumbers: string) => void;
  onClose: () => void;
  isMaximized?: boolean;
  modalHeight?: any;
  onMaximizeChange?: (maximized: boolean) => void;
}

const BillwiseComponent = ({
  ledgerName,
  amount,
  ledgerId,
  drCr =  "Dr",
  accTransactionDetailId,
  billwiseString = '',
  onSave,
  onClose,
  isMaximized,
  modalHeight,
  onMaximizeChange,
}: BillwiseProps) => {
  
  const dispatch = useDispatch();
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [netAdjustment, setNetAdjustment] = useState(0);const [gridHeight, setGridHeight] = useState<number>(500);
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

  const handleSelectionChange = (e: any) => {
    debugger;
    const selectedKeys = Array.isArray(e.currentSelectedRowKeys) 
    ? e.currentSelectedRowKeys.map((key: number) => ({ key, isSelected: true })) 
    : [];
  
  const deselectedKeys = Array.isArray(e.currentDeselectedRowKeys) 
    ? e.currentDeselectedRowKeys.map((key: number) => ({ key, isSelected: false })) 
    : [];
  
  const mergedKeys = [...selectedKeys, ...deselectedKeys];
    if (mergedKeys != null && mergedKeys.length > 0) {
      let updatedStore = {
        ...store
      }
      mergedKeys.forEach((item: any) => {
        updatedStore = store.map((storeItem: any) =>
          item.key === storeItem.slNo
            ? {
                ...storeItem,
                isSelected: item.isSelected,
                billwiseAmount: item.isSelected == true ? storeItem.amount : 0,
              }
            : storeItem
        );
        
      });
      setStore(updatedStore);
      
    }
    // const updatedStore = store.map((item: any) =>
    //   item.slNo === rowData.slNo
    //     ? {
    //         ...item,
    //         isSelected: checked,
    //         billwiseAmount: checked ? item.amount : 0,
    //       }
    //     : item
    // );
    
  };

  

  const onRowUpdating = (e: any) => {
    const updatedRow = { ...e.oldData, ...e.newData };
    setStore((prevStore: any) =>
      prevStore.map((item: any) =>
        item.slNo === updatedRow.slNo ? updatedRow : item
      )
    );
    e.newData = updatedRow;
  };

  // Load billwise transactions
  useEffect(() => {

    let lastIndex = 0;
    const formattedData = store?.map((row: any, index: number) => {
      debugger;
      if (showAllTransactions || row.drCr !== drCr) {
        const _it = {
          ...row,
          slNo: lastIndex + 1, // Assign a serial number for matching rows
        };
        lastIndex = lastIndex+1;
        return _it;
      } else {
        return {
          ...row,
          slNo: undefined, // Set slNo to undefined for non-matching rows
        };
      }
    });
    setStore(formattedData);
  },[showAllTransactions]);
  useEffect(() => {
    const loadBillwiseTransactions = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/billwise/transactions?ledgerId=${ledgerId}&drCr=${drCr}&accTransactionDetailId=${accTransactionDetailId}`);
        const data = await response.json();
        
    let lastIndex = 0;
        const formattedData = data?.map((row: any, index: number) => {
          if (showAllTransactions || row.drCr !== drCr) {
            const _it = {
              ...row,
              slNo: lastIndex + 1,
              isSelected: false,
              amountToSet: 0
            };
            lastIndex = lastIndex+1;
            return _it;
          } else {
            return {
              ...row,
          slNo: undefined,
          isSelected: false,
          amountToSet: 0
            };
          }
        });
        
        setStore(formattedData);

        if (billwiseString) {
          generateGridFromBillwiseString(billwiseString);
        }
      } catch (error) {
        console.error('Error loading billwise transactions:', error);
      }
    };

    loadBillwiseTransactions();
  }, [ledgerId, drCr, accTransactionDetailId, billwiseString]);

  
  const generateGridFromBillwiseString = (billwiseStr: string) => {
    const rows = billwiseStr.split('|');
    const updatedData = [...store];

    rows.forEach(row => {
      const [transDetailId, amt] = row.split('^');
      const rowIndex = updatedData.findIndex(item => 
        item.accTransDetailId.toString() === transDetailId
      );
      
      if (rowIndex !== -1) {
        updatedData[rowIndex].amountToSet = parseFloat(amt);
        updatedData[rowIndex].isSelected = parseFloat(amt) > 0;
      }
    });

    setStore(updatedData);
  };

  const getBillwiseString = () => {
    let vrNumbers = '';
    const billwiseString = store
      .filter((row: any) => row.amountToSet > 0)
      .map((row: any) => {
        if (row.amountToSet > 0) {
          vrNumbers += `${row.billNo},`;
        }
        return `${row.accTransDetailId}^${row.amountToSet}`;
      })
      .join('|');

    return { billwiseString, vrNumbers };
  };

  const handleSave = () => {
    const { billwiseString, vrNumbers } = getBillwiseString();
    const totalAdjusted = calculateNetAdjustment();
    
    if (totalAdjusted > amount) {
      alert('Adjustment amount cannot exceed the transaction amount');
      return;
    }

    onSave(billwiseString, totalAdjusted, vrNumbers);
  };

  const calculateNetAdjustment = () => {
    return store.reduce((total: any, row: any) => {
      const amt = parseFloat(row.amountToSet) || 0;
      return total + (row.drCr === drCr ? -amt : amt);
    }, 0);
  };
  const handleRowPrepared = (e: any) => {
    const DRCR = "YourCondition"; // Replace with your DRCR condition
    const VisibleRow = true; // Replace with your visibility condition

    if (e.rowType === "data") {
      if (e.data.DrCrCol === DRCR) {
        e.rowElement.style.backgroundColor = "red"; // Apply red background
        e.rowElement.style.display = VisibleRow ? "" : "none"; // Set row visibility
      }

     
    }
  };
  useEffect(() => {
    setNetAdjustment(calculateNetAdjustment());
  }, [store]);

  
  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>

      </CardHeader>
      <CardContent>
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
                       label={`Show ${drCr === 'Dr' ? 'Debit' : 'Credit'} Transactions also`}
                      className="text-[12px] font-medium p-3"
                      id={""}
                      checked={showAllTransactions}
                      onChange={(e) => setShowAllTransactions(!!e.target.checked)}
                    />
                  </Item>
                  <Item location="after">
                    <p className="text-[12px] font-medium p-3 mx-2">
                      Amount to adjust : {formState.row.amount}
                    </p>
                  </Item>
                </Toolbar>
                safvan : {showAllTransactions.toString()}
                {store?.filter((row: any) => 
                    showAllTransactions || row.drCr !== drCr
                  ).length}
      <DataGrid
                  key={"slNo"}
                  keyExpr={"slNo"}
                  id="TestPopup"
                  // height={gridHeight}
                  dataSource={store?.filter((row: any) => 
                    showAllTransactions || row.drCr !== drCr
                  )}
                  height = {gridHeight}
                  className="custom-data-grid"
                  showBorders={true}
                  columnAutoWidth={true}
                  showColumnLines={false}
                  showRowLines={true}
                  scrolling={{
                    mode: "virtual",
                    columnRenderingMode: "virtual",
                    preloadEnabled: true,
                    rowRenderingMode: "virtual",
                  }}
                  allowColumnResizing={true}
                  allowColumnReordering={true}
                  remoteOperations={{
                    filtering: false,
                    grouping: false,
                    groupPaging: false,
                    paging: false,
                    sorting: false,
                    summary: false,
                  }}
                  onRowPrepared={handleRowPrepared}
                  onRowUpdated={handleSelectionChange}
                  onSelectionChanged={handleSelectionChange}
                  // onRowUpdating={onRowUpdating}
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
                  <Selection
                    mode="multiple"
                    selectAllMode={"allPages"}
                    showCheckBoxesMode={"always"}
                  />
                  <FilterRow visible={true} />
                  <SearchPanel visible={false} />
                  <ColumnFixing enabled={true} />
                  <Scrolling mode="standard" />
                  <Paging enabled={false} />
                  {/* <LoadPanel visible={true} /> */}
                 
                  <Column
                    dataField="slNo"
                    caption="slNo"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={50}
                  />

                  {/* <Column
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
                  /> */}

                  <Column
                    dataField="voucherType"
                    caption="VoucherType"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={100}
                  />

                  <Column
                    dataField="voucherNumber"
                    caption="BillNo"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={150}
                  />

                  <Column
                    dataField="transactionDate"
                    caption="TransactionDate"
                    dataType="date"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={100}
                  />

                  <Column
                    dataField="amount"
                    caption="Amount"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={100}
                  />

                  <Column
                    dataField="adjustedAmount"
                    caption="Adjusted Amount"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
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
                    allowEditing={false}
                    width={150}
                  />

                  <Column
                    dataField="financialYearID"
                    caption="FinancialYearID"
                    dataType="number"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={130}
                  />

                  <Column
                    dataField="formType"
                    caption="FormType"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                  />

                  <Column
                    dataField="voucherPrefix"
                    caption="VoucherPrefix"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={130}
                  />

                  <Column
                    dataField="partyName"
                    caption="PartyName"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={150}
                    visible={false}
                  />

                  <Column
                    dataField="referenceDate"
                    caption="Reference Date"
                    dataType="date"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={100}
                    visible={false}
                  />

                  <Column
                    dataField="FormType"
                    caption="Form Type"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={100}
                    visible={false}
                  />

                  <Column
                    dataField="balance"
                    caption="Balance After"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
                    width={150}
                    visible={false}
                  />

                  <Column
                    dataField="drCr"
                    caption="DrCr"
                    dataType="string"
                    allowFiltering={true}
                    allowSearch={true}
                    allowEditing={false}
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
      </CardContent>
    </Card>
  );
};

export default BillwiseComponent;