import React, { useState } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface SalesReturnProps {
  isOpen: boolean;
  onClose: () => void;
  handleLoadSr: any;
  t: (key: string) => string;
}

const SalesReturnAmount: React.FC<SalesReturnProps> = ({
  isOpen,
  onClose,
  handleLoadSr,
  t,
}) => {
  const [formType, setFormType] = useState<string | null>(null);
  const [vPrefix, setVPrefix] = useState<string | null>(null);
  const [vNumber, setVNumber] = useState<number>(0);
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const voucherType = "SR";

  // Load Button Click Function
  const handleLoadClick = async () => {
    if (
      await handleLoadSr({
        voucherNumber: vNumber,
        voucherPrefix: vPrefix,
        voucherForm: formType,
      })
    ) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <ERPModal
      isOpen={isOpen}
      closeModal={onClose}
      title={t("")}
      width={500}
      height={250}
      content={
        <div className=" bg-gray-100 flex items-center justify-center z-999">
          <div className="bg-white rounded-lg w-full max-w-xl px-4 z-999">
            <h1 className="text-2xl font-bold text-purple-800 mb-4 text-center">
              {t("sales_return_amount")}
            </h1>
            <form className="flex flex-col ">
              <div className="flex flex-row items-center justify-center space-x-2">
                <div className="flex flex-col space-y-2">
                  <ERPDataCombobox
                    enableClearOption={false}
                    id="FormType"
                    className="min-w-[160px]"
                    label={t("form_type")}
                    value={formType || -2}
                    field={{
                      id: "name",
                      valueKey: "name",
                      labelKey: "name",
                      getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/FormTypeByVoucherType/${voucherType}`,
                    }}
                    onSelectItem={(data: any) => {
                      setFormType(data?.name ?? null);
                    }}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <ERPDataCombobox
                    key={formType}
                    localInputBox={formState?.userConfig?.inputBoxStyle}
                    enableClearOption={false}
                    id="voucherPrefix"
                    className="min-w-[160px]"
                    label={t("v_prefix")}
                    value={vPrefix || -2}
                    field={{
                      id: "name",
                      valueKey: "name",
                      labelKey: "name",
                      getListUrl: `${Urls.inv_transaction_base}${formState.transactionType}/Data/PrefixByVoucherType/`,
                      params: `voucherType=${voucherType}&formType=${formType}`,
                    }}
                    onSelectItem={(data: any) => {
                      setVPrefix(data?.name ?? null);
                    }}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <ERPInput
                    id="v_number"
                    type="number"
                    value={vNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setVNumber(parseInt(e.target.value) || 0)
                    }
                    placeholder={t("voucher_number")}
                  />
                </div>
              </div>
              <div className="flex flex-row space-x-2 items-center justify-center">
                <div className="flex justify-end space-x-4 mt-6">
                  <ERPButton
                    title={t("close")}
                    variant="secondary"
                    onClick={handleClose}
                  />
                  <ERPButton
                    title={t("load")}
                    variant="primary"
                    onClick={() => handleLoadClick()}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      }
    />
  );
};

export default SalesReturnAmount;
