"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, Squares2X2Icon, ListBulletIcon, Bars3Icon, } from "@heroicons/react/24/outline"
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
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";

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
  .dark .scrollbar-thin::-webkit-scrollbar-track {
    background: #334155;
    border-radius: 8px;
  }
  .dark .scrollbar-thin::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #475569, #64748b);
    border-radius: 8px;
  }
  .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #64748b, #94a3b8);
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
  const [searchQuery, setSearchQuery] = useState("") // // This for template search bar
  const [templateSearchQuery, setTemplateSearchQuery] = useState("") // This for right-side search bar
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "date" | "type">("name")
  const [templateGroup, setTemplateGroup] = useState<VoucherType | string>(  (searchParams?.get("template_group")! as VoucherType | string) ?? "SI",)
  const [formType, setFormType] = useState<string>(  (searchParams?.get("form_type")! as string) ?? "",)
  const [customerType, setCustomerType] = useState<string>(  (searchParams?.get("customer_type")! as string) ?? "",)
  const [accountVoucher, setAccountVoucher] = useState(DummyVoucherData)
  const setDefaultTemplate = async (id: any) => {
    try {
      const res = await api.patch(`${Urls.templates}${id}`, {
        is_default: true,
        isCurrent: true,
      })
      handleResponse(res, async () => {
        await getTemplates()
        ERPToast.show(t("template_set_as_default_successfully"), "success")
      })
    } catch (error) {
      console.error("Error setting default template:", error)
      ERPToast.show(t("failed_to_set_template_as_default"), "error")
    }
  }

  const handleDeleteTemplate = async (temp: any) => {
    if (temp?.is_default || temp?.isCurrent) {
      ERPToast.show(t("default_template_cannot_be_deleted"), "warning")
    } else if (temp?.is_primary) {
      ERPToast.show(t("primary_template_cannot_be_deleted"), "warning")
    } else {
      const confirmDelete = window.confirm(
        t("confirm_delete_template")
      )
      if (confirmDelete) {
        try {
          var res = await api.delete(`${Urls.templates}${temp?.id}`)
          handleResponse(res, () => {
            getTemplates()
            ERPToast.show(t("template_deleted_successfully"), "success")
          })
        } catch (error) {
          console.error("Error deleting template:", error)
          ERPToast.show(t("failed_to_delete_template"), "error")
        }
      }
    }
  }

  const onFormTypeChange = (value: string) => {
  const next = new URLSearchParams(searchParams);

  // always keep the key, even if empty
  next.set("form_type", value);

  setSearchParams(next, { replace: true });
};

