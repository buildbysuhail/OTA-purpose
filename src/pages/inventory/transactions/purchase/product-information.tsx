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
          priceCategorID: formState.transaction.master.priceCategoryID
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
        <h6 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#3B82F6] pl-3">
          {t('basic_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 hover:transition-all duration-300 ease-in-out hover:shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Product Name:</span>
            <span className="text-xs font-mono">{productInfo?.productName || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Product Code:</span>
            <span className="text-xs font-mono">{productInfo?.productCode || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Group:</span>
            <span className="text-xs font-mono">{productInfo?.groupName || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Category:</span>
            <span className="text-xs font-mono">{productInfo?.productCategoryName || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Unit:</span>
            <span className="text-xs font-mono">{productInfo?.unitName || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Item Type:</span>
            <span className="text-xs font-mono">{productInfo?.itemType || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Brand:</span>
            <span className="text-xs font-mono">{productInfo?.brandName || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Barcode:</span>
            <span className="text-xs font-mono">{productInfo?.autoBarcode || '-'}</span>
          </div>
        </div>
      </div>

      {/* Sales Information */}
      <div className="pb-3">
        <h6 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#22C55E] pl-3">
          {t('sales_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 hover:transition-all duration-300 ease-in-out hover:shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Std Sales Price:</span>
            <span className="text-xs font-mono">{productInfo?.stdSalesPrice || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Min Sale Price:</span>
            <span className="text-xs font-mono">{productInfo?.minSalePrice || 0}</span>
          </div>
        </div>
      </div>

      {/* Purchase Information */}
      <div className="pb-3">
        <h6 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#F97316] pl-3">
          {t('purchase_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 hover:transition-all duration-300 ease-in-out hover:shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Std Purchase Price:</span>
            <span className="text-xs font-mono">{productInfo?.stdPurchasePrice || 0}</span>
          </div>
        </div>
      </div>

      {/* Stock Information */}
      <div className="pb-3">
        <h6 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#A855F7] pl-3">
          {t('stock_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 hover:transition-all duration-300 ease-in-out hover:shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Current Stock:</span>
            <span className="text-xs font-mono">{productInfo?.stock || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Min Stock:</span>
            <span className="text-xs font-mono">{productInfo?.stockMin || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Max Stock:</span>
            <span className="text-xs font-mono">{productInfo?.stockMax || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Warehouse:</span>
            <span className="text-xs font-mono">{productInfo?.warehouseName || '-'}</span>
          </div>
        </div>
      </div>

      {/* Other Information */}
      <div className="">
        <h6 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-widest border-l-4 border-[#6366F1] pl-3">
          {t('other_information')}
        </h6>
        <div className="flex flex-col gap-2 rounded-md shadow-sm px-3 py-2 hover:transition-all duration-300 ease-in-out hover:shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Manufacturing Date:</span>
            <span className="text-xs font-mono">{productInfo?.mfgDate || 'dd-mm-yyyy'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Expiry Date:</span>
            <span className=" text-xs font-mono">{productInfo?.expiryDate || '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs font-medium">Batch No:</span>
            <span className=" text-xs font-mono">{productInfo?.batchNo || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="p-2">
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-15 h-15 rounded-full mb-4 shadow-lg" style={{ backgroundColor: '#f8fafc', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-2 text-gray-900">Transaction History</h3>
        <p className="text-gray-600 text-sm mb-3">Transaction details will be displayed here</p>
        <div className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-600">
          Transaction Type: {transactionType}
        </div>
      </div>
    </div>
  );

  return (
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={onClose} minWidth={400}>
      <div className="py-3 h-[94vh] bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 px-3">
          <h6 className="font-bold text-xl tracking-tight text-gray-900">{t("item_details")}</h6>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-white p-2 rounded-full shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Name Display */}
        {formState && (
          <div className="px-3 mb-3">
            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
              <h5 className="font-bold text-lg mb-2 leading-tight text-gray-900">
                {productInfo?.productName || "Product Name"}
              </h5>
              <p className="text-sm font-mono inline-block px-3 py-1 rounded-lg text-gray-600 bg-gray-100">
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