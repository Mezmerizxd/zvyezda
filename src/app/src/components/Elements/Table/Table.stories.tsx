import { Meta, Story } from '@storybook/react';

import { Table, TableProps } from './Table';

const meta: Meta = {
  title: 'Components/Elements/Table',
  component: Table,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const data: Profile[] = [
  {
    id: '1',
    email: 'email@email.com',
    username: 'Username101222',
    role: 'USER',
    avatar: null,
    biography: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'email2@email.com',
    username: 'Username1022221222',
    role: 'DEVELOPER',
    avatar: null,
    biography: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Template: Story<TableProps<Profile>> = (props) => <Table<Profile> {...props} />;

export const Default = Template.bind({});
Default.args = {
  data,
  columns: [
    {
      title: 'ID',
      field: 'id',
    },
    {
      title: 'Username',
      field: 'username',
    },
    {
      title: 'Role',
      field: 'role',
    },
    {
      title: 'Email',
      field: 'email',
    },
  ],
};
