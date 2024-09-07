

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
    icon: (<i className="side-menu__icon ri-user-heart-line"></i>),
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
      { path: `${import.meta.env.BASE_URL}account-settings/profile/basic-information`, type: 'link', active: false, selected: false, title: 'Invoice' },
      { path: `${import.meta.env.BASE_URL}account-settings/profile/email-address`, type: 'link', active: false, selected: false, title: 'Return' },
      { path: `${import.meta.env.BASE_URL}account-settings/profile/phone-number`, type: 'link', active: false, selected: false, title: 'Sales Order' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-user-heart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Purchase',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/workspace-logo`, type: 'link', active: false, selected: false, title: 'Purchase' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/workspace-basic-information`, type: 'link', active: false, selected: false, title: 'Vendor' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/primary-email`, type: 'link', active: false, selected: false, title: 'Return' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/business-number`, type: 'link', active: false, selected: false, title: 'Order' },
    ]
  },
 
];
