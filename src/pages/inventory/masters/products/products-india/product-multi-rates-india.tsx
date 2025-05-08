import { useEffect, useMemo, useState } from "react";
import DataGrid, { Column, FilterRow, HeaderFilter, Scrolling, KeyboardNavigation, Editing, } from "devextreme-react/data-grid";
import React from "react";
import { FormField } from "../../../../../utilities/form-types";
import { PathValue, productDto, ProductFieldPath, ProductPriceInputDto, } from "../products-type";
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

const MultiRates: React.FC<{
  t: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField;
  isGlobal: boolean;
}> = React.memo(({ t, handleFieldChange, getFieldProps, isGlobal }) => {
  // Add a ref to access DataGrid instance
  const dataGridRef = React.useRef<any>(null);
  const initialFocusDone = React.useRef(false);
  const [data, setData] = useState<ProductPriceInputDto[]>([]);
  const allColumns = useMemo<ColumnDefinition[]>(
    () => [
      {
        dataField: "siNo",
        caption: t("SiNo"),
        dataType: "string" as const,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
        allowEditing: false,
      },
      {
        dataField: "priceCategory",
        caption: t("price_category"),
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
        // width: 200,
      },
      {
        dataField: "unitID",
        caption: t("unit_id"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
        width: 200,
        visible: false,
      },
      {
        dataField: "unit",
        caption: t("unit"),
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
        width: 80,
        visible: true,
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
      },
      {
        dataField: "msp",
        caption: t("msp"),
        dataType: "string" as const,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
        width: 100,
        visible: false,
      },
      {
        dataField: "salesPrice",
        caption: t("sales_rate"),
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
        // width: 80,
      },
      {
        dataField: "discountPerc",
        caption: t("sales_disc_%"),
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible: false,
        allowEditing: true,
        // width: 80,
      },
      {
        dataField: "purchasePrice",
        caption: t("purchase_rate"),
        dataType: "string" as const,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible: false,
        allowEditing: true,
        // width: 80,
      },
    ], [t]
  );

  // Filter columns based on isGlobal
  const columns = useMemo(() => {
    if (!isGlobal) {
      // When isGlobal is true, only show siNo, categoryName, unitID, and mrp columns
      return allColumns.filter((column) => !["mrp"].includes(column.dataField));
    }
    return allColumns; // Show all columns when isGlobal is false
  }, [allColumns, isGlobal]);

  const fetchData = async () => {
    debugger;
    const responseData = getFieldProps("prices")
      .value as ProductPriceInputDto[];
    const updatedData = responseData.map((item, index) => ({
      ...item,
      slNo: index + 1,
    }));
    setData(updatedData);
    return updatedData;
  };

  useEffect(() => {
    fetchData();
  }, [getFieldProps("prices").value]);

  const handleContentReady = (e: any) => {
    if (!initialFocusDone.current) {
      initialFocusDone.current = true;
      setTimeout(() => {
        e.component.editCell(0, "salesPrice");
      }, 100);
    }
  };

  return (
    <div id="grd_multiRatesIndia" className="grid grid-cols-1 gap-3">
      <DataGrid
        dataSource={data}
        onSaving={async (e) => {
          const _unts = await fetchData();
          if (e.changes.length > 0) {
            const changes = e.changes[0];
            if (changes.type === "update") {
              if ("salesPrice" in changes.data) {
                const finalSalesPrice = e.changes[0].data.salesPrice ?? 0;
                const finalMrp = e.changes[0].data.mrp ?? 0;
                if (finalSalesPrice > finalMrp) {
                  ERPAlert.show({
                    title: t("warning"),
                    text: `${t("sales_price")} (${finalSalesPrice}) > ${t(
                      "mrp"
                    )} (${finalMrp}). ${t("mrp_must_be_greater_or_equal")}`,
                    icon: "warning",
                    onConfirm: () => {
                      return;
                    },
                  });
                  return; // Stop further processing
                }
              }
              debugger;
              const updatedUnits = [..._unts];
              const index = _unts.findIndex(
                (u: any) => u.unitID === changes.key?.unitID && u.priceCategoryID === changes.key?.priceCategoryID
              );
              updatedUnits[index] = {
                ...updatedUnits[index],
                ...changes.data,
              };
              // setUnits(updatedUnits);
              handleFieldChange("prices", [...updatedUnits]);
              
            }
          }
        }}
        onContentReady={handleContentReady}
        // onRowUpdating={handleRowUpdating}
        columnAutoWidth={true}
        height={800}
        showBorders={true}
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

      {/* <DataGrid
            ref={dataGridRef}
            dataSource={[{ id: 1, salesPrice: 100 }]}
            onContentReady={(e) => {
              setTimeout(() => {
              e.component.editCell(0, "salesPrice");
            }, 100);
          }}>

          <Column dataField="salesPrice" allowEditing={true} />
          <Editing allowUpdating={true} mode="cell" />
          </DataGrid> */
      }
    </div>
  );
});

export default MultiRates;
