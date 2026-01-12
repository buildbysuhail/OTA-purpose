import { FC, Fragment, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../utilities/hooks/useAppState";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import { Link, useNavigate } from "react-router-dom";
import { Handshake, LogOut } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { logoutUser } from "../../../redux/slices/auth/login/thunk";
import {
  initialUserSessionData,
  setUserSession,
} from "../../../redux/slices/user-session/reducer";
import { setUserBranches } from "../../../redux/slices/user-session/user-branches-reducer";
import { setUserRights } from "../../../redux/slices/user-rights/reducer";
import {
  clearStorage,
  getStorageString,
} from "../../../utilities/storage-utils";
import ERPAlertDialog from "../../ERPComponents/erp-alert-dialog";
import ERPAlert from "../../ERPComponents/erp-sweet-alert";

interface RPosHeaderProps {}

const RPosHeader: FC<RPosHeaderProps> = () => {
  const { t } = useTranslation();
  const { appState, updateAppState } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Perform actual logout - mirrors WinForms btnExit_Click logic
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      // Get systemId for logout API call
      const systemId = await getStorageString("systemId");

      ERPAlert.show({
        title: t("are_you_sure_you_want_logout_now"),
        icon: "warning",
        confirmButtonText: t("yes"),
        cancelButtonText: t("cancel"),
        onConfirm: async () => {
          // Call logout API
          await dispatch(logoutUser({ systemId: systemId ?? "" })).unwrap();

          // Clear all storage (equivalent to WinForms Application.Exit cleanup)
          await clearStorage();

          // Reset Redux state
          dispatch(setUserSession(initialUserSessionData));
          dispatch(setUserBranches([]));
          dispatch(setUserRights([]));

          // Navigate to login page
          navigate("/login");
        },
        onCancel:()=>{ return}
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, still clear local state and redirect
      await clearStorage();
      dispatch(setUserSession(initialUserSessionData));
      dispatch(setUserBranches([]));
      dispatch(setUserRights([]));
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, navigate]);

  return (
    <Fragment>
      <header className="lg:h-[9vh] xl:h-[8vh] bg-white shadow-md p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="ri-menu-line text-2xl mr-2"></i>
          <Link to="/rpos/table-view">
            <button className="px-4 py-2 bg-primary text-white rounded rounded-md">
              {t("new_order")}
            </button>
          </Link>
          <input
            type="text"
            placeholder={t("bill_no")}
            className="border p-1 rounded w-24 rounded-md"
          />
          <input
            type="text"
            placeholder={t("kot_no")}
            className="border p-1 rounded w-24 rounded-md"
          />
        </div>
        <div className="flex items-center space-x-6 text-gray-600">
          <LanguageSwitcher></LanguageSwitcher>
          <Link
            to="/rpos/operations"
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            {/* <i className="ri-shake-hands-fill text-[33px]"></i> */}
            <Handshake className="text-[33px]" />
          </Link>
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
          <button
            // to="/settings"
            // onClick={}
            className="!p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
          >
            <i className="bx bx-cog header-link-icon text-[33px] "></i>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="!p-0 !border-0 flex-shrink-0 !rounded-full !shadow-none text-xs disabled:opacity-50"
            title={t("logout", "Logout")}
          >
            {isLoggingOut ? (
              <i className="ri-loader-4-line text-[33px] animate-spin"></i>
            ) : (
              <i className="ri-shut-down-line text-[33px]"></i>
            )}
          </button>
        </div>
      </header>
    </Fragment>
  );
};
export default RPosHeader;
