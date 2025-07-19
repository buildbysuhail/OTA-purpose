import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { ProductDisplayDto, TransactionFormState } from "./transaction-types";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { initialProductDisplayData } from "./transaction-type-data";
import { ActionType } from "../../../../redux/types";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface ProductInformationSidebarProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  transactionType: string;
  formState: TransactionFormState;
}

const api = new APIClient();
const ProductInformationSidebar: React.FC<ProductInformationSidebarProps> = ({
  isOpen,
  onClose,
  transactionType,
}) => {
  const { t } = useTranslation("transaction");
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Item Details", "Transactions"];
  const [productInfo, setProductInfo] = useState<ProductDisplayDto>(initialProductDisplayData);
  const [loading, setLoading] = useState({});
  const [showCurrentCustomer, setShowCurrentCustomer] = useState(false);
  const [showCurrentBatch, setShowCurrentBatch] = useState(false);
  const [showCurrentUnit, setShowCurrentUnit] = useState(false);
  const [voucherType, setVoucherType] = useState<string | null>(null);
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const [parm, setParm] = useState<{productID: number | undefined;
  productBatchID: number | string;
  unitID: number | undefined;
  ledgerID: number | string;}>({productID: formState.currentCell?.data?.productID,
  productBatchID: formState.currentCell?.data?.productBatchID??0,
  unitID: formState.currentCell?.data?.unitID,
  ledgerID: formState.transaction.master.ledgerID,});

  useEffect(() => {
    debugger;
    const data  = formState.currentCell?.data;
  const payload = {
    productID: data?.productID,
    productBatchID: showCurrentBatch ? data?.productBatchID??0 :  0,
    unitID: showCurrentUnit ? data?.productBatchID??0 :  0,
    ledgerID: showCurrentCustomer ? formState.transaction.master.ledgerID : 0
  };
  setParm(payload)
  }, [showCurrentBatch, showCurrentCustomer, showCurrentUnit, formState.currentCell?.rowIndex, formState.currentCell?.column, formState.currentCell?.data?.productID, formState.currentCell?.data?.productBatchID, formState.currentCell?.data?.unitID, formState.transaction.master.ledgerID]) // add al other deps vajid


  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "actions",
        caption: t("Actions"),
        allowSearch: true,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 1000,
        cellRender: (cellElement: any) => {
          const status = cellElement.data?.status || "DRAFT";
          const statusClass = status === "PAID" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
          const transactionDate = cellElement.data?.transactionDate;
          const formattedDate = transactionDate
            ? new Date(transactionDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            : "N/A";
          return (
            <div className="bg-white p-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-gray-800 font-bold text-sm uppercase">
                    {cellElement.data?.voucherPrefix || "XCVXCXC"} {cellElement.data?.voucherNumber || "INV-0000003"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{formattedDate}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                    {status}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-gray-800 font-bold text-sm">
                    ₹{cellElement.data?.amount?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Quantity Sold {cellElement.data?.qty?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      },
    ], [t]
  );

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      if ((formState.currentCell?.rowIndex ?? 0) >= 0 && (formState.currentCell?.data?.productBatchID ?? 0) > 0) {
        const data = formState.transaction.details[formState.currentCell?.rowIndex ?? 0];
        const payload = {
          productBatchID: formState.currentCell?.data?.productBatchID,
          unitID: data?.unitID,
          unitName: data?.unit,
          priceCategoryID: formState.transaction.master.priceCategoryID ?? 0
        };
        const queryParams = new URLSearchParams(payload as any).toString();
        const info = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/productInfo`, queryParams);
        setProductInfo(info);
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const renderItemDetailsTab = () => (
    <div className="space-y-2">
      {/* Basic Information */}
      <div className="p-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#3B82F6] pl-3">
          {t('basic_information')}
        </h6>
        <div className="flex flex-col gap-2 px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Product Name:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out text-right">{productInfo?.productName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Product Code:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.productCode || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Group:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.groupName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Category:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.productCategoryName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Unit:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.unitName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Item Type:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.itemType || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Brand:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.brandName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Barcode:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.autoBarcode || '-'}</span>
          </div>
        </div>
      </div>

      {/* Sales Information */}
      <div className="p-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#22C55E] pl-3">
          {t('sales_information')}
        </h6>
        <div className="flex flex-col gap-2 px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Std Sales Price:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stdSalesPrice || 0}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Min Sale Price:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.minSalePrice || 0}</span>
          </div>
        </div>
      </div>

      {/* Purchase Information */}
      <div className="p-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#F97316] pl-3">
          {t('purchase_information')}
        </h6>
        <div className="flex flex-col gap-2 px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Std Purchase Price:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stdPurchasePrice || 0}</span>
          </div>
        </div>
      </div>

      {/* Stock Information */}
      <div className="p-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#A855F7] pl-3">
          {t('stock_information')}
        </h6>
        <div className="flex flex-col gap-2 px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Current Stock:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stock || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Min Stock:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stockMin || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Max Stock:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stockMax || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Warehouse:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.warehouseName || '-'}</span>
          </div>
        </div>
      </div>

      {/* Other Information */}
      <div className="p-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#6366F1] pl-3">
          {t('other_information')}
        </h6>
        <div className="flex flex-col gap-2 px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Manufacturing Date:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.mfgDate || 'dd-mm-yyyy'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Expiry Date:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.expiryDate || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">Batch No:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.batchNo || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="p-2">
      <div className="flex flex-wrap gap-4 mb-4">
        <ERPCheckbox
          id="showCurrentCustomer"
          label="Show only current customer transaction"
          checked={showCurrentCustomer}
          onChange={(e) => setShowCurrentCustomer(e.target.checked)}
        />
        <ERPCheckbox
          id="showCurrentBatch"
          label="Current batch transaction"
          checked={showCurrentBatch}
          onChange={(e) => setShowCurrentBatch(e.target.checked)}
        />
        <ERPCheckbox
          id="showCurrentUnit"
          label="Current unit transaction"
          checked={showCurrentUnit}
          onChange={(e) => setShowCurrentUnit(e.target.checked)}
        />
        <ERPDataCombobox
          key={voucherType}
          field={{
            id: "voucherType",
            // getListUrl: Urls.data_vouchertype,
            valueKey: "id",
            labelKey: "name",
          }}
          // pi , so ,pr
          options={
            [
              {id:"SI", name:"Sale Invoice"}
            ]
          }
          noLabel={true}
          id="voucherType"
          data={{ voucherType }}
          value={voucherType}
          onChange={(e) => {
            setVoucherType(e?.value ?? null);
          }}
        />
      </div>
      <ERPDevGrid
        columns={columns}
        dataUrl={`${Urls.inv_transaction_base}${transactionType}/productInfo/SI`}
        postData={parm}
        method={ActionType.POST}
        gridHeader={t("transactions")}
        gridId="transaction-grid"
        className="HistorySidebarcustom"
        gridAddButtonIcon="ri-add-line"
        remoteOperations={{ paging: true, filtering: true, sorting: true }}
        pageSize={40}
        hideGridAddButton={true}
        columnHidingEnabled={true}
        hideDefaultExportButton={true}
        hideDefaultSearchPanel={true}
        allowSearching={false}
        allowExport={false}
        hideGridHeader={false}
        enablefilter={false}
        hideToolbar={true}
        enableScrollButton={false}
        ShowGridPreferenceChooser={false}
        showPrintButton={false}
      />
    </div>
  );

  return (
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={onClose} minWidth={400}>
      <div className="py-3 h-[94vh] dark:bg-dark-bg bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 px-3">
          <h6 className="font-bold text-lg tracking-tight dark:text-dark-text text-gray-900">{t("item_details")}</h6>
          <button
            onClick={onClose}
            aria-label="Close"
            className="dark:bg-dark-bg-card dark:text-[#f87171] dark:hover:bg-[#dc2626] dark:hover:text-white dark:focus:ring-[#f87171] bg-white text-[#ef4444] hover:bg-[#ef4444] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#fca5a5] transition-colors duration-200 p-2 rounded-full shadow-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Name Display */}
        {formState && (
          <div className="w-full">
            <div className="dark:bg-dark-bg-card dark:border-dark-border p-4 bg-slate-200">
              <div className="flex items-stretch gap-2">
                <div className="product-image min-w-[90px] h-[60px] bg-slate-200">
                  <img src={productInfo?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbngTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s"} className="w-full h-full object-cover object-center rounded-md" />
                </div>
                <div className="flex flex-col gap-1">
                  <h5 className="font-bold text-base leading-tight dark:text-dark-text text-gray-900">
                    {productInfo?.productName || "Product Name"}
                  </h5>
                  <p className="text-xs font-medium dark:text-dark-text-secondary dark:bg-dark-bg text-gray-600">
                    {productInfo?.productCode || 'Product Code'}
                  </p>
                  <p className="text-xs font-medium dark:text-dark-text-secondary dark:bg-dark-bg text-gray-600">
                    {productInfo?.unitName || 'Unit Name'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="overflow-hidden">
          <ERPTab
            tabs={tabs}
            activeTab={activeTab}
            onClickTabAt={handleTabClick}>
            {renderItemDetailsTab()}
            {renderTransactionsTab()}
          </ERPTab>
        </div>
      </div>
    </ERPResizableSidebar>
  );
};

export default React.memo(ProductInformationSidebar, (prevProps, nextProps) => {
  if (!prevProps.isOpen && nextProps.isOpen) {
    return false;
  }
  return prevProps.isOpen === nextProps.isOpen;
});