import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import OpeningStockReportFilter, { OpeningStockReportFilterInitialState } from "./opening-stock-report-filter";

const OpeningStock = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
   
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
      dataField: "voucherNumber",
      caption:  t("voucherNumber"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
     
    },
    {
      dataField: "vType",
      caption: t("vType"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
 
    {
      dataField: "barcode",
      caption: t("barcode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
     
    },
    {
      dataField: "productCode",
      caption: t("productCode"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "productName",
      caption: t("productName"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
    
    },
    {
      dataField: "groupName",
      caption: t("groupName"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "brandName",
      caption: t("brandName"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
     
    },
    {
      dataField: "unitName",
      caption: t("unitName"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
      dataField: "qty",
      caption: t("qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
    },
    {
      dataField: "cost",
      caption: t("cost"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      minWidth: 150,
      visible:false
    },
    {
        dataField: "total",
        caption: t("total"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting:true,
        minWidth: 150,
      },
    {
      dataField: "remark",
      caption: t("remark"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting:true,
      width: 150,
      visible:false
    },
    {
        dataField: "fromWarehouse",
        caption: t("fromWarehouse"),
        dataType: "date",
        allowSearch: true,
        allowFiltering: true,
        allowSorting:true,
        width: 200,
      
      },
      {
        dataField: "toWarehouse",
        caption: t("toWarehouse"),
        dataType: "date",
        allowSearch: true,
        allowFiltering: true,
        allowSorting:true,
        width: 150,
        visible:false
      },
      {
        dataField: "salesPrice",
        caption: t("salesPrice"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting:true,
        width: 200,
       
      },
      {
        dataField: "totalSalesValue",
        caption: t("totalSalesValue"),
        dataType: "number",
        allowSearch: true,
        allowFiltering: true,
        allowSorting:true,
        width: 200,
        visible:false
      },
      {
        dataField: "si",
        caption: t("si"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowSorting:true,
        width: 150,
       
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
                  gridHeader={t("opening_stock_report")}
                  dataUrl= {Urls.acc_reports_cash_summary}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<OpeningStockReportFilter/>}
                  filterInitialData={OpeningStockReportFilterInitialState}
                  reload={true} 
                  filterWidth="600"
                  gridId="grd_opening_stock"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      
    </Fragment>
  );
};

export default OpeningStock;