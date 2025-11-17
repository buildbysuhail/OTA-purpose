import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../../redux/types";
import Urls from "../../../../../redux/urls";
import CustomerVisitTotalVisitFilter, { CustomerVisitTotalVisitFilterInitialState } from "./customer-visit-total-visit-report-filter";
import GridId from "../../../../../redux/gridId";
import { useState } from "react";

interface RouteNameMapItem {
  original: string;
  cleaned: string;
}

const CustomerVisitTotalVisit = () => {
  const { t } = useTranslation('accountsReport');
  // If The route name contains special characters initially, handle it in grouping
  const [specialCharactersRoute, setSpecialCharactersRoute] = useState<RouteNameMapItem[]>([]);

  const columns: DevGridColumn[] = [
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      groupIndex: 0,
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 120,
      calculateGroupValue: (rowData: any) => {
        const original = rowData.routeName;
        // It will Identify The name without the special character at the initial
        const cleaned = original.replace(/^[^a-zA-Z0-9]+/, "");
        const leadingSpecials = original.match(/^[^a-zA-Z0-9]+/)?.[0] || "";
        // If Leading Special character present, Store the original, cleaned for using in UI showing
        if(leadingSpecials){
          setSpecialCharactersRoute((prev: any) => {
            const exists = prev.some((p:any) => p.cleaned === cleaned);
            if (!exists) {
               return [...prev, { original, cleaned }];
            }
            return prev;
        });
        } 
        return cleaned
      },
      customizeText: (cellInfo) => {
         const cleanedValue = cellInfo.value;
         // This will select the original route name for showing in ui
         const match = specialCharactersRoute.find((x:any) => x.cleaned === cleanedValue);
         return match ? match.original : cleanedValue;
    },
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
      dataField: "contactPhone",
      caption: t("contact_phone"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 90,
    },
    {
      dataField: "noOFVisited",
      caption: t("no_of_visited"),
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      allowSorting: true,
      visible: true,
      width: 70,
    }
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                columns={columns}
                filterText="of Route : {salesRouteID > 0 && [salesRoute]} {salesRouteID <= 0 && All} From {fromDate} - {toDate}"
                gridHeader={t("customer_visits")}
                dataUrl={Urls.customer_visit_total_visit}
                hideGridAddButton={true}
                enablefilter={true}
                showFilterInitially={true}
                method={ActionType.POST}
                filterContent={<CustomerVisitTotalVisitFilter />}
                filterWidth={700}
                filterHeight={150}
                filterInitialData={CustomerVisitTotalVisitFilterInitialState}
                reload={true}
                gridId={GridId.customer_visit_total_visit}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default CustomerVisitTotalVisit;
