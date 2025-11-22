import React, { useCallback, useState } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { RootState } from "../../../../redux/store";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import { formStateMasterHandleFieldChange } from "../reducer";

interface LedgerDetailsProps {
  closeModal: () => void;
  t: any;
}

const LedgerDetails: React.FC<LedgerDetailsProps> = ({ closeModal, t }) => {
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const [salesRoute, setSalesRoute] = useState(false);
  const [mainSalesRoute, setMainSalesRoute] = useState<any>();
  const [ledgerInitialized, setLedgerInitialized] = useState(false);
  const dispatch = useDispatch()
  const gridColumns: DevGridColumn[] = [
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
  ];

  const handleLedgerContentReady = useCallback(
    (e: any) => {
      const gridInstance = e.component;
      const visibleRows = gridInstance.getVisibleRows();
      if (!ledgerInitialized && visibleRows.length > 0) {
        gridInstance.option("focusedRowIndex", 0);
        gridInstance.selectRows([visibleRows[0].key], false);
        setLedgerInitialized(true);
        setTimeout(() => {
          gridInstance.focus();
        }, 0);
      }
    },
    [ledgerInitialized]
  );

  const handleRowClick = useCallback((e: any) => {
    const grid = e.component;
    const key = e.key;
    grid.selectRows([key], false);
    grid.option("focusedRowKey", key);
    grid.focus();
  }, []);

  const handleKeyDown = useCallback((e: any) => {
    const key = e.event?.key;
    if (key === "Enter") {
      const grid = e.component;
      const focusedRowKey = grid.option("focusedRowKey");
      dispatch(
        formStateMasterHandleFieldChange({
          fields: { ledgerID: focusedRowKey.ledgerID },
        })
      );
      closeModal();
    }
  }, []);

  return (
    <>
      <div className="flex items-end gap-2">
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
      <div className="mt-4">
        <ErpDevGrid
          columns={gridColumns}
          dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/LedgerList/${salesRoute && mainSalesRoute ? mainSalesRoute : 0}`}
          gridId="ledgerDetailsGrid"
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
          remoteOperations={false}
          enableScrollButton={false}
          ShowGridPreferenceChooser={false}
          showPrintButton={false}
          focusedRowEnabled={true}
          tabIndex={0}
          onContentReady={handleLedgerContentReady}
          onRowClick={handleRowClick}
          onKeyDown={handleKeyDown}
          selectionMode="single"
          keyboardNavigation={{
            editOnKeyPress: false,
            enabled: true,
            enterKeyDirection: "row",
          }}
        />
      </div>
    </>
  );
};

export default LedgerDetails;