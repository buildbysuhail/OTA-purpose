import React, { useState } from "react";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import { useFormManager } from "../../../../../utilities/hooks/useFormManagerOptions";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import DataGrid, { Column, Paging, Pager, FilterRow, HeaderFilter, Scrolling } from "devextreme-react/data-grid";

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

const SearchCommon: React.FC = () => {
    const { t } = useTranslation("inventory");
    const { handleFieldChange, getFieldProps } = useFormManager({ initialData: initialSearchData, });

    // State to store grid data
    const [gridData, setGridData] = useState([]);
    const [gridVisible, setGridVisible] = useState(false);

    const handleShow = () => {
        // Get current form values
        const searchOption = getFieldProps("searchWith").value || initialSearchData.searchOption;
        const searchText = getFieldProps("searchWith").value || '';
        const searchInactive = getFieldProps("searchInactive").value || false;

        console.log("Show clicked");
        console.log("Search Option:", searchOption);
        console.log("Search Text:", searchText);
        console.log("Search Inactive:", searchInactive);

        // Create a new entry for the grid
        const newEntry = {
            id: Date.now(), // Generate a unique ID
            searchOption,
            searchText,
            searchInactive,
            date: new Date().toLocaleString(),
        };

        setGridVisible(true);
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

            {/* DevExtreme DataGrid */}
            {gridVisible && (
                <div className="mt-6">
                    <DataGrid
                        dataSource={gridData}
                        showBorders={true}
                        columnAutoWidth={true}
                        rowAlternationEnabled={true}>
                        <Paging defaultPageSize={10} />
                        <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} />
                        <FilterRow visible={true} />
                        <HeaderFilter visible={true} />
                        <Scrolling mode="standard" />

                        <Column dataField="id" caption="ID" width={70} />
                        <Column dataField="searchWith" caption={t("search_with")} />
                        <Column dataField="searchText" caption={t("search_text")} />
                        <Column dataField="searchInactive" caption={t("search_inactive")} dataType="boolean" />
                    </DataGrid>
                </div>
            )}
        </div>
    );
};

export default SearchCommon;