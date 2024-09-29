import { DownloadPreviewProps } from "./DownloadPreview";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const FooterPreview = ({ template, data }: DownloadPreviewProps) => {
  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left || 10;
  const paddingRight = template?.propertiesState?.margins?.right || 10;

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

  return (
    <View style={{}}>
      <View
        style={{
          fontSize,
          color,
          fontWeight,
          paddingLeft,
          paddingRight,
          display: "flex",
          flexDirection: "column",
          gap: "2pt",
        }}
      >
        {data?.notes && (
          <View
            style={{
              paddingBottom: "10pt",
            }}
          >
            <Text
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              Notes:{" "}
            </Text>
            <Text>{data?.notes}</Text>
          </View>
        )}
        {data?.terms_and_conditions && (
          <View
            style={{
              paddingBottom: "10pt",
            }}
          >
            <View
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              <Text>Terms and Conditions :</Text>
            </View>
            <Text>{data?.terms_and_conditions}</Text>
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
      </View>
    </View>
  );
};

export default FooterPreview;
