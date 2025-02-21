import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid, {
  DrillDownCellTemplate,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { ActionType } from "../../../../../redux/types";
import { toggleCostCentrePopup } from "../../../../../redux/slices/popup-reducer";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import moment from "moment";

interface AccountsHistoryPopupProps {
  contentProps?: any;
  enablefilter?: boolean;
  isMaximized?: boolean;
  modalHeight?: any;
}
const AccountsHistoryPopup = ({
  contentProps,
  isMaximized,
  modalHeight,
}: AccountsHistoryPopupProps) => {
  const { t } = useTranslation("accountsReport");
    const { getFormattedValue } = useNumberFormat()
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
      dataField: "slNo",
      caption: t("SiNo"),
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
      width: 70,
      showInPdf: true,
       format:"dd-MMM-yyyy"
    },
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      width: 70,
    },
    {
      dataField: "vchNo",
      caption: t("voucher_no"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      showInPdf: true,
      width: 120,
      cellRender: (cellElement: any, cellInfo: any) => {
        
        return (
          cellElement.data.oldAccTransactionMasterID > 0 ? <DrillDownCellTemplate data={cellElement} field="vchNo"></DrillDownCellTemplate> : cellElement.value
          
        )
      },
    },
    {
      dataField: "accountName",
      caption: t("account_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,

      showInPdf: true,
    },
    {
      dataField: "particulars",
      caption: t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,

      showInPdf: true,
    },
    {
      dataField: "debit",
      caption: t("debit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.debit;
          const isDebit = balance >= 0;
          const value =
            balance == null 
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance,false,4) 
              : getFormattedValue(balance,false,4) ;

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.particulars === "TOTAL" ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.debit == null 
              ? '':getFormattedValue(cellElement.data.debit,false,4) }`}
          </span>)
        }
      }
    },
    {
      dataField: "credit",
      caption: t("credit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
      cellRender: (cellElement: any, cellInfo: any, filter: any, exportCell: any) => {
        if (exportCell != undefined) {
          const balance = cellElement.data?.credit;
          const isDebit = balance >= 0;
          const value =
            balance == null 
              ? ""
              : balance < 0
              ? getFormattedValue(-1 * balance,false,4) 
              : getFormattedValue(balance,false,4) ;

          return {
            ...exportCell,
            text: value,
            bold: cellElement.data.particulars === "TOTAL" ? true : false,
            alignment: "right",
            alignmentExcel: { horizontal: 'right' },
            textColor: cellElement.data.particulars === "TOTAL" ? '#FF0000' : '',
            font: {
              ...exportCell.font,
              color: cellElement.data.particulars === "TOTAL" ? { argb: 'FFFF0000' } : '',
              size: 10,
              style: cellElement.data.particulars === "TOTAL" ? 'bold' : 'normal',
              bold: cellElement.data.particulars === "TOTAL" ? true : false,
            },
          };
        }
        else {
          return (<span className={`${cellElement.data.particulars === "TOTAL" ? 'font-bold text-[#DC143C]' : ''}`}>
            {`${cellElement.data?.credit == null 
              ? '':getFormattedValue(cellElement.data.credit,false,4) }`}
          </span>)
        }
      }
    },
    {
      dataField: "narration",
      caption: t("narration"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf: true,
    },
    {
      dataField: "oldAccTransactionMasterID",
      caption: t("oldAccTransactionMasterId"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible:false,
      showInPdf:false,
      width: 150,
    },
    {
      dataField: "accTransactionMasterID",
      caption: t("accTransactionMasterId"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      visible:false,
      showInPdf:false,
      width: 150,
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
                  columns={columns}
                  gridHeader={t("accounts_transaction_history_popup")}
                  dataUrl={Urls.acc_reports_accounts_history_popup}
                  method={ActionType.POST}
                  postData={
                    contentProps.oldAccTransactionMasterID != 0
                      ? contentProps
                      : null
                  }
                  gridId="grd_accounts_history_popup"
                  popupAction={toggleCostCentrePopup}
                  hideGridAddButton={true}
                  reload={true}
                  childPopupProps={{
                    content: <AccountsHistoryPopup />,
                    title: t("accounts_transaction_history_popup"),
                    isForm: false,
                    width: 1500,
                    drillDownCells: "vchNo",
                    bodyProps: "oldAccTransactionMasterID",
                    enableFn: (data: any) => data.oldAccTransactionMasterID > 0
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

export default AccountsHistoryPopup;