import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import mainEn from "./locales/en/main-En.json";
import mainAr from "./locales/ar/main-Ar.json";
import mastersEn from "./locales/en/masters-En.json";
import mastersAr from "./locales/ar/masters-Ar.json";
import userManageEn from "./locales/en/userManage-En.json";
import userManageAr from "./locales/ar/userManage-Ar.json";
import administrationEn from "./locales/en/administration-En.json";
import administrationAr from "./locales/ar/administration-Ar.json";
import applicationSettingsEn from "./locales/en/applicationSettings-En.json";
import applicationSettingsAr from "./locales/ar/applicationSettings-Ar.json";
import systemEn from "./locales/en/system-En.json";
import systemAr from "./locales/ar/system-Ar.json";
import integrationEn from "./locales/en/integration-En.json";
import integrationAr from "./locales/ar/integration-Ar.json";
import labelDesignerEn from "./locales/en/labelDesigner_En.json";
import labelDesignerAr from "./locales/ar/labelDesigner-Ar.json";
import accountsReportEn from "./locales/en/accountsReport-En.json";
import accountsReportAr from "./locales/ar/accountsReport-Ar.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "en",
  debug: true,
  ns: ["main", "masters", "userManage", "administration", "applicationSettings", "system", "integration","labelDesigner"],
  defaultNS: "main",
  resources: {
    en: {
      main: mainEn,
      masters: mastersEn,
      userManage: userManageEn,
      administration: administrationEn,
      applicationSettings: applicationSettingsEn,
      system: systemEn,
      integration: integrationEn,
      labelDesigner:labelDesignerEn,
      accountsReport:accountsReportEn
    },
    ar: {
      main: mainAr,
      masters: mastersAr,
      userManage: userManageAr,
      administration: administrationAr,
      applicationSettings: applicationSettingsAr,
      system: systemAr,
      integration: integrationAr,
      labelDesigner:labelDesignerAr,
      accountsReport:accountsReportAr
    },
  },
});

export default i18n;
