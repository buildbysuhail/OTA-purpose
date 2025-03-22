import { View, Text, StyleSheet, Image } from "@react-pdf/renderer"
import type { AccountTransactionProps } from "."

const styles = StyleSheet.create({
  footerContainer: {
   position:"relative",
    textAlign: "center",
    padding: "5pt 10pt",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -10,
  },
})

const Footer = ({ data, template }: AccountTransactionProps) => {
  const footerState = template?.footerState
  const fontFamily = template?.propertiesState?.font_family || "Roboto"
  const fontSize = footerState?.footerFontSize || 12
  const color = footerState?.footerFontColor || "#000"
  const fontWeight = template?.propertiesState?.font_weight || 400
  const fontStyle = template?.propertiesState?.fontStyle || "normal"

  const fontStyles = {
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
  }

  return (
    <View
      style={{
        ...styles.footerContainer,
        backgroundColor: footerState?.bg_color,
      }}
      fixed
    >
      {/* Background Image */}
      {template?.background_image_footer && (
        <Image
          src={template?.background_image_footer || "/placeholder.svg"}
          style={[styles.bgImage, { objectPosition: footerState?.bg_image_footer_position || "center" }]}
        />
      )}

      {/* Footer Content */}
      <Text style={fontStyles}>Custom Footer Text Here</Text>
      <Text
        style={{
          fontSize: 8,
          marginTop: 2,
        }}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  )
}

export default Footer

