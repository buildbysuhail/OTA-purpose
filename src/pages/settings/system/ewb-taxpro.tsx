import React, { useState } from 'react';
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPButton from "../../../components/ERPComponents/erp-button";

const EWBTaxPro = () => {
    const [formData, setFormData] = useState({
        clientId: '',
        clientSecret: '',
        gspUserId: '',
        gapName: '',
        aapUserId: '',
        aspPassword: '',
        baseUrl: '',
        gstin: '',
        ewbUserId: '',
        ewbPassword: '',
        appKey: '',
        authToken: '',
        tokenExp: '',
        sek: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <form onSubmit={handleSubmit}>
                <div className='flex align-center justify-between w-full gap-2'>
                    <div className="p-4 border rounded-md w-2/4">
                        <h3 className="font-semibold text-sm mb-3">E-WayBill API Setting</h3>
                        <ERPInput
                            id="clientId"
                            label="Client Id"
                            type="text"
                            name="clientId"
                            value={formData.clientId}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, ...data }))}
                        />

                        <ERPInput
                            id="clientSecret"
                            label="Client Secret"
                            type="password"
                            name="clientSecret"
                            value={formData.clientSecret}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, clientSecret: data.clientSecret }))}
                        />
                        <ERPInput
                            id="gspUserId"
                            label="Gsp Name"
                            type="text"
                            name="gspUserId"
                            value={formData.gspUserId}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, gspUserId: data.gspUserId }))}
                            required
                        />
                        <ERPInput
                            id="gapName"
                            label="Asp User Id"
                            type="text"
                            name="gapName"
                            value={formData.gapName}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, gapName: data.gapName }))}
                            required
                        />
                        <ERPInput
                            id="aapUserId"
                            label="Asp Password"
                            type="password"
                            name="aapUserId"
                            value={formData.aapUserId}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, aapUserId: data.aapUserId }))}
                        />
                        <ERPInput
                            id="aspPassword"
                            label="Auth Url"
                            type="text"
                            name="aspPassword"
                            value={formData.aspPassword}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, aspPassword: data.aspPassword }))}
                            required
                        />
                        <ERPInput
                            id="baseUrl"
                            label="Base Url"
                            type="text"
                            name="baseUrl"
                            value={formData.baseUrl}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, baseUrl: data.baseUrl }))}
                            required
                        />


                    </div>
                    <div className="p-4 border rounded-md w-2/4">
                        <h3 className="font-semibold text-sm mb-3">E-WayBill API Login Details</h3>
                        <ERPInput
                            id="gstin"
                            label="EWB Url"
                            type="text"
                            name="gstin"
                            value={formData.gstin}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, gstin: data.gstin }))}
                        />
                        <ERPInput
                            id="ewbUserId"
                            label="Cancel EWB Url"
                            type="text"
                            name="ewbUserId"
                            value={formData.ewbUserId}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, ewbUserId: data.ewbUserId }))}
                        />
                        <ERPInput
                            id="ewbPassword"
                            label="User Name"
                            type="text"
                            name="ewbPassword"
                            value={formData.ewbPassword}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, ewbPassword: data.ewbPassword }))}
                            required
                        />
                        <ERPInput
                            id="appKey"
                            label="appKey"
                            type="text"
                            name="appKey"
                            value={formData.appKey}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, appKey: data.appKey }))}
                            required
                        />
                        <ERPInput
                            id="authToken"
                            label="App Key"
                            type="text"
                            name="authToken"
                            value={formData.authToken}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, authToken: data.authToken }))}
                            required
                        />
                        <ERPInput
                            id="tokenExp"
                            label="Auth Token"
                            type="text"
                            name="tokenExp"
                            value={formData.tokenExp}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, tokenExp: data.tokenExp }))}
                            required
                        />
                        <ERPInput
                            id="sek"
                            label="Sek"
                            type="text"
                            name="sek"
                            value={formData.sek}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, sek: data.sek }))}
                        />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                    <ERPButton
                        title="Save"
                        type="submit"
                        className="px-4 py-2"
                        variant="primary"
                    />
                </div>
            </form>
        </div>
    );
};

export default EWBTaxPro;