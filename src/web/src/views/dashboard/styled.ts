import styled from 'styled-components';
import theme from '../../styled/theme';

export const Dashboard = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;

  background-color: ${theme.colors.background.hex};

  overflow: hidden;

  * {
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-track {
      border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb {
      background: ${theme.colors.accent.hex};
      border-radius: 5px;
    }
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: stretch;

  overflow: hidden;
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

export const Context = styled.div`
  width: 100%;
  height: 100%;

  overflow: auto;
`;

export const DiscussionChatLogs = styled.div`
  width: 100%;
  height: calc(100% - 55px);

  overflow-y: auto;
  margin-bottom: 10px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
`;
export const DiscussionMessageWrapper = styled.div`
  width: calc(100% - 10px);
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin: 20px 5px;
  overflow: hidden;
`;
export const DiscussionMessageReply = styled.div`
  width: 100%;
  height: 30px;

  display: flex;
  flex-direction: row;
  align-items: center;

  cursor: pointer;
  transition: color 0.15s;

  font-size: 15px;
  font-weight: 600;
  color: ${theme.text.accent.hex};
  background-color: ${theme.colors.background.hex};
  padding: 0 10px;

  span {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;

    margin-left: 5px;
    font-size: 14px;
    font-weight: 500;
    color: ${theme.text.primary.hex};
  }
`;
export const DiscussionMessage = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;
export const DiscussionMessageAvatar = styled.div`
  width: 55px;
  height: 50px;

  background-color: ${theme.colors.background.hex};
  border-radius: 2px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  p {
    font-size: 20px;
    font-weight: 600;
    color: ${theme.text.accent.hex};
  }

  img {
    width: 55px;
    height: 50px;
  }
`;
export const DiscussionMessageContentWrapper = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin-left: 10px;
`;
export const DiscussionMessageTitlebar = styled.div`
  width: 100%;
  height: 25px;

  display: flex;
  flex-direction: row;
  align-items: center;

  h1 {
    width: fit-content;
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: 15px;
    font-weight: 600;
    color: ${theme.text.accent.hex};
  }

  h2 {
    width: fit-content;
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: 12px;
    font-weight: 500;
    color: ${theme.text.primary.hex};
    margin-left: 5px;
  }
`;
export const DiscussionMessageContent = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  p {
    width: 100%;
    height: fit-content;

    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: 16px;
    font-weight: 500;
    color: ${theme.text.primary.hex};
  }
`;

export const SurveillancePlayerControls = styled.div`
  width: 100%;
  height: 40px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  h1 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    svg {
      width: 30px;
      height: 30px;

      margin: 0 10px;
      background: ${theme.colors.background.hex};
      border-radius: 3px;
      color: ${theme.colors.accent.hex};
      cursor: pointer;
    }
  }
`;
export const SurveillancePlayer = styled.div`
  width: 100%;
  height: calc(100vh - 180px);

  border: 1px red solid;
`;
