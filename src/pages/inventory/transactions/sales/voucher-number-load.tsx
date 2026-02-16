import React, { useState } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { LoadAndSetTransVoucherFn } from "./use-transaction";
import { APIClient } from "../../../../helpers/api-client";
import { TransactionFormState } from "../transaction-types";
import { Ellipsis } from "lucide-react";

interface VoucherNumberLoadProps {
  t: (key: string) => string;
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn;
  loadVoucherType: string;
  voucherType: string;
  formState: TransactionFormState;
  title: any;
}

const api = new APIClient();
const VoucherNumberLoad: React.FC<VoucherNumberLoadProps> = ({
  t,
  loadAndSetTransVoucher,
  loadVoucherType,
  voucherType,
  formState,
  title
}) => {
  const [invoiceData, setInvoiceData] = useState({
    vrPrefix: "",
    vrNumber: "",
  });

  let vNumber = "";
  let vPrefix = "";
  let vType = "";

  if(loadVoucherType === "DR"){
    vNumber = invoiceData.vrNumber;
    vPrefix = invoiceData.vrPrefix;
    vType = "DR"

  }
  // In load and more section there will be a SQ, in that case we are making the url loadSQ,
  // So need to manage that section using SQinSO - check is the methos is good or not
  if(loadVoucherType === "SQinSO"){
    vNumber = invoiceData.vrNumber;
    vPrefix = invoiceData.vrPrefix;
    vType = "SQinSO"   // Load VType

  }
  if(loadVoucherType === "RFQ"){
    vNumber = invoiceData.vrNumber;
    vPrefix = invoiceData.vrPrefix;
    vType = "RFQ"
  }
  if(loadVoucherType === "SQinGR"){
    vNumber = invoiceData.vrNumber;
    vPrefix = invoiceData.vrPrefix;
    vType = "SQinGR"
  }
  if(loadVoucherType === "SQinGD"){
    vNumber = invoiceData.vrNumber;
    vPrefix = invoiceData.vrPrefix;
    vType = "SQinGD"
  }

  const handleLoadBtnClick = async () => {
    try {
      debugger;
      const res = await loadAndSetTransVoucher(
        false,
        Number(vNumber),
        invoiceData.vrPrefix,
        voucherType,
        "",
        "",
        0,
        undefined,
        true,  // skip prompt
        false,
        vType,
        undefined,
        vPrefix,
        undefined,
        false, // pnl master disable
        true
      );
    } catch (error) {
      console.error("API failed", error);
    }
  };

  return (
    <div className="flex flex-col">
  <label className="text-secondary">{t(title)}</label>

  <div className="grid grid-cols-[auto_1fr_auto] gap-1 items-center">
    {(formState.transaction.master.voucherType === "SO" || formState.transaction.master.voucherType === "GR" || formState.transaction.master.voucherType === "GD") && (
      <ERPInput
        id="voucherPrefix"
        type="text"
        value={invoiceData.vrPrefix}
        noLabel={true}
        className="w-20"
        onChange={(e) =>
          setInvoiceData((prev) => ({
            ...prev,
            vrPrefix: e.target.value.toUpperCase(),
          }))
        }
      />
    )}

    <ERPInput
      id="voucherNumber"
      type="text"
      value={invoiceData.vrNumber}
      noLabel
      className="w-32"
      onChange={(e) =>
        setInvoiceData((prev) => ({
          ...prev,
          vrNumber: e.target.value,
        }))
      }
    />

    <button
      className="bg-gray-300 px-2 py-1.5 rounded-md hover:shadow-md transition"
      onClick={handleLoadBtnClick}
    >
      <Ellipsis className="w-3 h-3" />
    </button>
  </div>
</div>
  );
};

export default VoucherNumberLoad;
