import { StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { DesignerElementType, type PlacedComponent, type TemplateState, } from "../../Designer/interfaces";
import { generateQRCodeDataUrl } from "../../utils/qrSvgToImg";
import { RenderPreviewComponent } from "../customPrvElement";
import { useNumberToWords } from "../../../../utilities/number-to-words";

const styles = StyleSheet.create({




  otherInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "flex-start",
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

const ShardPrevHeader = ({
  data,
  template,
}: {
  data: any;
  template?: TemplateState<unknown>
}) => {
  const { convertAmountToEnglish, convertAmountToArabic } = useNumberToWords();
  const [qrCodeImages, setQrCodeImages] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const generateQRCodes = async () => {
      const images: { [key: string]: string } = {};
      const qrComponents: PlacedComponent[] = [
        ...(template?.headerState?.customElements?.elements || []),
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
  }, [template?.headerState?.customElements?.elements]);

  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const headerState = template?.headerState;
  const customElements = headerState?.customElements?.elements ?? [];
  const customTopHeight = headerState?.customElements?.height ?? 0;
  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;
  const paddingTop = template?.propertiesState?.padding?.top || 10;
  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";
  const orgNameFontColor = headerState?.OrganizationFontColor || "#000";
  const orgNameFontSize = headerState?.OrganizationFontSize || 12;
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

  return (
    <div
    className="w-full h-auto relative flex flex-col flex-wrap z-10"

      style={{
        backgroundColor: template?.headerState?.bgColor || "#fff",
      }}
      // fixed={!headerState?.isFirstOnly}
    >
      {/* Background Image */}
      {template?.background_image_header && (
        <img
         className="absolute inset-0 w-full h-full  -z-10"
          src={template?.background_image_header || "/placeholder.svg"}
          alt="Header Background"
          style={{
             objectPosition: (headerState?.bg_image_header_position ?? "center") as React.CSSProperties["objectPosition"],
             objectFit: (headerState?.bg_image_header_objectFit ?? "fill") as React.CSSProperties["objectFit"],
           }}
        />
      )}

 {Array.isArray(customElements) && customElements.length > 0 && (
              <div
                style={{
                minHeight: `${customTopHeight}pt`, height:`${customTopHeight}pt`,
                width: "100%",
                // position: "relative",
                }

                }
              >
                 {customElements.map((component) => (
                    <RenderPreviewComponent
                      key={component.id}
                      component={component}
                      data={data}
                      qrCodeImages={qrCodeImages}
                      convertAmountToArabic={convertAmountToArabic}
                      convertAmountToEnglish={convertAmountToEnglish}
                    />
                  ))}
              </div>
            )}


    </div>
  );
};

export default ShardPrevHeader;