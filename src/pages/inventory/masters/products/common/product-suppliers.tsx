import React, { useState } from "react";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../../redux/urls";
import { useTranslation } from "react-i18next";

interface SupplierDto {
  supplier: {
    code: string;
    name: string;
    productCode: string;
  };
}

const initialSupplierData: SupplierDto = {
  supplier: {
    code: "",
    name: "",
    productCode: ""
  }
};

const SuppliersCommon: React.FC = () => {
  const { handleFieldChange, getFieldProps } = useFormManager<SupplierDto>({ initialData: initialSupplierData, });
  const [gridData, setGridData] = useState<any[]>([]);
  const onAdd = () => {
    const newRow = {
      si: gridData.length + 1,
      supplierCode: getFieldProps("supplier.code").value,
      supplier: getFieldProps("supplier.name").value,
      referenceCode: getFieldProps("supplier.productCode").value,
    };
    setGridData([...gridData, newRow]);
    handleFieldChange("supplier.code", "");
    handleFieldChange("supplier.productCode", "");
  };

  const handleRemoveRow = (rowKey: any) => {
    const updatedData = gridData.filter(row => row.si !== rowKey);
    const reindexedData = updatedData.map((row, index) => ({
      ...row,
      si: index + 1
    }));
    setGridData(reindexedData);
  };

  const { t } = useTranslation('inventory')

  return (
    <div className="border border-[#ccc] inline-block rounded-md p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <ERPInput
            {...getFieldProps("supplier.code")}
            label={t("supplier_code")}
            placeholder={t("enter_supplier_code")}
            required={false}
            onChangeData={(data) => handleFieldChange("supplier.code", data.code)}
            className="w-full"
          />

          <ERPDataCombobox
            {...getFieldProps("supplier.name")}
            label={t("supplier_name")}
            field={{
              getListUrl: Urls.data_CustSupp,
              labelKey: "label",
              valueKey: "value",
            }}
            onChangeData={(data) => handleFieldChange("supplier.name", data.name)}
            className="w-full"
          />

          <ERPInput
            {...getFieldProps("supplier.productCode")}
            label={t("supplier_product_code")}
            placeholder={t("enter_product_code")}
            required={false}
            onChangeData={(data) => handleFieldChange("supplier.productCode", data.productCode)}
            className="w-full"
          />

          <ERPButton
            title={t("add")}
            variant="primary"
            onClick={onAdd}
          />
        </div>

        {/* DataGrid Section */}
        <div className="p-4 rounded-md shadow">
          <DataGrid
            dataSource={gridData}
            keyExpr="si"
            showBorders={true}
            rowAlternationEnabled={true}
            className="w-full">

            <Paging defaultPageSize={5} />

            <Editing
              mode="cell"
              allowUpdating={true}
              allowDeleting={false}
              allowAdding={false}
            />

            <Column dataField="si" caption={t("si")} width={60} allowEditing={false} />
            <Column dataField="supplierCode" caption={t("supplier_code")} />
            <Column dataField="supplier" caption={t("supplier")} />
            <Column dataField="referenceCode" caption={t("reference_code")} />

            <Column
              caption={t("remove")}
              width={80}
              cellRender={(cellData) => (
                <ERPButton
                  title="X"
                  onClick={() => handleRemoveRow(cellData.data.si)}
                />
              )}
            />
          </DataGrid>
        </div>
      </div>
    </div>
  );
};

export default SuppliersCommon;