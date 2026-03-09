"use client"
import React, { useEffect, useRef, useState } from "react"
import { ArrowLeftIcon, ZoomIn, ZoomOut, RotateCcw, ChevronDown, LayoutTemplate, X, Save } from "lucide-react"
import PropertiesDesigner from "../Designer/PropertiesDesigner"
import save_svg from "../../../assets/svg/save.svg"
import { useTemplateDesigner } from "./useTemplateDesigner"
import { setTemplatePropertiesState } from "../../../redux/slices/templates/reducer"
import { ERPScrollArea } from "../../../components/ERPComponents/erp-scrollbar"
import HeaderDesigner from "../Designer/HeaderDesigner"
import FooterDesigner from "../Designer/FooterDesigner"
import TablePremiumDesigner from "../Designer/table-designer"
import { PrintDetailDto } from "../../use-print-type"
import SharedTemplatePreview from "../DesignPreview/shared"
import { TableColumn } from "../Designer/interfaces"

import { TemplateTypes } from "../constants/TemplateCategories"
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox"
import ERPInput from "../../../components/ERPComponents/erp-input"
import Urls from "../../../redux/urls"

interface SaveLayoutForm {
  voucherType: string
  formType: string
  customerType: string
  templateName: string
  setAsDefault: boolean
}

// ─── Save-Layout Modal ────────────────────────────────────────────────────────
interface SaveLayoutModalProps {
  open: boolean
  initial: SaveLayoutForm
  loading: boolean
  onSave: (form: SaveLayoutForm) => void
  onClose: () => void
}

