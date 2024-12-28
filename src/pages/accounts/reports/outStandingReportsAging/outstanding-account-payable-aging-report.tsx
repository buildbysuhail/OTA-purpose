import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import OutstandingAgingReportFilter, { OutstandingAgingReportFilterInitialState } from "./outstanding-aging-report-filter";
import OutstandingAccountAgingAnalysis from "./outstanding-account-aging-analysis";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

const OutstandingAccountPayableAgingReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t('si_no'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "ledgername",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return cellElement.data.ledgerName === "TOTAL" ? (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.ledgername}`}
        </span>) :
          <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
      }
    },
    //     cellRender: (cellElement: any, cellInfo: any) => (
    //       <span className={`${cellElement.data.ledgername==="TOTAL" ? 'font-bold text-red' : ''}`}>
    // {cellElement.data.ledgername}
    // </span>
    //     ),
    //   },
    // {
    //   dataField: "debit",
    //   caption: t('debit'),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    // {
    //   dataField: "credit",
    //   caption: t("credit"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 150,
    // },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={'font-bold text-red'}>
          {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '0' : cellElement.data.balance < 0 ? getFormattedValue(-1 * cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
        </span>
      ),
    },
    {
      dataField: "period1",
      captionDynamic: (filter: any) => `0-${filter.p1?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visibleDynamic: (filter: any) => filter.p1 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.period1 == 0 || cellElement.data?.period1 == null ? '0' : cellElement.data.period1 < 0 ? getFormattedValue(-1 * cellElement.data.period1) : getFormattedValue(cellElement.data.period1)}`}
        </span>
      ),
    },
    {
      dataField: "period2",
      captionDynamic: (filter: any) => `${filter.p1?.toString()}-${filter.p2?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visibleDynamic: (filter: any) => filter.p2 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.period2 == 0 || cellElement.data?.period2 == null ? '0' : cellElement.data.period2 < 0 ? getFormattedValue(-1 * cellElement.data.period2) : getFormattedValue(cellElement.data.period2)}`}
        </span>
      ),
    },
    {
      dataField: "period3",
      captionDynamic: (filter: any) => `${filter.p2?.toString()}-${filter.p3?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visibleDynamic: (filter: any) => filter.p3 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.period3 == 0 || cellElement.data?.period3 == null ? '0' : cellElement.data.period3 < 0 ? getFormattedValue(-1 * cellElement.data.period3) : getFormattedValue(cellElement.data.period3)}`}
        </span>
      ),
    },
    {
      dataField: "period4",
      captionDynamic: (filter: any) => `${filter.p3?.toString()}-${filter.p4?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visibleDynamic: (filter: any) => filter.p4 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.period4 == 0 || cellElement.data?.period4 == null ? '0' : cellElement.data.period4 < 0 ? getFormattedValue(-1 * cellElement.data.period4) : getFormattedValue(cellElement.data.period4)}`}
        </span>
      ),
    },
    {
      dataField: "period5",
      captionDynamic: (filter: any) => `${filter.p4?.toString()}-${filter.p5?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visibleDynamic: (filter: any) => filter.p5 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.period5 == 0 || cellElement.data?.period5 == null ? '0' : cellElement.data.period5 < 0 ? getFormattedValue(-1 * cellElement.data.period5) : getFormattedValue(cellElement.data.period5)}`}
        </span>
      ),
    },
    {
      dataField: "period6",
      captionDynamic: (filter: any) => `${filter.p5?.toString()}-${filter.p6?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visibleDynamic: (filter: any) => filter.p6 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.period6 == 0 || cellElement.data?.period6 == null ? '0' : cellElement.data.period6 < 0 ? getFormattedValue(-1 * cellElement.data.period6) : getFormattedValue(cellElement.data.period6)}`}
        </span>
      ),
    },
    {
      dataField: "period7",
      captionDynamic: (filter: any) => `${filter.p6?.toString()}-${filter.p7?.toString()} ${t("days")}`,
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visibleDynamic: (filter: any) => filter.p7 > 0,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgername === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.period7 == 0 || cellElement.data?.period7 == null ? '0' : cellElement.data.period7 < 0 ? getFormattedValue(-1 * cellElement.data.period7) : getFormattedValue(cellElement.data.period7)}`}
        </span>
      ),
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
                  gridHeader={t("account_payable_aging_report")}
                  dataUrl={Urls.acc_reports_outstanding_aging_payable}
                  method={ActionType.POST}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  filterWidth="100"
                  showFilterInitially={true}
                  remoteOperations={{ paging: false, filtering: false, sorting: false }}
                  filterContent={<OutstandingAgingReportFilter />}
                  filterInitialData={OutstandingAgingReportFilterInitialState}
                  childPopupProps={{
                    content: <OutstandingAccountAgingAnalysis />,
                    title: t("account_aging_analysis"),
                    isForm: true,
                    width: "mw-100",
                    drillDownCells: "ledgername",
                    bodyProps: "asonDate,partyType,salesRouteID,p1,p2,p3,p4,p5,p6,p7,ledgerID,costCenterID,",
                    enableFn: (data: any) => data?.ledgername != "TOTAL"
                  }}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default OutstandingAccountPayableAgingReport;