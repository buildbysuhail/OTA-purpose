import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PlusIcon, TrashIcon, PencilIcon, SparklesIcon } from "@heroicons/react/24/outline";


import stdTempImage from "../../assets/images/templates/Invoice_std.png";
import retailStdTempImage from "../../assets/images/templates/Retail_stadard.png";

import { parseAddressTemplate } from "./utils";
import { initialTemplateState, TemplateState } from "./Designer/interfaces";
import { DummyInvoiceData } from "./constants/DummyData";
import StandardPreviewWrapper from "./DesignPreview/StandardPreview";
import RetailPreviewWrapper from "./DesignPreview/RetailPreview/PreviewWrapper";
import { TemplateGroupTypes, TemplateTypes } from "./constants/TemplateCategories";
import { getCurrentCurrencySymbol } from "../../utilities/Utils";
import ERPToast from "../../components/ERPComponents/erp-toast";
import { handlePlainResponse, handleResponse } from "../../utilities/HandleResponse";
import { showAlert } from "../../components/ERPComponents/erp-alert";
import ERPSubmitButton from "../../components/ERPComponents/erp-submit-button";
import PSModel from "../../components/common/polosys/ps-modal";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { patchAction, deleteAction, getAction } from "../../redux/slices/app-thunks";
import Urls from "../../redux/urls";
import { setTemplate, setTemplatePropertiesState } from "../../redux/slices/templates/reducer";
import { APIClient } from "../../helpers/api-client";

interface previewState {
  show: boolean;
  template?: TemplateState;
}

