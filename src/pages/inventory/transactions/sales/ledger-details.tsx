import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { RootState } from "../../../../redux/store";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { formStateMasterHandleFieldChange } from "../reducer";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import PartiesManage from "../../../accounts/masters/parties/parties-manage";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { toggleParties } from "../../../../redux/slices/popup-reducer";
import { useRootState } from "../../../../utilities/hooks/useRootState";

interface LedgerDetailsProps {
  closeModal: () => void;
  t: any;
}

const LedgerDetails: React.FC<LedgerDetailsProps> = ({ closeModal, t }) => {
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const [salesRoute, setSalesRoute] = useState(false);
  const [mainSalesRoute, setMainSalesRoute] = useState<any>();
  const [ledgerInitialized, setLedgerInitialized] = useState(false);
  const [gridReload, setGridReload] = useState<boolean>(true);

  const newPartyAddedRef = useRef<boolean>(false);
  const selectedLedgerIDRef = useRef<any>(null);
  const ledgerInitializedRef = useRef<any>(null);
  const gridRef = useRef<any>(null);
  const wasPartiesModalOpenRef = useRef(false);
  const rootState = useRootState();
  const MemoizedPartiesManage = useMemo(() => React.memo(PartiesManage), []);
  const dispatch = useDispatch();

  // ─── When PartiesManage saves successfully ────────────────────────────────
  useEffect(() => {
    if (rootState.PopupData.parties.reload === true) {
      
      newPartyAddedRef.current = false;  
      ledgerInitializedRef.current = false; 
      const gridInstance = gridRef.current?.instance?.();
      if (gridInstance) {
      gridInstance.beginUpdate();
      gridInstance.clearSorting();
      gridInstance.columnOption("ledgerID", "sortOrder", "desc");
      gridInstance.columnOption("ledgerID", "sortIndex", 0);
      gridInstance.endUpdate();
      }

      newPartyAddedRef.current = true; // tells onContentReady to select row 0
      setLedgerInitialized(false);
      setGridReload(true);
    }
  }, [rootState.PopupData.parties.reload]);

  // ─── Grid columns ─────────────────────────────────────────────────────────
  const gridColumns: DevGridColumn[] = [
    {
      dataField: "ledgerID",
      caption: t("ledger_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      visible: false,
    },
    {
      dataField: "partyCode",
      caption: t("party_code"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
    },
    {
      dataField: "partyName",
      caption: t("party_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "displayName",
      caption: t("display_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 250,
    },
    {
      dataField: "address1",
      caption: t("address1"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "address2",
      caption: t("address2"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "address3",
      caption: t("address3"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "mobilePhone",
      caption: t("mobile_phone"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "routeName",
      caption: t("route_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "taxNumber",
      caption: t("tax_number"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
    {
      dataField: "partyID",
      caption: t("party_id"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
      visible: false,
    },
  ];

  // ─── Selects, focuses AND stores the key of row 0 ────────────────────────
  const selectFirstRow = useCallback((gridInstance: any) => {
    const visibleRows = gridInstance.getVisibleRows();
    console.log("[selectFirstRow] visibleRows count:", visibleRows.length);
    if (visibleRows.length === 0) return;

    const firstKey = visibleRows[0].key;
    selectedLedgerIDRef.current = firstKey;
    console.log("[selectFirstRow] firstKey:", firstKey, "| ref set to:", selectedLedgerIDRef.current);

    // Use beginUpdate/endUpdate to batch all option changes
    // so they don't each trigger onContentReady separately
    gridInstance.beginUpdate();
    gridInstance.option("focusedRowIndex", 0);
    gridInstance.option("focusedRowKey", firstKey);
    gridInstance.selectRows([firstKey], false);
    gridInstance.endUpdate();

    // Focus the grid row — use getRowElement so it looks like row selection, not cell selection
    setTimeout(() => {
      try {
        const rowElement = gridInstance.getRowElement(0);
        console.log("[selectFirstRow] rowElement found:", !!rowElement);
        if (rowElement && rowElement[0]) {
          gridInstance.focus(rowElement[0]);
          console.log("[selectFirstRow] after gridInstance.focus(row) -> activeElement:", document.activeElement?.tagName, document.activeElement?.className);
        }
      } catch (_) { }
    }, 150);
  }, []);

  // ─── Refocus grid when parties modal closes ────────────────────────────────
  useEffect(() => {
    const isOpen = rootState.PopupData.parties.isOpen || false;
    console.log("[modalClose effect] isOpen:", isOpen, "| wasOpen:", wasPartiesModalOpenRef.current);
    if (wasPartiesModalOpenRef.current && !isOpen) {
      console.log("[modalClose effect] modal just closed → calling selectFirstRow in 200ms");
      setTimeout(() => {
        const gridInstance = gridRef.current?.instance?.();
        console.log("[modalClose effect] gridInstance found:", !!gridInstance);
        if (gridInstance) {
          selectFirstRow(gridInstance);
        }
      }, 200);
    }
    wasPartiesModalOpenRef.current = isOpen;
  }, [rootState.PopupData.parties.isOpen, selectFirstRow]);

  // ─── onContentReady: runs after every data load ───────────────────────────
  const handleLedgerContentReady = useCallback(
    (e: any) => {
      const gridInstance = e.component;
      const visibleRows = gridInstance.getVisibleRows();
      console.log("[onContentReady] visibleRows:", visibleRows.length, "| initialized:", ledgerInitializedRef.current, "| newPartyAdded:", newPartyAddedRef.current);
      if (visibleRows.length === 0) return;

      // Case 1: new party just added → consume the flag and select row 0
      if (newPartyAddedRef.current) {
        newPartyAddedRef.current = false;
        ledgerInitializedRef.current = true;
        setLedgerInitialized(true);
        selectFirstRow(gridInstance);
        return;
      }

      // Case 2: initial open → use REF (not state) to avoid stale closure
      if (!ledgerInitializedRef.current) {
        ledgerInitializedRef.current = true;
        setLedgerInitialized(true);
        selectFirstRow(gridInstance);
      }
    },
    [selectFirstRow] // selectFirstRow is stable (no deps), so this is stable too
  );

  // ─── Row click: keep selectedLedgerIDRef in sync ─────────────────────────
  const handleRowClick = useCallback((e: any) => {
    const grid = e.component;
    const key = e.key;

    // Always keep the ref up to date with whatever row is clicked
    selectedLedgerIDRef.current = key;

    grid.selectRows([key], false);
    grid.option("focusedRowKey", key);
    grid.option("focusedRowIndex", e.rowIndex ?? 0);
    grid.focus();
  }, []);

  // ─── KeyDown: reads from ref, never stale ────────────────────────────────
  // Using a ref-based handler means we never need to add ledgerID to deps,
  // which would cause the handler to be recreated and re-attached constantly.
  const handleKeyDown = useCallback((e: any) => {
    const pressedKey = e.event?.key;
    if (pressedKey !== "Enter") return;

    const grid = e.component;

    // Read from our ref first (most reliable), fall back to DX option
    const ledgerID =
      selectedLedgerIDRef.current ?? grid.option("focusedRowKey");

    if (!ledgerID) return;

    dispatch(
      formStateMasterHandleFieldChange({
        fields: { ledgerID },
      })
    );
    closeModal();
  }, [dispatch, closeModal]); // ← these are stable refs, no stale closure risk

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 items-end">
          <ERPCheckbox
            id="salesRoute"
            label={t("sales_route")}
            checked={salesRoute}
            onChange={() => setSalesRoute(!salesRoute)}
          />
          <ERPDataCombobox
            key={mainSalesRoute}
            field={{
              id: "salesRouteID",
              getListUrl: Urls.MainSalesRoute,
              valueKey: "id",
              labelKey: "name",
            }}
            noLabel={true}
            id="mainSalesRoute"
            data={{ mainSalesRoute }}
            value={mainSalesRoute}
            disabled={!salesRoute}
            onChange={(e) => {
              setMainSalesRoute(e?.value ?? null);
            }}
          />
        </div>
        <ERPButton
          title={t('+')}
          onClick={() => dispatch(toggleParties({ isOpen: true }))}
          className="px-2 w-fit"
        />
      </div>

      <div className="mt-4">
        <ErpDevGrid
          ref={gridRef}
          columns={gridColumns}
          dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/LedgerList/${salesRoute && mainSalesRoute ? mainSalesRoute : 0}`}
          gridId="ledgerDetailsGrid"
          keyExpr="ledgerID"
          showChooserOnGridHead
          height={450}
          hideGridAddButton={true}
          columnHidingEnabled={true}
          hideDefaultExportButton={true}
          hideDefaultSearchPanel={true}
          allowSearching={false}
          allowExport={false}
          hideGridHeader={false}
          enablefilter={false}
          hideToolbar={true}
          remoteOperations={{
            filtering: true,
            paging: true,
            sorting: true,
            grouping: false,
            summary: false,
            groupPaging: false,
          }}
          enableScrollButton={false}
          ShowGridPreferenceChooser={false}
          showPrintButton={false}
          focusedRowEnabled={true}
          onContentReady={handleLedgerContentReady}
          onRowClick={handleRowClick}
          onKeyDown={handleKeyDown}
          selectionMode="single"
          keyboardNavigation={{
            editOnKeyPress: false,
            enabled: true,
            enterKeyDirection: "row",
          }}
          reload={gridReload}
          changeReload={(reload: boolean) => setGridReload(reload)}
        />
      </div>

      <ERPModal
        isOpen={rootState.PopupData.parties.isOpen || false}
        title="Customer"
        width={950}
        height={700}
        closeModal={() => {
          dispatch(toggleParties({ isOpen: false, key: null, reload: false }));
        }}
        content={<MemoizedPartiesManage type={"Cust"} />}
      />
    </>
  );
};
export default LedgerDetails;