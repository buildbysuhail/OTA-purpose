import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { ERPFormButtons } from "../../../../components/ERPComponents/erp-form-buttons";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import {
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";
import ERPProductSearch from "../../../../components/ERPComponents/erp-searchbox";

const api = new APIClient();

export const initialSpecialPrice: {
  data: SpecialPriceData;
  validations: any;
  [key: string]: any;
} = {
  data: {
    isGroup: false,
    groupID: "",
    schemeID: 0,
    barcode: "",
    unitID: "",
    price: 0,
    groupPrice: 0,
    nameCode: "",
    code: false,
    product: "",
    batchID: 0,
    stdSalesPrice: 0,
    stdPurchasePrice: 0,
  },
  validations: {
    group: "",
    scheme: "",
    barcode: "",
    price: "",
  },
};

export interface SpecialPriceData {
  schemeID: number;
  isGroup: boolean;
  groupID: string;
  barcode: string;
  unitID: string;
  price: number;
  groupPrice: number;
  nameCode: string;
  code: boolean;
  product: string;
  batchID: number;
  stdSalesPrice: number;
  stdPurchasePrice: number;
}

export const SpecialPrice: React.FC = () => {
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<SpecialPriceData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    handleClear: clearForm,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<SpecialPriceData>({
    initialData: initialSpecialPrice,
    useApiClient: true,
  });

  const handleLoad = useCallback(async () => {
    try {
      debugger;
      const obj = getFieldProps("*");
      if (isNullOrUndefinedOrZero(obj.schemeID)) {
        ERPAlert.show({
          title: "",
          icon: "warning",
          text: "Please Select Any Scheme..!",
        });
        return;
      }
      setIsDataLoading(true);
      const queryString = `schemeId=${encodeURIComponent(
        obj.schemeID
      )}&productGroupID=${encodeURIComponent(obj.groupID)}`;
      const url = `${Urls.select_special_price_scheme_by_scheme_id}?${queryString}`;
      const response = await api.get(url);
      if (response) {
        setGridData(response);
      }
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [getFieldProps]);

  const handleAdd = useCallback(async () => {
    const obj: SpecialPriceData = getFieldProps("*"); // Assuming this gives you the required form data

    if (isNullOrUndefinedOrZero(obj.schemeID)) {
      ERPAlert.show({
        title: "",
        icon: "warning",
        text: "Please Select Any Scheme..!",
      });
      return false;
    }
    if (obj.isGroup) {
      if (isNullOrUndefinedOrZero(obj.groupID)) {
        ERPAlert.show({
          title: "",
          icon: "warning",
          text: "Please Select Any group..!",
        });
        return false;
      }
      const payload = {
        groupPrice: obj.groupPrice,
        schemeID: obj.schemeID,
      };
      const queryString = `groupId=${encodeURIComponent(obj.groupID)}`;
      const url = `${Urls.insert_special_price_scheme_by_group_id}?${queryString}`;
      const response = await api.postAsync(url, payload);
      handleResponse(response, () => {
        handleLoad();
      });
    } else {
      const payload = {
        // Or however you access it
        schemeID: obj.schemeID,
        productBatchID: obj.batchID,
        salesPrice: obj.stdSalesPrice,
        groupID: isNullOrUndefinedOrEmpty(obj.groupID) ? 0 : obj.groupID,
        unitID: isNullOrUndefinedOrEmpty(obj.unitID) ? 0 : obj.unitID,
      };
      const url = `${Urls.insert_special_price_scheme}`;
      const response = await api.postAsync(url, payload);
      handleResponse(response, () => {
        handleLoad();
      });
    }

    // setGridData((prevData) => [...prevData, newItem]);
  }, [gridData, getFieldProps]);

  const handleClear = useCallback(() => {
    clearForm();
  }, [clearForm]);

  const handleRemoveRow = useCallback((rowId: number) => {
    // setGridData((prevData) =>
    //   prevData.filter((item) => item.specialPriceID !== rowId)
    // );
  }, []);

  const renderDeleteCell = (cellData: any) => {
    return (
      <div className="flex justify-center">
        <button
          className="text-[#ef4444] font-bold px-2"
          onClick={() => handleRemoveRow(cellData.data.specialPriceID)}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div className="w-full modal-content flex flex-col gap-4">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-3">
        <div>
          <ERPCheckbox
            {...getFieldProps("isGroup")}
            label={t("group")}
            onChangeData={(data: any) =>
              handleFieldChange("isGroup", data.isGroup)
            }
          />
          <ERPDataCombobox
            {...getFieldProps("groupID")}
            noLabel={true}
            disabled={!formState.data.isGroup}
            field={{
              id: "groupID",
              getListUrl: Urls.data_productgroup,
              valueKey: "id",
              labelKey: "name",
              required: true,
            }}
            onChangeData={(data: any) =>
              handleFieldChange("groupID", data.groupID)
            }
          />
        </div>

        <div className="flex items-end gap-4">
          <ERPInput
            {...getFieldProps("groupPrice")}
            label={t("group_price")}
            type="number"
            className="w-full"
            onChangeData={(data: any) =>
              handleFieldChange("groupPrice", parseFloat(data.groupPrice))
            }
          />
          <ERPCheckbox
            {...getFieldProps("code")}
            label={t("code")}
            onChangeData={(data: any) => handleFieldChange("code", data.code)}
          />
        </div>

        <ERPDataCombobox
          {...getFieldProps("schemeID")}
          field={{
            id: "schemeID",
            getListUrl: Urls.select_price_schemes_for_combo,
            valueKey: "id",
            labelKey: "name",
          }}
          label={t("scheme")}
          onChangeData={(data: any) => {
            debugger;
            handleFieldChange("schemeID", data.schemeID);
          }}
        />

<ERPProductSearch
        type="text"
        id='test'
        keyId='testserch'
        placeholder="Search Here"
        productDataUrl={Urls.load_product_details}
      />
      </div>

      <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-2 max-sm:grid-cols-1 gap-3">
        <ERPInput
          {...getFieldProps("barcode")}
          label={t("barcode")}
          onChangeData={(data: any) =>
            handleFieldChange("barcode", data.barcode)
          }
        />

        <ERPInput
          {...getFieldProps("price")}
          label={t("price")}
          type="number"
          onChangeData={(data: any) =>
            handleFieldChange("price", parseFloat(data.price))
          }
        />

        <ERPInput
          {...getFieldProps("unit")}
          label={t("unit")}
          type="number"
          onChangeData={(data: any) =>
            handleFieldChange("unit", parseFloat(data.unit))
          }
        />

        <ERPInput
          {...getFieldProps("stdSalesPrice")}
          label={t("std_sales_price")}
          type="number"
          onChangeData={(data: any) =>
            handleFieldChange("stdSalesPrice", parseFloat(data.stdSalesPrice))
          }
        />

        <ERPInput
          {...getFieldProps("stdPurchasePrice")}
          label={t("std_purchase_price")}
          type="number"
          onChangeData={(data: any) =>
            handleFieldChange(
              "stdPurchasePrice",
              parseFloat(data.stdPurchasePrice)
            )
          }
        />

        <ERPInput
          {...getFieldProps("product")}
          label={t("product")}
          onChangeData={(data: any) =>
            handleFieldChange("product", data.product)
          }
        />
      </div>

      <div className="flex justify-end gap-4">
        <ERPButton
          title={t("load")}
          variant="secondary"
          onClick={handleLoad}
          disabled={isDataLoading}
        />
        <ERPButton title={t("add")} variant="secondary" onClick={handleAdd} />
        <ERPButton
          title={t("clear")}
          variant="secondary"
          onClick={handleClear}
        />
      </div>

      <div>
        <DataGrid
          dataSource={gridData}
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
          <Column dataField="productName" width={375} caption={t("name")} />
          <Column dataField="autoBarcode" width={125} caption={t("barcode")} />
          <Column dataField="unitName" width={60} caption={t("unit")} />
          <Column
            dataField="productBatchID"
            width={60}
            caption={t("product_batch_id")}
          />
          <Column
            dataField="specialPriceID"
            width={100}
            caption={t("special_price_id")}
          />
          <Column
            dataField="stdSalesPrice"
            width={100}
            caption={t("price")}
          />
          <Column dataField="salesPrice" width={100} caption={t("scheme_price")} />
          <Column caption="X" cellRender={renderDeleteCell} width={30} />
        </DataGrid>
      </div>

    
    </div>
  );
};

export default SpecialPrice;
