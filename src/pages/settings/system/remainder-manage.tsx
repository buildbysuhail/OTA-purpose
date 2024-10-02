import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import { toggleRemainderPopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Urls from "../../../redux/urls";
import SystemSettingsApi from "./system-apis";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";

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

export const RemainderManage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    dispatch(toggleRemainderPopup({ isOpen: false }));
  }, []);
  const initialUserTypeData = {
    data: {
      remainderName: "",
      descriptions: "",
      remaindingDate: "",
      noOfDay: 0,
    },
    validations: {
      remainderName: "",
      descriptions: "",
      remaindingDate: "",
      noOfDay: "",
    },
  };
  const [postData, setPostData] = useState<FormState>(initialUserTypeData);
  const [postDataLoading, setPostUserTypeLoading] = useState<boolean>(false);

  const queryParams = new URLSearchParams(location.search);

  //key : used for route parm for edit or view
  const [key, setKey] = useState<any>(queryParams.get("key"));

  const handleSubmit = useCallback(async () => {
    setPostUserTypeLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.postRemainder(postData?.data);
    setPostUserTypeLoading(false);
    handleResponse(
      response,
      () => {
        dispatch(toggleRemainderPopup({ isOpen: false }));
      },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      }
    );
  }, [postData?.data]);

  const handleChange = useCallback((id: string, value: FormField) => {
    try {
      setPostData((prevData) => {
        const newData = { ...prevData.data };

        if (id.includes(".")) {
          const [fieldParent, fieldChild] = id.split(".");
          if (
            typeof newData[fieldParent] === "object" &&
            newData[fieldParent] !== null &&
            !Array.isArray(newData[fieldParent])
          ) {
            (newData[fieldParent] as { [key: string]: FormField })[fieldChild] =
              value;
          }
        } else {
          newData[id] = value;
        }

        return {
          ...prevData,
          data: newData,
        };
      });
    } catch (error) {
      console.log(`DynamicForm, Error: `, error);
    }
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          id="remainderName"
          label="Remainder Name"
          placeholder="remainderName"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.remainderName}
          validation={postData?.validations?.remainderName}
        />
        <ERPInput
          id="descriptions"
          label="Descriptions"
          placeholder="descriptions"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.descriptions}
          validation={postData?.validations?.descriptions}
        />
        <ERPDateInput
          id="remaindingDate"
          field={{ type: "date", id: "remaindingDate", required: true }}
          label={"From"}
          data={postData?.data}
          handleChange={(id: any, value: any) => {
            setPostData((prev: any) => ({
              ...prev,
              data: {
                ...prev.data,
                [id]: value,
              },
            }));
          }}
          validation={postData.validations.remaindingDate}
        />
        <ERPInput
          id="noOfDay"
          label="NoOf Day"
          placeholder="NoOf Day"
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.noOfDay}
          validation={postData?.validations?.noOfDay}
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
          title={key != undefined && key != null ? "Update" : "Submit"}
        ></ERPButton>
      </div>
    </div>
  );
};
