"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from "react";
import { Settings, Minus, Menu, Edit, Scan, Printer, X, Image, QrCode as QrCodeIcon, Package, } from "lucide-react";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import { Tabs, Tab, Box, Typography, InputLabel, Stack, Chip, } from "@mui/material";
import ERPToast from "../../components/ERPComponents/erp-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Urls from "../../redux/urls";
import { APIClient } from "../../helpers/api-client";
import { handleResponse } from "../../utilities/HandleResponse";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../components/ERPComponents/erp-button";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { DesignerElementType, initialBacodeTemplateState, LabelState, PlacedComponent, PropertiesState, QRCodeProps, templateDesignerFormatOptions, TemplateDto, TemplateState, } from "../InvoiceDesigner/Designer/interfaces";
import { useAppState } from "../../utilities/hooks/useAppState";
import ERPPreviousUrlButton from "../../components/ERPComponents/erp-previous-uirl-button";
import { setTemplateCustomElements } from "../../redux/slices/templates/reducer";
import { convertFileToBase64 } from "../../utilities/file-utils";
import { useTranslation } from "react-i18next";
import VoucherType, { accountsVoucherTypes, } from "../../enums/voucher-types";
import { accountsFields, inventoryFields, barCodeField, imgField,ledgerReportFields,CheckFields } from "./fields";
import { containsArabicString, getPageDimensions, ptToPx, pxToPt } from "../InvoiceDesigner/utils/pdf-util";
import { QRCodeComponent } from "./QRCodeComponent";
import GroupedComboBox from "../../components/ERPComponents/erp-grouped-combo";
import { AccessPrinterList } from "../InvoiceDesigner/utils/get_printers";
import { initialPrintMasterDto } from "../use-print-type-data";
import { hexToRgb } from "../../components/common/switcher/switcherdata/switcherdata";
import { generateUniqueKey } from "../../utilities/Utils";
import ERPSlider from "../../components/ERPComponents/erp-slider";
import { fetchTemplateFromApiById } from "../use-print";
import { useUndoRedo } from "../../utilities/hooks/use-undoRedo";
import useDebounce from "../transaction-base/use-debounce";

// Interfaces
interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  components: PlacedComponent[];
}

interface PurchaseItem {
  id: number;
  productName: string;
  quantity: number;
  salesPrice: number;
  barcode: string;
}

interface DeleteButtonProps {
  id: string;
  isSelected: boolean;
  handleDelete: (id: string) => void;
  depth?: number
}

interface PDFBarcodeDesignerProps {
  forCustomRows?: boolean;
  template?: TemplateState<{}>;
  customTemplate?: any;
  onSuccess?: () => void;
}
type PaddingMarginSides = "top" | "right" | "bottom" | "left";
type GapSides = "hgap" | "vgap";
export interface barcodeCreateProps {
  format: string;
  field: string;
  barWidth: number;
  height: number;
  margin: number;
  background: string;
  lineColor: string;
  showText: boolean;
  textAlign: 'left' | 'center' | 'right';
  font: string;
  fontSize: number;
  textMargin: number;
  fontStyle: 'normal' | 'bold' | 'italic';
}

// Delete Button Component
export const DeleteButton: React.FC<DeleteButtonProps> = ({ id, isSelected, handleDelete, depth = 0 }) => isSelected ? (
  <button
    className={`absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full  flex items-center justify-center hover:bg-[#ebb0ad] focus:outline-none focus:ring-2 focus:ring-[#e0655e] focus:ring-opacity-75 transition-colors duration-200 ease-in-out text-[#da514a] hover:text-[#ec5149] `}
    style={{ zIndex: 10 + depth }}
    onClick={(e) => {
      e.stopPropagation();
      handleDelete(id);
    }}
    onMouseDown={(e) => e.stopPropagation()}
    aria-label="Delete"
  >
    <X size={16} />
  </button>
) : null;

// Constants
const barcodeFormats = [
  "CODE128",
  "CODE39",
  "EAN13",
  "EAN8",
  "EAN5",
  "EAN2",
  "UPC",
  "UPCE",
  "ITF",
  "ITF14",
  "MSI",
  "MSI10",
  "MSI11",
  "MSI1010",
  "MSI1110",
  "pharmacode",
  "codabar",
];

const pageSizeOptions = [
  { label: "A5", value: "A5" },
  { label: "A4", value: "A4" },
  { label: `3 "`, value: "3Inch" },
  { label: `4 "`, value: "4Inch" },
  { label: `LETTER "`, value: "LETTER" },
  { label: "Custom", value: "Custom" },
];

const objectFitOptions = [
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
  { label: "Fill", value: "fill" },
  { label: "None", value: "none" },
  { label: "Scale Down", value: "scale-down" },
];

const objectPosition = [
  { label: "Top Left", value: "top left" },
  { label: "Top Center", value: "top center" },
  { label: "Top Right", value: "top right" },
  { label: "Center Left", value: "center left" },
  { label: "Center", value: "center center" },
  { label: "Center Right", value: "center right" },
  { label: "Bottom Left", value: "bottom left" },
  { label: "Bottom Center", value: "bottom center" },
  { label: "Bottom Right", value: "bottom right" },
];

// const imgContent = [{ label: "img1", value: usFlag }];

// Utility functions

// Main Component
const PDFBarcodeDesigner: React.FC<PDFBarcodeDesignerProps> = ({ forCustomRows = false, template, customTemplate, onSuccess, }) => {
  // State
  const [zoom, setZoom] = useState(100);
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group")! as VoucherType | string;
  const [selectedComponent, setSelectedComponent] = useState<PlacedComponent | null>(null);
  const [loading, setLoading] = useState(false);
  const [draggingComponent, setDraggingComponent] = useState<PlacedComponent | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const barcodeRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const qrCodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeTab, setActiveTab] = useState(forCustomRows ? "element" : "page");
  const [barcodeErrors, setBarcodeErrors] = useState<any>([]);
  const isHeader = customTemplate?.split(".")[0] ?? "";
  const appState = useAppState();
  const inputFile = useRef<HTMLInputElement>(null);
  const inputImgFile = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api = new APIClient();
  const [templateData, setTemplateData] = useState<TemplateState<unknown>>(initialBacodeTemplateState<unknown>().data || {});
  const [designerData, setDesignerData] = useState({ background_image: "", bg_image_position: "", background_color: "", bg_image_objectFit: "", isFirstOnly: true, });
  const { t } = useTranslation("labelDesigner");
  const pageSize = template?.propertiesState?.pageSize ?? "A4";
  const selectedPageSize = getPageDimensions(pageSize, template?.propertiesState?.width, template?.propertiesState?.height);
  const customePageWidth = selectedPageSize?.width - ((template?.propertiesState?.padding?.left ?? 0) + (template?.propertiesState?.padding?.right ?? 0))
  const [customePageHeight, setCustomePageHeight] = useState(200);
  const customePageMaxHeight = selectedPageSize?.height - (template?.propertiesState?.padding?.top ?? 0);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(250);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(380);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [toolbarHeightPt, setToolbarHeightPt] = useState(0);


useLayoutEffect(() => {
  if (!toolbarRef.current) return;

  const heightPx = toolbarRef.current.getBoundingClientRect().height;
  const heightPt = pxToPt(heightPx); 
  setToolbarHeightPt(heightPt);
}, []);

const {
  canUndo,
  canRedo,
  undo: undoAction,
  redo: redoAction,
  clearHistory,
  pushState,
  history,
  historyIndex,
  resetHistory,
} = useUndoRedo(templateData);


    // Track current state to detect changes
  const prevTemplateDataRef = useRef(templateData);

    // Helper: Push state to history when templateData changes
  const pushToHistory = useCallback(
    (newState: TemplateState<unknown>, action: string) => {
      pushState(newState, action);
      prevTemplateDataRef.current = newState;
    },
    [pushState,leftSidebarWidth, rightSidebarWidth, zoom]
  );

    // Override undo/redo to also update templateData
const handleUndo = useCallback(() => {
  if (canUndo && historyIndex > 0) {
    const previousIndex = historyIndex - 1;
    if (history[previousIndex]) {
      const previousState = history[previousIndex];
      setTemplateData(previousState.templateData);
      undoAction(); // Call the hook's undo to update historyIndex
      // Sync selectedComponent with new templateData ----
      setSelectedComponent((prev) => {
      if (!prev) return null;
      return previousState?.templateData?.barcodeState?.placedComponents
        .find(c => c.id === prev.id) || null;
    });
    }
  }
}, [canUndo, historyIndex, history, undoAction]);

const handleRedo = useCallback(() => {
  if (canRedo && historyIndex < history.length - 1) {
    const nextIndex = historyIndex + 1;
    if (history[nextIndex]) {
      const nextState = history[nextIndex];
      setTemplateData(nextState.templateData);
      redoAction(); // Call the hook's redo to update historyIndex
      // Sync selectedComponent with new templateData ----
      setSelectedComponent((prev) => {
      if (!prev) return null;
      return nextState?.templateData?.barcodeState?.placedComponents
        .find(c => c.id === prev.id) || null;
    })
    }
  }
}, [canRedo, historyIndex, history, redoAction]);

