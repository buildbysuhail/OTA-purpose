import { getAmountInWords } from "../../../../../utilities/Utils";
import { TemplateState } from "../../../Designer/interfaces";
import { AccTransactionData } from "../../../../accounts/transactions/acc-transaction-types";
import CurrencyFormatter from "../../../../../components/formatters/currency-formatter";
import { FormatDate } from "../../../../../components/formatters/date-formatter";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -10,
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "100%",
    flexWrap: "wrap",
  },

  VoucherInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  docTitle: {
    fontSize: 18,
    fontWeight: "medium",
  },

});

export const Content = ({ data, template, currentBranch, docIDKey, currency }: { data: AccTransactionData; template?: TemplateState<unknown>; currentBranch: any, docIDKey?: string; currency?: string; }) => {
  const headerState = template?.headerState;
  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";
  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || 400;
  const labelFontStyle = template?.propertiesState?.label_font_style || "normal";

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
    <div style={{ width: "100%", backgroundColor: template?.propertiesState?.bg_color || "#fff", position: 'relative', zIndex: 10 }}>
      {/* Background Image */}
      {template?.background_image && (
        <img
          src={template?.background_image}
          alt="Content Background"
          style={{
            ...styles.bgImage,
            objectPosition: template?.propertiesState?.bg_image_position || 'center',
            objectFit: template?.propertiesState?.bg_image_objectFit as 'fill' | 'contain' | 'cover' | 'none' | 'scale-down' || 'fill'
          }}
        />
      )}

      <div style={styles.content}>
        {headerState?.showDocTitle && (
          <p
            style={{
              ...styles.docTitle,
              color: headerState?.docTitleFontColor,
              fontSize: headerState?.docTitleFontSize,
              fontFamily: fontFamily,
              textAlign: "center",
              textDecoration: headerState?.docTitleUnderline ? "underline" : "none",
            }}>
            {headerState?.docTitle}
          </p>
        )}

        {/* Date & No */}
        <div style={styles.VoucherInfo}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, }}>
            <div style={{ display: "flex", flexDirection: "row", gap: 2, }}>
              <span style={labelStyles}>  {headerState?.numberField ? `${headerState?.numberField} :` : "No :"}</span>
              <span style={fontStyles}>  {data.master?.voucherNumber || 1}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "row", gap: 2, }}>
              <span style={labelStyles}> {headerState?.accountTransactionInfo?.dateField ? `${headerState?.accountTransactionInfo?.dateField} :` : "Date :"}</span>
              <span style={fontStyles}>  {FormatDate(data.master?.transactionDate)}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2, }}>
            <div style={{ border: "1pt solid rgb(23, 23, 23)", display: "flex", flexDirection: "row", justifyContent: "center", padding: 4, borderRadius: 2, minWidth: 100, }}>
              <span style={fontStyles}>
                <CurrencyFormatter amount={data.master?.totalDebit} />
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 5, width: "100%", }}>
          <span style={labelStyles}>  {template?.headerState?.receivedFromLabel ? `${template?.headerState?.receivedFromLabel}` : "Received From"} :</span>
          <div style={{ flex: 1, borderBottom: "1pt solid rgb(25, 25, 25)" }}>
            <span style={fontStyles}>
              {template?.headerState?.billTo}
              {/* this need change */}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 5, width: "100%", }}>
          <span style={labelStyles}>the sum of rupees :</span>
          <div style={{ flex: 1, borderBottom: "1pt solid rgb(25, 25, 25)" }}>
            <span style={fontStyles}>
              {getAmountInWords(Number(data.master?.totalDebit))}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start", width: "100%" }}>
          <span style={labelStyles}>Reciver</span>
          <span style={labelStyles}>Cashier</span>
          <span style={labelStyles}>Account</span>
        </div>
      </div>
    </div>
  );
};