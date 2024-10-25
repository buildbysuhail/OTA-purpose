'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Settings, Plus, Minus, Menu, Edit, Scan, Save, Printer, Download } from 'lucide-react';
import JsBarcode from "jsbarcode";
import { ReactBarcode, Renderer } from 'react-jsbarcode';
import html2canvas from "html2canvas";
import save_svg from "../../assets/svg/save.svg";
import ERPModal from '../../components/ERPComponents/erp-modal';
import ERPDataCombobox from '../../components/ERPComponents/erp-data-combobox';
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
    Button
} from '@mui/material';
import jsPDF from 'jspdf';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import ERPSlider from '../../components/ERPComponents/erp-slider';
import ERPToast from '../../components/ERPComponents/erp-toast';
import { TemplateReducerState } from '../../redux/reducers/TemplateReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setTemplate } from '../../redux/slices/templates/reducer';
import Urls from '../../redux/urls';
import { APIClient } from '../../helpers/api-client';
import { handleResponse } from '../../utilities/HandleResponse';

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
        textAlign: 'left' | 'center' | 'right';
        font: string;
        fontSize: number;
        textMargin: number;
        fontStyle: 'normal' | 'bold' | 'italic';
    };
}

interface PageProps {
    padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    borderColor: string;
    printer: string;
}

interface SaveDialogProps {
    isOpen: boolean;
    onClose: () => void;
    components: PlacedComponent[];
    pageProps: PageProps;
}

interface PurchaseItem {
    id: number;
    productName: string;
    quantity: number;
    salesPrice: number;
    barcode: string;
}

const barcodeFormats = [
    'CODE128', 'CODE39', 'EAN13', 'EAN8', 'EAN5', 'EAN2', 'UPC', 'UPCE', 'ITF', 'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110', 'pharmacode', 'codabar'
];

const printers = ['Default Printer', 'HP LaserJet', 'Epson TM-T88V', 'Zebra ZD420'];

const initialPageProps: PageProps = {
    padding: { top: 10, right: 10, bottom: 10, left: 10 },
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    borderColor: '#000000',
    printer: 'Default Printer'
};

const samplePurchaseList: PurchaseItem[] = [
    { id: 1, productName: 'Product A', quantity: 5, salesPrice: 10.99, barcode: '123456789012' },
    { id: 2, productName: 'Product B', quantity: 3, salesPrice: 15.99, barcode: '234567890123' },
    { id: 3, productName: 'Product C', quantity: 2, salesPrice: 7.99, barcode: '345678901234' },
];

