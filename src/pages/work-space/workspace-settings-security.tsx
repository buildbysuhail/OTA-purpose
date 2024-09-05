import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Urls from "../../redux/urls";
import ERPInput from "../../components/ERPComponents/erp-input";
import ERPButton from "../../components/ERPComponents/erp-button";
import { useDispatch } from "react-redux";
import { ResponseModelWithValidation } from "../../base/response-model";
import "./profile.css";
import { APIClient } from "../../helpers/api-client";
import { getAction, postAction } from "../../redux/app-actions";
import { handleAxiosResponse } from "../../utilities/HandleAxiosResponse";
import { useLocation } from "react-router-dom";
import { handleResponse } from "../../utilities/HandleResponse";

interface WorkSpaceSettingsProps {}

const WorkSpaceSettingsSecurity: FC<WorkSpaceSettingsProps> = (props) => {
  let api = new APIClient();
  const [password, setPassword] = useState<string>("");
 
  const dispatch = useDispatch();

  const resetPassword = async () => {
    debugger;
    const response: ResponseModelWithValidation<any, any> = await dispatch(
      postAction({
        apiUrl: Urls.updatePassword,
        data: { password: password },
      }) as any
    ).unwrap();
    debugger;
    handleResponse(response, () => {
      setPassword("");
    });
  };

  const location = useLocation();
  const path = location.pathname.split("/").pop(); // Extract the last part of the route
  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div></div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
      <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
        <div className="grid grid-cols-12 gap-x-6">
          <div
            id="phone-number"
            className={`xxl:col-span-12 xl:col-span-12 ${
              path === "Password" ? "blink" : ""
            } col-span-12`}
          >
            <div className="box custom-box">
              <div className="box-header justify-between">
                <div className="box-title">
                  Password{" "}
                  <p className="box-title-desc mb-0 text-[#8c9097] dark:text-white/50 font-weight:300 text-[0.75rem] opacity-[0.7]">
                    We recommend you to change your password often, it will make
                    you feel better about your security!
                  </p>
                </div>
                <div></div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-1 gap-3">
                  <ERPInput
                    id="password"
                    placeholder="Please Enter new Password"
                    required={true}
                    value={password}
                    data={{password: password}}
                    onChangeData={(data: any) => {
                      console.log('safvan');
                      
                      debugger;
                      setPassword(data.password)}
                    }
                  />
                  <div className="w-full p-2 flex justify-end">
                    <ERPButton
                      title="Reset"
                      disabled={password == null || password == ""}
                      onClick={resetPassword}
                      variant="primary"
                    ></ERPButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className="xxl:col-span-6 xl:col-span-12  col-span-12">

        </div>
      </div>
      
    </Fragment>
  );
};

export default WorkSpaceSettingsSecurity;
