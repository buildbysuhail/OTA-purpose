import { View, Text ,StyleSheet,Image} from "@react-pdf/renderer";
import { AccountTransactionProps } from ".";

const styles = StyleSheet.create({
  footerInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-between",
    flexWrap: "wrap",
    width: "100%",
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
const Footer = ({ data, template }: AccountTransactionProps) => {
  const footerState = template?.footerState
  const paddingLeft = template?.propertiesState?.padding?.left;
  const paddingRight = template?.propertiesState?.padding?.right;
  const paddingBottom = template?.propertiesState?.padding?.bottom ;

  const fontFamily = template?.propertiesState?.font_family || "Roboto";
  const fontSize = footerState?.footerFontSize || 12;
  const color = footerState?.footerFontColor || "#000";
  const fontWeight = template?.propertiesState?.font_weight || 400;
  const fontStyle = template?.propertiesState?.fontStyle || "normal";
  
  const fontStyles = {
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
  };
  return (
   
   <View style={{
    backgroundColor: footerState?.bg_color ,
    width: '100%',
    position: 'relative',
  }}>
    {/* Background Image */}
        {template?.background_image_footer && (
            <Image
              src={template?.background_image_footer}
              style={[
                styles.bgImage,
                { objectPosition: footerState?.bg_image_footer_position || 'center' } // Control image position
              ]}
            />
          )}
   
    <View>
    {footerState?.show_page_number &&(
     <Text style={fontStyles}>1/1</Text>
    )}
    </View>    
        

  </View> 
  );
};

export default Footer;
