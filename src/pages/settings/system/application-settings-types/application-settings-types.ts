import { ApplicationAccountSettings } from "./application-settings-types-accounts";
import { ApplicationBackupSettings } from "./application-settings-types-backup";
import { ApplicationBranchSettings } from "./application-settings-types-branch";
import { ApplicationGstSettings } from "./application-settings-types-gst";
import { ApplicationInventorySettings } from "./application-settings-types-inventory";
import { ApplicationMainSettings } from "./application-settings-types-main";
import { ApplicationMiscellaneousSettings } from "./application-settings-types-miscellaneous";
import { ApplicationPrintSettings } from "./application-settings-types-print";
import { ApplicationProductsSettings } from "./application-settings-types-products";
import { ApplicationTaxSettings } from "./application-settings-types-tax";

export interface ApplicationSettingsType {
  mainSettings: ApplicationMainSettings;
  accountsSettings: ApplicationAccountSettings;
  inventorySettings: ApplicationInventorySettings;
  branchSettings: ApplicationBranchSettings;
  backUPSettings: ApplicationBackupSettings;
  printerSettings: ApplicationPrintSettings;
  productsSettings: ApplicationProductsSettings;
  gSTTaxesSettings: ApplicationGstSettings;
  taxesSettings: ApplicationTaxSettings;
  miscellaneousSettings: ApplicationMiscellaneousSettings;
  apiLoaded: boolean
}