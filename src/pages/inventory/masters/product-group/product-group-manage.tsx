import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  initialProductGroupData,
  ProductGroupData,
} from "./products-group-manage-type";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { toggleProductGroup } from "../../../../redux/slices/popup-reducer";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { RootState } from "../../../../redux/store";
import { BusinessType } from "../../../../enums/business-types";

export const ProductGroupManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    handleClose,
  } = useFormManager<ProductGroupData>({
    url: Urls.productGroup,
    onClose: useCallback(
      () =>
        dispatch(
          toggleProductGroup({ isOpen: false, key: null, reload: false })
        ),
      [dispatch]
    ),
    onSuccess: useCallback(
      (resItem:ProductGroupData) =>
        dispatch(
          toggleProductGroup({ isOpen: false, key: null, reload: true , id: resItem.productGroupID, name:resItem.groupName })
        ),
      [dispatch]
    ),
    key: rootState.PopupData.productGroup.key,
    useApiClient: true,
    initialData: initialProductGroupData,
  });
  const { t } = useTranslation("inventory");
  const appSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );
  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ERPInput
          {...getFieldProps("groupName")}
          label={t("group_name")}
          placeholder={t("group_name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("groupName", data.groupName);
          }}
          readOnly={rootState.PopupData.productGroup.mode == "view"}
          autoFocus={true}
        />

        <ERPInput
          {...getFieldProps("arabicName")}
          label={t("regional_language")}
          placeholder={t("regional_language")}
          onChangeData={(data: any) =>
            handleFieldChange("arabicName", data.arabicName)
          }
          readOnly={rootState.PopupData.productGroup.mode == "view"}
        />

        <ERPInput
          {...getFieldProps("shortName")}
          label={t("short_name")}
          placeholder={t("short_name")}
          onChangeData={(data: any) =>
            handleFieldChange("shortName", data.shortName)
          }
          readOnly={rootState.PopupData.productGroup.mode == "view"}
        />

        <ERPDataCombobox
          {...getFieldProps("parentGroupID")}
          id="parentGroupID"
          field={{
            id: "parentGroupID",
            getListUrl: Urls.data_productgroup,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("parent_group")}
          required={true}
          onChangeData={(data: any) =>
            handleFieldChange("parentGroupID", data.parentGroupID)
          }
          disabled={rootState.PopupData.productGroup.mode == "view"}
        />

        <ERPDataCombobox
          {...getFieldProps("groupCategoryID")}
          id="groupCategoryID"
          field={{
            id: "groupCategoryID",
            getListUrl: Urls.data_groupcategory,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("group_category")}
          onChangeData={(data: any) =>
            handleFieldChange("groupCategoryID", data.groupCategoryID)
          }
          disabled={rootState.PopupData.productGroup.mode == "view"}
        />

        <ERPDataCombobox
          {...getFieldProps("sectionID")}
          id="sectionID"
          field={{
            id: "sectionID",
            getListUrl: Urls.data_sections,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("section")}
          onChangeData={(data: any) =>
            handleFieldChange("sectionID", data.sectionID)
          }
          disabled={rootState.PopupData.productGroup.mode == "view"}
        />

        {appSettings.mainSettings.maintainBusinessType ==
          BusinessType.Restaurant && (
          <ERPDataCombobox
            {...getFieldProps("kitchenID")}
            id="kitchenID"
            field={{
              id: "kitchenID",
              getListUrl: Urls.data_kitchen,
              valueKey: "id",
              labelKey: "name",
            }}
            label={t("kitchen")}
            onChangeData={(data: any) =>
              handleFieldChange("kitchenID", data.kitchenID)
            }
            disabled={rootState.PopupData.productGroup.mode == "view"}
          />
        )}

        <ERPDataCombobox
          {...getFieldProps("gStatus")}
          field={{
            id: "gStatus",
            valueKey: "value",
            labelKey: "label",
          }}
          onChangeData={(data: any) =>
            handleFieldChange("gStatus", data.gStatus)
          }
          label={t("g_status")}
          options={[
            { value: "Active", label: t("active") },
            { value: "Inactive", label: t("inactive") },
          ]}
          disabled={rootState.PopupData.productGroup.mode == "view"}
        />

        <ERPInput
          {...getFieldProps("remarks")}
          label={t("remarks")}
          placeholder={t("remarks")}
          onChangeData={(data: any) =>
            handleFieldChange("remarks", data.remarks)
          }
          readOnly={rootState.PopupData.productGroup.mode == "view"}
        />

        <ERPInput
          {...getFieldProps("marginPerc")}
          label={t("margin_percentage")}
          placeholder={t("margin_percentage")}
          onChangeData={(data: any) =>
            handleFieldChange("marginPerc", data.marginPerc)
          }
          readOnly={rootState.PopupData.productGroup.mode == "view"}
        />

        <ERPCheckbox
          {...getFieldProps("isEditable")}
          label={t("editable")}
          onChangeData={(data: any) =>
            handleFieldChange("isEditable", data.isEditable)
          }
          disabled={rootState.PopupData.productGroup.mode == "view"}
        />

        <ERPCheckbox
          {...getFieldProps("isDeletable")}
          label={t("deletable")}
          onChangeData={(data: any) =>
            handleFieldChange("isDeletable", data.isDeletable)
          }
          disabled={rootState.PopupData.productGroup.mode == "view"}
        />
      </div>
      <ERPFormButtons
        onClear={rootState.PopupData.productGroup.mode == "view" ? undefined : handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={rootState.PopupData.productGroup.mode == "view" ? undefined : handleSubmit}
      />
    </div>
  );
});
