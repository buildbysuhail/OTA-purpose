export interface ApplicationMiscellaneousSettings {
    salesmanIncentive: number;
    defaultIncentiveLedger: number;
    sendSMS: boolean;
    sMSURL: string;
    maintainAllBranchWithCommonInventory: boolean;
    weighingScalePluFilePath: string;
    secondDisplayImagesPath: string;
    autoSyncSIandPI_BT: boolean;
    allowSalesDetailedEdit: boolean;
    maintainUntalliedBills: boolean;
    password: string;
}

export const ApplicationMiscellaneousSettingsInitialState: ApplicationMiscellaneousSettings = {
    salesmanIncentive: 0,
    defaultIncentiveLedger: 0,
    sendSMS: false,
    sMSURL: "",
    maintainAllBranchWithCommonInventory: false,
    weighingScalePluFilePath: "",
    secondDisplayImagesPath: "",
    autoSyncSIandPI_BT: false,
    allowSalesDetailedEdit: false,
    maintainUntalliedBills: false,
    password: "",
};