import { Fragment } from "react";
import ERPGridActions from "../../../../components/ERPComponents/erp-grid-actions";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { toggleAccountGroupPopup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useAppDispatch } from "../../../../utilities/hooks/useAppDispatch";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { AccountGroupManage } from "./account-group-manage";
import { useTranslation } from "react-i18next";

const AccountGroupType = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const rootState = useRootState();
  const columns: DevGridColumn[] = [
    {
      dataField: "s.No",
      caption: t("SiNo"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 50,
      isLocked: true,
    },
    {
      dataField: "id",
      caption: t('id'),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "accGroupName",
      caption: t("acc_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "shortName",
      caption: t("short_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "parentGroup",
      caption: t("parent_group"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "remarks",
      caption: t("remarks"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "isEditable",
      caption: t("is_editable"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "isDeletable",
      caption: t("is_deletable"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "isProtected",
      caption: t("is_protected"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "isCommon",
      caption: t("is_common"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "createdUser",
      caption: t("created_user"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "createdDate",
      caption: t("created_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "modifiedUser",
      caption: t("modified_user"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "modifiedDate",
      caption: t("modified_date"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 80,
    },
    {
      dataField: "reasonForModification",
      caption: t("reason_for_modification"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "parentGroupId",
      caption: t("parent_group_id"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "arabicName",
      caption: t("arabic_name"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "displayOrder",
      caption: t("display_order"),
      dataType: "string",
      allowSearch: true,
      allowFiltering: true,
      width: 50,
    },
    {
      dataField: "actions",
      caption: t("actions"),
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
