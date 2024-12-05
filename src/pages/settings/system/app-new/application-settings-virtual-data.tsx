export type SettingValue = string | boolean | number

export interface Setting {
  key: string
  label: string
  subSettings?: Setting[]
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
      { key: 'mainGeneral', label: 'General' },
      { key: 'mainBackup', label: 'Backup' },
      { key: 'mainPrinting', label: 'Printing' },
      { key: 'mainMultiBranch', label: 'Multi Branch' },
      { key: 'mainCRM', label: 'CRM' },

    ]
  },
  {
    id: 'accounts',
    label: 'Accounts Settings',
    settings: [
      { key: 'accountsGeneral', label: 'General' },
      { key: 'accountsHR', label: 'HR' },
      { key: 'accountsEInvoiceGCC', label: 'KSA E-Invoice' }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory Settings',
    settings: [
      { key: 'inventoryGeneral', label: 'General' },
      { key: 'inventoryProducts', label: 'Products' },
      { key: 'inventoryGSTSettings', label: 'GST Settings' }, 
      { key: 'inventoryTaxSettings', label: 'Taxes' },
      { key: 'inventoryPurchase', label: 'Purchase' },
      {
        key: 'inventorySales',
        label: 'Sales',
        subSettings: [
          { key: 'inventorySalesPOS', label: 'POS' },
          { key: 'inventorySalesCounter', label: 'Counter' }
        ]
      },
      { key: 'inventoryPPOS', label: 'PPOS' },
      { key: 'inventorySchemesPromotions', label: 'Schemes & Promotions' }
    ]
  },
  {
    id: 'miscellaneous',
    label: 'Miscellaneous',
    settings: []
  }
]


export const sidebarItems = settingGroups.map(group => ({
  id: group.id,
  label: group.label,
  subItems: group.settings.map(setting => setting.key)
}))