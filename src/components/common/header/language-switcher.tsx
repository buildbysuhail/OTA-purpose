import { FC, Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../utilities/hooks/useAppState";
import { AppState, initialThemeData, languagesData, Locale, Theme } from "../../../redux/slices/app/types";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
import * as switcherdata from "../../../components/common/switcher/switcherdata/switcherdata";
import { setLocale } from "../../../redux/slices/app/reducer";
import { setLanguage } from "../../../pages/auth/syncSettings";
import Cookies from "js-cookie";
import { initialUserSessionData, UserModel } from "../../../redux/slices/user-session/reducer";
import { customJsonParse, modelToBase64 } from "../../../utilities/jsonConverter";
import usFlag from "../../../assets/images/flags/us_flag.png";
import { changeLanguage } from "../../../utilities/languageUtils";

interface HeaderProps {className?: string}

const LanguageSwitcher: FC<HeaderProps> = ({className}) => {
 
  const [languages, setLanguages] = useState<Locale[]>(languagesData);
  
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [reloading, setReloading] = useState(false);
  const { appState, updateAppState } = useAppState();
  let dispatch = useAppDispatch();

  const handleLanguageSelect = (language: Locale) => {
    
    language.rtl ? switcherdata.Rtl(updateAppState, appState): switcherdata.Ltr(updateAppState, appState);
    changeLanguage(language.code, dispatch, i18n);
    navigate(0);
  };


  return (
    <div  className={`header-element py-[1rem] md:px-[0.65rem] px-2 header-country hs-dropdown ti-dropdown hidden sm:block [--placement:bottom-left] ${className || ''}`}>
    <button id="dropdown-flag" type="button"
      className="hs-dropdown-toggle ti-dropdown-toggle !p-0 flex-shrink-0  !border-0 !rounded-full !shadow-none">
      <img src={appState?.locale?.flag} alt="flag-img" className="h-[1.25rem] w-[1.25rem] rounded-full" />
    </button>

    <div className="hs-dropdown-menu ti-dropdown-menu min-w-[10rem] hidden !-mt-3" aria-labelledby="dropdown-flag">
      <div className="ti-dropdown-divider divide-y divide-gray-200 dark:divide-white/10">
        <div className="py-2 first:pt-0 last:pb-0">
        {languagesData.map((language,index) => (
          <div key={index} className="ti-dropdown-item !p-[0.65rem] ">
            <a  onClick={() => handleLanguageSelect(language)} className="flex items-center cursor-pointer space-x-2 rtl:space-x-reverse w-full">
              <div className="h-[1.375rem] flex items-center w-[1.375rem] rounded-full">
                <img src={language?.flag} alt="flag-img"
                  className="h-[1rem] w-[1rem] rounded-full" />
              </div>
              <div>
                <p className="!text-[0.8125rem] font-medium">
                  {language.name}
                </p>
              </div>
            </a>
          </div>
        ))}
          
        </div>
      </div>
    </div>
  </div>
  );
};
export default LanguageSwitcher;
