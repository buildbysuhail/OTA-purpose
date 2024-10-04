import { Fragment, useMemo } from "react";
import Urls from "../../../redux/urls";

import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleRemainderPopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { RemainderManage } from "./remainder-manage";

const Remainders = () => {
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] =useMemo( () => [
    {
      dataField: "remaindersID",
      caption: "Remainder ID",
      dataType: "number",
      allowSorting: true,
      allowFiltering: true,
      minWidth: 150,
      isLocked: true,
    },
    {
      dataField: "remainderName",
      caption: "Remainder Name",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      isLocked: true,
    },
    {
      dataField: "descriptions",
      caption: "Descriptions",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "remaindingDate",
      caption: "Remainding Date",
      dataType: "date",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "numberOfDays",
      caption: "Number of Days",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 150,
    },

    {
      dataField: "actions",
      caption: "Actions",
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any) => {
        return (
          <ERPGridActions
            view={{ type:"popup", action: () => toggleRemainderPopup({ isOpen: true, key: cellElement?.data?.remaindersID }) }}
            edit={{ type:"popup", action: () => toggleRemainderPopup({ isOpen: true, key: cellElement?.data?.remaindersID }) }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              // action: () => handleDelete(cellInfo?.data?.id),
            }}
          />
        )
      },
    },
  ],[]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader="Remainders"
                  dataUrl={Urls.Remainder}
                  gridId="grd_remainder"
                  popupAction={toggleRemainderPopup}
                  gridAddButtonType="popup"
                  gridAddButtonIcon="ri-add-line"
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.reminder.isOpen || false}
        title={"Remainders"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleRemainderPopup({ isOpen: false }));
        }}
        content={<RemainderManage/>}
      />
    </Fragment>
  );
};

export default Remainders;
