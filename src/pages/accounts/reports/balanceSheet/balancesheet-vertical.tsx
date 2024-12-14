import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import LedgerReportFilter, { LedgerReportFilterInitialState } from "../ledger-report-filter";
import BalanceSheetFilter, { BalanceSheetFilterInitialState } from "./balance-sheet-filter";



const BalancesheetVertical = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "accGroupID",
      caption: t("accGroup_ID"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_ID"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "accGroup",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isSubTotal == true?'font-bold text-black':cellElement.data.isTotal == true ? 'font-bold text-blue':cellElement.data.isGroup == true&&cellElement.data.isSubGroup == true?'font-bold text-green':cellElement.data.isGroup == true ? 'pl-4 font-bold text-red' : ''}`}>
  {cellElement.data.accGroup}
</span>
      ),
    },
    {
      dataField: "code",
      caption: t("code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
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
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isSubTotal == true?'font-bold text-black':cellElement.data.isTotal == true ? 'font-bold text-blue':cellElement.data.isGroup == true&&cellElement.data.isSubGroup == true?'font-bold text-green':cellElement.data.isGroup == true ? 'pl-4 font-bold text-red' : ''}`}>
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
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isSubTotal == true?'font-bold text-black':cellElement.data.isTotal == true ? 'font-bold text-blue':cellElement.data.isGroup == true&&cellElement.data.isSubGroup == true?'font-bold text-green':cellElement.data.isGroup == true ? 'pl-4 font-bold text-red' : ''}`}>
  {cellElement.data.credit}
</span>
      ),
    },
    {
      dataField: "isGroup",
      caption: t("is_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isSubTotal == true?'font-bold text-black':cellElement.data.isTotal == true ? 'font-bold text-blue':cellElement.data.isGroup == true&&cellElement.data.isSubGroup == true?'font-bold text-green':cellElement.data.isGroup == true ? 'pl-4 font-bold text-red' : ''}`}>
  {cellElement.data.isGroup}
</span>
      ),
    },

    {
      dataField: "amount",
      caption: t("amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isSubTotal == true?'font-bold text-black':cellElement.data.isTotal == true ? 'font-bold text-blue':cellElement.data.isGroup == true&&cellElement.data.isSubGroup == true?'font-bold text-green':cellElement.data.isGroup == true ? 'pl-4 font-bold text-red' : ''}`}>
  {cellElement.data.amount}
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
                  // gridHeader={groupName}
                  dataUrl={Urls.acc_reports_balance_sheet_vertical}
                  // postData={postData}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterContent={<BalanceSheetFilter />}
                  filterInitialData={BalanceSheetFilterInitialState}
                  filterWidth="100"
                  reload={true}
                  hideGridAddButton={true}
                  method={ActionType.POST}
                  gridId="grd_balancesheet_vertical"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BalancesheetVertical;