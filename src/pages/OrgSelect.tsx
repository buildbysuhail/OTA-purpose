import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
import { RootState } from "../redux/store";
import ERPToast from "../components/ERPComponents/erp-toast";
import { BranchSelectDto } from "../redux/slices/user-session/reducer";
import BranchSelector from "./BranchSelector";
import ErpAvatar from "../components/ERPComponents/erp-avatar";
import ERPButton from "../components/ERPComponents/erp-button";
import { useState } from "react";
import useGoBack from "../utilities/hooks/useGoBack";
import { useTranslation } from "react-i18next";

// interface DynamicHeightComponentProps {
//   initialHeight?: number; // Optional initial height
// }

const OrgSelect = ({ initialHeight = 100 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('main');
  const navigate = useNavigate();
  const tanant = useSelector((state: any) => state?.PostUserTenant);
  const userSession = useAppSelector((state: RootState) => state?.UserSession);
  let userBranches = useAppSelector((state: RootState) => state.UserBranches);
  const handleSubmit = async () => {
    // event.preventDefault();
    setIsLoading(true);
    const isBranchActive = userBranches?.branches?.some(
      (item: BranchSelectDto) => item?.isActive
    );
    if (isBranchActive) {
      navigate("/");
    } else {
      ERPToast.show(t("please_select_a_branch"), t("error"));
    }
  };

  const handleLoadingChange = (loadingState: boolean) => {
    setIsLoading(loadingState);
  };

  const deviceInfo = useSelector((state: RootState) => state.DeviceInfo);

  // const [height, setHeight] = useState(initialHeight);

  // const getClassName = () => {
  //   if (height < 100) {
  //     return 'small-height';
  //   } else if (height >= 100 ) {
  //     return 'medium-height';
  //   } else {
  //     return 'large-height';
  //   }
  // };

  return (
    <div className="max-h-screen flex flex-col" style={{ marginBlock: 'auto' }}>
      {/* Header */}
      {/* <header className="h-14 border-b flex items-center px-4">
      <h1 className="text-lg font-semibold">Select Organization</h1>
    </header> */}
      {/* Main content - centers content vertically and horizontally */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col dark:bg-dark-bg-card bg-white rounded-lg shadow-lg max-h-[calc(90vh-3.5rem)]">
          <div className="flex-1 overflow-y-auto p-0 space-y-6" style={{ scrollbarWidth: 'thin' }}>
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="">
                <div className="flex justify-end">
                  <Link className="ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex" to="/logout">
                    <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>
                    {t("log_out")}
                  </Link>
                </div>
                <div className="flex items-center space-x-4 p-4">
                  <ErpAvatar
                    alt="User Avatar"
                    src={
                      typeof userSession?.userimage === "string"
                        ? userSession?.userimage
                        : ""
                    }
                    sx={{ width: 75, height: 75 }}
                  />
                  <div className="flex flex-col">
                    <span className="text-lg dark:text-dark-text font-semibold">{userSession?.displayName}</span>
                    <span className="text-sm text-gray-500">{userSession?.email}</span>
                  </div>
                </div>
              </div>

              {/* Organizations Section */}
              <div>
                <h3 className=" dark:text-dark-text text-lg font-semibold mb-4">{t("my_organization")}</h3>
                <div className="space-y-3">
                  <BranchSelector onLoadingChange={handleLoadingChange} />
                  {/* <div className="border rounded-lg p-4 flex items-center hover:bg-gray-50 cursor-pointer">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Polo"
                    className="w-10 h-10 rounded"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-medium">Polo</div>
                    <div className="text-sm text-gray-500">1 Business Name</div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-primary"></div>
                </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at the bottom */}
          <div className="p-6 dark:border-dark-border border-t">
            <div className="flex gap-4">
              <ERPButton
                type="button"
                onClick={handleSubmit}
                loading={false}
                title={t("continue")}
                variant="primary"
                disabled={isLoading}
                className="w-full"
              />
              <ERPButton
                type="button"
                onClick={useGoBack()}
                loading={false}
                title={t("back")}
                variant="secondary"
                disabled={isLoading}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrgSelect;
