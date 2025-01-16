import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import CashSummaryReportFilter, { CashSummaryReportFilterInitialState } from "./cash-summary-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
interface CashSummary {
  from: Date
}
const CashSummary = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  const [filter, setFilter] = useState<CashSummary>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "party",
      caption: t("descriptions"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) + " Cr"
                : getFormattedValue(balance) + " Dr";
          return exportCell != undefined ? {
            ...exportCell,
            text: cellInfo.value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.party === "OPENING BALANCE" ||cellElement.data.party === "CLOSING BALANCE" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: isDebit ? "#129151" : "#DC143C",
              size: 15,
            }
          } : undefined;
        }
        else {
          return (  <span className={`${cellElement.data.party === "OPENING BALANCE" ? 'font-bold text-[#DC143C] text-lg' : cellElement.data.party === "CLOSING BALANCE" ? 'font-bold text-[#DC143C] text-lg' : ''}`}>
            {cellElement.data.party}
          </span>)
        }
          },
    },
    {
      dataField: "billed",
      caption: t('amount'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.billed;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * parseFloat(balance)) 
              : getFormattedValue(parseFloat(balance) ) ;

          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.party === "OPENING BALANCE" ||cellElement.data.party === "CLOSING BALANCE" ? '#FF0000' :'',
            font: {
              ...exportCell.font,
              size: 15,
            },
          };
        }
        else {
          return(  <span className={`${cellElement.data.party === "OPENING BALANCE" ? 'font-bold text-[#DC143C] text-lg' : cellElement.data.party === "CLOSING BALANCE" ? 'font-bold text-[#DC143C] text-lg' : ''}`}>
            {`${cellElement.data?.billed == 0 || cellElement.data?.billed == null ? '' : cellElement.data.billed < 0 ? getFormattedValue(-1 * parseFloat(cellElement.data.billed)) : getFormattedValue( parseFloat(cellElement.data.billed))}`}
          </span>)
      
          }}
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  filterText="from {fromDate} to {toDate}"
                  gridHeader={t("cash_summary")}
                  dataUrl={Urls.acc_reports_cash_summary}
                  method={ActionType.POST}
                  gridId="grd_cash_summary"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  filterWidth="100"
                  showFilterInitially={true}
                  filterContent={<CashSummaryReportFilter />}
                  filterInitialData={CashSummaryReportFilterInitialState}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default CashSummary;