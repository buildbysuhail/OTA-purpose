import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import { useTranslation } from "react-i18next";
import { X, Menu, ImageIcon } from "lucide-react";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { styled } from "@mui/system";
import { ProductDisplayDto, TransactionFormState } from "../transaction-types";
import { initialProductDisplayData } from "../transaction-type-data";

interface ProductInformationSidebarProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  transactionType: string;
  index: number;
  formState: TransactionFormState;
}

const api = new APIClient();

const SalesTab: React.FC<{ parm: any; transactionType: string; columns: DevGridColumn[] }> = ({ parm, transactionType, columns }) => {
  const { t } = useTranslation("transaction");
  const postData = useMemo(() => ({ ...parm, voucherType: "SI" }), [parm]);
  return (
    <ERPDevGrid
      columns={columns}
      dataUrl={`${Urls.inv_transaction_base}${transactionType}/productInfo/SI`}
      postData={postData}
      method={ActionType.POST}
      gridHeader={t("sales")}
      gridId="sales-grid"
      className="HistorySidebarcustom dark:bg-dark-bg-card dark:text-dark-text dark:border-dark-border"
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
      height={540}
    />
  );
};

const SalesOrderTab: React.FC<{ parm: any; transactionType: string; columns: DevGridColumn[] }> = ({ parm, transactionType, columns }) => {
  const { t } = useTranslation("transaction");
  const postData = useMemo(() => ({ ...parm, voucherType: "SO" }), [parm]);
  return (
    <ERPDevGrid
      columns={columns}
      dataUrl={`${Urls.inv_transaction_base}${transactionType}/productInfo/SO`}
      postData={postData}
      method={ActionType.POST}
      gridHeader={t("sales_order")}
      gridId="sales-order-grid"
      className="HistorySidebarcustom dark:bg-dark-bg-card dark:text-dark-text dark:border-dark-border"
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
      height={540}
    />
  );
};

const PurchaseTab: React.FC<{ parm: any; transactionType: string; columns: DevGridColumn[] }> = ({ parm, transactionType, columns }) => {
  const { t } = useTranslation("transaction");
  const postData = useMemo(() => ({ ...parm, voucherType: "PI" }), [parm]);
  return (
    <ERPDevGrid
      columns={columns}
      dataUrl={`${Urls.inv_transaction_base}${transactionType}/productInfo/PI`}
      postData={postData}
      method={ActionType.POST}
      gridHeader={t("purchase")}
      gridId="purchase-grid"
      className="HistorySidebarcustom dark:bg-dark-bg-card dark:text-dark-text dark:border-dark-border"
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
      height={540}
    />
  );
};

const PurchaseOrderTab: React.FC<{ parm: any; transactionType: string; columns: DevGridColumn[] }> = ({ parm, transactionType, columns }) => {
  const { t } = useTranslation("transaction");
  const postData = useMemo(() => ({ ...parm, voucherType: "PO" }), [parm]);
  return (
    <ERPDevGrid
      columns={columns}
      dataUrl={`${Urls.inv_transaction_base}${transactionType}/productInfo/PO`}
      postData={postData}
      method={ActionType.POST}
      gridHeader={t("purchase_order")}
      gridId="purchase-order-grid"
      className="HistorySidebarcustom dark:bg-dark-bg-card dark:text-dark-text dark:border-dark-border"
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
      height={540}
    />
  );
};

