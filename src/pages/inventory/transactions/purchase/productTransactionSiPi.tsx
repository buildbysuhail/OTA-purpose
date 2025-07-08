import React, { useState } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../../redux/urls";
interface PurchaseDetailsGrid {
  id: string;
  date: string;
  refNo: string;
  party: string;
  qty: number;
  cost: number;
  description: string;
  beforeAddamount: number;
  xRate: number;
  netItemCost: number;
  unitName: string;
  rateWithTax: number;
  disc: number;
  vat: number;
  netRate: number;
  productDescription: string;
  mrp: number;
}

interface SalesDetailsGrid {
  id: string;
  date: string;
  refNo: string;
  party: string;
  qty: number;
  cost: number;
  description: string;
  beforeAddamount: number;
  xRate: number;
  netItemCost: number;
  unitName: string;
  rateWithTax: number;
  disc: number;
  vat: number;
  netRate: number;
  billNumber: string;
  mrp: number;
}

interface ProductTransactionSiPiModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const ProductTransactionSiPiModal: React.FC<
  ProductTransactionSiPiModalProps
> = ({ isOpen, onClose, t }) => {
  const [showSelectedPartyOnly, setShowSelectedPartyOnly] = useState(false);

  const purchaseColumns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 66,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 48,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 194,
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 64,
    },
    {
      dataField: "cost",
      caption: t("cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 59,
    },
    {
      dataField: "description",
      caption: t("description"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 73,
    },
    {
      dataField: "beforeAddAmount",
      caption: t("before_add_amount"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 114,
    },
    {
      dataField: "xRate",
      caption: t("x_rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "netItemCost",
      caption: t("net_item_cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "unitName",
      caption: t("unit_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "rateWithTax",
      caption: t("rate_with_tax"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "disc",
      caption: t("disc"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "netRate",
      caption: t("net_rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
  ];

  const salesColumns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 74,
    },
    {
      dataField: "billNumber",
      caption: t("bill_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 62,
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 194,
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 72,
    },
    {
      dataField: "rate",
      caption: t("rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 52,
    },
    {
      dataField: "cost",
      caption: t("cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "xRate",
      caption: t("x_rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "netItemCost",
      caption: t("net_item_cost"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "unitName",
      caption: t("unit_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "rateWithTax",
      caption: t("rate_with_tax"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "disc",
      caption: t("disc"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "vat",
      caption: t("vat"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "netRate",
      caption: t("net_rate"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "productDescription",
      caption: t("product_description"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      width: 100,
    },
    {
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      width: 100,
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      width: 100,
    },
  ];

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("product_transaction_si_pi")}
      width={1400}
      height={700}
      content={
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ERPCheckbox
                id="showSelectedPartyOnly"
                label={t("show_selected_party_details_only")}
                checked={showSelectedPartyOnly}
                onChange={() =>
                  setShowSelectedPartyOnly(!showSelectedPartyOnly)
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <ErpDevGrid
                columns={purchaseColumns}
                dataUrl={`${Urls.inv_transaction_base}ProductTransaction/PI/`}
                gridId="purchaseDetailsGrid"
                height={280}
                gridHeader={t("purchase_details")}
                hideGridAddButton={true}
                columnHidingEnabled={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                hideGridHeader={false}
                enablefilter={false}
                remoteOperations={false}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
              />
              <ErpDevGrid
                columns={salesColumns}
                dataUrl={`${Urls.inv_transaction_base}ProductTransaction/SI/`}
                gridId="salesDetailsGrid"
                height={280}
                gridHeader={t("sales_details")}
                hideGridAddButton={true}
                columnHidingEnabled={true}
                hideDefaultExportButton={true}
                hideDefaultSearchPanel={true}
                allowSearching={false}
                allowExport={false}
                hideGridHeader={false}
                enablefilter={false}
                remoteOperations={false}
                enableScrollButton={false}
                ShowGridPreferenceChooser={false}
                showPrintButton={false}
              />
            </div>
          </div>
        </>
      }
    />
  );
};

export default ProductTransactionSiPiModal;
