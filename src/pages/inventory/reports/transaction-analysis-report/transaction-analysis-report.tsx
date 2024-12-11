import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import PriceListReportFilter, { PriceListReportFilterInitialState } from "../../../accounts/reports/tax-report/price-list/price-list-report-filter";


interface CashSummary {

  from: Date
}
const TransactionAnalysisReport = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "year",
      caption: t('year'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 100,
    },
    {
      dataField: "month",
      caption: t("month"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 200,
    },
    {
      dataField: "sales",
      caption:  t("sales"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "purchase",
      caption: t("purchase"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
 
    {
      dataField: "expense",
      caption: t("expense"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "income",
      caption: t("income"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "A/CPayable",
      caption: t("a/c_payable"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "A/CReceivable",
      caption: t("a/c_receivable"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    
   
    
    // {
    //   dataField: "actions",
    //   caption: t("actions"),
    //   allowSearch: false,
    //   allowFiltering: false,
    //   fixed: true,
    //   fixedPosition: "right",
    //   width: 180,
    //   cellRender: (cellElement: any, cellInfo: any) => (
    //     <ERPGridActions
    //       view={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: false, key: cellInfo?.data?.id }) }}
    //       edit={{ type: "popup", action: () => toggleCostCentrePopup({ isOpen: false, key: cellInfo?.data?.id }) }}
    //       delete={{
    //         confirmationRequired: true,
    //         confirmationMessage: "Are you sure you want to delete this item?",
    //         // action: () => handleDelete(cellInfo?.data?.id),
    //       }}
    //     />
    //   ),
    // },
  ];
  return (
    <Fragment>
     <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                  columns={columns}
                  gridHeader={t("ledger_report")}
                  dataUrl= {Urls.inv_reports_price_list}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<PriceListReportFilter/>}
                  filterInitialData={PriceListReportFilterInitialState}
                  reload={true} 
                  gridId="grd_cost_centre"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      
    </Fragment>
  );
};

export default TransactionAnalysisReport;