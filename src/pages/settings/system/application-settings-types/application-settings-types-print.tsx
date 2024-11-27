export interface ApplicationPrintSettings {
    defaultPrinter: string;
    printGatePass: boolean;
    showReprintAuthorization: boolean;
    showReprintAuthorisation: boolean;
}

export const ApplicationPrintSettingsInitialState: ApplicationPrintSettings = {
    defaultPrinter: "",
    printGatePass: false,
    showReprintAuthorization: false,
    showReprintAuthorisation: false,
};
