import React, { useMemo, useState } from "react";
import ERPCheckbox from "../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../components/ERPComponents/erp-button";
import ERPDateInput from "./erp-date-input";
import { useTranslation } from "react-i18next";
import { DevGridColumn } from "../types/dev-grid-column";
import ERPDevGrid from "../../components/ERPComponents/erp-dev-grid";

export interface PostTransactionData {
    v_prefix: number;
    voucherNo: number;
    voucherType: string;
    formType: string;
    party: string;
    address1: string;
    amount: string;
    isPost: string;
    invTransMasterID: number;
    accTransMasterID: number;
}

const PostTransactionsLayout: React.FC = () => {
    const { t } = useTranslation('transaction')
    const [gridData, setGridData] = useState<PostTransactionData[]>([]);
    const columns: DevGridColumn[] = useMemo(() => [
        {
            dataField: "vPrefix",
            caption: t("v_prefix"),
            dataType: "number",
            width: 60,
        },
        {
            dataField: "voucherNo",
            caption: t("voucher_no"),
            dataType: "number",
            width: 80,
        },
        {
            dataField: "voucherType",
            caption: t("voucher_type"),
            dataType: "string",
            width: 60,
        },
        {
            dataField: "formType",
            caption: t("form_type"),
            dataType: "string",
            width: 80,
        },
        {
            dataField: "party",
            caption: t("party"),
            dataType: "string",
            width: 100,
        },
        {
            dataField: "address1",
            caption: t("address_1"),
            dataType: "string",
            width: 100,
        },
        {
            dataField: "amount",
            caption: t("amount"),
            dataType: "string",
            width: 80,
        },
        {
            dataField: "isPost",
            caption: t("is_post"),
            dataType: "string",
            width: 50,
        },
        {
            dataField: "invTransMasterID",
            caption: t("inv_trans_master_id"),
            dataType: "number",
            width: 100,
        },
        {
            dataField: "accTransMasterID",
            caption: t("acc_trans_master_id"),
            dataType: "number",
            width: 100,
        },
    ], []);

    const [formData, setFormData] = useState({
        dateFrom: new Date().toISOString(),
        dateTo: new Date().toISOString(),
        voucherType: null,
        formType: null,
        selectAll: false,
    });

    const voucherTypes = [
        { value: "invoice", label: "Invoice" },
        { value: "receipt", label: "Receipt" },
        { value: "payment", label: "Payment" },
        { value: "journal", label: "Journal" },
    ];

    const formTypes = [
        { value: "standard", label: "Standard" },
        { value: "custom", label: "Custom" },
        { value: "tax", label: "Tax" },
    ];

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePost = () => {
        console.log("Posting transactions:", formData);
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-end gap-2">
                    <div className="flex items-center gap-2">
                        {/* Date From */}
                        <ERPDateInput
                            id="dateFrom"
                            label={t('date_from')}
                            value={formData.dateFrom}
                            onChange={(e) => handleChange("dateFrom", e.target.value)}
                        />

                        {/* Date To */}
                        <ERPDateInput
                            id="dateTo"
                            label={t('date_to')}
                            value={formData.dateTo}
                            onChange={(e) => handleChange("dateTo", e.target.value)}
                        />
                    </div>

                    {/* Voucher Type */}
                    <ERPDataCombobox
                        id="voucherType"
                        label={t('voucher_type')}
                        options={voucherTypes}
                        value={formData.voucherType}
                        onChange={(e) => handleChange("voucherType", e?.value || e)}
                    />

                    {/* Show Button */}
                    <ERPButton
                        title={t('show')}
                        variant="secondary"
                        onClick={() => console.log("Show clicked")}
                    />

                    {/* Form Type */}
                    <ERPDataCombobox
                        id="formType"
                        label={t('form_type')}
                        options={formTypes}
                        value={formData.formType}
                        onChange={(e) => handleChange("formType", e?.value || e)}
                    />

                    {/* Select All Checkbox */}
                    <ERPCheckbox
                        id="selectAll"
                        label={t('select_all')}
                        checked={formData.selectAll}
                        onChange={(e) => handleChange("selectAll", e.target.checked)}
                    />
                </div>
                {/* Post Button */}
                <ERPButton
                    title={t('post')}
                    variant="primary"
                    onClick={handlePost}
                />
            </div>
            <ERPDevGrid
                gridHeader={t("post_transactions")}
                data={gridData}
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
                hideDefaultSearchPanel={true}
                hideGridHeader={true}
                gridId={"postTransactionsGrid"}
            />
        </div>
    );
};

export default PostTransactionsLayout;
