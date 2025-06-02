import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDateInput from "../../../../components/ERPComponents/erp-date-input";
import ERPRadio from "../../../../components/ERPComponents/erp-radio";
import moment from "moment";
import Urls from "../../../../redux/urls";
import { useState } from "react";

const NonInvoicedGoodsDeliveryFilter = ({ getFieldProps, handleFieldChange, formState }: any) => {
    const { t } = useTranslation('accountsReport');
    const [searchType, setSearchType] = useState("contains");

    const handleSearchTypeChange = (type: string) => {
        setSearchType(type);
        handleFieldChange("searchType", type);
    };

    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-hidden overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <ERPDateInput
                    label={t("from_date")}
                    {...getFieldProps("fromDate")}
                    className="w-full"
                    onChangeData={(data: any) => handleFieldChange("fromDate", data.fromDate)}
                />
                <ERPDateInput
                    label={t("to_date")}
                    {...getFieldProps("toDate")}
                    className="w-full"
                    onChangeData={(data: any) => handleFieldChange("toDate", data.toDate)}
                />
            </div>

            {/* <div className="flex items-center gap-4 mb-2">
                <ERPRadio
                    id="contains"
                    name="searchType"
                    value="contains"
                    label={t("contains")}
                    checked={searchType === "contains"}
                    onChange={() => handleSearchTypeChange("contains")}
                />
                <ERPRadio
                    id="exactMatch"
                    name="searchType"
                    value="exactMatch"
                    label={t("exact_match")}
                    checked={searchType === "exactMatch"}
                    onChange={() => handleSearchTypeChange("exactMatch")}
                />
            </div> */}
        </div>
    );
}

export default NonInvoicedGoodsDeliveryFilter;
export const NonInvoicedGoodsDeliveryFilterInitialState = {
    fromDate: null,
    toDate: moment().local().toDate(),
};