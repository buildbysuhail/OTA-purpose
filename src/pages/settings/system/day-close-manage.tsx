import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleDayClosePopup } from "../../../redux/slices/popup-reducer";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { ActionType } from "../../../redux/types";
import { useTranslation } from "react-i18next";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";

interface DayCloseManageData {
  closedDate: Date;
  isSales: boolean;
  isPurchase: boolean;
  isAccounts: boolean;
  passWord: string;
  isAgree: boolean;
}

export const initialDayCloseData = {
  data: {
    closedDate: new Date(),
    isSales: false,
    isPurchase: false,
    isAccounts: false,
    passWord: "",
    isAgree: false
  },
  validations: {
    closedDate: '',
    isSales: '',
    isPurchase: '',
    isAccounts: '',
    passWord: "",
    isAgree: ''
  }
};

const DayCloseManage = () => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleClear,
    handleFieldChange,
    getFieldProps,
    isLoading,
    formState
  } = useFormManager<DayCloseManageData>({
    url: Urls.DayClose,
    onSuccess: useCallback(() => dispatch(toggleDayClosePopup({ isOpen: false, })),
      [dispatch]
    ),
    method: ActionType.POST,
    useApiClient: true,
    loadDataRequired: false,
    initialData: initialDayCloseData
  });

  const onClose = useCallback(() => {
    dispatch(toggleDayClosePopup({ isOpen: false, }));
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
          onChangeData={(data: any) => handleFieldChange("passWord", data.passWord)}
        />
         <ERPDateInput
          {...getFieldProps("closedDate")}
          label={t("from")}
          required={true}
          onChangeData={(data: any) => handleFieldChange("closedDate", data.closedDate)}
        />
        <div className="flex justify-around items-center">
          <ERPCheckbox
            {...getFieldProps("isSales")}
            label={t("Sales")}
            onChangeData={(data: any) => handleFieldChange("isSales", data.isSales)}
          />
          <ERPCheckbox
            {...getFieldProps("isPurchase")}
            label={t("purchase")}
            onChangeData={(data: any) => handleFieldChange("isPurchase", data.isPurchase)}
          />
          <ERPCheckbox
            {...getFieldProps("isAccounts")}
            label={t("accounts")}
            onChangeData={(data: any) => handleFieldChange("isAccounts", data.isAccounts)}
          />
        </div>
        <ERPCheckbox
          {...getFieldProps("isAgree")}
          label={t("day_close_agreement")}
          onChangeData={(data: any) => handleFieldChange("isAgree", data.isAgree)}
        />
      </div>
      <ERPFormButtons
        onClear={handleClear}
        submitDisabled={!formState?.data?.isAgree}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DayCloseManage;