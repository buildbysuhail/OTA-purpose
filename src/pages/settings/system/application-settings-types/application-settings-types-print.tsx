export interface ApplicationPrintSettings {
    defaultPrinter: string;
    printGatePass: boolean;
    printSelectedGatePass: boolean;
    showReprintAuthorization: boolean;
    showReprintAuthorisation: boolean;
    useEmptyTaxTypeTemplateIfMissing: boolean;

}

export const ApplicationPrintSettingsInitialState: ApplicationPrintSettings = {
    defaultPrinter: "",
    printGatePass: false,
    printSelectedGatePass: false,
    showReprintAuthorization: false,
    showReprintAuthorisation: false,
    useEmptyTaxTypeTemplateIfMissing: false
};
