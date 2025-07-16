import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { ProductDisplayDto, TransactionFormState } from "./transaction-types";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { initialProductDisplayData } from "./transaction-type-data";

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
  formState
}) => {
  const { t } = useTranslation("transaction");
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Item Details", "Transactions"];
  const [productInfo, setProductInfo] = useState<ProductDisplayDto>(initialProductDisplayData);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      if ((formState.currentCell?.rowIndex ?? 0) >= 0 && (formState.currentCell?.productBatchID ?? 0) > 0) {

        const data = formState.transaction.details[formState.currentCell?.rowIndex ?? 0]
        const payload = {
          productBatchID: formState.currentCell?.productBatchID,
          unitID: data?.unitID,
          unitName: data.unit,
          priceCategoryID: formState.transaction.master.priceCategoryID ?? 0
        }
        const queryParams = new URLSearchParams(payload as any).toString();
        const info = await api.getAsync(`${Urls.inv_transaction_base}${transactionType}/productInfo`, queryParams)
        setProductInfo(info);
        setLoading(false);
      }
    }
    fetch()
  }, [])

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const renderItemDetailsTab = () => (
    <div className="p-2 space-y-3">
      {/* Basic Information */}
      <div className="pb-3">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#3B82F6] pl-3">
          {t('basic_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 hover:transition-all duration-300 ease-in-out hover:shadow-md dark:bg-dark-bg-card dark:border-dark-border bg-white border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Product Name:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.productName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Product Code:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.productCode || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Group:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.groupName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Category:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.productCategoryName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Unit:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.unitName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Item Type:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.itemType || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Brand:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.brandName || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Barcode:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.autoBarcode || '-'}</span>
          </div>
        </div>
      </div>

      {/* Sales Information */}
      <div className="pb-3">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#22C55E] pl-3">
          {t('sales_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Std Sales Price:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stdSalesPrice || 0}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Min Sale Price:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.minSalePrice || 0}</span>
          </div>
        </div>
      </div>

      {/* Purchase Information */}
      <div className="pb-3">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#F97316] pl-3">
          {t('purchase_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Std Purchase Price:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stdPurchasePrice || 0}</span>
          </div>
        </div>
      </div>

      {/* Stock Information */}
      <div className="pb-3">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#A855F7] pl-3">
          {t('stock_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Current Stock:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stock || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Min Stock:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stockMin || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Max Stock:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.stockMax || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Warehouse:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.warehouseName || '-'}</span>
          </div>
        </div>
      </div>

      {/* Other Information */}
      <div className="">
        <h6 className="font-bold dark:text-dark-text text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#6366F1] pl-3">
          {t('other_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 dark:bg-dark-bg-card dark:border-dark-border bg-white border">
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Manufacturing Date:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.mfgDate || 'dd-mm-yyyy'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Expiry Date:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.expiryDate || '-'}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="dark:text-dark-text-secondary text-gray-600 text-xs font-medium group-hover:font-bold transition-all duration-300 ease-in-out">Batch No:</span>
            <span className="dark:text-dark-text text-xs font-mono group-hover:font-bold transition-all duration-300 ease-in-out">{productInfo?.batchNo || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="p-2">
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-15 h-15 rounded-full mb-4 shadow-lg dark:bg-dark-bg-card dark:shadow-dark-shadow" style={{ backgroundColor: '#f8fafc', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <svg className="w-7 h-7 dark:text-dark-text-secondary text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-2 dark:text-dark-text text-gray-900">Transaction History</h3>
        <p className="dark:text-dark-text-secondary text-gray-600 text-sm mb-3">Transaction details will be displayed here</p>
        <div className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide dark:bg-dark-bg-card dark:text-dark-text-secondary bg-gray-100 text-gray-600">
          Transaction Type: {transactionType}
        </div>
      </div>
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
            className="dark:bg-dark-bg-card dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-400 bg-white text-[#ef4444] hover:bg-[#ef4444] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#fca5a5] transition-colors duration-200 p-2 rounded-full shadow-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Name Display */}
        {formState && (
          <div className="px-3 mb-3">
            <div className="dark:bg-dark-bg-card dark:border-dark-border bg-white rounded-lg p-4 shadow-lg border border-gray-200">
              <h5 className="font-bold text-lg mb-2 leading-tight dark:text-dark-text text-gray-900">
                {productInfo?.productName || "Product Name"}
              </h5>
              <p className="text-sm font-mono inline-block px-3 py-1 rounded-lg dark:text-dark-text-secondary dark:bg-dark-bg text-gray-600 bg-gray-100">
                {productInfo?.productCode || 'Product Code'}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-3 flex-1 overflow-hidden">
          <ERPTab
            tabs={tabs}
            activeTab={activeTab}
            onClickTabAt={handleTabClick}
          >
            {renderItemDetailsTab()}
            {renderTransactionsTab()}
          </ERPTab>
        </div>
      </div>
    </ERPResizableSidebar>
  );
};

export default React.memo(ProductInformationSidebar, (prevProps, nextProps) => {
  // Allow re-render only when `isOpen` transitions from false to true
  if (!prevProps.isOpen && nextProps.isOpen) {
    return false; // Re-render when opening
  }
  // Prevent re-renders for other cases
  return prevProps.isOpen === nextProps.isOpen;
});