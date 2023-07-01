import styled from 'styled-components';
import theme from '../../styled/theme';

export const Dashboard = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;

  background-color: ${theme.colors.background.hex};
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

export const TitlebarContainer = styled.div`
  width: 100%;
  height: 60px;

  display: flex;
  flex-direction: row;
  align-items: center;

  background-color: ${theme.colors.background.hex};
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
`;
export const Titlebar = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const TitlebarHandle = styled.div`
  margin: 0 10px;
  color: ${theme.text.accent.hex};
  cursor: pointer;
  transition: color 0.2s;

  svg {
    width: 25px;
    height: 25px;
  }

  &:hover {
    color: ${theme.colors.accentDarken.hex};
  }
`;
export const TitlebarTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin: 0 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  user-select: none;
`;
export const TitlebarVersions = styled.div`
  margin: 0 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  user-select: none;

  p {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
  }
`;

export const SidebarContainer = styled.div`
  width: ${(props: { sidebar: boolean }) => (props.sidebar ? 'fit-content' : '50px')};

  background-color: ${theme.colors.darkBackground.hex};
  border-right: 1px solid rgba(255, 255, 255, 0.15);
`;

export const ContextContainer = styled.div``;

export const Context = styled.div``;
