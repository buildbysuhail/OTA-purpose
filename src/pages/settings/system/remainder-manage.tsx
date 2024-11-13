import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { toggleRemainderPopup, } from "../../../redux/slices/popup-reducer";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import { initialDataRemainder, RemainderData } from "./remainder-manage-type";
import { useTranslation } from "react-i18next";

export const RemainderManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    handleClear,
    getFieldProps,
    isLoading,
    handleClose
  } = useFormManager<RemainderData>({
    url: Urls.Remainder,
    onClose:useCallback(() => dispatch(toggleRemainderPopup({ isOpen: false, key: null,})), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleRemainderPopup({ isOpen: false, key: null, reload: true  })), [dispatch]),
    key: rootState.PopupData.reminder.key,
    keyField:"remaindersID",
    useApiClient: true,
    initialData: initialDataRemainder
  });


  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("remainderName")}
          label={t("remainder_name")}
          placeholder={t("remainder_name")}
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("remainderName", data.remainderName);
          }}
        />
        <ERPInput
          {...getFieldProps("descriptions")}
          label={t("descriptions")}
          placeholder={t("descriptions")}
          onChangeData={(data: any) => handleFieldChange("descriptions", data.descriptions)}
        />
        <ERPDateInput
          {...getFieldProps("remaindingDate")}
          type="date"
          id="remaindingDate"
          label={t("date_of_reminds")}
          onChangeData={(data: any) => handleFieldChange("remaindingDate", data.remaindingDate)}
        /> 

        <ERPInput
          {...getFieldProps("numberOfDays")}
          type="number"
          label={t("number_of_days")}
          placeholder={t("number_of_days")}
          onChangeData={(data: any) => handleFieldChange("numberOfDays", data.numberOfDays)}
        />

      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});
