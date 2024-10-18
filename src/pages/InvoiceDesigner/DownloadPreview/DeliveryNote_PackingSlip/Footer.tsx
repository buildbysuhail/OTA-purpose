import { View, Text } from "@react-pdf/renderer";
import { DNSPTEmpProps } from ".";

const Footer = ({ data, template }: DNSPTEmpProps) => {
  return (
    <View style={{ width: "100%", display: "flex", flexDirection: "column", gap: 30 }}>
      <View style={{ paddingTop: "5px" }}>
        <Text>Items in Total : {data?.items?.length}</Text>
      </View>
      {/* {preference?.customer_notes && (
        <View>
          <Text>Notes : </Text>
          <Text>{data?.notes}</Text>
        </View>
      )}
      {preference?.signature_enable && (
        <View>
          <Text>{preference?.signature || "Authorized Signature"} : _______________________</Text>
        </View>
      )} */}
    </View>
  );
};

export default Footer;
