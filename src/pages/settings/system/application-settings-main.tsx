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
      debugger;
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
          debugger;
          debugger;
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border p-4 flex flex-col gap-6 rounded-lg">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
          <ERPDataCombobox
            field={{
              id: "maintainBusinessType",
              valueKey: "value",
              labelKey: "label",
            }}
            id="maintainBusinessType"
            label="Business Type"
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
            label="Currency"
          />
          <ERPDataCombobox
            field={{
              id: "cashSalesVoucherPrefix",
              valueKey: "value",
              labelKey: "label",
            }}
            id="cashSalesVoucherPrefix"
            label="Currency Format"
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
            label="Decimal Points"
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
            label="Rounding Method Global"
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

        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
          <ERPDataCombobox
            field={{
              id: "roundingMethod",
              valueKey: "value",
              labelKey: "label",
            }}
            id="roundingMethod"
            label="Rounding Method"
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
            label="Sales Rounding Method"
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
            label="Tax Decimal Points"
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
            label="Unit Price Decimal Points"
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

        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
          <ERPCheckbox
            id="autoChangeTransactionDateByMidnight"
            label="Auto Change Transaction Date By 12:00 AM"
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
            label="Auto Update Release Up To"
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
          label="OTP Email"
          className="w-1/3"
          value={settings?.oTPEmail}
          data={settings}
          onChangeData={(data) => handleFieldChange("oTPEmail", data.oTPEmail)}
        />
        <div className="mt-4">
          <ERPButton
            title="Send OTP"
            variant="secondary"
            onClick={() => sendOtp()}
          />
        </div>
        <ERPInput
          id="oTPVerification"
          placeholder="Enter OTP"
          data={settings}
          className="w-32"
          value={settings?.oTPVerification}
          onChangeData={(data) =>
            handleFieldChange("oTPVerification", data.oTPVerification)
          }
        />
        <div className="mt-4">
          <ERPButton
            title="Verify"
            variant="primary"
            onClick={() => verifyOtp()}
          />
        </div>
      </div>

      <div className="border p-4 flex flex-col gap-6 rounded-lg">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-6">
          <div className="flex items-center">
            <ERPCheckbox
              id="allowPrivilegeCard"
              label="Allow Privilege Card"
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
              label="Allow Postdated Transaction"
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
              label="Allow Predated Transaction"
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

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-6">
          <ERPCheckbox
            id="maintainSeperatePrefixforCashSales"
            label="Maintain Separate Prefix for Cash Sales"
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
            label="Save Modified Transaction Summary"
            data={settings}
            checked={settings?.saveModTransSum}
            onChangeData={(data) =>
              handleFieldChange("saveModTransSum", data.saveModTransSum)
            }
          />
          <ERPCheckbox
            id="maintainProduction"
            label="Maintain Production"
            data={settings}
            checked={settings?.maintainProduction}
            onChangeData={(data) =>
              handleFieldChange("maintainProduction", data.maintainProduction)
            }
          />
          <ERPCheckbox
            id="showReminders"
            label="Show Reminders"
            data={settings}
            checked={settings?.showReminders}
            onChangeData={(data) =>
              handleFieldChange("showReminders", data.showReminders)
            }
          />
          <ERPCheckbox
            id="enableSecondDisplay"
            label="Enable Second Display"
            data={settings}
            checked={settings?.enableSecondDisplay}
            onChangeData={(data) =>
              handleFieldChange("enableSecondDisplay", data.enableSecondDisplay)
            }
          />
          <ERPCheckbox
            id="allowSalesRouteArea"
            label="Allow Sales Route/Area"
            data={settings}
            checked={settings.allowSalesRouteArea}
            onChangeData={(data) =>
              handleFieldChange("allowSalesRouteArea", data.allowSalesRouteArea)
            }
          />
          <ERPCheckbox
            id="enableDayEnd"
            label="Enable Day End"
            data={settings}
            checked={settings?.enableDayEnd}
            onChangeData={(data) =>
              handleFieldChange("enableDayEnd", data.enableDayEnd)
            }
          />
          <ERPCheckbox
            id="maintainSalesRouteCreditLimit"
            label="Maintain Sales Route Credit Limit"
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
            label="Maintain Multilanguage"
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
            label="Show User Messages"
            data={settings}
            checked={settings?.showUserMessages}
            onChangeData={(data) =>
              handleFieldChange("showUserMessages", data.showUserMessages)
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <ERPButton title="Save Settings" variant="primary" type="submit" />
      </div>
    </form>
  );
};

export default ERPSettingsFormMain;
