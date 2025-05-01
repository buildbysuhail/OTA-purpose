import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import KsaEInvoiceReportFilter, { KsaEInvoiceReportFilterInitialState } from "./ksa-e-invoice-filter";

const KsaEInvoiceReportDetailed = () => {
      const { getFormattedValue } = useNumberFormat();
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "transactionDate",
            caption: t("transaction_date"),
            dataType: "date",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            format: "dd-MMM-yyyy",
            width: 120,
        },
        {
            dataField: "voucherType",
            caption: t("voucher_type"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "voucherForm",
            caption: t("voucher_form"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "voucherPrefix",
            caption: t("voucher_prefix"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "voucherNumber",
            caption: t("voucher_number"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "partyName",
            caption: t("party_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "address1",
            caption: t("address_1"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "counterName",
            caption: t("counter_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "warehouseName",
            caption: t("warehouse_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "employeeName",
            caption: t("employee_name"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "grandTotal",
            caption: t("grand_total"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
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
                    : getFormattedValue(cellElement.data.grandTotal, false, 4);
                }
              },
            },
        {
            dataField: "totalGross",
            caption: t("total_gross"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            cellRender: (
                cellElement: any,
                cellInfo: any,
                filter: any,
                exportCell: any
              ) => {
                if (exportCell != undefined) {
                  const value =
                    cellElement.data?.totalGross == null
                      ? ""
                      : getFormattedValue(cellElement.data.totalGross, false, 4);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.totalGross == null
                    ? ""
                    : getFormattedValue(cellElement.data.totalGross, false, 4);
                }
              },
            },
        {
            dataField: "vatAmount",
            caption: t("vat_amount"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            cellRender: (
                cellElement: any,
                cellInfo: any,
                filter: any,
                exportCell: any
              ) => {
                if (exportCell != undefined) {
                  const value =
                    cellElement.data?.vatAmount == null
                      ? ""
                      : getFormattedValue(cellElement.data.vatAmount, false, 4);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.vatAmount == null
                    ? ""
                    : getFormattedValue(cellElement.data.vatAmount, false, 4);
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
                      ? ""
                      : getFormattedValue(cellElement.data.billDiscount, false, 2);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.billDiscount == null
                    ? ""
                    : getFormattedValue(cellElement.data.billDiscount, false, 2);
                }
              },
            },
        {
            dataField: "taxOnDiscount",
            caption: t("tax_on_discount"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            cellRender: (
                cellElement: any,
                cellInfo: any,
                filter: any,
                exportCell: any
              ) => {
                if (exportCell != undefined) {
                  const value =
                    cellElement.data?.taxOnDiscount == null
                      ? ""
                      : getFormattedValue(cellElement.data.taxOnDiscount, false, 4);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.taxOnDiscount == null
                    ? ""
                    : getFormattedValue(cellElement.data.taxOnDiscount, false, 4);
                }
              },
            },
        {
            dataField: "systemDateTime",
            caption: t("system_date_time"),
            dataType: "date",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            format: "dd-MMM-yyyy",
            width: 150,
        },
        {
            dataField: "customerType",
            caption: t("customer_type"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "result",
            caption: t("result"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "isReported",
            caption: t("is_reported"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
        },
        {
            dataField: "clearanceReceived",
            caption: t("clearance_received"),
            dataType: "number",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "responseMsg",
            caption: t("response_msg"),
            dataType: "string",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 200,
        },
        {
            dataField: "eInvoiceTime",
            caption: t("e_invoice_time"),
            dataType: "datetime",
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
            format: "dd-MMM-yyyy",
        },
        // {
        //     dataField: "sentCount",
        //     caption: t("sent_count"),
        //     dataType: "number",
        //     allowSearch: true,
        //     allowFiltering: true,
        //     allowSorting: true,
        //     width: 80,
        // },
        // {
        //     dataField: "invTransactionMasterID",
        //     caption: t("inv_transaction_master_id"),
        //     dataType: "number",
        //     allowSearch: true,
        //     allowFiltering: true,
        //     allowSorting: true,
        //     visible: false,
        //     width: 120,
        // },
    ];
    return (
        <Fragment>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                    <div className="px-4 pt-4 pb-2 ">
                        <div className="grid grid-cols-1 gap-3">
                            <ErpDevGrid
                                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                                columns={columns}
                                moreOption={false}
                                gridHeader={t("ksa_e_invoice_report_detailed")}
                                     filterText=" From :{fromDate} - {toDate}"
                                dataUrl={Urls.ksa_e_invoice_detailed}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<KsaEInvoiceReportFilter />}
                                filterWidth={790}
                                filterHeight={450}
                                filterInitialData={KsaEInvoiceReportFilterInitialState}
                                reload={true}
                                gridId="grd_ksa_e_invoice_report_detailed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default KsaEInvoiceReportDetailed;