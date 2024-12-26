import VoucherType from "../../../../enums/voucher-types";
import { TemplateState } from "../../Designer/interfaces";

interface FooterProps {
  data?: any;
  template?: TemplateState;
  templateGroupId?: VoucherType | string;
}

const Footer = ({ template, data }: FooterProps) => {
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
        className="flex flex-col gap-2 px-8"
      >
        {data?.notes && (
          <div>
            <a
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
              className=" font-bold"
            >
              Notes:{" "}
            </a>
            <a>{data?.notes}</a>
          </div>
        )}
        {data?.terms_and_conditions && (
          <div>
            <div
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
              className=" font-bold"
            >
              Terms and Conditions
            </div>
            <a>{data?.terms_and_conditions}</a>
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
        style={{
          height: paddingBottom,
          backgroundColor,
        }}
        className=" w-full bg-amber-200 overflow-hidden"
      >
        {/* <img src="/templates/footer_bg_5.png" className=" bg-slate-400 h-full w-full" /> */}
      </div>
    </div>
  );
};

export default Footer;
