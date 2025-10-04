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
// Import the images

import usFlag from "../../assets/images/flags/us_flag.png"; //it use demo  remove when no need

import JsBarcode from "jsbarcode";
// import { ReactBarcode, Renderer } from 'react-jsbarcode';
import html2canvas from "html2canvas";
import save_svg from "../../assets/svg/save.svg";
import ERPModal from "../../components/ERPComponents/erp-modal";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Button,
  Popover,
  Hidden,
  Stack,
  Chip,
} from "@mui/material";
import jsPDF from "jspdf";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import ERPSlider from "../../components/ERPComponents/erp-slider";
import ERPToast from "../../components/ERPComponents/erp-toast";
import { TemplateReducerState } from "../../redux/reducers/TemplateReducer";
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
  CustomElementType,
  DesignerElementType,
  HistoryComponent,
  initialBacodeTemplateState,
  // initialTemplateState,
  LabelState,
  PlacedComponent,
  PropertiesState,
  QRCodeProps,
  tableColumns,
  TemplateDto,
  TemplateState,
} from "../InvoiceDesigner/Designer/interfaces";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { getDetailAction } from "../../redux/slices/app-thunks";
import { RootState } from "../../redux/store";
import { useAppState } from "../../utilities/hooks/useAppState";
import ERPPreviousUrlButton from "../../components/ERPComponents/erp-previous-uirl-button";
import {setTemplateCustomElements,} from "../../redux/slices/templates/reducer";
import { convertFileToBase64 } from "../../utilities/file-utils";
// import { TemplateGroupTypes } from "../InvoiceDesigner/constants/TemplateCategories";
import { EditButton } from "./edit-button";
import { useTranslation } from "react-i18next";
import VoucherType, {purchaseVoucherTypes, salesVoucherTypes, accountsVoucherTypes} from "../../enums/voucher-types";
import {  accountsFields, inventoryFields, barCodeField } from "./fields";
import { customJsonParse, parseTemplateContent } from "../../utilities/jsonConverter";
import { getPageDimensions } from "../InvoiceDesigner/utils/pdf-util";
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
import DesignerRenderer from "./DesignerRenderer";

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
}
 export const DeleteButton: React.FC<DeleteButtonProps> = ({
  id,
  isSelected,
  handleDelete,
}) =>
  isSelected ? (
    <button
      // className="absolute -top-3 -right-3 w-6 h-6 bg-[#ffffff]  rounded-full flex items-center justify-center hover:bg-[#e7c3c1] focus:outline-none text-[#f1180e] text-lg text-center"
      className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full 
                 flex items-center justify-center 
                 hover:bg-[#ebb0ad] focus:outline-none focus:ring-2 focus:ring-[#e0655e] focus:ring-opacity-75
                 transition-colors duration-200 ease-in-out
                 text-[#da514a] hover:text-[#ec5149]"
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(id);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      aria-label="Delete"
    >
      {/* × */}
      <X size={16} />
    </button>
  ) : null;
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

const printers = [
  "Default Printer",
  "HP LaserJet",
  "Epson TM-T88V",
  "Zebra ZD420",
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
  {label: "Center", value: "center center",},                   
  { label: "Center Right", value: "center right" },
  { label: "Bottom Left", value: "bottom left" },
  { label: "Bottom Center", value: "bottom center",},
  { label: "Bottom Right", value: "bottom right" },
]

const imgContent = [{ label: "img1", value: usFlag }];

const api = new APIClient();
interface PDFBarcodeDesignerProps {
  forCustomRows?: boolean;
  template?: TemplateState<{}>;
  customTemplate?: any;
  onSuccess?: () => void;
}
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

// Utility: convert points (pt) to device pixels for <canvas>
function ptToPx(pt: number) {
  return pt * (96 / 72); // 1pt = 1.3333px at 96 dpi
}
const PDFBarcodeDesigner: React.FC<PDFBarcodeDesignerProps> = ({
  forCustomRows = false,
  template,
  customTemplate,
  onSuccess,
}) => {
  const [zoom, setZoom] = useState(100);
  const [searchParams] = useSearchParams();
  const templateGroup = searchParams?.get("template_group")! as
    | VoucherType
    | string;
  const [selectedComponent, setSelectedComponent] =
    useState<PlacedComponent | null>(null);
  const [loading, setLoading] = useState(false);
  const [draggingComponent, setDraggingComponent] =
    useState<PlacedComponent | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const barcodeRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const [activeTab, setActiveTab] = useState(forCustomRows?"element":"page");

  const appState = useAppState();
  useState<PurchaseItem | null>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const inputImgFile = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const [templateData, setTemplateData] = useState<TemplateState<unknown>>(
    initialBacodeTemplateState<unknown>().data || {}
  );

  const [designerData,setDesignerData] = useState({
                                                        background_image: "",
                                                        bg_image_position:"",
                                                        background_color: "",
                                                         bg_image_objectFit:""
                                                    })

  const pxToPoint = (px: number) => px * (72 / 96);
  const { t } = useTranslation("labelDesigner");
  const pageSize = template?.propertiesState?.pageSize ?? "A4";
    const qrCodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Get the actual page dimensions based on the selected page size
  const selectedPageSize = getPageDimensions(
    pageSize,
    template?.propertiesState?.width,
    template?.propertiesState?.height
  );
  

  const handleContentLabelResize = (
    e: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } }
  ) => {
    const newWidthPt = (size.width); // Convert pixels to points
    const newHeightPt = (size.height);
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



  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };


  let paperWidth, paperHeight;
  const paperSize = templateData?.propertiesState?.pageSize || "A4";

  switch (paperSize) {
    case "A5":
      paperWidth = "420pt"; // 5.83in x 8.27in
      paperHeight = "595pt";
      break;
    case "A4":
      paperWidth = "589pt"; // 8.27in x 11.69in
      paperHeight = "842pt";
      break;
    case "LETTER":
      paperWidth = "612pt"; // 8.5in x 11in
      paperHeight = "792pt";
      break;
    case "3Inch":
      paperWidth = "216pt"; // 3in x 6in
      paperHeight = "432pt";
      break;
    case "4Inch":
      paperWidth = "288pt"; // 4in x 8in
      paperHeight = "576pt";
      break;
  }

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

  const handleDragStart = (
    e: React.DragEvent,
    componentType: DesignerElementType
  ) => {
    e.dataTransfer.setData("componentType", componentType.toString());
    // Clear any existing selection when starting to drag a new element
    setSelectedComponent(null);
  };

  const handleDropIntoContainer = (e: React.DragEvent<HTMLDivElement>, container: PlacedComponent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const componentType = parseInt(
      e.dataTransfer.getData("componentType")
    ) as DesignerElementType;
     
    // Clear selection before adding new component
    setSelectedComponent(null);
    
    const containerRect = e.currentTarget.getBoundingClientRect();
    const containerElement = e.currentTarget;
    const computedStyle = window.getComputedStyle(containerElement);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    
    if (containerRect) {
      // Account for container padding when calculating drop position
      const x = (e.clientX - containerRect.left - paddingLeft);
      const y = (e.clientY - containerRect.top - paddingTop);
      
      const component = components.find((c) => c.id === componentType);
      if (component) {
        // Adjust position for container padding and container's absolute position
        const containerPadding = container.containerProps?.padding || 10;
        const adjustedX = Math.max(0, x - containerPadding);
        const adjustedY = Math.max(0, y - containerPadding);
        
        const newComponent: PlacedComponent = {
          id:  generateUniqueKey(),
          type: componentType,
          content: component.defaultContent || component.label,
          x: adjustedX, // Store relative position to container
          y: adjustedY, // Store relative position to container
          rotate: 0,
          containerId: container.id,
          textAlign: "center",
          fontSize: 12,
          font: "Roboto",
          fontStyle: "normal",
          width: 100,
          height: 30,
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
        
        // Only add to the main components list with containerId set
        // Don't add to container's children array - we'll filter by containerId when rendering
        const updatedComponents = [
          ...(templateData?.barcodeState?.placedComponents || []),
          newComponent
        ];
        
        // Update state directly for immediate visibility
        setTemplateData((prev: TemplateState<unknown>) => ({
          ...prev,
          barcodeState: {
            ...prev.barcodeState,
            placedComponents: updatedComponents,
          },
        }));
        
        
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          setSelectedComponent(newComponent);
        }, 0);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = parseInt(
      e.dataTransfer.getData("componentType")
    ) as DesignerElementType;

    const canvasRect = canvasRef.current?.getBoundingClientRect();

    if (canvasRect) {
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      
      // Clear selection before adding new component
      setSelectedComponent(null);
      
      // Check if dropping into a container
      const placedComponents = templateData?.barcodeState?.placedComponents || [];
      let targetContainer: PlacedComponent | null = null;
      
      for (const comp of placedComponents) {
        if (comp.type === DesignerElementType.container) {
          // Check if drop position is within container bounds
          if (
            x >= comp.x &&
            x <= comp.x + comp.width &&
            y >= comp.y &&
            y <= comp.y + comp.height
          ) {
            targetContainer = comp;
            break;
          }
        }
      }

      const component = components.find((c) => c.id === componentType);
      if (component) {
        const newComponent: PlacedComponent = {
          id:  generateUniqueKey(),
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
          lineWidth: 150 ,
          width:150,
          height: componentType === DesignerElementType.barcode ? 80 : (componentType === DesignerElementType.line ? 10 : 30),
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
          newComponent.children = []; // Initialize empty children array
          newComponent.containerProps = {
            backgroundColor: "#fafafa", // Very light gray background
            borderColor: "#d0d0d0",
            borderWidth: 1,
            borderStyle: "dashed",
            padding: 0,
            autoResize: false,
            minHeight: 100,
            maxHeight: 500,
          };
        }

        // If dropping into a container, add as child and adjust position
        if (targetContainer && componentType !== DesignerElementType.container) {
          newComponent.containerId = targetContainer.id;
          // Convert absolute position to relative position within container
          const containerPadding = targetContainer.containerProps?.padding || 10;
          newComponent.x = x - targetContainer.x - containerPadding;
          newComponent.y = y - targetContainer.y - containerPadding;
          
          // Ensure the element stays within container bounds
          newComponent.x = Math.max(0, newComponent.x);
          newComponent.y = Math.max(0, newComponent.y);
        }

        // Just add to the main components list
        // The containerId property is enough to determine parent-child relationships
        const placedComponents = [
          ...(templateData?.barcodeState?.placedComponents || []),
          newComponent,
        ];
        
        setTemplateData((prev: TemplateState<unknown>) => ({
          ...prev,
          barcodeState: {
            ...prev.barcodeState,
            placedComponents: placedComponents,
          },
        }));
        // Select the new component after state updates
        setTimeout(() => {
          console.log(templateData.barcodeState?.placedComponents);
          console.log(newComponent);
          setSelectedComponent(newComponent);
        }, 0);
      }
    }
  };

  const handleComponentClick = (e: React.MouseEvent, component: PlacedComponent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation(); // Stop all event propagation
    
    // Clear any existing dragging state when clicking
    setDraggingComponent(null);
    setDragOffset({ x: 0, y: 0 });
    
    // Don't trigger any state changes if clicking the already selected component
    if (selectedComponent?.id === component.id) {
      return;
    }
    
    // Get the full component data from the main list to ensure we have the latest data
    const fullComponent = templateData?.barcodeState?.placedComponents?.find(
      c => c.id === component.id
    );
    
    if (fullComponent) {
      // Ensure containers have proper containerProps
      let componentToSelect = {
        ...fullComponent,
        x: fullComponent.x,
        y: fullComponent.y,
        containerId: fullComponent.containerId,
      };
      
      // Add default containerProps if missing for containers
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
        };
      }
      
      // Always clear selection first to prevent multiple selection bug
      setSelectedComponent(null);
      // Force DOM update before setting new selection
      requestAnimationFrame(() => {
        setSelectedComponent(componentToSelect);
        setActiveTab("element");
      });
    } else {
      // Always clear selection first
      setSelectedComponent(null);
      requestAnimationFrame(() => {
        setSelectedComponent(component);
        setActiveTab("element");
      });
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
    // make a shallow copy
    const updatedQRCodeProps: QRCodeProps = {
      ...selectedComponent.qrCodeProps,
    };

    if (nestedPath) {
      // dynamic nested merge
      // 1) grab existing sub-object (or {})
      const existingSub = (updatedQRCodeProps[nestedPath] as any) || {};
      // 2) merge in the new property
      const newSub = {
        ...existingSub,
        [property]: value,
      };
      // 3) assign it back (cast to any to satisfy TS)
      (updatedQRCodeProps as any)[nestedPath] = newSub;
    } else {
      // top-level assignment (keyof QRCodeProps)
      (updatedQRCodeProps as any)[property] = value;
    }

    // now update your template and selected state
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



  const handleMouseDown = (e: React.MouseEvent, component: PlacedComponent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow dragging if this specific component is clicked, not if it's a child element
    if (e.target !== e.currentTarget) {
      return;
    }
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      // Find the complete component data from the main list
      const fullComponent = templateData?.barcodeState?.placedComponents?.find(
        c => c.id === component.id
      );
      
      if (!fullComponent) {
        console.error('Component not found in main list:', component.id);
        return;
      }
      
      // Clear any existing dragging state to prevent multiple elements being dragged
      setDraggingComponent(null);
      
      // Force update to clear any stale state
      setTimeout(() => {
        // Set only this component as the dragging component
        setDraggingComponent(fullComponent);
        
        // Select only this component when starting to drag
        setSelectedComponent(fullComponent);
      }, 0);
      
      // Calculate offset based on whether component is in a container
      let actualX = fullComponent.x;
      let actualY = fullComponent.y;
      
      if (fullComponent.containerId) {
        const parentContainer = templateData?.barcodeState?.placedComponents?.find(
          c => c.id === fullComponent.containerId
        );
        if (parentContainer) {
          const containerPadding = parentContainer.containerProps?.padding || 10;
          // Child positions are relative to container, so calculate absolute position for dragging
          actualX = parentContainer.x + fullComponent.x + containerPadding;
          actualY = parentContainer.y + fullComponent.y + containerPadding;
        }
      }
      
      const offsetX = (e.clientX - canvasRect.left) - actualX;
      const offsetY = (e.clientY - canvasRect.top) - actualY;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };


  const handleSave = async (dataUrl?: string) => {
    setLoading(true);
     debugger;
    try {
           // Consolidate container children before saving
      const consolidatedComponents = consolidateContainerChildren();
      debugger;
      if (forCustomRows) {
        dispatch(
          setTemplateCustomElements({
            payload: {
              elements: consolidatedComponents,
              height: templateData.barcodeState?.labelState?.labelHeight,
              thumbImage:dataUrl??"",
              background_image: designerData?.background_image,
              bg_image_position:designerData?.bg_image_position,
              background_color: designerData?.background_color,
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
        id: id == "new" ? 0 : id, //temparary fix
        templateType: templateToSave.propertiesState.template_type ?? "standard",
        templateKind: templateToSave.propertiesState.template_kind ?? "standard",
        templateGroup: templateToSave.propertiesState.template_group ?? "",
        templateName: templateToSave.propertiesState?.templateName ?? "",
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

  // Get the ResizableBox parent to understand the actual design bounds
    const resizableBox = node.closest(".react-resizable")
    const targetElement = resizableBox || node
 // Save original styles
    const originalStyles = {
      transform: node.style.transform,
      overflow: node.style.overflow,
      border: node.style.border,
    }

     // Temporarily optimize for screenshot
    node.style.transform = "scale(1)" // Remove any zoom scaling
    node.style.overflow = "visible"
    node.style.border = "none" // Remove dashed border for clean capture

    // Wait for any pending renders
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Get the actual content bounds (excluding any padding/margins from parent)
    const rect = node.getBoundingClientRect()
  const canvas = await html2canvas(node, {
      backgroundColor:"#ffffff",
      scale:  3, // Higher resolution for crisp output
      useCORS: true,
      allowTaint: true,
      x: 0,
      y: 0,
      width: rect.width,
      height: rect.height,
      scrollX: 0,
      scrollY: 0,
      // Capture only the visible content area
      windowWidth: rect.width,
      windowHeight: rect.height,
    })

    // Restore original styles
    Object.assign(node.style, originalStyles)

    // Convert to high-quality data URL
    const dataUrl = canvas.toDataURL("image/png", 1.0)

    // If saving for custom rows, just save
    if (forCustomRows) {
      await handleSave(dataUrl);
      return true;
    }

    // Validate template name
    if (!templateData?.propertiesState?.templateName) {
      ERPToast.show("Template name is required", "error");
      return false;
    }

    // Normal save
    await handleSave(dataUrl);
    return true;
  } catch (error) {
    console.error("Error saving template:", error);
    ERPToast.show("Failed to save template", "error");
    return false;
  }
  };

  const handlePagePropsChange = async(
    property: keyof PropertiesState,
    value: any,
  ) => {
    setTemplateData((prev: TemplateState<unknown>) => ({
      ...prev,
      propertiesState: { ...prev.propertiesState, [property]: value },
    }));
  };

  const handleImagePropsChange = async (property: any, value: any) => {
    if (!value) {
      forCustomRows? handlePropertyChange(property,""): handleLabelPropsChange(property, null);
      return;
    }
    const imageData = await convertFileToBase64(value);
     forCustomRows? handlePropertyChange(property,imageData ?? ''):
    handleLabelPropsChange(property, imageData ?? null);
  };

  const handleDesignerChange =  async (property: any, value: any,isImg:boolean=false) => {
      let data = value
      if(isImg){
        data = await convertFileToBase64(value);
      }
       setDesignerData((prev) => ({
      ...prev,
      [property]: data ,
    }));

  }

  const handleRemoveDesignerImg =()=>{
    handleDesignerChange("background_image","")
       if (inputFile.current) {
      inputFile.current.value = "";
    }
  }
  const handleRemoveBgImage = () => {
    handleImagePropsChange("background_image", "");
    if (inputFile.current) {
      inputFile.current.value = "";
    }
  };
const handleRemoveImage =()=>{
  handleImagePropsChange("content","")
    if (inputImgFile.current) {
      inputImgFile.current.value = "";
    }
}
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

  type PaddingMarginSides = "top" | "right" | "bottom" | "left";
  type GapSides = "hgap" | "vgap";
  const [barcodeErrors, setBarcodeErrors] = useState<any>([]);

   const generateBarcode = useCallback((component: PlacedComponent) => {
    if (
      component.type === DesignerElementType.barcode &&
      component.barcodeProps
    ) {
      // const canvasElement = barcodeRefs.current?.find(x => x.key == component.id)?.element;
      const canvasElement = barcodeRefs.current[component.id];
      if (canvasElement) {
       
          const widthPx =ptToPx(component.width);  
          const heightPx = ptToPx(component.height ); 
          const scale = window.devicePixelRatio || 1;
          // Set CSS dimensions in points for consistent display

        canvasElement.height = heightPx * scale;
        canvasElement.width = widthPx * scale;
        canvasElement.style.width = `${component.width}pt`;
        canvasElement.style.height = `${component.height}pt`;
       
         const ctx = canvasElement.getContext('2d');
         if (!ctx) return;
          ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transforms
         ctx.scale(scale, scale);
   
        try {
          JsBarcode(canvasElement, component.content, {
            ...component.barcodeProps,
            width: component.barcodeProps.barWidth??1,
            height: (heightPx),
            margin:component.barcodeProps?.margin,
       
            textAlign:component.barcodeProps?.textAlign??1,
            textMargin: component.barcodeProps.textMargin,
            textPosition: "bottom",
            background: component.barcodeProps?.background || "#ffffff",
            lineColor: component.barcodeProps?.lineColor || "#000000",
            fontSize:component.barcodeProps?.fontSize,
            font:component.barcodeProps.font || "Roboto",
            displayValue: component.barcodeProps.showText,
            valid: (valid: boolean) => {
              if (!valid) {
                throw new Error("Invalid barcode");
              }
            },
          });

          // Clear any previous error for this component
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

          // Add error to barcodeErrors
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
    }, []);

  const appDispatch = useAppDispatch();

  const getPDFTemplateData = async () => {
    const res = await api.getAsync(`${Urls.templates}${id}`);
    let cc: TemplateState<unknown> = parseTemplateContent(res.content);
    const _template = {
      ...cc,
      id: res.id,
      branchId: res.branchId,
      isCurrent: res.isCurrent,
      background_image: res?.payload?.data?.background_image as
        | string
        | undefined,
      background_image_header: res?.payload?.data?.background_image_header as
        | string
        | undefined,
      background_image_footer: res?.payload?.data?.background_image_footer as
        | string
        | undefined,
      templateGroup: res.templateGroup,
      templateKind: res.templateKind,
      templateName: res.templateName,
      templateType: res.templateType,
      thumbImage: res.thumbImage as string | undefined,
    };
    
    // Clear any existing selection before loading new data
    setSelectedComponent(null);
    setTemplateData(cc);
  };



  useEffect(() => {
    if (id !== "new" && !forCustomRows) getPDFTemplateData();
  }, []);

  useEffect(() => {
    debugger;
    if (forCustomRows && template) {
      const fields = customTemplate?.split("."); // e.g., ["headerState", "customTop"]
      let nestedValue: any = template; // Start from template, not prev
      for (let i = 0; i < fields?.length; i++) {
        nestedValue = nestedValue?.[fields[i]];
      }
     const loadedElements = nestedValue?.elements || [];
    const expandedComponents = expandContainerChildren(loadedElements);
      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev, // Preserve existing templateData
        barcodeState: {
          ...prev.barcodeState,
          placedComponents:  expandedComponents || [],
          labelState: {
            ...prev.barcodeState?.labelState, // Preserve labelState
            labelHeight: nestedValue?.height || 200,
            labelWidth: selectedPageSize?.width,
          },
        },
      }));

      setDesignerData((prev) => ({
        ...prev, // Preserve existing templateData  
        background_image: nestedValue?.background_image ||"",
        bg_image_position:nestedValue?.bg_image_position ||"",
        background_color: nestedValue?.background_color ||"",
        bg_image_objectFit:nestedValue?.bg_image_objectFit ||"",
      }));
    }
  }, []);

  // Store dragging state in a ref to avoid stale closures
  const draggingRef = useRef<PlacedComponent | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  
  // Update refs when state changes
  useEffect(() => {
    draggingRef.current = draggingComponent;
  }, [draggingComponent]);
  
  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);
  
  // Global event listeners for drag and drop
  useEffect(() => {
    let animationFrameId: number | null = null;
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggingRef.current && canvasRef.current) {
        e.preventDefault();
        e.stopPropagation();
        
        // Cancel any pending animation frame
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        
        // Use requestAnimationFrame for better performance
        animationFrameId = requestAnimationFrame(() => {
          if (!draggingRef.current || !canvasRef.current) return;
          
          const canvasRect = canvasRef.current.getBoundingClientRect();
          let newX = (e.clientX - canvasRect.left) - dragOffsetRef.current.x;
          let newY = (e.clientY - canvasRect.top) - dragOffsetRef.current.y;

          // Get current components from state
          setTemplateData((prev: TemplateState<unknown>) => {
            const components = prev?.barcodeState?.placedComponents || [];
            
            // If dragging element is inside a container, calculate position relative to container
            if (draggingRef.current?.containerId) {
              const parentContainer = components.find(
                c => c.id === draggingRef.current!.containerId
              );
              if (parentContainer) {
                // Position relative to container (accounting for padding)
                const containerPadding = parentContainer.containerProps?.padding || 10;
                newX = newX - parentContainer.x - containerPadding;
                newY = newY - parentContainer.y - containerPadding;
                
                // Keep element within container bounds
                const maxX = parentContainer.width - (containerPadding * 2) - draggingRef.current!.width;
                const maxY = parentContainer.height - (containerPadding * 2) - draggingRef.current!.height;
                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));
              }
            }

            // Update only the dragged component
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
          
          // Update selected component separately
          setSelectedComponent((prevSelected) => {
            if (prevSelected?.id === draggingRef.current!.id) {
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
        
        // Clear dragging state
        setDraggingComponent(null);
        setDragOffset({ x: 0, y: 0 });
        draggingRef.current = null;
        dragOffsetRef.current = { x: 0, y: 0 };
      }
    };

    // Add global event listeners
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []); // No dependencies needed since we use refs


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
          placedComponents: updatedComponents || [], // Use an empty array if undefined
        },
      }));
      setSelectedComponent(updatedComponent);
      generateBarcode(updatedComponent);
    }
  };

  const handleContainerPropertyChange = (
    property: string,
    value: any
  ) => {
    if (selectedComponent && selectedComponent.type === DesignerElementType.container) {
      // Use the same pattern as handlePropertyChange - only update local state
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

  useEffect(() => {
    templateData?.barcodeState?.placedComponents?.forEach(generateBarcode);
  }, [templateData?.barcodeState?.placedComponents, barcodeErrors]);

  const handleDelete = (componentId: string) => {
    setTemplateData((prev: TemplateState<unknown>) => {
      const componentToDelete = prev.barcodeState?.placedComponents?.find(
        comp => comp.id === componentId
      );
      
      let updatedComponents = prev.barcodeState?.placedComponents || [];
      
      // If deleting a container, also remove all its children
      if (componentToDelete?.type === DesignerElementType.container) {
        // Remove all children that belong to this container
        updatedComponents = updatedComponents.filter(
          comp => comp.containerId !== componentId && comp.id !== componentId
        );
      } else {
        // If deleting a regular component, just remove it
        updatedComponents = updatedComponents.filter(
          comp => comp.id !== componentId
        );
      }
      
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

  const renderComponent = (component: PlacedComponent, isChild: boolean = false) => {
    const isSelected = selectedComponent?.id === component.id;
    
    const  style: React.CSSProperties = {
      position: "absolute",
      left: `${component.x}pt`,
      top: `${component.y}pt`,
      padding: "0pt",
      boxSizing: "border-box", 
      zIndex: isChild ? 10 : 1,
      alignContent: "center",
      width:`${component.width}pt`,
      height:
        component.type == DesignerElementType.barcode
          ? `auto`
          : `${component.height}pt`,
      // border:
      //   selectedComponent?.id === component.id
      //     ? "2px solid #2196f3"
      //     : component.type == DesignerElementType.barcode
      //     ? ""
      //     : "1px dashed #ccc",
      border: isSelected ? "2px solid #2196f3" :  component.type == DesignerElementType.barcode? "" :"none",
      cursor: "move",
      backgroundColor:isSelected?"#f6f6f7ff" : "inherit",
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
            barcodeErrors?.find((x: any) => x.id == component.id)? (
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
                  style={{overflow:"hidden",zIndex: 2, pointerEvents: 'none'}}
                />
              </>
            ) : (
              <canvas
               ref={(el) => (barcodeRefs.current[component.id] = el)}
                width={component.width}
                height={component.height}
                style={{overflow:"hidden",zIndex: 2, pointerEvents: 'none'}}
              />
            )}
            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            ></DeleteButton>
          </div>
        );
      case DesignerElementType.text:
      case DesignerElementType.field:
        return (
          <ResizableBox
            key={component.id}
            width={component.width}
            height={component.height}
            minConstraints={[20, 20]}
            maxConstraints={[800, 600]}
            resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
            onResize={(e, { size }) => {
              const updatedComponents = templateData?.barcodeState?.placedComponents?.map((comp) => {
                if (comp.id === component.id) {
                  return {
                    ...comp,
                    width: size.width,
                    height: size.height,
                  };
                }
                return comp;
              }) || [];
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
                  width: size.width,
                  height: size.height,
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
                padding: "4px",
                boxSizing: "border-box",
                fontSize: `${component.fontSize || 12}pt`,
                fontFamily: component.font || "Roboto",
                fontWeight:component.fontWeight ?? "400",
                fontStyle: component.fontStyle || "normal",
                textAlign: component.textAlign || "center",
                color:`rgb(${component.fontColor})`,
                display: "flex",
                alignItems: "center",
                justifyContent: component.textAlign || "center",
                overflow: "hidden",
                backgroundColor:isSelected ? "#ffffffff" : "inherit", 
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
              <p style={{ pointerEvents: 'none', userSelect: 'none' ,whiteSpace: "pre-wrap", }}>
                {component.content}
              </p>
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
                  borderTop: `${component?.lineThickness || 1}px ${
                    component?.lineType || "solid"
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
            width={component.width}
            height={component.height}
            minConstraints={[20, 20]}
            maxConstraints={[800, 600]}
            resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
            onResize={(e, { size }) => {
              const updatedComponents = templateData?.barcodeState?.placedComponents?.map((comp) => {
                if (comp.id === component.id) {
                  return {
                    ...comp,
                    width: size.width,
                    height: size.height,
                  };
                }
                return comp;
              }) || [];
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
                  width: size.width,
                  height: size.height,
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
                 objectPosition: (component.imgPosition as React.CSSProperties["objectPosition"])  || "center center",
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
        component={component}
        isSelected={isSelected}
        style={style}
        handleComponentClick={handleComponentClick}
        handleMouseDown={handleMouseDown}
        handleDelete={handleDelete}
        qrCodeRefs={qrCodeRefs}
        templateData={templateData}
        setTemplateData={setTemplateData}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
      />
    );


      case DesignerElementType.container:
        const containerChildren = templateData?.barcodeState?.placedComponents
          ?.filter(comp => comp.containerId === component.id) || [];
        
        // Calculate dynamic height based on children content
        const calculateContainerHeight = () => {
          if (!component.containerProps?.autoResize || containerChildren.length === 0) {
            return component.height;
          }
          
          let maxBottom = 0;
          containerChildren.forEach(child => {
            const childBottom = child.y + child.height;
            if (childBottom > maxBottom) {
              maxBottom = childBottom;
            }
          });
          
          const padding = component.containerProps.padding || 0;
          const calculatedHeight = maxBottom + padding;
          const minHeight = component.containerProps.minHeight || 50;
          const maxHeight = component.containerProps.maxHeight || 500;
          
          return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
        };
        
        const containerHeight = calculateContainerHeight();
        
        return (
          <ResizableBox
            key={component.id}
            width={component.width}
            height={containerHeight}
            minConstraints={[50, 50]}
            maxConstraints={[800, 600]}
            resizeHandles={isSelected ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
            onResize={(e, { size }) => {
              const updatedComponents = templateData?.barcodeState?.placedComponents?.map((comp) => {
                if (comp.id === component.id) {
                  return {
                    ...comp,
                    width: size.width,
                    height: size.height,
                  };
                }
                return comp;
              }) || [];
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
                  width: size.width,
                  height: size.height,
                }));
              }
            }}
            className="container-component"
            style={{
              position: "absolute",
              left: `${component.x}pt`,
              top: `${component.y}pt`,
              transform: `rotate(${component.rotate || 0}deg)`,
              transformOrigin: "center",
              zIndex: 1,
            }}
          >
            <div
              id={`component-${component.id}`}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: component.containerProps?.backgroundColor || "inherit",
                border: isSelected 
                  ? "2px solid #2196f3" 
                  : `${component.containerProps?.borderWidth || 1}pt ${component.containerProps?.borderStyle || "solid"} ${component.containerProps?.borderColor || "#cccccc"}`,
                padding: `${component.containerProps?.padding || 0}pt`,
                boxSizing: "border-box",
                position: "relative",
                overflow: component.containerProps?.autoResize ? "visible" : "hidden",
                cursor: "move",
                borderRadius: `${component.containerProps?.borderRound || 1}pt`
              }}
              onClick={(e) => {
                // Only select container if clicking on empty space (not on child elements)
                if (e.target === e.currentTarget) {
                  e.stopPropagation();
                  handleComponentClick(e, component);
                }
              }}
              onMouseDown={(e) => {
                // Only start dragging container if clicking on container itself (not on child elements)
                if (e.target === e.currentTarget) {
                  e.stopPropagation();
                  handleMouseDown(e, component);
                }
              }}
              onDrop={(e) => handleDropIntoContainer(e, component)}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Render children elements */}
              {containerChildren.length === 0 ? (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#999',
                  fontSize: '12px',
                  pointerEvents: 'none',
                }}>
                  Drop elements here
                </div>
              ) : null}
              {containerChildren.map((child, index) => {
                // Use the actual child data from the state, not a copy
                const actualChild = templateData?.barcodeState?.placedComponents?.find(
                  comp => comp.id === child.id
                ) || child;
                
                // Render child elements with proper styling
                // For child elements, positions should be relative to container
                const containerPadding = component.containerProps?.padding || 10;
                // Child positions are already stored relative to container, so use them directly
                const relativeX = actualChild.x;
                const relativeY = actualChild.y;
                
                const childStyle: React.CSSProperties = {
                  position: "absolute",
                  left: `${relativeX}pt`,
                  top: `${relativeY}pt`,
                  width: `${actualChild.width || 100}pt`,
                  height: actualChild.type === DesignerElementType.barcode ? "auto" : `${actualChild.height || 50}pt`,
                  zIndex: 10 + index,
                  cursor: "move",
                  transform: `rotate(${actualChild.rotate || 0}deg)`,
                  transformOrigin: "center",
                  pointerEvents: 'auto',
                };
                
                // Return child elements with proper rendering based on type
                // For text, field, and image types, use ResizableBox for direct resizing
                if (actualChild.type === DesignerElementType.text || 
                    actualChild.type === DesignerElementType.field || 
                    actualChild.type === DesignerElementType.image) {
                  return (
                    <ResizableBox
                      key={`child-${actualChild.id}-${index}`}
                      width={actualChild.width || 100}
                      height={actualChild.height || 50}
                      minConstraints={[20, 20]}
                      maxConstraints={[400, 300]}
                      resizeHandles={selectedComponent?.id === actualChild.id ? ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] : []}
                      onResize={(e, { size }) => {
                        const updatedComponents = templateData?.barcodeState?.placedComponents?.map((comp) => {
                          if (comp.id === actualChild.id) {
                            return {
                              ...comp,
                              width: size.width,
                              height: size.height,
                            };
                          }
                          return comp;
                        }) || [];
                        setTemplateData((prev: TemplateState<unknown>) => ({
                          ...prev,
                          barcodeState: {
                            ...prev.barcodeState,
                            placedComponents: updatedComponents,
                          },
                        }));
                        if (selectedComponent?.id === actualChild.id) {
                          setSelectedComponent((prev) => ({
                            ...prev!,
                            width: size.width,
                            height: size.height,
                          }));
                        }
                      }}
                      style={{
                        position: "absolute",
                        left: `${relativeX}pt`,
                        top: `${relativeY}pt`,
                        transform: `rotate(${actualChild.rotate || 0}deg)`,
                        transformOrigin: "center",
                        zIndex: 10 + index,
                      }}
                    >
                      <div
                        id={`child-${actualChild.id}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "move",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          e.nativeEvent.stopImmediatePropagation();
                          handleComponentClick(e, actualChild);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          e.nativeEvent.stopImmediatePropagation();
                          handleMouseDown(e, actualChild);
                        }}
                      >
                        {actualChild.type === DesignerElementType.image ? (
                          <img
                            src={actualChild.content || "https://via.placeholder.com/100x50"}
                            alt="Child Image"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: (actualChild.imgFit as React.CSSProperties["objectFit"]) || "cover",
                              border: selectedComponent?.id === actualChild.id ? "2px solid #2196f3" : "1px solid #ddd",
                              pointerEvents: 'none',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: selectedComponent?.id === actualChild.id?"white":"inherit",
                              border: selectedComponent?.id === actualChild.id ? "2px solid #2196f3" : "none",
                              padding: "4px",
                              boxSizing: "border-box",
                              fontSize: `${actualChild.fontSize || 12}pt`,
                              fontFamily: actualChild.font || "Roboto",
                              fontStyle: actualChild.fontStyle || "normal",
                              textAlign: actualChild.textAlign || "center",
                              color:`rgb(${actualChild.fontColor})`,
                              fontWeight:actualChild.fontWeight || "400",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: actualChild.textAlign || "center",
                              overflow: "hidden",
                              pointerEvents: 'none',
                              userSelect: 'none',
                              
                            }}
                          >
                                <p style={{ pointerEvents: 'none', userSelect: 'none' ,whiteSpace: "pre-wrap", }}>
                                {actualChild.content || "Text"}
                                </p>
                           
                          </div>
                        )}
                        {selectedComponent?.id === actualChild.id && (
                          <DeleteButton
                            id={actualChild.id}
                            isSelected={true}
                            handleDelete={handleDelete}
                          />
                        )}
                      </div>
                    </ResizableBox>
                  );
                } else {
                  // For other types (line, barcode, qrcode), render without ResizableBox
                  return (
                    <div
                      key={`child-${actualChild.id}-${index}`}
                      id={`child-${actualChild.id}`}
                      style={childStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.nativeEvent.stopImmediatePropagation();
                        handleComponentClick(e, actualChild);
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.nativeEvent.stopImmediatePropagation();
                        handleMouseDown(e, actualChild);
                      }}
                      onMouseMove={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {/* Render content based on type */}
                      {actualChild.type === DesignerElementType.line ? (
                        <div
                          style={{
                            width: `${actualChild.lineWidth || 100}pt`,
                            height: "auto",
                            padding: 2,
                            position: "relative",
                            overflow: "visible",
                            border:
                              selectedComponent?.id === actualChild.id
                                ? "2px solid #2196f3"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              borderTop: `${actualChild?.lineThickness || 1}px ${
                                actualChild?.lineType || "solid"
                              } ${actualChild?.lineColor || "black"}`,
                              width: `${actualChild.lineWidth}pt`,
                              margin: 0,
                            }}
                          />
                        </div>
                      ) : actualChild.type === DesignerElementType.qrCode ? (
                        // For QR code, render a placeholder
                        <div style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#f0f0f0",
                          border: selectedComponent?.id === actualChild.id ? "2px solid #2196f3" : "1px solid #999",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10pt",
                          pointerEvents: 'none',
                        }}>
                          QR: {actualChild.content}
                        </div>
                      ) : (
                        // Default fallback
                        <div style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "white",
                          border: selectedComponent?.id === actualChild.id ? "2px solid #2196f3" : "1px dashed #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          pointerEvents: 'none',
                          userSelect: 'none',
                        }}>
                          {actualChild.content}
                        </div>
                      )}
                      {selectedComponent?.id === actualChild.id && (
                        <DeleteButton
                          id={actualChild.id}
                          isSelected={true}
                          handleDelete={handleDelete}
                        />
                      )}
                    </div>
                  );
                }
              })}
              <DeleteButton
                id={component.id}
                isSelected={isSelected}
                handleDelete={handleDelete}
              />
            </div>
          </ResizableBox>
        );
    }
  };
  const pointToPx = (pt: number) => pt * (96 / 72);
  const labelWidthPt = templateData?.barcodeState?.labelState?.labelWidth ?? 300;
  const labelHeightPt = templateData?.barcodeState?.labelState?.labelHeight ?? 200;
  const labelWidthPx = pointToPx(labelWidthPt);
  const labelHeightPx = pointToPx(labelHeightPt);

  // Helper function to consolidate container children before saving
  const consolidateContainerChildren = () => {
    const components = templateData?.barcodeState?.placedComponents || [];
    // First, create a map of containers with their children
    const result: PlacedComponent[] = [];
    
    components.forEach(comp => {
      if (comp.type === DesignerElementType.container) {
        // Find all children for this container
        const children = components.filter(c => c.containerId === comp.id);
        result.push({
          ...comp,
          children: children.map(child => ({
            ...child,
            // Store relative positions
            x: child.x,
            y: child.y,
          }))
        });
      } else if (!comp.containerId) {
        // Only include components that are NOT children of containers
        result.push(comp);
      }
      // Skip components with containerId as they're already included in their parent's children array
    });
    
    return result;
  };
  const expandContainerChildren = (components: PlacedComponent[]): PlacedComponent[] => {
  const result: PlacedComponent[] = [];
  
  components.forEach(comp => {
    if (comp.type === DesignerElementType.container && comp.children && comp.children.length > 0) {
      // Add the container itself (without children array to avoid duplication)
      const { children, ...containerWithoutChildren } = comp;
      result.push(containerWithoutChildren);
      
      // Add all children to the main list with their containerId set
      comp.children.forEach(child => {
        result.push({
          ...child,
          containerId: comp.id, // Ensure containerId is set
        });
      });
    } else {
      // Add non-container components or containers without children
      result.push(comp);
    }
  });
  
  return result;
};
  const getFieldContent = () => {
  if (!forCustomRows) return barCodeField;
  return accountsVoucherTypes.includes(templateGroup as VoucherType)
    ? accountsFields
    : inventoryFields;
};
  const debouncedHandleAreaPropetFieldChange=useDebounce(handleDesignerChange, 300);
   const debouncedHandlePropetFieldChange=useDebounce(handlePropertyChange, 300);
