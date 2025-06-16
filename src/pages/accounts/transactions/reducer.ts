import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  accTransactionFormStateInitialData,
  AccTransactionFormState,
  AccTransactionData,
  AccTransactionRow,
  AccTransactionMaster,
  AccTransactionRowInitialData,
  accTransactionInitialData,
  initialFormElements,
  FormElementState,
  Attachments,
} from "./acc-transaction-types";
import { useAccTransaction } from "./use-acc-transaction";
import { loadAccVoucher, unlockAccTransactionMaster } from "./thunk";
import VoucherType from "../../../enums/voucher-types";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { RootState } from "../../../redux/store";
import {
  Countries,
  UserModel,
} from "../../../redux/slices/user-session/reducer";
import { UserAction, useUserRights } from "../../../helpers/user-right-helper";
import { ApplicationSettingsType } from "../../settings/system/application-settings-types/application-settings-types";
import { calculateTotal, clearEntryControl } from "./functions";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import moment from "moment";
import { modelToBase64Unicode } from "../../../utilities/jsonConverter";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import { setTransactionForHistory } from "../../../helpers/transaction-modified-util";

const accTransactionSlice = createSlice({
  name: "accTransaction",
  initialState: accTransactionFormStateInitialData,
  reducers: {
    // Set entire form state
    accFormStateSet: (
      state,
      action: PayloadAction<AccTransactionFormState>
    ) => {
      return action.payload;
    },
    // clear entire for new voucher
    clearState: (
      state,
      action: PayloadAction<{
        userSession: UserModel;
        applicationSettings: ApplicationSettingsType;
        softwareDate: string;
        defaultCostCenterID: number;
        counterwiseCashLedgerId: number;
        allowSalesCounter: number;
        voucherNo: number | undefined;
        rowOnly?: boolean | false;
      }>
    ) => {
      const {
        userSession,
        applicationSettings,
        softwareDate,
        defaultCostCenterID,
        counterwiseCashLedgerId,
        allowSalesCounter,
        voucherNo,
        rowOnly = false,
      } = action.payload;
      state.row.ledgerCode = "";
      state.row.ledgerID = null;
      state.row.ledgerName = "";
      state.row.accTransactionDetailID = 0;
      state.row.chequeStatus = "P";
      state.row.currencyID = 0;
      state.row.costCentreName = "";
      state.row.chqDate = moment().local().toISOString();
      state.row.bankDate = moment().local().toISOString();
      state.row.narration = "";
      state.row.bankName = "";
      state.row.projectID = 0;
      state.row.projectName = "";
      state.row.costCentreName = "";
      state.row.amount = 0.0;
      state.row.discount = 0.0;
      state.row.hasDiscount = false;
      state.row.nameOnCheque = "";
      state.row.chequeNumber = "";

      state.row.bankCharge = 0;
      state.row.paymentType = "";
      // state.masterAccountID = 0;
      state.row.costCentreID = defaultCostCenterID;

      state.row.partyName = "";
      state.row.taxNo = "";
      state.row.taxAmount = 0;
      state.row.taxInvoiceNo = "";
      state.row.taxPerc = 0;
      state.row.taxableAmount = 0;
      state.row.invoiceDate = moment().local().toISOString();

      if ((state.userConfig?.presetCostenterId ?? 0) > 0) {
        state.row.costCentreID = state.userConfig?.presetCostenterId ?? 0;
      } else {
        if (userSession.dbIdValue == "SAMAPLASTICS2121212121212") {
          state.row.costCentreID = 0;
        } else {
          state.row.costCentreID =
            applicationSettings?.accountsSettings?.defaultCostCenterID ?? 0;
        }
      }
      state.formElements.btnAdd.label = "Add";
      state.isRowEdit = false;
      if (!rowOnly) {
        state.isBahamdoonPOSReceipt = false;
        (state.transaction.master.accTransactionMasterID = 0),
          (state.transaction.attachments = []);
        state.transaction.master.remarks = "";
        state.previousNarration = "";
        state.transaction.master.currencyRate = 1;
        state.transaction.master.referenceNumber = "";
        state.transaction.master.commonNarration = "";
        state.transaction.master.voucherNumber = voucherNo ?? 0;
        state.transaction.master.transactionDate = moment(
          softwareDate,
          "DD/MM/YYYY"
        )
          .local()
          .toISOString();

        state.transaction.details = [];
        state.isEdit = false;
        state.printOnSave = true;
        state.transaction.master.isLocked = false;
        state.transaction.master.totalAmount = 0;

        if (counterwiseCashLedgerId > 0 && allowSalesCounter) {
          if (
            state.transaction.master.voucherType == "CP" ||
            state.transaction.master.voucherType == "CR"
          ) {
            state.masterAccountID = counterwiseCashLedgerId;
          }
        }

        state.transaction.master.employeeID =
          userSession.employeeId > 0 ? userSession.employeeId : 0;

        state.formElements.ledgerID.reload = true;
        state.formElements.costCentreID.reload = true;
        state.formElements.amount.disabled = false;
        state.formElements.pnlMasters.disabled = false;
        state.formElements.employee.disabled = false;
        state.formElements.jvDrCr.disabled = false;
        state.formElements.masterAccount.disabled = false;
        state.formElements.referenceDate.disabled = false;
        state.formElements.referenceNumber.disabled = false;
        state.formElements.transactionDate.disabled = false;
        state.formElements.linkEdit.visible = false;

        state.formElements.masterAccount.disabled =
          (state.transaction.master.voucherType == VoucherType.CashPayment ||
            state.transaction.master.voucherType == VoucherType.CashReceipt) &&
          userSession?.counterwiseCashLedgerId > 0 &&
          applicationSettings.accountsSettings?.allowSalesCounter &&
          userSession?.counterAssignedCashLedgerId > 0
            ? userSession.countryId == Countries.India
              ? state.masterAccountActive == true
                ? false
                : true
              : true
            : false;

        if ((state.userConfig?.presetCostenterId ?? 0) > 0) {
          state.formElements.costCentreID.disabled = true;
          state.formElements.linkEdit.visible = false;
        }
        state.prev = modelToBase64Unicode(
          setTransactionForHistory({
            transaction: { ...state.transaction },
            row: { ...state.row },
          })
        );
      }
    },
    // Update a specific field in the form state
    accFormStateHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionFormState]?: any };
      }>
    ) => {
      console.log("accFormStateHandleFieldChange2");
      console.log(action.payload?.fields?.row);

      const { fields } = action.payload;
      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof AccTransactionFormState];
        const isDateField =
          (state[
            key as keyof AccTransactionFormState
          ] as typeof fieldValue) instanceof Date;
        // Convert Date fields to ISO strings
        (state[key as keyof AccTransactionFormState] as typeof fieldValue) =
          isDateField ? new Date(fieldValue).toISOString() : fieldValue;
      });
    },
    accFormStateHandleFieldChangeKeysOnly: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionFormState]?: any };
      }>
    ) => {
      try {
        // Validate action payload
        if (!action || typeof action !== "object") {
          console.error(
            "Invalid action provided to accFormStateHandleFieldChangeKeysOnly"
          );
          return;
        }

        if (!action.payload || typeof action.payload !== "object") {
          console.error("Invalid payload in action");
          return;
        }

        const { fields } = action.payload;

        // Validate fields
        if (!fields || typeof fields !== "object") {
          console.error("Invalid fields in payload");
          return;
        }

        // Validate state
        if (!state || typeof state !== "object") {
          console.error("Invalid state provided");
          return;
        }

        // Recursive function to handle nested objects with comprehensive error checking
        const updateNestedField = (
          target: any,
          source: any,
          path: string[] = []
        ): boolean => {
          try {
            // Validate inputs
            if (!target || typeof target !== "object") {
              console.error(`Invalid target at path: ${path.join(".")}`);
              return false;
            }

            if (!source || typeof source !== "object") {
              console.error(`Invalid source at path: ${path.join(".")}`);
              return false;
            }

            const sourceKeys = Object.keys(source);
            if (sourceKeys.length === 0) {
              console.warn(`Empty source object at path: ${path.join(".")}`);
              return true;
            }

            sourceKeys.forEach((key) => {
              try {
                // Validate key
                if (typeof key !== "string" || key.trim() === "") {
                  console.error(
                    `Invalid key "${key}" at path: ${path.join(".")}`
                  );
                  return;
                }

                const sourceValue = source[key];
                const currentPath = [...path, key];

                // Check for circular references
                if (sourceValue === source) {
                  console.error(
                    `Circular reference detected at path: ${currentPath.join(
                      "."
                    )}`
                  );
                  return;
                }

                // Handle null and undefined values
                if (sourceValue === null) {
                  target[key] = null;
                  return;
                }

                if (sourceValue === undefined) {
                  console.warn(
                    `Undefined value at path: ${currentPath.join(
                      "."
                    )}, skipping`
                  );
                  return;
                }

                // Check if sourceValue is a nested object (but not Date, Array, or other special objects)
                const isNestedObject =
                  sourceValue &&
                  typeof sourceValue === "object" &&
                  !Array.isArray(sourceValue) &&
                  !(sourceValue instanceof Date) &&
                  !(sourceValue instanceof RegExp) &&
                  !(sourceValue instanceof Error) &&
                  sourceValue.constructor === Object;

                if (isNestedObject) {
                  // Handle nested object
                  try {
                    // Ensure target has the nested property
                    if (!target[key] || typeof target[key] !== "object") {
                      target[key] = {};
                    }

                    // Recursively update nested fields
                    if (
                      !updateNestedField(target[key], sourceValue, currentPath)
                    ) {
                      console.error(
                        `Failed to update nested field at path: ${currentPath.join(
                          "."
                        )}`
                      );
                    }
                  } catch (nestedError) {
                    console.error(
                      `Error updating nested object at path ${currentPath.join(
                        "."
                      )}:`,
                      nestedError
                    );
                  }
                } else {
                  // Handle primitive values, arrays, dates, and other objects
                  try {
                    const currentValue = target[key];
                    const isCurrentValueDate = currentValue instanceof Date;

                    if (isCurrentValueDate) {
                      // Handle date conversion
                      if (sourceValue === null) {
                        target[key] = null;
                      } else if (sourceValue instanceof Date) {
                        target[key] = sourceValue.toISOString();
                      } else if (
                        typeof sourceValue === "string" ||
                        typeof sourceValue === "number"
                      ) {
                        try {
                          const dateValue = new Date(sourceValue);
                          if (isNaN(dateValue.getTime())) {
                            console.error(
                              `Invalid date value "${sourceValue}" at path: ${currentPath.join(
                                "."
                              )}`
                            );
                            target[key] = sourceValue; // Keep original value if date conversion fails
                          } else {
                            target[key] = dateValue.toISOString();
                          }
                        } catch (dateError) {
                          console.error(
                            `Date conversion error at path ${currentPath.join(
                              "."
                            )}:`,
                            dateError
                          );
                          target[key] = sourceValue; // Fallback to original value
                        }
                      } else {
                        console.warn(
                          `Non-date value "${sourceValue}" assigned to date field at path: ${currentPath.join(
                            "."
                          )}`
                        );
                        target[key] = sourceValue;
                      }
                    } else {
                      // Handle non-date values
                      if (Array.isArray(sourceValue)) {
                        // Deep clone arrays to prevent reference issues
                        try {
                          target[key] = JSON.parse(JSON.stringify(sourceValue));
                        } catch (cloneError) {
                          console.error(
                            `Error cloning array at path ${currentPath.join(
                              "."
                            )}:`,
                            cloneError
                          );
                          target[key] = [...sourceValue]; // Fallback to shallow copy
                        }
                      } else {
                        target[key] = sourceValue;
                      }
                    }
                  } catch (assignError) {
                    console.error(
                      `Error assigning value at path ${currentPath.join(".")}:`,
                      assignError
                    );
                  }
                }
              } catch (keyError) {
                console.error(
                  `Error processing key "${key}" at path ${path.join(".")}:`,
                  keyError
                );
              }
            });

            return true;
          } catch (updateError) {
            console.error(
              `Error in updateNestedField at path ${path.join(".")}:`,
              updateError
            );
            return false;
          }
        };

        // Process each top-level field with error handling
        const fieldKeys = Object.keys(
          fields
        ) as (keyof AccTransactionFormState)[];

        if (fieldKeys.length === 0) {
          console.warn("No fields to update");
          return;
        }

        fieldKeys.forEach((key) => {
          try {
            // Validate key
            if (!key || typeof key !== "string") {
              console.error(`Invalid field key: ${key}`);
              return;
            }

            const fieldValue = fields[key];

            // Handle null/undefined at top level
            if (fieldValue === null) {
              (state[key] as any) = null;
              return;
            }

            if (fieldValue === undefined) {
              console.warn(
                `Undefined value for field "${String(key)}", skipping`
              );
              return;
            }

            // Check for circular reference at top level
            if (fieldValue === fields) {
              console.error(
                `Circular reference detected for field "${String(key)}"`
              );
              return;
            }

            // Determine if this is a nested object
            const isNestedObject =
              fieldValue &&
              typeof fieldValue === "object" &&
              !Array.isArray(fieldValue) &&
              !(fieldValue instanceof Date) &&
              !(fieldValue instanceof RegExp) &&
              !(fieldValue instanceof Error) &&
              fieldValue.constructor === Object;

            if (isNestedObject) {
              // Handle nested object at top level
              try {
                // Ensure top-level object exists in state
                if (!state[key] || typeof state[key] !== "object") {
                  (state[key] as any) = {};
                }

                if (!updateNestedField(state[key], fieldValue, [String(key)])) {
                  console.error(
                    `Failed to update top-level nested field: ${String(key)}`
                  );
                }
              } catch (topLevelNestedError) {
                console.error(
                  `Error updating top-level nested field "${String(key)}":`,
                  topLevelNestedError
                );
              }
            } else {
              // Handle top-level primitive values, arrays, dates, etc.
              try {
                const currentValue = state[key];
                const isCurrentValueDate = currentValue instanceof Date;

                if (isCurrentValueDate) {
                  // Handle date conversion at top level
                  if (fieldValue instanceof Date) {
                    (state[key] as any) = fieldValue.toISOString();
                  } else if (
                    typeof fieldValue === "string" ||
                    typeof fieldValue === "number"
                  ) {
                    try {
                      const dateValue = new Date(fieldValue);
                      if (isNaN(dateValue.getTime())) {
                        console.error(
                          `Invalid date value "${fieldValue}" for field "${String(
                            key
                          )}"`
                        );
                        (state[key] as any) = fieldValue; // Keep original value
                      } else {
                        (state[key] as any) = dateValue.toISOString();
                      }
                    } catch (dateError) {
                      console.error(
                        `Date conversion error for field "${String(key)}":`,
                        dateError
                      );
                      (state[key] as any) = fieldValue; // Fallback
                    }
                  } else {
                    console.warn(
                      `Non-date value assigned to date field "${String(key)}"`
                    );
                    (state[key] as any) = fieldValue;
                  }
                } else {
                  // Handle non-date values at top level
                  if (Array.isArray(fieldValue)) {
                    // Deep clone arrays
                    try {
                      (state[key] as any) = JSON.parse(
                        JSON.stringify(fieldValue)
                      );
                    } catch (cloneError) {
                      console.error(
                        `Error cloning array for field "${String(key)}":`,
                        cloneError
                      );
                      (state[key] as any) = [...fieldValue]; // Fallback to shallow copy
                    }
                  } else {
                    (state[key] as any) = fieldValue;
                  }
                }
              } catch (topLevelAssignError) {
                console.error(
                  `Error assigning value to top-level field "${String(key)}":`,
                  topLevelAssignError
                );
              }
            }
          } catch (fieldError) {
            console.error(
              `Error processing field "${String(key)}":`,
              fieldError
            );
          }
        });
      } catch (mainError) {
        console.error(
          "Critical error in accFormStateHandleFieldChangeKeysOnly:",
          mainError
        );
      }
    },
    // Inside the createSlice, update the reducer
    acctemplatesData: (state, action: PayloadAction<TemplateState>) => {
      if (!state.templatesData) {
        state.templatesData = [];
      }

      // Only add the template if it doesn't already exist
      if (
        !state.templatesData.some(
          (template) => template.templateGroup === action.payload.templateGroup
        )
      ) {
        state.templatesData.push(action.payload);
      }
    },
    // Update a specific field in the transaction object
    accFormStateTransactionUpdate: (
      state,
      action: PayloadAction<{
        key: keyof AccTransactionData;
        value: AccTransactionData[keyof AccTransactionData];
      }>
    ) => {
      const { key, value } = action.payload;
      (state.transaction[key] as typeof value) = value;
    },

    // Update a specific field in the master object within the transaction
    // dispatch(accFormStateTransactionMasterHandleFieldChange({ fields: "voucherPrefix", value: "INV123" }));
    // dispatch(accFormStateTransactionMasterHandleFieldChange({ fields: { voucherPrefix: "INV123", referenceNumber: "REF456" } }));

    accFormStateTransactionMasterHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionMaster]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof AccTransactionMaster];
        const isDateField =
          (state.transaction.master[
            key as keyof AccTransactionMaster
          ] as typeof fieldValue) instanceof Date;
        if (isDateField) {
        }
        // Convert Date fields to ISO strings
        (state.transaction.master[
          key as keyof AccTransactionMaster
        ] as typeof fieldValue) = isDateField
          ? new Date(fieldValue).toISOString()
          : fieldValue;
      });
    },

    // Add multiple rows to the transaction details
    accFormStateTransactionDetailsSetSlNo: (
      state,
      action: PayloadAction<{}>
    ) => {
      if (state.transaction.details) {
        state.transaction.details = state.transaction.details.map(
          (x, index) => ({
            ...x,
            slNo: index + 1, // Reset slNo to start from 1
          })
        );
      }
    },
    // Add multiple rows to the transaction details
    accFormStateTransactionDetailsRowsAdd: (
      state,
      action: PayloadAction<AccTransactionRow[]>
    ) => {
      // const serializedRows = action.payload.map((row) => ({
      //   ...row,
      //   chqDate: new Date(row.chqDate).toISOString(),
      //   bankDate: new Date(row.bankDate).toISOString(),
      //   amount: state.f
      // }));
      // state.transaction.details.push(...serializedRows);
    },

    // Add single row to the transaction details
    accFormStateTransactionDetailsRowAdd: (
      state,
      action: PayloadAction<{
        row: AccTransactionRow;
        isForeignCurrencyEnabled: boolean;
        exchangeRate: number;
        applicationSettings: ApplicationSettingsType;
        userSession: UserModel;
      }>
    ) => {
      const data = action.payload.row;
      const amount =
        action.payload.isForeignCurrencyEnabled && data.amount
          ? data.amount * action.payload.exchangeRate
          : data.amount;
      const serializedRow: AccTransactionRow = {
        ...data,
        chqDate: data.chqDate ? new Date(data.chqDate).toISOString() : "",
        bankDate: data.bankDate ? new Date(data.bankDate).toISOString() : "",
        amount:
          state.isTaxOnExpense && (data.incentives ?? 0) > 0
            ? data.incentives
            : data.amount,
        amountFC: data.amount,
        drCr: state.row.drCr,
        debit: state.row.drCr == "Dr" ? state.row.amount : 0,
        credit: state.row.drCr == "Cr" ? state.row.amount : 0,
        // ledgerCode: state.ledgerData.ledgerCode,
      };
      if (state.isRowEdit === true) {
        const index = state.transaction.details.findIndex(
          (x) => x.slNo === data.slNo
        );
        if (index !== -1) {
          state.transaction.details[index] = serializedRow; // Update existing row
        } else {
          ERPToast.show(
            `Row with slNo ${data.slNo} not found. Cannot edit row.`
          );
        }
      } else {
        state.transaction.details.push(serializedRow);
      }
      state.transaction.details = state.transaction.details.map((x, index) => ({
        ...x,
        slNo: index + 1, // Reset slNo to start from 1
      }));

      state = clearEntryControl(
        state,
        action.payload.applicationSettings.accountsSettings?.defaultCostCenterID
      );

      localStorage.setItem(
        `${state.transaction.master.voucherType}${state.transaction.master.formType}`,
        JSON.stringify(state.transaction.details)
      );
      state.row.billwiseDetails = "";
    },

    // Update a specific row in the transaction details
    accFormStateTransactionDetailsRowUpdate: (
      state,
      action: PayloadAction<{
        index: number;
        key: keyof AccTransactionRow;
        value: AccTransactionRow[keyof AccTransactionRow];
      }>
    ) => {
      const { index, key, value } = action.payload;
      const row = state.transaction.details[index];
      if (row) {
        (row[key] as typeof value) = value;
      }
    },

    accFormStateClearBillWiseInDetails: (state) => {
      // Iterate over all rows in details
      state.transaction.details?.forEach((row) => {
        row.billwiseDetails = "";
      });
    },
    accFormStateClearDetails: (state) => {
      // Iterate over all rows in details
      state.transaction.details = [];
    },
    // Remove a specific row from the transaction details by index
    accFormStateTransactionDetailsRowRemove: (
      state,
      action: PayloadAction<{
        index: number;
        applicationSettings?: ApplicationSettingsType;
      }>
    ) => {
      const index = action.payload.index;
      if (index >= 0 && index < state.transaction.details.length) {
        state = clearEntryControl(
          state,
          action.payload.applicationSettings?.accountsSettings
            ?.defaultCostCenterID ?? 0
        );
        state.previousNarration = "";
        state.transaction.details.splice(index, 1);

        state.transaction.master.totalAmount = calculateTotal(state);
        state.transaction.details = state.transaction.details.map(
          (x, index) => ({
            ...x,
            slNo: index + 1, // Reset slNo to start from 1
          })
        );

        localStorage.setItem(
          `${state.transaction.master.voucherType}${state.transaction.master.formType}`,
          JSON.stringify(state.transaction.details)
        );
      }
    },

    // Remove a specific row from the transaction details by index
    accFormStateClearRowForNew: (state) => {
      state.row = { ...AccTransactionRowInitialData };
    },

    // Remove a specific row from the transaction details by index
    loadTempRows: (state) => {
      const tmp = localStorage.getItem(
        `${state.transaction.master.voucherType}${state.transaction.master.formType}`
      );
      if (tmp != undefined && tmp != null && tmp != "") {
        const tmpRows = JSON.parse(tmp) as Array<AccTransactionRow>;
        if (tmpRows.length > 0) {
          state.transaction.details = tmpRows;
        }
      }
    },

    // Handle changes for the "row" property in the state
    accFormStateRowHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof AccTransactionRow]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      // Use Object.entries to get key-value pairs
      Object.entries(fields).forEach(([key, fieldValue]) => {
        // Assert the key as keyof AccTransactionRow

        const isDateField =
          (state.row[
            key as keyof AccTransactionRow
          ] as typeof fieldValue) instanceof Date;

        // Update the corresponding field in the state
        (state.row[key as keyof AccTransactionRow] as typeof fieldValue) =
          isDateField ? new Date(fieldValue).toISOString() : fieldValue;
      });
    },

    // Clear the form state to initial values
    accFormStateReset: () => {
      return accTransactionFormStateInitialData;
    },

    updateFormElement: (
      state,
      action: PayloadAction<{
        fields: Partial<
          Record<
            keyof AccTransactionFormState["formElements"],
            Partial<FormElementState>
          >
        >;
      }>
    ) => {
      const { fields } = action.payload;

      // Iterate over the keys of fields and apply updates
      Object.entries(fields).forEach(([key, updates]) => {
        if (key in state.formElements) {
          state.formElements[
            key as keyof AccTransactionFormState["formElements"]
          ] = {
            ...state.formElements[
              key as keyof AccTransactionFormState["formElements"]
            ],
            ...updates,
          };
        } else {
          console.warn(`Field ${key} does not exist in formElements.`);
        }
      });
    },
    accFormStateTransactionAttachmentsRowAdd: (
      state,
      action: PayloadAction<{
        row: Attachments;
      }>
    ) => {
      const data = action.payload.row;
      state.transaction.attachments.push(data);
    },
    accFormStateTransactionAttachmentsRowUpdate: (
      state,
      action: PayloadAction<{
        row: Attachments;
      }>
    ) => {
      const data = action.payload.row;
      const index = state.transaction.attachments.findIndex(
        (x) => x.key === data.key
      );
      if (index !== -1) {
        state.transaction.attachments[index] = data;
      }
    },
    accFormStateTransactionAttachmentsRowRemove: (
      state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      const index = action.payload.index;
      if (index >= 0 && index < state.transaction.attachments.length) {
        state.transaction.attachments.splice(index, 1);
      }
    },
    enableControls: (state) => {
      state.formElements.pnlMasters.disabled = false;
      state.formElements.dxGrid.disabled = false;
    },
    disableControls: (state) => {
      state.formElements.pnlMasters.disabled = true;
      state.formElements.dxGrid.disabled = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAccVoucher.fulfilled, (state, action) => {
      // const applicationSettings =  useAppSelector((state: RootState) => state.ApplicationSettings);
      const payload = action.payload;

      if (payload) {
        state.row = { ...AccTransactionRowInitialData };
        // Handle master data
        state.transaction.master = {
          // ...state.transaction.master,
          ...payload.master,
          transactionDate: new Date(
            payload.master.transactionDate
          ).toISOString(),
          currencyRate: payload.master.currencyRate,
          prevTransDate: new Date(payload.master.transactionDate).toISOString(),
          referenceDate: new Date(payload.master.referenceDate).toISOString(),
        };

        if (payload.master.isLocked === true) {
          state.formElements.lnkUnlockVoucher.visible = true;
        }

        let BillwiseaccTransactionDetailID = 0;
        state.transaction.details = payload.details.map((detail, index) => {
          const baseDetail = {
            ...detail,
            slNo: index + 1,
            amountFC: detail.amount,
            bankDate: detail.bankDate
              ? new Date(detail.bankDate).toISOString()
              : moment.utc("2000-01-01").startOf("day").toISOString(),
            chqDate: detail.chqDate
              ? new Date(detail.chqDate).toISOString()
              : moment.utc("2000-01-01").startOf("day").toISOString(),
            checkBouncedDate: detail.checkBouncedDate
              ? new Date(detail.checkBouncedDate).toISOString()
              : moment.utc("2000-01-01").startOf("day").toISOString(),
          };

          // Handle voucher type specific logic
          switch (payload.master.voucherType) {
            case "CP":
            case "BP":
            case "CN":
            case "CQP":
            case "SV":
            case "PBP":
              return {
                ...baseDetail,
                ledgerCode: detail.ledgerCode,
                ledgerName: detail.ledgerName,
                ledgerID: detail.ledgerID,
              };

            case "CR":
            case "BR":
            case "DN":
            case "CQR":
            case "PV":
            case "PBR":
              BillwiseaccTransactionDetailID++;
              return {
                ...baseDetail,
                ledgerCode: detail.relatedLedgerCode,
                ledgerName: detail.particulars,
                ledgerID: detail.relatedLedgerID,
              };

            case "JV":
              BillwiseaccTransactionDetailID++;
              if (payload.master.drCr === "Dr") {
                return {
                  ...baseDetail,
                  ledgerCode: detail.relatedLedgerCode,
                  ledgerName: detail.particulars,
                  ledgerID: detail.relatedLedgerID,
                };
              } else {
                return {
                  ...baseDetail,
                  ledgerCode: detail.ledgerCode,
                  ledgerName: detail.ledgerName,
                  ledgerID: detail.ledgerID,
                };
              }

            case "OB":
            case "MJV":
              return {
                ...baseDetail,
                ledgerCode: detail.ledgerCode,
                ledgerName: detail.ledgerName,
                ledgerID: detail.ledgerID,
                drCr: Number(detail.debit) > 0 ? "Debit" : "Credit",
              };

            default:
              return baseDetail;
          }
        });

        // Handle attachments
        state.transaction.attachments = payload.attachments || [];

        // Calculate total amount
        if (payload.details?.length > 0) {
          state.total = payload.details.reduce((total, detail) => {
            const amount =
              payload.master.voucherType !== VoucherType.MultiJournal
                ? detail.amount
                : detail.debit;
            return total + (amount || 0);
          }, 0);

          // Set master account ID based on voucher type
          const firstDetail = payload.details[0];

          switch (payload.master.voucherType) {
            case "CP":
            case "BP":
            case "CN":
            case "CQP":
            case "SV":
            case "PBP":
              state.masterAccountID = firstDetail.relatedLedgerID;
              break;

            case "CR":
            case "BR":
            case "DN":
            case "CQR":
            case "PV":
            case "PBR":
              state.masterAccountID = firstDetail.ledgerID ?? 0;
              break;

            case "JV":
              state.transaction.master.drCr =
                payload.master.drCr === "Dr" ? "Debit" : "Credit";
              state.masterAccountID =
                payload.master.drCr === "Dr"
                  ? firstDetail.ledgerID ?? 0
                  : firstDetail.relatedLedgerID;
              break;
          }

          // Handle billwise transactions , Handled in Api
          // if (applicationSettings?.accountsSettings?.maintainBillwiseAccount) {
        }

        state.transactionLoading = false;
        state.formElements.pnlMasters.disabled = true;
        state.formElements.btnSave.disabled = true;
        state.transaction.master.totalAmount = calculateTotal(state);
      }
    });

    builder.addCase(loadAccVoucher.rejected, (state) => {
      state.transactionLoading = false;
      state.transaction = accTransactionInitialData;
    });

    builder.addCase(loadAccVoucher.pending, (state) => {
      state.transactionLoading = true;
    });

    builder.addCase(unlockAccTransactionMaster.fulfilled, (state, action) => {
      if (action.payload > 0) {
        state.transaction.master.isLocked = false;
        state.unlocking = false;
      }
    });

    builder.addCase(unlockAccTransactionMaster.rejected, (state) => {
      state.unlocking = false;
    });

    builder.addCase(unlockAccTransactionMaster.pending, (state) => {
      state.unlocking = true;
    });
  },
});

export const {
  accFormStateSet,
  acctemplatesData,
  accFormStateHandleFieldChange,
  accFormStateTransactionUpdate,
  accFormStateTransactionMasterHandleFieldChange,
  accFormStateTransactionDetailsRowAdd,
  accFormStateTransactionDetailsRowsAdd,
  accFormStateTransactionDetailsRowUpdate,
  accFormStateTransactionDetailsRowRemove,
  accFormStateRowHandleFieldChange,
  accFormStateReset,
  accFormStateClearRowForNew,
  clearState,
  enableControls,
  disableControls,
  updateFormElement,
  accFormStateTransactionDetailsSetSlNo,
  loadTempRows,
  accFormStateClearBillWiseInDetails,
  accFormStateClearDetails,
  accFormStateTransactionAttachmentsRowAdd,
  accFormStateTransactionAttachmentsRowUpdate,
  accFormStateTransactionAttachmentsRowRemove,
  accFormStateHandleFieldChangeKeysOnly,
} = accTransactionSlice.actions;
interface FormElementsState {
  formElements: {
    [key: string]: {
      [field: string]: any; // Allow flexible nested structure
    };
  };
}
export default accTransactionSlice.reducer;
