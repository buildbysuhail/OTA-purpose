// Define ApplicationSettingsIds with class names as identifiers
export type ApplicationSettingsIds =
  | "mainSettings"
  | "accountsSettings"
  | "inventorySettings"
  | "branchSettings"
  | "backUPSettings"
  | "printerSettings"
  | "productsSettings"
  | "gSTTaxesSettings"
  | "taxesSettings"
  | "miscellaneousSettings";

// Update ApplicationSettingsTypes with new `settings_group_id` values
export const ApplicationSettingsTypes: {
  id: number;
  name: string;
  settings_group_id: ApplicationSettingsIds;
}[] = [
    {
      id: 1,
      name: "Main",
      settings_group_id: "mainSettings",
    },
    {
      id: 2,
      name: "Accounts",
      settings_group_id: "accountsSettings",
    },
    {
      id: 3,
      name: "Inventory",
      settings_group_id: "inventorySettings",
    },
    {
      id: 4,
      name: "Branch",
      settings_group_id: "branchSettings",
    },
    {
      id: 5,
      name: "Backup",
      settings_group_id: "backUPSettings",
    },
    {
      id: 6,
      name: "Print",
      settings_group_id: "printerSettings",
    },
    {
      id: 7,
      name: "Products",
      settings_group_id: "productsSettings",
    },
    {
      id: 8,
      name: "GST",
      settings_group_id: "gSTTaxesSettings",
    },
    {
      id: 9,
      name: "Tax",
      settings_group_id: "taxesSettings",
    },
    {
      id: 10,
      name: "Miscellaneous",
      settings_group_id: "miscellaneousSettings",
    },
  ];
