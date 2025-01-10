import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import BalanceSheetFilter, { BalanceSheetFilterInitialState } from "./balance-sheet-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import BalancesheetDetails from "./balancesheet-details";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";
import BalanceSheetVerticalFilter, { BalanceSheetVerticalFilterInitialState } from "./balance-sheet-vertical-filter";

const BalancesheetVertical = () => {
  const [isOpenDetails, setIsOpenDetails] = useState<{
    isOpen: boolean;
    key: number;
    groupName?: string;
  }>
    ({ isOpen: false, key: 0 });
  const [filter, setFilter] = useState<any>(BalanceSheetFilterInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = [
    {
      dataField: "accGroupID",
      caption: t("accGroup_ID"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      // cellRender: (cellElement: any, cellInfo: any) => {
      //   return <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
          
      // }
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
        <span
          className={`${cellElement.data.isSubTotal == true
            ? "font-bold text-black"
            : cellElement.data.isTotal == true
              ? "font-bold text-blue"
              : cellElement.data.isGroup == true &&
                cellElement.data.isSubGroup == true
                ? "font-bold text-[#2E8B57]"
                : cellElement.data.isGroup == true
                  ? "pl-4 font-bold text-[#DC143C]"
                  : ""
            }`}
        >
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
        <span
          className={`${cellElement.data.isSubTotal == true
            ? "font-bold text-black"
            : cellElement.data.isTotal == true
              ? "font-bold text-blue"
              : cellElement.data.isGroup == true &&
                cellElement.data.isSubGroup == true
                ? "font-bold text-[#2E8B57]"
                : cellElement.data.isGroup == true
                  ? "pl-4 font-bold text-[#DC143C]"
                  : ""
            }`}
        >
         {`${ cellElement.data?.debit == null ? '' : getFormattedValue(cellElement.data.debit)}`}
 
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
        <span
          className={`${cellElement.data.isSubTotal == true
            ? "font-bold text-black"
            : cellElement.data.isTotal == true
              ? "font-bold text-blue"
              : cellElement.data.isGroup == true &&
                cellElement.data.isSubGroup == true
                ? "font-bold text-[#2E8B57]"
                : cellElement.data.isGroup == true
                  ? "pl-4 font-bold text-[#DC143C]"
                  : ""
            }`}
        >
            {`${ cellElement.data?.credit == null ? '' : getFormattedValue(cellElement.data.credit)}`}
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
        <span
          className={`${cellElement.data.isSubTotal == true
            ? "font-bold text-black"
            : cellElement.data.isTotal == true
              ? "font-bold text-blue"
              : cellElement.data.isGroup == true &&
                cellElement.data.isSubGroup == true
                ? "font-bold text-[#2E8B57]"
                : cellElement.data.isGroup == true
                  ? "pl-4 font-bold text-[#DC143C]"
                  : ""
            }`}
        >
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
        <span
          className={`${cellElement.data.isSubTotal == true
            ? "font-bold text-black"
            : cellElement.data.isTotal == true
              ? "font-bold text-blue"
              : cellElement.data.isGroup == true &&
                cellElement.data.isSubGroup == true
                ? "font-bold text-[#2E8B57]"
                : cellElement.data.isGroup == true
                  ? "pl-4 font-bold text-[#DC143C]"
                  : ""
            }`}
        >
          {`${cellElement.data?.amount == 0 || cellElement.data?.amount == null
            ? ""
            : cellElement.data.amount < 0
              ? getFormattedValue(-1 * cellElement.data.amount)
              : getFormattedValue(cellElement.data.amount)
            } ${cellElement.data?.amount == 0 || cellElement.data?.amount == null
              ? ""
              : cellElement.data?.amount >= 0
                ? "Dr"
                : "Cr"
            }`}
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
                  columns={columns}
                   gridHeader={t("balance_sheet")}
                  dataUrl={Urls.acc_reports_balance_sheet_vertical}
                  // postData={postData}
                  enablefilter={true}
                  showFilterInitially={true}
                  filterText="as of {asonDate}"
                  filterContent={<BalanceSheetVerticalFilter />}
                  filterInitialData={BalanceSheetVerticalFilterInitialState}
                  onFilterChanged={(filter: any) => { setFilter(filter) }}
                  filterWidth="100"
                  reload={true}
                  hideGridAddButton={true}
                  method={ActionType.POST}
                  // postData={postdata}
                  gridId="grd_balancesheet_vertical"
                 
                  childPopupPropsDynamic={(dataField: string) => ({
                    title: dataField == "accGroupID" ? t(`balance_detailed`) : t(`monthwise_balance`),
                    width: "700px",
                    isForm: false,
                    content: 
                    dataField == "accGroupID" ?
                     <BalancesheetDetails
                      postData={{
                        asonDate: filter.asonDate,
                      }}
                    /> 
                    : dataField == "ledgerID" ? <CashBookMonthWise postData={
                      {
                        asonDate: filter.asonDate
                      }} />
                      : null
                      ,
                      origin:"trialBalance",
                    drillDownCells: dataField == "accGroupID" ? "accGroupID" : "ledgerID",
                    bodyProps: dataField == "accGroupID" ? "accGroupID" : "ledgerID",
                  })}

                // )}
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