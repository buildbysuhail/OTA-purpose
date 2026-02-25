import React from "react";
import { LoadAndSetTransVoucherFn } from "./use-transaction";
import { APIClient } from "../../../../helpers/api-client";
import { TransactionFormState } from "../transaction-types";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import Urls from "../../../../redux/urls";

interface VoucherNumberLoadProps {
  t: (key: string) => string;
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn;
  loadVoucherType: string;
  voucherType: string;
  formState: TransactionFormState;
  loadVoucherNumber: number;
  title: any;
}

const api = new APIClient();
const VoucherNumberLoad: React.FC<VoucherNumberLoadProps> = ({
  t,
  loadAndSetTransVoucher,
  loadVoucherType,
  voucherType,
  formState,
  loadVoucherNumber,
  title,
}) => {
  let vNumber = "";
  let vPrefix = "";
  let vType = "";
  let vForm = "";

  if (loadVoucherType === "PI") {
    vType = "PI";
  }
  if (loadVoucherType === "BTI") {
    vType = "BTI";
  }
  if (loadVoucherType === "PIImport") {
    vType = "PI",
    vForm = "Import";
  }
  if (loadVoucherType === "OS") {
    vType = "OS";
  }
  if (loadVoucherType === "GRN") {
    vType = "GRN";
  }
  if (loadVoucherType === "GR") {
    vType = "GR";
    // voucherType = "GR";
  }
  if (loadVoucherType === "PO") {
    vType = "PO";
  }

  const handleLoadBtnClick = async () => {

    // Check is converted transaction case
    try {
      const isConvertedTransaction = await api.postAsync(
        `${Urls.inv_transaction_base}${formState.transactionType}/CheckTheTransactionIsConverted`,
        {
          voucherType: vType,
          voucherPrefix: vPrefix,
          voucherNumber: loadVoucherNumber,
          convertedToVoucherType: voucherType,
          voucherForm: vForm,
        }
      );
      if(isConvertedTransaction === false){
        if(loadVoucherType === "GR"){
          if ((formState.transaction.master?.branchID ?? 0) <= 0) {
            ERPAlert.show({
              icon: "info",
              title: t("please_select_branch"),
              text: t(""),
              confirmButtonText: t("ok"),
              showCancelButton: false,
            });
            return;
          }
        }
        try {
          const res = await loadAndSetTransVoucher(
            false,
            Number(loadVoucherNumber),
            "",
            voucherType,
            vForm,
            "",
            0,
            undefined,
            true, // skip prompt
            false,
            vType,
            undefined,
            vPrefix,
            undefined,
            false // pnl master disable
            // true
          );
        } catch (error) {
          console.error("API failed", error);
        }

      }else{
        if(vType === "BTI" || vType === "PO" || vType === "GR"){
          ERPAlert.show({
          icon: "info",
          title: t("converted_transaction"),
          text: t("the_invoice_already_processed."),
          confirmButtonText: t("ok"),
          showCancelButton: false,
        });
         }else if(vType === "PI" && vForm === ""){
          ERPAlert.show({
          icon: "info",
          title: t("converted_transaction"),
          text: t("the_voucher_already_processed."),
          confirmButtonText: t("ok"),
          showCancelButton: false,
        });
         }else if(vType === "PI" && vForm === "Import"){
          ERPAlert.show({
          icon: "info",
          title: t("converted_transaction"),
          text: t("the_invoice_already_processed."),
          confirmButtonText: t("ok"),
          showCancelButton: false,
         });  
        }else if(vType === "GRN"){
          ERPAlert.show({
          icon: "info",
          title: t("converted_transaction"),
          text: t("the_GRN_already_processed."),
          confirmButtonText: t("ok"),
          showCancelButton: false,
        });
        }else if(vType === "OS"){
          ERPAlert.show({
          icon: "info",
          title: t("converted_transaction"),
          text: t("the_transaction_already_processed."),
          confirmButtonText: t("ok"),
          showCancelButton: false,
        });
        }
      }

    } catch (error: any) {
      console.error("Error in api call:", error);
    }
    
  };

  return (
    <div className="flex flex-col">
      <ERPButton
        title={t(title)}
        variant="secondary"
        onClick={handleLoadBtnClick}
      />
    </div>
  );
};

export default VoucherNumberLoad;
