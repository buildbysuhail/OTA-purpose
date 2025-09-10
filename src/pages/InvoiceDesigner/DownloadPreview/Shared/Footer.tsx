import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import {
  DesignerElementType,
  type PlacedComponent,
  type TemplateState,
} from "../../Designer/interfaces";
import { Style } from "exceljs";
import { renderComponent } from "../customElement";
import { useEffect, useState } from "react";
import { generateQRCodeDataUrl } from "../../utils/qrSvgToImg";
import { useNumberToWords } from "../../../../utilities/number-to-words";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    position: "relative",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  companyInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    zIndex: 10,
  },
  orgName: {
    textTransform: "capitalize",
    fontWeight: "semibold",
  },
  orgAddress: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  otherInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "flex-start",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -10,
  },
  headerTop: {
    width: "100%",
    position: "relative",
  },
  headerBottom: {
    width: "100%",
    position: "relative",
  },
});

export const Footer = ({
  data,
  template,
}: {
  data: any;
  template?: TemplateState<unknown>;
}) => {
const [qrCodeImages, setQrCodeImages] = useState<{ [key: string]: string }>({});
const { convertAmountToEnglish, convertAmountToArabic } = useNumberToWords();
  useEffect(() => { 
    const generateQRCodes = async () => {
      const images: { [key: string]: string } = {};
      const qrComponents: PlacedComponent[] = [
        ...(footerState?.customElements?.elements|| []),
      ].filter((comp) => comp.type === DesignerElementType.qrCode);

      for (const component of qrComponents) {
        if (component.qrCodeProps) {
          const dataUrl = await generateQRCodeDataUrl(component.qrCodeProps);
          images[component.id] = dataUrl;
        }
      }
      setQrCodeImages(images);
    };
    generateQRCodes();
  },[template?.footerState?.customElements?.elements]);

  const footerState = template?.footerState;
  const customElements = footerState?.customElements?.elements ?? [];
  const customTopHeight = footerState?.customElements?.height ?? 0;

  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";

  const pxToPt = (px: number) => px * (72 / 96);
  const fontStyles = {
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
  };
  const labelStyles = {
    color: template?.propertiesState?.label_font_color || "#000",
    fontSize: template?.propertiesState?.label_font_size || 12,
    fontWeight: template?.propertiesState?.label_font_weight || 400,
    fontStyle: template?.propertiesState?.label_font_style || "normal",
    fontFamily,
  };

  const isValidLogo = (logo: any): boolean => {
    if (!logo) return false;
    if (typeof logo !== "string") return false;
    if (logo.trim() === "") return false;
    return true;
  };

  return (
    <View
      style={{
        ...styles.headerContainer,
        height: "auto",
        backgroundColor: template?.footerState?.bg_color || "#fff",
      }}
    >
      {/* Background Image */}
      {template?.background_image_header && (
        <Image
          src={template?.background_image_header || "/placeholder.svg"}
          style={[
            styles.bgImage,
            {
              objectPosition: footerState?.bg_image_footer_position || "center",
            },
          ]}
        />
      )}
      {/* headTop */}
      

     {Array.isArray(customElements) && customElements.length > 0 && (
        <View
          style={[
            styles.headerTop,
            { minHeight: customTopHeight, height: "auto" },
          ]}
        >
          {customElements?.map((component) =>
            renderComponent(component,convertAmountToEnglish,convertAmountToArabic, data,qrCodeImages)
          )}
        </View>
      )}
      <View></View>
    </View>
  );
};
