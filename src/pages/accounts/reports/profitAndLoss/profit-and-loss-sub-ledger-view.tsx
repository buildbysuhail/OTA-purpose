import { FC,   MouseEventHandler,   useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useSearchParams } from "react-router-dom";
import CashBookMonthWise from "../cashBook/cash-book-monthwise";
import { ProfitAndLossReportFilterInitialState } from "./profit-and-loss-report-filter";


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
  const [filter, setFilter] = useState<any>(ProfitAndLossReportFilterInitialState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.ledgerName}
  </span>
      ),
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
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
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
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
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName==="TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
  {cellElement.data.balance}
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
   
                  gridId="grd_profit_and_loss_detailed"
                  // popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  // gridAddButtonType="popup"
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
        <ERPModal
        isOpen={isOpenDetails.isOpen}
        // title={t("bank_cards")}
        title="Monthwise ledger Report"
        width="w-full max-w-[90%]" 
        isForm={true}
        closeModal={() => {
          setIsOpenDetails({ isOpen: false, key: 0 });
        }}
        content={
          <CashBookMonthWise
            postData={{
              fromDate: filter.fromDate,
              asOnDate: filter.toDate,
              AccLedger:isOpenDetails.key,
            }}
             groupName={isOpenDetails.ledgerName}
          />
        }
      />
      </div>
      
    </Fragment>
  );
};

export default ProfitAndLossSubledgerwiseView;