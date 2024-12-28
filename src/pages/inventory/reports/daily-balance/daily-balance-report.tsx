import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import DailyBalanceReportFilter, { DailyBalanceReportFilterInitialState } from "./daily-balance-report-filter";

const DailyBalanceAmount = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "customerName",
      caption: t('customerName'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,
    },
    {
      dataField: "openingBalance",
      caption: t("date"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,
    },
    {
      dataField: "billAmount",
      caption: t("billAmount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,

    },
    {
      dataField: "receivedAmount",
      caption: t("receivedAmount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,

    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      minWidth: 200,

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
                  gridHeader={t("daily_balance_report")}
                  dataUrl={Urls.inv_reports_balance_report}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<DailyBalanceReportFilter />}
                  filterWidth="400"
                  filterInitialData={DailyBalanceReportFilterInitialState}
                  reload={true}
                  gridId="grd_daily_balance"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DailyBalanceAmount;