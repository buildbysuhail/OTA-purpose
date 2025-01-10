import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { FC, Fragment, useEffect, useState } from "react";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { ActionType } from "../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";

interface CashBookDetailedProps {
  postData: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  isMaximized?: boolean;
  modalHeight?: any;
}
const CashBookDetailed: FC<CashBookDetailedProps> = ({
  postData,
  contentProps,
  rowData,
  isMaximized,
  modalHeight,
}) => {
  // const CashBookDetailed = ({ contentProps, enablefilter = false }: CashBookDetailedProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();

  const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

  useEffect(() => {
    let gridHeightMobile = modalHeight - 50;
    let gridHeightWindows = modalHeight - 180; 
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "transactionDate",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      showInPdf:true,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_number"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "vType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span
          className={`${
            cellElement.data.particulars === "TOTAL"
              ? "font-bold text-[#DC143C] text-lg"
              : ""
          }`}
        >
          {cellElement.data.particulars}
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
      cellRender: (cellElement: any, cellInfo: any) => (
        <span
          className={`${
            cellElement.data.particulars === "TOTAL"
              ? "font-bold text-[#DC143C] text-lg"
              : ""
          }`}
        >
          {`${
            cellElement.data?.debit == 0 || cellElement.data?.debit == null
              ? ""
              : cellElement.data.debit < 0
              ? getFormattedValue(-1 * cellElement.data.debit)
              : getFormattedValue(cellElement.data.debit)
          } ${
            cellElement.data?.debit == 0 || cellElement.data?.debit == null
              ? ""
              : cellElement.data?.debit >= 0
              ? "Dr"
              : "Cr"
          }`}
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
          className={`${
            cellElement.data.particulars === "TOTAL"
              ? "font-bold text-[#DC143C] text-lg"
              : ""
          }`}
        >
          {`${
            cellElement.data?.credit == 0 || cellElement.data?.credit == null
              ? ""
              : cellElement.data.credit < 0
              ? getFormattedValue(-1 * cellElement.data.credit)
              : getFormattedValue(cellElement.data.credit)
          } ${
            cellElement.data?.credit == 0 || cellElement.data?.credit == null
              ? ""
              : cellElement.data?.credit >= 0
              ? "Dr"
              : "Cr"
          }`}
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
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span
          className={`${
            cellElement.data.particulars === "TOTAL"
              ? "font-bold text-[#DC143C] text-lg"
              : ""
          }`}
        >
          {`${
            cellElement.data?.balance == 0 || cellElement.data?.balance == null
              ? ""
              : cellElement.data.balance < 0
              ? getFormattedValue(-1 * cellElement.data.balance)
              : getFormattedValue(cellElement.data.balance)
          } ${
            cellElement.data?.balance == 0 || cellElement.data?.balance == null
              ? ""
              : cellElement.data?.balance >= 0
              ? "Dr"
              : "Cr"
          }`}
        </span>
      ),
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "branch",
      caption: t("branch"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div>
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  remoteOperations={{ paging: false, filtering: false, sorting: false }}
                  rowData={rowData}
                  heightToAdjustOnWindowsInModal={gridHeight.windows}
                  columns={columns}
                  filterText="for {___(ledgerName)},{___ day of (transactionDate)}"
                  gridHeader={t("ledger_report_detailed")}
                  dataUrl={Urls.acc_reports_cash_book_transactionwise}
                  method={ActionType.POST}
                  gridId="grd_cash_book_detailed"
                  postData={contentProps}
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CashBookDetailed;
