import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import { toggleFinancialYearPopup} from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
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
type ERPModalProps = {
  itemKey?: string;
};






export const FinancialYearManage = ({itemKey}: ERPModalProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    dispatch(toggleFinancialYearPopup({ isOpen: false }));
  }, []);
  const initialData = {
    data: {
      dateFrom: "",
      dateTo: "",
      fStatus: "",
      remarks: "",
      visibleOnStartUp: false,
      openingStockValue: 0,
    },
    validations: {
      dateFrom: "",
      dateTo: "",
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);
  const [key, setKey] = useState<any>(itemKey);
  const addData = useCallback(async () => {
    setPostDataLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.addFinancialYearInfo(postData?.data);
    setPostDataLoading(false);
    handleResponse(response,
      () => { dispatch(toggleFinancialYearPopup({ isOpen: false })); },
      () => {
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      });
  }, [postData?.data]);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDateInput
          id="dateFrom"
          field={{ type: "date", id: "dateFrom", required: true }}
          label={"From"}
          data={postData?.data}
          handleChange={(id: any, value: any) => {

            setPostData((prev: any) => ({
              ...prev,
              data: {
                ...prev.data,
                [id]: value
              }
            }));
          }
          }
          validation={postData.validations.dateFrom}
        />
        <ERPDateInput
          id="dateTo"
          field={{ type: "date", id: "dateTo", required: true }}
          label={"To"}
          data={postData?.data}
          handleChange={(id: any, value: any) => {

            setPostData((prev: any) => ({
              ...prev,
              data: {
                ...prev.data,
                [id]: value
              }
            }));
          }
          }
          validation={postData.validations.dateTo}
        />


        <ERPInput
          id="remarks"
          label="Remarks"
          placeholder="Enter Remarks"
          required={false}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.remarks}

        />
        <ERPInput
          id="openingStockValue"
          label="Prev Period Stock Value"
          placeholder="0.00"
          type="number"
          required={false}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.openingStockValue}
        />

        <div className="w-full">
          <label
            htmlFor="fStatus"
            className="block text-xs  text-gray-700"
          >
            Status*
          </label>
          <select
            id="fStatus"
            name="fStatus"
            required
            className="block w-full px-3 py-1 bg-white border border-gray-300  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={postData?.data?.fStatus || ""}
            onChange={(e) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  fStatus: e.target.value,
                },
              }));
            }}
          >
            <option value="" disabled>Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Progress">Progress</option>
          </select>

        </div>


        <div className="flex items-center">
          <input
            type="checkbox"
            name="visibleOnStartUp"
            className="ti-form-checkbox"
            id="visibleOnStartUp"
            checked={postData?.data.visibleOnStartUp}
            onChange={(e) => {
              setPostData((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  visibleOnStartUp: e.target.checked,
                },
              }));
            }}
          />
          <label
            htmlFor="switcher-dark-theme"
            className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"
          >
            Visible On StartUp
          </label>
        </div>
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
          onClick={addData}
          loading={postDataLoading}
          title={key != undefined && key != null ? 'Update' : 'Submit'}
        ></ERPButton>
      </div>
    </div>

  );
};