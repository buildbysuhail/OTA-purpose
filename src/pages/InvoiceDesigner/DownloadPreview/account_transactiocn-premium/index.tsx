import { Document, Page, View, Image } from "@react-pdf/renderer"

import Table from "./Table"
import Footer from "./Footer"
import type { TemplateState } from "../../Designer/interfaces"
import FontRegistration from "../../../LabelDesigner/fontRegister"
import { Header } from "./Header"
import { Content } from "./Content"

export interface AccountTransactionProps {
  data: any
  template?: TemplateState
  currentBranch?: any
  userSession?: any
  currency?: any
}

const AccountTransactionsTemplate = ({ data, template, currentBranch, userSession }: AccountTransactionProps) => {
  const paperSize = template?.propertiesState?.pageSize || "A4"
  const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait"

  // Paddings
  const paddingLeft = template?.propertiesState?.padding?.left || 10
  const paddingRight = template?.propertiesState?.padding?.right || 10
  const paddingTop = template?.propertiesState?.padding?.top || 10
  const paddingBottom = template?.propertiesState?.padding?.bottom || 10

  return (
    <Document>
      <FontRegistration />
      <Page size={"A4"} orientation={pageOrientation}>
        {/* Header */}
        <Header data={data} template={template} currentBranch={currentBranch} />

        {/* Main Content Container */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: template?.propertiesState?.bg_color || "#fff",
            padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`,
            flexGrow: 1,
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
                zIndex: -20,
                objectPosition: template?.propertiesState?.bg_image_position ?? "center",
              }}
            />
          )}

          {/* Content Section */}
          <Content data={data} template={template} currentBranch={currentBranch} />

          {/* Table Section - Allow to break across pages */}
          <Table data={data} template={template} />
        </View>

        {/* Footer */}
        <Footer data={data} template={template} />
      </Page>
    </Document>
  )
}

export default AccountTransactionsTemplate
