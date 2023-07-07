import { Sidebar, Container, Item, ItemTitle, ItemAction, ItemSmallAction, ItemActionTitle } from './styled';

export default ({
  items,
  sidebar,
  selected,
  onClick,
}: {
  items: Zvyezda.Client.Models.SidebarItemProps[];
  sidebar: boolean;
  selected: number;
  onClick: (contextId: number) => void;
}) => {
  return (
    <Sidebar>
      <Container>
        {sidebar
          ? items.map((item) => (
              <Item key={item.id}>
                <ItemTitle>{item.title}</ItemTitle>
                {item.actions.map((action) => (
                  <ItemAction
                    key={action.id}
                    selected={action.id === selected ? true : false}
                    onClick={() => onClick(action.id)}
                  >
                    {action.icon}
                    <ItemActionTitle selected={action.id === selected ? true : false}>{action.title}</ItemActionTitle>
                  </ItemAction>
                ))}
              </Item>
            ))
          : items.map((item) => (
              <Item key={item.id}>
                {item.actions.map((action) => (
                  <ItemSmallAction
                    key={action.id}
                    selected={action.id === selected ? true : false}
                    onClick={() => onClick(action.id)}
                  >
                    {action.icon}
                  </ItemSmallAction>
                ))}
                <hr />
              </Item>
            ))}
      </Container>
    </Sidebar>
  );
};
