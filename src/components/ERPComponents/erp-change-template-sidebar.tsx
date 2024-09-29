import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";

import stdTempImage from "../../public/templates/Invoice_std.png";
import retailStdTempImage from "../../public/templates/Retail_stadard.png";
import { TemplateGroupTypes } from "../../pages/InvoiceDesigner/constants/TemplateCategories";
import { getCurrentCurrencySymbol } from "../../utilities/Utils";
import { TemplateState } from "../../pages/InvoiceDesigner/Designer/interfaces";
import { parseAddressTemplate } from "../../pages/InvoiceDesigner/utils";
import { getAction, getDetailAction, patchAction } from "../../redux/actions/AppActions";
import Urls from "../../redux/urls";
import { handleResponse } from "../../utilities/HandleResponse";
import { DummyInvoiceData } from "../../pages/InvoiceDesigner/constants/DummyData";
import RetailPreviewWrapper from "../../pages/InvoiceDesigner/DesignPreview/RetailPreview/PreviewWrapper";
import StandardPreviewWrapper from "../../pages/InvoiceDesigner/DesignPreview/StandardPreview";
import ERPToast from "./erp-toast";
import PSModel from "../common/polosys/ps-modal";

interface previewState {
  show: boolean;
  template?: TemplateState;
}

interface ERPChangeTemplateSidebarProps {
  data?: any;
  onClose: any;
  type?: "form" | "detail_page";
  templateId: TemplateGroupTypes;

  // used for form change Template
  onChangeData?: any;

  // used for voucher template update
  endpointUrl?: string;
  associatedTempInfo?: any;
}

