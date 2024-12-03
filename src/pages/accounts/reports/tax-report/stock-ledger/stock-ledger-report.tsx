import { Fragment, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import StockLedgerFilter,{  StockLedgerFilterInitialState } from "./stock-ledger-report-filter";

const StockLedger = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: t('siNo'),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 100,
    },
    {
      dataField: "date",
      caption: t("date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
    },
    {
      dataField: "particulars",
      caption:  t("particulars"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
     
    },
    {
      dataField: "voucherType",
      caption: t("voucherType"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
     
    },
 
    {
      dataField: "form",
      caption: t("form"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
     
    },
    {
      dataField: "voucherNo",
      caption: t("voucherNo"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      
    },
    {
      dataField: "inwardQty",
      caption: t("inwardQty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
    
    },
    {
      dataField: "outwardQty",
      caption: t("outwardQty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
   
    },
    {
      dataField: "balance",
      caption: t("balance"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
     
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
    },
    {
      dataField: "prefix",
      caption: t("prefix"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
    },
    {
        dataField: "price",
        caption: t("price"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting:true,
        minWidth: 150,
      },
    {
      dataField: "financialYearID",
      caption: t("financialYearID"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
  
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
                  gridHeader={t("stock_ledger_report")}
                  dataUrl= {Urls.inv_reports_stock_ledger}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<StockLedgerFilter/>}
                  filterInitialData={StockLedgerFilterInitialState}
                  reload={true} 
                  filterWidth="600"
                  gridId="grd_stock_ledger"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      
    </Fragment>
  );
};

export default StockLedger;