import React, { useState } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { TransactionFormState } from "../transaction-types";

interface PrintAddressLabelProps {
  closeModal: () => void;
  t: any;
  formState: TransactionFormState;
}

const PrintAddressLabel: React.FC<PrintAddressLabelProps> = ({ closeModal, t, formState }) => {
  //   const formState = useSelector((state: RootState) => state.InventoryTransaction);
  //   const dispatch = useDispatch()
  const gridColumns: DevGridColumn[] = [
    {
      dataField: "partyCode",
      caption: t("party_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "displayName",
      caption: t("display_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address3",
      caption: t("address3"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address4",
      caption: t("address4"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "contactPhone",
      caption: t("contact_phone"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      visible: formState.transaction.master?.voucherType === "SO" ? true : false,
    },
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      visible: formState.transaction.master?.voucherType === "SO" ? true : false,
    },
    {
      dataField: "orderNumber",
      caption: t("order_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      visible: formState.transaction.master?.voucherType !== "SO" ? true : false,
    },
    {
      dataField: "orderDate",
      caption: t("order_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      visible: formState.transaction.master?.voucherType !== "SO" ? true : false,
    },
  ];

  const [voucherType, setVoucherType] = useState<string>("SI");
  const [voucherNumber, setVoucherNumber] = useState<string>("");

  const handleClickShowBtn =()=>{
    
  }

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <ERPDataCombobox
          id="voucherType"
          label={t("voucher_type")}
          options={[
            { value: "SI", label: t("sales_invoice") },
            { value: "SO", label: t("sales_order") },
          ]}
          value={voucherType}
          onChange={(val: string) => setVoucherType(val)}
        />
        <ERPInput
          id="voucherNumber"
          type="number"
          className="w-60"
          label={t("voucher_number")}
          value={voucherNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setVoucherNumber(e.target.value)
          }
        />
        <ERPButton
          title={t("show")}
          variant="primary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          onClick={()=> handleClickShowBtn()}
        />
      </div>
      <div className="my-2">
        <ErpDevGrid
          columns={gridColumns}
          keyExpr="cardID"
          // data={couponRows}
          //   dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/LedgerList/${salesRoute && mainSalesRoute ? mainSalesRoute : 0}`}
          gridId="ledgerDetailsGrid"
          height={200}
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
          selectionMode="single"
          keyboardNavigation={{
            editOnKeyPress: false,
            enabled: true,
            enterKeyDirection: "row",
          }}
        />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <ERPInput
          id=""
          type="text"
          labelDirection="horizontal"
          label={t('notes_1')}
          className="w-80"
        />
        <ERPInput
          id=""
          type="text"
          labelDirection="horizontal"
          label={t('notes_2')}
          className="w-80"
        />
        <ERPInput
          id="noOfLabels"
          labelDirection="horizontal"
          label={t('no_of_labels')}
          type="text"
          className="w-40"
        />
      </div>
      <div className="flex items-center justify-end gap-1">
        <ERPButton
          title={t("print")}
          variant="primary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
        />
        <ERPButton
          title={t("close")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
        />
      </div>
    </>
  );
};

export default PrintAddressLabel;
