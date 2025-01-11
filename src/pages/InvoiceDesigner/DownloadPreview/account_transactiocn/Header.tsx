import { View, Text, Image,StyleSheet } from "@react-pdf/renderer";
import { AccountTransactionProps } from ".";
import { dateTrimmer, getAmountInWords } from "../../../../utilities/Utils";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { TemplateState } from "../../Designer/interfaces";

// const Header = ({ data, template, currentBranch }: { data: any; template?: TemplateState; currentBranch: any}) => {
//   const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
//   const billingAddress = data?.addresses?.find((val: any) => val?.address?.address_type?.is_for == "customer");

  /// font size and color
  // const fontSize = template?.propertiesState?.font_size || 12;
  // const color = template?.propertiesState?.font_color || "#000";
  // const fontWeight = template?.propertiesState?.font_weight || "normal";
  // const currentBranch = useCurrentBranch();

  /// label font size and color
  // const labelFontSize = template?.propertiesState?.label_font_size || 12;
  // const labelColor = template?.propertiesState?.label_font_color || "#000";
  // const labelFontWeight = template?.propertiesState?.label_font_weight || "normal";
  // return (
  //   <View
  //     style={{
  //       display: "flex",
  //       flexDirection: "column",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       width: "100%",
  //       marginVertical: 20,
  //     }}
  //   >
  //     <View
  //       style={{
  //         display: "flex",
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         width: "100%",
  //         zIndex: 10,
  //         flexWrap: "wrap",
  //       }}
  //     >
  //       <View
  //         style={{
  //           display: "flex",
  //           flexDirection: "column",
  //           fontSize: "0.75rem",
  //           lineHeight: "1rem",
  //           paddingBottom: "10pt",
  //         }}
  //       >
  //         <Image
  //           style={{ width: 80 * logoWidthRatio }}
  //           src={{
  //             uri: currentBranch?.logo??"",
  //             method: "GET",
  //             headers: { "Cache-Control": "no-cache" },
  //             body: "",
  //           }}
  //         />
  //         <View
  //           style={{
  //             fontSize: labelFontSize,
  //             color: labelColor,
  //             fontWeight: labelFontWeight,
  //             display: "flex",
  //             flexDirection: "column",
  //             paddingVertical: "10px",
  //           }}
  //         >
  //           <Text>{currentBranch?.name}</Text>
  //         </View>
  //         <View
  //           style={{
  //             fontSize: labelFontSize,
  //             color: labelColor,
  //             fontWeight: labelFontWeight,
  //             display: "flex",
  //             flexDirection: "column",
  //           }}
  //         >
  //           {currentBranch?.address?.map((org: any, index: number) => (
  //             <Text key={`ADDR_${index}`}>{org}</Text>
  //           ))}
  //         </View>
  //       </View>
  //       <View
  //         style={{
  //           fontSize,
  //           color,
  //           display: "flex",
  //           flexDirection: "column",
  //           lineHeight: "1rem",
  //           textAlign: "right",
  //           justifyContent: "flex-start",
  //         }}
  //       >
          {/* <Text style={{ fontSize: "18px", fontWeight: 500, marginBottom: "0.5pt", color: "#be3a31" }}>{preference?.document_title}</Text> */}
          {/* <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <Text
              style={{
                fontSize: labelFontSize,
                color: labelColor,
                fontWeight: labelFontWeight,
                paddingVertical: "5px",
              }}
            > */}
              {/* {preference?.transaction_number || "#"} : {data?.sales_invoice_no} */}
            {/* </Text>
          </View> */}
          {/* {preference?.balance_due_enable && (
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
          )} */}
        {/* </View>
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
        > */}
          {/* {preference?.bill_to_enable && (
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
          )} */}

          {/* {preference?.delivery_to_enable && (
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
          )} */}
//         </View>
//         <View
//           style={{
//             fontSize,
//             color,
//             fontWeight,
//             display: "flex",
//             flexDirection: "column",
//             lineHeight: "1rem",
//             textAlign: "right",
//             width: "50%",
//             justifyContent: "center",
//           }}
//         >
//           <View
//             style={{
//               fontSize: labelFontSize,
//               color: labelColor,
//               fontWeight: labelFontWeight,
//               display: "flex",
//               flexDirection: "row",
//               width: "100%",
//             }}
//           >
//             <View style={{ width: "50%" }}>
        
//             </View>
//             <View style={{ width: "50%" }}>
//               <Text>{dateTrimmer(data?.created_at)}</Text>
//             </View>
//           </View>

      
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Header;




const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  headerBG: {
    height: 50,
    width: "100%",
    overflow: "hidden",
  },
  companyInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-between",
    flexWrap: "wrap",
    width: "100%",
    zIndex: 10,
  },
  logo: {
    marginVertical: 4,
  },
  orgName: {
    textTransform: "capitalize",
    fontWeight: "semibold",
  },
  orgAddress: {
    display: "flex",
    flexDirection: "column",
    gap:2
  },
  docTitle:{
    fontSize: 18,
    fontWeight: "medium",
    marginBottom: 8,
  },
  amountInfo: {
    display: "flex",
    flexDirection: "row",
    gap:30,
    width: "100%",
    zIndex: 10,
    marginVertical: 40,
  },
  amountReceived: {
    height: 120,
    width: 150,
    backgroundColor: "#65a30d",
    padding: 10,
    opacity: 0.8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "medium",
  },
  billTo: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  signature: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    borderBottom: "1px solid #6b7280",
  },
  notes: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 40,
  },
});

