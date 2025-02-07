import { FC, Fragment, useEffect, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";
interface CashFlowBankFlowSummaryDetailedInProps {
  postData?: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  origin?: any;
  isMaximized?: boolean;
  modalHeight?: any
}

const CashFlowBankFlowSummaryDetailedInReport: FC<CashFlowBankFlowSummaryDetailedInProps> = ({ postData, contentProps, rowData, origin, isMaximized, modalHeight }) => {

  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
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
      dataField: "ledgerNameIN",
      caption: t("particulars_in_flow"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 300,
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
            text: (cellElement.data.isGroup == false ? "   " : cellElement.data.ledgerNameIN == "NET FLOW" ? "                " : "") + (cellInfo.value ?? ""),
            bold: cellElement.data?.ledgerNameIN == "TOTAL" || cellElement.data.ledgerNameIN == "NET FLOW" || cellElement.data.isGroup ? true : false,
            alignment: "right",
            textColor: cellElement.data?.ledgerNameIN == "TOTAL" ? '#DC143C' : cellElement.data.ledgerNameIN == "NET FLOW" ? '#0000FF' : cellElement.data.isGroup ? '#2E8B57' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data?.ledgerNameIN == "TOTAL"
                ? { argb: 'FFFF0000' } // Red
                : cellElement.data.ledgerNameIN == "NET FLOW"
                  ? { argb: 'FF0000FF' } // Blue
                  : cellElement.data.isGroup
                    ? { argb: 'FF2E8B57' } // Sea Green
                    : '', size: 10,
                    style: cellElement.data?.ledgerNameIN == "TOTAL" ||cellElement.data.ledgerNameIN == "NET FLOW"||cellElement.data.isGroup==true? "bold" : "normal",
                    bold: cellElement.data?.ledgerNameIN == "TOTAL" ||cellElement.data.ledgerNameIN == "NET FLOW"||cellElement.data.isGroup==true?true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57]' : cellElement.data.ledgerNameIN == "TOTAL" ? 'font-bold text-[#DC143C]' : cellElement.data.ledgerNameIN == "NET FLOW" ? 'pl-20 text-lg font-bold text-blue' : ''}`}>
            {cellElement.data.ledgerNameIN}
          </span>)
        }
      }
    },
    {
      dataField: "cashFlowIN",
      caption: t("in_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      minWidth: 300,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.cashFlowIN;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: cellElement.data.isGroup == false ? value + "       " : value,
            bold: cellElement.data?.ledgerNameIN == "TOTAL" || cellElement.data.ledgerNameIN == "NET FLOW" || cellElement.data.isGroup == true ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data?.ledgerNameIN == "TOTAL" ? '#DC143C' : cellElement.data.ledgerNameIN == "NET FLOW" ? '#0000FF' : cellElement.data.isGroup ? '#2E8B57' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data?.ledgerNameIN == "TOTAL"
                ? { argb: 'FFFF0000' } // Red
                : cellElement.data.ledgerNameIN == "NET FLOW"
                  ? { argb: 'FF0000FF' } // Blue
                  : cellElement.data.isGroup
                    ? { argb: 'FF2E8B57' } // Sea Green
                    : '', size: 10,
                    style: cellElement.data?.ledgerNameIN == "TOTAL" ||cellElement.data.ledgerNameIN == "NET FLOW"||cellElement.data.isGroup==true? "bold" : "normal",
                    bold: cellElement.data?.ledgerNameIN == "TOTAL" ||cellElement.data.ledgerNameIN == "NET FLOW"||cellElement.data.isGroup==true?true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57]' : cellElement.data.ledgerNameIN == "TOTAL" ? 'pl-4 font-bold text-[#DC143C]' : cellElement.data.ledgerNameIN == "NET FLOW" ? 'text-lg font-bold text-blue' : ''}`}>
            {`${cellElement.data?.cashFlowIN == null ? '' : getFormattedValue(cellElement.data.cashFlowIN)}`}
          </span>)
        }
      }
    },
    {
      dataField: "ledgerNameOut",
      caption: t("particulars_out_flow"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 300,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.cashFlowIN;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: (cellElement.data.isGroup == false ? "   " : cellElement.data.ledgerNameOut == "NET FLOW" ? "                " : "") + (cellInfo.value ?? ""),
            bold: cellElement.data?.ledgerNameOut == "TOTAL" || cellElement.data.ledgerNameOut == "NET FLOW" || cellElement.data.isGroup ? true : false,
            alignment: "right",
            textColor: cellElement.data?.ledgerNameOut == "TOTAL" ? '#DC143C' : cellElement.data.ledgerNameOut == "NET FLOW" ? '#0000FF' :
             cellElement.data.isGroup ? '#2E8B57' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data?.ledgerNameOut == "TOTAL"
                ? { argb: 'FFFF0000' } // Red
                : cellElement.data.ledgerNameOut == "NET FLOW"
                  ? { argb: 'FF0000FF' } // Blue
                  : cellElement.data.isGroup
                    ? { argb: 'FF2E8B57' } // Sea Green
                    : '', size: 10,
                    style: cellElement.data?.ledgerNameIN == "TOTAL" ||cellElement.data.ledgerNameIN == "NET FLOW"||cellElement.data.isGroup==true? "bold" : "normal",
                    bold: cellElement.data?.ledgerNameIN == "TOTAL" ||cellElement.data.ledgerNameIN == "NET FLOW"||cellElement.data.isGroup==true?true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57]' : cellElement.data.ledgerNameOut == "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {cellElement.data.ledgerNameOut}
          </span>)
        }
      }
    },
    {
      dataField: "cashFlowOut",
      caption: t("out_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      minWidth: 250,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.cashFlowOut;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: cellElement.data.isGroup == false ? value + "       " : value,
            bold: cellElement.data?.ledgerNameOut == "TOTAL" || cellElement.data.isGroup == true ? true : false,
            alignment: "right",
            textColor: cellElement.data?.ledgerNameOut == "TOTAL" ? '#DC143C' : cellElement.data.isGroup ? '#2E8B57' : '',
            alignmentExcel: { horizontal: 'right' },
            font: {
              ...exportCell.font,
              color: cellElement.data?.ledgerNameOut == "TOTAL"
                ? { argb: 'FFFF0000' } // Red
                : cellElement.data.ledgerNameOut == "NET FLOW"
                  ? { argb: 'FF0000FF' } // Blue
                  : cellElement.data.isGroup
                    ? { argb: 'FF2E8B57' } // Sea Green
                    : '', size: 10,
                    style: cellElement.data?.ledgerNameIN == "TOTAL" ||cellElement.data.ledgerNameIN == "NET FLOW"||cellElement.data.isGroup==true? "bold" : "normal",
                    bold: cellElement.data?.ledgerNameIN == "TOTAL" ||cellElement.data.ledgerNameIN == "NET FLOW"||cellElement.data.isGroup==true?true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.isGroup == true ? 'font-bold text-[#2E8B57]' : cellElement.data.ledgerNameOut == "TOTAL" ? 'pl-4 font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.cashFlowOut == null ? '' : getFormattedValue(cellElement.data.cashFlowOut)}`}
          </span>)
        }
      }
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      minWidth: 200,
      showInPdf: true,
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
                  heightToAdjustOnWindowsInModal={gridHeight.windows}
                  rowData={rowData}
                  remoteOperations={{ filtering: false, paging: false, sorting: false }}
                  allowGrouping={true}
                  columns={columns}
                  filterText=" for {___(ledgerNameIN)}, month of {****(month)} {****(year)}"
                  gridHeader={origin == "cash_flow" ? t("cash_flow_report_summary") : t("bank_flow_report_summary")}
                  dataUrl={Urls.acc_reports_cash_bank_flow_detailed_summary_in}
                  method={ActionType.POST}
                  gridId="grd_cashflow_bankflow_drilldown_summary_in"
                  popupAction={toggleCostCentrePopup}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  reload={true}
                  hideGridAddButton={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default CashFlowBankFlowSummaryDetailedInReport;