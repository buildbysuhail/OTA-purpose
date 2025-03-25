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
import { customJsonParse } from "../../../utilities/jsonConverter"
import Urls from "../../../redux/urls"
import VoucherType from "../../../enums/voucher-types"
import AdviceTemplate from "../../InvoiceDesigner/DownloadPreview/advice-template"
import ChequeTemplate from "../../InvoiceDesigner/DownloadPreview/cheque-template"
import ERPToast from "../../../components/ERPComponents/erp-toast"
const api = new APIClient()
export const useAccPrint = () => {
  const currentBranch = useCurrentBranch()
  const dispatch = useDispatch()
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
  const adviceTem = ["PARP", "RARP"]

  const handleDirectPrint = async (template: any, transaction?: any) => {
    let pdfDocument
    if (adviceTem.includes(template.templateGroup)) {
      debugger
      const data = await api.getAsync(
        `${Urls.payment_receipt_billwise_advice_for_print}?masterId=${formState.transaction.master.accTransactionMasterID}`,
      )

      pdfDocument = (
        <AdviceTemplate
          template={template}
          data={data}
          currentBranch={currentBranch}
          userSession={userSession}
        />
      )
    } else if (template.templateGroup == "Cheque") {
      pdfDocument = <ChequeTemplate template={template} data={transaction} currentBranch={currentBranch} />
    } else {
      pdfDocument = renderSelectedTemplate({
        template: template,
        data: formState.transaction,
        currentBranch: currentBranch,
        userSession: userSession,
      })
    }

    try {
      // Create a PDF blob
      const blob = await pdf(pdfDocument).toBlob()
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(blob)

      // Open the PDF in a new tab for printing
      const printWindow = window.open(pdfUrl)
      if (!printWindow) {
        console.error("Failed to open print window. Please check your browser settings.")
        alert("Failed to open print window. Please allow popups and try again.")
        return
      }
      // Wait for the PDF to load in the new tab
      printWindow.onload = () => {
        printWindow.print() // Trigger print
      }
      // Log user action
      logUserAction({
        action: `User Printed Voucher ${formState.transaction.master.voucherType}:${formState.transaction.master.formType}:${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
        module: "Voucher Print",
        voucherType: formState.transaction.master.voucherType,
        voucherNumber: `${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
      })
    } catch (error) {
      console.error("Error printing voucher:", error)
    }
  }

  const fetchDefaultTemplates = async (voucherType: any) => {
    try {
      const res = await api.getAsync(`${Urls.default_template}?template_group=${voucherType}`)
      const cc: TemplateState = customJsonParse(res.content)
      const _template = {
        ...cc,
        id: res.id,
        background_image: res?.payload?.data?.background_image as string | undefined,
        background_image_header: res?.payload?.data?.background_image_header as string | undefined,
        background_image_footer: res?.payload?.data?.background_image_footer as string | undefined,
        signature_image: res?.payload?.data?.signature_image as string | undefined,
        branchId: res.branchId,
        content: res.content,
        isCurrent: res.isCurrent,
        templateGroup: res.templateGroup,
        templateKind: res.templateKind,
        templateName: res.templateName,
        templateType: res.templateType,
        thumbImage: res.thumbImage as string | undefined,
      }

      dispatch(acctemplatesData(_template))

      const template = formState.templatesData?.find((item) => item.templateGroup === voucherType)
      if (voucherTypeSet.has(voucherType)) {
        dispatch(accFormStateHandleFieldChange({ fields: { template: _template } }))
      }

      return _template
    } catch (error) {
      console.error("Error fetching Default templates:", error)
    }
  }

  const getOrFetchTemplate = async (voucherTypes: string, voucher = formState) => {
    const existingTemplate = voucher.templatesData?.find((template: any) => template.templateGroup === voucherTypes)

    if (existingTemplate) {
      return existingTemplate
    } else {
      return await fetchDefaultTemplates(voucherTypes)
    }
  }

  const printVoucher = async (voucherType?: any, voucher?: AccTransactionFormState) => {
   
    voucherType = isNullOrUndefinedOrEmpty(voucherType) ? formState.transaction.master.voucherType : voucherType
    let template = formState.template

    if (formState.template == undefined || formState.template == null || formState.template.id == 0) {
      template = await getOrFetchTemplate(voucherType)
      dispatch(accFormStateHandleFieldChange({ fields: { template: template } }))
    }
    if (template?.id == 0) {
      // ERPAlert.show({ title: "Please Set Template For Print" })
      ERPToast.showWith("Please Set Template For Print", "warning");
      return
    }
    // If template is valid, proceed with printing
    if (formState.userConfig?.printPreview) {
      dispatch(accFormStateHandleFieldChange({ fields: { isPrintModalOpen: true } }))
    } else {
      await handleDirectPrint(template)
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
    await handleDirectPrint(template)
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

      // Pass all cheque details at once to handleDirectPrint
      if (template?.id == 0) {
        ERPToast.showWith("Please Set Template For Print", "warning");
        return
      }
      await handleDirectPrint(template, chequeDetails)
    }
  }

  return {
    printVoucher,
    printCheque,
    printPaymentReceiptAdvice,
  }
}

