import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, } from "react";
import DataGrid, { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling, } from "devextreme-react/data-grid";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import {
  PathValue,
  productDto,
  ProductFieldPath,
  ProductPriceInputDto,
  ProductUnitInputDto,
} from "../products-type";
import { FormField } from "../../../../../utilities/form-types";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import ERPSubmitButton from "../../../../../components/ERPComponents/erp-submit-button";
import { APIClient } from "../../../../../helpers/api-client";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";
import { Barcode, X } from "lucide-react";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { loadMultiRateToGrid } from "../helper";

export interface ProductMultiUnitsIndiaRef {
  loadMultiRateToGrid: (
    obj: productDto,
    units: any
  ) => Promise<ProductPriceInputDto[]>;
}

const api = new APIClient();
const ProductMultiUnitsIndia = forwardRef<
  ProductMultiUnitsIndiaRef,
  {
    appSettings: ApplicationSettingsType;
    t: any;
    handleFieldChange: <Path extends ProductFieldPath>(
      fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
      value?: PathValue<productDto, Path>
    ) => void;
    getFieldProps: (fieldId: string, type?: string) => FormField | any;
    handleDataChange: (value?: any) => void;
  }
>(
  (
    { t, handleFieldChange, getFieldProps, handleDataChange, appSettings },
    ref
  ) => {
    const unitDAta: ProductUnitInputDto = {
      productUnitID: 0,
      productBatchID: 0,
      unitID: 0,
      unit: "",
      multiFactor: 0,
      barCode: "",
      description: "",
      descriptionFL: "",
      unitRemarks: "",
      gatePass: true,
      multiBarcodes: "",
      salesPrice: 0,
      mrp: 0,
      msp: 0,
    };

    const { getFormattedValue } = useNumberFormat();
    const [unit, setUnit] = useState<ProductUnitInputDto>(unitDAta);
    const [openMB, setOpenMB] = useState<{
      index: number;
      open: boolean;
      unit: string;
      data: { unit: string; barcode: String }[];
    }>({ index: 0, open: false, unit: "", data: [] });
    const multiUnitRef = useRef<any>(null);

    
    useImperativeHandle(ref, () => ({
      loadMultiRateToGrid: async (obj: productDto, units: any) => {
        return await loadMultiRateToGrid(obj, units,api, getFormattedValue);  
      },
    }));

    const handleAddUnit = async () => {
      debugger;
      const obj = getFieldProps("*");
      const updated = [...obj.units, unit];

      let selected = updated
        .filter((x) => x.unitID ?? 0 > 0)
        .map((x: any) => ({
          id: Number(x.unitID), // Ensure type matches: number
          name: String(x.unit), // Ensure type matches: string
        }));
      if (obj.product.basicUnitID) {
        const exists = selected?.some(
          (u: any) => u.id === Number(obj.product.basicUnitID)
        );
        if (!exists)
          selected = [
            ...(selected ?? []),
            {
              id: Number(obj.product.basicUnitID),
              name:
                units.find((x) => x.id == obj.product.basicUnitID)?.name ?? "", // Replace with the actual name if needed
            },
          ];
      }
      const unSelected = units
        .filter((x) => !selected.map((x) => x.id).includes(x.id ?? 0))
        .map((x: any) => ({
          id: Number(x.id), // Ensure type matches: number
          name: String(x.name), // Ensure type matches: string
        }));
      debugger;
      setSelectedUnits(selected);
      unSetSelectedUnits(unSelected);

      let rates = obj.prices;
      if (appSettings?.productsSettings?.allowMultirate) {
        rates = await loadMultiRateToGrid(obj, updated,api,  getFormattedValue);
      }
        handleDataChange({ ...obj, prices: rates, units: updated });

      setUnit(unitDAta);
    };
    useEffect(() => {
      const fetchUnits = async () => {
        try {
          const response = await api.getAsync(Urls.data_units); // adjust API endpoint
          const fList = response;
          setUnits(fList);

          const obj = getFieldProps("*") as any as productDto;
          const updated = [...obj.units, unit];
          debugger;
          let selected = updated
            .filter((x) => x.unitID ?? 0 > 0)
            .map((x: any) => ({
              id: Number(x.unitID), // Ensure type matches: number
              name: String(x.unit), // Ensure type matches: string
            }));
          if (obj.product.basicUnitID && response) {
            const basic =
              obj.product.basicUnitID == -2
                ? response[0].id
                : obj.product.basicUnitID;
            const exists = selected?.some(
              (u: any) => u.id === Number(obj.product.basicUnitID)
            );

            const name = response.find((x: any) => x.id == basic)?.name;
            if (!exists && name)
              selected = [
                ...(selected ?? []),
                {
                  id: Number(basic),
                  name: name ?? "", // Replace with the actual name if needed
                },
              ];
          }
          const unSelected = response
            .filter((x: any) => !selected.map((x) => x.id).includes(x.id ?? 0))
            .map((x: any) => ({
              id: Number(x.id), // Ensure type matches: number
              name: String(x.name), // Ensure type matches: string
            }));
          debugger;
          setSelectedUnits(selected);
          unSetSelectedUnits(unSelected);
        } catch (error) {
          console.error("Error fetching units:", error);
        }
      };

      fetchUnits();
    }, []);

        const columns: DevGridColumn[] = useMemo(() => [
       {
        dataField: "unit",
        caption: t("uom"),
        dataType: "string",
        allowEditing: false,
        allowSorting: true,
       allowSearch: true,
       allowFiltering: true,
        width: 100,
      },
      {
        dataField: "multiFactor",
        caption: t("multi_factor"),
        dataType: "number",
        allowEditing: true,
         allowSearch: true,
        allowFiltering: true,
         width: 150,
      },
      {
        dataField: "barCode",
        caption: t("barcode"),
        dataType: "string",
        allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
    
      },
      {
        dataField: "salesPrice",
        caption: t("sale_price"),
        dataType: "number",
        allowEditing: true,
        allowSearch: true,
        allowFiltering: true,
        width: 100,
      },
      {
        dataField: "mrp",
        caption: t("mrp"),
        dataType: "number",
         allowSearch: true,
        allowFiltering: true,
        allowEditing: true,
        width: 100,
      },
      {
        dataField: "msp",
        caption: t("msp"),
        dataType: "number",
      allowSearch: true,
        allowFiltering: true,
        allowEditing: true,

        width: 100,
      },
      {
        dataField: "description",
        caption: t("description"),
        dataType: "string",
         allowSearch: true,
        allowFiltering: true,
        allowEditing: true,width: 250,
      },
      {
        dataField: "descriptionFL",
        caption: t("description_fl"),
        dataType: "string",
        allowEditing: true,
       allowSearch: true,
        allowFiltering: true,
        width: 250,
      },
      {
        dataField: "mb",
        caption: t("mb"),
         fixed: true,
       fixedPosition: "right",
        allowEditing: false,
        allowSearch: false,
        allowFiltering: false,
        width: 80,
        cellRender: (cellData, cellInfo) => {
       
        const rowIndex = cellData.rowIndex  ?? -1;
        if (rowIndex === -1) {
          console.error("Row index not found in cellInfo:", cellInfo);
          return null;
        }
        return (
        
          <div className="flex items-center justify-center hover:shadow-md p-2 cursor-pointer rounded-md shadow-sm cursor-pointer transition duration-300 ease-in-out">
            <button
              type="button"
              className="text-[#e53e3e] hover:text-[#c53030] font-semibold"
              onClick={() => setMultiBarcode(cellData.data.multiBarcodes, cellData.data.unit,rowIndex)}
            >
              <Barcode className="w-4 h-4" />
            </button>
          </div>
        );
      },
      
      },
      
      {
        dataField: "actions",
        caption: "X",
        alignment: "center",
        isLocked: true,
        allowSearch: false,
        allowFiltering: false,
        fixed: true,
        width: 50,
         fixedPosition: "right",
        // alignment: "center",
        cellRender: (cellData) => {
          return(
         <div className="flex items-center justify-center p-2 cursor-pointer">
            <a
              className="cursor-pointer text-[#e53e3e] hover:text-[#c53030] font-semibold"
             onClick={() => handleRemoveUnit(cellData.data.unitID)}
            >
              <X className="w-4 h-4" />
            </a>
          </div>
          )
        }
         
        
   
      },
        ], [t]);

   
   const handleRemoveUnit = (unitID: number) => {
      console.log("Removing unit with unitID:", unitID);
      const currentUnits = getFieldProps("units").value as ProductUnitInputDto[];
      const updatedUnits = currentUnits.filter((unit) => unit.unitID !== unitID);
      handleFieldChange("units", updatedUnits);
    };

   

const setMultiBarcode = (barcodesString: string, unitName: string, rowId: number) => {
  debugger;
  const barcodeArray = barcodesString
    .split(",")
    .map((barcode:any) => barcode.trim())
    .filter((barcode:any) => barcode.length > 0);

      const data =
        barcodeArray == undefined ||
        barcodeArray == null ||
        barcodeArray.length == 0
          ? [{ unit: unitName, barcode: "" }]
          : barcodeArray.map((barcode: any) => ({
              unit: unitName,
              barcode,
            }));
      setOpenMB({
        index: rowId,
        open: true,
        unit: unitName,
        data: data,
      });
    };
    const onFocusedCellChanging = (e: { isHighlighted: boolean }) => {
      e.isHighlighted = true;
    };

    const getBarcodeStringFromArray = (barcodeArray: any[]): string => {
      return barcodeArray
        .map((item) => item.barcode.trim())
        .filter((barcode) => barcode.length > 0)
        .join(",");
    };

    const handleSaveMB = () => {
      const barcodeString = getBarcodeStringFromArray(openMB.data);
      const units = getFieldProps("units").value;
      const updatedUnits = [...units];
      updatedUnits[openMB.index].multiBarcodes = barcodeString;
      handleFieldChange("units", updatedUnits);
      setOpenMB((prev: any) => ({
        data: [],
        index: 0,
        open: false,
        unit: "",
      }));
    };
    const [selectedUnits, setSelectedUnits] = useState<
      {
        id: number;
        name: string;
      }[]
    >([{ id: 0, name: "" }]);
    const [units, setUnits] = useState<
      {
        id: number;
        name: string;
      }[]
    >([{ id: 0, name: "" }]);
    const [unSelectedUnits, unSetSelectedUnits] = useState<
      {
        id: number;
        name: string;
      }[]
    >([{ id: 0, name: "" }]);
    return (
      <div className="border border-[#ccc] rounded-md p-4 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end">
            <div className="w-full flex flex-wrap gap-1">
              <ERPDataCombobox
                id="unitID"
                value={unit.unitID}
                label={t("unit")}
                options={unSelectedUnits}
                field={{
                  id: "unitID",
                  labelKey: "name",
                  valueKey: "id",
                }}
                onChange={(e) => {
                  const obj = getFieldProps("*");
                  if (
                    obj?.units?.find((x: any) => x.unitID == e.value) !=
                      undefined ||
                    obj?.product?.basicUnitID == e.value
                  ) {
                    ERPAlert.show({
                      text: t("unit_already_selected_please_change_it"),
                      title: t("already_used"),
                    });
                    setUnit((prev) => ({
                      ...prev,
                      unitID: 0,
                      unit: "",
                    }));
                  } else {
                    setUnit((prev) => ({
                      ...prev,
                      unitID: e.value,
                      unit: e.name,
                    }));
                  }
                }}
                className="flex-1 min-w-[120px] max-w-[222px]"
              />

              <ERPInput
                id="multiFactor"
                value={unit.multiFactor}
                label={t("multi_factor")}
                type="number"
                onChange={(e) => {
                  const obj = getFieldProps("*") as productDto;
                  const mFactor = Number(e.target.value);
                  debugger;
                  setUnit((prev) => ({
                    ...prev,
                    multiFactor: Number(e.target.value),
                    salesPrice:
                      Number(obj?.product?.stdSalesPrice ?? 0) * mFactor,
                    mrp: Number(obj?.product?.mrp ?? 0) * mFactor,
                    msp: Number(obj?.batch?.msp ?? 0) * mFactor,
                  }));
                }}
                className="flex-1 min-w-[120px] max-w-[222px]"
              />

              <ERPInput
                id="barCode"
                value={unit.barCode}
                label={t("barcode")}
                placeholder={t("barcode")}
                onChange={(e) =>
                  setUnit((prev) => ({
                    ...prev,
                    barCode: e.target.value,
                  }))
                }
                className="flex-1 min-w-[120px] max-w-[222px]"
              />

              <ERPInput
                id="salesPrice"
                value={unit.salesPrice}
                label={t("sale_price")}
                type="number"
                onChange={(e) =>
                  setUnit((prev) => ({
                    ...prev,
                    salesPrice: Number(e.target.value),
                  }))
                }
                className="flex-1 min-w-[120px] max-w-[222px]"
              />

              <ERPInput
                id="mrp"
                value={unit.mrp}
                label={t("mrp")}
                type="number"
                onChange={(e) =>
                  setUnit((prev) => ({
                    ...prev,
                    mrp: Number(e.target.value),
                  }))
                }
                className="flex-1 min-w-[120px] max-w-[222px]"
              />

              <ERPInput
                id="msp"
                value={unit.msp}
                label={t("msp")}
                type="number"
                onChange={(e) =>
                  setUnit((prev) => ({
                    ...prev,
                    msp: Number(e.target.value),
                  }))
                }
                className="flex-1 min-w-[120px] max-w-[222px]"
              />

              <ERPInput
                id="description"
                value={unit.description}
                label={t("description")}
                placeholder={t("description")}
                onChange={(e) =>
                  setUnit((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="flex-1 min-w-[120px] max-w-[222px]"
              />

              <ERPInput
                id="descriptionFL"
                value={unit.descriptionFL}
                label={t("description_fl")}
                placeholder={t("description_fl")}
                onChange={(e) =>
                  setUnit((prev) => ({
                    ...prev,
                    descriptionFL: e.target.value,
                  }))
                }
                className="flex-1 min-w-[120px] max-w-[222px]"
              />
            </div>

            <div className="px-1 mt-3 !flex !justify-end">
              <ERPButton
                title={t("add")}
                variant="primary"
                onClick={handleAddUnit}
                className="h-10"
              />
            </div>
          </div>

          {/* DataGrid Section */}
          <div className="p-4 rounded-md shadow w-full overflow-x-auto">
            
               <ErpDevGrid
                    ref={multiUnitRef}
                    hideGridHeader={true}
                    keyExpr="unitID"
                    data={getFieldProps("units").value}
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
                     scrollingMode="virtual"
                      keyboardNavigation={{
                        editOnKeyPress: true,
                        enterKeyAction: "moveFocus",
                        enterKeyDirection: "row",
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
                    heightToAdjustOnWindows={400}
                
                    gridId="product_multi_units_grid"
                />
               
          </div>

          {/* Default Units Section */}
          <div className="p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">{t("default_units")}</h2>
            <div className="flex flex-wrap">
              <div className="flex-1 px-1 mb-3 min-w-[200px] max-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("batch.defSalesUnitID")}
                  id="defSalesUnitID"
                  options={selectedUnits}
                  field={{
                    id: "defSalesUnitID",
                    labelKey: "name",
                    valueKey: "id",
                  }}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "batch.defSalesUnitID",
                      data.defSalesUnitID
                    )
                  }
                  className="w-full"
                  label={t("sales")}
                />
              </div>
              <div className="flex-1 px-1 mb-3 min-w-[200px] max-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("batch.defPurchaseUnitID")}
                  id="defPurchaseUnitID"
                  label={t("purchase")}
                  options={selectedUnits}
                  field={{
                    id: "defPurchaseUnitID",
                    labelKey: "name",
                    valueKey: "id",
                  }}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "batch.defPurchaseUnitID",
                      data.defPurchaseUnitID
                    )
                  }
                  className="w-full"
                />
              </div>
              <div className="flex-1 px-1 mb-3 min-w-[200px] max-w-[200px]">
                <ERPDataCombobox
                  {...getFieldProps("batch.defReportUnitID")}
                  id="defReportUnitID"
                  label={t("report")}
                  options={selectedUnits}
                  field={{
                    id: "defReportUnitID",
                    labelKey: "name",
                    valueKey: "id",
                  }}
                  onChangeData={(data) =>
                    handleFieldChange(
                      "batch.defReportUnitID",
                      data.defReportUnitID
                    )
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {openMB.open && (
          <ERPModal
            isOpen={openMB.open}
            closeModal={(reload: boolean) =>
              setOpenMB({ index: 0, open: false, unit: "", data: [] })
            }
            title={t("multi_barcode")}
            content={
              <div className="w-full">
                <DataGrid
                  dataSource={openMB.data}
                  height={300}
                  key="barcode"
                  showBorders={true}
                  showRowLines={true}
                  onFocusedCellChanging={onFocusedCellChanging}
                  onEditorPrepared={(e) => {
                    if (e.parentType === "dataRow") {
                      const currentRowData = e.row?.data;
                      if (
                        !currentRowData ||
                        !currentRowData.unit ||
                        currentRowData.unit.trim() === ""
                      ) {
                        e.editorElement.setAttribute("disabled", "true");
                        e.editorElement.setAttribute(
                          "title",
                          "Enter a valid unit to enable editing."
                        );
                      } else {
                        e.editorElement.removeEventListener(
                          "keydown",
                          (e.editorElement as any)._onBarcodeKeyDown
                        );

                        const barcodeKeyDownHandler = (
                          event: KeyboardEvent
                        ) => {
                          if (event.key === "Enter") {
                            setOpenMB((prev: any) => {
                              const newRow = { unit: prev.unit, barcode: "" };
                              return { ...prev, data: [...prev.data, newRow] };
                            });
                          }
                        };
                        (e.editorElement as any)._onBarcodeKeyDown =
                          barcodeKeyDownHandler;
                        e.editorElement.addEventListener(
                          "keydown",
                          barcodeKeyDownHandler
                        );
                      }
                    }
                  }}
                >
                  <KeyboardNavigation
                    editOnKeyPress={true}
                    enterKeyAction={"moveFocus"}
                    enterKeyDirection={"column"}
                  />

                  <Paging pageSize={100} />

                  <Scrolling mode="standard" />

                  <RemoteOperations
                    filtering={false}
                    sorting={false}
                    paging={false}
                  />

                  <Column
                    dataField="unit"
                    caption={t("unit")}
                    allowEditing={false}
                    dataType="string"
                    width={150}
                  />

                  <Column
                    dataField="barcode"
                    caption={t("barcode")}
                    dataType="string"
                    allowEditing={true}
                    minWidth={150}
                  />

                  <Editing
                    allowUpdating={true}
                    allowAdding={false}
                    allowDeleting={false}
                    mode="cell"
                  />
                </DataGrid>
              </div>
            }
            width={780}
            height={570}
            disableOutsideClickClose={false}
            footer={
              <div className="absolute -bottom-0 h-[42px] pt-[4px] pb-[2px] left-0 w-full flex justify-end space-x-2 dark:!border-dark-border dark:!bg-dark-bg bg-white border-t z-10 pr-[10px] rounded-b-md">
                <ERPSubmitButton
                  type="reset"
                  onClick={() =>
                    setOpenMB({ index: 0, open: false, unit: "", data: [] })
                  }
                  className="dark:text-dark-hover-text w-28 bg-[#808080] text-[#404040] max-w-[115px]"
                >
                  {t("cancel")}
                </ERPSubmitButton>

                <ERPSubmitButton
                  type="button"
                  className="max-w-[115px]"
                  variant="primary"
                  onClick={handleSaveMB}
                >
                  {t("save")}
                </ERPSubmitButton>
              </div>
            }
          />
        )}
      </div>
    );
  }
);

export default React.memo(ProductMultiUnitsIndia);
