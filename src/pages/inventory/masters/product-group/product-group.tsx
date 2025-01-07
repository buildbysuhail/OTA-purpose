import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductGroupManage } from "./product-group-manage";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleProductGroup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";


const ProductGroup = () => {
  
const MemoizedProductGroupManage = useMemo(() => React.memo(ProductGroupManage), []);
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
        dataField: "groupName",
        caption: t("group_name"),
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
        minWidth:150

      },
      {
        dataField: "parentGroup",
        caption: t("parent_group"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "parentGroupID",
        caption: t("parent_group_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false
      },
      {
        dataField: "marginPerc",
        caption: t("margin_percentage"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "isEditable",
        caption: t("is_editable"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 90,
      },
      {
        dataField: "isDeletable",
        caption: t("is_deletable"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 90,
      },
      {
        dataField: "gStatus",
        caption: t("GStatus"),
        dataType: "string",
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
        dataField: "groupCategoryID",
        caption: t("group_category_ID"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false

      },
      {
        dataField: "groupCategoryName",
        caption: t("group_category_name"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "sectionID",
        caption: t("section_ID"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        visible:false

      },
      {
        dataField: "sectionName",
        caption: t("section_name"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "kitchenID",
        caption: t("kitchen_ID"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
        visible:false

      },
      {
        dataField: "kitchenName",
        caption: t("kitchen_name"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 150,
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        dataType: "number",
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
              view={{ type: "popup", action: () => toggleProductGroup({ isOpen: true, key: cellElement?.data?.productGroupID,reload: false }) }}
              edit={{ type: "popup", action: () => toggleProductGroup({ isOpen: true, key: cellElement?.data?.productGroupID,reload: false }) }}
              delete={{
                onSuccess: () => {
                  dispatch(
                    toggleProductGroup({
                      isOpen: false,
                      key: null,
                      reload: true,
                    })
                  );
                },
                confirmationRequired: true,
                confirmationMessage: "Are you sure you want to delete this item?",
                url:Urls?.productGroup,key:cellElement?.data?.id
              }}
            />
          )
        },
      },
    ],
    []
  );
  useEffect(() => {
    dispatch(toggleProductGroup({ ...rootState, reload: true }));
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
                  gridHeader={t("product_group")}
                  dataUrl={Urls.productGroup}
                  gridId="grd_productGroup"
                  popupAction={toggleProductGroup}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleProductGroup({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.productGroup?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.productGroup.isOpen || false}
        title={t("product_group")}
        width="w-full max-w-[900px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleProductGroup({ isOpen: false }));
        }}
        content={<MemoizedProductGroupManage/>}
       
      />
      
    </Fragment>
  );
};

export default React.memo(ProductGroup);
