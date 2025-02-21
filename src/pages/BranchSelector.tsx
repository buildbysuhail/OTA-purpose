import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import usFlag from "../assets/images/flags/us_flag.png";
import { useNavigate } from "react-router-dom";
import { BuildingOfficeIcon, LinkIcon } from "@heroicons/react/24/outline";
import { handleResponse } from "../utilities/HandleResponse";
import { setBranch, userSession } from "../redux/slices/user-session/thunk";
import { useAppDispatch, useAppSelector } from "../utilities/hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { BranchSelectDto, UserModel } from "../redux/slices/user-session/reducer";
import ErpAvatar from "../components/ERPComponents/erp-avatar";
import Cookies from "js-cookie";
import { customJsonParse, modelToBase64 } from "../utilities/jsonConverter";
import { AppState, languagesData, Theme } from "../redux/slices/app/types";
import { syncAppStates } from "./auth/syncSettings";
import { CircularProgress } from "@mui/material";
import { UserTypeRights } from "../redux/slices/user-rights/reducer";
import { setApplicationSettings } from "../redux/slices/app/application-settings-reducer";
import { APIClient } from "../helpers/api-client";
import Urls from "../redux/urls";
import ERPModal from "../components/ERPComponents/erp-modal";
import CounterSettings from "./settings/system/counter-settings";
import { ClientSessionModel } from "../redux/slices/client-session/reducer";

interface ChildComponentProps {
  onLoadingChange: (isLoading: boolean) => void;
}

