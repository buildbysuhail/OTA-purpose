import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useRootState } from "../../../../utilities/hooks/useRootState";


interface CashSummary {

  from: Date
}
const TransactionAnalysisReport = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "year",
      caption: t('year'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "sales",
      caption: t("sales"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
    },
    {
      dataField: "purchase",
      caption: t("purchase"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },

    {
      dataField: "expense",
      caption: t("expense"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "income",
      caption: t("income"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "A/CPayable",
      caption: t("a/c_payable"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "A/CReceivable",
      caption: t("a/c_receivable"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("transaction_analysis_report")}
                  dataUrl={Urls.inv_reports_price_list}
                  hideGridAddButton={true}
                  enablefilter={false}
                  method={ActionType.POST}
                  reload={true}
                  gridId="grd_cost_centre">
                </ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default TransactionAnalysisReport;