import { Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import TransactionReportFilter, { TransactionReportFilterInitialState } from "./transaction-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

interface TransactionReport {
  from: Date
}
const TransactionReport = () => {
  const dispatch = useAppDispatch();
    const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  const [filter, setFilter] = useState<TransactionReport>({ from: new Date() });
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 140,
      showInPdf:true,
    },
    {
      dataField: "form",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      showInPdf:true,
    },
    {
      dataField: "accountName",
      caption: t("account"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {cellElement.data.particulars}
        </span>
      ),
    },
    {
      dataField: "referenceNumber",
      caption: t("ref_no"),
      dataType: "string",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "refDate",
      caption: t("ref_date"),
      dataType: "date",
      allowSearch: true,
      visible: false,
      allowFiltering: true,
      width: 150,
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
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.debit == null || cellElement.data?.debit == 0
            ? ''
            : cellElement.data.particulars === "TOTAL"
              ? getFormattedValue(cellElement.data.debit)
              : cellElement.data.debit}`}
        </span>
      ),
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
          {`${cellElement.data?.credit == null || cellElement.data?.credit == 0
            ? ''
            : cellElement.data.particulars === "TOTAL"
              ? getFormattedValue(cellElement.data.credit)
              : cellElement.data.credit}`}
        </span>
      ),
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
                // focusedRowEnabled={true}
                remoteOperations={{filtering:false,paging:false,sorting:false}} 
                  columns={columns}
                  filterText=" from {dateFrom} to {dateTo} {salesRouteID > 0 && ,Sales Route : [salesRouteName]}"
                  gridHeader={t("transaction_report")}
                  dataUrl={Urls.acc_reports_transaction}
                  method={ActionType.POST}
                  gridId="grd_transaction_report"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                  filterWidth="400"
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<TransactionReportFilter />}
                  onFilterChanged = {(filter: any) => {setFilter(filter)}}
                  filterInitialData={TransactionReportFilterInitialState}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default TransactionReport;