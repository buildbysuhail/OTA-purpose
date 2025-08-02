"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import type { TemplateState } from "./Designer/interfaces"
import { DummyVoucherData } from "./constants/DummyData"
import { TemplateTypes } from "./constants/TemplateCategories"
import { getCurrentCurrencySymbol } from "../../utilities/Utils"
import { handlePlainResponse, handleResponse } from "../../utilities/HandleResponse"
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch"
import Urls from "../../redux/urls"
import { APIClient } from "../../helpers/api-client"
import { useTranslation } from "react-i18next"
import type VoucherType from "../../enums/voucher-types"
import { Search, Sparkles } from "lucide-react"
import ChooseTemplate from "./choose-template"
import ERPToast from "../../components/ERPComponents/erp-toast"

// Enhanced scrollbar styles
const scrollbarStyles = `
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 8px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
    border-radius: 8px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #94a3b8, #64748b);
  }
`

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style")
  styleElement.textContent = scrollbarStyles
  document.head.appendChild(styleElement)
}

interface previewState {
  show: boolean
  template?: TemplateState<unknown>
}
const api = new APIClient()

const Templates = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const currencySymbol = getCurrentCurrencySymbol()
  const [loading, setLoading] = useState(false)
  const [tempData, setTempData] = useState([])
  const [tempCrmData, setTempCRMData] = useState([])
  const [showPreview, setShowPreview] = useState<previewState>({ show: false })
  const [showTemplateListing, setShowTemplateListing] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "date" | "type">("name")

  const [templateGroup, setTemplateGroup] = useState<VoucherType | string>(
    (searchParams?.get("template_group")! as VoucherType | string) ?? "SI",
  )
  const [accountVoucher, setAccountVoucher] = useState(DummyVoucherData)

  const setDefaultTemplate = async (id: any) => {
    try {
      const res = await api.patch(`${Urls.templates}${id}`, {
        is_default: true,
        isCurrent: true,
      })
      handleResponse(res, async () => {
        await getTemplates()
        ERPToast.show("Template set as default successfully!", "success")
      })
    } catch (error) {
      console.error("Error setting default template:", error)
      ERPToast.show("Failed to set template as default", "error")
    }
  }

  const handleDeleteTemplate = async (temp: any) => {
    if (temp?.is_default || temp?.isCurrent) {
      ERPToast.show("Default template cannot be deleted.", "warning")
    } else if (temp?.is_primary) {
      ERPToast.show("Primary template cannot be deleted.", "warning")
    } else {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this template? This action cannot be undone.",
      )
      if (confirmDelete) {
        try {
          var res = await api.delete(`${Urls.templates}${temp?.id}`)
          handleResponse(res, () => {
            getTemplates()
            ERPToast.show("Template deleted successfully!", "success")
          })
        } catch (error) {
          console.error("Error deleting template:", error)
          ERPToast.show("Failed to delete template", "error")
        }
      }
    }
  }

  const getTemplates = async () => {
    setLoading(true)
    try {
      var res = await api.getAsync(Urls.templates, `template_group=${templateGroup}`)
      handlePlainResponse(
        res,
        () => {
          setTempData(res)
        },
        undefined,
        false,
        false,
      )

      var resCrm = await api.getAsync(Urls.crm_templates, `template_group=${templateGroup}`)
      handlePlainResponse(
        resCrm,
        () => {
          setTempCRMData(resCrm)
        },
        undefined,
        false,
        false,
      )
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTempData([])
    getTemplates()
  }, [templateGroup])

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = tempData

    if (searchQuery) {
      filtered = filtered.filter(
        (temp: any) =>
          temp.templateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          temp.templateType?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return (a.templateName || "").localeCompare(b.templateName || "")
        case "date":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case "type":
          return (a.templateType || "").localeCompare(b.templateType || "")
        default:
          return 0
      }
    })

    return filtered
  }, [tempData, searchQuery, sortBy])

  const { t } = useTranslation("system")

  const renderTemplateCard = (temp: any) => {
    const isDefault = temp?.isCurrent || temp?.is_default
    const isPremium = temp?.templateType?.toLowerCase() === "premium"

    if (viewMode === "list") {
      return (
        <div
          key={`ti_${temp?.id}`}
          className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex-shrink-0 w-24 h-24 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
            <img
              src={temp?.thumbImage || "/placeholder.svg?height=96&width=80"}
              alt={temp?.templateName}
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
              <h3 className="font-semibold text-slate-900 text-base lg:text-lg truncate" title={temp?.templateName}>
                {temp?.templateName}
              </h3>
            </div>
            <p className="text-sm text-slate-500 capitalize mb-2">{temp?.templateType || "Standard"} Template</p>
          </div>
          <div className="relative flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
              title={t("edit")}
              onClick={() =>
                templateGroup == "barcode"
                  ? navigate(`/label-designer/${temp?.id}?template_group=${templateGroup}`)
                  : navigate(`/invoice_designer/${temp?.id}?template_group=${templateGroup}`, {
                      state: { templateKind: temp?.templateKind, templateType: temp?.templateType },
                    })
              }
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
              title={t("delete")}
              onClick={() => handleDeleteTemplate(temp)}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            {!isDefault && (
              <button
                className="bg-gradient-to-r from-blue-100 to-indigo-200 hover:from-blue-500 hover:to-indigo-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 whitespace-nowrap"
                onClick={() => setDefaultTemplate(temp?.id)}
              >
                Set Default
              </button>
            )}
            {isDefault && (
              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-2 sm:px-3 py-1 rounded-full font-medium border border-blue-200 flex items-center gap-1 flex-shrink-0 w-fit">
                <StarIconSolid className="w-3 h-3" />
                <span>{t("default")}</span>
              </span>
            )}
          </div>
        </div>
      )
    }

    return (
      <div
        key={`ti_${temp?.id}`}
        className="
          group relative w-full aspect-[4/5] h-[40vw] max-h-[360px] min-h-[180px] bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-300 
          hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden sm:h-[280px] md:h-[320px] lg:h-[360px]
        "
      >
        {isPremium && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        <div className="relative w-full h-[80%] bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-xl overflow-hidden">
          <img
            src={temp?.thumbImage || "/placeholder.svg?height=300&width=240"}
            alt={temp?.templateName}
            className="w-full h-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-1 rounded-bl-md font-medium shadow-lg backdrop-blur-sm overflow-hidden">
            <span className="capitalize">{temp?.templateType || "Standard"}</span>
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1 overflow-hidden">
            {isPremium && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-1.5 rounded-full shadow-lg overflow-hidden">
                <StarIconSolid className="w-3 h-3" />
              </div>
            )}
            {isDefault && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1.5 rounded-full shadow-lg overflow-hidden">
                <Sparkles className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-900/60 backdrop-blur-sm flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
            <div className="flex items-center justify-center gap-3 flex-1 overflow-hidden">
              <button
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors overflow-hidden"
                title={t("edit")}
                onClick={(e) => {
                  e.stopPropagation()
                  templateGroup == "barcode"
                    ? navigate(`/label-designer/${temp?.id}?template_group=${templateGroup}`)
                    : navigate(`/invoice_designer/${temp?.id}?template_group=${templateGroup}`, {
                        state: { templateKind: temp?.templateKind, templateType: temp?.templateType },
                      })
                }}
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                className="bg-white/20 hover:bg-white/30 text-red-400 p-2 rounded-lg transition-colors overflow-hidden"
                title={t("delete")}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteTemplate(temp)
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center flex-1 overflow-hidden">
              {isDefault ? (
                <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium border border-blue-200 flex items-center gap-1 flex-shrink-0 whitespace-nowrap overflow-hidden">
                  <StarIconSolid className="w-3 h-3" />
                  <span>{t("default")}</span>
                </span>
              ) : (
                <button
                  className="bg-gradient-to-r from-blue-100 to-indigo-200 hover:from-blue-500 hover:to-indigo-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 relative z-10 flex-shrink-0 whitespace-nowrap overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setDefaultTemplate(temp?.id)
                  }}
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 relative z-30 bg-white rounded-b-xl overflow-hidden min-h-[20%]">
          <div className="flex items-start justify-between mb-0">
            <div className="flex-1 min-w-0 max-w-full">
              <h3
                className="font-semibold mj23333 text-slate-900 text-sm line-clamp-2 leading-tight block overflow-hidden text-ellipsis"
                title={temp?.templateName || "No Name"}
              >
                {temp?.templateName || "Untitled Template"}
              </h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[91vh] bg-gradient-to-br from-slate-50 to-blue-50/30">
      {showTemplateListing ? (
        <>
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
            </div>
          )}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between flex-shrink-0 px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {t("templates")}
                  </h1>
                </div>
                <button
                  className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 sm:py-6 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-100">
                <nav className="px-3 sm:px-4 space-y-1 sm:space-y-2">
                  {TemplateTypes.map((template, index) => {
                    const isActive = searchParams?.get("template_group") === template?.template_group_id
                    return (
                      <button
                        key={`tt_${index}`}
                        onClick={() => {
                          setSearchParams({ template_group: template?.template_group_id })
                          setTemplateGroup(template?.template_group_id)
                          setSidebarOpen(false)
                        }}
                        className={`group w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium rounded-xl sm:rounded-2xl transition-all duration-200 ${isActive ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                      >
                        <span className="truncate text-xs sm:text-sm">{t(template.name)}</span>
                        {isActive && <div className="w-2 h-2 bg-white rounded-full opacity-75" />}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <button
                      className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <Bars3Icon className="w-5 h-5" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 capitalize truncate">
                          {templateGroup?.replaceAll("_", " ")} {t("templates")}
                        </h1>
                        <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">
                          {filteredAndSortedTemplates.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:hidden flex-shrink-0">
                    <button
                      onClick={() => setShowTemplateListing(false)}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span className="hidden xs:inline">New</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-slate-200 shadow-sm flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all duration-200 ${viewMode === "grid" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                      >
                        <Squares2X2Icon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all duration-200 ${viewMode === "list" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                      >
                        <ListBulletIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="hidden lg:block">
                      <button
                        onClick={() => setShowTemplateListing(false)}
                        className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span>New</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 to-blue-50/30">
              <div className="p-4 sm:p-6 lg:p-8">
                {loading ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
                        : "space-y-4"
                    }
                  >
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={
                          viewMode === "grid"
                            ? "aspect-[4/5] bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl animate-pulse"
                            : "h-28 sm:h-36 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
                          : "space-y-4"
                      }
                    >
                      {filteredAndSortedTemplates.map((temp: any) => renderTemplateCard(temp))}
                      {viewMode === "grid" ? (
                        <div className="group relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all duration-300 cursor-pointer aspect-[4/5] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <PlusIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mt-3 mb-1 text-base sm:text-lg">New Template</h3>
                            <p className="text-slate-600 text-sm sm:text-base">Create new template</p>
                          </div>
                          <button
                            onClick={() => setShowTemplateListing(false)}
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all duration-300 cursor-pointer relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex-shrink-0">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <PlusIcon className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="relative flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-base mb-1">New Template</h3>
                            <p className="text-slate-600 text-sm">Create new template</p>
                          </div>
                          <button
                            onClick={() => setShowTemplateListing(false)}
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                    {filteredAndSortedTemplates.length === 0 && !loading && (
                      <div className="text-center py-16 sm:py-20 px-4">
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
                          <button
                            onClick={() => setShowTemplateListing(false)}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            Create Template
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <ChooseTemplate
          templateGroup={templateGroup}
          setShowTemplateListing={setShowTemplateListing}
          tempData={tempCrmData}
        />
      )}
    </div>
  )
}

export default Templates