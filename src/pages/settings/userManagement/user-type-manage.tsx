import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import UserManagementApis from "./User-Management-api";
import { toggleUserTypePopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

type PrimitiveFormField = string | number | boolean | Date | null | undefined;
type ArrayFormField = PrimitiveFormField[];
type ObjectFormField = { [key: string]: FormField };
type FormField = PrimitiveFormField | ArrayFormField | ObjectFormField;

interface FormDataStructure {
  [key: string]: FormField;
}

interface Validations {
  [key: string]: string;
}

interface FormState {
  data: FormDataStructure;
  validations: Validations;
}

interface DynamicFormProps {
  initialData: FormState;
  onSubmit: (data: FormDataStructure) => void;
  onCancel: () => void;
}
type ERPModalProps = {
  itemKey?: string;
};

export const UserTypeManage = ({itemKey}: ERPModalProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    dispatch(toggleUserTypePopup({ isOpen: false }));
  }, []);
  const initialUserTypeData = {
    data: { userTypeName: "", userTypeCode: "", remark: "" },
    validations: { userTypeName: "", userTypeCode: "", remark: "" },
  };
  const [postData, setPostData] = useState<FormState>(initialUserTypeData);
  const [postDataLoading, setPostUserTypeLoading] = useState<boolean>(false);

  // const queryParams = new URLSearchParams(location.search);
  //key : used for route parm for edit or view 
  // const [key, setKey] = useState<any>(queryParams.get('key'));
  // Pls Do not copy Commended Code, only for reference
  const [key, setKey] = useState<any>(itemKey);

  const handleSubmit = useCallback(async () => {
    setPostUserTypeLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await UserManagementApis.addUserTypeInfo(postData?.data);
    setPostUserTypeLoading(false);
    handleResponse(response,
      () => { dispatch(toggleUserTypePopup({ isOpen: false })); },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      });
  }, [postData?.data]);

  const handleChange = useCallback((id: string, value: FormField) => {
    try {
      setPostData(prevData => {
        const newData = { ...prevData.data };

        if (id.includes(".")) {
          const [fieldParent, fieldChild] = id.split(".");
          if (typeof newData[fieldParent] === 'object' && newData[fieldParent] !== null && !Array.isArray(newData[fieldParent])) {
            (newData[fieldParent] as { [key: string]: FormField })[fieldChild] = value;
          }
        } else {
          newData[id] = value;
        }

        return {
          ...prevData,
          data: newData
        };
      });
    } catch (error) {
      console.log(`DynamicForm, Error: `, error);
    }
  }, []);
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
          title={key != undefined && key != null ? 'Update' : 'Submit'}
        ></ERPButton>
      </div>
    </div>
  );
};


