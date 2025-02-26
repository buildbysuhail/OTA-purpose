import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { toggleSalesRoute } from "../../../../redux/slices/popup-reducer";
import { SalesRouteManage } from "./sales-route-manage";


const SalesRoute = () => {
  
const MemoizedSalesRouteManage = useMemo(() => React.memo(SalesRouteManage), []);
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
        width: 100,
      },
      {
        dataField: "routeName",
        caption: t("route_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },
      {
        dataField: "shortName",
        caption: t("short_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "parentRoute",
        caption: t("parent_route"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
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
        dataField: "creditLimit",
        caption: t("credit_limit"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "parentRouteID",
        caption: t("parent_route_ID"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },
      {
        dataField: "isActive",
        caption: t("is_active"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },
      {
        dataField: "salesRouteID",
        caption: t("sales_route_ID"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "salesMan",
        caption: t("sales_man"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "warehouse",
        caption: t("ware_house"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "salesManID",
        caption: t("sales_man_ID"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "warehouseID",
        caption: t("warehouse_ID"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "incentivePerc",
        caption: t("incentive_percentage"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
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
              view={{ type: "popup", action: () => toggleSalesRoute({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              edit={{ type: "popup", action: () => toggleSalesRoute({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              delete={{
                onSuccess: () => {
                  dispatch(
                    toggleSalesRoute({
                      isOpen: false,
                      key: null,
                      reload: true,
                    })
                  );
                },
                confirmationRequired: true,
                confirmationMessage: "Are you sure you want to delete this item?",
                url:Urls?.salesRoute,key:cellElement?.data?.id
              }}
            />
          )
        },
      },
    ],
    []
  );
  useEffect(() => {
    dispatch(toggleSalesRoute({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="px-4 pt-4 pb-2 ">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("sales_route")}
                  dataUrl={Urls.salesRoute}
                  gridId="grd_salesRoute"
                  popupAction={toggleSalesRoute}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleSalesRoute({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.salesRoute?.reload}
                  gridAddButtonIcon="ri-add-line"
                  
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.salesRoute.isOpen || false}
        title={t("sales_route")}
   
        isForm={true}
        closeModal={() => {
          dispatch(toggleSalesRoute({ isOpen: false }));
        }}
        content={<MemoizedSalesRouteManage/>}
      />
    </Fragment>
  );
};
export default React.memo(SalesRoute);