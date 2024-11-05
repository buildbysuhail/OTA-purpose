import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleProductGroup, toggleSalesManRoute } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { SalesmanRoute } from "./salesman-route-manage";


const SalesManRoute = () => {
  
const MemoizedProductGroupManage = useMemo(() => React.memo(SalesmanRoute), []);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo( () => [
      {
        dataField: "siNo",
        caption: t("SiNo"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 80,
      },
    {
        dataField: "id",
        caption: t("id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
    },
    {
        dataField: "employeeName",
        caption: t("employee_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
    },
    {
        dataField: "routeName",
        caption: t("route_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200,
    },
    {
        dataField: "salesDay",
        caption: t("sales_day"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200,
     
    },
    {
        dataField: "salesDay1",
        caption: "Sales Day 1",
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        visible:false
    },
    {
        dataField: "remarks",
        caption: t("remarks"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
    },
    {
        dataField: "salesManID",
        caption: t("sales_man_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 120,
        visible:false
    },
    {
        dataField: "salesRouteID",
        caption: "Sales Route ID",
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
        visible:false
    },
    {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
    },
    {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "date",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
    },
      {
        dataField: "actions",
        caption: t("actions"),
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        cellRender: (cellElement: any) => {
          return (
            <ERPGridActions
              view={{ type: "popup", action: () => toggleSalesManRoute({ isOpen: true, key: cellElement?.data?.id }) }}
              edit={{ type: "popup", action: () => toggleSalesManRoute({ isOpen: true, key: cellElement?.data?.id }) }}
              delete={{
                confirmationRequired: true,
                confirmationMessage: "Are you sure you want to delete this item?",
                url:Urls?.sales_man_route,key:cellElement?.data?.id
              }}
            />
          )
        },
      },
    ],
    []
  );

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader="Sales Man Route"
                  dataUrl={Urls.sales_man_route}
                  gridId="grd_salesman_route"
                  popupAction={toggleSalesManRoute}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.salesManRoute?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.salesManRoute.isOpen || false}
        title="Sales Man Route"
        width="w-full max-w-[900px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleSalesManRoute({ isOpen: false }));
        }}
        content={<SalesmanRoute/>}
       
      />
      
    </Fragment>
  );
};

export default React.memo(SalesManRoute);
