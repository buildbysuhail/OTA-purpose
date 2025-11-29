import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../../components/ERPComponents/erp-data-combobox";
import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  KeyboardNavigation,
  Paging,
  RemoteOperations,
  Scrolling,
} from "devextreme-react/data-grid";
import TransactionDate from "../components/transaction-Date";
import ReferenceDate from "../components/reference-Date";
import WarehouseID from "../components/warehouse-id ";
import PriceCategoryCombobox from "../components/PriceCategoryCombobox";
import PartyLedger from "../components/cb-ledger";
import ERPCheckbox from "../../../../../components/ERPComponents/erp-checkbox";
import Urls from "../../../../../redux/urls";
import { merge } from "lodash";
import { initialUserConfig } from "../../transaction-type-data";

interface TransactionHeaderProps {
  formState: any;
  dispatch: any;
}

const PosComponents: React.FC<TransactionHeaderProps> = ({
  formState,
  dispatch,
}) => {
  const { t } = useTranslation("transaction");
  const [dataSection, setDataSection] = useState("tenderOrCash");

  // ------------------------- Tender Component ----------------------------
  // Actually this is cash section now
  const TenderSection = () => {
    return (
      <div className="flex flex-col gap-1 p-1 pt-2">
        <div className="grid grid-cols-3 gap-2 items-center justify-center text-xl font-semibold p-1">
          {[500, 200, 100, 50, 20, 10, 5, 2, 1].map((amount) => (
            <button
              key={amount}
              className="bg-green-200 px-10 py-2 text-black text-2xl rounded-sm"
            >
              {amount}
            </button>
          ))}
        </div>
        <ERPInput
          id="total"
          type="number"
          noLabel={true}
          value={0.0}
          customSize="customize"
          localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
            inputHeight: 2,
            fontSize: 20,
            fontColor: "0, 0, 0",
          })}
        />
        <div className="flex w-full gap-2 justify-between items-center">
          <ERPInput
            id="balance"
            type="number"
            noLabel={true}
            value={0.0}
            customSize="customize"
            localInputBox={merge({}, initialUserConfig.inputBoxStyle, {
              inputHeight: 2,
              fontSize: 20,
              fontColor: "0, 0, 0",
            })}
          />
          <ERPButton title={t("apply")} variant="primary" className="h-8" />
        </div>
      </div>
    );
  };

  const TenderSectionOld = () => {
    return (
      <div className="h-fit min-h-60 w-full">
        <DataGrid
          //   ref={dataGridRef}
          keyExpr="id"
          //   dataSource={flavourData}
          className="custom-data-grid-dark-only"
          focusedRowEnabled={false}
          showBorders={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          repaintChangesOnly={true}
          height={300}
        >
          <Column dataField="slNo" caption={t("slNo")} width={50} />
          <Column
            dataField="Description"
            width={140}
            caption={t("description")}
          />
          <Column dataField="Amount" width={100} caption={t("amount")} />
          <Column
            dataField="action"
            width={80}
            caption={t("action")}
            allowEditing={true}
            cellRender={(cellData) => (
              <button
                //   onClick={() => handleDelete(cellData.data)}
                className="p-1 text-black hover:text-red-800"
              >
                <Trash2 size={12} />
              </button>
            )}
          />

          <Paging pageSize={40} />
          <Scrolling mode="standard" />
          <RemoteOperations filtering={false} sorting={false} paging={false} />
        </DataGrid>
        <div className="flex justify-between px-2">
          <div className="text-primary font-bold text-lg">
            {t("total_amount")}
          </div>
          <div className="text-danger font-bold text-lg">{1559}</div>
        </div>
      </div>
    );
  };

  // --------------- Details Components --------------------------
  const DetailsSection = () => {
    return (
      <div className="w-full px-1">
        <PartyLedger
          // ref={ledgerIdRef}
          // handleFieldKeyDown={handleFieldKeyDown}
          // transactionType={transactionType}
          // handleKeyDown={handleKeyDown}
          handleFieldKeyDown={() => null}
          transactionType=""
          handleKeyDown={() => null}
          formState={formState}
          dispatch={dispatch}
          t={t}
          setIsPartyDetailsOpen={() => {
            // setIsPartyDetailsOpen((prev: any) => {
            //   return !prev;
            // });
          }}
        />
        <div className="flex gap-1">
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="partyName"
            label={t("name")}
            value={formState.transaction.master.partyName}
            className="max-w-full"
            // labelDirection="horizontal"
            // onChange={(e) =>
            //   dispatch(
            //     formStateMasterHandleFieldChange({
            //       fields: { partyName: e.target?.value },
            //     })
            //   )
            // }
            disabled={formState.formElements.pnlMasters?.disabled}
          />
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="address1"
            label={t("address")}
            value={formState.transaction.master.address1}
            className="max-w-full"
            // labelDirection="horizontal"
            // onChange={(e) =>
            //   dispatch(
            //     formStateMasterHandleFieldChange({
            //       fields: { address1: e.target?.value },
            //     })
            //   )
            // }
            disabled={formState.formElements.pnlMasters?.disabled}
          />
        </div>
        <div className="flex gap-1 items-center">
          <ERPInput
            localInputBox={formState?.userConfig?.inputBoxStyle}
            id="address4"
            label={t("mobile_number")}
            value={formState.transaction.master.address4}
            className="max-w-full"
            // labelDirection="horizontal"
            // onChange={(e) =>
            //   dispatch(
            //     formStateMasterHandleFieldChange({
            //       fields: { address4: e.target?.value },
            //     })
            //   )
            // }
            disabled={formState.formElements.pnlMasters?.disabled}
          />
          <ERPInput
            id="invoiceNo"
            type="number"
            // noLabel={true}
            value={0.0}
            // labelDirection="horizontal"
          />
        </div>

        <div className="flex gap-1 justify-between">
          <TransactionDate formState={formState} dispatch={dispatch} t={t} />
          <ReferenceDate
            dispatch={dispatch}
            formState={formState}
            // handleKeyDown={(e) => {
            //   if (isEnterKey(e.key)) {
            //     if (
            //       formState.currentCell &&
            //       formState.currentCell.rowIndex > 0 &&
            //       formState.currentCell.column != ""
            //     ) {
            //       focusToNextColumn(
            //         formState.currentCell.rowIndex,
            //         formState.currentCell.column
            //       );
            //     } else {
            //       focusToNextColumn(0, "slNo");
            //     }
            //   }
            // }}
            t={t}
          />
        </div>
        <div className="flex gap-1">
          <WarehouseID
            formState={formState}
            dispatch={dispatch}
            t={t}
            // handleKeyDown={handleKeyDown}
            // handleFieldKeyDown={handleFieldKeyDown}
            handleKeyDown={() => null}
            handleFieldKeyDown={() => null}
          />

          <PriceCategoryCombobox
            formState={formState}
            dispatch={dispatch}
            t={t}
            // handleKeyDown={handleKeyDown}
            // handleFieldKeyDown={handleFieldKeyDown}
            handleKeyDown={() => null}
            handleFieldKeyDown={() => null}
          />
        </div>
        <div className="flex gap-1">
          {/* Actually salesman here */}
          <ERPDataCombobox
            id="salesman"
            label={t("sales_man")}
            // {...getFieldProps("salesmanID")}
            field={{
              id: "salesmanID",
              getListUrl: Urls.data_employees,
              valueKey: "id",
              labelKey: "name",
            }}
            //   onSelectItem={(data) => {
            //     handleFieldChange({
            //   salesmanID: data.value,
            //   salesman: data.label,
            // })
            //   }}
          />
          {/* <label className="font-medium">{t("cr.card_amount")}</label> */}
          <ERPInput
            id="remarks"
            type="text"
            // noLabel={true}
            // value={0.0}
            // labelDirection="horizontal"
          />
        </div>
      </div>
    );
  };

  // ------------------ Fast Moving section ----------------------
  const FastMovingSection = () => {
    return (
      <div className="w-full flex flex-col gap-2 p-2">
        {/* 3x5 Top Grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-2">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-md h-12 bg-white"
            ></div>
          ))}
        </div>

        {/* Radio Buttons Section */}
        <div className="flex justify-center gap-6 py-1 bg-gray-100 rounded-md">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} className="flex items-center gap-2 text-sm">
              <input type="radio" name="fastPage" className="accent-blue-600" />
              {num}
            </label>
          ))}
        </div>

        {/* Bottom Purple Buttons */}
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <button
              key={i}
              className="bg-[#330033] h-8 rounded-sm border border-[#440044]"
            ></button>
          ))}
        </div>
      </div>
    );
  };

  const SettingsSection = () => {
    return (
      <div className="grid grid-cols-2 gap-y-2 px-2 py-6 w-full">
        <ERPCheckbox
          id="useBarcode"
          label={t("use_barcode")}
          data={formState.userConfig}
          checked={formState?.userConfig?.useBarcode}
          // onChangeData={(e) => handleFieldChange("useBarcode", e.useBarcode)}
          className=""
        />
        <ERPCheckbox
          id="roundOff"
          label={t("round_off")}
          data={formState.userConfig}
          checked={formState?.userConfig?.roundOff}
          // onChangeData={(e) => handleFieldChange("roundOff", e.roundOff)}
        />
        <ERPCheckbox
          id="holdSalesMan"
          label={t("hold_salesman")}
          data={formState.userConfig}
          checked={formState?.userConfig?.holdSalesMan}
          // onChangeData={(e) =>
          //   handleFieldChange("holdSalesMan", e.holdSalesMan)
          // }
          // className="w-1/3"
        />
        <ERPCheckbox
          localInputBox={formState?.userConfig?.inputBoxStyle}
          id="printOnSave"
          label={t(formState.formElements.printOnSave.label)}
          checked={formState.userConfig?.printOnSave}
          // onChange={(e) =>
          //   dispatch(
          //     formStateHandleFieldChange({
          //       fields: { printOnSave: e.target.checked },
          //     })
          //   )
          // }
          disabled={formState.formElements.printOnSave?.disabled}
          // className="w-1/3"
        />
        <ERPCheckbox
          id="qtyAfterBarcode"
          label={t("qty_after_barcode")}
          data={formState.userConfig}
          checked={formState?.userConfig?.qtyAfterBarcode}
          // onChangeData={(e) =>
          //   handleFieldChange("qtyAfterBarcode", e.qtyAfterBarcode)
          // }
          // className="w-1/3"
        />
        <ERPCheckbox
          id="autoIncrementQty"
          label={t("auto_increment_qty")}
          data={formState.userConfig}
          checked={formState?.userConfig?.autoIncrementQty}
          // onChangeData={(e) =>
          //   handleFieldChange("autoIncrementQty", e.autoIncrementQty)
          // }
          // className="w-1/3"
        />
        <ERPCheckbox
          id="showRateBeforeTax"
          label={t("show_rate_before_tax")}
          data={formState.userConfig}
          checked={formState?.userConfig?.showRateBeforeTax}
          // onChangeData={(e) =>
          //   // handleFieldChange("showRateBeforeTax", e.showRateBeforeTax)
          // }
          // className="w-1/3"
        />
        <ERPCheckbox
          id="resizeGrid"
          label={t("resize_grid")}
          data={formState.userConfig}
          checked={formState?.userConfig?.resizeGrid}
          // onChangeData={(e) => handleFieldChange("resizeGrid", e.resizeGrid)}
          // className="w-1/3"
        />
        <ERPCheckbox
          id="duplicationMessage"
          label={t("duplication_message")}
          data={formState.userConfig}
          checked={formState?.userConfig?.duplicationMessage}
          // onChangeData={(e) =>
          //   handleFieldChange("duplicationMessage", e.duplicationMessage)
          // }
          // className="w-1/3"
        />
        <ERPCheckbox
          id="discAmtReadOnly"
          label={t("disc_amt_read_only")}
          data={formState.userConfig}
          checked={formState?.userConfig?.discAmtReadOnly}
          // onChangeData={(e) =>
          //   handleFieldChange("discAmtReadOnly", e.discAmtReadOnly)
          // }
          // className="w-1/3"
        />
        <ERPCheckbox
          id="autoCalculation"
          label={t("auto_calculation")}
          data={formState.userConfig}
          checked={formState?.userConfig?.discAmtReadOnly}
          // onChangeData={(e) =>
          //   handleFieldChange("discAmtReadOnly", e.discAmtReadOnly)
          // }
          // className="w-1/3"
        />
        <ERPCheckbox
          id="invoiceMultiSO"
          label={t("invoice_multi_so")}
          data={formState.userConfig}
          checked={formState?.userConfig?.discAmtReadOnly}
          // onChangeData={(e) =>
          //   handleFieldChange("discAmtReadOnly", e.discAmtReadOnly)
          // }
          // className="w-1/3"
        />
      </div>
    );
  };

  return (
    <div className=" flex flex-col p-2 ">
      <div className="flex flex-row gap-0.5">
        <ERPButton
          title={t("cash")}
          variant="secondary"
          className="w-1/4"
          onClick={() => setDataSection("tenderOrCash")}
        />
        <ERPButton
          title={t("details")}
          variant="secondary"
          className="w-1/4"
          onClick={() => setDataSection("details")}
        />
        <ERPButton
          title={t("fast_moving")}
          variant="secondary"
          className="w-1/4"
          onClick={() => setDataSection("fastMoving")}
        />
        <ERPButton
          title={t("settings")}
          variant="secondary"
          className="w-1/4"
          onClick={() => setDataSection("settings")}
        />
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {dataSection === "tenderOrCash" && <TenderSection />}
        {dataSection === "details" && <DetailsSection />}
        {dataSection === "fastMoving" && <FastMovingSection />}
        {dataSection === "settings" && <SettingsSection />}
      </div>
    </div>
  );
};

export default PosComponents;
