import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../utilities/hooks/useFormManagerOptions";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import ERPDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../redux/urls";
import { isNullOrUndefinedOrZero } from "../../../../utilities/Utils";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { handleResponse } from "../../../../utilities/HandleResponse";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";

const api = new APIClient();

export const initialSchemeSettingsDiscount = {
    data: {
        ProductGroupID: 0,
        BranchID: 0,
        SchemeID: 0,
        product: "",
        autoBarcode: "",
        selected: false,
        isActive: true,
        isEditable: true,
        isDeletable: true
    },
    validations: {
        pCode: "",
        product: ""
    }
};

export interface SchemeSettingsDiscountData {
    productID: number;
    sl: number;
    pCode: string;
    product: string;
    autoBarcode: string;
    manualBarcode: string;
    unit2Barcode: string;
    unit3Barcode: string;
    stdSalesPrice: number;

}
interface SchemeSettingsDiscountForm{
    ProductGroupID:number | null;
    SchemeID:number | null
}

export const SchemeSettingsDiscount: React.FC = () => {
    const { t } = useTranslation('inventory');
    const [leftGridData, setLeftGridData] = useState<SchemeSettingsDiscountData[]>([]);
    const [rightGridData, setRightGridData] = useState<SchemeSettingsDiscountData[]>([]);
    const [isSaving, setIsSaving] = useState(false); 
    const [schemeDiscountForm, setSchemeDiscountForm] = useState<SchemeSettingsDiscountForm>({
        ProductGroupID: 0,
        SchemeID: 0,
    });
   const [isApiLoading, setIsApiLoading] = useState(false);
  const leftGridRef = useRef<any>(null);
  const rightGridRef = useRef<any>(null);
    const columns: DevGridColumn[] = useMemo(() => [
      {
        dataField: "sl",
        caption: t("serial_no"),
        dataType: "number",
        width: 60,
        showInPdf: true,
      },
      {
        dataField: "productID",
        caption: t("product_id"),
        dataType: "number",
        width: 100,
        visible: false,
      },
      {
        dataField: "pCode",
        caption: t("product_code"),
        dataType: "string",
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "product",
        caption: t("product_name"),
        dataType: "string",
        width: 200,
        showInPdf: true,
      },
      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "string",
        width: 120,
        showInPdf: true,
      },
      {
        dataField: "manualBarcode",
        caption: t("manual_barcode"),
        dataType: "string",
        width: 120,
        visible: false,
      },
      {
        dataField: "unit2Barcode",
        caption: t("unit2_barcode"),
        dataType: "string",
        width: 120,
        visible: false,
      },
      {
        dataField: "unit3Barcode",
        caption: t("unit3_barcode"),
        dataType: "string",
        width: 120,
        visible: false,
      },
      {
        dataField: "stdSalesPrice",
        caption: t("standard_sales_price"),
        dataType: "number",
        width: 150,
        showInPdf: true,
      },
    ], []);
  
    const handleLoadByProp = useCallback(async (obj:SchemeSettingsDiscountForm) => {
          
  // Check if either ProductGroupID or SchemeID is invalid
  // if (isNullOrUndefinedOrZero(obj.ProductGroupID) || isNullOrUndefinedOrZero(obj.SchemeID)) {
  //   ERPAlert.show({
  //     title: "Warning",
  //     icon: "warning",
  //     text: "Please select both Product Group and Scheme",
  //   });
  //   return;
  // }
             let payload = {
                SchemeID:  obj.SchemeID,
                ProductGroupID:obj.ProductGroupID
              };
            let queryString = Object.entries(payload)
              .map(
                ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val??0)}`
              )
              .join("&");

              try {
                setIsApiLoading(true);
          const response = await api.getAsync(`${Urls.scheme_discount}?${queryString}`);
         if (response) {
          setLeftGridData(response.add);
          setRightGridData(response.remove);
         }
            } catch (error) {
              console.error(`Error fetching data for`, error);
            }finally{
                setIsApiLoading(false)
                
            }
      

      }, []);
  // Trigger handleLoadByProp when schemeDiscountForm changes
  useEffect(() => {
    if (
      !isNullOrUndefinedOrZero(schemeDiscountForm.SchemeID) &&
      !isNullOrUndefinedOrZero(schemeDiscountForm.ProductGroupID)
    ) {
      handleLoadByProp(schemeDiscountForm);
    }
    else
    {
       setLeftGridData([]);
    setRightGridData([]);
    }
  }, [schemeDiscountForm]);

   const handleClear =()=>{
    setSchemeDiscountForm({
        ProductGroupID: 0,
        SchemeID: 0,
    });
    setLeftGridData([]);
    setRightGridData([]);
  }

      const handleSave = async() => {
        debugger;
      if (isNullOrUndefinedOrZero(schemeDiscountForm.SchemeID) || isNullOrUndefinedOrZero(schemeDiscountForm.ProductGroupID)) {
        ERPAlert.show({
          title: "Warning",
          icon: "warning",
          text: "Please select both Product Group and Scheme before saving",
        });
        return;
      }
    const leftSelected = leftGridRef.current.instance().getSelectedRowsData();
    const rightSelected = rightGridRef.current.instance().getSelectedRowsData();



      // const leftSelectedRows = leftGridRef.current?.getSelectedRows();
      // const rightSelectedRows = rightGridRef.current?.getSelectedRows();

      if (!leftSelected || !rightSelected) {
        ERPAlert.show({
          title: "Error",
          icon: "error",
          text: "Failed to get selected rows",
        });
        return;
      }


const payload = {
  add: leftSelected.map((row: SchemeSettingsDiscountData) => ({
    productID: row.productID,              
    schemeID: schemeDiscountForm.SchemeID, 
    productGroupID: schemeDiscountForm.ProductGroupID
  })),
  remove: rightSelected.map((row: SchemeSettingsDiscountData) => ({
    productID: row.productID,
    schemeID: schemeDiscountForm.SchemeID, 
    productGroupID: schemeDiscountForm.ProductGroupID
  }))
};

            try {
              setIsSaving(true);
              const response = await api.postAsync(Urls.scheme_discount, payload);
              handleResponse(response,()=>{
                handleLoadByProp(schemeDiscountForm);
              })
                } catch (error) {
                  console.error(`Error fetching data for`, error);
                }finally{
              setIsSaving(false);
                }
    };

    return (
          <div className="grid grid-cols-12 gap-x-6 dark:!bg-dark-bg bg-[#fafafa]">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="px-4 pt-4 pb-2 ">
            {/* Top Section - Dropdowns */}
            <div className="grid grid-cols-6 gap-4">
                   <ERPDataCombobox
                            id="ProductGroupID"
                            field={{
                              id: "ProductGroupID",
                              valueKey: "id",
                              labelKey: "name",
                              getListUrl: Urls.data_productgroup,
                            }}
                            label={t("product_group")}
                            data={schemeDiscountForm}
                            value={schemeDiscountForm.ProductGroupID}
                            className="w-full"
                            onChangeData={(data: any) => {
                              //       const obj = {
                              //   ...schemeDiscountForm,
                              //   ProductGroupID:  data.SchemeID,
                              // };
                              // handleLoadByProp(obj);
                              setSchemeDiscountForm((prev) => ({
                                ...prev,
                               ProductGroupID: data.ProductGroupID ,
                              }));
                            }}
                          />
                    <ERPDataCombobox
                            id="SchemeID"
                            field={{
                              id: "SchemeID",
                              valueKey: "id",
                              labelKey: "name",
                              getListUrl:`${Urls.scheme_discount}/forCombo`,
                            }}
                            label={t("scheme_id")}
                            data={schemeDiscountForm}
                            value={schemeDiscountForm.SchemeID}
                            className="w-full"
                            onChangeData={(data: any) => {
                            //  const obj = {
                            //     ...schemeDiscountForm,
                            //     ProductGroupID:  data.SchemeID,
                            //   };
                            //   handleLoadByProp(obj);
                              setSchemeDiscountForm((prev) => ({
                                ...prev,
                               SchemeID: data.SchemeID ,
                              }));
                            }}
                          />
            </div>

            {/* Main Grid Section */}
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                {/* Left Grid - Add to Scheme */}
                <div className="flex flex-col gap-2">
                    {/* <div className="flex items-end justify-between gap-2">
                        <h6 className="text-xs font-medium bg-gray-200 p-2 rounded-sm shadow-sm">{t("add_to_scheme")}</h6>
                    </div> */}

                    <div>
   
                        <ERPDevGrid
                            ref={leftGridRef}
                            gridHeader={t("add_to_scheme")}
                            data={leftGridData}
                             columns={columns}
                             remoteOperations={false}
                            showBorders={true}
                            rowAlternationEnabled={true}
                            enableScrollButton={false}
                            hideDefaultExportButton={true}
                            hideGridAddButton={true}
                            ShowGridPreferenceChooser={false}
                            showPrintButton={false}
                            className="w-full"
                            heightToAdjustOnWindows={220}
                            selectionMode="multiple"
                            allowSelection={true}
                            allowSelectAll={true}
                            gridId={"discount_scheme_grid_left"}
                        />
                        
                    </div>
                </div>

                {/* Right Grid - Remove from Scheme */}
                <div className="flex flex-col gap-2">
                    {/* <div className="flex items-end justify-between gap-2">
                        <h6 className="text-xs font-medium bg-gray-200 p-2 rounded-sm shadow-sm">{t("remove_from_scheme")}</h6>
                    </div> */}

                    <div>
                        <ERPDevGrid
                            ref={rightGridRef}
                             gridHeader={t("remove_from_scheme")}
                            data={rightGridData}
                             remoteOperations={false}
                            showBorders={true}
                            rowAlternationEnabled={true}
                            enableScrollButton={false}
                            hideDefaultExportButton={true}
                            hideGridAddButton={true}
                            ShowGridPreferenceChooser={false}
                            showPrintButton={false}
                            className="w-full"
                            heightToAdjustOnWindows={220}
                            selectionMode="multiple"
                            allowSelection={true}
                            allowSelectAll={true}
                            columns={columns}
                            gridId={"discount_scheme_grid_right"}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-end gap-4 mt-1">
                <ERPButton
                    title={t("save")}
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving || isApiLoading}
                    loading={isSaving}
                />
                <ERPButton
                    title={t("clear")}
                    variant="secondary"
                      onClick={handleClear}
                />
                <ERPButton
                    title={t("close")}
                    variant="secondary"
                    // onClick={handleClose}
                />
            </div>
        </div>
       </div>
       </div>   
    );
};

export default SchemeSettingsDiscount;
