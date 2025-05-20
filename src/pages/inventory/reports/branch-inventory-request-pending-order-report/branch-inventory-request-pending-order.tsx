import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import Urls from "../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import BranchInventoryRequestPendingOrderFilter, { BranchInventoryRequestPendingOrderFilterInitialState } from "./branch-inventory-request-pending-order-report-filter";

interface BranchInventoryRequestPendingOrder {
  branchID: number;
  branchName: string;
  groupName: string;
  productCode: number;
  productName: string;
  color: string;
  lastRequestDate: Date;
  requestedQty: number;
  lastReceivedDate: Date;
  receivedQty: number;
  pendingQty: number;
}

const BranchInventoryRequestPendingOrder = () => {
  const { t } = useTranslation('accountsReport');
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
    },
    {
      dataField: "requestedQty",
      caption: t("requested_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "lastReceivedDate",
      caption: t("last_received_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "receivedQty",
      caption: t("received_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "pendingQty",
      caption: t("pending_qty"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    }
  ];
  const { getFormattedValue } = useNumberFormat();
  const customizeSummaryRow = useMemo(() => {
    return (itemInfo: { value: any }) => {
      const value = itemInfo.value;
      if (value === null || value === undefined || value === "" || isNaN(value)) {
        return "0";
      }
      return getFormattedValue(value) || "0";
    };
  }, [getFormattedValue]);

  const summaryItems: SummaryConfig[] = [
    {
      column: "requestedQty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "receivedQty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    },
    {
      column: "pendingQty",
      summaryType: "sum",
      valueFormat: "currency",
      customizeText: customizeSummaryRow,
    }
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                summaryItems={summaryItems}
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                moreOption={true}
                gridHeader={t("branch_inventory_request_pending_order_report")}
                dataUrl={Urls.branch_inventory_request_pending_order}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<BranchInventoryRequestPendingOrderFilter />}
                filterWidth={700}
                filterHeight={250}
                filterInitialData={BranchInventoryRequestPendingOrderFilterInitialState}
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