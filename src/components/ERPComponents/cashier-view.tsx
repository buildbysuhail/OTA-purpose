import React, { useEffect, useMemo, useState } from "react";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../components/ERPComponents/erp-button";
import ERPDateInput from "./erp-date-input";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";
import { DevGridColumn } from "../types/dev-grid-column";
import ERPDevGrid from "../../components/ERPComponents/erp-dev-grid";
import { Printer, Save, Star, Trash, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiErrorChange } from "../../redux/slices/auth/register/reducer";
import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";
import urls from "../../redux/urls";
import { handlePlainResponse, handleResponse } from "../../utilities/HandleResponse";

export interface CashierViewData {
    id: number;
    branchID: number;
    branch: string;
    voucherNumber: string | null;
    counter: string;
    salesMan: string | null;
    party: string;
    voucherPrefix: string | null;
    transactionDate: string; // ISO date string
    netTotal: number;
    billDiscount: number;
    grandTotal: number;
    staffIncentive: number;
    roundAmount: number;
    voucherType: string | null;
    voucherForm: string | null;
    dailyVoucherNumber: number;
    ledgerID: number;
}
export interface SalesFormData {
    masterId:number;
    date: string;              // ISO string
    voucherNumber: number;
    party: string;
    salesMan: string;

    netTotal: number;          // 2 decimal financial number
    billDiscount: number;
    roundAmount: number;
    grandTotal: number;

    cashReceived: number;
    balanceToPay: number;

    printSalesInvoice: boolean;
    printReceipt: boolean;

    ledgerID: number;

    voucherType: string | null;
    voucherForm: string | null;
}

const CashierView: React.FC = () => {
    const { t } = useTranslation('transaction');
    const navigate = useNavigate();
    const [gridData, setGridData] = useState<CashierViewData[]>([]);
    const cacheRef = React.useRef<Map<string, CashierViewData[]>>(new Map());
    const columns: DevGridColumn[] = useMemo(() => [
        {
            dataField: "id",
            caption: t('id'),
            dataType: "number",
            width: 100,
            visible: false,
        },
        {
            dataField: "branchID",
            caption: t('branch_id'),
            dataType: "number",
            width: 100,
            visible: false,
        },
        {
            dataField: "branch",
            caption: t('branch'),
            dataType: "string",
            width: 80,
            visible: true,
        },
        {
            dataField: "voucherNumber",
            caption: t('voucher_number'),
            dataType: "string",
            width: 60,
            visible: true,
        },
        {
            dataField: "counter",
            caption: t('counter'),
            dataType: "string",
            width: 100,
            visible: true,
        },
        {
            dataField: "salesMan",
            caption: t('sales_man'),
            dataType: "string",
            width: 100,
            visible: false,
        },
        {
            dataField: "party",
            caption: t('party'),
            dataType: "string",
            width: 170,
            visible: true,
        },
        {
            dataField: "voucherPrefix",
            caption: t('voucher_prefix'),
            dataType: "string",
            width: 100,
            visible: false,
        },
        {
            dataField: "transactionDate",
            caption: t('transaction_date'),
            dataType: "date",
            width: 100,
            visible: false,
        },
        {
            dataField: "netTotal",
            caption: t('net_total'),
            dataType: "number",
            width: 100,
            visible: true,

        },
        {
            dataField: "billDiscount",
            caption: t('bill_discount'),
            dataType: "number",
            width: 80,
            visible: true,

        },
        {
            dataField: "grandTotal",
            caption: t('grand_total'),
            dataType: "number",
            width: 80,
            visible: true,

        },
        {
            dataField: "staffIncentive",
            caption: t('staff_incentive'),
            dataType: "number",
            width: 100,
            visible: false,

        },
        {
            dataField: "roundAmount",
            caption: t('round_amount'),
            dataType: "number",
            width: 100,
            visible: false,

        },
        {
            dataField: "voucherType",
            caption: t('voucher_type'),
            dataType: "string",
            width: 100,
            visible: false,
        },
        {
            dataField: "voucherForm",
            caption: t('voucher_form'),
            dataType: "string",
            width: 100,
            visible: false,
        },
        {
            dataField: "dailyVoucherNumber",
            caption: t('daily_voucher_number'),
            dataType: "string",
            width: 100,
            visible: true,
        },
        {
            dataField: "ledgerID",
            caption: t('ledger_id'),
            dataType: "number",
            width: 100,
            visible: false,
        },
    ], []);

    //correctround
    const roundToTwo = (value: number) =>
        Math.round((value + Number.EPSILON) * 100) / 100;

    const [formData, setFormData] = useState<SalesFormData>({
        masterId:0,
        date: new Date().toISOString(),
        voucherNumber: 0,
        party: "",
        salesMan: "",
        netTotal: 0.0,
        billDiscount: 0.0,
        roundAmount: 0.0,
        grandTotal: 0.0,
        cashReceived: 0.0,
        balanceToPay: 0.0,
        printSalesInvoice: false,
        printReceipt: false,
        ledgerID: 0,
        voucherType: null,
        voucherForm: null,
    });


    const feacthData = async () => {
        const currentDate = formData?.date;

        if (!currentDate) return;
        // ✅ If already cached, use it
        if (cacheRef.current.has(currentDate)) {
            setGridData(cacheRef.current.get(currentDate)!);
            console.log("Loaded from cache");
            return;
        }

        try {

            const api = new APIClient();
            const res = await api.getAsync(`${urls.salesView}?Date=${currentDate}`);

            handlePlainResponse(res, () => {
                setGridData(res);
                // 💾 Store in cache
                cacheRef.current.set(currentDate, res);
            });

        } catch (err) {
            console.log("data featch error in cash-view", err);
        }

    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]:
                field === "date"
                    ? new Date(value).toISOString()
                    : value,
        }));
    };
