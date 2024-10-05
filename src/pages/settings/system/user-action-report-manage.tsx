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
import React from "react";
import { ActionType } from "../../../redux/types";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";


export interface UserActionReport {
  userID: number,
  dateFrom: string,
  dateTo: string,
  counterID: number,
  transactionType: object,
  action: object
}
const UserActionReport: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<UserActionReport>({
      url: Urls.userActionReport,
      onSuccess: useCallback(
        () => dispatch(toggleUserActionPopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      method: ActionType.POST,
    });
  // const [postData, setPostData] = useState(initialData);
  // const [allUserSelect, setAllUserSelect] = useState<boolean>(false)
  // const [postDataLoading, setPostDataLoading] = useState<boolean>(false);

  // const userActionReport = useCallback(async () => {
  //   setPostDataLoading(true);
  //   window.alert(JSON.stringify(postData.data, null, 2));
  //   // const response: ResponseModelWithValidation<any, any> =
  //   //   await SystemSettingsApi.postUserActionReport(postData?.data);
  //   setPostDataLoading(false);
  //   dispatch(toggleUserActionPopup({ isOpen: false }));
  //   // handleResponse(
  //   //   response,
  //   //   () => {
  //   //     dispatch(toggleUserActionPopup({isOpen: false}));
  //   //   },
  //   //   () => {
  //   //     setPostData((prevData: any) => ({
  //   //       ...prevData,
  //   //       validations: response.validations,
  //   //     }));
  //   //   }
  //   // );
  // }, [postData?.data]);

  const onClose = useCallback(async () => {
    dispatch(toggleUserActionPopup({ isOpen: false }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

        <ERPInput
          {...getFieldProps("userID")}
          label="User ID"
          placeholder="userID"
          onChangeData={(data: any) => handleFieldChange("userID", data)}
        />
        <ERPDateInput
          {...getFieldProps("dateFrom")}
          type="date"
          id="dateFrom"
          label="Date From"
          onChangeData={(data: any) => handleFieldChange("dateFrom", data)}
        />
        <ERPDateInput
          {...getFieldProps("dateTo")}
          type="date"
          id="dateTo"
          label="Date To"
          onChangeData={(data: any) => handleFieldChange("dateTo", data)}
        />
        <ERPDataCombobox
          {...getFieldProps("counterID")}
          field={{
            id: "counterID",
            required: true,
            getListUrl: Urls.data_counters,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) => {
            handleFieldChange("counterID", data)
          }}
          label="counterID"
        />

      </div>
      <ERPFormButtons
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default UserActionReport;
