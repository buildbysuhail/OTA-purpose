import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";
import FontRegistration from "../../../../../LabelDesigner/fontRegister";
import { Header } from "./HeaderTem";
import { Content } from "./Content";
import { TemplateState } from "../../../../Designer/interfaces";
export interface ReportRenderProps {
  template?: TemplateState;
  data?: any;
  currentBranch?: any;
  userSession?:any;
  orientation:"portrait"|"landscape";
  printCase?:string
}


// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 30,
    fontFamily: "Roboto",
  },
  contentWrapper: {
    flex:1,
    display: "flex",
    flexDirection: "column",
    width: "100%",  
  },

})

const CustomerBalanceTemplate = ({ data, orientation, currentBranch, userSession,template }: ReportRenderProps) => {
  // Sample data is already defined in your original file

  return (
    <Document>
      <FontRegistration />
      <Page size={"A4"} orientation={orientation === "landscape" ? "landscape" : "portrait"} wrap style={styles.page}>
        {/* Main Container */}
        <View style={styles.contentWrapper}>
        <Header data={data} currentBranch={currentBranch} userSession={userSession}/>
        <View style={{ border: "1px solid black",padding: 10 }}>
        <Content data={data} currentBranch={currentBranch} userSession={userSession} />
        </View>
        </View>
      </Page>
    </Document>
  )
}

export default CustomerBalanceTemplate
