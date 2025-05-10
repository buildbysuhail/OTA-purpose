import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Selection,
} from "devextreme-react/data-grid";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import {
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";

const api = new APIClient();

export const initialGiftOnBilling = {
  data: {
    giftProductId: 0,
    giftOnBillingID: 0,
    giftProductBatchId: 0,
    totalBillRangeFrom: 0,
    totalBillRangeTo: 0,
    giftBarcode: "",
    itemName: "",
    quantity: 0,
    price: 0,
    loadAllGiftOnBilling: false,
    rangeFrom: 0,
    rangeTo: 0,
    giftItem: "",
    cashCouponValue: 0.0,
    specialPrice: 0,
  },
  validations: {
    totalBillRangeFrom: "",
    totalBillRangeTo: "",
    giftBarcode: "",
    itemName: "",
    quantity: "",
    price: "",
  },
};

export interface GiftOnBillingData {
  giftProductId: number;
  giftOnBillingID: number;
  giftProductBatchId: number;
  totalBillRangeFrom: number;
  totalBillRangeTo: number;
  giftBarcode: string;
  itemName: string;
  quantity: number;
  price: number;
  loadAllGiftOnBilling: boolean;
  rangeFrom: number;
  rangeTo: number;
  giftItem: string;
  cashCouponValue: number;
  specialPrice: number;
}
// export interface GiftOnBillingData {
//     autoBarcode: string;
//     billingId: number | null;
//     billingId_Validation: string | null;
//     cashCouponValue: number;
//     giftOnBillingID: number;
//     giftProductBatchID: number;
//     giftProductBatchID_Validation: string | null;
//     isValid: boolean;
//     productName: string;
//     quantity: number;
//     rangeFrom: number;
//     rangeTo: number;
//     specialPrice: number;
// }
export interface GiftEntryParams {
  rangeFrom: number;
  rangeTo: number;
  giftProductBatchId: number;
  quantity: number;
  createdUserId: number;
  cashCouponValue: number;
}

export const GiftOnBilling: React.FC = () => {
  const { t } = useTranslation("inventory");
  const [gridData, setGridData] = useState<GiftOnBillingData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number[]>([]);

  const {
    isEdit,
    handleSubmit,
    handleFieldChange,
    handleDataChange,
    handleClear: clearForm,
    getFieldProps,
    isLoading,
    formState,
  } = useFormManager<GiftOnBillingData>({
    initialData: initialGiftOnBilling,
    useApiClient: true,
  });

  const isFormDisabled = formState.data.loadAllGiftOnBilling;
  const handleLoad = useCallback(async () => {
    setIsDataLoading(true);
    setGridData([]);
    try {
      const response = await api.get(Urls.gift_on_billing);
      if (response) {
        setGridData(response);
      }
    } catch (error) {
      console.error("Error fetching MultiFOS data:", error);
      ERPAlert.show({
        title: "",
        icon: "error",
        text: "Failed to load MultiFOS data.",
      });
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  const handleAdd = useCallback(() => {
    const obj = getFieldProps("*");
    if (
      isNullOrUndefinedOrZero(obj.totalBillRangeFrom) ||
      isNullOrUndefinedOrZero(obj.totalBillRangeTo) ||
      obj.totalBillRangeFrom > obj.totalBillRangeTo
    ) {
      ERPAlert.show({
        title: "",
        icon: "warning",
        text: "Invalid Range: 'From' should be less than or equal to 'To' and both must be valid numbers...!",
      });
      return;
    }

    if (isNullOrUndefinedOrEmpty(obj.giftBarcode)) {
      //|| isNullOrUndefinedOrZero(obj.giftProductBatchId  thsi need
      ERPAlert.show({
        title: "",
        icon: "warning",
        text: "Invalid Gift Item: Barcode must be present and Gift Product Batch ID must be greater than 0",
      });
      return;
    }
    const newItem: GiftOnBillingData = {
      ...formState.data,
      giftOnBillingID:
        gridData.length > 0
          ? Math.max(...gridData.map((item) => item.giftOnBillingID)) + 1
          : 1,
      rangeFrom: obj.totalBillRangeFrom,
      rangeTo: obj.totalBillRangeTo,
      giftItem: obj.itemName,
      giftProductId: obj.giftProductId,
      giftProductBatchId: obj.giftProductBatchId,
    };
    setGridData((prevData) => [...prevData, newItem]);
    handleClear();
  }, [formState.data, gridData]);

  const handleClear = useCallback(() => {
    clearForm();
  }, [clearForm]);
  const handleDelete = useCallback(
    async (rowId: number | null = null) => {
      if (!selectedRow.length) {
        ERPAlert.show({
          title: "",
          icon: "error",
          text: "no rows selected",
        });
        return;
      }
      let selectedRows: GiftOnBillingData[] | null = null
      if (rowId ?? 0 > 0) {
      selectedRows = gridData.filter((row) =>row.giftOnBillingID == rowId
      );
      }
      else {
      selectedRows = gridData.filter((row) =>
        selectedRow.includes(row.giftOnBillingID)
      );
    }
      const rowsToDeleteLocally = selectedRows.filter(
        (row) => row.giftOnBillingID === 0
      );
      const rowsToDeleteViaApi = selectedRows.filter(
        (row) => row.giftOnBillingID !== 0
      );
      const payload = rowsToDeleteViaApi.map((row) => ({
        giftOnBillingID: row.giftOnBillingID,
      }));
      try {
        setDeleteLoading(true);
        // Make API call to delete with productIDs
        if (rowsToDeleteLocally.length > 0) {
          setGridData((prev) =>
            prev.filter(
              (row) =>
                !rowsToDeleteLocally.some(
                  (selected) => selected.giftOnBillingID === row.giftOnBillingID
                )
            )
          );
        }
        debugger;
        if (rowsToDeleteViaApi.length > 0) {
          const response = await api.delete(`${Urls.gift_on_billing}`, {
            data: payload,
          });
          handleResponse(response, () => {
            const removed = payload.map((x) => x.giftOnBillingID);
            debugger;
            setGridData((prev: any[]) =>
              prev.filter((x: any) => !removed.includes(x.giftOnBillingID))
            );
          });
        }
      } catch (error) {
        console.error(`Error deleting rows:`, error);
      } finally {
        setDeleteLoading(false);
      }
    },
    [gridData, selectedRow, t]
  );

  const handleRemoveRow = useCallback((rowId: number) => {
    handleDelete(rowId)
    
  }, []);

  const handleSave = useCallback(async () => {
    try {
      // Check if gridData is empty
      if (gridData.length === 0) {
        ERPAlert.show({
          title: "",
          icon: "warning",
          text: "No data to save. Please add items to the grid.",
        });
        return;
      }

      //   // Transform gridData into GiftEntryParams array
      //   const payload: GiftEntryParams[] = gridData.map((item) => {
      //     // Validate required fields
      //     if (
      //       isNullOrUndefinedOrZero(item.rangeFrom) ||
      //       isNullOrUndefinedOrZero(item.rangeTo) ||
      //       isNullOrUndefinedOrZero(item.giftProductBatchId) ||
      //       isNullOrUndefinedOrZero(item.quantity)
      //     ) {
      //       throw new Error("Invalid data: All required fields must be valid.");
      //     }

      //     return {
      //       rangeFrom: item.rangeFrom,
      //       rangeTo: item.rangeTo,
      //       giftProductBatchId: item.giftProductBatchId,
      //       quantity: item.quantity,
      //       createdUserId: 1, // Replace with actual logic to get user ID
      //       cashCouponValue: item.cashCouponValue || 0, // Use 0 if undefined
      //     };
      //   });

      // Make POST request
      const response = await api.post(Urls.gift_on_billing, gridData);
      handleResponse(response, () => {
        setGridData([]);
        handleClear();
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      ERPAlert.show({
        title: "",
        icon: "error",
        text: "Failed to save gift entries. Please try again.",
      });
    }
  }, [gridData]);

  const handleSelectAllToDelete = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectAll(e.target.checked);
    },
    []
  );

  const handleClearAll = useCallback(() => {
    setGridData([]);
    handleClear();
  }, []);

  const renderDeleteCell = (cellData: any) => {
    return (
      <div className="flex justify-center">
        <button
          className="text-[#ef4444] font-bold px-2"
          onClick={() => handleRemoveRow(cellData.data.giftOnBillingID)}
        >
          X
        </button>
      </div>
    );
  };

  const fetchByBarcode = useCallback(async () => {
    try {
      const obj = getFieldProps("*");
      if (isNullOrUndefinedOrEmpty(obj.giftBarcode)) {
        return;
      }
      setIsDataLoading(true);
      const url = `${Urls.select_product_by_barcode_multi_foc}${obj.giftBarcode}`;
      const response = await api.get(url);
      if (response) {
        handleDataChange({
          ...obj,
          giftProductId: response.productBatchID,
          giftProductBatchId: response.productBatchID,
        });
      }
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsDataLoading(false);
    }
  }, [getFieldProps, handleDataChange]);

  const fetchByProduct = useCallback(async () => {
    const obj = getFieldProps("*");
    try {
      if (isNullOrUndefinedOrZero(obj.giftProductId)) {
        return;
      }
      setIsDataLoading(true);
      const url = `${Urls.gift_on_billing}${obj.giftProductId}`; //change url it for demo
      const response = await api.get(url);
      debugger;
      const updatedData: Partial<GiftOnBillingData> = {
        giftProductBatchId: response.productBatchID,
        giftBarcode: response.autoBarcode,
      };
      handleDataChange({
        ...obj,
        ...updatedData,
      } as GiftOnBillingData);
      setIsDataLoading(false);
    } catch (error) {
      console.error(`Error fetching ${obj.giftProductId} data:`, error);
      setIsDataLoading(false);
    }
  }, [getFieldProps, handleDataChange]);

  useEffect(() => {
    if (formState.data.loadAllGiftOnBilling) {
      handleLoad();
    } else {
      setGridData([]);
    }
  }, [formState.data.loadAllGiftOnBilling]);

  useEffect(() => {
    if (formState.data.giftProductId) {
      fetchByProduct();
    }
  }, [formState.data.giftProductId]);
  const onSelectionChanged = useCallback(
    ({ selectedRowKeys }: { selectedRowKeys: number[] }) => {
      setSelectedRow(selectedRowKeys);
    },
    []
  );
  return (
    <div className="w-full p-2 bg-gray-100">
      <div className="bg-white p-2 rounded-md shadow-sm mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-36 mb-2 sm:mb-0">
            <ERPInput
              {...getFieldProps("totalBillRangeFrom")}
              label={t("total_bill_range_from")}
              type="number"
              className="w-full"
              disabled={isFormDisabled}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "totalBillRangeFrom",
                  parseFloat(data.totalBillRangeFrom)
                )
              }
            />
          </div>

          <div className="w-full sm:w-36 mb-2 sm:mb-0">
            <ERPInput
              {...getFieldProps("totalBillRangeTo")}
              label={t("total_bill_range_to")}
              type="number"
              disabled={isFormDisabled}
              onChangeData={(data: any) =>
                handleFieldChange(
                  "totalBillRangeTo",
                  parseFloat(data.totalBillRangeTo)
                )
              }
            />
          </div>

          <ERPCheckbox
            {...getFieldProps("loadAllGiftOnBilling")}
            label={t("load_all_gift_on_billing")}
            onChangeData={(data: any) =>
              handleFieldChange(
                "loadAllGiftOnBilling",
                data.loadAllGiftOnBilling
              )
            }
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-36 mb-2 sm:mb-0">
            <ERPInput
              {...getFieldProps("giftBarcode")}
              label={t("gift_barcode")}
              onChangeData={(data: any) =>
                handleFieldChange("giftBarcode", data.giftBarcode)
              }
              onBlur={() => fetchByBarcode()}
              disabled={isFormDisabled}
            />
          </div>

          <ERPDataCombobox
            {...getFieldProps("giftProductId")}
            label={t("item_name")}
            field={{
              id: "giftProductId",
              getListUrl: Urls.data_products,
              valueKey: "id",
              labelKey: "name",
            }}
            className="w-[350px]"
            onChange={(data: any) =>
              handleFieldChange({
                giftProductId: data.value,
                itemName: data.name,
              })
            }
            disabled={isFormDisabled}
            //   onBlur={fetchByProduct}
          />

          <div className="grid grid-cols-2 gap-4">
            <ERPInput
              {...getFieldProps("quantity")}
              label={t("quantity")}
              type="number"
              className="max-w-[150px]"
              disabled={isFormDisabled}
              onChangeData={(data: any) =>
                handleFieldChange("quantity", parseFloat(data.quantity))
              }
            />

            <ERPInput
              {...getFieldProps("price")}
              label={t("price")}
              type="number"
              className="max-w-[150px]"
              disabled={isFormDisabled}
              onChangeData={(data: any) =>
                handleFieldChange("price", parseFloat(data.price))
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <ERPButton
            title={t("add")}
            variant="secondary"
            disabled={isFormDisabled}
            onClick={handleAdd}
          />

          <ERPButton
            title={t("delete")}
            disabled={
              !formState.data.loadAllGiftOnBilling ||
              isDeleteLoading ||
              selectedRow.length == 0
            }
            variant="secondary"
            onClick={() => handleDelete()}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-300">
        <DataGrid
          dataSource={gridData}
          showBorders={true}
          rowAlternationEnabled={true}
          keyExpr="giftOnBillingID"
          selectedRowKeys={selectedRow}
          onSelectionChanged={onSelectionChanged}
          className="w-full"
        >
          <Paging defaultPageSize={10} />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={false}
            allowAdding={false}
          />
          <Selection
            mode="multiple"
            selectAllMode={"page"}
            showCheckBoxesMode={"always"}
          />

          <Column dataField="rangeFrom" width={45} caption={t("range_from")} />
          <Column dataField="rangeTo" width={45} caption={t("range_to")} />
          <Column dataField="autoBarcode" width={60} caption={t("barcode")} />
          <Column
            dataField="productName"
            width={385}
            caption={t("gift_item")}
          />
          <Column dataField="quantity" width={40} caption={t("qty")} />
          <Column
            dataField="giftProductBatchID"
            width={70}
            caption={t("product_batch_id")}
          />
          <Column
            dataField="cashCouponValue"
            width={395}
            caption={t("cash_coupon_value")}
          />
          <Column
            dataField="specialPrice"
            width={100}
            caption={t("special_price")}
          />
          <Column caption="X" cellRender={renderDeleteCell} width={20} />
        </DataGrid>
      </div>

      <div className="flex justify-end gap-4 items-center mt-2">
        <ERPButton
          title={t("clear")}
          variant="secondary"
          onClick={handleClearAll}
        />
        <ERPButton title={t("save")} variant="primary" onClick={handleSave} />
      </div>
    </div>
  );
};

export default GiftOnBilling;
