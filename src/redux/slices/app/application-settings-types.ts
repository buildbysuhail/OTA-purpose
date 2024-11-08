import { ApplicationInventorySettingsInitialState } from "../../../pages/settings/system/application-settings-inventory";
import { ApplicationMiscellaneousSettingsInitialState } from "../../../pages/settings/system/application-settings-miscellaneous";
import { ApplicationBranchSettings, ApplicationBranchSettingsInitialState, ApplicationMainSettings, ApplicationMainSettingsInitialState, ApplicationSettingsType, } from "../../../pages/settings/system/application-settings-types";

export const ApplicationSettingsInitialState: ApplicationSettingsType = {
  mainSettings: ApplicationMainSettingsInitialState,
  branchSettings: ApplicationBranchSettingsInitialState,
  inventorySettings:ApplicationInventorySettingsInitialState,
  miscellaneousSettings: ApplicationMiscellaneousSettingsInitialState
}
