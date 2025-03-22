import { View, Text, Image, StyleSheet } from "@react-pdf/renderer"
import type { TemplateState } from "../../Designer/interfaces"

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    position: "relative",
  },
  companyInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    zIndex: 10,
  },
  orgName: {
    textTransform: "capitalize",
    fontWeight: "semibold",
  },
  orgAddress: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  otherInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "flex-start",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -10,
  },
})

export const Header = ({
  data,
  template,
  currentBranch,
  docIDKey,
  currency,
}: { data: any; template?: TemplateState; currentBranch: any; docIDKey?: string; currency?: string }) => {
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5
  const headerState = template?.headerState
  const paddingLeft = template?.propertiesState?.padding?.left
  const paddingRight = template?.propertiesState?.padding?.right
  const paddingTop = template?.propertiesState?.padding?.top || 10

  const fontFamily = template?.propertiesState?.font_family || "Roboto"
  const fontSize = template?.propertiesState?.font_size || 12
  const color = template?.propertiesState?.font_color || "#000"
  const fontWeight = template?.propertiesState?.font_weight || 400
  const fontStyle = template?.propertiesState?.fontStyle || "normal"

  const orgNameFontColor = headerState?.OrganizationFontColor || "#000"
  const orgNameFontSize = headerState?.OrganizationFontSize || 12

  const fontStyles = {
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
  }
  const labelStyles = {
    color: template?.propertiesState?.label_font_color || "#000",
    fontSize: template?.propertiesState?.label_font_size || 12,
    fontWeight: template?.propertiesState?.label_font_weight || 400,
    fontStyle: template?.propertiesState?.label_font_style || "normal",
    fontFamily,
  }

  const isValidLogo = (logo: any): boolean => {
    if (!logo) return false
    if (typeof logo !== "string") return false
    if (logo.trim() === "") return false
    return true
  }

  return (
    <View
      style={{
        ...styles.headerContainer,
        height: headerState?.headerHeight ? `${headerState?.headerHeight}pt` : "auto",
        backgroundColor: template?.headerState?.bgColor || "#fff",
        marginBottom: 10,
        padding: `${paddingTop}pt ${paddingRight}pt 0 ${paddingLeft}pt`,
      }}
      fixed={!headerState?.isFirstOnly}
    >
      {/* Background Image */}
      {template?.background_image_header && (
        <Image
          src={template?.background_image_header || "/placeholder.svg"}
          style={[styles.bgImage, { objectPosition: headerState?.bg_image_header_position || "center" }]}
        />
      )}

      {/* Company Info */}
      <View style={[styles.companyInfo, { marginVertical: 4 }]}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            paddingLeft: 8,
          }}
        >
          {headerState?.showLogo && isValidLogo(currentBranch?.logo) && (
            <Image src={currentBranch.logo || "/placeholder.svg"} style={{ width: 80 * logoWidthRatio }} />
          )}
          {headerState?.showOrgName && (
            <Text
              style={{
                color: orgNameFontColor,
                fontSize: orgNameFontSize,
                fontWeight: "semibold",
                fontFamily: fontFamily,
                textAlign: "center",
              }}
            >
              {currentBranch?.name}
            </Text>
          )}
        </View>

        <View style={styles.orgAddress}>
          {headerState?.showOrgAddress &&
            currentBranch.address?.map((org: any, idx: number) => (
              <Text key={`ADDK_${idx}`} style={fontStyles}>
                {org}
              </Text>
            ))}
          {headerState?.hasPhoneField && (
            <View style={styles.otherInfo}>
              <Text style={labelStyles}>{headerState?.phoneLabel || "Phone No"}:</Text>
              <Text style={fontStyles}>{currentBranch?.phone || "1234567891"}</Text>
            </View>
          )}
          {headerState?.hasfaxField && (
            <View style={styles.otherInfo}>
              <Text style={labelStyles}>{headerState?.faxLabel || "Fax No"}:</Text>
              <Text style={fontStyles}>{currentBranch?.fax || "##12344543"}</Text>
            </View>
          )}
          {headerState?.hasEmailField && (
            <View style={styles.otherInfo}>
              <Text style={labelStyles}>{headerState?.emailLabel || "Email"}:</Text>
              <Text style={fontStyles}>{currentBranch?.email || "accounts@companyName.com"}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

