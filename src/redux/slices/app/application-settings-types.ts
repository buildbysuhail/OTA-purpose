import { ApplicationSettingsType } from "../../../pages/settings/system/application-settings-types/application-settings-types";
import { ApplicationAccountSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-accounts";
import { ApplicationBackupSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-backup";
import { ApplicationBranchSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-branch";
import { ApplicationGstSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-gst";
import { ApplicationInventorySettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-inventory";
import { ApplicationMainSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-main";
import { ApplicationMiscellaneousSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-miscellaneous";
import { ApplicationPrintSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-print";
import { ApplicationProductsSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-products";
import { ApplicationTaxSettingsInitialState } from "../../../pages/settings/system/application-settings-types/application-settings-types-tax";

export const ApplicationSettingsInitialState: ApplicationSettingsType = {
  mainSettings: ApplicationMainSettingsInitialState,
  branchSettings: ApplicationBranchSettingsInitialState,
  inventorySettings: ApplicationInventorySettingsInitialState,
  miscellaneousSettings: ApplicationMiscellaneousSettingsInitialState,
  accountsSettings: ApplicationAccountSettingsInitialState,
  backUpSettings: ApplicationBackupSettingsInitialState,
  printSettings: ApplicationPrintSettingsInitialState,
  productsSettings: ApplicationProductsSettingsInitialState,
  gstSettings: ApplicationGstSettingsInitialState,
  taxSettings: ApplicationTaxSettingsInitialState
}