// import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

import { APIClient } from "../../../../helpers/api-client";
import Urls from "../../../../redux/urls";
import { productDto, ProductPriceInputDto, ProductUnitInputDto } from "./products-type";

// function mrpSaleRateCompare({
//     mrp,
//     salesPrice,
//     mrpSetting,
//     ref
//   }: {
//     mrp: number;
//     salesPrice: number;
//     mrpSetting: "Warn" | "Block" | string;
//     ref: any
//   }): boolean {
//     if (salesPrice > mrp && mrp !== 0) {
//       if (mrpSetting === "Warn") {
//         ERPAlert.show({
//           text: "MRP is less than Sales Price. Do you want to continue?",
//           title: "Warning",
//           type: "warn",
//           onCancel: () => {
//             onWarnCancel.current.focus()
//           }, 
//         });
//         return true;
//       } else if (mrpSetting === "Block") {
//         ERPAlert.show({
//           text: "MRP is less than Sales Price!",
//           title: "Error",
//           type: "error",
//           onCancel: () => {
//             onWarnCancel.current.focus()
//           }, 
//         });
//         return true;
//       }
//     }
  
//     return false;
//   }
 const loadMultiRates = async (
      unitId: number,
      unit: string,
      obj: productDto,
      multiRates: Array<ProductPriceInputDto>,
      api: APIClient,
      multiFactor:number,
      getFormattedValue: any
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
            purchasePrice: parseFloat(
              getFormattedValue(
                (obj?.product?.stdPurchasePrice ?? 0) *
                  multiFactor
              )
            ),
            mrp: obj?.product?.mrp || 0,

            // Fill in all required fields below
            productMultiPriceID: 0,
            productBatchID: 0,
            salesPrice: 0,
            discountPerc: 0,
            profitAmt: 0,
            msp: 0,
          })
        );

        return [...rates, ...newRates];
      } catch (err) {
        console.error("Error in loadMultiRates:", err);
        return obj.prices || [];
      }
    };
export const loadMultiRateToGrid = async (
      obj: productDto,
      updateUnit: any,
      api: APIClient,
      getFormattedValue: any
    ): Promise<ProductPriceInputDto[]> => {
      debugger;
      let mlRate = obj.prices ?? [];
      if ((obj.product.basicUnitID ?? 0) > 0) {
        if (
          mlRate.find((x: any) => x.unitID == obj.product.basicUnitID) ==
          undefined
        ) {
          mlRate = await loadMultiRates(
            obj.product.basicUnitID ?? 0,
            obj.product.basicUnitName ?? "",
            obj,
            mlRate,
            api,
            1,
            getFormattedValue
          );
        }
      }

      const mUnits = updateUnit;
      try {
        
      for (const row of mUnits) {
        
       debugger; 
        if (mlRate.find((x: any) => x.unitID == row.unitID) == undefined) {
          mlRate = await loadMultiRates(
            row.unitID ?? 0,
            row.unit ?? "",
            obj,
            mlRate,
            api,
            row.multiFactor,
            getFormattedValue
          );
        }
      } 
      } catch (error) {
       debugger; console.log('safvam');

       
      }
      debugger;
      return setMultiRatesDefaultMRP(mUnits, mlRate, obj);
    };
     function setMultiRatesDefaultMRP(
          multiUnits: ProductUnitInputDto[],
          multiRates: ProductPriceInputDto[],
          obj: productDto
        ): ProductPriceInputDto[] {
          debugger;
          let updatedRates = [...multiRates];
    
          if (obj.product.basicUnitID && (obj.product?.mrp ?? 0) > 0) {
            updatedRates = setMRP(
              multiRates,
              (obj.product?.productID ?? 0) > 0,
              obj.product?.basicUnitID,
              obj?.product?.mrp ?? 0,
              obj?.product?.stdPurchasePrice ?? 0
            );
          }
    
          for (const row of multiUnits) {
            if (row.unitID != null && row.mrp > 0) {
              updatedRates = setMRP(
                multiRates,
                (obj.product?.productID ?? 0) > 0,
                row?.unitID,
                row?.mrp ?? 0,
                obj?.product?.stdPurchasePrice ?? 0,
                row?.multiFactor
              );
            }
          }
    
          return updatedRates;
        }
         function setMRP(
      multiRates: ProductPriceInputDto[],
      isEdit: boolean,
      unitId: number,
      MRPVal: number,
      PR: number = 0,
      MF: number = 0
    ): ProductPriceInputDto[] {
      const updatedRates: ProductPriceInputDto[] = multiRates.map(
        (rate, index) => {
          if (rate.unitID === unitId) {
            return {
              ...rate,
              mrp: MRPVal,
              purchasePrice: MF > 0 ? MF * PR : PR, // 👈
            };
          }

          // In edit mode, skip further changes after non-matching unit
          if (isEdit && rate.unitID !== unitId && index > 0) {
            return rate;
          }

          return rate;
        }
      );

      return updatedRates;
    }