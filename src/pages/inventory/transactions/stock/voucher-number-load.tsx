import React, { useState } from "react";
import { LoadAndSetTransVoucherFn } from "./use-transaction";
import { APIClient } from "../../../../helpers/api-client";
import { TransactionFormState } from "../transaction-types";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import Urls from "../../../../redux/urls";
import { ArrowBigDownDash, Ellipsis } from "lucide-react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

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
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );
  let vNumber = "";
  let vPrefix = "";
  let vType = "";
  let vForm = "";

  const [voucherData, setVoucherData] = useState({
    selectedVoucher: "Order", // default selected
    vrPrefix: "",
    vrNumber: "",
  });

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
    // voucherType = "GR";
  }
  if (loadVoucherType === "PO") {
    vType = "PO";
  }
  if (loadVoucherType === "ILR") {
    loadVoucherNumber = Number(voucherData.vrNumber);
    vPrefix = voucherData.vrPrefix;
    if (voucherData.selectedVoucher === "Order") {
      vType = "SO";
    } else if (voucherData.selectedVoucher === "Sales") {
      vType = "SI";
      if (applicationSettings?.branchSettings?.maintainTaxes) {
        vForm = "VAT";
      }
    }
  }

  const handleLoadBtnClick = async () => {
    if (loadVoucherType !== "ILR") {
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
        if (isConvertedTransaction === false) {
          if (loadVoucherType === "GR") {
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
        } else {
          if (vType === "BTI" || vType === "PO" || vType === "GR") {
            ERPAlert.show({
              icon: "info",
              title: t("converted_transaction"),
              text: t("the_invoice_already_processed."),
              confirmButtonText: t("ok"),
              showCancelButton: false,
            });
          } else if (vType === "PI" && vForm === "") {
            ERPAlert.show({
              icon: "info",
              title: t("converted_transaction"),
              text: t("the_voucher_already_processed."),
              confirmButtonText: t("ok"),
              showCancelButton: false,
            });
          } else if (vType === "PI" && vForm === "Import") {
            ERPAlert.show({
              icon: "info",
              title: t("converted_transaction"),
              text: t("the_invoice_already_processed."),
              confirmButtonText: t("ok"),
              showCancelButton: false,
            });
          } else if (vType === "GRN") {
            ERPAlert.show({
              icon: "info",
              title: t("converted_transaction"),
              text: t("the_GRN_already_processed."),
              confirmButtonText: t("ok"),
              showCancelButton: false,
            });
          } else if (vType === "OS") {
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
    } else if (loadVoucherType === "ILR") {
      try {
        const res = await loadAndSetTransVoucher(
          false,
          Number(loadVoucherNumber),
          vPrefix,
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
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* If the voucher type is not ILR */}
      {loadVoucherType !== "ILR" && (
        <ERPButton
          title={t(title)}
          variant="secondary"
          onClick={handleLoadBtnClick}
        />
      )}

      {/* If voucherType is ILR */}
      {loadVoucherType === "ILR" && (
        <div className="border pb-1 px-3 rounded-md border-gray-200">
          <label className="text-xs">{t(title)}</label>

          <div className="flex items-center justify-center gap-1">
            <div className="flex items-center justify-center gap-2 mt-2">
              <ERPRadio
                id="order"
                name="selectedVoucher"
                label={t("order")}
                checked={voucherData.selectedVoucher === "Order"}
                onChange={() =>
                  setVoucherData((prev) => ({
                    ...prev,
                    selectedVoucher: "Order",
                  }))
                }
              />

              <ERPRadio
                id="sales"
                name="selectedVoucher"
                label={t("sales")}
                checked={voucherData.selectedVoucher === "Sales"}
                onChange={() =>
                  setVoucherData((prev) => ({
                    ...prev,
                    selectedVoucher: "Sales",
                  }))
                }
              />
            </div>

            {/*Prefix */}
            <ERPInput
              id="voucherPrefix"
              type="text"
              value={voucherData.vrPrefix}
              noLabel
              className="w-20"
              onChange={(e) =>
                setVoucherData((prev) => ({
                  ...prev,
                  vrPrefix: e.target.value.toUpperCase(),
                }))
              }
            />

            {/* Voucher Number */}
            <ERPInput
              id="voucherNumber"
              type="text"
              value={voucherData.vrNumber}
              noLabel
              className="w-32"
              onChange={(e) =>
                setVoucherData((prev) => ({
                  ...prev,
                  vrNumber: e.target.value,
                }))
              }
            />

            <button
              type="button"
              className="bg-gray-300 px-2 py-1.5 rounded-md hover:shadow-md transition flex items-center justify-center"
              onClick={handleLoadBtnClick}
            >
              <ArrowBigDownDash className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherNumberLoad;
