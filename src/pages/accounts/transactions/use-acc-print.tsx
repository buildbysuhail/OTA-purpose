
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
import { ChequeDataPrint, PrintData, PrintResponse } from "../../use-print-type";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { t } from "i18next";


const api = new APIClient()
export const useAccPrint = () => {
  const { directPrint } = useDirectPrint();
  const formState = useAppSelector((state: RootState) => state.AccTransaction)
    const dispatch = useDispatch();

  const printCheque = async (chequeData: any, printPreview = false,) => {
    debugger
     const sourceData = isNullOrUndefinedOrEmpty(chequeData) ? formState?.transaction?.details : chequeData
    const chequeDataTypes = "Cheque"
    const backNameAsFormType = ""
 // ✅ FILTER + MAP → ChequeDataPrint
  const chequeDetails = sourceData
    .filter(
      (detail:any) =>
        !isNullOrUndefinedOrEmpty(detail.ledgerID) &&
        !isNullOrUndefinedOrEmpty(detail.chequeNumber)
    )
    .map((detail:any): ChequeDataPrint => ({
      bankName: detail.bankName ?? "",
      nameOnCheque: detail.nameOnCheque ?? detail.partyName,
      bankDate: detail.bankDate ?? detail.chequeDate,
      chequeNumber: String(detail.chequeNumber),
      amount: detail.amount,
    }));

    // Only proceed if there are cheque details
    if (chequeDetails.length > 0) {
      // Get the template{

         const printData : PrintData = {
             kind: "voucher",
            data: chequeDetails as PrintResponse,
         }
      const template = await getOrFetchTemplate(chequeDataTypes, backNameAsFormType, "")

      // Pass all cheque details at once to directPrint
      if (!template && template?.id == 0) {
                await ERPAlert.show({
                  text: t("Oops! No Default Template Found . Please set a Default Template before continuing."),
                  title: t("set_default_template"),
                  icon: "warning",
                  onConfirm:async()=>{

                  }
                });
      }

      if (printPreview) {
        dispatch(
          accFormStateHandleFieldChange({
            fields: { chequePreview: {isPrintPreview: true, template, printData } },
          })
        );
        return;

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



