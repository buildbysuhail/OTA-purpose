
import { useDispatch } from "react-redux"
import { APIClient } from "../../../helpers/api-client";
import { useDirectPrint } from "../../../utilities/hooks/use-direct-print";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import { getOrFetchTemplate } from "../../use-print";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { isNullOrUndefinedOrEmpty } from "../../../utilities/Utils";
import { AccTransactionFormState, AccTransactionRow } from "./acc-transaction-types";
import { accFormStateHandleFieldChange } from "./reducer";
import { PrintData, PrintResponse } from "../../use-print-type";


const api = new APIClient()
export const useAccPrint = () => {
  const { directPrint } = useDirectPrint();
  const formState = useAppSelector((state: RootState) => state.AccTransaction)


  const printCheque = async (chequeData: any, printPreview = false,) => {
    debugger
    chequeData = isNullOrUndefinedOrEmpty(chequeData) ? formState?.transaction?.details : chequeData
    const chequeDataTypes = "Cheque"
    const backNameAsFormType = ""
    // Filter details that satisfy the condition
    const chequeDetails = chequeData.filter(
      (detail:any) =>
        !isNullOrUndefinedOrEmpty(detail.ledgerID) &&
        (detail.chequeNumber !== undefined || detail.chequeNumber !== null),
    )

    // Only proceed if there are cheque details
    if (chequeDetails.length > 0) {
      // Get the template{

         const printData : PrintData = {
             kind: "voucher",
            data: chequeDetails as PrintResponse,
         }
      const template = await getOrFetchTemplate(chequeDataTypes, backNameAsFormType, "")

      // Pass all cheque details at once to directPrint
      if (template?.id == 0) {
        ERPToast.showWith("Please Set Template For Print ", "warning");
        return
      }

      if (printPreview) {
        dispatch(
          accFormStateHandleFieldChange({
            fields: { chequePreview: {isPrintPreview: true, template, printData } },
          })
        );
        // return;

      }

      await directPrint({
        template,
        data: printData,
      });

    }
  }
  //this is use to spasific for acc transAction print  else are use useCommen in based-transation
  return {
    printCheque,

  }
}


function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}

