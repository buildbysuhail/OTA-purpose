import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { BrandsManage } from "./brands-manage";
import { toggleBrands } from "../../../../redux/slices/popup-reducer";


const Brands = () => {
  const MemoizedBrandsManage = useMemo(() => React.memo(BrandsManage), []);
  const { t } = useTranslation('inventory');
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = useMemo(() => [
    // {
    //   dataField: "siNo",
    //   caption: t("SiNo"),
    //   dataType: "number",
    //   allowSorting: true,
    //   allowSearch: true,
    //   allowFiltering: true,
    //   width: 100,
    // },
    {
      dataField: "brandID",
      caption: t("id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible:false
    },
    {
      dataField: "brandName",
      caption: t("brand_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      showInPdf : true
    },
    {
      dataField: "brandShortName",
      caption: t("short_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
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
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: false
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      visible:false
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: false
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200,
      visible:false
    },
    {
      dataField: "isCommon",
      caption: t("is_common"),
      dataType: "boolean",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible :false
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
            view={{ type: "popup", action: () => toggleBrands({ isOpen: true, key: cellElement?.data?.brandID, reload: false }) }}
            edit={{ type: "popup", action: () => toggleBrands({ isOpen: true, key: cellElement?.data?.brandID, reload: false }) }}
            delete={{
              onSuccess: () => { dispatch(toggleBrands({ isOpen: false, key: null, reload: true, })); },
              confirmationRequired: true,
              confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
              url: Urls?.brands, key: cellElement?.data?.brandID
            }}
          />
        )
      },
    },
  ], []
  );

  useEffect(() => {
    dispatch(toggleBrands({ ...rootState, reload: true }));
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
                  gridHeader={t("brands")}
                  dataUrl={Urls.brands}
                  gridId="grd_brands"
                  popupAction={toggleBrands}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => { dispatch(toggleBrands({ ...rootState, reload: reload })); }}
                  reload={rootState?.PopupData?.brands?.reload}
                  gridAddButtonIcon="ri-add-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.brands.isOpen || false}
        title={t("brands")}
        width={600}
        height={210}
        isForm={true}
        closeModal={() => { dispatch(toggleBrands({ isOpen: false })); }}
        content={<MemoizedBrandsManage />}
      />
    </Fragment>
  );
};
export default React.memo(Brands);