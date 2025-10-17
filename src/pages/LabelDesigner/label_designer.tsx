"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Settings,
  Plus,
  Minus,
  Menu,
  Edit,
  Scan,
  Save,
  Printer,
  Download,
  X,
  Image,
  Table,
  SquareDashed,
  QrCode as QrCodeIcon,
  EllipsisVertical,
  Package,
} from "lucide-react";

import usFlag from "../../assets/images/flags/us_flag.png";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import save_svg from "../../assets/svg/save.svg";
import ERPModal from "../../components/ERPComponents/erp-modal";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  InputLabel,
  Stack,
  Chip,

} from "@mui/material";


import ERPToast from "../../components/ERPComponents/erp-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Urls from "../../redux/urls";
import { APIClient } from "../../helpers/api-client";
import { handleResponse } from "../../utilities/HandleResponse";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../components/ERPComponents/erp-button";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import {
  DesignerElementType,
  initialBacodeTemplateState,
  PlacedComponent,
  PropertiesState,
  QRCodeProps,
  TemplateDto,
  TemplateState,
} from "../InvoiceDesigner/Designer/interfaces";
import { useAppState } from "../../utilities/hooks/useAppState";
import ERPPreviousUrlButton from "../../components/ERPComponents/erp-previous-uirl-button";
import { setTemplateCustomElements } from "../../redux/slices/templates/reducer";
import { convertFileToBase64 } from "../../utilities/file-utils";
import { EditButton } from "./edit-button";
import { useTranslation } from "react-i18next";
import VoucherType, {
  purchaseVoucherTypes,
  salesVoucherTypes,
  accountsVoucherTypes,
} from "../../enums/voucher-types";
import { accountsFields, inventoryFields, barCodeField } from "./fields";
import { containsArabicString, getPageDimensions, ptToPx, pxToPt } from "../InvoiceDesigner/utils/pdf-util";
import { QRCodeComponent } from "./QRCodeComponent";
import GroupedComboBox from "../../components/ERPComponents/erp-grouped-combo";
import { AccessPrinterList } from "../InvoiceDesigner/utils/get_printers";
import { renderBarcode } from "../../utilities/barcode";
import { ERPScrollArea } from "../../components/ERPComponents/erp-scrollbar";
import { initialPrintMasterDto } from "../use-print-type-data";
import { designSections } from "../InvoiceDesigner/LandingFolder/designSection";
import useDebounce from "../inventory/transactions/purchase/use-debounce";
import { hexToRgb } from "../../components/common/switcher/switcherdata/switcherdata";
import { generateUniqueKey } from "../../utilities/Utils";
import ERPSlider from "../../components/ERPComponents/erp-slider";
import { fetchTemplateFromApiById } from "../use-print";

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
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  id,
  isSelected,
  handleDelete,
  depth = 0
}) =>
  isSelected ? (
    <button
      className={`absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full 
                 flex items-center justify-center 
                 hover:bg-[#ebb0ad] focus:outline-none focus:ring-2 focus:ring-[#e0655e] focus:ring-opacity-75
                 transition-colors duration-200 ease-in-out
                 text-[#da514a] hover:text-[#ec5149] `}
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

const imgContent = [{ label: "img1", value: usFlag }];

// Utility functions

// Main Component
const PDFBarcodeDesigner: React.FC<PDFBarcodeDesignerProps> = ({
  forCustomRows = false,
  template,
  customTemplate,
  onSuccess,
}) => {
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

  const [templateData, setTemplateData] = useState<TemplateState<unknown>>(
    initialBacodeTemplateState<unknown>().data || {}
  );



  const [designerData, setDesignerData] = useState({
    background_image: "",
    bg_image_position: "",
    background_color: "",
    bg_image_objectFit: "",
    isFirstOnly: true,
  });

 
 
  const { t } = useTranslation("labelDesigner");
  const pageSize = template?.propertiesState?.pageSize ?? "A4";

  const selectedPageSize = getPageDimensions(
    pageSize,
    template?.propertiesState?.width,
    template?.propertiesState?.height
  );

  // Components configuration
  const components = [
    {
      id: DesignerElementType.text,
      label: "Text",
      icon: <Edit className="w-4 h-4" />,
      defaultContent: "Text",
    },
    {
      id: DesignerElementType.barcode,
      label: "Barcode",
      icon: <Scan className="w-4 h-4" />,
      defaultContent: "123456789012",
    },
    {
      id: DesignerElementType.field,
      label: "Field",
      icon: <Menu className="w-4 h-4" />,
      defaultContent: "Select",
    },
    {
      id: DesignerElementType.line,
      label: "line",
      icon: <Minus className="w-4 h-4" />,
      defaultContent: "Line",
    },
    {
      id: DesignerElementType.image,
      label: "Image",
      icon: <Image className="w-4 h-4" />,
      defaultContent: "Image",
    },
    {
      id: DesignerElementType.qrCode,
      label: "QrCode",
      icon: <QrCodeIcon className="w-4 h-4" />,
      defaultContent: "QrCode",
    },
    {
      id: DesignerElementType.container,
      label: "Container",
      icon: <Package className="w-4 h-4 text-blue-600" />,
      defaultContent: "",
    },
  ];

  // Helper function to get absolute position of a component considering nested containers
  const getAbsolutePosition = (
    component: PlacedComponent,
    allComponents: PlacedComponent[]
  ): { x: number; y: number } => {
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
  const findDeepestContainerAt = (
    x: number,
    y: number,
    components: PlacedComponent[],
    excludeId?: string
  ): PlacedComponent | null => {
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
  const handleDragStart = (
    e: React.DragEvent,
    componentType: DesignerElementType
  ) => {
    e.dataTransfer.setData("componentType", componentType.toString());
    setSelectedComponent(null);
  };

  // Drop into container handler - UPDATED for n-level nesting
  const handleDropIntoContainer = (
    e: React.DragEvent<HTMLDivElement>,
    container: PlacedComponent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const componentType = parseInt(
      e.dataTransfer.getData("componentType")
    ) as DesignerElementType;

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
          containerId: container.id,
          textAlign: "center",
          fontSize: 12,
          font: "Roboto",
          arabicFont:"Amiri",
          fontStyle: "normal",
          width: componentType === DesignerElementType.container ? 200 : 100,
          height: componentType === DesignerElementType.container ? 150 :
            componentType === DesignerElementType.barcode ? 80 :
              componentType === DesignerElementType.line ? 10 : 30,
          lineThickness: "1",
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
            width: 150,
            height: 150,
            level: "M",
            type: "svg",
            margin: 10,
          },
        };

        // Add container-specific properties if it's a container
        if (componentType === DesignerElementType.container) {
          newComponent.containerProps = {
            backgroundColor: "#f0f0f0",
            borderColor: "#a5a4a4ff",
            borderWidth: 1,
            borderStyle: "solid",
            padding: 10,
            autoResize: false,
            minHeight: 80,
            maxHeight: 400,
            borderRound: 1,
          };
          newComponent.children = [];
        }

        const updatedComponents = [
          ...(templateData?.barcodeState?.placedComponents || []),
          newComponent,
        ];

        setTemplateData((prev: TemplateState<unknown>) => ({
          ...prev,
          barcodeState: {
            ...prev.barcodeState,
            placedComponents: updatedComponents,
          },
        }));

        setTimeout(() => {
          setSelectedComponent(newComponent);
        }, 0);
      }
    }
  };

  // Main drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = parseInt(
      e.dataTransfer.getData("componentType")
    ) as DesignerElementType;

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
          fontSize: 12,
          font: "Roboto",
          fontStyle: "normal",
          lineThickness: "1",
          lineColor: "#000000",
          lineType: "solid",
          lineWidth: 150,
          width: 150,
          height: componentType === DesignerElementType.barcode ? 80 :
            componentType === DesignerElementType.line ? 10 : 30,
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
            width: 150,
            height: 150,
            level: "M",
            type: "svg",
            margin: 10,
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
          newComponent.width = 250;
          newComponent.height = 200;
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

        const updatedComponents = [
          ...(templateData?.barcodeState?.placedComponents || []),
          newComponent,
        ];

        setTemplateData((prev: TemplateState<unknown>) => ({
          ...prev,
          barcodeState: {
            ...prev.barcodeState,
            placedComponents: updatedComponents,
          },
        }));

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
    setTemplateData((prev: TemplateState<unknown>) => {
      const componentsToDelete = new Set<string>();
      const components = prev.barcodeState?.placedComponents || [];

      // Recursively find all children
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

      return {
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents,
        },
      };
    });
    setSelectedComponent(null);
  };

  // Property change handlers
  const handlePropertyChange = (
    property: keyof PlacedComponent,
    value: string | number | boolean,
    id?: number | undefined,
    isUndoOrRedo?: boolean | false
  ) => {
    if (selectedComponent) {
      const updatedComponent = { ...selectedComponent, [property]: value };
      const updatedComponents =
        templateData?.barcodeState?.placedComponents?.map((comp) =>
          comp.id === (id ? id : selectedComponent.id) ? updatedComponent : comp
        );
      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents || [],
        },
      }));
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

      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents,
        },
      }));

      setSelectedComponent(updatedComponent);
    }
  };

  const handleBarcodePropertyChange = (
    property: any,
    value: string | number | boolean
  ) => {
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
      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents || [],
        },
      }));
      setSelectedComponent({
        ...selectedComponent,
        barcodeProps: { ...selectedComponent.barcodeProps, [property]: value },
      });
    }
  };

  const handleQRCodePropertyChange = (
    property: string,
    value: any,
    nestedPath?: keyof QRCodeProps
  ) => {
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

      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents || [],
        },
      }));
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
  const renderNestedContainer = (
    container: PlacedComponent,
    allComponents: PlacedComponent[],
    depth: number = 0
  ): React.ReactNode => {
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

         minConstraints={[ptToPx(20), ptToPx(20)]}
         maxConstraints={[ptToPx(800), ptToPx(600)]}

        resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
        onResize={(e, { size }) => {
    // Convert px -> pt before saving
    const widthPt = pxToPt(size.width);
    const heightPt = pxToPt(size.height);

    const updatedComponents =
      templateData?.barcodeState?.placedComponents?.map((comp) =>
        comp.id === container.id
          ? { ...comp, width: widthPt, height: heightPt }
          : comp
      ) || [];

    setTemplateData((prev) => ({
      ...prev,
      barcodeState: {
        ...prev.barcodeState,
        placedComponents: updatedComponents,
      },
    }));

    if (selectedComponent?.id === container.id) {
      setSelectedComponent((prev) => ({
        ...prev!,
        width: widthPt,
        height: heightPt,
      }));
    }
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
        const isArabic = containsArabicString(component?.content??"")
        const textDirection = isArabic ? "rtl" : "ltr";
        return (
          <ResizableBox
            key={component.id}
            width={ptToPx(component.width)}
            height={ptToPx(component.height)}
            minConstraints={[ptToPx(20), ptToPx(20)]}
            maxConstraints={[ptToPx(800), ptToPx(600)]}
            resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
            onResize={(e, { size }) => {
            const widthPt = pxToPt(size.width);
            const heightPt = pxToPt(size.height);

            const updatedComponents =
            templateData?.barcodeState?.placedComponents?.map((comp) =>
              comp.id === component.id
                ? { ...comp, width: widthPt, height: heightPt }
                : comp
            ) || [];         

              setTemplateData((prev: TemplateState<unknown>) => ({
                ...prev,
                barcodeState: {
                  ...prev.barcodeState,
                  placedComponents: updatedComponents,
                },
              }));
              if (selectedComponent?.id === component.id) {
                setSelectedComponent((prev) => ({
                  ...prev!,
                      width: widthPt,
                      height: heightPt,
                }));
              }
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
                alignItems: "center",
                // direction: textDirection,
                justifyContent: 
                        component.textAlign === 'left' ? 'flex-start' : 
                        component.textAlign === 'right' ? 'flex-end' : 
                        component.textAlign || "center",
                overflow: "hidden",
                backgroundColor: isSelected ? "#ffffffff" : "inherit",
                pointerEvents: 'auto',
                userSelect: 'none',
                cursor: "move",
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
                    // --- PRESENTATION STYLES GO HERE (MATCHING PREVIEW) ---
                    fontFamily: isArabic ? component?.arabicFont ?? "Amiri" : component?.font ?? "Roboto",
                    fontSize: `${component.fontSize || 12}pt`,
                    fontWeight: component.fontWeight ?? "400",
                    fontStyle: component.fontStyle || "normal",
                    textAlign: component.textAlign || "center",
                    color: `rgb(${component.fontColor || "0,0,0"})`, // Ensure color fallback
                    pointerEvents: 'none', 
                    userSelect: 'none', 
                    whiteSpace: "pre-wrap" 
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
          <div
            key={component.id}
            id={`component-${component.id}`}
            style={{
              ...style,
              width: `${component.lineWidth}pt`,
              height: "auto",
              padding: 2,
              position: "relative",
              overflow: "visible",
              border:
                selectedComponent?.id === component.id
                  ? "2px solid #2196f3"
                  : "none",
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
            <div
              style={{
                borderTop: `${component?.lineThickness || 1}px ${component?.lineType || "solid"
                  } ${component?.lineColor || "black"}`,
                width: `${component.lineWidth}pt`,
                margin: 0,
              }}
            />
            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            />
          </div>
        );

      case DesignerElementType.image:
        return (
          <ResizableBox
            key={component.id}
            width={ptToPx(component.width)}
            height={ptToPx(component.height)}
            minConstraints={[ptToPx(20), ptToPx(20)]}
            maxConstraints={[ptToPx(800), ptToPx(600)]}
            resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
            onResize={(e, { size }) => {
            const widthPt = pxToPt(size.width);
            const heightPt = pxToPt(size.height);

            const updatedComponents =
            templateData?.barcodeState?.placedComponents?.map((comp) =>
              comp.id === component.id
                ? { ...comp, width: widthPt, height: heightPt }
                : comp
            ) || [];         

              setTemplateData((prev: TemplateState<unknown>) => ({
                ...prev,
                barcodeState: {
                  ...prev.barcodeState,
                  placedComponents: updatedComponents,
                },
              }));
              if (selectedComponent?.id === component.id) {
                setSelectedComponent((prev) => ({
                  ...prev!,
                      width: widthPt,
                      height: heightPt,
                }));
              }
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

          setTemplateData((prev: TemplateState<unknown>) => {
            const components = prev?.barcodeState?.placedComponents || [];

            // Calculate relative position if inside a container
            if (draggingRef.current?.containerId) {
              const containerChain = [];
              let currentContainerId = draggingRef.current.containerId;

              // Build the container chain
              while (currentContainerId) {
                const container = components.find(c => c.id === currentContainerId);
                if (container) {
                  containerChain.push(container);
                  currentContainerId = container.containerId ?? "";
                } else {
                  break;
                }
              }

              // Calculate position relative to immediate parent
              if (containerChain.length > 0) {
                const immediateParent = containerChain[0];
                const parentAbsolutePos = getAbsolutePosition(immediateParent, components);
                const containerPadding = immediateParent.containerProps?.padding || 10;

                newX = newX - parentAbsolutePos.x - containerPadding;
                newY = newY - parentAbsolutePos.y - containerPadding;

                // Keep within container bounds
                const maxX = immediateParent.width - (containerPadding * 2) - draggingRef.current!.width;
                const maxY = immediateParent.height - (containerPadding * 2) - draggingRef.current!.height;
                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));
              }
            }

            const updatedComponents = components.map((comp) => {
              if (comp.id === draggingRef.current!.id) {
                return {
                  ...comp,
                  x: newX,
                  y: newY,
                };
              }
              return comp;
            });

            return {
              ...prev,
              barcodeState: {
                ...prev.barcodeState,
                placedComponents: updatedComponents,
              },
            };
          });


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
  }, []);

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
            labelWidth: newWidthPt,
            labelHeight: newHeightPt,
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
    setTemplateData((prev: TemplateState<unknown>) => ({
      ...prev,
      propertiesState: { ...prev.propertiesState, [property]: value },
    }));
  };

  const handleLabelPropsChange = (property: any, value: any) => {
    setTemplateData((prev: any) => ({
      ...prev,
      barcodeState: {
        ...prev.barcodeState,
        labelState: {
          ...prev.barcodeState?.labelState,
          [property]: value,
        },
      },
    }));
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
        dispatch(
          setTemplateCustomElements({
            payload: {
              elements: consolidatedComponents,
              height: templateData.barcodeState?.labelState?.labelHeight,
              thumbImage: dataUrl ?? "",
              background_image: designerData?.background_image,
              bg_image_position: designerData?.bg_image_position,
              background_color: designerData?.background_color,
              isFirstOnly:designerData?.isFirstOnly??true

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
        formType:templateToSave.propertiesState?.template_formType??"",
        customerType:templateToSave.propertiesState?.template_customerType??"",
        thumbImage: dataUrl,
        content: JSON.stringify(templateToSave),
        isCurrent: false,
        backgroundImage: tmpTemplate.background_image ?? "",
        backgroundImageHeader: tmpTemplate.background_image_header ?? "",
        backgroundImageFooter: tmpTemplate.background_image_footer ?? "",
        signatureImage: tmpTemplate.signature_image ?? "",
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
  };

  // Effects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedComponent) return;

      const step = 1; // step size (points or px)
      let { x, y, width, height } = selectedComponent;

      if (e.shiftKey) {
        // --- Resize Mode ---
        switch (e.key) {
          case "ArrowUp":
            height = Math.max(20, height - step);
            break;
          case "ArrowDown":
            height = height + step;
            break;
          case "ArrowLeft":
            width = Math.max(20, width - step);
            break;
          case "ArrowRight":
            width = width + step;
            break;
          default:
            return;
        }
      } else {
        // --- Move Mode ---
        switch (e.key) {
          case "ArrowUp":
            y = y - step;
            break;
          case "ArrowDown":
            y = y + step;
            break;
          case "ArrowLeft":
            x = x - step;
            break;
          case "ArrowRight":
            x = x + step;
            break;
          default:
            return;
        }
      }

      // Update placedComponents
      const updatedComponents =
        templateData?.barcodeState?.placedComponents?.map((comp) =>
          comp.id === selectedComponent.id
            ? { ...comp, x, y, width, height }
            : comp
        ) || [];

      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents,
        },
      }));

      // Update selectedComponent
      setSelectedComponent((prev) =>
        prev ? { ...prev, x, y, width, height } : prev
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponent, templateData, setTemplateData, setSelectedComponent]);



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

      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: expandedComponents || [],
          labelState: {
            ...prev.barcodeState?.labelState,
            labelHeight: nestedValue?.height || 200,
            labelWidth: selectedPageSize?.width,
          },
        },
      }));

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

  const getFieldContent = () => {
    if (!forCustomRows) return barCodeField;
    return accountsVoucherTypes.includes(templateGroup as VoucherType)
      ? accountsFields
      : inventoryFields;
  };

  // Computed values
  const labelWidthPt = templateData?.barcodeState?.labelState?.labelWidth ?? 300;
  const labelHeightPt = templateData?.barcodeState?.labelState?.labelHeight ?? 200;
  const labelWidthPx = ptToPx(labelWidthPt);
  const labelHeightPx = ptToPx(labelHeightPt);

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
    <div
      className={`flex h-dvh max-h-dvh bg-gray-100 overflow-hidden w-full
       ${templateData.propertiesState?.language_prefer === "Eng"
          ? "dir-ltr"
          : templateData.propertiesState?.language_prefer === "Arb"
            ? "dir-rtl"
            : "dir-ltr"
        }`}
    >
      {/* Left Sidebar - Components */}
      <ResizableBox
        width={250}
        height={Infinity}
        minConstraints={[150, Infinity]}
        maxConstraints={[400, Infinity]}
        resizeHandles={[
          templateData.propertiesState?.language_prefer === "Arb" ? "w" : "e",
        ]}
        handle={
          <div
            className={`custom-handle ${templateData.propertiesState?.language_prefer === "Arb"
                ? "rtl"
                : "ltr"
              }`}
          />
        }
        className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden"
      >
        <div className="border-r border-gray-200 p-4">
          <div className="bg-[] border-b border-dashed pb-2 mb-1 border-gray-600">
            <h2 className="text-sm font-semibold text-gray-700">Components</h2>
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
                  className={`flex items-center p-2 rounded hover:bg-gray-100 cursor-move ${component.id === DesignerElementType.container
                      ? 'border-2 border-dashed border-gray-300 bg-gray-50'
                      : ''
                    }`}
                  title={component.id === DesignerElementType.container
                    ? 'Container - Drop elements inside to group them'
                    : component.label
                  }
                >
                  {component.icon}
                  <span className="text-sm ml-2">{component.label}</span>
                </div>
              ))}
          </div>
        </div>
      </ResizableBox>

      {/* Main Design Area */}
      <div
        className="flex-1 flex flex-col bg-[#e5e7eb]"
        style={{ height: "100%" }}
      >
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center">
            {!forCustomRows && (
              <div className=" ">
                <ERPPreviousUrlButton size="37px" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ERPButton
              title={t("clear")}
              onClick={() => {
                setTemplateData((prev: TemplateState<unknown>) => ({
                  ...prev,
                  barcodeState: {
                    ...prev.barcodeState,
                    placedComponents: [],
                  },
                }));
                setSelectedComponent(null);
              }}
              variant="secondary"
            />
            <ERPButton
              title={t("save")}
              onClick={manageSaveTemplate}
              variant="primary"
              loading={loading}
            />
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
            padding: `${templateData?.propertiesState?.padding?.top ?? 0}pt 
                      ${templateData?.propertiesState?.padding?.right ?? 0}pt 
                      ${templateData?.propertiesState?.padding?.bottom ?? 0}pt 
                      ${templateData?.propertiesState?.padding?.left ?? 0}pt`,
          }}
        >
          <ResizableBox
            width={labelWidthPx}
            height={labelHeightPx}
            minConstraints={[ptToPx(50), ptToPx(50)]}
            maxConstraints={[ptToPx(1200), ptToPx(800)]}
            resizeHandles={[
              forCustomRows
                ? "s"
                : templateData.propertiesState?.language_prefer === "Arb"
                  ? "sw"
                  : "se",
            ]}
            className="box"
            onResize={handleContentLabelResize}
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
        width={380} // Initial width
        height={Infinity}
        minConstraints={[200, Infinity]} // Minimum width
        maxConstraints={[400, Infinity]} // Maximum width
        resizeHandles={[
          templateData.propertiesState?.language_prefer === "Arb" ? "e" : "w",
        ]}
        handle={
          <div
            className={`custom-handle ${templateData.propertiesState?.language_prefer === "Arb"
                ? "ltr"
                : "rtl"
              }`}
          />
        }
        // onResize={(e, { size }) => }
        className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden relative"
      >
        <div className="p-4 h-full">
          <div className="flex flex-col mb-4 z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-700">
                Properties
              </h2>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <Tabs value={activeTab} onChange={handleTabChange}>
              {!forCustomRows && <Tab label="Page" value="page" />}
              <Tab label="Element" value="element" />
              {forCustomRows && <Tab label="Designer" value="designer" />}
              {templateGroup === "barcode" && !forCustomRows && (
                <Tab label="Label" value="label" />
              )}
            </Tabs>
          </div>
          <Box>
            <Box
              hidden={activeTab !== "element"}
            // sx={{ maxHeight: "calc(100vh)", pb: 2 }}
            >
              {selectedComponent && (
                <Box
                  sx={{
                    maxHeight: "calc(100vh - 8rem)",
                    overflowY: "auto",
                    py: 2,
                    spaceY: 2,
                  }}
                  className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto pr-1"
                // className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-1 "
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
                            {selectedComponent.content}
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
                        <ERPDataCombobox
                          id="content"
                          data={selectedComponent}
                          label="Content"
                          field={{
                            id: "content",
                            valueKey: "value",
                            labelKey: "label",
                          }}
                          options={imgContent}
                          onChangeData={(data) => {
                            handlePropertyChange("content", data.content);

                          }}
                        />
                      )}

                      {selectedComponent?.imgFromDevice && (
                        <>
                          <ERPInput
                            id="content"
                            type="file"
                            ref={inputImgFile}
                            onChange={(e: any) => {
                              if (e.target.files[0].size > 2097152) {
                                ERPToast.showWith(
                                  "Maximum file size allowed is 2 MB, please try with different file.",
                                  "warning"
                                );
                              } else {
                                handleImagePropsChange(
                                  "content",
                                  e.target.files[0]
                                );
                                // Set imgFromDevice to true when an image is selected from device
                                // handlePropertyChange("imgFromDevice", true);
                              }
                            }}
                            className={"hidden"}
                            accept="image/png,image/jpeg"
                            label="Image"
                            placeholder=" "
                          />
                          <label htmlFor="content">
                            <div
                              onClick={() => inputImgFile?.current?.click()}
                              className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${selectedComponent?.content
                                  ? "hidden"
                                  : ""
                                }`}
                            >
                              Choose from Desktop
                            </div>
                          </label>

                          {selectedComponent?.content && (
                            <>
                              <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">
                                Click Save to apply the selected background image
                              </div>

                              <img
                                draggable={false}
                                src={
                                  templateData?.barcodeState?.labelState
                                    ?.background_image
                                }
                                alt="background_image"
                                height={100}
                                width={100}
                                className="size-5"
                              />

                              <div
                                className="text-accent text-xs cursor-pointer  max-w-min"
                                onClick={handleRemoveImage}
                              >
                                Remove
                              </div>


                            </>
                          )}

                        </>
                      )}
                      {selectedComponent?.content && (
                        <>
                          <ERPDataCombobox
                            id="imgFit"
                            data={selectedComponent}
                            label="Image Fit"
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
                            noLabel
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
                        </>
                      )}

                    </Box>
                  )}

                  <Box sx={{ mb: 1 }}>
                    <ERPInput
                      id="x"
                      type="number"
                      label="Position X"
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
                      label="Position Y"
                      value={Math.round(selectedComponent.y)}
                      data={selectedComponent}
                      onChange={(e) =>
                        handlePropertyChange("y", parseInt(e.target.value, 10))
                      }
                    />
                  </Box>



                  <Box
                    sx={{ mb: 1 }}
                    className="flex justify-start gap-2 items-center"
                  >
                    <Box className="basis-2/3">
                      <ERPSlider
                        label="Rotate"
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
                          label={`Width (${selectedComponent.qrCodeProps?.width || 128})`}
                          min={30}
                          step={10}
                          max={300}
                          value={selectedComponent.qrCodeProps?.width || 128}
                          onChange={(e) => handleQRCodePropertyChange('width', e.target.valueAsNumber)}
                        />
                        <ERPSlider
                          label={`Height (${selectedComponent.qrCodeProps?.height || 128})`}
                          min={30}
                          step={10}
                          max={300}
                          value={selectedComponent.qrCodeProps?.height || 128}
                          onChange={(e) => handleQRCodePropertyChange('height', e.target.valueAsNumber)}
                        />

                        <ERPDataCombobox
                          id="type"
                          label="Output Type"
                          options={[
                            { value: "canvas", label: "Canvas" },
                            { value: "svg", label: "SVG" }
                          ]}
                          value={selectedComponent.qrCodeProps?.type || "canvas"}
                          onChange={(e) => handleQRCodePropertyChange('type', e.value)}
                        />

                        <ERPSlider
                          label={`Margin (${selectedComponent.qrCodeProps?.margin || 0})`}
                          min={0}
                          max={20}
                          value={selectedComponent.qrCodeProps?.margin || 0}
                          onChange={(e) => handleQRCodePropertyChange('margin', e.target.valueAsNumber)}
                        />

                        {/* === QR Options === */}
                        <ERPDataCombobox
                          id="level"
                          label="Error Correction Level"
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
                          label="Dots Color"
                          type="color"
                          value={selectedComponent.qrCodeProps?.dotsOptions?.color || "#000000"}
                          onChange={(e) => handleQRCodePropertyChange('color', e.target.value, 'dotsOptions')}
                        />
                        <ERPDataCombobox
                          id="dotsType"
                          label="Dots Shape"
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
                          label="Background Color"
                          type="color"
                          value={selectedComponent.qrCodeProps?.backgroundOptions?.color || "#ffffff"}
                          onChange={(e) => handleQRCodePropertyChange('color', e.target.value, 'backgroundOptions')}
                        />

                        {/* === Corners Square Options === */}
                        <ERPInput
                          id="cornersSquareColor"
                          label="Corner Square Color"
                          type="color"
                          value={selectedComponent.qrCodeProps?.cornersSquareOptions?.color || "#000000"}
                          onChange={(e) => handleQRCodePropertyChange('color', e.target.value, 'cornersSquareOptions')}
                        />
                        <ERPDataCombobox
                          id="cornersSquareType"
                          label="Corner Square Type"
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
                          label="Corner Dot Color"
                          type="color"
                          value={selectedComponent.qrCodeProps?.cornersDotOptions?.color || "#000000"}
                          onChange={(e) => handleQRCodePropertyChange('color', e.target.value, 'cornersDotOptions')}
                        />
                        <ERPDataCombobox
                          id="cornersDotType"
                          label="Corner Dot Type"
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
                          label="Image URL"
                          value={selectedComponent.qrCodeProps?.image || ""}
                          onChange={(e) => handleQRCodePropertyChange('image', e.target.value)}
                        />
                        {selectedComponent.qrCodeProps?.image && (
                          <>
                            <ERPSlider
                              label={`Image Size (${selectedComponent.qrCodeProps?.imageOptions?.imageSize || 0.2})`}
                              min={0.05}
                              max={1}
                              step={0.05}
                              value={selectedComponent.qrCodeProps?.imageOptions?.imageSize || 0.2}
                              onChange={(e) => handleQRCodePropertyChange('imageSize', e.target.valueAsNumber, 'imageOptions')}
                            />
                            <ERPCheckbox
                              id="hideBackgroundDots"
                              label="Hide Background Dots under Image"
                              checked={selectedComponent.qrCodeProps?.imageOptions?.hideBackgroundDots || false}
                              onChange={(e) => handleQRCodePropertyChange('hideBackgroundDots', e.target.checked, 'imageOptions')}
                            />
                          </>
                        )}


                      </Box>
                    )}

                  {selectedComponent.type === DesignerElementType.line ? (
                    <Box
                      sx={{ mb: 1 }}
                      className="flex justify-start gap-2 items-center"
                    >
                      <Box className="basis-2/3">
                        <ERPSlider
                          label="Line Width"
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
                      <Box
                        sx={{ mb: 1 }}
                        className="flex justify-start gap-2 items-center"
                      >
                        <Box className="basis-2/3">
                          <ERPSlider
                            label="Width"
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
                      <Box
                        sx={{ mb: 1 }}
                        className="flex justify-start gap-2 items-center"
                      >
                        <Box className="basis-2/3">
                          <ERPSlider
                            label="Line Thickness"
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
                          label="lineType"
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
                          label="Line Color"
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
                      <Box
                        sx={{ mb: 1 }}
                        className="flex justify-start gap-2 items-center"
                      >
                        <Box className="basis-2/3">
                          <ERPSlider
                            label="Height"
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
                              label="Font"
                              field={{
                                id: "font",
                                valueKey: "value",
                                labelKey: "label",
                              }}
                              options={[
                                { value: "Roboto", label: "Roboto" },
                                { value: "RobotoMono", label: "RobotoMono" },
                                { value: "FiraSans", label: "FiraSans" },
                                { value: "Poppins", label: "Poppins"},
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
                              label="arabicFont"
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
                          <Box
                            sx={{ mb: 1 }}
                            className="flex justify-start gap-2 items-center"
                          >
                            <Box className="basis-2/3">
                              <ERPSlider
                                label="Font Weight"
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

                          <Box
                            sx={{ mb: 1 }}
                            className="flex justify-start gap-2 items-center"
                          >
                            <Box className="basis-2/3">
                              <ERPSlider
                                label="Font Size"
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
                              Text Align
                            </InputLabel>

                            <div className="flex justify-between space-x-2">
                              <button
                                className={`ti-btn ${selectedComponent.textAlign === "left"
                                    ? "ti-btn-primary-full"
                                    : "bg-slate-100 hover:bg-slate-200 text-black"
                                  } px-4 py-2 w-full`}
                                onClick={() =>
                                  handlePropertyChange("textAlign", "left")
                                }
                              >
                                Left
                              </button>
                              <button
                                className={`ti-btn ${selectedComponent.textAlign === "center"
                                    ? "ti-btn-primary-full"
                                    : "bg-slate-100 hover:bg-slate-200 text-black"
                                  } px-4 py-2 w-full`}
                                onClick={() =>
                                  handlePropertyChange("textAlign", "center")
                                }
                              >
                                Center
                              </button>
                              <button
                                className={`ti-btn ${selectedComponent.textAlign === "right"
                                    ? "ti-btn-primary-full"
                                    : "bg-slate-100 hover:bg-slate-200 text-black"
                                  } px-4 py-2 w-full`}
                                onClick={() =>
                                  handlePropertyChange("textAlign", "right")
                                }
                              >
                                Right
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
                              Font Style
                            </InputLabel>
                            <div className="flex justify-between space-x-2">
                              {/* <button
                                   className={`ti-btn ${
                                     selectedComponent.fontStyle === "bold"
                                       ? "ti-btn-primary-full"
                                       : "bg-slate-100 hover:bg-slate-200 text-black"
                                   } px-4 py-2 w-full`}
                                   onClick={() =>
                                     handlePropertyChange("fontStyle", "bold")
                                   }
                                 >
                                   Bold
                                 </button> */}
                              <button
                                className={`ti-btn ${selectedComponent.fontStyle === "normal"
                                    ? "ti-btn-primary-full"
                                    : "bg-slate-100 hover:bg-slate-200 text-black"
                                  } px-4 py-2 w-full`}
                                onClick={() =>
                                  handlePropertyChange("fontStyle", "normal")
                                }
                              >
                                Normal
                              </button>
                              <button
                                className={`ti-btn ${selectedComponent.fontStyle === "italic"
                                    ? "ti-btn-primary-full"
                                    : "bg-slate-100 hover:bg-slate-200 text-black"
                                  } px-4 py-2 w-full`}
                                onClick={() =>
                                  handlePropertyChange("fontStyle", "italic")
                                }
                              >
                                Italic
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
                            label="Field"
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
                            label="Barcode Format"
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
                            label="Bar Width"
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
                            label="Margin"
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
                            label="Background Color"
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
                            label="Line Color"
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
                            label="Show Text"
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
                            Text Align
                          </InputLabel>

                          <div className="flex justify-between space-x-2">
                            <button
                              className={`ti-btn ${selectedComponent.barcodeProps.textAlign ===
                                  "left"
                                  ? "ti-btn-primary-full"
                                  : "bg-slate-100 hover:bg-slate-200 text-black"
                                } px-4 py-2 w-full`}
                              onClick={() =>
                                handleBarcodePropertyChange("textAlign", "left")
                              }
                            >
                              Left
                            </button>
                            <button
                              className={`ti-btn ${selectedComponent.barcodeProps.textAlign ===
                                  "center"
                                  ? "ti-btn-primary-full"
                                  : "bg-slate-100 hover:bg-slate-200 text-black"
                                } px-4 py-2 w-full`}
                              onClick={() =>
                                handleBarcodePropertyChange(
                                  "textAlign",
                                  "center"
                                )
                              }
                            >
                              Center
                            </button>
                            <button
                              className={`ti-btn ${selectedComponent.barcodeProps.textAlign ===
                                  "right"
                                  ? "ti-btn-primary-full"
                                  : "bg-slate-100 hover:bg-slate-200 text-black"
                                } px-4 py-2 w-full`}
                              onClick={() =>
                                handleBarcodePropertyChange(
                                  "textAlign",
                                  "right"
                                )
                              }
                            >
                              Right
                            </button>
                          </div>
                        </Box>

                        <Box>
                          <ERPDataCombobox
                            id="font"
                            data={selectedComponent.barcodeProps}
                            label="Font"
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
                            Font Style
                          </InputLabel>
                          <div className="flex justify-between space-x-1">
                            <button
                              className={`ti-btn ${selectedComponent.barcodeProps.fontStyle ===
                                  "bold"
                                  ? "ti-btn-primary-full"
                                  : "bg-slate-100 hover:bg-slate-200 text-black"
                                } px-4 py-2 w-full`}
                              onClick={() =>
                                handleBarcodePropertyChange("fontStyle", "bold")
                              }
                            >
                              Bold
                            </button>
                            <button
                              className={`ti-btn ${selectedComponent.barcodeProps.fontStyle ===
                                  "normal"
                                  ? "ti-btn-primary-full"
                                  : "bg-slate-100 hover:bg-slate-200 text-black"
                                } px-4 py-2 w-full`}
                              onClick={() =>
                                handleBarcodePropertyChange(
                                  "fontStyle",
                                  "normal"
                                )
                              }
                            >
                              Normal
                            </button>
                            <button
                              className={`ti-btn ${selectedComponent.barcodeProps.fontStyle ===
                                  "italic"
                                  ? "ti-btn-primary-full"
                                  : "bg-slate-100 hover:bg-slate-200 text-black"
                                } px-4 py-2 w-full`}
                              onClick={() =>
                                handleBarcodePropertyChange(
                                  "fontStyle",
                                  "italic"
                                )
                              }
                            >
                              Italic
                            </button>
                          </div>
                        </Box>

                        <Box>
                          <ERPSlider
                            label="Font Size"
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
                            label="Text Margin"
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
            </Box>

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
                    label="Columns Per Row"
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
                    label="Row Per Page"
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
                    label="Label Width"
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
                    label="Label  Height"
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
                    <div className="text-xs">Background Image</div>
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
                      label="Image"
                      placeholder=" "
                    />
                    <label htmlFor="background_image">
                      <div
                        onClick={() => inputFile?.current?.click()}
                        className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData?.barcodeState?.labelState
                            ?.background_image
                            ? "hidden"
                            : ""
                          }`}
                      >
                        Choose from Desktop
                      </div>
                    </label>

                    {templateData?.barcodeState?.labelState
                      ?.background_image && (
                        <>
                          <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">
                            Click Save to apply the selected background image
                          </div>
                          {templateData?.barcodeState?.labelState
                            ?.background_image && (
                              <img
                                draggable={false}
                                src={
                                  templateData?.barcodeState?.labelState
                                    ?.background_image
                                }
                                alt="background_image"
                                height={100}
                                width={100}
                                className="size-5"
                              />
                            )}
                          <div
                            className="text-accent text-xs cursor-pointer  max-w-min"
                            onClick={handleRemoveBgImage}
                          >
                            Remove
                          </div>
                          <div className="font-light text-sm">Image Fit</div>
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
                          <div className="font-light text-sm">Image Position</div>
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
                    label="Template Name"
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
                    Padding (pt)
                  </InputLabel>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={2}
                  >
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
                    Gap (pt)
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
                    label="Language Prefer"
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
                                  {t("Enable Printer Selection")}
                                </Typography>
                                {templateData?.propertiesState?.select_printer && (
                                  <Chip label={t("Active")} size="small" color="primary" variant="outlined" />
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
                            {t("Allow users to select a specific printer for this template. Requires JSPrintManager installation.")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Printer Selection Component */}
                    {templateData?.propertiesState?.select_printer && (
                      <Box
                        sx={{
                          pl: 2,
                          borderLeft: "3px solid",
                          borderColor: "primary.main",
                          bgcolor: "background.default",
                          borderRadius: "0 4px 4px 0",
                        }}
                      >
                        <AccessPrinterList templateData={templateData} handlePagePropsChange={handlePagePropsChange} />
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Box>


            </Box>
            {forCustomRows &&
              <Box
                hidden={activeTab !== "designer"}
              >
                <Box sx={{ mb: 1 }}>
                  <ERPCheckbox
                    id="isFirstOnly"
                    label=  {isHeader =="headerState" ?t("show_in_first_page"):t("show_in_last_page")}
                    checked={designerData?.isFirstOnly ?? true}
                    onChange={(e) =>
                      handleDesignerChange("isFirstOnly", e.target.checked)
                    }
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <div className="flex flex-col gap-3">
                    <div className="text-xs">Background Image</div>
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
                      label="Image"
                      placeholder=" "
                    />
                    <label htmlFor="background_image">
                      <div
                        onClick={() => inputFile?.current?.click()}
                        className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${designerData?.background_image
                            ? "hidden"
                            : ""
                          }`}
                      >
                        Choose from Desktop
                      </div>
                    </label>

                    {designerData?.background_image && (
                      <>
                        <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">
                          Click Save to apply the selected background image
                        </div>
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
                        <div
                          className="text-accent text-xs cursor-pointer  max-w-min"
                          onClick={handleRemoveDesignerImg}
                        >
                          Remove
                        </div>
                        <div className="font-light text-sm">Image Fit</div>
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
                        <div className="font-light text-sm">Image Position</div>
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