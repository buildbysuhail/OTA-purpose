import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PlusIcon, TrashIcon, PencilIcon, SparklesIcon } from "@heroicons/react/24/outline";
import stdTempImage from "../../assets/images/templates/Invoice_std.png";
import retailStdTempImage from "../../assets/images/templates/Retail_stadard.png";
import { TemplateState } from "./Designer/interfaces";
import { DummyInvoiceData, DummyVoucherData } from "./constants/DummyData";
import StandardPreviewWrapper from "./DesignPreview/StandardPreview";
import RetailPreviewWrapper from "./DesignPreview/RetailPreview/PreviewWrapper";
import { TemplateTypes } from "./constants/TemplateCategories";
import { getCurrentCurrencySymbol } from "../../utilities/Utils";
import ERPToast from "../../components/ERPComponents/erp-toast";
import { handlePlainResponse, handleResponse } from "../../utilities/HandleResponse";
import ERPSubmitButton from "../../components/ERPComponents/erp-submit-button";
import PSModel from "../../components/common/polosys/ps-modal";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { patchAction } from "../../redux/slices/app-thunks";
import Urls from "../../redux/urls";
import { setTemplate } from "../../redux/slices/templates/reducer";
import { APIClient } from "../../helpers/api-client";
import { t } from "i18next";
import { Url } from "devextreme-react/cjs/chart";
import { useTranslation } from "react-i18next";
import AccountPreviewWrapper from "./DesignPreview/AccountPreview";
import VoucherType from "../../enums/voucher-types";
import { customJsonParse } from "../../utilities/jsonConverter";
import { ERPScrollArea } from "../../components/ERPComponents/erp-scrollbar";

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
  const [showPreview, setShowPreview] = useState<previewState>({ show: false });
  const [showTemplateListing, setShowTemplateListing] = useState<boolean>(true);
  // const [templateGroup, setTemplateGroup] = useState<TemplateGroupTypes>(
  //   (searchParams?.get("template_group")! as TemplateGroupTypes) ?? "sales_invoice"
  // );
  const [templateGroup, setTemplateGroup] = useState<VoucherType | string>(
    (searchParams?.get("template_group")! as VoucherType | string) ?? "SI"
  );
  const [accountVoucher,setAccountVoucher]=useState(DummyVoucherData)
  /* ########################################################################################### */
  const [maxSidePage, setMaxSidePage] = useState<number>(500);

  useEffect(() => {
    let wh= window.innerHeight; 
    setMaxSidePage(wh);
  }, []);

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
    const res = await api.patch(`${Urls.templates}${id}`,{});
    handleResponse(res, async () => {
      await getTemplates();
    });
  };

  const handleDeleteTemplate = async (temp: any) => {
    if (temp?.is_default) {
      ERPToast.show("Default template cannot be deleted.", "warning");
    } else if (temp?.is_primary) {
      ERPToast.show("Primary template cannot be deleted.", "warning");
    } else {
      const confirmDelete = window.confirm("Are you sure about deleting the template?");
      if (confirmDelete) {
        console.log("Deleting template with ID:", temp?.id);
        var res = await api.delete(`${Urls.templates}${temp?.id}`);
        console.log("Delete action response:", res);
        handleResponse(res, () => {
          getTemplates();
        });
      } else {
        console.log("Deletion canceled");
      }
    }
  };

  const getTemplates = async () => {
    setLoading(true);
    var res = await api.getAsync(Urls.templates, `template_group=${templateGroup}`);
    handlePlainResponse(res, () => {
      setTempData(res);
    }, undefined, false, false)
    setLoading(false);

    var resCrm = await api.getAsync(Urls.crm_templates, `template_group=${templateGroup}`);
    handlePlainResponse(resCrm, () => {
      setTempCRMData(resCrm);
    }, undefined, false, false)
  };

  useEffect(() => {
  
    setTempData([]);
    getTemplates();
  }, [templateGroup]);

  const { t } = useTranslation("system");
  return (
    <>
      {showTemplateListing ? (
        <div className="flex h-full overflow-hidden text-black dark:text-white bg-white dark:bg-body_dark ">
          <ERPScrollArea className={`overflow-y-auto overflow-x-hidden md:w-[200px] lg:w-[300px] ltr:border-r rtl:border-l h-full `}
          maxHeight={`${maxSidePage-60}px`}>
            <h1 className=" font-medium text-xl p-5 mb-5">{t("templates")}</h1>
                 
                {/* className={`  flex h-auto  flex-col gap-1`}> */}
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
          </ERPScrollArea>

          <div className="flex-1 h-full">
            <div className="flex items-center justify-between p-5">
              <h1 className=" font-medium text-xl capitalize">{templateGroup?.replaceAll("_", " ")} {t("templates")}</h1>
              <div>
                <ERPSubmitButton onClick={() => setShowTemplateListing(false)} className="max-w-min" variant="primary">
                  <PlusIcon className="w-4 h-4" />
                  {t("new")}
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
                  return (
                    <div
                      key={`ti_${temp?.id}`}
                      tabIndex={0}
                      onClick={() => { }}
                      className=" relative hover:ring-0 hover:shadow-xl cursor-pointer 100px md:w-[140px] lg:w-[200px] aspect-[2.3/3] border border-accent/30 rounded"
                    >
                      <div className="relative group">
                        <img
                          src={temp?.thumbImage}
                          style={{ objectFit: 'scale-down' }} 
                          alt=""
                          className=" antialiased border-0 bg-gray-50 object-top object-cover w-full aspect-[2/2] "
                        />
                        {/* <div className=" bg-gradient-to-b from-white/0 via-white/10 to-black/10 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
                          <div
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPreview({ show: true, template: temp });
                            }}
                            className=" flex hover:shadow-md items-center aspect-square m-3 hover:bg-accent bg-accent/60 py-1 px-3 rounded-full text-sm text-white"
                          >
                            <a>{t("preview")}</a>
                          </div>
                        </div> */}
                      </div>
                      <div className="px-2 py-3">
                        <h1 className="font-medium text-xs capitalize break-words truncate" title={temp?.templateName}>
                          {temp?.templateName}
                          
                        </h1>
                        <div className="flex text-xs justify-between mt-1">
                          {temp?.isCurrent ? (
                            <div className="ti-btn bg-primary text-white !text-[10px] !px-2 !py-1 rounded ">{t("default")}</div>
                          ) : (
                            <div className="ti-btn hover:bg-primary bg-gray-400 hover:text-white  !text-[10px] !px-2 !py-1 rounded" onClick={() => setDefaultTemplate(temp?.id)}>
                              {t("set_as_default")}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <div>
                              <PencilIcon
                                title={t("edit")}
                                className="w-3 text-accent cursor-pointer"
                                // onClick={() => navigate(`/label-designer/${temp?.id}?template_group=${templateGroup}`)}
                                // onClick={() => navigate(`/label-designer/${temp?.id}`)}
                                onClick={() => templateGroup == "barcode" ?  navigate(`/label-designer/${temp?.id}?template_group=${templateGroup}`) : navigate(`/invoice_designer/${temp?.id}?template_group=${templateGroup}`)}
                              />
                            </div>
                            <div>
                              <TrashIcon title={t("delete")} className="w-4 text-red cursor-pointer" onClick={() => handleDeleteTemplate(temp)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className=" relative hover:ring-0 hover:shadow-xl cursor-pointer  md:w-[140px] lg:w-[200px] aspect-[2.3/3] border border-accent/30 rounded">
                  <div className="px-2 py-3 flex flex-col justify-center h-full">
                    <h1 className="font-medium text-xs capitalize break-words truncate ">{t("new_template")}</h1>
                    <h2 className="text-[11px] capitalize break-words py-2">
                      {t("click_to_add")}
                    </h2>
                    <ERPSubmitButton onClick={() => setShowTemplateListing(false)} className="max-w-min" variant="primary">
                      <PlusIcon className=" w-4 h-4" />
                      {t("new")}
                    </ERPSubmitButton>
                  </div>
                </div>

                {/* <PSModel isOpen={showPreview.show} closeModal={() => setShowPreview({ show: false })}>
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
                        
                        {TemplateTypes.map((type) =>
                          type.id >= 4 ? (
                            <AccountPreviewWrapper
                              key={type.id}
                              data={accountVoucher}
                              template={showPreview.template}
                              currency={currencySymbol || undefined}
                              templateGroupId={templateGroup}
                              docTitle={type.name}
                            />
                          ) : paperSize === "3Inch" || paperSize === "4Inch" ? (
                            <RetailPreviewWrapper
                              key={type.id}
                              data={DummyInvoiceData}
                              template={showPreview.template}
                              currency={currencySymbol || undefined}
                              templateGroupId={templateGroup}
                            />
                          ) : (
                            <StandardPreviewWrapper
                              key={type.id}
                              data={DummyInvoiceData}
                              template={showPreview.template}
                              currency={currencySymbol || undefined}
                              templateGroupId={templateGroup}
                            />
                          )
                        )}

                      </div>
                    </div>
                  </div>
                </PSModel> */}
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
  templateGroup: VoucherType | string;
  setShowTemplateListing: any;
  tempData: any;
}

// interface ChooseTemplateProps {
//   templateGroup: TemplateGroupTypes;
//   setShowTemplateListing: any;
//   tempData: any;
// }

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

    let res = await api.getAsync(`${Urls.crm_templates}${template.id}`);
    let cc: TemplateState = customJsonParse(res.content)
    
    const propertiesState = {
      ...cc.propertiesState,
      templateName: "Untitled Template " + (length + 1)
    };
    const _template = {
      ...cc,
      id: null,
      templateName: "",
      propertiesState: propertiesState
    }
    dispatch(
      setTemplate(
        _template
      ));
       templateGroup == "barcode" ? navigate(`/label-designer/new?template_group=${templateGroup}`) : navigate(`/invoice_designer/new?template_group=${templateGroup}`);
    //  navigate(`/label-designer/new?template_group=${templateGroup}`) 
  };

  return (
    <div className="text-xs p-5">
      <div className="flex justify-between text-base">
        <div>{t("choose_a_template")}</div>
        <div className="cursor-pointer" onClick={() => setShowTemplateListing(true)}>
          X
        </div>
      </div>
      <div className="my-3 text-sm border-b">
        <div className="border-b-2 border-accent max-w-min">{t("all")}</div>
      </div>
      <div>
        <div className="py-2">{t("standard")}</div>
        <div className="flex gap-4 flex-wrap p-5">
          {tempData
            ?.map((template: TemplateState, index: number) => {
              
              const paperSize = template?.propertiesState?.pageSize;
              const thumbImage = paperSize === "3Inch" || paperSize === "4Inch" ? retailStdTempImage : stdTempImage;
              return (
                <div
                  key={`ti_${index}`}
                  tabIndex={0}
                  className=" relative hover:ring-2 hover:shadow-md  100px md:w-[140px] lg:w-[200px] aspect-[2.3/3] border rounded border-gray-400"
                >
                  <div className=" relative">
                    <img
                      src={template?.thumbImage ?? thumbImage}
                      alt=""
                      style={{ objectFit: 'scale-down' }} 
                      className="antialiased border-0 bg-gray-50 object-top object-cover w-full aspect-[2/2]"
                    />
                    <div className="bg-gradient-to-b from-white/0 via-white/10 to-black/10 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center"></div>
                  </div>
                  <div className="flex flex-col justify-center items-center text-center py-3">
                    <h1 className="font-medium text-xs capitalize break-words">{template?.propertiesState?.templateName}</h1>
                    <div
                      className="bg-primary cursor-pointer rounded text-white mt-2 p-2 max-w-min whitespace-nowrap"
                      onClick={() => handleChooseTemplate(template)}
                    >
                      {t("use_this")}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
