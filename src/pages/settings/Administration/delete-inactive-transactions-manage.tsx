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
import ERPButton from "../../../components/ERPComponents/erp-button";

interface DeleteInactiveTransactionManageData {
  date: string;
  isAgree: boolean;
}

const DeleteInactiveTransactionManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { isEdit, formState, handleSubmit, handleClear, handleFieldChange, getFieldProps, isLoading, handleClose } =
    useFormManager<DeleteInactiveTransactionManageData>({
      url: Urls.deleteInactiveTransactions,
      onClose: useCallback(() => dispatch(toggleDeleteInactiveTransactionPopup({ isOpen: false, key: null,reload: false })), [dispatch]),
      onSuccess: useCallback(
        () =>
          dispatch(
            toggleDeleteInactiveTransactionPopup({ isOpen: false })
          ),
        [dispatch]
      ),
      method: ActionType.POST,
      useApiClient: true,
      loadDataRequired: false,
      initialData: { data: { date: new Date() } }
    });
  // const onClose = useCallback(() => {
  //   dispatch(
  //     toggleDeleteInactiveTransactionPopup({ isOpen: false,})
  //   );
  // }, []);
  const { t } = useTranslation("administration");
  return (
    <div className="w-full modal-content">
      <div className="grid grid-cols-1 gap-3">
        <ERPDateInput
          {...getFieldProps("date")}
          type="date"
          id="date"
          required
          label={t("till_date")}
          onChangeData={(data: any) => handleFieldChange("date", data.date)}
        />
        <ERPCheckbox
          {...getFieldProps("isAgree")}
          label={t("i_agree_to_delete")}
          onChangeData={(data: any) => handleFieldChange("isAgree", data.isAgree)}
        />
      </div>
      {/* <ERPButton
        title={t("delete_all")}
        loading={isLoading}
        variant="primary"
        disabled={formState.data.isAgree != true}
        onClick={handleSubmit}
      /> */}
      <ERPFormButtons
        submitDisabled={formState.data.isAgree != true}
        title={t("delete_all")}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        onClear={handleClear}
      />
    </div>
  );
});
export default DeleteInactiveTransactionManage;