const ERPChangeTemplateSidebar = ({
  data,
  onClose,
  templateId,
  endpointUrl,
  onChangeData,
  associatedTempInfo,
  type = "detail_page",
}: ERPChangeTemplateSidebarProps) => {
  const dispatch = useDispatch();
  const currencySymbol = getCurrentCurrencySymbol();

  const [tempData, setTempData] = useState<any>();
  const [showPreview, setShowPreview] = useState<previewState>({ show: false });

  const comapanies = useSelector((state: any) => state?.GetUserCompanies);
  const ActiveBranch = comapanies?.data?.find((item: any) => item?.is_active);
  const generalPrefData = useSelector((state: any) => state?.GetGeneralPreference)?.data?.results[0];

  const orgAddressTemplate = parseAddressTemplate(generalPrefData?.organization_address_format, ActiveBranch?.company);

  /* ########################################################################################### */

  let paperWidth;
  const paperSize = showPreview?.template?.propertiesState?.pageSize?.value || "A4";

  switch (paperSize) {
    case "A5":
      paperWidth = "w-[450px]";
      break;
    case "A4":
      paperWidth = "w-[500px]";
      break;
    case "LETTER":
      paperWidth = "w-[600px]";
      break;
    case "3Inch":
      paperWidth = "w-[210px]";
      break;
    case "4Inch":
      paperWidth = "w-[260px]";
      break;
    default:
      paperWidth = "w-[500px]";
  }

  /* ########################################################################################### */

  const getTemplates = () => {
    (dispatch(getAction(Urls.templates, `voucher_type=${templateId}`)) as any).then((res: any) => {
      setTempData(res?.payload?.data);
    });
  };

  const setDefaultTemplate = (id: string) => {
    if (type === "detail_page" && endpointUrl) {
      (
        dispatch(patchAction(endpointUrl, { template_id: id, items: [], addresses: [], contact_person: [], additional_charge: [] }, data?.id)) as any
      ).then((res: any) => {
        handleResponse(res, () => {
          onClose();
          getTemplates();
          dispatch(getDetailAction(endpointUrl, data?.id));
          ERPToast.show("Template information has been updated.", "success");
        });
      });
    } else if (type === "form") {
      onClose();
      onChangeData?.({ template_id: id });
    }
  };

  const getCurrentSelectedTemplateID = () => {
    if (type === "form") return null;
    else if (data?.template?.id) return data?.template?.id;
    else if (associatedTempInfo?.[templateId]) return associatedTempInfo?.[templateId];
    else return tempData?.find((tmp: any) => tmp?.is_default)?.id;
  };

  // console.log("chnage_template changesidebar");

  /* ########################################################################################### */

  useEffect(() => {
    getTemplates();
  }, [templateId]);

  /* ########################################################################################### */

  return (
    <div className="text-black w-[400px] h-screen bg-white">
      <div className=" flex flex-row-reverse justify-between items-center p-4 border-b">
        <a className=" uppercase text-gray-800 font-semibold text-sm">Choose Template</a>
        <div className=" w-6 bg-slate-100 aspect-square rounded-md flex justify-center items-center cursor-pointer" onClick={onClose}>
          <XMarkIcon className=" text-black w-5" />
        </div>
      </div>
      <div className=" bg-gray-100/70 p-5 flex gap-2">
        <a className=" text-lg font-semibold capitalize">{templateId?.replaceAll("_", " ")} Templates</a>
      </div>
      <div className="grid grid-cols-2 px-8 py-5 gap-8">
        {tempData?.map((template: any, index: number) => {
          const paperSize = template?.content?.propertiesState?.pageSize?.value;
          const thumbImage = paperSize === "3Inch" || paperSize === "4Inch" ? retailStdTempImage : stdTempImage;
          return (
            <div
              key={`ti_${template?.id}`}
              tabIndex={0}
              className=" relative hover:ring-2 hover:shadow-md 100px w-full aspect-[2.3/3] border border-gray-300  rounded"
            >
              <div className="flex">
                <img
                  src={template?.preview ?? thumbImage}
                  alt=""
                  className=" antialiased border-0 bg-gray-50 object-top object-cover w-full aspect-[2/2] rounded border-b border-gray-300"
                />
              </div>
              <div className=" text-center pb-1 items-center flex flex-col">
                <div
                  className="font-medium w-[140px] text-xs capitalize py-2 px-1 truncate"
                  title={`${template?.content?.propertiesState?.templateName}`}
                >
                  {template?.content?.propertiesState?.templateName}
                </div>
                <div className="flex justify-between px-1  w-full">
                  <div
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview({ show: true, template: template?.content });
                    }}
                    className=" flex  items-center  cursor-pointer border border-accent text-accent  bg-white hover:bg-accent py-1 px-3 rounded text-xs hover:text-white"
                  >
                    <a>Preview</a>
                  </div>
                  {getCurrentSelectedTemplateID() === template?.id ? (
                    <div className=" flex cursor-default  items-center bg-green-500  py-1 px-3 rounded text-xs text-white">Current</div>
                  ) : (
                    <div
                      className=" flex  items-center  cursor-pointer  bg-accent  hover:bg-accent/80 py-1 px-3 rounded text-xs text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDefaultTemplate(template?.id);
                      }}
                    >
                      Select
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {tempData?.length === 0 && <div className="flex justify-center">No Templates Found</div>}

      <PSModel isOpen={showPreview.show} closeModal={() => setShowPreview({ show: false })}>
        <div>
          <div className=" relative text-lg border-b text-center py-2 font-medium">
            <h1>{showPreview.template?.propertiesState?.templateName}</h1>
            {/* close button */}
            <button
              onClick={() => setShowPreview({ show: false })}
              className=" absolute right-3 top-2 bg-gray-100 py-1 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-300"
            >
              <XMarkIcon className=" w-4 h-4" />
            </button>
          </div>
          <div className=" relative flex flex-col items-center bg-gray-100 overflow-auto p-7 print:p-0 h-full w-full">
            <div
              id="invoice-preview"
              style={{ backgroundColor: showPreview.template?.propertiesState?.bg_color || "#fff" }}
              className={`flex  flex-col gap-4 relative  ${paperWidth}  shadow-md print:m-0 print:w-full print:shadow-none`}
            >
              {paperSize === "3Inch" || paperSize === "4Inch" ? (
                <RetailPreviewWrapper
                  data={DummyInvoiceData}
                  template={showPreview.template}
                  company={ActiveBranch?.company}
                  currency={currencySymbol}
                  templateGroupId={templateId}
                  addressTemplates={{ orgAddressTemplate }}
                />
              ) : (
                <StandardPreviewWrapper
                  data={DummyInvoiceData}
                  template={showPreview.template}
                  company={ActiveBranch?.company}
                  currency={currencySymbol}
                  templateGroupId={templateId}
                  addressTemplates={{ orgAddressTemplate }}
                />
              )}
            </div>
          </div>
        </div>
      </PSModel>
    </div>
  );
};

export default ERPChangeTemplateSidebar;
