import { View, Image, StyleSheet } from "@react-pdf/renderer";
import {PlacedComponent, TemplateState } from "../../Designer/interfaces";
import { useNumberToWords } from "../../../../utilities/number-to-words";
import { RenderComponentPDF } from "../customElement";


interface ShardPrevHeaderPDFProps {
  data: any;
  template?: TemplateState<unknown>;
  qrCodes: { [key: string]: string };
  AmountToEnglish?: any;
  AmountToArabic?: any;
}

const ShardDowHeader = ({ data, template, qrCodes,AmountToEnglish,AmountToArabic }: ShardPrevHeaderPDFProps) => {

  const headerState = template?.headerState;
  const customElements: PlacedComponent[] = headerState?.customElements?.elements ?? [];
  const customTopHeight = headerState?.customElements?.height ?? 0;
  const bgImage = headerState?.customElements?.background_image;

  const styles = StyleSheet.create({
    headerContainer:{
      width: "100%",
      minHeight: customTopHeight,
      height: customTopHeight,
      backgroundColor: headerState?.customElements?.background_color
        ? `rgb(${headerState.customElements.background_color})`
        : "white",
      position: "relative",
    },
    bgImage: {
      position: "absolute",
      width: "100%",
      height: customTopHeight,
      top: 0,
      left: 0,
      objectFit: headerState?.customElements?.bg_image_objectFit || "cover",
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
    <View style={styles.headerContainer} fixed={!headerState?.customElements?.isFirstOnly}>
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

export default ShardDowHeader;
