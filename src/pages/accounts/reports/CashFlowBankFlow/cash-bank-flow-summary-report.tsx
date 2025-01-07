import { FC, Fragment, useState } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleCostCentrePopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid, { DrillDownCellTemplate } from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { ActionType } from "../../../../redux/types";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { mergeObjectsRemovingIdenticalKeys } from "../../../../utilities/Utils";
import CashFlowBankFlowSummaryDetailedInReport from "./cash-bank-flow-summary-deailed-in-report";
import CashFlowBankFlowSummaryDetailedOutReport from "./cash-bank-flow-summary-deailed-out-report";
interface CashFlowBankFlowDetailedSummaryProps {
  postData: any;
  groupName?: string;
  contentProps?: any;
  rowData?: any;
  origin?:any;
}

const CashBankFlowDetailedSummaryReport: FC<CashFlowBankFlowDetailedSummaryProps> = ({ postData, contentProps,rowData,origin }) => {

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
    //   cellRender: (cellElement: any, cellInfo: any) => (
    //     <span className={`${cellElement.data.isGroupCashIN == false? 'pl-4' :cellElement.data.ledgerNameIN == "TOTAL" ? 'font-bold text-red' :cellElement.data.ledgerNameIN == "NET FLOW"? 'pl-20 text-lg font-bold text-blue': 'font-bold text-green'}`}>
    //       {cellElement.data.ledgerNameIN}
    //     </span>
       
    //   ),
    // },

    cellRender: (cellElement: any, cellInfo: any) => (
      <span className={`${cellElement.data.isGroupCashIN == false? 'pl-4' :cellElement.data.ledgerNameIN == "TOTAL" ? 'font-bold text-red' :cellElement.data.ledgerNameIN == "NET FLOW"? 'pl-20 text-lg font-bold text-blue': 'font-bold text-green'}`}>
              {cellElement.data.isGroupCashIN == true  ? (<DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>) :(<>{cellElement.data.ledgerNameIN}</>)}
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
        <span className={`${cellElement.data.isGroupCashIN == false ? 'pr-8 ' : cellElement.data.ledgerNameIN == "TOTAL" ? 'pl-4 font-bold text-red' :cellElement.data.ledgerNameIN == "NET FLOW"? 'text-lg font-bold text-blue':'font-bold text-green'}`}>
          {`${cellElement.data?.cashFlowIN == 0 || cellElement.data?.cashFlowIN == null ? '' : cellElement.data.cashFlowIN < 0 ? getFormattedValue(-1 * cellElement.data.cashFlowIN) : getFormattedValue(cellElement.data.cashFlowIN)}`}
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
        <span className={`${cellElement.data.isGroupCashOut == false? 'pl-4' :cellElement.data.ledgerNameOut == "TOTAL" ? 'font-bold text-red' : 'font-bold text-green'}`}>
        {cellElement.data.isGroupCashOut == true  ? (<DrillDownCellTemplate data={cellElement}></DrillDownCellTemplate>) :(<>{cellElement.data.ledgerNameOut}</>)}
        </span>
      ),
    },
    // {
    //   dataField: "accGroupNameOut",
    //   caption: t("accGroupNameOut"),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 300,
    //   showInPdf:true,
    // },
    {
      dataField: "cashFlowOut",
      caption: t("out_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 300,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroupCashOut == false ? 'pr-8 ' : cellElement.data.ledgerNameOut == "TOTAL" ? 'pl-4 font-bold text-red' :'font-bold text-green'}`}>
          {`${cellElement.data?.cashFlowOut == 0 || cellElement.data?.cashFlowOut == null ? '' : cellElement.data.cashFlowOut < 0 ? getFormattedValue(-1 * cellElement.data.cashFlowOut) : getFormattedValue(cellElement.data.cashFlowOut)}`}
        </span>
      ),
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
                  columns={columns}
                  filterText="{___ as of (month)} {___(year)}"
                  gridHeader={origin=="cash_flow"? t("cash_flow_report_detailed"):t("bank_flow_report_detailed")}
                  dataUrl={Urls.acc_reports_cash_bank_flow_detailed_summary }
                  method={ActionType.POST}
                  gridId="grd_cashflow_bankflow_drilldown_new"
                  popupAction={toggleCostCentrePopup}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  reload={true}
                  hideGridAddButton={true}
                //   childPopupPropsDynamic={(dataField: string) => ({
                //     title:  t(`cash_flow_report_detailed`),
                //     width: "700px",
                //     isForm: false,
                //     content: dataField == "ledgerNameIN" ? <CashFlowBankFlowSummaryDetailedInReport postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)
                //       // ,
                //       // reportType:"Cash",
                //     }} /> : <CashFlowBankFlowSummaryDetailedOutReport postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)
                //       // ,
                //       // reportType:"Cash",
                //     }} />,
                //     drillDownCells: dataField == "ledgerNameIN" ? "ledgerNameIN" : "ledgerNameOut",
                //     bodyProps: dataField == "accGroupIDIN" ?"accGroupIDIN":"AccGroupIDOut",
                //  //   enableFn: (data: any) => (data?.isGroupCashOut==true&&data?.ledgerNameOut!="TOTAL") ||(data?.isGroupCashIN==true&&data?.ledgerNameIN!="TOTAL"||data?.ledgerNameIN!="NET FLOW")
                //   })}
                  // childPopupProps={{
                  //   content: <CashFlowBankFlowSummaryDetailedInReport postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)
                  //     // ,
                  //     // reportType:"Cash",
                  //   }} />,
                  //   title: t("cash_flow_report_detailed"),
                  //   isForm: false,
                  //   width: "mw-100",
                  //   drillDownCells: "ledgerNameIN",
                  //   bodyProps: "accGroupIDIN",
                  //   origin:"cash_flow",
                  //   //  enableFn: (data: any) => (data?.isGroupCashOut==true&&data?.ledgerNameOut!="TOTAL") ||(data?.isGroupCashIN==true&&data?.ledgerNameIN!="TOTAL"||data?.ledgerNameIN!="NET FLOW")
                  // }}
                  childPopupProps={{
                    content: <CashFlowBankFlowSummaryDetailedOutReport postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)
                      // ,
                      // reportType:"Cash",
                    }} />,
                    title: t("cash_flow_report_detailed"),
                    isForm: false,
                    width: "mw-100",
                    drillDownCells: "ledgerNameOut",
                    bodyProps: "accGroupIDOut",
                    origin:"cash_flow",
                    //  enableFn: (data: any) => (data?.isGroupCashOut==true&&data?.ledgerNameOut!="TOTAL") ||(data?.isGroupCashIN==true&&data?.ledgerNameIN!="TOTAL"||data?.ledgerNameIN!="NET FLOW")
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
export default CashBankFlowDetailedSummaryReport;