const ProductInformationSidebar: React.FC<ProductInformationSidebarProps> = ({ isOpen, onClose, transactionType, index }) => {
  const { t } = useTranslation("transaction");
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [t("item_details"), t("transactions")];
  const [productInfo, setProductInfo] = useState<ProductDisplayDto>(initialProductDisplayData);
  const [loading, setLoading] = useState({});
  const [showCurrentCustomer, setShowCurrentCustomer] = useState(false);
  const [showCurrentBatch, setShowCurrentBatch] = useState(true);
  const [showCurrentUnit, setShowCurrentUnit] = useState(false);
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const [parm, setParm] = useState<{
    productID: number | undefined;
    productBatchID: number | string;
    unitID: number | undefined;
    ledgerID: number | string;
  }>({
    productID: formState.currentCell?.data?.productID,
    productBatchID: formState.currentCell?.data?.productBatchID ?? 0,
    unitID: formState.currentCell?.data?.unitID,
    ledgerID: formState.transaction.master.ledgerID,
  });
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const subTabs = [t("sales"), t("sales_order"), t("purchase"), t("purchase_order")];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen &&
        menuRef.current &&
        menuButtonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    
   
    const fetch = async () => {
       const data = formState.transaction.details[index];
    const payload = {
      productID: data?.productID,
      productBatchID: showCurrentBatch ? data?.productBatchID ?? 0 : 0,
      unitID: showCurrentUnit ? data?.unitID ?? 0 : 0,
      ledgerID: showCurrentCustomer ? formState.transaction.master.ledgerID : 0,
      unitName: data?.unit,
    };
      if ((payload?.productID ?? 0) >= 0 ) {
        const queryParams = new URLSearchParams(payload as any).toString();
        const info = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/productInfo`, queryParams);
        setProductInfo(info);
        setLoading(false);
      }
    };
    fetch();
    // setParm(payload);
  }, [
    showCurrentBatch,
    showCurrentCustomer,
    showCurrentUnit,
    formState.currentCell?.rowIndex,
    formState.currentCell?.column,
    formState.currentCell?.data?.productID,
    formState.currentCell?.data?.productBatchID,
    formState.currentCell?.data?.unitID,
    formState.transaction.master.ledgerID,
  ]);

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "actions",
        caption: t("actions"),
        allowSearch: true,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 1000,
        cellRender: (cellElement: any) => {
          return (
            <div className="bg-gradient-to-r from-white to-gray-50 dark:from-dark-bg-card dark:to-dark-bg p-4 border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200 dark:hover:border-dark-border">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-gray-900 dark:text-dark-text font-bold text-sm uppercase truncate max-w-xs cursor-pointer hover:text-[#2563EB] dark:hover:text-[#93C5FD] transition-colors duration-200" title={cellElement.data?.party}>
                    {cellElement.data?.party?.length > 20 ? cellElement.data.party.slice(0, 20) + "..." : cellElement.data?.party}
                  </p>
                  <p className="text-gray-600 dark:text-dark-text-secondary text-xs mt-1.5 font-medium">
                    <span className="bg-[#EFF6FF] dark:bg-[#1E3A8A] text-[#1D4ED8] dark:text-[#93C5FD] px-2 py-0.5 rounded-full text-xs font-semibold">{cellElement.data?.voucherNumber}</span>
                    <span className="mx-2 text-gray-400 dark:text-dark-text-secondary">•</span>
                    <span className="text-gray-500 dark:text-dark-text-secondary">{cellElement.data?.date}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-gray-600 dark:text-dark-text-secondary font-medium text-sm">
                    {t("item_price")}: <span className="font-bold text-[#16A34A] dark:text-[#4ADE80] text-base">₹{cellElement.data?.rateWithTax?.toFixed(2) || "0.00"}</span>
                  </p>
                  <p className="text-gray-600 dark:text-dark-text-secondary font-medium text-xs mt-1.5">
                    {t("quantity_sold")}: <span className="font-bold text-[#2563EB] dark:text-[#93C5FD]">{cellElement.data?.qty?.toFixed(2) || "0.00"}</span>
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
    // const fetch = async () => {
    //   if ((formState.currentCell?.rowIndex ?? 0) >= 0 && (formState.currentCell?.data?.productBatchID ?? 0) > 0) {
    //     const data = formState.transaction.details[formState.currentCell?.rowIndex ?? 0];
    //     const payload = {
    //       productBatchID: formState.currentCell?.data?.productBatchID,
    //       unitID: data?.unitID,
    //       unitName: data?.unit,
    //       priceCategoryID: formState.transaction.master.priceCategoryID ?? 0,
    //     };
    //     const queryParams = new URLSearchParams(payload as any).toString();
    //     const info = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/productInfo`, queryParams);
    //     setProductInfo(info);
    //     setLoading(false);
    //   }
    // };
    // fetch();
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const LoadingBar = styled("div")`
    height: 10px;
    width: ${(props) => `${Math.floor(Math.random() * 50) + 40}%`}; // Random width 40–90%
    border-radius: 3px;
    background: #e8e8e8;
    overflow: hidden;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: translate3d(-100%, 0, 0);
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: loading 0.8s infinite linear;
    }

    @keyframes loading {
      100% {
        transform: translate3d(100%, 0, 0);
      }
    }
  `;

  

  const renderItemDetailsTab = () => (
    <div className="space-y-2">
      {/* Basic Information */}
      <div className="p-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#3B82F6] pl-3">
          {t('basic_information')}
        </h6>
        <div className="flex flex-col gap-2 px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("product_name")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out text-right">{productInfo?.productName || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("product_code")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.productCode || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("group")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.groupName || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("category")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.productCategoryName || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("unit")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.unitName || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("item_type")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.itemType || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("brand")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.brandName || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("barcode")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.autoBarcode || '-'}</span>}
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
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("std_sales_price")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stdSalesPrice || 0}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("min_sale_price")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.minSalePrice || 0}</span>}
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
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("std_purchase_price")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stdPurchasePrice || 0}</span>}
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
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("current_stock")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stock || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("min_stock")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stockMin || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("max_stock")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stockMax || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("warehouse")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.warehouseName || '-'}</span>}
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
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("manufacturing_date")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.mfgDate || 'dd-mm-yyyy'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("expiry_date")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.expiryDate || '-'}</span>}
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out min-w-[120px]">{t("batch_no")}:</span>
            {loading? <LoadingBar />:<span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.batchNo || '-'}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="p-2">
      <div className="flex items-center justify-end mb-2">
        <button
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md hover:bg-gray-100 focus:outline-none transition duration-200"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-[252px] right-[9px] bg-white p-4 shadow-lg rounded-md z-10">
          <ERPCheckbox
            id="showCurrentCustomer"
            label={t("show_only_current_customer_transaction")}
            checked={showCurrentCustomer}
            onChange={(e) => setShowCurrentCustomer(e.target.checked)}
          />
          <ERPCheckbox
            id="showCurrentBatch"
            label={t("current_batch_transaction")}
            checked={showCurrentBatch}
            onChange={(e) => setShowCurrentBatch(e.target.checked)}
          />
          <ERPCheckbox
            id="showCurrentUnit"
            label={t("current_unit_transaction")}
            checked={showCurrentUnit}
            onChange={(e) => setShowCurrentUnit(e.target.checked)}
          />
        </div>
      )}
      <ERPTab
        tabs={subTabs}
        activeTab={activeSubTab}
        onClickTabAt={setActiveSubTab}
      >
        <SalesTab parm={parm} transactionType={transactionType} columns={columns} />
        <SalesOrderTab parm={parm} transactionType={transactionType} columns={columns} />
        <PurchaseTab parm={parm} transactionType={transactionType} columns={columns} />
        <PurchaseOrderTab parm={parm} transactionType={transactionType} columns={columns} />
      </ERPTab>
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
            className="dark:bg-dark-bg-card dark:text-[#f87171] dark:hover:bg-[#dc2626] dark:hover:text-white dark:focus:ring-[#f87171] bg-white text-[#ef4444] hover:bg-[#ef4444] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#fca5a5] transition-colors duration-200 p-2 rounded-full shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Name Display */}
        {formState && (
          <div className="w-full">
            <div className="dark:bg-dark-bg-card dark:border-dark-border p-4 bg-slate-200">
              <div className="flex items-stretch gap-2">
                <div className="product-image w-[60px] h-[60px] bg-slate-200">
                  {productInfo?.image ? (
                  <img
                    src={productInfo.image}
                    alt="Product"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-md">
                    <ImageIcon size={56} className="text-gray-400" />
                  </div>
                )}
                  {/* <img src={productInfo?.image ? productInfo.image : "https://loremipsum.imgix.net/4Yp1F82NF8yN9gUHXMphNz/c254302efb588196d9a607832cb24e28/lorem-picsum-1280x720.jpg?w=1920&q=60&auto=format,compress"} className="w-full h-full object-cover object-center" /> */}
                </div>
                <div className={`flex flex-col ${loading ? "gap-2" : "gap-1"}`}>
                  <h5 className="font-bold text-sm leading-tight dark:text-dark-text text-gray-900">
                    {loading?<LoadingBar/>:productInfo?.productName || "Product Name"}
                  </h5>
                  <p className="text-xs font-medium dark:text-dark-text-secondary dark:bg-dark-bg text-gray-600">
                    {loading?<LoadingBar/>:productInfo?.productCode || 'Product Code'}
                  </p>
                  <p className="text-xs font-medium dark:text-dark-text-secondary dark:bg-dark-bg text-gray-600">
                    {loading?<LoadingBar/>:productInfo?.unitName || 'Unit Name'}
                    <span className="text-transparent">Data is not available</span>
                    
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="overflow-hidden">
          <ERPTab tabs={tabs} activeTab={activeTab} onClickTabAt={handleTabClick}>
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