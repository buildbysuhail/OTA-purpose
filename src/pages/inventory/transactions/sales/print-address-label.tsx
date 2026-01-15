import React, { useState } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { TransactionFormState } from "../transaction-types";
import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";

interface PrintAddressLabelProps {
  closeModal: () => void;
  t: any;
  formState: TransactionFormState;
}
interface PrintAddressData{
  invTransactionMasterID: number;
  voucherNumber: string;
  orderNumber: string;
  orderDate: string;
  voucherType: string;
  grandTotal: number;
  transactionDate: string;
  partyCode: string;
  partyName: string;
  displayName: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  mobilePhone: string;
  contactPhone: string;
}

const api = new APIClient();
const PrintAddressLabel: React.FC<PrintAddressLabelProps> = ({ closeModal, t, formState }) => {
  const [gridData, setGridData] = useState<PrintAddressData[]>([]);
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
      caption: t("address_1"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address_2",
      caption: t("address2"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address3",
      caption: t("address_3"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address4",
      caption: t("address_4"),
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
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "orderNumber",
      caption: t("order_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "orderDate",
      caption: t("order_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
  ];

  const [voucherType, setVoucherType] = useState<string>("SI");
  const [voucherNumber, setVoucherNumber] = useState<string>("");
  const [notes, setNotes] = useState<{ notes1: string; notes2: string }>({notes1: "",notes2: "",});
  const [numOfLabels, setNumberOfLabels] = useState<number>(1)

  // Show button click function
  const handleClickShowBtn = async () =>{
    try{
      const response = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/VoucherDetailsForLabelPrint/${voucherType}/${voucherNumber}`);
      if(response.isOk){
        setGridData(response)
      }
    }catch{
      console.error("Error in fetching print label data")
    }
  }

  // Print button click function
  const handlePrintBtnClick = () => {
    alert("Need to manage this section")
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 w-full">
        <ERPDataCombobox
          id="voucherType"
          label={t("voucher_type")}
          options={[
            { value: "SI", label: t("sales_invoice") },
            { value: "SO", label: t("sales_order") },
          ]}
          value={voucherType}
          onChange={(opt: any) => setVoucherType(opt.value)}
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
          keyExpr="invTransactionMasterID"
          data={gridData}
          gridId="invTransactionMasterID"
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
      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-3">
        <ERPInput
          id="Notes1"
          label={t("notes_1")}
          placeholder={t("notes_1")}
          type="string"
          onChange={(e) =>
            setNotes(prev => ({
              ...prev, notes1: e.target.value,
          }))}
          value={notes.notes1}
        />
        <ERPInput
          id="Notes2"
          label={t("notes_2")}
          placeholder={t("notes_2")}
          type="string"
          onChange={(e) =>
            setNotes(prev => ({
              ...prev, notes2: e.target.value,
          }))}
          value={notes.notes2}
        />
      </div>
      <div className="w-full flex items-center justify-center my-2">
        <ERPInput
          id="NumLabels"
          label={t("no_of_labels")}
          placeholder={t("no_of_labels")}
          autoFocus={true}
          className="w-80"
          inputClassName="h-60"
          type="number"
          onChange={(e)=> setNumberOfLabels(Number(e.target.value))}
          value={numOfLabels}

        />
      </div>
      <div className="flex items-center justify-end gap-1">
        <ERPButton
          title={t("close")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          onClick={closeModal}
        />
        <ERPButton
          title={t("print")}
          variant="primary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          onClick={() => handlePrintBtnClick()}
        />
      </div>
    </>
  );
};

export default PrintAddressLabel;
