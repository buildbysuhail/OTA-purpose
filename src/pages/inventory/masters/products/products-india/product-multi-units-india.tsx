import React, { useEffect, useState } from "react";
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
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../../../redux/urls";
import {
  PathValue,
  productDto,
  ProductFieldPath,
  ProductUnitInputDto,
} from "../products-type";
import initialProductData from "../products-data";
import { FormField } from "../../../../../utilities/form-types";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";

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
  
  //   useEffect(() => {
  //     setUnits(getFieldProps("units").value as ProductUnitInputDto[]);
  //   }, []);
  const handleAddUnit = () => {
   

    setUnit(unitDAta);
    
    handleFieldChange("units",[...getFieldProps("units").value, unit])
  };
  const handleRemoveUnit = (rowId: number) => {
    handleFieldChange("units",[...getFieldProps("units").value?.filter((_: any, index: any) => index !== rowId)])
    // setUnits((prev: any) => {
    //   return [...prev?.filter((_: any, index: any) => index !== rowId)];
    // });
  };
  const setMultiBarcode = (rowId: number) => {
    const units = getFieldProps("units").value
    const barcodesString = units[rowId].multiBarcodes ?? "";
    let barcodeArray = barcodesString
      .split(",")
      .map((barcode: any) => barcode.trim())
      .filter((barcode: any) => barcode.length > 0); // remove empty values

    const data =
      barcodeArray == undefined ||
      barcodeArray == null ||
      barcodeArray.length == 0
        ? [{ unit: openMB.unit, barcode: "" }]
        : barcodeArray.map((barcode: any) => ({
            unit: openMB.unit,
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

  return (
    <div className="border border-[#ccc] inline-block rounded-md p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <ERPDataCombobox
            id="unitID"
            value={unit.unitID}
            label="Unit"
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
            className="w-full"
          />

          <ERPInput
            id="multiFactor"
            value={unit.multiFactor}
            label="Multi Factor"
            placeholder="e.g. 10"
            type="number"
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                multiFactor: Number(e.target.value),
              }))
            }
            className="w-full"
          />

          <ERPInput
            id="barCode"
            value={unit.barCode}
            label="Barcode"
            placeholder="Barcode"
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                barCode: e.target.value,
              }))
            }
            className="w-full"
          />

          <ERPInput
            id="salesPrice"
            value={unit.salesPrice}
            label="Sale Price"
            placeholder="e.g. 120"
            type="number"
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                salesPrice: Number(e.target.value),
              }))
            }
            className="w-full"
          />

          <ERPInput
            id="mrp"
            value={unit.mrp}
            label="MRP"
            placeholder="e.g. 212"
            type="number"
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                mrp: Number(e.target.value),
              }))
            }
            className="w-full"
          />

          <ERPInput
            id="msp"
            value={unit.msp}
            label="MSP"
            placeholder="MSP"
            type="number"
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                msp: Number(e.target.value),
              }))
            }
            className="w-full"
          />

          <ERPInput
            id="description"
            value={unit.description}
            label="Description"
            placeholder="Description"
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full"
          />

          <ERPInput
            id="descriptionFL"
            value={unit.descriptionFL}
            label="Description FL"
            placeholder="Description FL"
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                descriptionFL: e.target.value,
              }))
            }
            className="w-full"
          />
          <ERPButton title="Add" variant="primary" onClick={handleAddUnit} />
        </div>

        {/* DataGrid Section */}
        <div className="p-4 rounded-md shadow">
          <DataGrid
            dataSource={getFieldProps("units").value}
            // keyExpr="barCode"
            showBorders={true}
            rowAlternationEnabled={true}
            className="w-full"
            onSaving={(e) => {
                debugger;
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
                    // setUnits(updatedUnits);
                    handleFieldChange("units",[...updatedUnits])
                  }
                }
              }}
          >
            <Paging defaultPageSize={5} />

            <Editing
              mode="cell"
              allowUpdating={true}
              //   allowDeleting={true}
              //   allowAdding={false}
            />
            <KeyboardNavigation
              editOnKeyPress={true}
              enterKeyAction={"startEdit"}
              enterKeyDirection={"row"}
            />
            <Column dataField="unit" caption="UOM" />
            <Column
              dataField="multiFactor"
              caption="Multi Factor"
              dataType="number"
              allowEditing
            />
            <Column dataField="barCode" allowEditing caption="Barcode" />
            <Column
              dataField="salePrice"
              allowEditing
              caption="Sale Price"
              dataType="number"
            />
            <Column
              dataField="mrp"
              caption="MRP"
              dataType="number"
              allowEditing
            />
            <Column
              dataField="msp"
              allowEditing
              caption="MSP"
              dataType="number"
            />
            <Column
              dataField="description"
              allowEditing
              caption="Description"
            />
            <Column
              dataField="descriptionFL"
              allowEditing
              caption="Description FL"
            />

            {/* New MB column with ERPCheckbox */}
            <Column
              dataField="mb"
              caption="MB"
              dataType="boolean"
              cellRender={(cellData) => (
                <a
                  className="cursor-pointer text-red-600 hover:text-red-800 font-semibold"
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
          <h2 className="text-xl font-semibold mb-4">Default Units</h2>
          <div className="grid grid-cols-6 gap-4">
            <ERPDataCombobox
              {...getFieldProps("batch.defSalesUnitID")}
              id="defSalesUnitID"
              label="Sales"
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
            <ERPDataCombobox
              {...getFieldProps("batch.defPurchaseUnitID")}
              id="defPurchaseUnitID"
              label="Purchase"
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
            <ERPDataCombobox
              {...getFieldProps("batch.defReportUnitID")}
              id="defReportUnitID"
              label="Report"
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
      {openMB.open && (
        <ERPModal
          isOpen={openMB.open}
          closeModal={(reload: boolean) =>
            setOpenMB({ index: 0, open: false, unit: "", data: [] })
          }
          title={t("multi_barcode")}
          content={
            <div>
              <DataGrid
                dataSource={openMB.data}
                height={300}
                key="barcode"
                showBorders={true}
                showRowLines={true}
                onRowUpdating={(e) => {
                  // Check if 'rate' is being updated
                  if (e.newData.unit !== undefined && e.newData.unit !== "") {
                    setOpenMB((prev: any) => {
                      const df = [
                        ...prev.data,
                        { unit: openMB.unit, barcode: "" },
                      ];
                      return { ...prev, data: df };
                    });
                  }
                }}
                onFocusedCellChanging={onFocusedCellChanging}
              >
                <KeyboardNavigation
                  editOnKeyPress={true}
                  enterKeyAction={"startEdit"}
                  enterKeyDirection={"row"}
                />
                <Paging pageSize={100}></Paging>
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
        />
      )}
    </div>
  );
});

export default ProductMultiUnitsIndia;
