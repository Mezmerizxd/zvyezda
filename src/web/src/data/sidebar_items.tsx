import { FaXbox } from 'react-icons/fa';
import { MdSpaceDashboard, MdChat } from 'react-icons/md';
import { HiUsers } from 'react-icons/hi';

export enum Contexts {
  Default,
  Discussion,
  Xbox_Hacking,
  Users,
}

export const sidebar_items: Zvyezda.Client.Models.SidebarItemProps[] = [
  {
    id: 'main',
    title: 'Main',
    actions: [
      {
        id: Contexts.Default,
        title: 'Dashboard',
        icon: <MdSpaceDashboard />,
      },
      {
        id: Contexts.Discussion,
        title: 'Discussion',
        icon: <MdChat />,
      },
    ],
  },
  {
    id: 'website',
    title: 'Website',
    actions: [
      {
        id: Contexts.Xbox_Hacking,
        title: 'Xbox Hacking',
        icon: <FaXbox />,
      },
    ],
  },
  {
    id: 'administration',
    title: 'Administration',
    actions: [
      {
        id: Contexts.Users,
        title: 'Users',
        icon: <HiUsers />,
      },
    ],
  },
];
