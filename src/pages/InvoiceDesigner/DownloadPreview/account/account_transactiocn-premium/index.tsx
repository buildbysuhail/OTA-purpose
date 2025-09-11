import { Document, Page, View, Image } from "@react-pdf/renderer"

// import Table from "./Table"
import Footer from "./Footer"
import type { TemplateState } from "../../../Designer/interfaces"
import FontRegistration from "../../../../LabelDesigner/fontRegister"
// import { Header } from "./Header"
// import { Content } from "./Content"
import { getPageDimensions, getPageSizeForPDF } from "../../../utils/pdf-util"

export interface AccountTransactionProps {
  data?: any
  template?: TemplateState<unknown>
  
}

const AccountTransactionsTemplate = ({ data, template }: AccountTransactionProps) => {
  const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait"
  const paddingLeft = template?.propertiesState?.padding?.left || 10
  const paddingRight = template?.propertiesState?.padding?.right || 10
  const paddingTop = template?.propertiesState?.padding?.top || 10
  const paddingBottom = template?.propertiesState?.padding?.bottom || 10
   const pageSize = template?.propertiesState?.pageSize ?? "A4"
   const selectedPageSize = getPageDimensions(
            pageSize,
            template?.propertiesState?.width,
            template?.propertiesState?.height,
          )
    const pdfPageSize = getPageSizeForPDF(pageSize, selectedPageSize)
  return (
    <Document>
      <FontRegistration />
      <Page size={pdfPageSize} orientation={pageOrientation}>
        {/* Header */}
        {/* {template?.headerState?.showHeader && (
        // <Header data={data} template={template}/>
        )} */}
        
        {/* Main Content Container */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: template?.propertiesState?.bg_color || "#fff",
            padding: paddingTop, paddingRight, paddingBottom ,paddingLeft,
            flexGrow: 1,
            position:"relative",
            zIndex:10
          }}
        >
          {/* Background Image */}
          {template?.background_image && (
            <Image
              src={template.background_image || "/placeholder.svg"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -10,
                objectPosition: template?.propertiesState?.bg_image_position ?? "center",
              }}
            />
          )}

          {/* Content Section */}
          {/* <Content data={data} template={template} /> */}

          {/* Table Section - Allow to break across pages */}
          {/* <Table data={data} template={template} /> */}
        </View>

        {/* Footer */}
        {/* <Footer data={data} template={template} /> */}
      </Page>
    </Document>
  )
}

export default AccountTransactionsTemplate
