import React, { useState, useCallback, useRef } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { ActionType } from "../../../../redux/types";

interface PendingOrderListProps {
  objForm?: any;
  partyLedgerID?: number;
  voucherType?: string;
  toVoucherType?: string;
  branchID?: number;
  showAllBranchPending?: boolean;
  formType?: string;
  closeModal: () => void;
  t: any;
  onProcessSelected?: (masterIds: string, loadType: string, voucherType: string,) => void;
}

interface ProcessSelectedData {
  masterIDs: string;
  // branchIDs: string;
  // voucherNumbers: string;
  // referenceNumber: string;
}

interface PendingOrderRow {
  invTransactionMasterID: number;
  ledgerID: number;
  branchID: number;
  voucherNumber: string;
  referenceNumber: string;
  orderAmount: number;
  pendingAmount: number;
  processed: number;
  voucherDate: string;
  partyName: string;
  select?: boolean;
}

interface OrderDetailRow {
  invTransactionDetailID: number;
  productCode: string;
  productName: string;
  quantity: number;
  unitName: string;
  unitPrice: number;
  processedQty: number;
  pendingQty: number;
}

const PendingOrderList: React.FC<PendingOrderListProps> = ({
  objForm,
  voucherType = "SO",
  closeModal,
  t,
  onProcessSelected,
}) => {
  const formState = useSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const [toDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [fromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedMaster, setSelectedMaster] = useState<{ masterID: number; branchID: number }>({ masterID: 0, branchID: 0 });
  const [selectedRows, setSelectedRows] = useState<PendingOrderRow[]>([]);
  const [isProcessButtonVisible, setIsProcessButtonVisible] = useState(false);
  const gridRef = useRef<any>(null);

  // Main grid columns configuration
  const mainGridColumns: DevGridColumn[] = React.useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "date",
        caption: t("date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "voucherNumber",
        caption: t("voucher_number"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "voucherForm",
        caption: t("voucher_form"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "party",
        caption: t("party"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
      },
      {
        dataField: "orderAmount",
        caption: t("order_amount"),
        dataType: "number",
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "processed",
        caption: t("processed"),
        dataType: "number",
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "pendingAmount",
        caption: t("pending_amount"),
        dataType: "number",
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        width: 120,
      },
    ];
    return baseColumns;
  }, []);

  const detailGridColumns: DevGridColumn[] = React.useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 250,
      },
      {
        dataField: "quantity",
        caption: t("quantity"),
        dataType: "number",
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "unitName",
        caption: t("unit_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 80,
      },
      {
        dataField: "unitPrice",
        caption: t("unit_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "processedQty",
        caption: t("processed_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        width: 120,
      },
      {
        dataField: "pendingQty",
        caption: t("pending_qty"),
        dataType: "number",
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        width: 120,
      },
    ];
    return baseColumns;
  }, []);

  // // Handle row selection in main grid
  // const handleSelectionChange = useCallback(
  //   (params: any) => {
  //     const masterID = params.data?.invTransactionMasterID;
  //     if (masterID && masterID !== selectedMasterID) {
  //       setSelectedMasterID(masterID); 
  //     }
  //   },
  //   []
  // );
  // // Handle row selection change
  const handleMainGridRowClick = useCallback(
    (e: any) => {
      setSelectedMaster({ masterID: e.data.invTransactionMasterID, branchID: e.data.branchID })
    },
    []
  );

  // useEffect(() => {
  //   console.log(selectedRows, "MAR"); 
  // }, [selectedRows]);

  // Process selected orders
  const handleProcessSelected = useCallback(() => {
    // if (selectedRows.length === 0) return;
    
    const _masterIDs = gridRef.current
      ?.instance()
      ?.getSelectedRowsData("all")
      ?.map((x: any) => x.invTransactionMasterID) ?? []
    const masterIDs = _masterIDs.join(",");
    // const branchIDs = selectedRows.map((row) => row.branchID || "").join(",");
    // const referenceNumber = selectedRows[0]?.referenceNumber || "";

    // Build voucher numbers string based on voucher type
    let voucherPrefix = "Ord #:";
    switch (voucherType) {
      case "SO":
        voucherPrefix = "Ord #:";
        break;
      case "GD":
        voucherPrefix = "GDN #:";
        break;
      case "GRN":
        voucherPrefix = "GR #:";
        break;
      case "PO":
        voucherPrefix = "PO #:";
        break;
      case "GR":
        voucherPrefix = "GR #:";
        break;
      case "PQ":
        voucherPrefix = "PQ #:";
        break;
    }

    const voucherNumbers =
      voucherPrefix + selectedRows.map((row) => row.voucherNumber).join(",");

    const processData: ProcessSelectedData = {
      masterIDs,
      // branchIDs,
      // voucherNumbers,
      // referenceNumber,
    };

    // Call the callback function to pass data back to parent
    onProcessSelected?.(processData.masterIDs, voucherType, formState.transaction.master.voucherType);
    closeModal?.();
  }, [selectedRows, voucherType, onProcessSelected, closeModal]);

  // Initialize process button visibility
  // useEffect(() => {
  //   if (!objForm) {
  //     setIsProcessButtonVisible(false);
  //   }
  // }, [objForm]);

  return (
    <>
      {/* Process Selected Button */}
      {/* {isProcessButtonVisible && ( */}
      <div className="flex justify-end mb-4">
        <ERPButton
          variant="primary"
          onClick={handleProcessSelected}
          title={t("process_selected")}
        // disabled={selectedRows.length === 0}
        />
      </div>
      {/* )} */}

      {/* Main Grid - Pending Orders */}
      <div className="mb-4">
        {voucherType == "POC" ?
        (<ErpDevGrid
          ref={gridRef}
          columns={mainGridColumns}
          dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/ConsolidatedOtherBranchPurchaseOrders/`}
          postData={{ voucherType: "PO", ledgerID: formState.transaction.master.ledgerID, fromDate, toDate}}
          method={ActionType.GET}
          gridId="grd_pending_orders"
          height={300}
          hideGridAddButton={true}
          enableScrollButton={false}
          selectionMode="multiple"
          initialSort={[{ selector: "voucherNumber", desc: true }]}
          // gridHeader={t("pending_goods_receipt")}
          onRowClick={handleMainGridRowClick}
          // onSelectionChanged={handleSelectionChange}
          showPrintButton={false}
          allowExport={false}
          allowSearching={false}
          hideToolbar={true}
        />) : (
<ErpDevGrid
          ref={gridRef}
          columns={mainGridColumns}
          dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/PendingTransactionMaster/`}
          postData={{ voucherType: voucherType, ledgerID: formState.transaction.master.ledgerID, }}
          method={ActionType.GET}
          gridId="grd_pending_orders"
          height={300}
          hideGridAddButton={true}
          enableScrollButton={false}
          selectionMode="multiple"
          initialSort={[{ selector: "voucherNumber", desc: true }]}
          // gridHeader={t("pending_goods_receipt")}
          onRowClick={handleMainGridRowClick}
          // onSelectionChanged={handleSelectionChange}
          showPrintButton={false}
          allowExport={false}
          allowSearching={false}
          hideToolbar={true}
        />
        )
      }
      </div>

      {/* Detail Grid - Order Details */}
      {selectedMaster && selectedMaster.masterID > 0 &&
        <div className="mt-4">
          <ErpDevGrid
            columns={detailGridColumns}
            dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/PendingTransactionDetails/`}
            postData={{ transactionMasterID: selectedMaster.masterID, }}
            method={ActionType.GET}
            gridId="grd_order_details"
            height={300}
            hideGridAddButton={true}
            enableScrollButton={false}
            
            selectionMode="none"
            showPrintButton={false}
            allowExport={false}
            allowSearching={false}
            hideToolbar={true}
          />
        </div>
      }
    </>
  );
};

export default PendingOrderList;
