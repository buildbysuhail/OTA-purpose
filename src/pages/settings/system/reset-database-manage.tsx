import React, { useCallback, useState } from "react";
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

  const [postData, setPostData] = useState<any>(initialResetDbData);
  const [postDataLoading, setPostUserTypeLoading] = useState<boolean>(false);
  const rootState = useRootState();
  const dispatch = useDispatch();
  // const queryParams = new URLSearchParams(location.search);
  // const [key, setKey] = useState<any>(queryParams.get("key"));
  const { t } = useTranslation();

  const handleSubmit = useCallback(async () => {
    setPostUserTypeLoading(true);
    const response: ResponseModelWithValidation<any, any> =
      await SystemSettingsApi.postRestDB(postData?.data);
    setPostUserTypeLoading(false);
    handleResponse(
      response,
      () => {
        dispatch(toggleResetDataBasePopup({ isOpen: false }));
      },
      () => {
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
            validation={postData.validations.from}
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
            validation={postData.validations.to}
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
            validation={postData.validations?.password}
            onChangeData={(data: any) => {
              setPostData((prev: any) => ({
                ...prev,
                data: data,
              }));
            }}
          />
        </div>

        <div className="flex justify-start items-center gap-5 mb-4">
          {/* deme text area */}
          <div className="w-1/2 ">
            <label className="block text-sm font-medium text-gray-700 ">
              Transaction Forms
            </label>
            <textarea
              rows={12}
              className="w-full border border-gray-300  rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              // onChange={(e) => handleFieldChange("remarks", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
            <div className="flex flex-col gap-6">
              {/* Account Master */}
              <div className="border border-gray-200 rounded p-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Master
                </label>

                <ERPCheckbox
                  id="selectAll"
                  label="Account Group"
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
                  id="selectAll"
                  label="Account Ledgers"
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
                  id="selectAll"
                  label="Currencies"
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
                  id="selectAll"
                  label="Party Category"
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
                  id="selectAll"
                  label="Customers"
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
                  id="selectAll"
                  label="Suppliers"
                  data={postData.data}
                  checked={postData.data.selectAll}
                  onChangeData={(data: any) => {
                    setPostData((prev: any) => ({
                      ...prev,
                      data: data,
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
                  id="selectAll"
                  label="Designation"
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
                  id="selectAll"
                  label="Employee"
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
                  id="selectAll"
                  label="Job Works"
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
                  id="selectAll"
                  label="Documents"
                  data={postData.data}
                  checked={postData.data.selectAll}
                  onChangeData={(data: any) => {
                    setPostData((prev: any) => ({
                      ...prev,
                      data: data,
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
                id="selectAll"
                label="Products"
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
                id="selectAll"
                label="Product Group"
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
                id="selectAll"
                label="Product Category"
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
                id="selectAll"
                label="Brands"
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
                id="selectAll"
                label="Price Category"
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
                id="selectAll"
                label="Unit of Measures"
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
                id="selectAll"
                label="Vehicles"
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
                id="selectAll"
                label="Warehouse"
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
                id="selectAll"
                label="Tax Category"
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
                id="selectAll"
                label="Product Prices"
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
                id="selectAll"
                label="Sales Route"
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
                id="selectAll"
                label="Salesman Route"
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
                id="selectAll"
                label="Bill of Material"
                data={postData.data}
                checked={postData.data.selectAll}
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
        title="Save Changes"
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
