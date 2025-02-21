import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { SchemesManage } from "./schemes-manage";
import { toggleSchemes } from "../../../../redux/slices/popup-reducer";


const Schemes = () => {
  
const MemoizedSchemesManage = useMemo(() => React.memo(SchemesManage), []);
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
        dataField: "id",
        caption: t("id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "schemeCode",
        caption: t("scheme_code"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "SchemeName",
        caption: t("scheme_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },
      {
        dataField: "dateFrom",
        caption: t("date_from"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "dateTo",
        caption: t("date_to"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "schemeType",
        caption: t("scheme_type"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "qtyLimit",
        caption: t("qty_limit"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "schemeRate",
        caption: t("scheme_rate"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },
      {
        dataField: "freeQty",
        caption: t("free_qty"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },
      {
        dataField: "schemeState",
        caption: t("scheme_state"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "itemBatchNo",
        caption: t("item_batch_no"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "discPerc",
        caption: t("disc_percentage"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "itemProduct",
        caption: t("item_product"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "freeItemProduct",
        caption: t("free_item_product"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "freeProduct",
        caption: t("free_product"),
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
              view={{ type: "popup", action: () => toggleSchemes({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              edit={{ type: "popup", action: () => toggleSchemes({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              delete={{
                onSuccess: () => {
                  dispatch(
                    toggleSchemes({
                      isOpen: false,
                      key: null,
                      reload: true,
                    })
                  );
                },
                confirmationRequired: true,
                confirmationMessage: "Are you sure you want to delete this item?",
                url:Urls?.vehicles,key:cellElement?.data?.id
              }}
            />
          )
        },
      },
    ],
    []
  );
  useEffect(() => {
    dispatch(toggleSchemes({ ...rootState, reload: true }));
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
                  gridHeader={t("schemes")}
                  dataUrl={Urls.vehicles}
                  gridId="grd_schemes"
                  popupAction={toggleSchemes}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleSchemes({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.schemes?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.schemes.isOpen || false}
        title={t("schemes")}

        isForm={true}
        closeModal={() => {
          dispatch(toggleSchemes({ isOpen: false }));
        }}
        content={<MemoizedSchemesManage/>}
      />
    </Fragment>
  );
};
export default React.memo(Schemes);