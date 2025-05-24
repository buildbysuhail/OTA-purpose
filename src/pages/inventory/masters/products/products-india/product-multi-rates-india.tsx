import { useEffect, useMemo, useState } from "react";
import DataGrid, { Column, FilterRow, HeaderFilter, Scrolling, KeyboardNavigation, Editing, } from "devextreme-react/data-grid";
import React from "react";
import { FormField } from "../../../../../utilities/form-types";
import { PathValue, productDto, ProductFieldPath, ProductPriceInputDto, } from "../products-type";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";


const MultiRates: React.FC<{
  t: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField;
  isGlobal: boolean;
   isMaximized?: boolean;
    modalHeight?: any
}> = React.memo(({ t, handleFieldChange, getFieldProps, isGlobal,isMaximized,modalHeight }) => {
  // Add a ref to access DataGrid instance
  const dataGridRef = React.useRef<any>(null);
  const initialFocusDone = React.useRef(false);
  const [data, setData] = useState<ProductPriceInputDto[]>([]);
  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });
    useEffect(() => {
      let gridHeightMobile = modalHeight - 500;
      let gridHeightWindows = modalHeight - 500;
      setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
    }, [isMaximized, modalHeight]);

 const allColumns: DevGridColumn[] = useMemo(() => [
      {
        dataField: "slNo",
        caption: "#",
        dataType: "string" ,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 50,
        allowEditing: false,
      },
      {
        dataField: "priceCategory",
        caption: t("price_category"),
        dataType: "string" ,
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
        allowEditing: true,
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
     return allColumns.filter((column) => !["mrp"].includes(column.dataField!));
    }
    return allColumns;
  }, [allColumns, isGlobal]);

  const fetchData = async () => {
    
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


  const handleInitialized = (e: any) => {
  if (!initialFocusDone.current) {
    initialFocusDone.current = true;
    setTimeout(() => {
      e.component.editCell(0, "salesPrice");
      e.component.focus(e.component.getCellElement(0, "salesPrice"));
    }, 300);
  }
};

const handleRowSaving = async (e: any) => {
    const units = await fetchData();
    if (e.changes.length > 0) {
      const changes = e.changes[0];
      if (changes.type === "update") {
        if ("salesPrice" in changes.data) {
          const finalSalesPrice = changes.data.salesPrice ?? 0;
          const finalMrp = changes.data.mrp ?? 0;
          if (finalSalesPrice > finalMrp && clientSession.isAppGlobal) {
            ERPAlert.show({
              title: t("warning"),
              text: `${t("sales_price")} (${finalSalesPrice}) > ${t("mrp")} (${finalMrp}). ${t(
                "mrp_must_be_greater_or_equal"
              )}`,
              icon: "warning",
              onConfirm: () => {
                return;
              },
            });
            return; // Stop further processing
          }
        }
        const updatedUnits = [...units];
        const index = units.findIndex(
          (u: any) => u.unitID === changes.key?.unitID && u.priceCategoryID === changes.key?.priceCategoryID
        );
        if (index >= 0) {
          updatedUnits[index] = {
            ...updatedUnits[index],
            ...changes.data,
          };
          handleFieldChange(
            "prices",
            updatedUnits.map((item, index) => ({
              ...item,
              slNo: index + 1,
            }))
          );
        }
      }
    }
  };

  const clientSession = useSelector((state: RootState) => state.ClientSession);
  return (
    <div id="grd_multiRatesIndia" className="grid grid-cols-1 gap-3">
               <ErpDevGrid
                hideGridHeader={true}
                // hideDefaultSearchPanel={true}
                onInitialized={handleInitialized}
                onSaving={handleRowSaving}
                scrollingMode="virtual"
                    data={data}
                    columns={columns}
                    editMode="cell"
                    remoteOperations={false}
                    allowEditing={{
                      allow: true,
                      config: {
                      edit: true,
                      add: false,
                      delete: false,
                      },
                    }}

                      keyboardNavigation={{
                        editOnKeyPress: true,
                        enterKeyAction: "moveFocus",
                        enterKeyDirection: "column",
                        enabled: true,
                      }}

                    showBorders={true}
                    rowAlternationEnabled={true}
                    enableScrollButton={false}
                    hideDefaultExportButton={true}
                    hideGridAddButton={true}
                    ShowGridPreferenceChooser={false}
                    showPrintButton={false}
                    pageSize={100}
                     heightToAdjustOnWindowsInModal={gridHeight.windows}
                    gridId="product_multi_rates_grid"
                />
    </div>
  );
});

export default MultiRates;
