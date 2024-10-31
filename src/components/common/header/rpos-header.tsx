import { FC, Fragment, useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../utilities/hooks/useAppState";
import { languagesData, Locale } from "../../../redux/slices/app/types";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utilities/hooks/useAppDispatch";
import { Link } from "react-router-dom";

interface RPosHeaderProps {}

const RPosHeader: FC<RPosHeaderProps> = () => {
  const { t } = useTranslation();
  const { appState, updateAppState } = useAppState();
  let dispatch = useAppDispatch();

  return (
    <Fragment>
      <header className="bg-white shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="ri-menu-line text-2xl mr-2"></i>
          <Link to="/rpos/table-view">
            <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
              New Order
            </button>
          </Link>
          <input
            type="text"
            placeholder="Bill No"
            className="border p-1 rounded w-24 rounded-md"
          />
          <input
            type="text"
            placeholder="KOT No."
            className="border p-1 rounded w-24 rounded-md"
          />
        </div>
        <div className="flex items-center space-x-6 text-gray-600">
          <i className="ri-file-list-line text-[33px] "></i>
          <i className="ri-printer-line text-[33px]"></i>
          <Link
            to="/rpos/live-view"
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            <i className="ri-layout-grid-line text-[33px]"></i>
          </Link>
          <i className="ri-image-line text-[33px]"></i>
          <i className="ri-file-list-3-line text-[33px]"></i>
          <i className="ri-time-line text-[33px]"></i>
          <i className="ri-notification-3-line text-[33px]"></i>
          <i className="ri-question-line text-[33px]"></i>
          <Link
            to="/settings"
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            <i className="bx bx-cog header-link-icon text-[33px] "></i>
          </Link>

          <Link
            to="/"
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            <i className="ri-shut-down-line text-[33px]"></i>
          </Link>
        </div>
      </header>
    </Fragment>
  );
};
export default RPosHeader;
