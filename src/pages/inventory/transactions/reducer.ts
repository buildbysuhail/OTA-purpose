import { createSlice, DeepPartial, PayloadAction } from "@reduxjs/toolkit";
import {
  TransactionFormState,
  TransactionData,
  TransactionDetail,
  TransactionMaster,
  FormElementState,
  Attachments,
  TransactionMaster3,
  LoadData,
  TransactionValidationsData,
  InvAccTransaction,
  PartialTransactionFormFields,
  UnitByBatchDetailsDto,
  ColumnModel,
  SettlementDetails,
  CouponDetails,
} from "./transaction-types";
import ERPToast from "../../../components/ERPComponents/erp-toast";
import { UserAction } from "../../../helpers/user-right-helper";
import { UserModel } from "../../../redux/slices/user-session/reducer";
import { TemplateState } from "../../InvoiceDesigner/Designer/interfaces";
import { ApplicationSettingsType } from "../../settings/system/application-settings-types/application-settings-types";
import {
  initialTransactionDetailData,
  TransactionFormStateInitialData,
  transactionInitialData,
} from "./transaction-type-data";
import { generateUniqueKey } from "../../../utilities/Utils";
import moment from "moment";
import { modelToBase64Unicode } from "../../../utilities/jsonConverter";
import { setTransactionForHistory } from "../../../helpers/transaction-modified-util";
import _ from "lodash";