const api = new APIClient();
const Templates = ({ }) => {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const currencySymbol = getCurrentCurrencySymbol();

  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [tempCrmData, setTempCRMData] = useState([]);

  const companies = useSelector((state: any) => state?.GetUserCompanies);
  const ActiveBranch = companies?.data?.find((item: any) => item?.is_active);

  const generalPrefData = useSelector((state: any) => state?.GeERPeneralPreference)?.data?.results[0];
  const orgAddressTemplate = parseAddressTemplate(generalPrefData?.organization_address_format, ActiveBranch?.company);

  const [showPreview, setShowPreview] = useState<previewState>({ show: false });
  const [showTemplateListing, setShowTemplateListing] = useState<boolean>(true);
  const [templateGroup, setTemplateGroup] = useState<TemplateGroupTypes>(
    (searchParams?.get("template_group")! as TemplateGroupTypes) ?? "sales_invoice"
  );

  /* ########################################################################################### */

  let paperWidth;
  const paperSize = showPreview?.template?.propertiesState?.pageSize || "A4";

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

  const setDefaultTemplate = async (id: any) => {
    const res = await appDispatch(
      patchAction({apiUrl: Urls.templates, params:{ is_default: true }, id}) as any
    ).unwrap();
      handleResponse(res, async() => {
        await getTemplates();
        ERPToast.show("Selected template has been set as default.", "success");
      });
  };

  const handleDeleteTemplate = async (temp: any) => {
    if (temp?.is_default) {
      ERPToast.show("Default template cannot be deleted.", "warning");
    } else if (temp?.is_primary) {
      ERPToast.show("Primary template cannot be deleted.", "warning");
    } else {
      showAlert(
        "Delete",
        "Are you sure about deleting the template ?",
        [{ text: "Delete", type: "danger" }, "Cancel"],
        async(index: any) => {
          if (index == 0) {
            var res = await appDispatch(deleteAction({apiUrl:Urls.templates, id:temp?.id}) as any).unwrap();
              handleResponse(res, () => {
                getTemplates();
                ERPToast.show("Template deleted successfully", "success");
              });
          }
        },
        null,
        null,
        <div className="bg-[#FEE2E2] rounded-full w-10 h-10 flex justify-center items-center mr-2">
          <TrashIcon className="text-red-500 w-5" />
        </div>
      );
    }
  };

  const getTemplates = async () => {
    debugger;
    setLoading(true);
    var res = await api.getAsync(Urls.templates,`template_group=${templateGroup}`);
    handlePlainResponse(res,() => {
      setTempData(res);
    },undefined, false, false)
      setLoading(false);
      
      var resCrm = await api.getAsync(Urls.crm_templates,`template_group=${templateGroup}`);
      handlePlainResponse(resCrm,() => {
        setTempCRMData(resCrm);
      },undefined, false, false)
  };

  useEffect(() => {
    setTempData([]);
    getTemplates();
  }, [templateGroup]);

  /* ########################################################################################### */

  // console.log("Template_data", tempData, templateGroup);

  /* ########################################################################################### */

  return (
    <>
      {showTemplateListing ? (
        <div className="flex h-full overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark ">
          <div className=" md:w-[200px] lg:w-[300px] ltr:border-r rtl:border-l h-full">
            <h1 className=" font-medium text-xl p-5 mb-5">Templates</h1>
            <div className="flex flex-col overflow-auto pb-24 h-full">
              {TemplateTypes.map((template, index) => (
                <div
                  key={`tt_${index}`}
                  tabIndex={0}
                  onClick={() => {
                    setSearchParams({ template_group: template?.template_group_id });
                    setTemplateGroup(template?.template_group_id);
                  }}
                  className={`cursor-pointer  flex px-5 p-2  first:border-t  gap-2 items-center ${searchParams?.get("template_group") === template?.template_group_id ? " bg-gray-100" : "hover:bg-gray-50"
                    }`}
                >
                  <div>
                    <h1 className=" text-sm">{template.name}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 h-full">
            <div className="flex items-center justify-between p-5">
              <h1 className=" font-medium text-xl capitalize">{templateGroup?.replaceAll("_", " ")} Templates</h1>
              <div>
                <ERPSubmitButton onClick={() => setShowTemplateListing(false)} className="max-w-min" variant="primary">
                  <PlusIcon className=" w-4 h-4" />
                  New
                </ERPSubmitButton>
              </div>
            </div>
            <div>
              <div className="flex gap-4 flex-wrap p-5">
                {loading && (
                  <>
                    <div className="md:w-[140px] lg:w-[200px] aspect-[2.3/3] shimmer bg-gray-200 rounded text-xs flex justify-center items-center h-full"></div>
                  </>
                )}

                {tempData?.map((temp: any) => {
                  const paperSize = temp?.content?.propertiesState?.pageSize;
                  const thumbImage = paperSize === "3Inch" || paperSize === "4Inch" ? retailStdTempImage : stdTempImage;
                  return (
                    <div
                      key={`ti_${temp?.id}`}
                      tabIndex={0}
                      onClick={() => { }}
                      className=" relative hover:ring-0 hover:shadow-xl cursor-pointer 100px md:w-[140px] lg:w-[200px] aspect-[2.3/3] border border-accent/30 rounded"
                    >
                      <div className=" relative">
                        <img
                          src={temp?.templateImage ?? thumbImage}
                          alt=""
                          className=" antialiased border-0 bg-gray-50 object-top object-cover w-full aspect-[2/2] "
                        />
                        <div className=" bg-gradient-to-b from-white/0 via-white/10 to-black/10 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
                          <div
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPreview({ show: true, template: temp?.content });
                            }}
                            className=" flex hover:shadow-md items-center aspect-square m-3 hover:bg-accent bg-accent/60 py-1 px-3 rounded-full text-sm text-white"
                          >
                            <a>Preview</a>
                          </div>

                          {temp?.is_primary && (
                            <div
                              className="absolute top-0 left-0 w-0 h-0 text-xs
                              border-t-[20px] border-t-accent border-r-[20px] border-r-transparent  
                              border-l-[20px] border-l-accent border-b-[20px] border-b-transparent"
                            >
                              <SparklesIcon className="h-4 -mt-[16px] -ml-[16px] text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="px-2 py-3">
                        <h1 className="font-medium text-xs capitalize break-words truncate" title={temp?.content?.propertiesState?.templateName}>
                          {temp?.content?.propertiesState?.templateName}
                        </h1>
                        <div className="flex text-xs justify-between mt-1">
                          {temp?.is_default ? (
                            <div className="bg-green-500 text-white text-[10px] px-2 py-1 rounded">Default</div>
                          ) : (
                            <div className="bg-accent text-white text-[10px] px-2 py-1 rounded" onClick={() => setDefaultTemplate(temp?.id)}>
                              Set as Default
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {!temp?.is_primary && (
                              <div>
                                <PencilIcon
                                  title="Edit"
                                  className="w-3 text-accent cursor-pointer"
                                  onClick={() => navigate(`/templates/invoice_designer/${temp?.id}?template_group=${templateGroup}`)}
                                />
                              </div>
                            )}
                            {!temp?.is_primary && (
                              <div>
                                <TrashIcon title="Delete" className="w-4 text-red-500 cursor-pointer" onClick={() => handleDeleteTemplate(temp)} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className=" relative hover:ring-0 hover:shadow-xl cursor-pointer  md:w-[140px] lg:w-[200px] aspect-[2.3/3] border border-accent/30 rounded">
                  <div className="px-2 py-3 flex flex-col justify-center h-full">
                    <h1 className="font-medium text-xs capitalize break-words truncate ">New Template</h1>
                    <h2 className="text-[11px] capitalize break-words py-2">
                      Click to add a template from our gallery. You can customize the template title, columns, and headers in line item table.
                    </h2>
                    <ERPSubmitButton onClick={() => setShowTemplateListing(false)} className="max-w-min" variant="primary">
                      <PlusIcon className=" w-4 h-4" />
                      New
                    </ERPSubmitButton>
                  </div>
                </div>

                <PSModel isOpen={showPreview.show} closeModal={() => setShowPreview({ show: false })}>
                  <div>
                    <div className=" relative text-lg border-b text-center py-2 font-medium">
                      <h1>{showPreview.template?.propertiesState?.templateName}</h1>
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
                        style={{
                          backgroundColor: showPreview.template?.propertiesState?.bg_color || "#fff",
                        }}
                        className={`flex  flex-col gap-4 relative  ${paperWidth} shadow-md print:m-0 print:w-full print:shadow-none`}
                      >
                        {paperSize === "3Inch" || paperSize === "4Inch" ? (
                          <RetailPreviewWrapper
                            data={DummyInvoiceData}
                            template={showPreview.template}
                            currency={currencySymbol || undefined}
                            company={ActiveBranch?.company}
                            templateGroupId={templateGroup}
                            addressTemplates={{ orgAddressTemplate }}
                          />
                        ) : (
                          <StandardPreviewWrapper
                            data={DummyInvoiceData}
                            template={showPreview.template}
                            company={ActiveBranch?.company}
                            currency={currencySymbol || undefined}
                            templateGroupId={templateGroup}
                            addressTemplates={{ orgAddressTemplate }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </PSModel>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ChooseTemplate templateGroup={templateGroup} setShowTemplateListing={setShowTemplateListing} tempData={tempCrmData} />
      )}
    </>
  );
};

export default Templates;

interface ChooseTemplateProps {
  templateGroup: TemplateGroupTypes;
  setShowTemplateListing: any;
  tempData: any;
}

const ChooseTemplate = ({ templateGroup, setShowTemplateListing, tempData }: ChooseTemplateProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleChooseTemplate = async (template: TemplateState) => {
    const length = tempData?.length || 0;

    const newTData = {
      signature_image: null,
      background_image: null,
      background_image_header: null,
      background_image_footer: null,
    }
    debugger;
    let res = await api.getAsync(`${Urls.crm_templates}${template.id}`);
    debugger;
    const propertiesState = {
       ...res.propertiesState, 
       templateName: "Untitled Template " + (length + 1) 
      };
    const _template  = {
      ...res,
      id:null,
      templateName:"",
      propertiesState: propertiesState
    }
    dispatch(
      setTemplate(
        _template
    ));
    navigate(`/templates/invoice_designer/new?template_group=${templateGroup}`);
  };

  return (
    <div className="text-xs p-5">
      <div className="flex justify-between text-base">
        <div>Choose a template</div>
        <div className="cursor-pointer" onClick={() => setShowTemplateListing(true)}>
          X
        </div>
      </div>
      <div className="my-3 text-sm border-b">
        <div className="border-b-2 border-accent max-w-min">All</div>
      </div>
      <div>
        <div className="py-2">STANDARD</div>
        <div className="flex gap-4 flex-wrap p-5">
          {tempData
            ?.map((template: any, index: number) => {
              const paperSize = template?.content?.propertiesState?.pageSize;
              const thumbImage = paperSize === "3Inch" || paperSize === "4Inch" ? retailStdTempImage : stdTempImage;
              return (
                <div
                  key={`ti_${index}`}
                  tabIndex={0}
                  className=" relative hover:ring-2 hover:shadow-md  100px md:w-[140px] lg:w-[200px] aspect-[2.3/3] border rounded border-gray-400"
                >
                  <div className=" relative">
                    <img
                      src={template?.templateImage ?? thumbImage}
                      alt=""
                      className=" antialiased border-0 bg-gray-50 object-top object-cover w-full aspect-[2/2] "
                    />
                    <div className="bg-gradient-to-b from-white/0 via-white/10 to-black/10 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center"></div>
                  </div>
                  <div className="flex flex-col justify-center items-center text-center py-3">
                    <h1 className="font-medium text-xs capitalize break-words">{template?.templateName}</h1>
                    <div
                      className="bg-primary cursor-pointer rounded text-white mt-2 p-2 max-w-min whitespace-nowrap"
                      onClick={() => handleChooseTemplate(template)}
                    >
                      Use this
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div></div>
      </div>
    </div>
  );
};
