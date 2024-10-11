import {
  CheckBadgeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const ReportsMenuItems = [
  // {
  //   menutitle: 'Settings',
  //   showWorkspaceMiniCard: true,
  // },
  {
    icon: (<CheckBadgeIcon className="side-menu__icon" />),
    type: 'sub',
    Name: '',
    active: false,
    selected: false,
    title: 'accounts',
    badge: '',
    badgetxt: '',
    class: 'badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2',
    columns: 2,
    children: [
      { path: `${import.meta.env.BASE_URL}reports/_/accounts/cash`, type: 'link', active: false, selected: false, title: 'cash' },
    ]
  },
];