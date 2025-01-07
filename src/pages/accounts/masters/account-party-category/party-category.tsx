import React, { Fragment, useEffect, useMemo } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { togglePartyCategoryPopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { PartyCategoryManage } from "./party-category-manage";

const PartyCategory = () => {
  const MemoizedPartyCategoryManage = useMemo(() => React.memo(PartyCategoryManage), []);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("masters");
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: t("si_no"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      alignment: "left",
      allowFiltering: true,
      width: 100,
      showInPdf:true,
    },
    {
      dataField: "id",
      caption: t("id"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false
    },
    {
      dataField: "partyCategory",
      caption: t("party_category"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSorting: false,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true,
    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      showInPdf:true,
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      showInPdf:true
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      visible: false,
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: false
    },
    {
      dataField: "actions",
      caption: t("actions"),
      isLocked: true,
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{
            type: "popup",
            action: () =>
              togglePartyCategoryPopup({
                isOpen: true, key: cellElement?.data?.id, reload: false
              }),
          }}
          edit={{
            type: "popup",
            action: () =>
              togglePartyCategoryPopup({
                isOpen: true,
                key: cellElement?.data?.id, reload: false
              }),
          }}
          delete={{
            onSuccess: () => {
              dispatch(
                togglePartyCategoryPopup({
                  isOpen: false,
                  key: null,
                  reload: true,
                })
              );
            },
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            url: Urls?.account_party_category,
            key: cellElement?.data?.id,
          }}
        />
      ),
    },
  ];
  useEffect(() => {
    dispatch(togglePartyCategoryPopup({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                columns={columns}
                gridHeader={t("party_category")}
                dataUrl={Urls.account_party_category}
                gridId="grd_party_category"
                popupAction={togglePartyCategoryPopup}
                gridAddButtonType="popup"
                changeReload={(reload: any) => {
                  dispatch(
                    togglePartyCategoryPopup({ ...rootState, reload: reload })
                  );
                }}
                reload={rootState?.PopupData?.partyCategory?.reload}
                gridAddButtonIcon="ri-add-line"
                pageSize={40}
              ></ErpDevGrid>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.partyCategory.isOpen || false}
        title={t("party_category")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(togglePartyCategoryPopup({ isOpen: false, key: null, reload: false }));
        }}
        content={<MemoizedPartyCategoryManage />}
      />
    </Fragment>
  );
};
export default React.memo(PartyCategory);