import { FC, Fragment, useEffect, useState } from "react";
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
  isMaximized?: boolean; 
  modalHeight?:any
}

const CashBankFlowDetailedSummaryReport: FC<CashFlowBankFlowDetailedSummaryProps> = ({ postData, contentProps,rowData,origin,isMaximized,modalHeight }) => {

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
    }, [isMaximized,modalHeight]);

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
      minWidth: 200,
      showInPdf:true,
    cellRender: (cellElement: any, cellInfo: any) => (
      <span className={`${cellElement.data.isGroupCashIN == false? 'pl-4' :cellElement.data.ledgerNameIN == "TOTAL" ? 'font-bold text-[#DC143C]' :cellElement.data.ledgerNameIN == "NET FLOW"? 'pl-20 text-lg font-bold text-blue': 'font-bold text-[#2E8B57]'}`}>
              {cellElement.data.isGroupCashIN == true && cellElement.data.ledgerNameIN !== "TOTAL" && cellElement.data.ledgerNameIN !== "NET FLOW" ? (<DrillDownCellTemplate data={cellElement} field="ledgerNameIN"></DrillDownCellTemplate>) :(<>{cellElement.data.ledgerNameIN}</>)}
      </span>
    ),
  },
    {
      dataField: "cashFlowIN",
      caption: t("in_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroupCashIN == false ? 'pr-8 ' : cellElement.data.ledgerNameIN == "TOTAL" ? 'pl-4 font-bold text-[#DC143C]' :cellElement.data.ledgerNameIN == "NET FLOW"? 'text-lg font-bold text-blue':'font-bold text-[#2E8B57]'}`}>
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
      minWidth: 200,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroupCashOut == false? 'pl-4' :cellElement.data.ledgerNameOut == "TOTAL" ? 'font-bold text-[#DC143C]' : 'font-bold text-[#2E8B57]'}`}>
        {cellElement.data.isGroupCashOut == true && cellElement.data.ledgerNameOut !== "TOTAL"  ? (<DrillDownCellTemplate data={cellElement} field="ledgerNameOut"></DrillDownCellTemplate>) :(<>{cellElement.data.ledgerNameOut}</>)}
        </span>
      ),
    },
    // {
    //   dataField: "accGroupNameOut",
    //   caption: t("accGroupNameOut"),
    //   dataType: "string",
    //   allowSearch: true,
    //   allowFiltering: true,
    //   minWidth: 200,
    //   showInPdf:true,
    // },
    {
      dataField: "cashFlowOut",
      caption: t("out_amount"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      showInPdf:true,
      cellRender: (cellElement: any, cellInfo: any) => (
        <span className={`${cellElement.data.isGroupCashOut == false ? 'pr-8 ' : cellElement.data.ledgerNameOut == "TOTAL" ? 'pl-4 font-bold text-[#DC143C]' :'font-bold text-[#2E8B57]'}`}>
          {`${cellElement.data?.cashFlowOut == 0 || cellElement.data?.cashFlowOut == null ? '' : cellElement.data.cashFlowOut < 0 ? getFormattedValue(-1 * cellElement.data.cashFlowOut) : getFormattedValue(cellElement.data.cashFlowOut)}`}
        </span>
      ),
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
                remoteOperations={{filtering:false,paging:false,sorting:false}}
                  columns={columns}
                  filterText="as of {___(month)} {****(year)}"
                  gridHeader={origin=="cash_flow"? t("cash_flow_report_summary"):t("bank_flow_report_summary")}
                  dataUrl={Urls.acc_reports_cash_bank_flow_detailed_summary }
                  method={ActionType.POST}
                  gridId="grd_cashflow_bankflow_drilldown_summary"
                  popupAction={toggleCostCentrePopup}
                  postData={mergeObjectsRemovingIdenticalKeys(postData, contentProps)}
                  reload={true}
                  hideGridAddButton={true}
                  childPopupPropsDynamic={(dataField: string) => ({
                    title:origin=="cash_flow"? t("cash_flow_report_summary"):t("bank_flow_report_summary"),
                    width: "700px",
                    isForm: false,
                    content: 
                    dataField == "ledgerNameIN" ?
                    <CashFlowBankFlowSummaryDetailedInReport postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)
                        }} />
                    :  
                    dataField == "ledgerNameOut" ?
                    <CashFlowBankFlowSummaryDetailedOutReport postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps) }} />
                      : null
                      ,
                    drillDownCells: dataField == "ledgerNameIN" ? "ledgerNameIN" : "ledgerNameOut",
                    bodyProps: dataField == "ledgerNameIN" ? "accGroupIDIN" : "accGroupIDOut",
                    origin:"cash_flow",
                  })}
                  // childPopupProps={{
                  //   content: <CashFlowBankFlowSummaryDetailedInReport postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)
                  //   }} />,
                  //   title: t("cash_flow_report_detailed"),
                  //   isForm: false,
                  //   width: "mw-100",
                  //   drillDownCells: "ledgerNameIN",
                  //   bodyProps: "accGroupIDIN",
                  //   origin:"cash_flow",
                  //   //  enableFn: (data: any) => (data?.isGroupCashOut==true&&data?.ledgerNameOut!="TOTAL") ||(data?.isGroupCashIN==true&&data?.ledgerNameIN!="TOTAL"||data?.ledgerNameIN!="NET FLOW")
                  // }}
                  // childPopupProps={{
                  //   content: <CashFlowBankFlowSummaryDetailedOutReport postData={{...mergeObjectsRemovingIdenticalKeys(postData, contentProps)
                  //   }} />,
                  //   title: t("cash_flow_report_detailed"),
                  //   isForm: false,
                  //   width: "mw-100",
                  //   drillDownCells: "ledgerNameOut",
                  //   bodyProps: "accGroupIDOut",
                  //   origin:"cash_flow",
                  //   //  enableFn: (data: any) => (data?.isGroupCashOut==true&&data?.ledgerNameOut!="TOTAL") ||(data?.isGroupCashIN==true&&data?.ledgerNameIN!="TOTAL"||data?.ledgerNameIN!="NET FLOW")
                  // }}
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