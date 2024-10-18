import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./useAppDispatch";
import { getAction } from "../../redux/slices/app-thunks";
import { ApplicationSettingsIds } from "../../pages/settings/system/application-settings-categories";
import { RootState } from "../../redux/store";


const useApplicationSetting = (settingsType: ApplicationSettingsIds, endPointUrl?: string) => {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    endPointUrl && appDispatch(getAction({apiUrl: endPointUrl}));
  }, [endPointUrl]);

  return useSelector((state: any) => (settingsType ? state.ApplicationSettings?.[settingsType] : null));
};

export default useApplicationSetting;
