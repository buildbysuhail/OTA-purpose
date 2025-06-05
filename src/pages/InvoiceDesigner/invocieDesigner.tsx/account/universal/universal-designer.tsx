import { AdjustmentsHorizontalIcon, BarsArrowUpIcon, CurrencyDollarIcon, DocumentTextIcon, TableCellsIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon, TicketIcon } from "lucide-react";
import { APIClient } from "../../../../../helpers/api-client";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  SetStateAction, useEffect, useState } from "react";
import VoucherType from "../../../../../enums/voucher-types";
import { accTransaction } from "../../../constants/TemplateCategories";
import save_svg from "../../../../../assets/svg/save.svg";
import PropertiesDesigner from "../../../Designer/PropertiesDesigner";
import { TemplateReducerState } from "../../../../../redux/reducers/TemplateReducer";
import { TemplateImagesTypes } from "../../InvoiceDesignerLanding";
import { setTemplate, setTemplatePropertiesState } from "../../../../../redux/slices/templates/reducer";

import { DummyVoucherData } from "../../../constants/DummyData";
import useCurrentBranch from "../../../../../utilities/hooks/use-current-branch";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import ERPToast from "../../../../../components/ERPComponents/erp-toast";

import { RootState } from "../../../../../redux/store";
import { TemplateDto, TemplateState } from "../../../Designer/interfaces";
import Urls from "../../../../../redux/urls";
import { handleResponse } from "../../../../../utilities/HandleResponse";
import { customJsonParse } from "../../../../../utilities/jsonConverter";
import { convertPdfBlobToImage, generatePdfBlob } from "../../../utils/pdf-save";
import AccUniversalTransaction from "./designer/transactions-designer";
import AccountTransactionsUniversal from "../../../DownloadPreview/account/account_transaction-universal";
import HeaderFooterDesigner from "../../../Designer/HeaderFooterDesigner";

interface DesignSectionType {
  id: number;
  name: string;
  type:
  | "properties"
  | "transactions"
  | "table"
  | "total"
  | "others"
  | "header&footer"
  | "barcode";
  description: string;
  icon?: JSX.Element;
}
interface StandardDesignType {
templateGroup?: string;
}
const designSections: Array<DesignSectionType> = [
  {
    id: 1,
    name: "template_properties",
    description: "Template 1 description",
    type: "properties",
    icon: <DocumentTextIcon />,
  },
  {
    id: 2,
    name: "header_&_footer",
    description: "Template 1 description",
    type: "header&footer",
    icon: <BarsArrowUpIcon />,
  },
  {
    id: 3,
    name: "transaction_details",
    description: "Template 1 description",
    type: "transactions",
    icon: <AdjustmentsHorizontalIcon />,
  },
  {
    id: 4,
    name: "table",
    description: "Template 1 description",
    type: "table",
    icon: <TableCellsIcon />,
  },
  {
    id: 5,
    name: "total",
    description: "Template 1 description",
    type: "total",
    icon: <CurrencyDollarIcon />,
  },
  {
    id: 6,
    name: "other_details",
    description: "Template 1 description",
    type: "others",
    icon: <TicketIcon />,
  },
];

const api = new APIClient();

