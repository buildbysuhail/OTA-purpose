import { FC, Fragment, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import RouteGuard from "../../../utilities/route-guard";
import { UserAction } from "../../../helpers/user-right-helper";
import { TransactionBase, transactionRoutes } from "./transaction-routes";
import { ReportsMenuItems } from "../sidebar/sidemenu/reports-routes";

// Pages / Components (lazy)
const ApplicationSettingsVirtual = lazy(() => import("../../../pages/settings/system/app-new/application-settings-virtual"));
const Templates = lazy(() => import("../../../pages/InvoiceDesigner/Templates"));
const Settings = lazy(() => import("../../../pages/settings/AllSettings/Settings"));
const UserActionReport = lazy(() => import("../../../pages/settings/system/user-action-report"));
const ReportList = lazy(() => import("../../ERPComponents/reports/reports-list"));
const TemplateDesignerLayout = lazy(() => import("../layout/template-designer-layout"));

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

// Accounts Masters
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

// Transactions
const AccTransactionMobile = lazy(() => import("../../../pages/accounts/transactions/acc-transaction-mobile"));
const AccTransactionGrid = lazy(() => import("../../../pages/accounts/transactions/acc-transacton-grid"));
const TransactionGrid = lazy(() => import("../../../pages/inventory/transactions/purchase/transacton-grid"));
const SalesTransactionGrid = lazy(() => import("../../../pages/inventory/transactions/sales/transacton-grid"));
const PostDatedCheques = lazy(() => import("../../../pages/accounts/transactions/acc-post-dated-cheques"));
const AccTransactionFormContainer = lazy(() => import("../../../pages/accounts/transactions/acc-transaction-container"));
const BankReconciliation = lazy(() => import("../../../pages/accounts/transactions/acc-bank-reconciliation"));
const TransactionFormContainer = lazy(() => import("../../../pages/inventory/transactions/purchase/transaction-container"));
const SalesTransactionFormContainer = lazy(() => import("../../../pages/inventory/transactions/sales/transaction-container"));
const AccTransactionFormContainerView = lazy(() => import("../../../pages/accounts/transactions/acc-transaction-View-container"));

// Named export
const SearchProvider = lazy(() =>
  import("../../../pages/accounts/transactions/search-context.tsx").then(m => ({ default: m.SearchProvider }))
);

// Integrations
const SmsIntegration = lazy(() => import("../../../pages/settings/Integration/sms-integration"));
const EmailIntegration = lazy(() => import("../../../pages/settings/Integration/email-integration"));
const FileUploadIntegration = lazy(() => import("../../../pages/settings/Integration/file-upload-integration"));
const WhatsappIntegration = lazy(() => import("../../../pages/settings/Integration/whatsapp-integration"));
const ShortkeysSettings = lazy(() => import("../../../pages/settings/Integration/shortkeysSettings"));
const FcmPushNotificationTest = lazy(() => import("../../../pages/settings/Integration/fcm-push-notification-test"));

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

// Inventory Reports
const PriceList = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/price-list/price-list-report"));
const StockLedger = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/stock-ledger/stock-ledger-report"));
const DailyBalanceAmount = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/daily-balance/daily-balance-report"));
const StockFlow = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/stock-flow/stock-flow-report"));
const TransactionAnalysisReport = lazy(() => import("../../../pages/inventory/reports/other-inventory-reports/transaction-analysis-report/transaction-analysis-report"));

// Other Inventory Masters
const TaxCategoryIndia = lazy(() => import("../../../pages/inventory/masters/tax-category-india/tax-category-india"));
const TcsCategory = lazy(() => import("../../../pages/inventory/masters/tcs-category/tcs-category"));
const GeneralMaster = lazy(() => import("../../../pages/inventory/masters/general-master"));
const TwilioPdfDownloader = lazy(() => import("../../../pages/inventory/masters/pdf-download"));
const ProductPricesGCC = lazy(() => import("../../../pages/inventory/masters/product-prices/products-price-gcc"));
const ProductPricesIndia = lazy(() => import("../../../pages/inventory/masters/product-prices/products-price-india"));

// Misc / Test Pages
const Test = lazy(() => import("../../../pages/test"));
const TotalSummary = lazy(() => import("../../../pages/total-summary"));
const TestInputButton = lazy(() => import("../../../pages/test-input-button"));
interface ContentProps { }
const loading = (
  <div className="w-full h-screen bg-transparent flex items-center justify-center">
    <div className="h-6 w-6 rounded-full bg-blue-700 animate-ping"></div>
  </div>
);

const Content: FC<ContentProps> = () => {
  const [myClass, setMyClass] = useState("");
   const popupData = useSelector((state: RootState) => state?.PopupData);
  const userSession = useSelector((state: RootState) => state.UserSession);
  const clientSession = useSelector((state: RootState) => state.ClientSession);
  
const PrintJobIndicator = () => {
  if (!popupData.printJobLoader?.isPrinting) return null; 

  return (
  <div className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-[99999] print-indicator">
  🖨️ Printing…
  </div>
  );
};
  const guardedRoutes = [
    // Profile
    { path: "/profile/workspace-logo", element: <WorkSpaceSettings /> },
    { path: "/profile/workspace-basic-information", element: <WorkSpaceSettings /> },
    { path: "/profile/primary-email", element: <WorkSpaceSettings /> },
    { path: "/profile/business-number", element: <WorkSpaceSettings /> },
    { path: "/security/deleteWorkspace", element: <WorkspaceSettingsSecurity /> },

    // User Management
    { path: "/user-management/users", element: <Users /> },
    { path: "/user-management/userstypes", element: <UserTypes /> },

    // Administration
    { path: "/administration/branch", element: <BranchGrid /> },

    // System
    { path: "/system/counters", element: <SystemCounters /> },
    { path: "/system/vouchers", element: <SystemVoucher /> },
    { path: "/system/financial-year", element: <FinancialYear /> },
    { path: "/system/reminders", element: <Reminders /> },
    { path: "/system/user-actions", element: <UserActionReport /> },
    { path: "/system/application-settings", element: <ApplicationSettingsVirtual /> },
    { path: "/system/revert-bill-modifications", element: <RevertBillModifications /> },
    { path: "/system/notification-settings", element: <NotificationSettings /> },
    { path: "/system/counter-settings", element: <CounterSettings /> },
    { path: "settings", element: <Settings /> },

    // Integration
    { path: "/integration/sms", element: <SmsIntegration /> },
    { path: "/integration/whatsapp", element: <WhatsappIntegration /> },
    { path: "/integration/email", element: <EmailIntegration /> },
    { path: "/integration/file-upload", element: <FileUploadIntegration /> },
    { path: "/integration/test", element: <Test /> },
    { path: "/integration/total-summary", element: <TotalSummary /> },
    { path: "/integration/shortkeys_settings", element: <ShortkeysSettings defaultShortcuts={[]} /> },
    { path: "/integration/test-input-button", element: <TestInputButton /> },
    { path: "/integration/fcm_push_notification_test", element: <FcmPushNotificationTest /> },

    // Templates
    { path: "/templates", element: <Templates /> },
    { path: "/templates/invoice_designer/*", element: <TemplateDesignerLayout /> },

    // Accounts
    { path: "/account-masters/account-group", element: <AccountsMasters /> },
    { path: "/account-masters/Bank-Cards", element: <BankCards /> },
    { path: "/account-masters/upi", element: <Upi /> },
    { path: "/account-masters/privilege-cards", element: <PrivilegeCard /> },
    { path: "/account-masters/account-ledger", element: <AccountsLedger /> },
    { path: "/account-masters/party-category", element: <PartyCategory /> },
    { path: "/account-masters/currency-master", element: <CurrencyMaster /> },
    { path: "/account-masters/cost-center", element: <CostCenter /> },
    { path: "/account-masters/branch-ledgers", element: <BranchLedger /> },
    { path: "/account-masters/chart-of-accounts", element: <ChartOfAccounts /> },
    { path: "/account-masters/suppliers", element: <Suppliers /> },
    { path: "/account-masters/customers", element: <Customers /> },
    { path: "/account-masters/customer-supplier-ledger", element: <CustomerSupplierLedger /> },

    // Inventory
    { path: "/inventory-masters/products", element: <Products /> },
    { path: "/inventory-masters/product-group", element: <ProductGroup /> },
    { path: "/inventory-masters/product-category", element: <ProductCategory /> },
    { path: "/inventory-masters/brands", element: <Brands /> },
    { path: "/inventory-masters/price-category", element: <PriceCategory /> },
    { path: "/inventory-masters/unit-of-measure", element: <UnitOfMeasure /> },
    { path: "/inventory-masters/vehicles", element: <Vehicles /> },
    { path: "/inventory-masters/warehouse", element: <WareHouse /> },
    {
      path: "/inventory-masters/tax-category",
      element: clientSession.isAppGlobal ? <TaxCategoryIndia /> : <TaxCategory />,
    },
    { path: "/inventory-masters/tcs-category", element: <TcsCategory /> },
    { path: "/inventory-masters/salesman-route", element: <SalesmanRoute /> },
    { path: "/inventory-masters/section", element: <Section /> },
    { path: "/inventory-masters/schemes", element: <Schemes /> },
    { path: "/inventory-masters/scheme_settings_special", element: <SchemeSettingsSpecial /> },
    { path: "/inventory-masters/scheme_settings_discount", element: <SchemeSettingsDiscount /> },
    {
      path: "/inventory-masters/product_price_settings",
      element: clientSession.isAppGlobal ? <ProductPricesIndia /> : <ProductPricesGCC />,
    },
    { path: "/inventory-masters/sales-route", element: <SalesRoute /> },
    { path: "/inventory-masters/group-category", element: <GroupCategory /> },
    { path: "/inventory-masters/general_master", element: <GeneralMaster /> },
  ];

  return (
    <>
      <PrintJobIndicator />
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
        
        <Route path="/members" element={<WorkspaceSettingsMembers />} />
        {guardedRoutes.map(({ path, element }, idx) => (
        <Route
          key={idx}
          path={path}
          element={
            <RouteGuard formCode="" action={UserAction.Show} onlyBaCa={true}>
              {element}
            </RouteGuard>
          }
        />
      ))}
  
        
        <Route path="/pdf/download" element={<TwilioPdfDownloader  />} />

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
          <Fragment key={`transaction-route-${route.transactionBase}-${route.transactionType}-${index}`}>
            {route.transactionBase === TransactionBase.Accounts && (
              <>
                <Route
                  key={`accounts-new-${route.transactionType}-${index}`}
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
                  key={`accounts-list-${route.transactionType}-${index}`}
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
                  key={`accounts-view-${route.transactionType}-${index}`}
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
                        isInvTrans={true}
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
            <Route
                  key={`${123}-purchase/transactions-lpo-`}
                  path={`purchase/transactions/LPO`}
                  element={
                    <RouteGuard formCode={route.formCode} action={UserAction.Show}>
                      <TransactionFormContainer
                        voucherType={"LPO"}
                        transactionType={"LocalPurchaseOrder"}
                        formCode={""}
                        voucherPrefix={""}
                        formType={""}
                        title={"LPO"}
                        drCr={route.drCr}
                        voucherNo={0}
                      />
                    </RouteGuard>
                  }
                />
            {route.transactionBase == TransactionBase.Sales && (
              <>
                <Route
                  key={`${index}-${route.transactionBase}-${route.transactionType}-`}
                  path={`${route.transactionBase}/${route.transactionType}`}
                  element={
                    <RouteGuard formCode={route.formCode} action={route.action}>
                      <SalesTransactionFormContainer
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
                      <SalesTransactionGrid
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
                        isInvTrans={true}
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
          </Fragment>
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

 {ReportsMenuItems.map((route, index) => (
  <Fragment key={`route-group-${index}`}>
    {route?.children?.map((routeChild, indexChild) => {
      const childPath = routeChild.path.includes("/_/")
        ? "/" + routeChild.path.split("/_/")[1]
        : routeChild.path;
              // console.log(childPath);
              // console.log("path");

      return (
        <Route
          key={`route-${index}-${indexChild}-${childPath}`}
          path={childPath}
          element={
            <RouteGuard formCode={routeChild.formCode} action={routeChild.action}>
              {routeChild.element}
            </RouteGuard>
          } 
        />
      );
    })}
  </Fragment>
))}
      

        
      </Routes>
    </Suspense>
    </>
  );
};
export default Content;
