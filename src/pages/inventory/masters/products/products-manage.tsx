import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ERPFormButtons from "../../../../components/ERPComponents/erp-form-buttons";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import Urls from "../../../../redux/urls";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../../utilities/hooks/useRootState";
import { toggleProducts } from "../../../../redux/slices/popup-reducer";
import { productDto, ProductLocalConfig } from "./products-type";
import initialProductData from "./products-data";
import { Countries } from "../../../../redux/slices/user-session/user-branches-reducer";
import ProductDetailsIndia from "./products-india/product-details-india";
import ProductManageIndia from "./products-india/products-manage-india";
import ProductManageGcc from "./products-gcc/products-manage-gcc";
import ProductDetailsGcc from "./products-gcc/product-details-gcc";
import ProductOthersIndia from "./products-india/product-others-india";
import ProductOthersGcc from "./products-gcc/product-others-gcc";
import ProductNotesGcc from "./products-gcc/product-notes-gcc";
import ProductMultiUnitsGCC, { ProductMultiUnitsGccRef } from "./products-gcc/product-multi-units-gcc";
import NutritionFactsIndia from "./products-india/product-nutrition-facts-india";
import SearchCommon from "./common/product-search";
import ImageCommon from "./common/product-image";
import SalesCommon from "./common/product-sales";
import PurchaseCommon from "./common/product-purchase";
import StockCommon from "./common/product-stock";
import SuppliersCommon from "./common/product-suppliers";
import PromotionCommon from "./common/product-promotion";
import { RootState } from "../../../../redux/store";
import { APIClient } from "../../../../helpers/api-client";
import moment from "moment";
import MultiRates from "./products-india/product-multi-rates-india";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import { calculateMarkup, isNullOrUndefinedOrEmpty, isNullOrUndefinedOrZero, } from "../../../../utilities/Utils";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import { customJsonParse } from "../../../../utilities/jsonConverter";
import ProductMultiUnitsIndia, { ProductMultiUnitsIndiaRef, } from "./products-india/product-multi-units-india";
import { handleResponse } from "../../../../utilities/HandleResponse";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { DataGrid } from "devextreme-react";
import { Column, Editing, KeyboardNavigation, Paging, RemoteOperations, Scrolling } from "devextreme-react/cjs/data-grid";
import ERPSubmitButton from "../../../../components/ERPComponents/erp-submit-button";
import { ProductMultiBarcodeManage } from "../products/product-multibarcode-manage";
import MultiRatesGcc from "./products-gcc/products-multi-rates-gcc";
import { loadMultiRateToGrid } from "./helper";