const SaveDialog: React.FC<SaveDialogProps> = ({ isOpen, onClose, components, pageProps }) => {
    return (
        <ERPModal
            title="Design Saved"
            isOpen={isOpen}
            closeModal={onClose}
            content={
                <div className="space-y-4">
                    <div className="font-medium text-lg">
                        Total Components: {components.length}
                    </div>
                    {components.map((comp) => (
                        <div key={comp.id} className="bg-gray-100 p-4 rounded-lg border">
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
                    <div className="mt-4">
                        <h3 className="font-semibold text-lg mb-2">Page Properties</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {pageProps != undefined &&
                                <>
                                    <div className="text-gray-600">Padding:</div>
                                    <div className="font-mono">{`${pageProps.padding.top}px ${pageProps.padding.right}px ${pageProps.padding.bottom}px ${pageProps.padding.left}px`}</div>
                                    <div className="text-gray-600">Margin:</div>
                                    <div className="font-mono">{`${pageProps.margin.top}px ${pageProps.margin.right}px ${pageProps.margin.bottom}px ${pageProps.margin.left}px`}</div>
                                    <div className="text-gray-600">Border Color:</div>
                                    <div className="font-mono">{pageProps.borderColor}</div>
                                    <div className="text-gray-600">Printer:</div>
                                    <div className="font-mono">{pageProps.printer}</div>
                                </>}
                        </div>
                    </div>
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
    'ProductName3', 'PurchaseCostCode', 'PurchasePriceCode', 'Qty', 'salesPrice', 'SalesPrice2', 'SalesPrice3', 'SalesPriceCode',
    'SalesPricePerUnit', 'SalesPriceWithVAT', 'SINo', 'SINo/Qty', 'Size', 'Specification', 'TextOnly', 'TransDate', 'Unit',
    'Unit2AutoBarcode', 'Unit2Barcode', 'Unit2BarcodeBarCode', 'Unit3AutoBarcode', 'Unit3Barcode', 'Unit3BarcodeBarCode', 'VAT%', 'VocuherNo'
];

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const PDFDocument: React.FC<{ components: PlacedComponent[], pageProps: PageProps }> = ({ components, pageProps }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                {components.map((comp) => (
                    <Text key={comp.id} style={{
                        position: 'absolute',
                        left: comp.x,
                        top: comp.y,
                        width: comp.width,
                        height: comp.height,
                    }}>
                        {comp.content}
                    </Text>
                ))}
            </View>
        </Page>
    </Document>
);

interface PDFDownloadButtonProps {
    components: PlacedComponent[];
    pageProps: PageProps;
}
const api = new APIClient();
export default function ExtendedPDFBarcodeDesigner() {
    const [zoom, setZoom] = useState(100);
    const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<PlacedComponent | null>(null);
    const [nextId, setNextId] = useState(1);
    const [draggingComponent, setDraggingComponent] = useState<PlacedComponent | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [pageProps, setPageProps] = useState<PageProps>(initialPageProps);
    const canvasRef = useRef<HTMLDivElement>(null);
    const barcodeRefs = useRef<(HTMLCanvasElement | null)[]>([]);
    const [value, setValue] = React.useState('element');
    const [selectedPurchaseItem, setSelectedPurchaseItem] = useState<PurchaseItem | null>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const templateData = useSelector((state: any) => state?.Template) as TemplateReducerState;
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
                            textMargin: 5,
                            fontStyle: "normal"
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



    const handleBarcodePropertyChange = (property: any, value: string | number | boolean) => {
        debugger;
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

    const [loading, setLoading] = useState(false);
    const handleSave = async (dataUrl: string) => {
        setIsSaveDialogOpen(true);
        const designData = {
            components: placedComponents,
            pageProps: pageProps,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('pdfDesignState', JSON.stringify(designData));
        const activeTemplate = {
            ...templateData.activeTemplate,
            thumbImage: dataUrl,
            propertiesState: {
                ...templateData.activeTemplate.propertiesState,
                template_group: "barcode"
            }

        }
        await dispatch(setTemplate(activeTemplate));
        setLoading(true);
        var res = await api.postAsync(Urls.templates, activeTemplate);
        debugger;
        setLoading(false);
        handleResponse(res, () => {
            ERPToast.show("Template saved successfully", "success");
            navigate(`/templates?template_group=barcode`);
        });
        setLoading(false);
    };
    const manageSaveTemplate = async () => {
        debugger;
        if (!templateData?.activeTemplate?.propertiesState?.templateName) {
            ERPToast.show("Template name is required", "error");
        } else {
            const node = document.getElementById("invoicePreview");
            if (node) {
                try {
                    const canvas = await html2canvas(node);
                    const dataUrl = canvas.toDataURL("image/png");
                    if (templateData?.activeTemplate && id === "new") await handleSave(dataUrl);
                } catch (error) {
                    console.error("Error capturing canvas:", error);
                }
            }
        }

    };
    const handlePagePropsChange = (property: keyof PageProps, value: any) => {
        setPageProps(prevProps => ({
            ...prevProps,
            [property]: value
        }));
    };

    const handleDownloadPDF = async () => {
        // Using jsPDF for custom PDF generation with barcode images
        const pdf = new jsPDF();

        for (const comp of placedComponents) {
            if (comp.type === DesignerElementType.barcode) {
                const canvas = document.createElement('canvas');
                JsBarcode(canvas, comp.content, comp.barcodeProps);
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', comp.x, comp.y, comp.width, comp.height);
            } else {
                pdf.text(comp.content, comp.x, comp.y);
            }
        }

        pdf.save('barcode-design-custom.pdf');
    };

    type PaddingMarginSides = 'top' | 'right' | 'bottom' | 'left';

    const [barcodeErrors, setBarcodeErrors] = useState<any>([]);

    const generateBarcode = useCallback((component: PlacedComponent) => {
        debugger
        if (component.type === DesignerElementType.barcode && component.barcodeProps) {
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
                    setBarcodeErrors((prevErrors: any[]) => {
                        return prevErrors.filter((x: any) => x.id !== component.id);
                    });

                } catch (error) {
                    console.error(`Error generating barcode for component ${component.id}:`, error);

                    // Add error to barcodeErrors
                    setBarcodeErrors((prevErrors: any[]) => [
                        ...prevErrors,
                        { id: component.id, error: 'Error generating barcode for component' }
                    ]);
                }

            }
        }
    }, [barcodeErrors]);
    const handlePropertyChange = (property: keyof PlacedComponent, value: string | number) => {
        debugger;
        if (selectedComponent) {
            const updatedComponent = { ...selectedComponent, [property]: value };
            const updatedComponents = placedComponents.map(comp =>
                comp.id === selectedComponent.id ? updatedComponent : comp
            );
            setPlacedComponents(updatedComponents);
            setSelectedComponent(updatedComponent);
            generateBarcode(updatedComponent);
        }
    };
    useEffect(() => {
        debugger;
        placedComponents.forEach(generateBarcode);
    }, [placedComponents, barcodeErrors]);

    const renderComponent = (component: PlacedComponent) => {
        const style: React.CSSProperties = {
            position: 'absolute',
            left: `${component.x}px`,
            top: `${component.y}px`,
            width: component.type == DesignerElementType.barcode ? 'auto' : `${component.width}px`,
            height: component.type == DesignerElementType.barcode ? 'auto' : `${component.height}px`,
            border: selectedComponent?.id === component.id ? '2px solid #2196f3' : component.type == DesignerElementType.barcode ? '' : '1px dashed #ccc',
            padding: component.type == DesignerElementType.barcode ? '0px' : '4px',
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
                        {barcodeErrors && barcodeErrors?.find((x: any) => x.id == component.id) ? (
                            <>
                                <div className="text-red-500 text-sm">{barcodeErrors?.find((x: any) => x.id == component.id).error}</div>
                                <canvas
                                    ref={el => (barcodeRefs.current[component.id] = el)}
                                    width={component.width}
                                    height={component.height}
                                />
                            </>
                        ) : (
                            <canvas
                                ref={el => (barcodeRefs.current[component.id] = el)}
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
            <div className="flex-1 flex flex-col">
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
                    <div className="flex space-x-2">
                        {/* <button onClick={() => setIsPreviewOpen(true)} className='bg-primary'>
                            Preview
                        </button> */}
                        <button
                            title="Save"
                            onClick={manageSaveTemplate}
                            className="flex gap-1 bg-primary text-white relative hover:bg-blue-600 bg-accent py-2 px-3 rounded disabled:bg-accent/60 overflow-hidden "
                        >
                            <img src={save_svg} className="w-5 h-5 text-red-500" /> <span className="text-sm">Save</span>
                            {loading && <div className=" bg-white top-2 left-2 h-5 w-5 rounded-full animate-ping absolute"></div>}
                        </button>
                        {/* <button onClick={handleDownloadPDF} className='bg-primary'>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </button> */}
                        {/* <PDFDownloadLink
                            document={<PDFDocument components={placedComponents} pageProps={pageProps} />}
                            fileName="barcode-design.pdf"
                            className="flex items-center px-3 py-2 bg-primary text-white rounded hover:bg-primary/90"
                        > */}
                        {/* {({ loading }) => (
        <>
          <Download className="w-4 h-4 mr-2" />
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </>
      )} */}
                        {/* </PDFDownloadLink> */}
                    </div>
                </div>

                {/* Design Canvas */}
                <div
                    className="flex-1 p-8 bg-gray-100 overflow-auto"
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
                            transformOrigin: 'top center',
                            padding: `${pageProps.padding.top}px ${pageProps.padding.right}px ${pageProps.padding.bottom}px ${pageProps.padding.left}px`,
                            margin: `${pageProps.margin.top}px ${pageProps.margin.right}px ${pageProps.margin.bottom}px ${pageProps.margin.left}px`,
                            border: `1px solid ${pageProps.borderColor}`
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
                <Box>
                    <Tabs value={value} onChange={handleTabChange}>
                        <Tab label="Element" value="element" />
                        <Tab label="Page" value="page" />
                    </Tabs>
                    <Box hidden={value !== 'element'}>
                        {selectedComponent && (
                            <Box sx={{ spaceY: 2 }}>
                                <Box>
                                    <InputLabel htmlFor="content">Content</InputLabel>
                                    {selectedComponent.type === DesignerElementType.field ? (
                                        <Select
                                            value={selectedComponent.content}
                                            onChange={(e) => handlePropertyChange('content', e.target.value)}
                                            fullWidth
                                        >
                                            {fields.map((field) => (
                                                <MenuItem key={field} value={field}>{field}</MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        <TextField
                                            id="content"
                                            value={selectedComponent.content}
                                            onChange={(e) => handlePropertyChange('content', e.target.value)}
                                            fullWidth
                                        />
                                    )}
                                </Box>
                                <Box>
                                    <InputLabel htmlFor="x">Position X</InputLabel>
                                    <TextField
                                        id="x"
                                        type="number"
                                        value={Math.round(selectedComponent.x)}
                                        onChange={(e) => handlePropertyChange('x', parseInt(e.target.value, 10))}
                                        fullWidth
                                    />
                                </Box>
                                <Box>
                                    <InputLabel htmlFor="y">Position Y</InputLabel>
                                    <TextField
                                        id="y"
                                        type="number"
                                        value={Math.round(selectedComponent.y)}
                                        onChange={(e) => handlePropertyChange('y', parseInt(e.target.value, 10))}
                                        fullWidth
                                    />
                                </Box>
                                <Box>
                                    <InputLabel htmlFor="width">Width</InputLabel>
                                    <TextField
                                        id="width"
                                        type="number"
                                        value={selectedComponent.width}
                                        onChange={(e) => handlePropertyChange('width', parseInt(e.target.value, 10))}
                                        fullWidth
                                    />
                                </Box>
                                <Box>
                                    <InputLabel htmlFor="height">Height</InputLabel>
                                    <TextField
                                        id="height"
                                        type="number"
                                        value={selectedComponent.height}
                                        onChange={(e) => handlePropertyChange('height', parseInt(e.target.value, 10))}
                                        fullWidth
                                    />
                                </Box>
                                {selectedComponent.type === DesignerElementType.barcode && selectedComponent.barcodeProps && (
                                    <div className="space-y-4">
                                        <Box>
                                            <InputLabel htmlFor="format">Barcode Format</InputLabel>
                                            <Select
                                                value={selectedComponent.barcodeProps.format}
                                                onChange={(e) => handleBarcodePropertyChange('format', e.target.value)}
                                                fullWidth
                                            >
                                                {barcodeFormats.map((format) => (
                                                    <MenuItem key={format} value={format}>{format}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>

                                        <Box>
                                            <InputLabel>Bar Width</InputLabel>
                                            <ERPSlider
                                                value={selectedComponent.barcodeProps.barWidth}
                                                onChange={(e) => handleBarcodePropertyChange('barWidth', e.target.valueAsNumber)}
                                                min={1}
                                                max={10}
                                            />
                                        </Box>

                                        <Box>
                                            <InputLabel>Height</InputLabel>
                                            <ERPSlider
                                                value={selectedComponent.barcodeProps.height}
                                                onChange={(e) => handleBarcodePropertyChange('height', e.target.valueAsNumber)}
                                                min={10}
                                                max={200}
                                            />
                                        </Box>

                                        <Box>
                                            <InputLabel>Margin</InputLabel>
                                            <ERPSlider
                                                value={selectedComponent.barcodeProps.margin}
                                                onChange={(e) => handleBarcodePropertyChange('margin', e.target.valueAsNumber)}
                                                min={0}
                                                max={50}
                                            />
                                        </Box>

                                        <Box>
                                            <InputLabel>Background Color</InputLabel>
                                            <TextField
                                                type="color"
                                                value={selectedComponent.barcodeProps.background}
                                                onChange={(e) => handleBarcodePropertyChange('background', e.target.value)}
                                                fullWidth
                                            />
                                        </Box>

                                        <Box>
                                            <InputLabel>Line Color</InputLabel>
                                            <TextField
                                                type="color"
                                                value={selectedComponent.barcodeProps.lineColor}
                                                onChange={(e) => handleBarcodePropertyChange('lineColor', e.target.value)}
                                                fullWidth
                                            />
                                        </Box>

                                        <Box className="flex space-x-4">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedComponent.barcodeProps.showText}
                                                        onChange={(e) => handleBarcodePropertyChange('showText', e.target.checked)}
                                                    />
                                                }
                                                label="Show Text"
                                            />
                                        </Box>

                                        <Box>
                                            <InputLabel>Text Align</InputLabel>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant={selectedComponent.barcodeProps.textAlign === 'left' ? 'contained' : 'outlined'}
                                                    onClick={() => handleBarcodePropertyChange('textAlign', 'left')}
                                                >
                                                    Left
                                                </Button>
                                                <Button
                                                    variant={selectedComponent.barcodeProps.textAlign === 'center' ? 'contained' : 'outlined'}
                                                    onClick={() => handleBarcodePropertyChange('textAlign', 'center')}
                                                >
                                                    Center
                                                </Button>
                                                <Button
                                                    variant={selectedComponent.barcodeProps.textAlign === 'right' ? 'contained' : 'outlined'}
                                                    onClick={() => handleBarcodePropertyChange('textAlign', 'right')}
                                                >
                                                    Right
                                                </Button>
                                            </div>
                                        </Box>

                                        <Box>
                                            <InputLabel>Font</InputLabel>
                                            <Select
                                                value={selectedComponent.barcodeProps.font}
                                                onChange={(e) => handleBarcodePropertyChange('font', e.target.value)}
                                                fullWidth
                                            >
                                                <MenuItem value="monospace">Monospace</MenuItem>
                                                <MenuItem value="arial">Arial</MenuItem>
                                                <MenuItem value="helvetica">Helvetica</MenuItem>
                                                <MenuItem value="sans-serif">Sans-serif</MenuItem>
                                            </Select>
                                        </Box>

                                        <Box>
                                            <InputLabel>Font Style</InputLabel>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant={selectedComponent.barcodeProps.fontStyle === 'bold' ? 'contained' : 'outlined'}
                                                    onClick={() => handleBarcodePropertyChange('fontStyle', 'bold')}
                                                >
                                                    Bold
                                                </Button>
                                                <Button
                                                    variant={selectedComponent.barcodeProps.fontStyle === 'italic' ? 'contained' : 'outlined'}
                                                    onClick={() => handleBarcodePropertyChange('fontStyle', 'italic')}
                                                >
                                                    Italic
                                                </Button>
                                            </div>
                                        </Box>

                                        <Box>
                                            <InputLabel>Font Size</InputLabel>
                                            <ERPSlider
                                                value={selectedComponent.barcodeProps.fontSize}
                                                onChange={(e) => handleBarcodePropertyChange('fontSize', e.target.valueAsNumber)}
                                                min={8}
                                                max={48}
                                            />
                                        </Box>

                                        <Box>
                                            <InputLabel>Text Margin</InputLabel>
                                            <ERPSlider
                                                value={selectedComponent.barcodeProps.textMargin}
                                                onChange={(e) => handleBarcodePropertyChange('textMargin', e.target.valueAsNumber)}
                                                min={-10}
                                                max={40}
                                            />
                                        </Box>
                                    </div>
                                )}
                            </Box>
                        )}
                    </Box>
                    <Box hidden={value !== 'page'}>
                        <Box sx={{ spaceY: 2 }}>
                            <Box>
                                <InputLabel htmlFor="padding">Padding (px)</InputLabel>
                                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                                    {(['top', 'right', 'bottom', 'left'] as PaddingMarginSides[]).map((side) => (
                                        <TextField
                                            key={side}
                                            type="number"
                                            value={pageProps.padding[side]}
                                            onChange={(e) => handlePagePropsChange('padding', { ...pageProps.padding, [side]: parseInt(e.target.value) })}
                                            placeholder={side.charAt(0).toUpperCase() + side.slice(1)}
                                            fullWidth
                                        />
                                    ))}
                                </Box>
                            </Box>
                            <Box>
                                <InputLabel htmlFor="margin">Margin (px)</InputLabel>
                                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                                    {(['top', 'right', 'bottom', 'left'] as PaddingMarginSides[]).map((side) => (
                                        <TextField
                                            key={side}
                                            type="number"
                                            value={pageProps.margin[side]}
                                            onChange={(e) => handlePagePropsChange('margin', { ...pageProps.margin, [side]: parseInt(e.target.value) })}
                                            placeholder={side.charAt(0).toUpperCase() + side.slice(1)}
                                            fullWidth
                                        />
                                    ))}
                                </Box>
                            </Box>
                            <Box>
                                <InputLabel htmlFor="borderColor">Border Color</InputLabel>
                                <TextField
                                    id="borderColor"
                                    type="color"
                                    value={pageProps.borderColor}
                                    onChange={(e) => handlePagePropsChange('borderColor', e.target.value)}
                                    fullWidth
                                />
                            </Box>
                            <Box>
                                <InputLabel htmlFor="printer">Printer</InputLabel>
                                <Select
                                    value={pageProps.printer}
                                    onChange={(e) => handlePagePropsChange('printer', e.target.value)}
                                    fullWidth
                                >
                                    {printers.map((printer) => (
                                        <MenuItem key={printer} value={printer}>{printer}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div>

            {/* Save Dialog */}
            <SaveDialog
                isOpen={isSaveDialogOpen}
                onClose={() => setIsSaveDialogOpen(false)}
                components={placedComponents}
                pageProps={pageProps}
            />

            {/* Preview Dialog */}
            <ERPModal
                title="Preview"
                isOpen={isPreviewOpen}
                closeModal={() => setIsPreviewOpen(false)}
                content={
                    <div className="bg-white p-4" style={{
                        width: '8.5in',
                        height: '11in',
                        padding: `${pageProps.padding.top}px ${pageProps.padding.right}px ${pageProps.padding.bottom}px ${pageProps.padding.left}px`,
                        margin: `${pageProps.margin.top}px ${pageProps.margin.right}px ${pageProps.margin.bottom}px ${pageProps.margin.left}px`,
                        border: `1px solid ${pageProps.borderColor}`
                    }}>
                        {placedComponents.map(renderComponent)}
                    </div>
                }
            />
        </div>
    );
}