const debouncedPushDragHistory = useDebounce(
  (currentState: TemplateState<unknown>) => {
    pushToHistory(currentState, "Moved component");
  },
  150 // Matches your drag debounce timing
);
  // Components configuration
  const components = [
    {
      id: DesignerElementType.text,
      label: t("text"),
      icon: <Edit className="w-4 h-4" />,
      defaultContent: "Text",
    },
    {
      id: DesignerElementType.barcode,
      label: t("barcode"),
      icon: <Scan className="w-4 h-4" />,
      defaultContent: "123456789012",
    },
    {
      id: DesignerElementType.field,
      label: t("field"),
      icon: <Menu className="w-4 h-4" />,
      defaultContent: "Select",
    },
    {
      id: DesignerElementType.line,
      label: t("line"),
      icon: <Minus className="w-4 h-4" />,
      defaultContent: "Line",
    },
    {
      id: DesignerElementType.image,
      label: t("image"),
      icon: <Image className="w-4 h-4" />,
      defaultContent: "Image",
    },
    {
      id: DesignerElementType.qrCode,
      label: t("qrcode"),
      icon: <QrCodeIcon className="w-4 h-4" />,
      defaultContent: "QrCode",
    },
    {
      id: DesignerElementType.container,
      label: t("container"),
      icon: <Package className="w-4 h-4 text-blue-600" />,
      defaultContent: "",
    },
  ];

  // Helper function to get absolute position of a component considering nested containers
  const getAbsolutePosition = (component: PlacedComponent, allComponents: PlacedComponent[]): { x: number; y: number } => {
    let x = component.x;
    let y = component.y;
    let currentContainerId = component.containerId;
    // Traverse up the container hierarchy
    while (currentContainerId) {
      const parentContainer = allComponents.find(c => c.id === currentContainerId);
      if (parentContainer) {
        const containerPadding = parentContainer.containerProps?.padding || 10;
        x += parentContainer.x + containerPadding;
        y += parentContainer.y + containerPadding;
        currentContainerId = parentContainer.containerId;
      } else {
        break;
      }
    }
    return { x, y };
  };

  // Helper function to find target container at drop position
  const findDeepestContainerAt = (x: number, y: number, components: PlacedComponent[], excludeId?: string): PlacedComponent | null => {
    let deepestContainer: PlacedComponent | null = null;
    let maxDepth = -1;
    const getDepth = (comp: PlacedComponent): number => {
      let depth = 0;
      let currentId = comp.containerId;
      while (currentId) {
        depth++;
        const parent = components.find(c => c.id === currentId);
        currentId = parent?.containerId;
      }
      return depth;
    };
    for (const comp of components) {
      if (comp.type === DesignerElementType.container && comp.id !== excludeId) {
        const absolutePos = getAbsolutePosition(comp, components);
        const padding = comp.containerProps?.padding || 10;
        if (
          x >= absolutePos.x &&
          x <= absolutePos.x + comp.width &&
          y >= absolutePos.y &&
          y <= absolutePos.y + comp.height
        ) {
          const depth = getDepth(comp);
          if (depth > maxDepth) {
            maxDepth = depth;
            deepestContainer = comp;
          }
        }
      }
    }
    return deepestContainer;
  };

  // Drag start handler
  const handleDragStart = (e: React.DragEvent, componentType: DesignerElementType) => {
    e.dataTransfer.setData("componentType", componentType.toString());
    setSelectedComponent(null);
  };

  // Drop into container handler - UPDATED for n-level nesting
  const handleDropIntoContainer = (e: React.DragEvent<HTMLDivElement>, container: PlacedComponent) => {
    e.preventDefault();
    e.stopPropagation();
    const componentType = parseInt(e.dataTransfer.getData("componentType")) as DesignerElementType;
    // No longer prevent containers from being dropped into containers
    setSelectedComponent(null);
    const containerRect = e.currentTarget.getBoundingClientRect();
    const containerElement = e.currentTarget;
    const computedStyle = window.getComputedStyle(containerElement);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    if (containerRect) {
      const x = pxToPt(e.clientX - containerRect.left - paddingLeft);
      const y = pxToPt(e.clientY - containerRect.top - paddingTop);
      const component = components.find((c) => c.id === componentType);
      if (component) {
        const containerPadding = container.containerProps?.padding || 10;
        const adjustedX = Math.max(0, x - containerPadding);
        const adjustedY = Math.max(0, y - containerPadding);
        const newComponent: PlacedComponent = {
          id: generateUniqueKey(),
          type: componentType,
          content: component.defaultContent || component.label,
          x: adjustedX,
          y: adjustedY,
          rotate: 0,
          format: "NONE",
          containerId: container.id,
          textAlign: "center",
          verticalAlign: "middle",
          fontSize: 12,
          direction: "ltr",
          font: "Roboto",
          arabicFont: "Amiri",
          fontStyle: "normal",
          width: componentType === DesignerElementType.container ? 150 : 100,
          height: componentType === DesignerElementType.container ? 100 :
            componentType === DesignerElementType.barcode ? 40 :
              componentType === DesignerElementType.line ? 10 : 20,
          lineThickness: 1,
          lineColor: "#000000",
          lineType: "solid",
          lineWidth: 100,
          ...(componentType === DesignerElementType.barcode && {
            barcodeProps: {
              format: "CODE128",
              barWidth: 2,
              height: 75,
              margin: 0,
              field: "",
              background: "#FFFFFF",
              lineColor: "#000000",
              showText: true,
              textAlign: "center",
              font: "Roboto",
              fontSize: 21,
              textMargin: 3,
              fontStyle: "normal",
            },
          }),
          qrCodeProps: {
            value: "https://example.com",
            width: 60,
            height: 60,
            level: "M",
            type: "svg",
            margin: 0,
          },
        };

        // Add container-specific properties if it's a container
        if (componentType === DesignerElementType.container) {
          newComponent.containerProps = {
            backgroundColor: "#fafafa",
            borderColor: "#d0d0d0",
            borderWidth: 1,
            borderStyle: "dashed",
            padding: 0,
            autoResize: false,
            minHeight: 100,
            maxHeight: 500,
            borderRound: 1,
          };
          newComponent.children = [];
        }

      const newUpdatedComponents = [
        ...(templateData?.barcodeState?.placedComponents || []),
        newComponent,
      ];

      const newTemplateData : TemplateState<unknown> = {
        ...templateData,
        barcodeState: {
          ...templateData.barcodeState,
          placedComponents: newUpdatedComponents,
        },
      };

      setTemplateData(newTemplateData);
      pushToHistory(newTemplateData, `Added ${componentType} containers`);
        setTimeout(() => {
          setSelectedComponent(newComponent);
        }, 0);
      }
    }
  };

  // Main drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = parseInt(e.dataTransfer.getData("componentType")) as DesignerElementType;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      const x = pxToPt(e.clientX - canvasRect.left);
      const y = pxToPt(e.clientY - canvasRect.top);
      setSelectedComponent(null);
      // Find the deepest container at this position
      const placedComponents = templateData?.barcodeState?.placedComponents || [];
      const targetContainer = findDeepestContainerAt(x, y, placedComponents);
      const component = components.find((c) => c.id === componentType);
      if (component) {
        const newComponent: PlacedComponent = {
          id: generateUniqueKey(),
          type: componentType,
          content: component.defaultContent,
          x: x,
          y: y,
          rotate: 0,
          textAlign: "center",
          verticalAlign: "middle",
          fontSize: 12,
          format: "NONE",
          direction: "ltr",
          font: "Roboto",
          fontStyle: "normal",
          lineThickness: 1,
          lineColor: "#000000",
          lineType: "solid",
          lineWidth: 200,
          width: 100,
          height: componentType === DesignerElementType.barcode ? 30 :
            componentType === DesignerElementType.line ? 10 : 20,
          ...(componentType === DesignerElementType.barcode && {
            barcodeProps: {
              format: "CODE128",
              barWidth: 2,
              height: 75,
              margin: 0,
              field: "",
              background: "#FFFFFF",
              lineColor: "#000000",
              showText: true,
              textAlign: "center",
              font: "Roboto",
              fontSize: 21,
              textMargin: 3,
              fontStyle: "normal",
            },
          }),
          qrCodeProps: {
            value: "https://example.com",
            width: 80,
            height: 80,
            level: "M",
            type: "svg",
            margin: 0,
            image: "",
            imageOptions: {
              hideBackgroundDots: true,
              imageSize: 0.2,
              margin: 5,
              crossOrigin: "anonymous",
            },
            dotsOptions: {
              color: "#333",
              type: "extra-rounded",
            },
            backgroundOptions: {
              color: "#fafafa",
            },
            cornersSquareOptions: {
              color: "#ff0000",
              type: "classy",
            },
            cornersDotOptions: {
              color: "#ff0000",
              type: "dot",
            },
          },
        };

        // Add default container props
        if (componentType === DesignerElementType.container) {
          newComponent.width = 200;
          newComponent.height = 150;
          newComponent.children = [];
          newComponent.containerProps = {
            backgroundColor: "#fafafa",
            borderColor: "#d0d0d0",
            borderWidth: 1,
            borderStyle: "dashed",
            padding: 0,
            autoResize: false,
            minHeight: 100,
            maxHeight: 500,
            borderRound: 1,
          };
        }

        // If dropping into a container, adjust position
        if (targetContainer) {
          newComponent.containerId = targetContainer.id;
          const containerAbsPos = getAbsolutePosition(targetContainer, placedComponents);
          const containerPadding = targetContainer.containerProps?.padding || 10;
          newComponent.x = x - containerAbsPos.x - containerPadding;
          newComponent.y = y - containerAbsPos.y - containerPadding;
          // Ensure within bounds
          newComponent.x = Math.max(0, newComponent.x);
          newComponent.y = Math.max(0, newComponent.y);
        }

      const newUpdatedComponents = [
        ...(templateData?.barcodeState?.placedComponents || []),
        newComponent,
      ];

      const newTemplateData : TemplateState<unknown> = {
        ...templateData,
        barcodeState: {
          ...templateData.barcodeState,
          placedComponents: newUpdatedComponents,
        },
      };

      setTemplateData(newTemplateData);
      pushToHistory(newTemplateData, `Added ${componentType} component`);

        setTimeout(() => {
          setSelectedComponent(newComponent);
        }, 0);
      }
    }
  };

  // Component click handler
  const handleComponentClick = (e: React.MouseEvent, component: PlacedComponent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setDraggingComponent(null);
    setDragOffset({ x: 0, y: 0 });
    if (selectedComponent?.id === component.id) {
      return;
    }
    const fullComponent = templateData?.barcodeState?.placedComponents?.find(
      c => c.id === component.id
    );

    if (fullComponent) {
      let componentToSelect = {
        ...fullComponent,
        x: fullComponent.x,
        y: fullComponent.y,
        containerId: fullComponent.containerId,
      };

      if (fullComponent.type === DesignerElementType.container && !fullComponent.containerProps) {
        componentToSelect.containerProps = {
          backgroundColor: "#fafafa",
          borderColor: "#d0d0d0",
          borderWidth: 1,
          borderStyle: "dashed",
          padding: 10,
          autoResize: false,
          minHeight: 100,
          maxHeight: 500,
          borderRound: 1,
        };
      }

      setSelectedComponent(null);
      requestAnimationFrame(() => {
        setSelectedComponent(componentToSelect);
        setActiveTab("element");
      });
    } else {
      setSelectedComponent(null);
      requestAnimationFrame(() => {
        setSelectedComponent(component);
        setActiveTab("element");
      });
    }
  };

  // Mouse down handler - UPDATED for nested containers
  const handleMouseDown = (e: React.MouseEvent, component: PlacedComponent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target !== e.currentTarget) {
      return;
    }

    const canvasRect = canvasRef.current?.getBoundingClientRect();

      if (canvasRect) {
        const fullComponent = templateData?.barcodeState?.placedComponents?.find(
        c => c.id === component.id
      );

      if (!fullComponent) {
        console.error('Component not found in main list:', component.id);
        return;
      }

      setDraggingComponent(null);
      setTimeout(() => {
        setDraggingComponent(fullComponent);
        setSelectedComponent(fullComponent);
      }, 0);

      // Calculate absolute position considering nested containers
      const absolutePos = getAbsolutePosition(
        fullComponent,
        templateData?.barcodeState?.placedComponents || []
      );

      const offsetX = pxToPt(e.clientX - canvasRect.left) - absolutePos.x;
      const offsetY = pxToPt(e.clientY - canvasRect.top) - absolutePos.y;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  // Delete handler - cascades through nested containers
  const handleDelete = (componentId: string) => {
    const newTemplateData : TemplateState<unknown> = {
      ...templateData,
    };
    const componentsToDelete = new Set<string>();
    const components = newTemplateData.barcodeState?.placedComponents || [];  
      const findAllChildren = (id: string) => {
      componentsToDelete.add(id);
      components.forEach(comp => {
        if (comp.containerId === id) {
          findAllChildren(comp.id);
        }
      });
    };

    findAllChildren(componentId);

    const updatedComponents = components.filter(
      comp => !componentsToDelete.has(comp.id)
    );

    newTemplateData.barcodeState = {
      ...newTemplateData.barcodeState,
      placedComponents: updatedComponents,
    };  
    setTemplateData(newTemplateData);
    pushToHistory(newTemplateData, 'Deleted component(s)');
    setSelectedComponent(null);
  };
 //  clear all in desinger buttons:
  const handleClear = () => {
    const newTemplateData : TemplateState<unknown> = {
      ...templateData,
      barcodeState: {
        ...templateData.barcodeState,
        placedComponents: [],
      },
    };
    setTemplateData(newTemplateData);
    // pushToHistory(newTemplateData, 'Cleared canvas');
    clearHistory();
    setSelectedComponent(null);
  };
  // Property change handlers
  const handlePropertyChange = (property: keyof PlacedComponent, value: string | number | boolean, id?: number | undefined,) => {
    if (selectedComponent) {
      const updatedComponent = { ...selectedComponent, [property]: value };
      const updatedComponents =
        templateData?.barcodeState?.placedComponents?.map((comp) =>
          comp.id === (id ? id : selectedComponent.id) ? updatedComponent : comp
        );

      const newTemplateData : TemplateState<unknown> = {
        ...templateData,
        barcodeState: {
          ...templateData.barcodeState,
          placedComponents: updatedComponents || [],
        },
      };

      setTemplateData(newTemplateData);
      pushToHistory(
        newTemplateData,
        `Changed ${String(property)} to ${value}`
      );
      setSelectedComponent(updatedComponent);
      if (updatedComponent.type === DesignerElementType.barcode) {
        generateBarcode(updatedComponent);
      }
    }
  };

  const handleContainerPropertyChange = (property: string, value: any) => {
    if (selectedComponent && selectedComponent.type === DesignerElementType.container) {
      const updatedComponent = {
        ...selectedComponent,
        containerProps: {
          ...selectedComponent.containerProps,
          [property]: value,
        },
      };

      const updatedComponents = (templateData?.barcodeState?.placedComponents || []).map(
        (comp) => (comp.id === selectedComponent.id ? updatedComponent : comp)
      );

    const newTemplateData : TemplateState<unknown> = {
      ...templateData,
      barcodeState: {
        ...templateData.barcodeState,
        placedComponents: updatedComponents,
      },
    };

    setTemplateData(newTemplateData);
    pushToHistory(newTemplateData, `Changed container ${property}`);

      setSelectedComponent(updatedComponent);
    }
  };

  const handleBarcodePropertyChange = (property: any, value: string | number | boolean) => {
    if (
      selectedComponent &&
      selectedComponent.type === DesignerElementType.barcode &&
      selectedComponent.barcodeProps
    ) {
      const updatedComponents =
        templateData?.barcodeState?.placedComponents?.map((comp) =>
          comp.id === selectedComponent.id && comp.barcodeProps
            ? {
              ...comp,
              barcodeProps: { ...comp.barcodeProps, [property]: value },
            }
            : comp
        );


      const newTemplateData : TemplateState<unknown> = {
        ...templateData,
        barcodeState: {
          ...templateData.barcodeState,
          placedComponents: updatedComponents || [],
        },
      };

      setTemplateData(newTemplateData);
      pushToHistory(
        newTemplateData,
        `Changed ${String(property)} to ${value}`
      );

      setSelectedComponent({
        ...selectedComponent,
        barcodeProps: { ...selectedComponent.barcodeProps, [property]: value },
      });
    }
  };

  const handleQRCodePropertyChange = (property: string, value: any, nestedPath?: keyof QRCodeProps) => {
    if (
      selectedComponent &&
      selectedComponent.type === DesignerElementType.qrCode &&
      selectedComponent.qrCodeProps
    ) {
      const updatedQRCodeProps: QRCodeProps = {
        ...selectedComponent.qrCodeProps,
      };

      if (nestedPath) {
        const existingSub = (updatedQRCodeProps[nestedPath] as any) || {};
        const newSub = {
          ...existingSub,
          [property]: value,
        };
        (updatedQRCodeProps as any)[nestedPath] = newSub;
      } else {
        (updatedQRCodeProps as any)[property] = value;
      }

      const updatedComponents = (templateData?.barcodeState?.placedComponents || []).map(
        (comp) =>
          comp.id === selectedComponent.id
            ? { ...comp, qrCodeProps: updatedQRCodeProps }
            : comp
      ) as PlacedComponent[];

        const newTemplateData : TemplateState<unknown> = {
        ...templateData,
        barcodeState: {
          ...templateData.barcodeState,
          placedComponents: updatedComponents || [],
        },
      };

      setTemplateData(newTemplateData);
      pushToHistory(
        newTemplateData,
        `Changed ${String(property)} to ${value}`
      );
      setSelectedComponent({
        ...selectedComponent,
        qrCodeProps: updatedQRCodeProps,
      });
    }
  };

  // Barcode generation
  const generateBarcode = useCallback((component: PlacedComponent) => {
    if (
      component.type === DesignerElementType.barcode &&
      component.barcodeProps
    ) {
      const canvasElement = barcodeRefs.current[component.id];
      if (canvasElement) {
        const widthPx = ptToPx(component.width);
        const heightPx = ptToPx(component.height);
        const scale = window.devicePixelRatio || 1;

        canvasElement.height = heightPx * scale;
        canvasElement.width = widthPx * scale;
        canvasElement.style.width = `${component.width}pt`;
        canvasElement.style.height = `${component.height}pt`;

        const ctx = canvasElement.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(scale, scale);

        try {
          JsBarcode(canvasElement, component.content, {
            ...component.barcodeProps,
            width: component.barcodeProps.barWidth ?? 1,
            height: heightPx,
            margin: component.barcodeProps?.margin,
            textAlign: component.barcodeProps?.textAlign ?? 1,
            textMargin: component.barcodeProps.textMargin,
            textPosition: "bottom",
            background: component.barcodeProps?.background || "#ffffff",
            lineColor: component.barcodeProps?.lineColor || "#000000",
            fontSize: component.barcodeProps?.fontSize,
            font: component.barcodeProps.font || "Roboto",
            displayValue: component.barcodeProps.showText,
            valid: (valid: boolean) => {
              if (!valid) {
                throw new Error("Invalid barcode");
              }
            },
          });

          const pst = barcodeErrors?.find((x: any) => x.id == component.id);
          if (pst != undefined && pst?.error != undefined && pst?.error != "") {
            setBarcodeErrors((prevErrors: any[]) => {
              return prevErrors.filter((x: any) => x.id !== component.id);
            });
          }
        } catch (error) {
          console.error(
            `Error generating barcode for component ${component.id}:`,
            error
          );

          setBarcodeErrors((prevErrors: any[]) => [
            ...prevErrors,
            {
              id: component.id,
              error: "Error generating barcode for component",
            },
          ]);
        }
      }
    }
  }, [barcodeErrors]);

  // Render nested container with recursive support
  const renderNestedContainer = (container: PlacedComponent, allComponents: PlacedComponent[], depth: number = 0): React.ReactNode => {
    const isSelected = selectedComponent?.id === container.id;
    const containerChildren = allComponents.filter(comp => comp.containerId === container.id);
    const calculateContainerHeight = () => {
      if (!container.containerProps?.autoResize || containerChildren.length === 0) {
        return container.height;
      }

      let maxBottom = 0;
      containerChildren.forEach(child => {
        const childBottom = child.y + child.height;
        if (childBottom > maxBottom) {
          maxBottom = childBottom;
        }
      });

      const padding = container.containerProps.padding || 0;
      const calculatedHeight = maxBottom + padding;
      const minHeight = container.containerProps.minHeight || 50;
      const maxHeight = container.containerProps.maxHeight || 500;

      return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
    };

    const containerHeight = calculateContainerHeight();

    return (
      <ResizableBox
        key={container.id}
        width={ptToPx(container.width)}
        height={ptToPx(containerHeight)}
        minConstraints={[ptToPx(10), ptToPx(10)]}
        maxConstraints={[ptToPx(800), ptToPx(600)]}
        resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
        onResize={(e, { size }) => {
          // Convert px -> pt before saving
          const widthPt = pxToPt(size.width);
          const heightPt = pxToPt(size.height);
          // Debounce only the expensive state updates
          debouncedResize(container.id, widthPt, heightPt, container);
        }}
        className="container-component"
        style={{
          position: "absolute",
          left: `${container.x}pt`,
          top: `${container.y}pt`,
          transform: `rotate(${container.rotate || 0}deg)`,
          transformOrigin: "center",
          zIndex: 1 + depth,
        }}
      >
        <div
          id={`component-${container.id}`}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: container.containerProps?.backgroundColor || "#f5f5f5",
            border: isSelected
              ? "2px solid #2196f3"
              : `${container.containerProps?.borderWidth || 1}pt ${container.containerProps?.borderStyle || "dashed"} ${container.containerProps?.borderColor || "#999"}`,
            padding: `${container.containerProps?.padding || 10}pt`,
            boxSizing: "border-box",
            position: "relative",
            overflow: container.containerProps?.autoResize ? "visible" : "hidden",
            cursor: "move",
            borderRadius: `${container.containerProps?.borderRound || 1}pt`
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              handleComponentClick(e, container);
            }
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              handleMouseDown(e, container);
            }
          }}
          onDrop={(e) => handleDropIntoContainer(e, container)}
          onDragOver={(e) => e.preventDefault()}
        >
          {containerChildren.length === 0 ? (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '10px',
              pointerEvents: 'none',
            }}>
              Drop here
            </div>
          ) : null}

          {/* Render nested containers recursively */}
          {containerChildren.map((child, index) => {
            if (child.type === DesignerElementType.container) {
              return renderNestedContainer(child, allComponents, depth + 1);
            } else {
              return renderComponent(child, true);
            }
          })}

        </div>
        {/* Delete button positioned outside the scrollable content */}
        <DeleteButton
          id={container.id}
          isSelected={isSelected}
          handleDelete={handleDelete}
          depth={depth}
        />
      </ResizableBox>
    );
  };

  // Render component
  const renderComponent = (component: PlacedComponent, isChild: boolean = false) => {
    const isSelected = selectedComponent?.id === component.id;
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${component.x}pt`,
      top: `${component.y}pt`,
      padding: "0pt",
      boxSizing: "border-box",
      zIndex: isChild ? 10 : 1,
      alignContent: "center",
      width: `${component.width}pt`,
      height:
        component.type == DesignerElementType.barcode
          ? `auto`
          : `${component.height}pt`,
      border: isSelected ? "2px solid #2196f3" : component.type == DesignerElementType.barcode ? "" : "none",
      cursor: "move",
      backgroundColor: isSelected ? "#f6f6f7ff" : "inherit",
      userSelect: "none",
      transform: `rotate(${component.rotate || 0}deg)`,
      transformOrigin: "center",
      textAlign:
        component.type !== DesignerElementType.barcode
          ? component.textAlign
          : undefined,
      fontSize:
        component.type == DesignerElementType.barcode
          ? "0px"
          : `${component.fontSize}pt`,
      fontStyle:
        component.type !== DesignerElementType.barcode
          ? component.fontStyle
          : undefined,
      fontFamily: component.type == DesignerElementType.barcode ? "" : component.font,
      color: component.type == DesignerElementType.barcode ? "" : component.fontColor,
      fontWeight: component.type == DesignerElementType.barcode ? "" : component.fontWeight,
    };

    switch (component.type) {
      case DesignerElementType.barcode:
        return (
          <div
            key={component.id}
            id={`component-${component.id}`}
            style={style}
            onClick={(e) => {
              e.stopPropagation();
              handleComponentClick(e, component);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, component);
            }}
          >
            {barcodeErrors &&
              barcodeErrors?.find((x: any) => x.id == component.id) ? (
              <>
                <div
                  className="text-red-500 text-sm"
                  style={{ pointerEvents: 'none' }}
                >
                  {barcodeErrors?.find((x: any) => x.id == component.id).error}
                </div>
                <canvas
                  ref={(el) => (barcodeRefs.current[component.id] = el)}
                  width={`${component.width}pt`}
                  height={component.height}
                  style={{ overflow: "hidden", zIndex: 2, pointerEvents: 'none' }}
                />
              </>
            ) : (
              <canvas
                ref={(el) => (barcodeRefs.current[component.id] = el)}
                width={component.width}
                height={component.height}
                style={{ overflow: "hidden", zIndex: 2, pointerEvents: 'none' }}
              />
            )}
            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            />
          </div>
        );

      case DesignerElementType.text:
      case DesignerElementType.field:
        const isArabic = containsArabicString(component?.content ?? "")
        const textDirection = component.direction ?? isArabic ? "rtl" : "ltr";
        return (
          <ResizableBox
            key={component.id}
            width={ptToPx(component.width)}
            height={ptToPx(component.height)}
            minConstraints={[ptToPx(5), ptToPx(5)]}
            maxConstraints={[ptToPx(800), ptToPx(600)]}
            resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
            onResize={(e, { size }) => {
              const widthPt = pxToPt(size.width);
              const heightPt = pxToPt(size.height);
              // Debounce only the expensive state updates
              debouncedResize(component.id, widthPt, heightPt, component);
            }}
            style={{
              position: "absolute",
              left: `${component.x}pt`,
              top: `${component.y}pt`,
              transform: `rotate(${component.rotate || 0}deg)`,
              transformOrigin: "center",
              zIndex: isChild ? 10 : 1,
            }}
          >
            <div
              id={`component-${component.id}`}
              style={{
                width: "100%",
                height: "100%",
                border: isSelected ? "2px solid #2196f3" : "none",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                padding: 0,
                margin: 0,
                backgroundColor: isSelected ? "#ffffff" : "inherit",
                overflow: "hidden",
                cursor: "move",
                // ✅ Apply alignment directly here
                justifyContent:
                  component.verticalAlign === "middle"
                    ? "center"
                    : component.verticalAlign === "bottom"
                      ? "flex-end"
                      : "flex-start",

                alignItems:
                  component.textAlign === "center"
                    ? "center"
                    : component.textAlign === "left"
                      ? "flex-start"
                      : "flex-end",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleComponentClick(e, component);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, component);
              }}
            >
              <span
                style={{


                  textAlign: component.textAlign ?? "left",

                  // ---------- Typography ----------
                  fontFamily: isArabic
                    ? component?.arabicFont ?? "Amiri"
                    : component?.font ?? "Roboto",

                  fontSize: `${component.fontSize || 12}pt`,
                  fontWeight: component.fontWeight ?? "400",
                  fontStyle: component.fontStyle || "normal",
                  color: `rgb(${component.fontColor || "0,0,0"})`,

                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {component.content}
              </span>
            </div>

            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            />
          </ResizableBox>
        );


      case DesignerElementType.line:
        return (
          <ResizableBox
            key={component.id}
            width={ptToPx(component.lineWidth)}
            height={ptToPx(component.lineThickness || 2)}
            minConstraints={[ptToPx(5), ptToPx(1)]}
            maxConstraints={[ptToPx(1500), ptToPx(50)]}
            resizeHandles={
              isSelected
                ? ['e', 'w',]   // ✅ horizontal + vertical resize
                : []
            }
            onResize={(e, { size }) => {
              const widthPt = pxToPt(size.width);
              const thicknessPt = pxToPt(size.height); // ✅ vertical resize = thickness
               debouncedResize(component.id, widthPt, thicknessPt, component);

            }}
            style={{
              position: "absolute",
              left: `${component.x}pt`,
              top: `${component.y}pt`,
              zIndex: 5,
            }}
          >
            <div
              id={`component-${component.id}`}
              onClick={(e) => {
                e.stopPropagation();
                handleComponentClick(e, component);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, component);
              }}
              style={{
                width: "100%",
                height: "100%",
                border:
                  selectedComponent?.id === component.id
                    ? "2px solid #2196f3"
                    : "none",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderTop: `${component.lineThickness || 1}pt ${component.lineType || "solid"} ${component.lineColor || "black"}`,
                }}
              />
            </div>

            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            />
          </ResizableBox>
        );

      case DesignerElementType.image:
        return (
          <ResizableBox
            key={component.id}
            width={ptToPx(component.width)}
            height={ptToPx(component.height)}
            minConstraints={[ptToPx(10), ptToPx(10)]}
            maxConstraints={[ptToPx(800), ptToPx(600)]}
            resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
            onResize={(e, { size }) => {
              const widthPt = pxToPt(size.width);
              const heightPt = pxToPt(size.height);

              // Debounce only the expensive state updates
              debouncedResize(component.id, widthPt, heightPt, component);
            }}

            style={{
              position: "absolute",
              left: `${component.x}pt`,
              top: `${component.y}pt`,
              transform: `rotate(${component.rotate || 0}deg)`,
              transformOrigin: "center",
              zIndex: isChild ? 10 : 1,
            }}
          >
            <div
              id={`component-${component.id}`}
              style={{
                width: "100%",
                height: "100%",
                border:
                  selectedComponent?.id === component.id
                    ? "2px solid #2196f3"
                    : "none",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleComponentClick(e, component);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, component);
              }}
            >
              <img
                src={component.content}
                alt="Component Image"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit:
                    (component.imgFit as React.CSSProperties["objectFit"]) || "cover",
                  objectPosition: (component.imgPosition as React.CSSProperties["objectPosition"]) || "center center",
                  pointerEvents: 'none',
                }}
              />
            </div>
            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            />
          </ResizableBox>
        );

      case DesignerElementType.qrCode:
        return (
          <QRCodeComponent
            key={component.id}
            component={component}
            isSelected={isSelected}
            style={style}
            handleComponentClick={handleComponentClick}
            handleMouseDown={handleMouseDown}
            handleDelete={handleDelete}
            qrCodeRefs={qrCodeRefs!}
            templateData={templateData}
            setTemplateData={setTemplateData}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
            pushToHistory={pushToHistory}
          />
        );

      case DesignerElementType.container:
        // This will be handled by renderNestedContainer
        return null;
    }
  };

  // Store dragging state in refs to avoid stale closures
  const draggingRef = useRef<PlacedComponent | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    draggingRef.current = draggingComponent;
  }, [draggingComponent]);

  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  // Global event listeners for drag and drop - UPDATED for nested containers
  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggingRef.current && canvasRef.current) {
        e.preventDefault();
        e.stopPropagation();

        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
          if (!draggingRef.current || !canvasRef.current) return;

          const canvasRect = canvasRef.current.getBoundingClientRect();
          let newX = pxToPt(e.clientX - canvasRect.left) - dragOffsetRef.current.x;
          let newY = pxToPt(e.clientY - canvasRect.top) - dragOffsetRef.current.y;

        // Calculate relative position if inside a container
        if (draggingRef.current?.containerId) {
          const containerChain = [];
          let currentContainerId = draggingRef.current.containerId;

          while (currentContainerId) {
            const container = (templateData?.barcodeState?.placedComponents || []).find(
              c => c.id === currentContainerId
            );
            if (container) {
              containerChain.push(container);
              currentContainerId = container.containerId ?? "";
            } else {
              break;
            }
          }

          if (containerChain.length > 0) {
            const immediateParent = containerChain[0];
            const parentAbsolutePos = getAbsolutePosition(
              immediateParent,
              templateData?.barcodeState?.placedComponents || []
            );
            const containerPadding = immediateParent.containerProps?.padding || 10;

            newX = newX - parentAbsolutePos.x - containerPadding;
            newY = newY - parentAbsolutePos.y - containerPadding;

            const maxX = immediateParent.width - (containerPadding * 2) - draggingRef.current!.width;
            const maxY = immediateParent.height - (containerPadding * 2) - draggingRef.current!.height;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
          }
        }

        // Update templateData WITHOUT pushing to history yet
        setTemplateData((prev: TemplateState<unknown>) => {
          const updatedComponents = (prev?.barcodeState?.placedComponents || []).map((comp) => {
            if (comp.id === draggingRef.current!.id) {
              return {
                ...comp,
                x: newX,
                y: newY,
              };
            }
            return comp;
          });

          const newState = {
            ...prev,
            barcodeState: {
              ...prev.barcodeState,
              placedComponents: updatedComponents,
            },
          };

          // Call debounced history push with the new state
          debouncedPushDragHistory(newState);

          return newState;
        });
         // Update selected component for UI feedback
          setSelectedComponent((prevSelected) => {
            const draggingId = draggingRef.current?.id; // safe access
            if (prevSelected && draggingId && prevSelected.id === draggingId) {
              return {
                ...prevSelected,
                x: newX,
                y: newY,
              };
            }
            return prevSelected;
          });
        });
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (draggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
      // ✅ Flush any pending debounced history push on mouse up
      debouncedPushDragHistory.flush();
        setDraggingComponent(null);
        setDragOffset({ x: 0, y: 0 });
        draggingRef.current = null;
       
        dragOffsetRef.current = { x: 0, y: 0 };
   
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
 
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [debouncedPushDragHistory, templateData]);

  // Consolidate container children before saving - UPDATED for nested containers
  const consolidateContainerChildren = () => {
    const components = templateData?.barcodeState?.placedComponents || [];
    const result: PlacedComponent[] = [];

    const consolidateContainer = (container: PlacedComponent): PlacedComponent => {
      const children = components.filter(c => c.containerId === container.id);
      const consolidatedChildren = children.map(child => {
        if (child.type === DesignerElementType.container) {
          return consolidateContainer(child);
        }
        return {
          ...child,
          x: child.x,
          y: child.y,
        };
      });

      return {
        ...container,
        children: consolidatedChildren,
      };
    };

    components.forEach(comp => {
      if (!comp.containerId) {
        if (comp.type === DesignerElementType.container) {
          result.push(consolidateContainer(comp));
        } else {
          result.push(comp);
        }
      }
    });

    return result;
  };

  // Expand container children after loading - UPDATED for nested containers
  const expandContainerChildren = (components: PlacedComponent[]): PlacedComponent[] => {
    const result: PlacedComponent[] = [];

    const expandContainer = (container: PlacedComponent) => {
      const { children, ...containerWithoutChildren } = container;
      result.push(containerWithoutChildren);

      if (children && children.length > 0) {
        children.forEach((child: PlacedComponent) => {
          const childWithContainerId = {
            ...child,
            containerId: container.id,
          };

          if (child.type === DesignerElementType.container && child.children) {
            expandContainer(childWithContainerId);
          } else {
            result.push(childWithContainerId);
          }
        });
      }
    };

    components.forEach(comp => {
      if (comp.type === DesignerElementType.container && comp.children) {
        expandContainer(comp);
      } else {
        result.push(comp);
      }
    });

    return result;
  };

  // Other handlers (simplified for brevity - include all your existing handlers)
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };


const debouncedLabelResize = useDebounce(
  (widthPt: number, heightPt: number) => {
     
    const newTemplateData: TemplateState<unknown> = {
      ...templateData,
      barcodeState: {
        ...templateData.barcodeState,
        placedComponents: templateData.barcodeState?.placedComponents ?? [],
        labelState: {
          ...templateData?.barcodeState?.labelState,
          labelWidth: widthPt,
          labelHeight: heightPt,
        },
      },
    };
    setTemplateData(newTemplateData);
    //  pushToHistory(newTemplateData, "Resized main label");
  },
  150
);
 const handleContentLabelResize = (
    e: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } }
  ) => {
    const newWidthPt = pxToPt(size.width);
    const newHeightPt = pxToPt(size.height);

    setTemplateData((prevData: TemplateState<unknown>) => {
      const updated = {
        ...prevData,
        barcodeState: {
          ...prevData.barcodeState,
          labelState: {
            ...prevData?.barcodeState?.labelState,
            labelWidth: newWidthPt + (forCustomRows ? ((template?.propertiesState?.padding?.right ?? 0) + (template?.propertiesState?.padding?.left ?? 0)) : 0),
            labelHeight: newHeightPt + (forCustomRows ? (template?.propertiesState?.padding?.top ?? 0) : 0),
          },
          placedComponents: prevData?.barcodeState?.placedComponents || [],
        },
      };
      return updated;
    });
  };


  const handlePagePropsChange = async (
    property: keyof PropertiesState,
    value: any,
  ) => {
  const newTemplateData : TemplateState<unknown>=  {
    ...templateData,
    propertiesState: { ...templateData.propertiesState, [property]: value },
  };

  setTemplateData(newTemplateData);
  pushToHistory(newTemplateData, `Changed page ${String(property)}`);
  };

  const handleLabelPropsChange = (property: any, value: any) => {
const newTemplateData : TemplateState<unknown> = {
  ...templateData,
  barcodeState: {
    ...templateData.barcodeState,
    placedComponents: templateData?.barcodeState?.placedComponents ?? [],
   labelState: {
  ...templateData?.barcodeState?.labelState,
  [property]: value,
  } as LabelState,
  },
};

setTemplateData(newTemplateData);
pushToHistory(newTemplateData, `Changed label ${property}`);

  };

  const handleImagePropsChange = async (property: any, value: any) => {
    if (!value) {
      forCustomRows ? handlePropertyChange(property, "") : handleLabelPropsChange(property, null);
      return;
    }
    const imageData = await convertFileToBase64(value);
    forCustomRows ? handlePropertyChange(property, imageData ?? '') :
      handleLabelPropsChange(property, imageData ?? null);
  };

  const handleDesignerChange = async (property: any, value: any, isImg: boolean = false) => {
    let data = value;
    if (isImg) {
      data = await convertFileToBase64(value);
    }
    setDesignerData((prev) => ({
      ...prev,
      [property]: data,
    }));
  };

  const handleRemoveDesignerImg = () => {
    handleDesignerChange("background_image", "");
    if (inputFile.current) {
      inputFile.current.value = "";
    }
  };

  const handleRemoveBgImage = () => {
    handleImagePropsChange("background_image", "");
    if (inputFile.current) {
      inputFile.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    handleImagePropsChange("content", "");
    if (inputImgFile.current) {
      inputImgFile.current.value = "";
    }
  };

  const handleSave = async (dataUrl?: string) => {
    setLoading(true);
    try {
      const consolidatedComponents = consolidateContainerChildren();

      if (forCustomRows) {
        debugger
        dispatch(
          setTemplateCustomElements({
            payload: {
              elements: consolidatedComponents,
              height: templateData.barcodeState?.labelState?.labelHeight,
              thumbImage: dataUrl ?? "",
              background_image: designerData?.background_image,
              bg_image_position: designerData?.bg_image_position,
              background_color: designerData?.background_color,
              isFirstOnly: designerData?.isFirstOnly ?? true

            },
            field: customTemplate,
          })
        );
        onSuccess?.();
        return true;
      }

      const tmpTemplate = {
        ...templateData,
        propertiesState: {
          ...templateData.propertiesState,
          template_group: templateGroup,
        },
      };

      const templateToSave = {
        ...tmpTemplate,
        barcodeState: {
          ...tmpTemplate.barcodeState,
          placedComponents: consolidatedComponents,
        },
      };

      const activeTemplate: TemplateDto = {
        id: id == "new" ? 0 : id,
        templateType: templateToSave.propertiesState.template_type ?? "standard",
        templateKind: templateToSave.propertiesState.template_kind ?? "standard",
        templateGroup: templateToSave.propertiesState.template_group ?? "",
        templateName: templateToSave.propertiesState?.templateName ?? "",
        formType: templateToSave.propertiesState?.template_formType ?? "",
        customerType: templateToSave.propertiesState?.template_customerType ?? "",
        thumbImage: dataUrl,
        content: JSON.stringify(templateToSave),
        isCurrent: false,
        background_image: tmpTemplate.background_image ?? "",
        background_image_header: tmpTemplate.background_image_header ?? "",
        background_image_footer: tmpTemplate.background_image_footer ?? "",
        signature_image: tmpTemplate.signature_image ?? "",
        branchId: 0,
      };

      const res = await api.postAsync(Urls.templates, activeTemplate);
      handleResponse(res, () => {
        navigate(`/templates?template_group=${templateGroup}`);
      });
    } catch (error) {
      console.error("Error saving the template:", error);
    } finally {
      setLoading(false);
    }
  };

  const manageSaveTemplate = async () => {
    try {
      const node = document.getElementById("teplate-container");
      if (!node) {
        ERPToast.show("Template container not found", "error");
        return false;
      }

      const resizableBox = node.closest(".react-resizable");
      const targetElement = resizableBox || node;

      const originalStyles = {
        transform: node.style.transform,
        overflow: node.style.overflow,
        border: node.style.border,
      };

      node.style.transform = "scale(1)";
      node.style.overflow = "visible";
      node.style.border = "none";

      await new Promise((resolve) => setTimeout(resolve, 100));

      const rect = node.getBoundingClientRect();
      const canvas = await html2canvas(node, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        allowTaint: true,
        x: 0,
        y: 0,
        width: rect.width,
        height: rect.height,
        scrollX: 0,
        scrollY: 0,
        windowWidth: rect.width,
        windowHeight: rect.height,
      });

      Object.assign(node.style, originalStyles);

      const dataUrl = canvas.toDataURL("image/png", 1.0);

      if (forCustomRows) {
        await handleSave(dataUrl);
        return true;
      }

      if (!templateData?.propertiesState?.templateName) {
        ERPToast.show("Template name is required", "error");
        return false;
      }

      await handleSave(dataUrl);
      return true;
    } catch (error) {
      console.error("Error saving template:", error);
      ERPToast.show("Failed to save template", "error");
      return false;
    }
  };

  const getPDFTemplateData = async () => {
    const _template = await fetchTemplateFromApiById(id);
    if (!_template) return null;

    setSelectedComponent(null);
    setTemplateData(_template);
    resetHistory(_template);
  };

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Check if user is typing in an input/textarea - don't intercept
    const target = e.target as HTMLElement;
    const isInputElement = 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true';

    // ============ UNDO: Ctrl+Z (Windows/Linux) or Cmd+Z (Mac) ============
    if (
      (e.ctrlKey || e.metaKey) && 
      e.key === 'z' && 
      !e.shiftKey && 
      !isInputElement &&
      canUndo
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Undo triggered');
      handleUndo();
      return;
    }

    // ============ REDO: Ctrl+Shift+Z (Windows/Linux) or Cmd+Shift+Z (Mac) ============
    if (
      (e.ctrlKey || e.metaKey) && 
      e.key === 'z' && 
      e.shiftKey && 
      !isInputElement &&
      canRedo
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Redo triggered');
      handleRedo();
      return;
    }

    // ============ REDO (Alternative): Ctrl+Y (Windows/Linux) or Cmd+Y (Mac) ============
    if (
      (e.ctrlKey || e.metaKey) && 
      e.key === 'y' && 
      !isInputElement &&
      canRedo
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Redo triggered (Ctrl+Y)');
      handleRedo();
      return;
    }

    // ============ DELETE: Delete key or Backspace ============
    if (
      (e.key === 'Delete' ) && 
      selectedComponent && 
      !isInputElement
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Delete triggered');
      handleDelete(selectedComponent.id);
      return;
    }

    // ============ DUPLICATE: Ctrl+D (Windows/Linux) or Cmd+D (Mac) ============


    // ============ DESELECT: Escape key ============
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      console.log('Deselect triggered');
      setSelectedComponent(null);
      setDraggingComponent(null);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    // ============ ARROW KEYS: Move or Resize selected component ============
    if (
      selectedComponent && 
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
      !isInputElement
    ) {
      e.preventDefault();
      e.stopPropagation();
      
      const step = e.shiftKey ? 10 : 1; // Shift+Arrow = larger movement
      let { x, y, width, height } = selectedComponent;

      if (e.altKey) {
        // -------- RESIZE MODE (Alt+Arrow) --------
        console.log('Resize mode');
        switch (e.key) {
          case 'ArrowUp':
            height = Math.max(20, height - step);
            break;
          case 'ArrowDown':
            height = Math.max(20, height + step);
            break;
          case 'ArrowLeft':
            width = Math.max(20, width - step);
            break;
          case 'ArrowRight':
            width = Math.max(20, width + step);
            break;
        }
      } else {
        // -------- MOVE MODE (Arrow only) --------
        console.log('Move mode');
        switch (e.key) {
          case 'ArrowUp':
            y = Math.max(0, y - step);
            break;
          case 'ArrowDown':
            y = y + step;
            break;
          case 'ArrowLeft':
            x = Math.max(0, x - step);
            break;
          case 'ArrowRight':
            x = x + step;
            break;
        }
      }

      // Update templateData
      const newTemplateData : TemplateState<unknown> = {
        ...templateData,
        barcodeState: {
          ...templateData.barcodeState,
          placedComponents: (templateData?.barcodeState?.placedComponents || []).map((comp) =>
            comp.id === selectedComponent.id
              ? { ...comp, x, y, width, height }
              : comp
          ),
        },
      };

      setTemplateData(newTemplateData);
      pushToHistory(newTemplateData, `${e.altKey ? 'Resized' : 'Moved'} component with keyboard`);
      setSelectedComponent((prev) =>
        prev ? { ...prev, x, y, width, height } : prev
      );
      return;
    }



    // ============ SAVE: Ctrl+S (Windows/Linux) or Cmd+S (Mac) ============
    if (
      (e.ctrlKey || e.metaKey) && 
      e.key === 's' && 
      !isInputElement
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Save triggered');
      manageSaveTemplate();
      return;
    }

    // ============ ZOOM IN: Ctrl++ (Windows/Linux) or Cmd++ (Mac) ============
    if (
      (e.ctrlKey || e.metaKey) && 
      (e.key === '+' || e.key === '=') && 
      !isInputElement
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Zoom in triggered');
      setZoom((prev) => Math.min(prev + 10, 200)); // Max 200%
      return;
    }

    // ============ ZOOM OUT: Ctrl+- (Windows/Linux) or Cmd+- (Mac) ============
    if (
      (e.ctrlKey || e.metaKey) && 
      e.key === '-' && 
      !isInputElement
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Zoom out triggered');
      setZoom((prev) => Math.max(prev - 10, 50)); // Min 50%
      return;
    }

    // ============ ZOOM TO 100%: Ctrl+0 (Windows/Linux) or Cmd+0 (Mac) ============
    if (
      (e.ctrlKey || e.metaKey) && 
      e.key === '0' && 
      !isInputElement
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Zoom to 100% triggered');
      setZoom(100);
      return;
    }

    // ============ GROUP: Ctrl+G (Windows/Linux) or Cmd+G (Mac) ============
    // (Advanced feature - optional)
    if (
      (e.ctrlKey || e.metaKey) && 
      e.key === 'g' && 
      !isInputElement
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Group triggered');
      // handleGroup();
      return;
    }

  };

  window.addEventListener('keydown', handleKeyDown);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [
  canUndo,
  canRedo,
  selectedComponent,
  templateData,
  handleUndo,
  handleRedo,
  handleDelete,
  setSelectedComponent,
  setDraggingComponent,
  setDragOffset,
  setZoom,
  pushToHistory,
  manageSaveTemplate,
]);

  useEffect(() => {
    if (id !== "new" && !forCustomRows) getPDFTemplateData();
  }, []);



  useEffect(() => {
    if (forCustomRows && template) {
      const fields = customTemplate?.split(".");
      let nestedValue: any = template;
      for (let i = 0; i < fields?.length; i++) {
        nestedValue = nestedValue?.[fields[i]];
      }
      const loadedElements = nestedValue?.elements || [];
      const expandedComponents = expandContainerChildren(loadedElements);
      setCustomePageHeight((nestedValue?.height || 200) - (template.propertiesState?.padding?.top ?? 0));
      
        const newTemplateData: TemplateState<unknown> = {
        ...templateData,
      barcodeState: {
        ...templateData.barcodeState,
        placedComponents: expandedComponents || [],
        labelState: {
          ...templateData.barcodeState?.labelState,
          labelHeight: (nestedValue?.height || 200) + (template.propertiesState?.padding?.top ?? 0),
          labelWidth: selectedPageSize.width,
        },
      },
    };
      // setTemplateData((prev: TemplateState<unknown>) => ({
      //   ...prev,
      //   barcodeState: {
      //     ...prev.barcodeState,
      //     placedComponents: expandedComponents || [],
      //     labelState: {
      //       ...prev.barcodeState?.labelState,
      //       labelHeight: (nestedValue?.height || 200) + (template.propertiesState?.padding?.top ?? 0),
      //       labelWidth: selectedPageSize.width,
      //     },
      //   },
      // }));
      setTemplateData(newTemplateData);
      resetHistory(newTemplateData);
      setDesignerData((prev) => ({
        ...prev,
        background_image: nestedValue?.background_image || "",
        bg_image_position: nestedValue?.bg_image_position || "",
        background_color: nestedValue?.background_color || "",
        bg_image_objectFit: nestedValue?.bg_image_objectFit || "",
        isFirstOnly: nestedValue?.isFirstOnly || true

      }));
    }
  }, []);

  useEffect(() => {
    templateData?.barcodeState?.placedComponents?.forEach(generateBarcode);
  }, [templateData?.barcodeState?.placedComponents, barcodeErrors, generateBarcode]);

  // Debounced handlers
  const debouncedHandleAreaPropetFieldChange = useDebounce(handleDesignerChange, 300);
  const debouncedHandlePropetFieldChange = useDebounce(handlePropertyChange, 300);
const debouncedResize = useDebounce(
  (
    id: string,
    widthPt: number,
    heightPt: number,
    component: any
  ) => {

    const updatedComponents =
      templateData?.barcodeState?.placedComponents?.map((comp) => {
        if (comp.id !== id) return comp;

        //  If Line element → update lineWidth + lineThickness
        if (component.type === DesignerElementType.line) {
          return {
            ...comp,
            lineWidth: widthPt,
            lineThickness: heightPt,
          };
        }

        //  Otherwise → normal width/height update
        return {
          ...comp,
          width: widthPt,
          height: heightPt,
        };
      }) || [];

    const newTemplateData: TemplateState<unknown> = {
      ...templateData,
      barcodeState: {
        ...templateData.barcodeState,
        placedComponents: updatedComponents,
      },
    };

    setTemplateData(newTemplateData);
    pushToHistory(newTemplateData, `resize ${component.type} containers`);

    // ----------------------------------------------------
    //    UPDATE SELECTED COMPONENT (same logic as above)
    // ----------------------------------------------------
    if (selectedComponent?.id === id) {
      setSelectedComponent((prev) => {
        if (!prev) return prev;
        // If line → update line values
        if (component.type === DesignerElementType.line) {
          return {
            ...prev,
            lineWidth: widthPt,
            lineThickness: heightPt,
          };
        }

        // Otherwise → update width/height
        return {
          ...prev,
          width: widthPt,
          height: heightPt,
        };
      });
    }
  },
  150
);


const getFieldContent = () => {
  if (!forCustomRows) return barCodeField;

  if (templateGroup === "CBR") {
    return ledgerReportFields;
  }
  if (templateGroup === "Cheque") {
    return CheckFields;
  } 
  return accountsVoucherTypes.includes(templateGroup as VoucherType)
    ? accountsFields
    : inventoryFields;
};


  // Computed values
  const labelWidthPt = templateData?.barcodeState?.labelState?.labelWidth ?? 300;
  const labelHeightPt = templateData?.barcodeState?.labelState?.labelHeight ?? 200;
  const labelWidthPx = forCustomRows ? ptToPx(customePageWidth) : ptToPx(labelWidthPt);
  const labelHeightPx = forCustomRows ? ptToPx(customePageHeight) : ptToPx(labelHeightPt);

  const bgImage = forCustomRows
    ? designerData?.background_image
    : templateData?.barcodeState?.labelState?.background_image;

  const bgPosition = forCustomRows
    ? designerData?.bg_image_position
    : templateData?.barcodeState?.labelState?.bg_image_position;

  const bgSize = forCustomRows
    ? designerData?.bg_image_objectFit
    : templateData?.barcodeState?.labelState?.bg_image_objectFit;



  // Main render
  return (
    <div className={`flex h-dvh max-h-dvh bg-gray-100 overflow-hidden w-full 
    ${templateData.propertiesState?.language_prefer === "Eng" ? "dir-ltr" : templateData.propertiesState?.language_prefer === "Arb" ? "dir-rtl" : "dir-ltr"}`}
        style={forCustomRows ? {
      height: `${selectedPageSize?.height+toolbarHeightPt}pt`,
      maxHeight: `${selectedPageSize?.height+toolbarHeightPt}pt`,
      overflow: "hidden",
    } : undefined}
    >
      {/* Left Sidebar - Components */}
      <ResizableBox
        key={`left-sidebar-${leftSidebarWidth}`} 
        width={leftSidebarWidth}
        height={Infinity}
        minConstraints={[150, Infinity]}
        maxConstraints={[400, Infinity]}
        resizeHandles={[templateData.propertiesState?.language_prefer === "Arb" ? "w" : "e",]}
        handle={<div className={`custom-handle ${templateData.propertiesState?.language_prefer === "Arb" ? "rtl" : "ltr"}`} />}
        className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden"
          onResize={(e, { size }) => {
            setLeftSidebarWidth(size.width);
          }}
      >
        <div className="border-r border-gray-200 p-4">
          <div className="bg-[] border-b border-dashed pb-2 mb-1 border-gray-600">
            <h2 className="text-sm font-semibold text-gray-700">{t('components')}</h2>
          </div>
          <div className="space-y-2">
            {components
              ?.filter((x: any) => {
                if (!forCustomRows) {
                  return [
                    DesignerElementType.barcode,
                    DesignerElementType.field,
                    DesignerElementType.text,
                  ].includes(x.id);
                } else {
                  return ![DesignerElementType.barcode].includes(x.id);
                }
              })
              ?.map((component) => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component.id)}
                  // className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg 
                  // font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm flex-shrink-0"
                  className={`flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded  cursor-move bg-slate-100 font-medium shadow-sm hover:shadow 
                    hover:bg-
                     transform hover:scale-105 transition-all duration-200 text-sm flex-shrink-0
                    ${component.id === DesignerElementType.container
                      ? 'border-2 border-dashed border-gray-100'
                      : ''
                    }`}
                  title={component.id === DesignerElementType.container
                    ? 'Container - Drop elements inside to group them'
                    : component.label
                  }
                >
                  {component.icon}
                  <span className="ml-2">{component.label}</span>
                </div>
              ))}
          </div>
        </div>
      </ResizableBox>

      {/* Main Design Area */}
      <div className="flex-1 flex flex-col bg-[#e5e7eb]" style={{ height: "100%" }}>
        {/* Toolbar */}
        <div 
        ref={toolbarRef}
        className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center">
            {!forCustomRows && (
              <div className=" ">
                <ERPPreviousUrlButton size="37px" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ERPButton
              startIcon="ri-arrow-go-back-fill"
              variant="custom"
              onClick={handleUndo}
              title="Undo (Ctrl+Z)"
              backgroundColor="#5F6368" 
              foreColor="white"    
              disabled={loading || !canUndo}
            />
             <ERPButton
              startIcon="ri-arrow-go-forward-fill"
              title="Redo (Ctrl+Shift+Z)"
              onClick={handleRedo}
              foreColor="white"     
              variant="custom"
              backgroundColor="#5F6368"
              disabled={loading || !canRedo}
            />
            <ERPButton
              title={t("clear")}
              onClick={handleClear}
              variant="secondary"
            />
            <ERPButton
              title={t("save")}
              onClick={manageSaveTemplate}
              variant="primary"
              loading={loading}
            />
               {/* Optional: Show history counter */}
    <div className="text-xs text-gray-500 px-2 border-l border-gray-300">
      {historyIndex + 1}/{history.length}
    </div>
          </div>
        </div>

        {/* Design Canvas */}
        <div
          id="teplate-container-base"
          className="flex-1 bg-gray-50"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedComponent(null);
              setDraggingComponent(null);
              setDragOffset({ x: 0, y: 0 });
            }
          }}
          style={{
            width: `${(((templateData?.barcodeState?.labelState?.labelWidth ?? 300)) *
              (templateData?.barcodeState?.labelState?.columnsPerRow ?? 1)) +
              ((templateData?.propertiesState?.padding?.right ?? 0) +
                (templateData?.propertiesState?.padding?.left ?? 0)) +
              ((templateData?.propertiesState?.gap?.vgap ?? 0) *
                ((templateData?.barcodeState?.labelState?.columnsPerRow ?? 1) - 1))
              }pt`,
            maxHeight: `${(((templateData?.barcodeState?.labelState?.labelHeight ?? 300)) *
              (templateData?.barcodeState?.labelState?.rowsPerPage ?? 1)) +
              ((templateData?.propertiesState?.padding?.top ?? 0) +
                (templateData?.propertiesState?.padding?.bottom ?? 0)) +
              ((templateData?.propertiesState?.gap?.hgap ?? 0) *
                ((templateData?.barcodeState?.labelState?.rowsPerPage ?? 1) - 1))
              }pt`,
              
              padding: forCustomRows ? `${template?.propertiesState?.padding?.top ?? 0}pt 
                      ${template?.propertiesState?.padding?.right ?? 0}pt 
                      ${0}pt 
                      ${template?.propertiesState?.padding?.left ?? 0}pt`
              : `${templateData?.propertiesState?.padding?.top ?? 0}pt 
                      ${templateData?.propertiesState?.padding?.right ?? 0}pt 
                      ${templateData?.propertiesState?.padding?.bottom ?? 0}pt 
                      ${templateData?.propertiesState?.padding?.left ?? 0}pt`,
          }}
        >
          <ResizableBox
            width={labelWidthPx}
            height={labelHeightPx}
            minConstraints={[ptToPx(50), ptToPx(50)]}
           maxConstraints={
            forCustomRows
              ? [
                  ptToPx(customePageWidth), 
                  ptToPx(customePageMaxHeight)
                ]
              : [ptToPx(1200), ptToPx(800)]
          }
            resizeHandles={[
              forCustomRows
                ? "s"
                : templateData.propertiesState?.language_prefer === "Arb"
                  ? "sw"
                  : "se",
            ]}
            className="box"
       onResize={handleContentLabelResize}
  //         onResizeStop={(e, { size }) => {
  //   const widthPt = pxToPt(size.width);
  //   const heightPt = pxToPt(size.height);

  //   // Build final state from current templateData (or from size direct)
  //   const newTemplateData: TemplateState<unknown> = {
  //     ...templateData,
  //     barcodeState: {
  //       ...templateData.barcodeState,
  //       placedComponents: templateData.barcodeState?.placedComponents ?? [],
  //       labelState: {
  //         ...templateData?.barcodeState?.labelState,
  //         labelWidth: widthPt,
  //         labelHeight: heightPt,
  //       },
  //     },
  //   };

  //   // setTemplateData(newTemplateData);
  //   pushToHistory(newTemplateData, "Resized main label"); // single, reliable undo entry
  // }}  
          >
            <div
              ref={canvasRef}
              id="teplate-container"
              className="bg-white shadow-sm mx-auto overflow-hidden relative"
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                border: "2px dashed #ccc",
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundPosition: bgPosition || "center",
                backgroundSize: bgSize || "cover",
                backgroundRepeat: "no-repeat",
                backgroundColor: forCustomRows ? `rgb(${designerData.background_color})` : "#fff",

              }}
            >
              {/* Render components using nested container support */}
              {templateData?.barcodeState?.placedComponents
                ?.filter(comp => !comp.containerId)
                ?.map((comp) => {
                  if (comp.type === DesignerElementType.container) {
                    return renderNestedContainer(
                      comp,
                      templateData?.barcodeState?.placedComponents || [],
                      0
                    );
                  } else {
                    return renderComponent(comp, false);
                  }
                })}
            </div>
          </ResizableBox>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <ResizableBox
        key={`right-sidebar-${rightSidebarWidth}`} 
        width={rightSidebarWidth} // Initial width
        height={Infinity}
        minConstraints={[200, Infinity]} // Minimum width
        maxConstraints={[400, Infinity]} // Maximum width
        resizeHandles={[
          templateData.propertiesState?.language_prefer === "Arb" ? "e" : "w",
        ]}
        handle={<div className={`custom-handle ${templateData.propertiesState?.language_prefer === "Arb" ? "ltr" : "rtl"}`} />}
          onResize={(e, { size }) => {
            setRightSidebarWidth(size.width);
          }}
        className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden relative"
      >
        <div className="p-4 h-full">
          <div className="flex flex-col mb-4 z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-700">
                {t('properties')}
              </h2>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <Tabs value={activeTab} onChange={handleTabChange}>
              {!forCustomRows && <Tab label="Page" value="page" />}
              <Tab label={t("element")} value="element" />
              {forCustomRows && <Tab label={t("designer")} value="designer" />}
              {templateGroup === "barcode" && !forCustomRows && (
                <Tab label="Label" value="label" />
              )}
            </Tabs>
          </div>
          <Box>

            {selectedComponent && (
              <Box
                hidden={activeTab !== "element"}
                sx={{
                  maxHeight: "calc(100vh - 8rem)",
                  overflowY: "auto",
                  py: 2,
                  spaceY: 2,
                }}
                className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto pr-1"

              >
                {selectedComponent.type === DesignerElementType.container && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Container Properties
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <ERPInput
                        id="containerBgColor"
                        label="Background Color"
                        type="color"
                        value={selectedComponent.containerProps?.backgroundColor || "#f5f5f5"}
                        onChange={(e) =>
                          handleContainerPropertyChange("backgroundColor", e.target.value)
                        }
                      />
                      <ERPInput
                        id="containerBorderColor"
                        label="Border Color"
                        type="color"
                        value={selectedComponent.containerProps?.borderColor || "#cccccc"}
                        onChange={(e) =>
                          handleContainerPropertyChange("borderColor", e.target.value)
                        }
                      />
                      <ERPInput
                        id="containerBorderRound"
                        label="Border Round"
                        type="number"
                        value={selectedComponent.containerProps?.borderRound || 1}
                        onChange={(e) =>
                          handleContainerPropertyChange("borderRound", e.target.value)
                        }
                      />
                      <ERPInput
                        id="containerBorderWidth"
                        label="Border Width"
                        type="number"
                        value={selectedComponent.containerProps?.borderWidth || 1}
                        onChange={(e) =>
                          handleContainerPropertyChange("borderWidth", parseInt(e.target.value))
                        }
                      />
                      <ERPDataCombobox
                        id="containerBorderStyle"
                        label="Border Style"
                        options={[
                          { value: "solid", label: "Solid" },
                          { value: "dashed", label: "Dashed" },
                          { value: "dotted", label: "Dotted" },
                          { value: "none", label: "None" },
                        ]}
                        value={selectedComponent.containerProps?.borderStyle || "solid"}
                        onChange={(e) =>
                          handleContainerPropertyChange("borderStyle", e.value)
                        }
                      />
                      <ERPInput
                        id="containerPadding"
                        label="Padding"
                        type="number"
                        value={selectedComponent.containerProps?.padding || 10}
                        onChange={(e) =>
                          handleContainerPropertyChange("padding", parseInt(e.target.value))
                        }
                      />
                      <ERPCheckbox
                        id="containerAutoResize"
                        label="Auto-resize based on content"
                        checked={selectedComponent.containerProps?.autoResize ?? true}
                        onChange={(e) =>
                          handleContainerPropertyChange("autoResize", e.target.checked)
                        }
                      />
                      {selectedComponent.containerProps?.autoResize && (
                        <>
                          <ERPInput
                            id="containerMinHeight"
                            label="Min Height"
                            type="number"
                            value={selectedComponent.containerProps?.minHeight || 50}
                            onChange={(e) =>
                              handleContainerPropertyChange("minHeight", parseInt(e.target.value))
                            }
                          />
                          <ERPInput
                            id="containerMaxHeight"
                            label="Max Height"
                            type="number"
                            value={selectedComponent.containerProps?.maxHeight || 500}
                            onChange={(e) =>
                              handleContainerPropertyChange("maxHeight", parseInt(e.target.value))
                            }
                          />
                        </>
                      )}
                    </Box>
                  </Box>
                )}

                {
                  selectedComponent.type !== DesignerElementType.line &&
                  selectedComponent.type !== DesignerElementType.image &&
                  selectedComponent.type !== DesignerElementType.container && (
                    <Box sx={{ mb: 1 }}>
                      {selectedComponent.type ===
                        DesignerElementType.field ? (
                        <>
                          {/* {selectedComponent.content} */}
                          <GroupedComboBox
                            options={getFieldContent()}
                            value={selectedComponent.content}
                            onChange={(selectedId) => {
                              if (selectedId) {
                                handlePropertyChange("content", selectedId)
                              }
                            }}
                            label="Content"
                            placeholder="Select content field..."
                            className="w-full"
                          />

                          {forCustomRows && (
                            <ERPDataCombobox

                              id="format"
                              label={t("format")}
                              field={
                                {
                                  id: "format",
                                  valueKey: "value",
                                  labelKey: "label",

                                }
                              }
                              data={selectedComponent}
                              options={templateDesignerFormatOptions}
                              // initialInputValue={"NONE"}
                              // defaultData={"NONE"}
                              value={selectedComponent.format}
                              onChange={(e) =>
                                handlePropertyChange("format", e.value)
                              }
                            />
                          )}
                        </>

                      ) : selectedComponent.type ===
                        DesignerElementType.qrCode ? (
                        <ERPDataCombobox

                          // onTextChange={}
                          id="value"
                          data={selectedComponent.qrCodeProps}
                          label="QR Code Value"
                          field={{
                            id: "value",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          options={Object.keys(initialPrintMasterDto)?.map(
                            (field, index) => ({
                              value: field,
                              label: field,
                            })
                          )}
                          onChangeData={(data) =>
                            handleQRCodePropertyChange("value", data.value)
                          }
                        />
                      ) : (
                        <ERPInput
                          id="content"
                          label="Content"
                          value={selectedComponent.content}
                          data={selectedComponent}
                          onChange={(e) =>
                            handlePropertyChange("content", e.target.value)
                          }
                        />
                      )}
                    </Box>
                  )}

                {selectedComponent.type === DesignerElementType.image && (
                  <Box sx={{ mb: 1 }} className="flex  gap-2  flex-col">
                    <div className="text-xs">{t("select_image")}</div>
                    <ERPCheckbox
                      id="imgFromDevice"
                      label={t("upload")}
                      data={selectedComponent}
                      checked={
                        selectedComponent.imgFromDevice ?? false
                      }
                      onChange={(e) =>
                        handlePropertyChange(
                          "imgFromDevice",
                          e.target.checked
                        )
                      }
                    />
                    {!selectedComponent?.imgFromDevice && (
                      <GroupedComboBox
                        options={imgField}
                        value={selectedComponent.content}
                        onChange={(selectedId) => {
                          if (selectedId) {
                            handlePropertyChange("content", selectedId)
                          }
                        }}
                        label={t("image_field")}
                        placeholder={t("select_content_field")}
                        className="w-full"
                      />
                    )}

                    {/* File upload (when uploading from device) */}
                    {selectedComponent?.imgFromDevice && (
                      <>
                        <ERPInput
                          id="content"
                          type="file"
                          ref={inputImgFile}
                          onChange={(e: any) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 2097152) {
                              ERPToast.showWith(
                                "Maximum file size allowed is 2 MB, please try with different file.",
                                "warning"
                              );
                              return;
                            }
                            handleImagePropsChange("content", file);
                          }}
                          className="hidden"
                          accept="image/png,image/jpeg"
                          label={t("image")}
                        />

                        {/* Check for Base64 image */}
                        {selectedComponent?.content &&
                          typeof selectedComponent.content === "string" &&
                          selectedComponent.content.startsWith("data:image") ? (
                          <>
                            <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">
                              {t('click_save_to_apply_the_selected_background_image')}
                            </div>

                            <img
                              draggable={false}
                              src={selectedComponent.content}
                              alt={t("background_image")}
                              height={100}
                              width={100}
                              className="size-5"
                            />

                            <div
                              className="text-accent text-xs cursor-pointer max-w-min"
                              onClick={handleRemoveImage}
                            >
                              {t('remove')}
                            </div>
                          </>
                        ) : (
                          <label htmlFor="content">
                            <div
                              onClick={() => inputImgFile?.current?.click()}
                              className="text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer"
                            >
                              {t("choose_from_desktop")}
                            </div>
                          </label>
                        )}
                      </>
                    )}

                    <ERPDataCombobox
                      id="imgFit"
                      data={selectedComponent}
                      label={t("image_fit")}
                      field={{
                        id: "imgFit",
                        valueKey: "value",
                        labelKey: "label",
                      }}
                      options={objectFitOptions}
                      onChangeData={(data) =>
                        handlePropertyChange("imgFit", data.imgFit)
                      }
                    />
                    <ERPDataCombobox
                      label={t("image_position")}
                      id="imgPosition"
                      data={selectedComponent}
                      defaultValue={
                        selectedComponent?.imgPosition ?? "center"
                      }
                      onChangeData={(data) =>
                        handlePropertyChange("imgPosition", data.imgPosition)
                      }
                      field={{
                        id: "imgPosition",
                        valueKey: "value",
                        labelKey: "label",
                      }}
                      options={objectPosition}
                    />
                  </Box>
                )}

                <Box sx={{ mb: 1 }}>
                  <ERPInput 
                    id="x"
                    type="number"
                    label={t("position_x")}
                    value={Math.round(selectedComponent.x)}
                    data={selectedComponent}
                    onChange={(e) =>
                      handlePropertyChange("x", parseInt(e.target.value, 10))
                    }
                  />
                </Box>

                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="y"
                    type="number"
                    label={t("position_y")}
                    value={Math.round(selectedComponent.y)}
                    data={selectedComponent}
                    onChange={(e) =>
                      handlePropertyChange("y", parseInt(e.target.value, 10))
                    }
                  />
                </Box>

                <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
                  <Box className="basis-2/3">
                    <ERPSlider
                      label={t("rotate")}
                      value={selectedComponent.rotate}
                      onChange={(e) =>
                        handlePropertyChange(
                          "rotate",
                          e.target.valueAsNumber
                        )
                      }
                      min={0}
                      max={360}
                    />
                  </Box>

                  <Box className="basis-1/3">
                    <ERPInput
                      id="rotate"
                      type="number"
                      noLabel
                      value={selectedComponent.rotate}
                      data={selectedComponent}
                      onChange={(e) =>
                        handlePropertyChange(
                          "rotate",
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </Box>
                </Box>


                {selectedComponent &&
                  selectedComponent.type === DesignerElementType.qrCode && (
                    <Box sx={{ mb: 1, display: "flex", flexDirection: "column", gap: 2 }}>

                      {/* === Base === */}
                      <ERPSlider
                        label={`${t('width')} (${selectedComponent.qrCodeProps?.width || 128})`}
                        min={30}
                        step={10}
                        max={300}
                        value={selectedComponent.qrCodeProps?.width || 128}
                        onChange={(e) => handleQRCodePropertyChange('width', e.target.valueAsNumber)}
                      />
                      <ERPSlider
                        label={`${t('height')} (${selectedComponent.qrCodeProps?.height || 128})`}
                        min={30}
                        step={10}
                        max={300}
                        value={selectedComponent.qrCodeProps?.height || 128}
                        onChange={(e) => handleQRCodePropertyChange('height', e.target.valueAsNumber)}
                      />

                      <ERPDataCombobox
                        id="type"
                        label={t("output_type")}
                        options={[
                          { value: "canvas", label: "Canvas" },
                          { value: "svg", label: "SVG" }
                        ]}
                        value={selectedComponent.qrCodeProps?.type || "canvas"}
                        onChange={(e) => handleQRCodePropertyChange('type', e.value)}
                      />

                      <ERPSlider
                        label={`${t('margin')} (${selectedComponent.qrCodeProps?.margin || 0})`}
                        min={0}
                        max={20}
                        value={selectedComponent.qrCodeProps?.margin || 0}
                        onChange={(e) => handleQRCodePropertyChange('margin', e.target.valueAsNumber)}
                      />

                      {/* === QR Options === */}
                      <ERPDataCombobox
                        id="level"
                        label={t("error_correction_level")}
                        options={[
                          { value: "L", label: "Low" },
                          { value: "M", label: "Medium" },
                          { value: "Q", label: "Quartile" },
                          { value: "H", label: "High" }
                        ]}
                        value={selectedComponent.qrCodeProps?.level || "M"}
                        onChange={(e) => handleQRCodePropertyChange('level', e.value)}
                      />

                      {/* === Dots Options === */}
                      <ERPInput
                        id="dotsColor"
                        label={t("dots_color")}
                        type="color"
                        value={selectedComponent.qrCodeProps?.dotsOptions?.color || "#000000"}
                        onChange={(e) => handleQRCodePropertyChange('color', e.target.value, 'dotsOptions')}
                      />
                      <ERPDataCombobox
                        id="dotsType"
                        label={t("dots_shape")}
                        options={[
                          { value: "square", label: "Square" },
                          { value: "rounded", label: "Rounded" },
                          { value: "extra-rounded", label: "Extra Rounded" }
                        ]}
                        value={selectedComponent.qrCodeProps?.dotsOptions?.type || "square"}
                        onChange={(e) => handleQRCodePropertyChange('type', e.value, 'dotsOptions')}
                      />

                      {/* === Background Options === */}
                      <ERPInput
                        id="bgColor"
                        label={t("background_color")}
                        type="color"
                        value={selectedComponent.qrCodeProps?.backgroundOptions?.color || "#ffffff"}
                        onChange={(e) => handleQRCodePropertyChange('color', e.target.value, 'backgroundOptions')}
                      />

                      {/* === Corners Square Options === */}
                      <ERPInput
                        id="cornersSquareColor"
                        label={t("corner_square_color")}
                        type="color"
                        value={selectedComponent.qrCodeProps?.cornersSquareOptions?.color || "#000000"}
                        onChange={(e) => handleQRCodePropertyChange('color', e.target.value, 'cornersSquareOptions')}
                      />
                      <ERPDataCombobox
                        id="cornersSquareType"
                        label={t("corner_square_type")}
                        options={[
                          { value: "square", label: "Square" },
                          { value: "extra-rounded", label: "Extra Rounded" }
                        ]}
                        value={selectedComponent.qrCodeProps?.cornersSquareOptions?.type || "square"}
                        onChange={(e) => handleQRCodePropertyChange('type', e.value, 'cornersSquareOptions')}
                      />

                      {/* === Corners Dot Options === */}
                      <ERPInput
                        id="cornersDotColor"
                        label={t("corner_dot_color")}
                        type="color"
                        value={selectedComponent.qrCodeProps?.cornersDotOptions?.color || "#000000"}
                        onChange={(e) => handleQRCodePropertyChange('color', e.target.value, 'cornersDotOptions')}
                      />
                      <ERPDataCombobox
                        id="cornersDotType"
                        label={t("corner_dot_type")}
                        options={[
                          { value: "square", label: "Square" },
                          { value: "dot", label: "Dot" }
                        ]}
                        value={selectedComponent.qrCodeProps?.cornersDotOptions?.type || "square"}
                        onChange={(e) => handleQRCodePropertyChange('type', e.value, 'cornersDotOptions')}
                      />

                      {/* === Image Options === */}
                      <ERPInput
                        id="imageSrc"
                        label={t("image_url")}
                        value={selectedComponent.qrCodeProps?.image || ""}
                        onChange={(e) => handleQRCodePropertyChange('image', e.target.value)}
                      />
                      {selectedComponent.qrCodeProps?.image && (
                        <>
                          <ERPSlider
                            label={`${t('image_size')} (${selectedComponent.qrCodeProps?.imageOptions?.imageSize || 0.2})`}
                            min={0.05}
                            max={1}
                            step={0.05}
                            value={selectedComponent.qrCodeProps?.imageOptions?.imageSize || 0.2}
                            onChange={(e) => handleQRCodePropertyChange('imageSize', e.target.valueAsNumber, 'imageOptions')}
                          />
                          <ERPCheckbox
                            id="hideBackgroundDots"
                            label={t("hide_background_dots_under_image")}
                            checked={selectedComponent.qrCodeProps?.imageOptions?.hideBackgroundDots || false}
                            onChange={(e) => handleQRCodePropertyChange('hideBackgroundDots', e.target.checked, 'imageOptions')}
                          />
                        </>
                      )}
                    </Box>
                  )}

                {selectedComponent.type === DesignerElementType.line ? (
                  <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
                    <Box className="basis-2/3">
                      <ERPSlider
                        label={t("line_width")}
                        value={selectedComponent?.lineWidth || selectedComponent?.width || 100}
                        onChange={(e) =>
                          handlePropertyChange(
                            "lineWidth",
                            e.target.valueAsNumber
                          )
                        }
                        min={10}
                        max={1400}
                      />
                    </Box>
                    <Box className="basis-1/3">
                      <ERPInput
                        id="lineWidth"
                        type="number"
                        noLabel
                        value={selectedComponent?.lineWidth || selectedComponent?.width || 100}
                        data={selectedComponent}
                        onChange={(e) =>
                          handlePropertyChange(
                            "lineWidth",
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </Box>
                  </Box>
                ) : (
                  selectedComponent.type !== DesignerElementType.qrCode && (
                    <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
                      <Box className="basis-2/3">
                        <ERPSlider
                          label={t("width")}
                          value={selectedComponent.width}
                          onChange={(e) =>
                            handlePropertyChange(
                              "width",
                              e.target.valueAsNumber
                            )
                          }
                          min={10}
                          max={500}
                        />
                      </Box>
                      <Box className="basis-1/3">
                        <ERPInput
                          id="width"
                          type="number"
                          noLabel
                          value={selectedComponent.width}
                          data={selectedComponent}
                          onChange={(e) =>
                            handlePropertyChange(
                              "width",
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                      </Box>
                    </Box>
                  )
                )}

                {selectedComponent.type === DesignerElementType.line && (
                  <div className="space-y-3 mb-1">
                    <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
                      <Box className="basis-2/3">
                        <ERPSlider
                          label={t("line_thickness")}
                          value={selectedComponent?.lineThickness}
                          onChange={(e) =>
                            handlePropertyChange(
                              "lineThickness",
                              e.target.valueAsNumber
                            )
                          }
                          min={1}
                          max={5}
                        />
                      </Box>

                      <Box className="basis-1/3">
                        <ERPInput
                          id="lineThickness"
                          type="number"
                          noLabel
                          value={selectedComponent?.lineThickness}
                          data={selectedComponent}
                          onChange={(e) =>
                            handlePropertyChange(
                              "lineThickness",
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <ERPDataCombobox
                        id="lineType"
                        data={selectedComponent}
                        label={t("line_type")}
                        field={{
                          id: "lineType",
                          valueKey: "value",
                          labelKey: "label",
                        }}
                        options={[
                          { value: "solid", label: "solid" },
                          { value: "dotted", label: "dotted" },
                          { value: "dashed", label: "dashed" },
                        ]}
                        onChangeData={(data) =>
                          handlePropertyChange("lineType", data.lineType)
                        }
                      />
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <ERPInput
                        id="lineColor"
                        label={t("line_color")}
                        type="color"
                        value={selectedComponent?.lineColor}
                        data={selectedComponent}
                        onChange={(e) =>
                          handlePropertyChange("lineColor", e.target.value)
                        }
                      />
                    </Box>
                  </div>
                )}

                {selectedComponent.type !== DesignerElementType.line &&
                  selectedComponent.type !== DesignerElementType.qrCode && (
                    <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
                      <Box className="basis-2/3">
                        <ERPSlider
                          label={t("height")}
                          value={selectedComponent.height}
                          onChange={(e) =>
                            handlePropertyChange(
                              "height",
                              parseInt(e.target.value, 10)
                            )
                          }
                          min={10}
                          max={500}
                        />
                      </Box>

                      <Box className="basis-1/3">
                        <ERPInput
                          id="height"
                          type="number"
                          noLabel
                          value={selectedComponent.height}
                          data={selectedComponent}
                          onChange={(e) =>
                            handlePropertyChange(
                              "height",
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                      </Box>
                    </Box>
                  )}


                <Box sx={{ mb: 1 }}>
                  {(selectedComponent.type == DesignerElementType.text ||
                    selectedComponent.type == DesignerElementType.field) && (
                      <div className="flex flex-col gap-2">
                        <Box sx={{ mb: 1 }}>
                          <ERPDataCombobox
                            id="font"
                            data={selectedComponent}
                            label={t("font")}
                            field={{
                              id: "font",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            options={[
                              { value: "Roboto", label: "Roboto" },
                              { value: "RobotoMono", label: "RobotoMono" },
                              { value: "FiraSans", label: "FiraSans" },
                              { value: "Poppins", label: "Poppins" },
                            ]}
                            onChange={(e) =>
                              handlePropertyChange("font", e.value)
                            }
                          />
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <ERPDataCombobox
                            id="arabicFont"
                            data={selectedComponent}
                            defaultValue={"Amiri"}
                            label={t("arabic_font")}
                            field={{
                              id: "arabicFont",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            options={[
                              { value: "NotoNaskhArabic", label: "NotoNaskhArabic" },
                              { value: "Amiri", label: "Amiri" },
                            ]}
                            onChange={(e) =>
                              handlePropertyChange("arabicFont", e.value)
                            }
                          />
                        </Box>
                        <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
                          <Box className="basis-2/3">
                            <ERPSlider
                              label={t("font_weight")}
                              value={selectedComponent.fontWeight}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "fontWeight",
                                  e.target.valueAsNumber
                                )
                              }
                              min={300}
                              max={700}
                              step={100}
                            />
                          </Box>

                          <Box className="basis-1/3">
                            <ERPInput
                              id="fontWeight"
                              noLabel
                              value={selectedComponent.fontWeight}
                              data={selectedComponent}
                            //  onChange={(e) =>
                            //    handlePropertyChange(
                            //      "fontWeight",
                            //      e.target.valueAsNumber
                            //    )
                            //  }
                            //  min={300}
                            //  max={700}
                            //  step={100}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
                          <Box className="basis-2/3">
                            <ERPSlider
                              label={t("font_size")}
                              value={selectedComponent.fontSize}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "fontSize",
                                  e.target.valueAsNumber
                                )
                              }
                              min={0}
                              max={50}
                            />
                          </Box>

                          <Box className="basis-1/3">
                            <ERPInput
                              id="fontSize"
                              type="number"
                              noLabel
                              value={selectedComponent.fontSize}
                              data={selectedComponent}
                              onChange={(e) =>
                                handlePropertyChange(
                                  "fontSize",
                                  e.target.valueAsNumber
                                )
                              }
                            />
                          </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <div className="flex items-center gap-2">
                            <div
                              className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                              style={{ backgroundColor: `rgb(${selectedComponent?.fontColor})` }}>
                              <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                              <input
                                type="color"
                                value={selectedComponent?.fontColor}
                                onChange={(e) => {
                                  const rgb = hexToRgb(e.target?.value);
                                  if (rgb) {
                                    debouncedHandlePropetFieldChange("fontColor", `${rgb.r},${rgb.g},${rgb.b}`);
                                  }
                                }}
                                className="opacity-0 w-full h-full cursor-pointer"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                                {t("font_color")}
                              </label>
                              <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                                rgb({selectedComponent?.fontColor})
                              </div>
                            </div>
                          </div>

                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <InputLabel
                            sx={{
                              textTransform: "capitalize",
                              marginBottom: "0.25rem",
                              display: "block",
                              fontSize: "0.75rem",
                              color: "rgb(17, 24, 39)",
                              textAlign: "left",
                              direction: "rtl",
                            }}
                          >
                            {t('horizontal_align')}
                          </InputLabel>

                          <div className="flex justify-between space-x-2">
                            <button className={`ti-btn ${selectedComponent.textAlign === "left" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("textAlign", "left")
                              }
                            >
                              {t('left')}
                            </button>
                            <button className={`ti-btn ${selectedComponent.textAlign === "center" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("textAlign", "center")
                              }
                            >
                              {t('center')}
                            </button>
                            <button className={`ti-btn ${selectedComponent.textAlign === "right" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("textAlign", "right")
                              }
                            >
                              {t('right')}
                            </button>
                          </div>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <InputLabel
                            sx={{
                              textTransform: "capitalize",
                              marginBottom: "0.25rem",
                              display: "block",
                              fontSize: "0.75rem",
                              color: "rgb(17, 24, 39)",
                              textAlign: "left",
                              direction: "rtl",
                            }}
                          >
                            {t('vertical_align')}
                          </InputLabel>

                          <div className="flex justify-between space-x-2">
                            <button className={`ti-btn ${selectedComponent.verticalAlign === "top" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("verticalAlign", "top")
                              }
                            >
                              {t('top')}
                            </button>
                            <button className={`ti-btn ${selectedComponent.verticalAlign === "middle" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("verticalAlign", "middle")
                              }
                            >
                              {t('middle')}
                            </button>
                            <button className={`ti-btn ${selectedComponent.verticalAlign === "bottom" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("verticalAlign", "bottom")
                              }
                            >
                              {t('bottom')}
                            </button>
                          </div>
                        </Box>
                        <Box>
                          <InputLabel
                            sx={{
                              textTransform: "capitalize",
                              marginBottom: "0.25rem",
                              display: "block",
                              fontSize: "0.75rem",
                              color: "rgb(17, 24, 39)",
                              textAlign: "left",
                              direction: "rtl",
                            }}
                          >
                            {t('font_style')}
                          </InputLabel>
                          <div className="flex justify-between space-x-2">
                            {/* <button className={`ti-btn ${selectedComponent.fontStyle === "bold" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("fontStyle", "bold")
                              }
                            >
                              {t('bold')}
                            </button> */}
                            <button className={`ti-btn ${selectedComponent.fontStyle === "normal" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("fontStyle", "normal")
                              }
                            >
                              {t('normal')}
                            </button>
                            <button className={`ti-btn ${selectedComponent.fontStyle === "italic" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("fontStyle", "italic")
                              }
                            >
                              {t('italic')}
                            </button>
                          </div>
                        </Box>
                      </div>
                    )}
                </Box>

                {selectedComponent.type === DesignerElementType.barcode &&
                  selectedComponent.barcodeProps && (
                    <div className="space-y-4">
                      <Box>
                        <ERPDataCombobox
                          id="field"
                          label={t("field")}
                          data={selectedComponent.barcodeProps}
                          field={{
                            id: "field",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          options={Object.keys(initialPrintMasterDto)?.map((field) => ({
                            value: field,
                            label: field,
                          }))}
                          onChangeData={(data) =>
                            handleBarcodePropertyChange("field", data.field)
                          }
                        />
                      </Box>

                      <Box>
                        <ERPDataCombobox
                          id="format"
                          data={selectedComponent.barcodeProps}
                          label={t("barcode_format")}
                          field={{
                            id: "format",
                            valueKey: "value",
                            labelKey: "value",
                          }}
                          options={barcodeFormats?.map((format) => ({
                            value: format,
                            label: format,
                          }))}
                          // onChange={(e) => {
                          //   handleBarcodePropertyChange("format", e.value);
                          // }}
                          onChangeData={(data) =>
                            handleBarcodePropertyChange("format", data.format)
                          }
                        />
                      </Box>

                      <Box>
                        <ERPSlider
                          label={t("bar_width")}
                          value={selectedComponent.barcodeProps.barWidth}
                          onChange={(e) =>
                            handleBarcodePropertyChange(
                              "barWidth",
                              e.target.valueAsNumber
                            )
                          }
                          min={1}
                          max={10}
                          step={1}
                        />
                      </Box>

                      <Box>
                        <ERPSlider
                          label={t("margin")}
                          value={selectedComponent.barcodeProps.margin}
                          onChange={(e) =>
                            handleBarcodePropertyChange(
                              "margin",
                              e.target.valueAsNumber
                            )
                          }
                          min={0}
                          max={50}
                          step={1}
                        />
                      </Box>

                      <Box>
                        <ERPInput
                          id="background"
                          label={t("background_color")}
                          type="color"
                          value={selectedComponent.barcodeProps.background}
                          data={selectedComponent}
                          onChange={(e) =>
                            handleBarcodePropertyChange(
                              "background",
                              e.target.value
                            )
                          }
                        />
                      </Box>

                      <Box>
                        <ERPInput
                          id="lineColor"
                          label={t("line_color")}
                          type="color"
                          value={selectedComponent.barcodeProps.lineColor}
                          data={selectedComponent}
                          onChange={(e) =>
                            handleBarcodePropertyChange(
                              "lineColor",
                              e.target.value
                            )
                          }
                        />
                      </Box>

                      <Box className="flex space-x-4">
                        <ERPCheckbox
                          id="showText"
                          label={t("show_text")}
                          data={selectedComponent}
                          checked={selectedComponent.barcodeProps.showText}
                          onChange={(e) =>
                            handleBarcodePropertyChange(
                              "showText",
                              e.target.checked
                            )
                          }
                        />
                      </Box>

                      <Box>
                        <InputLabel
                          sx={{
                            textTransform: "capitalize",
                            marginBottom: "0.25rem",
                            display: "block",
                            fontSize: "0.75rem",
                            color: "rgb(17, 24, 39)",
                            textAlign: "left",
                            direction: "rtl",
                          }}
                        >
                          {t('text_align')}
                        </InputLabel>

                        <div className="flex justify-between space-x-2">
                          <button className={`ti-btn ${selectedComponent.barcodeProps.textAlign === "left" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                            onClick={() =>
                              handleBarcodePropertyChange("textAlign", "left")
                            }
                          >
                            {t('left')}
                          </button>
                          <button className={`ti-btn ${selectedComponent.barcodeProps.textAlign === "center" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                            onClick={() =>
                              handleBarcodePropertyChange(
                                "textAlign",
                                "center"
                              )
                            }
                          >
                            {t('center')}
                          </button>
                          <button className={`ti-btn ${selectedComponent.barcodeProps.textAlign === "right" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                            onClick={() =>
                              handleBarcodePropertyChange(
                                "textAlign",
                                "right"
                              )
                            }
                          >
                            {t('right')}
                          </button>
                        </div>
                      </Box>

                      <Box>
                        <ERPDataCombobox
                          id="font"
                          data={selectedComponent.barcodeProps}
                          label={t("font")}
                          field={{
                            id: "font",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          options={[
                            { value: "Roboto", label: "Roboto" },
                            { value: "RobotoMono", label: "RobotoMono" },
                            { value: "FiraSans", label: "FiraSans" },
                          ]}
                          onChange={(e) =>
                            handleBarcodePropertyChange("font", e.value)
                          }
                        />
                      </Box>

                      <Box>
                        <InputLabel
                          sx={{
                            textTransform: "capitalize",
                            marginBottom: "0.25rem",
                            display: "block",
                            fontSize: "0.75rem",
                            color: "rgb(17, 24, 39)",
                            textAlign: "left",
                            direction: "rtl",
                          }}
                        >
                          {t('font_style')}
                        </InputLabel>
                        <div className="flex justify-between space-x-1">
                          <button className={`ti-btn ${selectedComponent.barcodeProps.fontStyle === "bold" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                            onClick={() =>
                              handleBarcodePropertyChange("fontStyle", "bold")
                            }
                          >
                            {t('bold')}
                          </button>
                          <button
                            className={`ti-btn ${selectedComponent.barcodeProps.fontStyle === "normal" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                            onClick={() =>
                              handleBarcodePropertyChange(
                                "fontStyle",
                                "normal"
                              )
                            }
                          >
                            {t('normal')}
                          </button>
                          <button
                            className={`ti-btn ${selectedComponent.barcodeProps.fontStyle === "italic" ? "ti-btn-primary-full" : "bg-slate-100 hover:bg-slate-200 text-black"} px-4 py-2 w-full`}
                            onClick={() =>
                              handleBarcodePropertyChange(
                                "fontStyle",
                                "italic"
                              )
                            }
                          >
                            {t('italic')}
                          </button>
                        </div>
                      </Box>

                      <Box>
                        <ERPSlider
                          label={t("font_size")}
                          value={selectedComponent.barcodeProps.fontSize}
                          onChange={(e) =>
                            handleBarcodePropertyChange(
                              "fontSize",
                              e.target.valueAsNumber
                            )
                          }
                          min={0}
                          max={50}
                        />
                      </Box>

                      <Box>
                        <ERPSlider
                          label={t("text_margin")}
                          value={selectedComponent.barcodeProps.textMargin}
                          onChange={(e) =>
                            handleBarcodePropertyChange(
                              "textMargin",
                              e.target.valueAsNumber
                            )
                          }
                          min={-10}
                          max={40}
                        />
                      </Box>
                    </div>
                  )}
              </Box>
            )}

            {templateGroup === "barcode" && (
              <Box hidden={activeTab !== "label"}
                sx={{
                  maxHeight: "calc(100vh - 8rem)",
                  overflowY: "auto",
                  py: 2,
                  spaceY: 2,
                }}
                className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto pr-1"
              >
                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="ColumnsPerRow"
                    label={t("columns_per_row")}
                    type="number"
                    value={
                      templateData?.barcodeState?.labelState?.columnsPerRow
                    }
                    data={templateData}
                    onChange={(e) =>
                      handleLabelPropsChange("columnsPerRow", parseInt(e.target.value))
                    }
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="rowsPerPage"
                    label={t("row_per_page")}
                    type="number"
                    value={templateData?.barcodeState?.labelState?.rowsPerPage}
                    data={templateData}
                    onChange={(e) => {
                      handleLabelPropsChange("rowsPerPage", parseInt(e.target.value));
                    }}
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="labelWidth"
                    label={t("label_width")}
                    type="number"
                    value={templateData?.barcodeState?.labelState?.labelWidth}
                    data={templateData}
                    onChange={(e) => {
                      handleLabelPropsChange("labelWidth", parseFloat(e.target.value));
                    }}
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="labelHeight"
                    label={t("label_height")}
                    value={templateData?.barcodeState?.labelState?.labelHeight}
                    data={templateData}
                    type="number"
                    onChange={(e) =>
                      handleLabelPropsChange("labelHeight", parseFloat(e.target.value))
                    }
                  />
                </Box>

                <Box sx={{ mb: 1 }}>
                  <div className="flex flex-col gap-3">
                    <div className="text-xs">{t('background_image')}</div>
                    <ERPInput
                      id="background_image"
                      type="file"
                      ref={inputFile}
                      onChange={(e: any) => {
                        if (e.target.files[0].size > 2097152) {
                          ERPToast.showWith(
                            "Maximum file size allowed is 2 MB, please try with different file.",
                            "warning"
                          );
                        } else {
                          handleImagePropsChange(
                            "background_image",
                            e.target.files[0]
                          );
                        }
                      }}
                      className={"hidden"}
                      accept="image/png,image/jpeg"
                      label={t("image")}
                    />
                    <label htmlFor="background_image">
                      <div
                        onClick={() => inputFile?.current?.click()}
                        className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData?.barcodeState?.labelState?.background_image ? "hidden" : ""}`}>
                        {t('choose_from_desktop')}
                      </div>
                    </label>

                    {templateData?.barcodeState?.labelState
                      ?.background_image && (
                        <>
                          <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">
                            {t('click_save_to_apply_the_selected_background_image')}
                          </div>
                          {templateData?.barcodeState?.labelState
                            ?.background_image && (
                              <img
                                draggable={false}
                                src={templateData?.barcodeState?.labelState?.background_image}
                                alt="background_image"
                                height={100}
                                width={100}
                                className="size-5"
                              />
                            )}
                          <div className="text-accent text-xs cursor-pointer  max-w-min" onClick={handleRemoveBgImage}>
                            {t('remove')}
                          </div>
                          <div className="font-light text-sm">{t('image_fit')}</div>
                          <ERPDataCombobox
                            noLabel
                            id="bg_image_objectFit"
                            field={{
                              id: "bg_image_objectFit",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            data={templateData?.barcodeState?.labelState}
                            defaultValue={"contain"
                            }
                            onChange={(e) =>
                              handleLabelPropsChange("bg_image_objectFit", e.value)
                            }
                            options={[
                              { label: "fill", value: "fill" },
                              { label: "contain", value: "contain" },
                              { label: "cover", value: "cover" },
                              { label: "scale-down", value: "scale-down" },
                              { label: "none", value: "none" },

                            ]}
                          />
                          <div className="font-light text-sm">{t('image_position')}</div>
                          <ERPDataCombobox
                            noLabel
                            id="bg_image_position"
                            data={templateData?.barcodeState?.labelState}
                            defaultValue={
                              templateData?.barcodeState?.labelState
                                ?.labelHeight ?? "top left"
                            }
                            onChange={(e) =>
                              handleLabelPropsChange("bg_image_position", e.value)
                            }
                            field={{
                              id: "bg_image_position",
                              valueKey: "value",
                              labelKey: "label",
                            }}
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
                        </>
                      )}
                  </div>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                maxHeight: "calc(100vh - 8rem)",
                overflowY: "auto",
                py: 2,
                spaceY: 2,
              }}
              className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto pr-1"
              hidden={activeTab !== "page" || forCustomRows}>
              <Box sx={{ spaceY: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="templateName"
                    label={t("template_name")}
                    value={templateData?.propertiesState?.templateName}
                    data={templateData?.propertiesState}
                    onChange={(e) =>
                      handlePagePropsChange("templateName", e.target.value)
                    }
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <InputLabel
                    sx={{
                      textTransform: "capitalize",
                      marginBottom: "0.25rem",
                      display: "block",
                      fontSize: "0.75rem",
                      color: "rgb(17, 24, 39)",
                      textAlign: "left",
                      direction: "rtl",
                    }}
                    htmlFor="margin"
                  >
                    {t('padding_pt')}
                  </InputLabel>
                  <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                    {(
                      ["top", "left", "right", "bottom"] as PaddingMarginSides[]
                    ).map((side) => (
                      <ERPInput
                        id={side}
                        label={side.charAt(0).toUpperCase() + side.slice(1)}
                        key={side}
                        type="number"
                        placeholder={
                          side.charAt(0).toUpperCase() + side.slice(1)
                        }
                        value={templateData?.propertiesState?.padding?.[side]}
                        data={templateData?.propertiesState}
                        onChange={(e) =>
                          handlePagePropsChange("padding", {
                            ...templateData?.propertiesState?.padding,
                            [side]: parseFloat(e.target.value),
                          })
                        }
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <InputLabel
                    sx={{
                      textTransform: "capitalize",
                      marginBottom: "0.25rem",
                      display: "block",
                      fontSize: "0.75rem",
                      color: "rgb(17, 24, 39)",
                      textAlign: "left",
                      direction: "rtl",
                    }}
                    htmlFor="margin"
                  >
                    {t('gap_pt')}
                  </InputLabel>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={2}
                  >
                    {(["hgap", "vgap"] as GapSides[]).map((side) => (
                      <ERPInput
                        id={side}
                        label={side.charAt(0).toUpperCase() + side.slice(1)}
                        key={side}
                        type="number"
                        placeholder={
                          side.charAt(0).toUpperCase() + side.slice(1)
                        }
                        value={
                          templateData?.propertiesState?.gap?.[side]
                        }
                        data={templateData?.propertiesState}

                        onChange={(e) =>
                          handlePagePropsChange("gap", {
                            ...templateData?.propertiesState?.gap,
                            [side]: parseFloat(e.target.value),
                          })
                        }
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <ERPDataCombobox
                    defaultValue={"Eng"}
                    field={{
                      id: "language_prefer",
                      required: true,
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    data={templateData?.propertiesState}
                    value={
                      templateData?.propertiesState?.language_prefer ?? "Eng"
                    }
                    onChangeData={(data: any) => {
                      handlePagePropsChange(
                        "language_prefer",
                        data.language_prefer
                      );
                    }}
                    id="language_prefer"
                    options={[
                      { value: "Eng", label: "English" },
                      { value: "Arb", label: "Arabic" },
                    ]}
                    label={t("language_prefer")}
                  />
                </Box>



                <Box sx={{ mb: 2 }}>
                  <Stack spacing={2}>
                    {/* Enhanced Checkbox with Icon and Description */}
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: templateData?.propertiesState?.select_printer ? "action.selected" : "background.paper",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Printer color={templateData?.propertiesState?.select_printer ? "primary" : "disabled"} />
                        <Box sx={{ flex: 1 }}>
                          <ERPCheckbox
                            id="select_printer"
                            label={
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body1" fontWeight="medium">
                                  {t("enable_printer_selection")}
                                </Typography>
                                {templateData?.propertiesState?.select_printer && (
                                  <Chip label={t("active")} size="small" color="primary" variant="outlined" />
                                )}
                              </Stack>
                            }
                            checked={templateData?.propertiesState?.select_printer}
                            data={templateData?.propertiesState}
                            onChange={async (e) => {
                              const checked = e.target.checked
                              handlePagePropsChange("select_printer", checked)
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                            {t("allow_users_to_select_a_specific_printer_for_this_template_requires_jsprintmanager_installation")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Printer Selection Component */}
                    {templateData?.propertiesState?.select_printer && (
                      <Box sx={{ pl: 2, borderLeft: "3px solid", borderColor: "primary.main", bgcolor: "background.default", borderRadius: "0 4px 4px 0", }}>
                        <AccessPrinterList
                          templateData={templateData}
                          handlePagePropsChange={handlePagePropsChange}
                        />
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>

            {forCustomRows &&
              <Box hidden={activeTab !== "designer"}  >
                <Box sx={{ mb: 1 }}>
                  <ERPCheckbox
                    id="isFirstOnly"
                    label={isHeader == "headerState" ? t("show_in_first_page") : t("show_in_last_page")}
                    checked={designerData?.isFirstOnly ?? true}
                    onChange={(e) =>
                      handleDesignerChange("isFirstOnly", e.target.checked)
                    }
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <div className="flex flex-col gap-3">
                    <div className="text-xs">{t('background_image')}</div>
                    <ERPInput
                      id="background_image"
                      type="file"
                      ref={inputFile}
                      onChange={(e: any) => {
                        if (e.target.files[0].size > 2097152) {
                          ERPToast.showWith(
                            "Maximum file size allowed is 2 MB, please try with different file.",
                            "warning"
                          );
                        } else {
                          handleDesignerChange(
                            "background_image",
                            e.target.files[0],
                            true
                          );
                        }
                      }}
                      className={"hidden"}
                      accept="image/png,image/jpeg"
                      label={t("image")}
                    />

                    <label htmlFor="background_image">
                      <div onClick={() => inputFile?.current?.click()} className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${designerData?.background_image ? "hidden" : ""}`}>
                        {t('choose_from_desktop')}
                      </div>
                    </label>

                    {designerData?.background_image && (
                      <>
                        <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">  {t('click_save_to_apply_the_selected_background_image')}</div>
                        {designerData?.background_image && (
                          <img
                            draggable={false}
                            src={designerData?.background_image}
                            alt="background_image"
                            height={100}
                            width={100}
                            className="size-5"
                          />
                        )}
                        <div className="text-accent text-xs cursor-pointer  max-w-min" onClick={handleRemoveDesignerImg}>  {t('remove')}</div>
                        <div className="font-light text-sm">{t('image_fit')}</div>
                        <ERPDataCombobox
                          noLabel
                          id="bg_image_objectFit"
                          field={{
                            id: "bg_image_objectFit",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          value={designerData?.bg_image_objectFit ?? "fill"}
                          defaultValue={"fill"}
                          onChange={(e) =>
                            handleDesignerChange("bg_image_objectFit", e.value)
                          }
                          options={[
                            { label: "fill", value: "fill" },
                            { label: "contain", value: "contain" },
                            { label: "cover", value: "cover" },
                            { label: "scale-down", value: "scale-down" },
                            { label: "none", value: "none" },

                          ]}
                        />
                        <div className="font-light text-sm">{t('image_position')}</div>
                        <ERPDataCombobox
                          noLabel
                          id="bg_image_position"
                          field={{
                            id: "bg_image_position",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          value={designerData?.bg_image_position ?? "center"}
                          defaultValue={"center"}
                          onChange={(e) =>
                            handleDesignerChange("bg_image_position", e.value)
                          }
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
                      </>
                    )}
                  </div>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="relative h-12 w-12 rounded-xl border-2 border-gray-300 dark:border-dark-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                      style={{ backgroundColor: `rgb(${designerData?.background_color}) ` }}>
                      <i className="ri-palette-line text-white text-sm absolute pointer-events-none drop-shadow-md"></i>
                      <input
                        type="color"
                        value={designerData?.background_color}
                        onChange={(e) => {
                          const rgb = hexToRgb(e.target?.value);
                          if (rgb) {
                            debouncedHandleAreaPropetFieldChange("background_color", `${rgb.r},${rgb.g},${rgb.b}`);
                          }
                        }}
                        className="opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-700 dark:text-dark-text block mb-1">
                        {t("background_color")}
                      </label>
                      <div className="text-xs text-gray-800 dark:text-dark-text font-mono bg-gray-100 dark:bg-dark-hover-bg p-1 rounded-md">
                        rgb({designerData?.background_color})
                      </div>
                    </div>
                  </div>
                </Box>
              </Box>
            }
          </Box>
        </div>
      </ResizableBox>

    </div>
  );
};

export default PDFBarcodeDesigner;