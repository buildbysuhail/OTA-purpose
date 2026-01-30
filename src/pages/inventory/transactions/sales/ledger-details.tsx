import React, { useCallback, useMemo, useState } from "react";
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

interface LedgerDetailsProps {
  closeModal: () => void;
  t: any;
}

const LedgerDetails: React.FC<LedgerDetailsProps> = ({ closeModal, t }) => {
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const [salesRoute, setSalesRoute] = useState(false);
  const [mainSalesRoute, setMainSalesRoute] = useState<any>();
  const [ledgerInitialized, setLedgerInitialized] = useState(false);
  const [openCustomerAddModal, setOpenCustomerAddModal] = useState(false);  // Customer add master modal opens
  const MemoizedPartiesManage = useMemo(() => React.memo(PartiesManage), []);
  const dispatch = useDispatch()
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
          fields: { ledgerID: focusedRowKey },
        })
      );
      closeModal();
    }
  }, []);

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
          onClick={()=> setOpenCustomerAddModal(true)}
          className="px-2 w-fit"
        />
      </div>
      <div className="mt-4">
        <ErpDevGrid
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
      <ERPModal
        isOpen={openCustomerAddModal}
        title="Customer"
        width={950}
        height={700}
        closeModal={() => setOpenCustomerAddModal(false)}
        content={<MemoizedPartiesManage type={"Cust"} />}
      />
    </>
  );
};

export default LedgerDetails;