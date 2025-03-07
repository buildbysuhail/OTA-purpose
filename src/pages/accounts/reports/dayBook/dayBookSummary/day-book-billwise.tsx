import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useEffect, useState } from "react";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../../utilities/Utils";
import moment from "moment";
import AccTransactionForm from "../../../transactions/acc-transaction";

interface DayBookBillwiseProps {
  postData?: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  isMaximized?: boolean;
  modalHeight?: any;
}

const DayBookBillWise: FC<DayBookBillwiseProps> = ({
  postData,
  contentProps,
  rowData,
  isMaximized,
  modalHeight,
}) => {
  // const DayBookBillWise = ({contentProps, enablefilter = false}:DayBookBillwiseProps) => {
  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat();
  const { t } = useTranslation("accountsReport");
  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 140;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);
  // const [filter, setFilter] =useState<DayBookBillWise>({from: new Date()});
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
     format:"dd-MMM-yyyy"
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    // {
    //   dataField: "costCenterName",
    //   caption: t("cost_center"),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 100,
    //   showInPdf: true,
    // },
    {
      dataField: "particulars",
      caption: t("particulars"),
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
          return exportCell != undefined
            ? {
              ...exportCell,
              text: cellInfo.value,
              bold: true,
              alignment: "right",
              textColor:
                cellElement.data.particulars === "TOTAL" ? "#FF0000" : "",
              font: {
                ...exportCell.font,
                color:
                  cellElement.data.particulars === "TOTAL"
                    ? { argb: "FFFF0000" }
                    : "",
                size: 10,
                style:
                  cellElement.data.particulars === "TOTAL"
                    ? "bold"
                    : "normal",
                bold: cellElement.data.particulars === "TOTAL" ? true : false,
              },
            }
            : undefined;
        } else {
          return (
            <span
              className={`${cellElement.data.particulars === "TOTAL"
                  ? "font-bold text-[#DC143C]"
                  : ""
                }`}
            >
              {cellElement.data.particulars}
            </span>
          );
        }
      },
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? cellElement.data.particulars === "TOTAL"
                  ? getFormattedValue(-1 * balance)
                  : -1 * balance
                : cellElement.data.particulars === "TOTAL"
                  ? getFormattedValue(balance)
                  : balance;
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor:
              cellElement.data.particulars === "TOTAL" ? "#FF0000" : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.particulars === "TOTAL"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.particulars === "TOTAL" ? "bold" : "normal",
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.particulars === "TOTAL"
                  ? "font-bold text-[#DC143C]"
                  : ""
                }`}
            >
              {`${cellElement.data?.debit == null
                  ? "0"
                  : cellElement.data.debit < 0
                    ? -1 * cellElement.data.debit
                    : cellElement.data.particulars === "TOTAL"
                      ? getFormattedValue(cellElement.data.debit)
                      : cellElement.data.debit
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? cellElement.data.particulars === "TOTAL"
                  ? getFormattedValue(-1 * balance)
                  : -1 * balance
                : cellElement.data.particulars === "TOTAL"
                  ? getFormattedValue(balance)
                  : balance;
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor:
              cellElement.data.particulars === "TOTAL" ? "#FF0000" : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.particulars === "TOTAL"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.particulars === "TOTAL" ? "bold" : "normal",
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.particulars === "TOTAL"
                  ? "font-bold text-[#DC143C]"
                  : ""
                }`}
            >
              {`${cellElement.data?.credit == null
                  ? "0"
                  : cellElement.data.credit < 0
                    ? -1 * cellElement.data.credit
                    : cellElement.data.particulars === "TOTAL"
                      ? getFormattedValue(cellElement.data.credit)
                      : cellElement.data.credit
                }`}
            </span>
          );
        }
      },
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible: false,
      width: 150,
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
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return {
            ...exportCell,
            text: value,
            bold: true,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.ledgerName === "TOTAL" ? "#FF0000" : "",
            font: {
              ...exportCell.font,
              color:
                cellElement.data.particulars === "TOTAL"
                  ? { argb: "FFFF0000" }
                  : "",
              size: 10,
              style:
                cellElement.data.particulars === "TOTAL" ? "bold" : "normal",
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        } else {
          return (
            <span
              className={`${cellElement.data.particulars === "TOTAL"
                  ? "font-bold text-[#DC143C]"
                  : ""
                }`}
            >
              {`${cellElement.data?.balance == 0 ||
                  cellElement.data?.balance == null
                  ? ""
                  : cellElement.data.balance < 0
                    ? getFormattedValue(-1 * cellElement.data.balance)
                    : getFormattedValue(cellElement.data.balance)
                } ${cellElement.data?.balance == 0 ||
                  cellElement.data?.balance == null
                  ? ""
                  : cellElement.data?.balance >= 0
                    ? "Dr"
                    : "Cr"
                }`}
            </span>
          );
        }
      },
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-1 gap-3">
            <ErpDevGrid
              postData={mergeObjectsRemovingIdenticalKeys(
                postData,
                contentProps
              )}
              heightToAdjustOnWindowsInModal={gridHeight.windows}
              columns={columns}
              rowData={rowData}
              // postData = {contentProps}
              filterText="{___of (voucherType)}, {**** from (dateFrom)}{**** to (dateTo)}"
              gridHeader={t("daybook_billwise")}
              dataUrl={Urls.acc_reports_day_book_billwise}
              method={ActionType.POST}
              gridId="grd_day_book_billwise"
              popupAction={toggleCostCentrePopup}
              // allowEditing={false}
              hideGridAddButton={true}
              // gridAddButtonType="popup"
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
            ></ErpDevGrid>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DayBookBillWise;
