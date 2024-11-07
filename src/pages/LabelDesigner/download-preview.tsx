'use client'

import React, { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import JsBarcode from 'jsbarcode'
import { DesignerElementType, PlacedComponent, TemplateState } from "../InvoiceDesigner/Designer/interfaces"

export interface DownloadPreviewProps {
  template?: TemplateState
  data?: any[]
  docTitle?: string
}

export default function Component({ template, docTitle = "Document Preview", data }: DownloadPreviewProps = {}) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [chunkedData, setChunkedData] = useState<any[][]>([])

  useEffect(() => {
    const columnsPerRow = template?.barcodeState?.labelState?.columnsPerRow ?? 2
    const _chunkedData = data?.reduce((resultArray: any[][], item: any, index: number) => {
      const chunkIndex = Math.floor(index / columnsPerRow)
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, []) || []
    setChunkedData(_chunkedData)
  }, [data, template?.barcodeState?.labelState?.columnsPerRow])

  useEffect(() => {
    const generatePDF = async () => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [
          (template?.barcodeState?.labelState?.labelWidth ?? 100) * (template?.barcodeState?.labelState?.columnsPerRow ?? 1),
          (template?.barcodeState?.labelState?.labelHeight ?? 100) * (template?.barcodeState?.labelState?.rowsPerPage ?? 1)
        ]
      })

      for (let rowIndex = 0; rowIndex < chunkedData.length; rowIndex++) {
        if (rowIndex > 0) {
          pdf.addPage()
        }

        const row = chunkedData[rowIndex]
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const item = row[colIndex]
          const xOffset = colIndex * (template?.barcodeState?.labelState?.labelWidth ?? 100)
          const yOffset = 0 // Assuming one row per page

          if (template?.barcodeState?.placedComponents) {
            for (const component of template.barcodeState.placedComponents) {
              await renderComponent(pdf, component, item, xOffset, yOffset)
            }
          }
        }
      }

      const pdfBlob = pdf.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
    }

    generatePDF()
  }, [chunkedData, template])

  const renderComponent = async (pdf: jsPDF, component: PlacedComponent, data: any, xOffset: number, yOffset: number) => {
    const x = xOffset + (component.x || 0)
    const y = yOffset + (component.y || 0)

    switch (component.type) {
      case DesignerElementType.text:
      case DesignerElementType.field:
        pdf.setFont(component.font || 'helvetica', component.fontStyle || 'normal')
        pdf.setFontSize(component.fontSize || 12)
        pdf.text(component.content || '', x, y, {
          align: component.textAlign || 'left',
          angle: component.rotate || 0
        })
        break

      case DesignerElementType.barcode:
        if (component.barcodeProps) {
          const canvas = document.createElement('canvas')
          JsBarcode(canvas, data?.autoBarcode, {
            ...component.barcodeProps,
            format: component.barcodeProps?.format ?? "CODE128",
            width: component.barcodeProps?.barWidth || 2,
            height: component.barcodeProps?.height || 75,
            margin: component.barcodeProps?.margin || 0,
            background: component.barcodeProps?.background || "#FFFFFF",
            lineColor: component.barcodeProps?.lineColor || "#000000",
            displayValue: component.barcodeProps?.showText,
            textAlign: component.barcodeProps?.textAlign,
            font: "monospace",
            fontSize: component.barcodeProps?.fontSize || 21,
            textMargin: component.barcodeProps?.textMargin || 5,
          })
          const imgData = canvas.toDataURL('image/png')
          pdf.addImage(imgData, 'PNG', x, y, component.width || 50, component.height || 50, undefined, 'FAST')
        }
        break

      default:
        break
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="700px"
          style={{ border: 'none' }}
          title={docTitle}
        />
      )}
    </div>
  )
}