import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import stdTempImage from "../../assets/images/templates/Invoice_std.png";
import retailStdTempImage from "../../assets/images/templates/Retail_stadard.png";
import { TemplateState } from "./Designer/interfaces";
import { DummyVoucherData } from "./constants/DummyData";
import { TemplateTypes } from "./constants/TemplateCategories";
import { getCurrentCurrencySymbol } from "../../utilities/Utils";
import ERPToast from "../../components/ERPComponents/erp-toast";
import { handlePlainResponse, handleResponse } from "../../utilities/HandleResponse";
import ERPSubmitButton from "../../components/ERPComponents/erp-submit-button";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import Urls from "../../redux/urls";
import { setTemplate } from "../../redux/slices/templates/reducer";
import { APIClient } from "../../helpers/api-client";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import VoucherType from "../../enums/voucher-types";
import { customJsonParse } from "../../utilities/jsonConverter";
import { ERPScrollArea } from "../../components/ERPComponents/erp-scrollbar";

interface previewState {
  show: boolean;
  template?: TemplateState;
}

interface ChooseTemplateProps {
  templateGroup: VoucherType | string;
  setShowTemplateListing: any;
  tempData: any;
}

const api = new APIClient();

const ChooseTemplate = ({ templateGroup, setShowTemplateListing, tempData }: ChooseTemplateProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("system");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Group templates by templateType and get counts
  const groupedTemplates = useMemo(() => {
    if (!tempData) return {};
    
    return tempData.reduce((acc: any, template: TemplateState) => {
      const type = template.templateType || "standard";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(template);
      return acc;
    }, {});
  }, [tempData]);

  // Get available template types with counts
  const templateTypes = useMemo(() => {
    const types = Object.keys(groupedTemplates);
    const allCount = tempData?.length || 0;
    
    return [
      { key: "all", label: t("all"), count: allCount },
      ...types.map(type => ({
        key: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        count: groupedTemplates[type]?.length || 0
      }))
    ];
  }, [groupedTemplates, tempData, t]);

  // Get filtered templates based on active tab
  const filteredTemplates = useMemo(() => {
    if (activeTab === "all") {
      return tempData || [];
    }
    return groupedTemplates[activeTab] || [];
  }, [activeTab, tempData, groupedTemplates]);

  const handleChooseTemplate = async (template: TemplateState) => {
    const length = tempData?.length || 0;
    let res = await api.getAsync(`${Urls.crm_templates}${template.id}`);
    let cc: TemplateState = customJsonParse(res.content);
    
    const propertiesState = {
      ...cc.propertiesState,
      templateName: t("untitled_template") + (length + 1)
    };
    
    const newTemplate = {
      ...cc,
      id: null,
      templateName: "",
      propertiesState: propertiesState
    };
    
    dispatch(setTemplate(newTemplate));
    
    const state = template?.templateType ? { 
      templateKind: template?.templateKind,
      templateType: template?.templateType,
    } : {};
    
    templateGroup == "barcode" ? 
      navigate(`/label-designer/new?template_group=${templateGroup}`) :
      navigate(`/invoice_designer/new?template_group=${templateGroup}`, { state });
  };

  return (
    <div className="text-xs p-5">
      {/* Header */}
      <div className="flex justify-between text-base mb-4">
        <div className="font-medium text-xl ">{t("choose_a_template")}</div>
        <div className="cursor-pointer bg-black w-7 h-7 rounded-full text-white flex items-center justify-center" onClick={() => setShowTemplateListing(true)}>
          X
        </div>
      </div>

      {/* Template Type Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {templateTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setActiveTab(type.key)}
              className={`py-3 px-1 border-b-4 font-medium text-sm transition-colors relative ${
                activeTab === type.key
                  ? 'border-[#3b82f6] rounded-b-sm text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-700'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Template Grid */}
      <div>
        {/* <div className="py-2">{activeTab === "all" ? t("standard") : activeTab.toUpperCase()}</div> */}
        
        <div className="flex gap-4 flex-wrap p-5">
          {filteredTemplates.map((template: TemplateState, index: number) => {
            console.log('Template data:', {
              id: template?.id,
              templateName: template?.templateName,
              thumbImage: template?.thumbImage ? template.thumbImage.substring(0, 50) + '...' : 'No thumbImage',
              hasThumbImage: !!template?.thumbImage
            });
            
            return (
              <div
                key={`ti_${template.id}_${index}`}
                tabIndex={0}
                className="relative hover:ring-2 hover:shadow-md cursor-pointer w-[100px] md:w-[140px] lg:w-[200px] aspect-[2.3/3] border rounded border-gray-400"
              >
                {/* Template Preview */}
                <div className="relative">
                  <img
                    src={template?.thumbImage || `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">No Preview</text></svg>')}`}
                    alt={template?.templateKind || template?.templateName}
                    style={{ objectFit: 'scale-down' }}
                    className="antialiased border-0 bg-gray-50 object-top object-cover w-full aspect-[2/2]"
                    onError={(e) => {
                      console.log('Image load error for template:', template?.id, template?.thumbImage);
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">Preview Error</text></svg>')}`;
                    }}
                  />
                  
                  {/* Template Type Badge */}
                  {/* {template?.templateType && template.templateType !== "standard" && ( */}
                    {/* <div className="absolute top-[0px] right-[0px] rounded-bl-[15px] bg-primary text-white text-xs px-2 py-1 capitalize">
                      {template.templateType}
                    </div> */}
                  {/* )} */}
                  
                  <div className="bg-gradient-to-b from-white/0 via-white/10 to-black/10 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center"></div>
                </div>

                {/* Template Info */}
                <div className="flex flex-col justify-center items-center text-center py-3">
                  <h1 className="font-medium text-xs capitalize break-words mb-2">
                    {template?.templateKind || template?.templateName}
                  </h1>
                  
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

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg mb-2">📄</div>
            <div className="text-sm">
              {t("no_templates_found", { type: activeTab === "all" ? "" : activeTab })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [accountVoucher, setAccountVoucher] = useState(DummyVoucherData)
  const [maxSidePage, setMaxSidePage] = useState<number>(500);

  useEffect(() => {
    let wh = window.innerHeight;
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

  const setDefaultTemplate = async (id: any) => {
    const res = await api.patch(`${Urls.templates}${id}`, {});
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
        var res = await api.delete(`${Urls.templates}${temp?.id}`);
        handleResponse(res, () => {
          getTemplates();
        });
      } else {
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
        <div className="flex h-full overflow-hidden text-black dark:text-white dark:!bg-dark-bg bg-white dark:bg-body_dark ">
          <ERPScrollArea className={`overflow-y-auto overflow-x-hidden md:w-[200px] lg:w-[300px] ltr:border-r rtl:border-l h-full `}
            maxHeight={`${maxSidePage - 60}px`}>
            <h1 className="font-medium text-xl p-5 mb-5">{t("templates")}</h1>

            {/* className={`  flex h-auto  flex-col gap-1`}> */}
            <div className="flex flex-col overflow-auto pb-24 h-full">
              {TemplateTypes.map((template, index) => (
                <div
                  key={`tt_${index}`}
                  tabIndex={0}
                  onClick={() => { setSearchParams({ template_group: template?.template_group_id }); setTemplateGroup(template?.template_group_id) }}
                  className={`cursor-pointer  flex px-5 p-2  first:border-t  gap-2 items-center ${searchParams?.get("template_group") === template?.template_group_id ? "dark:bg-dark-text dark:text-dark-hover-text  bg-gray-100" : "hover:bg-gray-50 dark:hover:bg-dark-hover-bg"}`}>
                  <div>
                    <h1 className="text-sm">{t(template.name)}</h1>
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
                      className="group  relative hover:ring-0 hover:shadow-xl cursor-pointer 100px md:w-[140px] lg:w-[200px] aspect-[2.3/3] border border-accent/30 rounded">
                      <div className="relative group">
                        <img
                          src={temp?.thumbImage}
                          style={{ objectFit: 'scale-down' }}
                          alt=""
                          className=" antialiased border-0 bg-gray-50 object-top object-cover w-full aspect-[2/2] "
                        />
                         <div className="absolute top-[0px] right-[0px] rounded-bl-[15px] bg-primary/50 group-hover:bg-primary text-white text-xs px-2 py-1 capitalize">
                          {temp?.templateType}
                        </div>
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
                            <div className="ti-btn hover:bg-primary dark:!border-dark-border dark:!bg-dark-bg bg-gray-400 hover:text-white  !text-[10px] !px-2 !py-1 rounded" onClick={() => setDefaultTemplate(temp?.id)}>
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
                                onClick={() => templateGroup == "barcode" ? navigate(`/label-designer/${temp?.id}?template_group=${templateGroup}`) : navigate(`/invoice_designer/${temp?.id}?template_group=${templateGroup}`, { state: { templateKind: temp?.templateKind ,templateType: temp?.templateType,} })}
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

                <div className=" relative hover:ring-0 hover:shadow-xl cursor-pointer  md:w-[140px] lg:w-[200px] aspect-[2.3/3] border dark:!border-dark-border border-accent/30 rounded">
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