const InvTransactionSlice = createSlice({
  name: "invTransaction",
  initialState: TransactionFormStateInitialData,
  reducers: {
    // Set entire form state
    formStateSet: (state, action: PayloadAction<TransactionFormState>) => {
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

      state.formElements.btnAdd.label = "Add";
      state.isRowEdit = false;
      if (!rowOnly) {
        (state.transaction.master.invTransactionMasterID = 0),
          (state.transaction.attachments = []);
        state.transaction.master.remarks = "";
        state.transaction.master.exchangeRate = 1;
        state.transaction.master.purchaseInvoiceNumber = "";
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
        state.transaction.master.grandTotal = 0;
        state.transaction.master.grandTotalFc = 0;

        state.transaction.master.employeeID =
          userSession.employeeId > 0 ? userSession.employeeId : 0;

        state.formElements.ledgerID.reload = true;
        state.formElements.cbCostCentre.reload = true;
        state.formElements.amount.disabled = false;
        state.formElements.pnlMasters.disabled = false;
        state.formElements.employee.disabled = false;
        state.formElements.jvDrCr.disabled = false;
        state.formElements.masterAccount.disabled = false;
        state.formElements.referenceDate.disabled = false;
        state.formElements.referenceNumber.disabled = false;
        state.formElements.transactionDate.disabled = false;
        state.formElements.linkEdit.visible = false;

        if ((state.userConfig?.presetCostenterId ?? 0) > 0) {
          state.formElements.cbCostCentre.disabled = true;
          state.formElements.linkEdit.visible = false;
        }
        state.prev = modelToBase64Unicode(
          setTransactionForHistory(
            {
              transaction: {
                master: state.transaction.master,
                details: state.transaction.details.filter(
                  (x: any) => x.productID > 0
                ),
              },
            },
            "inv"
          )
        );
      }
    },

    // Update a specific field in the form state
    formStateHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: PartialTransactionFormFields;
      }>
    ) => {
      const { fields } = action.payload;
      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof TransactionFormState];
    //     if (key === "userConfig" && typeof fieldValue === "object" && fieldValue !== null) {
    //   state.userConfig = {
    //     ...state.userConfig,
    //     ...fieldValue,
    //   };
    // } else {
        const isDateField =
          (state[
            key as keyof TransactionFormState
          ] as typeof fieldValue) instanceof Date;
        // Convert Date fields to ISO strings
        (state[key as keyof TransactionFormState] as typeof fieldValue) =
          isDateField ? new Date(fieldValue).toISOString() : fieldValue;
    // }
  });
    },

    // Inside the createSlice, update the reducer
    templatesData: (state, action: PayloadAction<TemplateState<unknown>>) => {
      // if (!state.templatesData) {
      //   state.templatesData = [];
      // }

      // // Only add the template if it doesn't already exist
      // if (
      //   !state.templatesData.some(
      //     (template) => template.templateGroup === action.payload.templateGroup
      //   )
      // ) {
      //   state.templatesData.push(action.payload);
      // }
    },
    themeChangeCountdownTick: (
      state, action: PayloadAction<number>
    ) => {
      state.themeChangeCountdown = state.themeChangeCountdown??0-1;
    },
    // Update a specific field in the transaction object
    formStateTransactionUpdate: (
      state,
      action: PayloadAction<{
        key: keyof TransactionData;
        value: TransactionData[keyof TransactionData];
      }>
    ) => {
      const { key, value } = action.payload;
      (state.transaction[key] as typeof value) = value;
    },
    // formStateLoadDataUpdate: (
    //   state,
    //   action: PayloadAction<{
    //     key: keyof LoadData;
    //     value: TransactionData[keyof TransactionData];
    //   }>
    // ) => {
    //   const { key, value } = action.payload;
    //   (state.loadData[key] as typeof value) = value;
    // },
    formStateLoadDataUpdate: (
      state,
      action: PayloadAction<{
        key: keyof LoadData;
        value:
          | any[]
          | TransactionMaster
          | TransactionValidationsData
          | TransactionDetail[]
          | string
          | undefined;
      }>
    ) => {
      const { key, value } = action.payload;
      if (typeof value === "string" || value === undefined) {
        state.loadData[key] = value;
      } else {
        console.warn(`Invalid value type for key ${key}:`, value);
      }
    },

    // Update a specific field in the master object within the transaction
    // dispatch(formStateTransactionMasterHandleFieldChange({ fields: "voucherPrefix", value: "INV123" }));
    // dispatch(formStateTransactionMasterHandleFieldChange({ fields: { voucherPrefix: "INV123", referenceNumber: "REF456" } }));

    formStateTransactionMasterHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof TransactionMaster]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof TransactionMaster];
        const isDateField =
          (state.transaction.master[
            key as keyof TransactionMaster
          ] as typeof fieldValue) instanceof Date;
        if (isDateField) {
        }
        // Convert Date fields to ISO strings
        (state.transaction.master[
          key as keyof TransactionMaster
        ] as typeof fieldValue) = isDateField
          ? new Date(fieldValue).toISOString()
          : fieldValue;
      });
    },
    formStateTransactionMaster3HandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof TransactionMaster3]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      // Check if 'fields' is an object (multiple fields)
      Object.keys(fields).forEach((key) => {
        // Update the corresponding field in the state
        const fieldValue = fields[key as keyof TransactionMaster3];
        const isDateField =
          (state.transaction.master.master3[
            key as keyof TransactionMaster3
          ] as typeof fieldValue) instanceof Date;
        if (isDateField) {
        }
        // Convert Date fields to ISO strings
        (state.transaction.master.master3[
          key as keyof TransactionMaster3
        ] as typeof fieldValue) = isDateField
          ? new Date(fieldValue).toISOString()
          : fieldValue;
      });
    },
    // Add multiple rows to the transaction details
    formStateTransactionDetailsSetSlNo: (state, action: PayloadAction<{}>) => {
      if (state.transaction.details) {
        state.transaction.details = state.transaction.details.map(
          (x, index) => ({
            ...x,
            slNo: generateUniqueKey(), // Reset slNo to start from 1
          })
        );
      }
    },
    // Add multiple rows to the transaction details
    formStateTransactionDetailsRowsAdd: (
      state,
      action: PayloadAction<TransactionDetail[]>
    ) => {
      action.payload.forEach((row: TransactionDetail) => {
        state.transaction.details.push(row);  
      })
      
    },
    // UPi Add row
    formStateTransactionUpiAddRowsAddSingle: (
        state,
        action: PayloadAction<SettlementDetails>
      ) => {
        state.transaction.uPIDetails.push(action.payload);
    },
    // Upi Remove row
    formStateTransactionUpiRemoveRow: (
      state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      const index = action.payload.index;
      if (index >= 0 && index < state.transaction.uPIDetails.length) {
        state.transaction.uPIDetails.splice(index, 1);
      }
    },
    // bank card Add row
    formStateTransactionBankCardAddRowsAddSingle: (
        state,
        action: PayloadAction<SettlementDetails>
      ) => {
        state.transaction.bankCardDetails.push(action.payload);
    },
    // Upi Remove row
    formStateTransactionBankCardRemoveRow: (
      state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      const index = action.payload.index;
      if (index >= 0 && index < state.transaction.bankCardDetails.length) {
        state.transaction.bankCardDetails.splice(index, 1);
      }
    },
    // Coupon Add row
    formStateTransactionCouponAddRowsAddSingle: (
        state,
        action: PayloadAction<CouponDetails>
      ) => {
        state.transaction.couponDetails.push(action.payload);
        
      },
    // Coupon delete row
    formStateTransactionCouponRemoveRow: (
      state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      const index = action.payload.index;
      if (index >= 0 && index < state.transaction.couponDetails.length) {
        state.transaction.couponDetails.splice(index, 1);
      }
    },
    // Add multiple rows to the transaction details
    formStateTransactionDetailsRowsEmptyAdd: (
      state,
      action: PayloadAction<TransactionDetail[]>
    ) => {
      state.transaction.details = []
      action.payload.forEach((row: TransactionDetail) => {
        state.transaction.details.push(row);  
      })
      
    },

    formStateTransactionIvAccTransactionsRowsUpdate: (
      state,
      action: PayloadAction<InvAccTransaction[]>
    ) => {
      state.transaction.invAccTransactions = action.payload;
    },
    formStateTransactionDetailsRowAdd: (
      state,
      action: PayloadAction<any>
    ) => {
      const data = initialTransactionDetailData;
      const serializedRow: TransactionDetail = {
        ...data,...action.payload
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
        state.transaction.details.push({
        ...serializedRow,
        slNo: generateUniqueKey(), // Reset slNo to start from 1
      });
      }


    },
 formStateClearAttachments: (state) => {
      // Iterate over all rows in details
      state.transaction.attachments = [];
    },
    // formStateClearDetails: (state) => {
    //   // Iterate over all rows in details
    //   state.transaction.details = transactionInitialData.details;
    // },
     formStateClearDetails: (state, action) => {
      debugger;
      const isMobile = action.payload;
      console.log("isMobileisMobile:",
        isMobile
      );      
      // Iterate over all rows in details  
      state.transaction.details = !isMobile? Array.from({ length: 30 }, (_, index) => ({
                  ...initialTransactionDetailData,
                  slNo: generateUniqueKey()
                })) : []
    },
    formStateDeleteDetails: (state,action: PayloadAction<{slNo: string}>) => {
      // Iterate over all rows in details
      state.transaction.details = state.transaction.details.filter(x => x.slNo != action.payload.slNo);
    },
    formStateSetDetails: (
      state,
      action: PayloadAction<TransactionDetail[]>
    ) => {
      // Iterate over all rows in details
      state.transaction.details = action.payload;
    },
    // Remove a specific row from the transaction details by index
    formStateTransactionDetailsRowRemove: (
      state,
      action: PayloadAction<{
        slNo: string;
        applicationSettings?: ApplicationSettingsType;
        clearEntryControl: (
          state: TransactionFormState,
          defaultCostCenterID: number
        ) => TransactionFormState;
      }>
    ) => {
      const slNo = action.payload.slNo;
      if (slNo != "" ) {
        state = action.payload.clearEntryControl(
          state,
          action.payload.applicationSettings?.accountsSettings
            ?.defaultCostCenterID ?? 0
        );
        const index = state.transaction.details.findIndex(x => x.slNo == slNo);
        state.transaction.details.splice(index, 1);

        state.transaction.details = state.transaction.details.map(
          (x, index) => ({
            ...x,
            slNo: generateUniqueKey(), // Reset slNo to start from 1
          })
        );

       
      }
    },

    // Remove a specific row from the transaction details by index
    formStateClearRowForNew: (
      state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      const { index } = action.payload;
      state.transaction.details[index] = initialTransactionDetailData;
    },


    // Handle changes for the "row" property in the state
    formStateMasterHandleFieldChange: (
      state,
      action: PayloadAction<{
        fields: { [fieldId in keyof TransactionMaster]?: any };
      }>
    ) => {
      const { fields } = action.payload;

      (Object.keys(fields) as (keyof TransactionMaster)[]).forEach((key) => {
        const fieldValue = fields[key];
        const isDateField =
          (state.transaction.master[
            key as keyof TransactionMaster
          ] as typeof fieldValue) instanceof Date;
        // Explicit assertion to satisfy TypeScript
        (state.transaction.master[key] as TransactionMaster[typeof key]) =
          isDateField
            ? new Date(fieldValue).toISOString()
            : (fieldValue as TransactionMaster[typeof key]);
      });
    },

    // Handle changes for the "row" property in the state
    // formStateMaster3HandleFieldChange: (
    //   state,
    //   action: PayloadAction<{
    //     fields: { [fieldId in keyof TransactionMaster3]?: any };
    //   }>
    // ) => {
    //   const { fields } = action.payload;

    //   (Object.keys(fields) as (keyof TransactionMaster3)[]).forEach((key) => {
    //     const fieldValue = fields[key];
    // const isDateField =
    //           // (state.transaction.master.other[
    //           (state.transaction.master3[
    //             key as keyof TransactionMaster3
    //           ] as typeof fieldValue) instanceof Date;
    //     // Explicit assertion to satisfy TypeScript
    //     (state.transaction.master3[key] as TransactionMaster3[typeof key]) =
    //     isDateField ? new Date(fieldValue).toISOString() :fieldValue as TransactionMaster3[typeof key];
    //   });
    // },

    // Clear the form state to initial values
    formStateReset: () => {
      return TransactionFormStateInitialData;
    },
    setUserRight: (
      state,
      action: PayloadAction<{
        userSession: UserModel;
        hasRight: (formCode: string, action: UserAction) => boolean;
        setUserRightsFn: (
          state: TransactionFormState,
          userSession: UserModel,
          hasRight: (formCode: string, action: UserAction) => boolean
        ) => TransactionFormState;
      }>
    ) => {
      const { userSession, hasRight } = action.payload;
      state = action.payload.setUserRightsFn(state, userSession, hasRight);
    },
    updateFormElement: (
      state,
      action: PayloadAction<{
        fields: Partial<
          Record<
            keyof TransactionFormState["formElements"],
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
            key as keyof TransactionFormState["formElements"]
          ] = {
            ...state.formElements[
              key as keyof TransactionFormState["formElements"]
            ],
            ...updates,
          };
        } else {
          console.warn(`Field ${key} does not exist in formElements.`);
        }
      });
    },
    formStateTransactionAttachmentsRowAdd: (
      state,
      action: PayloadAction<{
        row: Attachments;
      }>
    ) => {
      const data = action.payload.row;
      state.transaction.attachments.push(data);
    },
    formStateTransactionAttachmentsRowUpdate: (
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
    formStateTransactionAttachmentsRowRemove: (
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
    disableControls: (
      state,
      action: PayloadAction<{
        disableControlsFn: (
          state: TransactionFormState
        ) => TransactionFormState;
      }>
    ) => {
      state = action.payload.disableControlsFn(state);
    },
    reOrderGridCols: (
      state,
      action: PayloadAction<{ column: string, toBefore: string}>
    ) => {
      const { column, toBefore } = action.payload;

      // Find the index of the column to move
      const fromIndex = state.gridColumns.findIndex(x => x.dataField === column);

      // Find the index of the target position (before which to insert)
      const toIndex = state.gridColumns.findIndex(x => x.dataField === toBefore);

      // Check if both columns exist
      if (fromIndex === -1 || toIndex === -1) {
        return; // Column not found, no changes
      }

      // Remove the column from its current position
      const columnToMove = state.gridColumns[fromIndex];
      state.gridColumns.splice(fromIndex, 1);

      // Calculate the new insertion index
      // If we removed an item before the target, adjust the index
      const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;

      // Insert the column at the new position
      state.gridColumns.splice(adjustedToIndex, 0, columnToMove);
    },
    formStateHandleFieldChangeKeysOnly: (
      state: TransactionFormState,
      action: PayloadAction<{
        fields: { [fieldId in keyof DeepPartial<TransactionFormState>]?: any };
        updateOnlyGivenDetailsColumns?: boolean;
        rowIndex?: number;
        itemsToAddToDetails?: TransactionDetail[];
      }>
    ) => {

      const {
        fields,
        updateOnlyGivenDetailsColumns = false,
        itemsToAddToDetails = undefined,
        rowIndex = -1,
      } = action.payload || {};

      if (!fields || typeof fields !== "object") {
        console.error("Invalid fields in payload");
        return;
      }

      // Helper function to update nested objects
      const updateNested = (
        target: Record<string, any>,
        source: Record<string, any>
      ): void => {
        Object.keys(source).forEach((key: string) => {
          const value = source[key];

          if (value === null || value === undefined) {
            target[key] = value;
            return;
          }

          // Check if it's a plain object (not Array, Date, etc.)
          const isPlainObject = value?.constructor === Object;

          if (isPlainObject) {
            if (!target[key] || typeof target[key] !== "object") {
              target[key] = {};
            }
            updateNested(
              target[key] as Record<string, any>,
              value as Record<string, any>
            );
          } else {
            // Handle arrays, primitives, dates, etc.
            if (Array.isArray(value)) {
              target[key] = [...value];
            } else if (value instanceof Date) {
              target[key] = value.toISOString();
            } else {
              target[key] = value;
            }
          }
        });
      };

      // Update each field
      Object.keys(fields).forEach((key: string) => {
        const fieldValue = fields[key as keyof TransactionFormState];

        // Special handling for transaction.details array
        if (
          key === "gridColumns" &&
          fieldValue
        ) {
          let ddf = typeof fieldValue
          const gridColumns = fieldValue as ColumnModel[];
          gridColumns.forEach(
              (detailItem: ColumnModel, index: number) => {
                const toIndex = (state as any).gridColumns.findIndex(
                  (x: ColumnModel) => x.dataField == detailItem.dataField
                );
                if (updateOnlyGivenDetailsColumns === true) {
                  // Update only specific columns in the row
                  if (!state.gridColumns[toIndex]) {
                    state.gridColumns[toIndex] =
                      {} as ColumnModel;
                  }

                  // Batch assign instead of individual property updates
                  Object.assign(state.gridColumns[toIndex], detailItem);
                } else {
                  // Replace the entire row
                  (state as any).gridColumns[toIndex] = {
                    ...detailItem,
                  };
                }
              }
            );

        } else
        if (
          key === "transaction" &&
          fieldValue &&
          typeof fieldValue === "object"
        ) {
          const transactionValue = fieldValue as TransactionData;

          if (
            transactionValue.details &&
            Array.isArray(transactionValue.details)
          ) {
            // Ensure state.transaction exists
            if (!state.transaction || typeof state.transaction !== "object") {
              (state as any).transaction = {};
            }

            // Ensure state.transaction.details exists
            if (!Array.isArray((state as any).transaction.details)) {
              (state as any).transaction.details = [];
            }

            transactionValue.details.forEach(
              (detailItem: TransactionDetail, index: number) => {
                const toIndex = (state as any).transaction.details.findIndex(
                  (x: TransactionDetail) => x.slNo == detailItem.slNo
                );
                if (updateOnlyGivenDetailsColumns === true) {
                  // Update only specific columns in the row
                  if (!state.transaction.details[toIndex]) {
                    state.transaction.details[toIndex] =
                      {} as TransactionDetail;
                  }

                  // Batch assign instead of individual property updates
                  _.merge(state.transaction.details[toIndex], detailItem);
                } else {
                  // Replace the entire row
                  (state as any).transaction.details[toIndex] = {
                    ...detailItem,
                  };
                }
              }
            );
          }

          // Handle other transaction fields (non-details)
          Object.keys(transactionValue).forEach((transactionKey: string) => {
            if (transactionKey !== "details") {
              const _fieldValue =
                fields[key as keyof TransactionFormState][transactionKey];
              if (_fieldValue?.constructor === Object) {
                // Nested object
                if (
                  !(state as any)[key] ||
                  typeof (state as any)[key] !== "object"
                ) {
                  (state as any)[key] = {};
                }
                updateNested(
                  (state as any)[key][transactionKey] as Record<string, any>,
                  _fieldValue as Record<string, any>
                );
              } else {
                // Primitive, array, or other object type
                if (Array.isArray(_fieldValue)) {
                  (state as any)[key] = [..._fieldValue];
                } else if (_fieldValue instanceof Date) {
                  (state as any)[key] = _fieldValue.toISOString();
                } else {
                  (state as any)[key] = _fieldValue;
                }
              }
            }
          });

        }

        else {
          if (fieldValue === null || fieldValue === undefined) {
          (state as any)[key] = fieldValue;
        } else if (fieldValue?.constructor === Object) {
          // Nested object
          if (!(state as any)[key] || typeof (state as any)[key] !== "object") {
            (state as any)[key] = {};
          }
          updateNested(
            (state as any)[key] as Record<string, any>,
            fieldValue as Record<string, any>
          );
        } else {

          // Primitive, array, or other object type
          if (Array.isArray(fieldValue)) {
            if (key == "batchesUnits") {
              if (fieldValue) {
                if(!state.batchesUnits) {
                  state.batchesUnits = []
                }
                const units = fieldValue as UnitByBatchDetailsDto[];

                const newUnits = units.filter(
                  (unit) =>
                    !state.batchesUnits?.some(
                      (existing) =>
                        existing.value === unit.value &&
                        existing.productBatchID === unit.productBatchID
                    )
                );

                state.batchesUnits?.push(...newUnits);
              }
            } else {
              (state as any)[key] = [...fieldValue];
            }
          } else if (fieldValue instanceof Date) {
            (state as any)[key] = fieldValue.toISOString();
          } else {
            (state as any)[key] = fieldValue;
          }
        }
        }
      });

      if (
        itemsToAddToDetails &&
        itemsToAddToDetails.length > 0 &&
        rowIndex >= 0
      ) {
        state.transaction.details.splice(rowIndex, 0, ...itemsToAddToDetails);
      }
    },
    resetState: () => TransactionFormStateInitialData,
  },
});
export const {
  formStateSet,
  templatesData,
  formStateHandleFieldChange,
  formStateHandleFieldChangeKeysOnly,
  formStateTransactionUpdate,
  formStateTransactionMasterHandleFieldChange,
  formStateTransactionDetailsRowAdd,
  formStateTransactionDetailsRowsAdd,
  formStateTransactionDetailsRowsEmptyAdd,
  formStateTransactionIvAccTransactionsRowsUpdate,
  formStateTransactionDetailsRowRemove,
  formStateReset,
  formStateClearRowForNew,
  clearState,
  enableControls,
  setUserRight,
  disableControls,
  updateFormElement,
  formStateTransactionDetailsSetSlNo,
  // loadTempRows,
  formStateClearDetails,
  formStateTransactionAttachmentsRowAdd,
  formStateTransactionAttachmentsRowUpdate,
  formStateTransactionAttachmentsRowRemove,
  formStateMasterHandleFieldChange,
  formStateTransactionMaster3HandleFieldChange,
  formStateLoadDataUpdate,
  formStateSetDetails,
  formStateClearAttachments,
  reOrderGridCols,
  formStateDeleteDetails,
  resetState,
  themeChangeCountdownTick,
  formStateTransactionUpiAddRowsAddSingle,
  formStateTransactionUpiRemoveRow,
  formStateTransactionCouponAddRowsAddSingle,
  formStateTransactionCouponRemoveRow,
  formStateTransactionBankCardAddRowsAddSingle,
  formStateTransactionBankCardRemoveRow,
} = InvTransactionSlice.actions;
interface FormElementsState {
  formElements: {
    [key: string]: {
      [field: string]: any; // Allow flexible nested structure
    };
  };
}
export default InvTransactionSlice.reducer;
