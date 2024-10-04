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
  toggleDayClosePopup,
  toggleUserActionPopup,
  toggleImportExportPopup,
  toggleResetDataBasePopup,
  toggleCommandsPopup,
  toggleAuthorizationSettingsPopup,
  toggleBarcodePrintPopup,
} from "../../../redux/slices/popup-reducer";

const DeleteInactiveTransactionManage = lazy(() => import("../Administration/delete-inactive-transactions-manage"));
const CompanyProfileManage = lazy(() => import("../Administration/Company-Profile-manage"));
const BankPosSettingsManage = lazy(() => import("../Administration/bank-pos-settings-manage"));
const BranchManage = lazy(() => import("../Administration/branches-manage"));
const DayCloseManage = lazy(() => import("../system/day-close-manage"));
const UserActionReport = lazy(() => import("../system/user-action-report-manage"));
const ImportExportManage = lazy(() => import("../system/import-export"));
const CommandsManage = lazy(() => import("../system/commands"));
const AuthorizationSettings = lazy(() => import("../system/authorization-settings-manage"));
const  PopUpModalResetDatabase= lazy(() => import("../system/resetDatabase-manage"));
const Barcodeprint = lazy(() => import("../system/barcode-print"));

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
        isOpen={rootState.PopupData.deleteInactiveTransactions.isOpen || false}
        title={"Delete In Active Transactions"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleDeleteInactiveTransactionPopup({ isOpen: false }));
        }}
        content={<DeleteInactiveTransactionManage/>}
      />
      <ERPModal
        isOpen={rootState.PopupData.companyProfile.isOpen || false}
        title={"Company Profile"}
        width="w-full max-w-[800px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleCompanyProfilePopup({ isOpen: false }));
        }}
        content={<CompanyProfileManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.bankPos.isOpen || false}
        title={"Bank POS settings"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleBankPosPopup({ isOpen: false }));
        }}
        content={<BankPosSettingsManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.branch.isOpen || false}
        title={"Branch Info"}
        width="w-full max-w-[800px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleBranchPopup({ isOpen: false }));
        }}
        content={<BranchManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.dayClose.isOpen || false}
        title={"Day Close"}
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleDayClosePopup({ isOpen: false }));
        }}
        content={<DayCloseManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.userActionReport.isOpen || false}
        title="User Action Report"
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleUserActionPopup({ isOpen: false }));
        }}
        content={<UserActionReport />}
      />
      <ERPModal
        isOpen={rootState.PopupData.importExport.isOpen || false}
        title="Import Export"
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleImportExportPopup({ isOpen: false }));
        }}
        content={<ImportExportManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.resetDataBase.isOpen || false}
        title="Reset DataBase"
        width="w-full max-w-[600px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleResetDataBasePopup({ isOpen: false }));
        }}
      content={<PopUpModalResetDatabase/>}
      />

      <ERPModal
        isOpen={rootState.PopupData.commands.isOpen || false}
        title="Sql Commands"
        width="w-full max-w-[800px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleCommandsPopup({ isOpen: false }));
        }}
        content={<CommandsManage />}
      />
        <ERPModal
        isOpen={rootState.PopupData.authorizationSettings.isOpen || false}
        title="Authorization Settings"
        width="w-full max-w-[800px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleAuthorizationSettingsPopup({ isOpen: false }));
        }}
        content={<AuthorizationSettings/>}
      />
        <ERPModal
        isOpen={rootState.PopupData.barcodeprint.isOpen || false}
        title="Barcode Print"
        width="w-full max-w-[800px]"
        isForm={true}
        closeModal={() => {
          dispatch(toggleBarcodePrintPopup({ isOpen: false }));
        }}
        content={<Barcodeprint/>}
      />
    </Fragment>
  );
};

export default Settings;
