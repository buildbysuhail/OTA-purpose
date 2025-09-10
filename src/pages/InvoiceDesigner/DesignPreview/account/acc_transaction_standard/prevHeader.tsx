import React, { useEffect, useState } from "react";
import { DesignerElementType, PlacedComponent, TemplateState } from "../../../Designer/interfaces";
import useLogo from "../../../utils/useLogo";
import { generateQRCodeDataUrl } from "../../../utils/qrSvgToImg";
import { RenderPreviewComponent } from "../../customPrvElement";
import { useNumberToWords } from "../../../../../utilities/number-to-words";

const PrevHeader = ({ data, template}: {
  data: any;
  template?: TemplateState<unknown>;

}) => {
const { convertAmountToEnglish, convertAmountToArabic } = useNumberToWords();
  const [qrCodeImages, setQrCodeImages] = useState<{ [key: string]: string }>({});

  const headerState = template?.headerState;
  const logoWidth = headerState?.logoSize ? (80 * headerState.logoSize) / 100 : 40;
  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";

  const NameFontColor = headerState?.OrganizationFontColor || "#000";
  const NameFontSize = headerState?.OrganizationFontSize || 12;

   const customElementsTop = headerState?.customElements?.elements ?? [];
   const customTopHeight = headerState?.customElements?.height ?? 0;

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
    fontStyle:  template?.propertiesState?.label_font_style || "normal",
    fontFamily,
  };

const Logo = useLogo()

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
    },[template?.headerState?.customElements?.elements]);




  return (
    <div
      className="w-full relative flex flex-col  border-b border-gray-600 z-10"
      style={{ backgroundColor: template?.headerState?.bgColor || "#fff", height: headerState?.isFirstOnly && headerState?.headerHeight ? `${headerState.headerHeight}px` : "auto" }}
    >
      {/* {template?.background_image_header && (
        <img
          src={template.background_image_header}
          alt="Header Background"
          className="absolute inset-0 w-full h-full  -z-10"
          style={{
            objectPosition: (headerState?.bg_image_header_position ?? "center") as React.CSSProperties["objectPosition"],
            objectFit: (headerState?.bg_image_header_objectFit ?? "fill") as React.CSSProperties["objectFit"],
          }}
        />
      )} */}
            {/* headTop */}
            {Array.isArray(customElementsTop) && customElementsTop.length > 0 && (
              <div
                style={{
                minHeight: `${customTopHeight}pt`, height:`${customTopHeight}pt`,
                width: "100%",
                // position: "relative",
                }

                }
              >
                 {customElementsTop.map((component) => (
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

export default PrevHeader;
