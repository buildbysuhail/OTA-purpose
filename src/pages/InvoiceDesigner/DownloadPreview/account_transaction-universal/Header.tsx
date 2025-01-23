import { View, Text, Image,StyleSheet } from "@react-pdf/renderer";
import { dateTrimmer, getAmountInWords } from "../../../../utilities/Utils";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import { TemplateState } from "../../Designer/interfaces";

const styles = StyleSheet.create({

  companyInfo: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginVertical:10,
    zIndex: 10,
  },
  otherInfo:{
    display:"flex",
    flexDirection:"row",
    gap:2,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -10,
  },
});

export  const Header = ({ data, template, currentBranch,userSession}: { data: any; template?: TemplateState; currentBranch: any, userSession?: any;currency?: string;}) => {
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
    fontStyle:  template?.propertiesState?.label_font_style || "normal",
    fontFamily,
    
  };

  return (
    <View style={{
      width:"100%",height:headerState?.headerHeight?`${headerState?.headerHeight}pt`:"auto",
      backgroundColor: template?.headerState?.bgColor || "#fff",
      position: 'relative',
      // borderBottom:"1px solid rgb(104, 101, 101)",
      zIndex:10
      }}>
  {/* Background Image */}
    {template?.background_image_header && (
        <Image
          src={template?.background_image_header}
          style={[
            styles.bgImage,
            { objectPosition: headerState?.bg_image_header_position || 'center' } // Control image position
          ]}
        />
      )}
      {/* Company Info */}
      <View style={styles.companyInfo}>
        <View style={{ display: "flex", flexDirection: "column",flexBasis:"40%",justifyContent:"flex-start", 
          alignItems:"flex-start",paddingLeft:5,}}>
        
          {headerState?.showOrgName && (
            
            <Text style={{ color: orgNameFontColor, fontSize: orgNameFontSize, fontWeight: "semibold",fontFamily:fontFamily,}}>
            {userSession.headerFooter?.heading7}
            </Text>
           )}
             {headerState?.showOrgAddress && (
              <View >
                <Text style={fontStyles}>{userSession.headerFooter.heading9}</Text>
                <Text style={fontStyles}>VAT-2354335445454534</Text>
              </View>
            )}
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
        </View>

        <View style={{ flexBasis: "20%", display: "flex",justifyContent:"flex-start", alignItems:"center"}}>
            {headerState?.showLogo && (
            <Image
              src={currentBranch?.logo}
              style={{ width: 80 * logoWidthRatio}}
            />
          )}
        </View>

        <View style={{ display: "flex", flexDirection: "column",flexBasis:"40%",
         justifyContent:"flex-start", alignItems:"flex-end",paddingRight:5,}}>
        
          {headerState?.showOrgName && ( 
            <Text style={{ color: orgNameFontColor, fontSize: orgNameFontSize, fontWeight: "semibold",fontFamily: 'Amiri'}}>
            {userSession.headerFooter.heading8}
            </Text>
           )}
             {headerState?.showOrgAddress && (
              <View >
                <Text style={arabicFontStyles}>{userSession.headerFooter.heading8}</Text>
                <Text style={arabicFontStyles}>ض.ق.م-٢٣٥٤٣٣٥٤٤٥٤٥٤٥٣٤ </Text>
              </View>
            )}
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
        </View>
        
      </View>
    </View>
  );
};







