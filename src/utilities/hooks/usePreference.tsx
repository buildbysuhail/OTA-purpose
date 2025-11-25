import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./useAppDispatch";
import { getAction } from "../../redux/slices/app-thunks";
import { GridPreference, DevGridColumn } from "../../components/types/dev-grid-column";
import { APIClient } from "../../helpers/api-client";
import { applyGridColumnPreferences, getInitialPreference } from "../dx-grid-preference-updater";


const usePreferenceData = (columns: DevGridColumn[], gridId?: string,initialPreferences?: GridPreference | null) => {


  const [preferences, setPreferences] = useState<GridPreference>();
  const [gridCols, setGridCols] = useState<DevGridColumn[]>(columns);
  const hasFetchedRef = useRef(false);
   useEffect(() => {
        
      const fetchPreferences = async () => {
             // If initialPreferences provided, use them instead of fetching
      if (initialPreferences) {
        console.log("✅ Using provided preferences for:", gridId);
        onApplyPreferences(initialPreferences);
        return;
      }
      // Only fetch if we haven't fetched yet and no initialPreferences
      if (!hasFetchedRef.current && gridId && columns) {
        hasFetchedRef.current = true;
        console.log("🔵 Fetching preferences from API for:", gridId);
        const prefs = await getInitialPreference(gridId, columns, new APIClient());
        onApplyPreferences(prefs);
      }
    };
       fetchPreferences();
    }, [initialPreferences,gridId,columns]);

  // Re-apply when initialPreferences change (after save)
  useEffect(() => {
    if (initialPreferences) {
      console.log("🔄 Preferences updated for:", gridId);
      onApplyPreferences(initialPreferences);
    }
  }, [initialPreferences]);

   const onApplyPreferences = useCallback(
      (pref: GridPreference) => {
        
        setPreferences(pref);
        const updatedColumns = applyGridColumnPreferences(columns, pref);
        setGridCols(updatedColumns);
      },
      [columns,gridId]
    );

    return {
      onApplyPreferences, preferences, gridCols
    }
};

export default usePreferenceData;
