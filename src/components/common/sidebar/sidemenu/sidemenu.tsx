import { Path } from "@react-pdf/renderer";
import { Countries } from "../../../../redux/slices/user-session/reducer";
import { transactionRoutes } from "../../content/transaction-routes";


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
      { path: `${import.meta.env.BASE_URL}sales/new`, type: 'link', active: false, selected: false, title: 'Sales',rights:'SI' },
      { path: `${import.meta.env.BASE_URL}vat-sales-invoice`, type: 'link', active: false, selected: false, title: 'vat_sales_invoice',rights:'SI' },
      { path: `${import.meta.env.BASE_URL}sales-cash-bank-vat`, type: 'link', active: false, selected: false, title: 'sales_cash_bank_vat',rights:'SI' },
      { path: `${import.meta.env.BASE_URL}sales-return`, type: 'link', active: false, selected: false, title: 'sales_return',rights:'SR' },
      { path: `${import.meta.env.BASE_URL}sales-return-credit-note-vat`, type: 'link', active: false, selected: false, title: 'sales_return_credit_note_vat' ,rights:'SR'},
      { path: `${import.meta.env.BASE_URL}sales-quotation`, type: 'link', active: false, selected: false, title: 'sales_quotation',rights:'SQ' },
      { path: `${import.meta.env.BASE_URL}sales-order`, type: 'link', active: false, selected: false, title: 'sales_order' ,rights:'SO'},

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
      { path: `${import.meta.env.BASE_URL}purchase-invoice`, type: 'link', active: false, selected: false, title: 'purchase_invoice',rights:'PI' },
      { path: `${import.meta.env.BASE_URL}vat-purchase-invoice`, type: 'link', active: false, selected: false, title: 'vat_purchase_invoice',rights:'PI' },
      { path: `${import.meta.env.BASE_URL}purchase-estimate`, type: 'link', active: false, selected: false, title: 'purchase_estimate',rights:'PE' },
      { path: `${import.meta.env.BASE_URL}purchase-import`, type: 'link', active: false, selected: false, title: 'purchase_import',rights:'PI' },
      { path: `${import.meta.env.BASE_URL}purchase-return`, type: 'link', active: false, selected: false, title: 'purchase_return' ,rights:'PR'},
      { path: `${import.meta.env.BASE_URL}purchase-return-vat`, type: 'link', active: false, selected: false, title: 'purchase_return_vat' ,rights:'PR'},
      { path: `${import.meta.env.BASE_URL}purchase-order`, type: 'link', active: false, selected: false, title: 'purchase_order',rights:'PO' },
      { path: `${import.meta.env.BASE_URL}request-for-quotation`, type: 'link', active: false, selected: false, title: 'request_for_quotation',rights:'RFQ' },
      { path: `${import.meta.env.BASE_URL}purchase-quotation`, type: 'link', active: false, selected: false, title: 'purchase_quotation',rights:'PQ' },
      { path: `${import.meta.env.BASE_URL}purchase-order-transit`, type: 'link', active: false, selected: false, title: 'purchase_order_transit',rights:'POT' }

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
      { path: `${import.meta.env.BASE_URL}goods-request`, type: 'link', active: false, selected: false, title: 'goods_request',rights:'GR' },
      { path: `${import.meta.env.BASE_URL}goods-delivery`, type: 'link', active: false, selected: false, title: 'goods_delivery',rights:'GD' },
      { path: `${import.meta.env.BASE_URL}goods-delivery-return`, type: 'link', active: false, selected: false, title: 'goods_delivery_return',rights:'DR' },
      { path: `${import.meta.env.BASE_URL}goods-receipt`, type: 'link', active: false, selected: false, title: 'goods_receipt',rights:'GRN' },
      { path: `${import.meta.env.BASE_URL}goods-receipt-return`, type: 'link', active: false, selected: false, title: 'goods_receipt_return',rights:'GRR' }
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
      { path: `${import.meta.env.BASE_URL}opening-stock`, type: 'link', active: false, selected: false, title: 'opening_stock',rights:'OS' },
      { path: `${import.meta.env.BASE_URL}stock-transfer`, type: 'link', active: false, selected: false, title: 'stock_transfer',rights:'ST' },
      { path: `${import.meta.env.BASE_URL}damage-entry`, type: 'link', active: false, selected: false, title: 'damage_entry',rights:'DMG' },
      { path: `${import.meta.env.BASE_URL}excess-stock`, type: 'link', active: false, selected: false, title: 'excess_stock_add_stock',rights:'EX' },
      { path: `${import.meta.env.BASE_URL}shortage-stock`, type: 'link', active: false, selected: false, title: 'shortage_stock_less_stock',rights:'SH' },
      { path: `${import.meta.env.BASE_URL}stock-adjuster`, type: 'link', active: false, selected: false, title: 'stock_adjuster',rights:'SA' },
      { path: `${import.meta.env.BASE_URL}branch-transfer-out`, type: 'link', active: false, selected: false, title: 'branch_transfer_out',rights:'BTO' },
      { path: `${import.meta.env.BASE_URL}branch-transfer-in`, type: 'link', active: false, selected: false, title: 'branch_transfer_in' ,rights:'BTI'},
      { path: `${import.meta.env.BASE_URL}stock-transfer-to-branch`, type: 'link', active: false, selected: false, title: 'stock_transfer_to_branch',rights:'BT' },
      { path: `${import.meta.env.BASE_URL}stock-transfer-from-branch`, type: 'link', active: false, selected: false, title: 'stock_transfer_from_branch' ,rights:'BT'},
      { path: `${import.meta.env.BASE_URL}item-load-request`, type: 'link', active: false, selected: false, title: 'item_load_request' ,rights:'ILR'},
      { path: `${import.meta.env.BASE_URL}stock-count`, type: 'link', active: false, selected: false, title: 'stock_count' ,rights:'SC'}
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
      ...transactionRoutes.map((route) => ({
        path: `${import.meta.env.BASE_URL}accounts/transactions/${route.transactionType}`,
        type: "link",
        active: false,
        selected: false,
        title: route.title,
        rights: route.formCode,
      })),
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
