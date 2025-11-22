import React from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";

interface ShowEInvoiceProps {
  closeModal: () => void;
  t: any;
}

const PrintAddressLabel: React.FC<ShowEInvoiceProps> = ({ closeModal, t }) => {
  //   const formState = useSelector((state: RootState) => state.InventoryTransaction);
  //   const dispatch = useDispatch()

  return (
    <>
      <div className="flex items-center gap-2">
        <ERPDataCombobox
          id="voucherType"
          label={t("voucher_type")}
          options={[
            { value: "VoucherType_Id1", label: "VoucherType_Id1" },
            { value: "VoucherType_Id2", label: "VoucherType_Id2" },
            { value: "VoucherType_Id3", label: "VoucherType_Id3" },
          ]}
        />
        <ERPInput
          id="voucherNumber"
          type="number"
          className="w-60"
          label={t("voucher_number")}
        // placeholder={t("Test data")}
        // onChange={(e) => setQuantity(e.target.value)}
        // localInputBox={formState?.userConfig?.inputBoxStyle}
        />
        <ERPButton
          title={t("show")}
          variant="primary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
        />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <ERPInput
          id=""
          type="text"
          labelDirection="horizontal"
          label={t('notes_1')}
          className="w-80"
        />
        <ERPInput
          id=""
          type="text"
          labelDirection="horizontal"
          label={t('notes_2')}
          className="w-80"
        />
        <ERPInput
          id="noOfLabels"
          labelDirection="horizontal"
          label={t('no_of_labels')}
          type="text"
          className="w-40"
        />
      </div>
      <div className="flex items-center justify-end gap-1">
        <ERPButton
          title={t("print")}
          variant="primary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
        />
        <ERPButton
          title={t("close")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
        />
      </div>
    </>
  );
};

export default PrintAddressLabel;
