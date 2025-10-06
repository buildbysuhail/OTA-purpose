import { APIClient } from "../../../helpers/api-client"
import { useUserRights } from "../../../helpers/user-right-helper"
import type { RootState } from "../../../redux/store"
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch"
import { isNullOrUndefinedOrEmpty } from "../../../utilities/Utils"
import type { AccTransactionFormState, AccUserConfig } from "./acc-transaction-types"
import { logUserAction } from "../../../redux/slices/user-action/thunk"
import { useDispatch } from "react-redux"
import { accFormStateHandleFieldChange, acctemplatesData } from "./reducer"
import { pdf } from "@react-pdf/renderer"
import { renderSelectedTemplate } from "./acc-renderSelected-template"
import useCurrentBranch from "../../../utilities/hooks/use-current-branch"
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert"
import type { TemplateState } from "../../InvoiceDesigner/Designer/interfaces"
import { customJsonParse, parseTemplateContent } from "../../../utilities/jsonConverter"
import Urls from "../../../redux/urls"
import VoucherType from "../../../enums/voucher-types"

import ERPToast from "../../../components/ERPComponents/erp-toast"

import { useTranslation } from "react-i18next"
import { useDirectPrint } from "../../../utilities/hooks/use-direct-print"
const api = new APIClient()
export const useAccPrint = () => {
  const currentBranch = useCurrentBranch()
  const dispatch = useDispatch()

    const { directPrint } = useDirectPrint();
  const userSession = useAppSelector((state: RootState) => state.UserSession)
  const formState = useAppSelector((state: RootState) => state.AccTransaction)
  const applicationSettings = useAppSelector((state: RootState) => state.ApplicationSettings)
  const clientSession = useAppSelector((state: RootState) => state.ClientSession)
  const handleFieldChange = (field: keyof AccUserConfig, value: any) => {
    const updatedUserConfig = {
      ...formState.userConfig,
      [field]: value,
    }
    dispatch(accFormStateHandleFieldChange({ fields: { userConfig: updatedUserConfig } }))
  }

  const { hasRight } = useUserRights()
  const voucherTypeSet = new Set(Object.values(VoucherType))

  const fetchDefaultTemplates = async (voucherType: any) => {
    try {
      const res = await api.getAsync(`${Urls.default_template}?template_group=${voucherType}`)
      const cc: TemplateState<unknown> = parseTemplateContent(res.content)
      const _template = {
        ...cc,
        id: res.id,
        background_image: res?.payload?.data?.background_image as string | undefined,
        background_image_header: res?.payload?.data?.background_image_header as string | undefined,
        background_image_footer: res?.payload?.data?.background_image_footer as string | undefined,
        signature_image: res?.payload?.data?.signature_image as string | undefined,
        branchId: res.branchId,
        // content: res.content,
        isCurrent: res.isCurrent,
        templateGroup: res.templateGroup,
        templateKind: res.templateKind,
        templateName: res.templateName,
        templateType: res.templateType,
        thumbImage: res.thumbImage as string | undefined,
      }

      dispatch(acctemplatesData(_template))
      if (voucherTypeSet.has(voucherType)) {
        dispatch(accFormStateHandleFieldChange({ fields: { template: _template } }))
      }

      return _template
    } catch (error) {
      console.error("Error fetching Default templates:", error)
    }
  }

  const getOrFetchTemplate = async (voucherTypes: string, voucher:any) => {
    const existingTemplate = voucher.templatesData?.find((template: any) => template.templateGroup === voucherTypes)

    if (existingTemplate) {
      return existingTemplate
    } else {
      return await fetchDefaultTemplates(voucherTypes)
    }
  };

 const getTemplate = async (
  voucherType: string | undefined,
  givenFormState: any,
 
) => {
  const finalVoucherType: string =
    !isNullOrUndefinedOrEmpty(voucherType) ? voucherType!: formState.transaction?.master?.voucherType || "";

  const finalFormState = !isNullOrUndefinedOrEmpty(givenFormState) ? givenFormState : formState;
  let template = finalFormState.template;

  if (!template || template.id === 0) {
    template = await getOrFetchTemplate(finalVoucherType,finalFormState);
    dispatch(accFormStateHandleFieldChange({ fields: { template } }));
  }

  return template;
};

  const printVoucher = async (masterID: number,transactionType: string,printTmeplate?:any ,voucherType?: any, transDate?: string) => {
  debugger
    transDate = transDate??(new Date()).toISOString();
   
    const template =printTmeplate? printTmeplate : await getTemplate(voucherType, formState);
    if (template?.id == 0) {
      // ERPAlert.show({ title: "Please Set Template For Print" })
      ERPToast.showWith("Please Set Template For Print", "warning");
      return
    }
    // If template is valid, proceed with printing
    if (formState.userConfig?.printPreview) {
      dispatch(accFormStateHandleFieldChange({ fields: { isPrintModalOpen: true } }))
    } else {
      await directPrint({template: template,masterIDParam: masterID, isInvTrans: false,dbIdValue: userSession.dbIdValue,isAppGlobal: clientSession.isAppGlobal, printCopies:1, transactionType: transactionType,transDate: transDate})
    }
  }

  const printPaymentReceiptAdvice = async (voucher?: AccTransactionFormState, voucherType?: any) => {
    voucher = voucher == undefined ? formState : voucher
    voucherType = isNullOrUndefinedOrEmpty(voucherType) ? formState.transaction.master.voucherType : voucherType
    const voucherTypes = ["CP", "BP", "CQP"].includes(voucherType)
      ? "PARP"
      : ["CR", "BR", "CQR"].includes(voucherType)
        ? "RARP"
        : ""
    const template = await getOrFetchTemplate(voucherTypes,voucher)
    if (template?.id == 0) {
      ERPToast.showWith("Please Set Template For Print", "warning");
      return
    }
    await directPrint({template})
  }

  const printCheque = async (voucherType?: any, voucher?: AccTransactionFormState) => {
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
      const template = await getOrFetchTemplate(voucherTypes, voucher)

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

  return {
    printVoucher,
    printCheque,
    printPaymentReceiptAdvice,
    getTemplate,
  }
}

