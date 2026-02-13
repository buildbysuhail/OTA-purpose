import React, { useState } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { LoadAndSetTransVoucherFn } from "./use-transaction";
import { APIClient } from "../../../../helpers/api-client";
import { TransactionFormState } from "../transaction-types";
import { Ellipsis } from "lucide-react";

interface VoucherNumberLoadProps {
  t: (key: string) => string;
  loadAndSetTransVoucher: LoadAndSetTransVoucherFn;
  voucherType: string;
  formState: TransactionFormState;
}

const api = new APIClient();
const VoucherNumberLoad: React.FC<VoucherNumberLoadProps> = ({
  t,
  loadAndSetTransVoucher,
  voucherType,
  formState,
}) => {
  const [invoiceData, setInvoiceData] = useState({
    vrPrefix: "",
    vrNumber: "",
  });

  const handleLoadBtnClick = async () => {
    try {
      const res = await loadAndSetTransVoucher(
        false,
        Number(invoiceData.vrNumber),
        "",
        voucherType,
        "",
        "",
        0,
        undefined,
        false,
        false,
        "",
        undefined,
        "",
        undefined,
        undefined,
        true
      );
    } catch (error) {
      console.error("API failed", error);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-secondary">{t("dr_no#")}</label>

      <div className="flex items-center gap-2">
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
          className="bg-gray-300 p-2 rounded-md hover:shadow-md transition duration-300"
          onClick={handleLoadBtnClick}
        >
          <Ellipsis className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VoucherNumberLoad;