const saveSalesBookingToSalesInvoice = async (
    invTransactionMasterID:number,
    billDiscount:number,
    cashReceived:number,
    ledgerID:number,
): Promise<number> => {
    try {
        // 🔎 Log parameters (equivalent to debugging C# call)
        console.log("SaveSalesBookingToSalesInvoice called with:");
        console.log("InvTransactionMasterID:", invTransactionMasterID);
        console.log("BillDiscount:", billDiscount);
        console.log("CashReceived:", cashReceived);
        console.log("LedgerID:", ledgerID);

        // Example API call (replace with your actual endpoint)
        // const response = await api.post("/sales/save-booking-to-invoice", {
        //     invTransactionMasterID,
        //     billDiscount,
        //     cashReceived,
        //     ledgerID,
        // });

        return  0;
    } catch (error) {
        console.error("Error saving sales booking:", error);
        return 0;
    }
};
const handleSave = async () => {
    try {
        const {
            balanceToPay,
            cashReceived,
            grandTotal,
            billDiscount,
            ledgerID,
            masterId
        } = formData;

        // ✅ Validation (same logic as C#)
        if (
            balanceToPay >= 0 &&
            cashReceived >= grandTotal &&
            grandTotal > 0
        ) {

       const invMasterId =  await saveSalesBookingToSalesInvoice(masterId,billDiscount,cashReceived,ledgerID )
        if(invMasterId){

        }else{

        }
       

        
        //     if (response?.data?.id > 0) {
        //         // ✅ Log action
        //         await api.post("/audit/log", {
        //             message: `User saved sales booking to sales invoices - Voucher ${formData.voucherNumber}`,
        //             action: "save",
        //             formCode: formCode,
        //         });

        //         // ✅ Print if required
        //         if (formData.printSalesInvoice) {
        //             printReceipt();
        //         }

        //         // ✅ Clear form
        //         resetForm();

        //         // ✅ Refresh grid
        //         refreshSalesViewList();
        //     } else {
        //         throw new Error("Save failed");
        //     }
        
        // } else {
        //     showError("Validation failed");
        // }
    }
    } catch (error) {
        console.error(error);
        // showError("Error while saving");
    }
};

    const handlePrint = () => {
        console.log("Printing:", formData);
    };

    const handleClear = () => {
        setFormData({
            masterId:0,
            date: new Date().toISOString().split('T')[0],
            voucherNumber: 0,
            party: "",
            salesMan: "",
            netTotal: 0.0,
            billDiscount: 0.0,
            roundAmount: 0.0,
            grandTotal: 0.0,
            cashReceived: 0.0,
            balanceToPay: 0.0,
            printSalesInvoice: false,
            printReceipt: false,
            ledgerID: 0,
            voucherType: null,
            voucherForm: null,
        });
    };
    const handleRowClick = (event: any) => {
        const row = event?.data;
        if (!row) return;

        setFormData((prev) => ({
            ...prev,
            party: row.party ?? "",
            salesMan: row.salesMan ?? "",
            netTotal: Number(row.netTotal) || 0,
            billDiscount: Number(row.billDiscount) || 0,
            roundAmount: Number(row.roundAmount) || 0,
            grandTotal: Number(row.grandTotal) || 0,
            voucherType:row.voucherType??null,
            voucherForm:row.voucherForm??null,
            ledgerID:Number(row.ledgerID) ||0
        }));
    };


    const calculateTotals = (netTotal: number, billDiscount: number) => {
        // Grand total before rounding
        let grandTotal = netTotal - billDiscount;

        // Rounded value
        const rounded = Math.round(grandTotal);

        // Round difference
        const roundAmount =
            Math.round((rounded - grandTotal + Number.EPSILON) * 100) / 100;

        // Final grand total after round adjustment
        grandTotal =
            Math.round((grandTotal + roundAmount + Number.EPSILON) * 100) / 100;

        return {
            grandTotal,
            roundAmount,
        };
    };

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            balanceToPay: roundToTwo(prev.cashReceived - prev.grandTotal),
        }));
    }, [formData.cashReceived,formData.grandTotal]);

    return (
        <>
            <div className="flex bg-gray-100 relative">
                {/* Main Grid Area */}
                <div className="flex-1 p-2">
                    <ERPDevGrid
                        data={gridData}
                        columns={columns}
                        gridHeader={t('cashier_view')}
                        remoteOperations={false}
                        showBorders={true}
                        rowAlternationEnabled={true}
                        enableScrollButton={false}
                        hideDefaultExportButton={true}
                        hideGridAddButton={true}
                        ShowGridPreferenceChooser={false}
                        showPrintButton={false}
                        className="w-full h-full"
                        selectionMode="single"
                        allowSelection={true}
                        hideDefaultSearchPanel={true}
                        gridId="cashierViewGrid"
                        height={775}
                        onRowClick={handleRowClick}
                    />
                </div>

                {/* Right Details Panel */}
                <div className="w-80 bg-white border-l border-gray-300 p-4 flex flex-col">
                    <div className="mb-4">
                        <h3 className="font-semibold text-sm mb-2">{t('details')}</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Date and Voucher No */}
                        <div className="flex gap-2">
                            <ERPDateInput
                                id="date"
                                label={t('date')}
                                value={formData.date}
                                onChange={(e) => handleChange("date", e.target.value)}
                            />
                            <ERPInput
                                id="voucherNumber"
                                label={t('voucher_no')}
                                value={formData.voucherNumber}
                                // onChange={(e) => handleChange("voucherNumber", e.target.value)}
                                className="w-20"
                                readOnly
                            />
                        </div>

                        {/* View Booking Button */}
                        <div className="flex items-end justify-between">
                            <a href="#" className="text-blue-600 text-xs underline">
                                Bal: 0.00
                            </a>
                            <ERPButton
                                title={t("view_booking")}
                                variant="secondary"
                                startIcon={<Star className="w-4 h-4" />}
                                onClick={feacthData}
                            />
                        </div>

                        {/* Party */}
                        <div className="flex items-end justify-between">
                            <label className="w-20">{t("party")}</label>
                            <ERPDataCombobox
                                id="party"
                                noLabel={true}
                                options={[]}
                                value={formData.party}
                                onChange={(e) => handleChange("party", e?.value || e)}
                            />
                        </div>

                        {/* SalesMan */}
                        <div className="flex items-end justify-between">
                            <label className="w-20">{t("sales_man")}</label>

                            <ERPInput
                                id="salesMan"
                                noLabel={true}

                                value={formData.salesMan}

                                readOnly
                            />
                        </div>

                        {/* Net Total */}
                        <div className="flex items-end justify-between">
                            <label>{t("net_total")}</label>
                            <ERPInput
                                id="netTotal"
                                noLabel={true}
                                className="w-32"
                                value={formData.netTotal.toFixed(2)}
                                readOnly
                            />
                        </div>

                        {/* Bill Discount */}
                        <div className="flex items-end justify-between">
                            <label>{t("bill_discount")}</label>
                            <ERPInput
                                id="billDiscount"
                                noLabel={true}
                                className="w-32"
                                type="number"
                                value={formData.billDiscount}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow empty input while typing
                                    if (value === "") {
                                        setFormData(prev => ({
                                            ...prev,
                                            billDiscount: 0,
                                        }));
                                        return;
                                    }

                                    const discount = Number(value);

                                    if (isNaN(discount)) return;

                                    setFormData((prev) => {
                                        const totals = calculateTotals(prev.netTotal, discount);

                                        return {
                                            ...prev,
                                            billDiscount: discount,
                                            grandTotal: totals.grandTotal,
                                            roundAmount: totals.roundAmount,
                                        };
                                    });
                                }}
                                onBlur={() => {
                                    // Format only when user leaves input
                                    setFormData(prev => ({
                                        ...prev,
                                        billDiscount: Math.round((prev.billDiscount + Number.EPSILON) * 100) / 100,
                                    }));
                                }}
                            />
                        </div>

                        {/* Round Off */}
                        <div className="flex items-end justify-between">
                            <label>{t("round_off")}</label>
                            <ERPInput
                                id="roundAmount"
                                noLabel={true}
                                className="w-32"
                                value={formData.roundAmount}
                                readOnly
                            />
                        </div>

                        {/* Grand Total */}
                        <div className="flex items-end justify-between">
                            <label className="font-bold text-red-600">{t("grand_total")}</label>
                            <ERPInput
                                id="grandTotal"
                                noLabel={true}
                                className="w-32"
                                value={formData.grandTotal.toFixed(2)}
                                readOnly
                            />
                        </div>

                        {/* Cash Received */}
                        <div className="flex items-end justify-between">
                            <label>{t("cash_received")}</label>
                            <ERPInput
                                id="cashReceived"
                                type="number"
                                noLabel={true}
                                className="w-32"
                                value={formData.cashReceived}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        cashReceived: Number(e.target.value) || 0,
                                    }))
                                }
                            />
                        </div>

                        {/* Balance to Pay */}
                        <div className="flex items-end justify-between">
                            <label className="font-bold text-red-600">{t("balance_to_pay")}</label>
                            <ERPInput
                                id="balanceToPay"
                                noLabel={true}
                                className="w-32"
                                value={formData.balanceToPay.toFixed(2)}
                                readOnly
                            />
                        </div>

                        {/* Checkboxes */}
                        <ERPCheckbox
                            id="printSalesInvoice"
                            label={t("print_sales_invoice")}
                            checked={formData.printSalesInvoice}
                            onChange={(e) => handleChange("printSalesInvoice", e.target.checked)}
                        />
                        <ERPCheckbox
                            id="printReceipt"
                            label={t("print_receipt")}
                            checked={formData.printReceipt}
                            onChange={(e) => handleChange("printReceipt", e.target.checked)}
                        />
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="border-t p-2 absolute bottom-0 w-full bg-white right-0 left-0">
                <div className="flex items-end justify-end gap-2">
                    <ERPButton
                        title={t("save")}
                        variant="primary"
                        startIcon={<Save className="w-4 h-4" />}
                        onClick={handleSave}
                    />
                    <ERPButton
                        title={t("print")}
                        variant="secondary"
                        startIcon={<Printer className="w-4 h-4" />}
                        onClick={handlePrint}
                    />
                    <ERPButton
                        title={t("clear")}
                        variant="secondary"
                        startIcon={<Trash className="w-4 h-4" />}
                        onClick={handleClear}
                    />
                    <ERPButton
                        title={t("close")}
                        variant="secondary"
                        startIcon={<X className="w-4 h-4" />}
                        onClick={() => navigate(-1)}
                    />
                </div>
            </div>
        </>
    );
};

export default CashierView;