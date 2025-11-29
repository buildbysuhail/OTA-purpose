import { Fragment, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import ErpDevGrid from "../../../components/ERPComponents/erp-dev-grid";
import { DevGridColumn } from "../../../components/types/dev-grid-column";
import { Plus } from "lucide-react";

const SystemCodes = () => {
    const { t } = useTranslation('administration');
    const [systemCodes, setSystemCodes] = useState([]);
    const [certMethod, setCertMethod] = useState<'online' | 'onlineWithSupport'>('online');
    const [environment, setEnvironment] = useState<'simulation' | 'production'>('simulation');

    // Define grid columns
    const columns: DevGridColumn[] = useMemo(() => [
        {
            dataField: "systemCodes",
            caption: t("system_codes"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 150,
            showInPdf: true,
        },
        {
            dataField: "createdOn",
            caption: t("created_on"),
            dataType: "date",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 120,
            showInPdf: true,
            cellRender: (cellElement: any) => {
                return cellElement.data?.createdOn
                    ? new Date(cellElement.data.createdOn).toLocaleDateString()
                    : "";
            },
        },
        {
            dataField: "otp",
            caption: t("otp"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100,
            showInPdf: true,
        },
        {
            dataField: "certificateActive",
            caption: t("certificate_active"),
            dataType: "boolean",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 120,
            showInPdf: true,
            cellRender: (cellElement: any) => {
                return (
                    <ERPRadio
                        checked={cellElement.data?.isActive}
                        disabled
                        id={`radio-${cellElement.data?.id}`}
                        name="gridActiveStatus"
                    />
                );
            },
        },
        {
            dataField: "remove",
            caption: t("remove"),
            allowSorting: false,
            allowSearch: false,
            allowFiltering: false,
            width: 80,
            cellRender: (cellElement: any, cellInfo: any) => {
                return (
                    <ERPButton
                        title={t("remove")}
                        variant="secondary"
                        className="text-red-500 hover:text-red-700"
                    />
                );
            },
        },
    ], [t]);

    return (
        <Fragment>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* OTP Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t('otp_management')}
                        </h2>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-5 border border-blue-100 dark:border-blue-800">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <ERPButton
                                    title={t("generate_otp")}
                                    variant="primary"
                                    className="shadow-sm hover:shadow-md transition-shadow"
                                />
                                <ERPInput
                                    id="otp"
                                    label={t('otp')}
                                    className="w-40 text-center font-mono font-semibold tracking-wider"
                                />
                                <ERPButton
                                    title={t("validate_otp")}
                                    variant="primary"
                                    className="shadow-sm hover:shadow-md transition-shadow"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span>{t("otp_will_send_to_email_in_settings")}</span>
                            </div>
                        </div>
                    </div>

                    {/* System Code Management */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t('system_code_management')}
                        </h2>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 mb-5 border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap items-start gap-4">
                                <div className="flex-1 min-w-[250px]">
                                    <ERPInput
                                        id="systemCode"
                                        label={t('system_code')}
                                        placeholder={t("enter_system_code")}
                                        className="w-full"
                                    />
                                    <a href="#" className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 dark:text-blue-400     hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors underline">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {t('current_system_code')}
                                    </a>
                                </div>
                                <ERPButton
                                    title={t("add_system_codes")}
                                    variant="secondary"
                                    startIcon={<span className="text-lg font-bold"><Plus className="w-4 h-4" /></span>}
                                    className="shadow-sm hover:shadow-md transition-shadow"
                                />
                            </div>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                            <ErpDevGrid
                                columns={columns}
                                data={systemCodes}
                                showLocalData={true}
                                hideGridAddButton={true}
                                enablefilter={false}
                                hideToolbar={true}
                                hideDefaultExportButton={true}
                                allowSearching={false}
                                allowExporting={false}
                                allowExport={false}
                                gridId="systemCodesGrid"
                            />
                        </div>
                    </div>

                    {/* Certificate Configuration */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t('certificate_configuration')}
                        </h2>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-5 mb-5 border border-purple-100 dark:border-purple-800">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        {t("certificate_generation_method")}
                                    </div>
                                    <div className="space-y-3 pl-1">
                                        <div className="flex items-center">
                                            <ERPRadio
                                                id="online"
                                                name="certMethod"
                                                label={t("online")}
                                                value="online"
                                                checked={certMethod === 'online'}
                                                onChange={() => setCertMethod('online')}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <ERPRadio
                                                id="onlineWithSupport"
                                                name="certMethod"
                                                label={t("online_with_customer_care_support")}
                                                value="onlineWithSupport"
                                                checked={certMethod === 'onlineWithSupport'}
                                                onChange={() => setCertMethod('onlineWithSupport')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        {t("environment")}
                                    </div>
                                    <div className="space-y-3 pl-1">
                                        <div className="flex items-center">
                                            <ERPRadio
                                                id="simulation"
                                                name="environment"
                                                label={t("simulation")}
                                                value="simulation"
                                                checked={environment === 'simulation'}
                                                onChange={() => setEnvironment('simulation')}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <ERPRadio
                                                id="production"
                                                name="environment"
                                                label={t("production")}
                                                value="production"
                                                checked={environment === 'production'}
                                                onChange={() => setEnvironment('production')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <ERPButton
                                title={t("generate_compliance_csid")}
                                variant="secondary"
                                className="w-full shadow-sm hover:shadow-md transition-shadow py-3"
                            />
                            <ERPButton
                                title={t("generate_production_certificate")}
                                variant="primary"
                                className="w-full shadow-sm hover:shadow-md transition-shadow py-3"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default SystemCodes;