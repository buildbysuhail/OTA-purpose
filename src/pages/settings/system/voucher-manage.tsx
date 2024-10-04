import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../redux/urls";
import { toggleVoucherPopup } from "../../../redux/slices/popup-reducer";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { VoucherData } from "./vouchers-manage-type";

export const VoucherManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  
  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<VoucherData>({
      url: Urls.Voucher,
      onSuccess: useCallback(
        () => dispatch(toggleVoucherPopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      key: rootState.PopupData.voucher.key,
    });

  const onClose = useCallback(() => {
    dispatch(toggleVoucherPopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ERPInput
          {...getFieldProps("formType")}
          label="Form Type"
          placeholder="Form Type"
          required={true}
          onChangeData={(data: any) => {
            handleFieldChange("formType", data);
          }}
        />

        <ERPDataCombobox
          {...getFieldProps("voucherType")}
          id="voucherType"
          field={{
            id: "voucherType",
            required: true,
            getListUrl: Urls.data_vouchertype,
            valueKey: "id",
            labelKey: "name",
          }}
          label="Voucher Type"
          required={true}
          onChangeData={(data: any) => handleFieldChange("voucherType", data)}
        />
        <ERPInput
          {...getFieldProps("descriptions")}
          label="Descriptions"
          placeholder="Descriptions"
          required={true}
          onChangeData={(data: any) => handleFieldChange("descriptions", data)}
        />
          <ERPInput
          {...getFieldProps("lastVoucherPrefix")}
          label="lastVoucher Prefix"
          placeholder="lastVoucherPrefix"
          required={true}
          onChangeData={(data: any) => handleFieldChange("lastVoucherPrefix", data)}
        />
          <ERPInput
          {...getFieldProps("lastVoucherNumber")}
          label="lastVoucher Number"
          type="number"
          placeholder="lastVoucherNumber"
          required={true}
          onChangeData={(data: any) => handleFieldChange("lastVoucherNumber", data)}
        />
       
        <ERPCheckbox
          {...getFieldProps('isDefault')}
          label="Is Default"
          onChangeData={(data: any) => handleFieldChange('isDefault', data)}
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
