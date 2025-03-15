import React from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button"; 

const searchOptions = [
    { id: "Product", name: "Product" },
    { id: "ProductCode", name: "ProductCode" },
    { id: "GroupName", name: "GroupName" },
    { id: "ManualBarcode", name: "ManualBarcode" },
    { id: "Unit", name: "Unit" },
];

const initialSearchData = {
    searchOption: "Product",
    searchText: "",
    searchInactive: false,
};

const SearchGcc: React.FC = () => {
    const { t } = useTranslation("inventory");
    const { handleFieldChange, getFieldProps } = useFormManager({ initialData: initialSearchData, });

    const handleShow = () => {
        console.log("Show clicked");
        console.log("Search Option:", getFieldProps("searchOption").value);
        console.log("Search Text:", getFieldProps("searchText").value);
        console.log("Search Inactive:", getFieldProps("searchInactive").value);
    };

    const handleCreateBatch = () => {
        console.log("Create batch clicked");
    };

    return (
        <div className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between">
                <div className="grid items-end grid-cols-3 gap-4">
                    <ERPDataCombobox
                        {...getFieldProps("searchWith")}
                        field={{
                            id: "searchWith",
                            valueKey: "id",
                            labelKey: "name",
                        }}
                        label={t("search_with")}
                        options={searchOptions}
                        onChangeData={(data) =>
                            handleFieldChange("searchWith", data.searchWith)
                        }
                    />

                    <ERPInput
                        {...getFieldProps("searchWith")}
                        noLabel={true}
                        onChangeData={(data) => handleFieldChange("searchWith", data.searchWith)}
                    />

                    <ERPCheckbox
                        {...getFieldProps("searchInactive")}
                        label={t("search_inactive")}
                        onChangeData={(data) =>
                            handleFieldChange("searchInactive", data.searchInactive)
                        }
                    />
                </div>

                <div className="flex items-center gap-4">
                    <ERPButton
                        onClick={handleShow}
                        title={t("show")}
                        variant="secondary"
                        className="mt-5"
                    />
                    <ERPButton
                        onClick={handleCreateBatch}
                        title={t("create_batch")}
                        variant="primary"
                        className="mt-5"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchGcc;
