import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import { toggleDeleteInactiveTransactionPopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { initialDataCounter } from "../system/counters-manage-type";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import { useTranslation } from "react-i18next";

interface DeleteInactiveTransactionManageData {
  date: string;
  isAgree: boolean;
}

const DeleteInactiveTransactionManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const { isEdit, handleClear, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<DeleteInactiveTransactionManageData>({
      url: Urls.deleteInactiveTransactions,
      onSuccess: useCallback(
        () =>
          dispatch(
            toggleDeleteInactiveTransactionPopup({ isOpen: false, key: null })
          ),
        [dispatch]
      ),
      method: ActionType.POST,
      useApiClient: true,
      loadDataRequired: false
    });

  const onClose = useCallback(() => {
    dispatch(
      toggleDeleteInactiveTransactionPopup({ isOpen: false, key: null })
    );
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPDateInput
          {...getFieldProps("date")}
          type="date"
          id="date"
          label={t("till_date")}
          onChangeData={(data: any) => handleFieldChange("date", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isAgree")}
          label={t("i_agree_to_delete_all_inactive_transactions_till_the_selected_date")}
          onChangeData={(data: any) => handleFieldChange("isAgree", data)}
        />
      </div>
      <ERPFormButtons
        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

export default DeleteInactiveTransactionManage;
