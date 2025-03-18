"use client"

import ERPInput from "../../../../../components/ERPComponents/erp-input"
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox"
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox"
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions"
import Urls from "../../../../../redux/urls"
import initialProductData from "../products-data"
import { useTranslation } from "react-i18next"

const ProductMultiUnitsGCC = () => {
    const { handleFieldChange, getFieldProps } = useFormManager({
        initialData: {
            ...initialProductData,
            multiUnits: {
                unit1: "",
                unit2: "",
                unit3: "",
                unit4: "",
                unit5: "",
                unit6: "",
                unit7: "",
                unit8: "",
                unit9: "",
                unit10: "",
            },
            quantities: {
                unit1Qty1: "1",
                unit1Qty2: "",
                unit2Qty1: "0",
                unit2Qty2: "0",
                unit3Qty1: "0",
                unit3Qty2: "0",
                unit4Qty1: "0",
                unit4Qty2: "0",
                unit5Qty1: "0",
                unit5Qty2: "0",
                unit6Qty1: "0",
                unit6Qty2: "0",
                unit7Qty1: "0",
                unit7Qty2: "0",
                unit8Qty1: "0",
                unit8Qty2: "0",
                unit9Qty1: "0",
                unit9Qty2: "0",
                unit10Qty1: "0",
                unit10Qty2: "0",
            },
            prices: {
                unit1Price: "0.00",
                unit2Price: "0.00",
                unit3Price: "0.00",
                unit4Price: "0.00",
                unit5Price: "0.00",
                unit6Price: "0.00",
                unit7Price: "0.00",
                unit8Price: "0.00",
                unit9Price: "0.00",
                unit10Price: "0.00",
            },
            barcodes: {
                unit1Barcode: "",
                unit2Barcode: "",
                unit3Barcode: "",
                unit4Barcode: "",
                unit5Barcode: "",
                unit6Barcode: "",
                unit7Barcode: "",
                unit8Barcode: "",
                unit9Barcode: "",
                unit10Barcode: "",
            },
            remarks: {
                unit1Remark: "",
                unit2Remark: "",
                unit3Remark: "",
                unit4Remark: "",
                unit5Remark: "",
                unit6Remark: "",
                unit7Remark: "",
                unit8Remark: "",
                unit9Remark: "",
                unit10Remark: "",
            },
            config: {
                enableBarcodes: false,
            },
        },
    })

    const renderUnitRows = () => {
        const units = Array.from({ length: 10 }, (_, i) => i + 1)
        const { t } = useTranslation("inventory")
        return units.map((num) => (
            <tr key={`unit-${num}`} className="h-10">
                <td className="pr-2">
                    <div className="flex items-center">
                        <span className="text-sm font-medium w-12">
                            {t("unit")} {num}
                        </span>
                        <ERPDataCombobox
                            {...getFieldProps(`multiUnits.unit${num}`)}
                            noLabel={true}
                            field={{
                                getListUrl: Urls.salesRoute,
                                labelKey: "label",
                                valueKey: "value",
                            }}
                            onChangeData={(data) => handleFieldChange(`multiUnits.unit${num}`, data[`unit${num}`])}
                            className="w-48"
                        // placeholder={`Select MultiUnits.Unit${num}`}
                        />
                    </div>
                </td>
                <td className="px-2">
                    <ERPInput
                        id={`unit${num}Qty1`}
                        noLabel={true}
                        value={getFieldProps(`quantities.unit${num}Qty1`).value || (num === 1 ? "1" : "0")}
                        onChange={(e) => handleFieldChange(`quantities.unit${num}Qty1`, e.target.value)}
                        className={`w-24 text-center ${getFieldProps(`multiUnits.unit${num}`).value ? "bg-[ #fef9c3]" : ""}`}
                    />
                </td>
                <td className="px-2">
                    {num === 1 ? (
                        <div className="w-24"></div>
                    ) : (
                        <ERPInput
                            id={`unit${num}Qty2`}
                            noLabel={true}
                            value={getFieldProps(`quantities.unit${num}Qty2`).value || "0"}
                            onChange={(e) => handleFieldChange(`quantities.unit${num}Qty2`, e.target.value)}
                            className={`w-24 text-center ${getFieldProps(`multiUnits.unit${num}`).value ? "bg-[ #fef9c3]" : ""}`}
                        />
                    )}
                </td>
                <td className="px-2">
                    <ERPInput
                        id={`unit${num}Barcode`}
                        noLabel={true}
                        value={getFieldProps(`barcodes.unit${num}Barcode`).value || ""}
                        onChange={(e) => handleFieldChange(`barcodes.unit${num}Barcode`, e.target.value)}
                        className="w-32"
                        disabled={!getFieldProps("config.enableBarcodes").value}
                    />
                </td>
                <td className="px-2">
                    <ERPInput
                        id={`unit${num}Price`}
                        noLabel={true}
                        value={getFieldProps(`prices.unit${num}Price`).value || "0.00"}
                        onChange={(e) => handleFieldChange(`prices.unit${num}Price`, e.target.value)}
                        className="w-32 text-right"
                    />
                </td>
                <td className="pl-2">
                    <ERPInput
                        id={`unit${num}Remark`}
                        noLabel={true}
                        value={getFieldProps(`remarks.unit${num}Remark`).value || ""}
                        onChange={(e) => handleFieldChange(`remarks.unit${num}Remark`, e.target.value)}
                        className="w-40"
                    />
                </td>
            </tr>
        ))
    }

    const { t } = useTranslation("inventory")
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
                                        {...getFieldProps("config.enableBarcodes")}
                                        label={t("barcode")}
                                        onChangeData={(data) => handleFieldChange("config.enableBarcodes", data.enableBarcodes)}
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
                            getListUrl: Urls.salesRoute,
                            labelKey: "label",
                            valueKey: "value",
                        }}
                        onChangeData={(data) => handleFieldChange("batch.defSalesUnitID", data.defSalesUnitID)}
                        className="w-full"
                    />
                    <ERPDataCombobox
                        {...getFieldProps("batch.defPurchaseUnitID")}
                        label={t("purchase")}
                        field={{
                            getListUrl: "vajid",
                            labelKey: "label",
                            valueKey: "value",
                        }}
                        onChangeData={(data) => handleFieldChange("batch.defPurchaseUnitID", data.defPurchaseUnitID)}
                        className="w-full"
                    />
                    <ERPDataCombobox
                        {...getFieldProps("batch.defReportUnitID")}
                        label={t("report")}
                        field={{
                            getListUrl: "vajid",
                            labelKey: "label",
                            valueKey: "value",
                        }}
                        onChangeData={(data) => handleFieldChange("batch.defReportUnitID", data.defReportUnitID)}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductMultiUnitsGCC

