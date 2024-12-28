import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import StockFlowFilter, { StockFlowFilterInitialState } from "./stock-flow-report-filter";

const StockFlow = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('accountsReport');
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "code",
      caption: t("code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "product",
      caption: t("product"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "opStk",
      caption: t("openingStock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "opVal",
      caption: t("openingValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "pIStk",
      caption: t("physicalInventoryStock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "pIVal",
      caption: t("physicalInventoryValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "sRStk",
      caption: t("stockReceived"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "sRVal",
      caption: t("stockReceivedValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "sIStk",
      caption: t("stockIssue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "sIVal",
      caption: t("stockIssueValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "pRStk",
      caption: t("productionStock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "pRVal",
      caption: t("productionValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "cLStk",
      caption: t("closingStock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "cLVal",
      caption: t("closingValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "productId",
      caption: t("productId"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "warehouse",
      caption: t("warehouse"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
      visible: false
    },
    {
      dataField: "brand",
      caption: t("brand"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "sTInStk",
      caption: t("stockTransferIn"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "sTInVal",
      caption: t("stockTransferInValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "sTOutStk",
      caption: t("stockTransferOut"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "sTOutVal",
      caption: t("stockTransferOutValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 200,
    },
    {
      dataField: "unit",
      caption: t("unit"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "section",
      caption: t("section"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "adjStk",
      caption: t("adjustmentStock"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
    {
      dataField: "adjVal",
      caption: t("adjustmentValue"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 150,
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6 bg-[#fafafa]">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("stock_flow_report")}
                  dataUrl={Urls.inv_reports_stock_flow}
                  hideGridAddButton={true}
                  enablefilter={true}
                  showFilterInitially={true}
                  method={ActionType.POST}
                  filterContent={<StockFlowFilter />}
                  filterInitialData={StockFlowFilterInitialState}
                  reload={true}
                  filterWidth="600"
                  gridId="grd_stock_flow"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default StockFlow;