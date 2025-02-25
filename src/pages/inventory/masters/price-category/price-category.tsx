import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { PriceCategoryManage } from "./price-category-manage";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { togglePriceCategory } from "../../../../redux/slices/popup-reducer";

const PriceCategory = () => {
  
const MemoizedPriceCategoryManage = useMemo(() => React.memo(PriceCategoryManage), []);
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
        width: 50,
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
        dataField: "priceCategoryName",
        caption: t("price_category_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:200
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
        dataField: "discountPerc",
        caption: t("discount_%"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "marginPerc",
        caption: t("margin_%"),
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
        dataField: "createdUser",
        caption: t("created_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:200
      },
      {
        dataField: "modifiedUser",
        caption: t("modified_user"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "modifiedDate",
        caption: t("modified_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:200

      },
      {
        dataField: "actions",
        caption: t("actions"),
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        fixedPosition: "right",
        width: 100,
        Actionswidth:100,
        cellRender: (cellElement: any) => {
          return (
            <ERPGridActions
              view={{ type: "popup", action: () => togglePriceCategory({ isOpen: true, key: cellElement?.data?.id,reload: false })}}
              edit={{ type: "popup", action: () => togglePriceCategory({ isOpen: true, key: cellElement?.data?.id,reload: false })}}
              delete={{
                onSuccess: () => {
                  dispatch(
                    togglePriceCategory({
                      isOpen: false,
                      key: null,
                      reload: true,
                    })
                  );
                },
                confirmationRequired: true,
                confirmationMessage: "Are you sure you want to delete this item?",
                url:Urls?.priceCategory,key:cellElement?.data?.id
              }}
            />
          )
        },
      },
    ],
    []
  );
  useEffect(() => {
    dispatch(togglePriceCategory({ ...rootState, reload: true }));
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
                  gridHeader={t("price_category")}
                  dataUrl={Urls.priceCategory}
                  gridId="priceCategory"
                  popupAction={togglePriceCategory}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      togglePriceCategory({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.priceCategory?.reload}
                  gridAddButtonIcon="ri-add-line"
                  ERPGridActionsstyle={true}
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.priceCategory.isOpen || false}
        title={t("price_category")}
    
        isForm={true}
        closeModal={() => {
          dispatch(togglePriceCategory({ isOpen: false }));
        }}
        content={<MemoizedPriceCategoryManage/>}
      />
    </Fragment>
  );
};
export default React.memo(PriceCategory);