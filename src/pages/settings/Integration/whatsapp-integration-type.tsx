export const initialWhatsappIntegration = {
  validations: {
    provider: null,
    channel: null,
    configJson: null,
  },
  items: [],
  isOk: true,
  item: {
    id: 0,
    branchId: 0,
    provider: 1,
    channel: 1,
    configJson: 'string',
    isEnable: true,
  },
};

export interface WhatsappIntegrationData {
  id: number;
  provider: number;
  isDefault?: boolean;
  description?: string;
  name: string;
  channel: number;
  configJson: {
    AccountSid: string;
    AuthToken: string;
    VerifyServiceSid?: string;
    FromPhone: string;
  };
  isEnable: boolean;
}
export interface information {
  accountSid: string;
  authToken: string;
  verifyServiceSid: string;
  fromPhone: string;
  phoneNumber?: string;
  message?: string;
  url?: string;
}
// channel
// :
// 1
// configJson
// :
// "{\"AccountSid\":\"AC7f2ed129314afdb386fbadeab6c32b17\",\"AuthToken\":\"224b7552e597444d0ef75a6ea364af17\",\"VerifyServiceSid\":\"your_verify_service_sid\",\"FromPhone\":\"+12184844476\"}"
// id
// :
// 1
// provider
// :
// 1
// providerName
// :
// "Twilio"