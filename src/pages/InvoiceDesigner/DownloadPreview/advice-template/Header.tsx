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
  orgName: {
    textTransform: "capitalize",
    fontWeight: "semibold",
  },
  orgAddress: {
    display: "flex",
    flexDirection: "column",
    justifyContent:"flex-start",
    alignItems:"flex-end",
    paddingRight:10,
    gap:2,
  },
  otherInfo:{
    display:"flex",
    flexDirection:"row",
    gap:2,
    justifyContent:"flex-end"
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -10,
  },
  docTitle:{
    fontSize: 18,
    fontWeight: "medium",
    border:"1px solid rgb(104, 101, 101)",
    paddingHorizontal:8,
    paddingVertical:4
  },
});

export  const Header = ({ data, template, currentBranch,}: { data: any; template?: TemplateState; currentBranch: any,}) => {
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
  const labelStyles = {
    color: template?.propertiesState?.label_font_color || "#000",
    fontSize: template?.propertiesState?.label_font_size || 12,
    fontWeight: template?.propertiesState?.label_font_weight || 400,
    fontStyle:  template?.propertiesState?.label_font_style || "normal",
    fontFamily,
  };

  const isValidLogo = (logo: any): boolean => {
    if (!logo) return false;
    if (typeof logo !== 'string') return false;
    if (logo.trim() === '') return false;
    // Add any other specific validation you need
    return true;
  };
  
  return (
    <View style={{
      width:"100%",
      height: headerState?.headerHeight ? `${headerState?.headerHeight}pt` : "auto",
      backgroundColor: template?.headerState?.bgColor || "#fff",
      borderTopWidth: headerState?.isFirstOnly ? 1.5 : 0,
      borderTopColor: headerState?.isFirstOnly ? "rgb(104, 101, 101)" : "transparent",
      borderTopStyle: headerState?.isFirstOnly ? "solid" : undefined,
      }}
      {...(headerState?.isFirstOnly ? {fixed:false} : {fixed: true})}>
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
        <View style={{ display: "flex", flexDirection: "column",flexBasis:"33.33%",
          justifyContent:"flex-start", alignItems:"flex-start",paddingLeft:10}}>
             {headerState?.showLogo && isValidLogo(currentBranch?.logo) && (
            <Image
              src={currentBranch.logo}
              style={{ width: 80 * logoWidthRatio }}
            />
             )}
          {headerState?.showOrgName && (
            <Text style={{ color: orgNameFontColor, fontSize: orgNameFontSize, fontWeight: "semibold",fontFamily:fontFamily,}}>
              {currentBranch?.name}
            </Text>
          )}

            {headerState?.showOrgAddress &&
            currentBranch.address?.map((org: any, idx: number) => (
              <Text key={`ADDK_${idx}`} style={fontStyles}>{org}</Text>
            ))
          }
        </View>
        <View style={{ flexBasis: "33.33%", display: "flex",flexDirection: "column", justifyContent: "flex-end",alignItems:"center" ,gap:4 }}>
         {headerState?.showDocTitle &&
          <Text style={[styles.docTitle, { color: headerState?.docTitleFontColor, fontSize: headerState?.docTitleFontSize, fontFamily: fontFamily }]}>
          {headerState?.docTitle }
        </Text>
         }
           
            <Text style={[labelStyles,{fontSize:8,fontWeight:700}]}>{"Payment No:3"}</Text>
        </View>
        <View style={[styles.orgAddress,{flexBasis:"33.33%",}]}>
          {headerState?.showOrgAddress &&
            currentBranch.address?.map((org: any, idx: number) => (
              <Text key={`ADDK_${idx}`} style={fontStyles}>{org}</Text>
            ))
          }
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
  );
};







