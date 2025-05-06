import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { toggleTcsCategory } from "../../../../redux/slices/popup-reducer";
import { TcsCategoryManage } from "./tcs-category-manage";


const TcsCategory = () => {
  const MemoizedTcsCategoryManage = useMemo(() => React.memo(TcsCategoryManage), []);
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
      dataField: "tcsCategoryID",
      caption: t("tcs_category_id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      visible :false
    },
    {
      dataField: "tcsCategoryName",
      caption: t("tcs_category_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      showInPdf:true
    },
    {
      dataField: "tcsCategoryPerc",
      caption: t("tcs_category_%"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      showInPdf:true
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
            view={{ type: "popup", action: () => toggleTcsCategory({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            edit={{ type: "popup", action: () => toggleTcsCategory({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            delete={{
              onSuccess: () => { dispatch(toggleTcsCategory({ isOpen: false, key: null, reload: true, })); },
              confirmationRequired: true,
              confirmationMessage: t("are_you_sure_you_want_to_delete_this_item"),
              url: Urls?.tcsCategory, key: cellElement?.data?.id
            }}
          />
        )
      },
    },
  ], []);

  useEffect(() => {
    dispatch(toggleTcsCategory({ ...rootState, reload: true }));
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
                  gridHeader={t("tcs_category")}
                  dataUrl={Urls.tcsCategory}
                  gridId="grd_tcsCategory"
                  popupAction={toggleTcsCategory}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => { dispatch(toggleTcsCategory({ ...rootState, reload: reload })); }}
                  reload={rootState?.PopupData?.tcsCategory?.reload}
                  gridAddButtonIcon="ri-add-line"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.tcsCategory.isOpen || false}
        title={t("tcs_category")}
        isForm={true}
        width={600}
        height={170}
        closeModal={() => { dispatch(toggleTcsCategory({ isOpen: false })); }}
        content={<MemoizedTcsCategoryManage />}
      />
    </Fragment>
  );
};
export default React.memo(TcsCategory);