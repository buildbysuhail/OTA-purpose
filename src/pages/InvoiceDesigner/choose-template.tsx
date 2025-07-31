"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import type { TemplateState } from "./Designer/interfaces"
import Urls from "../../redux/urls"
import { setTemplate } from "../../redux/slices/templates/reducer"
import { APIClient } from "../../helpers/api-client"
import { useTranslation } from "react-i18next"
import type VoucherType from "../../enums/voucher-types"
import { customJsonParse } from "../../utilities/jsonConverter"
import {
  Badge,
  FileSpreadsheet,
  Gem,
  LayoutList,
  ShoppingBag,
  Search,
  Sparkles,
  Zap,
  Grid3X3,
  List,
} from "lucide-react"
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch"

interface ChooseTemplateProps {
  templateGroup: VoucherType | string
  setShowTemplateListing: (show: boolean) => void
  tempData: any
}

const api = new APIClient()

const ChooseTemplate = ({ templateGroup, setShowTemplateListing, tempData }: ChooseTemplateProps) => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const dispatch = useDispatch()
  const { t } = useTranslation("system")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Function to get icon for template type
  const getTemplateTypeIcon = (templateType: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      standard: Badge,
      premium: Gem,
      spreadsheet: FileSpreadsheet,
      retail: ShoppingBag,
      default: LayoutList,
    }

    const IconComponent = iconMap[templateType.toLowerCase()] || iconMap.default
    return <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
  }

  // Enhanced color schemes with gradients
  const getTemplateTypeColor = (templateType: string) => {
    const colorMap: {
      [key: string]: {
        bg: string
        text: string
        border: string
        accent: string
        light: string
        gradient: string
        shadow: string
      }
    } = {
      standard: {
        bg: "bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100",
        text: "text-blue-700",
        border: "border-blue-200",
        accent: "bg-gradient-to-r from-blue-500 to-indigo-600",
        light: "bg-blue-50",
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/25",
      },
      premium: {
        bg: "bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100",
        text: "text-purple-700",
        border: "border-purple-200",
        accent: "bg-gradient-to-r from-purple-500 to-pink-600",
        light: "bg-purple-50",
        gradient: "from-purple-500 to-pink-600",
        shadow: "shadow-purple-500/25",
      },
      spreadsheet: {
        bg: "bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
        accent: "bg-gradient-to-r from-emerald-500 to-teal-600",
        light: "bg-emerald-50",
        gradient: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/25",
      },
      retail: {
        bg: "bg-gradient-to-br from-orange-50 via-orange-50 to-amber-100",
        text: "text-orange-700",
        border: "border-orange-200",
        accent: "bg-gradient-to-r from-orange-500 to-amber-600",
        light: "bg-orange-50",
        gradient: "from-orange-500 to-amber-600",
        shadow: "shadow-orange-500/25",
      },
      default: {
        bg: "bg-gradient-to-br from-slate-50 via-slate-50 to-gray-100",
        text: "text-slate-700",
        border: "border-slate-200",
        accent: "bg-gradient-to-r from-slate-500 to-gray-600",
        light: "bg-slate-50",
        gradient: "from-slate-500 to-gray-600",
        shadow: "shadow-slate-500/25",
      },
    }

    return colorMap[templateType.toLowerCase()] || colorMap.default
  }

  // Group templates by templateType and get counts
  const groupedTemplates = useMemo(() => {
    if (!tempData) return {}

    return tempData.reduce((acc: any, template: TemplateState) => {
      const type = template.templateType || "standard"
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(template)
      return acc
    }, {})
  }, [tempData])

  // Get available template types with counts
  const templateTypes = useMemo(() => {
    const types = Object.keys(groupedTemplates)
    const allCount = tempData?.length || 0

    return [
      { key: "all", label: t("all"), count: allCount },
      ...types.map((type) => ({
        key: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        count: groupedTemplates[type]?.length || 0,
      })),
    ]
  }, [groupedTemplates, tempData, t])

  // Filter templates based on search query
  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return tempData || []

    return (tempData || []).filter(
      (template: TemplateState) =>
        template.templateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.templateKind?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.templateType?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [tempData, searchQuery])

  // Get filtered templates based on active tab
  const filteredTemplates = useMemo(() => {
    if (activeTab === "all") {
      return filteredBySearch
    }
    return filteredBySearch.filter(
      (template: TemplateState) => (template.templateType || "standard").toLowerCase() === activeTab.toLowerCase(),
    )
  }, [activeTab, filteredBySearch])

  // Get grouped templates for "All" tab display
  const groupedTemplatesForAll = useMemo(() => {
    if (activeTab !== "all") return {}

    return filteredBySearch.reduce((acc: any, template: TemplateState) => {
      const type = template.templateType || "standard"
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(template)
      return acc
    }, {})
  }, [activeTab, filteredBySearch])

  const handleUseTemplate = (template: TemplateState) => {
    appDispatch(setTemplate(template))
    if (templateGroup === "barcode") {
      navigate(`/label-designer/${template.id}?template_group=${templateGroup}`)
    } else {
      navigate(`/invoice_designer/${template.id}?template_group=${templateGroup}`, {
        state: {
          templateKind: template.templateKind,
          templateType: template.templateType,
        },
      })
    }
  }

  const handleChooseTemplate = async (template: TemplateState) => {
    const length = tempData?.length || 0
    const res = await api.getAsync(`${Urls.crm_templates}${template.id}`)
    const cc: TemplateState = customJsonParse(res.content)

    const propertiesState = {
      ...cc.propertiesState,
      templateName: t("untitled_template") + (length + 1),
    }

    const newTemplate = {
      ...cc,
      id: null,
      templateName: "",
      propertiesState: propertiesState,
    }

    dispatch(setTemplate(newTemplate))

    const state = template?.templateType
      ? {
          templateKind: template?.templateKind,
          templateType: template?.templateType,
        }
      : {}

    templateGroup == "barcode"
      ? navigate(`/label-designer/new?template_group=${templateGroup}`)
      : navigate(`/invoice_designer/new?template_group=${templateGroup}`, { state })
  }


  const renderTemplateCard = (template: TemplateState, index: number) => {
    const isDefault = template?.isCurrent 
    const isPremium = template.templateType?.toLowerCase() === "premium"

    if (viewMode === "list") {
      return (
        <div
          key={`ti_${template.id}_${index}`}
          className="w-full max-w-none group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex-shrink-0 w-full sm:w-16 h-32 sm:h-20 lg:w-20 lg:h-24 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
            <img
              src={template?.thumbImage || "/placeholder.svg?height=96&width=80"}
              alt={template?.templateName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {isPremium && (
              <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white p-1 rounded-full shadow-lg">
                <StarIconSolid className="w-3 h-3" />
              </div>
            )}
          </div>

          <div className="relative flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
              <h3
                className="font-semibold text-slate-900 text-sm sm:text-base lg:text-lg"
                title={template?.templateName}
              >
                {template?.templateName}
              </h3>
              {isDefault && (
                <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-2 sm:px-3 py-1 rounded-full font-medium border border-blue-200 flex items-center gap-1 flex-shrink-0 w-fit">
                  <StarIconSolid className="w-3 h-3" />
                  <span>{t("default")}</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 capitalize mb-2">
              {template?.templateType || "Standard"} Template
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {/* <span>
                Created:{" "}
                {new Date(template?.createdAt || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "2-digit",
                })}
              </span> */}
              <span className="hidden sm:inline">•</span>
              {/* <span className="hidden sm:inline">
                Modified:{" "}
                {new Date(template?.updatedAt || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "2-digit",
                })}
              </span> */}
            </div>
          </div>

          <div className="relative flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-end">
            <button
              className="bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-500 hover:to-indigo-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 whitespace-nowrap"
              onClick={() => handleChooseTemplate(template)}
            >
              {t("use_this")}
            </button>
          </div>
        </div>
      )
    }

    return (
      <div
        key={`ti_${template.id}`}
        className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
      >
        {/* Premium glow effect */}
        {isPremium && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <img
            src={template?.thumbImage || "/placeholder.svg?height=300&width=240"}
            alt={template?.templateName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Enhanced overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Template type badge */}
          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg backdrop-blur-sm">
            <span className="capitalize">{template?.templateType || "Standard"}</span>
          </div>

          {/* Premium/Default badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isPremium && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-1.5 rounded-full shadow-lg">
                <StarIconSolid className="w-3 h-3" />
              </div>
            )}
            {isDefault && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1.5 rounded-full shadow-lg">
                <Sparkles className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Action buttons overlay - Fixed to not interfere with bottom buttons */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                className="bg-white/90 backdrop-blur-sm text-slate-700 p-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110"
                title="Preview"
                onClick={(e) => {
                  e.stopPropagation()
                  // Add preview functionality here
                }}
              >
                <SparklesIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 relative z-20 bg-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem] leading-tight"
                title={template?.templateName}
              >
                {template?.templateName}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {isDefault ? (
              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium border border-blue-200 flex items-center gap-1">
                <StarIconSolid className="w-2.5 h-2.5" />
                <span>Default</span>
              </span>
            ) : (
              <button
                className="bg-gradient-to-r from-blue-300 to-slate-200 hover:from-blue-500 hover:to-indigo-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 relative z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleChooseTemplate(template)
                }}
              >
                {t("use_this")}
              </button>
            )}

            {/* <div className="text-xs text-slate-400">
              {new Date(template?.updatedAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div> */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 !w-full ">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Enhanced Header - Matching Templates.tsx style */}
        <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Top Row - Title and Close Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 capitalize truncate">
                      {t("choose_a_template")}
                    </h1>
                    <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">
                      {filteredTemplates.length}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 flex items-center gap-2 text-xs sm:text-sm">
                    <Zap className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">Select a template to get started</span>
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowTemplateListing(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span className="hidden xs:inline">Close</span>
                </button>
              </div>
            </div>

            {/* Bottom Row - Controls */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Search - Full width on mobile */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-slate-200 shadow-sm flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Template Type Tabs - Matching Templates.tsx style */}
        <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {templateTypes.map((type) => {
              const colors = getTemplateTypeColor(type.key)
              return (
                <button
                  key={type.key}
                  onClick={() => setActiveTab(type.key)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap relative overflow-hidden ${
                    activeTab === type.key
                      ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg ${colors.shadow} transform scale-105`
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:shadow-sm"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                    {type.key !== "all" && getTemplateTypeIcon(type.key)}
                    <span className="hidden xs:inline">{type.label}</span>
                    {/* <span className="xs:hidden">{type.label.slice(0, 3)}</span>({type.count}) */}
                    <span className="xs:hidden">{type.label}</span>({type.count})
                  </span>
                  {activeTab !== type.key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-50 opacity-0 hover:opacity-100 transition-opacity duration-200" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Enhanced Content - Fixed for full width list view */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 to-blue-50/30">
          <div className="p-3 sm:p-4 lg:p-6 w-full">
            {activeTab === "all" ? (
              // Render grouped templates for "All" tab
              <div className="space-y-8 sm:space-y-12 w-full">
                {Object.entries(groupedTemplatesForAll).map(([templateType, templates]) => {
                  const colors = getTemplateTypeColor(templateType)
                  return (
                    <div key={templateType} className="w-full">
                      {/* Enhanced Section Header */}
                      <div className="mb-6 sm:mb-8 w-full">
                        <div
                          className={`${colors.bg} ${colors.border} border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg relative overflow-hidden w-full`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div
                                className={`${colors.text} p-3 sm:p-4 bg-white/90 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm`}
                              >
                                {getTemplateTypeIcon(templateType)}
                              </div>
                              <div>
                                <h2
                                  className={`text-lg sm:text-xl lg:text-xl font-bold ${colors.text} uppercase tracking-wide`}
                                >
                                  {templateType}
                                </h2>
                                <p className={`text-xs sm:text-sm lg:text-base ${colors.text} opacity-75 mt-1`}>
                                  {(templates as TemplateState[]).length} template
                                  {(templates as TemplateState[]).length !== 1 ? "s" : ""} available
                                </p>
                              </div>
                            </div>
                            <div
                              className={`${colors.text} text-base sm:text-lg lg:text-xl font-bold px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-white/90 shadow-lg backdrop-blur-sm`}
                            >
                              {(templates as TemplateState[]).length}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Templates Grid/List for this type - Fixed container */}
                      <div className="w-full mb-8 sm:mb-12">
                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 w-full">
                            {(templates as TemplateState[]).map((template: TemplateState, index: number) =>
                              renderTemplateCard(template, index),
                            )}
                          </div>
                        ) : (
                          <div className="w-full space-y-3">
                            {(templates as TemplateState[]).map((template: TemplateState, index: number) =>
                              renderTemplateCard(template, index),
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Render filtered templates for specific type tabs - Fixed container
              <div className="w-full">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 w-full">
                    {filteredTemplates.map((template: TemplateState, index: number) =>
                      renderTemplateCard(template, index),
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    {filteredTemplates.map((template: TemplateState, index: number) =>
                      renderTemplateCard(template, index),
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Empty State */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12 sm:py-16 px-4 w-full">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎨</div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-3">No templates found</h3>
                <p className="text-slate-600 mb-6 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any templates matching "${searchQuery}".`
                    : "No templates are available for this category."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="w-full sm:w-auto bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseTemplate
