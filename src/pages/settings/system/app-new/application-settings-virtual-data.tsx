export type SettingValue = string | boolean | number

export interface Setting {
  key: string
  label: string
}

export interface SettingGroup {
  id: string
  label: string
  settings: Setting[]
}

export const settingGroups: SettingGroup[] = [
  {
    id: 'main',
    label: 'Main Settings',
    settings: [
      {
        key: 'mainGeneral',
        label: 'Organization Name'
      },
      {
        key: 'mainBackup',
        label: 'Backup Name'
      },
    ]
  },
  {
    id: 'accountsSettings',
    label: 'Accounts Settings',
    settings: [
      {
        key: 'accountingMethod',
        label: 'Accounting Method',
      },
      {
        key: 'newAccountingMethod',
        label: 'New Accounting Method',
      },
    ]
  },
  {
    id: 'productsSettings',
    label: 'Products Settings',
    settings: [
      {
        key: 'productCodeGeneration',
        label: 'Product Code Generation',
      },
    ]
  },
  {
    id: 'inventorySettings',
    label: 'Inventory Settings',
    settings: [
      {
        key: 'inventoryValuationMethod',
        label: 'Inventory Valuation Method',
      },
    ]
  },
  {
    id: 'gstSettings',
    label: 'GST Settings',
    settings: [
      {
        key: 'gstRegistrationType',
        label: 'GST Registration Type',
      },
    ]
  },
  {
    id: 'branchSettings',
    label: 'Branch Settings',
    settings: [
      {
        key: 'multipleBranches',
        label: 'Multiple Branches',
      },
    ]
  },
  {
    id: 'printSettings',
    label: 'Print Settings',
    settings: [
      {
        key: 'defaultPrinter',
        label: 'Default Printer',
      },
    ]
  },
  {
    id: 'backUpSettings',
    label: 'Backup Settings',
    settings: [
      {
        key: 'autoBackup',
        label: 'Automatic Backup',
      },
    ]
  },
  {
    id: 'taxSettings',
    label: 'Tax Settings',
    settings: [
      {
        key: 'taxCalculationMethod',
        label: 'Tax Calculation Method',
      },
    ]
  },
  {
    id: 'miscellaneousSettings',
    label: 'Miscellaneous Settings',
    settings: [
      {
        key: 'language',
        label: 'Language',
      },
    ]
  }
]

export const sidebarItems = settingGroups.map(group => ({
  id: group.id,
  label: group.label,
  subItems: group.settings.map(setting => setting.key)
}))