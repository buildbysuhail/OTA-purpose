import html2canvas from "html2canvas";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { TableCellsIcon, BarsArrowUpIcon, CurrencyDollarIcon, DocumentTextIcon, ArrowLeftIcon, TicketIcon, AdjustmentsHorizontalIcon, } from "@heroicons/react/24/outline";
import TotalDesigner from "../Designer/TotalDesigner";
import FooterDesigner from "../Designer/FooterDesigner";
import { DummyInvoiceData, DummyVoucherData } from "../constants/DummyData";
import ItemTableDesigner from "../Designer/ItemTableDesigner";
import PropertiesDesigner from "../Designer/PropertiesDesigner";
import HeaderFooterDesigner from "../Designer/HeaderFooterDesigner";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";
import { handleResponse } from "../../../utilities/HandleResponse";
import save_svg from "../../assets/svg/save.svg";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import Urls from "../../../redux/urls";
import { setTemplate, setTemplateAccTableState, setTemplateAdviceTableState, setTemplateCustomElements, setTemplateFooterState, setTemplateHeaderState, setTemplateItemTableState, setTemplatePropertiesState, setTemplateTotalState, } from "../../../redux/slices/templates/reducer";
import { APIClient } from "../../../helpers/api-client";
import VoucherType from "../../../enums/voucher-types";
import { TemplateDto, TemplateState } from "../Designer/interfaces";
import AccountTransactionsTemplate from "../DownloadPreview/account/account_transactiocn-premium";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import AccTableDesigner from "../Designer/accounts/accTableDesigner";
import { customJsonParse } from "../../../utilities/jsonConverter";
import InvoicePreview from "../InvoicePreview";
import AccountTransactionsVoucher from "../DownloadPreview/account/account_transactiocn_standard";
import { RootState } from "../../../redux/store";
import * as pdfjsLib from 'pdfjs-dist'
import AccountTransactionsUniversal from "../DownloadPreview/account/account_transaction-universal";
import { useTranslation } from "react-i18next";
import AdviceTemplate from "../DownloadPreview/advice-template";
import AdviceTableDesigner from "../Designer/accounts/advice/adviceTableDesigner";
import { accTransaction } from "../constants/TemplateCategories";
import ChequeTemplate from "../DownloadPreview/cheque-template";
import StandardDesigner from "./account/standard/standred-designer";
import PremiumDesigner from "./account/premium/premium-designer";
import UniversalDesigner from "./account/universal/universal-designer";
import AdviceTemplateDesigner from "./advice-template/advice-template";
import ChequeTemplateDesigner from "./cheque-template/cheque-template";
import CustomerBalanceTemplateDesigner from "./reports/customerBalace/customer-balance-report-designe";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { toggleCustomDesignerPopup } from "../../../redux/slices/popup-reducer";
import PDFBarcodeDesigner from "../../LabelDesigner/label_designer";


export interface TemplateImagesTypes {
  signature_image: string | null;
  background_image: string | null;
  background_image_header: string | null;
  background_image_footer: string | null;
}

const api = new APIClient();

const InvoiceDesigner = () => {

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('system')
  const templateData = useSelector((state: any) => state?.Template) as TemplateReducerState;
  const { templateKind } = location.state || {};
  const templateGroup = searchParams?.get("template_group") || "";
  const dispatch = useDispatch();
       const rootState = useRootState();

  return (
    <div className="h-full">
   {accTransaction.includes(templateGroup as VoucherType) && (
   <>
   {templateKind && templateKind === "standard"?(
   <StandardDesigner />
   ):templateKind == "premium" ?(
    <PremiumDesigner/>
    ):templateKind == "universal" ? (
    <UniversalDesigner/>
   ):(<></>)}
   </>
  )}

  {
     ["PARP","RARP"].includes(templateGroup) && (
      <AdviceTemplateDesigner/>
     )
  }
  {["Cheque"].includes(templateGroup) && (
    <ChequeTemplateDesigner/>
  )}

    {["CBR"].includes(templateGroup) && (
    <CustomerBalanceTemplateDesigner/>
    )}

         <ERPModal
            isForm={true}
            isOpen={rootState.PopupData.CustomDesignerPopup.isOpen ?? false}
            title={t("custom_designer")}
            closeModal={() => {dispatch(toggleCustomDesignerPopup({ isOpen: false })); }}
            width={5000}
            height={5000}
            content={
            <PDFBarcodeDesigner 
            forCustomRows
            template={templateData?.activeTemplate}
            customTemplate={rootState.PopupData.CustomDesignerPopup.customTemplate}
            onSuccess={ useCallback(() => dispatch(toggleCustomDesignerPopup({ isOpen: false,customTemplate:""})), [dispatch])}
            />
            }
          /> 
    </div>
  );
  
};

export default InvoiceDesigner

