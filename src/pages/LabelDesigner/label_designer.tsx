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
} from "lucide-react";
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
import { useNavigate, useParams } from "react-router-dom";
import Urls from "../../redux/urls";
import { APIClient } from "../../helpers/api-client";
import { handleResponse } from "../../utilities/HandleResponse";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../components/ERPComponents/erp-button";
import { ResizableBox } from "react-resizable";
import {
  DesignerElementType,
  initialBacodeTemplateState,
  initialTemplateState,
  LabelState,
  PlacedComponent,
  PropertiesState,
  TemplateState,
} from "../InvoiceDesigner/Designer/interfaces";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { getDetailAction } from "../../redux/slices/app-thunks";
import { RootState } from "../../redux/store";
import { useAppState } from "../../utilities/hooks/useAppState";
import ERPPreviousUrlButton from "../../components/ERPComponents/erp-previous-uirl-button";
import { handleSetTemplateBarcodeLabelBackgroundImage } from "../../redux/slices/templates/reducer";
import { convertFileToBase64 } from "../../utilities/file-utils";

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
const DeleteButton: React.FC<DeleteButtonProps> = ({
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
  { label: "Custom", value: "Custom" },
];

const retailPageSizes = [
  { label: `3 "`, value: "3Inch" },
  { label: `4 "`, value: "4Inch" },
];

const fields = [
  "[Footer1]",
  "[Footer10]",
  "[Footer2]",
  "[Footer3]",
  "[Footer4]",
  "[Footer5]",
  "[Footer6]",
  "[Footer7]",
  "[Footer8]",
  "[Footer9]",
  "[Header1]",
  "[Header10]",
  "[Header2]",
  "[Header3]",
  "[Header4]",
  "[Header5]",
  "[Header6]",
  "[Header7]",
  "[Header8]",
  "[Header9]",
  "AliasName",
  "ArabicName",
  "AutoBarcode",
  "AutoBarcodeText",
  "BarCode",
  "BarCodeText",
  "Batch",
  "BatchNo",
  "Cost",
  "ExpDate",
  "ExpDays",
  "ExpiryDate",
  "ExpiryDescription",
  "GroupName",
  "MBarcode",
  "MBarcodeBarcode",
  "MBarcodeBarCode2",
  "MfdDate",
  "MfgDate",
  "MRP",
  "MRPCode",
  "MRPPerUnit",
  "MSP",
  "MSPCode",
  "NetWeight",
  "Nutrient01",
  "Nutrient02",
  "Nutrient03",
  "Nutrient04",
  "Nutrient05",
  "Nutrient06",
  "Nutrient07",
  "Nutrient08",
  "Nutrient09",
  "Nutrient10",
  "PackingDate",
  "PackingQty2",
  "PackingQty3",
  "PartyCode",
  "PCodeBarCode",
  "PrintDate",
  "PrintTime",
  "ProductCategoryName",
  "ProductCode",
  "ProductDescription",
  "ProductName",
  "ProductName2",
  "ProductName3",
  "PurchaseCostCode",
  "PurchasePriceCode",
  "Qty",
  "salesPrice",
  "SalesPrice2",
  "SalesPrice3",
  "SalesPriceCode",
  "SalesPricePerUnit",
  "SalesPriceWithVAT",
  "SINo",
  "SINo/Qty",
  "Size",
  "Specification",
  "TextOnly",
  "TransDate",
  "Unit",
  "Unit2AutoBarcode",
  "Unit2Barcode",
  "Unit2BarcodeBarCode",
  "Unit3AutoBarcode",
  "Unit3Barcode",
  "Unit3BarcodeBarCode",
  "VAT%",
  "VocuherNo",
];

const api = new APIClient();
export default function ExtendedPDFBarcodeDesigner() {
  const [zoom, setZoom] = useState(100);

  const [selectedComponent, setSelectedComponent] =
    useState<PlacedComponent | null>(null);
  const [nextId, setNextId] = useState(1);
  const [draggingComponent, setDraggingComponent] =
    useState<PlacedComponent | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const barcodeRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [value, setValue] = React.useState("element");
  const appState = useAppState();
  useState<PurchaseItem | null>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const handleContentLabelResize = (
    e: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } }
  ) => {
    setTemplateData((prevData: TemplateState) => {
      debugger;
      const updated = {
        ...prevData,
        barcodeState: {
          ...prevData.barcodeState,
          labelState: {
            ...prevData?.barcodeState?.labelState, // No need for optional chaining here if prevData is always valid
            labelWidth: size.width,
            labelHeight: size.height,
          },
          placedComponents: prevData?.barcodeState?.placedComponents || [], // Ensure it's an array
        },
      };
      return updated;
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [templateData, setTemplateData] = useState<TemplateState>(
    initialBacodeTemplateState.data
  );
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
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;

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
          width: componentType === DesignerElementType.barcode ? 150 : 100,
          height: componentType === DesignerElementType.barcode ? 80 : 30,
          ...(componentType === DesignerElementType.barcode && {
            barcodeProps: {
              format: "CODE128",
              barWidth: 2,
              height: 75,
              margin: 0,
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
        };

        const placedComponents = [
          ...(templateData?.barcodeState?.placedComponents || []),
          newComponent,
        ];
        setTemplateData((prev: TemplateState) => ({
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

  const handleComponentClick = (component: PlacedComponent) => {
    setSelectedComponent(component);
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
      setTemplateData((prev: TemplateState) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          placedComponents: updatedComponents || [], // Use an empty array if undefined
        },
      }));
      setSelectedComponent({
        ...selectedComponent,
        barcodeProps: { ...selectedComponent.barcodeProps, [property]: value },
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, component: PlacedComponent) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      setDraggingComponent(component);
      const offsetX = e.clientX - canvasRect.left - component.x;
      const offsetY = e.clientY - canvasRect.top - component.y;
      setDragOffset({ x: offsetX, y: offsetY });
      e.stopPropagation();
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
      setTemplateData((prev: TemplateState) => ({
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

  const handleMouseUp = () => {
    setDraggingComponent(null);
  };

  const [loading, setLoading] = useState(false);
  const handleSave = async (dataUrl: string) => {
    setIsSaveDialogOpen(true);

    setLoading(true);
    debugger;
    const outData = { ...templateData, thumbImage: dataUrl };
    var res = await api.postAsync(Urls.templates, outData);

    setLoading(false);
    handleResponse(res, () => {
      navigate(`/templates?template_group=barcode`);
    });
    setLoading(false);
  };
  const manageSaveTemplate = async () => {
    if (!templateData?.propertiesState?.templateName) {
      ERPToast.show("Template name is required", "error");
    } else {
      const node = document.getElementById("teplate-container-base");
      if (node) {
        try {
          const canvas = await html2canvas(node);
          const dataUrl = canvas.toDataURL("image/png");
          await handleSave(dataUrl);
        } catch (error) {
          console.error("Error capturing canvas:", error);
        }
      }
    }
  };

  const handlePagePropsChange = (
    property: keyof PropertiesState,
    value: any
  ) => {
    setTemplateData((prev: TemplateState) => ({
      ...prev,
      propertiesState: { ...prev.propertiesState, [property]: value },
    }));
  };

  const handleImagePropsChange = async (property: any, value: any) => {
    debugger;
    if (!value) {
      handleLabelPropsChange(property, null);
      return;
    }
    const imageData = await convertFileToBase64(value);
    debugger;
    handleLabelPropsChange(property, imageData ?? null);
  };
  const handleRemoveImage = () => {
    handleImagePropsChange('background_image', '');
    if (inputFile.current) {
      inputFile.current.value = '';
    }
  };
  const handleLabelPropsChange = (property: any, value: any) => {
    debugger;
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
        try {
          JsBarcode(canvasElement, component.content, {
            ...component.barcodeProps,
            width: component.barcodeProps.barWidth,
            height: component.height,
            marginBottom:0,
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
    const res = await api.getAsync(`${Urls.templates}${id || ""}`);
    setTemplateData(res);
  };
  useEffect(() => {
    if (id !== "new") getPDFTemplateData();
  }, []);

  const handlePropertyChange = (
    property: keyof PlacedComponent,
    value: string | number
  ) => {
    if (selectedComponent) {
      const updatedComponent = { ...selectedComponent, [property]: value };
      const updatedComponents =
        templateData?.barcodeState?.placedComponents?.map((comp) =>
          comp.id === selectedComponent.id ? updatedComponent : comp
        );
      setTemplateData((prev: TemplateState) => ({
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

  useEffect(() => {
    templateData?.barcodeState?.placedComponents?.forEach(generateBarcode);
  }, [templateData?.barcodeState?.placedComponents, barcodeErrors]);

  const handleDelete = (componentId: number) => {
    setTemplateData((prev: TemplateState) => ({
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
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${component.x}pt`,
      top: `${component.y}pt`,
      width:
        component.type == DesignerElementType.barcode
          ? `${component.width}pt`
          : `${component.width}pt`,
      height:
        component.type == DesignerElementType.barcode
          ? `${component.height}pt`
          : `${component.height}pt`,
      border:
        selectedComponent?.id === component.id
          ? "2px solid #2196f3"
          : component.type == DesignerElementType.barcode
            ? ""
            : "1px dashed #ccc",
      padding: component.type == DesignerElementType.barcode ? "0px" : "4px",
      cursor: "move",
      backgroundColor: "white",
      userSelect: "none",
      transform: `rotate(${component.rotate || 0}deg)`,
      transformOrigin: "center",
      textAlign: component.type !== DesignerElementType.barcode ? component.textAlign : undefined,
      fontSize: component.type == DesignerElementType.barcode ? "0px" : `${component.fontSize}pt`,
      fontStyle: component.type !== DesignerElementType.barcode ? component.fontStyle : undefined,
      fontFamily: component.type == DesignerElementType.barcode ? "" : component.font,
    };



    switch (component.type) {
      case DesignerElementType.barcode:
        return (
          <div
            key={component.id}
            style={style}
            onClick={() => handleComponentClick(component)}
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
                  height={`${component.height}pt`}
                />
              </>
            ) : (
              <canvas
                ref={(el) => (barcodeRefs.current[component.id] = el)}
                width={`${component.width}pt`}
                height={`${component.height}pt`}
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
            style={style}
            onClick={() => handleComponentClick(component)}
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
    }
  };

  return (
    <div
      className="flex h-dvh max-h-dvh bg-gray-100 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Left Sidebar - Components */}
      <ResizableBox
        width={250} // Initial width
        height={Infinity}
        minConstraints={[150, Infinity]} // Minimum width
        maxConstraints={[400, Infinity]} // Maximum width
        resizeHandles={[appState.appState.dir === "rtl" ? "w" : "e"]}
        handle={
          <div
            className={`custom-handle ${appState.appState.dir === "rtl" ? "rtl" : "ltr"
              }`}
          />
        }
        className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden"
      >
        <div className="bg-white border-r border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Components</h2>
          </div>
          <div className="space-y-2">
            {components?.map((component) => (
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
      <div className="flex-1 flex flex-col bg-[#e5e7eb]" style={{ height: "100%" }}>
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className=" ">
              {/* <ERPPreviousUrlButton></ERPPreviousUrlButton> */}
              <ERPPreviousUrlButton size="37px" />
            </div>

            {/* <button className="p-1 hover:bg-gray-100 rounded">
              <Menu className="w-4 h-4" />
            </button> */}
            {/* <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoom(zoom - 10)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm">{zoom}%</span>
              <button
                onClick={() => setZoom(zoom + 10)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div> */}
          </div>
          <div className="flex items-center space-x-2">
            {/* <button onClick={() => setIsPreviewOpen(true)} className='bg-primary'>
                            Preview
                        </button> */}
            <ERPButton
              startIcon="ri-arrow-go-back-line"
              title="Clear"
              onClick={() => {
                setTemplateData((prev: TemplateState) => ({
                  ...prev,
                  barcodeState: {
                    ...prev.barcodeState,
                    placedComponents: [], // Use an empty array if undefined
                  },
                }));
                setSelectedComponent(null);
              }}
              variant="secondary"
              loading={loading}
            ></ERPButton>

            <ERPButton
              title="Save"
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
            width:
              (templateData?.barcodeState?.labelState?.labelWidth ?? 300) *
              (templateData?.barcodeState?.labelState?.columnsPerRow ?? 1),

            maxHeight:
              (templateData?.barcodeState?.labelState?.labelHeight ?? 300) *
              (templateData?.barcodeState?.labelState?.rowsPerPage ?? 1),

          }}
        >
          <ResizableBox
            width={templateData?.barcodeState?.labelState?.labelWidth ?? 300} // Initial width
            height={templateData?.barcodeState?.labelState?.labelHeight ?? 200}
            minConstraints={[50, 50]}
            maxConstraints={[1400, 1000]}
            resizeHandles={["se"]}
            className="box"
            onResize={handleContentLabelResize}
          >
            <div
              ref={canvasRef}
              id="teplate-container"
              className="bg-white shadow-sm mx-auto  overflow-hidden  relative"
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                border: "2px dashed #ccc",
                padding: `${templateData?.barcodeState?.labelState?.padding?.top ?? 0}pt 
                          ${templateData?.barcodeState?.labelState?.padding?.right ?? 0}pt 
                          ${templateData?.barcodeState?.labelState?.padding?.bottom ?? 0}pt 
                          ${templateData?.barcodeState?.labelState?.padding?.left ?? 0}pt`,
                backgroundImage: templateData?.barcodeState?.labelState?.background_image
                  ? `url(${templateData?.barcodeState?.labelState?.background_image})`
                  : "none",
                backgroundPosition: ["cover", "contain", "stretch"].includes(templateData?.barcodeState?.labelState?.bg_image_position ?? "")
                  ? "center"
                  : templateData?.barcodeState?.labelState?.bg_image_position ?? "center",
                backgroundSize:
                  templateData?.barcodeState?.labelState?.bg_image_position === "cover"
                    ? "cover"
                    : templateData?.barcodeState?.labelState?.bg_image_position === "contain"
                      ? "contain"
                      : templateData?.barcodeState?.labelState?.bg_image_position === "stretch"
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
        width={300} // Initial width
        height={Infinity}
        minConstraints={[200, Infinity]} // Minimum width
        maxConstraints={[400, Infinity]} // Maximum width
        resizeHandles={[appState.appState.dir === "rtl" ? "e" : "w"]}
        handle={
          <div
            className={`custom-handle ${appState.appState.dir === "rtl" ? "ltr" : "rtl"
              }`}
          />
        }
        className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden"
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
            <Tabs value={value} onChange={handleTabChange}>
              <Tab label="Element" value="element" />
              <Tab label="Label" value="label" />
              <Tab label="Page" value="page" />
            </Tabs>
          </div>
          <Box>
            <Box hidden={value !== "element"}
              sx={{ maxHeight: 'calc(100vh)', pb: 2 }}>
              {selectedComponent && (
                <Box
                  sx={{ maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto', py: 2, spaceY: 2 }}
                  className="scrollbar scrollbar-thick scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto pr-1"
                // className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-1 "
                >
                  <Box sx={{ mb: 1 }}>

                    {selectedComponent.type === DesignerElementType.field ? (
                      <ERPDataCombobox
                        id="content"
                        value={selectedComponent.content}
                        data={selectedComponent}

                        label="Content"
                        field={{
                          id: "content",
                          valueKey: "value",
                          labelKey: "label",
                        }}
                        options={fields?.map((field, index) => ({
                          value: field,
                          label: field,
                        }))}
                        // onChange={(e) =>
                        //   handlePropertyChange("content", e.value)
                        // }
                        onChangeData={(data) =>
                          handlePropertyChange("content", data.content)
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
                  <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
                    <Box className="basis-2/3">
                      <ERPSlider
                        label="Rotate"
                        value={selectedComponent.rotate}
                        onChange={(e) =>
                          handlePropertyChange("rotate", e.target.valueAsNumber)
                        }
                        min={0}
                        max={360}
                      />
                    </Box>

                    <Box className="basis-1/3">
                      <ERPInput
                        id="rotate"
                        type="number"
                        label="Rotate"
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
                  <Box sx={{ mb: 1 }} className="flex justify-start gap-2 items-center">
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
                        max={200}
                      />
                    </Box>
                    <Box className="basis-1/3">

                      <ERPInput
                        id="width"
                        type="number"
                        label="Width"
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
                  <Box>


                    <ERPSlider
                      label="Height"
                      value={selectedComponent.height}
                      onChange={(e) =>
                        handlePropertyChange(
                          "height",
                          e.target.valueAsNumber
                        )
                      }
                      min={10}
                      max={200}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    {selectedComponent.type !== DesignerElementType.barcode && (
                      <ERPInput
                        id="height"
                        type="number"
                        label="Height"
                        value={selectedComponent.height}
                        data={selectedComponent}
                        onChange={(e) =>
                          handlePropertyChange(
                            "height",
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    )}
                  </Box>
                  <Box sx={{ mb: 1 }} hidden={selectedComponent.type === DesignerElementType.barcode}>

                    <ERPDataCombobox
                      id="font"
                      value={selectedComponent.font}
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
                  <Box sx={{ mb: 1 }}>
                    {selectedComponent.type !== DesignerElementType.barcode && (
                      <div className="flex flex-col gap-2">
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
                            <button
                              className={`ti-btn ${selectedComponent.fontStyle ===
                                "bold"
                                ? "ti-btn-primary-full"
                                : "bg-slate-100 hover:bg-slate-200 text-black"
                                } px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange("fontStyle", "bold")
                              }
                            >
                              Bold
                            </button>
                            <button
                              className={`ti-btn ${selectedComponent.fontStyle ===
                                "normal"
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
                              className={`ti-btn ${selectedComponent.fontStyle ===
                                "italic"
                                ? "ti-btn-primary-full"
                                : "bg-slate-100 hover:bg-slate-200 text-black"
                                } px-4 py-2 w-full`}
                              onClick={() =>
                                handlePropertyChange(
                                  "fontStyle",
                                  "italic"
                                )
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
                            id="format"
                            value={selectedComponent.barcodeProps.format}
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
                            value={selectedComponent.barcodeProps.font}
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
                          {/* <div className="flex space-x-2">
                          <Button
                            bg-slate-100
                            hover:bg-slate-200
                            text-black={
                              selectedComponent.barcodeProps.fontStyle ===
                              "bold"
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() =>
                              handleBarcodePropertyChange("fontStyle", "bold")
                            }
                          >
                            Bold
                          </Button>
                          <Button
                            bg-slate-100
                            hover:bg-slate-200
                            text-black={
                              selectedComponent.barcodeProps.fontStyle ===
                              "italic"
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() =>
                              handleBarcodePropertyChange("fontStyle", "italic")
                            }
                          >
                            Italic
                          </Button>
                        </div> */}
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
            <Box hidden={value !== "label"}>

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
                    handleLabelPropsChange("columnsPerRow", e.target.value)
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
                    debugger;
                    handleLabelPropsChange("rowsPerPage", e.target.value);
                  }}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <ERPInput
                  id="labelWidth"
                  label="Label Width"
                  value={templateData?.barcodeState?.labelState?.labelWidth}
                  data={templateData}
                  onChange={(e) => {
                    handleLabelPropsChange("labelWidth", e.target.value);
                  }}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <ERPInput
                  id="labelHeight"
                  label="Label  Height"
                  value={templateData?.barcodeState?.labelState?.labelHeight}
                  data={templateData}
                  onChange={(e) =>
                    handleLabelPropsChange("labelHeight", e.target.value)
                  }
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <div className="flex flex-col gap-3">
                  <div className="text-xs">Background Image</div>
                  <ERPInput
                    id='background_image'
                    type="file"
                    ref={inputFile}
                    onChange={(e: any) => {

                      debugger;
                      if (e.target.files[0].size > 2097152) {
                        ERPToast.showWith("Maximum file size allowed is 2 MB, please try with different file.", "warning");
                      } else {

                        handleImagePropsChange('background_image', e.target.files[0]);
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
                      className={`text-xs border rounded px-1 py-2 text-center bg-[#F1F5F9] cursor-pointer ${templateData?.barcodeState?.labelState?.background_image ? "hidden" : ""}`}
                    >
                      Choose from Desktop</div>
                  </label>

                  {templateData?.barcodeState?.labelState?.background_image &&
                    <>
                      <div className="text-xs bg-[#FEF4EA] px-2 py-2 rounded">Click Save to apply the selected background image</div>
                      {templateData?.barcodeState?.labelState?.background_image && <img
                        draggable={false}
                        src={templateData?.barcodeState?.labelState?.background_image}
                        alt="background_image"
                        height={100} width={100}
                        className="size-5" />
                      }
                      <div
                        className="text-accent text-xs cursor-pointer  max-w-min"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </div>
                      <div className="font-light text-sm">Image Position</div>
                      <ERPDataCombobox
                        noLabel
                        id="bg_image_position"
                        value={templateData?.barcodeState?.labelState?.bg_image_position}
                        data={templateData?.barcodeState?.labelState}
                        defaultValue={templateData?.barcodeState?.labelState?.labelHeight ?? "top left"}
                        onChange={(e) =>
                          handleLabelPropsChange("bg_image_position", e.value)
                        }
                        field={{
                          id: "bg_image_position",
                          valueKey: "value",
                          labelKey: "label",
                        }}
                        options={[
                          { label: "Top Left", value: "top left" },
                          { label: "Top Center", value: "top center" },
                          { label: "Top Right", value: "top right" },
                          { label: "Center Left", value: "center left" },
                          { label: "Center Center", value: "center center" },
                          { label: "Center Right", value: "center right" },
                          { label: "Bottom Left", value: "bottom left" },
                          { label: "Bottom Center", value: "bottom center" },
                          { label: "Bottom Right", value: "bottom right" },
                          { label: "Stretch", value: "stretch" },
                          { label: "Contain", value: "contain" },
                          { label: "Cover", value: "cover" }
                        ]}
                      />

                    </>}
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
                  htmlFor="margin"
                >
                  Padding (pt)
                </InputLabel>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                >
                  {(["top", "left", "right", "bottom"] as PaddingMarginSides[]).map((side) => (
                    <ERPInput
                      id={side}
                      label={side.charAt(0).toUpperCase() + side.slice(1)}
                      key={side}
                      type="number"
                      placeholder={
                        side.charAt(0).toUpperCase() + side.slice(1)
                      }
                      value={templateData?.barcodeState?.labelState?.padding?.[side]}
                      data={templateData?.barcodeState?.labelState}
                      onChange={(e) =>
                        handleLabelPropsChange("padding", {
                          ...templateData?.barcodeState?.labelState?.padding,
                          [side]: parseInt(e.target.value),
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
                  {(["hgap", "vgap",] as GapSides[]).map((side) => (
                    <ERPInput
                      id={side}
                      label={side.charAt(0).toUpperCase() + side.slice(1)}
                      key={side}
                      type="number"
                      placeholder={
                        side.charAt(0).toUpperCase() + side.slice(1)
                      }
                      value={templateData?.barcodeState?.labelState?.gap?.[side]}
                      data={templateData?.barcodeState?.labelState}
                      onChange={(e) =>
                        handleLabelPropsChange("gap", {
                          ...templateData?.barcodeState?.labelState?.gap,
                          [side]: parseInt(e.target.value),
                        })
                      }
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            <Box hidden={value !== "page"}>
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

                {templateData?.propertiesState?.pageSize === "Custom" && (
                  <Box sx={{ mb: 1 }}>
                    <div className="flex justify-start items-center space-x-1">
                      <ERPInput
                        id="width"
                        label="Page Width"
                        value={templateData?.propertiesState?.width}
                        data={templateData?.propertiesState}
                        onChange={(e) => {
                          handlePagePropsChange("width", e.target.value);
                        }}
                      />
                      <ERPInput
                        id="height"
                        label="Page  Height"
                        value={templateData?.propertiesState?.height}
                        data={templateData?.propertiesState}
                        onChange={(e) =>
                          handlePagePropsChange("height", e.target.value)
                        }
                      />
                    </div>
                  </Box>
                )}


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
                    {(["top", "left", "right", "bottom"] as PaddingMarginSides[]).map((side) => (
                      <ERPInput
                        id={side}
                        label={side.charAt(0).toUpperCase() + side.slice(1)}
                        key={side}
                        type="number"
                        placeholder={
                          side.charAt(0).toUpperCase() + side.slice(1)
                        }
                        value={templateData?.propertiesState?.margins?.[side]}
                        data={templateData?.propertiesState}
                        onChange={(e) =>
                          handlePagePropsChange("margins", {
                            ...templateData?.propertiesState?.margins,
                            [side]: parseInt(e.target.value),
                          })
                        }
                      />
                    ))}
                  </Box>
                </Box>
                {/* <Box sx={{ mb: 1 }}>
                <ERPInput
                  id="borderColor"
                  label="Border Color"
                  type="color"
                  value={templateData?.propertiesState?.borderColor}
                  data={templateData?.propertiesState}
                  onChange={(e) =>
                    handlePagePropsChange("borderColor", e.target.value)
                  }
                />
              </Box> */}

                <Box sx={{ mb: 1 }}>
                  <ERPDataCombobox
                    id="printer"
                    value={templateData?.propertiesState?.printer}
                    data={templateData?.propertiesState}
                    label="Printer"
                    field={{
                      id: "printer",
                      valueKey: "value",
                      labelKey: "value",
                    }}
                    options={printers?.map((printer) => ({
                      value: printer,
                      label: printer,
                    }))}
                    onChange={(e) => handlePagePropsChange("printer", e.value)}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </div>
      </ResizableBox>

      {/* Save Dialog */}

      {/* Preview Dialog */}
      <ERPModal
        title="Preview"
        isOpen={isPreviewOpen}
        closeModal={() => setIsPreviewOpen(false)}
        content={
          <div
            className="bg-white p-4"
            style={{
              width: "8.5in",
              height: "11in",
              margin: `${templateData?.propertiesState?.margins?.top}pt ${templateData?.propertiesState?.margins?.right}pt ${templateData?.propertiesState?.margins?.bottom}pt ${templateData?.propertiesState?.margins?.left}pt`,
            }}
          >
            {templateData?.barcodeState?.placedComponents?.map(renderComponent)}
          </div>
        }
      />
    </div>
  );
}
