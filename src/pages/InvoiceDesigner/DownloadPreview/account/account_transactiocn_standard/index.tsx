import { Document, Page, View, Text, StyleSheet,PDFViewer,Image  } from "@react-pdf/renderer";
import { TemplateState } from "../../../Designer/interfaces";
import FontRegistration from "../../../../LabelDesigner/fontRegister";
import { Header } from "./Header";
import { Content } from "./Content";
import { AccountTransactionProps } from "../account_transactiocn-premium";
import { getPageDimensions, getPageSizeForPDF } from "../../../utils/pdf-util";
import { AccTransactionRow } from "../../../../accounts/transactions/acc-transaction-types";

const AccountTransactionsVoucher = ({ data, template, currentBranch,userSession }: AccountTransactionProps) => {

// Paddings
const paddingLeft = template?.propertiesState?.padding?.left || 10;
const paddingRight = template?.propertiesState?.padding?.right || 10;
const paddingTop = template?.propertiesState?.padding?.top || 10;
const paddingBottom = template?.propertiesState?.padding?.bottom || 10
const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";
  // Get the page size for the PDF
    const pageSize = template?.propertiesState?.pageSize ?? "A4"

      // Get the actual page dimensions based on the selected page size
      const selectedPageSize = getPageDimensions(
        pageSize,
        template?.propertiesState?.width,
        template?.propertiesState?.height,
      )
    const pdfPageSize = getPageSizeForPDF(pageSize, selectedPageSize)

   const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#F5F5F5",
      paddingLeft: template?.propertiesState?.padding?.left || 10,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
      paddingRight: template?.propertiesState?.padding?.right || 10,
      fontFamily: template?.propertiesState?.font_family || "Roboto",
    },
   })

const renderPage = (detail: any, index: any) => {
  return (
    <View style={{ 
      width: '100%', 
      height: '100%',
      padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`,
    }}>
      {/* Main Content */}
      <View style={{
        flex: 1,
        flexDirection: 'column',
        border: "1.5px solid rgb(104, 101, 101)"
      }}>
        {/* Header */}
        <Header data={detail} template={template} currentBranch={currentBranch} />
        {/* Content */}
        <Content data={detail} template={template} currentBranch={currentBranch}  indexNO={index}/>
      </View>
    </View>
  );
};
    return (
      <Document>
        <FontRegistration /> 
        { data?.details.map((item: AccTransactionRow, index: number) => (
          <Page key={index} size={pdfPageSize} orientation={pageOrientation} style={styles.page}>
            {renderPage(data, index)}
          </Page>
        ))}
      </Document>
    )
  
};
export default AccountTransactionsVoucher;
