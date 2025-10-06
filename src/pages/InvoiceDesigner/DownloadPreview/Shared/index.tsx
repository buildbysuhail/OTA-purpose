import { Document, Page, View, Image } from "@react-pdf/renderer"

// import Table from "./Table"
import { TemplateState } from "../../Designer/interfaces"
import { getPageDimensions, getPageSizeForPDF } from "../../utils/pdf-util"
import FontRegistration from "../../../LabelDesigner/fontRegister"
import ShardDowHeader from "./Header"
import { AccountTransactionProps } from "../../DesignPreview/shared"
import ShardDownFooter from "./Footer"
import SharedDownTable from "./Table"


const SharedDownloadTemplate = ({ data, template,qrCodeImages={},AmountToEnglish,AmountToArabic}: AccountTransactionProps) => {
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
        <ShardDowHeader data={data} template={template} qrCodes={qrCodeImages}AmountToEnglish={AmountToEnglish}  AmountToArabic={AmountToArabic} /> 
        {/* Main Content Container */}
        <View
          style={{
            backgroundColor: template?.propertiesState?.bg_color || "#fff",
            padding: paddingTop, paddingRight, paddingBottom ,paddingLeft,
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
          <SharedDownTable data={data?.details??[]} template={template} />
        </View>

        {/* Footer */}
        <ShardDownFooter data={data} template={template} qrCodes={qrCodeImages} AmountToEnglish={AmountToEnglish}  AmountToArabic={AmountToArabic} />   
      </Page>
    </Document>
  )
}

export default SharedDownloadTemplate
