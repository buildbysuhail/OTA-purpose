import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import ERPDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import ERPResizableSidebar from "../../../../components/ERPComponents/erp-resizable-sidebar";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import urls from "../../../../redux/urls";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { ActionType } from "../../../../redux/types";
import { useTranslation } from "react-i18next";
import { X, Receipt } from "lucide-react";
import { useSelector } from "react-redux";

interface HistorySidebarProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  transactionType: string;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ setIsOpen, isOpen, onClose, transactionType }) => {
  const { t } = useTranslation("transaction");
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Dynamic initial width calculation
  const calculateInitialWidth = (isMobile: boolean) => {
    const screenWidth = window.innerWidth;
    return isMobile ? Math.min(350, screenWidth * 0.9) : Math.min(410, screenWidth * 0.3);
  };

  const rightInitialWidth = calculateInitialWidth(deviceInfo.isMobile);

  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "actions",
        caption: " ",
        allowSearch: true,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 1000,
        cellRender: (cellElement: any) => {
          const transactionDate = new Date(cellElement.data?.transactionDate);
          const formattedDate = transactionDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return (
            <div 
              className="relative group bg-gradient-to-br from-[#ffffff] via-[#f8fafc]/80 to-[#eff6ff]/30 dark:from-[#0f172a] dark:via-[#1e293b]/90 dark:to-[#1e40af]/20 p-4 border border-[#e2e8f0]/60 dark:border-[#334155]/60 shadow-sm hover:shadow-lg hover:shadow-[#3b82f6]/10 dark:hover:shadow-[#60a5fa]/5 transition-all duration-300 hover:border-[#3b82f6]/60 dark:hover:border-[#60a5fa]/40 backdrop-blur-sm overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedTransaction(cellElement.data);
                setIsDetailsOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#eff6ff]/20 to-transparent dark:via-[#1e40af]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-full group-hover:translate-x-0"></div>
              <div className="relative z-10">
                <div className="flex flex-col">
                  <p className="text-[#0f172a] dark:text-[#f1f5f9] font-bold text-sm uppercase truncate max-w-xs cursor-pointer hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-1" title={cellElement.data?.partyName}>
                    {cellElement.data?.partyName?.length > 45 ? cellElement.data.partyName.slice(0, 45) + "..." : cellElement.data?.partyName}
                  </p>
                  <div className="flex justify-between items-end">
                    <p className="text-[#64748b] dark:text-[#94a3b8] text-xs mt-1.5 font-medium">
                      <span className="inline-flex items-center bg-gradient-to-r from-[#dbeafe] to-[#c7d2fe] dark:from-[#1e40af]/50 dark:to-[#312e81]/50 text-[#2563eb] dark:text-[#60a5fa] px-2 py-0.5 rounded-full text-xs font-semibold border border-[#bfdbfe]/50 dark:border-[#1e40af]/50 shadow-sm">  {cellElement.data?.voucherNumber || "N/A"}</span>
                      <span className="mx-2 text-[#e2e8f0] dark:text-[#334155]">•</span>
                      <span className="text-[#64748b] dark:text-[#94a3b8]">  {formattedDate}</span>
                    </p>
                    <p className="text-[#64748b] dark:text-[#94a3b8] font-medium text-sm">
                      {t("grand_total")}:
                      <span className="font-bold text-[#059669] dark:text-[#34d399] text-base">  ₹{cellElement.data?.grandTotal?.toFixed(2) || "0.00"}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff1a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-0"></div>
            </div>
          );
        },
      },
    ],
    [t]
  );

  return (
    <>
      <ERPResizableSidebar 
        isOpen={isOpen} 
        setIsOpen={onClose} 
        minWidth={400} 
        initialWidth={rightInitialWidth}
        position="right"
      >
        <div className="h-[94vh] bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f1f5f9]/80 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]/90 transition-all duration-300 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#eff6ff]/20 via-transparent to-[#f3e8ff]/20 dark:from-[#1e3a8a]/10 dark:via-transparent dark:to-[#6d28d9]/10"></div>
            <div className="absolute top-1/4 right-0 w-32 h-32 bg-gradient-radial from-[#bfdbfe]/20 to-transparent dark:from-[#1e40af]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-0 w-40 h-40 bg-gradient-radial from-[#e9d5ff]/20 to-transparent dark:from-[#7c3aed]/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>

          {/* Header */}
          <div className="sticky top-0 z-20 relative bg-[#ffffff] dark:bg-[#0f172a] backdrop-blur-md border-b border-[#e5e7eb] dark:border-[#334155] px-6 py-4 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#3b82f6]/5 before:to-[#a78bfa]/5 dark:before:from-[#60a5fa]/5 dark:before:to-[#a78bfa]/5">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#dbeafe] to-[#c7d2fe] dark:from-[#1e40af]/40 dark:to-[#312e81]/40 text-[#2563eb] dark:text-[#60a5fa] shadow-sm border border-[#bfdbfe]/50 dark:border-[#1e40af]/50 transform hover:scale-110 transition-transform duration-200">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-lg font-bold bg-gradient-to-r from-[#0f172a] to-[#334155] dark:from-[#f1f5f9] dark:to-[#cbd5e1] bg-clip-text text-transparent">{t('transaction_history')}</h6>
                  <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5 font-medium bg-[#f1f5f9]/50 dark:bg-[#1e293b]/50 px-2 py-0.5 rounded-md border border-[#e2e8f0]/50 dark:border-[#334155]/50">{transactionType} {t('transactions_sidebar')}</p>
                </div>
              </div>

              <button onClick={onClose} className=" group relative p-2 rounded-full text-[#64748b] hover:text-[#334155] dark:text-[#64748b] dark:hover:text-[#f1f5f9] bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] hover:from-[#fee2e2] hover:to-[#fecaca] dark:from-[#1e293b] dark:to-[#334155] dark:hover:from-[#7f1d1d]/50 dark:hover:to-[#b91c1c]/50 transition-all duration-300 hover:scale-110 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-[#fca5a5]/50 dark:focus:ring-[#ef4444]/50 shadow-sm hover:shadow-md border border-[#e2e8f0]/50 dark:border-[#64748b]/50">
                <X className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative z-10">
            <ERPDevGrid
              columns={columns}
              dataUrl={`${urls.inv_transaction_base}${transactionType}/List/`}
              method={ActionType.GET}
              gridHeader={t("transactions")}
              gridId="transaction-grid"
              className="HistorySidebarcustom bg-[#ffffffcc] dark:bg-[#0f172acc] backdrop-blur-sm dark:text-[#f1f5f9] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
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
              height={761}
            />
          </div>
        </div>
      </ERPResizableSidebar>

  {/* Details Sidebar on Left */}
  {isDetailsOpen && (
    <ERPResizableSidebar
      isOpen={isDetailsOpen}
      setIsOpen={setIsDetailsOpen}
      position="left"
      initialWidth={
        deviceInfo.isMobile
          ? window.innerWidth * 0.9
          : window.innerWidth - rightInitialWidth // take rest of the space
      }
      minWidth={600}
      maxWidth={window.innerWidth} // Allow full width to "cover" if resized
      zIndex={54} // Higher z-index to overlay right if expanded
    >
      <div className="p-4 relative h-full">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">Transaction Details</h2>
          <button
            onClick={() => setIsDetailsOpen(false)}
            className="group relative p-2 rounded-full text-[#64748b] hover:text-[#334155] 
              dark:text-[#64748b] dark:hover:text-[#f1f5f9] 
              bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] 
              hover:from-[#fee2e2] hover:to-[#fecaca] 
              dark:from-[#1e293b] dark:to-[#334155] 
              dark:hover:from-[#7f1d1d]/50 dark:hover:to-[#b91c1c]/50 
              transition-all duration-300 hover:scale-110 hover:rotate-90 
              focus:outline-none focus:ring-2 focus:ring-[#fca5a5]/50 
              dark:focus:ring-[#ef4444]/50 shadow-sm hover:shadow-md 
              border border-[#e2e8f0]/50 dark:border-[#64748b]/50"
          >
            <X className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>

        {/* Details Content */}
        {selectedTransaction ? (
          <div className="space-y-2">
            <p><strong>Party Name:</strong> {selectedTransaction.partyName}</p>
            <p><strong>Voucher Number:</strong> {selectedTransaction.voucherNumber}</p>
            <p><strong>Date:</strong> {new Date(selectedTransaction.transactionDate).toLocaleDateString()}</p>
            <p><strong>Grand Total:</strong> ₹{selectedTransaction.grandTotal?.toFixed(2)}</p>
            {/* Add more details or fetch additional data here */}
          </div>
        ) : (
          <p>No transaction selected.</p>
        )}
      </div>
    </ERPResizableSidebar>
  )}

    </>
  );
};

export default React.memo(HistorySidebar, (prevProps, nextProps) => {
  if (!prevProps.isOpen && nextProps.isOpen) {
    return false;
  }
  return prevProps.isOpen === nextProps.isOpen;
});