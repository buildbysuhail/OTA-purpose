import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import CashSummaryReportFilter, { CashSummaryReportFilterInitialState } from "../cashSummary/cash-summary-report-filter";

const DailySummaryGlobal = () => {
  const { t } = useTranslation('accountsReport');
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.date === "Expenses" || cellElement.data.date === "Finished Goods" ? 'font-bold text-black' : cellElement.data.date === "Indirect Expense" || cellElement.data.date === "Direct Expense" ? 'font-bold text-[#2E8B57]' : ''}`}>
          {cellElement.data.date}
        </span>
      ),
    },
    {
      dataField: "party",
      caption: t("party"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.party === "Product Name" ? 'font-bold text-[#2E8B57]' : cellElement.data.party === "OPENING BALANCE" || cellElement.data.party === "CLOSING BALANCE" || cellElement.data.party === "INCOME" || cellElement.data.party === "EXPENSE" || cellElement.data.date === "Finished Goods" ? 'font-bold text-black' : ''}`}>
          {cellElement.data.party}
        </span>
      ),
    },
    {
      dataField: "billed",
      caption: t("billed"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.date === "Expenses" || cellElement.data.party === "OPENING BALANCE" || cellElement.data.party === "CLOSING BALANCE" || cellElement.data.party === "INCOME" || cellElement.data.party === "EXPENSE" || cellElement.data.date === "Finished Goods" ? 'font-bold text-black' : cellElement.data.date === "Indirect Expense" || cellElement.data.date === "Direct Expense" || cellElement.data.billed === "Quantity" ? 'font-bold text-[#2E8B57]' : ''}`}>
          {cellElement.data.billed}
        </span>
      ),
    },
    {
      dataField: "received",
      caption: t("received"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {cellElement.data.received}
        </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.date === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {cellElement.data.balance}
        </span>
      ),
    },
    {
      dataField: "runningBalance",
      caption: t("runningBalance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "quantity",
      caption: t("quantity"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "netAmt",
      caption: t("net_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
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
                showTotalCount={false}
                  columns={columns}
                  filterText="from {fromDate} to {toDate}"
                  gridHeader={t("daily_summary_report")}
                  dataUrl={Urls.acc_reports_daily_summary_global}
                  method={ActionType.POST}
                  gridId="grd_daily_summary_global"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterWidth="100"
                  filterContent={<CashSummaryReportFilter />}
                  filterInitialData={CashSummaryReportFilterInitialState}
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

export default DailySummaryGlobal;
