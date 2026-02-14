import React, { useState, useMemo, useRef } from "react";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { LoadAndSetTransVoucherFn } from "./use-transaction";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { APIClient } from "../../../../helpers/api-client";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import {
  FormElementsState,
  SummaryItems,
  TransactionFormState,
} from "../transaction-types";
import {
  formStateHandleFieldChangeKeysOnly,
  formStateTransactionDetailsRowAdd,
  formStateTransactionDetailsRowsAdd,
} from "../reducer";
import { useDispatch, useSelector } from "react-redux";
import { initialTransactionDetailData } from "../transaction-type-data";
import { generateUniqueKey } from "../../../../utilities/Utils";
import { RootState } from "../../../../redux/store";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";

interface SalesInvoiceNumberProps {
  t: (key: string) => string;
  voucherType: string;
  formState: TransactionFormState;
  refactorDetails: any;
  calculateTotal: any;
  calculateSummary: any;
}

const api = new APIClient();
const SalesInvoiceNumber: React.FC<SalesInvoiceNumberProps> = ({
  t,
  voucherType,
  formState,
  refactorDetails,
  calculateTotal,
  calculateSummary,
}) => {
  const [invoiceData, setInvoiceData] = useState({
    vrPrefix: "",
    vrNumber: "",
  });

  const userSession = useSelector((state: RootState) => state.UserSession);
  const [loadSalesDataModal, setLoadSalesDataModal] = useState(false);
  const [gridData, setGridData] = useState<any[]>([]);
  const dispatch = useDispatch();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      try {
        let url = `${Urls.inv_transaction_base}${formState.transactionType}`;
        const params: Record<any, any> = {
          VoucherNumber: Number(invoiceData.vrNumber),
          voucherPrefix: invoiceData.vrPrefix.toUpperCase(),
          voucherType: voucherType,
          voucherForm: "",
          isUsingManualInvNo: false, // This is for load and more manual invoice number
          IsUsingManualInvoiceNo: false, // This is for load and more manual invoice number in header
          autoEwayBill: false, // for india sales
          isActualPriceVisible: false,
          manualInvoiceNumber: invoiceData.vrNumber,
          invokeUsingVoucherNumber: true,
          pDTInvTransMasterID: 0,
          isStockDetailVisible: false,
        };

        debugger;
        let response = await api.getAsync(
          url,
          new URLSearchParams(params).toString()
        );
        if (response?.details) {
          const refactoredDetails = await refactorDetails(
            response.details,
            formState.transaction.master.voucherForm,
            voucherType,
            { result: {} },
            ""
          );
          const filteredDetails = refactoredDetails.filter(
            (row: any) => row.productID > 0
          );
          setGridData(filteredDetails);
          setLoadSalesDataModal(true);
          dispatch(
            formStateHandleFieldChangeKeysOnly({
              fields: {
                transaction: {
                  ...formState.transaction,
                  master: {
                    ...formState.transaction.master,
                    employeeID: response?.master?.employeeID,
                    refNumber: response?.master?.refNumber,
                    ledgerID: response?.master?.ledgerID,
                    orderNumber: invoiceData.vrNumber,
                    deliveryNoteNumber: invoiceData.vrNumber,
                    priceCategoryID: response?.master?.priceCategoryID,
                    partyName: response?.master?.partyName,
                    address1: response?.master?.address1,
                    billDiscount: response?.master?.billDiscount,
                    taxOnDiscount: response?.master?.taxOnDiscount,
                  },
                  details: [],
                },
              },
            })
          );
        }
      } catch (error) {
        console.error("API failed", error);
      }
    }
    if (userSession.dbIdValue === "DURRAH_RYD") {
      dispatch(
        formStateHandleFieldChangeKeysOnly({
          fields: {
            formElements: {
              dgvInventory: {
                disabled: true,
              },
              ledgerID: {
                disabled: true,
              },
              // txtData.Visible = false;
            },
          },
        })
      );
    }
  };
  const gridRef = useRef<any>(null);

  const handleProcessSelected = async () => {
    const selectedData =
      gridRef.current?.instance()?.getSelectedRowsData("all") || [];

    if (selectedData.length === 0) {
      ERPAlert.show({
        title: t("warning"),
        text: t("please_select_items"),
        icon: "warning",
      });
      return;
    }
    const rows = selectedData.map((row: any) => ({
      ...initialTransactionDetailData,
      ...row,
      slNo: generateUniqueKey(),
    }));
    const summaryRes = await calculateSummary(rows, formState, {
      result: {},
    });

    const totalRes = await calculateTotal(
      formState.transaction.master,
      summaryRes.summary as SummaryItems,
      {
        ...formState.formElements,
      } as FormElementsState,
      { result: {} }
    );
    const result = {
      ...totalRes,
      row: initialTransactionDetailData,
      summary: summaryRes.summary,
      transaction: {
        ...totalRes.transaction,
        details: [],
      },
    };
    dispatch(
      formStateHandleFieldChangeKeysOnly({
        fields: {
          ...result,
        },
        itemsToAddToDetails: rows,
        rowIndex: 0,
      })
    );
    dispatch(formStateTransactionDetailsRowAdd(rows));
    setLoadSalesDataModal(false);
  };

  // Need to add other columns
  const columns: DevGridColumn[] = useMemo(
    () => [
      {
        dataField: "pCode",
        caption: t("product_code"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },
      {
        dataField: "productName",
        caption: t("product_name"),
        dataType: "string",
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },
      {
        dataField: "productCode",
        caption: t("product_code"),
        dataType: "string",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "autoBarcode",
        caption: t("auto_barcode"),
        dataType: "string",
        width: 100,
        allowSorting: true,
        allowSearch: true,
        allowFiltering: true,
      },


      {
        dataField: "quantity",
        caption: t("quantity"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField:"unitName",
        caption: t("unit_name"),
        dataType: "string",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "unitPrice",
        caption: t("unit_price"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "grossValue",
        caption: t("gross_value"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "free",
        caption: t("free"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "netValue",
        caption: t("net_value"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },


      {
        dataField: "quantity",
        caption: t("qtyToReturn"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },


      {
        dataField: "productID",
        caption: t("productID"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "invTransactionDetailID",
        caption: t("invTransaction_detail_ID"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "invTransactionMasterID",
        caption: t("invTransaction_master_ID"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "productBatchID",
        caption: t("product_batch_ID"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },


      {
        dataField: "productDescription",
        caption: t("product_description"),
        dataType: "string",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },


      {
        dataField: "unitID",
        caption: t("unitID"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },


      {
        dataField: "netAmount",
        caption: t("net_Amount"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },


      {
        dataField: "batchNo",
        caption: t("batchNo"),
        dataType: "string",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },


      {
        dataField: "vatPercentage",
        caption: t("vatperc"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "totalVatAmount",
        caption: t("vatAmt"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "adjQty",
        caption: t("returnedQty"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "valuationPrice",
        caption: t("valuation_Price"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        visible: false
      },

      {
        dataField: "DiscountPer1",
        caption: t("disc%"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },

      {
        dataField: "discount",
        caption: t("discount"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        visible: false
      },

      {
        dataField: "ratePlusTax",
        caption: t("ratePlusTax"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },


       {
        dataField: "purchasePrice",
        caption: t("Purchase_Price"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        visible: false
      },

      {
        dataField: "warehouse",
        caption: t("warehouse"),
        dataType: "string",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        visible: false
      },

      {
        dataField: "productID",
        caption: t("productID"),
        dataType: "number",
        visible: false,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
      },
      {
        dataField: "arabicName",
        caption: t("arabic_name"),
        dataType: "string",
        width: 150,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        visible: false
      },
      {
        dataField: "stock",
        caption: t("stock"),
        dataType: "number",
        width: 100,
        allowSorting: true,
        allowSearch: false,
        allowFiltering: true,
        visible: false
      },
    ],
    [t]
  );

  return (
    <div>
      <label className="text-secondary">{t("sales_invoice#")}</label>

      <div className="grid grid-cols-[160px_1fr_0px] gap-1 items-center">
        <div className="flex gap-1">
          <ERPInput
            id="prefix"
            type="text"
            value={invoiceData.vrPrefix}
            noLabel
            className="w-20"
            onChange={(e) =>
              setInvoiceData((prev) => ({
                ...prev,
                vrPrefix: e.target.value.toUpperCase(),
              }))
            }
          />

          <ERPInput
            id="voucherNumber"
            type="text"
            value={invoiceData.vrNumber}
            noLabel
            className="w-32"
            onChange={(e) =>
              setInvoiceData((prev) => ({
                ...prev,
                vrNumber: e.target.value,
              }))
            }
            disableEnterNavigation
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {loadSalesDataModal && (
        <ERPModal
          isOpen={loadSalesDataModal}
          title={t("load_sales_to_return")}
          width={850}
          height={600}
          closeModal={() => setLoadSalesDataModal(false)}
          closeOnEscape={true}
          content={
            <div>
              <div className="flex gap-2 justify-end p-2">
                <ERPButton
                  title={t("cancel")}
                  type="button"
                  variant="secondary"
                  className="py-2"
                  onClick={() => setLoadSalesDataModal(false)}
                />
                <ERPButton
                  title={t("process_selected")}
                  type="button"
                  variant="primary"
                  className="py-2"
                  onClick={handleProcessSelected}
                />
              </div>
              <div className="mb-4">
                <ErpDevGrid
                  ref={gridRef}
                  columns={columns}
                  dataSource={gridData}
                  gridId={`grd_load_sales_to_return_${voucherType}`}
                  height={400}
                  hideGridAddButton={true}
                  enableScrollButton={false}
                  selectionMode="multiple"
                  initialSort={[{ selector: "voucherNumber", desc: true }]}
                  showPrintButton={false}
                  allowExport={false}
                  allowSearching={false}
                  hideToolbar={true}
                  scrolling={{
                    mode: 'virtual',
                    useNative: true,
                    showScrollbar: 'always'
                  }}
                  showChooserOnGridHead
                />
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default SalesInvoiceNumber;
