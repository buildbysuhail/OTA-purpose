import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useEffect, useMemo, useState } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { useLocation } from "react-router-dom";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
interface DiagnosisProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const DiagnosisReport: FC<DiagnosisProps> = ({ gridHeader, dataUrl, gridId, }) => {
  const { t } = useTranslation("accountsReport");
  const location = useLocation();
  const [key, setKey] = useState(1);
  const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = useMemo(() => {
    const baseColumns: DevGridColumn[] = [
      {
        dataField: "code",
        caption: t("code"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "manualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "groupName",
        caption: t("group_name"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
      },
      {
        dataField: "salesPrice",
        caption: t("sales_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.salesPrice == null
                ? 0
                : getFormattedValue(cellElement.data.salesPrice, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.salesPrice == null
              ? 0
              : getFormattedValue(cellElement.data.salesPrice, false, 4);
          }
        },
      },
      {
        dataField: "priceCategory1",
        caption: t("price_category_1"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.priceCategory1 == null
                ? 0
                : getFormattedValue(cellElement.data.priceCategory1, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.priceCategory1 == null
              ? 0
              : getFormattedValue(cellElement.data.priceCategory1, false, 4);
          }
        },
      },
      {
        dataField: "priceCategory2",
        caption: t("price_category_2"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.priceCategory2 == null
                ? 0
                : getFormattedValue(cellElement.data.priceCategory2, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.priceCategory2 == null
              ? 0
              : getFormattedValue(cellElement.data.priceCategory2, false, 4);
          }
        },
      },
      {
        dataField: "minSalePrice",
        caption: t("min_sale_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.minSalePrice == null
                ? 0
                : getFormattedValue(cellElement.data.minSalePrice, false, 3);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.minSalePrice == null
              ? 0
              : getFormattedValue(cellElement.data.minSalePrice, false, 3);
          }
        },
      },
      {
        dataField: "cost",
        caption: t("cost"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.cost == null
                ? 0
                : getFormattedValue(cellElement.data.cost, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.cost == null
              ? 0
              : getFormattedValue(cellElement.data.cost, false, 4);
          }
        },
      },
      {
        dataField: "purchasePrice",
        caption: t("purchase_price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.purchasePrice == null
                ? 0
                : getFormattedValue(cellElement.data.purchasePrice, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.purchasePrice == null
              ? 0
              : getFormattedValue(cellElement.data.purchasePrice, false, 4);
          }
        },
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.mrp == null
                ? 0
                : getFormattedValue(cellElement.data.mrp, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.mrp == null
              ? 0
              : getFormattedValue(cellElement.data.mrp, false, 4);
          }
        },
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting: true,
        width: 100,
        showInPdf: true,
        cellRender: (
          cellElement: any,
          cellInfo: any,
          filter: any,
          exportCell: any
        ) => {
          if (exportCell != undefined) {
            const value =
              cellElement.data?.stock == null
                ? 0
                : getFormattedValue(cellElement.data.stock, false, 4);
            return {
              ...exportCell,
              text: value,
              alignment: "right",
              alignmentExcel: { horizontal: "right" },
            };
          } else {
            return cellElement.data?.stock == null
              ? 0
              : getFormattedValue(cellElement.data.stock, false, 4);
          }
        },
      },
    ];

    return baseColumns.filter((column) => {
      if (column.dataField == "cost") {
        return (
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_less_than_lp_cost"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_less_than_purchase_price"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_less_than_msp"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_equal_to_mrp"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_zero_price_category_1"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_zero_price_category_2"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_less_than_price_category_1"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_less_than_price_category_2"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_equal_to_purchase_price"
          )
        );
      }
      if (column.dataField == "minSalePrice") {
        return (
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_less_than_msp"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_equal_to_mrp"
          )
        );
      }
      if (column.dataField == "priceCategory1") {
        return (
          location.pathname.includes(
            "inventory/diagnosis_report_zero_price_category_1"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_less_than_price_category_1"
          )
        );
      }
      if (column.dataField == "priceCategory2") {
        return (
          location.pathname.includes(
            "inventory/diagnosis_report_zero_price_category_2"
          ) ||
          location.pathname.includes(
            "inventory/diagnosis_report_sales_price_less_than_price_category_2"
          )
        );
      }
      if (
        column.dataField == "salesPrice" ||
        column.dataField == "purchasePrice" ||
        column.dataField == "mrp" ||
        column.dataField == "stock"
      ) {
        return !location.pathname.includes(
          "inventory/diagnosis_report_of_products_with_multi_batch"
        );
      }
      return true;
    });
  }, [t, key]);

  useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                key={key}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                  summary: false,
                }}
                columns={columns}
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                method={ActionType.POST}
                reload={true}
                gridId={gridId}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DiagnosisReport;
