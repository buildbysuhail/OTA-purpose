import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import DiagnosisReportFilter, { DiagnosisReportFilterInitialState } from "./diagnosis-report-filter";

interface DiagnosisReportPostDatedTransaction {
  voucher: string;
  voucherNumber: string;
  transactionDate: string;
}

const DiagnosisReportPostDatedTransactions = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "voucher",
      caption: t("voucher"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    },
    {
      dataField: "transactionDate",
      caption: t("transaction_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 120,
      showInPdf: true,
    }
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
                moreOption={true}
                gridHeader={t("diagnosis_report_post_dated_transactions")}
                dataUrl={Urls.diagnosis_report_post_dated_transactions}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<DiagnosisReportFilter />}
                filterWidth={800}
                filterHeight={560}
                filterInitialData={DiagnosisReportFilterInitialState}
                reload={true}
                gridId="grd_diagnosis_report_post_dated_transactions"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DiagnosisReportPostDatedTransactions;