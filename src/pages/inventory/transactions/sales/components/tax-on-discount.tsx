import React, { Dispatch } from "react";
import { AnyAction } from "redux";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { useAppState } from "../../../../../utilities/hooks/useAppState";
import { TransactionFormState } from "../../transaction-types";
import { ChevronDown, CircleArrowDown, Plus } from "lucide-react";
import { useAppSelector } from "../../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../../redux/store";

export interface taxOnDiscProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  taxOnDiscBtnClick: () => void;
  t: any;
}



const TaxOnDiscount: React.FC<taxOnDiscProps> = ({ formState, t, taxOnDiscBtnClick }) => {
  const { appState } = useAppState();
  const isRtl = appState.locale.rtl;
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings);
  const { getFormattedValue } = useNumberFormat();
  return (
    <>
    {applicationSettings?.branchSettings?.enableTaxOnBillDiscount && (
    <div className="flex items-center gap-2 group min-w-0">
      <span className="flex items-center gap-1 flex-shrink-0">
        <span className="flex items-center gap-1 text-xs dark:text-dark-text text-gray-600 font-medium">
          {t("tax_on_disc")}
          <CircleArrowDown onClick={()=>taxOnDiscBtnClick()} size={14} className="text-gray-600 "/>
        </span>
      </span>
      <span className="text-xs dark:text-dark-text text-gray-600">:</span>
      <span
        className={`text-sm font-semibold dark:text-dark-text text-gray-900 flex-1 truncate min-w-0 ${
          isRtl ? "text-left" : "text-right"
        }`}
        title={getFormattedValue(formState.transaction.master.taxOnDiscount ?? 0)}
      >
        {getFormattedValue(formState.transaction.master.taxOnDiscount ?? 0)}
      </span>
    </div>
  )}
    </>
  );
};

export default React.memo(TaxOnDiscount);
