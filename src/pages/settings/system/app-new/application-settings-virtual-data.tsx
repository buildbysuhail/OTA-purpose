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
    label: 'main_settings',
    settings: [
      { key: 'mainGeneral', label: 'general' },
      { key: 'mainBackup', label: 'backup' },
      { key: 'mainPrinting', label: 'printing' },
      { key: 'mainMultiBranch', label: 'multi_branch' },
      { key: 'mainCRM', label: 'crm' },

    ]
  },
  {
    id: 'accounts',
    label: 'accounts_settings',
    settings: [
      { key: 'accountsGeneral', label: 'general' },
      { key: 'accountsHR', label: 'hr' },
      { key: 'accountsEInvoiceGCC', label: 'ksa_e-invoice' }
    ]
  },
  {
    id: 'inventory',
    label: 'inventory_settings',
    settings: [
      { key: 'inventoryGeneral', label: 'general' },
      { key: 'inventoryProducts', label: 'products' },
      { key: 'inventoryGSTSettings', label: 'gst_settings' }, 
      { key: 'inventoryTaxSettings', label: 'taxes' },
      { key: 'inventoryPurchase', label: 'purchase' },
      {
        key: 'inventorySales',
        label: 'sales',
        subSettings: [
          { key: 'inventorySalesGeneral', label: 'general' },
          { key: 'inventorySalesPOS', label: 'pos' },
          { key: 'inventorySalesCounter', label: 'counter' }
        ]
      },
      { key: 'inventoryPPOS', label: 'ppos' },
      { key: 'inventorySchemesPromotions', label: 'schemes_&_promotions' }
    ]
  },
  {
    id: 'miscellaneous',
    label: 'miscellaneous',
    settings: []
  }
]


export const sidebarItems = settingGroups.map(group => ({
  id: group.id,
  label: group.label,
  subItems: group.settings.map(setting => setting.key)
}))