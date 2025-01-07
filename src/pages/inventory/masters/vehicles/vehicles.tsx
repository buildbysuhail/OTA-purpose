import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { VehiclesManage } from "./vehicles-manage";
import { toggleVehicles } from "../../../../redux/slices/popup-reducer";


const Vehicles = () => {
  
const MemoizedVehiclesManage = useMemo(() => React.memo(VehiclesManage), []);
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
        width: 60,
      },
      {
        dataField: "id",
        caption: t("id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 60,
      },
      {
        dataField: "vehicleName",
        caption: t("vehicle_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minwidth:150
      },
      {
        dataField: "vehicleNumber",
        caption: t("vehicle_number"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "noOfWheels",
        caption: t("no_of_wheels"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 130,
      },
      {
        dataField: "model",
        caption: t("model"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "capacity",
        caption: t("capacity"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "manufacturer",
        caption: t("manufacturer"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        minWidth:150
      },
      {
        dataField: "owner",
        caption: t("owner"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width:130
      },
      {
        dataField: "color",
        caption: t("color"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "isRental",
        caption: t("is_rental"),
        dataType: "boolean",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "isCommon",
        caption: t("is_common"),
        dataType: "boolean",
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
        width: 100,
      },
      {
        dataField: "createdDate",
        caption: t("created_date"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 200,
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
        width: 200,
      },
      {
        dataField: "odometer",
        caption: t("odo_meter"),
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
              view={{ type: "popup", action: () => toggleVehicles({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              edit={{ type: "popup", action: () => toggleVehicles({ isOpen: true, key: cellElement?.data?.id, reload: false }) }}
              delete={{
                onSuccess: () => {
                  dispatch(
                    toggleVehicles({
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
    dispatch(toggleVehicles({ ...rootState, reload: true }));
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
                  gridHeader={t("vehicles")}
                  dataUrl={Urls.vehicles}
                  gridId="grd_vehicles"
                  popupAction={toggleVehicles}
                  gridAddButtonType="popup"
                  changeReload={(reload: any) => {
                    dispatch(
                      toggleVehicles({ ...rootState, reload: reload })
                    );
                  }}
                  reload={rootState?.PopupData?.vehicles?.reload}
                  gridAddButtonIcon="ri-add-line"
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.vehicles.isOpen || false}
        title={t("vehicles")}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleVehicles({ isOpen: false }));
        }}
        content={<MemoizedVehiclesManage/>}
      />
    </Fragment>
  );
};
export default React.memo(Vehicles);