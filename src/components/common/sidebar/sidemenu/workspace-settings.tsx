

export const WorkspaceSettingsMenuItems = [
  {
    menutitle_lg: 'workspace_settings',
    showWorkspaceMiniCard: true,

  },
  {
    icon: (<i className="side-menu__icon ri-user-heart-line"></i>),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'settings',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    children: [
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/workspace-logo`, type: 'link', active: false, selected: false, title: 'workspace_logo' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/workspace-basic-information`, type: 'link', active: false, selected: false, title: 'basic_information' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/primary-email`, type: 'link', active: false, selected: false, title: 'primary_email_address' },
      { path: `${import.meta.env.BASE_URL}workspace-settings/profile/business-number`, type: 'link', active: false, selected: false, title: 'business_phone_number' },
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
      { path: `${import.meta.env.BASE_URL}workspace-settings/security/deleteWorkspace`, type: 'link', active: false, selected: false, title: 'delete_workspace' }
    ]
  },
  {
    icon: (<i className="side-menu__icon ri-bar-chart-line"></i>),
    type: 'link',
    path: `${import.meta.env.BASE_URL}workspace-settings/members`,
    Name: '',
    active: false,
    selected: false,
    title: 'members',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
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
    title: 'sign_out',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2'
  },
];