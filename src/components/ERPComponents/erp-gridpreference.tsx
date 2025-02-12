import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import ERPInput from "./erp-input";
import { LockClosedIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { capitalizeAndAddSpace, moveArrayElement } from "../../utilities/Utils";
import ERPSubmitButton from "./erp-submit-button";
import ERPModal from "./erp-modal";
import { ColumnPreference, DevGridColumn, GridPreference, initialGridPreference } from "../types/dev-grid-column";
import { getInitialPreference } from "../../utilities/dx-grid-preference-updater";
import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";
import { useTranslation } from "react-i18next";
interface GridPreferenceChooserProps {
  gridId: string;
  columns: DevGridColumn[];
  onApplyPreferences: (pref: any) => void;
  ShowGridPreferenceChooserInRow?: boolean
}
const api = new APIClient();

const GridPreferenceChooser: FC<GridPreferenceChooserProps> = ({
  gridId,
  columns,
  onApplyPreferences,
  ShowGridPreferenceChooserInRow
}) => {

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [searchCols, setSearchCols] = useState<String>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);


  /* ########################################################################################### */

  const { t } = useTranslation('main');

  const onChange = (e: any) => {
    onApplyPreferences(e);
  };

  const handleDragStart = (e: any) => {
    dragItem.current = e.target.id;
  };

  const handleDragEnd = (e: any) => {
    e.preventDefault();
    dragOverItem.current = e.currentTarget.id;
  };

  const handleDropping = (e: any) => {
    let startIndex = preferences.columnPreferences?.findIndex((fld: any) => fld?.dataField === dragItem.current);
    let endIndex = preferences.columnPreferences?.findIndex((fld: any) => fld?.dataField === dragOverItem.current);
    setPreferences((prevPreferences: any) => {
      return {
        ...prevPreferences,
        columnPreferences: (moveArrayElement(preferences.columnPreferences, startIndex, endIndex))
      };
    });
    dragItem.current = null;
    dragOverItem.current = null;
  };

  /* ########################################################################################### */


  /* ########################################################################################### */


  const [preferences, setPreferences] = useState<GridPreference>(initialGridPreference);

  useEffect(() => {
    setPreferences(getInitialPreference(gridId, columns));
  }, [gridId, columns, onApplyPreferences]);

  const getDefaultColumnPreference = (column: DevGridColumn, index: number): ColumnPreference => ({
    dataField: column.dataField ?? "",
    isLocked: column.isLocked ?? false,
    caption: column.caption || capitalizeAndAddSpace(column.dataField ?? ""),
    width: column.width || 100,
    alignment: column.alignment || 'left',
    visible: true,
    readOnly: false,
    fontBold: false,
    fontColor: '',
    fontSize: 0,
    displayOrder: index,
    showInPdf: column.showInPdf || false,
    groupIndex: undefined
  });

  const handlePreferenceChange = (
    key: string,
    value: any
  ) => {
    setPreferences((prevPreferences: any) => {
      return {
        ...prevPreferences,
        [key]: value
      };
    });
  };

  const handleColumnPreferenceChange = (
    dataField: string,
    key: string, // Ensure `key` is a valid property of `ColumnPreference`
    value: any
  ) => {

    setPreferences((prevPreferences: any) => {
      if (!prevPreferences) return prevPreferences;
      const updatedColumnPreferences = prevPreferences.columnPreferences.map(
        (column: ColumnPreference) => {
          if (column.dataField === dataField) {
            // Create a new column object with the updated value
            return {
              ...column,
              [key]: value
            };
          }
          return column; // Return the original column if no changes
        }
      );

      return {
        ...prevPreferences,
        columnPreferences: updatedColumnPreferences
      };
    });
  };

  const handleApplyPreferences = async () => {
    const preference = JSON.stringify(preferences)
    // Save preferences to localStorage
    localStorage.setItem(
      `gridPreferences_${gridId}`,
      preference
    );
    await api.postAsync(Urls.grid_preference, { GridID: gridId, Design: preference })
    setIsOpen(false);
    // Call the callback function to apply preferences
    onChange(preferences);
  }


  // ==================================================================
  const onClose = () => { };
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, field: string) => {
  //   const newValue = field === 'Visible' || field === 'ReadOnly' || field === 'FontBold' ? e.target.checked : e.target?.value;
  //   setTableBody(prevState => {
  //     const updatedTableBody = [...prevState];
  //     updatedTableBody[rowIndex] = { ...updatedTableBody[rowIndex], [field]: newValue };
  //     return updatedTableBody;
  //   });
  // };

  return (
    <Fragment>
      <button onClick={() => setIsOpen(true)} className={`ti-btn dark:bg-dark-bg-header dark:text-dark-text rounded-[2px] `}>
        <i className={`${ShowGridPreferenceChooserInRow ? "text-[8px]" : ""} ri-apps-line`}></i>
      </button>
      <ERPModal
        isForm
        isFullHeight={true}
        isOpen={isOpen}
        hasSubmit={false}
        closeTitle={t("close")}
        title={t("customize_columns")}
        width="!w-[80rem] !max-w-[60rem]"
        closeModal={() => setIsOpen(false)}
        content={(<div className="flex flex-col gap-1">
          <ERPInput
            noLabel
            className="mb-3"
            id="search_cols"
            value={searchCols}
            placeholder={t("search")}
            onChange={(e: any) => setSearchCols(e?.target?.value)}
            prefix={<MagnifyingGlassIcon className="w-4 h-4" />}
          />
          <div className="grid-preference-form">
            <div className="header-row dark:bg-dark-bg-header dark:text-dark-text bg-gray-100 px-4 py-2 font-bold text-sm grid grid-cols-5 gap-2 items-center">
              <span className="col-span-2">{t("column")}</span>
              <span>{t("width")}</span>
              <span>{t("read_only")}</span>
              <span>{t("pdf")}</span>
            </div>
            {
              (preferences != undefined && preferences != null && preferences?.columnPreferences != undefined && preferences?.columnPreferences != null) && preferences?.columnPreferences?.filter((item: any) => item.caption?.toLowerCase()
                .includes(searchCols.toLowerCase())
              )?.map((column: ColumnPreference) => {
                return (
                  <div
                    key={column.dataField}
                    id={column.dataField}
                    className="px-1 py-1"
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnd}
                    onDragEnd={handleDropping}>
                    <div className={` dark:bg-dark-bg-header dark:text-dark-text bg-[#F9F9FB]  w-full px-1 rounded grid grid-cols-5 !items-center pl-4`}>
                      <label className="col-span-2 items-center py-1 capitalize text-sm dark:text-dark-text text-slate-800 cursor-move">
                        ⋮⋮
                        {column?.isLocked ? (
                          <div className="dark:bg-[#383a3b]  bg-[#F9F9FB] w-full px-2 rounded cursor-move">
                            <div className="flex gap-2 py-1 text-sm capitalize dark:text-dark-text text-slate-800 items-center ">
                              <LockClosedIcon className=" h-3 w-3" />
                              <span className="cursor-pointer">{column?.caption}</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <input
                              type="checkbox"
                              className="dark:bg-dark-bg-card border dark:border-dark-border cursor-pointer  ml-[.6rem]"
                              disabled={column?.isLocked}
                              onChange={(e) => { handleColumnPreferenceChange(column.dataField, 'visible', e.target.checked) }}
                              checked={column?.visible}
                            />
                            <span className="cursor-pointer pl-2">{column?.caption}</span>
                          </>
                        )}
                      </label>

                      <input
                        type="number"
                        value={column.width || ''}
                        onChange={(e) => handleColumnPreferenceChange(column.dataField, 'width', parseInt(e.target?.value) || undefined)}
                        disabled={column.isLocked}
                        className="dark:bg-dark-bg-card border dark:border-dark-border rounded p-1 w-16 mh-[27px]"
                      />
                      <input
                        type="checkbox"
                        className="dark:bg-dark-bg-card border dark:border-dark-border cursor-pointer mh-[27px]"
                        disabled={column.isLocked}
                        checked={column.readOnly}
                        onChange={(e) => handleColumnPreferenceChange(column.dataField, 'readOnly', e.target.checked)}
                      />
                      <input className="dark:bg-dark-bg-card border dark:border-dark-border mh-[27px]"
                        type="checkbox"
                        checked={column.showInPdf}
                        onChange={(e) => handleColumnPreferenceChange(column.dataField, 'showInPdf', e.target.checked)}
                        disabled={column.isLocked}
                      />
                    </div>
                  </div>
                );
              })
            }
          </div>
          <div className="m-2 p-1 ">
            <p className="switcher-style-head">
              {t("pdf_orientation")}
            </p>
            <div className="flex items-center gap-5 my-2 pl-5">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="portrait"
                  className="ti-form-radio"
                  id="portrait"
                  checked={preferences.orientation === "portrait"}
                  onChange={(e) => {
                    setPreferences((previous) => ({
                      ...previous,
                      orientation: "portrait"
                    }))
                  }}
                />

                <label htmlFor="portrait" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                  {t("portrait")}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  name="landscape"
                  className="ti-form-radio"
                  id="landscape"
                  checked={preferences.orientation === "landscape"}
                  onChange={(e) => {
                    setPreferences((previous) => ({
                      ...previous,
                      orientation: "landscape"
                    }))
                  }}
                />

                <label htmlFor="landscape" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                  {t("landscape")}
                </label>
              </div>
            </div>
          </div>
        </div>
        )}

        footer={(
          <div className="flex justify-end space-x-2 gap-4 py-5 dark:!border-dark-border border-t">
            <ERPSubmitButton type="reset" onClick={() => setIsOpen(false)} className=" dark:text-dark-hover-text w-28 bg-[#808080] text-[#404040] max-w-[115px]" >
              {t("cancel")}
            </ERPSubmitButton>
            <ERPSubmitButton type="button" className=" max-w-[115px]"
              variant="primary"
              onClick={handleApplyPreferences}>
              {t("save")}
            </ERPSubmitButton>
          </div>
        )}
      />
    </Fragment>
  );
};

export default React.memo(GridPreferenceChooser);