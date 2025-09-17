import { i18n } from "i18next";
import { Dispatch } from "@reduxjs/toolkit";
import { setLocale } from "../redux/slices/app/reducer";
import { setLanguage } from "../pages/auth/syncSettings";
import { customJsonParse, modelToBase64, modelToBase64Unicode } from "./jsonConverter";
import { initialUserSessionData, UserModel } from "../redux/slices/user-session/reducer";
import { initialThemeData, Locale, Theme, languagesData } from "../redux/slices/app/types";
import usFlag from "../assets/images/flags/us_flag.png";
import { getStorageString, setStorageString } from "./storage-utils";

/**
 * Changes the language of the application.
 * @param currentData - The selected language code.
 * @param dispatch - Redux dispatch function.
 * @param i18nInstance - i18next instance.
 */
export const changeLanguage = async(currentData: string, dispatch: Dispatch, i18nInstance: i18n) => {
  const locale = languagesData.find((l) => l.code === currentData) ?? {
    code: "en",
    name: "English",
    flag: usFlag,
    rtl: false,
  };

 await  setLocaleInStorage(locale);
  i18nInstance.changeLanguage(locale?.code);
  await setLanguage(dispatch, locale);
};

/**
 * Saves the selected locale in local storage.
 * @param locale - The selected language locale object.
 */
export const setLocaleInStorage = async(locale: Locale) => {
  let upt =  await getStorageString("up");
  let utt =await getStorageString("ut");

  let userProfileDetails: UserModel = initialUserSessionData;
  try {
    if (upt) {
      userProfileDetails = customJsonParse(atob(upt));
    }
  } catch (error) {
    console.error("Error parsing user profile data", error);
  }

  let userThemes: Theme = initialThemeData;
  try {
    if (utt) {
      userThemes = customJsonParse(atob(utt));
    }
  } catch (error) {
    console.error("Error parsing user theme data", error);
  }

  userProfileDetails.language = locale.code;
  userThemes.direction = locale.rtl ? "rtl" : "ltr";

  await setStorageString("up", modelToBase64Unicode(userProfileDetails));
  await setStorageString("ut", modelToBase64Unicode(userThemes));
};
