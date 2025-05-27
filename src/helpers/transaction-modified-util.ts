import { modelToBase64Unicode } from "../utilities/jsonConverter";
import { isNullOrUndefinedOrZero } from "../utilities/Utils";


export const isDirtyTransaction = (
  prevState: any,
  currentState: any
): boolean => {
  // // const _prevState = customJsonParse(atob(prevState))
  // const keys = Object.keys(_prevState ?? {}).length;
  const _current = modelToBase64Unicode(setTransactionForHistory({
    transaction: { ...currentState.transaction },
    row: { ...currentState.row },
  }));
  const _isEqual = prevState === _current;
  return _isEqual === false && prevState !== undefined && prevState !== "";
};

export const setTransactionForHistory = (
  _formState: any
): any => {
  debugger;
  return {
    transaction: { ..._formState.transaction,
      master:{
        ..._formState.transaction.master,
        // employeeID: _formState.transaction.master.employeeID == null ? "" : _formState.transaction.master.employeeID,
        // currencyID: _formState.transaction.master.currencyID == null ? "" : _formState.transaction.master.currencyID,
      }
      ,
      details:  _formState.transaction.details.filter((x: any) => ((_formState.row != undefined && !isNullOrUndefinedOrZero(x.ledgerID))
    || (_formState.row == undefined && !isNullOrUndefinedOrZero(x.productID))))
     },
    row: { ..._formState.row,
      ledgerID: _formState.row?.ledgerID == null || _formState.row?.ledgerID == ""  || _formState.row?.ledgerID == 0 ? "" : _formState.row?.ledgerID,
      ledgerName: _formState.row?.ledgerName == null || _formState.row?.ledgerName == ""   ? "" : _formState.row?.ledgerName,
      costCentreName: _formState.row?.costCentreName == null || _formState.row?.costCentreName == ""   ? "" : _formState.row?.costCentreName,
      //  costCentreID: _formState.row.costCentreID == null ? "" : _formState.row.costCentreID,
      //  projectSiteId: _formState.row.projectSiteId == null ? "" : _formState.row.projectSiteId,
       projectID:  _formState.row?.projectID == undefined || _formState.row?.projectID == null || _formState.row?.projectID == "" || _formState.row?.projectID == 0 ? 0 : _formState.row?.projectID },
  }
};
