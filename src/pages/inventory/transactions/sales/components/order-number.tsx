import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import React, { useCallback, useEffect, useState } from "react";
import Urls from "../../../../../redux/urls";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { RootState } from "../../../../../redux/store";
import { useSelector } from "react-redux";
import { Ellipsis } from "lucide-react";
import { useDebouncedInput } from "../../../../../utilities/hooks/useDebounce"
import VoucherType, { purchaseVoucherTypes, } from "../../../../../enums/voucher-types";
import { LoadAndSetTransVoucherFn } from "../use-transaction";
import { formStateMasterHandleFieldChange } from "../../reducer";
import { VoucherElementProps } from "../../transaction-types";

interface LoadByOrderNoProps extends VoucherElementProps {
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn;
  type?: string;
  localInputBox?: any
  label?: any
}

const OrderNo = React.forwardRef<HTMLInputElement, LoadByOrderNoProps>(
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
        ? "PO"
        : "SO",
    });
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
    const showLoadByRefNo = useCallback(async () => {
      if (props.type == "PI_Ref") {
        await props.loadAndSetTransVoucher(
          true,
          undefined,
          undefined,
          undefined,
          undefined,
          orderNumberValue.toString(),
          undefined,
          undefined,
          true,
          false,
          "PI_Ref",
          "",
          ""
        );
      } else {
        if (formState.transaction.master.orderNumber) {
          setShowLoadData(true);
        }
      }
    }, [formState.transaction.master.orderNumber]);

    const handleLoadByRefNo = useCallback(async () => {
      await props.loadAndSetTransVoucher(
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        (loadData.vNumber ?? 0).toString(),
        undefined,
        undefined,
        true,
        false,
        "PO",
        loadData.formType ?? "",
        loadData.vPrefix ?? ""
      );
      setShowLoadData(false);
    }, [
      formState.transaction.master.voucherNumber,
      loadData.vPrefix,
      formState.transaction.master.voucherType,
      loadData.formType,
      loadData.vNumber,
    ]);

    useEffect(() => {
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
      <>
        {!showLoadData ? (
          <div className="flex items-center gap-1">
            <ERPInput
              localInputBox={props.localInputBox}
              id="orderNumber"
              label={props.label}
              noLabel={props.label == undefined}
              value={orderNumberValue}
              labelDirection="horizontal"
              className="flex-1 h-6 text-xs max-w-none sm:max-w-28"
              onChange={(e) => onOrderNumberChange(e.target.value)}
            />
            {(formState.transaction.master.voucherType == "PI" ||
              formState.transaction.master.voucherType == "GRN" || props.type == "PI_Ref") && (
                <button
                  className="bg-gray-300 p-2 rounded-md hover:shadow-md transition duration-300 flex-shrink-0"
                  onClick={showLoadByRefNo}
                >
                  <Ellipsis className="w-4 h-4" />
                </button>
              )}
          </div>
        ) : (
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
                          vFormTypeId: e.value,
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
                    value={loadData.vPrefix}
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
        )}
      </>
    );
  }
);

export default React.memo(OrderNo);
