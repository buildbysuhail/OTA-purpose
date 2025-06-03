


import { View, Text, Image, StyleSheet } from "@react-pdf/renderer"
import moment from "moment";

const styles = StyleSheet.create({
  companyInfo: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 5,
    borderBottom: "1px solid #ccc",
    paddingBottom: 10,
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  companyLogo: {
    width: 80,
    height: 50,
    objectFit: "contain",
  },
  companyTitle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  arabicTitle: {
    color: "#0066a1",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "Amiri",
    fontStyle: "normal",
    marginBottom: 2,
  },
  englishTitle: {
    color: "#0066a1",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "Roboto",
    fontStyle: "normal",
  },
  infoSection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
  },
  leftColumn: {
    flexBasis: "20%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  centerColumn: {
    flexBasis: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rightColumn: {
    flexBasis: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  statementTitle: {
    color: "#000",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Roboto",
    fontStyle: "normal",
    textAlign: "center",
    textDecoration: "underline",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 6,
    marginBottom: 3,
  },
  infoLabel: {
    color: "#000",
    fontSize: 9,
    fontWeight: 700,
    fontFamily: "Roboto",
    fontStyle: "normal",
  },
  infoValue: {
    color: "#000",
    fontSize: 9,
    fontWeight: 400,
    fontFamily: "Roboto",
    fontStyle: "normal",
  },
  ledgerValue: {
    color: "#000",
    fontSize: 9,
    fontWeight: 400,
    fontFamily: "Roboto",
    fontStyle: "normal",
  },
})

export const HeaderTemp = ({
  data,
  currentBranch,
  userSession,
}: { data: any; currentBranch: any; userSession: any }) => {
  const isValidLogo = (logo: any): boolean => {
    if (!logo) return false
    if (typeof logo !== "string") return false
    if (logo.trim() === "") return false
    return true
  }

  return (
    <View style={styles.companyInfo} fixed>
      {/* Company Logo and Title */}
      <View style={styles.headerRow}>
        {isValidLogo(currentBranch?.logo) && (
          <Image src={currentBranch.logo || "/placeholder.svg"} style={styles.companyLogo} />
        )}

        <View style={styles.companyTitle}>
          <Text style={styles.arabicTitle}>{currentBranch.nameInSecondLanguage ||""}</Text>
          <Text style={styles.englishTitle}>{userSession.headerFooter?.heading7 ||""}</Text>
        </View>
      </View>

      {/* Statement Info Section */}
      <View style={styles.infoSection}>
        {/* Left Column - "To" */}
        <View style={styles.leftColumn}>
          <Text style={styles.infoLabel}>To</Text>
        </View>

        {/* Center Column - Statement Title */}
        <View style={styles.centerColumn}>
          <Text style={styles.statementTitle}>Statement of Account</Text>
        </View>

        {/* Right Column - Date and Ledger Info */}
        <View style={styles.rightColumn}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>From</Text>
            <Text style={styles.infoValue}>{moment(data.filter.dateFrom).format("DD/MM/YYYY")}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>To</Text>
            <Text style={styles.infoValue}>{moment(data.filter.dateTo).format("DD/MM/YYYY")}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ledger</Text>
            <Text style={styles.ledgerValue}>{data.filter.ledgerName} </Text>
          </View>
        </View>
      </View>
    </View>
  )
}






