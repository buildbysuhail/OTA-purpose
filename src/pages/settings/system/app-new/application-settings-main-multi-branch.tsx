import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../../components/ERPComponents/erp-input";
import ERPDataCombobox from "../../../../components/ERPComponents/erp-data-combobox";
import ERPDisableEnable from "../../../../components/ERPComponents/erp-disable-inable";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import Urls from "../../../../redux/urls";
import { ApplicationSettingsType } from "../application-settings-types/application-settings-types";
import { MutableRefObject, useEffect, useState } from "react";
import ERPButton from "../../../../components/ERPComponents/erp-button";
import { LedgerType } from "../../../../enums/ledger-types";
import { useApplicationMiscSettings } from "../../../../utilities/hooks/use-application-misc-settings";
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

const MainMultiBranchFilterableComponents: React.FC<ApplicationSettingsProps> = ({
  settings,
  handleFieldChange,
  filterComponent,
  filterText,
  userSession,
  isCompactView,
  gridClass,
  subItemsRef,
  blinkSection,
  handleGeneralHeaderClick,
  key,
}) => {
  const {
    dataLoaded,
    systemCode,
    setAddSystemCode,
    addSystemCode,
    SystemCodeAddData,
    setSystemCodeAddData,
    isSavingSystemCode,
    postSystemCode,
    loadSystemCode,
    getSystemCode,
  } = useApplicationMiscSettings();
  const [showSystemCodeBox, setShowSystemCodeBox] = useState(false);
  const { t } = useTranslation("applicationSettings")
  const items = [
    {
      condition: filterComponent([t("default_BTO_account")], filterText),
      element: (
        <ERPDataCombobox
          isInModal={false}
          id="defaultBTOAccount"
          data={settings?.inventorySettings}
          field={{
            id: "defaultBTOAccount",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Sales_Account}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultBTOAccount",
              data.defaultBTOAccount
            )
          }
          label={t("default_BTO_account")}
        />
      ),
    },
    {
      condition: filterComponent([t("default_BTI_account")], filterText),
      element: (
        <ERPDataCombobox
          isInModal={false}
          id="defaultBTIAccount"
          data={settings?.inventorySettings}
          field={{
            id: "defaultBTIAccount",
            getListUrl: Urls.data_acc_ledgers,
            params: `ledgerID=0&ledgerType=${LedgerType.Purchase_Account}`,
            valueKey: "id",
            labelKey: "name",
          }}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "defaultBTIAccount",
              data.defaultBTIAccount
            )
          }
          label={t("default_BTI_account")}
        />
      ),
    },
    {
      condition: filterComponent([t("BTO_using_MSP")], filterText),
      element: (
        <ERPCheckbox
          id="bTOUsingMSP"
          checked={settings?.inventorySettings?.bTOUsingMSP}
          data={settings?.inventorySettings}
          label={t("BTO_using_MSP")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "bTOUsingMSP",
              data.bTOUsingMSP
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("use_cost_for_stock_transfer_to_branch")], filterText),
      element: (
        <ERPCheckbox
          id="useCostForStockTransferToBranch"
          checked={settings?.inventorySettings?.useCostForStockTransferToBranch}
          data={settings?.inventorySettings}
          label={t("use_cost_for_stock_transfer_to_branch")}
          onChangeData={(data: any) =>
            handleFieldChange(
              "inventorySettings",
              "useCostForStockTransferToBranch",
              data.useCostForStockTransferToBranch
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_synchronization")], filterText),
      element: (
        <div>
          <ERPCheckbox
            id="maintainSynchronization"
            checked={settings?.branchSettings?.maintainSynchronization}
            data={settings?.branchSettings}
            label={t("maintain_synchronization")}
            onChangeData={(data) =>
              handleFieldChange(
                "branchSettings",
                "maintainSynchronization",
                data.maintainSynchronization
              )
            }
          />
          <ERPDataCombobox
            isInModal={false}
            id="syncMethod"
            disabled={settings?.branchSettings?.maintainSynchronization === false}
            label=" "
            field={{
              id: "syncMethod",
              valueKey: "value",
              labelKey: "label",
            }}
            data={settings?.branchSettings}
            onChangeData={(data) =>
              handleFieldChange(
                "branchSettings",
                "syncMethod",
                data.syncMethod
              )
            }
            options={[
              { value: "Manual Sync", label: "Manual Sync" },
              { value: "Auto Sync", label: "Auto Sync" },
              { value: "Auto Sync and Upload Only", label: "Auto Sync and Upload Only" },
              { value: "Manual Sync and Upload Only", label: "Manual Sync and Upload Only" },
              { value: "Upload And Download", label: "Upload And Download" },
            ]}
          />
        </div>
      ),
    },
    {
      condition: filterComponent([t("intervals_(minutes)")], filterText),
      element: (
        <ERPInput
          id="syncIntervals"
          min={0}
          value={settings?.branchSettings?.syncIntervals}
          data={settings?.branchSettings}
          label={t("intervals_(minutes)")}
          disabled={
            settings?.branchSettings?.syncMethod !== "Auto Sync" &&
            settings?.branchSettings?.syncMethod !== "Auto Sync and Upload Only"
          }
          type="number"
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "syncIntervals",
              parseFloat(data.syncIntervals)
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("refresh_stock_after_sync")], filterText),
      element: (
        <ERPCheckbox
          id="refreshStockAfterSync"
          checked={settings?.branchSettings?.refreshStockAfterSync}
          data={settings?.branchSettings}
          disabled={!settings?.branchSettings?.maintainSynchronization}
          label={t("refresh_stock_after_sync")}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "refreshStockAfterSync",
              data.refreshStockAfterSync
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("refresh_server_stock_after_sync")], filterText),
      element: (
        <ERPCheckbox
          id="refreshServerStockAfterSync"
          checked={settings?.branchSettings?.refreshServerStockAfterSync}
          data={settings?.branchSettings}
          disabled={!settings?.branchSettings?.maintainSynchronization}
          label={t("refresh_server_stock_after_sync")}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "refreshServerStockAfterSync",
              data.refreshServerStockAfterSync
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_inventory_master_entry")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted) => (
            <ERPCheckbox
              id="maintainMasterEntry"
              label={t("maintain_inventory_master_entry")}
              disabled={!hasPermitted}
              data={settings?.branchSettings}
              checked={settings?.branchSettings?.maintainMasterEntry}
              onChangeData={(data) =>
                handleFieldChange(
                  "branchSettings",
                  "maintainMasterEntry",
                  data.maintainMasterEntry
                )
              }
            />
          )}
        </ERPDisableEnable>
      ),
    },
    {
      condition: filterComponent([t("maintain_inventory_transactions_entry")], filterText),
      element: (
        <ERPCheckbox
          id="maintainInventoryTransactionsEntry"
          label={t("maintain_inventory_transactions_entry")}
          data={settings?.branchSettings}
          checked={settings?.branchSettings?.maintainInventoryTransactionsEntry}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "maintainInventoryTransactionsEntry",
              data.maintainInventoryTransactionsEntry
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("use_branch_wise_sales_price")], filterText),
      element: (
        <ERPDisableEnable targetCount={5}>
          {(hasPermitted) => (
            <ERPCheckbox
              id="useBranchWiseSalesPrice"
              disabled={!hasPermitted}
              label={t("use_branch_wise_sales_price")}
              data={settings?.branchSettings}
              checked={settings?.branchSettings?.useBranchWiseSalesPrice}
              onChangeData={(data) =>
                handleFieldChange(
                  "branchSettings",
                  "useBranchWiseSalesPrice",
                  data.useBranchWiseSalesPrice
                )
              }
            />
          )}
        </ERPDisableEnable>
      ),
    },
    {
      condition: filterComponent([t("show_BTI_notification")], filterText),
      element: (
        <ERPCheckbox
          id="showBTINotification"
          checked={settings?.branchSettings?.showBTINotification}
          data={settings?.branchSettings}
          label={t("show_BTI_notification")}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "showBTINotification",
              data.showBTINotification
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("maintain_all_branch")], filterText),
      element: (
        <ERPCheckbox
          id="maintainAllBranchWithCommonInventory"
          checked={settings?.miscellaneousSettings?.maintainAllBranchWithCommonInventory}
          data={settings?.miscellaneousSettings}
          label={t("maintain_all_branch")}
          onChangeData={(data) =>
            handleFieldChange(
              "miscellaneousSettings",
              "maintainAllBranchWithCommonInventory",
              data.maintainAllBranchWithCommonInventory
            )
          }
        />
      ),
    },
    {
      condition: userSession.countryId === Countries.India && filterComponent([t("auto_sync")], filterText),
      element: (
        <ERPCheckbox
          id="autoSyncSIandPI_BT"
          checked={settings?.miscellaneousSettings?.autoSyncSIandPI_BT}
          data={settings?.miscellaneousSettings}
          label={t("auto_sync")}
          onChangeData={(data) =>
            handleFieldChange(
              "miscellaneousSettings",
              "autoSyncSIandPI_BT",
              data.autoSyncSIandPI_BT
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("apply_TAX_on_purchase_converted_to_BTO")], filterText),
      element: (
        <ERPCheckbox
          id="applyVATOnPurchaseToBTO"
          label={t("apply_TAX_on_purchase_converted_to_BTO")}
          data={settings?.branchSettings}
          checked={settings?.branchSettings?.applyVATOnPurchaseToBTO}
          onChangeData={(data) =>
            handleFieldChange(
              "branchSettings",
              "applyVATOnPurchaseToBTO",
              data.applyVATOnPurchaseToBTO
            )
          }
        />
      ),
    },
    {
      condition: filterComponent([t("set_system_code")], filterText),
      element: (
        <div>
          <button
            className="text-blue-500 underline"
            onClick={() => setShowSystemCodeBox(true)}
          >
            {t("set_system_code")}
          </button>
          {showSystemCodeBox && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="max-h-[300px] w-[300px] xxl:w-[250px] xxl:max-h-[350px] p-3 border border-gray-300 rounded-sm shadow-sm bg-white">
                <div className="flex justify-between items-center mb-5">
                  <h6 className="text-center font-medium">
                    {t("sync_systemCode")}
                  </h6>
                  <button
                    className="text-red-500 font-bold"
                    onClick={() => setShowSystemCodeBox(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="h-32 xxl:h-40 overflow-y-scroll snap-x mb-2 rounded-sm shadow-sm">
                  {!dataLoaded ? (
                    <div className="my-5 xxl:my-10">
                      <ul className="list-none text-center text-gray-500 snap-center">
                        <li className="py-5 xxl:py-10 px-3">
                          {t("click_load_to_fetch_system_code")}
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <ul className="list-none text-center snap-center">
                      {systemCode && systemCode.length > 0 ? (
                        systemCode.map(
                          (code: any, index: number) => (
                            <li className="p-1 text-xs" key={index}>
                              {code.systemCode}
                            </li>
                          )
                        )
                      ) : (
                        <li>{"No data available"}</li>
                      )}
                    </ul>
                  )}
                </div>
                <li className="flex justify-end mb-2">
                  <ERPButton
                    className="w-0 h-0 p-0 bg-white"
                    type="button"
                    onClick={() => setAddSystemCode(!addSystemCode)}
                    startIcon="ri-pencil-line"
                  />
                </li>
                {addSystemCode && (
                  <ERPInput
                    id="newSystemCode"
                    noLabel={true}
                    data={SystemCodeAddData}
                    value={SystemCodeAddData.systemCode}
                    onChange={(e) => {
                      setSystemCodeAddData({
                        ...SystemCodeAddData,
                        systemCode: e.target?.value,
                      });
                    }}
                    placeholder={"enter_new_system_code"}
                  />
                )}
                <div className="flex justify-end">
                  <ERPButton
                    startIcon="ri-refresh-line"
                    variant="secondary"
                    className="h-6 w-8 rounded-[2px]"
                    type="button"
                    loading={loadSystemCode}
                    disabled={loadSystemCode}
                    onClick={getSystemCode}
                  />
                  <ERPButton
                    startIcon="ri-save-line"
                    className="h-6 w-8 rounded-[2px]"
                    variant="primary"
                    type="button"
                    loading={isSavingSystemCode}
                    disabled={isSavingSystemCode}
                    onClick={postSystemCode}
                  />
                </div>
              </div>
            </div>
          )}
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
          <div key={key} ref={(el) => (subItemsRef.current["mainMultiBranch"] = el)}>
            <h1
              className={`h-[50px] text-[20px] dark:!bg-dark-bg-header dark:!text-dark-text font-normal flex items-center my-2 rounded-md px-2 ${blinkSection === "mainMultiBranch"
                ? "blink-animation bg-[#f1f1f1]"
                : "bg-[#f1f1f1]"
                }`}
              onClick={handleGeneralHeaderClick}>
              {t("multi_branch")}
            </h1>
            <div key="mainMultiBranch" className="space-y-4">
              <div className={`border border-solid dark:!bg-dark-bg dark:!border-dark-border border-[#e3e3e3] p-4 flex flex-col gap-6 rounded-lg`}>
                <div
                  className={`grid ${isCompactView
                    ? "grid-cols-1 gap-6 xxl:w-1/3 xl:w-2/4 sm:w-3/4"
                    : `${gridClass ||
                    "xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
                    } gap-4 items-center justify-center`
                    }`}>
                  {items?.map(
                    (component: any, index: number) =>
                      component.condition && (
                        <div key={index}>{component.element}</div>
                      )
                  )}
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
export default MainMultiBranchFilterableComponents;