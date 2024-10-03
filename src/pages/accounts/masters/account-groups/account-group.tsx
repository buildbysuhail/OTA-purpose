import { Fragment } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { popupDataProps, toggleAccountGroupPopup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { AccountGroupManage } from "./account-group-manage";

const AccountGroupType = () => {
  const dispatch = useAppDispatch();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "Account Group",
      caption: "Account  Group",
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
      cellRender: (cellElement: any, cellInfo: any) => {
        
        return (
          <ERPGridActions
            view={{ type: "popup", action: () => toggleAccountGroupPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            edit={{ type: "popup", action: () => toggleAccountGroupPopup({ isOpen: true, key: cellElement?.data?.id }) }}
            delete={{
              confirmationRequired: true,
              confirmationMessage: "Are you sure you want to delete this item?",
              // action: () => handleDelete(cellInfo?.data?.id),
            }}
          />
        )
      },
      }
  ];
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              <div className="grid grid-cols-1 gap-3">
                <ErpDevGrid
                  columns={columns}
                  gridHeader="Account Group"
                  dataUrl={Urls.account_group}
                  gridId="grd_user_type"
                  popupAction={toggleAccountGroupPopup}
                  gridAddButtonType="popup"
                  gridAddButtonIcon=""
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.accountGroup.isOpen || false}
        title={"Add New UserType"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleAccountGroupPopup({ isOpen: false, key: null }));
        }}
        content={<AccountGroupManage />}
      />
    </Fragment>
  );
};

export default AccountGroupType;
