import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import CounterShift from "./counter-shift";

interface PosLandingProps {
  formState: any;
  dispatch: any
}

const PosLanding: React.FC<PosLandingProps> = ({
  formState,
  dispatch
}) => {
  const { t } = useTranslation("transaction");
  const [selectedBtn, setSelectedBtn] = useState("")

  return (
    <div className="w-full h-[768px] flex items-center justify-center bg">
        <div className="flex flex-col items-center justify-between gap-3">
            <div className="flex gap-4">
                <ERPButton title={t("english")} variant="secondary" />
                <ERPButton title={t("arabic")} variant="secondary" />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <ERPButton title={t("sales_order")} variant="primary" className="w-60 h-32 text-lg"/>
                <ERPButton title={t("sales_return")} variant="primary" className="w-60 h-32 text-lg" />
                <ERPButton title={t("sales")} variant="primary" />
                <ERPButton title={t("counter_shift")} variant="primary" className="w-60 h-32 text-lg" onClick={()=> setSelectedBtn("counterShift")}/>
                <ERPButton title={t("summary")} variant="primary" className="w-60 h-32 text-lg"/>
                <ERPButton title={t("exit")} variant="primary" className="w-60 h-32 text-lg"/>
            </div>

        </div>
        <ERPModal
        isOpen={selectedBtn === "counterShift" ? true : false}
        title={t("counter_shift")}
        width={400}
        height={100}
        isForm={true}
        closeModal={() => setSelectedBtn("")}
        content={<CounterShift formState={formState} dispatch={dispatch} />}
      />
    </div>
    
  );
};

export default PosLanding;

{/* <PosLanding formState={formState} dispatch={dispatch}/> */}
