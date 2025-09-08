import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  companyInfo: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginVertical: 10,
  },

  otherInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },

  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -20,
  },
});

const Header = ({ data, template, currentBranch, userSession }: any) => {
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const headerState = template?.headerState;
  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";
  const orgNameFontColor = headerState?.OrganizationFontColor || "#000";
  const orgNameFontSize = headerState?.OrganizationFontSize || 12;

  const fontStyles = {
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
  };

  const arabicFontStyles = {
    ...fontStyles,
    fontFamily: 'Amiri',
  };

  const labelStyles = {
    color: template?.propertiesState?.label_font_color || "#000",
    fontSize: template?.propertiesState?.label_font_size || 12,
    fontWeight: template?.propertiesState?.label_font_weight || 400,
    fontStyle: template?.propertiesState?.label_font_style || "normal",
    fontFamily,
  };

  const isValidLogo = (logo: any): boolean => {
    if (!logo) return false;
    if (typeof logo !== 'string') return false;
    if (logo.trim() === '') return false;
    return true;
  };

  return (
    <div
      style={{
        width: "100%", height: headerState?.headerHeight ? `${headerState?.headerHeight}pt` : "auto",
        backgroundColor: template?.headerState?.bgColor || "#fff",
        position: 'relative',
        zIndex: 20
      }}
    >
      {/* Background Image */}
      {template?.background_image_header && (
        <img
          src={template?.background_image_header}
          alt="Header Background"
          className="absolute inset-0 w-full h-full -z-20"
          style={{
            ...styles.bgImage,
            objectPosition: headerState?.bg_image_header_position || 'center',
            objectFit: headerState?.bg_image_header_objectFit || 'fill'
          }}
        />
      )}

      {/* Company Info */}
      <div style={styles.companyInfo}>
        <div style={{ display: "flex", flexDirection: "column", flexBasis: "40%", justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: 5, }}>
          {headerState?.showOrgName && (
            <p style={{ color: orgNameFontColor, fontSize: orgNameFontSize, fontWeight: "semibold", fontFamily: fontFamily, }}>
              {userSession.headerFooter?.heading7}
            </p>
          )}

          {headerState?.showOrgAddress && (
            <div>
              <p style={fontStyles}>{userSession.headerFooter.heading9}</p>
              <p style={fontStyles}>VAT-2354335445454534</p>
            </div>
          )}

          {headerState?.hasPhoneField && (
            <div style={styles.otherInfo}>
              <span style={labelStyles}>{headerState?.phoneLabel || "Phone No"}:</span>
              <span style={fontStyles}>{currentBranch?.phone || "1234567891"}</span>
            </div>
          )}

          {headerState?.hasfaxField && (
            <div style={styles.otherInfo}>
              <span style={labelStyles}>{headerState?.faxLabel || "Fax No"}:</span>
              <span style={fontStyles}>{currentBranch?.fax || "##12344543"}</span>
            </div>
          )}
        </div>

        <div style={{ flexBasis: "20%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
          {headerState?.showLogo && isValidLogo(currentBranch?.logo) && (
            <img
              src={currentBranch?.logo}
              alt="Logo"
              style={{ width: 80 * logoWidthRatio }}
            />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", flexBasis: "40%", justifyContent: "flex-start", alignItems: "flex-end", paddingRight: 5, }}>
          {headerState?.showOrgName && (
            <p style={{ color: orgNameFontColor, fontSize: orgNameFontSize, fontWeight: "semibold", fontFamily: 'Amiri' }}>
              {userSession.headerFooter.heading8}
            </p>
          )}

          {headerState?.showOrgAddress && (
            <div>
              <p style={arabicFontStyles}>{userSession.headerFooter.heading8}</p>
              <p style={arabicFontStyles}>ض.ق.م-٢٣٥٤٣٣٥٤٤٥٤٥٤٥٣٤</p>
            </div>
          )}

          {headerState?.hasPhoneField && (
            <div style={styles.otherInfo}>
              <span style={labelStyles}>{headerState?.phoneLabel || "Phone No"}:</span>
              <span style={fontStyles}>{currentBranch?.phone || "1234567891"}</span>
            </div>
          )}

          {headerState?.hasfaxField && (
            <div style={styles.otherInfo}>
              <span style={labelStyles}>{headerState?.faxLabel || "Fax No"}:</span>
              <span style={fontStyles}>{currentBranch?.fax || "##12344543"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;