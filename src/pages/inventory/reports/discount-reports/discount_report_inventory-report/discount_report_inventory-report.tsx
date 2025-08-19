import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import GridId from "../../../../../redux/gridId";
import DiscountReportInventoryFilter, {
  DiscountReportInventoryFilterInitialState,
} from "./discount_report_inventory-report-filter";
import { isNullOrUndefinedOrEmpty } from "../../../../../utilities/Utils";

const DiscountReportInventory = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t("sl_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 50,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 75,
      format: "dd-MMM-yyyy",
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 150,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "voucherPrefix",
      caption: t("voucher_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 50,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 60,
    },
    {
      dataField: "voucherForm",
      caption: t("voucher_form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "discountAmt",
      caption: t("discount_amt"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.discountAmt == null
              ? 0
              : getFormattedValue(cellElement.data.discountAmt, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.discountAmt == null
            ? 0
            : getFormattedValue(cellElement.data.discountAmt, false, 2);
        }
      },
    },
    {
      dataField: "billDiscount",
      caption: t("bill_discount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.billDiscount == null
              ? 0
              : getFormattedValue(cellElement.data.billDiscount, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.billDiscount == null
            ? 0
            : getFormattedValue(cellElement.data.billDiscount, false, 2);
        }
      },
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.grandTotal == null
              ? 0
              : getFormattedValue(cellElement.data.grandTotal, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.grandTotal == null
            ? 0
            : getFormattedValue(cellElement.data.grandTotal, false, 4);
        }
      },
    },
    {
      dataField: "totalDisc",
      caption: t("total_disc"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.totalDisc == null
              ? 0
              : getFormattedValue(cellElement.data.totalDisc, false, 2);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.totalDisc == null
            ? 0
            : getFormattedValue(cellElement.data.totalDisc, false, 2);
        }
      },
    },
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeTotal = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "address1",
      summaryType: "max",
      customizeText: customizeTotal,
    },
    {
      column: "discountAmt",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: (itemInfo: { value: any }) => {
        return (
          getFormattedValue(
            parseFloat(
              getFormattedValue(
                isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value
              ).replace(/,/g, "") || "0"
            ),
            false,
            2
          ) || "0"
        );
      },
    },

    {
      column: "billDiscount",
      summaryType: "sum",
      valueFormat: "fixedPoint",
      customizeText: (itemInfo: { value: any }) => {
        return (
          getFormattedValue(
            parseFloat(
              getFormattedValue(
                isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value
              ).replace(/,/g, "") || "0"
            ),
            false,
            2
          ) || "0"
        );
      },
    },

    {
      column: "grandTotal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: (itemInfo: { value: any }) => {
        return (
          getFormattedValue(
            parseFloat(
              getFormattedValue(
                isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value
              ).replace(/,/g, "") || "0"
            ),
            false,
            2
          ) || "0"
        );
      },
    },

    {
      column: "totalDisc",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: (itemInfo: { value: any }) => {
        return (
          getFormattedValue(
            parseFloat(
              getFormattedValue(
                isNullOrUndefinedOrEmpty(itemInfo.value) ? 0 : itemInfo.value
              ).replace(/,/g, "") || "0"
            ),
            false,
            2
          ) || "0"
        );
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
                summaryItems={summaryItems}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                filterText="{voucherType =='SI' && Sales Discount Report} {voucherType =='PI' && Purchase Discount Report} {voucherType =='SR' && Sales Discount Report} {voucherType =='PR' && Purchase Discount Report} {voucherType =='SO' && Sales Order Discount Report} {voucherType =='SE' && Sales Estimate Discount Report} {voucherType =='SQ' && Sales Quotation Discount Report} {voucherType =='PE' && Purchase Estimate Discount Report}{voucherType =='PO' && Purchase Order Discount Report}{voucherType =='OS' && Opening stock Discount Report}{salesRouteID > 0 && Route Name :[salesRoute]} Between : {fromDate} - {toDate}"
                dataUrl={Urls.discount_report_inventory}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<DiscountReportInventoryFilter />}
                filterWidth={700}
                filterHeight={100}
                filterInitialData={DiscountReportInventoryFilterInitialState}
                reload={true}
                gridId={GridId.discount_report_inventory}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DiscountReportInventory;
