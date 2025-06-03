import { View, Text, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateCol: {
    flexDirection: "column",
    gap:3,
    justifyContent: "flex-start",
    marginBottom: 15,
  },

  leftColumn: {
    width: "48%",
  },
  rightColumn: {
    width: "48%",
    direction:"rtl"
  },
  centerSection: {
    width: "20%",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight:700,
   
  },
  value: {
    fontSize: 10,
    fontWeight: 700,
  },
  arabicText: {
    textAlign:"right",
    fontFamily: "Amiri",
  },
  balanceBox: {
    border: "1px solid black",
    padding: "8px 15px",
    marginVertical:10,
    width: "auto",
  },
  balanceText: {
    fontSize: 12,
    fontWeight: 700,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 1.4,
  },
  checkbox: {
    width: 12,
    height: 12,
    border: "1px solid black",
    marginRight: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 5,
  },
  remarksSection: {
    marginTop: 5,
  },
  remarksLabel: {
    fontSize: 12,
    fontWeight:500
  },
  remarksBox: {
    border: "1px solid black",
    height: 80,
    padding:10,
  },
  signatureSection: {
    marginTop: 10,
  },
  signatureField: {
   flexDirection:"row",
   marginBottom: 10,
  },
  signatureLabel: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  signatureLine: {
    borderBottom: "1px solid black",
    width: "60%",
    
  },
})

export const Content = ({
  data,
  currentBranch,
  userSession,
}: {
  data: any
  currentBranch: any
  userSession: any
}) => {
  const date = "01/03/2025"
  const customerName = "MUASSASA ALGHILAL ALDHAHABIA"
  const balance = "SR 712,620.00"

  return (
    <View style={styles.content}>
      {/* Date and Customer Section */}
   
      <View style={styles.dateCol}>
      <Text style={styles.label}>Date : {date}</Text>
      <Text style={styles.label}>To   : {customerName}</Text>
      </View>


      {/* Main Content */}
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.paragraph}>
            As per our normal financial audit requirements please check and confirm the accuracy of our balance as of{" "}
            {date}
          </Text>
          <View style={[styles.balanceBox, { alignSelf:"flex-start" }]}>
            <Text style={styles.balanceText}>{balance}</Text>
          </View>
          <Text style={styles.paragraph}>
            Please confirm the balance to pay and request you to sign and stamp in the space given below.
          </Text>
          <Text style={styles.paragraph}>
            If you have any queries about this, please revert to us immediately with our representative or Mail to the
            address or fax us ( 014 322 8256 ). If there is no response from your end within 15 days will be treated as
            correct and final.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: 700 }]}>
            No customer is entitled to review the balance after the corresponding annual
          </Text>
        </View>

        <View style={styles.rightColumn}>
          <Text style={[styles.paragraph, styles.arabicText]}>
            بمناسبة تدقيق حساباتنا الدورية المعتادة لبياناتنا المالية فإننا نرغب في الحصول على تأييد مباشر للمبالغ
            المستحقة لنا من طرفكم حتى تاريخ {date}
          </Text>
          <View style={[styles.balanceBox, { alignSelf: "flex-end" }]}>
            <Text style={styles.balanceText}>{balance}</Text>
          </View>
          <Text style={[styles.paragraph, styles.arabicText]}>
            نرجو مقارنة الرصيد الموضح أعلاه مع سجلاتكم وتوضيح أي خلاف بالتفصيل كما نأمل منكم توقيع وختم هذه الرسالة تم
            اعادتها مباشرة على عنوان الشركة أو مع مندوبنا بعد اعتمادها أو إرسالها بالفاكس على رقم (٨٢٥٦٣٢٢٠١٤)
          </Text>
          <Text style={[styles.paragraph, styles.arabicText]}>
            وإذا لم يصلنا الرد خلال (١٥) أيام سوف يعتبر هذا بمثابة موافقة نهائية على الرصيد
          </Text>
          <Text style={[styles.paragraph, styles.arabicText, { fontWeight: 700 }]}>
            لايحق للعميل مراجعة الرصيد بعد المطابقة السنوية
          </Text>
        </View>
      </View>

      {/* Checkboxes Section */}
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.paragraph}>We confirm the balance mentioned above is correct</Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.paragraph}>We do not agree. The balance in our account is</Text>
          </View>
        </View>
        <View style={styles.rightColumn}>
          <View style={[styles.checkboxRow, { justifyContent: "flex-end" }]}>
            <Text style={[styles.paragraph, styles.arabicText]}>إننا نوافق على الرصيد المبين أعلاه صحيحا</Text>
            <View style={[styles.checkbox, { marginRight: 0, marginLeft: 8 }]} />
          </View>
          <View style={[styles.checkboxRow, { justifyContent: "flex-end" }]}>
            <Text style={[styles.paragraph,styles.arabicText]}>إننا لا نوافق على صحة الرصيد في سجلاتنا</Text>
            <View style={[styles.checkbox, { marginRight: 0, marginLeft: 8 }]} />
          </View>
        </View>
      </View>

      {/* Remarks Section */}
      <View style={styles.remarksSection}>
        <View style={[styles.row,styles.remarksBox]}>
          <View style={styles.leftColumn}>
            <Text style={styles.remarksLabel}>Remarks:-</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={[styles.remarksLabel, styles.arabicText]}>-:ملاحظات</Text>
          </View>
        </View>
        {/* <View style={ /> */}
      </View>

      {/* Signature Section */}
      <View style={styles.signatureSection}>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Name:</Text>
              <View style={styles.signatureLine} />
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Designation:</Text>
              <View style={styles.signatureLine} />
            </View>
          
          </View>
          <View style={styles.rightColumn}>
            <View style={{...styles.signatureField,flexDirection:"row-reverse",}} >
              <Text style={[styles.signatureLabel, styles.arabicText]}>:الاسم</Text>
              <View style={{...styles.signatureLine}} />
            </View>
            <View style={{...styles.signatureField,flexDirection:"row-reverse",}}>
             
              <Text style={[styles.signatureLabel, styles.arabicText]}>:المنصب</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </View>
      <View>
        <View style={styles.row}>
          <View style={{...styles.leftColumn,width:"40%"}}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Signature:</Text>
              <View style={styles.signatureLine} />
            </View>
          
          </View>
            <View style={styles.centerSection}>
            <View style={{flexDirection:"row" ,gap:5}}>
            <Text style={styles.signatureLabel}>STAMP /</Text> 
            <Text style={[styles.signatureLabel, styles.arabicText]}>الختم</Text> 
            </View>
                
           </View>

          <View style={{...styles.rightColumn,width:"40%"}}>
            <View style={{...styles.signatureField,flexDirection:"row-reverse",}}>
            
              <Text style={[styles.signatureLabel, styles.arabicText]}>:التوقيع</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

