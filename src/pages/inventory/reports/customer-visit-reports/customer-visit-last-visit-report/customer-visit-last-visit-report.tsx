import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
  SummaryConfig,
} from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import { useMemo } from "react";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import CustomerVisitLastVisitFilter, {
  CustomerVisitLastVisitFilterInitialState,
} from "./customer-visit-last-visit-report-filter";
import GridId from "../../../../../redux/gridId";
import moment from "moment";

const CustomerVisitLastVisit = () => {
  const { t } = useTranslation("accountsReport");
    const { getFormattedValue } = useNumberFormat();
  const columns: DevGridColumn[] = [
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 120,
      groupIndex: 0,
    },
    {
      dataField: "partyCode",
      caption: t("party_code"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 70,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 150,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 90,
    },
    {
      dataField: "officePhone",
      caption: t("office_phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 90,
    },
    {
      dataField: "workPhone",
      caption: t("work_phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 70,
    },
    {
      dataField: "lastTransDate",
      caption: t("last_trans_date"),
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 100,
      cellRender: (
        cellElement: any,
        cellInfo: any,
        filter: any,
        exportCell: any
      ) => {
        return cellElement.data.lastTransDate == null ||
          cellElement.data.lastTransDate == ""
          ? ""
          : moment(cellElement.data.lastTransDate, "DD-MM-YYYY").format(
              "DD-MMM-YYYY"
            ); // Ensures proper formatting
      },
    },
    {
      dataField: "daysFromLastTrans",
      caption: t("days_from_last_trans"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 80,
    },
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: false,
      width: 100,
    },
    {
      dataField: "voucherType",
      caption: t("voucher_type"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "voucherNumber",
      caption: t("voucher_number"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      width: 100,
    },
    {
      dataField: "grandTotal",
      caption: t("grand_total"),
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
            cellElement.data?.grandTotal == null
              ? 0
              : getFormattedValue(cellElement.data.grandTotal);
          return {
            ...exportCell,
            text: value,
            alignment: "right",
            alignmentExcel: { horizontal: "right" },
          };
        } else {
          return cellElement.data?.grandTotal == null
            ? 0
            : getFormattedValue(cellElement.data.grandTotal);
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
                filterText="as on {asonDate}"
                gridHeader={t("days_from_last_transactions")}
                dataUrl={Urls.customer_visit_last_visit}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<CustomerVisitLastVisitFilter />}
                filterWidth={300}
                filterHeight={150}
                filterInitialData={{
                  ...CustomerVisitLastVisitFilterInitialState,
                  asonDate: moment(new Date()).format("DD-MMM-YYYY"),
                }}
                reload={true}
                gridId={GridId.customer_visit_last_visit}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default CustomerVisitLastVisit;
