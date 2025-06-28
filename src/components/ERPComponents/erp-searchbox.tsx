import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import { APIClient } from "../../helpers/api-client";
import debounce from "lodash/debounce";
import { DataGrid } from "devextreme-react";
import {
  Column,
  KeyboardNavigation,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/cjs/data-grid";
import { useTranslation } from "react-i18next";
import CustomStore from "devextreme/data/custom_store";
import ERPInput from "../../components/ERPComponents/erp-input";
import { isNullOrUndefinedOrEmpty } from "../../utilities/Utils";
import ERPCheckbox from "./erp-checkbox";
import ERPModal from "./erp-modal";
import { set } from "lodash";
import ProductModalGrid from "./erp-searchbox-modalContent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formStateHandleFieldChangeKeysOnly } from "../../pages/inventory/transactions/purchase/reducer";
import Urls from "../../redux/urls";
import { TransactionDetail } from "../../pages/inventory/transactions/purchase/transaction-types";

interface InputProps {
  id: string,
  inputId?: string;
  label?: string;
  productDataUrl?: string;
  batchDataUrl?: string;
  keyId?: string;
  onProductSelected?: (data: any) => void;
  onRowSelected?: (data: any, rowValue?: string) => void;
  onEnterKeyDown?: () => void;
  onChange?: (e: any) => void;
  onKeyDown?: (value: any,e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className: string;
  checkboxLabel?: string;
  value?: string;
  clearAfterSelection?: boolean;
  showCheckBox?: boolean;
  searchType?: "grid" | "normal" | "modal";
  placeholder?: string;
  labelDirection?: "horizontal" | "vertical";
  contextClassNametwo?: string;
  noLabel?: boolean;
  useInSearch?: boolean;
  useCodeSearch?: boolean;
  advancedProductSearching?: boolean;
  searchKey?: string;
  rowIndex?: number;
}

interface LoadResult {
  data: any[];
  totalCount: number;
  summary?: any;
  groupCount?: number;
}

const api = new APIClient();

const createStore = async (
  value: string,
  payload: any,
  productDataUrl?: string
) => {
  return new CustomStore({
    key: "productID",
    async load(loadOptions: any) {
      const paramNames = [
        "skip",
        "take",
        "requireTotalCount",
        "sort",
        "filter",
      ];
      const queryString = paramNames
        .filter(
          (paramName) =>
            loadOptions[paramName] !== undefined &&
            loadOptions[paramName] !== null &&
            loadOptions[paramName] !== ""
        )
        .map(
          (paramName) =>
            `${paramName}=${JSON.stringify(loadOptions[paramName])}`
        )
        .join("&");

      try {
        const url = productDataUrl || "";
        const response = await api.postAsync(
          queryString && queryString !== ""
            ? `${url}?${queryString}`
            : `${url}?skip=0`,
          payload
        );
        const result = response;
        return result !== undefined && result !== null
          ? {
              data: result.data,
              totalCount: result.totalCount,
            }
          : {
              data: [],
              totalCount: 0,
              summary: {},
              groupCount: 0,
            };
      } catch (err) {
        throw new Error("Data Loading Error");
      }
    },
  });
};

const createBatchStore = async (productID: string, batchDataUrl?: string) => {
  return new CustomStore({
    key: "productBatchID",
    async load(loadOptions: any) {
      const paramNames = [
        "skip",
        "take",
        "requireTotalCount",
        "sort",
        "filter",
      ];
      const queryString = paramNames
        .filter(
          (paramName) =>
            loadOptions[paramName] !== undefined &&
            loadOptions[paramName] !== null &&
            loadOptions[paramName] !== ""
        )
        .map(
          (paramName) =>
            `${paramName}=${JSON.stringify(loadOptions[paramName])}`
        )
        .join("&");

      try {
        const url = `${batchDataUrl}${productID}` || "";
        const response = await api.getAsync(
          queryString && queryString !== ""
            ? `${url}?${queryString}`
            : `${url}?skip=0`
        );
        const result = response;
        return result !== undefined && result !== null
          ? {
              data: result.data,
              totalCount: result.totalCount,
            }
          : {
              data: [],
              totalCount: 0,
              summary: {},
              groupCount: 0,
            };
      } catch (err) {
        throw new Error("Batch Data Loading Error");
      }
    },
  });
};

const ERPProductSearch = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      inputId,
      label,
      productDataUrl,
      batchDataUrl,
      keyId,
      onRowSelected,
      onProductSelected,
      onEnterKeyDown,
      checkboxLabel,
      onChange,
      value,
      placeholder,
      noLabel,
      labelDirection = "vertical",
      contextClassNametwo,
      clearAfterSelection = true,
      showCheckBox = true,
      searchType = "grid",
      useInSearch = false,
      useCodeSearch = false,
      advancedProductSearching = false,
      searchKey = "",
      rowIndex,
      ...rest
    },
    ref
  ) => {
    const [store, setStore] = useState<any>();
    const [productDetailStore, setProductDetailStore] = useState<any>();
    const [inputValue, setInputValue] = useState({
      searchValue: value,
      searchByCode: false,
    });
    const dataGridRef = useRef<any>(null);
    const batchGridRef = useRef<any>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRef;
    const { t } = useTranslation("inventory");
    const dispatch = useDispatch();

    const formState = useSelector(
      (state: RootState) => state.InventoryTransaction
    );
    const applicationSettings = useSelector(
      (state: RootState) => state.ApplicationSettings
    );
    useEffect(() => {
      setInputValue((prev) => ({
        ...prev,
        searchValue: value,
      }));
    }, [value]);

    const debouncedFetch = useMemo(
      () =>
        debounce(async (value: string) => {
          if (value.trim() == "" || value.trim() == "%") {
          }
          let byCode = inputValue.searchByCode;
          let payload: any = {};
          if (searchType === "modal") {
            // dispatch(formStateHandleFieldChangeKeysOnly({fields: {formElements:{dgvProduct: {visible: true}}}}));
          } else if (searchType === "grid") {
            if (searchKey == "pCode") {
              payload.searchByCode = true;
              payload.searchByCodeAndName = false;
              if (value.trim() === "%") {
                return null;
              }

              let searchText = "";

              if (useInSearch && value.length > 2) {
                searchText = "%" + value;
              } else {
                searchText = value;
              }
              payload.searchText = searchText;
            } else if (searchKey == "product") {
              payload.searchByCodeAndName = true;
              payload.searchByCode = false;
              if (value.trim() === "%") {
                return null;
              }

              let searchText = "";

              if (useInSearch && value.length > 2) {
                searchText = "%" + value;
              } else {
                searchText = value;
              }

              if (advancedProductSearching) {
                searchText = searchText.replace(/ /g, "%");
              }
              payload.searchText = searchText;
            } else {
              payload.searchText = value;
              payload.searchByCode = byCode;
              payload.productName = value;
            }

            const store = await createStore(value, payload, productDataUrl);

            setStore(store);
            dispatch(
              formStateHandleFieldChangeKeysOnly({
                fields: { formElements: { dgvProduct: { visible: true } } },
              })
            );
          }
        }, 200),
      [productDataUrl, inputValue.searchByCode, searchType]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue((prev) => ({
        ...prev,
        searchValue: value,
      }));
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: { formElements: { dgvProductBatches: { visible: false } } },
        })
      );
      if (value.length >= 3) {
        if (searchType !== "modal") {
          debouncedFetch(value);
        }
      } else {
        setStore({
          data: [],
          totalCount: 0,
          summary: {},
          groupCount: 0,
        });
        dispatch(
          formStateHandleFieldChangeKeysOnly({
            fields: { formElements: { dgvProduct: { visible: false } } },
          })
        );
      }
      if (onChange) onChange(e);
    };

    useEffect(
      () => () => {
        debouncedFetch.cancel();
      },
      [debouncedFetch]
    );

    useEffect(() => {
     
      if (inputRef && "current" in inputRef && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [inputRef]);

    const handleGridKeyDown = useCallback(
      async (e: any) => {
        console.log(`Grid key: ${e.event.key}`);
        if (e.event.key === "Enter" || e.event.key === "NumpadEnter") {
          const grid: any = dataGridRef.current?.instance();
          const selectedRowKeys = grid.getSelectedRowKeys();
          if (selectedRowKeys.length > 0) {
            const selectedRow = grid.getSelectedRowsData()[0];
            if (onProductSelected) {
              onProductSelected(selectedRow);
            }
            try {
              if (!isNullOrUndefinedOrEmpty(batchDataUrl)) {
                const batchStore = await createBatchStore(
                  selectedRow.productID,
                  batchDataUrl
                );
                setProductDetailStore(batchStore);
                dispatch(
                  formStateHandleFieldChangeKeysOnly({
                    fields: {
                      formElements: { dgvProductBatches: { visible: true } },
                    },
                  })
                );
                dispatch(
                  formStateHandleFieldChangeKeysOnly({
                    fields: {
                      formElements: { dgvProduct: { visible: false } },
                    },
                  })
                );
              } else {
                dispatch(
                  formStateHandleFieldChangeKeysOnly({
                    fields: {
                      formElements: { dgvProduct: { visible: false } },
                    },
                  })
                );
                if (inputRef && "current" in inputRef && inputRef.current) {
                  inputRef.current.focus();
                }
              }
            } catch (err) {
              dispatch(
                formStateHandleFieldChangeKeysOnly({
                  fields: { formElements: { dgvProduct: { visible: false } } },
                })
              );
              if (inputRef && "current" in inputRef && inputRef.current) {
                inputRef.current.focus();
              }
            }
          }
        } else if (e.event.key === "Escape") {
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: { formElements: { dgvProduct: { visible: false } } },
            })
          );
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          e.event.preventDefault();
        }
      },
      [batchDataUrl, onProductSelected, inputRef]
    );

    const handleBatchGridKeyDown = useCallback(
      (e: any) => {
        console.log(`Batch grid key: ${e.event.key}`);
        if (
          e.event.key === "Enter" &&
          e.component.getSelectedRowKeys().length > 0
        ) {
          const selectedRow = e.component.getSelectedRowsData()[0];
          if (onRowSelected) {
            onRowSelected(selectedRow, inputValue.searchValue);
          }
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                formElements: { dgvProductBatches: { visible: false } },
              },
            })
          );
          if (clearAfterSelection) {
            setInputValue((prev) => ({
              ...prev,
              searchValue: "",
            }));
          }
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
          }
        }
        // else if (e.event.key === 'Escape') {
        //   dispatch(formStateHandleFieldChangeKeysOnly({fields: {formElements:{dgvProductBatches: {visible: false}}}}));
        //   setShowProductGrid(true);
        //   e.event.preventDefault();
        // }
        else if (e.event.key === "Escape") {
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                formElements: { dgvProductBatches: { visible: false } },
              },
            })
          );
          if (inputRef && "current" in inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          e.event.preventDefault();
        }
      },
      [onRowSelected, clearAfterSelection, inputRef]
    );

    const handleBatchContentReady = useCallback(() => {
      if (batchGridRef.current) {
        const gridInstance = batchGridRef.current.instance();
        const visibleRows = gridInstance.getVisibleRows();
        if (visibleRows.length > 0) {
          gridInstance.selectRowsByIndexes([0]);
          gridInstance.navigateToRow(gridInstance.getKeyByRowIndex(0));
          gridInstance.focus();
        }
      }
    }, []);

    const handleInputKeyDown = useCallback(
      async (e: React.KeyboardEvent<HTMLInputElement>) => {
       debugger;
        const value = formState.transaction.details[rowIndex??-1] != undefined ? formState.transaction.details[rowIndex??-1][searchKey as keyof TransactionDetail] : undefined;
        // console.log(`Input key: ${e.key}`);
        if (formState.formElements.dgvProduct.visible && dataGridRef.current) {
          if (e.key === "ArrowDown") {
            const grid: any = dataGridRef.current.instance();
            const rows = grid.getVisibleRows();
            if (rows.length > 0) {
              grid.selectRowsByIndexes([0]);
              grid.navigateToRow(grid.getKeyByRowIndex(0));
              grid.focus();
              e.preventDefault();
            }
          } else if (e.key === "ArrowUp") {
            const grid: any = dataGridRef.current.instance();
            const rows = grid.getVisibleRows();
            if (rows.length > 0) {
              grid.selectRowsByIndexes([rows.length - 1]);
              grid.navigateToRow(grid.getKeyByRowIndex(rows.length - 1));
              grid.focus();
              e.preventDefault();
            }
          } else {
            // rest?.onKeyDown && rest?.onKeyDown(e, e.target.);
          }
        } else if (e.key === "Enter") {
          if (searchType !== "modal") {
            rest?.onKeyDown && rest?.onKeyDown(value,e);
          } 
          else {
            if (!isNullOrUndefinedOrEmpty(e.currentTarget.value)) {
              if (searchKey == "product" ) 
                {
                  dispatch(
                    formStateHandleFieldChangeKeysOnly({
                      fields: {
                        formElements: {
                          productSearchPopupWindow: {
                            visible: true,
                            data: {
                              searchColumn: searchKey,
                              rowIndex: rowIndex,
                              searchCriteria: searchKey,
                              searchText: e.currentTarget.value,
                              voucherType:
                                formState.transaction.master.voucherType,
                              warehouseId: 1,
                              inSearch: formState.inSearch,
                            },
                          },
                        },
                      },
                    })
                  );
                  e.preventDefault();
                } 
              } else {
                rest?.onKeyDown && rest?.onKeyDown(value,e);
              }
            }
          }
         else if (
          e.key === "Escape" &&
          formState.formElements.dgvProduct.visible
        ) {
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                formElements: {
                  dgvProduct: { visible: false },
                  dgvProductBatches: { visible: false },
                },
              },
            })
          );
          e.preventDefault();
        } else if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          const input = e.target as HTMLInputElement;
          const { selectionStart, selectionEnd, value } = input;
          let shouldNavigate = true;
          if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
            if (
              e.key === "ArrowRight" &&
              (selectionStart !== value.length || selectionEnd !== value.length)
            ) {
              shouldNavigate = false;
            } else if (
              e.key === "ArrowLeft" &&
              (selectionStart !== 0 || selectionEnd !== 0)
            ) {
              shouldNavigate = false;
            }
          }
          if (shouldNavigate && rest.onKeyDown) {
            rest?.onKeyDown(value,e);
            e.preventDefault();
          }
        } else {
          if (rest.onKeyDown) {
            rest?.onKeyDown(value,e);
          }
        }
      },
      [
        formState.formElements.dgvProduct.visible,
        inputValue.searchValue,
        searchType,
        debouncedFetch,
        rest.onKeyDown,
      ]
    );

    useEffect(() => {
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (
          !gridContainerRef.current ||
          !formState.formElements.dgvProduct.visible
        )
          return;
        const focusableElements = gridContainerRef.current.querySelectorAll(
          'input, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleFocusTrap);
      return () => document.removeEventListener("keydown", handleFocusTrap);
    }, [formState.formElements.dgvProduct.visible]);
  const onClose = useCallback(() => {
    dispatch(
                  formStateHandleFieldChangeKeysOnly({
                    fields: {
                      formElements: {
                        productSearchPopupWindow: { visible: false },
                      },
                    },
                  })
                );
  }, []);
    return (
      <>
        <div className="flex items-center gap-4">
          <div className="relative w-full" ref={gridContainerRef}>
            <ERPInput
              ignoreRandomId={true}
              noLabel={noLabel}
              label={label}
              type="text"
              id={inputId || "test"}
              placeholder={placeholder}
              labelDirection={labelDirection}
              contextClassName={contextClassNametwo}
              value={inputValue.searchValue}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
              // onEnterKeyDown={onEnterKeyDown}
              disableEnterNavigation
              ref={inputRef}
              onFocus={(e) => {
                console.log("Focused on ERPProductSearch input");
                if (rest.onFocus) {
                  rest.onFocus(e);
                }
              }}
              onBlur={(e) => {
                console.log("Blurred from ERPProductSearch input");
                if (rest.onBlur) {
                  rest.onBlur(e);
                }
              }}
            />
            {searchType === "grid" && (
              <>
                {formState.formElements.dgvProduct.visible && (
                  <div className="absolute top-full left-0 mt-0 z-10 w-auto min-w-[300px] max-w-full md:max-w-[600px] lg:max-w-[800px] min-h-[200px] max-h-[400px] shadow-lg bg-white">
                    <DataGrid
                      ref={dataGridRef}
                      loadPanel={{ enabled: false }}
                      dataSource={store}
                      height={300}
                      keyExpr={"productID"}
                      showBorders={true}
                      showRowLines={true}
                      remoteOperations={{
                        filtering: true,
                        paging: true,
                        sorting: true,
                        grouping: false,
                        summary: false,
                        groupPaging: false,
                      }}
                      onKeyDown={handleGridKeyDown}
                      tabIndex={0}
                    >
                      <Selection mode="single" />
                      <Paging pageSize={30} />
                      <Scrolling mode="virtual" />
                      <KeyboardNavigation
                        enabled={true}
                        editOnKeyPress={false}
                        enterKeyDirection="row"
                      />
                      <Column
                        dataField="productCode"
                        caption={t("product_code")}
                        dataType="string"
                        width={100}
                      />
                      <Column
                        dataField="productID"
                        caption={t("productID")}
                        dataType="number"
                        visible={false}
                      />
                      <Column
                        dataField="productName"
                        caption={t("ProductName")}
                        dataType="string"
                        minWidth={150}
                      />
                    </DataGrid>
                  </div>
                )}
                {formState.formElements.dgvProductBatches.visible &&
                  !isNullOrUndefinedOrEmpty(batchDataUrl) && (
                    <div className="absolute top-full left-0 mt-1 z-10 w-auto min-w-[300px] max-w-full md:max-w-[600px] lg:max-w-[800px] min-h-[200px] max-h-[400px] shadow-lg bg-white">
                      <DataGrid
                        ref={batchGridRef}
                        loadPanel={{ enabled: false }}
                        className="custom-data-grid-dark-only"
                        dataSource={productDetailStore}
                        height={300}
                        keyExpr={"productBatchID"}
                        showBorders={true}
                        showRowLines={true}
                        remoteOperations={{
                          filtering: true,
                          paging: true,
                          sorting: true,
                        }}
                        onKeyDown={handleBatchGridKeyDown}
                        onContentReady={handleBatchContentReady}
                        tabIndex={0}
                      >
                        <KeyboardNavigation
                          editOnKeyPress={false}
                          enterKeyDirection="row"
                        />
                        <Paging pageSize={10} />
                        <Selection mode="single" />
                        <Column
                          dataField="productBatchID"
                          caption={t("productBatchID")}
                          dataType="number"
                          width={150}
                        />
                        <Column
                          dataField="productCode"
                          caption={t("productCode")}
                          dataType="string"
                          width={150}
                        />
                        <Column
                          dataField="autoBarcode"
                          caption={t("autoBarcode")}
                          dataType="string"
                          width={150}
                        />
                        <Column
                          dataField="sPrice"
                          caption={t("sprice")}
                          dataType="number"
                          width={100}
                        />
                        <Column
                          dataField="pPrice"
                          caption={t("pPrice")}
                          dataType="number"
                          width={100}
                        />
                        <Column
                          dataField="mrp"
                          caption={t("mrp")}
                          dataType="number"
                          width={100}
                        />
                        <Column
                          dataField="stock"
                          caption={t("stock")}
                          dataType="number"
                          width={100}
                        />
                        <Column
                          dataField="unitID"
                          caption={t("unitID")}
                          dataType="number"
                          minWidth={100}
                        />
                        <Column
                          dataField="unit"
                          caption={t("unit")}
                          dataType="string"
                          minWidth={100}
                        />
                        <Column
                          dataField="brandID"
                          caption={t("brandID")}
                          dataType="number"
                          minWidth={100}
                        />
                        <Column
                          dataField="brandName"
                          caption={t("brandName")}
                          dataType="string"
                          minWidth={100}
                        />
                      </DataGrid>
                    </div>
                  )}
              </>
            )}
          </div>
          {showCheckBox && (
            <ERPCheckbox
              id="searchByCode"
              checked={inputValue.searchByCode}
              label={checkboxLabel || t("Code")}
              onChange={(e) =>
                setInputValue((prev) => ({
                  ...prev,
                  searchByCode: e.target.checked,
                }))
              }
            />
          )}
        </div>
        {formState.formElements.productSearchPopupWindow.visible &&
          searchType === "modal" && (
            <ERPModal
              isOpen={formState.formElements.productSearchPopupWindow.visible}
              title={t("privilege_card")}
              width={1000}
              height={800}
              isForm={true}
              closeModal={onClose}
              content={
                <ProductModalGrid
                onClose={onClose}
                  rowIndex={
                    formState.formElements.productSearchPopupWindow.data
                      .rowIndex
                  }
                  searchColumn={
                    formState.formElements.productSearchPopupWindow.data
                      .searchColumn
                  }
                  popupSearchUrl={`${Urls.inv_transaction_base}${formState.transactionType}/ItemPopUpSearch`}
                  searchCriteria={
                    formState.formElements.productSearchPopupWindow.data
                      .searchCriteria
                  }
                  searchText={
                    formState.formElements.productSearchPopupWindow.data
                      .searchText
                  }
                  voucherType={
                    formState.formElements.productSearchPopupWindow.data
                      .voucherType
                  }
                  warehouseId={
                    formState.formElements.productSearchPopupWindow.data
                      .warehouseId
                  }
                  inSearch={
                    formState.formElements.productSearchPopupWindow.data
                      .inSearch
                  }
                />
              }
            />
          )}
      </>
    );
  }
);

export default React.memo(ERPProductSearch);
