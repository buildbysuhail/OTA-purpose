import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";

interface BalancesheetDetailsProps {
  postData: any;
  groupName?: string;
  rowData?: any;
  contentProps?: any;
  isMaximized?: boolean;
  modalHeight?: any;
}
const BalancesheetDetails: FC<BalancesheetDetailsProps> = ({ postData, groupName, rowData, contentProps,isMaximized,modalHeight, }) => {
  
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<any>(postData);
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  const rootState = useRootState();

    const [gridHeight, setGridHeight] = useState<{
      mobile: number;
      windows: number;
    }>({ mobile: 500, windows: 500 });
  
    useEffect(() => {
      let gridHeightMobile = modalHeight - 50;
      let gridHeightWindows = modalHeight - 180;
      setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
    }, [isMaximized, modalHeight]);

  const columns: DevGridColumn[] = [
    {
      dataField: "accGroupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 90,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' :  getFormattedValue(cellElement.data.balance)}`}
        </span>
      ),
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
        </span>
      ),
    },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => {
        return cellElement.data.ledgerName === "TOTAL" ? (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
          {cellElement.data.ledgerName}
        </span>) :
          <DrillDownCellTemplate data={cellElement} field="ledgerName"></DrillDownCellTemplate>
      }
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 remoteOperations={{ paging: false, filtering: false, sorting: false }}
                  rowData={rowData}
                  heightToAdjustOnWindowsInModal={gridHeight.windows}
                  columns={columns}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  gridHeader={t("acc_group_view")}
                  filterText="{___(accGroup)} {**** as of (asonDate)}"
                  dataUrl={Urls.acc_reports_account_ledger_balance_view}
                  hideGridAddButton={true}
                  enablefilter={false}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  gridId="grd_balancesheet_details"
                  childPopupProps={{
                    content: <CashBookMonthWise postData={filter} />,
                    title: t("acc_group_monthview"),
                    isForm: true,
                    width: "mw-100",
                    drillDownCells: "ledgerName",
                    bodyProps: "ledgerID,",
                    enableFn: (data: any) => data?.ledgerName != "TOTAL"
                  }}>
                </ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default BalancesheetDetails;