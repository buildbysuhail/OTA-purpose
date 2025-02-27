export const initialEmailIntegration = {
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

export interface EmailIntegrationData {
  id: number;
  provider: number;
  isDefault?: boolean;
  description?: string;
  name: string;
  channel: number;
  configJson: {
    From: string;
    SmtpServer: string;
    Port: number;
    UserName: string;
    Password: string;
  };
  isEnable: boolean;
}

export interface information {
  from: string;
  smtpServer: string;
  port: number;
  userName: string;
  password: string;
  email?: string;
  message?: string;
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
// "SMTP"