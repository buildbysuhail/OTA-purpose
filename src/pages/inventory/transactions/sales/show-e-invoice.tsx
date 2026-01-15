import React, { useState } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import Urls from "../../../../redux/urls";
import { TransactionFormState } from "../transaction-types";
import { APIClient } from "../../../../helpers/api-client";
import ERPTextarea from "../../../../components/ERPComponents/erp-textarea";

interface ShowEInvoiceProps {
  closeModal: () => void;
  t: any;
  formState: TransactionFormState;
}

const api = new APIClient();
const ShowEInvoice: React.FC<ShowEInvoiceProps> = ({ closeModal, t, formState }) => {
  const [numericValue, setNumericValue] = useState<number>(1)
  const [resultText, setResultText] = useState("");
  const InvMasterID = formState.transaction.master?.invTransactionMasterID;

  // Show E-invoice Report page
  const handleShowReport = () => {
    const reportUrl = `${import.meta.env.BASE_URL}reports/_/inventory/ksa_e_invoice_detailed_report`;
    window.open(reportUrl, "_self"); //Opens with in the same window
    // window.open(reportUrl, "_blank"); // Opens in new window
  }

  // The function is not completed because of end point not set - do later
  const handleCheckSuccessBtnClick = async () => {
    let successCount = 0;
    let failedCount = 0;
    const startTime = Date.now();
    const endDate = Date.now();
    
    for (let i = 0; i < Number(numericValue); i++) {
    try {
      debugger;
      if (InvMasterID> 0){
        // The Api end point is not set now, Need to manage after it done
        const response = await api.getAsync(`${Urls.inv_transaction_base}${formState.transactionType}/LoadEInvoice`);
        if (response?.isSuccess) {
          successCount++;
        } else {
          failedCount++;
        }
      }
    } catch {
      failedCount++;
    }

    const totalMs = endDate - startTime;
    const avgMs = totalMs / (i + 1);

    setResultText(
      `Total Time MS : ${totalMs}\n` +
      `Avg Time in MS : ${avgMs}\n` +
      `Success Count : ${successCount}\n` +
      `Failure Count : ${failedCount}\n`
    );
  }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <ERPButton
          title={t("show_report")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg"
          onClick={()=> handleShowReport()}
        />
        {/* The save button is visible false in 1050 */}
        {/* <ERPButton
          title={t("save")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg hidden"
        /> */}

        <div className="flex gap-1">
          <ERPButton
          title={t("check_success")}
          variant="secondary"
          className="!m-0 dark:bg-dark-bg-card dark:text-dark-text dark:hover:bg-dark-hover-bg "
          onClick={()=> handleCheckSuccessBtnClick()}
        />
        <ERPInput
          id="numericValue"
          type="number"
          className="w-32"
          noLabel={true}
          value={numericValue}
          onChange={(e)=> setNumericValue(Number(e.target.value))}
          inputClassName="h-44"
        />
        </div>
      </div>
      <div className="w-full flex gap-2 mt-2">
        <div className="w-2/3">
          <ERPTextarea
            id="textBox1"
            localInputBox={formState?.userConfig?.inputBoxStyle}
            label={t("textBox1")}
            noLabel={true}
            className="h-96 text-sm"
            placeholder={t(" ")}
          />
        </div>
        <div className="w-1/3">
          <ERPTextarea
            id="textBox2"
            label={t("textBox2")}
            noLabel={true}
            className="h-96 text-sm"
            placeholder={t(" ")}
            value={resultText}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowEInvoice;
