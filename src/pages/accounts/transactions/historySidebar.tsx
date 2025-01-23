import React, { useMemo } from "react";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import ERPResizableSidebar from "../../../components/ERPComponents/erp-resizable-sidebar";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import urls from "../../../redux/urls";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { ActionType } from "../../../redux/types";
import { useTranslation } from "react-i18next";

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // data: any;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  // data,
}) => {
  const { t } = useTranslation('transaction');
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const columns: DevGridColumn[] = useMemo(
    () => [
     
      {
        dataField: "actions",
        caption: t("Actions"),
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <div className="bg-white p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Transaction Datedsds
            </label>
            <p className="text-gray-800 font-semibold">
            {cellElement.data?.particulars}
            {cellElement.data?.amount}
            {cellElement.data?.transactionDate}
            </p>
          </div>
          );
        },
      },
    ],
    []
  );
  return (
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={onClose} minWidth={400}>
      <div className="py-6 bg-gray-50 h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Transaction History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
        <ERPDevGrid
                columns={columns}
                dataUrl={`${urls.acc_transaction_base}${formState.transactionType}/List/`}
                method={ActionType.GET}
                // postData={{voucherType: voucherType, transactionType: transactionType}} 
                gridHeader={t("transactions")}
                gridId="transaction-grid"
                remoteOperations={{paging: true, filtering: true,sorting: true}}
                gridAddButtonIcon="ri-add-line"
                pageSize={40}
                allowExport={true}
                hideDefaultExportButton={true}
                // showFilterRow ={false}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                hideGridAddButton={true}
                hideGridHeader={true}
                GridPreferenceChoosertrue={false}
              />
          {/* Transaction Date */}
       
        </div>
      </div>
    </ERPResizableSidebar>
  );
};

export default HistorySidebar;
