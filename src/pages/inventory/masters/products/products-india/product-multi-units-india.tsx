import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import DataGrid, {
  Column,
  Editing,
  KeyboardNavigation,
  Paging,
  RemoteOperations,
  Scrolling,
} from "devextreme-react/data-grid";
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
import { getAccordionSummaryUtilityClass } from "@mui/material";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";

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

    const loadMultiRateToGrid = async (
      obj: productDto,
      updateUnit: any
    ): Promise<ProductPriceInputDto[]> => {
      debugger;
      let mlRate = getFieldProps("prices").value;
      if ((obj.product.basicUnitID ?? 0) > 0) {
        if (
          mlRate.find((x: any) => x.unitID == obj.product.basicUnitID) ==
          undefined
        ) {
          mlRate = await loadMultiRates(
            obj.product.basicUnitID ?? 0,
            obj.product.basicUnitName ?? "",
            obj,
            mlRate
          );
        }
      }

      const mUnits = updateUnit;
      for (const row of mUnits) {
        if (mlRate.find((x: any) => x.unitID == row.unitID) == undefined) {
          mlRate = await loadMultiRates(
            row.unitID ?? 0,
            row.unit ?? "",
            obj,
            mlRate
          );
        }
      }
      debugger;
      return setMultiRatesDefaultMRP(mUnits, mlRate, obj);
    };
    useImperativeHandle(ref, () => ({
      loadMultiRateToGrid: async (obj: productDto, units: any) => {
        return await loadMultiRateToGrid(obj, units);
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
          const exists = selected?.some((u: any) => u.id === Number(obj.product.basicUnitID));
          if (!exists)          
          selected =  [
            ...(selected ?? []),
            {
              id: Number(obj.product.basicUnitID),
              name: units.find(x => x.id == obj.product.basicUnitID)?.name??"", // Replace with the actual name if needed
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

      if (appSettings?.productsSettings?.allowMultirate) {
        const rates = await loadMultiRateToGrid(obj, updated);
        handleDataChange({ ...obj, prices: rates, units: updated });
      }

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
debugger
          let selected = updated
            .filter((x) => x.unitID ?? 0 > 0)
            .map((x: any) => ({
              id: Number(x.unitID), // Ensure type matches: number
              name: String(x.unit), // Ensure type matches: string
            }));
            if (obj.product.basicUnitID && response) {
              const basic = obj.product.basicUnitID == -2 ? response[0].id : obj.product.basicUnitID
              const exists = selected?.some((u: any) => u.id === Number(obj.product.basicUnitID));
              
              const name = response.find((x: any) => x.id ==basic)?.name;
              if (!exists && name)          
              selected =  [
                ...(selected ?? []),
                {
                  id: Number(basic),
                  name: name??"", // Replace with the actual name if needed
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
    const loadMultiRates = async (
      unitId: number,
      unit: string,
      obj: productDto,
      multiRates: Array<ProductPriceInputDto>
    ): Promise<ProductPriceInputDto[]> => {
      try {
        const rates: ProductPriceInputDto[] = [...(multiRates || [])];
        const priceCategories = await api.getAsync(Urls.data_pricectegory);

        if (!priceCategories || priceCategories.length === 0) {
          return rates;
        }
        // Transform price categories into new rates using map
        const newRates: ProductPriceInputDto[] = priceCategories.map(
          (cat: any) => ({
            priceCategory: cat.name,
            unit: unit,
            unitID: unitId,
            priceCategoryID: cat.id,
            purchaseRate: parseFloat(
              getFormattedValue(
                (obj?.product?.stdPurchasePrice ?? 0) *
                  (unitDAta.multiFactor || 1)
              )
            ),
            mrp: obj?.product?.mrp || 0,

            // Fill in all required fields below
            productMultiPriceID: 0,
            productBatchID: 0,
            salesPrice: 0,
            discountPerc: 0,
            profitAmt: 0,
            msp: 0,
            purchasePrice: 0,
          })
        );

        return [...rates, ...newRates];
      } catch (err) {
        console.error("Error in loadMultiRates:", err);
        return obj.prices || [];
      }
    };

    function setMultiRatesDefaultMRP(
      multiUnits: ProductUnitInputDto[],
      multiRates: ProductPriceInputDto[],
      obj: productDto
    ): ProductPriceInputDto[] {
      debugger;
      let updatedRates = [...multiRates];

      if (obj.product.basicUnitID && (obj.product?.mrp ?? 0) > 0) {
        updatedRates = setMRP(
          multiRates,
          (obj.product?.productID ?? 0) > 0,
          obj.product?.basicUnitID,
          obj?.product?.mrp ?? 0,
          obj?.product?.stdPurchasePrice ?? 0
        );
      }

      for (const row of multiUnits) {
        if (row.unitID != null && row.mrp > 0) {
          updatedRates = setMRP(
            multiRates,
            (obj.product?.productID ?? 0) > 0,
            row?.unitID,
            row?.mrp ?? 0,
            obj?.product?.stdPurchasePrice ?? 0,
            row?.multiFactor
          );
        }
      }

      return updatedRates;
    }
    const handleRemoveUnit = (rowId: number) => {
      handleFieldChange("units", [
        ...getFieldProps("units").value?.filter(
          (_: any, index: any) => index !== rowId
        ),
      ]);
    };
    function setMRP(
      multiRates: ProductPriceInputDto[],
      isEdit: boolean,
      unitId: number,
      MRPVal: number,
      PR: number = 0,
      MF: number = 0
    ): ProductPriceInputDto[] {
      const updatedRates: ProductPriceInputDto[] = multiRates.map(
        (rate, index) => {
          if (rate.unitID === unitId) {
            return {
              ...rate,
              mrp: MRPVal,
              purchasePrice: MF > 0 ? MF * PR : PR, // 👈
            };
          }

          // In edit mode, skip further changes after non-matching unit
          if (isEdit && rate.unitID !== unitId && index > 0) {
            return rate;
          }

          return rate;
        }
      );

      return updatedRates;
    }

    const setMultiBarcode = (rowId: number) => {
      const units = getFieldProps("units").value;
      const barcodesString = units[rowId].multiBarcodes ?? "";
      let barcodeArray = barcodesString
        .split(",")
        .map((barcode: any) => barcode.trim())
        .filter((barcode: any) => barcode.length > 0);

      const data =
        barcodeArray == undefined ||
        barcodeArray == null ||
        barcodeArray.length == 0
          ? [{ unit: units[rowId].unit ?? "", barcode: "" }]
          : barcodeArray.map((barcode: any) => ({
              unit: units[rowId].unit ?? "",
              barcode,
            }));
      setOpenMB({
        index: rowId,
        open: true,
        unit: units[rowId].unit ?? "",
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
                      text: "Unit Already Selected ,Please Change it !!",
                      title: "Already used",
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
            <DataGrid
              dataSource={getFieldProps("units").value}
              showBorders={true}
              rowAlternationEnabled={true}
              className="w-full"
              onSaving={(e) => {
                const _unts = getFieldProps("units").value;
                if (e.changes.length > 0) {
                  const changes = e.changes[0];
                  if (changes.type === "update") {
                    const updatedUnits = [..._unts];
                    const index = _unts.findIndex(
                      (u: any) => u.unitID === changes.key?.unitID
                    );
                    updatedUnits[index] = {
                      ...updatedUnits[index],
                      ...changes.data,
                    };
                    handleFieldChange("units", [...updatedUnits]);
                  }
                }
              }}
            >
              <Paging defaultPageSize={5} />

              <Editing mode="cell" allowUpdating={true} />

              <KeyboardNavigation
                editOnKeyPress={true}
                enterKeyAction={"startEdit"}
                enterKeyDirection={"row"}
              />

              <Column dataField="unit" caption={t("uom")} />

              <Column
                dataField="multiFactor"
                caption={t("multi_factor")}
                dataType="number"
                allowEditing
              />

              <Column dataField="barCode" allowEditing caption={t("barcode")} />

              <Column
                dataField="salesPrice"
                allowEditing
                caption={t("sale_price")}
                dataType="number"
              />

              <Column
                dataField="mrp"
                caption={t("mrp")}
                dataType="number"
                allowEditing
              />

              <Column
                dataField="msp"
                allowEditing
                caption={t("msp")}
                dataType="number"
              />

              <Column
                dataField="description"
                allowEditing
                caption={t("description")}
              />

              <Column
                dataField="descriptionFL"
                allowEditing
                caption={t("description_fl")}
              />

              <Column
                dataField="mb"
                caption={t("mb")}
                dataType="boolean"
                cellRender={(cellData) => (
                  <a
                    className="cursor-pointer text-[#e53e3e] hover:text-[#c53030] font-semibold"
                    onClick={() => setMultiBarcode(cellData.rowIndex)}
                  >
                    X
                  </a>
                )}
              />

              <Column
                type="buttons"
                caption="X"
                width={70}
                buttons={[{ name: "delete", text: "x" }]}
              />
            </DataGrid>
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
