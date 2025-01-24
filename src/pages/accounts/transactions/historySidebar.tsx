import React, { useMemo } from "react";
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
        allowSearch: true,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <div className="bg-white p-4 hover:bg-[#dfe7f9]">
              <div className="w-full flex flex-row">
                <div className="w-1/2  flex items-center ">
                  <CalendarDays className="mr-1 w-4 h-4 text-gray-500 font-semibold" />
                  <p className="text-gray-800 font-semibold ">
                    {new Date(cellElement.data?.transactionDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>
                <div className="w-1/2  flex items-center justify-end ">
                  <Banknote  className="mr-1 w-4 h-4 text-gray-500 font-semibold" />
                  <p className="text-gray-950 font-bold ">  {cellElement.data?.amount}</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-gray-800 font-semibold  overflow-hidden text-ellipsis whitespace-nowrap ">{cellElement.data?.particulars}</p>  
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
          <h6 className=" font-semibold text-gray-800">
            Transaction History
          </h6>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-[22px] h-[22px] p-1 rounded-full text-[12px] hover:shadow-lg transition-all duration-300 ease-in-out" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <ERPDevGrid
            columns={columns}
            dataUrl={`${urls.acc_transaction_base}${formState.transactionType}/List/`}
            // dataUrl={urls.account_group}
            method={ActionType.GET}
            gridHeader={t("transactions")}
            gridId="transaction-grid"
            remoteOperations={{paging: true, filtering: true,sorting: true}}
            gridAddButtonIcon="ri-add-line"
            pageSize={40}
            allowExport={true}
            hideDefaultExportButton={true}
            hideDefaultSearchPanel={false}
            allowSearching={false}
            hideGridAddButton={true}
            hideGridHeader={true}
            showColumnHeaderscustom={false}
            className="HistorySidebarcustom "
            ShowGridPreferenceChooser={false}
          />
        </div>
      </div>
    </ERPResizableSidebar>
  );
};

export default React.memo(HistorySidebar, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen && prevProps.onClose === nextProps.onClose;
});