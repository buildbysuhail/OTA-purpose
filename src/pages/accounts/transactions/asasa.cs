// const summaryRes = await calculateSummary(details, formState, {
    //             result: {},
    //           });
    
    //           const totalRes = await calculateTotal(
    //             formState.transaction.master,
    //             summaryRes ? summaryRes.summary as SummaryItems : initialInventoryTotals,
    //             formState.formElements,
    //             {
    //               result: { pendingOrdListMasterIDs: masterIds, pendingOrdListBranchIDs: branchIDs, transaction: { master: { remarks: voucherNumbers } } },
    //             }
    //           );
    
    //           if (totalRes) {
    //             totalRes.summary = summaryRes.summary;
    //             totalRes.transaction = totalRes.transaction ?? {};
    //             totalRes.transaction.master = { ...totalRes.transaction.master, stockUpdate: (loadType == "GRN" || loadType == "GRR") ? false : true };
    //             totalRes.transaction.details = [];
    //             totalRes.batchesUnits = PendingTransDetails.batchesUnits;
    //             totalRes.loading = { isLoading: false, text: '' }
    
    //             // Dispatch the state update
    
    //             const lastIndex = formState.transaction.details.findLastIndex(x => x.productID > 0);
    //             dispatch(
    //               formStateHandleFieldChangeKeysOnly({
    //                 fields: totalRes,
    //                 updateOnlyGivenDetailsColumns: true,
    //                 rowIndex: lastIndex + 1,
    //                 itemsToAddToDetails: calculatedDetails
    //               })
    //             );
    //           }