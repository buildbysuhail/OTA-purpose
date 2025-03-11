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

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  setIsOpen,
  isOpen,
  onClose,
  transactionType
  // data,
}) => {
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
            <div className="bg-white p-4 hover:bg-[#0f0f0f83] shadow-md transition-transform transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-r hover:from-[#dfe7f9] hover:to-[#f1f7ff] hover:ring-2 hover:ring-blue-300">
              <div className="w-full flex flex-row">
                <div className="w-1/2  flex items-center ">
                  <CalendarDays className="mr-1 w-4 h-4 text-gray-500 font-semibold !text-[10px]" />
                  <p className="text-gray-600 font-medium !text-[12px]">
                    {/* <CalendarDays /> */}
                    {new Date(
                      cellElement.data?.transactionDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="w-1/2  flex items-center justify-end ">
                  <p className="text-gray-800 font-medium">
                    {cellElement.data?.amount}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-gray-600 font-normal  overflow-hidden text-ellipsis whitespace-nowrap ">
                  {cellElement.data?.particulars}
                </p>
              </div>
            </div>
          );
        },
      },
    ],
    [t] // Dependency for columns
  );

  return (
    <ERPResizableSidebar isOpen={isOpen} setIsOpen={onClose} minWidth={400}>
      <div className="py-3 bg-gray-50 h-[94vh] ">
        {/* Header */}
        <div className="flex justify-between items-center mb-1 px-4">
          <h6 className=" font-semibold text-gray-800">Transaction History</h6>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-[22px] h-[22px] p-1 rounded-full text-[12px] hover:shadow-lg transition-all duration-300 ease-in-out" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* {isOpen && */}
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
            showColumnHeaderscustom={false}
            className="HistorySidebarcustom "
            ShowGridPreferenceChooser={false}
          />
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