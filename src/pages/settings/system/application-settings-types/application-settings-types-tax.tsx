export interface ApplicationTaxSettings {
    expensesTaxAccount: string;
    incomeTaxAccount: string;
    purchaseCSTAccount: string;
    purchaseFormType: string;
    purchaseTaxAccount: string;
    salesCSTAccount: string;
    salesFormType: string;
    salesTaxAccount: string;
}

export const ApplicationTaxSettingsInitialState: ApplicationTaxSettings = {
    expensesTaxAccount: "",
    incomeTaxAccount: "",
    purchaseCSTAccount: "",
    purchaseFormType: "",
    purchaseTaxAccount: "",
    salesCSTAccount: "",
    salesFormType: "",
    salesTaxAccount: "",
};