import { StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { DesignerElementType, type PlacedComponent, type TemplateState, } from "../../../Designer/interfaces";
import { generateQRCodeDataUrl } from "../../../utils/qrSvgToImg";
// import { renderComponent } from "../../../DownloadPreview/customElement";
import useLogo from "../../../utils/useLogo";

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

const AccPrevHeader = ({
  data,
  template,
  currentBranch,
  docIDKey,
  currency,
  userSession,
  bindData
}: {
  data: any;
  template?: TemplateState<unknown>
  currentBranch: any;
  docIDKey?: string;
  currency?: string;
  userSession?: any;
  bindData?: any;
}) => {
  const [qrCodeImages, setQrCodeImages] = useState<{ [key: string]: string }>({});
  const Logo = useLogo()
  useEffect(() => {
    const generateQRCodes = async () => {
      const images: { [key: string]: string } = {};
      const qrComponents: PlacedComponent[] = [
        ...(headerState?.customElements?.elements|| []),
    
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

      {/* Header Top */}
      {Array.isArray(customElements) && customElements.length > 0 && (
        <div
          style={{
            ...styles.headerTop,
            minHeight: customTopHeight,
            height: "auto",
          }}>
        
        </div>
      )}

      {/* Company Info */}
      <div
      className="flex flex-row justify-between w-full z-10 my-1"
        style={{
          paddingTop: paddingTop,
          paddingRight: paddingRight,
          paddingLeft: paddingLeft,
        }}>
        <div className="flex flex-col content-center justify-center pl-2">
          {headerState?.showLogo && Logo && (
            <img
              src={Logo}
              alt="Logo"
              style={{ width: 80 * logoWidthRatio }}
            />
          )}
          {headerState?.showOrgName && (
            <p className="capitalize font-semibold" 
            style={{...fontStyles,color: headerState?.OrganizationFontColor, fontSize: headerState?.OrganizationFontSize }}>
              {currentBranch?.company?.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {headerState?.showOrgAddress &&
            currentBranch?.address?.map((org: any, idx: number) => (
              <p key={`ADDK_${idx}`} style={fontStyles}>
                {org}
              </p>
            ))}
          {headerState?.hasPhoneField && (
            <div style={styles.otherInfo}>
              <span style={labelStyles}>
                {headerState?.phoneLabel || "Phone No"}:
              </span>
              <span style={fontStyles}>
                {currentBranch?.phone}
              </span>
            </div>
          )}
          {headerState?.hasfaxField && (
            <div style={styles.otherInfo}>
              <span style={labelStyles}>
                {headerState?.faxLabel || "Fax No"}:
              </span>
              <span style={fontStyles}>
                {currentBranch?.fax }
              </span>
            </div>
          )}
          {headerState?.hasEmailField && (
            <div style={styles.otherInfo}>
              <span style={labelStyles}>
                {headerState?.emailLabel || "Email"}:
              </span>
              <span style={fontStyles}>
                {currentBranch?.email }
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Header Bottom */}
      <div></div>
    </div>
  );
};

export default AccPrevHeader;