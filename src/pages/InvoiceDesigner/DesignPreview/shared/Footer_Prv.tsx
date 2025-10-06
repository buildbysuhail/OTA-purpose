import { StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { DesignerElementType, type PlacedComponent, type TemplateState, } from "../../Designer/interfaces";
import { generateQRCodeDataUrl } from "../../utils/qrSvgToImg";
import { RenderPreviewComponent } from "../customPrvElement";
import { useNumberToWords } from "../../../../utilities/number-to-words";



const ShardPrevFooter = ({
  data,
  template,
  qrCodes
}: {
  data: any;
  template?: TemplateState<unknown>;
  qrCodes: { [key: string]: string } 

}) => {
  const { convertAmountToEnglish, convertAmountToArabic } = useNumberToWords();
  const footerState = template?.footerState;
  const customElements = footerState?.customElements?.elements ?? [];
  const customTopHeight = footerState?.customElements?.height ?? 0;
  const bgImage = footerState?.customElements?.background_image 
  return (
    <div
    className="w-full h-auto relative flex flex-col flex-wrap " >


 {Array.isArray(customElements) && (
              <div
                style={{
                minHeight: `${customTopHeight}pt`, height:`${customTopHeight}pt`,
                width: "100%",
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundPosition: footerState?.customElements?.bg_image_position || "center", // fallback default
                backgroundSize: footerState?.customElements?.bg_image_objectFit || "cover",   
                backgroundRepeat: "no-repeat",
                backgroundColor: `rgb(${footerState?.customElements?.background_color ?? "255,255,255"})`,
                position: "relative",
                }

                }
              >
                 {customElements.filter(comp => !comp.containerId).map((component) => (
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

export default ShardPrevFooter;