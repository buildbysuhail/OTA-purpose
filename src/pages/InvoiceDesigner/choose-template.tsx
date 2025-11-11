"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import type { TemplateState } from "./Designer/interfaces"
import Urls from "../../redux/urls"
import { setTemplate } from "../../redux/slices/templates/reducer"
import { APIClient } from "../../helpers/api-client"
import { useTranslation } from "react-i18next"
import type VoucherType from "../../enums/voucher-types"
import { Badge, FileSpreadsheet, Gem, LayoutList, ShoppingBag, Search, Sparkles, Grid3X3, List } from "lucide-react"
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch"
import { fetchCRMTemplateFromApiById, fetchTemplateFromApiById } from "../use-print"
import { merge } from "lodash"
import { templateInitialState } from "../../redux/reducers/TemplateReducer"

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
    return <IconComponent className="w-4 h-4" />
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
        bg: "bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 dark:from-blue-950 dark:via-blue-950 dark:to-indigo-900",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800",
        accent: "bg-gradient-to-r from-blue-500 to-indigo-600",
        light: "bg-blue-50 dark:bg-blue-950",
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/25",
      },
      premium: {
        bg: "bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100 dark:from-purple-950 dark:via-purple-950 dark:to-pink-900",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-200 dark:border-purple-800",
        accent: "bg-gradient-to-r from-purple-500 to-pink-600",
        light: "bg-purple-50 dark:bg-purple-950",
        gradient: "from-purple-500 to-pink-600",
        shadow: "shadow-purple-500/25",
      },
      spreadsheet: {
        bg: "bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-100 dark:from-emerald-950 dark:via-emerald-950 dark:to-teal-900",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        accent: "bg-gradient-to-r from-emerald-500 to-teal-600",
        light: "bg-emerald-50 dark:bg-emerald-950",
        gradient: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/25",
      },
      retail: {
        bg: "bg-gradient-to-br from-orange-50 via-orange-50 to-amber-100 dark:from-orange-950 dark:via-orange-950 dark:to-amber-900",
        text: "text-orange-700 dark:text-orange-300",
        border: "border-orange-200 dark:border-orange-800",
        accent: "bg-gradient-to-r from-orange-500 to-amber-600",
        light: "bg-orange-50 dark:bg-orange-950",
        gradient: "from-orange-500 to-amber-600",
        shadow: "shadow-orange-500/25",
      },
      default: {
        bg: "bg-gradient-to-br from-slate-50 via-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-900 dark:to-gray-800",
        text: "text-slate-700 dark:!text-dark-text",
        border: "border-slate-200 dark:border-dark-border",
        accent: "bg-gradient-to-r from-slate-500 to-gray-600",
        light: "bg-slate-50 dark:bg-dark-bg-card",
        gradient: "from-slate-500 to-gray-600",
        shadow: "shadow-slate-500/25",
      },
    }

    return colorMap[templateType.toLowerCase()] || colorMap.default
  }

  // Group templates by templateType and get counts
  const groupedTemplates = useMemo(() => {
    if (!tempData) return {}

    return tempData.reduce((acc: any, template: TemplateState<unknown>) => {
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
      (template: TemplateState<unknown>) =>
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
      (template: TemplateState<unknown>) =>
        (template.templateType || "standard").toLowerCase() === activeTab.toLowerCase(),
    )
  }, [activeTab, filteredBySearch])

  // Get grouped templates for "All" tab display
  const groupedTemplatesForAll = useMemo(() => {
    if (activeTab !== "all") return {}

    return filteredBySearch.reduce((acc: any, template: TemplateState<unknown>) => {
      const type = template.templateType || "standard"
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(template)
      return acc
    }, {})
  }, [activeTab, filteredBySearch])

  const handleUseTemplate = (template: TemplateState<unknown>) => {
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

  const handleChooseTemplate = async (template: TemplateState<unknown>) => {
    const length = tempData?.length || 0
    const _template = await fetchCRMTemplateFromApiById(template.id);
    if (!_template) return null;
    const initial = templateInitialState().activeTemplate;
    const _returnData = merge({}, initial, _template);
    const propertiesState = {
      ..._template.propertiesState,
      templateName: t("untitled_template") + (length + 1),
    }

    const newTemplate = {
      ..._template,
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

  const renderTemplateCard = (template: TemplateState<unknown>, index: number) => {
    const isDefault = template?.isCurrent
    const isPremium = template.templateType?.toLowerCase() === "premium"

    if (viewMode === "list") {
      return (
        <div
          key={`ti_${template.id}_${index}`}
          className="w-full group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-dark-bg-card rounded-xl border border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-border hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 dark:via-blue-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex-shrink-0 w-24 h-24 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-50 dark:bg-dark-bg-card border border-slate-200 dark:border-dark-border shadow-sm">
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

          <div className="relative flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
              <h3 className="font-semibold text-slate-900 dark:!text-dark-text text-base lg:text-lg truncate" title={template?.templateKind}>
                {template?.templateKind}
              </h3>
              {isDefault && (
                <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs px-2 sm:px-3 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800 flex items-center gap-1 flex-shrink-0 w-fit">
                  <StarIconSolid className="w-3 h-3" />
                  <span>{t("default")}</span>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400 capitalize mb-2">{template?.templateType || "Standard"} {t('template')}</p>
          </div>

          <div className="relative flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-end">
            <button
              className="bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-950 dark:to-indigo-950 hover:from-blue-500 hover:to-indigo-600 hover:text-white text-slate-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 whitespace-nowrap"
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
        className="
          group relative w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[200px] 
          h-[250px] xs:h-[260px] sm:h-[280px] md:h-[300px] lg:h-[280px] 
          aspect-[4/5] bg-white dark:bg-dark-bg-card rounded-xl sm:rounded-2xl 
          border border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-border hover:shadow-lg 
          transition-all duration-500 transform hover:scale-[0.99] hover:-translate-y-1 overflow-hidden 
          mx-auto sm:mx-0
        "
      >
        {/* Premium glow effect */}
        {isPremium && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        <div className="relative w-full h-[80%] bg-gradient-to-br from-slate-50 dark:from-slate-800 to-slate-100 dark:to-slate-700 rounded-t-xl overflow-hidden">
          <img
            src={template?.thumbImage || "/placeholder.svg?height=300&width=240"}
            alt={template?.templateName}
            className="w-full h-full object-cover transition-transform duration-500"
          />

          {/* Enhanced overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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

          {/* Action buttons overlay at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleChooseTemplate(template)
              }}
            >
              {t("use_this")}
            </button>
          </div>
        </div>

        <div className="p-4 relative z-30 bg-white dark:bg-dark-bg-card rounded-b-xl min-h-[20%] overflow-hidden">
          <div className="flex items-start justify-between mb-0">
            <div className="flex-1 min-w-0 max-w-full">
              <h3
                className="font-semibold text-slate-900 dark:!text-dark-text text-sm line-clamp-2 leading-tight block overflow-hidden text-ellipsis"
                title={template?.templateKind}
              >
                {template?.templateKind}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {isDefault && (
              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                <StarIconSolid className="w-2.5 h-2.5" />
                <span>{t('default')}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 w-full">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Enhanced Header - Matching Templates.tsx style */}
        <div className="bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-dark-border p-2">
          <div className="flex flex-col gap-3">
            {/* Mobile Layout (< 640px) */}
            <div className="sm:hidden">
              {/* Title and Close Button */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h1 className="text-base font-bold text-slate-900 dark:!text-dark-text capitalize truncate">
                    {t("choose_a_template")}
                  </h1>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs w-6 h-6 rounded-full font-medium flex items-center justify-center flex-shrink-0">
                    {filteredTemplates.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowTemplateListing(true)}
                  className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Search and View Toggle */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t("search_templates")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 dark:text-dark-text dark:placeholder-gray-500"
                  />
                </div>
                <div className="flex bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-sm rounded-lg p-1 border border-slate-200 dark:border-dark-border shadow-sm flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                      }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === "list"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tablet Layout (640px - 1024px) */}
            <div className="hidden sm:flex lg:hidden flex-col gap-3">
              {/* Title and Close Button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h1 className="text-lg font-bold text-slate-900 dark:!text-dark-text capitalize truncate">
                    {t("choose_a_template")}
                  </h1>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs w-6 h-6 rounded-full font-medium flex items-center justify-center flex-shrink-0">
                    {filteredTemplates.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowTemplateListing(true)}
                  className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Search and View Toggle */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t("search_templates")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 dark:text-dark-text dark:placeholder-gray-500"
                  />
                </div>
                <div className="flex bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-sm rounded-lg p-1 border border-slate-200 dark:border-dark-border shadow-sm flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                      }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === "list"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout (>= 1024px) - Single Row */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              {/* Title and Count */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <h1 className="text-base font-bold text-slate-900 dark:!text-dark-text capitalize whitespace-nowrap">
                  {t("choose_a_template")}
                </h1>
                <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs w-6 h-6 rounded-full font-medium flex items-center justify-center">
                  {filteredTemplates.length}
                </span>
              </div>

              {/* Right Side - Search, View Toggle and Close Button */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-[38px]">
                    <svg
                      className="h-4 w-4 text-slate-400 dark:text-gray-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Search is handled by filtering below
                        e.preventDefault();
                      }
                    }}
                    placeholder={t("search_templates")}
                    className="block w-full pl-10 pr-3 border border-slate-300 dark:border-dark-border rounded-lg text-xs placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-200 h-[38px] dark:bg-dark-bg-card dark:text-dark-text"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg
                        className="h-4 w-4 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* View Toggle */}
                <div className="flex bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-sm rounded-lg p-1 border border-slate-200 dark:border-dark-border shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-[6px] rounded-md transition-all duration-200 ${viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                      }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-[6px] rounded-md transition-all duration-200 ${viewMode === "list"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowTemplateListing(true)}
                  className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Template Type Tabs - Matching Templates.tsx style */}
        <div className="bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-dark-border p-2">
          <div className="flex flex-wrap gap-2">
            {templateTypes.map((type) => {
              const colors = getTemplateTypeColor(type.key)
              return (
                <button
                  key={type.key}
                  onClick={() => setActiveTab(type.key)}
                  className={`p-2 rounded-md font-medium text-sm transition-all duration-300 whitespace-nowrap relative overflow-hidden ${activeTab === type.key
                    ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg ${colors.shadow} transform scale-105`
                    : "text-slate-600 dark:!text-dark-text hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover hover:shadow-md"
                    }`}
                >
                  <span className="relative z-10 flex items-center gap-1 sm:gap-2 text-[11px]">
                    {type.key !== "all" && getTemplateTypeIcon(type.key)}
                    <span className="hidden xs:inline">{type.label}</span>
                    <span className="xs:hidden">{type.label}</span>( {type.count} )
                  </span>
                  {activeTab !== type.key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-dark-hover dark:to-dark-bg-card opacity-0 hover:opacity-100 transition-opacity duration-200" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Enhanced Content - Fixed for full width list view */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/50 dark:to-slate-800/50">
          <div className="p-2 w-full">
            {activeTab === "all" ? (
              // Render grouped templates for "All" tab
              <div className="space-y-2 w-full">
                {Object.entries(groupedTemplatesForAll).map(([templateType, templates]) => {
                  const colors = getTemplateTypeColor(templateType)
                  return (
                    <div key={templateType} className="w-full">
                      <div className="mb-2 w-full">
                        <div className="border rounded-md p-2 bg-white dark:bg-dark-bg-card border-slate-200 dark:border-dark-border">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* parent */}
                            <div className="w-full">
                              {/* header */}
                              <div className="flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-dark-border">
                                <div className={`${colors.text} p-2 bg-gray-200 dark:bg-dark-bg-card rounded-md`}>
                                  {getTemplateTypeIcon(templateType)}
                                </div>
                                <div>
                                  <h2 className="text-sm font-bold text-gray-800 dark:!text-dark-text uppercase">
                                    {templateType} ( {(templates as TemplateState<unknown>[]).length} )
                                  </h2>
                                  {/* <p className="text-xs font-medium text-gray-500">
                                    {(templates as TemplateState<unknown>[]).length} {t('template')}
                                    {(templates as TemplateState<unknown>[]).length !== 1 ? "s" : ""} {t('available')}
                                  </p> */}
                                </div>
                              </div>
                              {/* child */}
                              {/* Templates Grid/List for this type - Fixed container */}
                              <div className="w-full mt-2">
                                {viewMode === "grid" ? (
                                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-2 w-full">
                                    {(templates as TemplateState<unknown>[]).map(
                                      (template: TemplateState<unknown>, index: number) => renderTemplateCard(template, index),
                                    )}
                                  </div>
                                ) : (
                                  <div className="w-full space-y-4">
                                    {(templates as TemplateState<unknown>[]).map(
                                      (template: TemplateState<unknown>, index: number) => renderTemplateCard(template, index),
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Render filtered templates for specific type tabs - Fixed container
              <div className="w-full">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 lg:gap-8 w-full">
                    {filteredTemplates.map((template: TemplateState<unknown>, index: number) =>
                      renderTemplateCard(template, index),
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    {filteredTemplates.map((template: TemplateState<unknown>, index: number) =>
                      renderTemplateCard(template, index),
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Empty State */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-16 sm:py-20 px-4 w-full">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎨</div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:!text-dark-text mb-3">{t('no_templates_found')}</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any templates matching "${searchQuery}".`
                    : "No templates are available for this category."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="w-full sm:w-auto bg-gradient-to-r from-slate-500 to-slate-600 dark:from-gray-600 dark:to-gray-700 hover:from-slate-600 hover:to-slate-700 dark:hover:from-gray-700 dark:hover:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {t('clear_search')}
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