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
import {
  handleSetTemplateBarcodeLabelBackgroundImage,
  setTemplateCustomElements,
} from "../../redux/slices/templates/reducer";
import { convertFileToBase64 } from "../../utilities/file-utils";
// import { TemplateGroupTypes } from "../InvoiceDesigner/constants/TemplateCategories";
import { AddColumnsManage } from "./column-manage";
import { EditButton } from "./edit-button";
import { useTranslation } from "react-i18next";
import VoucherType, {purchaseVoucherTypes, salesVoucherTypes, accountsVoucherTypes} from "../../enums/voucher-types";
import {  accountsFields, inventoryFields, barCodeField } from "./fields";
import { customJsonParse } from "../../utilities/jsonConverter";
import { getPageDimensions } from "../InvoiceDesigner/utils/pdf-util";
import { QRCodeComponent } from "./QRCodeComponent";
import GroupedComboBox from "../../components/ERPComponents/erp-grouped-combo";
import { AccessPrinterList } from "../InvoiceDesigner/utils/get_printers";
import { renderBarcode } from "../../utilities/barcode";
import { ERPScrollArea } from "../../components/ERPComponents/erp-scrollbar";
import { initialPrintMasterDto } from "../use-print-type-data";
import { designSections } from "../InvoiceDesigner/LandingFolder/designSection";

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
  id: number;
  isSelected: boolean;
  handleDelete: (id: number) => void;
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
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [draggingComponent, setDraggingComponent] =
    useState<PlacedComponent | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const barcodeRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState(forCustomRows?"element":"page");
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [editingColumnData, setEditingColumnData] = useState<
    tableColumns | undefined
  >(undefined);
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

  const [historyData, setHistoryData] = useState<HistoryComponent[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const pxToPoint = (px: number) => px * (72 / 96);
  const { t } = useTranslation("labelDesigner");
  const pageSize = template?.propertiesState?.pageSize ?? "A4";
    const qrCodeRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
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
    const newWidthPt = pxToPoint(size.width); // Convert pixels to points
    const newHeightPt = pxToPoint(size.height);
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
    // {
    //   id: DesignerElementType.table,
    //   label: "Table",
    //   icon: <Table className="w-4 h-4" />,
    //   defaultContent: "Table",
    // },
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
    // {
    //   id: DesignerElementType.area,
    //   label: "Area",
    //   icon: <SquareDashed className="w-4 h-4" />,
    //   defaultContent: "Area",
    // },
  ];

  const handleDragStart = (
    e: React.DragEvent,
    componentType: DesignerElementType
  ) => {
    e.dataTransfer.setData("componentType", componentType.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = parseInt(
      e.dataTransfer.getData("componentType")
    ) as DesignerElementType;

    const canvasRect = canvasRef.current?.getBoundingClientRect();

    if (canvasRect) {
      // const x = e.clientX - canvasRect.left;
      // const y = e.clientY - canvasRect.top;
      const x = pxToPoint(e.clientX - canvasRect.left);
      const y = pxToPoint(e.clientY - canvasRect.top);

      const component = components.find((c) => c.id === componentType);
      if (component) {
        const newComponent: PlacedComponent = {
          id: nextId,
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
          width: componentType === DesignerElementType.barcode ? 150 : 100,
          height: componentType === DesignerElementType.barcode ? 80 : 30,
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
          tableProps: {
            showBorder: true,
            columns: [],
          },
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
          areaProps: {
            bgColor: "#FFFFFF",
            isRepeat: true,
            width: 300,
            height: 300,
          },
        };

        const placedComponents = [
          ...(templateData?.barcodeState?.placedComponents || []),
          newComponent,
        ];
        setTemplateData((prev: TemplateState<unknown>) => ({
          ...prev,
          barcodeState: {
            ...prev.barcodeState,
            placedComponents: placedComponents, // Ensure the name matches the interface
          },
        }));
        setNextId(nextId + 1);
      }
    }
  };

  const handleComponentClick = (e: React.MouseEvent,component: PlacedComponent) => {
      e.preventDefault()
    e.stopPropagation()
    setSelectedComponent(component);
    setActiveTab("element");
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

  const handleEditColumn = (componentId: number, columnIndex: number) => {
    const component = templateData.barcodeState?.placedComponents.find(
      (comp) => comp.id === componentId
    );
    if (
      component &&
      component.type === DesignerElementType.table &&
      component.tableProps
    ) {
      const columnData = component.tableProps.columns[columnIndex];
      setSelectedComponent(component);
      setEditingColumnData(columnData);
      setIsAddColumnModalOpen(true);
    }
  };

  const handleAddColumn = (
    columnData?: tableColumns | undefined,
    editingColumnDataTmp?: tableColumns | undefined
  ) => {
    if (
      selectedComponent &&
      selectedComponent.type === DesignerElementType.table &&
      (editingColumnDataTmp != undefined ||
        (editingColumnDataTmp == undefined && columnData != undefined))
    ) {
      const updatedComponents = templateData.barcodeState?.placedComponents.map(
        (comp) =>
          comp.id === selectedComponent.id
            ? {
                ...comp,
                tableProps: {
                  ...comp.tableProps,
                  columns:
                    editingColumnData || editingColumnDataTmp
                      ? comp.tableProps?.columns
                          .map((col) =>
                            col.caption ===
                            (editingColumnDataTmp
                              ? editingColumnDataTmp.caption
                              : editingColumnData?.caption)
                              ? columnData!
                              : col
                          )
                          .filter(
                            (col): col is tableColumns => col !== undefined
                          ) // Remove undefined values
                      : [...(comp.tableProps?.columns || []), columnData!], // Ensure columnData is valid
                  showBorder: comp.tableProps?.showBorder ?? true,
                },
              }
            : comp
      ) as PlacedComponent[];

      setTemplateData((prev) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents,
        },
      }));

      setSelectedComponent({
        ...selectedComponent,
        tableProps: {
          ...selectedComponent.tableProps,
          columns:
            editingColumnData || editingColumnDataTmp
              ? (selectedComponent.tableProps?.columns ?? [])
                  .map((col) =>
                    col.caption ===
                    (editingColumnDataTmp
                      ? editingColumnDataTmp.caption
                      : editingColumnData?.caption)
                      ? columnData! // Ensure columnData is non-null/undefined
                      : col
                  )
                  .filter((col): col is tableColumns => col !== undefined) // Ensure no undefined values
              : [...(selectedComponent.tableProps?.columns ?? []), columnData!], // Ensure columnData is non-null
          showBorder: selectedComponent.tableProps?.showBorder ?? true,
        },
      });

      setIsAddColumnModalOpen(false);
      setEditingColumnData(undefined);
    }
  };

  const handleDeleteColumn = (componentId: number, columnIndex: number) => {
    setTemplateData((prev) => ({
      ...prev,
      barcodeState: {
        ...prev.barcodeState,
        placedComponents:
          prev.barcodeState?.placedComponents.map((comp) => {
            if (
              comp.id === componentId &&
              comp.type === DesignerElementType.table &&
              comp.tableProps
            ) {
              return {
                ...comp,
                tableProps: {
                  ...comp.tableProps,
                  columns: comp.tableProps.columns.filter(
                    (_, index) => index !== columnIndex
                  ),
                },
              };
            }
            return comp;
          }) ?? [],
      },
    }));
    setIsAddColumnModalOpen(false);
    setEditingColumnData(undefined);
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

  const handleAreaPropertyChange = (
    property: any,
    value: string | number | boolean
  ) => {
    if (
      selectedComponent &&
      selectedComponent.type === DesignerElementType.area &&
      selectedComponent.areaProps
    ) {
      const updatedComponents =
        templateData?.barcodeState?.placedComponents?.map((comp) =>
          comp.id === selectedComponent.id && comp.areaProps
            ? {
                ...comp,
                areaProps: { ...comp.areaProps, [property]: value },
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
        areaProps: { ...selectedComponent.areaProps, [property]: value },
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, component: PlacedComponent) => {
     e.preventDefault()
    e.stopPropagation()
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      setDraggingComponent(component);
      const offsetX = e.clientX - canvasRect.left - component.x;
      const offsetY = e.clientY - canvasRect.top - component.y;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingComponent && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      const updatedComponents =
        templateData?.barcodeState?.placedComponents?.map((comp) =>
          comp.id === draggingComponent.id
            ? { ...comp, x: newX, y: newY }
            : comp
        );
      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents || [], // Use an empty array if undefined
        },
      }));
      if (selectedComponent?.id === draggingComponent.id) {
        setSelectedComponent({ ...draggingComponent, x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent)  => {
   e.stopPropagation()
    setDraggingComponent(null)
  };

  const handleSave = async (dataUrl?: string) => {
    setLoading(true);

    try {
      
      if (forCustomRows) {
        dispatch(
          setTemplateCustomElements({
            payload: {
              elements: templateData.barcodeState?.placedComponents || [],
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
      const activeTemplate: TemplateDto = {
        id: id == "new" ? 0 : id, //temparary fix
        templateType: tmpTemplate.propertiesState.template_type ?? "standard",
        templateKind: tmpTemplate.propertiesState.template_kind ?? "standard",
        templateGroup: tmpTemplate.propertiesState.template_group ?? "",
        templateName: tmpTemplate.propertiesState?.templateName ?? "",
        thumbImage: dataUrl,
        content: JSON.stringify(tmpTemplate),
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
      [property]: value ,
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
    let cc: TemplateState<unknown> = customJsonParse(res.content);
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
    setTemplateData(cc);

    if (cc && cc.barcodeState && cc.barcodeState.placedComponents) {
      const maxId = cc.barcodeState.placedComponents.reduce(
        (max: any, item: any) => (item.id > max ? item.id : max),
        0
      );
      setNextId(maxId + 1);
    }
  };

  useEffect(() => {
    if (id !== "new" && !forCustomRows) getPDFTemplateData();
  }, []);

  useEffect(() => {
    if (forCustomRows && template) {
      const fields = customTemplate?.split("."); // e.g., ["headerState", "customTop"]
      let nestedValue: any = template; // Start from template, not prev
      for (let i = 0; i < fields?.length; i++) {
        nestedValue = nestedValue?.[fields[i]];
      }
      setTemplateData((prev: TemplateState<unknown>) => ({
        ...prev, // Preserve existing templateData
        barcodeState: {
          ...prev.barcodeState, // Preserve other barcodeState properties
          placedComponents: nestedValue?.elements || [], // Load from template 
          labelState: {
            ...prev.barcodeState?.labelState, // Preserve labelState
            labelHeight: nestedValue?.height || 200,
            labelWidth: selectedPageSize?.width,
          },
        },
      }));
    }
  }, []);

  const handlePropertyChange = (
    property: keyof PlacedComponent,
    value: string | number | boolean,
    id?: number | undefined,
    isUndoOrRedo?: boolean | false
  ) => {
    if (selectedComponent) {
      {
        if ( isUndoOrRedo == undefined || isUndoOrRedo == false)
          setHistoryData((prevHistory) => {
            const isDuplicate = prevHistory.some((entry) => entry.id === id);
            const updHistory = prevHistory.slice(0, historyIndex + 1);
            setHistoryIndex(updHistory.length);
            const preEntry = {
              field: property,
              id: id ? id : selectedComponent.id,
              value: templateData.barcodeState?.placedComponents?.find(
                (x) => x.id === (id ? id : selectedComponent.id)
              )?.[property],
            };

            const newEntry = {
              field: property,
              id: id ? id : selectedComponent.id,
              value: value,
            };

            return isDuplicate
              ? [...updHistory, newEntry] // Don't add the new entry if it's a duplicate
              : [...updHistory, preEntry, newEntry]; // Add the new entry if it's not a duplicate
          });
      }

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
      // setHistoryData((prev: HistoryComponent[]) => [...prev, ...history]);
      setSelectedComponent(updatedComponent);
      generateBarcode(updatedComponent);
    }
  };

  const undoChanges = (mode: "undo" | "redo") => {
    if (historyData.length > 0) {
      const lastHistory =
        mode == "undo"
          ? historyData[historyIndex]
          : historyData[historyIndex + 2];
      if (lastHistory) {
        const field = lastHistory.field;
        const idsd = lastHistory.id;
        const value = lastHistory.value;
        const splitData = field.split(".");

        if (splitData.length === 1) {
          // Simple property change
          const restoreValue = historyData[historyIndex];
          handlePropertyChange(
            field as keyof PlacedComponent,
            restoreValue ? restoreValue.value : value,
            idsd,
            true
          );
        } else if (splitData.length > 1) {
          // Nested property change
          const [mainField, subField] = splitData;
          if (mainField === "tableProperty") {
            // Handle table property changes
            if (subField === "add") {
              // Remove the last added column
              handleDeleteColumn(idsd, value);
            } else if (subField === "delete") {
              // Re-add the deleted column
              handleAddColumn(value);
            } else {
              // Update specific table property
              handleAddColumn(undefined, value);
            }
          } else if (mainField === "barcodeProps") {
            // Handle barcode property changes
            handleBarcodePropertyChange(subField, value);
          }
        }

        setHistoryIndex((prev: number) => {
          return mode === "undo" ? prev - 1 : prev + 1;
        });

        // Update selected component if it was the one that changed
        if (selectedComponent && selectedComponent.id === idsd) {
          setSelectedComponent((prev) =>
            prev ? { ...prev, [field]: value } : null
          );
        }
      }
    }
  };

// useEffect(()=>{
//   handlePropertyChange("content","")
// },[selectedComponent?.imgFromDevice]);

  useEffect(() => {
    templateData?.barcodeState?.placedComponents?.forEach(generateBarcode);
  }, [templateData?.barcodeState?.placedComponents, barcodeErrors]);

  const handleDelete = (componentId: number) => {
    setTemplateData((prev: TemplateState<unknown>) => ({
      ...prev,
      barcodeState: {
        ...prev.barcodeState,
        placedComponents:
          prev.barcodeState?.placedComponents.filter(
            (comp: PlacedComponent) => comp.id !== componentId
          ) || [],
      },
    }));
    setSelectedComponent(null);
  };

  const renderComponent = (component: PlacedComponent) => {
    const isSelected = selectedComponent?.id === component.id;
    const  style: React.CSSProperties = {
      position: "absolute",
      left: `${component.x}pt`,
      top: `${component.y}pt`,
      padding: "0pt",
       boxSizing: "border-box", 
       zIndex:1,
      alignContent: "center",
      width:
        component.type == DesignerElementType.barcode
          ? `${component.width}pt`
          : `${component.width}pt`,
      height:
        component.type == DesignerElementType.barcode
          ? `auto`
          : `${component.height}pt`,
      border:
        selectedComponent?.id === component.id
          ? "2px solid #2196f3"
          : component.type == DesignerElementType.barcode
          ? ""
          : "1px dashed #ccc",
      cursor: "move",
      backgroundColor: "white",
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
      fontFamily:
        component.type == DesignerElementType.barcode ? "" : component.font,
    };

    switch (component.type) {
      case DesignerElementType.barcode:
        return (
          <div
            key={component.id}
            id={`component-${component.id}`}
            style={style}
            onClick={(e) => handleComponentClick(e, component)}
            onMouseDown={(e) => handleMouseDown(e, component)}
          >
            {barcodeErrors &&
            barcodeErrors?.find((x: any) => x.id == component.id) ? (
              <>
                <div className="text-red-500 text-sm">
                  {barcodeErrors?.find((x: any) => x.id == component.id).error}
                </div>
                <canvas
                  ref={(el) => (barcodeRefs.current[component.id] = el)}
                  width={`${component.width}pt`}
                  height={component.height}
                  style={{overflow:"hidden",zIndex: 2,}}
                />
              </>
            ) : (
              <canvas
                ref={(el) => (barcodeRefs.current[component.id] = el)}
                width={`${component.width}pt`}
                height={component.height}
                style={{overflow:"hidden",zIndex: 2,}}
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
          <div
            key={component.id}
            id={`component-${component.id}`}
            style={style}
            onClick={(e) => handleComponentClick(e, component)}
            onMouseDown={(e) => handleMouseDown(e, component)}
          >
            {component.content}
            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            ></DeleteButton>
          </div>
        );
      case DesignerElementType.table:
        return (
          <div
            key={component.id}
            id={`component-${component.id}`}
            style={{
              ...style,
              border:
                selectedComponent?.id === component.id
                  ? "2px solid #2196f3"
                  : "none",
              width: "auto",
              height: "auto",
            }}
            onClick={(e) => handleComponentClick(e, component)}
            onMouseDown={(e) => handleMouseDown(e, component)}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: component.tableProps?.showBorder
                  ? "1px solid #ccc"
                  : "none",
              }}
            >
              <thead>
                <tr>
                  {component.tableProps?.columns &&
                  component.tableProps.columns.length > 0 ? (
                    component.tableProps.columns.map((column, index) => (
                      <th
                        key={index}
                        style={{
                          border: component.tableProps?.showBorder
                            ? "1px solid #ccc"
                            : "none",
                          padding: "5px",
                          backgroundColor: column.bgColor || "#f0f0f0",
                          color: column.textColor || "#000000",
                          fontFamily: column.font || "inherit",
                          fontSize: `${column.fontSize || 16}px`,
                          fontStyle: column.fontStyle || "normal",
                          textAlign: column.textAlign || "left",
                          width: `${column.width}px`,
                          position: "relative",
                        }}
                      >
                        {column.caption}
                        <EditButton
                          onClick={() => handleEditColumn(component.id, index)}
                        />
                      </th>
                    ))
                  ) : (
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        backgroundColor: "#f0f0f0",
                        textAlign: "center",
                      }}
                    >
                      Demo Column
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {component.tableProps?.columns &&
                  component.tableProps.columns.length > 0 ? (
                    component.tableProps.columns.map((column, index) => (
                      <td
                        key={index}
                        style={{
                          border: component.tableProps?.showBorder
                            ? "1px solid #ccc"
                            : "none",
                          padding: "5px",
                          textAlign: column.textAlign || "left",
                          width: `${column.width}px`,
                        }}
                      >
                        {column.field}
                      </td>
                    ))
                  ) : (
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      Sample Data
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            />
          </div>
        );
      case DesignerElementType.line:
        return (
          <div
            key={component.id}
            id={`component-${component.id}`}
            style={{
              ...style,
              width: `${component.lineWidth}px`,
              height: "auto",
              padding: 2,
              position: "relative",
              overflow: "visible",
              border:
                selectedComponent?.id === component.id
                  ? "2px solid #2196f3"
                  : "none",
            }}
            onClick={(e) => handleComponentClick(e, component)}
            onMouseDown={(e) => handleMouseDown(e, component)}
          >
            <div
              style={{
                borderTop: `${component?.lineThickness || 1}px ${
                  component?.lineType || "solid"
                } ${component?.lineColor || "black"}`,
                width: `${component.lineWidth}px`,
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
          <div
            key={component.id}
            id={`component-${component.id}`}
            style={{
              ...style,
              border:
                selectedComponent?.id === component.id
                  ? "2px solid #2196f3"
                  : "none",
            }}
           onClick={(e) => handleComponentClick(e, component)}
            onMouseDown={(e) => handleMouseDown(e, component)}
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
              }}
            />
            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            />
          </div>
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
      />
    );

      case DesignerElementType.area:
        return (
          <div
            key={component.id}
            id={`component-${component.id}`}
            style={{
              ...style,
              width: `${component.areaProps?.width ?? 500}pt`,
              overflow: "hidden",
              height: `${component.areaProps?.height ?? 500}pt`,
              backgroundColor: `${component.areaProps?.bgColor ?? "white"}`,
            }}
            onClick={(e) => handleComponentClick(e, component)}
            onMouseDown={(e) => handleMouseDown(e, component)}
          >
            <DeleteButton
              id={component.id}
              isSelected={isSelected}
              handleDelete={handleDelete}
            />
          </div>
        );
    }
  };
  const pointToPx = (pt: number) => pt * (96 / 72);
  const labelWidthPt =
    templateData?.barcodeState?.labelState?.labelWidth ?? 300;
  const labelHeightPt =
    templateData?.barcodeState?.labelState?.labelHeight ?? 200;
  const labelWidthPx = pointToPx(labelWidthPt);
  const labelHeightPx = pointToPx(labelHeightPt);

  const getFieldContent = () => {
  if (!forCustomRows) return barCodeField;
  return accountsVoucherTypes.includes(templateGroup as VoucherType)
    ? accountsFields
    : inventoryFields;
};
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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
                  className="flex items-center p-2 rounded hover:bg-gray-100 cursor-move"
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
                <ERPButton
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
                ></ERPButton>
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
                
                backgroundImage: templateData?.barcodeState?.labelState
                  ?.background_image
                  ? `url(${templateData?.barcodeState?.labelState?.background_image})`
                  : "none",
                backgroundPosition: ["cover", "contain", "stretch"].includes(
                  templateData?.barcodeState?.labelState?.bg_image_position ??
                    ""
                )
                  ? "center"
                  : templateData?.barcodeState?.labelState?.bg_image_position ??
                    "center",
                backgroundSize:
                  templateData?.barcodeState?.labelState?.bg_image_position ===
                  "cover"
                    ? "cover"
                    : templateData?.barcodeState?.labelState
                        ?.bg_image_position === "contain"
                    ? "contain"
                    : templateData?.barcodeState?.labelState
                        ?.bg_image_position === "stretch"
                    ? "100% 100%"
                    : "auto",
                backgroundRepeat: "no-repeat",
              }}
            >
              {templateData?.barcodeState?.placedComponents?.map(
                renderComponent
              )}
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
        onResize={(e, { size }) => setSidebarWidth(size.width)}
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
                  {selectedComponent.type !== DesignerElementType.table &&
                    selectedComponent.type !== DesignerElementType.line &&
                    selectedComponent.type !== DesignerElementType.area &&
                    selectedComponent.type !== DesignerElementType.image && (
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

                  {selectedComponent &&
                    selectedComponent.type === DesignerElementType.table && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setIsAddColumnModalOpen(true);
                        }}
                        className="add-columns-button"
                      >
                        Add Columns
                      </Button>
                    )}
                  <ERPModal
                    title={editingColumnData ? "Edit Column" : "Add Column"}
                    isMaximize={false}
                    isOpen={isAddColumnModalOpen}
                    closeModal={() => {
                      setIsAddColumnModalOpen(false);
                      setEditingColumnData(undefined);
                    }}
                    customPosition={true}
                    isForm
                    customStyle={{
                      position: "absolute",
                      top: `${100}px`,
                      // Conditionally set left or right based on language preference
                      ...(templateData.propertiesState?.language_prefer ===
                      "Arb"
                        ? { left: `${10}px` }
                        : { right: `${10}px` }),
                      width: `${sidebarWidth - 40}px`,
                      height: "auto",
                      maxHeight: "80%",
                    }}
                    content={
                      <AddColumnsManage
                        onSubmit={handleAddColumn}
                        initialData={editingColumnData}
                        onDelete={
                          editingColumnData
                            ? () =>
                                handleDeleteColumn(
                                  selectedComponent!.id,
                                  selectedComponent!.tableProps!.columns.findIndex(
                                    (col) => col === editingColumnData
                                  )
                                )
                            : undefined
                        }
                      />
                    }
                  />

                  {selectedComponent.type !== DesignerElementType.table && (
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
                  )}

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
                          label="Line Height"
                          value={selectedComponent?.lineWidth}
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
                          value={selectedComponent.lineWidth}
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
                    selectedComponent.type !== DesignerElementType.table &&
                    selectedComponent.type !== DesignerElementType.qrCode &&
                    selectedComponent.type !== DesignerElementType.area && (
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
                    selectedComponent.type !== DesignerElementType.table &&
                    selectedComponent.type !== DesignerElementType.qrCode &&
                    selectedComponent.type !== DesignerElementType.area && (
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

                  {selectedComponent.type === DesignerElementType.area &&
                    selectedComponent.areaProps && (
                      <>
                        <Box
                          sx={{ mb: 1 }}
                          className="flex justify-start gap-2 items-center"
                        >
                          <Box className="basis-2/3">
                            <ERPSlider
                              label="Height"
                              value={selectedComponent.areaProps?.height}
                              onChange={(e) =>
                                handleAreaPropertyChange(
                                  "height",
                                  parseInt(e.target.value, 10)
                                )
                              }
                              min={10}
                              max={1400}
                            />
                          </Box>

                          <Box className="basis-1/3">
                            <ERPInput
                              id="height"
                              type="number"
                              noLabel
                              value={selectedComponent.areaProps?.height}
                              data={selectedComponent.areaProps}
                              onChange={(e) =>
                                handleAreaPropertyChange(
                                  "height",
                                  parseInt(e.target.value, 10)
                                )
                              }
                            />
                          </Box>
                        </Box>

                        <Box
                          sx={{ mb: 1 }}
                          className="flex justify-start gap-2 items-center"
                        >
                          <Box className="basis-2/3">
                            <ERPSlider
                              label="Width"
                              value={selectedComponent.areaProps?.width}
                              onChange={(e) =>
                                handleAreaPropertyChange(
                                  "width",
                                  e.target.valueAsNumber
                                )
                              }
                              min={10}
                              max={1400}
                            />
                          </Box>

                          <Box className="basis-1/3">
                            <ERPInput
                              id="width"
                              type="number"
                              noLabel
                              value={selectedComponent.areaProps?.width}
                              data={selectedComponent.areaProps}
                              onChange={(e) =>
                                handleAreaPropertyChange(
                                  "width",
                                  parseInt(e.target.value, 10)
                                )
                              }
                            />
                          </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <ERPInput
                            id="bgColor"
                            label="Background Color"
                            type="color"
                            value={selectedComponent.areaProps?.bgColor}
                            data={selectedComponent.areaProps}
                            onChange={(e) =>
                              handleAreaPropertyChange(
                                "bgColor",
                                e.target.value
                              )
                            }
                          />
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <ERPCheckbox
                            id="isRepeat"
                            label="Repeat On Each Page"
                            data={selectedComponent.areaProps}
                            checked={
                              selectedComponent.areaProps?.isRepeat ?? true
                            }
                            onChange={(e) =>
                              handleAreaPropertyChange(
                                "isRepeat",
                                e.target.checked
                              )
                            }
                          />
                        </Box>
                      </>
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
                    <ERPInput
                        value={designerData?.background_color}
                          onChange={(e) =>
                            handleDesignerChange("background_color", e.target?.value )
                          }                        
                        label={t("color")}
                        id="bg_color"
                        type="color"
                        customSize="md"
                        placeholder=""
                      />    
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
