import React, { useState } from 'react';
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPButton from "../../../components/ERPComponents/erp-button";

const EInvoiceTaxPro = () => {
    const [formData, setFormData] = useState({
        clientId: '',
        clientSecret: '',
        gspName: '',
        aspUserId: '',
        aspPassword: '',
        authUrl: '',
        baseUrl: '',
        ewbUrl: '',
        cancelEwbUrl: '',
        userName: '',
        password: '',
        gstin: '',
        appKey: '',
        authToken: '',
        sek: '',
        tokenExp: ''
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
                        <h3 className="font-semibold text-sm mb-3">EInvoice API Setting</h3>
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
                            id="gspName"
                            label="Gsp Name"
                            type="text"
                            name="gspName"
                            value={formData.gspName}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, gspName: data.gspName }))}
                            required
                        />
                        <ERPInput
                            id="aspUserId"
                            label="Asp User Id"
                            type="text"
                            name="aspUserId"
                            value={formData.aspUserId}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, aspUserId: data.aspUserId }))}
                            required
                        />
                        <ERPInput
                            id="aspPassword"
                            label="Asp Password"
                            type="password"
                            name="aspPassword"
                            value={formData.aspPassword}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, aspPassword: data.aspPassword }))}
                        />
                        <ERPInput
                            id="authUrl"
                            label="Auth Url"
                            type="text"
                            name="authUrl"
                            value={formData.authUrl}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, authUrl: data.authUrl }))}
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
                        <ERPInput
                            id="ewbUrl"
                            label="EWB Url"
                            type="text"
                            name="ewbUrl"
                            value={formData.ewbUrl}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, ewbUrl: data.ewbUrl }))}
                        />
                        <ERPInput
                            id="cancelEwbUrl"
                            label="Cancel EWB Url"
                            type="text"
                            name="cancelEwbUrl"
                            value={formData.cancelEwbUrl}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, cancelEwbUrl: data.cancelEwbUrl }))}
                        />
                    </div>
                    <div className="p-4 border rounded-md w-2/4">
                        <h3 className="font-semibold text-sm mb-3">EInvoice API Login Details</h3>
                        <ERPInput
                            id="userName"
                            label="User Name"
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, userName: data.userName }))}
                            required
                        />
                        <ERPInput
                            id="password"
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, password: data.password }))}
                            required
                        />
                        <ERPInput
                            id="gstin"
                            label="GSTIN"
                            type="text"
                            name="gstin"
                            value={formData.gstin}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, gstin: data.gstin }))}
                            required
                        />
                        <ERPInput
                            id="appKey"
                            label="App Key"
                            type="text"
                            name="appKey"
                            value={formData.appKey}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, appKey: data.appKey }))}
                            required
                        />
                        <ERPInput
                            id="authToken"
                            label="Auth Token"
                            type="text"
                            name="authToken"
                            value={formData.authToken}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, authToken: data.authToken }))}
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
                        <ERPInput
                            id="tokenExp"
                            label="Token Exp"
                            type="text"
                            name="tokenExp"
                            value={formData.tokenExp}
                            onChangeData={(data) => setFormData(prev => ({ ...prev, tokenExp: data.tokenExp }))}
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

export default EInvoiceTaxPro;