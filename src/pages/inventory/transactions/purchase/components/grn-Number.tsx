import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { VoucherElementProps } from "../../purchase/transaction-types";
import React, { useCallback, useState } from "react";
import Urls from "../../../../../redux/urls";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { formStateHandleFieldChangeKeysOnly } from "../reducer";

interface GrnNumberProps extends VoucherElementProps {
  loadAndSetTransVoucher: (
    usingManualInvNumber: boolean ,
    voucherNumber?: number,
    voucherPrefix?: string,
    voucherType?: string,
    formType?: string,
    manualInvoiceNumber?: string,
    transactionMasterID?: number,
    mode?: "increment" | "decrement" | undefined,
    skipPrompt?: boolean | false,
    setVoucherNo?: boolean | false,
    loadVType?: string,
    loadFType?: string,
    loadPrefix?: string,
  ) => any;
  closeModal: any;
  fromVoucherType: string;
  updateDeliveryNoteNumber?: boolean;
}

const VoucherLoader = React.forwardRef<HTMLInputElement, GrnNumberProps>((props, ref) => {
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const [showLoadData, setShowLoadData] = useState<boolean>(false);
  const { t } = useTranslation('transaction');
  const dispatch = useDispatch();
  const [loadData, setLoadData] = useState<{
    vPrefixId: any;
    vFormTypeId: any;
    formType: any;
    vPrefix: string;
    vNumber: string | undefined;
    vType: string;
  }>({
    vFormTypeId: -2,
    vPrefixId: -2,
    formType: "",
    vPrefix: "",
    vNumber: props.updateDeliveryNoteNumber ? formState.transaction.master.deliveryNoteNumber : "",
    vType: props.fromVoucherType??""
  });

  const handleLoadByRefNo = useCallback(async () => {
    debugger;
    await props.loadAndSetTransVoucher(
      true,
      undefined,
      undefined,
      undefined,undefined,
      props.updateDeliveryNoteNumber ? formState.transaction.master.deliveryNoteNumber: loadData.vNumber,
      undefined, undefined,
      false, false,
      loadData.vType??"",
      loadData.formType??"",
      loadData.vPrefix??""
    );
    props.closeModal();
  }, [
    formState.transaction.master.voucherNumber,
    loadData.vPrefix,
    props.fromVoucherType,
    loadData.formType,
    loadData.vNumber,
  ]);
  return (
    <>
      <div className="flex items-center mb-6">
        {/* INPUT ROW */}
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <ERPDataCombobox
            localInputBox={formState?.userConfig?.inputBoxStyle}
            enableClearOption={false}
            id="FormType"
            className="min-w-[160px]"
            label={t("form_type")}
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
            label={t("v_prefix")}
            value={loadData.vPrefixId}
            data={loadData}
            onSelectItem={(e) =>
              setLoadData((prev) => {
                return {
                  ...prev,
                  vPrefix: e.label,
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
            label={t("v_number")}
            placeholder={t("enter_voucher_number")}
            type="number"
            className="w-[80px]"
            // value={orderNumberValue}
            value={props.updateDeliveryNoteNumber ? formState.transaction.master.deliveryNoteNumber: loadData.vNumber}
            onChange={(e) => {
              if(props.updateDeliveryNoteNumber) {
              dispatch(formStateHandleFieldChangeKeysOnly({fields:{transaction:{master:{deliveryNoteNumber: e.target?.value}}}}))
              } else {
                 setLoadData((prev: any) => {
                return {
                  ...prev,
                  vNumber: e.target?.value,
                };
              })
              }
             
            }
          }
            ref={ref}
          />
        </div>
      </div>

      {/* Modal Footer (Optional) */}
      <div className="flex justify-end gap-3 pt-4">
        <ERPButton
          onClick={handleLoadByRefNo}
          title={props.t("load")}
          variant="primary"
        />
        <ERPButton
          onClick={() => setShowLoadData(false)}
          title={t("cancel")}
          variant="secondary"
        />
      </div>
    </>
  );
}
);

export default React.memo(VoucherLoader);