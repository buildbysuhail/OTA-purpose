import React, { Dispatch, SetStateAction, useState } from "react";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface ProductInformationSidebarProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  transactionType: string;
  productData?: ProductDisplayDto;
}

export interface ProductDisplayDto {
  productName: string;
  productCode: string;
  groupName: string;
  productCategoryName: string;
  unitName: string;
  stockMin: string;
  stockMax: string;
  itemType: string;
  mfgDate: string;
  expiryDate: string;
  batchNo: string;
  warehouseName: string;
  brandName: string;
  autoBarcode: string;
  stdSalesPrice: string;
  stdPurchasePrice: string;
  stock: string;
  minSalePrice: string;
}

const ProductInformationSidebar: React.FC<ProductInformationSidebarProps> = ({
  isOpen,
  onClose,
  transactionType,
  productData
}) => {
  const { t } = useTranslation("transaction");
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Item Details", "Transactions"];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const renderItemDetailsTab = () => (
    <div className="p-4 space-y-6">
      {/* Basic Information */}
      <div>
        <h6 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          {t('basic_information')}
        </h6>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Product Name:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.productName || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Product Code:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.productCode || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Group:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.groupName || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Category:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.productCategoryName || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Unit:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.unitName || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Item Type:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.itemType || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Brand:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.brandName || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Barcode:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.autoBarcode || '-'}</span>
          </div>
        </div>
      </div>

      {/* Sales Information */}
      <div>
        <h6 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          {t('sales_information')}
        </h6>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Std Sales Price:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.stdSalesPrice || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Min Sale Price:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.minSalePrice || '-'}</span>
          </div>
        </div>
      </div>

      {/* Purchase Information */}
      <div>
        <h6 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          {t('purchase_information')}
        </h6>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Std Purchase Price:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.stdPurchasePrice || '-'}</span>
          </div>
        </div>
      </div>

      {/* Stock Information */}
      <div>
        <h6 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          {t('stock_information')}
        </h6>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Current Stock:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.stock || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Min Stock:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.stockMin || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Max Stock:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.stockMax || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Warehouse:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.warehouseName || '-'}</span>
          </div>
        </div>
      </div>

      {/* Other Information */}
      <div>
        <h6 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          {t('other_information')}
        </h6>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Manufacturing Date:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.mfgDate || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Expiry Date:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.expiryDate || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">Batch No:</span>
            <span className="text-gray-800 text-sm font-medium">{productData?.batchNo || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="p-4">
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">Transaction history will be displayed here</p>
        <p className="text-xs mt-2">Transaction Type: {transactionType}</p>
      </div>
    </div>
  );

  return (
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={onClose} minWidth={400}>
      <div className="py-3 bg-gray-50 h-[94vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-4">
          <h6 className="font-semibold text-gray-800">{t("item_details")}</h6>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-[22px] h-[22px] p-1 rounded-full text-[12px] hover:shadow-lg transition-all duration-300 ease-in-out" />
          </button>
        </div>

        {/* Product Name Display */}
        {productData && (
          <div className="px-4 mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h5 className="font-semibold text-gray-800 text-lg">
                {productData.productName}
              </h5>
              <p className="text-sm text-gray-600">{productData.productCode}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-4 flex-1 overflow-hidden">
          <ERPTab
            tabs={tabs}
            activeTab={activeTab}
            onClickTabAt={handleTabClick}
          >
            <div className="overflow-y-auto max-h-[calc(94vh-200px)]">
              {activeTab === 0 ? renderItemDetailsTab() : renderTransactionsTab()}
            </div>
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