

export const MENUITEMS = [
  {
    menutitle: 'MAIN',
  },
  {
    icon: (<i className="side-menu__icon bx bx-home"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Dashboards',
    badge: '',
    badgetxt: '12',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}dashboards/crm`, type: 'link', active: false, selected: false, title: 'CRM' }
    ]
  },
  {
    menutitle: "WEB APPS",
  },      
  {
    icon: (<i className="side-menu__icon ri-bar-chart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Sales',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}account-settings/profile/avatar`, type: 'link', active: false, selected: false, title: 'Customers' },
      { path: `${import.meta.env.BASE_URL}sales/new`, type: 'link', active: false, selected: false, title: 'Sales' },
      { path: `${import.meta.env.BASE_URL}vat-sales-invoice`, type: 'link', active: false, selected: false, title: 'VAT Sales Invoice' },
      { path: `${import.meta.env.BASE_URL}sales-cash-bank-vat`, type: 'link', active: false, selected: false, title: 'Sales Cash/Bank VAT' },
      { path: `${import.meta.env.BASE_URL}sales-return`, type: 'link', active: false, selected: false, title: 'Sales Return' },
      { path: `${import.meta.env.BASE_URL}sales-return-credit-note-vat`, type: 'link', active: false, selected: false, title: 'Sales Return/ Credit Note (VAT)' },
      { path: `${import.meta.env.BASE_URL}sales-quotation`, type: 'link', active: false, selected: false, title: 'Sales Quotation' },
      { path: `${import.meta.env.BASE_URL}sales-order`, type: 'link', active: false, selected: false, title: 'Sales Order' },
     
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-shopping-cart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Purchase',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}purchase-invoice`, type: 'link', active: false, selected: false, title: 'Purchase Invoice' },
      { path: `${import.meta.env.BASE_URL}vat-purchase-invoice`, type: 'link', active: false, selected: false, title: 'VAT Purchase Invoice' },
      { path: `${import.meta.env.BASE_URL}purchase-estimate`, type: 'link', active: false, selected: false, title: 'Purchase Estimate' },
      { path: `${import.meta.env.BASE_URL}purchase-import`, type: 'link', active: false, selected: false, title: 'Purchase Import' },
      { path: `${import.meta.env.BASE_URL}purchase-return`, type: 'link', active: false, selected: false, title: 'Purchase Return' },
      { path: `${import.meta.env.BASE_URL}purchase-return-vat`, type: 'link', active: false, selected: false, title: 'Purchase Return VAT' },
      { path: `${import.meta.env.BASE_URL}purchase-order`, type: 'link', active: false, selected: false, title: 'Purchase Order' },
      { path: `${import.meta.env.BASE_URL}request-for-quotation`, type: 'link', active: false, selected: false, title: 'Request For Quotation' },
      { path: `${import.meta.env.BASE_URL}purchase-quotation`, type: 'link', active: false, selected: false, title: 'Purchase Quotation' },
      { path: `${import.meta.env.BASE_URL}purchase-order-transit`, type: 'link', active: false, selected: false, title: 'Purchase Order Transit' }

    ]
  },
  {
    icon: (<i className="side-menu__icon bx bx-transfer-alt"></i>), 
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Goods',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}goods-request`, type: 'link', active: false, selected: false, title: 'Goods Request' },
      { path: `${import.meta.env.BASE_URL}goods-delivery`, type: 'link', active: false, selected: false, title: 'Goods Delivery' },
      { path: `${import.meta.env.BASE_URL}goods-delivery-return`, type: 'link', active: false, selected: false, title: 'Goods Delivery Return' },
      { path: `${import.meta.env.BASE_URL}goods-receipt`, type: 'link', active: false, selected: false, title: 'Goods Receipt' },
      { path: `${import.meta.env.BASE_URL}goods-receipt-return`, type: 'link', active: false, selected: false, title: 'Goods Receipt Return' }
    

    ]
  },
  {
    icon: (<i className="side-menu__icon ri-stock-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Stock',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}opening-stock`, type: 'link', active: false, selected: false, title: 'Opening Stock' },
      { path: `${import.meta.env.BASE_URL}stock-transfer`, type: 'link', active: false, selected: false, title: 'Stock Transfer' },
      { path: `${import.meta.env.BASE_URL}damage-entry`, type: 'link', active: false, selected: false, title: 'Damage Entry' },
      { path: `${import.meta.env.BASE_URL}excess-stock`, type: 'link', active: false, selected: false, title: 'Excess Stock/Add Stock' },
      { path: `${import.meta.env.BASE_URL}shortage-stock`, type: 'link', active: false, selected: false, title: 'Shortage Stock/Less Stock' },
      { path: `${import.meta.env.BASE_URL}stock-adjuster`, type: 'link', active: false, selected: false, title: 'Stock Adjuster' },
      { path: `${import.meta.env.BASE_URL}branch-transfer-out`, type: 'link', active: false, selected: false, title: 'Branch Transfer Out' },
      { path: `${import.meta.env.BASE_URL}branch-transfer-in`, type: 'link', active: false, selected: false, title: 'Branch Transfer In' },
      { path: `${import.meta.env.BASE_URL}stock-transfer-to-branch`, type: 'link', active: false, selected: false, title: 'Stock Transfer To Branch' },
      { path: `${import.meta.env.BASE_URL}stock-transfer-from-branch`, type: 'link', active: false, selected: false, title: 'Stock Transfer From Branch' },
      { path: `${import.meta.env.BASE_URL}item-load-request`, type: 'link', active: false, selected: false, title: 'Item Load Request' },
      { path: `${import.meta.env.BASE_URL}stock-count`, type: 'link', active: false, selected: false, title: 'Stock Count' }

    ]
  },
  {
    icon: (<i className="side-menu__icon ri-coins-fill"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Accountant',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}cash-payments`, type: 'link', active: false, selected: false, title: 'Cash Payments' },
  { path: `${import.meta.env.BASE_URL}cash-receipts`, type: 'link', active: false, selected: false, title: 'Cash Receipts' },
  { path: `${import.meta.env.BASE_URL}bank-payment-contra`, type: 'link', active: false, selected: false, title: 'Bank Payment | Contra' },
  { path: `${import.meta.env.BASE_URL}bank-receipt-contra`, type: 'link', active: false, selected: false, title: 'Bank Receipt | Contra' },
  { path: `${import.meta.env.BASE_URL}opening-balance`, type: 'link', active: false, selected: false, title: 'Opening Balance' },
  { path: `${import.meta.env.BASE_URL}journal-entry`, type: 'link', active: false, selected: false, title: 'Journal Entry' },
  { path: `${import.meta.env.BASE_URL}debit-note`, type: 'link', active: false, selected: false, title: 'Debit Note' },
  { path: `${import.meta.env.BASE_URL}credit-note`, type: 'link', active: false, selected: false, title: 'Credit Note' },
  { path: `${import.meta.env.BASE_URL}bank-reconciliation`, type: 'link', active: false, selected: false, title: 'Bank Reconciliation' },
  { path: `${import.meta.env.BASE_URL}closing-balance`, type: 'link', active: false, selected: false, title: 'Closing Balance' },
  { path: `${import.meta.env.BASE_URL}multi-journal-entry`, type: 'link', active: false, selected: false, title: 'Multi Journal Entry' },
  { path: `${import.meta.env.BASE_URL}tax-on-expense`, type: 'link', active: false, selected: false, title: 'Tax On Expense' }


    ]
  },
  
  {
    icon: (<i className="side-menu__icon ri-line-chart-line"></i>),
    type: 'link',
    Name: '',
    active: false,
    selected: false,
    title: 'Reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
 
];
