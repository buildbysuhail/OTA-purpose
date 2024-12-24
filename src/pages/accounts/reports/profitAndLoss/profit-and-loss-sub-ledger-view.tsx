import { FC,   MouseEventHandler,   useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useSearchParams } from "react-router-dom";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";
import { ProfitAndLossReportFilterInitialState } from "./profit-and-loss-report-filter";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";


interface ProfitAndLossSubledgerwiseViewProps {
  postData: any; 
  groupName?: string;
}


const ProfitAndLossSubledgerwiseView:FC<ProfitAndLossSubledgerwiseViewProps> = ({postData , groupName }) => {
  const [isOpenDetails, setIsOpenDetails] = useState<{
    isOpen: boolean;
    key: number;
    ledgerName?: string;
  }>({ isOpen: false, key: 0 });
  const [filter, setFilter] = useState<any>(postData);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
    const { getFormattedValue } = useNumberFormat()
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "branchID",
      caption: t('branch_id'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "accGroupName",
      caption:  t("acc_group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => {
        return  cellElement.data.ledgerName==="TOTAL" ? (<span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red' : ''}`}>
         {cellElement.data.ledgerName}
         </span>):
          <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
       }
     },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red' : ''}`}>
  {`${cellElement.data?.debit == 0 || cellElement.data?.debit == null ? '' : cellElement.data.debit < 0 ? getFormattedValue(-1 * cellElement.data.debit) : getFormattedValue(cellElement.data.debit)}`}
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
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red' : ''}`}>
  {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
  </span>
      ),
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red' : ''}`}>
  {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue(-1 * cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
 
  </span>
      ),
    },
  ];
  // const ProfitAndLossDrillDownRow: React.FC<{
  //   item: any;
  //   setIsOpenDetails: (isOpen: any) => void;
  // }> = ({ item, setIsOpenDetails }) => {
  //   const { t } = useTranslation();
  
  //   const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
  //     event.preventDefault();
  //     setIsOpenDetails({
  //       isOpen: true,
  //       key: item.ledgerID,
  //       groupName: item.ledgerName,
  //     });
  //   };
  
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  heightToAdjustOnWindows={window.innerHeight-649}
                  columns={columns}
                  gridHeader={groupName}
                  dataUrl= {Urls.acc_reports_account_ledger_balance_view_sub_group_inc}
                  postData={postData}
                  hideGridAddButton={true}
                  enablefilter={false}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  gridId="grd_profit_and_loss_drill_down"
                  reload={true}
                  childPopupProps={{
                    content: <CashBookMonthWise postData={
                      {asOnDate: filter.asOnDate,
                        fromDate:filter.dateFrom
                      }}/>,
                    title: t("cash_book_monthwise"),
                    isForm: true,
                    width: "mw-100",
                    drillDownCells: "ledgerName,",
                    bodyProps: "ledgerID" ,
                    enableFn: (data: any) => data?.ledgerID != 0
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

export default ProfitAndLossSubledgerwiseView;