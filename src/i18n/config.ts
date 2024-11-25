import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import en from "./locales/en/translations.json";
// import ar from "./locales/ar/translations.json";

i18n.use(initReactI18next).init({
  // fallbackLng: "en",
  // lng: "en",
  // debug: true,
  // resources: {
  //   en: {
  //     translations: en,
  //   },
  //   ar: {
  //     translations: ar,
  //   },
  // },
  // ns: ["translations"],
  // defaultNS: "translations",
});

i18n.languages = ["en", "ar"];

export default i18n;
