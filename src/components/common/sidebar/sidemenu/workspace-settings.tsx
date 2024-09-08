

export const WorkspaceSettingsMenuItems = [
  {
    menutitle_lg: 'Workspace Settings',
  },
  {
    icon: (<i className="side-menu__icon ri-user-heart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'Settings',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/workspace-logo`, type: 'link', active: false, selected: false, title: 'Workspace Logo' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/workspace-basic-information`, type: 'link', active: false, selected: false, title: 'Basic Information' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/primary-email`, type: 'link', active: false, selected: false, title: 'Primary Email Address' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/business-number`, type: 'link', active: false, selected: false, title: 'Business Phone Number' },
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
      // { path: `${import.meta.env.BASE_URL}account-settings/signin-method`, type: 'link', active: false, selected: false, title: 'Sign in Method' },
      // { path: `${import.meta.env.BASE_URL}account-settings/two-factor-authentication`, type: 'link', active: false, selected: false, title: '2 Factor Authentication' },
      { path: `${import.meta.env.BASE_URL}account-settings/security/password`, type: 'link', active: false, selected: false, title: 'Delete Workspace' }
    ]
  }, 
  {
    icon: (<i className="side-menu__icon ri-bar-chart-line"></i>),
    type: 'link',
    Name: '',
    active: false,
    selected: false,
    title: 'Members',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    path: `${import.meta.env.BASE_URL}account-settings/preferences/language`
  },
  // {
  //   icon: (<i className="side-menu__icon ri-bar-chart-line"></i>),
  //   type: 'link',
  //   Name: '',
  //   active: false,
  //   selected: false,
  //   title: 'Billing History',
  //   badge: '',
  //   badgetxt: '',
  //   class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
  //   path: `${import.meta.env.BASE_URL}account-settings/preferences/language`
  // },
  {
    icon: (<i className="side-menu__icon ri-logout-circle-line"></i>),
    type: 'link',
    path: `${import.meta.env.BASE_URL}logout`,
    Name: '',
    active: false,
    selected: false,
    title: 'Sign Out',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
 
];
