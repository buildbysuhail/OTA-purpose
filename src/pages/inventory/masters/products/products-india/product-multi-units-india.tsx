import React, { useState } from "react";
import DataGrid, {
  Column,
  Editing,
  KeyboardNavigation,
  Paging,
  RemoteOperations,
  Scrolling
} from "devextreme-react/data-grid";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import {
  PathValue,
  productDto,
  ProductFieldPath,
  ProductUnitInputDto
} from "../products-type";
import { FormField } from "../../../../../utilities/form-types";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import ERPSubmitButton from "../../../../../components/ERPComponents/erp-submit-button";

const ProductMultiUnitsIndia: React.FC<{
  t: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;
  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ t, handleFieldChange, getFieldProps }) => {
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

  const [unit, setUnit] = useState<ProductUnitInputDto>(unitDAta);
  const [openMB, setOpenMB] = useState<{
    index: number;
    open: boolean;
    unit: string;
    data: { unit: string; barcode: String }[];
  }>({ index: 0, open: false, unit: "", data: [] });

  const handleAddUnit = () => {
    setUnit(unitDAta);
    handleFieldChange("units", [...getFieldProps("units").value, unit]);
  };

  const handleRemoveUnit = (rowId: number) => {
    handleFieldChange("units", [...getFieldProps("units").value?.filter((_: any, index: any) => index !== rowId)]);
  };

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
      unit: ""
    }));
  };

  return (
    <div className="border border-[#ccc] rounded-md p-4 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end">
          <div className="w-full flex flex-wrap gap-1">
            <ERPDataCombobox
              id="unitID"
              value={unit.unitID}
              label={t("unit")}
              field={{
                id: "unitID",
                getListUrl: Urls.data_units,
                labelKey: "name",
                valueKey: "id",
              }}
              onChange={(e) =>
                setUnit((prev) => ({
                  ...prev,
                  unitID: e.value,
                  unit: e.name,
                }))
              }
              className="flex-1 min-w-[120px] max-w-[222px]"
            />

            <ERPInput
              id="multiFactor"
              value={unit.multiFactor}
              label={t("multi_factor")}
              type="number"
              onChange={(e) =>
                setUnit((prev) => ({
                  ...prev,
                  multiFactor: Number(e.target.value),
                }))
              }
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
                if (changes.type === 'update') {
                  const updatedUnits = [..._unts];
                  const index = _unts.findIndex((u: any) => u.unitID === changes.key?.unitID);
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

            <Editing
              mode="cell"
              allowUpdating={true}
            />

            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"startEdit"}
              enterKeyDirection={"row"}
            />

            <Column
              dataField="unit"
              caption={t("uom")}
            />

            <Column
              dataField="multiFactor"
              caption={t("multi_factor")}
              dataType="number"
              allowEditing
            />

            <Column
              dataField="barCode"
              allowEditing
              caption={t("barcode")}
            />

            <Column
              dataField="salePrice"
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
                <a className="cursor-pointer text-[#e53e3e] hover:text-[#c53030] font-semibold" onClick={() => setMultiBarcode(cellData.rowIndex)}>X</a>
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
                label={t("sales")}
                field={{
                  id: "defSalesUnitID",
                  getListUrl: Urls.data_units,
                  labelKey: "name",
                  valueKey: "id",
                }}
                onChangeData={(data) =>
                  handleFieldChange("batch.defSalesUnitID", data.defSalesUnitID)
                }
                className="w-full"
              />
            </div>
            <div className="flex-1 px-1 mb-3 min-w-[200px] max-w-[200px]">
              <ERPDataCombobox
                {...getFieldProps("batch.defPurchaseUnitID")}
                id="defPurchaseUnitID"
                label={t("purchase")}
                field={{
                  id: "defPurchaseUnitID",
                  getListUrl: Urls.data_units,
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
                field={{
                  id: "defReportUnitID",
                  getListUrl: Urls.data_units,
                  labelKey: "name",
                  valueKey: "id",
                }}
                onChangeData={(data) =>
                  handleFieldChange("batch.defReportUnitID", data.defReportUnitID)
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
                    if (!currentRowData || !currentRowData.unit || currentRowData.unit.trim() === "") {
                      e.editorElement.setAttribute("disabled", "true");
                      e.editorElement.setAttribute("title", "Enter a valid unit to enable editing.");
                    } else {
                      e.editorElement.removeEventListener("keydown", (e.editorElement as any)._onBarcodeKeyDown);

                      const barcodeKeyDownHandler = (event: KeyboardEvent) => {
                        if (event.key === "Enter") {
                          setOpenMB((prev: any) => {
                            const newRow = { unit: prev.unit, barcode: "" };
                            return { ...prev, data: [...prev.data, newRow] };
                          });
                        }
                      };
                      (e.editorElement as any)._onBarcodeKeyDown = barcodeKeyDownHandler;
                      e.editorElement.addEventListener("keydown", barcodeKeyDownHandler);
                    }
                  }
                }}>

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
          footer={(
            <div className="absolute -bottom-0 h-[42px] pt-[4px] pb-[2px] left-0 w-full flex justify-end space-x-2 dark:!border-dark-border dark:!bg-dark-bg bg-white border-t z-10 pr-[10px] rounded-b-md">
              <ERPSubmitButton
                type="reset"
                onClick={() => setOpenMB({ index: 0, open: false, unit: "", data: [] })}
                className="dark:text-dark-hover-text w-28 bg-[#808080] text-[#404040] max-w-[115px]">
                {t("cancel")}
              </ERPSubmitButton>

              <ERPSubmitButton
                type="button"
                className="max-w-[115px]"
                variant="primary"
                onClick={handleSaveMB}>
                {t("save")}
              </ERPSubmitButton>
            </div>
          )}
        />
      )}
    </div>
  );
});

export default ProductMultiUnitsIndia;