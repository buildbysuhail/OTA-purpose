import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DeepPartial } from "redux";
import { APIClient } from "../../../../helpers/api-client";
import { RootState } from "../../../../redux/store";
import Urls from "../../../../redux/urls";
import { useDirectPrint } from "../../../../utilities/hooks/use-direct-print";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import { isNullOrUndefinedOrEmpty, sanitizeDataAdvanced, getPurchasePriceCode } from "../../../../utilities/Utils";
import { formStateHandleFieldChange, formStateHandleFieldChangeKeysOnly } from "../reducer";
import { initialProductData } from "../transaction-type-data";
import { TransactionDetail, BarcodeLabel } from "../transaction-types";

const api = new APIClient();
export const usePurchasePrint = () => {
  const { t } = useTranslation('system');
    const { directPrint } = useDirectPrint();
  const dispatch = useDispatch();

  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );

  async function printBarcode(
    slNos: string[],
    isReprint: boolean,
    updateBatch: boolean,
    partyLedgerId: number,
    wareHouseId: number,
    isDummyBill: boolean,

  ): Promise<void> {
    let modifiedDetails: DeepPartial<TransactionDetail>[] = [];
    let batchCreatedList = [];
    try {
      let barcodeLabelAdded = false;
      const template = formState?.barcodeTemplate;
      let barcodeData = [];
      if (updateBatch) {
        let data = [];
        for (let i = 0; i < slNos.length; i++) {
          const row = formState.transaction.details.find( x => x.slNo == slNos[i]);

          let p = {
            productID: row?.productID,
            stdPurchasePrice: row?.cost,
            stdSalesPrice: row?.salesPrice,
            minSalePrice: row?.minSalePrice,
            unitID: row?.unitID,
            selectedUnit: row?.unitID,
            prevProductBatchID: row?.productBatchID,
            productBatchID: row?.productBatchID,
            mrp: row?.mrp,
            shelfID: 1,
            brandID: row?.brandID,
            mfgDate: isNullOrUndefinedOrEmpty(row?.mfdDate)?new Date().toISOString():row?.mfdDate,
            expiryDate:  isNullOrUndefinedOrEmpty(row?.expDate)?new Date().toISOString():row?.expDate,
            batchNo: row?.batchNo,
            mannualBarcode: row?.manualBarcode,
            openingDate: new Date().toISOString(),
            warrantyPeriod: row?.warranty,
            partNumber: row?.colour,
            location: row?.location,
            isActive: true,
            specification: row?.size,
            slNo: row?.slNo,
          };

          data.push(p);
        }
        const res = await api.postAsync(
          `${Urls.inv_transaction_base}${formState.transactionType}/CreateBatch`,
          {
            items: sanitizeDataAdvanced(data,
              {
                productID: 0,
                stdPurchasePrice: 0,
                stdSalesPrice: 0,
                minSalePrice: 0,
                unitID: 0,
                selectedUnit: 0,
                prevProductBatchID: 0,
                productBatchID: 0,
                mrp: 0,
                shelfID: 1,
                brandID: 0,
                mfgDate: new Date(),
                expiryDate: new Date(),
                batchNo: '',
                mannualBarcode: '',
                openingDate: new Date(),
                warrantyPeriod: '',
                partNumber: '',
                location: '',
                isActive: true,
                specification: '',
                slNo: ''
              }
            ),
            partyLedgerId: partyLedgerId,
            wareHouseId: wareHouseId,
            IsDummayBill: isDummyBill,
          }
        );
        if (res.isOk) {
          batchCreatedList = res.items;
        }
      }

      // Process each row in the specified range
      for (let i = 0; i < slNos.length; i++) {
        let barcode: BarcodeLabel = {...initialProductData};
        // barcode.showPreview = false;
        const row = formState.transaction.details.find( x => x.slNo == slNos[i]);
        const batch = batchCreatedList.find((x: any) => x.slNo == row?.slNo);

        // Skip empty product rows
        if (!row?.productID || row?.productID === 0) break;

        // Process if not printed or if reprint is requested
        if (!row?.barcodePrinted || isReprint === true) {
          // Get sticker quantity
          let stickerQty = 0;

          // if ( row?.stickerQty === 0) continue;

          stickerQty = row?.stickerQty;

          barcode.invQty = row?.qty;

          // If sticker quantity is 0, use the main quantity
          if (stickerQty === 0) {
            stickerQty = row?.qty;
          }

          // Process only if there are stickers to print
          if (stickerQty > 0) {
            // Set barcode properties
            barcode.autoBarcode = updateBatch && batch.batchCreated? batch.autoBarcode:  row?.barCode;
            barcode.manualBarcode = row?.manualBarcode;
            barcode.productCode = row?.pCode;
            barcode.productName = row?.product;
            barcode.productId = row?.productID;
            barcode.productDescription = row?.productDescription;
            barcode.size = row?.size;
            barcode.pPrice = parseFloat("0" + row?.unitPrice.toString());

            // Calculate cost with additional expenses
            const baseCost = parseFloat("0" + row?.cost.toString());
            const additionalExpense = parseFloat(
              "0" + row?.additionalExpense.toString()
            );
            const totalCost = baseCost + additionalExpense;

            barcode.cost = totalCost.toString();
            barcode.costCode = getPurchasePriceCode(
              totalCost.toString(),
              applicationSettings.inventorySettings.priceCode
            );

            barcode.salesPrice = parseFloat(
              "0" + row?.salesPrice.toString()
            ).toString();
            barcode.vatPerc = parseFloat("0" + row?.vatPerc.toString());

            // Calculate sales price with VAT
            const salesPriceNum = parseFloat("0" + barcode.salesPrice);
            const salesPriceWithVAT =
              salesPriceNum + (salesPriceNum * barcode.vatPerc) / 100;
            barcode.salesPriceWithVAT = salesPriceWithVAT.toFixed(3);

            barcode.mrp = parseFloat("0" + row?.mrp.toString());
            barcode.msp = parseFloat("0" + row?.minSalePrice.toString());

            barcode.siNo = (i + 1).toString();
            barcode.qty = stickerQty.toString();
            barcode.labelCount = stickerQty;

            barcode.partyCode = formState.ledgerData?.partyCode;
            barcode.unit = row?.unit;
            barcode.batchNo = row?.batchNo;
            barcode.expiryDate = row?.expDate;
            barcode.expiryDays = row?.expDays.toString();
            barcode.mfdDate = row?.mfdDate;

            const rawVoucher = formState.transaction.master?.voucherNumber;
            barcode.voucherNo = rawVoucher != null? rawVoucher.toString(): "";

            barcode.transDate = formState.transaction.master?.transactionDate;

            // Mark as printed and show report
            modifiedDetails.push({slNo: row?.slNo, barcodePrinted: true, batchCreated: batch.batchCreated,
              barCode: (updateBatch && batch.batchCreated? batch.autoBarcode:  row?.barCode),
              productBatchID: (updateBatch && batch.batchCreated? batch.productBatchID:  row?.productBatchID)
             });
            barcodeData.push(barcode);
            barcodeLabelAdded = true;
          }

        }
      };
      if(formState.userConfig?.barCodePrev){

        dispatch(
          formStateHandleFieldChange({ fields: {barcodeData:barcodeData,barcodePrevOpen:true }})
        );
      }else{
             await directPrint({
              template,
              data:barcodeData,
             });
      };

       dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                transaction: {
                  details: modifiedDetails,
                },
              },updateOnlyGivenDetailsColumns: true
            })
          );

      console.log(
        `Barcode printing completed. Labels added: ${barcodeLabelAdded}`
      );
    } catch (error) {
      console.error("Error printing barcode:", error);
      throw error;
    }
  }

  return {
    printBarcode,
  };
};
