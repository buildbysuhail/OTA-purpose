import React, { useEffect, useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import { useTranslation } from "react-i18next";
import ERPModal from "../../../components/ERPComponents/erp-modal";
import SystemCodes from "./system-codes";
import ApiPortalRegistration from "./api-portal-registration";
import Urls from "../../../redux/urls";
import { APIClient } from "../../../helpers/api-client";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";

const api = new APIClient();
const ConfigureEgs: React.FC = () => {
    const { t } = useTranslation('administration');
    const [systemModalOpen, setSystemModalOpen] = useState(false);
    const [apiPortalModalOpen, setApiPortalModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        companyType: "Trading Company",
        otp: "",
        certificateMethod: "Online",
        // environment: "Production",
        isSimulation: false
    });
    // Initial eInvoice data fetching api call
    useEffect(() => {
        const fetchData = async () => {
            try {
            const res = await api.getAsync(Urls.eInvoice_integration_settings);
            setFormData(prev => ({
                ...prev,
                ...res.data,
                isSimulation: res?.isSimulation,
                otp: res?.otp,
            }));
            } catch (error) {
            console.error("Error in fetching data", error);
            }
        };

        fetchData();
    }, []);

    const certificateMethods = [
        { value: "Online", label: t("online") },
        { value: "OnlineWithSupport", label: t("online_with_customer_care_support") },
    ];

    const environments = [
        { value: true, label: t("simulation") },
        { value: false, label: t("production") },
    ];

   const handleChange = (field: string, value: any) => {
        const newValue =
            value === "true" ? true : value === "false" ? false : value;
        setFormData((prev) => ({ ...prev, [field]: newValue }));
    };

    
    // GenerateComplianceBtn Api call 
    const handleGenerateComplianceBtnClick = async () => {
        try {
            const isSimulation = formData.isSimulation;
            const isOnline = formData.certificateMethod === "Online";
            const category =  formData.companyType;
            const otp = formData.otp;
            const res = await api.postAsync(`${Urls.generate_compliance_csid}?isSimulation=${isSimulation}&isOnline=${isOnline}&category=${category}&otp=${otp}`, {});
            // ERPAlert.show({
            //     title: t("suc"),
            //     // text: balanceMessage,
            //     text: "please_top_up_add_api_for_uninterrupted_service_keep_enough_api_balance_for_e_invoice_submission",
            //     icon: "warning",
            // });

        } catch (error) {
            console.error("Error", error);
        }
    };

    // GenerateProductionCertificateBtnClick Api call 
    const handleGenerateProductionCertificateBtnClick = async () => {
        try {
            const isSimulation = formData.isSimulation;
            const res = await api.postAsync(`${Urls.generate_production_csid}/?isSimulation=${isSimulation}`, {});

        } catch (error) {
            console.error("Error", error);
        }
    };
    
    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                {/* Company Type */}
                <ERPDataCombobox
                    id="companyType"
                    label={t("company_type")}
                    options={[
                        { value: "Trading Company", label: "Trading Company" },
                        { value: "Service Company", label: "Service Company" },
                        { value: "Real Estate Company", label: "Real Estate Company" },
                        { value: "Retail Company", label: "Retail Company" },
                        { value: "Shipping Company", label: "Shipping Company" },
                        { value: "Technology Company", label: "Technology Company" },
                        { value: "Manufacturing Company", label: "Manufacturing Company" },
                        { value: "Business", label: "Business" },
                    ]}
                    value={formData.companyType}
                    onChange={(e) => handleChange("companyType", e?.value || e)}
                    className="w-full"
                />

                {/* OTP */}
                <ERPInput
                    id="otp"
                    label={t("otp")}
                    value={formData.otp}
                    onChange={(e) => handleChange("otp", e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Certificate Generation Method */}
            <div className="border border-slate-300 rounded-md pt-5 px-3 pb-0 mt-6 relative">
                <label className="absolute top-[-21px] left-[7px] bg-white p-1 text-sm font-medium text-gray-700">
                    {t("certificate_generation_method")}
                </label>
                <div className="flex items-center gap-2">
                    {certificateMethods.map((method) => (
                        <ERPRadio
                            key={method.value}
                            id={`certificateMethod_${method.value}`}
                            name="certificateMethod"
                            value={method.value}
                            label={method.label}
                            checked={formData.certificateMethod === method.value}
                            onChange={() => handleChange("certificateMethod", method.value)}
                        />
                    ))}
                </div>
            </div>

            {/* Environment */}
            <div className="border border-slate-300 rounded-md pt-5 px-3 pb-0 mt-6 relative">
                <label className="absolute top-[-21px] left-[7px] bg-white p-1 text-sm font-medium text-gray-700">
                    {t("environment")}
                </label>
                <div className="flex items-center gap-2">
                    {environments.map((env) => (
                    <ERPRadio
                        key={env.value.toString()}
                        id={`environment_${env.value}`}
                        name="environment"
                        value={env.value.toString()} // convert to string for HTML
                        label={env.label}
                        checked={formData.isSimulation === env.value} // keep comparison boolean
                        onChange={() => handleChange("isSimulation", !!env.value)} // ensure boolean
                    />

                   ))}
                </div>
            </div>

            {/* <div className="flex items-center gap-2 mt-4">
                {environments.map((env) => (
                    <ERPRadio
                        key={env.value}
                        id={`environment_${env.value}`}
                        name="environment"
                        value={env.value}
                        label={env.label}
                        checked={formData.environment === env.value}
                        onChange={() => handleChange("environment", env.value)}
                    />
                ))}
            </div> */}

            {/* Buttons */}
            <div className="grid grid-cols-1 gap-2 mt-3">
                <div className="flex items-center gap-2 justify-between">
                    <ERPButton
                        title={t("generate_compilance_csid")}
                        variant="secondary"
                        className="flex-1"
                        onClick={handleGenerateComplianceBtnClick}
                    />
                    <ERPButton
                        title={t("generate_production_certificate")}
                        variant="secondary"
                        className="flex-1"
                        onClick={handleGenerateProductionCertificateBtnClick}
                    />
                </div>
                <div className="flex items-center gap-2 justify-between">
                    <ERPButton
                        title={t("register_system_codes")}
                        variant="secondary"
                        className="flex-1"
                        disabled
                        onClick={() => setSystemModalOpen(true)}
                    />
                    <ERPButton
                        title={t("api_portal_registration")}
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setApiPortalModalOpen(true)}
                    />
                </div>
            </div>
            <ERPModal
                width={700}
                title={(t("system_codes"))}
                isOpen={systemModalOpen}
                closeModal={() => setSystemModalOpen(false)}
                content={<SystemCodes />}
            />
            <ERPModal
                width={800}
                title={(t("api_portal_registration"))}
                isOpen={apiPortalModalOpen}
                closeModal={() => setApiPortalModalOpen(false)}
                content={<ApiPortalRegistration />}
            />
        </div>
    );
};

export default ConfigureEgs;
