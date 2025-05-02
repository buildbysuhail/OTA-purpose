import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, { SummaryConfig } from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import { ActionType } from "../../../../redux/types";
import { FC, useMemo } from "react";
import { useNumberFormat } from "../../../../utilities/hooks/use-number-format";
import Urls from "../../../../redux/urls";
import GSTR1CDNRFilter, { GSTR1CDNRFilterInitialState } from "./gstr1-cdnr-filter";

const GSTR1CDNR = () => {
    const { t } = useTranslation('accountsReport');
    const columns: DevGridColumn[] = [
        {
            dataField: "gstiN_UIN_OfRecipient",
            caption: t("gstin_uin_of_recipient"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 150,
        },
        {
            dataField: "receiverName",
            caption: t("receiver_name"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 180,
        },
        {
            dataField: "noteNumber",
            caption: t("note_number"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "noteDate",
            caption: t("note_date"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            dataType:"date",
            format:"dd-MMM-yyyy"
        },
        {
            dataField: "noteType",
            caption: t("note_type"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
        },
        {
            dataField: "placeOfSupply",
            caption: t("place_of_supply"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "reverseCharge",
            caption: t("reverse_charge"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
        },
        {
            dataField: "noteSupplyType",
            caption: t("note_supply_type"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 140,
        },
        {
            dataField: "noteValue",
            caption: t("note_value"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            cellRender: (
                cellElement: any,
                cellInfo: any,
                filter: any,
                exportCell: any
              ) => {
                if (exportCell != undefined) {
                  const value =
                    cellElement.data?.noteValue == null
                      ? ""
                      : getFormattedValue(cellElement.data.noteValue, false, 2);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.noteValue == null
                    ? ""
                    : getFormattedValue(
                        parseFloat(cellElement.data.noteValue),
                        false,
                        2
                      );
                }
              },
            },
        {
            dataField: "rate",
            caption: t("rate"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 80,
            cellRender: (
                cellElement: any,
                cellInfo: any,
                filter: any,
                exportCell: any
              ) => {
                if (exportCell != undefined) {
                  const value =
                    cellElement.data?.rate == null
                      ? ""
                      : getFormattedValue(cellElement.data.rate, false, 2);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.rate == null
                    ? ""
                    : getFormattedValue(
                        parseFloat(cellElement.data.rate),
                        false,
                        2
                      );
                }
              },
            },
        {
            dataField: "applicablePercentOfTaxRate",
            caption: t("applicable_percent_of_tax_rate"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 180,
            cellRender: (
                cellElement: any,
                cellInfo: any,
                filter: any,
                exportCell: any
              ) => {
                if (exportCell != undefined) {
                  const value =
                    cellElement.data?.applicablePercentOfTaxRate == null
                      ? ""
                      : getFormattedValue(cellElement.data.applicablePercentOfTaxRate, false, 2);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.applicablePercentOfTaxRate == null
                    ? ""
                    : getFormattedValue(
                        parseFloat(cellElement.data.applicablePercentOfTaxRate),
                        false,
                        2
                      );
                }
              },
            },
        {
            dataField: "taxableValue",
            caption: t("taxable_value"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 120,
            cellRender: (
                cellElement: any,
                cellInfo: any,
                filter: any,
                exportCell: any
              ) => {
                if (exportCell != undefined) {
                  const value =
                    cellElement.data?.taxableValue == null
                      ? ""
                      : getFormattedValue(cellElement.data.taxableValue, false, 2);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.taxableValue == null
                    ? ""
                    : getFormattedValue(
                        parseFloat(cellElement.data.taxableValue),
                        false,
                        2
                      );
                }
              },
            },
        {
            dataField: "cessAmount",
            caption: t("cess_amount"),
            allowSearch: true,
            allowFiltering: true,
            allowSorting: true,
            width: 100,
            cellRender: (
                cellElement: any,
                cellInfo: any,
                filter: any,
                exportCell: any
              ) => {
                if (exportCell != undefined) {
                  const value =
                    cellElement.data?.cessAmount == null
                      ? ""
                      : getFormattedValue(cellElement.data.cessAmount, false, 2);
                  return {
                    ...exportCell,
                    text: value,
                    alignment: "right",
                    alignmentExcel: { horizontal: "right" },
                  };
                } else {
                  return cellElement.data?.cessAmount == null
                    ? ""
                    : getFormattedValue(
                        parseFloat(cellElement.data.cessAmount),
                        false,
                        2
                      );
                }
              },
            },
    ];

    const { getFormattedValue } = useNumberFormat();
  

    return (
        <Fragment>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                    <div className="px-4 pt-4 pb-2 ">
                        <div className="grid grid-cols-1 gap-3">
                            <ErpDevGrid
                                remoteOperations={{ filtering: false, paging: false, sorting: false }}
                                columns={columns}
                                moreOption={true}
                                gridHeader={t("gstr1cdnr_report")}
                                dataUrl={Urls.gstr1cdnr}
                                hideGridAddButton={true}
                                enablefilter={true}
                                showFilterInitially={true}
                                method={ActionType.POST}
                                filterContent={<GSTR1CDNRFilter />}
                                filterWidth={325}
                                filterHeight={250}
                                filterInitialData={GSTR1CDNRFilterInitialState}
                                reload={true}
                                gridId="grd_gstr1cdnr"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default GSTR1CDNR;