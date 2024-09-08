import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";
import { CircularProgress } from "@mui/material";
import { logoutUser } from "../../redux/slices/auth/login/thunk";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  /* ########################################################################################### */

  useEffect(() => {
    handleLogout();
  }, []);
  const handleLogout = async () => {
    const logout = await dispatch(
      logoutUser({ systemId: Cookies.get("systemId") ?? "" })
    ).unwrap();

    if (logout.isOk == true) {
      Cookies.remove("token");
      navigate("/login");
    } else {
      setError(logout.message);
    }
  };

  /* ########################################################################################### */

  return (
    <>
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
          <div className="grid grid-cols-12">
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
              <div className="box">
                <div className="box-body !p-[3rem]">
                  {error && (
                    <div className="w-full bg-red-50 py-2 px-4 rounded-md flex items-center justify-between border border-red-100">
                      <p className="text-[13px] text-red-600">{error}</p>
                      <XMarkIcon
                        className="w-4 aspect-square stroke-red-600 cursor-pointer"
                        onClick={() => {
                          setError(null);
                        }}
                      />
                    </div>
                  )}
                  <p className="h5 font-semibold mb-2 text-center">
                    {" "}
                    <CircularProgress
                      className=""
                      color="inherit"
                      size={14}
                    />{" "}
                    Logging out
                  </p>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
          </div>
        </div>
      </div>
    </>
  );
};
{
  /* <div className="flex items-center">
            <CircularProgress className="" color="inherit" size={14} />
          </div>Logging out ....   */
}

export default Logout;
