import { dateTrimmer } from "../../../../utilities/Utils";
import { DownloadPreviewProps } from "./DownloadPreview";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const HeaderPreview = ({ template, data, docIDKey, docTitle, ActiveBranch, currencySymbol, AddressTemplates }: DownloadPreviewProps) => {
  const headerState = template?.headerState;

  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const billingAddress = data?.addresses?.find((val: any) => val?.address?.address_type?.is_for == "customer");

  const titleColor = template?.headerState?.docTitleFontColor || "#000";
  const docID = data?.[docIDKey || "sales_invoice_no"] || "";
  const docTitleVal = docTitle || headerState?.docTitle;
  const numberField = docTitle && headerState?.numberField;

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

  const orgNameFontColor = headerState?.OrganizationFontColor || "#000"
  const orgNameFontSize = headerState?.OrganizationFontSize || 12

  const custNameFontColor = headerState?.customerNameFontColor;
  const custNameFontSize = headerState?.customerNameFontSize || 12;

  const styles = StyleSheet.create({
    labelStyle: { color: labelColor, fontSize: labelFontSize, fontWeight: labelFontWeight },
    fontStyle: { color, fontSize, fontWeight }
  })

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        marginVertical: 20,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          zIndex: 10,
          paddingLeft,
          paddingRight,
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            display: "flex",
            lineHeight: "1rem",
            fontSize: "0.75rem",
            paddingBottom: "10pt",
            flexDirection: "column",
          }}
        >
          {headerState?.showLogo && (
            <Image
              style={{ width: 80 * logoWidthRatio }}
              src={{
                uri: ActiveBranch?.company?.image, method: "GET",
                headers: { "Cache-Control": "no-cache" }, body: "",
              }}
            />
          )}
          {headerState?.showOrgName && (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                paddingVertical: "10px",
                color: orgNameFontColor,
                fontSize: orgNameFontSize,
                fontWeight: labelFontWeight,
              }}
            >
              <Text>{ActiveBranch?.company?.name}</Text>
            </View>
          )}
          {headerState?.showOrgAddress && (
            <View
              style={{
                display: "flex",
                color: labelColor,
                flexDirection: "column",
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
              }}
            >
              {AddressTemplates?.orgAddressTemplate?.map((org: any, index: number) => (
                <Text key={`ADDR_${index}`}>{org}</Text>
              ))}
            </View>
          )}
        </View>
        <View
          style={[styles.fontStyle, {
            width: "40%",
            display: "flex",
            lineHeight: "1rem",
            textAlign: "right",
            flexDirection: "column",
            justifyContent: "center",
          }]}
        >
          {headerState?.showDocTitle && <Text style={{ fontSize: "18px", fontWeight: 500, marginBottom: "0.5pt", color: titleColor }}>{docTitleVal}</Text>}
          {headerState?.showNumberField && (
            <Text style={styles.labelStyle}>{headerState.numberField} : {docID}</Text>
          )}
          {/* <View style={{ display: "flex", flexDirection: "row" }}> */}
          {headerState?.showBalanceDue && (
            <Text style={[styles.labelStyle, { marginTop: "15pt" }]}>Balance Due</Text>
          )}

          {headerState?.showBalanceDue && (
            <Text style={{ fontWeight }}>{currencySymbol}{" "}{data?.balance_due}</Text>
          )}
          {/* </View> */}
        </View>
      </View>
      <View
        style={{
          zIndex: 10,
          paddingLeft,
          paddingRight,
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          marginTop: "2pt",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            gap: "2pt",
            width: "50%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {headerState?.hasBillTo && (
            <View style={[styles.fontStyle, { display: "flex", flexDirection: "column" }]}>
              <Text style={styles.labelStyle}>Bill To</Text>
              <Text style={{ color: custNameFontColor, fontSize: custNameFontSize }}>{data?.customer?.name}</Text>
              <Text>{data?.customer?.billing_address?.address}</Text>
              <Text>{data?.customer?.billing_address?.city}</Text>
              <Text>{data?.customer?.billing_address?.country}</Text>
            </View>
          )}
          {/* Shiping Info */}
          {headerState?.hasShipTo && (
            <View style={{ display: "flex", width: "100%", zIndex: 10 }}>
              {billingAddress && (
                <View style={[styles.fontStyle, { display: "flex", flexDirection: "column" }]}>
                  <Text style={[styles.labelStyle, { marginTop: "10pt" }]}>Ship To</Text>
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
          style={[styles.fontStyle, {
            width: "50%",
            display: "flex",
            lineHeight: "1rem",
            textAlign: "right",
            flexDirection: "column",
            justifyContent: "center",
          }]}
        >
          <View>
            {headerState?.showDateField && data?.created_at && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text> {headerState?.dateField || "Invoice Date"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{dateTrimmer(data?.created_at)}</Text>
                </View>
              </View>
            )}

            {headerState?.showReference && data?.ref_number && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text>{headerState?.reference || "Ref #"} :</Text>
                </View>

                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{data?.ref_number}</Text>
                </View>
              </View>
            )}

            {headerState?.showDueDate && data?.due_date && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text> {headerState?.due_date || "Due Date"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text >{dateTrimmer(data?.due_date)}</Text>
                </View>
              </View>
            )}

            {headerState?.showTerms && data?.payment_terms?.name && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text> {headerState?.terms || "Payment Terms"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{data?.payment_terms?.name}</Text>
                </View>
              </View>
            )}

            {data?.project_name && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text>Project Name :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{data?.project_name}</Text>
                </View>
              </View>
            )}

            {headerState?.showReasonField && data?.reason?.name && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text> {headerState?.reasonLabel || "Reason"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{data?.reason?.name}</Text>
                </View>
              </View>
            )}

            {headerState?.showAccountField && data?.account_name && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text>{headerState?.accountLabel || "Account"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{data?.account_name}</Text>
                </View>
              </View>
            )}

            {headerState?.showAdjTypeField && data?.mode_adjustment && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text> {headerState?.adjTypeLabel || "Adjustment Type"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text> {data?.mode_adjustment}</Text>
                </View>
              </View>
            )}

            {headerState?.showCreateUserField && data?.created_by && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text> {headerState?.createUserLabel || "Created By"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text> {data?.created_by?.name}</Text>
                </View>
              </View>
            )}

            {headerState?.showTransactionType && data?.transaction_type && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text>{headerState?.transactionType || "Transaction Type"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{data?.transaction_type}</Text>
                </View>
              </View>
            )}

            {headerState?.showAssociatedInvNo && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text>{"Invoice #"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{data?.invoice?.name}</Text>
                </View>
              </View>
            )}

            {headerState?.showAssociatedInvDate && (
              <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <View style={[styles.labelStyle, { width: "50%" }]}>
                  <Text>{"Invoice Date"} :</Text>
                </View>
                <View style={[styles.fontStyle, { width: "50%" }]}>
                  <Text>{dateTrimmer(data?.invoice?.date)}</Text>
                </View>
              </View>
            )}
          </View>

          {headerState?.accountSummary?.showAccountSummary && <AccountSummaryPrintPreview data={data} template={template} />}
        </View>
      </View>
      {headerState?.recieptInfo?.showReceiptTable && <ReceiptTablePrintPreview data={data} template={template} currencySymbol={currencySymbol} />}
    </View>
  );
};