const UniversalDesigner : React.FC<StandardDesignType> = ({}) => {
     const { t } = useTranslation('system')
      const { id } = useParams();
     const navigate = useNavigate();
     const dispatch = useDispatch();
      const [designTabs, setDesignTabs] = useState(designSections);
      const [currentSection, setSection] = useState(designSections[0]);
      const [loading, setLoading] = useState(false);
      const [templateImages, setTemplateImages] = useState<TemplateImagesTypes>({ signature_image: null, background_image: null, background_image_footer: null, background_image_header: null, });
    const currentBranch = useCurrentBranch();
      const userSession = useSelector((state: RootState) => (state.UserSession));
     const [searchParams] = useSearchParams();
     const location = useLocation();
     const { templateKind } = location.state || {};
     const [maxHeight, setMaxHeight] = useState<number>(500)
     const templateData = useSelector((state: any) => state?.Template) as TemplateReducerState;
      const templateGroup = searchParams?.get("template_group") || "";
   useEffect(() => {
    let wh = window.innerHeight;
    setMaxHeight(wh);
   }, []);

  useEffect(() => {
    if (templateGroup && accTransaction?.includes(templateGroup as VoucherType))
      setDesignTabs(designSections);
  }, [templateGroup]);

  const handleSave = async (dataUrl: string) => {
      const tmpTemplate = {
        ...templateData.activeTemplate,
        propertiesState: {
          ...templateData.activeTemplate.propertiesState,
          template_group: templateGroup,
          template_kind: templateKind,
        },
      };
  
      const activeTemplate: TemplateDto = {
        // ...templateData.activeTemplate,
        templateType: tmpTemplate.propertiesState.template_type ?? "standard",
        templateKind: tmpTemplate.propertiesState.template_kind ?? "standard",
        templateGroup: tmpTemplate.propertiesState.template_group ?? "",
        templateName: tmpTemplate.propertiesState?.templateName ?? "",
        thumbImage: dataUrl,
        content: JSON.stringify(tmpTemplate),
        isCurrent: tmpTemplate.isCurrent ?? false,
        backgroundImage: tmpTemplate.background_image ?? "",
        backgroundImageHeader: tmpTemplate.background_image_header ?? "",
        backgroundImageFooter: tmpTemplate.background_image_footer ?? "",
        signatureImage: tmpTemplate.signature_image ?? "",
        branchId: 0,
        id: templateData.activeTemplate?.id == null ? 0 : templateData.activeTemplate?.id
      };
  
       dispatch(setTemplate(activeTemplate));
  
      setLoading(true);
      
      let res = await api.postAsync(Urls.templates, activeTemplate);
      setLoading(false);
      handleResponse(res, () => {
        navigate(`/templates?template_group=${templateGroup}`);
      });
    };

    const manageSaveAccTemplate = async (Component: React.ReactElement) => {
    if (id == "new" && !templateData?.activeTemplate?.propertiesState?.templateName) {
      ERPToast.show(t("template_name_is_required"));
      return;
    }
    try {
      const pdfBlob = await generatePdfBlob(Component);
      const imageDataUrl = await convertPdfBlobToImage(pdfBlob);
      await handleSave(imageDataUrl);
    }
    catch (error) {
      console.error("Error saving component:", error);
      ERPToast.show(t("failed_to_save_template"));
    }
  };

    const getPDFTemplateData = async () => {
      
        const res = await api.getAsync(`${Urls.templates}${id || ""}`)
        let cc: TemplateState = customJsonParse(res.content);
        const template = {
        ...cc,
        id: res.id,
        branchId: res.branchId,
        content: res.content,
        isCurrent: res.isCurrent,
        templateGroup: res.templateGroup,
        templateKind: res.templateKind,
        templateName: res.templateName,
        templateType: res.templateType,
        thumbImage: res.thumbImage as string | undefined,
        };
        dispatch(setTemplate(template));
    };

    useEffect(() => {
        if (id !== "new") getPDFTemplateData();
    }, []);
  return (
    <div className="flex h-full text-black dark:text-white bg-white dark:bg-body_dark">
   {/* Mini Tab Icons */}
      <div className="w-[70px] border-r h-full print:hidden">
        <div className="flex flex-col">
          <div className=" flex items-center justify-center border-b h-[69px]  ">
            <button
              onClick={() => templateGroup ? navigate(`/templates?template_group=${templateGroup}`) : navigate("/templates?template_group=SI")}
              className=" bg-gray-100 hover:bg-gray-50 p-2 rounded-full ">
              <ArrowLeftIcon className=" w-5 h-5" />
            </button>
          </div>
          {
            designTabs?.map((val, index) => (
              <div
                key={`dSec${index}`}
                onClick={() => setSection(val)}
                className={` ${currentSection.type == val.type ? "text-accent" : "text-gray-600"} cursor-pointer hover:bg-gray-100 flex flex-col p-2 py-3 border-b text-center items-center gap-1`}>
                <div className="w-5 h-5 ">
                  {val.icon }
                </div>
                <div className="text-[10px]">
                  {
                    t(val.name)
                  }
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col border-r min-w-[280px] w-[500px] h-full print:hidden ">
             {/* Save Template Option  */}
        <div className="flex justify-between items-center border-b p-4 ">
          <h1 className="text-base">{t(currentSection.name)}</h1>
          <div>
                <button
                  title={t("save_template")}
                  onClick={() => {
                      manageSaveAccTemplate(
                        <AccountTransactionsUniversal
                          template={templateData.activeTemplate}
                          data={DummyVoucherData}
                          currentBranch={currentBranch}
                          userSession={userSession}
                        />
                      );
                 
                  }}
                  className="flex gap-1 bg-primary text-white relative hover:bg-blue-600 bg-accent py-2 px-3 rounded disabled:bg-accent/60 overflow-hidden ">
                  <img src={save_svg} className="w-5 h-5 text-red-500" />{" "}
                  <span className="text-sm">{t("save")}</span>
                  {loading && (
                    <div className=" bg-white top-2 left-2 h-5 w-5 rounded-full animate-ping absolute"></div>
                  )}
                </button>
              </div>  
          </div>
               {currentSection.type == "properties" &&
                    <PropertiesDesigner
                        templateGroup={templateGroup}
                        tempImages={{ templateImages, setTemplateImages }}
                        propertiesState={templateData?.activeTemplate?.propertiesState}
                        onChange={(propertiesState) =>
                        dispatch(setTemplatePropertiesState(propertiesState))
                        }
                    />
               }
                {currentSection.type == "header&footer" &&
                  <HeaderFooterDesigner/>
             }

                 {currentSection.type == "transactions" &&
                  <AccUniversalTransaction/>
             }
      </div>
              <PDFViewer
                    className="pdf-viewer"
                    width="100%"
                    height="auto"
                    style={{ maxHeight: maxHeight, margin: 20, border: "1px solid #DFDFDF" }}>
                <AccountTransactionsUniversal
                  template={templateData.activeTemplate}
                  data={DummyVoucherData}
                  currentBranch={currentBranch}
                  userSession={userSession}
                />
             </PDFViewer>           
      </div>
  );
  
};

export default UniversalDesigner




