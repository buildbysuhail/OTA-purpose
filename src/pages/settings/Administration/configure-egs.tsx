import React, { useState } from "react";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPDataCombobox from "../../../components/ERPComponents/erp-data-combobox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPRadio from "../../../components/ERPComponents/erp-radio";
import { useTranslation } from "react-i18next";

const ConfigureEgs: React.FC = () => {
    const { t } = useTranslation('administration');
    const [formData, setFormData] = useState({
        companyType: "Trading Company",
        otp: "",
        certificateMethod: "Online",
        environment: "Production",
    });

    const certificateMethods = [
        { value: "Online", label: t("online") },
        { value: "OnlineWithSupport", label: t("online_with_customer_care_support") },
    ];

    const environments = [
        { value: "Simulation", label: t("simulation") },
        { value: "Production", label: t("production") },
    ];

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formData);
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
            <div className="flex items-center gap-2 mt-4">
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
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 gap-2 mt-3">
                <div className="flex items-center gap-2 justify-between">
                    <ERPButton
                        title={t("generate_compilance_csid")}
                        variant="secondary"
                        className="flex-1"
                    />
                    <ERPButton
                        title={t("generate_production_certificate")}
                        variant="secondary"
                        className="flex-1"
                        onClick={handleSubmit}
                    />
                </div>
                <div className="flex items-center gap-2 justify-between">
                    <ERPButton
                        title={t("register_system_codes")}
                        variant="secondary"
                        className="flex-1"
                    />
                    <ERPButton
                        title={t("api_portal_registration")}
                        variant="secondary"
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default ConfigureEgs;
