import React, { useState, useEffect } from "react";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import Urls from "../../../redux/urls";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { APIClient } from "../../../helpers/api-client";
import { handleResponse } from "../../../utilities/HandleResponse";
import { ApplicationMainSettings, ApplicationMainSettingsInitialState } from "./application-settings-types";
import { t } from "i18next";
import { tabClasses } from "@mui/material";



const api = new APIClient();
const ERPSettingsFormMain = () => {
  const dispatch = useAppDispatch();
  const [settings, setSettings] = useState<ApplicationMainSettings>(ApplicationMainSettingsInitialState);
  const [settingsPrev, setSettingsPrev] = useState<Partial<ApplicationMainSettings>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await api.getAsync(`${Urls.application_settings}main`);
      
      console.log(settings);
      setSettingsPrev(response);
      setSettings(response);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    // setLoading(true);
    try {
      const response = await api.post(Urls.ValidateToken, {
        email: settings.oTPEmail,
        token: settings.oTPVerification,
      });
      handleResponse(response);
      const data: ApplicationMainSettings = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };
  const sendOtp = async () => {
    // setLoading(true);
    try {
      const response = await api.post(Urls.SendEmailToken, {
        email: settings.oTPEmail,
      });
      handleResponse(response);
      const data: ApplicationMainSettings = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFieldChange = (settingName: keyof ApplicationMainSettings, value: any) => {
    setSettings((prevSettings = {} as ApplicationMainSettings) => {
      const newSettings = {
        ...prevSettings,
        [settingName]: value,
      };
      if (settingName === 'allowSalesRouteArea' || settingName === 'maintainSalesRouteCreditLimit') {
        newSettings.allowSalesRouteArea = value;
        newSettings.maintainSalesRouteCreditLimit = value;
      }

      return newSettings;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const modifiedSettings = Object.keys(settings).reduce((acc, key) => {
        const currentValue = settings?.[key as keyof ApplicationMainSettings];
        const prevValue = settingsPrev[key as keyof ApplicationMainSettings];

        if (currentValue !== prevValue) {
          
          
          acc.push({
            settingsName: key,
            settingsValue: currentValue.toString(),
          });
        }
        return acc;
      }, [] as { settingsName: string; settingsValue: string }[]);
      console.log(modifiedSettings);

      const response = (await api.put(Urls.application_settings, {
        type: "main",
        updateList: modifiedSettings,
      })) as any;
      handleResponse(response);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  if (loading) {
    return <div>Loading settings?...</div>;
  }

  return (
    <div className="h-screen max-h-dvh flex flex-col  overflow-hidden">
    <form  className="space-y-6  max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
      <div className="border p-4 flex flex-col gap-6 rounded-lg">
        <div className="grid xxl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6">
          <ERPDataCombobox
            field={{
              id: "maintainBusinessType",
              valueKey: "value",
              labelKey: "label",
            }}
            id="maintainBusinessType"
            label={t("business_type")}
            value={settings?.maintainBusinessType}
            data={settings}
            onChangeData={(data) =>
              handleFieldChange("maintainBusinessType", data.maintainBusinessType)
            }
            options={[
              { value: "Retail", label: "General" },
              { value: "Distribution", label: "Distribution" },
              { value: "Manufacturing", label: "Manufacturing" },
              { value: "Supermarket", label: "Supermarket" },
              { value: "Textiles", label: "Textiles" },
              { value: "Restaurant", label: "Restaurant" },
              { value: "Opticals", label: "Opticals" },
            ]}
          />
          <ERPDataCombobox
            id="currency"
            field={{
              id: "currency",
              // required: true,
              getListUrl: Urls.data_currencies,
              valueKey: "id",
              labelKey: "name",
            }}
            data={settings}
            value={settings?.currency}
            onChangeData={(data) => handleFieldChange("currency", data.currency)}
            label={t("currency_main")}
          />
          <ERPDataCombobox
            field={{
              id: "cashSalesVoucherPrefix",
              valueKey: "value",
              labelKey: "label",
            }}
            id="cashSalesVoucherPrefix"
            label={t("currency_format")}
            data={settings}
            value={settings?.cashSalesVoucherPrefix}
            onChangeData={(data) =>
              handleFieldChange(
                "cashSalesVoucherPrefix",
                data.cashSalesVoucherPrefix
              )
            }
            options={[
              { value: "Millions", label: "Millions" },
              { value: "Lakhs", label: "Lakhs" },
            ]}
          />
          <ERPDataCombobox
            field={{
              id: "decimalPoints",
              valueKey: "value",
              labelKey: "label",
            }}
            id="decimalPoints"
            label={t("decimal_points")}
            data={settings}
            value={settings?.decimalPoints}
            defaultData={settings?.decimalPoints}
            onChangeData={(data) =>
              handleFieldChange("decimalPoints", data.decimalPoints)
            }
            options={[
              { value: 0, label: "0" },
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
            ]}
          />
          <ERPDataCombobox
            field={{
              id: "roundingMethodGLOBAL",
              valueKey: "value",
              labelKey: "label",
            }}
            id="roundingMethodGLOBAL"
            label={t("rounding_method_global")}
            value={settings?.roundingMethodGLOBAL}
            data={settings}
            onChangeData={(data) =>
              handleFieldChange("roundingMethodGLOBAL", data.roundingMethodGLOBAL)
            }
            options={[
              { value: "Normal", label: "Normal" },
              { value: "No Rounding", label: "No Rounding" },
              { value: "Ceiling", label: "Ceiling" },
              { value: "Floor", label: "Floor" },
              { value: "Round to 0.25", label: "Round to 0.25" },
              { value: "Round to 0.50", label: "Round to 0.50" },
              { value: "Round to 0.10", label: "Round to 0.10" },
              { value: "Floor Round to 0.50", label: "Floor Round to 0.50" },
              { value: "Floor Round to 0.25", label: "Floor Round to 0.25" },
              { value: "Floor Round to 0.10", label: "Floor Round to 0.10" },
              { value: "Not Set", label: "Not Set" },
              { value: "Round to 0.010", label: "Round to 0.010" },
            ]}
          />
        </div>

        <div className="grid xxl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6">
          <ERPDataCombobox
            field={{
              id: "roundingMethod",
              valueKey: "value",
              labelKey: "label",
            }}
            id="roundingMethod"
            label={t("rounding_method")}
            data={settings}
            value={settings?.roundingMethod}
            onChangeData={(data) =>
              handleFieldChange("roundingMethod", data.roundingMethod)
            }
            options={[
              { value: "Normal", label: "Normal" },
              { value: "No Rounding", label: "No Rounding" },
              { value: "Ceiling", label: "Ceiling" },
              { value: "Floor", label: "Floor" },
            ]}
          />
          <ERPDataCombobox
            field={{
              id: "pOSRoundingMethod",
              valueKey: "value",
              labelKey: "label",
            }}
            id="pOSRoundingMethod"
            label={t("sales_rounding_method")}
            value={settings?.pOSRoundingMethod}
            data={settings}
            onChangeData={(data) =>
              handleFieldChange("pOSRoundingMethod", data.pOSRoundingMethod)
            }
            options={[
              { value: "Normal", label: "Normal" },
              { value: "No Rounding", label: "No Rounding" },
              { value: "Ceiling", label: "Ceiling" },
              { value: "Floor", label: "Floor" },
              { value: "Round to 0.25", label: "Round to 0.25" },
              { value: "Round to 0.50", label: "Round to 0.50" },
              { value: "Round to 0.10", label: "Round to 0.10" },
              { value: "Floor Round to 0.50", label: "Floor Round to 0.50" },
              { value: "Floor Round to 0.25", label: "Floor Round to 0.25" },
              { value: "Floor Round to 0.10", label: "Floor Round to 0.10" },
              { value: "Not Set", label: "Not Set" },
              { value: "Round to 0.010", label: "Round to 0.010" },
            ]}
          />
          <ERPDataCombobox
            field={{
              id: "tax_DecimalPoint",
              valueKey: "value",
              labelKey: "label",
            }}
            id="tax_DecimalPoint"
            label={t("tax_decimal_points")}
            value={settings?.tax_DecimalPoint}
            data={settings}
            onChangeData={(data) =>
              handleFieldChange("tax_DecimalPoint", data.tax_DecimalPoint)
            }
            options={[
              { value: 0, label: "0" },
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
            ]}
          />
          <ERPDataCombobox
            field={{
              id: "unitPrice_decimalPoint",
              valueKey: "value",
              labelKey: "label",
            }}
            id="unitPrice_decimalPoint"
            label={t("unit_price_decimal_points")}
            value={settings?.unitPrice_decimalPoint}
            data={settings}
            defaultData={settings?.unitPrice_decimalPoint}
            onChangeData={(data) => {
              handleFieldChange(
                "unitPrice_decimalPoint",
                data.unitPrice_decimalPoint
              );
            }}
            options={[
              { value: 0, label: "0" },
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
            ]}
          />
        </div>

        <div className="grid xxl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6">
          <ERPCheckbox
            id="autoChangeTransactionDateByMidnight"
            label={t("auto_change_transaction")}
            data={settings}
            checked={settings.autoChangeTransactionDateByMidnight}
            onChangeData={(data) =>
              handleFieldChange(
                "autoChangeTransactionDateByMidnight",
                data.autoChangeTransactionDateByMidnight
              )
            }
          />
          <ERPInput
            id="autoUpdateReleaseUpTo"
            label={t("auto_update_release_up_to")}
            type="number"
            data={settings}
            value={settings.autoUpdateReleaseUpTo}
            disabled={!settings.autoChangeTransactionDateByMidnight}
            onChangeData={(data) =>
              handleFieldChange(
                "autoUpdateReleaseUpTo",
                data.autoUpdateReleaseUpTo
              )
            }
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 border rounded-lg p-4">
        <ERPInput
          id="oTPEmail"
          label={t("otp_email")}
          className="w-1/3"
          value={settings?.oTPEmail}
          data={settings}
          onChangeData={(data) => handleFieldChange("oTPEmail", data.oTPEmail)}
        />
        <div className="mt-4">
          <ERPButton
            title={t("send_otp")}
            variant="secondary"
            onClick={() => sendOtp()}
          />
        </div>
        <ERPInput
          id="oTPVerification"
          label=" "
          placeholder="Enter OTP"
          data={settings}
          className="w-32 mt-4"
          value={settings?.oTPVerification}
          onChangeData={(data) =>
            handleFieldChange("oTPVerification", data.oTPVerification)
          }
        />
        <div className="mt-4">
          <ERPButton
            title={t("verify")}
            variant="primary"
            onClick={() => verifyOtp()}
          />
        </div>
      </div>

      <div className="border p-4 flex flex-col gap-6 rounded-lg">
        <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6">
          <div className="flex items-center">
            <ERPCheckbox
              id="allowPrivilegeCard"
              label={t("allow_privilege_card")}
              data={settings}
              checked={settings?.allowPrivilegeCard}
              onChangeData={(data) =>
                handleFieldChange("allowPrivilegeCard", data.allowPrivilegeCard)
              }
            />
            <ERPInput
              id="previlegeCardPerc"
              label=" "
              type="number"
              data={settings}
              className="w-16 ml-6 mt-1"
              value={settings?.previlegeCardPerc}
              disabled={!settings.allowPrivilegeCard}
              onChangeData={(data) =>
                handleFieldChange("previlegeCardPerc", data.previlegeCardPerc)
              }
            />
          </div>
          <div className="flex items-center">
            <ERPCheckbox
              id="allowPostdatedTrans"
              label={t("allow_postdated_transaction")}
              data={settings}
              checked={settings?.allowPostdatedTrans}
              onChangeData={(data) =>
                handleFieldChange("allowPostdatedTrans", data.allowPostdatedTrans)
              }
            />
            <ERPInput
              id="postDatedTransInNumbers"
              type="number"
              label=" "
              data={settings}
              className="w-16 ml-6 mt-1"
              value={settings?.postDatedTransInNumbers}
              disabled={!settings.allowPostdatedTrans}
              onChangeData={(data) =>
                handleFieldChange(
                  "postDatedTransInNumbers",
                  data.postDatedTransInNumbers
                )
              }
            />
          </div>
          <div className="flex items-center">
            <ERPCheckbox
              id="allowPredatedTrans"
              label={t("allow_predated_transaction")}
              data={settings}
              checked={settings?.allowPredatedTrans}
              onChangeData={(data) =>
                handleFieldChange("allowPredatedTrans", data.allowPredatedTrans)
              }
            />
            <ERPInput
              id="preDatedTransInNumbers"
              label=" "
              type="number"
              data={settings}
              className="w-16 ml-6 mt-1"
              value={settings?.preDatedTransInNumbers}
              disabled={!settings.allowPredatedTrans}
              onChangeData={(data) =>
                handleFieldChange(
                  "preDatedTransInNumbers",
                  data.preDatedTransInNumbers
                )
              }
            />
          </div>
        </div>

        <div className="grid xxl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 gap-6">
          <ERPCheckbox
            id="maintainSeperatePrefixforCashSales"
            label={t("maintain_separate_prefix_for_cash_sales")}
            data={settings}
            checked={settings?.maintainSeperatePrefixforCashSales}
            onChangeData={(data) =>
              handleFieldChange(
                "maintainSeperatePrefixforCashSales",
                data.maintainSeperatePrefixforCashSales
              )
            }
          />

          <ERPCheckbox
            id="saveModTransSum"
            label={t("save_modified_transaction_summary")}
            data={settings}
            checked={settings?.saveModTransSum}
            onChangeData={(data) =>
              handleFieldChange("saveModTransSum", data.saveModTransSum)
            }
          />
          <ERPCheckbox
            id="maintainProduction"
            label={t("maintain_production")}
            data={settings}
            checked={settings?.maintainProduction}
            onChangeData={(data) =>
              handleFieldChange("maintainProduction", data.maintainProduction)
            }
          />
          <ERPCheckbox
            id="showReminders"
            label={t("show_reminders")}
            data={settings}
            checked={settings?.showReminders}
            onChangeData={(data) =>
              handleFieldChange("showReminders", data.showReminders)
            }
          />
          <ERPCheckbox
            id="enableSecondDisplay"
            label={t("enable_second_display")}
            data={settings}
            checked={settings?.enableSecondDisplay}
            onChangeData={(data) =>
              handleFieldChange("enableSecondDisplay", data.enableSecondDisplay)
            }
          />
          <ERPCheckbox
            id="allowSalesRouteArea"
            label={t("allow_sales_route/area")}
            data={settings}
            checked={settings.allowSalesRouteArea}
            onChangeData={(data) =>
              handleFieldChange("allowSalesRouteArea", data.allowSalesRouteArea)
            }
          />
          <ERPCheckbox
            id="enableDayEnd"
            label={t("enable_day_end")}
            data={settings}
            checked={settings?.enableDayEnd}
            onChangeData={(data) =>
              handleFieldChange("enableDayEnd", data.enableDayEnd)
            }
          />
          <ERPCheckbox
            id="maintainSalesRouteCreditLimit"
            label={t("maintain_sales")}
            data={settings}
            checked={settings.maintainSalesRouteCreditLimit}
            onChangeData={(data) =>
              handleFieldChange(
                "maintainSalesRouteCreditLimit",
                data.maintainSalesRouteCreditLimit
              )
            }
          />
          <ERPCheckbox
            id="maintainMultilanguage__"
            label={t("maintain_multilanguage")}
            data={settings}
            checked={settings?.maintainMultilanguage__}
            onChangeData={(data) =>
              handleFieldChange(
                "maintainMultilanguage__",
                data.maintainMultilanguage__
              )
            }
          />
          <ERPCheckbox
            id="showUserMessages"
            label={t("show_user_messages")}
            data={settings}
            checked={settings?.showUserMessages}
            onChangeData={(data) =>
              handleFieldChange("showUserMessages", data.showUserMessages)
            }
          />
        </div>
      </div>

      {/* <div className="flex justify-end">
        <ERPButton title={t("save_settings")} variant="primary" type="submit" />
      </div> */}
      </form>
      <div className="flex justify-end items-center p-4">
      <ERPButton
        title={t("save_settings")}
        variant="primary"
        type="button"
        loading={isSaving}
        disabled={isSaving}
        onClick={()=>handleSubmit}
      />
    </div>
    </div>
  );
};

export default ERPSettingsFormMain;
