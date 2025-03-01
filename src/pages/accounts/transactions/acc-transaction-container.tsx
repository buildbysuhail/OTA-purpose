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
const AccTransactionFormContainer: React.FC<AccTransactionProps> = (props) => {
  
  const [searchParams] = useSearchParams();
    const getParamOrProp = <T extends string | number >(
      key: keyof AccTransactionProps,
      isNumber: boolean = false
    ): T | undefined => {
      const paramValue = searchParams.get(key as string);
      if (paramValue != undefined && paramValue !== null) {
        return isNumber ? (Number(paramValue) as T) : (paramValue as T);
      }
      return undefined ;
    };
  
    // State initialization
    const [input, setInput] = useState({
      voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
      transactionType: getParamOrProp<string>("transactionType") || props.transactionType,
      formCode: getParamOrProp<string>("formCode") || props.formCode,
      voucherPrefix: getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
      formType: getParamOrProp<string>("formType") || props.formType,
      title: getParamOrProp<string>("title") || props.title,
      drCr: getParamOrProp<string>("drCr") || props.drCr,
      voucherNo: getParamOrProp<number>("voucherNo", true)  || props.voucherNo || 0,
      transactionMasterID: getParamOrProp<number>("transactionMasterID", true)  || props.transactionMasterID || 0,
      financialYearID: getParamOrProp<number>("financialYearID", true)  || props.financialYearID || 0,
    });
  
    // Sync state when query parameters or props change
    useEffect(() => {
      
      setInput({
        voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
        transactionType: getParamOrProp<string>("transactionType") || props.transactionType,
        formCode: getParamOrProp<string>("formCode") || props.formCode,
        voucherPrefix: getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
        formType: getParamOrProp<string>("formType") || props.formType,
        title: getParamOrProp<string>("title") || props.title,
        drCr: getParamOrProp<string>("drCr") || props.drCr,
        voucherNo: getParamOrProp<number>("voucherNo", true)  || props.voucherNo || 0,
        transactionMasterID: getParamOrProp<number>("transactionMasterID", true)  || props.transactionMasterID || 0,
        financialYearID: getParamOrProp<number>("financialYearID", true)  || props.financialYearID || 0,
      });
    }, [searchParams, props]); // Runs when query params or props change

  const { t } = useTranslation("transaction");
  const formState = useAppSelector((state: RootState) => state.AccTransaction);
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const [openVoucherSelector, setOpenVoucherSelector] = useState<boolean>(false);
  const [store, setStore] = useState<{ data: any; totalCount: number }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{
    voucherPrefix: string;
    formType: string;
    voucherNo: number;
  }>({ voucherPrefix: "", formType: input.formType ?? "", voucherNo: 1 });
  const [readyToShowVoucher, setReadyToShowVoucher] = useState<{ready: boolean, input: any, data: any}>({ready: false, input: null, data: null});
  const  {hasUnsavedChanges, setIsModalOpen} = useUnsavedChangesWarning();
  const dispatch = useDispatch();
  const [prevState, setPrevState] = useState({
    voucherType: undefined as string | undefined,
    transactionType: undefined as string | undefined,
    formCode: undefined as string | undefined,
    voucherPrefix: undefined as string | undefined,
    formType: undefined as string | undefined,
    title: undefined as string | undefined,
    drCr: undefined as string | undefined,
    voucherNo: undefined as number | undefined,
    transactionMasterID: undefined as number | undefined,
    financialYearID: undefined as number | undefined,
  });

  const goBack = async () => {
    const has = await hasUnsavedChanges();
    if (has) {
      setIsModalOpen(true);
    } else {
      navigate(-1);
    }
  };
  // const goBack = () => {
  //   navigate(-1); // Goes back to the previous page
  // };
  const initializeVoucher = async (_input: any, _data: any) => {
    try {
      setReadyToShowVoucher({ready: true, input: _input, data: _data});
    } catch (error) {
      console.error("Error initializing voucher:", error);
    }
  };

  useEffect(() => {
    
    const _input = {
      voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
      transactionType: getParamOrProp<string>("transactionType") || props.transactionType,
      formCode: getParamOrProp<string>("formCode") || props.formCode,
      voucherPrefix: getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
      formType: getParamOrProp<string>("formType") || props.formType,
      title: getParamOrProp<string>("title") || props.title,
      drCr: getParamOrProp<string>("drCr") || props.drCr,
      voucherNo: getParamOrProp<number>("voucherNo", true)  || props.voucherNo || 0,
      transactionMasterID: getParamOrProp<number>("transactionMasterID", true)  || props.transactionMasterID || 0,
      financialYearID: getParamOrProp<number>("financialYearID", true)  || props.financialYearID || 0,
    }
    let isDirty =false;
    Object.keys(_input).forEach((key) => {
      if (_input[key as keyof typeof _input] !== prevState[key as keyof typeof prevState]) {
        console.log(`Value changed for ${key}:`, prevState[key as keyof typeof prevState], "→", _input[key as keyof typeof _input]);
        isDirty =true;
      }
    });
    if(isDirty) {
    
    if (isChooseVoucherEnabled(_input.title ?? "", userSession) && (_input.voucherNo ==  undefined ||  _input.voucherNo <= 0)) {
      const fetchData = async () => {
        try {
          const res = await api.getAsync(
            `${Urls.voucher_selector}${_input.voucherType}`
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
                voucherPrefix: res[0].lastPrefix?.toUpperCase(),
              }));

              await initializeVoucher(
                _input,
                {
                  formType: res[0].formType,
                  voucherNo: res[0].lastVNo,
                  voucherPrefix: res[0].lastPrefix?.toUpperCase()
                }
              ); // Call initializeVoucher here
            }
            else {
              setReadyToShowVoucher({ready:true,input: _input, data: {
                formType: _input.formType,
              voucherNo: 0,
              voucherPrefix: _input.voucherPrefix
              }});
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
      debugger;
      initializeVoucher(
        _input, {
          formType: _input.formType,
        voucherNo: 0,
        voucherPrefix: _input.voucherPrefix
        })
    }
    setPrevState(_input);
  }
  }, [searchParams, props]);

  const onRowDblClick = useCallback(async (event: any) => {
    const _event = event.data != undefined ? event : event?.event
    setData((prev: any) => ({
      ...prev,
      formType: _event.data.formType,
      voucherNo: _event.data.lastVNo,
      voucherPrefix: _event.data.lastPrefix?.toUpperCase(),
    }));
    const asd = {
      voucherType: getParamOrProp<string>("voucherType") || props.voucherType,
      transactionType: getParamOrProp<string>("transactionType") || props.transactionType,
      formCode: getParamOrProp<string>("formCode") || props.formCode,
      voucherPrefix: getParamOrProp<string>("voucherPrefix") || props.voucherPrefix,
      formType: getParamOrProp<string>("formType") || props.formType,
      title: getParamOrProp<string>("title") || props.title,
      drCr: getParamOrProp<string>("drCr") || props.drCr,
      voucherNo: getParamOrProp<number>("voucherNo", true)  || props.voucherNo || 0,
      transactionMasterID: getParamOrProp<number>("transactionMasterID", true)  || props.transactionMasterID || 0,
      financialYearID: getParamOrProp<number>("financialYearID", true)  || props.financialYearID || 0,
    };
    const asf = {formType: _event.data.formType,
      voucherNo: _event.data.lastVNo,
      voucherPrefix: _event.data.lastPrefix?.toUpperCase()}
    await initializeVoucher(asd,asf); // Call initializeVoucher here
    setOpenVoucherSelector(false);
  }, [searchParams, props]);

  return (
    <>
      {openVoucherSelector == true ? (
        <ERPModal
          isForm
          isFullHeight
          isOpen={true}
          hasSubmit={false}
          width={800}
          height={600}
          minHeight={600}
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
        readyToShowVoucher.ready && formState?.userConfig && (
          <AccTransactionForm
            voucherType={readyToShowVoucher.input.voucherType}
            voucherPrefix={readyToShowVoucher.input.voucherNo != undefined && readyToShowVoucher.input.voucherNo > 0 ? readyToShowVoucher.input.voucherPrefix : readyToShowVoucher.data?.voucherPrefix}
            formType={readyToShowVoucher.input.voucherNo != undefined && readyToShowVoucher.input.voucherNo > 0 ? readyToShowVoucher.input.formType : readyToShowVoucher.data?.formType}
            formCode={readyToShowVoucher.input.formCode}
            title={readyToShowVoucher.input.title}
            drCr={readyToShowVoucher.input.drCr}
            voucherNo={readyToShowVoucher.input.voucherNo}
            transactionMasterID={readyToShowVoucher.input.transactionMasterID}
            transactionType={readyToShowVoucher.input.transactionType}
          />
        )
      )}
    </>
  );
};

export default AccTransactionFormContainer;
