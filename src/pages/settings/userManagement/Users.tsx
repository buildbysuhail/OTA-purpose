import { Fragment } from "react";
import Urls from "../../../redux/urls";

import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ERPDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { toggleUserPopup, toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { UserTypeManage } from "./user-type-manage";
import ERPGridActions from "../../../components/ERPComponents/erp-grid-actions";
import { UserManage } from "./user-manage";

const Users = () => {
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "siNo",
      caption: "SiNo",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: false,
      width: 60,
    },
    {
      dataField: "user",
      caption: "User",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      minWidth: 200,
    },
    {
      dataField: "password",
      caption: "Password",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 140,
    },
    {
      dataField: "counter",
      caption: "Counter",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "userType",
      caption: "UsersType",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "createdUser",
      caption: "Created User",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "createdDate",
      caption: "Created Date",
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "modifiedUser",
      caption: "Modified User",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "modifiedDate",
      caption: "Modified Date",
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 130,
    },
    {
      dataField: "id",
      caption: "Id",
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 60,
    },
    {
      dataField: "employeeID",
      caption: "Employee ID",
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "employeeName",
      caption: "Employee Name",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "maxDiscPercAllowed",
      caption: "maxDiscPercAllowed",
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "passkey",
      caption: "Passkey",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
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
          view={{ type: "popup", action: () => toggleUserTypePopup(cellInfo?.data?.id) }}
          edit={{ type: "popup", action: () => toggleUserTypePopup(cellInfo?.data?.id) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?",
            // action: () => handleDelete(cellInfo?.data?.id),
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
                  gridHeader="User"
                  dataUrl={Urls.Users}
                  gridId="grd_user"
                  popupAction={toggleUserPopup}
                  gridAddButtonType="popup"
                  gridAddButtonIcon=""
                ></ERPDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.user.isOpen || false}
        title={"Add New User"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleUserPopup({ isOpen: false }));
        }}
        content={<UserManage />}
      />
    </Fragment>
  );
};

export default Users;





