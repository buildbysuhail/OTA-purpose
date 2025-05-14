import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../redux/types";
import PaymentReportFilter, { PaymentReportFilterInitialState } from "./payment-report-filter";
import { useNumberFormat } from "../../../utilities/hooks/use-number-format";
import AccTransactionForm from "../transactions/acc-transaction";

interface PaymentReport {
  from: Date
}
const PaymentReport = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [payable, setPayable] = useState<boolean>(() => {
  //   const payableParam = searchParams.get("payable");
  //   return payableParam === "true"; // Convert the string to boolean
  // });
  const { t } = useTranslation('accountsReport');
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const [filter, setFilter] = useState<PaymentReport>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      format: "dd-MMM-yyyy"
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 180,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return (
          <DrillDownCellTemplate
            data={cellElement}
            field="vchNo"
          ></DrillDownCellTemplate>
        )
      },
    },
    {
      dataField: "form",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "particulars",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
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
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:
                cellElement.data.particulars === "TOTAL" ? "bold" : "normal",
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
      dataField: "refNo",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "amount",
      caption: t('amount'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.amount;
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
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style:
                cellElement.data.particulars === "TOTAL" ? "bold" : "normal",
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.amount == 0 || cellElement.data?.amount == null ? '' : cellElement.data.amount < 0 ?
              getFormattedValue(-1 * cellElement.data.amount) : getFormattedValue(cellElement.data.amount)}`}
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
                  filterText="from {dateFrom} to {dateTo} {salesRouteID > 0 &&, Sales Route : [salesRouteName]} {employeeID > 0 && , Employee : [employeeName]}"
                  gridHeader={t("payment_report")}
                  filterWidth={650}
                  filterHeight={310}
                  dataUrl={Urls.acc_reports_payment}
                  method={ActionType.POST}
                  gridId="grd_payment_report"
                  popupAction={toggleCostCentrePopup}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<PaymentReportFilter />}
                  filterInitialData={PaymentReportFilterInitialState}
                  onFilterChanged={(filter: any) => { setFilter(filter) }}
                  hideGridAddButton={true}
                  reload={true}
                  childPopupProps={{
                    content: <AccTransactionForm isTeller={false} />,
                    title: t(""),
                    isForm: false,
                    isTransactionScreen: true,
                    width: 1000,
                    drillDownCells: "vchNo,",
                    // enableFn: (data: any) => data?.ledgerID != 0
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default PaymentReport;