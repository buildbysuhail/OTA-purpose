// gridPreferencesUtil.ts

import { ColumnPreference, DevGridColumn, GridPreference, initialGridPreference } from "../components/types/dev-grid-column";
import { capitalizeAndAddSpace, removeSpacesAndCapitalize } from "./Utils";

export function applyGridColumnPreferences(columns: DevGridColumn[], preferences?: GridPreference): DevGridColumn[] {
  // Update columns based on preferences
  if (!preferences) {
    return columns;
  }
  const updatedColumns = columns.map(column => {
    const preference = preferences?.columnPreferences.find(p => p.dataField === column.dataField);
    if (preference) {
      return {
        ...column,
        caption: preference.caption,
        width: preference.width,
        alignment: preference.alignment,
        visible: preference.visible,
        readOnly: preference.readOnly,
        fontBold: preference.fontBold,
        fontColor: preference.fontColor,
        fontSize: preference.fontSize,
        displayOrder: preference.displayOrder,
        showInPdf: preference.showInPdf
        // Apply other preferences as needed
      };
    }
    return column;
  });

  // Sort columns based on displayOrder
  updatedColumns.sort((a, b) => {
    const orderA = preferences?.columnPreferences.findIndex(p => p.dataField === a.dataField) || 0;
    const orderB = preferences?.columnPreferences.findIndex(p => p.dataField === b.dataField) || 0;
    return orderA - orderB;
  });

  return updatedColumns;
}
export function getDefaultColumnPreference(column: DevGridColumn, index: number): ColumnPreference {
    return {
        dataField: column.dataField??"",
    isLocked: column.isLocked??false,    
    caption: column.caption??capitalizeAndAddSpace(column.dataField??""),
    width: column.width,
    alignment: column.alignment??'left',
    visible: column.visible??true,
    readOnly: false,
    fontBold: false,
    fontColor: '',
    fontSize: 0,
    displayOrder: index,
    showInPdf: column.showInPdf?? false
    }
  };
export function getInitialPreference(gridId: any, columns: any) {
    const savedPreferences = localStorage.getItem(`gridPreferences_${gridId}`);
    
    let updatedPreferences: GridPreference;

    if (savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences) as GridPreference;
      const mergedPreferences = new Array<ColumnPreference>();
      
      // Create a mapping of columns by their `dataField` for easy lookup
      const columnMap = new Map<string, DevGridColumn>();
      columns?.forEach((column: any) => {
        const dataField = column.dataField ?? removeSpacesAndCapitalize(column.caption ?? "");
        columnMap.set(dataField, column);
      });
      
      // Go through parsedPreferences.columnPreferences to preserve the order
      parsedPreferences.columnPreferences?.forEach((savedPreference) => {
        const column = columnMap.get(savedPreference.dataField);
        if (column) {
          mergedPreferences.push({
            ...savedPreference,
            dataField: savedPreference.dataField,
          });
          columnMap.delete(savedPreference.dataField); // Remove the matched column
        }
      });
      
      // Add any remaining columns that weren't in parsedPreferences.columnPreferences
      columns?.forEach((column: any, index: any) => {
        if (columnMap.has(column.dataField)) {
          const defaultPreference = getDefaultColumnPreference(column, index);
          mergedPreferences.push({
            ...defaultPreference,
            dataField: column.dataField ?? removeSpacesAndCapitalize(column.caption ?? ""),
          });
        }
      });
      
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
