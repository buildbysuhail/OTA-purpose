import { View, Text, Image } from "@react-pdf/renderer";
import { DNSPTEmpProps } from ".";
import { dateTrimmer } from "../../../../utilities/Utils";

const Header = ({ data, template, preference, company, addressTemplates }: DNSPTEmpProps) => {
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const billingAddress = data?.addresses?.find((val: any) => val?.address?.address_type?.is_for == "customer");

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
        marginVertical: 20,
      }}
    >
      <View
        style={{
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
            fontSize: "0.75rem",
            lineHeight: "1rem",
            paddingBottom: "10pt",
          }}
        >
          <Image
            style={{ width: 80 * logoWidthRatio }}
            src={{
              uri: company?.image,
              method: "GET",
              headers: { "Cache-Control": "no-cache" },
              body: "",
            }}
          />
          <View
            style={{
              fontSize: labelFontSize,
              color: labelColor,
              fontWeight: labelFontWeight,
              display: "flex",
              flexDirection: "column",
              paddingVertical: "10px",
            }}
          >
            <Text>{company?.name}</Text>
          </View>
          <View
            style={{
              fontSize: labelFontSize,
              color: labelColor,
              fontWeight: labelFontWeight,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {addressTemplates?.orgAddressTemplate?.map((org: any, index: number) => (
              <Text key={`ADDR_${index}`}>{org}</Text>
            ))}
          </View>
        </View>
        <View
          style={{
            fontSize,
            color,
            display: "flex",
            flexDirection: "column",
            lineHeight: "1rem",
            textAlign: "right",
            justifyContent: "flex-start",
          }}
        >
          <Text style={{ fontSize: "18px", fontWeight: 500, marginBottom: "0.5pt", color: "#be3a31" }}>{preference?.document_title}</Text>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <Text
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
                paddingVertical: "5px",
              }}
            >
              {preference?.transaction_number || "#"} : {data?.sales_invoice_no}
            </Text>
          </View>
          {preference?.balance_due_enable && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
              <Text
                style={{
                  fontSize: labelFontSize,
                  color: labelColor,
                  fontWeight: labelFontWeight,
                  marginTop: "15pt",
                }}
              >
                {preference?.balance_due || "Balance Due"} : {data?.balance_due}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
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
          {preference?.bill_to_enable && (
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
                {preference?.bill_to || "Bill To"}
              </Text>
              <Text>{data?.customer?.name}</Text>
              <Text>{data?.customer?.billing_address?.address}</Text>
              <Text>{data?.customer?.billing_address?.city}</Text>
              <Text>{data?.customer?.billing_address?.country}</Text>
            </View>
          )}

          {preference?.delivery_to_enable && (
            <View
              style={{
                display: "flex",
                width: "100%",
                zIndex: 10,
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
                    {preference?.delivery_to || "Ship To"}
                  </Text>
                  <Text>{data?.customer?.name},</Text>
                  {billingAddress?.address?.address_1 && <Text>{billingAddress?.address?.address_1},</Text>}
                  {billingAddress?.address?.address_2 && <Text>{billingAddress?.address?.address_2},</Text>}
                  {billingAddress?.address?.address_3 && <Text>{billingAddress?.address?.address_3},</Text>}
                  <Text>{billingAddress?.address?.zip_code}</Text>
                </View>
              )}
            </View>
          )}
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
              <Text> {preference?.date_field || "Date"} :</Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text>{dateTrimmer(data?.created_at)}</Text>
            </View>
          </View>

          {preference?.reference_field_enable && data?.ref_number && (
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
                <Text> {preference?.reference_field || "Ref #"} :</Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text>{data?.ref_number}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;
