import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ERPFormButtons } from "../../../components/ERPComponents/erp-form-buttons";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useFormManager } from "../../../utilities/hooks/useFormManagerOptions";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useTranslation } from "react-i18next";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import { toggleResetDataBasePopup } from "../../../redux/slices/popup-reducer";
import { ActionType } from "../../../redux/types";
import ERPDateInput from "../../../components/ERPComponents/erp-date-input";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import { useLocation } from "react-router-dom";
import { ResponseModelWithValidation } from "../../../base/response-model";
import SystemSettingsApi from "./system-apis";
import { handleResponse } from "../../../utilities/HandleResponse";
import ERPButton from "../../../components/ERPComponents/erp-button";
import { APIClient } from "../../../helpers/api-client";
import TransactionFormsCheckboxes from "./reset-database-transaction-forms-checkboxes";

type PrimitiveFormField = string | number | boolean | Date | null | undefined;
type ArrayFormField = PrimitiveFormField[];
type ObjectFormField = { [key: string]: FormField };
type FormField = PrimitiveFormField | ArrayFormField | ObjectFormField;

interface FormDataStructure {
  [key: string]: FormField;
}

interface Validations {
  [key: string]: string;
}

interface FormState {
  data: FormDataStructure;
  validations: Validations;
}

interface DynamicFormProps {
  initialData: FormState;
  onSubmit: (data: FormDataStructure) => void;
  onCancel: () => void;
}
const api = new APIClient();
const ResetDbManage: React.FC = React.memo(() => {
  const location = useLocation();
  const initialResetDbData = {
    data: {
      from: "",
      to: "",
      password: "",
      selectAll: false,
      updateStock: false,
      maintainRecords: false,
      updateAccount: false,
    },
    validations: {
      from: "",
      to: "",
      password: "",
    },
  };

  const masterData = {
    CURR: false,
    ACCGP: false,
    ACCLED: false,
    PCAT: false,
    CUST: false,
    SUPP: false,
    DESIG: false,
    EMP: false,
    JBWRK: false,
    DOC: false,
    PRD: false,
    PDGP: false,
    PDCAT: false,
    BRD: false,
    PRCAT: false,
    UNM: false,
    TXC: false,
    VH: false,
    VEH: false,
    PPR: false,
    SRT: false,
    SLRT: false,
    BLM: false,
  };
  const [postData, setPostData] = useState<any>(initialResetDbData);
  const [master, setMaster] = useState<any>(masterData);
  const [allTransactions, setAllTransactions] = useState<any>();
  const [postDataLoading, setPostUserTypeLoading] = useState<boolean>(false);
  const rootState = useRootState();
  const dispatch = useDispatch();
  // const queryParams = new URLSearchParams(location.search);
  // const [key, setKey] = useState<any>(queryParams.get("key"));

  useEffect(() => {
    loadTransactions();
  }, []);
  const loadTransactions = async () => {
    const res: any[] = await api.getAsync(Urls.reset_data_base);
    const updatedVouchers = res?.map((tr) => ({
      ...tr, // Spread existing properties
      checked: false, // Add new `checked` property
    }));
    debugger;
    setAllTransactions(updatedVouchers);
  };
  const { t } = useTranslation();

  const handleSubmit = useCallback(async () => {
    debugger;
    const masters = Object.keys(master)
      .filter((key) => master[key]) // Filter only the true values
      .map((key) => ({ tableTypeCode: key }));
    let fd = allTransactions && JSON.parse(JSON.stringify(allTransactions));
    const transactions =
      fd &&
      fd
        .filter((tr: any) => tr.checked) // Filter the checked transactions
        .map((tr: any) => ({ voucherType: tr.voucherType }));
    setPostUserTypeLoading(true);
    const combinedData = {
      ...postData?.data,
      transactions,
      masters,
    };
    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.postRestDB(combinedData);
    setPostUserTypeLoading(false);
    handleResponse(
      response,
      () => {
        dispatch(toggleResetDataBasePopup({ isOpen: false }));
      },
      () => {
        debugger;
        setPostData((prevData: any) => ({
          ...prevData,
          validations: response.validations,
        }));
      }
    );
  }, [postData?.data]);

  const onClose = useCallback(() => {
    dispatch(toggleResetDataBasePopup({ isOpen: false, key: null }));
  }, []);

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 gap-3 ">
        <div className="flex flex-row  sm:justify-start items-center  gap-5 mb-4">
          <ERPDateInput
            type="date"
            id="from"
            label={t("from")}
            value={postData?.data?.from}
            data={postData.data}
            validation={postData?.validations?.from}
            onChange={(e) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  from: e.target.value,
                },
              }));
            }}
          />

          <ERPDateInput
            type="date"
            id="to"
            label={t("to")}
            value={postData?.data?.to}
            data={postData.data}
            validation={postData?.validations?.to}
            onChange={(e) => {
              setPostData((prev: any) => ({
                ...prev,
                data: {
                  ...prev.data,
                  to: e.target.value,
                },
              }));
            }}
          />
          <ERPInput
            id="password"
            label={t("password")}
            placeholder={t("password")}
            required={true}
            data={postData.data}
            value={postData.data.password}
            validation={postData?.validations?.password}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
          />
        </div>

        <div className="flex justify-start  gap-5 mb-4">
          {/* deme text area */}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 p-3 sticky top-0 bg-white z-10">
              Transaction Forms
            </label>
            <div className="overflow-x-auto border border-gray-400 rounded w-auto max-w-[500px] h-auto max-h-[260px]">
              <div className="grid grid-flow-col auto-cols-max gap-4 p-4">
                {allTransactions && allTransactions.length > 0 && (
                  <TransactionFormsCheckboxes
                    allTransactions={allTransactions}
                    setAllTransactions={setAllTransactions}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
            <div className="flex flex-col gap-6">
              {/* Account Master */}
              <div className="border border-gray-200 rounded p-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Master
                </label>

                <ERPCheckbox
                  id="CURR"
                  label="Currencies"
                  data={master}
                  checked={master.CURR}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      CURR: !prev.CURR,
                    }));
                  }}
                />
                <ERPCheckbox
                  id="ACCGP"
                  label="Account Group"
                  data={master}
                  checked={master.ACCGP}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      ACCGP: !prev.ACCGP,
                    }));
                  }}
                />
                <ERPCheckbox
                  id="ACCLED"
                  label="Account Ledgers"
                  data={master}
                  checked={master.ACCLED}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      ACCLED: !prev.ACCLED,
                    }));
                  }}
                />
                <ERPCheckbox
                  id="PCAT"
                  label="Party Category"
                  data={master}
                  checked={master.PCAT}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      PCAT: !prev.PCAT,
                    }));
                  }}
                />
                <ERPCheckbox
                  id="CUST"
                  label="Customers"
                  data={master}
                  checked={master.CUST}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      CUST: !prev.CUST,
                    }));
                  }}
                />
                <ERPCheckbox
                  id="SUPP"
                  label="Suppliers"
                  data={master}
                  checked={master.SUPP}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      SUPP: !prev.SUPP,
                    }));
                  }}
                />
              </div>

              {/* HR Master */}
              <div className="border border-gray-200 rounded p-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HR Master
                </label>
                <ERPCheckbox
                  id="DESIG"
                  label="Designation"
                  data={master}
                  checked={master.DESIG}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      DESIG: !prev.DESIG,
                    }));
                  }}
                />
                <ERPCheckbox
                  id="EMP"
                  label="Employee"
                  data={master}
                  checked={master.EMP}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      EMP: !prev.EMP,
                    }));
                  }}
                />
                <ERPCheckbox
                  id="JBWRK"
                  label="Job Works"
                  data={master}
                  checked={master.JBWRK}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      JBWRK: !prev.JBWRK,
                    }));
                  }}
                />
                <ERPCheckbox
                  id="DOC"
                  label="Documents"
                  data={master}
                  checked={master.DOC}
                  onChangeData={(data) => {
                    setMaster((prev: any) => ({
                      ...prev,
                      DOC: !prev.DOC,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded p-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inventory Master
              </label>
              <ERPCheckbox
                id="PRD"
                label="Products"
                data={master}
                checked={master.PRD}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    PRD: !prev.PRD,
                  }));
                }}
              />
              <ERPCheckbox
                id="PDGP"
                label="Product Group"
                data={master}
                checked={master.PDGP}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    PDGP: !prev.PDGP,
                  }));
                }}
              />
              <ERPCheckbox
                id="PDCAT"
                label="Product Category"
                data={master}
                checked={master.PDCAT}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    PDCAT: !prev.PDCAT,
                  }));
                }}
              />
              <ERPCheckbox
                id="BRD"
                label="Brands"
                data={master}
                checked={master.BRD}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    BRD: !prev.BRD,
                  }));
                }}
              />
              <ERPCheckbox
                id="PRCAT"
                label="Price Category"
                data={master}
                checked={master.PRCAT}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    PRCAT: !prev.PRCAT,
                  }));
                }}
              />
              <ERPCheckbox
                id="UNM"
                label="Unit of Measures"
                data={master}
                checked={master.UNM}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    UNM: !prev.UNM,
                  }));
                }}
              />
              <ERPCheckbox
                id="TXC"
                label="Tax Category"
                data={master}
                checked={master.TXC}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    TXC: !prev.TXC,
                  }));
                }}
              />
              <ERPCheckbox
                id="VH"
                label="Warehouse"
                data={master}
                checked={master.VH}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    VH: !prev.VH,
                  }));
                }}
              />
              <ERPCheckbox
                id="VEH"
                label="Vehicles"
                data={master}
                checked={master.VEH}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    VEH: !prev.VEH,
                  }));
                }}
              />
              <ERPCheckbox
                id="PPR"
                label="Product Prices"
                data={master}
                checked={master.PPR}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    PPR: !prev.PPR,
                  }));
                }}
              />
              <ERPCheckbox
                id="SRT"
                label="Sales Route"
                data={master}
                checked={master.SRT}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    SRT: !prev.SRT,
                  }));
                }}
              />
              <ERPCheckbox
                id="SLRT"
                label="Salesman Route"
                data={master}
                checked={master.SLRT}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    SLRT: !prev.SLRT,
                  }));
                }}
              />
              <ERPCheckbox
                id="BLM"
                label="Bill of Material"
                data={master}
                checked={master.BLM}
                onChangeData={(data) => {
                  setMaster((prev: any) => ({
                    ...prev,
                    BLM: !prev.BLM,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-start items-center gap-5 ">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2  sm:gap-5">
            <ERPCheckbox
              id="selectAll"
              label={t("select_all")}
              data={postData.data}
              checked={postData.data.selectAll}
              onChangeData={(data: any) => {
                setPostData((prev: any) => ({
                  ...prev,
                  data: data,
                }));
              }}
            />
            <ERPCheckbox
              id="updateStock"
              label={t("update_stock")}
              data={postData.data}
              checked={postData.data.updateStock}
              onChangeData={(data: any) => {
                setPostData((prev: any) => ({
                  ...prev,
                  data: data,
                }));
              }}
            />
            <ERPCheckbox
              id="updateAccount"
              label={t("update_account")}
              data={postData.data}
              checked={postData.data.updateAccount}
              onChangeData={(data: any) => {
                setPostData((prev: any) => ({
                  ...prev,
                  data: data,
                }));
              }}
            />
            <ERPCheckbox
              id="maintainRecords"
              label={t("maintain_records")}
              data={postData.data}
              checked={postData.data.maintainRecords}
              onChangeData={(data: any) => {
                setPostData((prev: any) => ({
                  ...prev,
                  data: data,
                }));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-3 m-2">
        <ERPButton
          title="Reset"
          variant="primary"
          disabled={postDataLoading}
          loading={postDataLoading}
          onClick={handleSubmit}
        />
        <ERPButton
          title="Close"
          variant="secondary"
          disabled={postDataLoading}
          onClick={onClose}
        />
      </div>
    </div>
  );
});

export default ResetDbManage;
