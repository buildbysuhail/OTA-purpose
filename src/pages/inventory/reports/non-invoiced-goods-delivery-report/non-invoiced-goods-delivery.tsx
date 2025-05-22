import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import NonInvoicedGoodsDeliveryFilter, {
  NonInvoicedGoodsDeliveryFilterInitialState,
} from "./non-invloced-goods-deliveryfilter";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import moment from "moment";

const NonInvoicedGoodsDelivery = () => {
  const { t } = useTranslation("accountsReport");
  const userSession = useSelector((state: RootState) => state.UserSession);
  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
      format: "dd-MMM-yyyy",
    },
    {
      dataField: "invTransactionMasterID",
      caption: t("inv_transaction_master_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "voucherPrefix",
      caption: t("voucher_prefix"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "voucherForm",
      caption: t("voucher_form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "financialYearID",
      caption: t("financial_year_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      alignment: "right",
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.grandTotal == null
              ? ""
              : getFormattedValue(cellElement.data.grandTotal, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.grandTotal == null
            ? ""
            : getFormattedValue(
                parseFloat(cellElement.data.grandTotal),
                false,
                4
              );
        }
      },
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
  ];

  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isNaN(value)
      ) {
        return "0";
      }
      return getFormattedValue(value, false, 2) || "0";
    };
  }, [getFormattedValue]);
  const customizeDate = (itemInfo: any) => `TOTAL`;
  const summaryItems: SummaryConfig[] = [
    {
      column: "partyName",
      summaryType: "max",
      customizeText: customizeDate,
    },
    {
      column: "grandTotal",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
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
                filterText=": {fromDate} - {toDate}"
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                moreOption={true}
                gridHeader={t("non_invoiced_goods_delivery_report")}
                dataUrl={Urls.non_invoiced_goods_delivery}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                filterInitialData={{
                  ...NonInvoicedGoodsDeliveryFilterInitialState,
                  fromDate:
                    //    moment(
                    userSession.finFrom,
                  //     "DD/MM/YYYY"
                  //   ).local(),
                }}
                method={ActionType.POST}
                filterContent={<NonInvoicedGoodsDeliveryFilter />}
                filterWidth={400}
                filterHeight={230}
                reload={true}
                gridId="grd_non_invoiced_goods_delivery"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NonInvoicedGoodsDelivery;
