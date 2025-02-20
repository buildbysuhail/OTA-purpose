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
import moment from "moment";

interface OutstandingAccountAgingAnalysisProps {
  postData?: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  isMaximized?: boolean;
  modalHeight?: any;
}
const OutstandingAccountAgingAnalysis: FC<OutstandingAccountAgingAnalysisProps> = ({ postData, contentProps, rowData, isMaximized, modalHeight }) => {
  // const OutstandingAccountAgingAnalysis =  ({contentProps, enablefilter = false}:OutstandingAccountAgingAnalysisProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const { getFormattedValue } = useNumberFormat()
  // const [filter, setFilter] =useState<OutstandingAccountAgingAnalysis>({from: new Date()});
  const rootState = useRootState();

  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 135;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  const columns: DevGridColumn[] = [
    {
      dataField: "si",
      caption: t('SiNo'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf: true,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
         return  (cellElement.data.date==null||cellElement.data.date==""?"":moment(cellElement.data.date, "DD-MM-YYYY").format("DD-MMM-YYYY")) ; // Ensures proper formatting
      }
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.period6;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: cellInfo.value,
            bold: cellElement.data.form === "TOTAL" ? true : '',
            alignment: "right",
            textColor: cellElement.data.form === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
              color: cellElement.data.form === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.form === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.form === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.form === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {cellElement.data.form}
          </span>)
        }
      }
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_no"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
    },
    {
      dataField: "billTotal",
      caption: t('bill_total'),
      dataType: "string",
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
          const balance = cellElement.data?.billTotal;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: value,
            bold: cellElement.data.ledgername === "TOTAL" ? true : '',
            alignment: "right",
            textColor: cellElement.data.ledgername === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
              color: cellElement.data.ledgername === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.ledgername === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.ledgername === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.form === "TOTAL" ? 'font-bold text-[#DC143C] ' : ''}`}>
            {cellElement.data.billTotal}
          </span>)
        }
      }
    },
    {
      dataField: "period",
      caption: t("period"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      // groupIndex:0,
      showInPdf: true,
    },
    {
      dataField: "balance",
      caption: t("balance"),
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
          const balance = cellElement.data?.balance;
          const isDebit = balance >= 0;
          const value =
            balance == null
              ? ""
              : balance < 0
                ? getFormattedValue(-1 * balance)
                : getFormattedValue(balance);
          return exportCell != undefined ? {
            ...exportCell,
            text: value,
            bold: cellElement.data.ledgername === "TOTAL" ? true : '',
            alignment: "right",
            textColor: cellElement.data.ledgername === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              // color: isDebit ? "#129151" : "#DC143C",
              color: cellElement.data.ledgername === "TOTAL" ? { argb: 'FFFF0000' } : "",
              size: 10,
              style: cellElement.data.ledgername === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.ledgername === "TOTAL" ? true : false,
            }
          } : undefined;
        }
        else {
          return (<span className={`${cellElement.data.form === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.balance == 0 || cellElement.data?.balance == null ? '' : cellElement.data.balance < 0 ? getFormattedValue(-1 * cellElement.data.balance) : getFormattedValue(cellElement.data.balance)}`}
          </span>)
        }
      }
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-1 gap-3">
            <ErpDevGrid
              rowData={rowData}
              remoteOperations={{ paging: false, filtering: false, sorting: false }}
              // allowGrouping={true}
              // groupPanelVisible={true}
              heightToAdjustOnWindowsInModal={gridHeight.windows}
              columns={columns}
              filterText=" for {___ (ledgername)} {**** as of (asonDate)}"
              postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
              gridHeader={t("account_aging_analysis")}
              dataUrl={Urls.acc_reports_aging_analysis}
              method={ActionType.POST}
              gridId="grd_cost_centre"
              popupAction={toggleCostCentrePopup}
              // allowEditing={false}
              hideGridAddButton={true}
              // gridAddButtonType="popup"
              reload={true}
            ></ErpDevGrid>
          </div>
        </div>
      </div>

    </Fragment>
  );
};

export default OutstandingAccountAgingAnalysis;