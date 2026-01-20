import React, { Dispatch } from "react";
import { AnyAction } from "redux";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { useAppState } from "../../../../../utilities/hooks/useAppState";
import { TransactionFormState } from "../../transaction-types";
import VoucherType from "../../../../../enums/voucher-types";
import { useAppSelector } from "../../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../../redux/store";

export interface GrandTotalProps {
  formState: TransactionFormState;
  dispatch: Dispatch<AnyAction>;
  handleKeyDown?: (e: any, field: string) => void;
  t: any;
}

const SRAmountLabel: React.FC<GrandTotalProps> = ({ formState, t }) => {
  // const { appState } = useAppState();
  // const clientSession = useAppSelector(
  //   (state: RootState) => state.ClientSession
  // );

 return (

    <div className="flex items-center">
      <span
       className="text-xs dark:text-dark-text text-red-600 font-bold w-24"
      >
        {formState.formElements.sRAmountLabel.label}
      </span>

    </div>
  );
};

export default React.memo(SRAmountLabel);
