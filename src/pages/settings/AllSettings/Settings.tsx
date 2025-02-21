import { Fragment, lazy, useEffect, useState } from "react";
import jwtHelper from "../../../helpers/jwt_helper";
import Header from "./Components/Header";
import SettingsCard from "./Components/SettingsCard";
import { SettingsMenuItems } from "../../../components/common/sidebar/sidemenu/settings";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import { useRootState } from "../../../utilities/hooks/useRootState";
import { useAppDispatch, useAppSelector } from "../../../utilities/hooks/useAppDispatch";
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
  toggleExchangeRatesPopup,
  toggleUserTypePrivilegePopup,
  toggleResetBranchDataForSync,
  toggleRefreshAllBranches,
  toggleHeaderFooterPopup,
  toggleHideAccLedger,
  toggleCompanyProfileIndiaPopup,
  toggleTestPopup,
} from "../../../redux/slices/popup-reducer";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";

const HideAccountLedger = lazy(() => import("../../accounts/masters/hide-account-ledger/hide-acc-ledger"));
const DeleteInactiveTransactionManage = lazy(() => import("../Administration/delete-inactive-transactions-manage"));
const CompanyProfileManage = lazy(() => import("../Administration/Company-Profile-manage"));
const CompanyProfileManageIndia = lazy(() => import("../Administration/Company-Profile-manage-india"));
const BankPosSettingsManage = lazy(() => import("../Administration/bank-pos-settings-manage"));
const BranchManage = lazy(() => import("../Administration/branch-info-manage"));
const DayCloseManage = lazy(() => import("../system/day-close-manage"));
const UserActionReport = lazy(() => import("../system/user-action-report-manage"));
const ImportExportManage = lazy(() => import("../system/import-export"));
const CommandsManage = lazy(() => import("../system/commands"));
const AuthorizationSettings = lazy(() => import("../system/authorization-settings-manage"));
const ResetDbManage = lazy(() => import("../system/reset-database-manage"));
const Barcodeprint = lazy(() => import("../system/barcode-print"));
const ExchangeRates = lazy(() => import("../system/exchange-rates"));
const UserTypePrivilegeManage = lazy(() => import("../userManagement/user-privilege-manage"));
const ResetBranchDataForSync = lazy(() => import("../system/reset-branch-data-for-sync"));
const RefreshAllBranches = lazy(() => import("../system/refresh-all-branches"));
const HeadersAndFooters = lazy(() => import("../system/headres-footer"));
const TestPopup = lazy(() => import("../Integration/test-popup"));


