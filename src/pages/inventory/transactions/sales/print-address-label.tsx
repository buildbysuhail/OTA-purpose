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
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-row items-center justify-between w-full px-4">
          <ERPDataCombobox
            id="VoucherType_Id"
            label="Voucher type"
            options={[
              { value: "VoucherType_Id1", label: "VoucherType_Id1" },
              { value: "VoucherType_Id2", label: "VoucherType_Id2" },
              { value: "VoucherType_Id3", label: "VoucherType_Id3" },
            ]}
          />
          <ERPInput
            type="number"
            id={"Voucher Number"}
            className="w-60"
            label={t("Voucher_Number")}
            // placeholder={t("Test data")}
            // onChange={(e) => setQuantity(e.target.value)}
            // localInputBox={formState?.userConfig?.inputBoxStyle}
          />
          <ERPButton
            title={t("show_report")}
            variant="primary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
        </div>
        <div className="px-1 bg-gray-300 w-full h-40 my-4">
            Grid OR Something
        </div>
        <div className="flex w-full px-4 items-center justify-center gap-8 my-1">
            <div>NOTES 1</div>
            <ERPInput
            type="text"
            id={"Notes 1"}
            noLabel
            className="w-80"
          />
        </div>
        <div className="flex w-full px-4 items-center justify-center gap-4 my-1">
            <div>NOTES 2</div>
            <ERPInput
            type="text"
            id={"Notes 2"}
            noLabel
            className="w-80"
          />
        </div>
        <div className="flex w-[50%] px-4 items-center justify-between gap-4 my-1">
            <div>No of labels</div>
            <ERPInput
            type="text"
            id={"Notes 2"}
            noLabel
            className="w-40"
          />
        </div>
        <div className="flex flex-row gap-4 w-[50%] items-center justify-between my-1">
            <ERPButton
            title={t("Close")}
            variant="secondary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
          <ERPButton
            title={t("Print")}
            variant="primary"
            className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          />
        </div>
      </div>
    </>
  );
};

export default PrintAddressLabel;
