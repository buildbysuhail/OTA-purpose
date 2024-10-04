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

interface DeleteInactiveTransactionManageData {
  date: string;
  isChecked: boolean;
}
export const initialDataDeleteInactive = {
  data: {
    date: "",
    isChecked: false,
  },
  validations: {
    date: "",
    isChecked: "",
  },
};
const DeleteInactiveTransactionManage: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
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
    });

  const onClose = useCallback(() => {
    dispatch(
      toggleDeleteInactiveTransactionPopup({ isOpen: false, key: null })
    );
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <ERPDateInput
          {...getFieldProps("date")}
          type="date"
          id="date"
          label="Till Date"
          onChangeData={(data: any) => handleFieldChange("date", data)}
        />
        <ERPCheckbox
          {...getFieldProps("isChecked")}
          label="I agree to delete all inactive transactions till the selected date"
          onChangeData={(data: any) => handleFieldChange("isChecked", data)}
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

export default DeleteInactiveTransactionManage;