const api = new APIClient();
const BranchSelector: React.FC<ChildComponentProps> = ({ onLoadingChange }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<number>();
  const [selectionLoading, setSelectionLoading] = useState<{loading: boolean, clientId: number, branchId: number}>({loading: false, clientId: 0, branchId: 0});

  const UserSession = useAppSelector((state: RootState) => state?.UserBranches);
  let userBranches = useAppSelector((state: RootState) => state.UserBranches);
  const [error, setError] = useState<any>();const [counterSettings, setCounterSettings] = useState<{
    show: boolean;
    token: string;
  }>({ show: false, token: "" });

  /* ########################################################################################### */
  const avatarStyle = useMemo(() => {
    return { width: 40, height: 40 };
  }, []);
  const changeHandler = async (item: BranchSelectDto) => {
    onLoadingChange(true);
    setSelectionLoading({loading: true, clientId: item?.clientId, branchId: item?.id});
    const branch = {
      branchId: item?.id,
      clientId: item.clientId
    } as any;

    const response = await dispatch(setBranch(branch)).unwrap();
    setSelectionLoading({loading: false, clientId: 0, branchId: 0});
    
    onLoadingChange(false);
    if (response.isOk == true) {   
     
      localStorage.setItem("token", response.item.token); 
      localStorage.setItem("up", response.item.userProfileDetails); 
      localStorage.setItem("cs", response.item.clientSessions);
      localStorage.setItem("ut", response.item.userThemes); 
      localStorage.setItem("ur", response.item.userRights);
      const _userRights = atob(response.item.userRights);
      const userRights: UserTypeRights[] = customJsonParse(_userRights);
      const _userProfileDetails = atob(response.item.userProfileDetails);
      const userProfileDetails: UserModel = customJsonParse(_userProfileDetails);
      const _userThemes = atob(response.item.userThemes);
      const userThemes: AppState = customJsonParse(_userThemes);
      let locale = (languagesData.find((l) => l.code == userProfileDetails.language))??{ code: 'en', name: 'English', flag: usFlag, rtl: false };
        const clientSession: ClientSessionModel = 
                customJsonParse(response.item.clientSessions);
      syncAppStates(dispatch,userThemes,clientSession, userProfileDetails,userRights, locale);  
      const settings = await api.getAsync(Urls.application_setting);
          localStorage.setItem('as', modelToBase64(settings))
      dispatch(setApplicationSettings(
        {
          ...settings,
          apiLoaded: true
      }));        
    }
    else {
      if (response.item.hasToSetCounter) {
        localStorage.removeItem("_token");
        localStorage.setItem("_token", response.item.token);
        setCounterSettings({ show: true, token: response.item.token });
      } else {
        setError(response.message);
      }
    }
    handleResponse(response, () => {
      // navigate("/")
    });

    setSelected(undefined);
  };


  /* ########################################################################################### */


  /* ########################################################################################### */

  return (
    <>
      
     
      <div className="flex flex-col gap-3 sm:col-span-2">
        {userBranches?.branches?.map((item: BranchSelectDto, index: number) => (
          <div
            key={`org-${index}`}
            onClick={() => {
              if(item?.isActive == false) {
                setSelected(index);
                changeHandler(item);
              }
            }}
            onKeyDown={(e) => {
              
              if(item?.isActive == false) {
                if (e.key === "Enter") {
                  setSelected(index);
                  changeHandler(item);
                }
              }
            }}
            tabIndex={0}
            className={`${
              item?.isActive ? "dark:bg-dark-hover-bg bg-gray-50 cursor-default relative" : "dark:bg-dark-bg-card bg-white cursor-pointer hover:bg-gray-50 relative"
            } px-4 py-3  rounded-lg flex justify-start border dark:border-dark-border border-gray-200`}
          >
           {(selectionLoading.loading && selectionLoading.clientId == item?.clientId && selectionLoading.branchId == item?.id) &&  <div className="absolute w-full h-full  rounded-lg dark:bg-dark-bg-header/80 bg-gray-50/80 z-[1] top-0 left-0 flex items-center justify-center">
            <CircularProgress className="" color="inherit" size={25} />
          </div>}
      <span className="avatar avatar-md avatar-badge pr-4">
                            <ErpAvatar
                              variant="square"
                              alt=""
                              src={
                                item.logo
                              }
                              sx={avatarStyle}
                            />
                          </span>
      <div className="text-xs dark:text-dark-text text-gray-700 flex flex-col pl-4">
        <a className="text-left">
          {item?.clientName}
        </a>
        <a className="capitalize text-gray-500 flex gap-2 items-center" style={{    minWidth:'max-content' }}>
          {item?.isActive ? (
            <span className="text-sm">🏢</span> // Building emoji for active
          ) : (
            <span className="text-sm">🔗</span> // Link emoji for inactive
          )}
          <span>{item?.name}</span>
          <span className="lowercase"> •{item.userName}</span>
        </a>
      </div>
            <div className="flex w-full text-right place-content-end">
              {item?.isActive ? (
                <div className="shrink-0 text-blue-500 content-center">
                  <CheckIcon className="h-6 w-6 text-gray-50" />
                </div>
              ) : (
                selected === index && <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-blue-600/20"></div>
              )}
            </div>
          </div>
        ))}
        {/* <div href="/create-organization?addNew"> */}
        {/* <div
          onClick={() => navigate("/create-organization?addNew")}
          className="flex cursor-pointer hover:bg-gray-50 rounded-md gap-2 border-accent items-center justify-center w-full h-[40px] border-dashed border"
        >
          <AddIcon className="h-5 w-5 text-gray-50" />
          <div className=" text-sm text-accent">{t("add-organization")}</div>
        </div> */}
      </div>
      {/* </div> */}
      <ERPModal
        isForm={true}
        isOpen={counterSettings.show}
        closeButton="LeftArrow"
        hasSubmit={false}
        closeTitle="Close"
        title="Counter Settings"
       width={600}
        isFullHeight={true}
        closeModal={() => {
          setCounterSettings({ show: false, token: "" });
        }}
        content={<CounterSettings token={counterSettings.token} />}
      ></ERPModal>
    </>
  );
};

export default BranchSelector;

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="rgba(37,99,235,1)" opacity="0.2" />
      <path d="M7 13l3 3 7-7" stroke="rgba(37,99,235,1)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AddIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-accent w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