const bgImage = forCustomRows
  ? designerData?.background_image
  : templateData?.barcodeState?.labelState?.background_image;

const bgPosition = forCustomRows
  ? designerData?.bg_image_position
  : templateData?.barcodeState?.labelState?.bg_image_position;

const bgSize = forCustomRows
  ? designerData?.bg_image_objectFit
  : templateData?.barcodeState?.labelState?.bg_image_objectFit;
  return (
    <div
      className={`flex h-dvh max-h-dvh bg-gray-100 overflow-hidden w-full
       ${
         templateData.propertiesState?.language_prefer === "Eng"
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
            className={`custom-handle ${
              templateData.propertiesState?.language_prefer === "Arb"
                ? "rtl"
                : "ltr"
            }`}
          />
        }
        className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden"
      >
        <div className=" border-r border-gray-200  p-4">
          <div className=" bg-[] border-b border-dashed pb-2 mb-1 border-gray-600">
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
                  className={`flex items-center p-2 rounded hover:bg-gray-100 cursor-move ${
                    component.id === DesignerElementType.container 
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
            ></ERPButton>
            {!forCustomRows && (
              <>
                {/* <ERPButton
                  startIcon="ri-arrow-go-back-line"
                  title={t("undo")}
                  onClick={() => undoChanges("undo")}
                  variant="secondary"
                ></ERPButton>
                <ERPButton
                  startIcon="ri-arrow-go-forward-line"
                  title={t("redo")}
                  onClick={() => undoChanges("redo")}
                  variant="secondary"
                ></ERPButton> */}
              </>
            )}

            <ERPButton
              title={t("save")}
              onClick={manageSaveTemplate}
              variant="primary"
              loading={loading}
            ></ERPButton>
          </div>
        </div>

        {/* Design Canvas */}

        <div
          id="teplate-container-base"
          className="flex-1 bg-gray-50"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={(e) => {
            // Clear selection when clicking on empty canvas
            if (e.target === e.currentTarget) {
              setSelectedComponent(null);
              setDraggingComponent(null);
              setDragOffset({ x: 0, y: 0 });
            }
          }}
          style={{
            width: `${
              (((templateData?.barcodeState?.labelState?.labelWidth ?? 300)) *
              (templateData?.barcodeState?.labelState?.columnsPerRow ?? 1))+((templateData?.propertiesState?.padding
                                ?.right ?? 0)+(templateData?.propertiesState?.padding
                                ?.left ?? 0))+((templateData?.propertiesState?.gap?.vgap??0)* ((templateData?.barcodeState?.labelState?.columnsPerRow ?? 1)-1))
            }pt`,
            // : templateData?.propertiesState?.pageSize !== "Custom"
            // ? templateData.propertiesState?.orientation === "portrait"? paperWidth:paperHeight
            // :"",
            maxHeight: `${
              (((templateData?.barcodeState?.labelState?.labelHeight ?? 300)) *
              (templateData?.barcodeState?.labelState?.rowsPerPage ?? 1))+((templateData?.propertiesState?.padding
                                ?.top ?? 0)+(templateData?.propertiesState?.padding
                                ?.bottom ?? 0))+((templateData?.propertiesState?.gap?.hgap??0)* ((templateData?.barcodeState?.labelState?.rowsPerPage ?? 1)-1))

              // (templateData?.barcodeState?.labelState?.labelHeight ?? 300) *
              // (templateData?.barcodeState?.labelState?.rowsPerPage ?? 1)
            }pt`,
           padding: `${
                    templateData?.propertiesState?.padding?.top ?? 0
                  }pt 
                            ${
                                templateData?.propertiesState?.padding
                                ?.right ?? 0
                            }pt 
                            ${
                              templateData?.propertiesState?.padding
                                ?.bottom ?? 0
                            }pt 
                            ${
                              templateData?.propertiesState?.padding
                                ?.left ?? 0
                            }pt`,
            // : templateData?.propertiesState?.pageSize !== "Custom"
            // ?templateData.propertiesState?.orientation === "portrait"? paperHeight:paperWidth
            // :`` ,
          }}
        >
          {/* {templateGroup === "barcode" ? ( */}
          <ResizableBox
            // id="teplate-container-imge"
            width={labelWidthPx}
            height={labelHeightPx}
            minConstraints={[pointToPx(50), pointToPx(50)]}
            maxConstraints={[pointToPx(1200), pointToPx(800)]}
            
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
                backgroundPosition: bgPosition || "center", // fallback default
                backgroundSize: bgSize || "cover",   
                backgroundRepeat: "no-repeat",
                backgroundColor: forCustomRows?`rgb(${designerData.background_color})`: "#fff",
              }}
            >
              {/* Only render top-level components (not inside containers) */}
              {/* Render containers first, then other elements, then lines on top */}
              {/* {templateData?.barcodeState?.placedComponents
                ?.filter(comp => !comp.containerId && comp.type === DesignerElementType.container)
                ?.map((comp) => renderComponent(comp, false))}
              {templateData?.barcodeState?.placedComponents
                ?.filter(comp => !comp.containerId && comp.type !== DesignerElementType.container && comp.type !== DesignerElementType.line)
                ?.map((comp) => renderComponent(comp, false))} */}
              {/* Render lines last to ensure they're always on top */}
              {/* {templateData?.barcodeState?.placedComponents
                ?.filter(comp => !comp.containerId && comp.type === DesignerElementType.line)
                ?.map((comp) => renderComponent(comp, false))} */}

                {templateData?.barcodeState?.placedComponents?.filter((comp) => !comp.containerId).map((comp) => (
    <DesignerRenderer
      key={comp.id}
      component={comp}
      selectedComponent={selectedComponent}
      setSelectedComponent={setSelectedComponent}
      setTemplateData={setTemplateData}
      templateData={templateData}
      handleComponentClick={handleComponentClick}
      handleMouseDown={handleMouseDown}
      handleDelete={handleDelete}
      barcodeErrors={barcodeErrors}
      barcodeRefs={barcodeRefs}
      qrCodeRefs={qrCodeRefs}
      handleDropIntoContainer={handleDropIntoContainer}
    />
  ))}

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
            className={`custom-handle ${
              templateData.propertiesState?.language_prefer === "Arb"
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
              {forCustomRows && <Tab label="Designer" value="designer"/>}
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
                              selectedComponent.imgFromDevice?? false
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
                        
                      {selectedComponent?.imgFromDevice &&(
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
                          className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${
                            selectedComponent?.content
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
                      {selectedComponent?.content &&(
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
             
                    selectedComponent.type !== DesignerElementType.qrCode &&(
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
                            ]}
                            onChange={(e) =>
                              handlePropertyChange("font", e.value)
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
                                style={{ backgroundColor: `rgb(${selectedComponent?.fontColor})`}}>
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

                        <Box sx={{mb:1}}>
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
                              className={`ti-btn ${
                                selectedComponent.textAlign === "left"
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
                              className={`ti-btn ${
                                selectedComponent.textAlign === "center"
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
                              className={`ti-btn ${
                                selectedComponent.textAlign === "right"
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
                              className={`ti-btn ${
                                selectedComponent.fontStyle === "normal"
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
                              className={`ti-btn ${
                                selectedComponent.fontStyle === "italic"
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
                              className={`ti-btn ${
                                selectedComponent.barcodeProps.textAlign ===
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
                              className={`ti-btn ${
                                selectedComponent.barcodeProps.textAlign ===
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
                              className={`ti-btn ${
                                selectedComponent.barcodeProps.textAlign ===
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
                              className={`ti-btn ${
                                selectedComponent.barcodeProps.fontStyle ===
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
                              className={`ti-btn ${
                                selectedComponent.barcodeProps.fontStyle ===
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
                              className={`ti-btn ${
                                selectedComponent.barcodeProps.fontStyle ===
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
                      handleLabelPropsChange("columnsPerRow", parseInt(e.target.value) )
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
                        className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${
                          templateData?.barcodeState?.labelState
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
                                      defaultValue={ "contain"
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
                        data={ templateData?.propertiesState}

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
            <AccessPrinterList templateData={templateData}  handlePagePropsChange={handlePagePropsChange} />
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
                        className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${
                          designerData?.background_image
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
                                      defaultValue={ "fill"}
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
                                       defaultValue={ "center" }
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
                                style={{ backgroundColor: `rgb(${designerData?.background_color}) `}}>
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
