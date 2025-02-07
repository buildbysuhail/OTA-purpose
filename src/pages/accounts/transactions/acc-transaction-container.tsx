import React, { useCallback, useEffect, useState } from "react";
import Urls from "../../../redux/urls";
import { useSearchParams } from "react-router-dom";
import { AccTransactionProps } from "./acc-transaction-types";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { APIClient } from "../../../helpers/api-client";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { isChooseVoucherEnabled } from "../../../components/common/content/transaction-routes";
import AccTransactionForm from "./acc-transaction";
import VoucherSelector from "../../transaction-base/voucher-selector";
import { useUnsavedChangesWarning } from "./use-unsaved-changes-warning";
import UnsavedChangesModal from "./unsavedChangesModal";
import { useNavigate } from "react-router-dom";

const api = new APIClient();
const AccTransactionFormContainer: React.FC<AccTransactionProps> = ({
  voucherType,
  formType,
  formCode,
  title,
  drCr,
  transactionType,
}) => {
  const { t } = useTranslation("transaction");
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const [searchParams] = useSearchParams();
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const [openVoucherSelector, setOpenVoucherSelector] = useState<boolean>(false);
  const [store, setStore] = useState<{ data: any; totalCount: number }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{
    voucherPrefix: string;
    formType: string;
    voucherNo: number;
  }>({ voucherPrefix: "", formType: formType ?? "", voucherNo: 1 });
  const [readyToShowVoucher, setReadyToShowVoucher] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { isModalOpen, handleStay, handleLeave } = useUnsavedChangesWarning();
  const goBack = () => {
    navigate(-1); // Goes back to the previous page
  };
  const initializeVoucher = async () => {
    try {
      setReadyToShowVoucher(true);
    } catch (error) {
      console.error("Error initializing voucher:", error);
    }
  };

  useEffect(() => {
    if (isChooseVoucherEnabled(title ?? "", userSession)) {
      const fetchData = async () => {
        try {
          const res = await api.getAsync(
            `${Urls.voucher_selector}${voucherType}`
          );

          if (
            res == undefined ||
            res == null ||
            (res != undefined && res != null && res.length <= 1)
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

  const onRowDblClick = useCallback(async (_event: any) => {
    debugger;
    setData((prev: any) => ({
      ...prev,
      formType: _event.data.formType,
      voucherNo: _event.data.lastVNo,
      voucherPrefix: _event.data.lastPrefix,
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
            setOpenVoucherSelector(false); goBack() 
          }}
          onSubmit={() => {
            setOpenVoucherSelector(false);
          }}
        />
      ) : (
        readyToShowVoucher && formState?.userConfig && (
          <AccTransactionForm
            voucherType={voucherType}
            voucherPrefix={data.voucherPrefix}
            formType={data.formType}
            formCode={formCode}
            title={title}
            drCr={drCr}
            transactionType={transactionType}
          />
        )
      )}
      {isModalOpen && (
        <UnsavedChangesModal
          isOpen={isModalOpen}
          onClose={handleStay}
          onStay={handleStay}
          onLeave={handleLeave}
        />
      )}
    </>
  );
};

export default AccTransactionFormContainer;
