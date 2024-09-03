

export const MENUITEMS = [
  {
    menutitle_lg: 'Account Settings',
  },
  {
    menutitle: 'Safvan',
  },
  {
    icon: (<i className="side-menu__icon ri-user-heart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Profile',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}account-settings/profile/avatar`, type: 'link', active: false, selected: false, title: 'Avatar' },
      { path: `${import.meta.env.BASE_URL}account-settings/profile/basic-information`, type: 'link', active: false, selected: false, title: 'Basic Information' },
      { path: `${import.meta.env.BASE_URL}account-settings/profile/email-address`, type: 'link', active: false, selected: false, title: 'Email Address' },
      { path: `${import.meta.env.BASE_URL}account-settings/profile/phone-number`, type: 'link', active: false, selected: false, title: 'Phone Number' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-lock-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Security',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}account-settings/signin-method`, type: 'link', active: false, selected: false, title: 'Sign in Method' },
      { path: `${import.meta.env.BASE_URL}account-settings/two-factor-authentication`, type: 'link', active: false, selected: false, title: '2 Factor Authentication' },
      { path: `${import.meta.env.BASE_URL}account-settings/password`, type: 'link', active: false, selected: false, title: 'Password' }
    ]
  }, 
  {
    icon: (<i className="side-menu__icon ri-bar-chart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Preferences',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}account-settings/theme`, type: 'link', active: false, selected: false, title: 'Theme' },
      { path: `${import.meta.env.BASE_URL}account-settings/date-and-region`, type: 'link', active: false, selected: false, title: 'Date & Region' },
      { path: `${import.meta.env.BASE_URL}account-settings/language`, type: 'link', active: false, selected: false, title: 'Language & Typing' },
      { path: `${import.meta.env.BASE_URL}account-settings/system-preferences`, type: 'link', active: false, selected: false, title: 'Other System Preference' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-login-circle-line"></i>),
    type: 'link',
    Name: '',
    active: false,
    selected: false,
    title: 'Sessions',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
  {
    icon: (<i className="side-menu__icon ri-logout-circle-line"></i>),
    type: 'link',
    Name: '',
    active: false,
    selected: false,
    title: 'Sign Out',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
 
];
