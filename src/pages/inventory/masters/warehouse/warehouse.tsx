import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { WarehouseManage } from "./warehouse-manage";
import { toggleWarehouse } from "../../../../redux/slices/popup-reducer";


const WareHouse = () => {

  const MemoizedWarehouseManage = useMemo(() => React.memo(WarehouseManage), []);
  const { t } = useTranslation('inventory');
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    {
      dataField: "siNo",
      caption: t("SiNo"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      showInPdf:true
    },
    {
      dataField: "id",
      caption: t("id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      visible:false
    },
    {
      dataField: "warehouseName",
      caption: t("warehouse_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      showInPdf:true
    },
    {
      dataField: "shortName",
      caption: t("short_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true
    },
    {
      dataField: "type",
      caption: t("type"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true
    },
    {
      dataField: "isStockWarehouse",
      caption: t("is_stock_warehouse"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true
    },
    {
      dataField: "isCommon",
      caption: t("is_common"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible:false
    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible:false
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible:false
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 130,
      visible:false
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "negativeStock",
      caption: t("negative_stock"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150
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
            view={{ type: "popup", action: () => toggleWarehouse({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            edit={{ type: "popup", action: () => toggleWarehouse({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            delete={{
              onSuccess: () => { dispatch(toggleWarehouse({ isOpen: false, key: null, reload: true, })); },
              confirmationRequired: true,
              confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
              url: Urls?.Warehouse, key: cellElement?.data?.id
            }}
          />
        )
      },
    },
  ], []);

  useEffect(() => {
    dispatch(toggleWarehouse({ ...rootState, reload: true }));
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
                  gridHeader={t("warehouse")}
                  dataUrl={Urls.Warehouse}
                  gridId="grd_Warehouse"
                  popupAction={toggleWarehouse}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => { dispatch(toggleWarehouse({ ...rootState, reload: reload })); }}
                  reload={rootState?.PopupData?.warehouse?.reload}
                  gridAddButtonIcon="ri-add-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.warehouse.isOpen || false}
        title={t("warehouse")}
        isForm={true}
        width={600}
        height={320}
        closeModal={() => { dispatch(toggleWarehouse({ isOpen: false })); }}
        content={<MemoizedWarehouseManage />}
      />
    </Fragment>
  );
};
export default React.memo(WareHouse);