import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleResetDataBasePopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";

export interface ResetDB {
  from: string;
  to: string;
  password: string;
  selectAll: boolean;
  updateStock: boolean;
  maintainRecords: boolean;
  updateAccount: boolean;
}

export const initialResetDbData = {
  data: {
    from: "",
    to: "",
    password: "",
    selectAll: false,
    updateStock: false,
    maintainRecords: false,
    updateAccount: false,
  },
  validations: {
    from: "",
    to: "",
    password: "",
  },
};

const ResetDbManage: React.FC = React.memo(() => {
  const rootState = useRootState();
  const dispatch = useDispatch();

  const { isEdit, handleSubmit, handleFieldChange, getFieldProps, isLoading } =
    useFormManager<ResetDB>({
      url: Urls.reset_data_base,
      onSuccess: useCallback(
        () => dispatch(toggleResetDataBasePopup({ isOpen: false, key: null })),
        [dispatch]
      ),
      method: ActionType.POST,
      useApiClient: true,
    });

  const onClose = useCallback(() => {
    dispatch(toggleResetDataBasePopup({ isOpen: false, key: null }));
  }, []);

  const { t } = useTranslation();

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-5 ">
          <ERPDateInput
            {...getFieldProps("from")}
            type="date"
            id="from"
            label={t("from")}
            onChangeData={(data: any) => handleFieldChange("from", data)}
          />
          <ERPDateInput
            {...getFieldProps("to")}
            type="date"
            id="to"
            label={t("to")}
            onChangeData={(data: any) => handleFieldChange("to", data)}
          />
          <ERPInput
            {...getFieldProps("password")}
            label={t("password")}
            placeholder={t("password")}
            required={true}
            onChangeData={(data: any) => handleFieldChange("password", data)}
          />
        </div>

        <div className="flex justify-start items-center gap-5 mb-5">
          {/* deme text area */}
          <div className="w-1/2 ">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Forms
            </label>
            <textarea
              {...getFieldProps("remarks")}
              rows={12}
              className="w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleFieldChange("remarks", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
            <div className="flex flex-col gap-6">
              {/* Account Master */}
              <div className="border border-gray-200 rounded p-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Master
                </label>

                <ERPCheckbox
                  label="Account Group"
                  {...getFieldProps("selectAll")}
                />
                <ERPCheckbox
                  label="Account Ledgers"
                  {...getFieldProps("selectAll")}
                />
                <ERPCheckbox
                  label="Currencies"
                  {...getFieldProps("selectAll")}
                />
                <ERPCheckbox
                  label="Party Category"
                  {...getFieldProps("selectAll")}
                />
                <ERPCheckbox
                  label="Customers"
                  {...getFieldProps("selectAll")}
                />
                <ERPCheckbox
                  label="Suppliers"
                  {...getFieldProps("selectAll")}
                />
              </div>

              {/* HR Master */}
              <div className="border border-gray-200 rounded p-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HR Master
                </label>

                <ERPCheckbox
                  label="Designation"
                  {...getFieldProps("selectAll")}
                />
                <ERPCheckbox label="Employee" {...getFieldProps("selectAll")} />
                <ERPCheckbox
                  label="Job Works"
                  {...getFieldProps("selectAll")}
                />
                <ERPCheckbox
                  label="Documents"
                  {...getFieldProps("selectAll")}
                />
              </div>
            </div>
           <div className="border border-gray-200 rounded p-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Inventory Master
             </label>
              <ERPCheckbox label="Products"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Product Group"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Product Category" {...getFieldProps("selectAll")} />
              <ERPCheckbox label="Brands"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Price Category"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Unit of Measures"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Vehicles"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Warehouse"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Tax Category"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Product Prices"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Sales Route"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Salesman Route"  {...getFieldProps("selectAll")}/>
              <ERPCheckbox label="Bill of Material"  {...getFieldProps("selectAll")}/>
            </div>
          </div>
        </div>

        <div className="flex justify-start items-center gap-5 ">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2  sm:gap-5">
            <ERPCheckbox
              {...getFieldProps("selectAll")}
              label={t("select_all")}
              onChangeData={(data: any) => handleFieldChange("selectAll", data)}
            />
            <ERPCheckbox
              {...getFieldProps("updateStock")}
              label={t("update_stock")}
              onChangeData={(data: any) =>
                handleFieldChange("updateStock", data)
              }
            />
            <ERPCheckbox
              {...getFieldProps("maintainRecords")}
              label={t("maintain_records")}
              onChangeData={(data: any) =>
                handleFieldChange("maintainRecords", data)
              }
            />
            <ERPCheckbox
              {...getFieldProps("updateAccount")}
              label={t("update_account")}
              onChangeData={(data: any) =>
                handleFieldChange("updateAccount", data)
              }
            />
          </div>
        </div>
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

export default ResetDbManage;
