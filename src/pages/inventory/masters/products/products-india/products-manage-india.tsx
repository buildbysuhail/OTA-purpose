import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { RefreshCcw, Plus } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import { FormField } from "../../../../../utilities/form-types";
import Urls from "../../../../../redux/urls";
import { APIClient } from "../../../../../helpers/api-client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { ApplicationSettingsType } from "../../../../settings/system/application-settings-types/application-settings-types";
import { DetailsDto, PathValue, productDto, ProductFieldPath } from "../products-type";
import { calculateMarkup, calculateSalesPrice, isNullOrUndefinedOrEmpty } from "../../../../../utilities/Utils";
import { useNumberFormat } from "../../../../../utilities/hooks/use-number-format";
import { BusinessType } from "../../../../../enums/business-types";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";

const api = new APIClient();

export const ProductManageIndia: React.FC<{
  appSettings: ApplicationSettingsType;
  formState: any;
  handleDataChange: (value: any) => void;
  handleFieldChange: <Path extends ProductFieldPath>(
      fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
      value?: PathValue<productDto, Path>
    ) => void;

  getFieldProps: (fieldId: string, type?: any) => FormField | any;
}> = React.memo(({ formState, handleFieldChange, getFieldProps, appSettings, handleDataChange }) => {

  const clientSession = useSelector((state: RootState) => state.ClientSession)
        const { getFormattedValue } = useNumberFormat()
  const { t } = useTranslation("inventory");
    const productNameRef = useRef<HTMLInputElement>(null);
    const salesPriceRef = useRef<HTMLInputElement>(null);
    function handlePriceValidation() {
      try {
        debugger;
        const obj = getFieldProps("*") as productDto;
        const showWarning = appSettings.inventorySettings.showRateWarning.toUpperCase();
        const setFocus = () => {
          if (salesPriceRef.current) {
            salesPriceRef.current.focus();
          }
        };
        if (showWarning === "WARN") {
          if ((obj.product.stdPurchasePrice??0) > (obj.product.stdSalesPrice??0)) {
            ERPAlert.show(
              {
                text:"Sales Price is less than Purchase Price. Do you want to continue?",
              title:"Warning",
              type:"warn",
              onCancel: setFocus
              }
            )
          }
        } else if (showWarning === "BLOCK" && (obj.product.stdPurchasePrice??0) > (obj.product.stdSalesPrice??0)) {
          setFocus();
        }
    
        if (appSettings.productsSettings.allowMultirate) {
          if (  obj.product.basicUnitID &&
            obj.product.stdSalesPrice !== undefined &&
            obj.product.stdSalesPrice > 0) {
              ERPAlert.show(
                {
                  text:`Multi Rates Exist! Update Multi Rates.", "Multi Rates", "info`,
                title:"Warning",
                type:"warn",
                onCancel: setFocus
                }
              )
              // owMessageBox("Multi Rates Exist! Update Multi Rates.", "Multi Rates", "info");
    
            if (obj.prices.length === 0) {
              try {
                // loadMultiRateToGrid();
              } catch (err: any) {
                console.error(err.message);
              }
            }
    
            // setFocus("mrp");
          }
        }
    
        // mrpSaleRateCompare(mrp, sales, "mrp");
      } catch (err: any) {
        ERPAlert.show(
          {
          text:`${err.message},"Error",`,
          title:"Error",
          icon: 'error',
          type:"error",
          // onCancel() {
          //   setFocus("salesPrice");     
          // },
          }
        )
   
      }
    }

useEffect(() => {
  productNameRef?.current?.focus()
  productNameRef?.current?.select()
},[productNameRef])
  return (
    <ERPDataCombobox
                  {...getFieldProps("product.taxCategoryID")}
                  field={{
                    id: "taxCategoryID",
                    valueKey: "id",
                    labelKey: "name",
                    getListUrl: Urls.data_taxCategory,
                  }}
                  onChangeData={(data: any) => handleFieldChange("product.taxCategoryID", data.product.taxCategoryID)}
                  // onChange={(data:any)=>{
                  //   const prev = getFieldProps("*") 
                  //   const  _data = {...prev,
                  //     product: {...prev.product, 
                  //       taxCategoryID: data.value,
                  //       } 

                  //   };
                  //   handleDataChange(_data)
                  // }}
                  label={t("tax_category")}
                  className="w-full"
                  required={true}
                />
  );
});

export default ProductManageIndia;
