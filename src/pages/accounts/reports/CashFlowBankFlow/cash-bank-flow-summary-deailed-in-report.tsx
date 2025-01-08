import { FC, Fragment, useState } from "react";
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
  postData: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  origin?:any;
}

const CashFlowBankFlowSummaryDetailedInReport: FC<CashFlowBankFlowSummaryDetailedInProps> = ({ postData, contentProps,rowData,origin }) => {

  const dispatch = useAppDispatch();
  const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const columns: DevGridColumn[] = [

    // {
    //   dataField: "accGroupIDIN",
    //   caption: t("accGroupIDIN"),
    //   dataType: "number",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 300,
    //   showInPdf:true,
    // },
    {
      dataField: "ledgerNameIN",
      caption: t("particulars_in_flow"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true? 'font-bold text-green' :cellElement.data.ledgerNameIN == "TOTAL" ? 'font-bold text-red' :cellElement.data.ledgerNameIN == "NET FLOW"? 'pl-20 text-lg font-bold text-blue': ''}`}>
          {cellElement.data.ledgerNameIN}
        </span>
      ),
    },
    // {
    //   dataField: "accGroupNameIN",
    //   caption: t("accGroupNameIN"),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 300,
    //   showInPdf:true,
    // },
    {
      dataField: "cashFlowIN",
      caption: t("in_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerNameIN == "TOTAL" ? 'pl-4 font-bold text-red' :cellElement.data.ledgerNameIN == "NET FLOW"? 'text-lg font-bold text-blue':''}`}>
          {`${ cellElement.data?.cashFlowIN == null ? '' : getFormattedValue(cellElement.data.cashFlowIN)}`}
        </span>
      ),
    },
    {
      dataField: "ledgerNameOut",
      caption: t("particulars_out_flow"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true? 'font-bold text-green' :cellElement.data.ledgerNameOut == "TOTAL" ? 'font-bold text-red': ''}`}>
          {cellElement.data.ledgerNameOut}
        </span>
      ),
    },
    
    {
      dataField: "cashFlowOut",
      caption: t("out_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroup == true ? 'font-bold text-green' : cellElement.data.ledgerNameOut == "TOTAL" ? 'pl-4 font-bold text-red' :''}`}>
          {`${ cellElement.data?.cashFlowOut == null ? '' :  getFormattedValue(cellElement.data.cashFlowOut)}`}
        </span>
      ),
    },
   {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
    },
  ];
  debugger;
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                 rowData={rowData}
                 remoteOperations={{filtering:false,paging:false,sorting:false}}
                  allowGrouping={true}
                  columns={columns}
                  filterText="{___ as of (month)} {___(year)}"
                  gridHeader={origin=="cash_flow"? t("cash_flow_report_detailed"):t("bank_flow_report_detailed")}
                  dataUrl={Urls.acc_reports_cash_bank_flow_detailed_summary_in }
                  method={ActionType.POST}
                  gridId="grd_cashflow_bankflow_drilldown_new"
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