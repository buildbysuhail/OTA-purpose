import React, { useEffect, useState } from "react";
import { DesignerElementType, PlacedComponent, TemplateState } from "../../../Designer/interfaces";
import useLogo from "../../../utils/useLogo";
import { generateQRCodeDataUrl } from "../../../utils/qrSvgToImg";
import { RenderPreviewComponent } from "../../customPrvElement";
import { useNumberToWords } from "../../../../../utilities/number-to-words";

const PrevHeader = ({ data, template, currentBranch,userSession }: {
  data: any;
  template?: TemplateState<unknown>;
  currentBranch: any;
  docIDKey?: string;
  currency?: string;
  userSession?: any;
  bindData?:any;
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

   const customElementsTop = headerState?.customTop?.customElements ?? [];
   const customTopHeight = headerState?.customTop?.height ?? 0;

   const customElementsBottom = headerState?.customBottom?.customElements ?? [];
   const customBotHeight = headerState?.customBottom?.height ?? 0;
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
          ...(template?.headerState?.customTop?.customElements || []),
          ...(template?.headerState?.customBottom?.customElements || []),
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
    },[template?.headerState?.customTop?.customElements,template?.headerState?.customBottom?.customElements]);




  return (
    <div
      className="w-full relative flex flex-col flex-wrap border-b border-gray-600 z-10"
      style={{ backgroundColor: template?.headerState?.bgColor || "#fff", height: headerState?.isFirstOnly && headerState?.headerHeight ? `${headerState.headerHeight}px` : "auto" }}
    >
      {template?.background_image_header && (
        <img
          src={template.background_image_header}
          alt="Header Background"
          className="absolute inset-0 w-full h-full  -z-10"
          style={{
            objectPosition: (headerState?.bg_image_header_position ?? "center") as React.CSSProperties["objectPosition"],
            objectFit: (headerState?.bg_image_header_objectFit ?? "fill") as React.CSSProperties["objectFit"],
          }}
        />
      )}
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
                      userSession={userSession}
                      currentBranch={currentBranch}
                      qrCodeImages={qrCodeImages}
                      convertAmountToArabic={convertAmountToArabic}
                      convertAmountToEnglish={convertAmountToEnglish}
                    />
                  ))}
              </div>
            )}
      <div className="flex flex-wrap w-full my-2 z-10">
        <div className="flex flex-col flex-[33.33%] justify-start items-start pl-2">
          <div className="flex items-center space-x-1">
          {headerState?.showLogo && Logo && (
            <img src={Logo} alt="Logo" style={{ width: logoWidth }} />
          )}
          {headerState?.showOrgName && (
            <p className="capitalize font-semibold" style={{...fontStyles,color: headerState?.OrganizationFontColor, fontSize: headerState?.OrganizationFontSize }}>
              {currentBranch.company?.name}
            </p>
          )}
          </div>
          <div className="items-center">
            {headerState?.showOrgAddress &&
            currentBranch.address?.map((line: string, idx: number) => (
              <p key={idx} style={{...fontStyles, fontSize: template?.propertiesState?.font_size || 12 }}>{line}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-[33.33%] justify-center items-center">
          {headerState?.showDocTitle && (
            <p
              className="text-base"
              style={{
                ...fontStyles,
                color: headerState?.docTitleFontColor,
                fontSize: headerState?.docTitleFontSize,
                textDecoration: headerState?.docTitleUnderline ? "underline" : "none",
              }}
            >
              {headerState?.docTitle || "Account Transaction"}
            </p>
          )}
        </div>
        <div className="flex flex-col flex-[33.33%] items-end pr-2">
        

          {headerState?.hasPhoneField && (
            <div className="flex gap-1">
              <span style={labelStyles}>{headerState?.phoneLabel || "Phone No"}:</span>
              <span style={fontStyles}>{currentBranch?.phone}</span>
            </div>
          )}
           {headerState?.hasEmailField && (
            <div className="flex gap-1">
              <span style={labelStyles}>{headerState?.emailLabel || "Email"}:</span>
              <span style={fontStyles}>{currentBranch?.phone}</span>
            </div>
          )}
          {headerState?.hasfaxField && (
            <div className="flex gap-1">
              <span style={labelStyles}>{headerState?.faxLabel || "Fax No"}:</span>
              <span style={fontStyles}>{currentBranch?.fax}</span>
            </div>
          )}
        </div>
      </div>

                  {/* headBottom */}
            {Array.isArray(customElementsBottom) && customElementsBottom.length > 0 && (
              <div
                style={{
                minHeight: `${customBotHeight}pt`, height:`${customBotHeight}pt`,
                width: "100%",
                position: "relative",
                }

                }
              >
                 {customElementsBottom.map((component) => (
                    <RenderPreviewComponent
                      key={component.id}
                      component={component}
                      data={userSession?.headerFooter}
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
