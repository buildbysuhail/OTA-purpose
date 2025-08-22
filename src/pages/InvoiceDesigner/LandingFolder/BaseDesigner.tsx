"use client"

import React from "react"
import { ArrowLeftIcon, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import PropertiesDesigner from "../Designer/PropertiesDesigner"
import HeaderFooterDesigner from "../Designer/HeaderFooterDesigner"
import save_svg from "../../../assets/svg/save.svg"
import { useTemplateDesigner } from "./useTemplateDesigner"
import { setTemplatePropertiesState } from "../../../redux/slices/templates/reducer"
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar"

interface BaseDesignerProps {
  designerType: string
  designerKind:string
  templateGroup: string
  templateComponent: React.ReactElement
  sections: Record<string, React.ComponentType>
}

const BaseDesigner: React.FC<BaseDesignerProps> = React.memo(
  ({ templateGroup, designerType, designerKind,templateComponent, sections }) => {
    const {
      t,
      navigate,
      designTabs,
      currentSection,
      setCurrentSection,
      loading,
      templateImages,
      setTemplateImages,
      maxHeight,
      currentBranch,
      userSession,
      clientSession,
      templateData,
      stableTemplateProps,
      manageSaveAccTemplate,
      dispatch,
     templateStyleProperties ,
     previewContainerRef
    } = useTemplateDesigner({ templateGroup, templateKind: designerKind, designerType })

    const SectionComponent = currentSection ? sections[currentSection.type] : null

    return (
      <div className="flex h-full text-black dark:text-white bg-white dark:bg-body_dark">
        {/* Mini Tab Icons */}
        <div className="w-[80px] border-r h-full print:hidden ">
          <div className="flex flex-col">
            <div className="flex items-center justify-center border-b h-[70px]">
              <button
                onClick={() => navigate(`/templates?template_group=${templateGroup || "SI"}`)}
                className="bg-gray-100 hover:bg-gray-50 p-2 rounded-full"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            </div>
            {designTabs.map((val, index) => (
              <div
                key={`dSec${index}`}
                onClick={() => setCurrentSection(val)}
                className={`${
                  currentSection?.type === val.type ? "text-accent" : "text-gray-600"
                } cursor-pointer hover:bg-gray-100 flex flex-col p-2 border-b text-center items-center gap-1 h-[70px]`}
              >
                <div className="w-5 h-5">
                  {val.icon ? React.createElement(val.icon, { className: "w-5 h-5" }) : null}
                </div>
                <div className="text-[10px]">{t(val.name)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Designer Panel */}
        <div className="flex flex-col border-r min-w-[180px] w-full max-w-[350px] h-full print:hidden">
          <div className="flex justify-between items-center border-b p-4 h-[70px]">
            <h1 className="text-base">{currentSection ? t(currentSection.name) : ""}</h1>
            <button
              title={t("save_template")}
              onClick={manageSaveAccTemplate}
              disabled={loading}
              className="flex gap-1 bg-primary text-white relative hover:bg-blue-600 bg-accent py-2 px-3 rounded disabled:bg-accent/60 overflow-hidden"
            >
              <img src={save_svg || "/placeholder.svg"} className="w-5 h-5" />
              <span className="text-sm">{t("save")}</span>
              {loading && <div className="bg-white top-2 left-2 h-5 w-5 rounded-full animate-ping absolute"></div>}
            </button>
          </div>
 
          {currentSection?.type === "properties" && (
            <PropertiesDesigner
              templateGroup={templateGroup}
              tempImages={{ templateImages, setTemplateImages }}
              propertiesState={templateData?.activeTemplate?.propertiesState}
              onChange={(propertiesState) => dispatch(setTemplatePropertiesState(propertiesState))}
            />
          )}

          {currentSection?.type === "header&footer" && <HeaderFooterDesigner />}

          {SectionComponent && currentSection?.type !== "properties" && currentSection?.type !== "header&footer" && (
            <SectionComponent />
          )}
        </div>

        {/* Modern Preview Panel */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {/* Preview Header */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-[70px]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h2>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {templateStyleProperties.previewWidth}pt × {templateStyleProperties.previewHeight}pt
              </div>
            </div>

            {/* Preview Controls */}
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-center">100%</span>
              <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Preview Content   overflow-y-auto overflow-x-hidden  flex h-auto max-h-[${maxHeight - 100}px] flex-col gap-1*/}
          <ERPScrollArea className={`overflow-auto  flex-1 p-6`}
          maxHeight={maxHeight - 100}>
            <div className="flex justify-center"  >
              <div className="relative">
                {/* Preview Container with Modern Styling */}
                <div
                  ref={previewContainerRef}
                  className="shadow-lg border border-gray-200  overflow-hidden"
                  style={{
                    width: `${templateStyleProperties.previewWidth??500}pt`,
                    height: `${templateStyleProperties.previewHeight??500}pt`,
                     paddingTop: `${templateStyleProperties.paddingTop ?? 0}pt`,
                    paddingRight: `${templateStyleProperties.paddingRight ?? 0}pt`,
                    paddingBottom: `${templateStyleProperties.paddingBottom ?? 0}pt`,
                    paddingLeft: `${templateStyleProperties.paddingLeft ?? 0}pt`,
                  }}
                >
                  {/* Paper Effect */}
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900" /> */}

                  {/* Template Content */}
                  <div className="relative h-full w-full overflow-auto">
                    {React.cloneElement(templateComponent, stableTemplateProps)}
                  </div>
                </div>

                {/* Drop Shadow Effect */}
                <div
                  className="absolute -bottom-2 -right-2 bg-gray-400/20 dark:bg-gray-600/20 rounded-lg -z-10"
                  style={{
                    width: `${templateStyleProperties.previewWidth}pt`,
                    height: `${templateStyleProperties.previewHeight}pt`,
                    minHeight: "400px",
                    
                  }}
                />
              </div>
            </div>
          </ERPScrollArea>

          {/* Preview Footer */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Template: {templateGroup}</span>
                <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
                <span>Type: {designerKind}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export default React.memo(BaseDesigner)
