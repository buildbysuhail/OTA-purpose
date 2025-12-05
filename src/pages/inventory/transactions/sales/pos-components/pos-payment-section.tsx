import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import { merge } from "lodash";
import { initialUserConfig } from "../../transaction-type-data";

interface PosPaymentSectionProps {
  formState: any;
  dispatch: any;
}

const PosPaymentSection: React.FC<PosPaymentSectionProps> = ({
  formState,
  dispatch,
}) => {
  const { t } = useTranslation("transaction");
  const [dataSection, setDataSection] = useState("cash");

  // ------------------------- Tender Component ----------------------------
  // Actually this is cash section now
  const CashSection = () => {
    return (
      <div className="flex flex-col gap-1 p-1 pt-2">
        <div className="grid grid-cols-3 gap-2 items-center justify-center text-xl font-semibold p-1">
          {[500, 200, 100, 50, 20, 10, 5, 2, 1].map((amount) => (
            <button
              key={amount}
              className="bg-gray-300 px-10 py-2 text-black text-2xl rounded-sm"
            >
              {amount}
            </button>
          ))}
        </div>
        <ERPInput
          id="total_cash"
          type="number"
        //   noLabel={true}
          value={0.0}
          customSize="customize"
          localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
            inputHeight: 2,
            fontSize: 20,
            fontColor: "0, 0, 0",
            marginBottom: 0,
            marginTop: 3,
          })}
        />
        <div className="flex w-full gap-2 justify-between items-end ">
          <ERPInput
            id="description"
            type="text"
            // noLabel={true}
            value={0.0}
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
              marginBottom: 0,
              marginTop: 0,
            })}
          />
          <ERPButton title={t("apply")} variant="primary" className="h-8" />
        </div>
      </div>
    );
  };

//   const TenderSectionOld = () => {
//     return (
//       <div className="h-fit min-h-60 w-full">
//         <DataGrid
//           //   ref={dataGridRef}
//           keyExpr="id"
//           //   dataSource={flavourData}
//           className="custom-data-grid-dark-only"
//           focusedRowEnabled={false}
//           showBorders={true}
//           columnAutoWidth={true}
//           rowAlternationEnabled={true}
//           repaintChangesOnly={true}
//           height={300}
//         >
//           <Column dataField="slNo" caption={t("slNo")} width={50} />
//           <Column
//             dataField="Description"
//             width={140}
//             caption={t("description")}
//           />
//           <Column dataField="Amount" width={100} caption={t("amount")} />
//           <Column
//             dataField="action"
//             width={80}
//             caption={t("action")}
//             allowEditing={true}
//             cellRender={(cellData) => (
//               <button
//                 //   onClick={() => handleDelete(cellData.data)}
//                 className="p-1 text-black hover:text-red-800"
//               >
//                 <Trash2 size={12} />
//               </button>
//             )}
//           />

//           <Paging pageSize={40} />
//           <Scrolling mode="standard" />
//           <RemoteOperations filtering={false} sorting={false} paging={false} />
//         </DataGrid>
//         <div className="flex justify-between px-2">
//           <div className="text-primary font-bold text-lg">
//             {t("total_amount")}
//           </div>
//           <div className="text-danger font-bold text-lg">{1559}</div>
//         </div>
//       </div>
//     );
//   };

  // --------------- Details Components --------------------------
  const UpiSection = () => {
    return (
      <div className="w-full px-1">
        <div className="grid grid-cols-3 gap-2 p-1 mt-2">
          {["GOOGLE PAY", "PHONEPE"].map((method) => (
            <button
              key={method}
              className="bg-gray-300 text-black text-sm font-medium py-3 rounded-sm flex items-center justify-center"
            >
              {method}
            </button>
          ))}
          </div>
      </div>
    );
  };

  // ------------------ Fast Moving section ----------------------
  const CardSection = () => {
    return (
      <div className="w-full px-1">
        <div className="grid grid-cols-3 gap-2 p-1 mt-2">
          {["CARD1", "CARD2"].map((method) => (
            <button
              key={method}
              className="bg-gray-300 text-black text-sm font-medium py-3 rounded-sm flex items-center justify-center"
            >
              {method}
            </button>
          ))}
          </div>
      </div>
    );
  };

  const CouponSection = () => {
    return (
      <div className="w-full px-1">
        {/* Need to fill this section bases on the design in erp */}
      </div>
    );
  };

  return (
    <div className=" flex flex-col p-2 ">
      <div className="flex flex-row gap-0.5">
        <ERPButton
          title={t("cash")}
          variant="secondary"
          className="w-1/4"
          onClick={() => setDataSection("cash")}
        />
        <ERPButton
          title={t("upi_")}
          variant="secondary"
          className="w-1/4"
          onClick={() => setDataSection("upi")}
        />
        <ERPButton
          title={t("card")}
          variant="secondary"
          className="w-1/4"
          onClick={() => setDataSection("card")}
        />
        <ERPButton
          title={t("coupons")}
          variant="secondary"
          className="w-1/4"
          onClick={() => setDataSection("coupons")}
        />
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {dataSection === "cash" && <CashSection />}
        {dataSection === "upi" && <UpiSection />}
        {dataSection === "card" && <CardSection />}
        {dataSection === "coupons" && <CouponSection />}
      </div>
    </div>
  );
};

export default PosPaymentSection;
