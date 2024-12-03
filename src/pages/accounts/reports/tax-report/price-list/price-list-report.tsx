import { Fragment, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import {  togglePriceListPopup } from "../../../../../redux/slices/popup-reducer";
import PriceListReportFilter, { PriceListReportFilterInitialState } from "./price-list-report-filter";


interface CashSummary {

  from: Date
}
const PriceList = () => {

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "code",
      caption: t('code'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 100,
    },
    {
      dataField: "name",
      caption: t("name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 200,
    },
    {
      dataField: "group",
      caption:  t("group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "groupCode",
      caption: t("groupCode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
 
    {
      dataField: "category",
      caption: t("category"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "brand",
      caption: t("brand"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "brandNO",
      caption: t("brandNO"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "taxCategory",
      caption: t("taxCategory"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "sVAT",
      caption: t("sVAT"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "pVAT",
      caption: t("pVAT"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
    },
    {
      dataField: "stdSprice",
      caption: t("stdSprice"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
    },
    {
      dataField: "stdPprice",
      caption: t("stdPprice"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
    },
    {
      dataField: "mrp",
      caption: t("mrp"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
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
    <div className="grid grid-cols-12 gap-x-6 bg-[#fafafa]">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                 
                  gridHeader={t("Price_List_Report")}
                  dataUrl= {Urls.inv_reports_price_list}
                  method={ActionType.POST}
                  gridId="grd_price_list"
                  popupAction={togglePriceListPopup}
                  hideGridAddButton={true}
                  reload={true}
                  enablefilter={true}
                  filterWidth="100"
                  showFilterInitially={true}
                  filterContent={<PriceListReportFilter />}
                  filterInitialData={PriceListReportFilterInitialState}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
    
      
    </Fragment>
  );
};

export default PriceList;