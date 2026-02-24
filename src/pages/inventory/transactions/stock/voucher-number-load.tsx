import React from "react";
import { LoadAndSetTransVoucherFn } from "./use-transaction";
import { APIClient } from "../../../../helpers/api-client";
import { TransactionFormState } from "../transaction-types";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

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
    (vType = "PI"), (vForm = "Import");
  }
  if (loadVoucherType === "OS") {
    vType = "OS";
  }
  if (loadVoucherType === "GRN") {
    vType = "GRN";
  }
  if (loadVoucherType === "GR") {
    vType = "GR";
    voucherType = "GR";
  }
  if (loadVoucherType === "PO") {
    vType = "PO";
  }

  const handleLoadBtnClick = async () => {
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
