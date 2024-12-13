import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleAccountGroupPopup, toggleGroupOrder, } from "../../../../redux/slices/popup-reducer";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { ActionType } from "../../../../redux/types";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { AccountGroupData, initialAccountGroup } from "./account-group-types";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { AccountGroupOrderContent, AccountGroupOrderFooter, GroupOrder } from "./group-order-manage";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { APIClient } from "../../../../helpers/api-client";

const api = new APIClient();
export const AccountGroupManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  //  =================this for groupOrder ERPModels ============
  const [formData, setFormData] = useState<GroupOrder[]>([]);
  const onSubmit = async () => {
    try {
      const response = await api.post(Urls.acc_group_order, formData);
      handleResponse(response);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  // =============================================================
  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    getFieldProps,
    handleClear,
    handleClose,
    isLoading,
    formState,
  } = useFormManager<AccountGroupData>({
    url: Urls.account_group,
    onSuccess: useCallback(
      () =>
        dispatch(
          toggleAccountGroupPopup({ isOpen: false, key: null, reload: true })
        ),
      [dispatch]
    ),
    onClose: useCallback(() => dispatch(toggleAccountGroupPopup({ isOpen: false, key: null, reload: false })), [dispatch]),
    key: rootState.PopupData.accountGroup.key,
    useApiClient: true,
    initialData: initialAccountGroup,
  });
  useEffect(() => {
    if(rootState.PopupData.accountGroup.data != undefined && rootState.PopupData.accountGroup.data != null && rootState.PopupData.accountGroup.data.groupId != undefined && rootState.PopupData.accountGroup.data.groupId != null)
    {
      handleFieldChange("parentGroupID", rootState.PopupData.accountGroup.data.groupId)
    }
  },[])
  const { t } = useTranslation("masters");

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("accGroupName")}
          label={t("name")}
          placeholder={t("name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("accGroupName", data.accGroupName);
          }}
          disabled={formState?.data?.accGroupId != undefined && formState?.data?.accGroupId > 0 && formState?.data?.isEditable != true}
        />
        <ERPInput
          {...getFieldProps("arabicName")}
          label={t("name_in_arabic")}
          placeholder={t("name_in_arabic")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("arabicName", data.arabicName)
          }
        />
        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("short_name")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("shortName", data.shortName)
          }
          disabled={(formState?.data?.accGroupId != undefined && formState?.data?.accGroupId > 0 && formState?.data?.isEditable != true) || (rootState.PopupData.accountGroup.data != undefined && rootState.PopupData.accountGroup.data != null && rootState.PopupData.accountGroup.data.groupId != undefined && rootState.PopupData.accountGroup.data.groupId != null)}
        />
        <ERPDataCombobox
          {...getFieldProps("parentGroupID")}
          field={{
            id: "parentGroupID",
            required: true,
            getListUrl: Urls.data_acc_groups,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("parentGroupID", data.parentGroupID);
          }}
          disabled={formState?.data?.accGroupId != undefined && formState?.data?.accGroupId > 0 && formState?.data?.isEditable != true}
          label={t("group_under")}
        />
        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("remarks", data.remarks)
          }
          disabled={formState?.data?.accGroupId != undefined && formState?.data?.accGroupId > 0 && formState?.data?.isEditable != true}
        />
        {formState?.data?.accGroupId != undefined && formState?.data?.accGroupId > 0 &&
          <ERPInput
            {...getFieldProps("reasonForModification")}
            label={t("reason_for_edit")}
            placeholder={t("reason_for_edit")}
            required={true}
            onChangeData={(data: any) =>
              handleFieldChange(
                "reasonForModification",
                data.reasonForModification
              )
            }
          />
        }
        {1 != 1 &&
          <>
            <ERPCheckbox
              {...getFieldProps("isEditable")}
              label={t("editable")}
              onChangeData={(data: any) =>
                handleFieldChange("isEditable", data.isEditable)
              }
            />
            <ERPCheckbox
              {...getFieldProps("isDeletable")}
              label={t("deletable")}
              onChangeData={(data: any) =>
                handleFieldChange("isDeletable", data.isDeletable)
              }
            />
          </>
        }
        <div className="flex items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); dispatch(toggleGroupOrder({ isOpen: true })) }}
            className="text-[#27272a] text-sm  font-semibold  underline  decoration-sky-500">{t("group_order")}
          </a>
        </div>
      </div>
        {/* Link that triggers the modal */}
        <ERPFormButtons
          onClear={handleClear}
          submitDisabled={!formState?.data?.isEditable}
          isEdit={isEdit}
          isLoading={isLoading}
          onCancel={handleClose}
          onSubmit={handleSubmit}
        />

      <ERPModal
        isForm={true}
        isFullHeight={true}
        isOpen={rootState.PopupData.groupOrder.isOpen ?? false}
        title="Group Order"
        closeModal={() => {
          dispatch(toggleGroupOrder({ isOpen: false }));
        }}

        width="!w-[80rem] !max-w-[60rem]"
        content={<AccountGroupOrderContent formData={formData} setFormData={setFormData} />}
        footer={<AccountGroupOrderFooter onSubmit={onSubmit} />}
      />
    </div>
  );
});
