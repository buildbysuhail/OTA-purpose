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

const BillDiscountLabel: React.FC<GrandTotalProps> = ({ formState, t }) => {
  const { appState } = useAppState();
    const clientSession = useAppSelector(
      (state: RootState) => state.ClientSession
    );
  const isRtl = appState.locale.rtl;
    const { round,getFormattedValueIgnoreRounding } = useNumberFormat();

  let billDisc=VoucherType.SalesInvoice && !clientSession.isAppGlobal ? getFormattedValueIgnoreRounding(formState.transaction.master.billDiscount)
          : [VoucherType.ServiceInvoice, VoucherType.SalesReturn, VoucherType.SaleReturnEstimate, VoucherType.SalesOrder, VoucherType.GoodRequest, VoucherType.RequestForQuotation].includes(formState.transaction.master.voucherType as any)
            ? formState.transaction.master.billDiscount : round(formState.transaction.master.billDiscount);

  return (
    // <ERPLabel
    //   id="grandTotal"
    //   label={t(formState.formElements.grandTotal.label)}
    //   localInputBox={formState?.userConfig?.inputBoxStyle}
    //   value={formState.transaction.master.billDiscount}
    //   type="number"
    //   boxed
    //   textAlign="right"
    // />
    <div className="flex items-center">
      <span className="text-xs dark:text-dark-text text-gray-600 font-medium w-24">{t(formState.formElements.billDiscount.label)}</span>
      <span className="text-xs dark:text-dark-text text-gray-600 mr-2">:</span>
      <span className={`text-sm font-semibold dark:text-dark-text text-gray-900 flex-1 ${isRtl ? "text-left" : "text-right"}`}>{billDisc}</span>
    </div>
  );
};

export default React.memo(BillDiscountLabel);
