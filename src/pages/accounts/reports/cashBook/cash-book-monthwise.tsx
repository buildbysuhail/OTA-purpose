import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import CashBookDayWise from "./cash-book-daywise";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

// interface CashBookMonthWiseProps {
//   contentProps?: any
//   enablefilter?: boolean;
// }
interface CashBookMonthWiseProps {
  postData: any;
  groupName?: string;
  contentProps?: any;
}

const CashBookMonthWise: FC<CashBookMonthWiseProps> = ({ postData, contentProps }) => {
  // interface CashBookMonthWiseFilters {
  //   from: Date
  // }
  // const CashBookMonthWise = ({contentProps, enablefilter = false}:CashBookMonthWiseProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  // const [_postData, setPostData] = useState({})
  // const [filter, setFilter] =useState<CashBookMonthWiseFilters>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    // {
    //   dataField: "siNo",
    //   caption: t('si_no'),
    //   dataType: "number",
    //   allowSearch: true, 
    //   allowFiltering: true,
    //   width: 80,
    // },
    {
      dataField: "year",
      caption: t("year"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      visible: false,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "monthNum",
      caption: t("month_num"),
      dataType: "number",
      visible: false,
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
    },
    {
      dataField: "debit",
      caption: t('debit'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
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
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "monthBal",
      caption: t("month_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green text-lg' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : cellElement.data.monthBal < 0 ? getFormattedValue(-1 * cellElement.data.monthBal) : getFormattedValue(cellElement.data.monthBal)} ${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : cellElement.data?.monthBal >= 0 ? 'Dr' : 'Cr'}`}
        </span>
      ),
    },
    {
      dataField: "closingBalance",
      caption: t("closing_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 250,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data.closingBalance < 0 ? getFormattedValue(-1 * cellElement.data.closingBalance) : getFormattedValue(cellElement.data.closingBalance)} ${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data?.closingBalance >= 0 ? 'Dr' : 'Cr'}`}
        </span>
      ),
    }
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  heightToAdjustOnWindows={window.innerHeight - 649}
                  showSerialNo={true}
                  columns={columns}
                  gridHeader={t("cash_book")}
                  dataUrl={Urls.acc_reports_cash_book_monthwise}
                  method={ActionType.POST}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  gridId="grd_cash_book_monthly"
                  popupAction={toggleCostCentrePopup}
                  // allowEditing={false}
                  hideGridAddButton={true}
                  // gridAddButtonType="popup"
                  reload={true}
                  // CashBookMonthWise
                  childPopupProps={{
                    content: <CashBookDayWise />,
                    title: t("cash_book_daywise"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "month",
                    bodyProps: "year,monthNum,ledgerID,asonDate",
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

export default CashBookMonthWise;