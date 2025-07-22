import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import { formStateLoadDataUpdate, formStateMasterHandleFieldChange } from "../reducer";
import React, { useCallback, useEffect, useState } from "react";
import Urls from "../../../../../redux/urls";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPFormButtons from "../../../../../components/ERPComponents/erp-form-buttons";
import { toggleGrnNumber } from "../../../../../redux/slices/popup-reducer";
import { useRootState } from "../../../../../utilities/hooks/useRootState";
import { GrnNumberData, initialGrnNumber } from "../grn-number-types";
import { useAppSelector } from "../../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../../redux/store";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import { useSelector } from "react-redux";
import VoucherType, { purchaseVoucherTypes } from "../../../../../enums/voucher-types";

interface GrnNumberProps extends VoucherElementProps {
  loadAndSetTransVoucher: any;
}

const GrnNumber = React.forwardRef<HTMLInputElement, GrnNumberProps>(
  (props, ref) => {
    const formState = useSelector(
      (state: RootState) => state.InventoryTransaction
    );
    const [showLoadData, setShowLoadData] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<{
      vPrefixId: any;
      vFormTypeId: any;
      formType: any;
      vPrefix: string;
      vNumber: number | undefined;
      vType: string;
    }>({
      vFormTypeId: -2,
      vPrefixId: -2,
      formType: "",
      vPrefix: "",
      vNumber: formState.transaction.master.orderNumber,
      vType: purchaseVoucherTypes.includes(
        formState.transaction.master.voucherType as VoucherType
      )
        ? "GRN"
        : "GRN",
    });
    const showLoadByRefNo = useCallback(async () => {
      if (formState.transaction.master.orderNumber) {
        setShowLoadData(true);
      }
    }, [formState.transaction.master.orderNumber]);
    
    const handleLoadByRefNo = useCallback(async () => {
      debugger;
      await props.loadAndSetTransVoucher(
        true,
        formState.transaction.master.voucherNumber,
        loadData.vPrefix,
        formState.transaction.master.voucherType,
        loadData.formType,
        loadData.vNumber,
        undefined,
        undefined,
        true
      );
    }, [
      formState.transaction.master.voucherNumber,
      loadData.vPrefix,
      formState.transaction.master.voucherType,
      loadData.formType,
      loadData.vNumber,
    ]);
    const { value: orderNumberValue, onChange: onOrderNumberChange } =
      useDebouncedInput(
        formState.transaction.master.orderNumber || "",
        (debouncedValue) => {
          props.dispatch(
            formStateMasterHandleFieldChange({
              fields: { orderNumber: debouncedValue },
            })
          );
        },
        300
      );
    useEffect(() => {
      debugger;
      if (showLoadData) {
        setLoadData((prev: any) => {
          return {
            ...prev,
            vFormTypeId: -2,
            vPrefixId: -2,
            formType: "",
            vPrefix: "",
            vNumber: formState.transaction.master.orderNumber,
            vType: purchaseVoucherTypes.includes(
              formState.transaction.master.voucherType as VoucherType
            )
              ? "PO"
              : "SO",
          };
        });
      }
    }, [showLoadData]);

    return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-800">&nbsp;</h2>
                    <button
                      onClick={() => setShowLoadData(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      aria-label="Close modal"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
    
                  {/* Modal Content - Your Original Form */}
                  <div className="flex items-center mb-6">
                    {/* INPUT ROW */}
                    <div className="flex items-center gap-3 flex-wrap flex-1">
                      <ERPDataCombobox
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        enableClearOption={false}
                        id="FormType"
                        className="min-w-[160px]"
                        label=""
                        data={loadData}
                        onSelectItem={(e) =>
                          setLoadData((prev) => {
                            return {
                              ...prev,
                              formType: e.label,
                              vFormTypeId: e.value
                            };
                          })
                        }
                        value={loadData?.vFormTypeId}
                        field={{
                          id: "FormType",
                          valueKey: "id",
                          labelKey: "name",
                          getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/FormTypeByVoucherType/${loadData.vType}`,
                        }}
                      />
    
                      <ERPDataCombobox
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        enableClearOption={false}
                        id="Vprefix"
                        className="min-w-[120px]"
                        label=""
                        value={loadData.vPrefixId}
                        data={loadData}
                        onSelectItem={(e) =>
                          setLoadData((prev) => {
                            return {
                              ...prev,
                              vPrefix: e.label, // Fixed: should be vPrefix, not formType
                              vPrefixId: e.value,
                            };
                          })
                        }
                        field={{
                          id: "Vprefix",
                          valueKey: "id",
                          labelKey: "name",
                          getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/PrefixByVoucherType/`,
                          params: `voucherType=${loadData.vType}&formType=${loadData?.formType}`,
                        }}
                      />
    
                      <ERPInput
                        disableEnterNavigation={true}
                        id="VNumber"
                        localInputBox={formState?.userConfig?.inputBoxStyle}
                        min={1}
                        label=""
                        placeholder={props.t("V Number")}
                        type="number"
                        className="w-[80px]"
                        // value={orderNumberValue}
                        value={loadData.vNumber}
                        onChange={(e) =>
                          setLoadData((prev: any) => {
                            return {
                              ...prev,
                              vNumber: e.target?.value, // Fixed: should be vNumber, not formType
                            };
                          })
                        }
                        ref={ref}
                      />
                    </div>
                  </div>
    
                  {/* Modal Footer (Optional) */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <ERPButton
                      onClick={handleLoadByRefNo}
                      title={props.t("Load")}
                      className="h-10"
                    />
                    <button
                      onClick={() => setShowLoadData(false)}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {props.t("Cancel") || "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
    );
  }
);

export default React.memo(GrnNumber);