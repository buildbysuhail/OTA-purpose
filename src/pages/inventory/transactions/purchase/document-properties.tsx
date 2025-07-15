import React, { useState } from "react";
import ErpDevGrid from "../../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../../components/types/dev-grid-column";
import Urls from "../../../../redux/urls";
import { useSelector } from "react-redux/es/exports";
import { RootState } from "../../../../redux/store";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../../components/ERPComponents/erp-button";

interface DocumentPropertiesProps {
  closeModal: () => void;
  t: any;
}

const DocumentProperties: React.FC<DocumentPropertiesProps> = ({ closeModal, t }) => {
  const formState = useSelector((state: RootState) => state.InventoryTransaction);
  const [showViewAction, setShowViewAction] = useState(false);

  const gridColumns: DevGridColumn[] = [
    {
      dataField: "userName",
      caption: t("username"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
    {
      dataField: "actionPerformed",
      caption: t("action_performed"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 300,
    },
    {
      dataField: "dateTimeOfAction",
      caption: t("date_time_of_action"),
      dataType: "datetime",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 150,
      format: "dd/MM/yyyy HH:mm",
    },
    {
      dataField: "actionName",
      caption: t("action_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 100,
    },
    {
      dataField: "systemName",
      caption: t("system_name"),
      dataType: "string",
      allowSorting: true,
      allowSearch: true,
      allowFiltering: true,
      width: 120,
    },
  ];

  return (
    <>
      <div className="flex items-end justify-end gap-2 mb-4">
        <ERPCheckbox
          id="showViewAction"
          label={t("show_view_action")}
          checked={showViewAction}
          onChange={() => setShowViewAction(!showViewAction)}
        />
        <ERPButton
          title={t('show')}
          variant="primary"
          onClick={() => {

          }}
        />
      </div>
      <div className="mt-4">
        <ErpDevGrid
          columns={gridColumns}
          // dataUrl={`${Urls.inv_transaction_base}${formState.transactionType}/DocumentProperties/${formState.id || 0}?showViewAction=${showViewAction}`}
          gridId="documentPropertiesGrid"
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
        />
      </div>
    </>
  );
};

export default DocumentProperties;