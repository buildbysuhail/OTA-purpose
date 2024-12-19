import { t } from "i18next";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDisableEnable from "../../../../components/ERPComponents/erp-disable-inable";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { useApplicationMainSettings } from "../../../../utilities/hooks/use-application-main-settings";
import { useTranslation } from "react-i18next";
interface ApplicationSettingsProps {
  settings: any; // Replace `any` with the actual type if known
  handleFieldChange: <T extends keyof ApplicationSettingsType>(
    type: T,
    settingName: keyof ApplicationSettingsType[T],
    value: any
  ) => void;
  filterComponent: (keys: string[], fText: string) => boolean;
  filterText: string;
  userSession: any; // Replace `any` with the actual type if known
  isCompactView: boolean;
  gridClass: string;
  sectionsRef: any;
  subItemsRef: MutableRefObject<Record<string, HTMLElement | null>>
  subItemsCatRef: any;
  blinkSection: string | null;
  handleGeneralHeaderClick: any;
  key: string;
}

const AccountsEinvoiceFilterableComponents: React.FC<ApplicationSettingsProps> = ({
  settings,
  handleFieldChange,
  filterComponent,
  filterText,
  userSession,
  isCompactView,
  gridClass,
  sectionsRef,
  subItemsRef,
  subItemsCatRef,
  blinkSection,
  handleGeneralHeaderClick,
  key,
}) => {
  const { verifyOtp, sendOtp, otpSending, otpVerifying } = useApplicationMainSettings();
  const { t } = useTranslation("applicationSettings")
  const items = [
    {
      condition: filterComponent([t("e-Invoice_sync_systemCode")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted) => (
            <ERPInput
              id="kSA_EInvoice_Sync_SystemCode"
              disabled={!hasPermitted}
              value={settings?.branchSettings.kSA_EInvoice_Sync_SystemCode}
              data={settings?.branchSettings}
              label={t("e-Invoice_sync_systemCode")}
              onChangeData={(data) =>
                handleFieldChange(
                  "branchSettings",
                  "kSA_EInvoice_Sync_SystemCode",
                  data.kSA_EInvoice_Sync_SystemCode
                )
              }
            />
          )}
        </ERPDisableEnable>
      ),
    },
    {
      condition: filterComponent([t("maintain_KSA_eInvoice")], filterText),
      element: (
        <ERPCheckbox
          id="maintainKSA_EInvoice"
          label={t("maintain_KSA_eInvoice")}
          disabled={settings?.branchSettings?.maintainTax === false}
          data={settings?.branchSettings}
          checked={settings?.branchSettings?.maintainKSA_EInvoice}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "maintainKSA_EInvoice",
              data.maintainKSA_EInvoice
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("apply_KSA_eInvoice_validation_rules")], filterText),
      element: (
        <ERPCheckbox
          id="apply_KSA_EInvoice_Validation_Rules"
          label={t("apply_KSA_eInvoice_validation_rules")}
          checked={settings?.branchSettings?.apply_KSA_EInvoice_Validation_Rules}
          data={settings?.branchSettings}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "apply_KSA_EInvoice_Validation_Rules",
              data.apply_KSA_EInvoice_Validation_Rules
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("create_credit_note_automatically_on_sales_edit")], filterText),
      element: (
        <ERPCheckbox
          id="createCreditNoteAutomaticallyOnSalesEdit"
          label={t("create_credit_note_automatically_on_sales_edit")}
          data={settings?.branchSettings}
          checked={settings?.branchSettings?.createCreditNoteAutomaticallyOnSalesEdit}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "createCreditNoteAutomaticallyOnSalesEdit",
              data.createCreditNoteAutomaticallyOnSalesEdit
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("otp_email")], filterText),
      element: (
        <div className="flex gap-4 items-center">
          <ERPInput
            id="oTPEmail"
            label={t("otp_email")}
            value={settings?.mainSettings?.oTPEmail}
            data={settings?.mainSettings}
            onChangeData={(data) =>
              handleFieldChange(
                "mainSettings",
                "oTPEmail",
                data.oTPEmail
              )
            }
          />
          <ERPButton
            title={t("send_otp")}
            variant="secondary"
            loading={otpSending}
            className="mt-4"
            disabled={otpSending}
            onClick={() => {
              
              sendOtp()
            }}
          />
        </div>
      )
    },
    {
      condition: filterComponent([t("otp_email")], filterText),
      element: (
        <div className="flex gap-4 items-center">
          <ERPInput
            id="oTPVerification"
            label=" "
            placeholder="Enter OTP"
            data={settings?.mainSettings}
            value={settings?.mainSettings?.oTPVerification}
            onChangeData={(data) =>
              handleFieldChange(
                "mainSettings",
                "oTPVerification",
                data.oTPVerification
              )
            }
          />
          <ERPButton
            title={t("verify")}
            variant="primary"
            loading={otpVerifying}
            disabled={otpVerifying}
            onClick={() => verifyOtp()}
          />
        </div>
      ),
    },
  ];
  const [hasMatchedItems, setHasMatchedItems] = useState<boolean>(true);
  useEffect(() => {
    const hasMatchingItems = items.some((component) => component.condition);
    setHasMatchedItems(hasMatchingItems);
  }, [filterText])

  return (
    <>
      {items.filter((component) => component.condition == true).length > 0 && (
        <div>
          <div key={key} ref={(el) => (subItemsRef.current["accountsEInvoiceGCC"] = el)}  >
            <h1
              className={`h-[50px] text-[20px] font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "accountsEInvoiceGCC"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"}`}
              onClick={handleGeneralHeaderClick}>
              {t("ksa_e-invoice")}
            </h1>
            <div key="accountsEInvoiceGCC" className="space-y-4">
              <div className="border border-solid border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg">
                <div
                  className={`grid ${isCompactView
                    ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                    : `${gridClass ||
                    "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                    } gap-4 items-center justify-center`}`}>
                  {items?.map(
                    (component: any, index: number) =>
                      component.condition && (
                        <div key={index}>{component.element}</div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
};
export default AccountsEinvoiceFilterableComponents;
