import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleUserPopup, toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";

interface UserData {
  branchIDs: string;
  counterID:number;
  Passwd: string;
  confrimPassword: string;
  userTypeCode: string;
  employeeID:number;
  maxDecimalPerAllowed:number;
  email: string;
  phoneNumber: string;
  displayName: string;
}

export const UserManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<UserData>({
      url: Urls.Users,
      onSuccess: () =>
        dispatch(toggleUserPopup({ isOpen: false, key: null })),
      key: rootState.PopupData.userType.key,
    });

  const onClose = useCallback(() => {
    dispatch(toggleUserPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("counterID")}
          label="Counter ID"
          placeholder="Counter ID"
          required={true}
          onChangeData={(data: any) => {
            debugger;
            handleFieldChange("counterID", data);
          }}
        />
        <ERPInput
          {...getFieldProps("Passwd")}
          label="Password"
          placeholder="Password"
          required={true}
          onChangeData={(data: any) => handleFieldChange("Passwd", data)}
        />
        <ERPInput
          {...getFieldProps("confrimPassword")}
          label="Confirmed  Password"
          placeholder="Confirmed Password"
          required={true}
          onChangeData={(data: any) => handleFieldChange("confrimPassword", data)}
        />
         <ERPInput
          {...getFieldProps("maxDecimalPerAllowed")}
          label="maxDecimalPerAllowed"
          placeholder="maxDecimalPerAllowed"
          required={true}
          onChangeData={(data: any) => handleFieldChange("maxDecimalPerAllowed", data)}
        />
         <ERPInput
          {...getFieldProps("email")}
          label="Email"
          placeholder="email"
          required={true}
          onChangeData={(data: any) => handleFieldChange("email", data)}
        />
         <ERPInput
          {...getFieldProps("phoneNumber")}
          label="Phone Number"
          placeholder="Phone Number"
          required={true}
          onChangeData={(data: any) => handleFieldChange("phoneNumber", data)}
        />
         <ERPInput
          {...getFieldProps("displayName")}
          label="Display Name"
          placeholder="Display Name"
          required={true}
          onChangeData={(data: any) => handleFieldChange("displayName", data)}
        />
         {/* <ERPDataCombobox
          id="employeeID"
          field={{
            id: "employeeID",
            required: true,
            getListUrl: Urls.data_employees,
            valueKey: "employeeID",
            labelKey: "employeeName",
          }}
          onChangeData={(data: any) => {
            setPostData((prev: any) => ({
              ...prev,
              data: data,
            }));
          }}
          // validation={postData.validations.employeeID}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
            postData?.data != undefined &&
            postData?.data?.employeeID != undefined
              ? postData?.data?.employeeID
              : 0
          }
          label="employeeID"
        /> */}

      </div>
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

