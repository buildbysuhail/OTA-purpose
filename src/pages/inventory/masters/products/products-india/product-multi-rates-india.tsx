import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DataGrid, { Column, FilterRow, HeaderFilter, Scrolling } from "devextreme-react/data-grid";
import { data } from "react-router-dom";
import React from "react";
import { FormField } from "../../../../../utilities/form-types";
import { PathValue, productDto, ProductFieldPath, ProductPriceInputDto } from "../products-type";

const MultiRatesIndia : React.FC<{
  t: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ t, handleFieldChange, getFieldProps }) => {
    const [data, setData] = useState<ProductPriceInputDto[]>([]);
    const columns = useMemo(() => [
        {
            dataField: "siNo",
            caption: t("SiNo"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            // width: 40,
        },
        {
            dataField: "priceCategory",
            caption: t("price_category"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 120,
        },
        {
            dataField: "unit",
            caption: t("unit"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 80,
        },
        {
            dataField: "salesRate",
            caption: t("sales_rate"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            // width: 80,
        },
        {
            dataField: "salesDisc%",
            caption: t("sales_disc_%"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            // width: 80,
        },
        {
            dataField: "purchaseRate",
            caption: t("purchase_rate"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            // width: 80,
        },
        {
            dataField: "unitID",
            caption: t("unit_id"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "profitAddedToCost",
            caption: t("profit_(added_to_cost)"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            // width: 100,
        },
        {
            dataField: "MRP",
            caption: t("mrp"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
        },
        {
            dataField: "X",
            caption: t("x"),
            dataType: "string" as const,
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 40,
        },
    ],
        [t]
    );
    const fetchData = async () => {
        const responseData = getFieldProps("units").value as ProductPriceInputDto[];
  
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
             onSaving={async (e) => {
                debugger;
                const _unts = await fetchData();
                if (e.changes.length > 0) {
                  const changes = e.changes[0];
                  if (changes.type === 'update') {
                    const updatedUnits = [..._unts];
                    const index = _unts.findIndex((u: any) => u.slNo === changes.key?.slNo);
                    updatedUnits[index] = {
                      ...updatedUnits[index],
                      ...changes.data,
                    };
                    // setUnits(updatedUnits);
                    handleFieldChange("units",[...updatedUnits])
                  }
                }
              }}
             columnAutoWidth={true} height={800} showBorders={true}>
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <Scrolling mode="virtual" />
                {columns.map((col, index) => (
                    <Column
                        key={index}
                        dataField={col.dataField}
                        caption={col.caption}
                        dataType={col.dataType}
                        width={col.width}
                        allowSorting={true}
                        allowFiltering={true}
                    />
                ))}
            </DataGrid>
        </div>
    );
});

export default MultiRatesIndia;
