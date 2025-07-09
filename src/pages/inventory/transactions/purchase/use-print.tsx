import { useEffect, useState } from "react";
import { APIClient } from "../../../../helpers/api-client";
import { useUserRights } from "../../../../helpers/user-right-helper";
import { RootState } from "../../../../redux/store";
import { useAppSelector } from "../../../../utilities/hooks/useAppDispatch";
import {
  getPurchasePriceCode,
  isNullOrUndefinedOrEmpty,
} from "../../../../utilities/Utils";
import { printCheque_AccTransaction } from "./print-trans-service";
import {
  BarcodeLabel,
  TransactionData,
  TransactionFormState,
} from "./transaction-types";
import { logUserAction } from "../../../../redux/slices/user-action/thunk";
import { useDispatch } from "react-redux";
import {
  formStateHandleFieldChange,
  formStateHandleFieldChangeKeysOnly,
  templatesData,
} from "./reducer";
import { pdf, BlobProvider } from "@react-pdf/renderer";
import { renderSelectedTemplate } from "./renderSelected-template";
import useCurrentBranch from "../../../../utilities/hooks/use-current-branch";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import { TemplateState } from "../../../InvoiceDesigner/Designer/interfaces";
import { customJsonParse } from "../../../../utilities/jsonConverter";
import Urls from "../../../../redux/urls";
import VoucherType from "../../../../enums/voucher-types";
import AdviceTemplate from "../../../InvoiceDesigner/DownloadPreview/advice-template";
import { useTranslation } from "react-i18next";
import { initialProductData } from "./transaction-type-data";
const api = new APIClient();
export const usePrint = () => {
  const { t } = useTranslation();
  const currentBranch = useCurrentBranch();
  const dispatch = useDispatch();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const formState = useAppSelector(
    (state: RootState) => state.InventoryTransaction
  );
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );
  const clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  const { hasRight } = useUserRights();
  const voucherTypeSet = new Set(Object.values(VoucherType));
  const adviceTem = ["PARP", "RARP", "Cheque"];
  const handleDirectPrint = async (template: any) => {
    let pdfDocument;
    if (adviceTem.includes(template.templateGroup)) {
      pdfDocument = (
        <AdviceTemplate
          template={template}
          data={formState.transaction}
          currentBranch={currentBranch}
          userSession={userSession}
        />
      );
    } else {
      pdfDocument = renderSelectedTemplate({
        template: template,
        data: formState.transaction,
        currentBranch: currentBranch,
        userSession: userSession,
      });
    }

    try {
      // Create a PDF blob
      const blob = await pdf(pdfDocument).toBlob();
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(blob);

      // Open the PDF in a new tab for printing
      const printWindow = window.open(pdfUrl);
      if (!printWindow) {
        console.error(
          "Failed to open print window. Please check your browser settings."
        );
        alert(
          "Failed to open print window. Please allow popups and try again."
        );
        return;
      }
      // Wait for the PDF to load in the new tab
      printWindow.onload = () => {
        printWindow.print(); // Trigger print
      };

      // Log user action
      logUserAction({
        action: `User Printed Voucher ${formState.transaction.master.voucherType}:${formState.transaction.master.voucherForm}:${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
        module: "Voucher Print",
        voucherType: formState.transaction.master.voucherType,
        voucherNumber: `${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
      });
    } catch (error) {
      console.error("Error printing voucher:", error);
    }
  };

  const fetchDefaultTemplates = async (voucherType: any) => {
    // Create a set of all possible VoucherType values
    try {
      const res = await api.getAsync(
        `${Urls.default_template}?template_group=${voucherType}`
      );
      const cc: TemplateState = customJsonParse(res.content);
      const _template = {
        ...cc,
        id: res.id,
        background_image: res?.payload?.data?.background_image as
          | string
          | undefined,
        background_image_header: res?.payload?.data?.background_image_header as
          | string
          | undefined,
        background_image_footer: res?.payload?.data?.background_image_footer as
          | string
          | undefined,
        signature_image: res?.payload?.data?.signature_image as
          | string
          | undefined,
        branchId: res.branchId,
        content: res.content,
        isCurrent: res.isCurrent,
        templateGroup: res.templateGroup,
        templateKind: res.templateKind,
        templateName: res.templateName,
        templateType: res.templateType,
        thumbImage: res.thumbImage as string | undefined,
      };

      dispatch(templatesData(_template));

      const template = formState.templatesData?.find(
        (item) => item.templateGroup === voucherType
      );
      if (voucherTypeSet.has(voucherType)) {
        dispatch(
          formStateHandleFieldChange({ fields: { template: _template } })
        );
      }

      return _template;
    } catch (error) {
      console.error("Error fetching Default templates:", error);
    }
  };

  const printVoucher = async (
    setIsPrintModalOpen?: any,
    voucherType?: any,
    voucher?: TransactionFormState
  ) => {
    const existingTemplate = formState.templatesData?.find(
      (template: any) => template.templateGroup === voucherType
    );
    let template = formState.template;

    if (formState.template == undefined || formState.template == null) {
      if (existingTemplate) {
        dispatch(
          formStateHandleFieldChange({ fields: { template: existingTemplate } })
        );
        template = existingTemplate;
      } else {
        template = await fetchDefaultTemplates(voucherType);
      }
    }

    // If template is valid, proceed with printing
    if (formState.printPreview) {
      setIsPrintModalOpen(true);
    } else {
      await handleDirectPrint(template);
    }
  };

  const checkReprintAuthorization = async (
    event: any,
    voucherNumber: number,
    voucherType: number,
    transactionType: string
  ): Promise<boolean> => {
    try {
      let allow = true;
      if (isNaN(voucherNumber)) {
        return false;
      }

      const response = await api.getAsync(
        `${Urls.inv_transaction_base}${transactionType}/checkReprintAuthorization/${voucherType}/${voucherNumber}`
      );

      if (response.cnt > 1) {
        event.preventDefault();
        const confirm = await ERPAlert.show({
          icon: "info",
          title: t("warning"),
          text: t("Unit Price Zero, Do you Want to Continue"),
          confirmButtonText: t("yes"),
          cancelButtonText: t("no"),
          showCancelButton: true,
          onCancel: () => {
            return false;
          },
        });
        if (confirm) {
          await api.postAsync(`${Urls.inv_transaction_base}`, {
            action: `User Printed Voucher ${formState.transaction.master.voucherType}:${formState.transaction.master.voucherForm}:${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
            module: "Voucher Print",
            voucherType: formState.transaction.master.voucherType,
            voucherNumber: `${formState.transaction.master.voucherPrefix}${formState.transaction.master.voucherNumber}`,
          });
        } else {
          allow = true;
        }
      }

      return true;
    } catch (error) {
      console.log("Error checking reprint authorization", error as Error);
      return false;
    }
  };
  async function printBarcode(
    rowIndexes: number[],
    isReprint: boolean,
    updateBatch: boolean,
    partyLedgerId: number,
    wareHouseId: number,
    isDummyBill: boolean
  ): Promise<void> {
    let modifiedDetails = [];
    let batchCreatedList = [];
    try {
      let barcodeLabelAdded = false;

      let barcodeData = [];
      if (updateBatch) {
        let data = [];
        for (let i = 0; i < rowIndexes.length; i++) {
          const row = formState.transaction.details[rowIndexes[i]];

          let p = {
            productID: row.productID,
            stdPurchasePrice: row.cost,
            stdSalesPrice: row.salesPrice,
            minSalePrice: row.minSalePrice,
            unitID: row.unitID,
            selectedUnit: row.unitID,
            prevProductBatchID: row.productBatchID,
            mrp: row.mrp,
            shelfID: 1,
            brandID: row.brandID,
            mfgDate: row.mfdDate,
            expiryDate: row.expDate,
            batchNo: row.batchNo,
            mannualBarcode: row.manualBarcode,
            openingDate: new Date(),
            warrantyPeriod: row.warranty,
            partNumber: row.colour,
            location: row.location,
            isActive: true,
            specification: row.size,
            slNo: row.slNo,
          };

          data.push(p);
        }
        const res = await api.postAsync(
          `${Urls.inv_transaction_base}${formState.transactionType}/`,
          {
            items: data,
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
      for (let i = 0; i < rowIndexes.length; i++) {
        let barcode: BarcodeLabel = initialProductData;
        barcode.showPreview = false;
        const row = formState.transaction.details[rowIndexes[i]];
        const batch = batchCreatedList.find((x: any) => x.slNo == row.slNo);

        // Skip empty product rows
        if (!row.productID || row.productID === 0) break;

        // Process if not printed or if reprint is requested
        if (!row.barcodePrinted || isReprint === true) {
          // Get sticker quantity
          let stickerQty = 0;

          if (row.stickerQty === 0 || row.stickerQty === 0) continue;

          stickerQty = row.stickerQty;

          barcode.invQty = row.qty;

          // If sticker quantity is 0, use the main quantity
          if (stickerQty === 0) {
            stickerQty = row.qty;
          }

          // Process only if there are stickers to print
          if (stickerQty > 0) {
            // Set barcode properties
            barcode.autoBarcode = updateBatch? batch.autoBarcode:  row.barCode;
            barcode.manualBarcode = row.manualBarcode;
            barcode.productCode = row.pCode;
            barcode.productName = row.product;
            barcode.productId = row.productID;
            barcode.productDescription = row.productDescription;
            barcode.size = row.size;
            barcode.pPrice = parseFloat("0" + row.unitPrice.toString());

            // Calculate cost with additional expenses
            const baseCost = parseFloat("0" + row.cost.toString());
            const additionalExpense = parseFloat(
              "0" + row.additionalExpense.toString()
            );
            const totalCost = baseCost + additionalExpense;

            barcode.cost = totalCost.toString();
            barcode.costCode = getPurchasePriceCode(
              totalCost.toString(),
              applicationSettings.inventorySettings.priceCode
            );

            barcode.salesPrice = parseFloat(
              "0" + row.salesPrice.toString()
            ).toString();
            barcode.vatPerc = parseFloat("0" + row.vatPerc.toString());

            // Calculate sales price with VAT
            const salesPriceNum = parseFloat("0" + barcode.salesPrice);
            const salesPriceWithVAT =
              salesPriceNum + (salesPriceNum * barcode.vatPerc) / 100;
            barcode.salesPriceWithVAT = salesPriceWithVAT.toFixed(3);

            barcode.mrp = parseFloat("0" + row.mrp.toString());
            barcode.msp = parseFloat("0" + row.minSalePrice.toString());

            barcode.siNo = (i + 1).toString();
            barcode.qty = stickerQty.toString();
            barcode.labelCount = stickerQty;

            barcode.partyCode = formState.ledgerData.partyCode;
            barcode.unit = row.unit;
            barcode.batchNo = row.batchNo;
            barcode.expiryDate = row.expDate;
            barcode.expiryDays = row.expDays.toString();
            barcode.mfdDate = row.mfdDate;

            barcode.voucherNo =
              formState.transaction.master.voucherNumber.toString();
            barcode.transDate = formState.transaction.master.transactionDate;

            // Mark as printed and show report
            modifiedDetails.push({...batch, slNo: row.slNo, barcodePrinted: true });
            barcodeData.push(barcode);
            barcodeLabelAdded = true;
          }

         
        }
      }
       dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                transaction: {
                  details: modifiedDetails,
                },
              },
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
    printVoucher,
    printBarcode,
  };
};
