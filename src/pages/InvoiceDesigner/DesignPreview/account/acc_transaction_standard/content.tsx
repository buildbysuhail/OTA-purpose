import React from "react";
import { dateTrimmer, getAmountInWords } from "../../../../../utilities/Utils";
import VoucherType from "../../../../../enums/voucher-types";

const Content = ({ data, template, currentBranch, clientSession, indexNO = 0 }: any) => {
  const headerState = template?.headerState;
  const totalState = template?.totalState;
  const propertiesState = template?.propertiesState;

  return (
    <div
      className="w-full border-b border-gray-600 relative"
      style={{ backgroundColor: template?.propertiesState?.bg_color || "#fff" }}
    >
      {template?.background_image && (
        <img
          src={template.background_image}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
          style={{ objectPosition: propertiesState?.bg_image_position || "center", objectFit: propertiesState?.bg_image_objectFit || "fill" }}
        />
      )}

      <div className="flex flex-col gap-5 p-5 w-full">
        <div className="flex flex-wrap justify-between w-full">
          {headerState?.showNumberField && (
            <div className="flex gap-1">
              <span>{headerState?.numberField || "No"}:</span>
              <span className="border-b border-dotted border-gray-800 w-12 inline-block">{data.master?.voucherNumber}</span>
            </div>
          )}

          {headerState?.accountTransactionInfo?.showDateField && (
            <div className="flex gap-1">
              <span>{headerState?.accountTransactionInfo?.dateField || "Date"}:</span>
              <span className="border-b border-dotted border-gray-800">{dateTrimmer(data.master?.transactionDate)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-7 w-full">
          <div className="flex gap-2 w-full">
            <span>{headerState?.accountTransactionInfo?.paymentMode || "PAYMENT GIVEN TO"}:</span>
            <div className="flex-1 border-b border-dotted border-gray-800">
              <span>{data.details[indexNO]?.ledgerName}</span>
            </div>
          </div>
          <div className="w-full border-b border-dotted border-gray-800"></div>
        </div>

        {totalState?.showAmoutInWords && (
          <div className="flex gap-2 w-full">
            <span>the sum of rupees :</span>
            <div className="flex-1 border-b border-dotted border-gray-800">
              <span>{getAmountInWords(Number(data.details[indexNO]?.amount), clientSession?.currency ?? "INR")}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-5 w-full">
          <div className="flex gap-2 w-full">
            <span>by Cash/*Cheque/*DD No :</span>
            <div className="flex-1 border-b border-dotted border-gray-800">
              <span>
                {data.master?.voucherType === VoucherType.CashPayment || data.master?.voucherType === VoucherType.CashReceipt ? "Cash"
                  : data.master?.voucherType === VoucherType.BankPayment || data.master?.voucherType === VoucherType.BankReceipt ? "Bank"
                  : "Cash"}
              </span>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <span>towards :</span>
            <div className="flex-1 border-b border-dotted border-gray-800"></div>
          </div>
        </div>

        <div className="flex justify-between items-start w-full">
          {totalState?.showTotalSection && (
            <div className="flex flex-col gap-1">
              <div
                className="flex justify-center items-center border border-gray-800 rounded w-full h-8 bg-gray-100"
                style={{ backgroundColor: totalState.totalBgColor ?? "#f6f5f5" }}
              >
                <span
                  style={{
                    color: totalState?.totalFontColor ?? "#3d3c3c",
                    fontSize: totalState.totalFontSize ?? 14,
                    fontStyle: "italic",
                    fontFamily: "monospace",
                  }}
                >
                  {totalState?.currencyPosition === "before" ? clientSession?.currencySymbol ?? "INR" : ""}
                  {data.details[indexNO]?.amount}
                  {totalState?.currencyPosition === "after" ? clientSession?.currencySymbol ?? "INR" : ""}
                </span>
              </div>
              <span className="text-gray-600 text-[6px] italic">*All Cheque/DD are subject to realisation</span>
            </div>
          )}

          <div className="flex flex-col items-end">
            <span>Reciver Name</span>
          </div>
          <div className="flex flex-col items-end">
            <span>Authorised Signatory</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
