export const initialSMSIntegration = {
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

export interface SMSIntegrationData {
  id: number;
  branchId: number;
  provider: number;
  channel: number;
  configJson: string;
  isEnable: boolean;
}
