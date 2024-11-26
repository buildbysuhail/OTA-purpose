import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import DayBookReportFilter, { DayBookReportFilterInitialState } from "../day-book-report-filter";
import DayBookBillWise from "./day-book-billwise";
// interface DayBookSummary {
//   from: Date
// }
const DayBookSummary = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // const [filter, setFilter] =useState<DayBookSummary>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    // {
    //   dataField: "date",
    //   caption: t('date'),
    //   dataType: "date",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 200,
    // },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "particulars",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {cellElement.data.particulars}
        </span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
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
      width: 250,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {cellElement.data.credit}
        </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {cellElement.data.balance}
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
                  gridHeader={t("day_book_summary")}
                  dataUrl={Urls.acc_reports_day_book_summary}
                  method={ActionType.POST}
                  filterWidth="100"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<DayBookReportFilter />}
                  filterInitialData={DayBookReportFilterInitialState}
                  reload={true}
                  gridId="grd_cost_centre"
                  // popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  childPopupProps={{
                    content: <DayBookBillWise />,
                    title: t("daybook_billwise"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "voucherType",
                    bodyProps: "dateFrom,dateTo,costCenterID,voucherType"
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

export default DayBookSummary;