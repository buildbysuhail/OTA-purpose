import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import BranchInventoryRequestPendingOrderFilter, { BranchInventoryRequestPendingOrderFilterInitialState, } from "./branch-inventory-request-pending-order-report-filter";

const BranchInventoryRequestPendingOrder = () => {
  const { t } = useTranslation("accountsReport");
  const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = [
    {
      dataField: "branchID",
      caption: t("branch_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "branchName",
      caption: t("branch_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "groupName",
      caption: t("group_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "productCode",
      caption: t("product_code"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "productName",
      caption: t("product_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "color",
      caption: t("color"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "lastRequestDate",
      caption: t("last_request_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      format: "dd-MMM-yyyy",
    },
    {
      dataField: "requestedQty",
      caption: t("requested_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.requestedQty == null
              ? 0
              : getFormattedValue(cellElement.data.requestedQty, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.requestedQty == null
            ? 0
            : getFormattedValue(cellElement.data.requestedQty, false, 4);
        }
      },
    },
    {
      dataField: "lastReceivedDate",
      caption: t("last_received_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      format: "dd-MMM-yyyy",
    },
    {
      dataField: "receivedQty",
      caption: t("received_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.receivedQty == null
              ? 0
              : getFormattedValue(cellElement.data.receivedQty, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.receivedQty == null
            ? 0
            : getFormattedValue(cellElement.data.receivedQty, false, 4);
        }
      },
    },
    {
      dataField: "pendingQty",
      caption: t("pending_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        if (exportCell != undefined) {
          const value =
            cellElement.data?.pendingQty == null
              ? 0
              : getFormattedValue(cellElement.data.pendingQty, false, 4);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.pendingQty == null
            ? 0
            : getFormattedValue(cellElement.data.pendingQty, false, 4);
        }
      },
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                }}
                columns={columns}
                gridHeader={t("branch_purchase_order_pending_report")}
                filterText=" {fromDate} - {toDate} {productGroupID>0 &&  Group : [productGroup] }
                {productID>0 &&  Product :[product] }"
                dataUrl={Urls.branch_inventory_request_pending_order}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<BranchInventoryRequestPendingOrderFilter />}
                filterWidth={700}
                filterHeight={250}
                filterInitialData={
                  BranchInventoryRequestPendingOrderFilterInitialState
                }
                reload={true}
                gridId="grd_branch_inventory_request_pending_order"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default BranchInventoryRequestPendingOrder;