export interface MultiBarcodeState {
  open: boolean;
  data: { unitCode: string; barcode: string; unitID: number }[];
  onClose?: (reload: boolean) => void;// Add onClose to the interface
}
export interface ProductManageProps {
  isMaximized?: boolean;
  modalHeight?: any
}
const api = new APIClient();
export const ProductMaster: React.FC<ProductManageProps> = React.memo(({ isMaximized, modalHeight }) => {
  const rootState = useRootState();
  const dispatch = useDispatch();
  const { t } = useTranslation("inventory");
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [flavorsOpen, setFlavorsOpen] = useState<{
    open: boolean;
    productId: number | null;
    data: any;
    onClose?: (reload: boolean) => void; // Add onClose to the state
  }>({ open: false, productId: null, data: [], onClose: undefined });

  const [multiBarcode, setMultiBarcode] = useState<MultiBarcodeState>({
    open: false,
    data: [],
    onClose: undefined // Add onClose to the state
  }); 

  const {
    isEdit,
    handleSubmit,
    handleClear,
    isLoading,
    handleClose,
    formState,
    handleFieldChange,
    getFieldProps,
    handleDataChange,
  } = useFormManager<productDto>({
    url: Urls.products,
    onClose: useCallback(() => dispatch(toggleProducts({ isOpen: false, key: null, reload: false })), [dispatch]),
    onSuccess: useCallback(() => dispatch(toggleProducts({ isOpen: false, key: null, reload: true })), [dispatch]),
    key: rootState.PopupData.products?.key,
    useApiClient: true,
    keyField: "productsdsID",
    isMessages: true,
    loadInitialData: false,
    initialData: {
      data: initialProductData,
    },
  });
  const [activeTab, setActiveTab] = React.useState(0);
  const productMultiUnitsIndiaRef = useRef<ProductMultiUnitsIndiaRef>(null);
  const productMultiUnitsGccRef = useRef<ProductMultiUnitsGccRef>(null);
  const handleTabChange = async (index: number,obj:productDto) => {
    setActiveTab(index);
    debugger;
    const tabs = getTabs();
    const multiRatesIndex = tabs?.findIndex((tab) => tab === t("multi_rates"));
    if (
      multiRatesIndex !== undefined &&
      multiRatesIndex !== -1 &&
      multiRatesIndex == index
    ) {
      debugger;
      if (
        appSettings?.productsSettings?.allowMultirate &&
        obj.prices &&
        ((obj.prices.length == 0 && (obj.product.productID ?? 0) > 0) || ((obj.product.productID ?? 0) <= 0))
      ) {
           const rates =
            await loadMultiRateToGrid(
              obj,
              obj.units,api, getFormattedValue);
          handleDataChange({ ...obj, prices: rates });
        // if (productMultiUnitsGccRef.current) {
        //   const rates = await productMultiUnitsGccRef.current.loadMultiRateToGrid(obj, obj.units, (obj.product.productID ?? 0) > 0 ? getFieldProps("prices").value : []);
        //   handleDataChange({ ...obj, prices: rates });
        // }
      }
    }
  };

  const updatePrice = async () => {
    const obj = getFieldProps("*") as productDto;
    debugger;
    debugger;
    if (!isNullOrUndefinedOrEmpty(obj.product.autoBarcode)) {
      const payload = {
        units: obj.units,
        prices: obj.prices,
        salesPrice: obj.product?.stdSalesPrice,
        minSalesPrice: obj.batch.msp
      }
      const res = await api.postAsync(`${Urls.products}updateProductPrice`, payload);
      handleResponse(res);
    }
  };

  const handleFlavorOpen = () => {
    return new Promise<void>((resolve) => {
      const obj = getFieldProps("*") as productDto;
      // if()
      const productId = obj.product?.productID ?? 0;
      if (isNullOrUndefinedOrZero(productId)) {
        // ERPAlert.show({
        //   text: "Product not found. Please select a product.",
        //   title: "Warning",
        //   type: "warn",
        // });
        resolve(); // Resolve immediately if no product ID
        return;
      }

      const onClose = () => {
        setFlavorsOpen({ open: false, productId: null, data: [], onClose: undefined });
        resolve(); // Resolve the promise when modal is closed
      };

      api.getAsync(`${Urls.products}GetFlavours/${productId}`)
        .then((response) => {
          handleResponse(response);
          const dataWithNewRow = [...(response ?? []), { flavor: '' }];
          setFlavorsOpen({
            open: true,
            productId,
            data: dataWithNewRow,
            onClose, // Set the onClose function in state
          });
        })
        .catch((error) => {
          console.error("Error loading flavors:", error);
          resolve(); // Resolve even on error to proceed
        });
    });
  };


  const handleSubmitProductManage = async () => {
    const obj = getFieldProps("*") as any as productDto
    if (obj.config.showFlavourOnSave) {
      await handleFlavorOpen()
    }

    if (obj.config.showMultiBarcodeOnSave) {
      await handleMultibarcode()
    }
    if (clientSession.isAppGlobal) {
      if (isNullOrUndefinedOrEmpty(obj.product.hsnCode)) {
        ERPAlert.show(
          {
            title: "Validation Failed",
            text: "HSN Code missing, are you sure to continue?",
            icon: "warning",
            cancelButtonText: "cancel",
            showCancelButton: true,
            onConfirm: () => { handleSubmit() },
            onCancel: () => {
              console.log("User canceled HSN Code validation");
            },
          })

      }
      else {
        handleSubmit()
      }
    }
    else {
      handleSubmit();
    }
  }
  //multibarcode open

  const handleMultibarcode = () => {
    return new Promise<void>((resolve) => {
      const obj = getFieldProps("*") as productDto;
      const batchId = obj.batch?.productBatchID;
      // if (isNullOrUndefinedOrZero(batchId)) {
      //   ERPAlert.show({
      //     text: "Product Batch not found. Please select a Product Batch.",
      //     title: "Warning",
      //     type: "warn",
      //   });
      // resolve();
      //   return;
      // }
      const onClose = () => {
        setMultiBarcode({ open: false, data: [], onClose: undefined });
        resolve();
      };

      api.getAsync(`${Urls.productBarcode}/${batchId || 0}`)
        .then((response) => {
          setMultiBarcode({
            open: true,
            data: response ?? [],
            onClose,
          });
        })
        .catch((error) => {
          console.error("Error loading multi-barcodes:", error);
          resolve();
        });
    });
  };

  //save multibarcode 


  const handleSaveFlavor = async () => {
    const obj = getFieldProps("*") as productDto;
    const productId = obj.product?.productID ?? 0;
    try {
      const response = await api.post(`${Urls.products}AddFlavours`, {
        productID: productId,
        flavours: flavorsOpen.data.filter((x: any) => !isNullOrUndefinedOrEmpty(x.flavor)).map((item: any) => item.flavor),
      });
      handleResponse(response, () => {
        flavorsOpen.onClose?.(false);
      });
    } catch (error) {
      console.error("Error saving flavors:", error);
    }
  };
  // Callback to switch to Multi Rates tab
  const switchToMultiRatesTab = useCallback(() => {
    debugger;
    const tabs = getTabs();
    const multiRatesIndex = tabs?.findIndex((tab) => tab === t("multi_rates"));
    if (multiRatesIndex !== undefined && multiRatesIndex !== -1) {
      setActiveTab(multiRatesIndex);
      // handleTabChange(multiRatesIndex)
    }
  }, [t]);

  const userSession = rootState.UserSession;
  const clientSession = rootState.ClientSession;
  const isMobile = rootState.DeviceInfo.isMobile;
  const isIndia = userSession.countryId === Countries.India;
  const isSaudi = userSession.countryId === Countries.Saudi;
  const { getFormattedValue } = useNumberFormat();
  const appSettings = useSelector((state: RootState) => state.ApplicationSettings);
  const GetHoldStatusOfSelectedItem = async (
    batchId: any
  ): Promise<boolean> => {
    return await api.getAsync(`${Urls.products}HoldStatus/${batchId}`);
  };
  useEffect(() => {
    async function fetchCode() {
      const isEditMode = !isNullOrUndefinedOrZero(
        rootState.PopupData.products?.key
      );
      let data: productDto;
      let nextProductCode: string;
      debugger;
      const res = await api.getAsync(`${Urls.get_product_config}`);
      debugger;
      const st = atob(res);
      const _st: any = customJsonParse(st);
      if (isEditMode) {
        data = (await api.getAsync(
          `${Urls.products}${rootState.PopupData.products?.key}`
        )) as productDto;
        nextProductCode = data.product.productCode ?? "";
        data.details = true;
        data.taxCategoryTaxPercentage = data?.product?.taxCategoryValue ?? 0
      } else {
        data = initialProductData;
        data.details = true;
        nextProductCode = await api.getAsync(
          `${Urls.products}SelectNextProductCode`
        );
        // Set defaults for new product
        data.product.productGroupID = -2;
        data.product.defaultVendorID = -2;
        data.product.itemType = "Inventory";
        data.product.taxCategoryID = -2;

        const softwareDate = moment(clientSession.softwareDate, "DD/MM/YYYY");
        data.batch.expiryDate = softwareDate.clone().add(50, "years").toDate();
        data.batch.mfgDate = softwareDate.toDate();
        data.batch.warehouseID =
          appSettings.inventorySettings.defaultServiceSpareWareHouse;
        data.product.batchCriteria = !isNullOrUndefinedOrEmpty(
          appSettings.productsSettings.batchCriteria
        )
          ? appSettings.productsSettings.batchCriteria
          : "NB";
        data.product.isActive = true;
      }

      data.product.productCode = nextProductCode;
      data.config = isNullOrUndefinedOrEmpty(res) ? data.config : _st;

      if (userSession.dbIdValue === "543140180640") {
        const holdStatus = await GetHoldStatusOfSelectedItem(
          data.batch.productBatchID
        );
        data.onHold = holdStatus;
      }
      debugger

      // if (!clientSession.isAppGlobal) {
      const markupPercentage = calculateMarkup(
        data.product.stdPurchasePrice ?? 0,
        data.product.stdSalesPrice ?? 0,
        data.product.taxCategoryValue ?? 0,
        appSettings.productsSettings.showRateBeforeTax,
        getFormattedValue
      );
      data.markup = markupPercentage;
      // }

      handleDataChange({ ...data });
    }

    fetchCode();
  }, []);

  const units = (getFieldProps("*") as productDto).units || [];
  // Define tab labels based on country
  const getTabs = () => {
    if (isSaudi) {
      return [
        t("details"),
        t("multi_units"),
        t("multi_rates"),
        t("search"),
        t("image"),
        t("others"),
        t("sales"),
        t("purchase"),
        t("stock"),
        t("suppliers"),
        t("notes"),
      ];
    } else if (isIndia) {
      return [
        t("details"),
        t("multi_units"),
        t("multi_rates"),
        t("image"),
        t("others"),
        t("sales"),
        t("purchase"),
        t("stock"),
        t("suppliers"),
        // t("re_order"),
        t("promotion_details"),
        t("search"),
        t("nutrition_facts"),
      ];
    }
  };

  // Define tab content in the desired order for each country
  const tabContents = isIndia
    ? [
      <div key="details">
        {" "}
        <ProductDetailsIndia
          isMobile={isMobile}
          clientSession={clientSession}
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
          t={t}
        />
      </div>,

      <div key="multi_units">
        <ProductMultiUnitsIndia
          ref={productMultiUnitsIndiaRef}
          handleDataChange={handleDataChange}
          appSettings={appSettings}
          t={t}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
          isMaximized={isMaximized}
          modalHeight={modalHeight}
         isGlobal={true}
        />
      </div>,
      <div key="multi_rates">
        <MultiRates
          isGlobal={true}
          t={t}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
           isMaximized={isMaximized}
          modalHeight={modalHeight}
        />
      </div>,
      <div key="image">
        <ImageCommon
          t={t}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
        />
      </div>,
      <div key="others">
        {" "}
        <ProductOthersIndia
          handleDataChange={handleDataChange}
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
        />
      </div>,
      <div key="sales">
        <SalesCommon 
         getFieldProps={getFieldProps} 
           isMaximized={isMaximized}
          modalHeight={modalHeight}
          isGlobal={true}
         />
      </div>,
      <div key="purchase">
        <PurchaseCommon getFieldProps={getFieldProps} 
           isMaximized={isMaximized}
          modalHeight={modalHeight}
          isGlobal={true}
         />
      </div>,
      <div key="stock">
        <StockCommon
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
          isMaximized={isMaximized}
          modalHeight={modalHeight}
          isGlobal={true}
        />
      </div>,
      <div key="suppliers">
        <SuppliersCommon
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
           isMaximized={isMaximized}
        modalHeight={modalHeight}
        isGlobal={true}
        />
      </div>,
      // <div key="re_order">  <ProductReOrderIndia formState={formState} getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} /></div>,
      <div key="promotion_details">
        <PromotionCommon 
        getFieldProps={getFieldProps}
        isMaximized={isMaximized}
        modalHeight={modalHeight}
        />
      </div>,
      <div key="search">
        <SearchCommon 
        isGlobal={true}
        isMaximized={isMaximized}
        modalHeight={modalHeight}  
        />
      </div>,
      <div key="nutrition_facts">
        <NutritionFactsIndia
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
        isMaximized={isMaximized}
        modalHeight={modalHeight}
        />
      </div>,
    ]
    : [
      <div key="details">
        <ProductManageGcc
          handleDataChange={handleDataChange}
          appSettings={appSettings}
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
          switchToMultiRatesTab={switchToMultiRatesTab}
        />

        <ProductDetailsGcc
          clientSession={clientSession}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
        />
      </div>,
      <div key="multi_units">
        <ProductMultiUnitsIndia
          ref={productMultiUnitsIndiaRef}
          handleDataChange={handleDataChange}
          appSettings={appSettings}
          t={t}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
          isMaximized={isMaximized}
          modalHeight={modalHeight}
          isGlobal={false}
        />
      </div>,
      <div key="multi_rates">
        <MultiRatesGcc
          isGlobal={false}
          t={t}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
           isMaximized={isMaximized}
          modalHeight={modalHeight}
        />
      </div>,
      <div key="search">
        <SearchCommon 
         isGlobal={false}
         isMaximized={isMaximized}
         modalHeight={modalHeight}
        />
      </div>,
      <div key="image">
        <ImageCommon
          t={t}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
        />
      </div>,
      <div key="others">
        <ProductOthersGcc
          handleDataChange={handleDataChange}
          appSettings={appSettings}
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
        />
      </div>,
      <div key="sales">
        <SalesCommon 
        getFieldProps={getFieldProps}    
         isMaximized={isMaximized}
          modalHeight={modalHeight}
          isGlobal={false}/>
      </div>,
      <div key="purchase">
        <PurchaseCommon 
        getFieldProps={getFieldProps} 
          isMaximized={isMaximized}
          modalHeight={modalHeight}
          isGlobal={false}
        />
      </div>,
      <div key="stock">
        <StockCommon
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
          isMaximized={isMaximized}
          modalHeight={modalHeight}
          isGlobal={false}
        />
      </div>,
      <div key="suppliers">
        <SuppliersCommon
          formState={formState}
          getFieldProps={getFieldProps}
          handleFieldChange={handleFieldChange}
          isMaximized={isMaximized}
          modalHeight={modalHeight}
          isGlobal={false}
        />
      </div>,
      <div key="notes">
        <ProductNotesGcc getFieldProps={getFieldProps} handleFieldChange={handleFieldChange} />
      </div>,
    ];
  return (
    <div className="w-full modal-content">
      <div className="flex justify-end flex-1 min-w-[120px] pb-4">
        <ERPInput
          {...getFieldProps("barcode")}
          label={t("barcode")}
          placeholder={t("barcode")}
          required={false}
          disableEnterNavigation
          onKeyDown={async (e: any) => {
            const barcode = e.target.value;
            if (e.key === "Enter" && barcode != null && barcode != "") {
              try {
                const data = await api.getAsync(`${Urls.products}ByBarcode/${barcode}`);
                handleDataChange(data);
              } catch (error) {
                console.error("API call failed", error);
              }
            }
          }}
          onChangeData={(data: any) => handleFieldChange("barcode", data.barcode)}
        // className="w-full max-w-[250px] md:w-1/3 pb-4"
        />
      </div>
      <div className="flex flex-col gap-1">
        {isIndia ? (
          <ProductManageIndia
            isMobile={isMobile}
            productMultiUnitsIndiaRef={productMultiUnitsIndiaRef}
            handleDataChange={handleDataChange}
            appSettings={appSettings}
            formState={formState}
            getFieldProps={getFieldProps}
            handleFieldChange={handleFieldChange}
          />
        ) : (
          ""
        )}
        <ERPTab
          tabs={getTabs()?.filter((x) => {
            if (
              (x == t("multi_units") &&
                !appSettings.productsSettings.allowMultiUnits) ||
              (x == t("multi_rates") &&
                !appSettings.productsSettings.allowMultirate) ||
              (x == t("image") &&
                !appSettings.productsSettings.useProductImages)
            ) {
              return false;
            }
            return true;
          })}
          activeTab={activeTab}
          onClickTabAt={(ta)=>{
            debugger;
            const obj = getFieldProps("*") as productDto;
            handleTabChange(ta,obj);
          }}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          {tabContents.filter((tab) => {
            if (
              (tab.key == "multi_units" &&
                !appSettings.productsSettings.allowMultiUnits) ||
              (tab.key == "multi_rates" &&
                !appSettings.productsSettings.allowMultirate) ||
              (tab.key == "image" &&
                !appSettings.productsSettings.useProductImages)
            ) {
              return false;
            }
            return true;
          })}
        </ERPTab>
      </div>

      {/* <ERPButton
        // disabled={ appSettings.branchSettings.maintainMasterEntry || (formState.data.product.productID??0) <= 0 || !appSettings.branchSettings?.useBranchWiseSalesPrice}
        onClick={() => updatePrice()}
        title="Update Price"
      /> */}

      <ERPFormButtons
        customButtons={[
          {
            title: "Update Price",
            onClick: updatePrice,
            disabled:
              appSettings.branchSettings.maintainMasterEntry ||
              (formState.data.product.productID ?? 0) <= 0 ||
              !appSettings.branchSettings?.useBranchWiseSalesPrice,
            variant: "secondary",
          },
          {
            title: "Flavors",
            onClick: handleFlavorOpen,
            variant: "secondary",
          },
          {
            title: "Multi Barcode",
            onClick: handleMultibarcode,
            variant: "secondary",
          },
        ].filter((x: any) => {
          const obj = getFieldProps("*") as any as productDto;
          if (x.title == "Flavors") {
            if ((formState.data.product.productID ?? 0) == 0) {
              return false
            }
          }
          debugger;
          if (x.title == "Multi Barcode") {
            if (((clientSession.isAppGlobal && !obj.elements?.mbVisible)) || (formState.data.product.productID ?? 0) == 0) {
              return false
            }
          }

          return true;
        }) as []
        }

        onClear={handleClear}
        isEdit={isEdit}
        isLoading={isLoading}
        onCancel={handleClose}
        submitDisabled={
          !appSettings.branchSettings.maintainMasterEntry ||
          getFieldProps("hasDisabled").value == true
        }
        onSubmit={handleSubmitProductManage}
      />
      <ERPModal
        isOpen={flavorsOpen.open}
        // closeModal={(reload: boolean) =>
        //   setFlavorsOpen({  open: false, productId: null, data: [] })
        // }
        closeModal={flavorsOpen.onClose ?? (() => { })}
        title={t("flavors")}
        content={
          <div className="w-full">
            <DataGrid
              dataSource={flavorsOpen.data}
              height={300}
              key="barcode"
              showBorders={true}
              showRowLines={true}
              // onFocusedCellChanging={onFocusedCellChanging}
              onEditorPrepared={(e) => {
                if (e.parentType === "dataRow") {
                  const currentRowData = e.row?.data;

                  e.editorElement.removeEventListener(
                    "keydown",
                    (e.editorElement as any)._onBarcodeKeyDown
                  );

                  const barcodeKeyDownHandler = (
                    event: KeyboardEvent
                  ) => {
                    if (event.key === "Enter") {
                      setFlavorsOpen((prev: any) => {
                        const newRow = { flavor: "" };
                        return { ...prev, data: [...prev.data, newRow] };
                      });
                    }
                  };
                  (e.editorElement as any)._onBarcodeKeyDown =
                    barcodeKeyDownHandler;
                  e.editorElement.addEventListener(
                    "keydown",
                    barcodeKeyDownHandler
                  );

                }
              }}
            >
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
                dataField="flavor"
                caption={t("flavor")}
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
        footer={
          <div className="absolute -bottom-0 h-[42px] pt-[4px] pb-[2px] left-0 w-full flex justify-end space-x-2 dark:!border-dark-border dark:!bg-dark-bg bg-white border-t z-10 pr-[10px] rounded-b-md">
            <ERPSubmitButton
              type="reset"
              onClick={() => flavorsOpen.onClose?.(false)}
              // onClick={() =>
              //   setFlavorsOpen({
              //     open: false,
              //     productId: null,
              //     data: [],
              //   })
              // }
              className="dark:text-dark-hover-text w-28 bg-[#808080] text-[#404040] max-w-[115px]"
            >
              {t("cancel")}
            </ERPSubmitButton>

            <ERPSubmitButton
              type="button"
              className="max-w-[115px]"
              variant="primary"
              onClick={handleSaveFlavor}
            >
              {t("save")}
            </ERPSubmitButton>
          </div>
        }
        width={780}
        height={570}
        disableOutsideClickClose={false}
      />

      <ERPModal
        isOpen={multiBarcode.open}
        closeModal={multiBarcode.onClose ?? (() => { })}
        title={t("multi_barcode")}
        content={<ProductMultiBarcodeManage
          multiBarcode={multiBarcode}
          setMultiBarcode={setMultiBarcode}
          units={units}
          productBatchID={getFieldProps("batch.productBatchID").value}
        />}
        width={780}
        height={570}
        disableOutsideClickClose={false}
      />
    </div>


  );
});

export default ProductMaster;
