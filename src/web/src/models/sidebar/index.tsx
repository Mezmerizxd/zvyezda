import { Sidebar, Container, Item, ItemTitle, ItemAction, ItemActionTitle } from './styled';

import { MdYard } from 'react-icons/md';

const items: Zvyezda.Client.Models.SidebarProps = {
  items: [
    {
      id: 'section_1',
      title: 'Section 1',
      actions: [
        {
          id: 'action_1',
          title: 'Action 1',
          icon: <MdYard />,
        },
      ],
    },
    {
      id: 'section_2',
      title: 'Section 2',
      actions: [
        {
          id: 'action_1',
          title: 'Action 1',
          icon: <MdYard />,
        },
      ],
    },
  ],
};

export default () => {
  return (
    <Sidebar>
      <Container>
        {items.items.map((item) => (
          <Item key={item.id}>
            <ItemTitle>{item.title}</ItemTitle>
            {item.actions.map((action) => (
              <ItemAction key={action.id}>
                {action.icon}
                <ItemActionTitle>{action.title}</ItemActionTitle>
              </ItemAction>
            ))}
          </Item>
        ))}
      </Container>
    </Sidebar>
  );
};