const SaveLayoutModal: React.FC<SaveLayoutModalProps> = ({ open, initial, loading, onSave, onClose }) => {
  const [form, setForm] = useState<SaveLayoutForm>(initial)

  // Sync when initial changes (e.g. active template changes)
  useEffect(() => { setForm(initial) }, [initial.voucherType, initial.formType, initial.customerType, initial.templateName, initial.setAsDefault])

  if (!open) return null

  const fieldLabel = (label: string) => (
    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
  )

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-[500px] rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <LayoutTemplate className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Save Layout</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Store this design for a specific voucher configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Row 1: Voucher Type + Form Type + Customer Type */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              {fieldLabel("Voucher Type")}
              <ERPDataCombobox
                id="voucherType"
                field={{ id: "voucherType", valueKey: "value", labelKey: "label" }}
                options={TemplateTypes.map(tt => ({ label: String(tt.template_group_id), value: String(tt.template_group_id) }))}
                value={form.voucherType}
                data={form}
                onChangeData={(data: any) => setForm(f => ({ ...f, voucherType: data.voucherType ?? "", formType: "" }))}
                noLabel
              />
            </div>
            <div className="flex flex-col gap-1">
              {fieldLabel("Form Type")}
              <ERPDataCombobox
                id="template_formType"
                field={{
                  id: "template_formType",
                  getListUrl: `${Urls.template_FormTypeByVoucherType}/${form.voucherType || "SI"}`,
                  valueKey: "name",
                  labelKey: "name",
                }}
                value={form.formType}
                data={form}
                onChangeData={(data: any) => setForm(f => ({ ...f, formType: data.template_formType ?? "" }))}
                noLabel
              />
            </div>
            <div className="flex flex-col gap-1">
              {fieldLabel("Customer Type")}
              <ERPDataCombobox
                id="template_customerType"
                field={{ id: "template_customerType", valueKey: "value", labelKey: "label" }}
                options={[
                  { label: "B2B", value: "B2B" },
                  { label: "B2C", value: "B2C" },
                  { label: "INT", value: "INT" },
                  { label: "", value: "" },
                ]}
                value={form.customerType}
                data={form}
                onChangeData={(data: any) => setForm(f => ({ ...f, customerType: data.template_customerType ?? "" }))}
                noLabel
              />
            </div>
          </div>

          {/* Computed key preview */}
          {form.voucherType && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Key:</span>
              <div className="flex items-center gap-1">
                {[form.voucherType, form.formType, form.customerType].map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part
                      ? <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{part}</span>
                      : <span className="text-xs text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">—</span>
                    }
                    {i < arr.length - 1 && <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Template Name */}
          <div className="flex flex-col gap-1">
            {fieldLabel("Template Name")}
            <ERPInput
              id="templateName"
              placeholder="Enter a unique template name…"
              value={form.templateName}
              data={form}
              onChangeData={(data: any) => setForm(f => ({ ...f, templateName: data.templateName ?? "" }))}
              noLabel
            />
          </div>

          {/* Set as Default */}
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <div
              onClick={() => setForm(f => ({ ...f, setAsDefault: !f.setAsDefault }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.setAsDefault ? "bg-primary" : "bg-gray-200 dark:bg-gray-600"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.setAsDefault ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Set as default for this voucher configuration
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
          <button
            disabled={loading || !form.templateName.trim()}
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Layout
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Split Save Button ────────────────────────────────────────────────────────
interface SplitSaveButtonProps {
  loading: boolean
  onSave: () => void
  onOpenSaveLayout: () => void
}

const SplitSaveButton: React.FC<SplitSaveButtonProps> = ({ loading, onSave, onOpenSaveLayout }) => {
  const [dropOpen, setDropOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [dropOpen])

  return (
    <div ref={ref} className="relative flex">
      {/* Primary save */}
      <button
        title="Save template"
        onClick={onSave}
        disabled={loading}
        className="flex items-center gap-1.5 bg-primary text-white hover:bg-blue-600 disabled:opacity-60 py-2 px-3 rounded-l-md text-sm transition-colors relative overflow-hidden"
      >
        <img src={save_svg} className="w-4 h-4" alt="" />
        <span>Save</span>
        {loading && <span className="absolute inset-0 flex items-center justify-center bg-primary/80"><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /></span>}
      </button>

      {/* Divider */}
      <div className="w-px bg-blue-400/50 dark:bg-blue-300/30" />

      {/* Dropdown trigger */}
      <button
        title="More save options"
        onClick={() => setDropOpen(o => !o)}
        disabled={loading}
        className="flex items-center justify-center bg-primary text-white hover:bg-blue-600 disabled:opacity-60 px-2 rounded-r-md transition-colors"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${dropOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {dropOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-1">
          <button
            onClick={() => { setDropOpen(false); onOpenSaveLayout() }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <LayoutTemplate className="w-4 h-4 text-primary" />
            <span>Save Layout</span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface BaseDesignerProps {
  designerType: string
  designerKind: string
  templateGroup: string
  formType?: string;
  customerType?: string;
}

const BaseDesigner: React.FC<BaseDesignerProps> = React.memo(
  ({ templateGroup, customerType, formType, designerType, designerKind }) => {
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
      activeTemplate,
      stableTemplateProps,
      manageSaveAccTemplate,
      dispatch,
      templateStyleProperties,
      previewContainerRef,
      masterId
    } = useTemplateDesigner({
      templateGroup,
      templateKind: designerKind,
      designerType,
      isInLedgerReport: templateGroup === "CBR" ? true : false,
      isTemplateDesigner: true
    })
    const tableColumns: TableColumn<PrintDetailDto>[] = []

    // ── Save-Layout modal state ──────────────────────────────────────────────
    const [saveLayoutOpen, setSaveLayoutOpen] = useState(false)

    const saveLayoutInitial: SaveLayoutForm = {
      voucherType: activeTemplate?.propertiesState?.template_group as string ?? templateGroup ?? "",
      formType: activeTemplate?.propertiesState?.template_formType ?? formType ?? "",
      customerType: activeTemplate?.propertiesState?.template_customerType ?? customerType ?? "",
      templateName: activeTemplate?.propertiesState?.templateName ?? "",
      setAsDefault: activeTemplate?.isCurrent ?? false,
    }

    const handleSaveLayout = async (form: SaveLayoutForm) => {
      await manageSaveAccTemplate({
        templateGroup: form.voucherType,
        formType: form.formType,
        customerType: form.customerType,
        templateName: form.templateName,
        isCurrent: form.setAsDefault,
        skipNavigate: true,
        forceNew: true,
      })
      // modal stays open so the user can save to multiple configurations
    }

  const previewWidth = templateStyleProperties.previewWidth ?? 500;
  const previewHeight = templateStyleProperties.previewHeight??500; // Can be number or "auto"
  const isAutoHeight = templateStyleProperties.isAutoHeight ?? false;

    return (
      <>
      <SaveLayoutModal
        open={saveLayoutOpen}
        initial={saveLayoutInitial}
        loading={loading}
        onSave={handleSaveLayout}
        onClose={() => setSaveLayoutOpen(false)}
      />
      <div className="flex h-full text-black dark:text-white bg-white dark:bg-body_dark">
        {/* Mini Tab Icons */}
        <div className="w-[80px] border-r dark:border-gray-700 h-full print:hidden dark:bg-dark-bg-card">
          <div className="flex flex-col">
            <div className="flex items-center justify-center border-b dark:border-gray-700 h-[70px]">
              <button onClick={() => navigate(`/templates?template_group=${templateGroup || "SI"}&form_type=${formType}&customer_type=${customerType}`)} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-full transition-colors">
                <ArrowLeftIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>
            </div>
            {designTabs.map((val, index) => (
              <div key={`dSec${index}`} onClick={() => setCurrentSection(val)} className={`cursor-pointer flex flex-col p-2 border-b dark:border-gray-700 text-center items-center gap-1 h-[70px] hover:bg-gray-200 dark:hover:bg-gray-700 ${currentSection?.type === val.type ? "text-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}  transition-colors`}>
                <div className="w-5 h-5">
                  {val.icon ? React.createElement(val.icon, { className: `w-5 h-5 ${currentSection?.type === val.type ? "text-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}` }) : null}
                </div>
                <div className="text-[10px] font-medium">
                  {t(val.name)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Designer Panel */}
        <div className="flex flex-col border-r dark:border-dark-border min-w-[180px] w-full max-w-[350px] h-full print:hidden bg-white dark:bg-dark-bg-card">
          <div className="flex justify-between items-center border-b dark:border-dark-border p-4 h-[70px] bg-white dark:bg-dark-bg-card">
            <h1 className="text-base dark:!text-dark-text">{currentSection ? t(currentSection.name) : ""}</h1>
            <SplitSaveButton
              loading={loading}
              onSave={manageSaveAccTemplate}
              onOpenSaveLayout={() => setSaveLayoutOpen(true)}
            />
          </div>

          {
            currentSection?.type === "properties" && (
              <PropertiesDesigner
                templateGroup={templateGroup}
                formType={formType}
                customerType={customerType}
                tempImages={{ templateImages, setTemplateImages }}
                propertiesState={activeTemplate?.propertiesState}
                onChange={(propertiesState) => dispatch(setTemplatePropertiesState(propertiesState))}
              />
            )
          }

          {currentSection?.type === "header" &&
            <HeaderDesigner />
          }

          {
            currentSection?.type === "table" && (
              <TablePremiumDesigner<PrintDetailDto> tableState={tableColumns} />
            )
          }

          {
            currentSection?.type === "footer" &&
            <FooterDesigner />
          }
        </div>

        {/* Modern Preview Panel */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {/* Preview Header */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-bg-card border-b border-gray-200 dark:border-gray-700 h-[70px]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h2>
              <div className="text-xs text-gray-500 dark:text-gray-400">
               {previewWidth}pt × {isAutoHeight ? "Auto" : `${previewHeight}pt`}
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
          <ERPScrollArea className={`overflow-auto  flex-1 p-6 bg-gray-50 dark:bg-dark-bg-card`}
            maxHeight={maxHeight - 100}>
            <div className="flex justify-center">
              <div className="relative">
                {/* Preview Container with Modern Styling */}
                <div 
                  ref={previewContainerRef} 
                  className="shadow-lg border border-gray-200 dark:border-dark-border overflow-hidden bg-white dark:bg-dark-bg-card" 
                  style={{ 
                    width: `${previewWidth}pt`, 
                    height: isAutoHeight ? 'auto' : `${previewHeight}pt`,
                    minHeight: isAutoHeight ? '200pt' : undefined,
                    transformOrigin: 'top left',
                  }}
                 >

                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className={`relative w-full ${isAutoHeight ? 'flex flex-col' : 'h-full'}`}>

                      {/* {React.cloneElement(templateComponent,  stableTemplateProps)} */}
                      <SharedTemplatePreview
                        template={stableTemplateProps?.template}
                        printData={stableTemplateProps?.printData}
                        qrCodeImages={stableTemplateProps?.qrCodeImages}
                        isTemplateDesigner={true}
                      />
                    </div>
                  )}
                  </div>

                {/* Drop Shadow Effect */}
              {!isAutoHeight && (
                <div className="absolute -bottom-2 -right-2 bg-gray-400/20 dark:bg-gray-600/20 rounded-lg -z-10" style={{ width: `${previewWidth}pt`, height: `${previewHeight}pt`, minHeight: "400px", }} />
              )}
              </div>
            </div>
          </ERPScrollArea>

          {/* Preview Footer */}
          <div className="p-3 bg-white dark:bg-dark-bg-card border-t border-gray-200 dark:border-gray-700">
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
      </>
    )
  },
)

export default React.memo(BaseDesigner)