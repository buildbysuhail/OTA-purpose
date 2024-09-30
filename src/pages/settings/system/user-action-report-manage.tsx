import { useCallback, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ResponseModelWithValidation } from "../../../base/response-model";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleUserActionPopup } from "../../../redux/slices/popup-reducer";
import { useDispatch } from "react-redux";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import SystemSettingsApi from "./system-apis";
import Urls from "../../../redux/urls";

const UserActionReport = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(async () => {
    dispatch(toggleUserActionPopup(false));
  }, []);
  const initialData = {
    data: {
      userID: 0,
      dateFrom: "",
      dateTo: "",
      counterID: 0,
      transactionType: {},
      action: {},
    },
    validations: {
      userID: "",
      dateFrom: "",
      dateTo: "",
      counterID: "",
      transactionType: "",
      action: "",
    },
  };
  const [postData, setPostData] = useState(initialData);
  const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  const userActionReport = useCallback(async () => {
    setPostDataLoading(true);
    window.alert(JSON.stringify(postData.data, null, 2));
    // const response: ResponseModelWithValidation<any, any> =
    //   await SystemSettingsApi.postUserActionReport(postData?.data);
    setPostDataLoading(false);
    // handleResponse(
    //   response,
    //   () => {
    //     dispatch(toggleUserActionPopup(false));
    //   },
    //   () => {
    //     setPostData((prevData: any) => ({
    //       ...prevData,
    //       validations: response.validations,
    //     }));
    //   }
    // );
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
                [id]: value,
              },
            }));
          }}
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
                [id]: value,
              },
            }));
          }}
          validation={postData.validations.dateTo}
        />
        <ERPDataCombobox
          id="userID"
          field={{
            id: "userID",
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
          validation={postData.validations.userID}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
            postData?.data != undefined &&
            postData?.data?.userID != undefined
              ? postData?.data?.userID
              : 0
          }
          label="userID"
        />

        <ERPDataCombobox
          id="counterID"
          field={{
            id: "counterID",
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
          validation={postData.validations.counterID}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
            postData?.data != undefined &&
            postData?.data?.counterID != undefined
              ? postData?.data?.counterID
              : 0
          }
          label="counterID"
        />

        <ERPDataCombobox
          id="transactionType"
          field={{
            id: "transactionType",
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
          validation={postData.validations.transactionType}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
            postData?.data != undefined &&
            postData?.data?.transactionType != undefined
              ? postData?.data?.transactionType
              : 0
          }
          label="Transaction Type"
        />

        <ERPDataCombobox
          id="action"
          field={{
            id: "action",
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
          validation={postData.validations.action}
          data={postData?.data}
          defaultData={postData?.data}
          value={
            postData != undefined &&
            postData?.data != undefined &&
            postData?.data?.action != undefined
              ? postData?.data?.action
              : 0
          }
          label="Action"
        />

        {/* <div className="flex items-center">
          <input
            type="checkbox"
            name="visibleOnStartUp"
            className="ti-form-checkbox"
            id="visibleOnStartUp"
            checked={postFinancialData?.data.visibleOnStartUp}
            onChange={(e) => {
              setPostFinancialData((prev) => ({
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
        </div> */}
      </div>
      <div className="w-full p-2 flex justify-end">
        <ERPButton
          type="reset"
          title="Cancel"
          variant="secondary"
          onClick={onClose}
          disabled={postDataLoading}
        ></ERPButton>
        <ERPButton
          type="button"
          disabled={postDataLoading}
          variant="primary"
          onClick={userActionReport}
          loading={postDataLoading}
          title={"Show"}
        ></ERPButton>
      </div>
    </div>
  );
};

export default UserActionReport;
