import "i18next";
import mainEn from "./locales/en/main-En.json";
import mastersEn from "./locales/en/masters-En.json";
import userManageEn from "./locales/en/userManage-En.json";
import administrationEn from "./locales/en/administration-En.json";
import applicationSettingsEn from "./locales/en/applicationSettings-En.json";
import systemEn from "./locales/en/system-En.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "main";
    resources: {
      main: typeof mainEn;
      masters: typeof mastersEn;
      userManage: typeof userManageEn;
      administration: typeof administrationEn;
      applicationSettings: typeof applicationSettingsEn;
      system: typeof systemEn;
    };
  }
}