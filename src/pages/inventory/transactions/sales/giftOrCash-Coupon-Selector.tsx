import React from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { Plus } from "lucide-react";

interface GiftOrCashCouponSelectorProps {
  closeModal: () => void;
  t: any;
}

const GiftOrCashCouponSelector: React.FC<GiftOrCashCouponSelectorProps> = ({ closeModal, t, }) => {
  //   const formState = useSelector((state: RootState) => state.InventoryTransaction);
  //   const dispatch = useDispatch()
  const gridColumns: DevGridColumn[] = [
    {
      dataField: "type",
      caption: t("type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "name",
      caption: t("name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "cNumber",
      caption: t("c_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "Action",
      caption: t("x"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 px-4">
        <div className="flex items-end justify-between w-full">
          <div className="flex items-end text-blue-700">
            <div>{t('bill_amount')} :</div>
            <div> 0.00</div>
          </div>
          <ERPInput
            id="couponCardNumber"
            type="number"
            className="w-60"
            label={t("coupon_card_number")}
          />
          <ERPInput
            id="amount"
            type="number"
            className="w-60"
            label={t("amount")}
          />
          <div>
            <button
              className="p-2 rounded-md 
               bg-blue-600 text-white 
               border border-blue-300 
               shadow-sm
               transition-all duration-200 
               flex items-center justify-center
               hover:bg-white hover:text-blue-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

        </div>
        <div className="flex flex-row justify-around w-full">
          <div className="text-[#ff0000] font-medium">{t('card_id')}</div>
          <div className="text-[#ff0000] font-medium">{t('name')}</div>
          <div className="text-[#ff0000] font-medium">{t('type')}</div>
          <div className="text-[#ff0000] font-medium">{t('ob')}</div>
        </div>
        <div className="">
          <ErpDevGrid
            columns={gridColumns}
            //   dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/LedgerList/${salesRoute && mainSalesRoute ? mainSalesRoute : 0}`}
            gridId="ledgerDetailsGrid"
            height={400}
            hideGridAddButton={true}
            columnHidingEnabled={true}
            hideDefaultExportButton={true}
            hideDefaultSearchPanel={true}
            allowSearching={false}
            allowExport={false}
            hideGridHeader={false}
            enablefilter={false}
            hideToolbar={true}
            remoteOperations={false}
            enableScrollButton={false}
            ShowGridPreferenceChooser={false}
            showPrintButton={false}
            focusedRowEnabled={true}
            tabIndex={0}
            //   onContentReady={handleLedgerContentReady}
            //   onRowClick={handleRowClick}
            //   onKeyDown={handleKeyDown}
            selectionMode="single"
            keyboardNavigation={{
              editOnKeyPress: false,
              enabled: true,
              enterKeyDirection: "row",
            }}
          />
        </div>
        <div className="w-full flex flex-row justify-end gap-4 font-bold text-lg px-2 text-blue-700">
          <div>{t('total')}</div>
          <div>0.00</div>
        </div>
        <div className="flex items-center justify-end gap-2 w-full">
          <ERPButton
            title={t("apply")}
            variant="primary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
          <ERPButton
            title={t("cancel")}
            variant="secondary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
        </div>
      </div>
    </>
  );
};

export default GiftOrCashCouponSelector;
