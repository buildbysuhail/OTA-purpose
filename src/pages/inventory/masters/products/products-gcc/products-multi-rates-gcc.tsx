import { useEffect, useMemo, useState, useRef } from "react";
import React from "react";
import { FormField } from "../../../../../utilities/form-types";
import {
  PathValue,
  productDto,
  ProductFieldPath,
  ProductPriceInputDto,
} from "../products-type";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";

const MultiRatesGcc: React.FC<{
  t: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;
  getFieldProps: (fieldId: string, type?: string) => FormField;
  isGlobal: boolean;
  isMaximized?: boolean;
  modalHeight?: any;
}> = React.memo(({ t, handleFieldChange, getFieldProps, isGlobal, isMaximized, modalHeight }) => {
  const dataGridRef = React.useRef<any>(null);
  const initialFocusDone = React.useRef(false);
  const [data, setData] = useState<ProductPriceInputDto[]>([]);
  const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number }>({ mobile: 500, windows: 500 });
  const clientSession = useSelector((state: RootState) => state.ClientSession);

  // Compute grid height based on isMaximized and modalHeight
  useEffect(() => {
    let gridHeightMobile = modalHeight - 500;
    let gridHeightWindows = modalHeight - 300;
    setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
  }, [isMaximized, modalHeight]);

  // Define columns using DevGridColumn
  const allColumns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "slNo",
        caption: t("si_no"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        width: 80,
        allowEditing: false,
      },
      {
        dataField: "priceCategory",
        caption: t("price_category"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
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
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: false,
        width: 150,
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
        width: 150,
      },
      {
        dataField: "msp",
        caption: t("msp"),
        dataType: "string",
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
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
        width: 150,
      },
      {
        dataField: "discountPerc",
        caption: t("sales_disc_%"),
        dataType: "number",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible: true,
        allowEditing: true,
        width: 150,
      },
      {
        dataField: "purchasePrice",
        caption: t("purchase_rate"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
        visible: true,
        allowEditing: true,
        width: 150,
      },
    ],
    [t]
  );

  // Filter columns based on isGlobal
  const columns = useMemo(() => {
    if (!isGlobal) {
      return allColumns.filter((column) => !["mrp"].includes(column.dataField!));
    }
    return allColumns;
  }, [allColumns, isGlobal]);

  // Fetch data
  const fetchData = async () => {
    const responseData = getFieldProps("prices").value as ProductPriceInputDto[];
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

  // Handle grid initialization to focus on salesPrice
  const handleInitialized = (e: any) => {
    if (!initialFocusDone.current) {
      initialFocusDone.current = true;
      setTimeout(() => {
        e.component.editCell(0, "salesPrice");
        e.component.focus(e.component.getCellElement(0, "salesPrice"));
      }, 300);
    }
  };

  // Handle row saving with validation
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

  return (
    <div id="grd_multiRatesGcc" className="grid grid-cols-1 gap-3">
      <ErpDevGrid
        ref={dataGridRef}
        hideGridHeader={true}
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
        pageSize={20}
        heightToAdjustOnWindowsInModal={gridHeight.windows}
        gridId="product_multi_rates_gcc_grid"
      />
    </div>
  );
});

export default MultiRatesGcc;