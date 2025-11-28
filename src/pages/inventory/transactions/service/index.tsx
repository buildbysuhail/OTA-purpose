/**
 * Service Transaction - Main Container
 * Based on Windows Forms frmServiceTransaction
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ERPTab from "../../../../components/ERPComponents/erp-tab";
import ERPModal from "../../../../components/ERPComponents/erp-modal";
import { useServiceTransaction } from "./use-service-transaction";
import OrderTab from "./tabs/order-tab";
import ServiceTab from "./tabs/service-tab";
import AgentTransferTab from "./tabs/agent-transfer-tab";
import InvoiceTab from "./tabs/invoice-tab";
import ReportsTab from "./tabs/reports-tab";
import { setActiveTab, toggleHistory } from "./service-transaction-reducer";
import { ServiceHistory } from "./service-transaction-types";
import moment from "moment";

const ServiceTransaction: React.FC = () => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const {
    formState,
    clearForm,
    loadByJobNo,
    search,
    getHistory,
    saveOrder,
    saveService,
    saveAgentTransfer,
    saveInvoice,
    deleteOrder,
    deleteInvoice,
    printOrder,
    printInvoice,
    goToTab,
  } = useServiceTransaction();

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const tabs = [
    t("order"),
    t("service"),
    t("agent_transfer"),
    t("invoice"),
    t("reports"),
  ];

  // Initialize form on mount
  useEffect(() => {
    clearForm();
  }, []);

  const handleTabChange = (index: number) => {
    dispatch(setActiveTab(index));
  };

  const handleJobNoChange = async (jobNo: number) => {
    await loadByJobNo(jobNo, "order");
  };

  const handleSearch = async (jobNo: number, searchIn: string) => {
    const tabContext =
      formState.activeTab === 1
        ? "service"
        : formState.activeTab === 2
        ? "agent"
        : formState.activeTab === 3
        ? "invoice"
        : "order";
    await loadByJobNo(jobNo, tabContext);
  };

  const handleShowHistory = async (serialNo: string) => {
    if (serialNo) {
      await getHistory(serialNo);
      setShowHistoryModal(true);
    }
  };

  const handleAddAgent = () => {
    // TODO: Open ledger creation modal for agents
    console.log("Add agent modal");
  };

  // History Modal Component
  const HistoryModal = () => (
    <ERPModal
      isOpen={showHistoryModal}
      closeModal={() => setShowHistoryModal(false)}
      title={t("service_history")}
      content={
      <div className="p-4">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 dark:bg-dark-bg-header">
            <tr>
              <th className="px-2 py-1 text-left border">{t("job_no")}</th>
              <th className="px-2 py-1 text-left border">{t("date")}</th>
              <th className="px-2 py-1 text-left border">{t("service")}</th>
              <th className="px-2 py-1 text-left border">{t("complaints")}</th>
              <th className="px-2 py-1 text-left border">{t("status")}</th>
              <th className="px-2 py-1 text-left border">{t("warranty")}</th>
            </tr>
          </thead>
          <tbody>
            {formState.transaction.history.map((item: ServiceHistory, index: number) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-dark-bg-hover cursor-pointer"
                onClick={() => {
                  loadByJobNo(item.serviceTransMasterID, "order");
                  setShowHistoryModal(false);
                }}
              >
                <td className="px-2 py-1 border">{item.jobNo}</td>
                <td className="px-2 py-1 border">
                  {moment(item.orderDate).format("DD-MMM-YYYY")}
                </td>
                <td className="px-2 py-1 border">{item.serviceName}</td>
                <td className="px-2 py-1 border">{item.complaints}</td>
                <td className="px-2 py-1 border">{item.status}</td>
                <td className="px-2 py-1 border">
                  {item.isWarrantyService ? t("yes") : t("no")}
                </td>
              </tr>
            ))}
            {formState.transaction.history.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-4 text-center text-gray-400">
                  {t("no_history_found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      }
    >
    </ERPModal>
  );

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white dark:bg-dark-bg-card">
        <h1 className="text-xl font-semibold">{t("service_transaction")}</h1>
      </div>

      {/* Loading/Saving Overlay */}
      {(formState.isLoading || formState.isSaving || formState.isDeleting) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-bg-card p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm">
              {formState.isLoading
                ? t("loading")
                : formState.isSaving
                ? t("saving")
                : t("deleting")}
              ...
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <ERPTab
        tabs={tabs}
        activeTab={formState.activeTab}
        onClickTabAt={handleTabChange}
      >
        {/* Order Tab */}
        <OrderTab
          onSave={saveOrder}
          onClear={clearForm}
          onDelete={deleteOrder}
          onPrint={printOrder}
          onJobNoChange={handleJobNoChange}
          onShowHistory={handleShowHistory}
        />

        {/* Service Tab */}
        <ServiceTab
          onSave={saveService}
          onClear={clearForm}
          onSearch={handleSearch}
        />

        {/* Agent Transfer Tab */}
        <AgentTransferTab
          onSave={saveAgentTransfer}
          onClear={clearForm}
          onSearch={handleSearch}
          onAddAgent={handleAddAgent}
        />

        {/* Invoice Tab */}
        <InvoiceTab
          onSave={saveInvoice}
          onClear={clearForm}
          onDelete={deleteInvoice}
          onPrint={printInvoice}
          onSearch={handleSearch}
        />

        {/* Reports Tab */}
        <ReportsTab />
      </ERPTab>

      {/* History Modal */}
      <HistoryModal />
    </div>
  );
};

export default ServiceTransaction;
