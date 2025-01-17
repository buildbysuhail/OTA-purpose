import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  TableCellsIcon,
  BarsArrowUpIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  TicketIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

import TotalDesigner from "./Designer/TotalDesigner";
import FooterDesigner from "./Designer/FooterDesigner";
import { DummyInvoiceData, DummyVoucherData } from "./constants/DummyData";
import ItemTableDesigner from "./Designer/ItemTableDesigner";
import PropertiesDesigner from "./Designer/PropertiesDesigner";
import HeaderFooterDesigner from "./Designer/HeaderFooterDesigner";
import TransactionDetailsDesigner from "./Designer/TransactionDetailsDesigner";
import ERPToast from "../../components/ERPComponents/erp-toast";
import { TemplateReducerState } from "../../redux/reducers/TemplateReducer";
import { handleResponse } from "../../utilities/HandleResponse";
import { DataToForm, isFile } from "../../utilities/Utils";
import save_svg from "../../assets/svg/save.svg";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import {
  getDetailAction,
  postAction,
  patchAction,
} from "../../redux/slices/app-thunks";
import Urls from "../../redux/urls";
import {
  setTemplate,
  setTemplateAccTableState,
  setTemplateFooterState,
  setTemplateHeaderState,
  setTemplateItemTableState,
  setTemplatePropertiesState,
  setTemplateThumbImage,
  setTemplateTotalState,
} from "../../redux/slices/templates/reducer";
import { APIClient } from "../../helpers/api-client";
import VoucherType from "../../enums/voucher-types";
import { TemplateDto, TemplateState } from "./Designer/interfaces";
import AccountTransactionsTemplate from "./DownloadPreview/account_transactiocn";
import { PDFViewer,pdf} from "@react-pdf/renderer";
import useCurrentBranch from "../../utilities/hooks/use-current-branch";
import AccTableDesigner from "./Designer/accTableDesigner";
import { customJsonParse } from "../../utilities/jsonConverter";
import InvoicePreview from "./InvoicePreview";
import AccountTransactionsVoucher from "./DownloadPreview/account_transactiocn_voucher";
import BalanceSheetVerticalTemplate from "./DownloadPreview/balance-sheet/balance-sheet-vertical";
import NoDataMessage from "./utils/visible-non-component";
import { RootState } from "../../redux/store";

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

const designSections: Array<DesignSectionType> = [
  {
    id: 1,
    name: "Template Properties",
    description: "Template 1 description",
    type: "properties",
    icon: <DocumentTextIcon />,
  },
  {
    id: 2,
    name: "Header & Footer",
    description: "Template 1 description",
    type: "header&footer",
    icon: <BarsArrowUpIcon />,
  },
  {
    id: 3,
    name: "Transaction Details",
    description: "Template 1 description",
    type: "transactions",
    icon: <AdjustmentsHorizontalIcon />,
  },
  {
    id: 4,
    name: "Table",
    description: "Template 1 description",
    type: "table",
  },
  {
    id: 5,
    name: "Total",
    description: "Template 1 description",
    type: "total",
    icon: <CurrencyDollarIcon />,
  },
  {
    id: 6,
    name: "Other Details",
    description: "Template 1 description",
    type: "others",
    icon: <TicketIcon />,
  },
];

export interface TemplateImagesTypes {
  signature_image: string | null;
  background_image: string | null;
  background_image_header: string | null;
  background_image_footer: string | null;
}

