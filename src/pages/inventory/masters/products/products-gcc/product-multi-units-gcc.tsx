"use client";

import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import Urls from "../../../../../redux/urls";
import initialProductData from "../products-data";
import { useTranslation } from "react-i18next";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormField } from "../../../../../utilities/form-types";
import {
  ProductFieldPath,
  PathValue,
  productDto,
  ProductUnitInputDto,
  ProductPriceInputDto,
} from "../products-type";
import {
  isNullOrUndefinedOrEmpty,
  isNullOrUndefinedOrZero,
} from "../../../../../utilities/Utils";
import { APIClient } from "../../../../../helpers/api-client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

export interface ProductMultiUnitsGccRef {
  loadMultiRateToGrid: (obj: productDto, units: any, mlRate: any) => Promise<ProductPriceInputDto[]>;
}
const api = new APIClient();
const ProductMultiUnitsGCC= forwardRef<ProductMultiUnitsGccRef, {
  t: any;
  handleFieldChange: <Path extends ProductFieldPath>(
    fields: Path | { [fieldId in Path]?: PathValue<productDto, Path> },
    value?: PathValue<productDto, Path>
  ) => void;

  getFieldProps: (fieldId: string, type?: string) => FormField;
}>(({ t, handleFieldChange, getFieldProps }, ref) => {
  const generateInitialUnit = (): ProductUnitInputDto => ({
    productUnitID: undefined,
    productBatchID: undefined,
    unitID: 0,
    unit: ``,
    multiFactor: undefined,
    barCode: ``,
    description: ``,
    descriptionFL: ``,
    unitRemarks: "",
    gatePass: false,
    multiBarcodes: "",
    salesPrice: 0,
    mrp: 0,
    msp: 0,
  });
  const [multiUnits, setMultiUnits] = useState<{
    [key: string]: ProductUnitInputDto;
  }>({});

   useImperativeHandle(ref, () => ({
        loadMultiRateToGrid: async (obj: productDto, units: any, mlRate: any) => {
          return await loadMultiRateToGrid(obj, units, mlRate);
        }
      }));
      
  const clientSession = useSelector((state: RootState) => state.ClientSession)
  const [barcode, setBarcode] = useState<boolean>(false);
  const setMultiUnitsMaster = (multiUnits: any) => {
    const fList = Object.entries(multiUnits).map(
      ([key, unit]) => unit
    ) as ProductUnitInputDto[];
    handleFieldChange("units", fList);
    // setMultiUnits(multiUnits);
  };
      const unitDAta: ProductUnitInputDto = {
        productUnitID: 0,
        productBatchID: 0,
        unitID: 0,
        multiFactor: 0,
        barCode: "",
        description: "",
        descriptionFL: "",
        unitRemarks: "",
        gatePass: true,
        multiBarcodes: "",
        salesPrice: 0,
        mrp: 0,
        msp: 0,
      };
      const loadMultiRateToGrid = async (
            obj: productDto,
            updateUnit: any,
            mlRate: any
          ): Promise<ProductPriceInputDto[]> => {
            debugger;
           
      
            const mUnits = updateUnit;
            for (const row of mUnits) {
              if  (row.unitID > 0 && row.multiFactor > 0 && mlRate.find((x: any) => x.unitID == row.unitID) == undefined) {
                mlRate = await loadMultiRates(
                  row.unitID ?? 0,
                  row.unit ?? "",
                  obj,
                  mlRate
                );
              }
            }
            return mlRate;
          };
   const loadMultiRates = async (
        unitId: number,
        unit: string,
        obj: productDto,
        multiRates: Array<ProductPriceInputDto>
      ): Promise<ProductPriceInputDto[]> => {
        try {
          const rates: ProductPriceInputDto[] = [...(multiRates || [])];
          const priceCategories = await api.getAsync(Urls.data_pricectegory);
  
          if (!priceCategories || priceCategories.length === 0) {
            return rates;
          }
          // Transform price categories into new rates using map
          const newRates: ProductPriceInputDto[] = priceCategories.map(
            (cat: any) => ({
              priceCategory: cat.name,
              unit: unit,
              unitID: unitId,
              priceCategoryID: cat.id,
              purchaseRate:  clientSession.isAppGlobal ? parseFloat(
                getFormattedValue(
                  (obj?.product?.stdPurchasePrice ?? 0) *
                    (unitDAta.multiFactor || 1)
                )
              ): 0,
              mrp: clientSession.isAppGlobal ?obj?.product?.mrp || 0 : 0,
  
              // Fill in all required fields below
              productMultiPriceID: 0,
              productBatchID: 0,
              salesPrice: 0,
              discountPerc: 0,
              profitAmt: 0,
              msp: 0,
              purchasePrice: 0,
            })
          );
  
          return [...rates, ...newRates];
        } catch (err) {
          console.error("Error in loadMultiRates:", err);
          return obj.prices || [];
        }
      };
  useEffect(() => {
    debugger;
    const obj = getFieldProps("*") as unknown as productDto;
    const responseData = obj.units;
    const baseUnit = obj.product.basicUnitID;
    const paddedData: ProductUnitInputDto[] = [...responseData];

    for (let i = paddedData.length; i < 12; i++) {
      paddedData.push(generateInitialUnit());
    }
    paddedData[0].unitID = isNullOrUndefinedOrZero(paddedData[0].unitID)
      ? baseUnit
      : paddedData[0].unitID;
      paddedData[0].unit = isNullOrUndefinedOrEmpty(paddedData[0].unit)
        ? obj.product.basicUnitName
        : paddedData[0].unit;
      paddedData[0].multiFactor = isNullOrUndefinedOrZero(paddedData[0].multiFactor)
        ? 1
        : paddedData[0].multiFactor;
    const result: { [key: string]: ProductUnitInputDto } = {};
    paddedData.forEach((unit, index) => {
      result[`unit${index + 1}`] = unit;
    });

    setMultiUnits(result);
    setMultiUnitsMaster(result)
  }, []);

  const renderUnitRows = () => {
    return Object.entries(multiUnits).map(([key, unitData], index) => {
      const unitNum = index + 1;

      return (
        <tr key={key} className="h-10">
          <td className="pr-2">
            <div className="flex items-center">
              <span className="text-sm font-medium w-12">
                {t("unit")} {unitNum}
              </span>
              <ERPDataCombobox
                id={`unit${unitNum}`}
                value={unitData.unitID}
                noLabel={true}
                disabled={unitNum === 1}
                field={{
                  getListUrl: Urls.data_units,
                  valueKey: "id",
                  labelKey: "name",
                }}
                onChange={(selected) => {
                  setMultiUnits((prev) => {
                    const updated = {
                      ...prev,
                      [key]: {
                        ...prev[key],
                        unitID: selected?.value ?? null,
                        unit: selected?.label ?? "",
                      },
                    };
                    setMultiUnitsMaster(updated);

                    return updated;
                  });
                }}
                className="w-48"
              />
            </div>
          </td>

          <td className="px-2">
            <ERPInput
              id={`unit${unitNum}multiFactor`}
              noLabel={true}
                type="number"
              readOnly={unitNum === 1}
              value={unitData.multiFactor ?? (unitNum === 1 ? "1" : "0")}
              onChange={(e) => {
                const inputValue = (e.target as HTMLInputElement).value;
                const value = parseFloat(inputValue || "0");
                let sd = 0;
                if (value > 0) {
                  const d = 1 / value;
                  sd = Math.round(d * 100) / 100;
                }
                setMultiUnits((prev: any) => {
                  const updated = {
                    ...prev,
                    [key]: {
                      ...prev[key],
                      multiFactor: e.target.value,
                      multiFactorValue: sd,
                    },
                  };
                  setMultiUnitsMaster(updated);

                  return updated;
                });
              }}
              className={`w-24 text-center ${
                unitData.unitID ? "bg-[#fef9c3]" : ""
              }`}
            />
          </td>

          <td className="px-2">
            {unitNum === 1 ? (
              <div className="w-24"></div>
            ) : (
              <ERPInput
                id={`unit${unitNum}multiFactorValue`}
                noLabel={true}
                type="number"
                value={unitData.multiFactorValue ?? "0"}
                onChange={(e) => {
                  let sd = 0;
                  try {
                    const txtInvUnit2 = e.target.value;

                    const invUnit2Value = parseFloat("0" + txtInvUnit2);
                    if (invUnit2Value > 0) {
                      let d = 0;
                      d = 1 / invUnit2Value;
                      sd = d;
                    }
                  } catch (error) {
                    console.error("Error:", error);
                  }
                  setMultiUnits((prev: any) => {
                    const updated = {
                      ...prev,
                      [key]: {
                        ...prev[key],
                        multiFactor: sd,
                        multiFactorValue: e.target.value,
                      },
                    };
                    setMultiUnitsMaster(updated);

                    return updated;
                  });
                }}
                className={`w-24 text-center ${
                  unitData.unitID ? "bg-[#fef9c3]" : ""
                }`}
              />
            )}
          </td>

          <td className="px-2">
            {unitNum === 1 ? (
              <div className="w-24"></div>
            ) : (
              <ERPInput
                id={`unit${unitNum}Barcode`}
                noLabel={true}
                value={unitData.barCode ?? ""}
                onChange={(e) => {
                  setMultiUnits((prev) => {
                    const updated = {
                      ...prev,
                      [key]: {
                        ...prev[key],
                        barCode: e.target.value,
                      },
                    };
                    setMultiUnitsMaster(updated);

                    return updated;
                  });
                }}
                className="w-32"
              />
            )}
          </td>

          <td className="px-2">
            {unitNum === 1 ? (
              <div className="w-24"></div>
            ) : (
              <ERPInput
                id={`unit${unitNum}Price`}
                noLabel={true}
                value={unitData.salesPrice?.toString() ?? "0.00"}
                onChange={(e) => {
                  setMultiUnits((prev) => {
                    const updated = {
                      ...prev,
                    [key]: {
                      ...prev[key],
                      salesPrice: parseFloat(e.target.value) || 0,
                    },
                    };
                    setMultiUnitsMaster(updated);

                    return updated;
                  });
                }}
                className="w-32 text-right"
              />
            )}
          </td>

          <td className="pl-2">
            <ERPInput
              id={`unit${unitNum}Remark`}
              noLabel={true}
              value={unitData.unitRemarks ?? ""}
              onChange={(e) => {
                setMultiUnits((prev) => {
                  const updated = {
                    ...prev,
                    [key]: {
                      ...prev[key],
                      unitRemarks: e.target.value,
                    },
                  };
                  setMultiUnitsMaster(updated);

                  return updated;
                });
              }}
              className="w-40"
            />
          </td>
        </tr>
      );
    });
  };
  // return (<></>)
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="h-10">
              <th className="text-left"></th>
              <th className="text-left"></th>
              <th className="text-left"></th>
              <th className="text-left">
                <div className="flex items-center">
                  <ERPCheckbox
                    id="barcode"
                    label={t("barcode")}
                    onChange={async (data) => {
                      const updatedUnits = { ...multiUnits };

                      for (let i = 2; i <= 10; i++) {
                        const key = `unit${i}`;
                        const unit = updatedUnits[key];

                        if (
                          unit &&
                          (unit?.unitID ?? 0) > 0 &&
                          isNullOrUndefinedOrEmpty(unit.barCode)
                        ) {
                          try {
                            const newBarcode = await api.getAsync(
                              `${Urls.products}SelectNextGeneratedSystemBarcode`
                            ); // Replace with actual API call
                            updatedUnits[key] = {
                              ...unit,
                              barCode: newBarcode,
                            };
                          } catch (error) {
                            console.error(
                              `Failed to generate barcode for ${key}:`,
                              error
                            );
                          }
                        }
                      }

                      setMultiUnits(updatedUnits);
                      
                      setMultiUnitsMaster(updatedUnits);
                      setBarcode((prev: boolean) => !prev);
                    }}
                  />
                </div>
              </th>
              <th className="text-left">
                <span className="text-sm font-medium">{t("price")}</span>
              </th>
              <th className="text-left">
                <span className="text-sm font-medium">{t("remarks")}</span>
              </th>
            </tr>
          </thead>
          <tbody>{renderUnitRows()}</tbody>
        </table>
      </div>
      {/* Default Units Section */}
      <div className="p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">{t("default_units")}</h2>
        <div className="grid grid-cols-6 gap-4">
          <ERPDataCombobox
            {...getFieldProps("batch.defSalesUnitID")}
            label={t("sales")}
            field={{
              getListUrl: Urls.data_units,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data) =>
              handleFieldChange("batch.defSalesUnitID", data.defSalesUnitID)
            }
            className="w-full"
          />
          <ERPDataCombobox
            {...getFieldProps("batch.defPurchaseUnitID")}
            label={t("purchase")}
            field={{
              getListUrl: Urls.data_units,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data) =>
              handleFieldChange(
                "batch.defPurchaseUnitID",
                data.defPurchaseUnitID
              )
            }
            className="w-full"
          />
          <ERPDataCombobox
            {...getFieldProps("batch.defReportUnitID")}
            label={t("report")}
            field={{
              getListUrl: Urls.data_units,
              valueKey: "id",
              labelKey: "name",
            }}
            onChangeData={(data) =>
              handleFieldChange("batch.defReportUnitID", data.defReportUnitID)
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
});

export default ProductMultiUnitsGCC;
function getFormattedValue(arg0: number): string {
  throw new Error("Function not implemented.");
}

