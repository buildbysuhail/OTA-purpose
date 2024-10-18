import { dateTrimmer } from "../../../../utilities/Utils";
import { RetailPreviewProps } from "./PreviewWrapper";

const Header = ({ template, data, docTitle, docIDKey, templateGroupId, currency, addressTemplates }: RetailPreviewProps) => {
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const headerState = template?.headerState;

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left;
  const paddingRight = template?.propertiesState?.margins?.right;
  const paddingTop = template?.propertiesState?.margins?.top || 10;

  /// font size and color
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || "normal";

  /// label font size and color
  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || "normal";

  /// Header background color
  const backgroundColor = template?.headerState?.bgColor || "#fff";

  const billingAddress = data?.addresses?.find((val: any) => val?.address?.address_type?.is_for == "customer");

  const docTitleVal = docTitle || headerState?.docTitle;
  const numberField = docTitle && headerState?.numberField;
  const docID = data?.[docIDKey || "sales_invoice_no"] || "";

  return (
    <div className="flex flex-col items-center justify-center  w-full ">
      {/* invoice header bg image  */}
      <div
        style={{
          height: paddingTop,
          backgroundColor,
        }}
        className=" bg-green-200 top-0 left-0 h-[50px] w-full overflow-hidden"
      ></div>
      {/* Company Info */}
      <div
        style={{
          paddingLeft,
          paddingRight,
        }}
        className=" relative flex flex-col w-full z-10 flex-wrap"
      >
        <div className="flex-1 flex flex-col text-xs text-center justify-center items-center w-full ">
          {headerState?.showLogo && <img src={company?.image} style={{ width: 80 * logoWidthRatio }} className="mb-2" />}
          {headerState?.showOrgName && <a className=" capitalize font-semibold">{company?.name}</a>}
          {headerState?.showOrgAddress && (
            <div
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
              className="flex flex-col"
            >
              {/* <p dangerouslySetInnerHTML={{ __html: orgTemplate }}></p> */}
              {addressTemplates?.orgAddressTemplate?.map((org: any, index: number) => (
                <div key={`ORGTE_${index}`}>{org}</div>
              ))}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize,
            color,
          }}
          className={` flex-1 flex flex-col text-xs `}
        >
          {headerState?.showDocTitle && <a className=" text-[18px] font-medium my-2 font-serif text-center">{docTitleVal}</a>}
          {headerState?.showNumberField && (
            <span
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              {headerState.numberField} : {docID}
            </span>
          )}
          {headerState?.showBalanceDue && (
            <span
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              Balance Due :{" "}
              <span style={{ fontWeight }}>
                {currency} {data?.balance_due}
              </span>
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          paddingLeft,
          paddingRight,
        }}
        className="relative flex w-full z-10 flex-wrap mt-4 px-8"
      >
        <div className="flex-1 flex flex-col gap-2 w-1/2">
          <div className="flex flex-col w-full flex-wrap">
            {/* Billing Info */}
            <div
              style={{
                fontSize,
                color,
                fontWeight,
              }}
              className="flex-1 flex flex-col"
            >
              <a
                style={{
                  fontSize: labelFontSize,
                  color: labelColor,
                  fontWeight: labelFontWeight,
                }}
                className=" text-[10px] font-bold "
              >
                Bill To
              </a>
              <a className="">{data?.customer?.name}</a>
              <a>{data?.customer?.billing_address?.address}</a>
              <a>{data?.customer?.billing_address?.city}</a>
              <a>{data?.customer?.billing_address?.country}</a>
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize,
            color,
            fontWeight,
          }}
          className="flex-1 flex flex-col text-xs text-right w-1/2"
        >
          <table>
            <tbody>
              <tr>
                {data?.created_at && (
                  <>
                    <td
                      style={{
                        fontSize: labelFontSize,
                        color: labelColor,
                        fontWeight: labelFontWeight,
                      }}
                      className=" text-[10px] font-bold"
                    >
                      Date :
                    </td>
                    <td>{dateTrimmer(data?.created_at)}</td>
                  </>
                )}
              </tr>
              <tr>
                {data?.due_date && (
                  <>
                    <td
                      style={{
                        fontSize: labelFontSize,
                        color: labelColor,
                        fontWeight: labelFontWeight,
                      }}
                      className=" text-[10px] font-bold whitespace-nowrap"
                    >
                      Due Date :
                    </td>
                    <td>{dateTrimmer(data?.due_date)}</td>
                  </>
                )}
              </tr>
              <tr>
                {data?.payment_terms?.name && (
                  <>
                    <td
                      style={{
                        fontSize: labelFontSize,
                        color: labelColor,
                        fontWeight: labelFontWeight,
                      }}
                      className="text-[10px] font-bold flex  justify-end "
                    >
                      Terms :
                    </td>
                    <td className="">{data?.payment_terms?.name}</td>
                  </>
                )}
              </tr>
              <tr>
                {data?.project_name && (
                  <>
                    <td
                      style={{
                        fontSize: labelFontSize,
                        color: labelColor,
                        fontWeight: labelFontWeight,
                      }}
                      className=" text-[10px] font-bold"
                    >
                      Project Name :
                    </td>
                    <td>{data?.project_name}</td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Header;
