import { ApplicationBranchSettings, ApplicationBranchSettingsInitialState, ApplicationMainSettings, ApplicationMainSettingsInitialState, } from "../../../pages/settings/system/application-settings-types";

export interface ApplicationSettings {
  branch: ApplicationBranchSettings;
  main: ApplicationMainSettings;
}
export const ApplicationSettingsInitialState: ApplicationSettings = {
  branch: ApplicationBranchSettingsInitialState,
  main: ApplicationMainSettingsInitialState
}
