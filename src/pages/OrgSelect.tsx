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

const OrgSelect = ({}) => {
  
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

  return (
    <div className="min-h-screen overflow-y-auto flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      
      <div>
        <div className="flex flex-col w-[540px] justify-center px-5 py-2 my-16 bg-white dark:bg-body_dark shadow-md rounded-md">
        <div className="w-full text-right"><Link className=" ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex" to="/logout"><i
                      className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>Log Out</Link></div>
          <div className=" m-10 text-center">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgSelect;
