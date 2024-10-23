'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Settings, Plus, Minus, Menu, Edit, Scan, Save } from 'lucide-react';
import JsBarcode from "jsbarcode";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ERPModal from '../../components/ERPComponents/erp-modal';
import ERPDataCombobox from '../../components/ERPComponents/erp-data-combobox';

enum DesignerElementType {
  text = 1,
  barcode = 2,
  field = 3
}

interface PlacedComponent {
  id: number;
  type: DesignerElementType;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  barcodeProps?: {
    format: string;
    barWidth: number;
    height: number;
    margin: number;
    background: string;
    lineColor: string;
    showText: boolean;
    textAlign: string;
    font: string;
    fontSize: number;
    textMargin: number;
  };
}

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  components: PlacedComponent[];
}

const SaveDialog: React.FC<SaveDialogProps> = ({ isOpen, onClose, components }) => {
  return (
    <ERPModal
      title="Component Log"
      isOpen={isOpen}
      closeModal={onClose}
      content={
        <div className="space-y-4">
          <div className="font-medium text-lg">
            Total Components: {components.length}
          </div>
          {components.map((comp) => (
            <div key={comp.id} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-600">
                  {DesignerElementType[comp.type].toUpperCase()} #{comp.id}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Content:</div>
                <div className="font-mono">{comp.content}</div>
                <div className="text-gray-600">Position:</div>
                <div className="font-mono">({Math.round(comp.x)}, {Math.round(comp.y)})</div>
                <div className="text-gray-600">Dimensions:</div>
                <div className="font-mono">{comp.width}x{comp.height}</div>
                {comp.type === DesignerElementType.barcode && (
                  <>
                    <div className="text-gray-600">Barcode Format:</div>
                    <div className="font-mono">{comp.barcodeProps?.format}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
};

const fields = [
  '[Footer1]', '[Footer10]', '[Footer2]', '[Footer3]', '[Footer4]', '[Footer5]', '[Footer6]', '[Footer7]', '[Footer8]', '[Footer9]',
  '[Header1]', '[Header10]', '[Header2]', '[Header3]', '[Header4]', '[Header5]', '[Header6]', '[Header7]', '[Header8]', '[Header9]',
  'AliasName', 'ArabicName', 'AutoBarcode', 'AutoBarcodeText', 'BarCode', 'BarCodeText', 'Batch', 'BatchNo', 'Cost', 'ExpDate',
  'ExpDays', 'ExpiryDate', 'ExpiryDescription', 'GroupName', 'MBarcode', 'MBarcodeBarcode', 'MBarcodeBarCode2', 'MfdDate', 'MfgDate',
  'MRP', 'MRPCode', 'MRPPerUnit', 'MSP', 'MSPCode', 'NetWeight', 'Nutrient01', 'Nutrient02', 'Nutrient03', 'Nutrient04', 'Nutrient05',
  'Nutrient06', 'Nutrient07', 'Nutrient08', 'Nutrient09', 'Nutrient10', 'PackingDate', 'PackingQty2', 'PackingQty3', 'PartyCode',
  'PCodeBarCode', 'PrintDate', 'PrintTime', 'ProductCategoryName', 'ProductCode', 'ProductDescription', 'ProductName', 'ProductName2',
  'ProductName3', 'PurchaseCostCode', 'PurchasePriceCode', 'Qty', 'SalesPrice', 'SalesPrice2', 'SalesPrice3', 'SalesPriceCode',
  'SalesPricePerUnit', 'SalesPriceWithVAT', 'SINo', 'SINo/Qty', 'Size', 'Specification', 'TextOnly', 'TransDate', 'Unit',
  'Unit2AutoBarcode', 'Unit2Barcode', 'Unit2BarcodeBarCode', 'Unit3AutoBarcode', 'Unit3Barcode', 'Unit3BarcodeBarCode', 'VAT%', 'VocuherNo'
];

export default function PDFBarcodeDesigner() {
  const [zoom, setZoom] = useState(100);
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<PlacedComponent | null>(null);
  const [nextId, setNextId] = useState(1);
  const [draggingComponent, setDraggingComponent] = useState<PlacedComponent | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const barcodeRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const components = [
    { id: DesignerElementType.text, label: 'Text', icon: <Edit className="w-4 h-4" />, defaultContent: 'Text Field' },
    { id: DesignerElementType.barcode, label: 'Barcode', icon: <Scan className="w-4 h-4" />, defaultContent: '123456789012' },
    { id: DesignerElementType.field, label: 'Field', icon: <Menu className="w-4 h-4" />, defaultContent: 'Select Field' }
  ];

  const handleDragStart = (e: React.DragEvent, componentType: DesignerElementType) => {
    e.dataTransfer.setData('componentType', componentType.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = parseInt(e.dataTransfer.getData('componentType')) as DesignerElementType;
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    if (canvasRect) {
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;

      const component = components.find(c => c.id === componentType);
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
              format: 'CODE128',
              barWidth: 2,
              height: 75,
              margin: 16,
              background: "#FFFFFF",
              lineColor: "#000000",
              showText: true,
              textAlign: "center",
              font: "monospace",
              fontSize: 21,
              textMargin: 5
            }
          })
        };

        setPlacedComponents([...placedComponents, newComponent]);
        setNextId(nextId + 1);
      }
    }
  };

  const handleComponentClick = (component: PlacedComponent) => {
    setSelectedComponent(component);
  };

  const handlePropertyChange = (property: keyof PlacedComponent, value: string | number) => {
    if (selectedComponent) {
      const updatedComponents = placedComponents.map(comp =>
        comp.id === selectedComponent.id
          ? { ...comp, [property]: value }
          : comp
      );
      setPlacedComponents(updatedComponents);
      setSelectedComponent({ ...selectedComponent, [property]: value });
    }
  };

  const handleBarcodePropertyChange = (property: any, value: string | number | boolean) => {
    if (selectedComponent && selectedComponent.type === DesignerElementType.barcode && selectedComponent.barcodeProps) {
      const updatedComponents = placedComponents.map(comp =>
        comp.id === selectedComponent.id && comp.barcodeProps
          ? { ...comp, barcodeProps: { ...comp.barcodeProps, [property]: value } }
          : comp
      );
      setPlacedComponents(updatedComponents);
      setSelectedComponent({
        ...selectedComponent,
        barcodeProps: { ...selectedComponent.barcodeProps, [property]: value }
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

      const updatedComponents = placedComponents.map(comp =>
        comp.id === draggingComponent.id
          ? { ...comp, x: newX, y: newY }
          : comp
      );
      setPlacedComponents(updatedComponents);
      if (selectedComponent?.id === draggingComponent.id) {
        setSelectedComponent({ ...draggingComponent, x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingComponent(null);
  };

  const handleSave = () => {
    setIsSaveDialogOpen(true);
    const designData = {
      components: placedComponents,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('pdfDesignState', JSON.stringify(designData));
  };

  useEffect(() => {
    placedComponents.forEach((component) => {
      if (component.type === DesignerElementType.barcode) {
        const canvasElement = barcodeRefs.current[component.id];
        if (canvasElement) {
          JsBarcode(canvasElement, component.content, {
            ...component.barcodeProps,
            width: component.barcodeProps?.barWidth,
            height: component.barcodeProps?.height,
            displayValue: component.barcodeProps?.showText,
          });
        }
      }
    });
  }, [placedComponents]);

  const renderComponent = (component: PlacedComponent) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      width: `${component.width}px`,
      height: `${component.height}px`,
      border: selectedComponent?.id === component.id ? '2px solid #2196f3' : '1px dashed #ccc',
      padding: '4px',
      cursor: 'move',
      backgroundColor: 'white',
      userSelect: 'none'
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
            <canvas
              ref={el => (barcodeRefs.current[component.id] = el)}
              width={component.width}
              height={component.height}
            />
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
    <div className="flex h-screen bg-gray-100" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Left Sidebar - Components */}
      <div className="w-48 bg-white border-r border-gray-200 p-4">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Components</h2>
        </div>
        <div className="space-y-2">
          {components.map((component) => (
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

      {/* Main Design Area */}
      <div  className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              <button onClick={() => setZoom(zoom - 10)} className="p-1 hover:bg-gray-100 rounded">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm">{zoom}%</span>
              <button onClick={() => setZoom(zoom + 10)} className="p-1 hover:bg-gray-100 rounded">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button onClick={handleSave} className="bg-blue-500 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>

        {/* Design Canvas */}
        <div
          className="flex-1 p-8 bg-gray-50 overflow-auto"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div
            ref={canvasRef}
            className="bg-white shadow-sm mx-auto relative"
            style={{
              width: '8.5in',
              height: '11in',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center'
            }}
          >
            {placedComponents.map(renderComponent)}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-64 bg-white border-l border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Properties</h2>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        {selectedComponent && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-500">Content</label>
              {/* {selectedComponent.type === DesignerElementType.field ? (
                <ERPDataCombobox
                id='weds'
                value={selectedComponent.content}
                onChange={(value: any) => handlePropertyChange('content', value)}
                options={fields}
                ></ERPDataCombobox>
                <Select
                  value={selectedComponent.content}
                  onValueChange={(value: any) => handlePropertyChange('content', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <input
                  type="text"
                  value={selectedComponent.content}
                  onChange={(e) => handlePropertyChange('content', e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              )} */}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Position X</label>
              <input
                type="number"
                value={Math.round(selectedComponent.x)}
                onChange={(e) => handlePropertyChange('x', parseInt(e.target.value, 10))}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Position Y</label>
              <input
                type="number"
                value={Math.round(selectedComponent.y)}
                onChange={(e) => handlePropertyChange('y', parseInt(e.target.value, 10))}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Width</label>
              <input
                type="number"
                value={selectedComponent.width}
                onChange={(e) => handlePropertyChange('width', parseInt(e.target.value, 10))}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Height</label>
              <input
                type="number"
                value={selectedComponent.height}
                onChange={(e) => handlePropertyChange('height', parseInt(e.target.value, 10))}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </div>
            {selectedComponent.type === DesignerElementType.barcode && selectedComponent.barcodeProps && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Barcode Format</label>
                  <select
                    value={selectedComponent.barcodeProps.format}
                    onChange={(e) => handleBarcodePropertyChange('format', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  >
                    <option value="CODE128">CODE128</option>
                    <option value="EAN13">EAN13</option>
                    <option value="UPC">UPC</option>
                    <option value="CODE39">CODE39</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Bar Width</label>
                  <input
                    type="number"
                    value={selectedComponent.barcodeProps.barWidth}
                    onChange={(e) => handleBarcodePropertyChange('barWidth', parseInt(e.target.value, 10))}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Show Text</label>
                  <input
                    type="checkbox"
                    checked={selectedComponent.barcodeProps.showText}
                    onChange={(e) => handleBarcodePropertyChange('showText', e.target.checked)}
                    className="mr-2"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      <SaveDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        components={placedComponents}
      />
    </div>
  );
}