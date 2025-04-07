import React, { useState } from "react";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import Urls from "../../../../../redux/urls";
import { useTranslation } from "react-i18next";
import { PathValue, productDto, ProductFieldPath, SupplierProductsInputDto } from "../products-type";
import { FormField } from "../../../../../utilities/form-types";

const SuppliersCommon: React.FC<{
  formState: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;
  getFieldProps: (fieldId: string, type?: string) => FormField;
}> = React.memo(({ formState, handleFieldChange, getFieldProps }) => {
  const supplierProducts =
  {
    ledgerID: 0,
    refCode: "",
    supplierCode: '',
    supplier: '',
  };
  const [data, setData] = useState<SupplierProductsInputDto>(supplierProducts);
  const handleAdd = () => {
    let nutritionData = getFieldProps("supplierProducts").value as SupplierProductsInputDto[];
    handleFieldChange("supplierProducts", [...nutritionData, data])
    setData(supplierProducts);
  };
  const handleRemove = (rowId: number) => {
    let nutritionData = getFieldProps("supplierProducts").value as SupplierProductsInputDto[];
    handleFieldChange("supplierProducts", [...nutritionData?.filter((_, index) => index !== rowId)])
  };

  const { t } = useTranslation('inventory')

  return (
    <div className="border border-[#ccc] inline-block rounded-md p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <ERPInput
            id="nutrient"
            value={data.supplierCode}
            label={t("supplier_code")}
            placeholder={t("enter_supplier_code")}
            required={false}
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                supplierCode: e.target.value,
              }))
            }
            className="w-full"
          />

          <ERPDataCombobox
            id="supplier_name"
            value={data.ledgerID}
            label={t("supplier_name")}
            field={{
              getListUrl: Urls.data_CustSupp,
              valueKey: "id",
              labelKey: "name",
            }}
            onChange={(e) =>
              setData((prev: any) => {
                debugger;
                return {
                  ...prev,
                  ledgerID: e.value,
                  supplier: e.name,
                }
              })
            }
            className="w-full"
          />

          <ERPInput
            id="supplier_product_code"
            value={data.refCode}
            label={t("supplier_product_code")}
            placeholder={t("enter_product_code")}
            required={false}
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                refCode: e.target.value,
              }))
            }
            className="w-full"
          />

          <ERPButton
            title={t("add")}
            variant="primary"
            onClick={handleAdd}
          />
        </div>

        {/* DataGrid Section */}
        <div className="p-4 rounded-md shadow">
          <DataGrid
            dataSource={getFieldProps("supplierProducts").value}
            showBorders={true}
            rowAlternationEnabled={true}
            className="w-full"
          >

            <Paging defaultPageSize={5} />

            <Editing
              mode="cell"
              allowUpdating={true}
              allowDeleting={false}
              allowAdding={false}
            />

            <Column
              dataField="supplierCode"
              caption={t("supplier_code")}
            />

            <Column
              dataField="supplier"
              caption={t("supplier")}
            />

            <Column
              dataField="refCode"
              caption={t("reference_code")}
            />

            <Column
              caption={t("remove")}
              width={80}
              cellRender={(cellData) => (
                <a className="cursor-pointer text-[#EF4444] hover:text-[#B91C1C] font-semibold" onClick={() => handleRemove(cellData.rowIndex)}>  X</a>
              )}
            />
          </DataGrid>
        </div>
      </div>
    </div>
  );
});

export default SuppliersCommon;