const onCustomerTypeChange = (value: string) => {
  const next = new URLSearchParams(searchParams);

  next.set("customer_type", value);

  setSearchParams(next, { replace: true });
};

  const getTemplates = async () => {
    setLoading(true)
    try {
      var res = await api.postAsync(`${Urls.templates}filtered`, {
        template_group: templateGroup,
        formType: formType,
        customerType: customerType
      })
      handlePlainResponse(
        res,
        () => {
          setTempData(res)
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

  // When Click arrows it helps to navigate through item using keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault(); // prevent page scroll

    // Select only valid focusable elements
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Collect all focusable elements
    const allFocusable = Array.from(
      document.querySelectorAll(focusableSelector)
    ) as HTMLElement[];

    // Filter out unwanted elements like your clear (X) button
    const focusable = allFocusable.filter(
      (el) => !el.classList.contains("skip-focus")
    );

    if (focusable.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? focusable.indexOf(active) : -1;

    const nextIndex =
      e.key === "ArrowDown"
        ? (currentIndex + 1) % focusable.length
        : (currentIndex - 1 + focusable.length) % focusable.length;

    focusable[nextIndex]?.focus();
  };

  useEffect(() => {
    setTempData([])
    getTemplates()
  }, [templateGroup, formType, customerType])

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = tempData && Array.isArray(tempData) ? tempData : []

    if (templateSearchQuery) {
      filtered = filtered.filter(
        (temp: any) =>
          temp.templateName?.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
          temp.templateType?.toLowerCase().includes(templateSearchQuery.toLowerCase()),
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
  }, [tempData, templateSearchQuery, sortBy])

  const { t } = useTranslation("system")

  const renderTemplateCard = (temp: any) => {
    const isDefault = temp?.isCurrent || temp?.is_default
    const isPremium = temp?.templateType?.toLowerCase() === "premium"

    if (viewMode === "list") {
      return (
        <div
          key={`ti_${temp?.id}`}
          className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-dark-bg-card rounded-xl border border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-border hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 dark:via-blue-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex-shrink-0 w-24 h-24 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-50 dark:bg-dark-bg-card border border-slate-200 dark:border-dark-border shadow-sm">
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
              <h3 className="font-semibold text-slate-900 dark:!text-dark-text text-base lg:text-lg truncate" title={temp?.templateName}>
                {temp?.templateName}
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400 capitalize mb-2">{temp?.templateType || "Standard"} {t("template")}</p>
          </div>
          <div className="relative flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-200 hover:scale-110"
              title={t("edit")}
              onClick={() =>
                templateGroup == "barcode"
                  ? navigate(`/label-designer/${temp?.id}?template_group=${templateGroup}`)
                  : navigate(`/invoice_designer/${temp?.id}?template_group=${templateGroup}&form_type=${formType}&customer_type=${customerType}`, {
                    state: { templateKind: temp?.templateKind, templateType: temp?.templateType },
                  })
              }
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200 hover:scale-110"
              title={t("delete")}
              onClick={() => handleDeleteTemplate(temp)}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            {!isDefault && (
              <button
                className="bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-950 dark:to-indigo-950 hover:from-blue-500 hover:to-indigo-600 hover:text-white text-slate-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 whitespace-nowrap"
                onClick={() => setDefaultTemplate(temp?.id)}
              >
                {t('set_default')}
              </button>
            )}
            {isDefault && (
              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs px-2 sm:px-3 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800 flex items-center gap-1 flex-shrink-0 w-fit">
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
          group relative w-full max-w-[200px] sm:max-w-[350px] md:max-w-[310px] lg:max-w-[270px] 
          h-[250px] xs:h-[260px] sm:h-[280px] md:h-[300px] lg:h-[280px] 
          aspect-[4/5] bg-white dark:bg-dark-bg-card rounded-xl sm:rounded-2xl 
          border border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-border hover:shadow-lg 
          transition-all duration-500 transform hover:scale-[0.99] hover:-translate-y-1 overflow-hidden 
          mx-auto sm:mx-0
        "
      >
        {isPremium && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        <div className="relative w-full h-[80%] bg-gradient-to-br from-slate-50 dark:from-slate-800 to-slate-100 dark:to-slate-700 rounded-t-xl overflow-hidden">
          <div>
            <img
              src={temp?.thumbImage || "/placeholder.svg?height=300&width=240"}
              alt={temp?.templateName}
              className="w-full h-full object-cover transition-transform duration-500"
            />
          </div>
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
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-slate-900/60 backdrop-blur-sm flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
            <div className="flex items-center justify-center flex-1 overflow-hidden">
              {isDefault ? (
                <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800 flex items-center gap-1 flex-shrink-0 whitespace-nowrap overflow-hidden">
                  <StarIconSolid className="w-3 h-3" />
                  <span>{t("default")}</span>
                </span>
              ) : (
                <button
                  className="bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-950 dark:to-indigo-950 hover:from-blue-500 hover:to-indigo-600 hover:text-white text-slate-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 relative z-10 flex-shrink-0 whitespace-nowrap overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setDefaultTemplate(temp?.id)
                  }}
                >
                  {t('set_default')}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 relative z-30 bg-white dark:bg-dark-bg-card rounded-b-xl overflow-hidden min-h-[20%]">
          <div className="flex items-center justify-between mb-0">
            <div className="flex-1 min-w-0 max-w-full">
              <h3
                className="font-semibold mj23333 text-slate-900 dark:!text-dark-text text-sm line-clamp-2 leading-tight block overflow-hidden text-ellipsis"
                title={temp?.templateName || "No Name"}
              >
                {temp?.templateName || "Untitled Template"}
              </h3>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 flex-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                {/* Edit Button */}
                <button className="bg-white border border-slate-200 hover:bg-blue-500 p-2 rounded-lg transition-all duration-200 flex items-center justify-center group/edit"
                  title={t('edit')}
                  onClick={(e) => {
                    e.stopPropagation()
                    templateGroup === 'barcode'
                      ? navigate(`/label-designer/${temp?.id}?template_group=${templateGroup}`)
                      : navigate(`/invoice_designer/${temp?.id}?template_group=${templateGroup}&form_type=${formType}&customer_type=${customerType}`, {
                        state: { templateKind: temp?.templateKind, templateType: temp?.templateType },
                      })
                  }}
                >
                  <PencilIcon className="w-4 h-4 text-blue-500 group-hover/edit:text-white transition-colors duration-200" />
                </button>

                {/* Delete Button */}
                <button className=" bg-white border border-red-200  hover:bg-red-500  p-2 rounded-lg  transition-all duration-200  flex items-center justify-center group/delete"
                  title={t('delete')}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTemplate(temp)
                  }}
                >
                  <TrashIcon className="w-4 h-4 text-red-500 group-hover/delete:text-white transition-colors duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {showTemplateListing ? (
        <>
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
              <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm" />
            </div>
          )}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-white/95 dark:bg-dark-bg-card/95 backdrop-blur-xl border-r border-slate-200 dark:border-dark-border transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none h-full overflow-y-auto scrollbar-thin`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between flex-shrink-0 px-2 py-[15px] border-b border-slate-200 dark:border-dark-border">
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                    {t("templates")}
                  </h1>
                </div>
                <button
                  className="lg:hidden p-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-gray-600 scrollbar-track-slate-100 dark:scrollbar-track-gray-800">
                {/* Search Box */}
                <div>
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
                      autoFocus={true}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          // It focuses the first one
                          document.getElementById("template-list")?.focus();
                        }
                        else if (e.key === 'Enter') {
                          // Search is handled by filtering below
                          e.preventDefault();
                        }
                      }}
                      placeholder={t("search_templates")}
                      className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-slate-300 rounded-lg text-xs placeholder-slate-400 dark:placeholder-gray-500 dark:bg-dark-bg-card dark:border-dark-border dark:text-dark-text transition-all duration-200 h-[38px]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center skip-focus"
                        tabIndex={-1}
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
                </div>

                {/* Navigation */}
                <nav className="p-2 space-y-1">
                  {TemplateTypes.filter((template) => {
                    if (!searchQuery) return true;
                    return t(template.name).toLowerCase().includes(searchQuery.toLowerCase());
                  }).map((template, index) => {
                    const isActive = templateGroup === template?.template_group_id;
                    return (
                      <button
                        key={`tt_${index}`}
                        id="template-list"
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        onClick={() => {
                          setSearchParams({ template_group: template?.template_group_id });
                          setTemplateGroup(template?.template_group_id);
                          setSidebarOpen(false);
                          // Check the below both 
                          setFormType("")
                          setCustomerType("")
                        }}
                        className={`group w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-xl sm:rounded-2xl transition-all duration-200 ${isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-700 dark:!text-dark-text hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                          }`}
                      >
                        <span className="truncate text-xs sm:text-sm">{t(template.name)}</span>
                        {isActive && <div className="w-2 h-2 bg-white rounded-full opacity-75" />}
                      </button>
                    );
                  })}
                  {TemplateTypes.filter((template) => {
                    if (!searchQuery) return true;
                    return t(template.name).toLowerCase().includes(searchQuery.toLowerCase());
                  }).length === 0 && (
                      <div className="text-center py-8 text-slate-500 dark:text-gray-400 text-sm">
                        {t("no_templates_found")}
                      </div>
                    )}
                </nav>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-screen">
            <div className="bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-xl border-b border-slate-200 dark:border-dark-border p-2">
              <div className="flex flex-col gap-3">
                {/* Mobile Layout (< 640px) */}
                <div className="sm:hidden">
                  {/* Top Row - Hamburger, Title, Count, New Button */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <button
                        className="p-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover rounded-lg transition-colors flex-shrink-0"
                        onClick={() => setSidebarOpen(true)}
                      >
                        <Bars3Icon className="w-5 h-5" />
                      </button>
                      <h1 className="text-base font-bold text-slate-900 dark:!text-dark-text capitalize truncate">
                        {templateGroup?.replaceAll("_", " ")} {t("templates")}
                      </h1>
                      <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">
                        {filteredAndSortedTemplates.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowTemplateListing(false)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm flex-shrink-0"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>{t('new')}</span>
                    </button>
                  </div>

                  {/* Bottom Row - Search and View Toggle */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        placeholder={t("search_templates")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 dark:text-dark-text dark:placeholder-gray-500"
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
                        <Squares2X2Icon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all duration-200 ${viewMode === "list"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                          }`}
                      >
                        <ListBulletIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tablet Layout (640px - 1024px) */}
                <div className="hidden sm:flex lg:hidden flex-col gap-3">
                  {/* Top Row - Hamburger, Title, Count, New Button */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        className="p-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover rounded-lg transition-colors flex-shrink-0"
                        onClick={() => setSidebarOpen(true)}
                      >
                        <Bars3Icon className="w-5 h-5" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h1 className="text-lg font-bold text-slate-900 dark:!text-dark-text capitalize truncate">
                            {templateGroup?.replaceAll("_", " ")} {t("templates")}
                          </h1>
                          <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">
                            {filteredAndSortedTemplates.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowTemplateListing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm flex-shrink-0"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>{t('new')}</span>
                    </button>
                  </div>

                  {/* Bottom Row - Search and View Toggle */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 min-w-0">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        placeholder={t("search_templates")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 dark:text-dark-text dark:placeholder-gray-500"
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
                        <Squares2X2Icon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all duration-200 ${viewMode === "list"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
                          }`}
                      >
                        <ListBulletIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout (>= 1024px) - Single Row */}
                <div className="hidden lg:flex items-center justify-between gap-4">
                  {/* Left Side - Hamburger (hidden on lg+), Title and Count */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <h1 className="text-base font-bold text-slate-900 dark:!text-dark-text capitalize whitespace-nowrap">
                      {templateGroup?.replaceAll("_", " ")} {t("templates")}
                    </h1>
                    <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">
                      {filteredAndSortedTemplates.length}
                    </span>
                  </div>

                  {/* Right Side - Search, View Toggle, and New Button */}
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
                        value={templateSearchQuery}
                        onChange={(e) => setTemplateSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            // Search is handled by filtering below
                            e.preventDefault();
                          }
                        }}
                        placeholder={t("search_templates")}
                        className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-slate-300 dark:border-dark-border rounded-lg text-xs placeholder-slate-400 dark:placeholder-gray-500 transition-all duration-200 h-[38px] dark:bg-dark-bg-card dark:text-dark-text"
                      />
                      {templateSearchQuery && (
                        <button
                          onClick={() => setTemplateSearchQuery('')}
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
                    <div className="flex gap-1 bg-white/80 dark:bg-dark-bg-card/80 backdrop-blur-sm rounded-lg p-1 border border-slate-200 dark:border-dark-border shadow-sm">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`p-[6px] rounded-md transition-all duration-200 ${viewMode === "grid"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                      >
                        <Squares2X2Icon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`p-[6px] rounded-md transition-all duration-200 ${viewMode === "list"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                      >
                        <ListBulletIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* New Button */}
                    <button
                      onClick={() => setShowTemplateListing(false)}
                      className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>{t('new')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* New Header creation for formtype */}
            {/* Initial first list selection required */}
            {!["PARP","RARP","CBR","Cheque","barcode",].includes(templateGroup) && (
            <div className="border-b-1 bg-white dark:bg-dark-bg-card h-fit p-2 flex gap-8 border-slate-200 dark:border-dark-border">
              <ERPDataCombobox
                id="Form Type"
                labelDirection="horizontal"
                value={formType}
                defaultValue={formType}
                field={{
                  id: "id",
                  getListUrl: `${Urls.template_FormTypeByVoucherType}/${templateGroup}`,
                  valueKey: "name",
                  labelKey: "name",
                }}

                onChange={(e: any) => {
                  setFormType(e.value ? e.name : "")
                  onFormTypeChange(e.value ? e.name : "")
                }}
              />

              <ERPDataCombobox
                id="Customer_Type"
                labelDirection="horizontal"
                defaultValue={customerType}
                value={customerType}
                field={{
                  id: "Customer_Type",
                  valueKey: "id",
                  labelKey: "name",
                }}
                options={[
                  { id: 1, name: "" },
                  { id: 2, name: "B2B" },
                  { id: 3, name: "B2C" },
                  { id: 4, name: "INT" },
                ]}
                onChange={(e: any) => {
                  setCustomerType(e.value ? e.name : "")
                  onCustomerTypeChange(e.value ? e.name : "")
                }}
              />
            </div>
            )}

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="p-2 w-full">
                {loading ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-2 w-full"
                        : "space-y-4"
                    }
                  >
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={
                          viewMode === "grid"
                            ? "aspect-[4/5] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl animate-pulse"
                            : "h-28 sm:h-36 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg animate-pulse"
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-2 w-full"
                          : "space-y-4"
                      }
                    >
                      {filteredAndSortedTemplates.map((temp: any) => renderTemplateCard(temp))}
                      {viewMode === "grid" ? (
                        <div className="
          group relative w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[270px] 
          h-[250px] xs:h-[260px] sm:h-[280px] md:h-[300px] lg:h-[280px] 
          aspect-[4/5] bg-white dark:bg-dark-bg-card rounded-xl sm:rounded-2xl 
          border border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-border hover:shadow-lg 
          transition-all duration-500 transform hover:scale-[0.99] hover:-translate-y-1 overflow-hidden 
          mx-auto sm:mx-0
        ">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <PlusIcon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:!text-dark-text mt-3 mb-1 text-base sm:text-lg">{t('new_template')}</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">{t('create_new_template')}</p>
                          </div>
                          <button
                            onClick={() => setShowTemplateListing(false)}
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex-shrink-0">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <PlusIcon className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="relative flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 dark:!text-dark-text text-base mb-1">{t('new_template')}</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm">{t('create_new_template')}</p>
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
                          <button
                            onClick={() => setShowTemplateListing(false)}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            {t('create_template')}
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
          formtype={formType}
          customerType={customerType}
          // tempData={tempCrmData}
        />
      )}
    </div>
  )
}

export default Templates