import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import {
  toggleDeleteInactiveTransactionPopup,
  toggleUserTypePrivilegePopup,
} from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { initialDataCounter } from "../system/counters-manage-type";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";

interface UserTypePrivilegeManageData {
  userType: string;
  selectAll: boolean;
  showAll: boolean;
  showAllAdd: boolean;
  showAllPrint: boolean;
  showAllEdit: boolean;
  showAllExport: boolean;
  showAllDelete: boolean;
  userRightType: boolean;
  userType2: string;
}

const UserTypePrivilegeManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<UserTypePrivilegeManageData>({
      url: Urls.UserTypes,
      onSuccess: useCallback(
        () =>
          dispatch(toggleUserTypePrivilegePopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      method: ActionType.POST,
      useApiClient: true,
      loadDataRequired: false,
    });

  const onClose = useCallback(() => {
    dispatch(toggleUserTypePrivilegePopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full flex justify-start ">
      <div className="basis-[45%] bg-slate-50 border-r  border-slate-400 "></div>
      
      <div className="w-full flex flex-col px-24 py-10 ">
        {/* User Type Combobox */}
        <ERPDataCombobox
          {...getFieldProps("userType")}
          field={{
            id: "userType",
            required: true,
            getListUrl: Urls.data_user_types, // Adjust URL as needed
            valueKey: "id",
            labelKey: "name",
          }}
          label="User Type"
          onChangeData={(data: any) => handleFieldChange("userType", data)}
        />

        {/* Checkbox options */}
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 py-4 mb-5">
          <ERPCheckbox
            {...getFieldProps("selectAll")}
            label="Select All"
            onChangeData={(data: any) => handleFieldChange("selectAll", data)}
          />
          <ERPCheckbox
            {...getFieldProps("showAll")}
            label="Show All"
            onChangeData={(data: any) => handleFieldChange("showAll", data)}
          />
          <ERPCheckbox
            {...getFieldProps("showAllAdd")}
            label="Select All Add"
            onChangeData={(data: any) => handleFieldChange("showAllAdd", data)}
          />
          <ERPCheckbox
            {...getFieldProps("showAllPrint")}
            label="Select All Print"
            onChangeData={(data: any) => handleFieldChange("showAllPrint", data)}
          />
          <ERPCheckbox
            {...getFieldProps("showAllEdit")}
            label="Select All Edit"
            onChangeData={(data: any) => handleFieldChange("showAllEdit", data)}
          />
          <ERPCheckbox
            {...getFieldProps("showAllExport")}
            label="Select All Export"
            onChangeData={(data: any) => handleFieldChange("showAllExport", data)}
          />
          <ERPCheckbox
            {...getFieldProps("showAllDelete")}
            label="Select All Delete"
            onChangeData={(data: any) => handleFieldChange("showAllDelete", data)}
          />
        </div>

        {/* Inherit Rights From UserType Section */}
        <div className="flex flex-col gap-3 border border-gray-400 border-dotted rounded-md p-8">
          <ERPCheckbox
            {...getFieldProps("userRightType")}
            label="Inherit Rights From UserType"
            onChangeData={(data: any) => handleFieldChange("userRightType", data)}
          />

          <ERPDataCombobox
            {...getFieldProps("userType2")}
            field={{
              id: "userType2",
              required: true,
              getListUrl: Urls.data_user_types, // Adjust URL as needed
              valueKey: "id",
              labelKey: "name",
            }}
            label="User Type"
            disabled={!getFieldProps("userRightType").value}
            onChangeData={(data: any) => handleFieldChange("userType2", data)}
          />
        </div>

        {/* Form Buttons */}
        <div className="flex justify-center mt-6">
          <ERPFormButtons
            isEdit={isEdit}
            isLoading={isLoading}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      </div>
 
  );
});

export default UserTypePrivilegeManage;
