import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ERPButton from "../../../components/ERPComponents/erp-button";
import ERPInput from "../../../components/ERPComponents/erp-input";
import { Plus } from "lucide-react";
import { APIClient } from "../../../helpers/api-client";
import Urls from "../../../redux/urls";
import ERPAlert from "../../../components/ERPComponents/erp-sweet-alert";

const api = new APIClient();
const APIPortalRegistration = () => {
    const { t } = useTranslation('administration');
    // Form states
    const [name, setName] = useState<string>("");
    const [productSerial, setProductSerial] = useState<string>("");
    const [taxRegNo, setTaxRegNo] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [balanceData, setBalanceData] = useState<any>(null);
    const [balanceValue, setBalanceValue] = useState<number>(0)
    const [balanceMessage, setBalanceMessage] = useState<string>("")
    const [otpFieldVisible, setOtpFiledVisible] =  useState<boolean>(false);
    const [verifyBtnStyle, setVerifyBtnStyle] = useState<boolean>(false);

    // Initial eInvoice data fetching api call
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getAsync(Urls.eInvoice_apiPortal_balance);
                setBalanceData(res?.item);
                const splittedBalance = Number(balanceData?.apiBalance?.split(":")?.[1]?.trim() || 0);
                setBalanceValue(splittedBalance);
                setBalanceMessage(res?.message);
            } catch (error) {
                console.error("Error in fetching data", error);
            }
        };

        fetchData();
    }, []);
    
    useEffect(() => {
        if(balanceValue < 100 ){
            ERPAlert.show({
                title: t("warning"),
                // text: balanceMessage,
                text: t("please_top_up_add_api_for_uninterrupted_service_keep_enough_api_balance"),
                icon: "warning",
            });
        }

    }, [balanceValue]);

    const handleValidateEmail = async () => {
        try {
            const res = await api.postAsync(`${Urls.eInvoice_apiPortal_send_otp}/?email=${email}`, {});
            setOtpFiledVisible(true)
        } catch (error) {
            console.error("Error", error);
        }
    };
    
    // handleValidateOtp
    const handleValidateOtp = async () => {
        try {
            const res = await api.postAsync(`${Urls.eInvoice_apiPortal_validate_otp}?email=${email}&otp=${otp}`, {});
            if(res?.isOk === true){
                setVerifyBtnStyle(true)
            }

        } catch (error) {
            console.error("Error", error);
        }
    };

    // handleRegisterBtnClick function
    const handleRegisterBtnClick = async () => {
            try {
                const payload = {
                    userName: username,
                    password: password,
                    confirmPassword: confirmPassword,
                    phone: phone,
                    email: email,
                    otp: otp,
                    productSerial: productSerial,
                    taxRegNo: taxRegNo

                };
                const res = await api.postAsync(Urls.eInvoice_apiPortal_register, payload);
                // Need to manage the below section alert based on the response -  need discussion for this, now added for not forgetting
                if(res){
                    ERPAlert.show({
                    title: t("warning"),
                    text: res?.message,
                    icon: "warning",
                });
                }
            } catch (error) {
                console.error("Error", error);
            }
        };

    return (
        <Fragment>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Registration Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* API Balance Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    {t('api_balance_info')}
                                </h2>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                                    <div className="text-red-600 dark:text-red-400 font-medium text-sm">
                                        {balanceData
                                            ? <div className="flex flex-col text-red-700 font-semibold gap-1">
                                                <div>{balanceData?.apiBalance}</div>
                                                <div>{balanceData?.apiExpiryDate}</div>
                                              </div>
                                            : t("loading")}
                                        </div>
                                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-0 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Token Generation Card */}
                            {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <ERPButton
                                            title={t("generate_token")}
                                            variant="primary"
                                            className="shadow-sm hover:shadow-md transition-shadow"
                                        />
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-3 rounded-lg border border-green-200 dark:border-green-800">
                                            <span className="text-3xl font-bold text-green-600 dark:text-green-400 tracking-wider font-mono">
                                                000000
                                            </span>
                                            <span className="text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
                                                {t("valid_for_5_minutes")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* Registration Form Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {balanceData?.isSignupDone ? t("registered") : t("not_registered")}

                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("register_signup")}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <ERPInput
                                        id="name"
                                        label={t("name")}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t("enter_your_name")}
                                        className="w-full"
                                        // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                    />

                                    <ERPInput
                                        id="productSerial"
                                        label={t("product_serial")}
                                        value={productSerial}
                                        onChange={(e) => setProductSerial(e.target.value)}
                                        placeholder={t("enter_product_serial")}
                                        className="w-full"
                                        // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                    />

                                    <ERPInput
                                        id="taxRegNo"
                                        label={t("tax_reg_no")}
                                        value={taxRegNo}
                                        onChange={(e) => setTaxRegNo(e.target.value)}
                                        placeholder={t("enter_tax_registration_number")}
                                        className="w-full"
                                        // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                    />

                                    <div className="relative">
                                        <ERPInput
                                            id="email"
                                            label={t("email")}
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setVerifyBtnStyle(false);
                                            }}
                                            placeholder={t("enter_your_email")}
                                            className="w-full"
                                            type="email"
                                            // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                        />
                                        <div className="mt-2">
                                            
                                            <button
                                                onClick={handleValidateEmail}
                                                className={`text-sm text-blue-600 dark:text-blue-400 ${verifyBtnStyle ? "hidden" : "visible" } hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors`}>
                                                {t("send_otp_to_email")}
                                            </button>
                                                   
                                            {/* {balanceData?.gpSignupEnable === false ? <></> :
                                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors">
                                                {t("send_otp_to_email")}
                                            </button>
                                            }          */}
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-1 items-end">
                                        <ERPInput
                                            id="otp"
                                            label={t("otp")}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder={t("enter_otp")}
                                            className="flex-1 w-[80%]"
                                            disabled={otpFieldVisible === true ? false : true }  // this is for testing
                                            // disabled={!otpFieldVisible || balanceData?.gpSignupEnable === false}
                                        />
                                        <ERPButton
                                          title={verifyBtnStyle ? t("verified") :t("verify")}
                                          onClick={handleValidateOtp}
                                          variant={verifyBtnStyle ? "primary" : "secondary"}
                                          className="h-8"
                                        />
                                    </div>

                                    <ERPInput
                                        id="phone"
                                        label={t("phone")}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={t("enter_your_phone_number")}
                                        className="w-full"
                                        type="tel"
                                        // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                    />

                                    <ERPInput
                                        id="username"
                                        label={t("username")}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder={t("choose_a_username")}
                                        className="w-full"
                                        // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                    />

                                    <ERPInput
                                        id="password"
                                        label={t("password")}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t("enter_password")}
                                        className="w-full"
                                        type="password"
                                        // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                    />

                                    <ERPInput
                                        id="confirmPassword"
                                        label={t("confirm_password")}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder={t("confirm_your_password")}
                                        className="w-full"
                                        type="password"
                                        // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                    />

                                    <div className="flex items-end gap-3">
                                        <ERPButton
                                            title={t("register")}
                                            variant="primary"
                                            className="shadow-sm hover:shadow-md transition-shadow px-8"
                                            onClick={handleRegisterBtnClick}
                                            // disabled={balanceData?.gpSignupEnable === false ? true : false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - API Packages */}
                        {/* <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                                <div className="text-left mb-3">
                                    <ERPButton
                                        title={t("add_more_api")}
                                        variant="secondary"
                                        className="w-full shadow-sm hover:shadow-md transition-shadow px-8"
                                        startIcon={<Plus className="w-4 h-4" />}
                                    />
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 mt-3">
                                        <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                                            {t("api_count_used_for_submission")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <ERPButton
                                        title={t("add_1000_api")}
                                        variant="secondary"
                                        startIcon={<Plus className="w-4 h-4" />}
                                        className="w-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border-2"
                                    />
                                    <ERPButton
                                        title={t("add_5000_api")}
                                        variant="secondary"
                                        startIcon={<Plus className="w-4 h-4" />}
                                        className="w-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border-2"
                                    />
                                    <ERPButton
                                        title={t("add_10000_api")}
                                        variant="secondary"
                                        startIcon={<Plus className="w-4 h-4" />}
                                        className="w-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border-2"
                                    />
                                    <ERPButton
                                        title={t("add_25000_api")}
                                        variant="secondary"
                                        startIcon={<Plus className="w-4 h-4" />}
                                        className="w-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border-2"
                                    />
                                    <ERPButton
                                        title={t("add_50000_api")}
                                        variant="secondary"
                                        startIcon={<Plus className="w-4 h-4" />}
                                        className="w-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border-2"
                                    />
                                    <ERPButton
                                        title={t("add_100000_api")}
                                        variant="secondary"
                                        startIcon={<Plus className="w-4 h-4" />}
                                        className="w-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] font-semibold"
                                    />
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default APIPortalRegistration;