export default HeaderPreview;

const AccountSummaryPrintPreview = ({ data, template }: DownloadPreviewProps) => {
  const headerState = template?.headerState;

  /// label font size and color
  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || "normal";

  const styles = StyleSheet.create({
    labelStyle: { color: labelColor, fontSize: labelFontSize, fontWeight: labelFontWeight },
    summaryRowStyle: { width: "100%", display: "flex", flexDirection: "row" },
    summaryRowLeftStyle: {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      paddingHorizontal: "5px",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    }
  })

  return (
    <View>
      <View style={{ borderTop: "1px solid #E5E7E8", borderBottom: "1px solid #E5E7E8", paddingVertical: "3px" }}>
        <Text>
          {data?.customDate
            ? `From ${data?.customDate?.split("&")[0]?.split("=")[1]}`
            : `From ${data?.date?.split("&")[0]?.split("=")[1] ?? " 2020-01-01"}`}{" "}
          |{" "}
          {data?.customDate
            ? `To ${data?.customDate?.split("&")[1]?.split("=")[1]}`
            : `To ${data?.date?.split("&")[1]?.split("=")[1] ?? "2030-12-31"}`}
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          marginVertical: "2px",
          paddingVertical: "5px",
          flexDirection: "column",
          paddingHorizontal: "5px",
          alignItems: "flex-start",
          alignContent: "flex-start",
          backgroundColor: "#E5E7EB",
          justifyContent: "flex-start",
        }}
      >
        <Text>{headerState?.accountSummary?.accountSummaryLabel || "Account Summary"}</Text>
      </View>
      {headerState?.accountSummary?.showOpeningBalance && (
        <View style={[styles.labelStyle, styles.summaryRowStyle, { paddingBottom: "5px" }]}>
          <View style={styles.summaryRowLeftStyle}>
            <Text>{headerState?.accountSummary?.openingBalanceLabel || "Opening Balance"} </Text>
          </View>
          <View style={{ width: "50%", paddingHorizontal: "5px" }}>
            <Text> {(data && data?.statementData?.[0] && data?.statementData?.[0]?.opening_balance) ?? "0.00"}</Text>
          </View>
        </View>
      )}
      {headerState?.accountSummary?.showInvoicedAmount && (
        <View style={[styles.labelStyle, styles.summaryRowStyle, { paddingBottom: "5px" }]}>
          <View style={styles.summaryRowLeftStyle}>
            <Text>{headerState?.accountSummary?.invoicedAmountLabel || "Invoiced Amount"} </Text>
          </View>
          <View style={{ width: "50%", paddingHorizontal: "5px" }}>
            <Text>
              {data && data?.statementData?.[1] && (data?.statementData?.[1]?.invoice_amount ?? data?.statementData?.[1]?.billed_amount ?? "0.00")}
            </Text>
          </View>
        </View>
      )}
      {headerState?.accountSummary?.showAmountPaid && (
        <View style={[styles.labelStyle, styles.summaryRowStyle, { paddingBottom: "5px" }]}>
          <View style={styles.summaryRowLeftStyle}>
            <Text>{headerState?.accountSummary?.amountPaidLabel || "Amount Paid"}</Text>
          </View>
          <View style={{ width: "50%", paddingHorizontal: "5px" }}>
            <Text>{data && data?.statementData?.[2] && (data?.statementData?.[2]?.payment_received ?? "0.00")}</Text>
          </View>
        </View>
      )}
      {headerState?.accountSummary?.showBalanceDue && (
        <View
          style={[styles.labelStyle, styles.summaryRowStyle, {
            paddingVertical: "5px",
            borderTop: "1px solid #E5E7E8",
          }]}
        >
          <View style={styles.summaryRowLeftStyle}>
            <Text>{headerState?.accountSummary?.balanceDueLabel || "Balance Due"}</Text>
          </View>
          <View style={{ width: "50%", paddingHorizontal: "5px" }}>
            <Text>{(data && data?.statementData?.[4] && data?.statementData?.[4]?.balance_due) || "0.00"}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const ReceiptTablePrintPreview = ({ data, template, currencySymbol }: DownloadPreviewProps) => {
  const headerState = template?.headerState;

  /// Padings
  const paddingLeft = template?.propertiesState?.margins?.left;
  const paddingRight = template?.propertiesState?.margins?.right;
  return (
    <View style={{ width: "100%", paddingLeft, paddingRight, fontSize: 12 }}>
      <View style={{ marginVertical: "10px", paddingVertical: "10px", display: "flex", flexDirection: "row", borderTop: "1px solid #E5E7E8" }}>
        <View style={{ flex: "3", display: "flex", flexDirection: "column", marginRight: "10px" }}>
          {headerState?.recieptInfo?.showReceiptNumber && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ flex: "1", color: "#78869A", paddingVertical: "5px" }}>
                <Text>{headerState?.recieptInfo?.receiptNumberLabel || "Payment #"}</Text>
              </View>
              <View style={{ flex: "1", borderBottom: "1px solid #E5E7E8", paddingVertical: "5px" }}>
                <Text>{data?.voucher_number}</Text>
              </View>
            </View>
          )}

          {headerState?.recieptInfo?.showReceiptDate && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ flex: "1", color: "#78869A", paddingVertical: "5px" }}>
                <Text>{headerState?.recieptInfo?.receiptDateLabel || "Payment Date"}</Text>
              </View>
              <View style={{ flex: "1", borderBottom: "1px solid #E5E7E8", paddingVertical: "5px" }}>
                <Text>{data?.created_at && dateTrimmer(data?.created_at)}</Text>
              </View>
            </View>
          )}

          {headerState?.recieptInfo?.showReceiptReference && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ flex: "1", color: "#78869A", paddingVertical: "5px" }}>
                <Text>{headerState?.recieptInfo?.receiptReferenceLabel || "Reference Number"}</Text>
              </View>
              <View style={{ flex: "1", borderBottom: "1px solid #E5E7E8", paddingVertical: "5px" }}>
                <Text>{data?.reference_number}</Text>
              </View>
            </View>
          )}

          {headerState?.recieptInfo?.showReceiptMode && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ flex: "1", color: "#78869A", paddingVertical: "5px" }}>
                <Text>{headerState?.recieptInfo?.receiptModeLabel || "Payment Mode"}</Text>
              </View>
              <View style={{ flex: "1", borderBottom: "1px solid #E5E7E8", paddingVertical: "5px" }}>
                <Text>{data?.payment_mode?.name}</Text>
              </View>
            </View>
          )}

          {headerState?.recieptInfo?.showReceiptAmount && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ flex: "1", color: "#78869A", paddingVertical: "5px" }}>
                <Text>{headerState?.recieptInfo?.receiptAmountLabel || "Amount In Rupees"}</Text>
              </View>
              <View style={{ flex: "1", borderBottom: "1px solid #E5E7E8", paddingVertical: "5px" }}>
                <Text>{data?.total_amount}</Text>
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            flex: "1",
            gap: "5px",
            display: "flex",
            flexDirection: "column",
            paddingVertical: "10px",
            color: headerState?.recieptInfo?.amtReceivedFontColor,
            backgroundColor: headerState?.recieptInfo?.amtReceivedBgColor,
            fontSize: headerState?.recieptInfo?.amtReceivedFontSize,
            paddingHorizontal: "5px",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <View>
            <Text> {headerState?.recieptInfo?.amtReceivedLabel}</Text>
          </View>
          <View>
            <Text>
              {currencySymbol} {data?.total_amount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
