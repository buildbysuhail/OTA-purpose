// gridPreferencesUtil.ts

import { ColumnPreference, DevGridColumn, GridPreference, initialGridPreference } from "../components/types/dev-grid-column";
import { APIClient } from "../helpers/api-client";
import Urls from "../redux/urls";
import { getStorageString, setStorageString } from "./storage-utils";
import { capitalizeAndAddSpace, removeSpacesAndCapitalize } from "./Utils";

export function applyGridColumnPreferences(columns: DevGridColumn[], preferences?: GridPreference): DevGridColumn[] {
  // Update columns based on preferences
  if (!preferences) {
    return columns;
  }
  const updatedColumns = columns.map(column => {
    const preference = preferences?.columnPreferences?.find(p => p.dataField === column.dataField);
    if (preference) {
      return {
        ...column,
        width: preference.width,
        alignment: preference.alignment,
        visible: preference.visible,
        readOnly: preference.readOnly,
        fontBold: preference.fontBold,
        fontColor: preference.fontColor,
        fontSize: preference.fontSize,
        displayOrder: preference.displayOrder,
        showInPdf: preference.showInPdf,
    allowEditing: column.allowEditing ?? false,
        // Apply other preferences as needed
      };
    }
    return column;
  });

  // Sort columns based on displayOrder
  updatedColumns.sort((a, b) => {
    const orderA = preferences?.columnPreferences?.findIndex(p => p.dataField === a.dataField) || 0;
    const orderB = preferences?.columnPreferences?.findIndex(p => p.dataField === b.dataField) || 0;
    return orderA - orderB;
  });

  return updatedColumns;
}
export function getDefaultColumnPreference(column: DevGridColumn, index: number): ColumnPreference {
    return {
      ...column,
    dataField: column.dataField??"",
    isLocked: column.isLocked??false,    
    caption: column.caption??capitalizeAndAddSpace(column.dataField??""),
    width: column.width,
    alignment: column.alignment??'left',
    visible: column.visible??true,
    fontBold: false,
    fontColor: '',
    fontSize: 0,
    displayOrder: index,
    showInPdf: column.showInPdf?? false,
    readOnly: column.readOnly ?? false,
    allowEditing: column.allowEditing ?? false,
    decimalPoint: column.decimalPoint,
    }
  };
export const getInitialPreference = async(gridId: any, columns: any, api: APIClient) =>{
  if(gridId == "grd_inv_transaction_PI") {
    
  }
     const savedPreferences =await getStorageString(`gridPreferences_${gridId}`);
    
    let updatedPreferences: GridPreference;

    let parsedPreferences: GridPreference;
    if (savedPreferences != "undefined" && savedPreferences != undefined && savedPreferences != null && savedPreferences != `""` && savedPreferences != "") {
      
      parsedPreferences = JSON.parse(savedPreferences) as GridPreference;
    } else {
      const res = await api.getAsync(`${Urls.grid_preference}/${gridId}`);
       await setStorageString(`gridPreferences_${gridId}`,JSON.stringify(res));
     parsedPreferences = res && res as GridPreference;
    }
  
    if(parsedPreferences) {    
      
       parsedPreferences.columnPreferences = parsedPreferences.columnPreferences.map((pref, index) =>  {
        return {
          ...pref,
          order: index+1 
        }
       })
      const mergedPreferences = new Array<ColumnPreference>();
      // Add any remaining columns that weren't in parsedPreferences.columnPreferences
      const outIdex = 2000;
      columns?.forEach((column: any, index: any) => {
        // if (columnMap.has(column.dataField)) {
           let colPreference = parsedPreferences.columnPreferences.find(x => x.dataField == column.dataField);
          colPreference =  colPreference == undefined ? {...getDefaultColumnPreference(column, index) as any, order: outIdex+index} as ColumnPreference : colPreference;
          mergedPreferences.push({
            ...colPreference,
            dataField: column.dataField ?? removeSpacesAndCapitalize(column.caption ?? ""),
          });
        // }
      });
      mergedPreferences.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      updatedPreferences = {
        ...parsedPreferences,
        columnPreferences: mergedPreferences
      };
      return updatedPreferences;
    } else {
      let initialPreferences: any = [];
       (columns || []).map((column: DevGridColumn, index: number) => {
        const preference = getDefaultColumnPreference(column, index);
        // console.log(`Column:`, column, `Preference:`, preference); // Log each preference
        initialPreferences.push(preference);
      });

      updatedPreferences = {
        ...initialGridPreference,
        columnPreferences: initialPreferences
      };
      return updatedPreferences
    }
}
