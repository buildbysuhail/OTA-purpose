import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import UserManagementApis from "./User-Management-api";
import { toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export const UserTypeManage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    dispatch(toggleUserTypePopup(false));
  }, []);
  const initialUserTypeData = {
    data: { userTypeName: "", userTypeCode: "", remark: "" },
    validations: { userTypeName: "", userTypeCode: "", remark: "" },
  };
  const [postData, setPostData] = useState(initialUserTypeData);
  const [postDataLoading, setPostUserTypeLoading] = useState<boolean>(false);

  const queryParams = new URLSearchParams(location.search);
  
  const [key, setKey] = useState<any>(queryParams.get('key'));

  const handleSubmit = useCallback(async () => {
    setPostUserTypeLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await UserManagementApis.addUserTypeInfo(postData?.data);
      setPostUserTypeLoading(false);
    handleResponse(response, 
      () => {dispatch(toggleUserTypePopup(false));},
      () => {setPostData((prevData: any) => ({
                ...prevData,
                validations: response.validations,
              }));
            });
  }, [postData?.data]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          id="userTypeName"
          label="User type Name"
          placeholder="User Type Name"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.userTypeName}
          validation={postData?.validations?.userTypeName}
        />
        <ERPInput
          id="userTypeCode"
          label="user type code"
          placeholder="user type code"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.userTypeCode}
          validation={postData?.validations?.userTypeCode}
        />
        <ERPInput
          id="remark"
          label="Remark"
          placeholder="remark"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.remark}
          validation={postData?.validations?.remark}
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
          disabled={postDataLoading}
          variant="primary"
          onClick={handleSubmit}
          loading={postDataLoading}
          title={key != undefined && key != null ? 'Update':'Cancel'}
        ></ERPButton>
      </div>
    </div>
  );
};


