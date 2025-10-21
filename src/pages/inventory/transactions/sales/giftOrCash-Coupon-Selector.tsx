import React from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
// import Urls from "../../../../redux/urls";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";

interface GiftOrCashCouponSelectorProps {
  closeModal: () => void;
  t: any;
}

const GiftOrCashCouponSelector: React.FC<GiftOrCashCouponSelectorProps> = ({
  closeModal,
  t,
}) => {
  //   const formState = useSelector((state: RootState) => state.InventoryTransaction);
  //   const dispatch = useDispatch()

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "Empty",
      caption: t("Empty"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "Type",
      caption: t("type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "C. Number",
      caption: t("display_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "Amount",
      caption: t("display_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "Action",
      caption: t("Action"),
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
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col text-blue-700">
            <div>Bill Amt</div>
            <div>0.00</div>
          </div>
          <ERPInput
            type="number"
            id={"Coupon/Card Number"}
            className="w-60"
            label={t("Coupon/Card_Number")}
          />
          <ERPInput
            type="number"
            id={"Amount"}
            className="w-60"
            label={t("amount")}
          />
          <ERPButton
            title={t("+")}
            variant="primary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
        </div>
        <div className="flex flex-row justify-around w-full">
          <div className="text-red-700">CardId</div>
          <div className="text-red-700">Name</div>
          <div className="text-red-700">Type</div>
          <div className="text-red-700">OB</div>
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
          <div>TOTAL</div>
          <div>0.00</div>
        </div>
        <div className="flex flex-row justify-between w-full">
          <ERPButton
            title={t("Cancel")}
            variant="secondary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
          <ERPButton
            title={t("Apply")}
            variant="primary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
        </div>
      </div>
    </>
  );
};

export default GiftOrCashCouponSelector;
