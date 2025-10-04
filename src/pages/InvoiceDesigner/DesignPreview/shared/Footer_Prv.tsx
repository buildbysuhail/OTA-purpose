import { StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { DesignerElementType, type PlacedComponent, type TemplateState, } from "../../Designer/interfaces";
import { generateQRCodeDataUrl } from "../../utils/qrSvgToImg";
import { RenderPreviewComponent } from "../customPrvElement";
import { useNumberToWords } from "../../../../utilities/number-to-words";



const ShardPrevFooter = ({
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
        ...(template?.footerState?.customElements?.elements || []),
     
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
  }, [template]);


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

export default ShardPrevFooter;