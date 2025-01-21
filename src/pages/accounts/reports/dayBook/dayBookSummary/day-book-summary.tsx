import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { Fragment, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import DayBookReportFilter, { DayBookReportFilterInitialState } from "../day-book-report-filter";
import DayBookBillWise from "./day-book-billwise";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { Filter } from "lucide-react";
// interface DayBookSummary {
//   from: Date
// }
const DayBookSummary = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const [filter, setFilter] = useState<any>(DayBookReportFilterInitialState);
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
      caption: t("voucherType"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement} field="voucherType"></DrillDownCellTemplate>
    },
    {
      dataField: "particulars",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
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
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {cellElement.data.particulars}
          </span>)
        }
      }
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? cellElement.data.particulars === "TOTAL" ? getFormattedValue(-1 * balance) : (-1 * balance)
                : cellElement.data.particulars === "TOTAL" ? getFormattedValue(balance) : balance;

          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.debit == null ? '0' : cellElement.data.debit < 0 ? (-1 * cellElement.data.debit) : cellElement.data.particulars === "TOTAL" ?
              getFormattedValue(cellElement.data.debit) : cellElement.data.debit}`}
          </span>)
        }
      }
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? cellElement.data.particulars === "TOTAL" ? getFormattedValue(-1 * balance) : (-1 * balance)
                : cellElement.data.particulars === "TOTAL" ? getFormattedValue(balance) : balance;

          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (
            <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
              {`${cellElement.data?.credit == null ? '0' : cellElement.data.credit < 0 ? (-1 * cellElement.data.credit) : cellElement.data.particulars === "TOTAL" ?
                getFormattedValue(cellElement.data.credit) : cellElement.data.credit}`}
            </span>
          )
        }
      }
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      visible: false,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) + 'Cr'
                : getFormattedValue(balance) + 'Dr';
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            textColor: cellElement.data.ledgerName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.balance == null ? '0' : cellElement.data.balance < 0 ? getFormattedValue(-1 * cellElement.data.balance) :
              getFormattedValue(cellElement.data.balance)} ${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' :
                cellElement.data?.balance >= 0 ? 'Dr' : 'Cr'}`}
          </span>)
        }
      }
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
                  remoteOperations={{ filtering: false, paging: false, sorting: false }}
                  columns={columns}
                  filterText="from {dateFrom} to {dateTo} {costCenterID > 0 && , Cost Center: [CostCenterName]}"
                  gridHeader={t("day_book_summary")}
                  dataUrl={Urls.acc_reports_day_book_summary}
                  method={ActionType.POST}
                  filterWidth="100"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<DayBookReportFilter />}
                  filterInitialData={DayBookReportFilterInitialState}
                  onFilterChanged={(filter: any) => { setFilter(filter) }}
                  reload={true}
                  gridId="grd_day_book_summary"
                  // popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  childPopupProps={{
                    content: <DayBookBillWise />,
                    title: t("daybook_billwise"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "voucherType",
                    bodyProps: "voucherType",
                    // enableFn: (data: any) => data?.voucherType != ""
                    //dateFrom,dateTo,costCenterID,
                  }}
                  postData={filter}
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