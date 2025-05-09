import React, { useState, useCallback } from "react";
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
    id: number;
    sl: number;
    pCode: string;
    product: string;
    autoBarcode: string;
    selected: boolean;
    isActive: boolean;
    isEditable: boolean;
    isDeletable: boolean;
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
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [productGroupValue, setProductGroupValue] = useState("ACETON");
    const [schemeValue, setSchemeValue] = useState("jhulhg");
    const [selectAllLeft, setSelectAllLeft] = useState(false);
    const [selectAllRight, setSelectAllRight] = useState(false);
    const [schemeDiscountForm, setSchemeDiscountForm] = useState<SchemeSettingsDiscountForm>({
        ProductGroupID: 0,
        SchemeID: 0,
    });
  const [isApiLoading, setIsApiLoading] = useState(false);
  
    const handleLoadByProp = useCallback(async (obj:SchemeSettingsDiscountForm) => {
            let payload = {
                sectionID:  isNullOrUndefinedOrZero(obj.SchemeID)?-1:obj.SchemeID,
                ProductGroupID:isNullOrUndefinedOrZero(obj.ProductGroupID)?-1:obj.ProductGroupID
              };
              let queryString = Object.entries(payload)
              .map(
                ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val??0)}`
              )
              .join("&");
              try {
                setIsApiLoading(true);
              const response = await api.getAsync(
                `${Urls.scheme_discount}?${queryString}`
              );
              handleResponse(response,()=>{
                setLeftGridData(response)

              });
            } catch (error) {
              console.error(`Error fetching data for`, error);
            }finally{
                setIsApiLoading(false)
            }
        
      }, []);



   

    return (
        <div className="w-full modal-content flex flex-col gap-4 p-4">
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
                              const obj = {
                                ...schemeDiscountForm,
                                ProductGroupID:  data.ProductGroupID,
                              };
                              handleLoadByProp(obj);
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
                              const obj = {
                                ...schemeDiscountForm,
                                SchemeID:  data.SchemeID,
                              };
                              handleLoadByProp(obj);
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
                    <div className="flex items-end justify-between gap-2">
                        <h6 className="text-xs font-medium bg-gray-200 p-2 rounded-sm shadow-sm">{t("add_to_scheme")}</h6>
                    </div>

                    <div>
                        <ERPDevGrid
                            dataSource={leftGridData}
                            showBorders={true}
                            rowAlternationEnabled={true}
                            enableScrollButton={false}
                            hideDefaultExportButton={true}
                            hideGridAddButton={true}
                            ShowGridPreferenceChooser={false}
                            showPrintButton={false}
                            className="w-full"
                            heightToAdjustOnWindows={450}
                            columns={[
                               
                                { dataField: "sl", width: 50, caption: t("si") },
                                { dataField: "pCode", width: 100, caption: t("p_code") },
                                { dataField: "product", width: 200, caption: t("product") },
                                { dataField: "autoBarcode", width: 100, caption: t("auto_barcode") }
                            ]}
                            gridId={""}
                        />
                    </div>
                </div>

                {/* Right Grid - Remove from Scheme */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-end justify-between gap-2">
                        <h6 className="text-xs font-medium bg-gray-200 p-2 rounded-sm shadow-sm">{t("remove_from_scheme")}</h6>
                    </div>

                    <div>
                        <ERPDevGrid
                            dataSource={rightGridData}
                            showBorders={true}
                            rowAlternationEnabled={true}
                            enableScrollButton={false}
                            hideDefaultExportButton={true}
                            hideGridAddButton={true}
                            ShowGridPreferenceChooser={false}
                            showPrintButton={false}
                            className="w-full"
                            heightToAdjustOnWindows={450}
                            columns={[
                                { dataField: "sl", width: 50, caption: t("sl") },
                                { dataField: "pCode", width: 100, caption: t("p_code") },
                                { dataField: "product", width: 200, caption: t("product") },
                                { dataField: "autoBarcode", width: 100, caption: t("auto_barcode") }
                            ]}
                            gridId={""}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-end gap-4 mt-4">
                <ERPButton
                    title={t("save")}
                    variant="primary"
                    // onClick={handleSave}
                    // disabled={isLoading}
                />
                <ERPButton
                    title={t("clear")}
                    variant="secondary"
                    // onClick={handleClear}
                />
                <ERPButton
                    title={t("close")}
                    variant="secondary"
                    // onClick={handleClose}
                />
            </div>
        </div>
    );
};

export default SchemeSettingsDiscount;
