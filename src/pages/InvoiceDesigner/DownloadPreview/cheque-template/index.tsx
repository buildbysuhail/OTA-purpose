import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import FontRegistration from "../../../LabelDesigner/fontRegister"

import type { AccountTransactionProps } from "../account_transactiocn-premium"
import { getAmountInWords } from "../../../../utilities/Utils"

// Modified AccountTransactionProps interface to include singleItemPerPage option
interface ExtendedAccountTransactionProps extends AccountTransactionProps {
  singleItemPerPage?: boolean
}

// Modified to handle an array of data items with dynamic page layout
const ChequeTemplate = ({
  data,
  template,
  currentBranch,
  userSession,
  currency,
  singleItemPerPage = false, // Default to one cheque per page
}: ExtendedAccountTransactionProps) => {
  // Convert data to array if it's not already an array
  const chequeDetails = Array.isArray(data) ? data : [data]

  const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait"

  // FIXED: Increased the height of each cheque to ensure proper spacing
  const CHEQUE_HEIGHT = 220 // Height in points (increased from 200)

  // FIXED: Added margin between cheques
  const CHEQUE_MARGIN = 10 // Margin between cheques in points

  // Calculate total height needed for each cheque including margin
  const TOTAL_CHEQUE_HEIGHT = CHEQUE_HEIGHT + CHEQUE_MARGIN

  // Calculate page dimensions based on orientation
  const PAGE_HEIGHT = pageOrientation === "landscape" ? 595 : 842 // A4 dimensions in points
  const CONTENT_HEIGHT =
    PAGE_HEIGHT - (template?.propertiesState?.padding?.top || 10) - (template?.propertiesState?.padding?.bottom || 10)

  // FIXED: Calculate how many cheques can fit on a page, accounting for margins
  const chequesPerPage = Math.floor(CONTENT_HEIGHT / TOTAL_CHEQUE_HEIGHT)

  // FIXED: Limit to a maximum of 3 cheques per page for better readability
  const MAX_CHEQUES_PER_PAGE = 3
  const actualChequesPerPage = Math.min(chequesPerPage, MAX_CHEQUES_PER_PAGE)

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#F5F5F5",
      paddingLeft: template?.propertiesState?.padding?.left || 10,
      paddingTop: template?.propertiesState?.padding?.top || 10,
      paddingBottom: template?.propertiesState?.padding?.bottom || 10,
      paddingRight: template?.propertiesState?.padding?.right || 10,
      fontFamily: template?.propertiesState?.font_family || "Roboto",
    },
    checkContainer: {
      width: "100%",
      height: CHEQUE_HEIGHT,
      backgroundColor: template?.propertiesState?.bg_color || "white",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 4,
      padding: 20,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      marginBottom: CHEQUE_MARGIN, // FIXED: Added proper margin between cheques
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    bankName: {
      fontSize: 12,
      fontWeight: 600,
      flexDirection: "row",
      alignItems: "center",
    },
    dateGrid: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      width: 80,
    },
    dateCell: {
      width: 10,
      height: 15,
      borderRightWidth: 1,
      borderRightColor: "#E0E0E0",
      textAlign: "center",
      fontSize: 6,
      paddingTop: 2,
    },
    dateCellLast: {
      width: 10,
      height: 15,
      textAlign: "center",
      fontSize: 6,
      paddingTop: 2,
    },
    dateLabelRow: {
      flexDirection: "row",
      width: 80,
    },
    dateLabel: {
      width: 10,
      fontSize: 5,
      textAlign: "center",
    },
    paySection: {
      marginVertical: 10,
    },
    payLabel: {
      fontSize: 8,
    },
    payLine: {
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    orBearer: {
      fontSize: 6,
      textAlign: "right",
    },
    sumSection: {
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      alignItems: "center",
    },
    sumLabel: {
      fontSize: 8,
    },
    sumLine: {
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
      paddingBottom: 2,
      marginBottom: 2,
      flexDirection: "row",
      gap: 10,
    },
    sumLine2: {
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
      paddingBottom: 2,
      marginTop: 20,
    },
    signatureSection: {
      alignItems: "flex-end",
      marginBottom: 10,
    },
    signatureText: {
      fontSize: 6,
    },
    // FIXED: Added a page divider style
    pageDivider: {
      borderTopWidth: 1,
      borderTopStyle: "dashed",
      borderTopColor: "#999",
      marginVertical: 15,
    },
  })

  // Render a single cheque
  const renderCheque = (chequeDetail: any, index: any) => {
    // Parse the bankDate for each cheque detail
    const bankDate = new Date(chequeDetail.bankDate)
    const day = String(bankDate.getDate()).padStart(2, "0")
    const month = String(bankDate.getMonth() + 1).padStart(2, "0")
    const year = String(bankDate.getFullYear())

    // Split the date into individual characters for rendering
    const dateParts = [day[0], day[1], month[0], month[1], year[0], year[1], year[2], year[3]]

    return (
      <View key={index} style={styles.checkContainer}>
        {/* Header with Bank Name and Date */}
        <View style={styles.header}>
          <View style={styles.bankName}>
            <Text>{chequeDetail.bankName || "Bank Name"}</Text>
          </View>
          <View>
            <View style={styles.dateGrid}>
              {dateParts.map((part, idx) => (
                <View key={idx} style={styles.dateCell}>
                  <Text>{part}</Text>
                </View>
              ))}
            </View>
            <View style={styles.dateLabelRow}>
              <Text style={styles.dateLabel}>D</Text>
              <Text style={styles.dateLabel}>D</Text>
              <Text style={styles.dateLabel}>M</Text>
              <Text style={styles.dateLabel}>M</Text>
              <Text style={styles.dateLabel}>Y</Text>
              <Text style={styles.dateLabel}>Y</Text>
              <Text style={styles.dateLabel}>Y</Text>
              <Text style={styles.dateLabel}>Y</Text>
            </View>
          </View>
        </View>

        {/* Pay Section */}
        <View style={styles.payLine}>
          <Text style={styles.payLabel}>PAY</Text>
          <Text style={styles.payLabel}>OR BEARER</Text>
        </View>

        {/* Sum Section */}
        <View style={styles.sumSection}>
          <View style={{ width: "70%" }}>
            <View style={styles.sumLine}>
              <Text style={styles.sumLabel}>SUM OF</Text>
              <Text style={styles.sumLabel}>{getAmountInWords(Number(chequeDetail.amount), currency)}</Text>
            </View>
            <View style={styles.sumLine2}></View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              border: "2px solid rgb(38, 37, 37)",
              borderRadius: 5,
              width: "30%",
              height: 30,
              alignSelf: "flex-end",
            }}
          >
            <View style={{ width: "30%", backgroundColor: "rgb(38, 37, 37)" }}>
              <Text
                style={{
                  color: "rgb(251, 250, 250)",
                  fontSize: 12,
                  fontStyle: "italic",
                  fontFamily: "RobotoMono",
                  textAlign: "center",
                  padding: 2,
                }}
              >
                Rs:
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "rgb(246, 245, 245)" }}>
              <Text
                style={{
                  color: "rgb(61, 60, 60)",
                  fontSize: 12,
                  fontStyle: "italic",
                  fontFamily: "RobotoMono",
                  textAlign: "center",
                  padding: 2,
                }}
              >
                {chequeDetail.amount}
              </Text>
            </View>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={{ width: 100, alignItems: "center" }}>
            <View style={{ ...styles.sumLine2, width: 80, marginVertical: 10 }} />
            <Text style={styles.signatureText}>Please Sign Above</Text>
          </View>
        </View>
      </View>
    )
  }

  // If singleItemPerPage is false, render one cheque per page
  if (!singleItemPerPage) {
    return (
      <Document>
        <FontRegistration />
        {chequeDetails.map((chequeDetail, index) => (
          <Page key={index} size="A4" orientation={pageOrientation} style={styles.page}>
            {renderCheque(chequeDetail, index)}
          </Page>
        ))}
      </Document>
    )
  }

  // Otherwise (if singleItemPerPage is true), fit multiple cheques per page
  // FIXED: Improved grouping logic to ensure proper page breaks
  const pages: any = []

  // Group cheques into pages with a maximum of actualChequesPerPage per page
  for (let i = 0; i < chequeDetails.length; i += actualChequesPerPage) {
    const pageItems = chequeDetails.slice(i, i + actualChequesPerPage)
    pages.push(pageItems)
  }

  return (
    <Document>
      <FontRegistration />
      {pages.map((pageItems: any, pageIndex: any) => (
        <Page key={pageIndex} size="A4" orientation={pageOrientation} style={styles.page}>
          {pageItems.map((chequeDetail: any, itemIndex: any) =>
            renderCheque(chequeDetail, `${pageIndex}-${itemIndex}`),
          )}
        </Page>
      ))}
    </Document>
  )
}

export default ChequeTemplate

