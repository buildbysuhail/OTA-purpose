import React, { useCallback, useEffect, useState } from "react";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import Urls from "../../../redux/urls";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { useParams } from "react-router-dom";
import { AccTransactionProps, AccUserConfig } from "./acc-transaction-types";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import {
  accFormStateHandleFieldChange,
  accFormStateRowHandleFieldChange,
  accFormStateTransactionDetailsRowAdd,
  accFormStateTransactionMasterHandleFieldChange,
} from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";
import { APIClient } from "../../../helpers/api-client";
import {
  ApplicationMainSettings,
  ApplicationMainSettingsInitialState,
} from "../../settings/system/application-settings-types/application-settings-types-main";
import ERPPreviousUrlButton from "../../../components/ERPComponents/erp-previous-uirl-button";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useAccTransaction } from "./use-acc-transaction";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { useTransaction } from "../../use-transaction";
import { AccTransactionUserConfig } from "./acc-transaction-user-config";
import BillWisePopup from "./billwise-popup";
import CustomerDetailsSidebar from "../../transaction-base/customer-details";
import AttachmentSidebar from "../../transaction-base/Attachment-button";
import ActivityLogSidebar from "../../transaction-base/ActivityLog-button";
import { isChooseVoucherEnabled } from "../../../components/common/content/transaction-routes";
import AccTransactionForm from "./acc-transaction";
import ERPSubmitButton from "../../../components/ERPComponents/erp-submit-button";
import VoucherSelector from "../../transaction-base/voucher-selector";
import { customJsonParse, modelToBase64 } from "../../../utilities/jsonConverter";

const api = new APIClient();
const AccTransactionFormContainer: React.FC<AccTransactionProps> = ({
  voucherType,
  formType,
  formCode,
  title,
  drCr,
  transactionType,
}) => {
  const { t } = useTranslation();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const [openVoucherSelector, setOpenVoucherSelector] =
    useState<boolean>(false);
  const [store, setStore] = useState<{ data: any; totalCount: number }>();
  const [data, setData] = useState<{
    voucherPrefix: string;
    formType: string;
    voucherNo: number;
  }>({ voucherPrefix: "", formType: formType??"", voucherNo: 1 });
  const [readyToShowVoucher, setReadyToShowVoucher] = useState<boolean>(false);
 const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const dispatch = useDispatch(); 
  const applicationSettings = useAppSelector(
    (state: RootState) => state.ApplicationSettings
  );

  const fetchUserConfig = async () => {
    try {
      const base64 = await api.get(Urls.get_acc_user_config);
      localStorage.setItem('utc', base64);
      // Decode the base64 back to JSON string
      const _userConfig = atob(base64);
      const userConfig: AccUserConfig = customJsonParse(_userConfig);
  
      dispatch(
        accFormStateRowHandleFieldChange({
          fields: {
            costCentreID:
              userConfig?.presetCostenterId ?? 0 > 0
                ? userConfig?.presetCostenterId
                : userSession.dbIdValue == "SAMAPLASTICS12121212121"
                ? 0
                : applicationSettings?.accountsSettings?.defaultCostCenterID,
          },
        })
      );
      dispatch(accFormStateHandleFieldChange({ fields: { userConfig } }));
    } catch (error) {
      console.error("Error fetching user config:", error);
    }
  };
  
  const initializeVoucher = async () => {
    try {
      debugger;
      const Utc = localStorage.getItem("utc");
  
      if (Utc) {
        // If userConfig is available in localStorage, use it
        const _userConfig = atob(Utc);
        const userConfig: AccUserConfig = customJsonParse(_userConfig);
  
        dispatch(
          accFormStateRowHandleFieldChange({
            fields: {
              costCentreID:
                userConfig?.presetCostenterId ?? 0 > 0
                  ? userConfig?.presetCostenterId
                  : userSession.dbIdValue == "SAMAPLASTICS12121212121"
                  ? 0
                  : applicationSettings?.accountsSettings?.defaultCostCenterID,
            },
          })
        );
        dispatch(accFormStateHandleFieldChange({ fields: { userConfig } }));
      } else {
        // If userConfig is not available in localStorage, fetch it from the API
        await fetchUserConfig();
      }
  
      setReadyToShowVoucher(true);
    } catch (error) {
      console.error("Error initializing voucher:", error);
    }
  };

  useEffect(() => {
    if (isChooseVoucherEnabled(title??"", userSession)) {
      const fetchData = async () => {
        try {
          const res = await api.getAsync(
            `${Urls.voucher_selector}${voucherType}`
          );
          
          if (
            res == undefined ||
            res == null ||
            (res != undefined &&
              res != null &&
              res.length <= 1)
          ) {
            if (res?.length == 1) {
              setData((prev: any) => ({
                ...prev,
                formType: res[0].formType,
                voucherNo: res[0].lastVNo,
                voucherPrefix: res[0].lastPrefix,
              }));
              
              await initializeVoucher(); // Call initializeVoucher here
            }
          } else {
            setStore(res);
            setOpenVoucherSelector(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      initializeVoucher(); // Call initializeVoucher here
    }
  }, [voucherType]);

  const onRowDblClick = useCallback(async (event: any) => {
    setData((prev: any) => ({
      ...prev,
      formType: event.data.formType,
      voucherNo: event.data.lastVNo,
      voucherPrefix: event.data.lastPrefix,
    }));
    await initializeVoucher(); // Call initializeVoucher here
    setOpenVoucherSelector(false);
  }, []);

  return (
    <>
      {openVoucherSelector == true ? (
        <ERPModal
          isForm
          isFullHeight
          isOpen={true}
          hasSubmit={false}
          width="w-[900px]"
          minHeight={800}
          closeTitle={t("close")}
          title={t("voucher_selector")}
          content={
            <VoucherSelector
              data={store}
              onRowDblClick={onRowDblClick}
            ></VoucherSelector>
          }
          closeModal={() => {
            setOpenVoucherSelector(false);
          }}
          onSubmit={() => {
            setOpenVoucherSelector(false);
          }}
        />
      ) : readyToShowVoucher == true && formState?.userConfig &&(
        <AccTransactionForm
          voucherType={voucherType}
          voucherPrefix={data.voucherPrefix}
          formType={data.formType}
          formCode={formCode}
          title={title}
          drCr={drCr}
          transactionType={transactionType}
        />
      )}
    </>
  );
};

export default AccTransactionFormContainer;