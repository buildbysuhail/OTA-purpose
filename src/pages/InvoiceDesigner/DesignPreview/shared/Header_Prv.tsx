import { StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { DesignerElementType, type PlacedComponent, type TemplateState, } from "../../Designer/interfaces";
import { generateQRCodeDataUrl } from "../../utils/qrSvgToImg";
import { RenderPreviewComponent } from "../customPrvElement";
import { useNumberToWords } from "../../../../utilities/number-to-words";


const ShardPrevHeader = ({
  data,
  template,
  qrCodes
}: {
  data: any;
  template?: TemplateState<unknown>
  qrCodes: { [key: string]: string } 
}) => {

  const { convertAmountToEnglish, convertAmountToArabic } = useNumberToWords();
  const headerState = template?.headerState;
  const customElements = headerState?.customElements?.elements ?? [];
  const customTopHeight = headerState?.customElements?.height ?? 0;
  const bgImage = headerState?.customElements?.background_image

  return (
    <div
    className="w-full h-auto relative flex flex-col flex-wrap z-10"
      // fixed={!headerState?.isFirstOnly}
    >
      {/* Background Image */}

          {Array.isArray(customElements) && customElements.length > 0 && (
              <div
                style={{
                minHeight: `${customTopHeight}pt`, height:`${customTopHeight}pt`,
                width: "100%",
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundPosition: headerState?.customElements?.bg_image_position || "center", // fallback default
                backgroundSize: headerState?.customElements?.bg_image_objectFit || "cover",   
                backgroundRepeat: "no-repeat",
                backgroundColor: `rgb(${headerState?.customElements?.background_color ?? "255,255,255"})`,
                position: "relative",
                overflow: "hidden",
                }}
              >
                {customElements.map((component) => (
                    <RenderPreviewComponent
                      key={component.id}
                      component={component}
                      data={data}
                      qrCodeImages={qrCodes}
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