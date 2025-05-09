import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import DataGrid, {
  Column,
  Editing,
  FilterRow,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import {
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { productDto } from "../products/products-type";

const api = new APIClient();

export const initialQuantityLimit: {
  data: QuantityLimitData;
  validations: any;
} = {
  data: {
    sectionID: -2,
    section: "",
    productCategoryId: 0,
    productCategory: "",
    productGroupID: 0,
    productGroup: "",
    selectedOption: "department",
    barcode: "",
    quantityLimit: 0,
    itemData: [],
    itemQtyLimitID: 0,
    department: "",
    category: "",
  },
  validations: {
    department: "",
    category: "",
    productGroup: "",
    barcode: "",
    quantityLimit: "",
  },
};

export interface QuantityLimitData {
  itemQtyLimitID: number;
  selectedOption: string;
  section: string;
  department: string;
  productCategory: string;
  sectionID: number;
  category: string;
  productCategoryId: number;
  productGroup: string;
  productGroupID: number;
  barcode: string;
  quantityLimit: number;
  itemData: any[];
}

export interface QuantityLimitItemData {
  itemQtyLimitID: number;
  slNo: number;
  autoBarcode: string;
  barCode: string;
  productID: number;
  productName: string;
  qtyLimit: number;
}

export const QuantityLimit: React.FC = () => {
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<QuantityLimitItemData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number[]>([]);
  const [quantityLimitForm, setQuantityLimitForm] = useState(initialQuantityLimit);
  const [gridHeight,setGridHeight]=useState(500)

    useEffect(() => {
      let wh = window.innerHeight - 300;
      setGridHeight(wh);
    }, [window.innerHeight]);

    const handleOptionChange = (option: string) => {
      setQuantityLimitForm((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          selectedOption: option,
          // Reset irrelevant fields based on the selected option
          sectionID: option === "department" ? prev.data.sectionID : 0,
          productCategoryId: option === "category" ? prev.data.productCategoryId : 0,
          productGroupID: option === "productGroup" ? prev.data.productGroupID : 0,
          barcode: option === "barcode" ? prev.data.barcode : "",
        },
      }));
    };

  const handleLoadByProp = useCallback(async (obj: QuantityLimitData) => {
    let payload = {
      sectionID: (isNullOrUndefinedOrZero(obj.sectionID) && obj.selectedOption !== "department") ? -1 : obj.sectionID,
      productCategoryId:( isNullOrUndefinedOrZero(obj.productCategoryId)&& obj.selectedOption !== "category") 
        ? -1
        : obj.productCategoryId,
      productGroupId: ( isNullOrUndefinedOrZero(obj.productGroupID)&& obj.selectedOption !== "productGroup") 
        ? -1
        : obj.productGroupID,
      barcode: ( isNullOrUndefinedOrEmpty(obj.barcode)&& obj.selectedOption !== "barcode")  ? "" : obj.barcode,
      isBarcode: ( isNullOrUndefinedOrEmpty(obj.barcode)&& obj.selectedOption !== "barcode")  ? false : true,
    };
    let queryString = Object.entries(payload)
      .map(
        ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
      )
      .join("&");

    try {
      const response = await api.getAsync(
        `${Urls.select_products_for_product_qty_limit}?${queryString}`
      );
      handleResponse(response);
      setGridData(response);
      // handleClear();
    } catch (error) {
      console.error(`Error fetching data for`, error);
      setGridData([]);
    } 
  }, []);

  const handleLoad = useCallback(async () => {
    try {
      setIsDataLoading(true);

      const response = await api.getAsync(`${Urls.quantity_limit}`);
      setGridData(response);
      handleClear();
    } catch (error) {
      console.error(`Error fetching data for`, error);
      setGridData([]);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  const handleAdd = useCallback(async () => {
    try {
      setIsSaveLoading(true);
      const response = await api.postAsync(`${Urls.quantity_limit}`,gridData);
      setGridData(response);
      handleClear();
    } catch (error) {
      console.error(`Error fetching data for`, error);
      setGridData([]);
    } finally {
      setIsSaveLoading(false);
    }
  }, [gridData]);

  const handleClear = useCallback(() => {
    setQuantityLimitForm(initialQuantityLimit);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedRow.length) {
        ERPAlert.show({
              title: "",
              icon: "error",
              text: "no rows selected",
            });
      return;
    }

    // Get selected rows based on selectedRowKeys
    const selectedRows = gridData.filter((row) =>selectedRow.includes(row.slNo));
    const productIDs = selectedRows.map(row => ({
      productID: row.productID ,
    }));
    try {
      setDeleteLoading(true);
      // Make API call to delete with productIDs
      const response = await api.delete(`${Urls.quantity_limit}`, {data:productIDs} );
      handleResponse(response);
      setSelectedRow([]); 
    } catch (error) {
      console.error(`Error deleting rows:`, error);
    } finally {
      setDeleteLoading(false);
    }
  }, [gridData, selectedRow, t]);

  const onSelectionChanged = useCallback(
    ({ selectedRowKeys }: { selectedRowKeys: number[] }) => {
      setSelectedRow(selectedRowKeys);
    },
    []
  );
  
  const handleRemoveRow = useCallback(async(rowId: number) => {
    ERPAlert.show({
      title: "Warning",
      icon: "warning",
      text: "Are sure you want remove this row!",
      onConfirm: () => {
        setGridData((prev: any[]) =>
          prev.filter((x: any) => x.slNo !== rowId)
        );
      },
    });
      
  }, []);

  const renderDeleteCell = (cellData: any) => {
    return (
      <div className="flex justify-center">
        <button
          className="text-[#ef4444] font-bold px-2"
          onClick={() => handleRemoveRow(cellData.data.slNo)}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div className="w-full modal-content flex flex-col gap-4">
      <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-1 items-end gap-3">
        <div>
          <ERPRadio
            id="department"
            name="limitOption"
            label={t("department")}
            checked={quantityLimitForm.data.selectedOption === "department"}
            className="w-full"
            onChange={() => handleOptionChange("department")}
          />
          <ERPDataCombobox
            id="sectionID"
            field={{
              id: "sectionID",
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_sections,
            }}
            noLabel
            data={quantityLimitForm.data}
            value={quantityLimitForm.data.sectionID}
            disabled={quantityLimitForm.data.selectedOption !== "department"}
            className="w-full"
            onChangeData={(data: any) => {
              const obj = { ...quantityLimitForm.data, sectionID: data.sectionID };
              handleLoadByProp(obj);
              setQuantityLimitForm((prev) => ({
                ...prev,
                data: { ...prev.data, sectionID: data.sectionID },
              }));
            }}
          />
        </div>

        <div>
          <ERPRadio
            id="category"
            name="limitOption"
            label={t("category")}
            className="w-full"
            checked={quantityLimitForm.data.selectedOption === "category"}
            onChange={() => handleOptionChange("category")}
          />
          <ERPDataCombobox
            id="productCategoryId"
            field={{
              id: "productCategoryId",
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_productcategory,
            }}
            noLabel
            data={quantityLimitForm.data}
            value={quantityLimitForm.data.productCategoryId}
            disabled={quantityLimitForm.data.selectedOption !== "category"}
            className="w-full"
            onChangeData={(data: any) => {
              const obj = {
                ...quantityLimitForm.data,
                productCategoryId: data.productCategoryId,
              };
              handleLoadByProp(obj);
              setQuantityLimitForm((prev) => ({
                ...prev,
                data: { ...prev.data, productCategoryId: data.productCategoryId },
              }));
            }}
          />
        </div>

        <div>
          <ERPRadio
            id="productGroup"
            name="limitOption"
            label={t("product_group")}
            className="w-full"
            checked={quantityLimitForm.data.selectedOption === "productGroup"}
            onChange={() => handleOptionChange("productGroup")}
          />
          <ERPDataCombobox
            id="productGroupId"
            field={{
              id: "productGroupId",
              valueKey: "id",
              labelKey: "name",
              getListUrl: Urls.data_productgroup,
            }}
            noLabel
            data={quantityLimitForm.data}
            value={quantityLimitForm.data.productGroupID}
            disabled={quantityLimitForm.data.selectedOption !== "productGroup"}
            className="w-full"
            onChangeData={(data: any) => {
              const obj = {
                ...quantityLimitForm.data,
                productGroupID: data.productGroupId,
              };
              handleLoadByProp(obj);
              setQuantityLimitForm((prev) => ({
                ...prev,
                data: { ...prev.data, productGroupID: data.productGroupId },
              }));
            }}
          />
        </div>

        <div>
          <ERPRadio
            id="barcode"
            name="barcode"
            label={t("barcode")}
            className="w-full"
            checked={quantityLimitForm.data.selectedOption === "barcode"}
            onChange={() => handleOptionChange("barcode")}
          />
          <ERPInput
            id="barcode"
            noLabel
            value={quantityLimitForm.data.barcode}
            disabled={quantityLimitForm.data.selectedOption !== "barcode"}
            className="w-full"
            data={quantityLimitForm.data}
            onChangeData={(data: any) => {
              setQuantityLimitForm((prev) => ({
                ...prev,
                data: { ...prev.data, barcode: data.barcode },
              }));
            }}
            disableEnterNavigation
            onEnterKeyDown={(data: any) => {
              handleLoadByProp(quantityLimitForm.data);
            }}
          />
        </div>

        <div>
          <ERPInput
            id="quantityLimit"
            name="quantityLimit"
            label={t("quantity_limit")}
            type="number"
            value={quantityLimitForm.data.quantityLimit}
            className="w-full"
            data={quantityLimitForm.data}
            onChangeData={(data: any) => {
              setQuantityLimitForm((prev) => ({
                ...prev,
                data: { ...prev.data, quantityLimit: parseInt(data.quantityLimit) },
              }));
            }}
            disableEnterNavigation
            onEnterKeyDown={() => {
              const quantityLimit = Number(quantityLimitForm.data.quantityLimit);

              if (!quantityLimit || isNaN(quantityLimit)) {
                alert("Please enter a valid Quantity Limit.");
                return;
              }

              const productList: QuantityLimitItemData[] = gridData;

              if (!productList.length) {
                alert(
                  "There is no product. Please fill products before setting the quantity limit."
                );
                return;
              }

              const updatedList = productList.map((item) => {
                if (!item.productID) {
                  return { ...item };
                }

                return {
                  ...item,
                  maxQty: quantityLimit,
                };
              });

              setGridData(updatedList);
            }}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <ERPButton
          title={t("load")}
          variant="primary"
          onClick={handleLoad}
          loading={isDataLoading}
          disabled={isDataLoading}
        />
          <ERPButton
          title={t("clear")}
          variant="secondary"
          onClick={handleClear}
        />
        <ERPButton
          title={t("save")}
          variant="primary"
          onClick={handleAdd}
          loading={isSaveLoading}
          disabled={isSaveLoading}
        />
    
          <ERPButton
          title={t("delete")}
          variant="secondary"
          onClick={handleDelete}
          disabled={isDeleteLoading || !selectedRow.length}
        />
      </div>

      <div className="bg-white border border-gray-300 mt-4">
        <DataGrid
          dataSource={gridData}
          height={gridHeight}
          showBorders={true}
          rowAlternationEnabled={true}
          className="w-full"
          keyExpr="slNo"
          selectedRowKeys={selectedRow}
          onSelectionChanged={onSelectionChanged}
        >
            <Selection
          mode="multiple"
          selectAllMode={ "page"}
          showCheckBoxesMode={"always" }
        />
        {/* <FilterRow visible={true} /> */}
          <Paging defaultPageSize={100} />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={false}
            allowAdding={false}
          />
          <Column
            dataField="slNo"
            caption={t("slNo")}
            dataType="number"
            width={100}
          />
          <Column
            dataField="barCode"
            width={200}
            dataType="string"
            caption={t("barcode")}
          />
          <Column
            dataField="autoBarcode"
            width={200}
            dataType="string"
            caption={t("auto_barcode")}
          />
          <Column
            dataField="productName"
            width={250}
            dataType="string"
            caption={t("product")}
          />
          <Column
              dataField="maxQty"
              dataType="number"
              width={100}
              caption={t("qty_limit")}
          /> 
           <Column caption={t("X")} cellRender={renderDeleteCell} width={40} />
        </DataGrid>
      </div>
    </div>
  );
};

export default QuantityLimit;