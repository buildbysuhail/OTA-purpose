import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";
import { FooterState, HeaderState } from "./interfaces";
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPSlider from "../../../components/ERPComponents/erp-slider";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ErpDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { handleSetTemplateBackgroundImageFooter, handleSetTemplateBackgroundImageHeader, setTemplateFooterState, setTemplateHeaderState } from "../../../redux/slices/templates/reducer";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { toggleCustomDesignerPopup } from "../../../redux/slices/popup-reducer";
import CustomDesignerButton from "./customDesignerButton";
import useLogo from "../utils/useLogo";


interface TempImageProps {
}

interface FooterDesignerProps {

    tempImages?: TempImageProps;
    footerState?: FooterState;
    headerState?: HeaderState;
}

const HeaderDesigner = ({}: FooterDesignerProps) => {
    const inputFile = useRef<HTMLInputElement>(null);
    const inputFooterFile = useRef<HTMLInputElement>(null);
    const [searchParams] = useSearchParams();
    const userSession = useSelector((state: RootState) => state?.UserSession);
    const userBranches = useAppSelector((state: RootState) => state.UserBranches);
    const templateGroup = searchParams?.get("template_group");
    const [maxHeight, setMaxHeight] = useState<number>(500);
    const { t } = useTranslation('system');
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        let wh = window.innerHeight;
        setMaxHeight(wh);
    }, []);

    /* ######################################################################################### */
    const templateData = useSelector((state: RootState) => state?.Template) 
    const headerState = templateData?.activeTemplate?.headerState || {};
    const footerState = templateData?.activeTemplate?.footerState || {};
    const dispatch = useDispatch();
    const handleChange = (type: "header" | "footer", key: keyof HeaderState  | keyof FooterState, value: string | number | boolean) => {
        if (type === "header") {
            dispatch(setTemplateHeaderState({ ...headerState, [key]: value }));
        } else {
            dispatch(setTemplateFooterState({ ...footerState, [key]: value }));
        }
    }
    const Logo = useLogo()
    return (
        <ERPScrollArea
            className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>
            <div className={"transition-all  flex flex-col gap-5 bg-white p-4"}>
                <div className="flex justify-between items-center  border-b  bg-[#80808012] p-2"> 
                  <h6 className="">{t("header")}</h6>
                   {/* <CustomDesignerButton 
                    LabelBefore="Add Before Header"
                    LabelAfter="Add After Header"
                    customFieldMaster={"headerState"}
                    dispatch={dispatch}
                    t={t}
                    className=""
                    /> */}
                </div>
                 <ERPCheckbox
                    id="showHeader"
                    label={t("show_header")}
                    checked={headerState?.showHeader}
                    onChange={(e) => handleChange("header", "showHeader", e.target.checked)}
                />
        
                <ERPCheckbox
                    id="showLogo"
                    label={t("show_organization_logo")}
                    checked={headerState?.showLogo}
                    onChange={(e) => handleChange("header", "showLogo", e.target.checked)}
                />

                   {headerState?.showLogo &&  (
                    Logo ? (
                           <div className="flex flex-col gap-2">
                            <img src={Logo} className="border border-dashed mb-2 h-16 w-full object-contain" />

                            <div className="flex items-center space-x-3">
                            <div className="basis-2/3 ">
                              <ERPSlider
                              id="logoSize"
                                label={t("logo_size")}
                                defaultValue={headerState?.logoSize}
                                onChange={(e) => handleChange("header", "logoSize", e.target?.value)}
                                className="bg-slate-300"
                                value={headerState?.logoSize??10}
                                min={5}
                                max={28}
                                step={1}
                              />
                            </div>
                            <div className="basis-1/3 translate-y-3">
                              <ERPInput
                                id="logoSize"
                                type="number"
                                noLabel
                                value={headerState?.logoSize??10}
                                data={headerState}
                                onChange={(e) => {
                                  const value = e.target.value;
                              
                                   handleChange("header", "logoSize",  parseInt(value, 10))
                                }
                                }
                            
                               min={5}
                               max={28}
                               step={1}
                              />
                            </div>
                          </div>
                          
                        </div>
                    ):(
                    <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-md text-center text-sm text-gray-500 bg-gray-50">
                        <span className="font-medium text-gray-700">
                        No logo set
                        </span>
                        <span className="text-xs text-gray-600">
                        You can upload your company logo in <strong>Account Settings</strong> to personalize your ERP workspace.
                        </span>
                    </div>                     
                    )
                    )}
                        

               
                        <ERPCheckbox
                            id="showOrgName"
                            checked={headerState?.showOrgName}
                            label={t("show_organization_name")}
                            onChange={(e) => handleChange("header", "showOrgName", e.target.checked)}
                        />
                        <ERPCheckbox
                            id="showOrgAddress"
                            checked={headerState?.showOrgAddress}
                            label={t("show_organization_address")}
                            onChange={(e) => handleChange("header", "showOrgAddress", e.target.checked)}
                        />

                        <ERPInput
                            data={headerState}
                            value={headerState?.OrganizationFontColor}
                            onChange={(e) => handleChange("header", "OrganizationFontColor", e.target?.value)}
                            label={t("font_color")}
                            id="OrganizationFontColor"
                            type="color"
                            placeholder=""
                        />
                        <ERPStepInput
                            data={headerState}
                            value={headerState?.OrganizationFontSize ?? 12}
                            onChange={(value) => handleChange("header", "OrganizationFontSize", value)}
                            label={t("font_size_(pts)")}
                            id="OrganizationFontSize"
                            placeholder=" "
                            min={8}
                            max={28}
                            step={1}
                        />
                            <div className="flex flex-col gap-2">
                            <ERPCheckbox
                                id="hasEmailField"
                                label={t("email")}
                                checked={headerState?.hasEmailField}
                                onChange={(e) => handleChange("header", "hasEmailField", e.target?.checked)}
                            />
                            {headerState?.hasEmailField && (
                                <ERPInput
                                    id="email"
                                    noLabel
                                    value={headerState?.emailLabel}
                                    onChange={(e) => handleChange("header", "emailLabel", e.target?.value)}
                                />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <ERPCheckbox
                                id="hasPhoneField"
                                label={t("phone")}
                                checked={headerState?.hasPhoneField}
                                onChange={(e) => handleChange("header", "hasPhoneField", e.target?.checked)}
                            />
                            {headerState?.hasPhoneField && (
                                <ERPInput
                                    id="phone"
                                    noLabel
                                    value={headerState?.phoneLabel}
                                    onChange={(e) => handleChange("header", "phoneLabel", e.target?.value)}
                                />
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <ERPCheckbox
                                id="hasfaxField"
                                label={t("fax_number")}
                                checked={headerState?.hasfaxField}
                                onChange={(e) => handleChange("header", "hasfaxField", e.target?.checked)}
                            />
                            {headerState?.hasfaxField && (
                                <ERPInput
                                    id="fax"
                                    noLabel
                                    value={headerState?.faxLabel}
                                    onChange={(e) => handleChange("header", "faxLabel", e.target?.value)}
                                />
                            )}
                        </div>
                        
             
            </div>
         <div className="transition-all  flex flex-col gap-5 bg-white p-4">
                {/* <h6 className="bg-[#80808012] p-[2px]">{t("document_title")}</h6> */}
                 <div className="flex flex-col gap-2">
                              <ERPCheckbox
                                checked={headerState?.showDocTitle}
                                id="showDocTitle" label="Document Title"
                                onChange={(e) => handleChange( "header", "showDocTitle", e.target.checked )}
                              />
                              {headerState?.showDocTitle && (
                                <div className="flex items-center gap-2">
                           
                              <ERPCheckbox
                                checked={headerState?.docTitleUnderline}
                                id="docTitleUnderline" label="Title Underline"
                                 onChange={(e) => handleChange( "header", "docTitleUnderline", e.target.checked )}
                              />
                                  <ERPInput
                                  className="w-full"
                                  id="docTitle"
                                  noLabel
                                  value={headerState?.docTitle}
                                  onChange={(e) => handleChange( "header", "docTitle", e.target?.value )}
                                />  
                                </div>
                              
                              )}
                            </div>
                         
                
                          <ERPInput
                            value={headerState?.docTitleFontColor}
                             onChange={(e) => handleChange( "header", "docTitleFontColor", e.target?.value )}
                            label="Font Color"
                            id="bg_color"
                            type="color"
                            placeholder=""
                            customSize="md"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="basis-2/3 ">
                              <ERPSlider
                                 id="docTitleFontSize"
                                label={"Font Size (pts)"}
                                className="bg-slate-300"
                                value={headerState?.docTitleFontSize??10}
                                onChange={(e) => handleChange( "header", "docTitleFontSize", parseInt(e.target?.value, 10) )}
                                min={5}
                                max={28}
                                step={1}
                              />
                            </div>
                            <div className="basis-1/3 translate-y-3">
                              <ERPInput
                                 id="docTitleFontSize"
                                type="number"
                                noLabel
                                value={headerState?.docTitleFontSize??10}
                                data={headerState}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const docTitleFontSize = value === "" ? 0 : parseInt(value, 10);
                                  handleChange( "header", "docTitleFontSize", docTitleFontSize )
                                }}
                            
                               min={5}
                               max={28}
                               step={1}
                              />
                            </div>
                          </div>

            </div>
            <div className="transition-all  flex flex-col gap-5 bg-white p-4">
                {/* <h6 className="bg-[#80808012] p-[2px]">{t("header")}</h6> */}
                <ERPInput
                    id="bgColor"
                    type="color"
                    label={t("background_color")}
                    value={headerState?.bgColor}
                    onChange={(e) => handleChange("header", "bgColor", e.target?.value)}
                />
                <div className="flex flex-col gap-3">
                    <div className="text-xs">{t("background_image")}</div>
                    <ERPInput
                        type="file"
                        ref={inputFile}
                        onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                                ERPToast.showWith(t("max_file_size_error"));
                            } else {
                                handleSetTemplateBackgroundImageHeader(e.target.files[0], dispatch);
                            }
                        }}
                        className={"hidden"}
                        accept="image/png,image/jpeg"
                        label={t("image")}
                        id="background_image"
                        placeholder=" "
                    />
                    <label htmlFor="background_image">
                        <div onClick={() => inputFile?.current?.click()} className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData?.activeTemplate?.background_image_header ? "hidden" : ""}`}>
                            {t("choose_from_desktop")}
                        </div>
                    </label>

                    {templateData?.activeTemplate?.background_image_header &&
                        <>
                            <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">{t("click_save_to_apply")}</div>
                            {templateData?.activeTemplate?.background_image_header && <img
                                draggable={false}
                                src={templateData?.activeTemplate?.background_image_header}
                                alt={t("background_image")}
                                height={100} width={100}
                                className="size-5" />
                            }
                            <div className="text-accent text-xs cursor-pointer  max-w-min" onClick={() => handleSetTemplateBackgroundImageHeader(undefined, dispatch)}>
                                {t("remove")}
                            </div>
                            <div className="font-light text-sm">{t("image_position")}</div>
                               <ErpDataCombobox
                                   
                                      label={t("image_fit")}
                                      id="bg_image_header_objectFit"
                                      field={{
                                        id: "bg_image_header_objectFit",
                                        required: true,
                                        valueKey: "value",
                                        labelKey: "label",
                                      }}
                                      value={headerState?.bg_image_header_objectFit?? "fill"}
                                      defaultValue={ "fill"}
                                       handleChange={(id, value) => handleChange("header", "bg_image_header_objectFit", value)}

                                      options={[
                                        { label: "fill", value: "fill" },
                                        { label: "contain", value: "contain" },
                                        { label: "cover", value: "cover" },
                                        { label: "scale-down", value: "scale-down" },
                                        { label: "none", value: "none" },
                        
                                      ]}
                                    />
                        
                        
                                    <ErpDataCombobox
                                      
                                      label={t("image_position")}
                                      id="bg_image_header_position"
                                      field={{
                                        id: "bg_image_header_position",
                                        required: true,
                                        valueKey: "value",
                                        labelKey: "label",
                                      }}
                                      value={headerState?.bg_image_header_position ?? "center"}
                                      handleChange={(id, value) => handleChange("header", "bg_image_header_position", value)}
                                      options={[
                                        { label: "Top left", value: "top left" },
                                        { label: "Center left", value: "top center" },
                                        { label: "Bottom left", value: "top right" },
                                        { label: "Top center", value: "center left" },
                                        { label: "Center", value: "center" },
                                        { label: "Bottom center", value: "center right" },
                                        { label: "Top right", value: "bottom left" },
                                        { label: "Center right", value: "bottom center" },
                                        { label: "Bottom right", value: "bottom right" },
                                      ]}
                                    />
                        </>}
                </div>

                <ERPCheckbox
                    checked={headerState?.isFirstOnly}
                    id="isFirstOnlyHeader"
                    label={t("apply_to_first_page_only")}
                    onChange={(e) => handleChange("header", "isFirstOnly", e.target.checked)}
                />

                {/* {headerState?.isFirstOnly &&
                    <ERPInput

                        value={headerState?.headerHeight ?? 20}
                        onChange={(e) => {
                         
                                handleChange("header", "headerHeight", parseInt(e.target.value, 10))
                        
                        }}
                        // onChange={(e) =>
                        //     onChange?.({ ...propertiesState, padding: { ...propertiesState?.padding, top: parseInt(e.target.value, 10)} })
                        //   }
                        label={t("header_height_for_first_page")}
                        type="number"
                        id="headerHeight"
                        placeholder=" "
                        className="w-full"
                        suffix={"pts"}
                     
                    />

                } */}
            </div>
            {/* <div
                className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
                onClick={() => setTab(currentTab === "footer" ? "" : "footer")}
            >
                Footer 
                <ChevronDownIcon className={`h-5   -rotate-90 transition-all`} />
            
                         
            </div> */}
            <div className="transition-all  flex flex-col gap-5 bg-white p-4">
                <h6 className="bg-[#80808012] p-[2px]">{t("footer")}</h6>
                <ERPCheckbox
                    label={t("show_page_number")}
                    id="showAdditionalPageNumber"
                    checked={footerState?.show_page_number}
                    onChange={(e) => handleChange("footer", "show_page_number", e.target.checked)}
                />
                <ERPStepInput
                    min={8}
                    max={28}
                    step={1}
                    id="font_size"
                    placeholder=" "
                    label={t("font_size_(pt)")}
                    value={footerState?.footerFontSize ?? 12}
                    onChange={(font_size) => handleChange("footer", "footerFontSize", font_size)}
                />
                <ERPInput
                    type="color"
                    label={t("font_color")}
                    id="footerFontColor"
                    value={footerState?.footerFontColor}
                    onChange={(e) => handleChange("footer", "footerFontColor", e.target?.value)}
                />
                <ERPInput
                    type="color"
                    id="bg_color"
                    label={t("background_color")}
                    value={footerState?.bg_color}
                    onChange={(e) => handleChange("footer", "bg_color", e.target?.value)}
                />
                <div className="flex flex-col gap-3">
                    <div className="text-xs">{t("background_image")}</div>
                    <ERPInput
                        type="file"
                        ref={inputFooterFile}
                        onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                                ERPToast.showWith(t("max_file_size_error"));
                            } else {
                                handleSetTemplateBackgroundImageFooter(e.target.files[0], dispatch);
                            }
                        }}
                        className={"hidden"}
                        accept="image/png,image/jpeg"
                        label={t("image")}
                        id="background_image "
                        placeholder=" "
                    />
                    <label htmlFor="background_image">
                        <div onClick={() => inputFooterFile?.current?.click()} className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData?.activeTemplate?.background_image_footer ? "hidden" : ""}`}>
                            {t("choose_from_desktop")}
                        </div>
                    </label>

                    {templateData?.activeTemplate?.background_image_footer &&
                        <>
                            <div className="text-xs bg-[#FEF4EA] px-2 py-2 mb-2 rounded">{t("click_save_to_apply")}</div>
                            {templateData?.activeTemplate?.background_image_footer && <img src={templateData?.activeTemplate?.background_image_footer} alt="background_image" height={100} width={100} className="size-5" />}
                            <div className="text-accent text-xs cursor-pointer  max-w-min" onClick={() => handleSetTemplateBackgroundImageFooter(undefined, dispatch)}>
                                {t("remove")}
                            </div>
                           
                            <ErpDataCombobox
                                noLabel
                                id="position"
                                defaultValue={footerState?.bg_image_footer_position ?? "top left"}
                                handleChange={(id, value) => handleChange("header", "bg_image_footer_position", value?.value)}
                                options={[
                                    { label: "Top left", value: "top left" },
                                    { label: "Top center", value: "top center" },
                                    { label: "Top right", value: "top right" },
                                    { label: "Center left", value: "center left" },
                                    { label: "Center center", value: "center center" },
                                    { label: "Center right", value: "center right" },
                                    { label: "Bottom left", value: "bottom left" },
                                    { label: "Bottom center", value: "bottom center" },
                                    { label: "Bottom right", value: "bottom right" },
                                ]}
                            />
                        </>
                    }
                </div>

               
            </div>
        </ERPScrollArea>
    );
};

export default HeaderDesigner;
