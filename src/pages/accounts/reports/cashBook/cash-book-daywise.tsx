import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useEffect, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import CashBookDetailed from "./cash-book-detailed";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";
interface CashBookMonthDayWiseProps {
  postData: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
}
// interface CashBookMonthWiseProps {
//   postData: any;
//   groupName?: string;
//   contentProps?: any;
// }

const CashBookDayWise: FC<CashBookMonthDayWiseProps> = ({ postData, contentProps,rowData }) => {
// const CashBookDayWise = ({ contentProps, enablefilter = false,}: CashBookMonthDayWiseProps) => {
  // debugger;
  
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  // const [filter, setFilter] =useState<CashBookDayWise>({from: new Date()});
  const rootState = useRootState();
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });
  // const [_postData, setPostData] = useState({})
  // const [filter, setFilter] =useState<CashBookMonthWiseFilters>({from: new Date()});
  useEffect(() => {
    let wh = window.innerHeight;
    let gridHeightMobile = wh - 200; // Assuming 200px is the height to minus for mobile
    let gridHeightWindows = wh - 100; // Assuming 100px is the height to minus for windows
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, []);
  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t('date'),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => <DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>
    },
    {
      dataField: "ledgerName",
      caption: t("ledger_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
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
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.credit == 0 || cellElement.data?.credit == null ? '' : cellElement.data.credit < 0 ? getFormattedValue(-1 * cellElement.data.credit) : getFormattedValue(cellElement.data.credit)}`}
        </span>
      ),
    },
    {
      dataField: "monthBal",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green text-lg' : cellElement.data.ledgerName == "TOTAL" ? 'pl-4 font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : cellElement.data.monthBal < 0 ? getFormattedValue(-1 * cellElement.data.monthBal) : getFormattedValue(cellElement.data.monthBal)} ${cellElement.data?.monthBal == 0 || cellElement.data?.monthBal == null ? '' : cellElement.data?.monthBal >= 0 ? 'Dr' : 'Cr'}`}
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
      dataField: "closingBalance",
      caption: t("closing_balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.ledgerName === "TOTAL" ? 'font-bold text-red text-lg' : ''}`}>
          {`${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data.closingBalance < 0 ? getFormattedValue(-1 * cellElement.data.closingBalance) : getFormattedValue(cellElement.data.closingBalance)} ${cellElement.data?.closingBalance == 0 || cellElement.data?.closingBalance == null ? '' : cellElement.data?.closingBalance >= 0 ? 'Dr' : 'Cr'}`}
        </span>
      ),
    },
  ];
  // const [gridHeight, setGridHeight] = useState<number>(() => {
  //   debugger;
  //   const modals = document.querySelectorAll('.erp-modal-opened');
  //   if (modals.length > 0) {
  //     const latestModal = modals[modals.length - 1] as HTMLElement;
  //     return (window.innerHeight - latestModal.offsetHeight) + 200;
  //   } else {
  //     return window.innerHeight - 400;
  //   }
  // });
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  heightToAdjustOnWindows={gridHeight.windows}
                  showSerialNo={true}
                  columns={columns}
                  filterText="{___(month)} {**** As On Date : (asonDate)}"
                  gridHeader={t("cash_book_daywise")}
                  dataUrl={Urls.acc_reports_cash_book_daywise}
                  method={ActionType.POST}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  gridId="grd_cost_centre"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  rowData={rowData}
                  childPopupProps={{
                    content: <CashBookDetailed postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)}}/>,
                    title: t("cash_book_detailed"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "transactionDate",
                    bodyProps: "transactionDate",
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

export default CashBookDayWise;