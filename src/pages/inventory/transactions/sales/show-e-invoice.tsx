import React from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";

interface ShowEInvoiceProps {
  closeModal: () => void;
  t: any;
}

const ShowEInvoice: React.FC<ShowEInvoiceProps> = ({ closeModal, t }) => {
  //   const formState = useSelector((state: RootState) => state.InventoryTransaction);
  //   const dispatch = useDispatch()

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <ERPButton
          title={t("show_report")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
        />
        <ERPButton
          title={t("save")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
        />
        <ERPButton
          title={t("Check Success")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
        />
        <ERPInput
          type="number"
          id={"test data"}
          className="w-32"
          noLabel
          value={1}
          // label={t("quantity")}
          // placeholder={t("Test data")}
          width={20}
          // onChange={(e) => setQuantity(e.target.value)}
          // localInputBox={formState?.userConfig?.inputBoxStyle}
        />
      </div>
    </>
  );
};

export default ShowEInvoice;
