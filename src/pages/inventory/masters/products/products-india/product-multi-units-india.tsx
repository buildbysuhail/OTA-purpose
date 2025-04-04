import React, { useState } from "react";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../../redux/urls";
import { PathValue, productDto, ProductFieldPath, ProductUnitInputDto } from "../products-type";
import initialProductData from "../products-data";
import { FormField } from "../../../../../utilities/form-types";

const ProductMultiUnitsIndia: React.FC<{
  formState: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ formState, handleFieldChange, getFieldProps }) => {
    const unitDAta = {
          productUnitID: 0,
          productBatchID: 0,
          unitID: 0,
          multiFactor: 0,
          barCode: "",
          sprice: 0,
          description: "",
          descriptionFL: "",
          unitRemarks: "",
          gatePass: true,
          multiBarcodes: ""
        };
    const [unit, setUnit] = useState<ProductUnitInputDto>(unitDAta);
   
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
              getListUrl: Urls.unitOfMeasure,
              valueKey: "value",
              labelKey: "label",
            }}
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                unitID: e.value,
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
            id="sprice"
            value={unit.sprice}
            label="Sale Price"
            placeholder="e.g. 120"
            type="number"
            onChange={(e) =>
              setUnit((prev) => ({
                ...prev,
                sprice: Number(e.target.value),
              }))
            }
            className="w-full"
          />

          <ERPInput
            id="mrp"
            value={unit.}
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
          <ERPButton title="Add" variant="primary" onClick={onAdd} />
        </div>

        {/* DataGrid Section */}
        <div className="p-4 rounded-md shadow">
          <DataGrid
            dataSource={gridData}
            keyExpr="barcode"
            showBorders={true}
            rowAlternationEnabled={true}
            className="w-full"
          >
            <Paging defaultPageSize={5} />

            <Editing
              mode="cell"
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={false}
            />

            <Column dataField="unit" caption="UOM" />
            <Column
              dataField="multiFactor"
              caption="Multi Factor"
              dataType="number"
            />
            <Column dataField="barcode" caption="Barcode" />
            <Column
              dataField="salePrice"
              caption="Sale Price"
              dataType="number"
            />
            <Column dataField="mrp" caption="MRP" dataType="number" />
            <Column dataField="msp" caption="MSP" dataType="number" />
            <Column dataField="description" caption="Description" />
            <Column dataField="descriptionFL" caption="Description FL" />

            {/* New MB column with ERPCheckbox */}
            <Column
              dataField="mb"
              caption="MB"
              dataType="boolean"
              cellRender={(cellData) => (
                <ERPCheckbox
                  id="mb"
                  data={cellData.data}
                  onChangeData={(newData) => {
                    // newData will contain { mb: boolean }
                    const newValue = newData["mb"];
                    const updatedGridData = gridData.map((row) =>
                      row.barcode === cellData.data.barcode
                        ? { ...row, mb: newValue }
                        : row
                    );
                    setGridData(updatedGridData);
                  }}
                  defaultChecked={cellData.value}
                  noLabel={true}
                />
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
                getListUrl: Urls.salesRoute,
                labelKey: "label",
                valueKey: "value",
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
                getListUrl: "vajid",
                labelKey: "label",
                valueKey: "value",
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
                getListUrl: "vajid",
                labelKey: "label",
                valueKey: "value",
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
  );
});

export default ProductMultiUnitsIndia;
