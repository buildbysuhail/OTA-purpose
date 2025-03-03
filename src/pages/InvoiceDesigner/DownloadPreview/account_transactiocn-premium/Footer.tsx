import { View, Text, StyleSheet, Image,Page } from "@react-pdf/renderer";
import { AccountTransactionProps } from ".";

const styles = StyleSheet.create({
  footerContainer: {
    marginTop:10,
   position:"relative",
    width: "100%",
    textAlign: "center",
    fontSize: 12,
  },
  footerInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -10,
  },
});

const Footer = ({ data, template }: AccountTransactionProps) => {
  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;
  const paddingBottom = template?.propertiesState?.padding?.bottom ;
  const footerState = template?.footerState;
  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = footerState?.footerFontSize || 12;
  const color = footerState?.footerFontColor || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";

  const fontStyles = {
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
  };

  return (
    <View style={{...styles.footerContainer,backgroundColor: footerState?.bg_color ,}} fixed>
      {/* Background Image */}
      {template?.background_image_footer && (
        <Image
          src={template?.background_image_footer}
          style={[
            styles.bgImage,
            { objectPosition: footerState?.bg_image_footer_position || "center" },
          ]}
        />
      )}

      {/* Footer Content (Without Page Number) */}
      <Text style={fontStyles}>Custom Footer Text Here</Text>
      <Text
          style={{
         
            fontSize: 8,
          }}
          fixed
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
    </View>
  );
};

export default Footer;
