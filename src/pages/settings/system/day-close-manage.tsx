import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import { toggleDayClosePopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { useTranslation } from "react-i18next";

interface DayCloseManageData {
  closedDate: string,
  isSales: boolean,
  isPurchase: boolean,
  isAccounts: boolean,
  passWord: string,
  isAgree: boolean,
}
// export const initialDataDayClose = {
//   data: {
//     closedDate: "",
//     isSales: true,
//     isPurchase: true,
//     isAccounts: true,
//     passWord: "",
//     isAgree: true
//   },
//   validations: {
//     closedDate: "",
//     isSales: "",
//     isPurchase: "",
//     isAccounts: "",
//     passWord: "",
//     isAgree: ""
//   },
// };

const DayCloseManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<DayCloseManageData>({
      url: Urls.DayClose,
      onSuccess: useCallback(
        () =>
          dispatch(
            toggleDayClosePopup({ isOpen: false, key: null })
          ),
        [dispatch]
      ),
      method: ActionType.POST,
      useApiClient: true
    });

  const onClose = useCallback(() => {
    dispatch(
      toggleDayClosePopup({ isOpen: false, key: null })
    );
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps("passWord")}
          label={t("password")}
          placeholder={t("enter_password")}
          required={false}
          onChangeData={(data: any) => handleFieldChange("passWord", data)}
        />
        <ERPDateInput
          {...getFieldProps("closedDate")}
          type="date"
          id="closedDate"
          label={t("closed_date")}
          onChangeData={(data: any) => handleFieldChange("closedDate", data)}
        />
        <div className="flex justify-around items-center">
          <ERPCheckbox
            {...getFieldProps("isSales")}
            label={t("Sales")}
            onChangeData={(data: any) => handleFieldChange("isSales", data)}
          />
          <ERPCheckbox
            {...getFieldProps("isPurchase")}
            label={t("purchase")}
            onChangeData={(data: any) => handleFieldChange("isPurchase", data)}
          />
          <ERPCheckbox
            {...getFieldProps("isAccounts")}
            label={t("accounts")}
            onChangeData={(data: any) => handleFieldChange("isAccounts", data)}
          />
        </div>
        <ERPCheckbox
          {...getFieldProps("isAgree")}
          label={t("day_close_agreement")}
          onChangeData={(data: any) => handleFieldChange("isAgree", data)}
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


export default DayCloseManage;






