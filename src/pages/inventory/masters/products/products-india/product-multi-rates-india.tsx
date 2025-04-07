import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DataGrid, { Column, FilterRow, HeaderFilter, Scrolling, KeyboardNavigation, Editing } from "devextreme-react/data-grid";
import { data } from "react-router-dom";
import React from "react";
import { FormField } from "../../../../../utilities/form-types";
import { PathValue, productDto, ProductFieldPath, ProductPriceInputDto } from "../products-type";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";
interface ColumnDefinition {
    dataField: string;
    caption: string;
    dataType?: "string" | "number" | "boolean" | "object" | "date" | "datetime";
    allowSorting?: boolean;
    allowSearch?: boolean;
    allowFiltering?: boolean;
    width?: number;
    allowEditing?: boolean;
    visible?: boolean;
  }

const MultiRatesIndia : React.FC<{
  t: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ t, handleFieldChange, getFieldProps }) => {
  // Add a ref to access DataGrid instance
const dataGridRef = React.useRef<any>(null);

    const [data, setData] = useState<ProductPriceInputDto[]>([]);
 const columns = useMemo<ColumnDefinition[]>(() => [
        {
            dataField: "siNo",
            caption: t("SiNo"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width:100,
            allowEditing:false
        },
        {
            dataField: "categoryName",
            caption: t("price_category"),
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            allowEditing:false
            // width: 200,
        },
        {
            dataField: "unitID",
            caption: t("unit_id"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            allowEditing:false,
            width: 200,
        },
        {
            dataField: "unitName",
            caption: t("unit"),
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            allowEditing:false,
            width: 80,
            visible:false
        },
        {
            dataField: "mrp",
            caption: t("mrp"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            allowEditing:true
        },
        {
            dataField: "msp",
            caption: t("msp"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            allowEditing:true,
            width: 100,
            visible:false
        },
        {
            dataField: "salesPrice",
            caption: t("sales_rate"),
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            allowEditing:true
            // width: 80,
        },
        {
            dataField: "discountPerc",
            caption: t("sales_disc_%"),
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            visible:false,
            allowEditing:true,
            // width: 80,
        },
        {
            dataField: "purchasePrice",
            caption: t("purchase_rate"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            visible:false,
            allowEditing:true,
           
            // width: 80,
        },
   
  
    ],
        [t]
    );
    const fetchData = async () => {
        debugger;
        const responseData = getFieldProps("prices").value as ProductPriceInputDto[];
  
        // Add slNo field to each item
        const updatedData = responseData.map((item, index) => ({
          ...item,
          slNo: index + 1,
        }));
  
        setData(updatedData);
        return updatedData;
      };
    useEffect(() => {      
    
        fetchData();
      }, []);
    // Load data from API
  //   const handleRowUpdating = (e: any) => {
  //     const newData = e.newData;
  //     const rowData = data.find(item => item.unitID === e.key.unitID); 
  //     if (!rowData) {
  //         e.cancel = true;
  //         return;
  //     }

  //     const proposedData: ProductPriceInputDto = {
  //         ...rowData,
  //         ...newData
  //     };

  //     if ('salesPrice' in newData || 'mrp' in newData) {
  //         const newSalesPrice = newData.salesPrice ?? rowData.salesPrice;
  //         const newMrp = newData.mrp ?? rowData.mrp;

  //         if (typeof newSalesPrice === 'number' && 
  //             typeof newMrp === 'number' && 
  //             newSalesPrice > newMrp) {
  //                // Store the original sales price before showing the alert
  //              const originalSalesPrice = rowData.salesPrice
  //               ERPAlert.show({
  //                 title: t("warning"),
  //                 text: `${t("sales_price")} (${newSalesPrice}) > ${t("mrp")} (${newMrp})`,
  //                 icon: "warning",
  //                 onConfirm: () => {
  //                   e.cancel = true;
                    
  //                   // Get the index of the row that was being edited
  //                   const index = data.findIndex(item => item.unitID === e.key.unitID);
  //                   if (index !== -1) {
  //                       // Create a copy of the data array
  //                       const updatedData = [...data];
                        
  //                       // Ensure the sales price is reverted to the original value
  //                       updatedData[index] = {
  //                           ...updatedData[index],
  //                           salesPrice: originalSalesPrice
  //                       };
                        
  //                       // Update the state and form data
  //                       setData(updatedData);
  //                       handleFieldChange("prices", updatedData);
  //                   }
  //                   return;
  //               },

  //             });
  //         }
  //     }

  //     const index = data.findIndex(item => item.unitID === e.key.unitID);
  //     if (index !== -1) {
  //         const updatedData = [...data];
  //         updatedData[index] = proposedData;
  //         setData(updatedData);
  //         handleFieldChange("prices", updatedData);
  //     }
  // };
  const handleRowUpdating = (e: any) => {
    const newData = e.newData
    const rowData = data.find((item) => item.unitID === e.key.unitID)
    if (!rowData) {
      e.cancel = true
      return
    }

    // Calculate the final values after the update
    const finalMrp = "mrp" in newData ? newData.mrp : rowData.mrp
    const finalSalesPrice = "salesPrice" in newData ? newData.salesPrice : rowData.salesPrice

    // Store original values for potential reversion
    const originalMrp = rowData.mrp
    const originalSalesPrice = rowData.salesPrice
    const index = data.findIndex((item) => item.unitID === e.key.unitID)
    // Check if the final state would be valid (MRP >= Sales Price)
    if (typeof finalMrp === "number" && typeof finalSalesPrice === "number" && finalSalesPrice > finalMrp) {
      ERPAlert.show({
        title: t("warning"),
        text: `${t("sales_price")} (${finalSalesPrice}) > ${t("mrp")} (${finalMrp}). ${t("mrp_must_be_greater_or_equal")}`,
        icon: "warning",
        onConfirm: () => {
          e.cancel = true
          // Get the index of the row that was being edited
          if (index !== -1) {
            // Determine which field was being edited and revert accordingly
            if ("mrp" in newData) {
              // If MRP was being edited, adjust the sales price to match MRP
              // This ensures MRP >= Sales Price
              const updatedData = [...data]
              updatedData[index] = {
                ...updatedData[index],
                mrp: originalMrp,
                salesPrice: originalSalesPrice,
              }

              setData(updatedData)
              handleFieldChange("prices", updatedData)

              // Update UI directly if needed
              // if (dataGridRef.current) {
              //   dataGridRef.current.instance.cellValue(index, "mrp", originalMrp)
              //   dataGridRef.current.instance.cellValue(index, "salesPrice", originalSalesPrice)
              // }
            } else if ("salesPrice" in newData) {
              // If sales price was being edited, revert to original sales price
              const updatedData = [...data]
              updatedData[index] = {
                ...updatedData[index],
                salesPrice: originalSalesPrice,
              }

              setData(updatedData)
              handleFieldChange("prices", updatedData)

              // // Update UI directly if needed
              // if (dataGridRef.current) {
              //   dataGridRef.current.instance.cellValue(index, "salesPrice", originalSalesPrice)
              // }
            }
          }
          return
        },
        onCancel: () => {
          e.cancel = true;
          const updatedData = [...data]
          updatedData[index] = {
            ...updatedData[index],
            mrp: originalMrp,
            salesPrice: originalSalesPrice,
          }

          setData(updatedData)
          handleFieldChange("prices", updatedData)
          return
        },
      })
      return // Stop further processing
    }

    // If we reach here, the update is valid
    const proposedData: ProductPriceInputDto = {
      ...rowData,
      ...newData,
    }
    if (index !== -1) {
      const updatedData = [...data]
      updatedData[index] = proposedData
      setData(updatedData)
      handleFieldChange("prices", updatedData)
    }
  }
    return (
        <div id="grd_multiRatesIndia" className="grid grid-cols-1 gap-3">
            <DataGrid  dataSource={data}
            //  onSaving={async (e) => {
          
            //     const _unts = await fetchData();
            //     if (e.changes.length > 0) {
            //       const changes = e.changes[0];
            //       if (changes.type === 'update') {
            //         const updatedUnits = [..._unts];
            //         const index = _unts.findIndex((u: any) => u.unitID === changes.key?.unitID);
            //         updatedUnits[index] = {
            //           ...updatedUnits[index],
            //           ...changes.data,
            //         };
            //         // setUnits(updatedUnits);
            //         handleFieldChange("prices",[...updatedUnits])
            //       }
            //     }
            //   }}
       
            onRowUpdating={handleRowUpdating}
             columnAutoWidth={true} height={800} showBorders={true}
             >
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <Scrolling mode="virtual" />
                <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={"moveFocus"}
                    enterKeyDirection={"column"}
                />
                {columns.map((col, index) => (
                    <Column
                        key={index}
                        dataField={col.dataField}
                        caption={col.caption}
                        dataType={col.dataType}
                        width={col.width}
                        visible={col.visible}
                        allowSorting={true}
                        allowEditing={col.allowEditing}
                        allowFiltering={true}
                    />
                ))}
                    <Editing
                  allowUpdating={true}
                  allowAdding={false}
                  allowDeleting={false}
                  mode="cell"
                />
            </DataGrid>
        </div>
    );
});

export default MultiRatesIndia;
