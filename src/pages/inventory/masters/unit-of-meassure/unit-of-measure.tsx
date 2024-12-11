import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { UnitOfMeasureManage } from "./unit-of-measure-manage";
import { toggleUnitOfMeasure } from "../../../../redux/slices/popup-reducer";

const UnitOfMeasure = () => {
  const MemoizedUnitOfMeasureManage = useMemo(() => React.memo(UnitOfMeasureManage), []);
  const { t } = useTranslation();
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
      dataField: "unitCode",
      caption: t("unit_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible:false
    },
    {
      dataField: "unitName",
      caption: t("unit_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth:200
    },
    {
      dataField: "unitType",
      caption: t("unit_type"),
      dataType: "string", 
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "multipleFactor",
      caption: t("multiple_factor"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 130,

    },
    {
      dataField: "secondUnitID",
      caption: t("second_unit_ID"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width:140,
      visible:false
    },
    {
      dataField: "secondUnit",
      caption: t("second_unit"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth:150
    },
    {
      dataField: "decimalPoint",
      caption: t("decimal_point"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 130,

    },
    {
      dataField: "totalUnitInBaseUnit",
      caption: t("total_unit_in_base_unit"),
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 200,
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
      width: 150,
      
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth:150
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth:150
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
            view={{ type: "popup", action: () => toggleUnitOfMeasure({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            edit={{ type: "popup", action: () => toggleUnitOfMeasure({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
            delete={{
              onSuccess: () => {
                dispatch(
                  toggleUnitOfMeasure({
                    isOpen: false,
                    key: null,
                    reload: true,
                  })
                );
              },
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              url: Urls?.unitOfMeasure, key: cellElement?.data?.id
            }}
          />
        );
      },
    },
  ],
  []);
  useEffect(() => {
    dispatch(toggleUnitOfMeasure({ ...rootState, reload: true }));
  }, []);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader={t("unit_of_measure")}
                  dataUrl={Urls.unitOfMeasure}
                  gridId="grd_unitOfMeasure"
                  popupAction={toggleUnitOfMeasure}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleUnitOfMeasure({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.unitOfMeasure?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.unitOfMeasure.isOpen || false}
        title={t("unit_of_measure")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleUnitOfMeasure({ isOpen: false }));
        }}
        content={<MemoizedUnitOfMeasureManage />}
      />
    </Fragment>
  );
};

export default React.memo(UnitOfMeasure);