import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
import { RootState } from "../redux/store";
import ERPToast from "../components/ERPComponents/erp-toast";
import { BranchSelectDto } from "../redux/slices/user-session/reducer";
import BranchSelector from "./BranchSelector";
import ErpAvatar from "../components/ERPComponents/erp-avatar";
import ERPSubmitButton from "../components/ERPComponents/erp-submit-button";
import ERPButton from "../components/ERPComponents/erp-button";


const OrgSelect = ({}) => {
  // const { t } = useTranslation();
  const navigate = useNavigate();

  const tanant = useSelector((state: any) => state?.PostUserTenant);
  const userSession = useAppSelector((state: RootState) => state?.UserSession);
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const isBranchActive = userSession?.branches?.some((item: BranchSelectDto) => item?.isActive);
    if (isBranchActive) {
      navigate("/");
    } else {
      ERPToast.show("Please select a branch", "error");
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className=" fixed right-6 bottom-6">
        
      </div>
      <div>
        <div className="flex flex-col w-[540px] justify-center px-5 py-2 my-16 bg-white dark:bg-body_dark shadow-md rounded-md">
          <div className=" m-10">
            <div className="flex items-center gap-3 h-12 w-auto">
                 <span className="avatar avatar-xxl avatar-rounded ">
                          <ErpAvatar
                          alt="Remy Sharp"
                          src={typeof userSession.userimage === 'string' ? userSession.userimage : ''}
                          sx={{ width: 75, height: 75 }}
                          />
                        </span>
                        <div className="flex items-center !justify-between">
                          <h6 className="font-semibold mb-1  text-[1rem]">
                            {userSession?.displayName}
                          </h6>
                          <p className="mb-1  text-[.8rem]">
                            {userSession?.email}
                          </p>
                        </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">{"My Organization"}</h2>
            </div>
            <div className="flex flex-col ">
              <form onSubmit={handleSubmit} className=" grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
                <BranchSelector />
                <div className="col-span-full">
                  <ERPButton type="button" loading={false} title="continue" variant="primary"></ERPButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgSelect;
