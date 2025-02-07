import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import CollectionReportFilter, { IncomeReportFilterInitialState } from "./income-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import IncomeReportFilter from "./income-report-filter";

const IncomeReportDetailed = () => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  // const [filter, setFilter] = useState<IncomeRepor>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "slNo",
      caption: t('SiNo'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
      showInPdf:true,
    },
    {
      dataField: "accGroupName",
      caption: t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf: true,
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
            textColor: cellElement.data.accGroupName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.accGroupName === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.accGroupName === "TOTAL" ? "bold" : "normal",
              bold: cellElement.data.accGroupName === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.accGroupName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {cellElement.data.accGroupName}
          </span>)
        }
      }
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "vchNo",
      caption: t("voucherNumber"),
      dataType: "string",
      allowSearch: true,
      width: 80,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      width: 100,
      allowFiltering: true,
      showInPdf:true,
    },

    {
      dataField: "ledger",
      caption: t("ledger"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },

    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.accGroupName === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.accGroupName === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.accGroupName === "TOTAL" ? "bold" : "normal",
              bold: cellElement.data.accGroupName === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.accGroupName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.debit == null ? '0' : getFormattedValue(cellElement.data.debit)}`}
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
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.accGroupName === "TOTAL" ? '#DC143C' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.accGroupName === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.accGroupName === "TOTAL" ? "bold" : "normal",
              bold: cellElement.data.accGroupName === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.accGroupName === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.credit == null ? '0' : getFormattedValue(cellElement.data.credit)}`}
          </span>)
        }
      }
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance) + " Cr"
                : getFormattedValue(balance) + " Dr";
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor:  '#FF0000',
            font: {
              ...exportCell.font,
              color: { argb: 'FFFF0000' },
              size: 10,
              style:  "bold" ,
              bold: true,
            },
          };
        }
        else {
          return (<span
            className={`${"font-bold text-[#DC143C]"
              }`}
          >
            {`${cellElement.data?.balance == null
              ? '0'
              : cellElement.data.balance < 0
                ? getFormattedValue(-1 * cellElement.data.balance) + ' Cr'
                : getFormattedValue(cellElement.data.balance) + ' Dr'}`}
          </span>)
        }
      }
    },

    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 remoteOperations={{ paging: false, filtering: false, sorting: false }}
                  allowGrouping={true}
                  columns={columns}
                  filterText="from {dateFrom} to {dateTo} {salesRouteID > 0 && , Sales Route : [salesRouteName]} {costCentreID > 0 && , Cost Centre : [costCentreName]}"
                  gridHeader={t("income_report_detailed")}
                  dataUrl={Urls.acc_reports_income_expense_report_detailed}
                  method={ActionType.POST}
                  gridId="grd_income_report_details"
                  popupAction={toggleCostCentrePopup}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<IncomeReportFilter />}
                  filterInitialData={IncomeReportFilterInitialState}
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
export default IncomeReportDetailed;