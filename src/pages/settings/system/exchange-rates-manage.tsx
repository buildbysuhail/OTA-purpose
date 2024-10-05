import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import { toggleCurrencyExchangePopup } from "../../../redux/slices/popup-reducer";
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

export const CurrencyExchangeManage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const onClose = useCallback(async () => {
    dispatch(toggleCurrencyExchangePopup({ isOpen: false }));
  }, []);
  const initialUserTypeData = {
    data: {
      countryID: 1,
      currencyName: "",
      currencySymbol: "",
      currencyCode: "",
      subUnit: "",
      subUnitSymbol: "",
    },
    validations: {
      countryID: "",
      currencyName: "",
      currencySymbol: "",
      currencyCode: "",
      subUnit: "",
      subUnitSymbol: "",
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
      await SystemSettingsApi.postCurrencyExchange(postData?.data);
    setPostUserTypeLoading(false);
    handleResponse(
      response,
      () => {
        dispatch(toggleCurrencyExchangePopup({ isOpen: false }));
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

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPDataCombobox
          id="countryID"
          field={{
            id: "countryID",
            required: true,
            getListUrl: Urls.data_countries,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            setPostData((prev: any) => ({
              ...prev,
              data: data,
            }));
          }}
          validation={postData.validations.countryID}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
              postData?.data != undefined &&
              postData?.data?.countryID != undefined
              ? postData?.data?.countryID
              : 0
          }
          label={t("country")}
        />
        <ERPInput
          id="currencyName"
          label={t("currency_name")}
          placeholder={t("currency_name")}
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.currencyName}
          validation={postData?.validations?.currencyName}
        />
        <ERPInput
          id="currencySymbol"
          label={t("currency_symbol")}
          placeholder={t("currency_symbol")}
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.currencySymbol}
          validation={postData?.validations?.currencySymbol}
        />
        <ERPInput
          id="currencyCode"
          label={t("currency_code")}
          placeholder={t("currency_code")}
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.currencyCode}
          validation={postData?.validations?.currencyCode}
        />
        <ERPInput
          id="subUnit"
          label={t("sub_unit")}
          placeholder={t("sub_unit")}
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.subUnit}
          validation={postData?.validations?.subUnit}
        />
        <ERPInput
          id="subUnitSymbol"
          label={t("subUnit_symbol")}
          placeholder={t("subUnit_symbol")}
          required={true}
          data={postData?.data}
          onChangeData={(data: any) => {
            setPostData((prevData: any) => ({
              ...prevData,
              data: data,
            }));
          }}
          value={postData?.data?.subUnitSymbol}
          validation={postData?.validations?.subUnitSymbol}
        />

      </div>

      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title={t("cancel")}
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