export  const Header = ({ data, template, currentBranch,docIDKey,currency}: { data: any; template?: TemplateState; currentBranch: any, docIDKey?: string;currency?: string;}) => {
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const headerState = template?.headerState;
  const totalState = template?.totalState;
  const footerState = template?.footerState;

  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;
  const paddingTop = template?.propertiesState?.padding?.top || 10;

  const titleColor = template?.headerState?.docTitleFontColor || "#000";
  const titleFontSize = headerState?.docTitleFontSize || 16;

  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";

  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || 400;
  const labelFontStyle = template?.propertiesState?.label_font_style || "normal";

  const backgroundColor = template?.headerState?.bgColor || "#ffff";

  const orgNameFontColor = headerState?.OrganizationFontColor || "#000";
  const orgNameFontSize = headerState?.OrganizationFontSize || 12;

  const custNameFontColor = headerState?.customerNameFontColor;
  const custNameFontSize = headerState?.customerNameFontSize || 12;

  const docTitleVal =  headerState?.docTitle;
  const numberField = docTitleVal && headerState?.numberField;
  const docID = data?.[docIDKey || "account_transaction"] || "";

  const generalHeaderBGStyle = {
    height: paddingTop,
    backgroundColor,
    backgroundImage: template?.background_image_header ? `url(${template.background_image_header})` : undefined,
    backgroundRepeat: "no-repeat",
    backgroundPosition: template?.headerState?.bg_image_header_position ?? "top left",
    backgroundSize: "cover",
  };

  const labelStyles = {
    color: labelColor,
    fontSize: labelFontSize,
    fontWeight: labelFontWeight,
    fontStyle: labelFontStyle,
    fontFamily,
  };

  const fontStyles = {
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
  };

  return (
    <View style={styles.container}>
      {/* Company Info */}
      <View style={[styles.companyInfo,]}>
        <View style={{ display: "flex", flexDirection: "column",alignContent:"center" ,
          justifyContent:"center" ,paddingLeft:8}}>
          {headerState?.showLogo && (
            <Image
              src={currentBranch?.logo}
              style={[styles.logo, { width: 80 * logoWidthRatio }]}
            />
          )}
          {headerState?.showOrgName && (
            <Text style={{ color: orgNameFontColor, fontSize: orgNameFontSize, fontWeight: "semibold",fontFamily:fontFamily,textAlign:"center" }}>
              {currentBranch?.name}
            </Text>
          )}
        </View>
        {headerState?.showOrgAddress && (
          <View style={[styles.orgAddress,fontStyles]}>
            {currentBranch.address?.map((org: any, idx: number) => (
              <Text key={`ADDK_${idx}`}>{org}</Text>
            ))}
          </View>
        )}
        <View style={{ width: "100%", borderTop: "0.5px solid #DFDFDF", marginVertical: 16 }} />
      </View>

      {/* Doc Title */}
      {headerState?.showDocTitle && (
        <Text style={[styles.docTitle, { color: titleColor, fontSize: titleFontSize , fontFamily:fontFamily,
         textAlign:"center",textDecoration:"underline"
        }]}>
          {docTitleVal}
        </Text>
      )}

      {/* Amount Info */}
      <View style={[styles.amountInfo,]}>
        <View style={{ flex: 1, display: "flex", flexDirection: "column", gap:10, width: "66.66%" }}>
          {headerState?.showDateField && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width:"100%"}}>
              <Text style={labelStyles}>{headerState?.dateField || "Payment Date"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {dateTrimmer(data.master?.dueDate)}
              </Text>
            </View>
          )}

          {headerState?.showReference && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={labelStyles}>{headerState?.reference || "Reference Number"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {data.master?.referenceNumber}
              </Text>
            </View>
          )}

          {headerState?.showTransactionType && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={labelStyles}>{headerState?.transactionType || "Payment Mode"}</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {data?.master.transaction_type ?? "Cash"}
              </Text>
            </View>
          )}

          {totalState?.showAmoutInWords && (
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={labelStyles}>Total In Words</Text>
              <Text style={[fontStyles, { borderBottom: "0.5px solid #DFDFDF", width: "66.66%" }]}>
                {getAmountInWords(Number(data.master?.totalDebit), currency)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.amountReceived}>
          <Text>Amount Received</Text>
          <Text>{data.master?.totalDebit}</Text>
        </View>
      </View>

      {/* Bill To and Signature */}
      <View style={[styles.companyInfo, { paddingLeft, paddingRight, marginVertical: 40 }]}>
        {headerState?.hasBillTo && (
          <View style={styles.billTo}>
            <Text style={labelStyles}>{headerState?.billTo ?? "Received From"}</Text>
            <Text style={{ color: custNameFontColor, fontSize: custNameFontSize }}>"Nizam Karippali"</Text>
            <Text>Dubai</Text>
            <Text>Karama 123ft</Text>
            <Text>Ho No:1223</Text>
          </View>
        )}
        {footerState?.showSignature && (
          <View style={styles.signature}>
            <Text style={fontStyles}>{footerState?.signatureLabel ?? "Authority Signature"}</Text>
            {headerState?.showLogo && (
              <Image
                src={currentBranch?.logo}
                style={[styles.logo, { width: 80 * logoWidthRatio }]}
              />
            )}
          </View>
        )}
      </View>

      {/* Notes */}
      {template?.footerState?.showNotesLabel && (
        <View style={[styles.notes,]}>
          <Text style={labelStyles}>{template?.footerState?.notesLabel || "Notes"}</Text>
          <Text style={{ ...fontStyles, fontSize: template?.footerState?.noteFontSize }}>
            {data?.master?.notes ?? "Payment has been received by cash"}
          </Text>
        </View>
      )}
    </View>
  );
};

