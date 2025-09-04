import { StyleSheet } from "@react-pdf/renderer";
import { dateTrimmer, getAmountInWords } from "../../../../../utilities/Utils";
import type { TemplateState } from "../../../Designer/interfaces";
import type { AccTransactionData } from "../../../../accounts/transactions/acc-transaction-types";
import VoucherType from "../../../../../enums/voucher-types";

const styles = StyleSheet.create({
  docTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  amountInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
    width: "100%",
    zIndex: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  amountReceived: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  billTo: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
  },
  signature: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  notes: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 10,
  },
  payment: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 5,
    width: "100%",
  },
  paymentCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexBasis: "50%",
  },
});


const AccPrvContent = ({
  data,
  template,
  currentBranch,
  docIDKey,
  currency,
  clientSession
}: {
  data: AccTransactionData;
  template?: TemplateState<unknown>
  currentBranch: any;
  docIDKey?: string;
  currency?: string;
  clientSession?: any;
}) => {
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const headerState = template?.headerState;
  const totalState = template?.totalState;
  const footerState = template?.footerState;
  const titleColor = template?.headerState?.docTitleFontColor || "#000";
  const titleFontSize = headerState?.docTitleFontSize || 16;
  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";
  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || 400;
  const labelFontStyle = template?.propertiesState?.label_font_style || "normal";
  const custNameFontColor = headerState?.customerNameFontColor;
  const custNameFontSize = headerState?.customerNameFontSize || 12;
  const docTitleVal = headerState?.docTitle;
  const labelStyles = {
    color: labelColor,
    fontSize: labelFontSize,
    fontWeight: labelFontWeight,
    fontStyle: labelFontStyle,
    fontFamily,
  };

  const fontStyles = {
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
  };


  return (
    <div className="flex flex-col w-full">
      {/* Doc Title */}
      {headerState?.showDocTitle && (
        <h1
          style={{
            ...styles.docTitle,
            color: titleColor,
            fontSize: titleFontSize,
            fontFamily: fontFamily,
            textAlign: "center",
            textDecoration: headerState.docTitleUnderline ? "underline" : "none",
          }}>
          {docTitleVal}
        </h1>
      )}

      {/* Amount Info */}
      <div style={styles.amountInfo}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, width: "66.66%" }}>
          {headerState?.showNumberField && (
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <span style={labelStyles}>{headerState?.numberField || "Payment#"}</span>
              <span
                style={{
                  ...fontStyles,
                  borderBottom: "0.5px solid #DFDFDF",
                  width: "66.66%",
                }}
              >
                {dateTrimmer(data.master?.transactionDate)}
              </span>
            </div>
          )}

          {headerState?.accountTransactionInfo?.showDateField && (
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <span style={labelStyles}>{headerState?.accountTransactionInfo?.dateField || "Payment Date"}</span>
              <span
                style={{
                  ...fontStyles,
                  borderBottom: "0.5px solid #DFDFDF",
                  width: "66.66%",
                }}
              >
                {dateTrimmer(data.master?.transactionDate)}
              </span>
            </div>
          )}

          {headerState?.accountTransactionInfo?.showReferenceField && (
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <span style={labelStyles}>{headerState?.accountTransactionInfo?.referenceField || "Reference Number"}</span>
              <span
                style={{
                  ...fontStyles,
                  borderBottom: "0.5px solid #DFDFDF",
                  width: "66.66%",
                }}
              >
                {data?.master.referenceNumber}
              </span>
            </div>
          )}

          {headerState?.accountTransactionInfo?.showPaymentMode && (
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <span style={labelStyles}>{headerState?.accountTransactionInfo?.paymentMode || "Payment Mode"}</span>
              <span
                style={{
                  ...fontStyles,
                  borderBottom: "0.5px solid #DFDFDF",
                  width: "66.66%",
                }}
              >
                {data?.master?.voucherType == VoucherType.CashPayment ||
                  data?.master?.voucherType == VoucherType.CashReceipt ||
                  data?.master?.voucherType == VoucherType.CashPaymentEstimate ||
                  data?.master?.voucherType == VoucherType.CashReceiptEstimate
                  ? "Cash"
                  : data?.master?.voucherType == VoucherType.BankPayment ||
                    data?.master?.voucherType == VoucherType.BankReceipt ||
                    data?.master?.voucherType == VoucherType.BankReconciliation
                    ? "Bank"
                    : ""}
              </span>
            </div>
          )}

          {totalState?.showAmoutInWords && (
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <span style={labelStyles}>Amount In Words</span>
              <span
                style={{
                  ...fontStyles,
                  borderBottom: "0.5px solid #DFDFDF",
                  width: "66.66%",
                }}
              >
                {getAmountInWords(Number(data.master?.totalAmount), clientSession?.currency ?? "INR")}
              </span>
            </div>
          )}
        </div>

        {totalState?.showTotalSection && (
          <div
            style={{
              ...styles.amountReceived,
              maxWidth: "33.33%",
              height: totalState?.amtHeight ? `${totalState?.amtHeight}pt` : 120,
              width: totalState?.amtWidth ? `${totalState?.amtWidth}pt` : 150,
              backgroundColor: totalState?.amtReceivedBgColor ?? "#65a30d",
              color: totalState?.amtReceivedFontColor ?? "#ffffff",
              fontWeight: "medium",
            }}>
            <span style={{ fontSize: 14 }}>
              {totalState?.amtReceivedLabel || "Amount Received"}
            </span>
            <span style={{ fontSize: totalState?.amtReceivedFontSize ?? 14 }}>
              {totalState?.currencyPosition === "before" ? clientSession?.currency_symbol ?? "INR" : ""}{" "}
              {data.master?.totalAmount}{" "}
              {totalState?.currencyPosition === "after" ? clientSession?.currency_symbol ?? "INR" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Bill To and Signature */}
      {/* <div className="flex justify-between w-full my-2.5">
        <div className="flex flex-col gap-0.5">
          {headerState?.showReceivedFrom && (
            <div>
              <span style={labelStyles}>{headerState?.receivedFromLabel ?? "Received From"}</span>
            </div>
          )}
          {headerState?.hasBillTo && (
            <div className="flex flex-col w-3/5">
              <span style={labelStyles}>{headerState?.billTo ?? "Bill T0"}</span>
              <span
                style={{
                  ...fontStyles,
                  color: custNameFontColor,
                  fontSize: custNameFontSize,
                }}
              >
                "Nizam Karippali"
              </span>
              <span style={fontStyles}>Dubai</span>
              <span style={fontStyles}>Karama 123ft</span>
              <span style={fontStyles}>Ho No:1223</span>
              {headerState?.hasShipTo && (
                <>
                  <span style={labelStyles}>{headerState?.shipTo ?? "Ship To"}</span>
                  <span style={fontStyles}>Ho No:1223</span>
                </>
              )}
            </div>
          )}
        </div>

        {footerState?.showSignature && (
          <div className="flex flex-col w-2/5 justify-start items-end">
            <span style={fontStyles}>{footerState?.signatureLabel ?? "Authority Signature"}</span>
            <div className="w-full border-b border-gray-300 flex justify-end">
              {headerState?.showLogo && isValidSignature(currentBranch?.logo) && (
                <img src={currentBranch.logo || "/placeholder.svg"} alt="Signature" style={{ width: 80 * logoWidthRatio }} />
              )}
            </div>
          </div>
        )}
      </div> */}

      {/* Notes */}
      {template?.footerState?.showNotesLabel && (
        <div style={styles.notes}>
          <span style={labelStyles}>{template?.footerState?.notesLabel || "Notes"}</span>
          <span style={{ ...fontStyles, fontSize: template?.footerState?.noteFontSize }}>
            {/* {data?.master?.notes ?? "Payment has been received by cash"} */}
          </span>
        </div>
      )}

      {/* Refund */}
      <div style={{ width: "100%", borderTop: "0.5px solid #DFDFDF", marginTop: 5, marginBottom: 5, }} />
      {/* <div className="flex justify-start gap-0 w-full">
        <div className="flex flex-col items-center basis-1/2">
          <span style={labelStyles}>
            {template?.headerState?.accountTransactionInfo?.paymentRefund || "Total Discount"}
          </span>
          <span style={fontStyles}>{data?.master?.totDiscount ?? "5.00$"}</span>
        </div>

        {template?.headerState?.accountTransactionInfo?.showOverPayment && (
          <div className="flex flex-col items-center basis-1/2 border-l border-gray-300">
            <span style={labelStyles}>
              {template?.headerState?.accountTransactionInfo?.overPayment || "Over Payment"}
            </span>
            <span style={fontStyles}>{data?.master?.totDiscount ?? "5.00$"}</span>
          </div>
        )}
      </div> */}
      {/* <div className="w-full border-t border-gray-300 my-1" /> */}
    </div>
  );
};

export default AccPrvContent;