const api = new APIClient();
const InvoiceDesigner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const currentBranch = useCurrentBranch();
  const userSession =  useSelector((state: RootState) => (state.UserSession));  
  const [loading, setLoading] = useState(false);
  const [templateImages, setTemplateImages] = useState<TemplateImagesTypes>({
    signature_image: null,
    background_image: null,
    background_image_footer: null,
    background_image_header: null,
  });

  const [designTabs, setDesignTabs] = useState(designSections);
  const [currentSection, setSection] = useState(designSections[0]);
  const templateData = useSelector(
    (state: any) => state?.Template
  ) as TemplateReducerState;

  const templateGroup = searchParams?.get("template_group")! as
    | VoucherType
    | string;

  const [maxHeight, setMaxHeight] = useState<number>(500);

  useEffect(() => {
    let wh = window.innerHeight;
    setMaxHeight(wh);
  }, []);

  /* ####################################################################### */

  const getPDFTemplateData = async () => {

      const res  = await api.getAsync(`${Urls.templates}${id||""}`)
      debugger;
      let cc: TemplateState = customJsonParse(res.content);
      const template = {
        ...cc,
        background_image: res?.payload?.data?.background_image as
          | string
          | undefined,
        background_image_header: res?.payload?.data?.background_image_header as
          | string
          | undefined,
        background_image_footer: res?.payload?.data?.background_image_footer as
          | string
          | undefined,
        signature_image: res?.payload?.data?.signature_image as
          | string
          | undefined,
      };

      dispatch(setTemplate(template));
   
  };

  /* ########################################################################################### */

  //  Handling View Design Tab Category
  useEffect(() => {
    if (
      templateGroup &&
      [
        "payment_receipts",
        "retainer_payment_receipts",
        "payment_made",
      ]?.includes(templateGroup)
    )
      setDesignTabs(
        designSections?.filter(
          (tab) => tab.id !== 4 && tab.id !== 5 && tab?.id !== 7
        )
      );

    if (templateGroup && ["journal_entry"]?.includes(templateGroup))
      setDesignTabs(
        designSections?.filter(
          (tab) => tab?.id !== 5 && tab?.id !== 6 && tab?.id !== 7
        )
      );

    if (templateGroup && ["customer", "vendor"]?.includes(templateGroup))
      setDesignTabs(
        designSections?.filter(
          (tab) => tab?.id !== 5 && tab?.id !== 6 && tab?.id !== 7
        )
      );

    if (
      templateGroup &&
      ["qty_adjustment", "value_adjustment"]?.includes(templateGroup)
    )
      setDesignTabs(
        designSections?.filter((tab) => tab?.id !== 5 && tab?.id !== 7)
      );

    if (templateGroup && ["barcode"]?.includes(templateGroup))
      setDesignTabs(designSections?.filter((tab) => tab?.id == 7));
  }, [templateGroup]);
  //

  useEffect(() => {
    if (id !== "new") getPDFTemplateData();
  }, []);

  const templateWrap = useSelector(
    (state: any) => state?.Template
  ) as TemplateReducerState;
  /* ########################################################################################### */

  const handleSave = async (dataUrl: string) => {
    const tmpTemplate = {
      ...templateData.activeTemplate,
      propertiesState: {
        ...templateData.activeTemplate.propertiesState,
        template_group: templateGroup,
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
      isCurrent: false,
      backgroundImage: tmpTemplate.background_image ?? "",
      backgroundImageHeader: tmpTemplate.background_image_header ?? "",
      backgroundImageFooter: tmpTemplate.background_image_footer ?? "",
      signatureImage: tmpTemplate.signature_image ?? "",
      branchId: 0,
    };
    await dispatch(setTemplate(activeTemplate));
    setLoading(true);
    let res = await api.postAsync(Urls.templates, activeTemplate);

    setLoading(false);
    handleResponse(res, () => {
      // ERPToast.show("Template saved successfully", "success");
      navigate(`/templates?template_group=${templateGroup}`);
    });
    setLoading(false);
  };

  /* ########################################################################################### */
  /* ########################################################################################### */

  const manageSaveTemplate = async () => {
    if (!templateData?.activeTemplate?.propertiesState?.templateName) {
      ERPToast.show("Template name is required", "error");
    } else {
      const node = document.getElementById("invoicePreview");
      if (node) {
        try {
          const canvas = await html2canvas(node);
          const dataUrl = canvas.toDataURL("image/png");
          if (templateData?.activeTemplate && id === "new")
            await handleSave(dataUrl);
        } catch (error) {
          console.error("Error capturing canvas:", error);
        }
      }
    }
  };



  const manageSaveAccTemplate = async () => {
    if (!templateData?.activeTemplate?.propertiesState?.templateName) {
      ERPToast.show("Template name is required", "error");
    } else {
      const imageData = await capturePDFAsImage();
      if (imageData) {
        try {
          if (templateData?.activeTemplate && id === "new")
            await handleSave(imageData);
        } catch (error) {
          console.error("Error capturing canvas acc master:", error);
        }
      }
    }
  };

  const capturePDFAsImage = async () => {
    const pdfViewer = document.querySelector(".pdf-viewer") as HTMLElement;
    if (pdfViewer) {
      // Ensure the PDF viewer is visible
      pdfViewer.style.visibility = 'visible';
      pdfViewer.style.display = 'block';
  
      // Introduce a delay to ensure the PDF is fully rendered
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
      
      const canvas = await html2canvas(pdfViewer);
      const image = canvas.toDataURL("image/png");
      return image;
    }
    return null;
  };


  return (
    <div className="flex h-full text-black dark:text-white bg-white dark:bg-body_dark ">
      {/* Mini Tab Icons */}

      <div className="w-[70px] border-r h-full print:hidden">
        <div className="flex flex-col">
          <div className=" flex items-center justify-center border-b h-[69px]  ">
            <button
              onClick={() =>
                templateGroup
                  ? navigate(`/templates?template_group=${templateGroup}`)
                  : navigate("/templates?template_group=SI")
              }
              className=" bg-gray-100 hover:bg-gray-50 p-2 rounded-full "
            >
              <ArrowLeftIcon className=" w-5 h-5" />
            </button>
          </div>
          {designTabs?.map((val, index) => (
            <div
              key={`dSec${index}`}
              onClick={() => setSection(val)}
              className={` ${
                currentSection.type == val.type
                  ? "text-accent"
                  : "text-gray-600"
              } cursor-pointer hover:bg-gray-100 flex flex-col p-2 py-3 border-b text-center items-center gap-1`}
            >
              <div className="w-5 h-5 ">
                {val.icon ? val.icon : <TableCellsIcon />}
              </div>
              <div className="text-[10px]">
                {[
                  "payment_receipts",
                  "retainer_payment_receipts",
                  "payment_made",
                ]?.includes(templateGroup!) && val.id === 3
                  ? " Receipt Information"
                  : val.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* */}

      <div className="flex flex-col border-r min-w-[280px] w-[500px] h-full print:hidden ">
        {/* Save Template Option  */}
        <div className="flex justify-between items-center border-b p-4 ">
          <h1 className="text-base">{currentSection.name}</h1>

          {["CP", "CR"].includes(templateGroup) ? (
            <div>
              <button
                title="Save Template"
                onClick={manageSaveAccTemplate}
                className="flex gap-1 bg-primary text-white relative hover:bg-blue-600 bg-accent py-2 px-3 rounded disabled:bg-accent/60 overflow-hidden "
              >
                <img src={save_svg} className="w-5 h-5 text-red-500" />{" "}
                <span className="text-sm">Save</span>
                {loading && (
                  <div className=" bg-white top-2 left-2 h-5 w-5 rounded-full animate-ping absolute"></div>
                )}
              </button>
            </div>
          ) :["SI", "SR"].includes(templateGroup) ? (
            <div>
              <button
                title="Save Template"
                onClick={manageSaveTemplate}
                className="flex gap-1 bg-primary text-white relative hover:bg-blue-600 bg-accent py-2 px-3 rounded disabled:bg-accent/60 overflow-hidden "
              >
                <img src={save_svg} className="w-5 h-5 text-red-500" />{" "}
                <span className="text-sm">Save</span>
                {loading && (
                  <div className=" bg-white top-2 left-2 h-5 w-5 rounded-full animate-ping absolute"></div>
                )}
              </button>
            </div>
          ):(
            <div>
            <button
              title="Save Template "
              // onClick={}
              className="flex gap-1 bg-primary text-white relative hover:bg-blue-600 bg-accent py-2 px-3 rounded disabled:bg-accent/60 overflow-hidden "
            >
              <img src={save_svg} className="w-5 h-5 text-red-500" />{" "}
              <span className="text-sm">Save</span>
              {loading && (
                <div className=" bg-white top-2 left-2 h-5 w-5 rounded-full animate-ping absolute"></div>
              )}
            </button>
          </div>
          )}
        </div>
        {/* */}

        {currentSection.type == "properties" && (
          <PropertiesDesigner
            templateGroup={templateGroup}
            tempImages={{ templateImages, setTemplateImages }}
            propertiesState={templateData?.activeTemplate?.propertiesState}
            onChange={(propertiesState) =>
              dispatch(setTemplatePropertiesState(propertiesState))
            }
          />
        )}

        {currentSection.type == "header&footer" && (
          <HeaderFooterDesigner
            tempImages={{ templateImages, setTemplateImages }}
            footerState={templateData?.activeTemplate?.footerState}
            headerState={templateData?.activeTemplate?.headerState}
            // onChange={(footerState) => dispatch(setActiveTemplate({ ...templateData?.activeTemplate, footerState: footerState }))}
          />
        )}
        
       {
        currentSection.type === "transactions" &&
          (["BalanceSheet", "ProfitAndLoss"].includes(templateGroup) ? (
            <NoDataMessage message="Oops, there is no property!!!" />
          ) : (
            <TransactionDetailsDesigner
              template={templateData?.activeTemplate}
              headerState={templateData?.activeTemplate?.headerState}
              onChange={(headerState) =>
                dispatch(setTemplateHeaderState(headerState))
              }
            />
          ))
        }


        {
          currentSection.type === "table" &&
            (["BalanceSheet", "ProfitAndLoss"].includes(templateGroup) ? (
              <NoDataMessage message="Oops, there is no table property!!!" />
            ) : ["SI", "SR"].includes(templateGroup) ? (
              <ItemTableDesigner
                template={templateData?.activeTemplate}
                itemTableState={templateData?.activeTemplate?.itemTableState}
                onChange={(itemTableState) =>
                  dispatch(setTemplateItemTableState(itemTableState))
                }
              />
            ) : ["CP", "CR"].includes(templateGroup) ? (
              <AccTableDesigner
                template={templateData?.activeTemplate}
                accTableState={templateData?.activeTemplate?.accTableState}
                onChange={(accTableState) =>
                  dispatch(setTemplateAccTableState(accTableState))
                }
              />
            ) : null) // Return null for unsupported cases
        }

        {
          currentSection.type === "total" &&
            (["BalanceSheet", "ProfitAndLoss"].includes(templateGroup) ? (
              <NoDataMessage message="Oops, there is no total property!!!" />
            ) : (
              <TotalDesigner
                totalState={templateData?.activeTemplate?.totalState}
                onChange={(totalState) => dispatch(setTemplateTotalState(totalState))}
              />
            ))
        }

        {
          currentSection.type === "others" &&
            (["BalanceSheet", "ProfitAndLoss"].includes(templateGroup) ? (
              <NoDataMessage message="Oops, there is no property!!!" />
            ) : (
              <FooterDesigner
                tempImages={{ templateImages, setTemplateImages }}
                footerState={templateData?.activeTemplate?.footerState}
                onChange={(footerState) =>
                  dispatch(setTemplateFooterState(footerState))
                }
              />
            ))
        }
      </div>

      {/* Preview  */}
      {["BalanceSheet","ProfitAndLoss"].includes(templateGroup) && (
        <PDFViewer
        className="pdf-viewer"
        width="100%"
        height="auto"
        style={{ maxHeight: `${maxHeight}px`, margin: "20px", padding:"10px"}}
       >
      <BalanceSheetVerticalTemplate
      template={templateData.activeTemplate}
      currentBranch={currentBranch}
      userSession={userSession}
      />
      </PDFViewer>
      )}
      {["CP", "CR"].includes(templateGroup) && (
        <>
        {/* <AccountPreview templateGroupId={templateGroup} data={DummyVoucherData} /> */}
          <PDFViewer
            className="pdf-viewer"
            width="100%"
            height="auto"
            style={{ maxHeight: `${maxHeight}px`, margin: "20px" }}
          >
            <AccountTransactionsTemplate
              template={templateData.activeTemplate}
              data={DummyVoucherData}
              currentBranch={currentBranch}
            />
            {/* <AccountTransactionsVoucher
              template={templateData.activeTemplate}
              data={DummyVoucherData}
              currentBranch={currentBranch}
            /> */}
            
          </PDFViewer>
        </>
      )}
      {["SI", "SR"].includes(templateGroup) && (
        <InvoicePreview
          templateGroupId={templateGroup}
          data={DummyInvoiceData}
        />
      )}
      {/* */}
    </div>
  );
};

export default InvoiceDesigner

