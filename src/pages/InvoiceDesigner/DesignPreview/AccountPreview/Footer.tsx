import { useEffect, useState } from "react";
import { AccountPreviewProps } from "./index";

const Footer = ({ template, data, templateGroupId }: AccountPreviewProps) => {
  /// font size and color
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || "normal";

  /// label font size and color
  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || "normal";

  /// Padings
  const paddingLeft = template?.propertiesState?.padding?.left || 10;
  const paddingRight = template?.propertiesState?.padding?.right || 10;
  const paddingBottom = template?.propertiesState?.padding?.bottom || 50;
  /// Footer background color
  const backgroundColor = template?.footerState?.bg_color || "#fff";
  const footerFontColor = template?.footerState?.footerFontColor || "#000";

  /* ######################################################################################### */
 
  const [generalFooterBGStyle, setGeneralFooterBGStyle] = useState<any>({ height: paddingBottom, backgroundColor, color: footerFontColor});

  useEffect(() => {
    
    setGeneralFooterBGStyle((previous: any) => ({
        ...previous,
        backgroundColor:backgroundColor,
        height: paddingBottom,
      backgroundImage: `url(${template?.background_image_footer})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: template?.footerState?.bg_image_footer_position ?? "top left",
      backgroundSize: "cover"
      }));
    
  }, [template, template?.footerState?.bg_image_footer_position])
  /* ######################################################################################### */

  return (
    <div className=" text-xs w-full">
      <div
        style={{
          fontSize,
          color,
          fontWeight,
          paddingLeft,
          paddingRight,
        }}
        className="flex flex-col gap-2 px-8 pb-10"
      >
        {template?.footerState?.showNotesLabel && (
          <>
            <div
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              <a className="">{template?.footerState?.notesLabel || "Notes"} : </a>
            </div>
            <a style={{ fontSize: template?.footerState?.noteFontSize }}>
              { data?.notes}
            </a>
          </>
        )}

        {template?.footerState?.showTermsAndConditions && data?.terms_and_conditions && (
          <>
            <div
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
              className=" font-bold "
            >
              {template?.footerState?.termsLabel || "Terms and Conditions"} :
            </div>
            <a style={{ fontSize: template?.footerState?.termsFontSize }}>{data?.terms_and_conditions}</a>
          </>
        )}

        {template?.footerState?.showInvoiceQRCode && data?.qr_code && (
          <div className="bg-gray-200 p-2 flex items-center w-2/3">
            <img src={data?.qr_code} className="w-16" draggable={false} />
            <div className="px-5 text-[10px]">{data?.qr_description || "Scan the QR code"} </div>
          </div>
        )}

        <div>
          {data?.payment_options && (
            <a
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
              className=" font-bold"
            >
              Payment Options :{" "}
              <span
                style={{
                  fontSize,
                  color,
                }}
                className=" font-normal"
              >
                PayPal
              </span>
            </a>
          )}
        </div>
      </div>
      <div
        style={generalFooterBGStyle}
        className="w-full bg-amber-200 overflow-hidden flex justify-start px-5 text-[10px] items-center"
      >
        {template?.footerState?.show_page_number && "1 / 1"}
      </div>
    </div>
  );
};

export default Footer;
