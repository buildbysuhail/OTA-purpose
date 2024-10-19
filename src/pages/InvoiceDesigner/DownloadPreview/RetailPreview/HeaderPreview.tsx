import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { DownloadPreviewProps } from "./DownloadPreview";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const HeaderPreview = ({ template, data, docIDKey, docTitle, currencySymbol, currentBranch }: DownloadPreviewProps) => {
  const headerState = template?.headerState;

  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const billingAddress = data?.addresses?.find((val: any) => val?.address?.address_type?.is_for == "customer");

  const docID = data?.[docIDKey || "sales_invoice_no"] || "";
  const docTitleVal = docTitle || headerState?.docTitle;
  const numberField = docTitle && headerState?.numberField;

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left;
  const paddingRight = template?.propertiesState?.margins?.right;

  /// font size and color
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || "normal";

  /// label font size and color
  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || "normal";

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <View
        style={{
          paddingLeft,
          paddingRight,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          zIndex: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "0.75rem",
            lineHeight: "1rem",
            width: "100%",
            paddingBottom: "10pt",
          }}
        >
          {headerState?.showLogo && (
            <Image style={{ width: 80 * logoWidthRatio }} src={{ uri: currentBranch?.logo??"", method: "GET", headers: {}, body: "" }} />
            // <Image style={{ width: 80 * logoWidthRatio }} src={ActiveBranch?.company?.image} />
          )}
          {headerState?.showOrgName && (
            <View
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
                display: "flex",
                flexDirection: "column",
                paddingVertical: "5px",
              }}
            >
              <Text>{currentBranch?.company?.name}</Text>
            </View>
          )}
          {headerState?.showOrgAddress && (
            <View
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {currentBranch?.address?.map((org: any, idx: number) => (
                <Text key={`ADDRE_${idx}`}>{org}</Text>
              ))}
            </View>
          )}
        </View>
        <View
          style={{
            fontSize,
            color,
            display: "flex",
            flexDirection: "column",
            lineHeight: "1rem",
          }}
        >
          {headerState?.showDocTitle && (
            <Text style={{ fontSize: "18px", fontWeight: 500, marginBottom: "10pt", textAlign: "center" }}>{docTitleVal}</Text>
          )}
          {headerState?.showNumberField && (
            <Text
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              {headerState.numberField} : {docID}
            </Text>
          )}
          {headerState?.showBalanceDue && (
            <Text
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
                marginTop: "15pt",
              }}
            >
              Balance Due
            </Text>
          )}
          {headerState?.showBalanceDue && (
            <Text style={{ fontWeight }}>
              {currencySymbol} {data?.balance_due}
            </Text>
          )}
        </View>
      </View>
      <View
        style={{
          paddingLeft,
          paddingRight,
          marginTop: "2pt",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10,
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: "2pt",
          }}
        >
          <View
            style={{
              fontSize,
              color,
              fontWeight,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
              }}
            >
              Bill To
            </Text>
            <Text>{data?.customer?.name}</Text>
            <Text>{data?.customer?.billing_address?.address}</Text>
            <Text>{data?.customer?.billing_address?.city}</Text>
            <Text>{data?.customer?.billing_address?.country}</Text>
          </View>
          {/* Shiping Info */}
          <View
            style={{
              display: "flex",
              width: "100%",
              zIndex: 10,
              // flexWrap: "wrap",
            }}
          >
            {billingAddress && (
              <View
                style={{
                  fontSize,
                  color,
                  fontWeight,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontSize: labelFontSize,
                    color: labelColor,
                    fontWeight: labelFontWeight,
                    marginTop: "10pt",
                  }}
                >
                  Ship To
                </Text>
                <Text>{data?.customer?.name},</Text>
                {billingAddress?.address?.address_1 && <Text>{billingAddress?.address?.address_1},</Text>}
                {billingAddress?.address?.address_2 && <Text>{billingAddress?.address?.address_2},</Text>}
                {billingAddress?.address?.address_3 && <Text>{billingAddress?.address?.address_3},</Text>}
                <Text>{billingAddress?.address?.zip_code}</Text>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            fontSize,
            color,
            fontWeight,
            display: "flex",
            flexDirection: "column",
            lineHeight: "1rem",
            textAlign: "right",
            width: "50%",
            justifyContent: "center",
          }}
        >
          <View>
            {data?.created_at && (
              <View
                style={{
                  fontSize: labelFontSize,
                  color: labelColor,
                  fontWeight: labelFontWeight,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text>Date :</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text>{data?.created_at.split("T")[0]}</Text>
                </View>
              </View>
            )}
            {data?.due_date && (
              <View
                style={{
                  fontSize: labelFontSize,
                  color: labelColor,
                  fontWeight: labelFontWeight,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text>Due Date :</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text>{data?.due_date.split("T")[0]}</Text>
                </View>
              </View>
            )}
            {data?.payment_terms?.name && (
              <View
                style={{
                  fontSize: labelFontSize,
                  color: labelColor,
                  fontWeight: labelFontWeight,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text>Terms :</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text>{data?.payment_terms?.name}</Text>
                </View>
              </View>
            )}
            {data?.project_name && (
              <View
                style={{
                  fontSize: labelFontSize,
                  color: labelColor,
                  fontWeight: labelFontWeight,
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text>Project Name :</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text>{data?.project_name}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeaderPreview;
