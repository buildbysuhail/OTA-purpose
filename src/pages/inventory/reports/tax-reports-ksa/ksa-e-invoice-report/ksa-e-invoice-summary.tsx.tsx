import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import KsaEInvoiceReportFilter, {
  KsaEInvoiceReportFilterInitialState,
} from "./ksa-e-invoice-filter";

const KsaEInvoiceReportSummary = () => {
  const { t } = useTranslation("accountsReport");
  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      format: "dd-MMM-yyyy",
      showInPdf: true,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "customerType",
      caption: t("customer_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "result",
      caption: t("result"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "totalCount",
      caption: t("total_count"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      showInPdf: true,
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
                moreOption={false}
                filterText=" From :{fromDate} - {toDate}"
                gridHeader={t("ksa_e_invoice_report_summary")}
                dataUrl={Urls.ksa_e_invoice_summary}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<KsaEInvoiceReportFilter />}
                filterWidth={790}
                filterHeight={280}
                filterInitialData={KsaEInvoiceReportFilterInitialState}
                reload={true}
                gridId="grd_ksa_e_invoice_report_summary"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default KsaEInvoiceReportSummary;
