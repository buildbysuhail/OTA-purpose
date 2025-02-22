export const AccountSettingsMenuItems = [
  {
    menutitle_lg: 'account_settings',
    showUserMiniCard: true,
  },
  {
    icon: (<i className="side-menu__icon ri-user-heart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'profile',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}account-settings/profile/avatar`, type: 'link', active: false, selected: false, title: 'avatar' },
      { path: `${import.meta.env.BASE_URL}account-settings/profile/basic-information`, type: 'link', active: false, selected: false, title: 'basic_information' },
      { path: `${import.meta.env.BASE_URL}account-settings/profile/email-address`, type: 'link', active: false, selected: false, title: 'email_address' },
      { path: `${import.meta.env.BASE_URL}account-settings/profile/phone-number`, type: 'link', active: false, selected: false, title: 'phone_number' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-lock-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'security',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      // { path: `${import.meta.env.BASE_URL}account-settings/signin-method`, type: 'link', active: false, selected: false, title: 'Sign in Method' },
      // { path: `${import.meta.env.BASE_URL}account-settings/two-factor-authentication`, type: 'link', active: false, selected: false, title: '2 Factor Authentication' },
      { path: `${import.meta.env.BASE_URL}account-settings/security/password`, type: 'link', active: false, selected: false, title: 'password' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-bar-chart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'preferences',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}account-settings/preferences/language`, type: 'link', active: false, selected: false, title: 'language_&_typing' },
      { path: `${import.meta.env.BASE_URL}account-settings/preferences/theme`, type: 'link', active: false, selected: false, title: 'theme' },
      // { path: `${import.meta.env.BASE_URL}account-settings/preferences/date-and-region`, type: 'link', active: false, selected: false, title: 'Date & Region' },
      // { path: `${import.meta.env.BASE_URL}account-settings/preferences/system-preferences`, type: 'link', active: false, selected: false, title: 'Other System Preference' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-macbook-line"></i>),
    type: 'link',
    path: `${import.meta.env.BASE_URL}account-settings/sessions`,
    Name: '',
    active: false,
    selected: false,
    title: 'sessions',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
  {
    icon: (<i className="side-menu__icon ri-logout-circle-line"></i>),
    type: 'link',
    path: `${import.meta.env.BASE_URL}logout`,
    Name: '',
    active: false,
    selected: false,
    title: 'sign_out',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
  {
    icon: (<i className="side-menu__icon ri-windows-line"></i>),
    hasTopBorder: true,
    type: 'link',
    path: `${import.meta.env.BASE_URL}workspace-settings/profile/workspace-logo`,
    Name: '',
    active: false,
    selected: false,
    title: 'workspace_settings',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
];
