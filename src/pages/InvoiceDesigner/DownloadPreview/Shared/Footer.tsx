import React from "react";
import { View, Image, Text,StyleSheet } from "@react-pdf/renderer";
import { DesignerElementType, PlacedComponent, TemplateState } from "../../Designer/interfaces";
import { useNumberToWords } from "../../../../utilities/number-to-words";
import { RenderComponentPDF } from "../customElement";

interface Props {
  data?: any;
  template?: TemplateState<unknown>;
  qrCodes?: { [key: string]: string };
   AmountToEnglish?: any;
  AmountToArabic?: any;
}
    
const ShardDownFooter: React.FC<Props> = ({ data, template, qrCodes = {},AmountToEnglish,AmountToArabic }) => {
 
  const footerState = template?.footerState;
  const customElements = footerState?.customElements?.elements ?? [];
  const customTopHeight = footerState?.customElements?.height ?? 0;
  const bgImage = footerState?.customElements?.background_image;

 const styles = StyleSheet.create({
    headerContainer: {
      width: "100%",
      minHeight: customTopHeight,
      height: customTopHeight,
      backgroundColor: footerState?.customElements?.background_color
        ? `rgb(${footerState.customElements.background_color})`
        : "white",
      position: "relative",
    },
    bgImage: {
      position: "absolute",
      width: "100%",
      height: customTopHeight,
      top: 0,
      left: 0,
      objectFit: footerState?.customElements?.bg_image_objectFit || "cover",
    },
    contentContainer: {
      position: "relative",
      flexDirection: "column",
      flexWrap: "wrap",
      zIndex: 10,
      width: "100%",
      minHeight: customTopHeight,
      height: customTopHeight,
    },
  });

  return (
    <View style={styles.headerContainer} fixed={!footerState?.customElements?.isFirstOnly}>
      {bgImage && <Image src={bgImage} style={styles.bgImage} />}
      <View style={styles.contentContainer}>
        {customElements.map((component) => (
          <RenderComponentPDF
            key={component.id}
            component={component}
            data={data}
            qrCodeImages={qrCodes}
            convertAmountToArabic={AmountToArabic}
            convertAmountToEnglish={AmountToEnglish}
          />
        ))}
      </View>
    </View>
  );
};


export default ShardDownFooter;
