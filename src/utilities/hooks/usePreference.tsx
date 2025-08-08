import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./useAppDispatch";
import { getAction } from "../../redux/slices/app-thunks";
import { GridPreference, DevGridColumn } from "../../components/types/dev-grid-column";
import { APIClient } from "../../helpers/api-client";
import { applyGridColumnPreferences, getInitialPreference } from "../dx-grid-preference-updater";


const usePreferenceData = (columns: DevGridColumn[], gridId?: string) => {
  const appDispatch = useAppDispatch();

const [preferences, setPreferences] = useState<GridPreference>();
        const [gridCols, setGridCols] = useState<DevGridColumn[]>([]);
 const onApplyPreferences = useCallback(
      (pref: GridPreference) => {
        setPreferences(pref);
        const updatedColumns = applyGridColumnPreferences(columns, pref);
        setGridCols(updatedColumns);
      },
      [columns]
    );
useEffect(() => {
        
      const fetchPreferences = async () => {
        onApplyPreferences(await getInitialPreference(
          gridId
            , columns
          , new APIClient()));
      };
      
      if (gridId != "" && columns != undefined && columns != null) {
        fetchPreferences();
      }
    }, [columns]);
  

    return {
      onApplyPreferences, preferences, gridCols
    }
};

export default usePreferenceData;
