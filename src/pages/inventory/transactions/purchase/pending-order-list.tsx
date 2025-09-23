import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { ActionType } from "../../../../redux/types";

// Type definitions
type FormType = "VAT" | "";

interface PendingOrderListProps {
  objForm?: any; // Dynamic form object (could be sales, purchase, etc.)
  objFrmGSTsales?: any; // GST Sales form object
  objfrmGd?: any; // Goods Delivery form object
  frmGRN?: any; // Goods Receipt Note form object
  objFrmsalestax?: any; // Sales Tax Invoice form object
  partyLedgerID?: number;
  voucherType: string;
  toVoucherType?: string;
  branchID?: number;
  showAllBranchPending?: boolean;
  formType?: string;
  closeModal: () => void;
  t: any; // Translation function
  onProcessSelected?: (
    masterIds: string,
    branchIds: string,
    voucherNumbers: string,
    referenceNumber: string,
    voucherType: string,
    toVoucherType: string
  ) => void;
  dbIdValue?: string; // Database ID for special logic
}

interface ProcessSelectedData {
  masterIDs: string;
  branchIDs: string;
  voucherNumbers: string;
  referenceNumber: string;
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
  date: string;
  party: string;
  voucherForm?: string;
  select?: boolean;
}

interface OrderDetailRow {
  invTransactionMasterID: number;
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
  objFrmGSTsales,
  objfrmGd,
  frmGRN,
  objFrmsalestax,
  partyLedgerID = 0,
  voucherType = "SO",
  toVoucherType = "SI",
  branchID,
  showAllBranchPending = false,
  formType = "",
  closeModal,
  t,
  onProcessSelected,
  dbIdValue = "",
}) => {
  // Redux state
  const formState = useSelector(
    (state: RootState) => state.InventoryTransaction
  );
  
  // State management
  const [toDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [fromDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  
  const [selectedMaster, setSelectedMaster] = useState<{
    masterID: number;
    branchID: number;
  }>({ masterID: 0, branchID: 0 });
  
  const [lastShownMasterID, setLastShownMasterID] = useState<number>(0);
  const [isProcessButtonVisible, setIsProcessButtonVisible] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  
  const gridRef = useRef<any>(null);
  const detailGridRef = useRef<any>(null);

  // Determine which form object to use
  const activeFormObject = useMemo(() => {
    if (objFrmsalestax) return objFrmsalestax;
    if (objFrmGSTsales) return objFrmGSTsales;
    if (objfrmGd) return objfrmGd;
    if (frmGRN) return frmGRN;
    return objForm;
  }, [objForm, objFrmGSTsales, objfrmGd, frmGRN, objFrmsalestax]);


  // Determine API endpoint based on voucher type and special conditions
  const getApiEndpoint = useCallback(() => {
   
    
    if (voucherType === "POC") {
      return `${Urls.inv_transaction_base}${formState.transactionType}/ConsolidatedOtherBranchPurchaseOrders/`;
    }
    
    if (branchID && (voucherType === "GR" || (voucherType === "GR" && toVoucherType === "BTO"))) {
      return `${Urls.inv_transaction_base}${formState.transactionType}/PendingTransDetailsForGR/`;
    }
    
    return `${Urls.inv_transaction_base}${formState.transactionType}/PendingTransactionMaster/`;
  }, [ voucherType, toVoucherType, branchID, formState.transactionType]);

  // Determine detail API endpoint
  const getDetailApiEndpoint = useCallback(() => {
   
    
    if (voucherType === "GR" && toVoucherType === "BTO" && branchID) {
      return `${Urls.inv_transaction_base}${formState.transactionType}/PendingTransProductDetails/`;
    }
    
    return `${Urls.inv_transaction_base}${formState.transactionType}/PendingTransactionDetails/`;
  }, [ voucherType, toVoucherType, branchID, formState.transactionType]);

  // Build post data for main grid
  const getMainGridPostData = useCallback(() => {
    const baseData: any = {
      voucherType: voucherType === "POC" ? "PO" : voucherType,
      // fromDate,
      // toDate,
    };

    if (partyLedgerID > 0) {
      baseData.ledgerID = partyLedgerID;
    }

    if (branchID) {
      baseData.branchID = branchID;
    }


    if (showAllBranchPending) {
      baseData.showAllBranch = true;
    }

    return baseData;
  }, [voucherType, fromDate, toDate, partyLedgerID, branchID, showAllBranchPending]);

  // Get voucher prefix for display
  const getVoucherPrefix = useCallback((vType: string): string => {
    const prefixMap: Record<string, string> = {
      SO: "Ord #:",
      GD: "GDN #:",
      GRN: "GR #:",
      PO: "PO #:",
      GR: "GR #:",
      PQ: "PQ #:",
      SI: "SI #:",
      PI: "PI #:",
      BTO: "BTO #:",
    };
    return prefixMap[vType] || "Doc #:";
  }, []);

  // Main grid columns configuration
  const mainGridColumns: DevGridColumn[] = useMemo(() => {
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
    ];

    // Conditionally add columns based on voucher type
    if (!(voucherType === "GR" && toVoucherType === "BTO")) {
      baseColumns.push(
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
        }
      );
    }

    // Hide certain columns
    const hiddenColumns = ["invTransactionMasterID", "ledgerID"];
    

    return baseColumns.filter(col => !hiddenColumns.includes(col.dataField??""));
  }, [voucherType, toVoucherType, t]);

  // Detail grid columns configuration
  const detailGridColumns: DevGridColumn[] = useMemo(() => {
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
    ];

    // Conditionally add unit price
    if (!(voucherType === "GR" && toVoucherType === "BTO")) {
      baseColumns.push({
        dataField: "unitPrice",
        caption: t("unit_price"),
        dataType: "number",
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        width: 100,
      });
    }

    baseColumns.push(
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
      }
    );

    return baseColumns;
  }, [voucherType, toVoucherType, t]);

  // Handle row selection in main grid
  const handleMainGridRowClick = useCallback((e: any) => {
    const masterID = e.data?.invTransactionMasterID;
    const branchID = e.data?.branchID || 0;
    
    if (masterID && masterID !== lastShownMasterID) {
      setSelectedMaster({ masterID, branchID });
      setLastShownMasterID(masterID);
    }
  }, [lastShownMasterID]);

  // Process selected orders
  const handleProcessSelected = useCallback(() => {
    const selectedData = gridRef.current?.instance()?.getSelectedRowsData("all") || [];
    
    if (selectedData.length === 0) {
      alert(t("please_select_items"));
      return;
    }

    const masterIDs: string[] = [];
    const branchIDs: string[] = [];
    const voucherNumbers: string[] = [];
    let referenceNumber = "";

    selectedData.forEach((row: PendingOrderRow) => {
      masterIDs.push(row.invTransactionMasterID.toString());
      if (row.branchID) {
        branchIDs.push(row.branchID.toString());
      }
      voucherNumbers.push(row.voucherNumber);
      if (!referenceNumber && row.referenceNumber) {
        referenceNumber = row.referenceNumber;
      }
    });

    const voucherPrefix = getVoucherPrefix(voucherType);
    const processData: ProcessSelectedData = {
      masterIDs: masterIDs.join(","),
      branchIDs: branchIDs.join(","),
      voucherNumbers: voucherPrefix + voucherNumbers.join(","),
      referenceNumber,
    };

    // Handle different form types and voucher type combinations
    if ((voucherType === "SO" || voucherType === "GD") && toVoucherType === "SI") {
      if (formType === "VAT" && objFrmsalestax) {
        objFrmsalestax.StrPendingOrdListMasterIDs = processData.masterIDs;
        objFrmsalestax.StrPendingOrdListVoucherNumbers = processData.voucherNumbers;
      } else if (activeFormObject) {
        activeFormObject.StrPendingOrdListMasterIDs = processData.masterIDs;
        activeFormObject.StrPendingOrdListBranchIDs = processData.branchIDs;
        activeFormObject.StrPendingOrdListVoucherNumbers = processData.voucherNumbers;
        activeFormObject.StrPendingRefNo = processData.referenceNumber;
      }
    } else if (voucherType === "GRN" && activeFormObject) {
      activeFormObject.StrPendingOrdListMasterIDs = processData.masterIDs;
      activeFormObject.StrPendingOrdListVoucherNumbers = processData.voucherNumbers;
    } else if (voucherType === "SO" && toVoucherType === "GD" && objfrmGd) {
      objfrmGd.StrPendingOrdListMasterIDs = processData.masterIDs;
      objfrmGd.StrPendingOrdListBranchIDs = processData.branchIDs;
      objfrmGd.StrPendingOrdListVoucherNumbers = processData.voucherNumbers;
    } else if (voucherType === "PO" && toVoucherType === "GRN" && frmGRN) {
      frmGRN.StrPendingOrdListMasterIDs = processData.masterIDs;
      frmGRN.StrPendingOrdListVoucherNumbers = processData.voucherNumbers;
    } else if ((voucherType === "PO" || voucherType === "PQ") && activeFormObject) {
      activeFormObject.StrPendingOrdListMasterIDs = processData.masterIDs;
      activeFormObject.StrPendingOrdListVoucherNumbers = processData.voucherNumbers;
    } else if (voucherType === "GR" && toVoucherType === "BTO" && activeFormObject) {
      activeFormObject.StrPendingOrdListMasterIDs = processData.masterIDs;
      activeFormObject.StrPendingOrdListBranchIDs = processData.branchIDs;
      activeFormObject.StrPendingOrdListVoucherNumbers = processData.voucherNumbers;
    }

    // Call parent callback if provided
    if (onProcessSelected) {
      onProcessSelected(
        processData.masterIDs,
        processData.branchIDs,
        processData.voucherNumbers,
        processData.referenceNumber,
        voucherType,
        toVoucherType
      );
    }

    closeModal();
  }, [
    voucherType,
    toVoucherType,
    formType,
    objFrmsalestax,
    activeFormObject,
    objfrmGd,
    frmGRN,
    getVoucherPrefix,
    onProcessSelected,
    closeModal,
    t,
  ]);

  // Initialize process button visibility based on conditions
  // useEffect(() => {
    // Hide process button if no form object is provided
  //   if (!activeFormObject) {
  //     setIsProcessButtonVisible(false);
  //   } else {
  //     setIsProcessButtonVisible(true);
  //   }
  // }, [activeFormObject]);

  // Build detail grid post data
  const getDetailGridPostData = useCallback(() => {
    const baseData: any = {
      transactionMasterID: selectedMaster.masterID,
    };

    

    if ((voucherType === "GR" && toVoucherType === "BTO") || branchID) {
      baseData.branchID = branchID || selectedMaster.branchID;
    }

    return baseData;
  }, [selectedMaster, voucherType, toVoucherType, branchID]);

  return (
    <div className="pending-order-list-container">
      {/* Process Selected Button */}
      {isProcessButtonVisible && (
        <div className="flex justify-end mb-4">
          <ERPButton
            variant="primary"
            onClick={handleProcessSelected}
            title={t("process_selected")}
            // disabled={selectedRows.size === 0}
          />
        </div>
      )}

      {/* Main Grid - Pending Orders */}
      <div className="mb-4">
        <ErpDevGrid
          ref={gridRef}
          columns={mainGridColumns}
          dataUrl={getApiEndpoint()}
          postData={getMainGridPostData()}
          method={ActionType.GET}
          gridId={`grd_pending_orders_${voucherType}`}
          height={300}
          hideGridAddButton={true}
          enableScrollButton={false}
          selectionMode="multiple"
          initialSort={[{ selector: "voucherNumber", desc: true }]}
          // gridHeader={t(`pending_${voucherType.toLowerCase()}_list`)}
          onRowClick={handleMainGridRowClick}
          // onSelectionChanged={handleSelectionChanged}
          showPrintButton={false}
           allowExport={false}
          allowSearching={false}
          hideToolbar={true}
          // showRowIndex={true}
          
        />
      </div>

      {/* Detail Grid - Order Details */}
      {selectedMaster.masterID > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">{t("order_details")}</h3>
          <ErpDevGrid
            ref={detailGridRef}
            columns={detailGridColumns}
            dataUrl={getDetailApiEndpoint()}
            postData={getDetailGridPostData()}
            method={ActionType.GET}
            gridId={`grd_order_details_${voucherType}`}
            height={300}
            hideGridAddButton={true}
            enableScrollButton={false}
            selectionMode="none"
            showPrintButton={false}
            allowExport={false}
            allowSearching={false}
            hideToolbar={true}
            showRowIndex={true}
          />
        </div>
      )}
    </div>
  );
};

export default PendingOrderList;