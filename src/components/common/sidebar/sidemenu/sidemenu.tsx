import { Path } from "@react-pdf/renderer";
import { Countries } from "../../../../redux/slices/user-session/reducer";


export const MENUITEMS = [
  {
    menutitle: 'main',
  },
  {
    icon: (<i className="side-menu__icon bx bx-home"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'dashboard',
    badge: '',
    badgetxt: '12',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}dashboards/crm`, type: 'link', active: false, selected: false, title: 'crm' }
    ]
  },
  {
    menutitle: "",
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
      { path: `${import.meta.env.BASE_URL}account-settings/profile/avatar`, type: 'link', active: false, selected: false, title: 'customers' },
      { path: `${import.meta.env.BASE_URL}sales/new`, type: 'link', active: false, selected: false, title: 'Sales' },
      { path: `${import.meta.env.BASE_URL}vat-sales-invoice`, type: 'link', active: false, selected: false, title: 'vat_sales_invoice' },
      { path: `${import.meta.env.BASE_URL}sales-cash-bank-vat`, type: 'link', active: false, selected: false, title: 'sales_cash_bank_vat' },
      { path: `${import.meta.env.BASE_URL}sales-return`, type: 'link', active: false, selected: false, title: 'sales_return' },
      { path: `${import.meta.env.BASE_URL}sales-return-credit-note-vat`, type: 'link', active: false, selected: false, title: 'sales_return_credit_note_vat' },
      { path: `${import.meta.env.BASE_URL}sales-quotation`, type: 'link', active: false, selected: false, title: 'sales_quotation' },
      { path: `${import.meta.env.BASE_URL}sales-order`, type: 'link', active: false, selected: false, title: 'sales_order' },

    ]
  },
  {
    icon: (<i className="side-menu__icon ri-shopping-cart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'purchase',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}purchase-invoice`, type: 'link', active: false, selected: false, title: 'purchase_invoice' },
      { path: `${import.meta.env.BASE_URL}vat-purchase-invoice`, type: 'link', active: false, selected: false, title: 'vat_purchase_invoice' },
      { path: `${import.meta.env.BASE_URL}purchase-estimate`, type: 'link', active: false, selected: false, title: 'purchase_estimate' },
      { path: `${import.meta.env.BASE_URL}purchase-import`, type: 'link', active: false, selected: false, title: 'purchase_import' },
      { path: `${import.meta.env.BASE_URL}purchase-return`, type: 'link', active: false, selected: false, title: 'purchase_return' },
      { path: `${import.meta.env.BASE_URL}purchase-return-vat`, type: 'link', active: false, selected: false, title: 'purchase_return_vat' },
      { path: `${import.meta.env.BASE_URL}purchase-order`, type: 'link', active: false, selected: false, title: 'purchase_order' },
      { path: `${import.meta.env.BASE_URL}request-for-quotation`, type: 'link', active: false, selected: false, title: 'request_for_quotation' },
      { path: `${import.meta.env.BASE_URL}purchase-quotation`, type: 'link', active: false, selected: false, title: 'purchase_quotation' },
      { path: `${import.meta.env.BASE_URL}purchase-order-transit`, type: 'link', active: false, selected: false, title: 'purchase_order_transit' }

    ]
  },
  {
    icon: (<i className="side-menu__icon bx bx-transfer-alt"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'goods',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}goods-request`, type: 'link', active: false, selected: false, title: 'goods_request' },
      { path: `${import.meta.env.BASE_URL}goods-delivery`, type: 'link', active: false, selected: false, title: 'goods_delivery' },
      { path: `${import.meta.env.BASE_URL}goods-delivery-return`, type: 'link', active: false, selected: false, title: 'goods_delivery_return' },
      { path: `${import.meta.env.BASE_URL}goods-receipt`, type: 'link', active: false, selected: false, title: 'goods_receipt' },
      { path: `${import.meta.env.BASE_URL}goods-receipt-return`, type: 'link', active: false, selected: false, title: 'goods_receipt_return' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-stock-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'stock',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}opening-stock`, type: 'link', active: false, selected: false, title: 'opening_stock' },
      { path: `${import.meta.env.BASE_URL}stock-transfer`, type: 'link', active: false, selected: false, title: 'stock_transfer' },
      { path: `${import.meta.env.BASE_URL}damage-entry`, type: 'link', active: false, selected: false, title: 'damage_entry' },
      { path: `${import.meta.env.BASE_URL}excess-stock`, type: 'link', active: false, selected: false, title: 'excess_stock_add_stock' },
      { path: `${import.meta.env.BASE_URL}shortage-stock`, type: 'link', active: false, selected: false, title: 'shortage_stock_less_stock' },
      { path: `${import.meta.env.BASE_URL}stock-adjuster`, type: 'link', active: false, selected: false, title: 'stock_adjuster' },
      { path: `${import.meta.env.BASE_URL}branch-transfer-out`, type: 'link', active: false, selected: false, title: 'branch_transfer_out' },
      { path: `${import.meta.env.BASE_URL}branch-transfer-in`, type: 'link', active: false, selected: false, title: 'branch_transfer_in' },
      { path: `${import.meta.env.BASE_URL}stock-transfer-to-branch`, type: 'link', active: false, selected: false, title: 'stock_transfer_to_branch' },
      { path: `${import.meta.env.BASE_URL}stock-transfer-from-branch`, type: 'link', active: false, selected: false, title: 'stock_transfer_from_branch' },
      { path: `${import.meta.env.BASE_URL}item-load-request`, type: 'link', active: false, selected: false, title: 'item_load_request' },
      { path: `${import.meta.env.BASE_URL}stock-count`, type: 'link', active: false, selected: false, title: 'stock_count' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-coins-fill"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'accountant',
    badge: '',
    badgetxt: '',
    rights: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}accounts/transactions/cash-payments`, type: 'link', active: false, selected: false, title: 'cash_payments', rights: 'CP' },
      { path: `${import.meta.env.BASE_URL}cash-receipts`, type: 'link', active: false, selected: false, title: 'cash_receipts', rights: 'CR' },
      { path: `${import.meta.env.BASE_URL}bank-payment-contra`, type: 'link', active: false, selected: false, title: 'bank_payment_contra', rights: 'BP' },
      { path: `${import.meta.env.BASE_URL}bank-receipt-contra`, type: 'link', active: false, selected: false, title: 'bank_receipt_contra', rights: 'BR' },
      { path: `${import.meta.env.BASE_URL}cheque-payment-contra`, type: 'link', active: false, selected: false, title: 'cheque_payment_contra', rights: 'CQP',  },
      { path: `${import.meta.env.BASE_URL}cheque-receipt-contra`, type: 'link', active: false, selected: false, title: 'cheque_receipt_contra', rights: 'CQR',  },
      { path: `${import.meta.env.BASE_URL}opening-balance`, type: 'link', active: false, selected: false, title: 'opening_balance', rights: 'OB' },
      { path: `${import.meta.env.BASE_URL}journal-entry`, type: 'link', active: false, selected: false, title: 'journal_entry', rights: 'JV' },
      { path: `${import.meta.env.BASE_URL}debit-note`, type: 'link', active: false, selected: false, title: 'debit_note', rights: 'DBN' },
      { path: `${import.meta.env.BASE_URL}credit-note`, type: 'link', active: false, selected: false, title: 'credit_note', rights: 'CRN' },
      { path: `${import.meta.env.BASE_URL}bank-reconciliation`, type: 'link', active: false, selected: false, title: 'bank_reconciliation' },
      { path: `${import.meta.env.BASE_URL}closing-balance`, type: 'link', active: false, selected: false, title: 'closing_balance', rights: 'CB' },
      { path: `${import.meta.env.BASE_URL}multi-journal-entry`, type: 'link', active: false, selected: false, title: 'multi_journal_entry', rights: 'MJV' },
      { path: `${import.meta.env.BASE_URL}tax-on-expense`, type: 'link', active: false, selected: false, title: 'tax_on_expense', rights: 'TXP' },
      { path: `${import.meta.env.BASE_URL}accounts/transactions/post-dated-cheques`, type: 'link', active: false, selected: false, title: 'post_dated_cheques' }
    ]
  },

  {
    icon: (<i className="side-menu__icon ri-line-chart-line"></i>),
    type: 'link',
    Name: '',
    active: false,
    selected: false,
    title: 'reports',
    path: 'reports',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
  {
    icon: (<i className="side-menu__icon ri-restaurant-2-fill"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'rpos',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}rpos`, type: 'link', active: false, selected: false, title: 'rpos' },
    ]
  },

];
export const exludedRoutes=[
  {title:'cheque_payment_contra',countries:[Countries.Saudi]},
  {title:'cheque_receipt_contra',countries:[Countries.Saudi]},
]