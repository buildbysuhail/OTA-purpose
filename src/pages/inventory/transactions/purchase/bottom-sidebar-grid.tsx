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
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import { formStateHandleFieldChange } from "./reducer";

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

interface BottomSidebarGridProps {
  sidebarHeight: number;
}

export const BottomSidebarGrid: React.FC<BottomSidebarGridProps> = ({ sidebarHeight }) => {
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
    const columnsleft: DevGridColumn[] = useMemo(() => [
      {
        dataField: "date",
        caption: "Date",
        dataType: "date",
        width: 66,
        alignment: "center", 
        showInPdf: true,
        visible: true,
      },
      {
        dataField: "refNo",
        caption: "RefNo",
        dataType: "string",
        width: 48,
        alignment: "center", 
        showInPdf: true,
        visible: true,
      },
      {
        dataField: "party",
        caption: "Party",
        dataType: "string",
        width: 194,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
      {
        dataField: "qty",
        caption: "Qty",
        dataType: "number",
        width: 64,
        alignment: "right", 
        showInPdf: true,
        visible: true,
      },
      {
        dataField: "cost",
        caption: "Cost",
        dataType: "number",
        width: 59,
        alignment: "right", 
        showInPdf: true,
        visible: true,
      },
      {
        dataField: "description",
        caption: "Description",
        dataType: "string",
        width: 73,
        alignment: "center", 
        showInPdf: true,
        visible: true,
      },
      {
        dataField: "beforeAddAmount",
        caption: "BeforeAddAmount",
        dataType: "number",
        width: 114,
        alignment: "center", 
        showInPdf: true,
        visible: true,
      },
      {
        dataField: "xRate",
        caption: "XRate",
        dataType: "number",
        width: 100,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
      {
        dataField: "netItemCost",
        caption: "NetItemCost",
        dataType: "number",
        width: 100,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
      {
        dataField: "unitName",
        caption: "UnitName",
        dataType: "string",
        width: 100,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
      {
        dataField: "rateWithTax",
        caption: "RateWithTax",
        dataType: "number",
        width: 100,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
      {
        dataField: "disc",
        caption: "Disc",
        dataType: "number",
        width: 100,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
      {
        dataField: "vat",
        caption: "VAT",
        dataType: "number",
        width: 100,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
      {
        dataField: "netRate",
        caption: "NetRate",
        dataType: "number",
        width: 100,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
      {
        dataField: "refNo",
        caption: "RefNo",
        dataType: "string",
        width: 100,
        alignment: "left", 
        showInPdf: true,
        visible: false,
      },
    ], []);

    const columnsright: DevGridColumn[] = useMemo(() => [
  {
    dataField: "date",
    caption: "Date",
    dataType: "date",
    width: 74,
    alignment: "left", 
    showInPdf: true,
    visible: true,
    readOnly: true,
    fontBold: false,
  },
  {
    dataField: "billNumber",
    caption: "BillNumber",
    dataType: "string",
    width: 62,
    alignment: "center", 
    showInPdf: true,
    visible: true,
    readOnly: true,
    fontBold: false,
  },
  {
    dataField: "party",
    caption: "Party",
    dataType: "string",
    width: 194,
    alignment: "left", 
    showInPdf: true,
    visible: true,
    readOnly: true,
    fontBold: false,
  },
  {
    dataField: "qty",
    caption: "Qty",
    dataType: "number",
    width: 72,
    alignment: "right", 
    showInPdf: true,
    visible: true,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "rate",
    caption: "Rate",
    dataType: "number",
    width: 52,
    alignment: "right", 
    showInPdf: true,
    visible: false,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "cost",
    caption: "Cost",
    dataType: "number",
    width: 100,
    alignment: "right", 
    showInPdf: true,
    visible: false,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "xRate",
    caption: "XRate",
    dataType: "number",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: false,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "netItemCost",
    caption: "NetItemCost",
    dataType: "number",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: false,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "unitName",
    caption: "UnitName",
    dataType: "string",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: true,
    readOnly: false,
    fontBold: true,
  },
  {
    dataField: "rateWithTax",
    caption: "RateWithTax",
    dataType: "number",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: false,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "disc",
    caption: "Disc",
    dataType: "number",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: false,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "vat",
    caption: "VAT",
    dataType: "number",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: false,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "netRate",
    caption: "NetRate",
    dataType: "number",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: false,
    readOnly: false,
    fontBold: false,
  },
  {
    dataField: "productDescription",
    caption: "ProductDescription",
    dataType: "string",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: true,
    readOnly: false,
    fontBold: true,
  },
  {
    dataField: "refNo",
    caption: "RefNo",
    dataType: "string",
    width: 100,
    alignment: "left", 
    showInPdf: true,
    visible: true,
    readOnly: true,
    fontBold: false,
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

     const formState = useAppSelector(
        (state: RootState) => state.InventoryTransaction
      );
      const dispatch = useDispatch();

      const [gridHeight, setGridHeight] = useState<{
    mobile: number;
    windows: number;
  }>({ mobile: 500, windows: 500 });

    useEffect(() => {
      let gridHeightMobile = sidebarHeight - 50;
      let gridHeightWindows = sidebarHeight - 135;
      setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
    }, [sidebarHeight]); 

    return (
          <div className="grid grid-cols-12 gap-x-6 dark:!bg-dark-bg ">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="px-4 pt-0 pb-0 ">
            {/* Top Section - Dropdowns */}
            <div className="grid grid-cols-6 gap-4">
              <ERPCheckbox
                localInputBox={formState?.userConfig?.inputBoxStyle}
                id="printOnSave"
                label={t("Show Selected Party Details only")}
                checked={formState.printOnSave}
                // onChange={(e) =>
                //   dispatch(
                //     formStateHandleFieldChange({
                //       fields: { printOnSave: e.target.checked },
                //     })
                //   )
                // }
                // disabled={formState.formElements.printOnSave?.disabled}
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
                            gridHeader={t("purchase_details")}
                            data={leftGridData}
                             columns={columnsleft}
                             remoteOperations={false}
                            showBorders={true}
                            // height={300}
                            rowAlternationEnabled={true}
                            enableScrollButton={false}
                            hideDefaultExportButton={true}
                            hideGridAddButton={true}
                            ShowGridPreferenceChooser={false}
                            showPrintButton={false}
                            className="w-full"
                            // heightToAdjustOnWindows={500}
                            selectionMode="multiple"
                            allowSelection={true}
                            allowSelectAll={true}
                            gridId={"discount_scheme_grid_left"}
                            heightToAdjustOnWindowsInModal={gridHeight.windows}
                            
                           
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
                             gridHeader={t("sales_details")}
                            data={rightGridData}
                             remoteOperations={false}
                            showBorders={true}
                            // height={300}
                            rowAlternationEnabled={true}
                            enableScrollButton={false}
                            hideDefaultExportButton={true}
                            hideGridAddButton={true}
                            ShowGridPreferenceChooser={false}
                            showPrintButton={false}
                            className="w-full"
                            // heightToAdjustOnWindows={500}
                            selectionMode="multiple"
                            allowSelection={true}
                            allowSelectAll={true}
                            columns={columnsright}
                            gridId={"discount_scheme_grid_right"}
                            heightToAdjustOnWindowsInModal={gridHeight.windows}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Buttons */}
            {/* <div className="flex justify-end gap-4 mt-1">
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
            </div> */}
        </div>
       </div>
       </div>   
    );
};

export default BottomSidebarGrid;