const Settings = () => {
  let userSession = useAppSelector((state: RootState) => state.UserSession);
  const { t } = useTranslation();
  const rootState = useRootState();
  const dispatch = useAppDispatch();
  const [settingsRoutes, setSettingRoutes] = useState(SettingsMenuItems);
  let sds = jwtHelper.getLoggedInUserRole();
  const preloadComponents = () => {
    import("../Administration/delete-inactive-transactions-manage");
    import("../Administration/Company-Profile-manage");
    import("../Administration/bank-pos-settings-manage");
    import("../Administration/branch-info-manage");
    import("../system/day-close-manage");
    import("../system/user-action-report-manage");
    import("../system/import-export");
    import("../system/commands");
    import("../system/authorization-settings-manage");
    import("../system/reset-database-manage");
    import("../system/barcode-print");
    import("../system/exchange-rates");
    import("../system/reset-branch-data-for-sync");
    import("../system/refresh-all-branches");
  };

  useEffect(() => {
    // Preload the components after the initial render
    preloadComponents();
  }, []);

  useEffect(() => {
    if (userSession.userTypeCode != "CA" && userSession.userTypeCode != "BA") { setSettingRoutes([]) }
  }, []);

  return (
    <Fragment>
      <div className="dark:bg-dark-bg flex flex-col w-full h-full">
        <div className="bg-[url('/settings_bg.png')]">
          <div className="max-w-4xl mx-auto w-full h-full">
            <Header />
          </div>
        </div>
        <div className="pt-8 pb-6 px-4 max-w-4xl mx-auto w-full h-full overflow-auto scrollbar-hide">
          <div className="w-full flex flex-wrap gap-4 justify-center">
            {SettingsMenuItems?.map((item: any, idx: number) => {
              //  item.disabled = true;
              return <SettingsCard data={item} key={`QKLJM34${idx}`} />;
            })}
          </div>
        </div>
      </div>
      <ERPModal
        isOpen={rootState.PopupData.testPopup.isOpen || false}
        title="Test Popup"
        width={1000}
        isForm={true}
        closeModal={() => {  dispatch(toggleTestPopup({ isOpen: false }));}}
        content={<TestPopup />}
      />
      <ERPModal
        isOpen={rootState.PopupData.hide_acc_ledger.isOpen || false}
        title={t("hide_account_ledger")}
        width={1000}
        height={800}
        isForm={true}
        closeModal={() => {
          dispatch(toggleHideAccLedger({ isOpen: false }));
        }}
        content={<HideAccountLedger />}
      />
      <ERPModal
        isOpen={rootState.PopupData.userTypePrivilege.isOpen || false}
        title={t("user_privilege")}
        width={1000}
        height={600}
        isForm={true}
        closeModal={() => {
          dispatch(toggleUserTypePrivilegePopup({ isOpen: false }));
        }}
        content={<UserTypePrivilegeManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.deleteInactiveTransactions.isOpen || false}
        title={t("delete_in_active_transactions")}
        width={600}
        height={180}
        isForm={true}
        closeModal={() => {
          dispatch(toggleDeleteInactiveTransactionPopup({ isOpen: false }));
        }}
        content={<DeleteInactiveTransactionManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.companyProfile.isOpen || false}
        title={t("company_profile")}
        width={800}
        height={470}
        isForm
        closeModal={() => {
          dispatch(toggleCompanyProfilePopup({ isOpen: false }));
        }}
        content={<CompanyProfileManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.companyProfileIndia.isOpen || false}
        title={t("company_profile")}
        width={800}
        height={780}
        isForm={true}
        closeModal={() => {
          dispatch(toggleCompanyProfileIndiaPopup({ isOpen: false }));
        }}
        content={<CompanyProfileManageIndia />}
      />
      <ERPModal
        isOpen={rootState.PopupData.bankPos.isOpen || false}
        title={t("bank_pos_settings")}
        width={600}
        height={320}
        isForm={true}
        closeModal={() => {
          dispatch(toggleBankPosPopup({ isOpen: false }));
        }}
        content={<BankPosSettingsManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.branch.isOpen || false}
        title={t("branch_info")}
        width={800}
        height={640}
        isForm={false}
        isButton={false}
        closeModal={() => {
          dispatch(toggleBranchPopup({ isOpen: false }));
        }}
        content={<BranchManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.dayClose.isOpen || false}
        title={t("day_close")}
        width={800}
        height={300}
        minHeight={300}
        isForm
        closeModal={() => {
          dispatch(toggleDayClosePopup({ isOpen: false }));
        }}
        content={<DayCloseManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.userActionReport.isOpen || false}
        title={t("user_action_report")}
        width={800}
        height={600}
        isForm={true}
        closeModal={() => {
          dispatch(toggleUserActionPopup({ isOpen: false }));
        }}
        content={<UserActionReport />}
      />
      <ERPModal
        isOpen={rootState.PopupData.importExport.isOpen || false}
        title={t("export_import")}
        width={800}
        height={300}
        isForm={true}
        closeModal={() => {
          dispatch(toggleImportExportPopup({ isOpen: false }));
        }}
        content={<ImportExportManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.resetDataBase.isOpen || false}
        title={t("reset_dataBase")}
        width={900}
        height={620}
        isForm={true}
        closeModal={() => {
          dispatch(toggleResetDataBasePopup({ isOpen: false }));
        }}
        content={<ResetDbManage />}
      />

      <ERPModal
        isOpen={rootState.PopupData.commands.isOpen || false}
        title={t("sql_commands")}
        width={800}
        height={700}
        isForm={true}
        closeModal={() => {
          dispatch(toggleCommandsPopup({ isOpen: false }));
        }}
        content={<CommandsManage />}
      />
      <ERPModal
        isOpen={rootState.PopupData.authorizationSettings.isOpen || false}
        title={t("authorization_settings")}
        width={900}
        height={600}
        isForm={true}
        closeModal={() => {
          dispatch(toggleAuthorizationSettingsPopup({ isOpen: false }));
        }}
        content={<AuthorizationSettings />}
      />
      <ERPModal
        isOpen={rootState.PopupData.barcodeprint.isOpen || false}
        title={t("barcode_print")}
        width={1500}
        height={990}
        isForm={true}
        closeModal={() => {
          dispatch(toggleBarcodePrintPopup({ isOpen: false }));
        }}
        content={<Barcodeprint />}
      />
      <ERPModal
        isOpen={rootState.PopupData.exchangeRates.isOpen || false}
        title={t("exchange_rates")}
        width={800}
        height={700}
        isForm={true}
        closeModal={() => {
          dispatch(toggleExchangeRatesPopup({ isOpen: false }));
        }}
        content={<ExchangeRates />}
      />
      <ERPModal
        isOpen={rootState.PopupData.resetBranchDataForSync.isOpen || false}
        title={t("reset_branch_data_for_sync")}
        width={800}
        height={300}
        isForm={true}
        closeModal={() => {
          dispatch(toggleResetBranchDataForSync({ isOpen: false }));
        }}
        content={<ResetBranchDataForSync />}
      />
      <ERPModal
        isOpen={rootState.PopupData.refreshAllBranches.isOpen || false}
        title={t("refresh_all_branches")}
        width={800}
        height={300}
        isForm={true}
        closeModal={() => {
          dispatch(toggleRefreshAllBranches({ isOpen: false }));
        }}
        content={<RefreshAllBranches />}
      />
      <ERPModal
        isOpen={rootState.PopupData.headAndFooter.isOpen || false}
        title={t("headers_footers")}
        width={800}
        height={500}
        isForm={true}
        closeModal={() => {
          dispatch(toggleHeaderFooterPopup({ isOpen: false }));
        }}
        content={<HeadersAndFooters />}
      />
    </Fragment>
  );
};

export default Settings;
