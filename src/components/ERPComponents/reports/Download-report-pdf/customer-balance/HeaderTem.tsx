


import { View, Text, Image, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,

  },
  leftSection: {
    width: "40%",
    alignItems: "flex-start",
  },
  rightSection: {
    width: "40%",
     alignItems: "flex-end",
     direction:"rtl"
  },
  logoSection: {
    width: "20%",
    alignItems: "center",
  },
  companyNameEn: {
    
    fontSize: 16,
    fontWeight:700,
    color: "#F7A81B", // Orange/gold color
    marginBottom: 4,
  },
  companyNameAr: {
    fontSize: 16,
    fontWeight: 700,
    color: "#F7A81B", // Orange/gold color
    marginBottom: 4,
  },
  tagline: {
    fontSize: 10,
    color: "#0000FF", // Blue color
    marginBottom: 2,
  },
  proprietor: {
    fontSize: 10,
    color: "#0000FF", // Blue color
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 8,
    marginBottom: 1,
  },
  logo: {
    width: 60,
    height: 60,
  },
  arabicText: {
    textAlign: "right",
    fontFamily: "Amiri",
    fontStyle: "normal",
    lineHeight: 1.4,
  },
})

export const Header = ({
  data,
  currentBranch,
  userSession,
}: { data: any; currentBranch: any; userSession: any }) => {
  const isValidLogo = (logo: any): boolean => {
    if (!logo) return false
    if (typeof logo !== "string") return false
    if (logo.trim() === "") return false
    return true
  }

  return (
        
         <View style={styles.header}>
         {/* Left Section (English) */}
         <View style={styles.leftSection}>
           <Text style={styles.companyNameEn}>Ba-Hamdoon Trdg. Est.</Text>
           <Text style={styles.tagline}>Your Best Business Partner</Text>
           <Text style={styles.proprietor}>Prop.: Ali Salim Bahamdoon</Text>
           <Text style={styles.contactInfo}>Email: accounts@bahamdoon.com</Text>
           <Text style={styles.contactInfo}>Tele/fax: 014 3903175</Text>
         </View>

         {/* Center Logo Section */}
         <View style={styles.logoSection}>
           {/* If you have the logo as a file, you can use Image component */}
           {/* For this example, I'm creating a simple placeholder */}
           <View
             style={{
               width: 60,
               height: 60,
               backgroundColor: "#008000", // Green color
               borderRadius: 5,
               justifyContent: "center",
               alignItems: "center",
             }}
           >
             <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>BB</Text>
           </View>
         </View>

         {/* Right Section (Arabic) */}
         <View style={styles.rightSection}>
           <Text style={[styles.companyNameAr, styles.arabicText]}>مؤسسة باحمدون التجارية</Text>
           <Text style={[styles.tagline, styles.arabicText]}>أفضل شريك تجاري لك</Text>
           <Text style={[styles.proprietor, styles.arabicText]}>لصاحبها : علي سالم باحمدون</Text>
           <Text style={[styles.contactInfo, styles.arabicText]}>البريد الإلكتروني : accounts@bahamdoon.com</Text>
           <Text style={[styles.contactInfo, styles.arabicText]}>تليفون / فاكس : (٠١٤) ٣٩٠٣١٧٥</Text>
         </View>
       </View>
  )
}






