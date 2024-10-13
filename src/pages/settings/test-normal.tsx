import { useCallback } from "react";
import { useDispatch } from "react-redux";
import ERPDateInput from "../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import { useRootState } from "../../utilities/hooks/useRootState";
import { useFormManager } from "../../utilities/hooks/useFormManagerOptions";
import { toggleUserTypePopup } from "../../redux/slices/popup-reducer";
import Urls from "../../redux/urls";
import { initialDataUserType } from "./userManagement/user-manage-types";
import React from "react";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import { ERPFormButtons } from "../../components/ERPComponents/erp-form-buttons";
import ERPRadio from "../../components/ERPComponents/erp-radio";

interface SampleData {
  userTypeName: string;
  userTypeCode: string;
  remarks: string;
}

export const SampleMange: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<SampleData>({
      url: Urls.UserTypes,
      onSuccess: useCallback(
        () => dispatch(toggleUserTypePopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      key: rootState.PopupData.userType.key,
      useApiClient: true,
      initialData: initialDataUserType,
    });

  const onClose = useCallback(() => {
    dispatch(toggleUserTypePopup({ isOpen: false, key: null }));
  }, []);

  return (<></>
    // <div className="w-full pt-4">
    //   <div className="grid grid-cols-1 gap-3">
    //     <ERPInput
    //       id = "userTypeId"
    //       value={formState.userTypeId}
    //       data={formState}
    //       label="User Type Name"
    //       placeholder="User Type Name"
    //       required={true}
    //       onChangeData={(data: any) => {
            
    //         handleFieldChange("userTypeName", data);
    //       }}
    //     />
    //     <ERPCheckbox
    //      id = "isEditable"
    //      value={formState.isEditable}
    //      data={formState}
    //       label="Is Editable"
    //       onChangeData={(data: any) => handleFieldChange("isEditable", data)}
    //     />
    //     <ERPDateInput
    //        id = "dateTo"
    //        value={formState.dateTo}
    //        data={formState}
    //       type="date"
    //       label="Date To"
    //       onChangeData={(data: any) => handleFieldChange("dateTo", data)}
    //     />
    //     <ERPRadio
    //      id = "radioSample"
    //      value={formState.radioSample}
    //      data={formState}
    //       name="flexRadioDefault"
    //       label="Default checked radio"
    //       onChangeData={(data: any) => handleFieldChange("dateTo", data)}
    //       defaultChecked
    //     />
    //     <ERPDataCombobox+
    //        id = "counterID"
    //        value={formState.counterID}
    //        data={counterID}
    //       field={{
    //         id: "counterID",
    //         required: true,
    //         getListUrl: Urls.data_counters,
    //         valueKey: "id",
    //         labelKey: "name",
    //       }}
    //       onChangeData={(data: any) => {
    //         handleFieldChange("counterID", data);
    //       }}
    //       label="counterID"
    //     />
    //   </div>
    //   <ERPFormButtons
    //     onClear={handleClear}
    //     isEdit={isEdit}
    //     isLoading={isLoading}
    //     onCancel={onClose}
    //     onSubmit={handleSubmit}
    //   />
    // </div>
  );
});
