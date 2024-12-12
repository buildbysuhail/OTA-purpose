import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
import { RootState } from "../redux/store";
import ERPToast from "../components/ERPComponents/erp-toast";
import { BranchSelectDto } from "../redux/slices/user-session/reducer";
import BranchSelector from "./BranchSelector";
import ErpAvatar from "../components/ERPComponents/erp-avatar";
import ERPSubmitButton from "../components/ERPComponents/erp-submit-button";
import ERPButton from "../components/ERPComponents/erp-button";
import { useState } from "react";
import useGoBack from "../utilities/hooks/useGoBack";
import { ERPScrollArea } from "../components/ERPComponents/erp-scrollbar";

// interface DynamicHeightComponentProps {
//   initialHeight?: number; // Optional initial height
// }

const OrgSelect = ({ initialHeight = 100 }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const { t } = useTranslation();
  const navigate = useNavigate();

  const tanant = useSelector((state: any) => state?.PostUserTenant);
  const userSession = useAppSelector((state: RootState) => state?.UserSession);
  const handleSubmit = async () => {
    // event.preventDefault();
    setIsLoading(true);
    const isBranchActive = userSession?.branches?.some(
      (item: BranchSelectDto) => item?.isActive
    );
    if (isBranchActive) {
      navigate("/");
    } else {
      ERPToast.show("Please select a branch", "error");
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
    <div className="min-h-screen  overflow-y-auto flex sm:items-center sm:justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      {/* {!deviceInfo?.isMobile && (
        <div>
          <div className="flex flex-col h-[100%] w-[100%]  sm:w-[540px]  justify-center px-5 py-2 sm:my-16 pb-[2.5rem] bg-white dark:bg-body_dark shadow-md rounded-md">
            <div className="w-full text-right">
              <Link
                className=" ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex"
                to="/logout"
              >
                <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>
                Log Out
              </Link>
            </div>
            <div className=" m-[25px] sm:m-10 text-center">
              <span className="avatar avatar-xxl avatar-rounded">
                <ErpAvatar
                  alt="Remy Sharp"
                  src={
                    typeof userSession?.userimage === "string"
                      ? userSession?.userimage
                      : ""
                  }
                  sx={{ width: 75, height: 75 }}
                />
              </span>

              <h6 className="font-semibold mb-1  text-[1rem]">
                {userSession?.displayName}
              </h6>
              <p className="mb-1  text-[.8rem]">{userSession?.email}</p>
              <div className="mt-4 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {"My Organization"}
                </h2>
              </div>
              <BranchSelector onLoadingChange={handleLoadingChange} />
              <div className="grid grid-cols-1 gap-3 ">
                <ERPButton
                  type="button"
                  onClick={handleSubmit}
                  loading={false}
                  title="continue"
                  variant="primary"
                  disabled={isLoading}
                ></ERPButton>
                <ERPButton
                  type="button"
                  onClick={useGoBack()}
                  loading={false}
                  title="back"
                  variant="secondary"
                  disabled={isLoading}
                ></ERPButton>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {!deviceInfo?.isMobile && (
        <div className="flex justify-center items-center h-full px-4 py-6 sm:py-3">
          <div className="relative flex flex-col w-full max-w-[400px] sm:max-w-[540px] bg-white dark:bg-body_dark shadow-md rounded-md p-5 sm:p-8 min-h-[512px]">
            {/* Logout Button */}
            <div className="w-full text-right mb-1">
              <Link
                className="ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex"
                to="/logout"
              >
                <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>
                Log Out
              </Link>
            </div>

            {/* User Information */}
            <div className="text-center mb-1">
              <span className="avatar avatar-xxl avatar-rounded inline-block mb-1">
                <ErpAvatar
                  alt="User Avatar"
                  src={
                    typeof userSession?.userimage === "string"
                      ? userSession?.userimage
                      : ""
                  }
                  sx={{ width: 75, height: 75 }}
                />
              </span>

              <h6 className="font-semibold mb-1 text-lg">
                {userSession?.displayName}
              </h6>
              <p className="mb-1 text-sm text-gray-600">{userSession?.email}</p>

              {/* Organization Info */}
              <div className="mt-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  My Organization
                </h2>
              </div>
            </div>

            {/* Scrollable Branch Selector */}
            {/* <div className="flex-1 overflow-y-auto h-[500px] min-h-[152px] max-h-[900px] mb-[45px]">
              <BranchSelector onLoadingChange={handleLoadingChange} />
            </div> */}
            {/* <div className={`flex-1 overflow-y-auto max-h-[152px] mb-[45px]${getClassName()}`}> */}
            <ERPScrollArea className="flex-1 overflow-y-auto max-h-[152px] mb-[45px]">
              <div >
                <BranchSelector onLoadingChange={handleLoadingChange} />
              </div>
            </ERPScrollArea>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4  mb-[45px] overflow-y-auto">
              <BranchSelector onLoadingChange={handleLoadingChange} />
            </div> */}

            {/* <div className="flex-1 overflow-y-auto min-h-[152px] mb-[45px]">
              <BranchSelector onLoadingChange={handleLoadingChange} />
            </div> */}

            {/* Fixed Bottom Buttons */}
            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-body_dark shadow-inner p-4 flex gap-4">
              <ERPButton
                type="button"
                onClick={handleSubmit}
                loading={false}
                title="Continue"
                variant="primary"
                disabled={isLoading}
                className="w-full"
              />
              <ERPButton
                type="button"
                onClick={useGoBack()}
                loading={false}
                title="Back"
                variant="secondary"
                disabled={isLoading}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {deviceInfo?.isMobile && (
        <div>
          <div className="flex flex-col h-[100%] w-[100%] sm:w-[540px]  justify-start px-5 py-2 sm:my-16 pb-[2.5rem] bg-white dark:bg-body_dark shadow-md rounded-md">
            {/* <div className="w-full text-right">
              <Link
                className=" ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex"
                to="/logout"
              >
                <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>
                Log Out1
              </Link>
            </div> */}
            <div className=" mx-[25px] my-2 sm:m-10 text-center">
              <div className="">
                <span className="avatar avatar-xxl avatar-rounded">
                  <ErpAvatar
                    alt="Remy Sharp"
                    src={
                      typeof userSession?.userimage === "string"
                        ? userSession?.userimage
                        : ""
                    }
                    sx={{ width: 75, height: 75 }}
                  />
                </span>

                <h6 className="font-semibold mb-1  text-[1rem]">
                  {userSession?.displayName}
                </h6>
                <p className="mb-1  text-[.8rem]">{userSession?.email}</p>
                <div className="mt-4 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {"My Organization"}
                  </h2>
                </div>
              </div>
              <BranchSelector onLoadingChange={handleLoadingChange} />
              <div className="grid grid-cols-1 gap-3">
                <ERPButton
                  type="button"
                  onClick={handleSubmit}
                  loading={false}
                  title="continue"
                  variant="primary"
                  disabled={isLoading}
                ></ERPButton>
                <ERPButton
                  type="button"
                  onClick={useGoBack()}
                  loading={false}
                  title="back"
                  variant="secondary"
                  disabled={isLoading}
                ></ERPButton>
                {/* <ERPButton
                  type="button"
                  // onClick={useGoBack()}
                  loading={false}
                  title="Log Out"
                  variant="secondary"
                  disabled={isLoading}
                ></ERPButton> */}
                <Link
                  className=" w-[100%] h-fit flex justify-center items-center "
                  to="/logout"
                >
                  <ERPButton
                    title="Log Out"
                    // onClick={updateLanguage}
                    variant="primary"
                    className="w-full px-6 py-2 rounded bg-[#dc2626] text-[#ffffff] font-medium hover:bg-[#b91c1c] transition-colors"
                    // loading={userLanguage.loading}
                    // disabled={userLanguage.loading}
                  ></ERPButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgSelect;
