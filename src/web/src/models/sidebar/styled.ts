import styled from 'styled-components';
import theme from '../../styled/theme';

export const Sidebar = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;

  * {
    user-select: none;
  }
`;

export const Item = styled.div`
  width: 100%;
  height: fit-content;

  margin-top: 20px;

  hr {
    width: 60%;

    margin: 0 auto;
    border-color: rgba(255, 255, 255, 0.15);
    border-width: 1px;
  }
`;
export const ItemTitle = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: 16px;
  font-weight: 500;
  color: ${theme.text.primary.hex};
  padding: 10px 10px;
`;
export const ItemAction = styled.div`
  width: calc(100% - 20px);
  height: fit-content;

  display: flex;
  flex-direction: row;
  align-items: center;

  color: ${(props: { selected: boolean }) => (props.selected ? theme.colors.accent.hex : theme.text.primary.hex)};

  margin-left: 10px;
  margin-right: 10px;
  padding: 5px 30px;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.15s;

  svg {
    width: 30px;
    height: 30px;
  }

  &:hover {
    background-color: ${theme.colors.lightBackground.hex};
  }
`;
export const ItemSmallAction = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  color: ${(props: { selected: boolean }) => (props.selected ? theme.colors.accent.hex : theme.text.primary.hex)};

  padding: 10px 10px;
  margin-bottom: 10px;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.15s;

  svg {
    width: 30px;
    height: 30px;
  }

  &:hover {
    color: ${theme.colors.accent.hex};
  }
`;
export const ItemActionTitle = styled.div`
  width: 100%;
  height: fit-content;

  font-size: 17px;
  font-weight: 500;
  color: ${(props: { selected: boolean }) => (props.selected ? theme.colors.accent.hex : theme.text.primary.hex)};
  padding: 0 10px;
`;
