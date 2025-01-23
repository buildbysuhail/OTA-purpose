import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import { TemplateState } from "../../../Designer/interfaces";
import FontRegistration from "../../../../LabelDesigner/fontRegister";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import Table from "./Table";


export interface BalanceSheetVerticalProps {
  data?: any;
  template?: TemplateState;
  currentBranch?: any;
  userSession?:any;
}

const styles = StyleSheet.create({

  companyInfo: {
    display: "flex",
    flexDirection: "column",
    gap:4,
    flexWrap: "wrap",
    width: "100%",
    zIndex: 10,
  },
  logo: {
    marginVertical: 4,
  },
  orgName: {
    textTransform: "capitalize",
    fontWeight: "semibold",
  },
  orgAddress: {
    display: "flex",
    flexDirection: "column",
    alignContent:"center",
    gap:2
  },

});

const BalanceSheetVerticalTemplate = ({ template,currentBranch,userSession,data }: BalanceSheetVerticalProps) => {
  const headerState = template?.headerState;
  const logoWidthRatio = template?.headerState?.logoSize ? template.headerState?.logoSize / 100 : 0.5;
  const paddingLeft = template?.propertiesState?.padding?.left || 10;
  const paddingRight = template?.propertiesState?.padding?.right || 10;
  const paddingTop = template?.propertiesState?.padding?.top || 10;
  const paddingBottom = template?.propertiesState?.padding?.bottom || 10;
  const pageOrientation = template?.propertiesState?.orientation === "landscape" ? "landscape" : "portrait";

  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = template?.propertiesState?.font_size || 12;
  const color = template?.propertiesState?.font_color || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";

  const labelFontSize = template?.propertiesState?.label_font_size || 12;
  const labelColor = template?.propertiesState?.label_font_color || "#000";
  const labelFontWeight = template?.propertiesState?.label_font_weight || 400;
  const labelFontStyle = template?.propertiesState?.label_font_style || "normal";

  const orgNameFontColor = headerState?.OrganizationFontColor || "#000";
  const orgNameFontSize = headerState?.OrganizationFontSize || 12;

  const labelStyles = {
    color: labelColor,
    fontSize: labelFontSize,
    fontWeight: labelFontWeight,
    fontStyle: labelFontStyle,
    fontFamily,
  };

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
  return (
    <Document>
      <FontRegistration />
      <Page size={"A4"} orientation={pageOrientation} wrap>
      <View style={{ flex: 1, flexDirection: 'column', width: '100%', height: '100%' }}>
         {/* Header */}
         <View style={{
          backgroundColor: template?.headerState?.bgColor ,
          height: `auto`, 
          width: '100%',
        }}>
            <View style={{ display: "flex", flexDirection: "column",alignContent:"center" ,
              justifyContent:"center" ,
              padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`,}}>
              {headerState?.showLogo && (
                <Image
                  src={currentBranch?.logo}
                  style={[styles.logo, { width: 80 * logoWidthRatio }]}
                />
              )}
              {headerState?.showOrgName && (
                <Text style={{ color: orgNameFontColor, fontSize: orgNameFontSize, fontWeight: "semibold",fontFamily:fontFamily,}}>
                  {/* {currentBranch?.name} */}
                  {userSession.headerFooter?.heading7}
                </Text>
              )}
                {headerState?.showOrgAddress && (
              <View >
                <Text style={arabicFontStyles}>{userSession.headerFooter.heading8}</Text>
                <Text style={fontStyles}>{userSession.headerFooter.heading9}</Text>
                  <Text style={fontStyles}>Balance Sheet as of  15, 2024</Text>
              </View>
            )}
            </View>
        </View>
    
          {/* Main Content */}
          <View style={{
          flex: 1, 
          position: 'relative',
          backgroundColor: template?.propertiesState?.bg_color || "#fff",
          
        }}>
          {/* Background Image */}
          {template?.background_image && (
            <Image
              src={template.background_image}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -20,
              }}
            />
          )}

          {/* Content */}
          <View style={{zIndex: 50 ,
            padding: `${paddingTop}pt ${paddingRight}pt ${paddingBottom}pt ${paddingLeft}pt`,
          }}>
             <Table template={template} />
          </View>
        </View>
      
     
       </View>
      </Page>
    </Document>
  );
};

export default BalanceSheetVerticalTemplate;