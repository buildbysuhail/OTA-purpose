import { View, Text, Image,StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({

  companyInfo: {
    display: "flex",
    flexDirection: "column",
    width:"100%",
    height: 160,
    gap:10
  },
  row:{
  display: "flex", flexDirection: "row",
   justifyContent:"space-between", alignItems:"center"
  },
  rowHead:{
    display: "flex", flexDirection: "column",
  },
  font:{
    color: "#000", fontSize: 9, fontWeight: 400,fontFamily: "Roboto",fontStyle:"normal"
  },
});

export  const HeaderTemp = ({ data, currentBranch,userSession}: { data: any; currentBranch: any,userSession:any}) => {

  const isValidLogo = (logo: any): boolean => {
    if (!logo) return false;
    if (typeof logo !== 'string') return false;
    if (logo.trim() === '') return false;
    // Add any other specific validation you need
    return true;
  };
  
  return (
  
      <View style={styles.companyInfo}fixed>
        <View style={styles.row}>

             {isValidLogo(currentBranch?.logo) && (
            <Image
              src={currentBranch.logo}
              style={{ width: 80 *  (10 / 100)}}
            />
             )}

            <View style={{ display: "flex", flexDirection: "column",}}>           
                <Text style={{ color: "#000", fontSize: 16, fontWeight: 600,fontFamily: 'Amiri',fontStyle:"normal"}}>
                 {/* {userSession.headerFooter.heading8} */}
                    ض.ق.م-٢٣٥٤٣٣٥٤٤٥٤٥٤٥٣٤ 
                </Text>
                <Text style={{ color: "#000", fontSize: 16, fontWeight: 600,fontFamily: "Roboto",fontStyle:"normal"}}>
                {userSession.headerFooter?.heading7}
                </Text>         
            </View>
     
        </View>

     <View style={{display: "flex", flexDirection: "row" , flexWrap: "wrap",
    width: "100%",}}>
        <View style={[styles.rowHead,{ alignItems:"flex-start",flexBasis:"20%"}]}>          
                <Text style={styles.font}>
                 To
                </Text>         
        </View>
        <View style={{ flexBasis:"50%",}}> 
        <Text style={{ color: "#000", fontSize: 14, fontWeight: 700,fontFamily: "Roboto",fontStyle:"normal",textAlign: "center", textDecoration: "underline"}}>
                Statement of Account
         </Text>  
         </View>
                       
        
         <View style={[styles.rowHead,{ alignItems:"flex-end",flexBasis:"25%",}]}> 
            <View style={{flexDirection:"row",justifyContent:"flex-start",gap:6}}>
            <Text style={styles.font}>
             From    
           </Text>
           <Text style={styles.font}>
             {/* {dateTrimmer(data.master?.transactionDate)}    */}15/01/2025
           </Text>
            </View>         
           
            <View style={[styles.row,{justifyContent:"flex-start",gap:6}]}>
            <Text style={styles.font}>
             To    
           </Text>
           <Text style={styles.font}>
             {/* {dateTrimmer(data.master?.transactionDate)}    */}15/01/2025
           </Text>
            </View>  
              
            <View style={[styles.row,{justifyContent:"flex-start",gap:6}]}>
            <Text style={styles.font}>
             Ledger    
           </Text>
           <Text style={[styles.font,{fontSize: 11,}]}>
            MUASSASA ALGHILAL ALDHAHABIA
           </Text>
            </View>
        </View>
     </View>

    
      </View>
  
  );
};







