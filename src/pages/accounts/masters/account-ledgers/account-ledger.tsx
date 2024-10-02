import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleAccountLedgerPopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { AccountGroupManage } from "../account-groups/account-group-manage";
import { AccountLedgerManage } from "./account-ledger-manage";
import { useTranslation } from "react-i18next";


const AccountLedgerType = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "Account Ledger",
      caption: "Account  Ledger",
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
          view={{ type: "popup", action: () => toggleAccountLedgerPopup({ isOpen: false, key: cellInfo?.data?.id }) }}
          edit={{ type: "popup", action: () => toggleAccountLedgerPopup({ isOpen: false, key: cellInfo?.data?.id }) }}
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
                <ErpDevGrid
                  columns={columns}
                  gridHeader="Account Ledger"
                  dataUrl={Urls.account_ledger}
                  gridId="grd_user_type"
                  popupAction={toggleAccountLedgerPopup}
                  gridAddButtonType="popup"
                  gridAddButtonIcon=""
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.accountLedger.isOpen || false}
        title={"Add New UserType"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleAccountLedgerPopup({ isOpen: false, key: null }));
        }}
        content={<AccountLedgerManage />}
      />
    </Fragment>
  );
};

export default AccountLedgerType;
