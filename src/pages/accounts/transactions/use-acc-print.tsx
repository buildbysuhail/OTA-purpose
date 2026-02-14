
import { useDispatch } from "react-redux"
import { APIClient } from "../../../helpers/api-client";
import { useDirectPrint } from "../../../utilities/hooks/use-direct-print";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { getOrFetchTemplate } from "../../use-print";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/Utils";
import { AccTransactionFormState } from "./acc-transaction-types";


const api = new APIClient()
export const useAccPrint = () => {
  const { directPrint } = useDirectPrint();
  const formState = useAppSelector((state: RootState) => state.AccTransaction)


  const printCheque = async (voucherType: string, voucher?: AccTransactionFormState) => {
    voucher = voucher == undefined ? formState : voucher
    const voucherTypes = "Cheque"
    // Filter details that satisfy the condition
    const chequeDetails = voucher.transaction.details.filter(
      (detail) =>
        !isNullOrUndefinedOrEmpty(detail.ledgerID) &&
        (detail.chequeNumber !== undefined || detail.chequeNumber !== null),
    )

    // Only proceed if there are cheque details
    if (chequeDetails.length > 0) {
      // Get the template
      const template = await getOrFetchTemplate(voucherTypes,"","")

      // Pass all cheque details at once to directPrint
      if (template?.id == 0) {
        ERPToast.showWith("Please Set Template For Print", "warning");
        return
      }
      await directPrint({
            template,
            data: chequeDetails,
          });

    }
  }
//this is use to spasific for acc transAction print  else are use useCommen in based-transation
  return {
    printCheque,

  }
}


