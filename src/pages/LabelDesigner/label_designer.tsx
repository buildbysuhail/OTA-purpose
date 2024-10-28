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
import { setTemplate } from "../../redux/slices/templates/reducer";
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
      defaultContent: "Text Field",
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
      defaultContent: "Select Field",
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
              font: "monospace",
              fontSize: 21,
              textMargin: 3,
              fontStyle: "normal",
            },
          }),
        };

        const placedComponents = [
          ...(templateData?.barcodeState?.PlasedComponents || []),
          newComponent,
        ];
        setTemplateData((prev: TemplateState) => ({
          ...prev,
          barcodeState: {
            ...prev.barcodeState,
            PlasedComponents: placedComponents, // Ensure the name matches the interface
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
    debugger;
    if (
      selectedComponent &&
      selectedComponent.type === DesignerElementType.barcode &&
      selectedComponent.barcodeProps
    ) {
      const updatedComponents =
        templateData?.barcodeState?.PlasedComponents?.map((comp) =>
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
          PlasedComponents: updatedComponents || [], // Use an empty array if undefined
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
        templateData?.barcodeState?.PlasedComponents?.map((comp) =>
          comp.id === draggingComponent.id
            ? { ...comp, x: newX, y: newY }
            : comp
        );
      setTemplateData((prev: TemplateState) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          PlasedComponents: updatedComponents || [], // Use an empty array if undefined
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
    const outData = { ...templateData, thumbImage: dataUrl };
    var res = await api.postAsync(Urls.templates, outData);
    debugger;
    setLoading(false);
    handleResponse(res, () => {
      navigate(`/templates?template_group=barcode`);
    });
    setLoading(false);
  };
  const manageSaveTemplate = async () => {
    debugger;
    if (!templateData?.propertiesState?.templateName) {
      ERPToast.show("Template name is required", "error");
    } else {
      const node = document.getElementById("teplate-container");
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
    debugger;
    setTemplateData((prev: TemplateState) => ({
      ...prev,
      propertiesState: { ...prev.propertiesState, [property]: value },
    }));
  };

  const handleLabelPropsChange = (property: keyof LabelState, value: any) => {
    setTemplateData((prev: any) => ({
      ...prev,
      barcodeState: {
        ...prev.barcodeState,
        LabelState: {
          ...prev.barcodeState?.LabelState,
          [property]: value,
        },
      },
    }));
  };

  type PaddingMarginSides = "top" | "right" | "bottom" | "left";

  const [barcodeErrors, setBarcodeErrors] = useState<any>([]);

  const generateBarcode = useCallback((component: PlacedComponent) => {
    debugger;
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
            height: component.barcodeProps.height,
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
    debugger;
    if (id !== "new") getPDFTemplateData();
  }, []);
  const handlePropertyChange = (
    property: keyof PlacedComponent,
    value: string | number
  ) => {
    debugger;
    if (selectedComponent) {
      const updatedComponent = { ...selectedComponent, [property]: value };
      const updatedComponents =
        templateData?.barcodeState?.PlasedComponents?.map((comp) =>
          comp.id === selectedComponent.id ? updatedComponent : comp
        );
      setTemplateData((prev: TemplateState) => ({
        ...prev,
        barcodeState: {
          ...prev.barcodeState,
          PlasedComponents: updatedComponents || [], // Use an empty array if undefined
        },
      }));
      setSelectedComponent(updatedComponent);
      generateBarcode(updatedComponent);
    }
  };
  useEffect(() => {
    debugger;
    templateData?.barcodeState?.PlasedComponents?.forEach(generateBarcode);
  }, [templateData?.barcodeState?.PlasedComponents, barcodeErrors]);

  const renderComponent = (component: PlacedComponent) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${component.x}px`,
      top: `${component.y}px`,
      width:
        component.type == DesignerElementType.barcode
          ? "auto"
          : `${component.width}px`,
      height:
        component.type == DesignerElementType.barcode
          ? "auto"
          : `${component.height}px`,
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
                  width={component.width}
                  height={component.height}
                />
              </>
            ) : (
              <canvas
                ref={(el) => (barcodeRefs.current[component.id] = el)}
                width={component.width}
                height={component.height}
              />
            )}
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
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              {component.content}
            </div>
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
            className={`custom-handle ${
              appState.appState.dir === "rtl" ? "rtl" : "ltr"
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
      <div className="flex-1 flex flex-col" style={{ height: "100%" }}>
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <button className="p-1 hover:bg-gray-100 rounded">
              <Menu className="w-4 h-4" />
            </button> */}
            <div className="flex items-center space-x-1">
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
            </div>
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
                    PlasedComponents: [], // Use an empty array if undefined
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
          className="flex-1 bg-gray-50"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            width: templateData.propertiesState?.width,
            height: templateData.propertiesState?.height ?? "11in",
            border: "2px solid black",
          }}
        >
          
          <ResizableBox
            width={templateData?.barcodeState?.LabelState?.labelWidth??300} // Initial width
            height={templateData?.barcodeState?.LabelState?.labelHeight??200}
            minConstraints={[150, Infinity]} // Minimum width
            maxConstraints={[Infinity, Infinity]} // Maximum width
            resizeHandles={[appState.appState.dir === "rtl" ? "sw" : "se"]}
            // handle={
            //   <div
            //     className={`custom-handle horizontal bottom  corner se ${
            //       appState.appState.dir === "rtl" ? "rtl" : "ltr"
            //     }`}
            //   />
            // }
            handle={
              <div
                className={`custom-handle ${
                  appState.appState.dir === "rtl" ? "ltr" : "rtl"
                }`}
              />
            }
            className="text-card-foreground "
          >
            <div
              ref={canvasRef}
              id="teplate-container"
              className="bg-white shadow-sm mx-auto max-h-[calc(100vh-8rem)] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100  relative"
              style={{
                width: '100%',
                height:
                  templateData.barcodeState?.LabelState?.labelHeight ?? "11in",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                border: "2px dashed #ccc",
                margin: `${templateData?.propertiesState?.margins?.top}px 0px 0px ${templateData?.propertiesState?.margins?.left}px`,
              }}
            >
              {templateData?.barcodeState?.PlasedComponents?.map(
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
            className={`custom-handle ${
              appState.appState.dir === "rtl" ? "ltr" : "rtl"
            }`}
          />
        }
        className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-4 h-full overflow-y-auto">
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
          <Box className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-1 ">
            <Box hidden={value !== "element"}>
              {selectedComponent && (
                <Box sx={{ spacey: 2, pb: 2 }}>
                  <Box>
                    {/* <InputLabel htmlFor="content"  className="text-[8px] font-bold text-blue-500">Content</InputLabel> */}
                    {selectedComponent.type === DesignerElementType.field ? (
                      <ERPDataCombobox
                        id="content"
                        value={selectedComponent.content}
                        data={selectedComponent}
                        label="Content"
                        field={{
                          id: "blockOnCreditLimit",
                          valueKey: "value",
                          labelKey: "value",
                        }}
                        options={fields?.map((field) => ({
                          value: field,
                          label: field,
                        }))}
                        onChange={(e) =>
                          handlePropertyChange("content", e.value)
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
                  <Box>
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
                  <Box>
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
                  <Box>
                    {selectedComponent.type !== DesignerElementType.barcode && (
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
                    )}
                  </Box>
                  <Box>
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
                  {selectedComponent.type === DesignerElementType.barcode &&
                    selectedComponent.barcodeProps && (
                      <div className="space-y-4">
                        <Box>
                          <ERPDataCombobox
                            id="format"
                            value={selectedComponent.barcodeProps.format}
                            data={selectedComponent}
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
                            onChange={(e) => {
                              debugger;
                              handleBarcodePropertyChange("format", e.value);
                            }}
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
                            label="Height"
                            value={selectedComponent.barcodeProps.height}
                            onChange={(e) =>
                              handleBarcodePropertyChange(
                                "height",
                                e.target.valueAsNumber
                              )
                            }
                            min={10}
                            max={200}
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
                            value={selectedComponent.barcodeProps.font}
                            data={selectedComponent}
                            label="Font"
                            field={{
                              id: "font",
                              valueKey: "value",
                              labelKey: "label",
                            }}
                            options={[
                              { value: "Monospace", label: "Monospace" },
                              { value: "Arial", label: "Arial" },
                              { value: "Helvetica", label: "Helvetica" },
                              { value: "Sans-serif", label: "Sans-serif" },
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
                          <div className="flex justify-between space-x-2">
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
              <Box sx={{ spaceY: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="ColumnsPerRow"
                    label="Columns Per Row"
                    type="number"
                    value={
                      templateData?.barcodeState?.LabelState?.ColumnsPerRow
                    }
                    data={templateData}
                    onChange={(e) =>
                      handleLabelPropsChange("ColumnsPerRow", e.target.value)
                    }
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="labelWidth"
                    label="Label Width"
                    value={templateData?.barcodeState?.LabelState?.labelWidth}
                    data={templateData}
                    onChange={(e) => {
                      debugger;
                      handleLabelPropsChange("labelWidth", e.target.value);
                    }}
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <ERPInput
                    id="labelHeight"
                    label="Label  Height"
                    value={templateData?.barcodeState?.LabelState?.labelHeight}
                    data={templateData}
                    onChange={(e) =>
                      handleLabelPropsChange("labelHeight", e.target.value)
                    }
                  />
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
                <Box sx={{ mb: 1 }}>
                  {/* <label htmlFor="page_size" className="font-light text-sm">
            Page Size
          </label> */}
                  <ERPDataCombobox
                    defaultValue={
                      templateData?.propertiesState?.pageSize ?? "A4"
                    }
                    // value={templateData?.propertiesState?.pageSize ?? "A4"}
                    field={{
                      id: "pageSize",
                      required: true,
                      valueKey: "value",
                      labelKey: "label",
                    }}
                    data={templateData?.propertiesState}
                    onChange={(e) => handlePagePropsChange("pageSize", e.value)}
                    id="pageSize"
                    options={pageSizeOptions}
                    label="Page Size"
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
                          debugger;
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

                {/* <Box>
                <InputLabel htmlFor="padding">Padding (px)</InputLabel>
                <Box
                  display="grid gap-2"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                >
                  {(
                    ["top", "right", "bottom", "left"] as PaddingMarginSides[]
                  )?.map((side) => (
                    <ERPInput
                      id={side}
                      label={side.charAt(0).toUpperCase() + side.slice(1)}
                      key={side}
                      type="number"
                      placeholder={side.charAt(0).toUpperCase() + side.slice(1)}
                      value={templateData?.propertiesState?.padding[side]}
                      data={templateData?.propertiesState}
                      onChange={(e) =>
                        handlePagePropsChange("padding", {
                          ...templateData?.propertiesState?.padding,
                          [side]: parseInt(e.target.value),
                        })
                      }
                    />
                  ))}
                </Box>
              </Box> */}
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
                    Margin (px)
                  </InputLabel>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={2}
                  >
                    {(["top", "left"] as PaddingMarginSides[]).map((side) => (
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
                    data={selectedComponent}
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
              margin: `${templateData?.propertiesState?.margins?.top}px ${templateData?.propertiesState?.margins?.right}px ${templateData?.propertiesState?.margins?.bottom}px ${templateData?.propertiesState?.margins?.left}px`,
            }}
          >
            {templateData?.barcodeState?.PlasedComponents?.map(renderComponent)}
          </div>
        }
      />
    </div>
  );
}
