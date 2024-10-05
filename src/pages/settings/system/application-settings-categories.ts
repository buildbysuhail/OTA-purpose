export type ApplicationSettingsIds =
  | "main"
  | "accounts"
  | "inventory"
  | "branch"
  | "backup"
  | "print"
  | "products"
  | "gst"
  | "tax"
  | "miscellaneous";

export const ApplicationSettingsTypes: {
  id: number;
  name: string;
  settings_group_id: ApplicationSettingsIds;
}[] = [
  {
    id: 1,
    name: "Main",
    settings_group_id: "main",
  },
  {
    id: 2,
    name: "Accounts",
    settings_group_id: "accounts",
  },
  {
    id: 3,
    name: "Inventory",
    settings_group_id: "inventory",
  },
  {
    id: 4,
    name: "Branch",
    settings_group_id: "branch",
  },
  {
    id: 5,
    name: "Backup",
    settings_group_id: "backup",
  },
  {
    id: 6,
    name: "Print",
    settings_group_id: "print",
  },
  {
    id: 7,
    name: "Products",
    settings_group_id: "products",
  },
  {
    id: 8,
    name: "GST",
    settings_group_id: "gst",
  },
  {
    id: 9,
    name: "Tax",
    settings_group_id: "tax",
  },
  {
    id: 10,
    name: "Miscellaneous",
    settings_group_id: "miscellaneous",
  },
];
