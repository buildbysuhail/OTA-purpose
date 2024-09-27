import { Fragment } from "react";
import Urls from "../../../redux/urls";

<<<<<<< HEAD
import { Link } from "react-router-dom";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { PopUpModalAddUserTypes } from "./userManagement-manage";
import { UserTypeManage } from "./user-type-manage";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
=======
import { Link } from 'react-router-dom';
import { DevGridColumn } from '../../../components/types/dev-grid-column';
import ERPDevGrid from '../../../components/ERPComponents/erp-dev-grid';
import { toggleUserTypePopup } from '../../../redux/slices/popup-reducer';
import ERPModal from '../../../components/ERPComponents/erp-modal';
import { useAppDispatch } from '../../../utilities/hooks/useAppDispatch';
import { useRootState } from '../../../utilities/hooks/useRootState';
import { UserTypeManage } from './user-type-manage';
>>>>>>> e0ffb80e77faf84e23f1f0a0666b8dbd0a0ca0e6

const UserTypes = () => {
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "userTypeName",
      caption: "User Type",
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
      isLocked: true,
    },
    {
      dataField: "userTypeCode",
      caption: "Code",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "remarks",
      caption: "Remarks",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 100,
    },
    {
      dataField: "actions",
      caption: "Actions",
      allowSearch: false,
      allowFiltering: false,
      fixed: true,
      fixedPosition: "right",
      width: 100,
      cellRender: (cellElement: any, cellInfo: any) => (
        <ERPGridActions
          view={{ type: "link", path: `/view/${cellInfo.data.id}` }}
          edit={{ type: "popup", action: () => toggleUserTypePopup(cellInfo.data.id) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            action: () => handleDelete(cellInfo.data.id),
          }}
        />
      ),
    },
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ERPDevGrid
                  columns={columns}
                  gridHeader="User Type"
                  dataUrl={Urls.getUserTypes}
                  gridId="grd_user_type"
                  popupAction={toggleUserTypePopup}
                  gridAddButtonType="popup"
                  gridAddButtonIcon=""
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      <ERPModal
        isOpen={rootState.PopupData.userType}
        title={"Add New UserType"}
        isForm={true}
        closeModal={() => {
          dispatch(toggleUserTypePopup(false));
        }}
        content={<UserTypeManage />}
      />
    </Fragment>
  );
};
=======
    </div>
    <ERPModal
      isOpen={rootState.PopupData.userType}
      title={"Add New UserType"}
      width='w-full max-w[600px]'
      isForm={true}
      closeModal={() => {
        dispatch(toggleUserTypePopup(false))
      }}
      content={<UserTypeManage/>}
    />
   </Fragment>
  )
}
>>>>>>> e0ffb80e77faf84e23f1f0a0666b8dbd0a0ca0e6

export default UserTypes;
