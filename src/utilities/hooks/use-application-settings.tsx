import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { getAction } from "../../redux/slices/app-thunks";
import { ApplicationSettingsIds } from "../../pages/settings/system/application-settings-categories";
import { RootState } from "../../redux/store";
import { ApplicationSettingsType } from "../../pages/settings/system/application-settings-types";

const useApplicationSetting = (endPointUrl?: string): ApplicationSettingsType => {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    if (endPointUrl) {
      appDispatch(getAction({ apiUrl: endPointUrl }));
    }
  }, [endPointUrl, appDispatch]);

  return useAppSelector((state: RootState) => (state.ApplicationSettings));
};
export default useApplicationSetting;