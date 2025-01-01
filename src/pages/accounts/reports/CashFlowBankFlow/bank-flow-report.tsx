import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const BankFlowReport = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  // const [filter, setFilter] = useState<IncomeRepor>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "year",
      caption: t('year'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "monthNum",
      caption: t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      visible:false,
      width: 300,
      // cellRender: (cellElement: any, cellInfo: any) => (
      //   <span className={`${cellElement.data.accGroupName === "TOTAL" ? 'font-bold text-red' : ''}`}>
      //     {cellElement.data.accGroupName}
      //   </span>
      // ),
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {cellElement.data.debit}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.month === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {cellElement.data.credit}
        </span>
      ),
    },
    {
      dataField: "monthBal",
      caption: t("monthBal"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={'font-bold text-red'}>
          {cellElement.data.monthBal}
        </span>
      ),
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
    },
    {
      dataField: "costCentreName",
      caption: t("cost_centre_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
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
                  allowGrouping={true}
                  columns={columns}
                  gridHeader={t("bank_flow_report")}
                  dataUrl={Urls.acc_reports_bank_flow}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  // enablefilter={true}
                  // showFilterInitially={true}
                  // filterContent={<IncomeReportFilter />}
                  // filterInitialData={IncomeReportFilterInitialState}
                  hideGridAddButton={true}
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default BankFlowReport;