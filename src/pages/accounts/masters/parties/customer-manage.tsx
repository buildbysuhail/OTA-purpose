import React, {  } from "react";
import PartiesManage from "./parties-manage";

export const CustomerManage = React.memo(() => {
  return (
    <PartiesManage type="Cust"></PartiesManage>
  );
});

export default CustomerManage;