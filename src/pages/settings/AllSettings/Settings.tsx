import React, { Fragment, lazy, useEffect, useState } from "react";
import jwtHelper from "../../../helpers/jwt_helper";
import Header from "./Components/Header";
import SettingsCard from "./Components/SettingsCard";
import { SettingsMenuItems } from "../../../components/common/sidebar/sidemenu/settings";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useAppDispatch } from "../../../utilities/hooks/useAppDispatch";
import {
  toggleDeleteInactiveTransactionPopup,
  toggleCompanyProfilePopup,
  toggleBankPosPopup,
  toggleBranchPopup,
} from "../../../redux/slices/popup-reducer";

const DeleteInactiveTransactionManage = lazy( () => import("../Administration/delete-inactive-transactions-manage"));
const CompanyProfileManage = lazy(() => import("../Administration/Company-Profile-manage"));
const BankPosSettingsManage = lazy(() => import("../Administration/bank-pos-settings-manage"));
const BranchManage = lazy(() => import("../Administration/branches-manage"));
const Settings = () => {
  const rootState = useRootState();
  const dispatch = useAppDispatch();
  const [settingsRoutes, setSettingRoutes] = useState(SettingsMenuItems);
  let sds = jwtHelper.getLoggedInUserRole();

  

  return (
    <Fragment>
      <div className="flex flex-col w-full h-full">
        <div className="bg-[url('/settings_bg.png')]">
          <div className="max-w-4xl mx-auto w-full h-full">
            <Header />
          </div>
        </div>
        <div className="py-6 px-4 max-w-4xl mx-auto w-full h-full overflow-auto scrollbar-hide">
          <div className="w-full flex flex-wrap gap-4 justify-center">
            {settingsRoutes?.map((item: any, idx: number) => {
              return <SettingsCard data={item} key={`QKLJM34${idx}`} />;
            })}
          </div>
        </div>
      </div>

      <ERPModal
        isOpen={rootState.PopupData.deleteInactiveTransactions}
        title={"Delete In Active Transactions"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleDeleteInactiveTransactionPopup(false));
        }}
        content={<DeleteInactiveTransactionManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.companyProfile}
        title={"Company Profile"}
        width="w-full max-w-[800px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleCompanyProfilePopup(false));
        }}
        content={<CompanyProfileManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.bankPos}
        title={"Bank POS settings"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleBankPosPopup(false));
        }}
        content={<BankPosSettingsManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.branch}
        title={"Branch Info"}
        width="w-full max-w-[800px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleBranchPopup(false));
        }}
        content={<BranchManage />}
      />
    </Fragment>
  );
};

export default Settings;
