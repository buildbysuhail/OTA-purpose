import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DataGrid, { Column, FilterRow, HeaderFilter, Scrolling, KeyboardNavigation, Editing } from "devextreme-react/data-grid";
import { data } from "react-router-dom";
import React from "react";
import { FormField } from "../../../../../utilities/form-types";
import { PathValue, productDto, ProductFieldPath, ProductPriceInputDto } from "../products-type";
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
       
            onRowUpdating={(e) => {
                const newData = e.newData;
                const index = data.findIndex(item => item.unitID === e.key.unitID);   
                if (index !== -1) {
                  const updatedData = [...data];
                  updatedData[index] = {
                    ...updatedData[index], // Keep existing properties
                    ...newData           // Apply new changes
                  };

                  setData(updatedData);
                  handleFieldChange("prices", updatedData);
                }
              }}
             columnAutoWidth={true} height={800} showBorders={true}>
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <Scrolling mode="virtual" />
                <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={"moveFocus"}
                    enterKeyDirection={"row"}
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
