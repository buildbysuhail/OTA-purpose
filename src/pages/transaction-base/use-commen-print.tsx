import { APIClient } from "../../helpers/api-client"
import { useUserRights } from "../../helpers/user-right-helper"
import type { RootState } from "../../redux/store"
import { useAppSelector } from "../../utilities/hooks/useAppDispatch"
import { isNullOrUndefinedOrEmpty } from "../../utilities/Utils"
import type { AccTransactionFormState, AccUserConfig } from "../accounts/transactions/acc-transaction-types"
import { useDispatch } from "react-redux"
import { accFormStateHandleFieldChange,  } from "../accounts/transactions/reducer"
import useCurrentBranch from "../../utilities/hooks/use-current-branch"
import VoucherType from "../../enums/voucher-types"
import ERPToast from "../../components/ERPComponents/erp-toast"
import { useDirectPrint } from "../../utilities/hooks/use-direct-print"
import { getOrFetchTemplate } from "../use-print"
import { toggleIsPrintPreviewPopup } from "../../redux/slices/popup-reducer"

const api = new APIClient()
export const useCommenPrint = () => {
  const dispatch = useDispatch()
  const { directPrint } = useDirectPrint();
  const userSession = useAppSelector((state: RootState) => state.UserSession)
  // const formState = useAppSelector((state: RootState) => state.AccTransaction) 
  const clientSession = useAppSelector((state: RootState) => state.ClientSession)

  const printVoucher = async (masterID: number,transactionType: string,voucherType: string,formType:string,customerType:string,isInvTrans: boolean= false,printPreview:boolean=false, printTmeplate?:any ,transDate?: string,printData?:any) => {
debugger
    transDate = transDate??(new Date()).toISOString();
   
    const template =printTmeplate? printTmeplate : await getOrFetchTemplate(voucherType??'', formType,customerType);
    if (template?.id == 0) {
      // ERPAlert.show({ title: "Please Set Template For Print" })
      ERPToast.showWith("Please Set Template For Print", "warning");
      return
    }
    // If template is valid, proceed with printing
    if (printPreview) {
       dispatch(toggleIsPrintPreviewPopup({ isOpen: true ,masterId: masterID,}));
    } else {
      await directPrint({template: template,data:printData,masterIDParam: masterID, isInvTrans: isInvTrans,dbIdValue: userSession.dbIdValue,isAppGlobal: clientSession.isAppGlobal, printCopies:1, transactionType: transactionType,transDate: transDate})
    }
  }

  const printPaymentReceiptAdvice = async (voucherType: string) => {

    // voucherType = isNullOrUndefinedOrEmpty(voucherType) ? formState.transaction.master.voucherType : voucherType
    // const voucherTypes = ["CP", "BP", "CQP"].includes(voucherType)
    //   ? "PARP"
    //   : ["CR", "BR", "CQR"].includes(voucherType)
    //     ? "RARP"
    //     : ""
    // const template = await getOrFetchTemplate(voucherTypes,"","")
    // if (template?.id == 0) {
    //   ERPToast.showWith("Please Set Template For Print", "warning");
    //   return
    // }
    // await directPrint({template})
  }

  const printCheque = async (voucherType: string, voucher?: AccTransactionFormState) => {
    // voucher = voucher == undefined ? formState : voucher
    // const voucherTypes = "Cheque"
    // // Filter details that satisfy the condition
    // const chequeDetails = voucher.transaction.details.filter(
    //   (detail) =>
    //     !isNullOrUndefinedOrEmpty(detail.ledgerID) &&
    //     (detail.chequeNumber !== undefined || detail.chequeNumber !== null),
    // )

    // // Only proceed if there are cheque details
    // if (chequeDetails.length > 0) {
    //   // Get the template
    //   const template = await getOrFetchTemplate(voucherTypes,"","")

    //   // Pass all cheque details at once to directPrint
    //   if (template?.id == 0) {
    //     ERPToast.showWith("Please Set Template For Print", "warning");
    //     return
    //   }
    //   await directPrint({
    //         template,
    //         data: chequeDetails,
    //       });

    // }
  }

  return {
    printVoucher,
    printCheque,
    printPaymentReceiptAdvice,
  }
}


