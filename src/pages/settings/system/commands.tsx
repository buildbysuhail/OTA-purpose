import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import {
  toggleCommandsPopup,
  toggleCurrencyExchangePopup,
} from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../redux/urls";
import SystemSettingsApi from "./system-apis";
import { useTranslation } from "react-i18next";

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

const CommandsManage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    dispatch(toggleCommandsPopup({ isOpen: false }));
  }, []);
  //   const initialUserTypeData = {
  //     data: {
  //       countryID: 1,
  //       currencyName: "",
  //       currencySymbol: "",
  //       currencyCode: "",
  //       subUnit: "",
  //       subUnitSymbol: "",
  //     },
  //     validations: {
  //       countryID: "",
  //       currencyName: "",
  //       currencySymbol: "",
  //       currencyCode: "",
  //       subUnit: "",
  //       subUnitSymbol: "",
  //     },
  //   };
  //   const [postData, setPostData] = useState<FormState>(initialUserTypeData);
  //   const [postDataLoading, setPostUserTypeLoading] = useState<boolean>(false);

  const queryParams = new URLSearchParams(location.search);

  //key : used for route parm for edit or view
  const [key, setKey] = useState<any>(queryParams.get("key"));

  //   const handleSubmit = useCallback(async () => {
  //     setPostUserTypeLoading(true);
  //     const response: ResponseModelWithValidation<any, any> =
  //       await SystemSettingsApi.postCurrencyExchange(postData?.data);
  //     setPostUserTypeLoading(false);
  //     handleResponse(
  //       response,
  //       () => {
  //         dispatch(toggleCommandsPopup({isOpen: false}));
  //       },
  //       () => {
  //         setPostData((prevData: any) => ({
  //           ...prevData,
  //           validations: response.validations,
  //         }));
  //       }
  //     );
  //   }, [postData?.data]);

  //   const handleChange = useCallback((id: string, value: FormField) => {
  //     try {
  //       setPostData((prevData) => {
  //         const newData = { ...prevData.data };

  //         if (id.includes(".")) {
  //           const [fieldParent, fieldChild] = id.split(".");
  //           if (
  //             typeof newData[fieldParent] === "object" &&
  //             newData[fieldParent] !== null &&
  //             !Array.isArray(newData[fieldParent])
  //           ) {
  //             (newData[fieldParent] as { [key: string]: FormField })[fieldChild] =
  //               value;
  //           }
  //         } else {
  //           newData[id] = value;
  //         }

  //         return {
  //           ...prevData,
  //           data: newData,
  //         };
  //       });
  //     } catch (error) {
  //       console.log(`DynamicForm, Error: `, error);
  //     }
  //   }, []);
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = () => {
    console.log("Select button clicked");
  };

  const handleExecute = () => {
    console.log("Execute button clicked");
  };

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1">
        <div className="flex gap-5 items-start mb-4">
          <textarea
            className="w-2/3 h-24 border border-gray-300 rounded-md p-2 "
            value={query}
            onChange={handleQueryChange}
            placeholder="..."
          />
          <div className="flex flex-col justify-center gap-4 items-center w-1/3 ">
            <div className="flex gap-4">
              <ERPButton
                type="reset"
                title={t("select")}
                variant="primary"
                onClick={onClose}
              ></ERPButton>
              <ERPButton
                type="reset"
                title={t("execute")}
                variant="secondary"
                onClick={onClose}
              ></ERPButton>
            </div>
            <div>
              <textarea
                className="h-8 border border-gray-400 bg-slate-50 rounded-[3px] text-black p-2"
                value={query}
                onChange={handleQueryChange}
                placeholder="..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            className="h-4 w-4 mr-2"
            checked={checked}
            onChange={handleCheckboxChange}
          />
          <label className="text-sm font-semibold">{t("checkbox")}</label>
        </div>
        {/* Table */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">{t("user_id")}</th>
                <th className="px-4 py-2 border">{t("branch_id")}</th>
                <th className="px-4 py-2 border">{t("counter_id")}</th>
                <th className="px-4 py-2 border">{t("user_name")}</th>
                <th className="px-4 py-2 border">{t("password")}</th>
                <th className="px-4 py-2 border">{t("user_type_code")}</th>
                <th className="px-4 py-2 border">{t("created_user_id")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">-1</td>
                <td className="px-4 py-2 border">0</td>
                <td className="px-4 py-2 border">3</td>
                <td className="px-4 py-2 border">POLERP</td>
                <td className="px-4 py-2 border">sepbb</td>
                <td className="px-4 py-2 border">CA</td>
                <td className="px-4 py-2 border">1</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">0</td>
                <td className="px-4 py-2 border">0</td>
                <td className="px-4 py-2 border">3</td>
                <td className="px-4 py-2 border">CAdmin</td>
                <td className="px-4 py-2 border">hnig_d</td>
                <td className="px-4 py-2 border">CA</td>
                <td className="px-4 py-2 border">1</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">1</td>
                <td className="px-4 py-2 border">1</td>
                <td className="px-4 py-2 border">0</td>
                <td className="px-4 py-2 border">admin</td>
                <td className="px-4 py-2 border">sepbb</td>
                <td className="px-4 py-2 border">BA</td>
                <td className="px-4 py-2 border">0</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">2</td>
                <td className="px-4 py-2 border">1</td>
                <td className="px-4 py-2 border">0</td>
                <td className="px-4 py-2 border">123</td>
                <td className="px-4 py-2 border">602</td>
                <td className="px-4 py-2 border">BS</td>
                <td className="px-4 py-2 border">1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommandsManage;
