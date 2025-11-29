import React, { useMemo, useState } from "react";
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

export interface CashierViewData {
    branch: string;
    voucherNumber: string;
    counter: string;
    party: string;
    netTotal: number;
    billDiscount: number;
    grandTotal: number;
    dailyVoucherNumber: string;
}

const CashierView: React.FC = () => {
    const { t } = useTranslation('transaction');
    const navigate = useNavigate();
    const [gridData, setGridData] = useState<CashierViewData[]>([]);

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
            format: "0.00",
        },
        {
            dataField: "billDiscount",
            caption: t('bill_discount'),
            dataType: "number",
            width: 80,
            visible: true,
            format: "0.00",
        },
        {
            dataField: "grandTotal",
            caption: t('grand_total'),
            dataType: "number",
            width: 80,
            visible: true,
            format: "0.00",
        },
        {
            dataField: "staffIncentive",
            caption: t('staff_incentive'),
            dataType: "number",
            width: 100,
            visible: false,
            format: "0.00",
        },
        {
            dataField: "roundAmount",
            caption: t('round_amount'),
            dataType: "number",
            width: 100,
            visible: false,
            format: "0.00",
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


    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        voucherNo: "0",
        party: null,
        salesMan: null,
        netTotal: "0.00",
        billDiscount: "0.00",
        roundOff: "0.00",
        grandTotal: "0.00",
        cashReceived: "0.00",
        balanceToPay: "0.00",
        printSalesInvoice: false,
        printReceipt: false,
    });

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log("Saving:", formData);
    };

    const handlePrint = () => {
        console.log("Printing:", formData);
    };

    const handleClear = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            voucherNo: "0",
            party: null,
            salesMan: null,
            netTotal: "0.00",
            billDiscount: "0.00",
            roundOff: "0.00",
            grandTotal: "0.00",
            cashReceived: "0.00",
            balanceToPay: "0.00",
            printSalesInvoice: false,
            printReceipt: false,
        });
    };

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
                                id="voucherNo"
                                label={t('voucher_no')}
                                value={formData.voucherNo}
                                onChange={(e) => handleChange("voucherNo", e.target.value)}
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
                                onClick={() => console.log("View Booking")}
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
                            <ERPDataCombobox
                                id="salesMan"
                                noLabel={true}
                                options={[]}
                                value={formData.salesMan}
                                onChange={(e) => handleChange("salesMan", e?.value || e)}
                            />
                        </div>

                        {/* Net Total */}
                        <div className="flex items-end justify-between">
                            <label>{t("net_total")}</label>
                            <ERPInput
                                id="netTotal"
                                noLabel={true}
                                className="w-32"
                                value={formData.netTotal}
                                onChange={(e) => handleChange("netTotal", e.target.value)}
                            />
                        </div>

                        {/* Bill Discount */}
                        <div className="flex items-end justify-between">
                            <label>{t("bill_discount")}</label>
                            <ERPInput
                                id="billDiscount"
                                noLabel={true}
                                className="w-32"
                                value={formData.billDiscount}
                                onChange={(e) => handleChange("billDiscount", e.target.value)}
                            />
                        </div>

                        {/* Round Off */}
                        <div className="flex items-end justify-between">
                            <label>{t("round_off")}</label>
                            <ERPInput
                                id="roundOff"
                                noLabel={true}
                                className="w-32"
                                value={formData.roundOff}
                                onChange={(e) => handleChange("roundOff", e.target.value)}
                            />
                        </div>

                        {/* Grand Total */}
                        <div className="flex items-end justify-between">
                            <label className="font-bold text-red-600">{t("grand_total")}</label>
                            <ERPInput
                                id="grandTotal"
                                noLabel={true}
                                className="w-32"
                                value={formData.grandTotal}
                                onChange={(e) => handleChange("grandTotal", e.target.value)}
                            />
                        </div>

                        {/* Cash Received */}
                        <div className="flex items-end justify-between">
                            <label>{t("cash_received")}</label>
                            <ERPInput
                                id="cashReceived"
                                noLabel={true}
                                className="w-32"
                                value={formData.cashReceived}
                                onChange={(e) => handleChange("cashReceived", e.target.value)}
                            />
                        </div>

                        {/* Balance to Pay */}
                        <div className="flex items-end justify-between">
                            <label className="font-bold text-red-600">{t("balance_to_pay")}</label>
                            <ERPInput
                                id="balanceToPay"
                                noLabel={true}
                                className="w-32"
                                value={formData.balanceToPay}
                                onChange={(e) => handleChange("balanceToPay", e.target.value)}
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