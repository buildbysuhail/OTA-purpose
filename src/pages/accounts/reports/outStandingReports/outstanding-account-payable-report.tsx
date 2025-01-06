import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import OutstandingPayableReportFilter, { OutstandingPayableReportFilterInitialState } from "./outstanding-payable-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

interface OutstandingAccountPayableReport {
  from: Date
}
const OutstandingAccountPayableReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  const [filter, setFilter] = useState<OutstandingAccountPayableReport>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t('SiNo'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf:true,
    },
    {
      dataField: "party",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.party === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {cellElement.data.party}
        </span>
      ),
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.party === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.party === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.party === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue( cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
        </span>
      ),
    },
    {
      dataField: "ltDate",
      caption: t("last_transaction_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
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
                  filterText="as of {asonDate}, Interval : Daily {routeID > 0 && , Sales Route : [routeName]}"
                  gridHeader={t("account_payable")}
                  dataUrl={Urls.acc_reports_payable}
                  method={ActionType.POST}
                  gridId="grd_outstanding_account_payable"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth="150"
                  filterContent={<OutstandingPayableReportFilter />}
                  filterInitialData={OutstandingPayableReportFilterInitialState}>
                </ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default OutstandingAccountPayableReport;