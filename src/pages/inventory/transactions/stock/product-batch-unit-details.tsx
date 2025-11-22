import React, { useEffect, useState } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux/es/exports";
import { RootState } from "../../../../redux/store";
import { ActionType } from "../../../../redux/types";
import { useAppState } from "../../../../utilities/hooks/useAppState";
import { Maximize2, Minimize2, X } from "lucide-react";
import { APIClient } from "../../../../helpers/api-client";

interface ProductBatchUnitDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}
const api = new APIClient()
const ProductBatchUnitDetails: React.FC<ProductBatchUnitDetailsProps> = ({ isOpen, onClose, t, }) => {
  // const [showSelectedPartyOnly, setShowSelectedPartyOnly] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const { appState } = useAppState();
  const isMinimized = appState.toggled && appState.toggled.includes("close");
  const sidebarWidth = isMinimized ? "80px" : "240px";
  const isLargeScreen = window.innerWidth >= 1000;
  const headerLeft = isLargeScreen ? sidebarWidth : "0";
  const gridHeight = isExpanded ? "750px" : "290px";
  const batchUnitColumns: DevGridColumn[] = [
    {
      dataField: "autoBarcode",
      caption: t("auto_barcode"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "unitCode",
      caption: t("unit_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 60,
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
      dataField: "convFac",
      caption: t("conv_fac"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "salesPrice",
      caption: t("sales_price"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "minPrice",
      caption: t("min_price"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "cost",
      caption: t('cost'),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 70,
    },
    {
      dataField: "lpr",
      caption: t("lpr"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 70,
    },
    {
      dataField: "lpc",
      caption: t("lpc"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 70,
    },
    {
      dataField: "unitRemarks",
      caption: t("unit_remarks"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 70,
    },
    {
      dataField: "convFac2",
      caption: t("conv_fac2"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 70,
    },
    {
      dataField: "stdCost",
      caption: t("std_cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
  ];

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (formState.currentCell?.data?.productBatchID) {
        const res = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/UnitPriceDetails/?productBatchId=${formState.currentCell?.data?.productBatchID}&isUnitDetails=true`);
        setData(res);
      }
    };
    fetchData();
  }, [formState.currentCell?.data?.productBatchID]);

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
          height: isExpanded ? "94vh" : "350px",
          left: headerLeft,
          top: isExpanded ? "60px" : "",
        }}
      >
        <div style={contentContainerStyle}>
          <div className="flex items-center justify-between px-4 pb-2 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("batch_unit_details")}
            </h2>
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
            <div className="mt-4" style={{ height: gridHeight }}>
              <ErpDevGrid
                // key={`batch-unit-grid-${isExpanded}`}
                columns={batchUnitColumns}
                data={data}
                method={ActionType.GET}
                gridId="batchUnitDetailsGrid"
                height={gridHeight}
                hideGridAddButton={true}
                columnHidingEnabled={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                hideGridHeader={true}
                enablefilter={false}
                remoteOperations={{ paging: false, filtering: false, sorting: false, grouping: false, summary: false }}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
                showTotalCount={false}
                hideToolbar={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductBatchUnitDetails;