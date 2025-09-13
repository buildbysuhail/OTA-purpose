import { FC, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ApplicationSettingsVirtual from "../../../pages/settings/system/app-new/application-settings-virtual";
import Templates from "../../../pages/InvoiceDesigner/Templates";
import Settings from "../../../pages/settings/AllSettings/Settings";
import UserActionReport from "../../../pages/settings/system/user-action-report";
import ReportList from "../../ERPComponents/reports/reports-list";
import TemplateDesignerLayout from "../layout/template-designer-layout";

const AccountSettingsSecurity = lazy(() => import("../../../pages/account-settings/account-settings-security"));
const AccountSettingsPreference = lazy(() => import("../../../pages/account-settings/account-settings-preference"));
const WorkSpaceSettings = lazy(() => import("../../../pages/work-space/workspace-settings"));
const AccountSettingsSessions = lazy(() => import("../../../pages/account-settings/account-settings-sessions"));
const AccountSettingsProfile = lazy(() => import("../../../pages/account-settings/account-settings-profile"));
const WorkspaceSettingsMembers = lazy(() => import("../../../pages/work-space/workspace-settings-members"));
const WorkspaceSettingsSecurity = lazy(() => import("../../../pages/work-space/workspace-settings-security"));
const UserTypes = lazy(() => import("../../../pages/settings/userManagement/user-types"));
const Users = lazy(() => import("../../../pages/settings/userManagement/Users"));
const SystemCounters = lazy(() => import("../../../pages/settings/system/counters"));
const SystemVoucher = lazy(() => import("../../../pages/settings/system/vouchers"));
const FinancialYear = lazy(() => import("../../../pages/settings/system/financial-year"));
const Dashboard = lazy(() => import("../../../pages/dashboards/crm/crm"));
const Reminders = lazy(() => import("../../../pages/settings/system/remainder"));
const BranchGrid = lazy(() => import("../../../pages/settings/Administration/branch"));
const NotificationSettings = lazy(() => import("../../../pages/settings/system/notification-settings"));
const CounterSettings = lazy(() => import("../../../pages/settings/system/counter-settings"));

// Inventory Starts
// const InvTransactionMobile = lazy(
//   () => import("../../../pages/inventory/inv-transaction-mobile")
// );
// Inventory End
// Acc Starts

const AccountsMasters = lazy(() => import("../../../pages/accounts/masters/account-groups/account-group"));
const BankCards = lazy(() => import("../../../pages/accounts/masters/bank-cards/bank-cards"));
const Upi = lazy(() => import("../../../pages/accounts/masters/upi/upi"));
const AccountsLedger = lazy(() => import("../../../pages/accounts/masters/account-ledgers/account-ledger"));
const CostCenter = lazy(() => import("../../../pages/accounts/masters/cost centre/cost-centre"));
const BranchLedger = lazy(() => import("../../../pages/accounts/masters/branch ledger/branch-ledger"));
const PartyCategory = lazy(() => import("../../../pages/accounts/masters/account-party-category/party-category"));
const PrivilegeCard = lazy(() => import("../../../pages/accounts/masters/account-privilege-card/privilege-card"));
const CurrencyMaster = lazy(() => import("../../../pages/accounts/masters/currency-master/currency-master"));
const RevertBillModifications = lazy(() => import("../../../pages/settings/system/revert-bill-modifications"));
const ChartOfAccounts = lazy(() => import("../../../pages/accounts/masters/chart-of-accounts/chart-of-accounts"));
const Customers = lazy(() => import("../../../pages/accounts/masters/parties/customers"));
const Suppliers = lazy(() => import("../../../pages/accounts/masters/parties/suppliers"));
const CustomerSupplierLedger = lazy(() => import("../../../pages/accounts/masters/customer/supplier/ledger/customer-supplier-ledger"));
// Acc End

//side menu account
const AccTransactionMobile = lazy(() => import("../../../pages/accounts/transactions/acc-transaction-mobile"));
//integration
const SmsIntegration = lazy(() => import("../../../pages/settings/Integration/sms-integration"));
const EmailIntegration = lazy(() => import("../../../pages/settings/Integration/email-integration"));
const FileUploadIntegration = lazy(() => import("../../../pages/settings/Integration/file-upload-integration"));
const WhatsappIntegration = lazy(() => import("../../../pages/settings/Integration/whatsapp-integration"));
const Test = lazy(() => import("../../../pages/test"));
// const AccountGroupTypeTest = lazy(() => import('../../../pages/accountgrouptest'));
const TotalSummary = lazy(() => import("../../../pages/total-summary"));
const ShortkeysSettings = lazy(() => import("../../../pages/settings/Integration/shortkeysSettings"));
const TestInputButton = lazy(() => import("../../../pages/test-input-button"));
const AccTransactionGrid = lazy(() => import("../../../pages/accounts/transactions/acc-transacton-grid"));
const TransactionGrid = lazy(() => import("../../../pages/inventory/transactions/purchase/transacton-grid"));

// Inventory Masters
const Products = lazy(() => import("../../../pages/inventory/masters/products/products"));
const ProductGroup = lazy(() => import("../../../pages/inventory/masters/product-group/product-group"));
const ProductCategory = lazy(() => import("../../../pages/inventory/masters/product-category/product-category"));
const Brands = lazy(() => import("../../../pages/inventory/masters/brands/brands"));
const PriceCategory = lazy(() => import("../../../pages/inventory/masters/price-category/price-category"));
const UnitOfMeasure = lazy(() => import("../../../pages/inventory/masters/unit-of-meassure/unit-of-measure"));
const Vehicles = lazy(() => import("../../../pages/inventory/masters/vehicles/vehicles"));
const WareHouse = lazy(() => import("../../../pages/inventory/masters/warehouse/warehouse"));
const TaxCategory = lazy(() => import("../../../pages/inventory/masters/tax-category/tax-category"));
const SalesmanRoute = lazy(() => import("../../../pages/inventory/masters/salesman-route/salesman-route"));
const Schemes = lazy(() => import("../../../pages/inventory/masters/schemes/schemes"));
const SchemeSettingsSpecial = lazy(() => import("../../../pages/inventory/masters/schemes-settings/scheme-settings-special"));
const SchemeSettingsDiscount = lazy(() => import("../../../pages/inventory/masters/schemes-settings/scheme-settings-discount"));
const SalesRoute = lazy(() => import("../../../pages/inventory/masters/sales-route/sales-route"));
const Section = lazy(() => import("../../../pages/inventory/masters/section/section"));
const GroupCategory = lazy(() => import("../../../pages/inventory/masters/group-category/group-category"));
const SpecialSchemes = lazy(() => import("../../../pages/inventory/masters/special-schemes/special-schemes"));
const ListedProductPrices = lazy(() => import("../../../pages/inventory/masters/listed-product-prices/listed-product-prices"));
//transaction
const PostDatedCheques = lazy(() => import("../../../pages/accounts/transactions/acc-post-dated-cheques"));
// Inventory Reports
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import RouteGuard from "../../../utilities/route-guard";
import { UserAction } from "../../../helpers/user-right-helper";
import { TransactionBase, transactionRoutes } from "./transaction-routes";
import AccTransactionFormContainer from "../../../pages/accounts/transactions/acc-transaction-container";
import BankReconciliation from "../../../pages/accounts/transactions/acc-bank-reconciliation";
// import StockTransfer from "../../../pages/inventory/reports/stock-transfer-report/stock-transfer";
// import DamageStock from "../../../pages/inventory/reports/damage-stock-report/damage-stock";
// import ExcessStock from "../../../pages/inventory/reports/excess-stock-report/excess-stock";
// import ShortageStock from "../../../pages/inventory/reports/shortage-stock-report/shortage-stock";
// import BranchTransferOut from "../../../pages/inventory/reports/branch-transfer-out-report/branch-tranfer-out";
import TransactionFormContainer from "../../../pages/inventory/transactions/purchase/transaction-container";
// import BranchTransferIn from "../../../pages/inventory/reports/branch-transfer-in-report/branch-tranfer-in";
// import BranchTransferSummaryOut from "../../../pages/inventory/reports/branch-transfer-summary-out-report/branch-tranfer-summary-out";
// import BranchTransferSummaryIn from "../../../pages/inventory/reports/branch-transfer-summary-in-report/branch-tranfer-summary-in";
import AccTransactionFormContainerView from "../../../pages/accounts/transactions/acc-transaction-View-container";
import { SearchProvider } from "../../../pages/accounts/transactions/search-context.tsx";
import { ReportsMenuItems } from "../sidebar/sidemenu/reports-routes";
import TaxCategoryIndia from "../../../pages/inventory/masters/tax-category-india/tax-category-india";
import TcsCategory from "../../../pages/inventory/masters/tcs-category/tcs-category";
import GeneralMaster from "../../../pages/inventory/masters/general-master";
import TwilioPdfDownloader from "../../../pages/inventory/masters/pdf-download";
import ProductPricesGCC from "../../../pages/inventory/masters/product-prices/products-price-gcc";
import ProductPricesIndia from "../../../pages/inventory/masters/product-prices/products-price-india";

const PriceList = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/price-list/price-list-report"));
const StockLedger = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/stock-ledger/stock-ledger-report"));
const DailyBalanceAmount = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/daily-balance/daily-balance-report"));
// const OpeningStock = lazy(() => import("../../../pages/inventory/reports/opening-stock-report/opening-stock"));
const StockFlow = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/stock-flow/stock-flow-report"));
const TransactionAnalysisReport = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/transaction-analysis-report/transaction-analysis-report"));

interface ContentProps { }
const loading = (
  <div className="w-full h-screen bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);

const Content: FC<ContentProps> = () => {
  const [myClass, setMyClass] = useState("");
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  return (
    <Suspense fallback={loading}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile/avatar" element={<AccountSettingsProfile />} />
        <Route path="/profile/basic-information" element={<AccountSettingsProfile />} />
        <Route path="/profile/email-address" element={<AccountSettingsProfile />} />
        <Route path="/profile/phone-number" element={<AccountSettingsProfile />} />
        <Route path="/security/password" element={<AccountSettingsSecurity />} />
        <Route path="/preferences/theme" element={<AccountSettingsPreference />} />
        <Route path="/preferences/language" element={<AccountSettingsPreference />} />
        <Route path="/preferences/system-preferences" element={<AccountSettingsPreference />} />
        <Route path="/sessions" element={<AccountSettingsSessions />} />
        <Route path="/profile/workspace-logo" element={<WorkSpaceSettings />} />
        <Route path="/profile/workspace-basic-information" element={<WorkSpaceSettings />} />
        <Route path="/profile/primary-email" element={<WorkSpaceSettings />} />
        <Route path="/profile/business-number" element={<WorkSpaceSettings />} />
        <Route path="/security/deleteWorkspace" element={<WorkspaceSettingsSecurity />} />
        <Route path="/members" element={<WorkspaceSettingsMembers />} />

        {/* settings user */}
        <Route path="/user-management/users" element={<Users />} />
        <Route path="/user-management/userstypes" element={<UserTypes />} />

        {/* settings Administer*/}
        <Route path="/administration/branch" element={<BranchGrid />} />

        {/* settings Systems */}
        <Route path="/system/counters" element={<SystemCounters />} />
        <Route path="/system/vouchers" element={<SystemVoucher />} />
        <Route path="/system/financial-year" element={<FinancialYear />} />
        <Route path="/system/reminders" element={<Reminders />} />
        <Route path="/system/user-actions" element={<UserActionReport />} />
        <Route path="/system/application-settings" element={<ApplicationSettingsVirtual />} />
        <Route path="/system/revert-bill-modifications" element={<RevertBillModifications />} />
        <Route path="/system/notification-settings" element={<NotificationSettings />} />
        <Route path="/system/counter-settings" element={<CounterSettings />} />
        <Route path="settings" element={<Settings />} />

        {/* Integration Start */}
        <Route path="/integration/sms" element={<SmsIntegration />} />
        <Route path="/integration/whatsapp" element={<WhatsappIntegration />} />
        <Route path="/integration/email" element={<EmailIntegration />} />
        <Route path="/integration/file-upload" element={<FileUploadIntegration />} />
        <Route path="/integration/test" element={<Test />} />
        {/* <Route path="/integration/account_group_test" element={<AccountGroupTypeTest />} /> */}
        <Route path="/integration/total-summary" element={<TotalSummary />} />
        <Route path="/integration/shortkeys_settings" element={<ShortkeysSettings defaultShortcuts={[]} />} />
        <Route path="/integration/test-input-button" element={<TestInputButton />} />
        {/* Integration End */}

        {/* Templates starts */}
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/invoice_designer/*" element={<TemplateDesignerLayout />} />
        {/* Templates ends */}

        {/* Inventory Starts */}
        {/* <Route path="sales/new" element={<InvTransactionMobile />} /> */}
        {/* Inventory End */}

        {/* Accounts Start */}
        {/* Accounts Masters */}
        <Route path="account-masters/account-group" element={<AccountsMasters />} />
        <Route path="account-masters/Bank-Cards" element={<BankCards />} />
        <Route path="account-masters/upi" element={<Upi />} />
        <Route path="account-masters/privilege-cards" element={<PrivilegeCard />} />
        <Route path="account-masters/account-ledger" element={<AccountsLedger />} />
        <Route path="account-masters/party-category" element={<PartyCategory />} />
        <Route path="/account-masters/currency-master" element={<CurrencyMaster />} />
        <Route path="/account-masters/cost-center" element={<CostCenter />} />
        <Route path="account-masters/branch-ledgers" element={<BranchLedger />} />
        <Route path="account-masters/chart-of-accounts" element={<ChartOfAccounts />} />
        <Route path="account-masters/suppliers" element={<Suppliers />} />
        <Route path="account-masters/customers" element={<Customers />} />
        <Route path="/account-masters/customer-supplier-ledger" element={<CustomerSupplierLedger />} />
        {/* Accounts Masters End */}

<Route path="/inventory-masters/products" element={<Products />} />
        <Route path="/inventory-masters/product-group" element={<ProductGroup />} />
        <Route path="/inventory-masters/product-category" element={<ProductCategory />} />
        <Route path="/inventory-masters/brands" element={<Brands />} />
        <Route path="/inventory-masters/price-category" element={<PriceCategory />} />
        <Route path="/inventory-masters/unit-of-measure" element={<UnitOfMeasure />} />
        <Route path="/inventory-masters/vehicles" element={<Vehicles />} />
        <Route path="/inventory-masters/warehouse" element={<WareHouse />} />
        <Route path="/inventory-masters/tax-category" element={clientSession.isAppGlobal ? <TaxCategoryIndia /> : <TaxCategory />} />
        <Route path="/inventory-masters/tcs-category" element={<TcsCategory />} />
        <Route path="/inventory-masters/salesman-route" element={<SalesmanRoute />} />
        <Route path="/inventory-masters/section" element={<Section />} />
        <Route path="/inventory-masters/schemes" element={<Schemes />} />
        <Route path="/inventory-masters/scheme_settings_special" element={<SchemeSettingsSpecial />} />
        <Route path="/inventory-masters/scheme_settings_discount" element={<SchemeSettingsDiscount />} />
        <Route path="/inventory-masters/product_price_settings" element={clientSession.isAppGlobal ? <ProductPricesIndia /> : <ProductPricesGCC />} />
        <Route path="/inventory-masters/sales-route" element={<SalesRoute />} />
        <Route path="/inventory-masters/group-category" element={<GroupCategory />} />
        <Route path="/inventory-masters/general_master" element={<GeneralMaster />} />

        <Route path="/pdf" element={<TwilioPdfDownloader  />} />

        {/* Accounts Transaction */}
        {/* <Route
            key={index}
            path={route.path}
            element={
              <RouteGuard formCode={route.formCode} action={route.action}>
                <AccTransaction
                  voucherType={route.voucherType}
                  transactionType={route.transactionType}
                  formCode={route.formCodeAcc}
                  voucherPrefix={route.voucherPrefix}
                  formType={route.formType}
                  title={route.title}
                  drCr={route.drCr}
                  voucherNo={route.voucherNo}
                />
              </RouteGuard>
            }
          /> */}

        {transactionRoutes.map((route, index) => (
          <>
            {route.transactionBase == TransactionBase.Accounts && (
              <>
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <AccTransactionFormContainer
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        formCode={route.formCode}
                        voucherPrefix={""}
                        formType={route.formType}
                        title={route.title}
                        drCr={route.drCr}
                        voucherNo={0}
                      />
                    </RouteGuard>
                  }
                />
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}List`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                       <SearchProvider>
                      <AccTransactionGrid
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        title={route.listTitle}
                        addTitle={route.title}
                      />
                      </SearchProvider>
                    </RouteGuard>
                  }
                />
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}/:voucherNo`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                       <SearchProvider>
                      <AccTransactionFormContainerView
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        formCode={route.formCode}
                        voucherPrefix={""}
                        formType={route.formType}
                        title={route.title}
                        drCr={route.drCr}
                        voucherNo={0}
                      />
                      </SearchProvider>
                    </RouteGuard>
                  }
                />
                {/* <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}/:voucherNo/edit`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <AccTransactionFormContainer
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        formCode={route.formCode}
                        voucherPrefix={""}
                        formType={route.formType}
                        title={route.title}
                        drCr={route.drCr}
                        voucherNo={0}
                      />
                    </RouteGuard>
                  }
                /> */}
              </>
            )}
            {route.transactionBase == TransactionBase.Purchase && (
              <>
                <Route
                  key={`${index}-${route.transactionBase}-${route.transactionType}-`}
                  path={`${route.transactionBase}/${route.transactionType}`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <TransactionFormContainer
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        formCode={route.formCode}
                        voucherPrefix={""}
                        formType={route.formType}
                        title={route.title}
                        drCr={route.drCr}
                        voucherNo={0}
                      />
                    </RouteGuard>
                  }
                />
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}List`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <TransactionGrid
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        title={route.listTitle}
                        addTitle={route.title}
                      />
                    </RouteGuard>
                  }
                />
                <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}/:voucherNo`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <SearchProvider>
                      <AccTransactionFormContainerView ///abc
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        formCode={route.formCode}
                        voucherPrefix={""}
                        formType={route.formType}
                        title={route.title}
                        drCr={route.drCr}
                        voucherNo={0}
                      />
                      </SearchProvider>
                    </RouteGuard>
                  }
                />
                {/* <Route
                  key={index}
                  path={`${route.transactionBase}/${route.transactionType}/:voucherNo/edit`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <TransactionFormContainer
                        voucherType={route.voucherType}
                        transactionType={route.transactionType}
                        formCode={route.formCode}
                        voucherPrefix={""}
                        formType={route.formType}
                        title={route.title}
                        drCr={route.drCr}
                        voucherNo={0}
                      />
                    </RouteGuard>
                  }
                /> */}
              </>
            )}
          </>
        ))}
       <Route
          path={`/accounts/transactions/BankReconciliation`}
          element={
            <RouteGuard formCode="BRC" action={UserAction.Show}>
              <BankReconciliation />
            </RouteGuard>
          }
        />
        <Route
          path="accounts/transactions/PostDatedCheques"
          element={
            <RouteGuard formCode="PDC" action={UserAction.Show}>
              <PostDatedCheques />
            </RouteGuard>
          }
        />
        {/* Accounts Masters End */}

        {/* Reports */}
        <Route path="/reports" element={<ReportList />} />

         {ReportsMenuItems.map((route, index) => 
          route?.children?.map((routeChild, indexChild) => {
                const childPath = routeChild.path.includes("/_/")
                  ? "/" + routeChild.path.split("/_/")[1]
                  : routeChild.path;
              // console.log(childPath);
              // console.log("path");

        return (

                <Route
            key={childPath}
            path={childPath}
            element={
                <RouteGuard  formCode={routeChild.formCode} action={routeChild.action} >
                {routeChild.element}
                </RouteGuard>} />
                
              ); 
            })

        
      )
      }
      

        
      </Routes>
    </Suspense>
  );
};
export default Content;
