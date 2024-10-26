import { Document, Page, View, Text, StyleSheet, Font, Image, PDFViewer } from "@react-pdf/renderer";
import { TemplateGroupTypes } from "../InvoiceDesigner/constants/TemplateCategories";
import { TemplateState } from "../InvoiceDesigner/Designer/interfaces";
import React, { useState, useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'



enum DesignerElementType {
  text = 1,
  barcode = 2,
  field = 3,
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
    textAlign: "left" | "center" | "right";
    font: string;
    fontSize: number;
    textMargin: number;
    fontStyle: "normal" | "bold" | "italic";
  };
}


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  componentWrapper: {
    margin: 5,
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
  },
  barcode: {
    marginBottom: 5,
  },
})

// Demo data
const demoData = [
  { id: 1, name: "Product A", price: 10.99, sku: "SKU001" },
  { id: 2, name: "Product B", price: 15.99, sku: "SKU002" },
  { id: 3, name: "Product C", price: 7.99, sku: "SKU003" },
  { id: 4, name: "Product D", price: 12.99, sku: "SKU004" },
  { id: 5, name: "Product E", price: 9.99, sku: "SKU005" },
  { id: 6, name: "Product F", price: 14.99, sku: "SKU006" },
]
export interface DownloadPreviewProps {
  data: any;
  docTitle?: any;
  docIDKey?: string;
  currencySymbol?: string;
  template?: TemplateState;
  templateGroupId?: TemplateGroupTypes;
  templateImages?: any;
  currentBranch?: any;
}

type TemplatePageSizes = "A4" | "A5" | "LETTER" | { width: string | number; height?: string | number };

// Font.register({ family: 'Roboto', src: source });

export default function DownloadPreview({ data,
  template,
  docIDKey,
  docTitle,
  currencySymbol,
  templateGroupId,
  templateImages }: DownloadPreviewProps) {
  const [columnsPerRow, setColumnsPerRow] = useState(3)
  const [barcodeImages, setBarcodeImages] = useState<{ [key: number]: string }>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateBarcodeImages = async () => {
      const images: { [key: number]: string } = {}
      demoData.forEach((item, index) => {
        const barcodeComponent = template?.barcodeState ? template?.barcodeState[index % template?.barcodeState?.length]: null;
        if (barcodeComponent && barcodeComponent.type === DesignerElementType.barcode && barcodeComponent.barcodeProps) {
          const canvas = document.createElement('canvas')
          JsBarcode(canvas, item.sku, {
            ...barcodeComponent.barcodeProps,
            width: barcodeComponent.barcodeProps.barWidth,
            height: barcodeComponent.barcodeProps.height,
            displayValue: barcodeComponent.barcodeProps.showText,
          })
          images[item.id] = canvas.toDataURL('image/png')
        }
      })
      setBarcodeImages(images)
    }

    generateBarcodeImages()
  }, [template?.barcodeState])

  const chunkedData = demoData.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / columnsPerRow)
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [] as typeof demoData[])

  const PreviewDocument = () => (

    // let paperSize = (template?.propertiesState?.pageSize as TemplatePageSizes) || "A4";
    // if (template?.propertiesState?.pageSize === "3Inch") {
    //   paperSize = {
    //     width: 3 * 72, // 3 inches in points
    //   };
    // } else if (template?.propertiesState?.pageSize === "4Inch") {
    //   paperSize = {
    //     width: 4 * 72, // 4 inches in points
    //   };
    // }


    <Document>
      <Page size="A4" style={styles.page}>
        {chunkedData.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row?.map((item) => {
              const barcodeComponent = template?.barcodeState ? template?.barcodeState[item.id % template?.barcodeState?.length]: null
              return (
                <View key={item.id} style={[styles.componentWrapper, { width: `${100 / columnsPerRow}%` }]}>
                  <Text style={styles.text}>{item.name}</Text>
                  <Text style={styles.text}>Price: ${item.price.toFixed(2)}</Text>
                  <Text style={styles.text}>SKU: {item.sku}</Text>
                  {barcodeImages[item.id] && (
                    <View style={styles.barcode}>
                      <img src={barcodeImages[item.id]} style={{ width: '100%', height: 'auto' }} />
                    </View>
                  )}
                </View>
              )
            })
            }
          </View>
        ))}
      </Page>
    </Document>
  )

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-bold">{docTitle}</h1>
      <div className="flex items-center space-x-2">
        <label htmlFor="columnsPerRow">Columns per row:</label>
        <input
          id="columnsPerRow"
          type="number"
          value={columnsPerRow}
          onChange={(e) => setColumnsPerRow(parseInt(e.target.value, 10))}
          min={1}
          max={6}
          className="w-20"
        />
      </div>
      <button onClick={() => window.print()}>Print Preview</button>
      <PDFViewer width="100%" height={600}>
        <PreviewDocument />
      </PDFViewer>
    </div>
  )
}