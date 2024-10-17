import { Fragment } from "react";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import { toggleAccountLedgerPopup, togglePrivilegeCardPopup } from "../../../../redux/slices/popup-reducer";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useTranslation } from "react-i18next";
import { PrivilegeCardManage } from "./privilege-card-manage";


const PrivilegeCard = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "privilegeCardID",
      caption: "Privilege Card ID",
      dataType: "number",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "branchID",
      caption: "Branch ID",
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "cardNumber",
      caption: "Card Number",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "cardHolderName",
      caption: "Card Holder Name",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "address1",
      caption: "Address 1",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "address2",
      caption: "Address 2",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
    },
    {
      dataField: "phone",
      caption: "Phone",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "mobile",
      caption: "Mobile",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "email",
      caption: "Email",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "dob",
      caption: "Date of Birth",
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "changeID",
      caption: "Change ID",
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "cardType",
      caption: "Card Type",
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "priceCategoryID",
      caption: "Price Category ID",
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "expiryDate",
      caption: "Expiry Date",
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "activateDate",
      caption: "Activate Date",
      dataType: "date",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "createdUserID",
      caption: "Created User ID",
      dataType: "number",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "opBalance",
      caption: "Opening Balance",
      dataType: "number",
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
          view={{ type: "popup", action: () => togglePrivilegeCardPopup({ isOpen: false, key: cellInfo?.data?.id }) }}
          edit={{ type: "popup", action: () => togglePrivilegeCardPopup({ isOpen: false, key: cellInfo?.data?.id }) }}
          delete={{
            confirmationRequired: true,
            confirmationMessage: "Are you sure you want to delete this item?"
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
                  gridHeader="Privilege Card"
                  dataUrl={Urls.account_privilege_card}
                  gridId="grd_privilege_card"
                  popupAction={togglePrivilegeCardPopup}
                  gridAddButtonType="popup"
                  reload={rootState?.PopupData?.privilegeCard?.reload}
                  gridAddButtonIcon=""
                ></ErpDevGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.privilegeCard.isOpen || false}
        title={"Privilege Card"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(togglePrivilegeCardPopup({ isOpen: false, key: null }));
        }}
        content={<PrivilegeCardManage />}
      />
    </Fragment>
  );
};

export default PrivilegeCard
