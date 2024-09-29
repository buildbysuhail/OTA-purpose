import { dateTrimmer } from "../../../../utils/Utils";
import { DownloadPreviewProps } from "./DownloadPreview";
import { Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const BottomPreview = ({ template, data, templateGroupId, ActiveBranch }: DownloadPreviewProps) => {
  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left || 10;
  const paddingRight = template?.propertiesState?.margins?.right || 10;
  const paddingBottom = template?.propertiesState?.margins?.bottom || 50;

  /// label font size and color
  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || "normal";

  /// font size and color
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || "normal";

  /// Footer background color
  const backgroundColor = template?.footerState?.bg_color || "#fff";

  const displayPaymentStub = template?.propertiesState?.includePaymentStub || false;


  // Notes 
  const noteFontSize = template?.footerState?.noteFontSize || 12;
  const tAndCFontSize = template?.footerState?.termsFontSize || 12;

  return (
    <View style={{}}>
      <View
        style={{
          fontSize,
          color,
          fontWeight,
          paddingLeft,
          paddingRight,
          paddingBottom,
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: "2pt",
        }}
      >
        {template?.footerState?.showNotesLabel && (
          <View
            style={{
              paddingBottom: "10pt",
            }}
            wrap={false}
          >
            <Text
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              {template?.footerState?.notesLabel || "Notes"} :
            </Text>

            <Text style={{ fontSize: noteFontSize }}>
              {templateGroupId === "qty_adjustment" || templateGroupId === "value_adjustment"
                ? data?.description : data?.notes}
            </Text>
          </View>
        )}
        {template?.footerState?.showTermsAndConditions && data?.terms_and_conditions && (
          <View style={{ paddingBottom: "10pt" }} wrap={false}>
            <View
              style={{
                color: labelColor,
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
              }}
            >
              <Text>{template?.footerState?.termsLabel || "Terms and Conditions"} :</Text>
            </View>
            <Text style={{ fontSize: tAndCFontSize }}>{data?.terms_and_conditions}</Text>
          </View>
        )}

        {template?.footerState?.showInvoiceQRCode && data?.qr_code && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#E5E7EB",
            }}
          >
            <Image
              style={{ width: 80, padding: "5px" }}
              src={{
                uri: data?.qr_code,
                method: "GET",
                headers: { "Cache-Control": "no-cache" },
                body: "",
              }}
            />
            <Text style={{ paddingHorizontal: "5px", fontSize: labelFontSize, color: labelColor, fontWeight: labelFontWeight }}>
              {data?.qr_description || "Scan the QR code"}
            </Text>
          </View>
        )}
        <View>
          {data?.payment_options && (
            <Text
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              Payment Options :{" "}
              <Text
                style={{
                  fontSize,
                  color,
                  fontWeight: 400,
                }}
              >
                PayPal
              </Text>
            </Text>
          )}
        </View>

        {/* Payment Stub Sction */}
        {displayPaymentStub &&
          <View
            break={template?.propertiesState?.payment_stub_position !== "same_page"}
            style={{ display: "flex", flexDirection: "row", marginTop: 10, gap: 20 }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ borderBottom: 1, borderStyle: "dashed", paddingBottom: 10 }}>
                <Text>From</Text>
                <Text>{data?.customer?.name ?? "..."}</Text>
                <Text>Name 2</Text>
              </View>

              <View style={{ marginVertical: 5 }}>
                <Text>Invoice # : {data?.sales_invoice_no}</Text>
                <Text>Invoice Date : {dateTrimmer(data?.created_at)}</Text>
                <Text>Balance Due : {data?.balance_due}</Text>
              </View>

              <View style={{ display: "flex", flexDirection: "row", }}>
                <View style={{ flex: 1, backgroundColor: "#E8E8E8", padding: 10, border: 1, }}>
                  <Text>{template?.propertiesState?.amount_enclosed_label ?? "Amount Enclosed"}</Text>
                </View>
                <View style={{ flex: 1, border: 1, padding: 10, }}>
                </View>
              </View>

            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, marginBottom: 12 }}>{template?.propertiesState?.payment_stub_label ?? "Payment Stub"}</Text>
              <Text>{ActiveBranch?.company?.payment_stub_address}</Text>
            </View>
          </View>
        }

      </View>
    </View>
  );
};

export default BottomPreview;
