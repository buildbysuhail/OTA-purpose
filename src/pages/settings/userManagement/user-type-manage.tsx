import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import UserManagementApis from "./User-Management-api";
import { toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";

export const UserTypeManage = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleUserTypePopup(false));
  }, []);
  const initialUserTypeData = {
    data: { userTypeName: "", userTypeCode: "", remark: "" },
    validations: { userTypeName: "", userTypeCode: "", remark: "" },
  };
  const [postUserType, setPostUserType] = useState(initialUserTypeData);
  const [postUserTypeLoading, setPostUserTypeLoading] = useState<boolean>(false);

  const addUserType = useCallback(async () => {
    setPostUserTypeLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await UserManagementApis.addUserTypeInfo(postUserType?.data);
      setPostUserTypeLoading(false);
    handleResponse(response, 
      () => {dispatch(toggleUserTypePopup(false));},
      () => {setPostUserType((prevData: any) => ({
                ...prevData,
                validations: response.validations,
              }));
            });
  }, [postUserType?.data]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          id="userTypeName"
          label="User type Name"
          placeholder="User Type Name"
          required={true}
          data={postUserType?.data}
          onChangeData={(data: any) => {
            setPostUserType((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postUserType?.data?.userTypeName}
          validation={postUserType?.validations?.userTypeName}
        />
        <ERPInput
          id="userTypeCode"
          label="user type code"
          placeholder="user type code"
          required={true}
          data={postUserType?.data}
          onChangeData={(data: any) => {
            setPostUserType((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postUserType?.data?.userTypeCode}
          validation={postUserType?.validations?.userTypeCode}
        />
        <ERPInput
          id="remark"
          label="Remark"
          placeholder="remark"
          required={true}
          data={postUserType?.data}
          onChangeData={(data: any) => {
            setPostUserType((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postUserType?.data?.remark}
          validation={postUserType?.validations?.remark}
        />
      </div>

      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title="Cancel"
          variant="secondary"
          onClick={onClose}
          // disabled={emailLoading}
        ></ERPButton>
        <ERPButton
          type="button"
          disabled={postUserTypeLoading}
          variant="primary"
          onClick={addUserType}
          loading={postUserTypeLoading}
          title={"Submit"}
        ></ERPButton>
      </div>
    </div>
  );
};