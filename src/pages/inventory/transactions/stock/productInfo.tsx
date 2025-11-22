import React, { useState } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux/es/exports";
import { RootState } from "../../../../redux/store";
import { ActionType } from "../../../../redux/types";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import { Maximize2, Minimize2, X } from "lucide-react";

interface ProductInfoSlideUpProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const ProductInfoSlideUp: React.FC<ProductInfoSlideUpProps> = ({
  isOpen,
  onClose,
  t,
}) => {
  const [showSelectedPartyOnly, setShowSelectedPartyOnly] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const { appState } = useAppState();
  const isMinimized = appState.toggled && appState.toggled.includes("close");
  const sidebarWidth = isMinimized ? "80px" : "240px";
  const isLargeScreen = window.innerWidth >= 1000;
  const headerLeft = isLargeScreen ? sidebarWidth : "0";
  const gridHeight = isExpanded ? "750px" : "290px";

  const purchaseColumns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 66,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 48,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 194,
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 64,
    },
    {
      dataField: "cost",
      caption: t("cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 59,
    },
    {
      dataField: "description",
      caption: t("description"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 73,
    },
    {
      dataField: "beforeAddAmount",
      caption: t("before_add_amount"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 114,
    },
    {
      dataField: "xRate",
      caption: t("x_rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "netItemCost",
      caption: t("net_item_cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "unitName",
      caption: t("unit_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "rateWithTax",
      caption: t("rate_with_tax"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "disc",
      caption: t("disc"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "netRate",
      caption: t("net_rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
  ];

  const salesColumns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 74,
    },
    {
      dataField: "billNumber",
      caption: t("bill_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 62,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 194,
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 72,
    },
    {
      dataField: "rate",
      caption: t("rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 52,
    },
    {
      dataField: "cost",
      caption: t("cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "xRate",
      caption: t("x_rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "netItemCost",
      caption: t("net_item_cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "unitName",
      caption: t("unit_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "rateWithTax",
      caption: t("rate_with_tax"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "disc",
      caption: t("disc"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "netRate",
      caption: t("net_rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "productDescription",
      caption: t("product_description"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      width: 100,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      width: 100,
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      width: 100,
    },
  ];

  if (!isOpen) return null;

  const contentContainerStyle: React.CSSProperties = {
    borderTop: "1px solid #f3f4f6",
    boxShadow: isExpanded ? '' : '0 0.2rem 0.6rem #0005',
    height: "100%",
  };

  const scrollAreaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingBottom: "16px",
    overflowY: "auto",
  };

  return (
    <>
      <div className={`fixed z-40 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed bottom-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-out z-50 ${isOpen ? "translate-y-0" : "translate-y-full"} ${isExpanded ? "top-0" : ""}`}
        style={{
          height: isExpanded ? "94vh" : "400px",
          left: headerLeft,
          top: isExpanded ? "60px" : "",
        }}
      >
        <div style={contentContainerStyle}>
          <div className="flex items-center justify-between px-4 pb-2 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("product_info")}
            </h2>

            <div>
              <ERPCheckbox
                id="showSelectedPartyOnly"
                label={t("show_selected_party_details_only")}
                checked={showSelectedPartyOnly}
                onChange={() => setShowSelectedPartyOnly(!showSelectedPartyOnly)}
              />
            </div>

            <div className="flex items-center gap-2">
              {isExpanded ? (
                <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-gray-200 transition-all duration-300 ease-in-out rounded-md" title={t("minimize")}>
                  <Minimize2 className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => setIsExpanded(true)} className="p-2 hover:bg-gray-200 transition-all duration-300 ease-in-out rounded-md" title={t("maximize")}>
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-200" title={t("close")}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div style={scrollAreaStyle}>
            <div className="flex flex-col">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1" style={{ height: gridHeight }}>
                  <ErpDevGrid
                    key={`purchase-grid-${isExpanded}`}
                    columns={purchaseColumns}
                    dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/ProductInfo/PI/`}
                    method={ActionType.POST}
                    postData={{
                      productId: formState.transaction.details && formState.transaction.details[formState.currentCell?.rowIndex ?? 0] ? formState.transaction.details[formState.currentCell?.rowIndex ?? 0].productID : 0,
                      partyLedgerId: formState.transaction.master.ledgerID,
                      isSelectedPartyDetailsOnly: showSelectedPartyOnly,
                    }}
                    gridId="purchaseDetailsGrid"
                    height={gridHeight}
                    gridHeader={t("purchase_details")}
                    hideGridAddButton={true}
                    columnHidingEnabled={true}
                    hideDefaultExportButton={true}
                    hideDefaultSearchPanel={true}
                    allowSearching={false}
                    allowExport={false}
                    hideGridHeader={false}
                    enablefilter={false}
                    remoteOperations={false}
                    enableScrollButton={false}
                    ShowGridPreferenceChooser={false}
                    showPrintButton={false}
                  />
                </div>

                <div className="flex-1" style={{ height: gridHeight }}>
                  <ErpDevGrid
                    key={`sales-grid-${isExpanded}`}
                    columns={salesColumns}
                    method={ActionType.POST}
                    dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/ProductInfo/SI/`}
                    postData={{
                      productId: formState.transaction.details && formState.transaction.details[formState.currentCell?.rowIndex ?? 0] ? formState.transaction.details[formState.currentCell?.rowIndex ?? 0].productID : 0,
                      partyLedgerId: formState.transaction.master.ledgerID,
                      isSelectedPartyDetailsOnly: showSelectedPartyOnly,
                    }}
                    gridId="salesDetailsGrid"
                    height={gridHeight}
                    gridHeader={t("sales_details")}
                    hideGridAddButton={true}
                    columnHidingEnabled={true}
                    hideDefaultExportButton={true}
                    hideDefaultSearchPanel={true}
                    allowSearching={false}
                    allowExport={false}
                    hideGridHeader={false}
                    enablefilter={false}
                    remoteOperations={false}
                    enableScrollButton={false}
                    ShowGridPreferenceChooser={false}
                    showPrintButton={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInfoSlideUp;