import React, { useState } from "react";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../../redux/urls";
import { productDto } from "../products-type";
import initialProductData from "../products-data";
import { FormField } from "../../../../../utilities/form-types";
// const ProductDetailsIndia: React.FC<{
//   formState: any;
//   handleFieldChange: (
//     fields:
//       | string
//       | {
//           [fieldId: string]: any;
//         },
//     value?: any
//   ) => void;
//   t: any;
//   getFieldProps: (fieldId: string, type?: string) => FormField;
// }> = React.memo(({formState,handleFieldChange,t,getFieldProps}) => {
const ProductMultiUnitsIndia: React.FC<{
    formState: any;
    handleFieldChange: (
      fields:
        | string
        | {
            [fieldId: string]: any;
          },
      value?: any
    ) => void;
    t?: any;
    getFieldProps: (fieldId: string, type?: string) => FormField;
  }> = React.memo(({formState,handleFieldChange,t,getFieldProps}) => {
    // State to store the grid data
    const [gridData, setGridData] = useState<any[]>([]);

    const onAdd = () => {
        // Construct a new row from the current form fields
        const newRow = {
            unit: getFieldProps("units.unitID").value,
            multiFactor: getFieldProps("units.multiFactor").value,
            barcode: getFieldProps("units.barCode").value,
            salePrice: getFieldProps("units.sprice").value,
            mrp: getFieldProps("batch.mrp").value,
            msp: getFieldProps("batch.msp").value,
            description: getFieldProps("units.description").value,
            descriptionFL: getFieldProps("units.descriptionFL").value,
            mb: false, // New property for the checkbox column
        };
        // Update grid data by appending the new row
        setGridData([...gridData, newRow]);
    };

    return (
        <div className="border border-[#ccc] inline-block rounded-md p-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-end gap-4">
                    <ERPDataCombobox
                        {...getFieldProps("units.unitID")}
                        id="unitID"
                        label="Unit"
                        field={{
                            id:"unitID",
                            getListUrl: Urls.unitOfMeasure,
                            labelKey: "label",
                            valueKey: "value",
                        }}
                        onChangeData={(data) =>
                            handleFieldChange("units.unitID", data.unitID)
                        }
                        className="w-full"
                    />

                    <ERPInput
                        {...getFieldProps("units.multiFactor")}
                        label="Multi Factor"
                        placeholder="e.g. 10"
                        type="number"
                        required={false}
                        onChangeData={(data) =>
                            handleFieldChange("units.multiFactor", data.units.multiFactor)
                        }
                        className="w-full"
                    />
                  
                    <ERPInput
                        {...getFieldProps("units.barCode")}
                        label="Barcode"
                        placeholder="Barcode"
                        required={false}
                        onChangeData={(data) =>
                            handleFieldChange("units.barCode", data.units.barCode)
                        }
                        className="w-full"
                    />
                    <ERPInput
                        {...getFieldProps("units.sprice")}
                        label="Sale Price"
                        placeholder="e.g. 120"
                        type="number"
                        required={false}
                        onChangeData={(data) =>
                            handleFieldChange("units.sprice", data.units.sprice)
                        }
                        className="w-full"
                    />
                    <ERPInput
                        {...getFieldProps("batch.mrp")}
                        label="MRP"
                        placeholder="e.g. 212"
                        type="number"
                        required={false}
                        onChangeData={(data) =>
                            handleFieldChange("batch.mrp", data.batch.mrp)
                        }
                        className="w-full"
                    />
                    <ERPInput
                        {...getFieldProps("batch.msp")}
                        label="MSP"
                        placeholder="MSP"
                        type="number"
                        required={false}
                        onChangeData={(data) =>
                            handleFieldChange("batch.msp", data.batch.msp)
                        }
                        className="w-full"
                    />
                    <ERPInput
                        {...getFieldProps("units.description")}
                        label="Description"
                        placeholder="Description"
                        required={false}
                        onChangeData={(data) =>
                            handleFieldChange("units.description", data.units.description)
                        }
                        className="w-full"
                    />
                    <ERPInput
                        {...getFieldProps("units.descriptionFL")}
                        label="Description FL"
                        placeholder="Description FL"
                        required={false}
                        onChangeData={(data) =>
                            handleFieldChange("units.descriptionFL", data.units.descriptionFL)
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
                            id='defSalesUnitID'
                            label="Sales"
                            field={{
                                id:'defSalesUnitID',
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
                                id:"defPurchaseUnitID",
                                getListUrl: "vajid",
                                labelKey: "label",
                                valueKey: "value",
                            }}
                            onChangeData={(data) =>
                                handleFieldChange("batch.defPurchaseUnitID", data.defPurchaseUnitID)
                            }
                            className="w-full"
                        />
                        <ERPDataCombobox
                            {...getFieldProps("batch.defReportUnitID")}
                            id="defReportUnitID"
                            label="Report"
                            field={{
                                id:"defReportUnitID",
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
}
  );

export default ProductMultiUnitsIndia;
