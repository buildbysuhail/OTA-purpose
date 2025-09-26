import React, { useState } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
interface ItemListModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const ItemListModal: React.FC<ItemListModalProps> = ({ isOpen, onClose, t, }) => {
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const gridColumns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productID",
      caption: t("product_id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productBatchID",
      caption: t("product_batch_id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "stock",
      caption: t("stock"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "salesPrice",
      caption: t("sales_price"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "pprice",
      caption: t("p_price"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "autoBarcode",
      caption: t("auto_barcode"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "arabicName",
      caption: t("arabic_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "mannualBarcode",
      caption: t("manual_barcode"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
  ];

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("item_list")}
      width={1200}
      height={570}
      content={
        <>
          <ErpDevGrid
            columns={gridColumns}
            dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/ItemListSearch`}
            gridId="itemListGrid"
            height={450}
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
          />
        </>
      }
    />
  );
};

export default ItemListModal;
