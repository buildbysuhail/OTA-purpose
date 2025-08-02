import React, { useState } from "react";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";

interface itemListGrid {
  id: string;
  slNo: number;
  productName: string;
  arabicName: string;
  رقم_المنتج: string;
  productID: string;
  productBatchID: string;
  منتج_رئيسي: string;
  الصنف: string;
  سعر_البيع: string;
  pPrice: number;
  autoBarcode: string;
  manualBarcode: string;
}

interface ItemListModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const ItemListModal: React.FC<ItemListModalProps> = ({ isOpen, onClose, t, }) => {
  const [gridData, setGridData] = useState<itemListGrid[]>([]);

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("si_no"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 60,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 283,
    },
    {
      dataField: "arabicName",
      caption: t("arabic_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 284,
    },
    {
      dataField: "رقم_المنتج",
      caption: "رقم المنتج",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productID",
      caption: t("product_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "productBatchID",
      caption: t("product_batch_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "منتج_رئيسي",
      caption: "منتج رئيسي",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "الصنف",
      caption: "الصنف",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "سعر_البيع",
      caption: "سعر البيع",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "pPrice",
      caption: t("p_price"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "autoBarcode",
      caption: t("auto_barcode"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "manualBarcode",
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
      height={620}
      content={
        <>
          <ErpDevGrid
            columns={gridColumns}
            data={gridData}
            gridId="itemListGrid"
            height={450}
            hideGridAddButton={true}
          // columnHidingEnabled={true}
          // hideDefaultExportButton={true}
          // hideDefaultSearchPanel={false}
          // allowSearching={true}
          // allowExport={false}
          // hideGridHeader={false}
          // enableScrollButton={true}
          // ShowGridPreferenceChooser={false}
          // showPrintButton={false}
          />
        </>
      }
    />
  );
};

export default ItemListModal;
