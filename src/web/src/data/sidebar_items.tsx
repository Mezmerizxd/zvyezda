import { MdYard } from 'react-icons/md';
import { FaXbox } from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md';

export enum Contexts {
  Default,
  Xbox_Hacking,
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
    ],
  },
  {
    id: 'section_2',
    title: 'Section 2',
    actions: [
      {
        id: Contexts.Xbox_Hacking,
        title: 'Xbox Hacking',
        icon: <FaXbox />,
      },
    ],
  },
];
