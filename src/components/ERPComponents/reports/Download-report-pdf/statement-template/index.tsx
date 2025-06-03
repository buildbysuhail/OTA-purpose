import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";
import FontRegistration from "../../../../../pages/LabelDesigner/fontRegister";
import { ReportRenderProps } from "../report-interface";
import { HeaderTemp } from "./HeaderTem";
import { template } from "lodash";
import Table from "./Table";
// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 30,
    fontFamily: "Roboto",
  },
  contentWrapper: {
    flex: 1, // This will make it take all available space
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  tableContainer: {
    flexGrow: 1,
  },
  footerWrapper: {
    // This wrapper ensures the footer is at the bottom
    marginTop:10,
    marginBottom:20 // Push to the bottom of the container
  },
  footer: {
    borderTop: "1px solid #ccc",
    paddingTop: 5,
    marginVertical: 5,
    fontSize: 8,
    textAlign: "center",
    color: "#444",
  },
  companyDetails: {
    fontSize: 7,
    color: "#666",
    marginTop: 3,
    textAlign: "center",
  },
  pageInfo: {
    marginBottom:5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#444",
  },
})

const StatementTemplate = ({ data, orientation, currentBranch, userSession, getFormattedValue }: ReportRenderProps) => {
  // Sample data is already defined in your original file

  return (
    <Document>
      <FontRegistration />
      <Page size={"A4"} orientation={orientation === "landscape" ? "landscape" : "portrait"} wrap style={styles.page}>
        {/* Main Container */}
        <View style={styles.contentWrapper}>
          {/* Header */}
          <HeaderTemp data={data} currentBranch={currentBranch} userSession={userSession} />

          {/* Table (Grows to fill available space) */}
          <View style={styles.tableContainer}>
            <Table data={data.data} getFormattedValue={getFormattedValue} />
          </View>
        </View>

             {/* Footer Wrapper - pushed to bottom with marginTop: auto */}
             <View style={styles.footerWrapper} fixed>
            {/* Footer */}
            <View style={styles.footer}>
              <Text>{userSession.headerFooter?.heading7 || "Sama United Trading Company"}</Text>
              <Text style={styles.companyDetails}>
                {userSession.headerFooter?.heading8 || "VAT No : 310434406200003"}
              </Text>
              <Text style={styles.companyDetails}>{userSession.headerFooter?.heading10 || ""}</Text>
            </View>

            {/* Page Number */}
            <View style={styles.pageInfo}>
              <Text>01/03/2025 09:52 AM</Text>
              <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            </View>
          </View>
      </Page>
    </Document>
  )
}

export default StatementTemplate
