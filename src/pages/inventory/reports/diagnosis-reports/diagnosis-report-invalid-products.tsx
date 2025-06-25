import { useTranslation } from "react-i18next";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const DiagnosisReportInvalidProducts = () => {
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = [
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "autoBarcode",
      caption: t("auto_barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "category",
      caption: t("category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "taxCategory",
      caption: t("tax_category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "stdSalesPrice",
      caption: t("std_sales_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stdSalesPrice == null
              ? 0
              : getFormattedValue(cellElement.data.stdSalesPrice, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stdSalesPrice == null
            ? 0
            : getFormattedValue(cellElement.data.stdSalesPrice, false, 4);
        }
      },
    },
    {
      dataField: "stdPurchasePrice",
      caption: t("std_purchase_price"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.stdPurchasePrice == null
              ? 0
              : getFormattedValue(cellElement.data.stdPurchasePrice, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.stdPurchasePrice == null
            ? 0
            : getFormattedValue(cellElement.data.stdPurchasePrice, false, 4);
        }
      },
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                gridHeader={t("diagnosis_report_of_invalid_products")}
                dataUrl={Urls.diagnosis_report_of_invalid_products}
                hideGridAddButton={true}
                method={ActionType.POST}
                reload={true}
                gridId="grd_diagnosis_report_of_invalid_products"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DiagnosisReportInvalidProducts;
