import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { FooterState, HeaderState } from "./interfaces";
import { TemplateImagesTypes } from "../InvoiceDesigner";
import { isFile } from "../../../utilities/Utils";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { TemplateReducerState } from "../../../redux/reducers/TemplateReducer";
import { handleSetTemplateBackgroundImageFooter, handleSetTemplateBackgroundImageHeader, setTemplateBackgroundImageFooter, setTemplateBackgroundImageHeader, setTemplateFooterState, setTemplateHeaderState } from "../../../redux/slices/templates/reducer";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar";
import ERPSlider from "../../../components/ERPComponents/erp-slider";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";

interface TempImageProps {
}

interface FooterDesignerProps {
    footerState?: FooterState;
    headerState?: HeaderState;
    tempImages: TempImageProps;
}


const HeaderFooterDesigner = ({ footerState, headerState, tempImages }: FooterDesignerProps) => {

    const inputFile = useRef<HTMLInputElement>(null);
    const inputFooterFile = useRef<HTMLInputElement>(null);
    const [searchParams] = useSearchParams();
    const [currentTab, setTab] = useState<"header" | "footer" | "">("header");
    const userSession = useSelector((state: RootState) => state?.UserSession);
    let userBranches = useAppSelector((state: RootState) => state.UserBranches);
    const templateGroup = searchParams?.get("template_group");
    const [maxHeight, setMaxHeight] = useState<number>(500);

    useEffect(() => {
        let wh= window.innerHeight; 
        setMaxHeight(wh);
    }, []);

    /* ######################################################################################### */
    const templateData = useSelector((state: any) => state?.Template) as TemplateReducerState;

    const dispatch = useDispatch();
    const handleChange = (type: "header" | "footer", key: keyof HeaderState | keyof FooterState, value: string | number | boolean) => {
        if (type === "header") {
            
            dispatch(setTemplateHeaderState({ ...headerState, [key]: value }));
        } else {
            dispatch(setTemplateFooterState({ ...footerState, [key]: value }));
        }
    }

    return (
         <ERPScrollArea 
            className={`overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1`}>

      <div className={"transition-all  flex flex-col gap-5 bg-white p-4"}>
      <h6 className="bg-[#80808012] p-[2px]">Organization Details</h6>
        <ERPCheckbox
          id="showLogo"
          label="Show Organization Logo"
          checked={headerState?.showLogo}
          onChange={(e) => handleChange("header", "showLogo", e.target.checked)}
        />
      
        {headerState?.showLogo && (
          <div className="flex flex-col gap-2">
            <img src={userBranches?.branches?.find(x => x.id == userSession.currentBranchId && x.clientId == userSession.currentClientId)?.logo} className="border border-dashed mb-2 h-16 w-full object-contain" />
            <ERPSlider
              id="logoSize"
              label="Logo Size"
              defaultValue={headerState?.logoSize}
              onChange={(e) => handleChange("header", "logoSize", e.target?.value)}
            />
          </div>
        )}
        {/* */}


        {!["qty_adjustment", "value_adjustment"].includes(templateGroup!) &&
          <>
            <ERPCheckbox
              id="showOrgName"
              checked={headerState?.showOrgName}
              label="Show Organization Name"
              onChange={(e) => handleChange("header", "showOrgName", e.target.checked)}
            />
              <ERPCheckbox
            id="showOrgAddress"
            checked={headerState?.showOrgAddress}
            label="Show Organization Address"
            onChange={(e) => handleChange("header", "showOrgAddress", e.target.checked)}
            />
            <ERPInput
              value={headerState?.OrganizationFontColor}
              onChange={(e) => handleChange("header", "OrganizationFontColor", e.target?.value)}
              label="Font Color"
              id="bg_color"
              type="color"
              placeholder=""
            />
            <ERPStepInput
              value={headerState?.OrganizationFontSize ?? 12}
              onChange={(value) => handleChange("header", "OrganizationFontSize", value)}
              label="Font Size (pts)"
              id="font_size"
              placeholder=" "
              min={8}
              max={28}
              step={1}
            />
          </>
        }
       {/* */}

      </div>
      {/* */}

            <div className="transition-all  flex flex-col gap-5 bg-white p-4">
                {/* */}
              
                <h6 className="bg-[#80808012] p-[2px]">Header</h6>
                <ERPInput
                    id="bgColor"
                    type="color"
                    label="Background Color"
                    value={headerState?.bgColor}
                    onChange={(e) => handleChange("header", "bgColor", e.target?.value)}
                />

                <div className="flex flex-col gap-3">
                    <div className="text-xs">Background Image</div>
                    <ERPInput
                        type="file"
                        ref={inputFile}
                        onChange={(e: any) => {
                            if (e.target.files[0].size > 2097152) {
                                ERPToast.showWith("Maximum file size allowed is 2 MB, please try with different file.", "warning");
                            } else {
                                handleSetTemplateBackgroundImageHeader(e.target.files[0], dispatch);
                            }
                        }}
                        className={"hidden"}
                        accept="image/png,image/jpeg"
                        label="Image"
                        id="background_image "
                        placeholder=" "
                    />
                    <label htmlFor="background_image">
                        <div
                            onClick={() => inputFile?.current?.click()}
                            className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData?.activeTemplate?.background_image_header ? "hidden" : ""}`}
                        >
                            Choose from Desktop</div>
                    </label>

                    {templateData?.activeTemplate?.background_image_header &&
                        <>
                            <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">Click Save to apply the selected background image</div>
                            {templateData?.activeTemplate?.background_image_header && <img
                                draggable={false}
                                src={templateData?.activeTemplate?.background_image_header}
                                alt="background_image"
                                height={100} width={100}
                                className="size-5" />
                            }
                            <div
                                className="text-accent text-xs cursor-pointer  max-w-min"
                                onClick={() => handleSetTemplateBackgroundImageHeader(undefined, dispatch)}
                            >
                                Remove
                            </div>
                            <div className="font-light text-sm">Image Position</div>
                            <ERPDataCombobox
                                noLabel
                                id="position"
                                defaultValue={headerState?.bg_image_header_position ?? "top left"}
                                handleChange={(id, value) => handleChange("header", "bg_image_header_position", value)}
                                options={[
                                    { label: "Top Left", value: "top left" },
                                    { label: "Top Center", value: "top center" },
                                    { label: "Top Right", value: "top right" },
                                    { label: "Center Left", value: "center left" },
                                    { label: "Center Center", value: "center center" },
                                    { label: "Center Right", value: "center right" },
                                    { label: "Bottom Left", value: "bottom left" },
                                    { label: "Bottom Center", value: "bottom center" },
                                    { label: "Bottom Right", value: "bottom right" },
                                ]}
                            />
                        </>}
                </div>

                <ERPCheckbox
                    checked={headerState?.isFirstOnly}
                    id="isFirstOnlyHeader"
                    label="Apply to first page only"
                    onChange={(e) => handleChange("header", "isFirstOnly", e.target.checked)}
                />

                {headerState?.isFirstOnly &&
                    <ERPInput
                        value={headerState?.headerHeight ?? 20}
                        onChange={(e) => {
                            if (!(e.target?.valueAsNumber > 60)) {
                                handleChange("header", "headerHeight", e.target?.valueAsNumber)
                            }
                        }}
                        label="Header height for first page"
                        type="number"
                        id="headerHeight"
                        placeholder=" "
                        className="w-full"
                        suffix={"pts"}
                        min={20}
                        max={60}
                    />
                }
            </div>

            {/* <div
                className="flex justify-between items-center pb-4 border-b cursor-pointer bg-white p-4"
                onClick={() => setTab(currentTab === "footer" ? "" : "footer")}
            >
                Footer 
                <ChevronDownIcon className={`h-5   -rotate-90 transition-all`} />
            </div> */}



            {/* */}
        
                <div className="transition-all  flex flex-col gap-5 bg-white p-4">
                <h6 className="bg-[#80808012] p-[2px]">Footer</h6>
                    <ERPCheckbox
                        label="Show Show Page Number"
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
                        label="Font Size (pt)"
                        value={footerState?.footerFontSize ?? 12}
                        onChange={(font_size) => handleChange("footer", "footerFontSize", font_size)}
                    />
                    <ERPInput
                        type="color"
                        label="Font Color"
                        id="footerFontColor"
                        value={footerState?.footerFontColor}
                        onChange={(e) => handleChange("footer", "footerFontColor", e.target?.value)}
                    />
                    <ERPInput
                        type="color"
                        id="bg_color"
                        label="Background Color"
                        value={footerState?.bg_color}
                        onChange={(e) => handleChange("footer", "bg_color", e.target?.value)}
                    />
                    <div className="flex flex-col gap-3">
                        <div className="text-xs">Background Image</div>
                        <ERPInput
                            type="file"
                            ref={inputFooterFile}
                            onChange={(e: any) => {
                                if (e.target.files[0].size > 2097152) {
                                    ERPToast.showWith("Maximum file size allowed is 2 MB, please try with different file.", "warning");
                                } else {
                                    handleSetTemplateBackgroundImageFooter(e.target.files[0], dispatch);
                                }
                            }}
                            className={"hidden"}
                            accept="image/png,image/jpeg"
                            label="Image"
                            id="background_image "
                            placeholder=" "
                        />
                        <label htmlFor="background_image">
                            <div
                                onClick={() => inputFooterFile?.current?.click()}
                                className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData?.activeTemplate?.background_image_footer ? "hidden" : ""}`}
                            >
                                Choose from Desktop</div>
                        </label>

                        {templateData?.activeTemplate?.background_image_footer &&
                            <>
                                <div className="text-xs bg-[#FEF4EA] px-2 py-2 mb-2 rounded">Click Save to apply the selected background image</div>
                                {templateData?.activeTemplate?.background_image_footer && <img src={templateData?.activeTemplate?.background_image_footer} alt="background_image" height={100} width={100} className="size-5" />}
                                <div
                                    className="text-accent text-xs cursor-pointer  max-w-min"
                                    onClick={() => handleSetTemplateBackgroundImageFooter(undefined, dispatch)}
                                >
                                    Remove
                                </div>
                                <div className="font-light text-sm">Image Position</div>
                                <ERPDataCombobox
                                    noLabel
                                    id="position"
                                    defaultValue={footerState?.bg_image_footer_position ?? "top left"}
                                    handleChange={(id, value) => handleChange("header", "bg_image_footer_position", value?.value)}
                                    options={[
                                        { label: "Top Left", value: "top left" },
                                        { label: "Top Center", value: "top center" },
                                        { label: "Top Right", value: "top right" },
                                        { label: "Center Left", value: "center left" },
                                        { label: "Center Center", value: "center center" },
                                        { label: "Center Right", value: "center right" },
                                        { label: "Bottom Left", value: "bottom left" },
                                        { label: "Bottom Center", value: "bottom center" },
                                        { label: "Bottom Right", value: "bottom right" },
                                    ]}
                                />
                            </>
                        }
                    </div>
                </div>
         

       </ERPScrollArea>
    );
};

export default HeaderFooterDesigner;
