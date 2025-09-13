import React, { Dispatch, SetStateAction, useMemo } from "react";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import ERPResizableSidebar from "../../../components/ERPComponents/erp-resizable-sidebar";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import urls from "../../../redux/urls";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { ActionType } from "../../../redux/types";
import { useTranslation } from "react-i18next";
import { Banknote, CalendarDays, X } from "lucide-react";

interface HistorySidebarProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  onClose: () => void;
  transactionType: string;
  // data: any;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ setIsOpen, isOpen, onClose, transactionType }) => {
  const { t } = useTranslation("transaction");
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "actions",
        caption: t("Actions"),
        allowSearch: true,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <div className="bg-gradient-to-br from-white to-gray-50/80 p-3 border border-gray-100/60 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-gradient-to-br hover:from-blue-50/90 hover:to-indigo-50/80 hover:border-blue-200/40 backdrop-blur-sm group !w-full">
              <div className="w-full flex flex-row">
                <div className="w-1/2 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                  <p className="text-gray-700 font-medium text-xs tracking-wide group-hover:text-gray-900 transition-colors duration-300">
                    {new Date(
                      cellElement.data?.transactionDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="w-1/2 flex items-center justify-end">
                  <div className="px-2.5 py-1 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100 group-hover:from-emerald-100 group-hover:to-green-100 group-hover:border-emerald-200 transition-all duration-300">
                    <p className="text-emerald-700 font-semibold text-sm group-hover:text-emerald-800 transition-colors duration-300">
                      {cellElement.data?.amount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-gray-100/80 group-hover:border-blue-200/60 transition-colors duration-300">
                <p className="text-gray-600 font-normal text-sm leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-gray-800 transition-colors duration-300">
                  {cellElement.data?.particulars}
                </p>
              </div>
            </div>
          );
        },
      },
    ], [t]
  );

  return (
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={onClose} minWidth={400}>
      <div className="py-4 bg-gradient-to-br from-gray-50/95 to-white/98 h-[94vh] backdrop-blur-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <h6 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent tracking-tight">
              {t('transaction_history')}
            </h6>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-white/80 hover:bg-gray-100/90 rounded-full border border-gray-200/60 hover:border-gray-300/80 shadow-sm hover:shadow-md transition-all duration-300 ease-out hover:scale-105 backdrop-blur-sm group">
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 ease-out" />
          </button>
        </div>

        {/* Content */}
        <div className="px-2">
          {/* {isOpen && */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
            <ERPDevGrid
              columns={columns}
              dataUrl={`${urls.acc_transaction_base}${transactionType}/List/`}
              method={ActionType.GET}
              // postData={{voucherType: voucherType, transactionType: transactionType}}
              gridHeader={t("transactions")}
              gridId="transaction-grid"
              remoteOperations={{ paging: true, filtering: true, sorting: true }}
              gridAddButtonIcon="ri-add-line"
              pageSize={40}
              allowExport={true}
              hideDefaultExportButton={true}
              // showFilterRow ={false}
              hideDefaultSearchPanel={false}
              allowSearching={false}
              hideGridAddButton={true}
              hideGridHeader={true}
              showColumnHeaders={false}
              className="HistorySidebarcustom"
              ShowGridPreferenceChooser={false}
            />
          </div>
          {/* } */}
          {/* Transaction Date */}
        </div>
      </div>
    </ERPResizableSidebar>
  );
};
export default React.memo(HistorySidebar, (prevProps, nextProps) => {
  // Allow re-render only when `isOpen` transitions from false to true
  if (!prevProps.isOpen && nextProps.isOpen) {
    return false; // Re-render when opening
  }

  // Prevent re-renders for other cases
  return prevProps.isOpen === nextProps.isOpen;
});