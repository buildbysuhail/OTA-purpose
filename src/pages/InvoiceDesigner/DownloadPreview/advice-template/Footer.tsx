import { View, Text,StyleSheet } from "@react-pdf/renderer";
import { TemplateState } from "../../Designer/interfaces";

const styles = StyleSheet.create({

  companyInfo: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop:30,
    zIndex: 10,
    height:100,
    borderWidth: 1, 
  borderColor: "rgb(104, 101, 101)"
  },

  info:{
    display:"flex",
    flexDirection:"row",
    gap:2,
  },

});

export  const Footer = ({ data, template,}: { data: any; template?: TemplateState;}) => {
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
    return true;
  };
  
  return (
<View>
<View style={styles.companyInfo}>

    <View style={{ 
         flexBasis:"66.66%", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "flex-start", 
        borderRightWidth: 1, 
        borderRightColor: "rgb(104, 101, 101)",
        padding:4
    }}> 

<View style={styles.info}>
<Text style={labelStyles}>A/c. Name :</Text>
<Text style={fontStyles}> </Text>
</View>
                            
<View style={styles.info}>
<Text style={labelStyles}>Amount :</Text>
<Text style={fontStyles}> SR122.00 </Text>
</View>

<View style={styles.info}>
<Text style={labelStyles}>Your Bank :</Text>
<Text style={fontStyles}> </Text>
</View>

<View style={styles.info}>
<Text style={labelStyles}>A/c or IBAN No:</Text>
<Text style={fontStyles}> </Text>
</View>

    </View>

     <View style={{ flexBasis:"33.33%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",}}> 
     <View style={styles.info}>
<Text style={labelStyles}>Total :</Text>
<Text style={fontStyles}>SR122.00 </Text>
</View>
     </View>

 </View>

</View>
    
  );
};







