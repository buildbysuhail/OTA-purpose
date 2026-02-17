import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { useTranslation } from "react-i18next";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";






interface BillwiseDetailsGridProp {
    isMaximized?: boolean;
    modalHeight?: any;
    billwiseData: any;
}

const BillwiseDetailsGrid = ({
    modalHeight,
    isMaximized,
    billwiseData,
}: BillwiseDetailsGridProp) => {
    const { t } = useTranslation("accountsReport");

    const gridRef = useRef<any>(null);

    const [gridHeight, setGridHeight] = useState<{ mobile: number; windows: number; }>({ mobile: 500, windows: 500 });

    useEffect(() => {
        let gridHeightMobile = modalHeight - 50;
        let gridHeightWindows = modalHeight - 150;
        setGridHeight({ mobile: gridHeightMobile, windows: gridHeightWindows });
    }, [isMaximized, modalHeight]);



    const columns: DevGridColumn[] = useMemo(
        () => [
            {
                dataField: "transactionDate",
                caption: t("transaction_date"),
                dataType: "date",
                width: 150,
                allowFiltering: true,
            },
            {
                dataField: "vType",
                caption: t("voucher_type"),
                dataType: "string",
                width: 150,
                allowFiltering: false,
            },
            {
                dataField: "voucherNumber",
                caption: t("voucher_number"),
                dataType: "string",
                width: 150,
                allowFiltering: true,
                selectedFilterOperation: "startswith",
            },
            {
                dataField: "adjustedAmount",
                caption: t("adjusted_amount"),
                dataType: "number",
                width: 150,
                allowFiltering: true,
                selectedFilterOperation: "startswith",
            },
        ], [t]
    );

    const memoizedGrid = useMemo(() => (
        <ErpDevGrid
            ref={gridRef}
            hideGridAddButton
            enableScrollButton={false}
            pageSize={30}
            className="mainGridStyle"
            columns={columns}
            heightToAdjustOnWindowsInModal={gridHeight.windows}
            data={billwiseData}
            gridId="grd_billwise_details"

            reload
            scrolling={{
                mode: "virtual",
                showScrollbar: "always",
                useNative: true
            }}
            gridAddButtonIcon="ri-add-line"
            // selectionMode="multiple"
            showPrintButton={false}
            tabIndex="0"

        />

    ), [billwiseData, columns,]);


    return (
        <Fragment>



                        {/* Searchbox modal Main Grid */}
                        <div>{memoizedGrid}</div>

        </Fragment>
    );
};

export default BillwiseDetailsGrid;
