/**
 * Service Transaction Hook - Business Logic
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { APIClient } from "../../../../helpers/api-client";
import ERPAlert from "../../../../components/ERPComponents/erp-sweet-alert";
import {
  resetState,
  setLoading,
  setSaving,
  setDeleting,
  loadTransaction,
  setActiveTab,
  setHistory,
  syncMasterToInvoice,
  disableFormForStatus,
} from "./service-transaction-reducer";
import {
  ServiceTransactionFormState,
  ServiceTransactionData,
  ServiceHistory,
  ServiceStatus,
} from "./service-transaction-types";
import { useTranslation } from "react-i18next";
import moment from "moment";

const api = new APIClient();

// API URL base for service transactions
const SERVICE_TRANSACTION_BASE = "/Inventory/ServiceTransaction";

export const useServiceTransaction = () => {
  const { t } = useTranslation("transaction");
  const dispatch = useDispatch();
  const formState = useSelector(
    (state: RootState) => state.ServiceTransaction as ServiceTransactionFormState
  );
  const userSession = useSelector((state: RootState) => state.UserSession);
  const applicationSettings = useSelector(
    (state: RootState) => state.ApplicationSettings
  );

  // Clear form for new entry
  const clearForm = useCallback(() => {
    dispatch(
      resetState({
        branchID: userSession.branchId,
        financialYearID: userSession.financialYearId,
        userID: userSession.userId,
        softwareDate: applicationSettings?.softwareDate,
      })
    );
  }, [dispatch, userSession, applicationSettings]);

  // Load transaction by job number
  const loadByJobNo = useCallback(
    async (jobNo: number, tabContext: "order" | "service" | "agent" | "invoice" = "order") => {
      if (!jobNo || jobNo <= 0) return;

      try {
        dispatch(setLoading(true));

        const response = await api.getAsync(
          `${SERVICE_TRANSACTION_BASE}/GetByJobNo/${jobNo}`,
          `branchID=${userSession.branchId}&context=${tabContext}`
        );

        if (response && response.master) {
          dispatch(loadTransaction(response as ServiceTransactionData));

          // If loading for invoice, sync master to invoice
          if (tabContext === "invoice") {
            dispatch(syncMasterToInvoice());
          }

          // Disable form if status is invoiced or cancelled
          if (response.master.status) {
            dispatch(disableFormForStatus(response.master.status as ServiceStatus));
          }
        } else {
          ERPAlert.show({
            title: t("not_found"),
            text: t("service_order_not_found"),
            icon: "warning",
          });
        }
      } catch (error) {
        console.error("Error loading service transaction:", error);
        ERPAlert.show({
          title: t("error"),
          text: t("error_loading_service_transaction"),
          icon: "error",
        });
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, userSession, t]
  );

  // Search by various fields
  const search = useCallback(
    async (searchValue: string | number, searchIn: string) => {
      if (!searchValue) return;

      try {
        dispatch(setLoading(true));

        const params = new URLSearchParams({
          branchID: userSession.branchId.toString(),
          searchIn,
          searchValue: searchValue.toString(),
        });

        const response = await api.getAsync(
          `${SERVICE_TRANSACTION_BASE}/Search`,
          params.toString()
        );

        if (response && response.master) {
          dispatch(loadTransaction(response as ServiceTransactionData));
        } else {
          ERPAlert.show({
            title: t("not_found"),
            text: t("service_order_not_found"),
            icon: "warning",
          });
        }
      } catch (error) {
        console.error("Error searching service transaction:", error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, userSession, t]
  );

  // Get history by serial number
  const getHistory = useCallback(
    async (serialNo: string) => {
      if (!serialNo) return;

      try {
        const response = await api.getAsync(
          `${SERVICE_TRANSACTION_BASE}/History`,
          `serialNo=${encodeURIComponent(serialNo)}&branchID=${userSession.branchId}`
        );

        if (response && Array.isArray(response)) {
          dispatch(setHistory(response as ServiceHistory[]));
        }
      } catch (error) {
        console.error("Error loading history:", error);
      }
    },
    [dispatch, userSession]
  );

  // Save order
  const saveOrder = useCallback(async () => {
    const { master } = formState.transaction;

    // Validation
    if (!master.mobile) {
      ERPAlert.show({
        title: t("validation_error"),
        text: t("mobile_required"),
        icon: "warning",
      });
      return false;
    }

    if (!master.serialNo) {
      ERPAlert.show({
        title: t("validation_error"),
        text: t("serial_no_required"),
        icon: "warning",
      });
      return false;
    }

    if (!master.complaints) {
      ERPAlert.show({
        title: t("validation_error"),
        text: t("complaints_required"),
        icon: "warning",
      });
      return false;
    }

    if (master.serviceID <= 0) {
      ERPAlert.show({
        title: t("validation_error"),
        text: t("service_required"),
        icon: "warning",
      });
      return false;
    }

    try {
      dispatch(setSaving(true));

      const isUpdate = master.serviceTransMasterID > 0;
      const url = isUpdate
        ? `${SERVICE_TRANSACTION_BASE}/Order/Update`
        : `${SERVICE_TRANSACTION_BASE}/Order/Create`;

      const response = isUpdate
        ? await api.putAsync(url, formState.transaction)
        : await api.postAsync(url, formState.transaction);

      if (response && response.success) {
        ERPAlert.show({
          title: t("success"),
          text: isUpdate ? t("order_updated") : t("order_saved"),
          icon: "success",
        });

        // Reload the saved data
        if (response.jobNo) {
          await loadByJobNo(response.jobNo, "order");
        }

        return true;
      } else {
        ERPAlert.show({
          title: t("error"),
          text: response?.message || t("error_saving_order"),
          icon: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("Error saving order:", error);
      ERPAlert.show({
        title: t("error"),
        text: t("error_saving_order"),
        icon: "error",
      });
      return false;
    } finally {
      dispatch(setSaving(false));
    }
  }, [formState, dispatch, loadByJobNo, t]);

  // Save service details
  const saveService = useCallback(async () => {
    const { master, serviceDetails, spareDetails } = formState.transaction;

    if (master.serviceTransMasterID <= 0) {
      ERPAlert.show({
        title: t("validation_error"),
        text: t("load_service_order_first"),
        icon: "warning",
      });
      return false;
    }

    try {
      dispatch(setSaving(true));

      const response = await api.putAsync(`${SERVICE_TRANSACTION_BASE}/Service/Update`, {
        master,
        serviceDetails,
        spareDetails,
      });

      if (response && response.success) {
        ERPAlert.show({
          title: t("success"),
          text: t("service_details_saved"),
          icon: "success",
        });
        return true;
      } else {
        ERPAlert.show({
          title: t("error"),
          text: response?.message || t("error_saving_service"),
          icon: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("Error saving service:", error);
      ERPAlert.show({
        title: t("error"),
        text: t("error_saving_service"),
        icon: "error",
      });
      return false;
    } finally {
      dispatch(setSaving(false));
    }
  }, [formState, dispatch, t]);

  // Save agent transfer
  const saveAgentTransfer = useCallback(async () => {
    const { master, agentTransfer } = formState.transaction;

    if (master.serviceTransMasterID <= 0) {
      ERPAlert.show({
        title: t("validation_error"),
        text: t("load_service_order_first"),
        icon: "warning",
      });
      return false;
    }

    if (agentTransfer.agentID <= 0) {
      ERPAlert.show({
        title: t("validation_error"),
        text: t("agent_required"),
        icon: "warning",
      });
      return false;
    }

    try {
      dispatch(setSaving(true));

      const response = await api.putAsync(`${SERVICE_TRANSACTION_BASE}/AgentTransfer/Update`, {
        serviceTransMasterID: master.serviceTransMasterID,
        agentTransfer,
      });

      if (response && response.success) {
        ERPAlert.show({
          title: t("success"),
          text: t("agent_transfer_saved"),
          icon: "success",
        });
        return true;
      } else {
        ERPAlert.show({
          title: t("error"),
          text: response?.message || t("error_saving_agent_transfer"),
          icon: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("Error saving agent transfer:", error);
      ERPAlert.show({
        title: t("error"),
        text: t("error_saving_agent_transfer"),
        icon: "error",
      });
      return false;
    } finally {
      dispatch(setSaving(false));
    }
  }, [formState, dispatch, t]);

  // Save invoice
  const saveInvoice = useCallback(async () => {
    const { master, invoice } = formState.transaction;

    if (master.serviceTransMasterID <= 0) {
      ERPAlert.show({
        title: t("validation_error"),
        text: t("load_service_order_first"),
        icon: "warning",
      });
      return false;
    }

    try {
      dispatch(setSaving(true));

      const isUpdate = invoice.serviceInvoiceID > 0;
      const url = isUpdate
        ? `${SERVICE_TRANSACTION_BASE}/Invoice/Update`
        : `${SERVICE_TRANSACTION_BASE}/Invoice/Create`;

      const response = isUpdate
        ? await api.putAsync(url, { master, invoice })
        : await api.postAsync(url, { master, invoice });

      if (response && response.success) {
        ERPAlert.show({
          title: t("success"),
          text: isUpdate ? t("invoice_updated") : t("invoice_created"),
          icon: "success",
        });

        // Reload the data
        await loadByJobNo(master.jobNo, "invoice");

        return true;
      } else {
        ERPAlert.show({
          title: t("error"),
          text: response?.message || t("error_saving_invoice"),
          icon: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      ERPAlert.show({
        title: t("error"),
        text: t("error_saving_invoice"),
        icon: "error",
      });
      return false;
    } finally {
      dispatch(setSaving(false));
    }
  }, [formState, dispatch, loadByJobNo, t]);

  // Delete order
  const deleteOrder = useCallback(async () => {
    const { master } = formState.transaction;

    if (master.serviceTransMasterID <= 0) {
      return false;
    }

    const result: any = await ERPAlert.show({
      title: t("confirm_delete"),
      text: t("delete_service_order_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (!result.isConfirmed) {
      return false;
    }

    try {
      dispatch(setDeleting(true));

      const response = await api.delete(
        `${SERVICE_TRANSACTION_BASE}/Order/Delete/${master.serviceTransMasterID}`
      );

      if (response && response.success) {
        ERPAlert.show({
          title: t("success"),
          text: t("order_deleted"),
          icon: "success",
        });
        clearForm();
        return true;
      } else {
        ERPAlert.show({
          title: t("error"),
          text: response?.message || t("error_deleting_order"),
          icon: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      ERPAlert.show({
        title: t("error"),
        text: t("error_deleting_order"),
        icon: "error",
      });
      return false;
    } finally {
      dispatch(setDeleting(false));
    }
  }, [formState, dispatch, clearForm, t]);

  // Delete invoice
  const deleteInvoice = useCallback(async () => {
    const { invoice } = formState.transaction;

    if (invoice.serviceInvoiceID <= 0) {
      return false;
    }

    const result: any = await ERPAlert.show({
      title: t("confirm_delete"),
      text: t("delete_invoice_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (!result.isConfirmed) {
      return false;
    }

    try {
      dispatch(setDeleting(true));

      const response = await api.delete(
        `${SERVICE_TRANSACTION_BASE}/Invoice/Delete/${invoice.serviceInvoiceID}`
      );

      if (response && response.success) {
        ERPAlert.show({
          title: t("success"),
          text: t("invoice_deleted"),
          icon: "success",
        });
        clearForm();
        return true;
      } else {
        ERPAlert.show({
          title: t("error"),
          text: response?.message || t("error_deleting_invoice"),
          icon: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      ERPAlert.show({
        title: t("error"),
        text: t("error_deleting_invoice"),
        icon: "error",
      });
      return false;
    } finally {
      dispatch(setDeleting(false));
    }
  }, [formState, dispatch, clearForm, t]);

  // Print order
  const printOrder = useCallback(async () => {
    const { master } = formState.transaction;

    if (master.serviceTransMasterID <= 0) {
      return;
    }

    // TODO: Implement print functionality using existing print patterns
    console.log("Print order:", master.jobNo);
  }, [formState]);

  // Print invoice
  const printInvoice = useCallback(async () => {
    const { invoice } = formState.transaction;

    if (invoice.serviceInvoiceID <= 0) {
      return;
    }

    // TODO: Implement print functionality using existing print patterns
    console.log("Print invoice:", invoice.serviceInvoiceID);
  }, [formState]);

  // Navigate to tab
  const goToTab = useCallback(
    (tabIndex: number) => {
      dispatch(setActiveTab(tabIndex));
    },
    [dispatch]
  );

  return {
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
  };
};

export default useServiceTransaction;
