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

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "en",
  debug: true,
  ns: ["main", "masters", "userManage", "administration"], 
  defaultNS: "main", 
  resources: {
    en: {
      main: mainEn,
      masters: mastersEn,
      userManage: userManageEn,
      administration: administrationEn,
      applicationSettings:applicationSettingsEn
    },
    ar: {
      main: mainAr,
      masters: mastersAr,
      userManage: userManageAr,
      administration: administrationAr,
      applicationSettings:applicationSettingsAr
    },
  },
});

export default i18n;
