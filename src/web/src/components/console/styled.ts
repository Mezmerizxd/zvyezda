import styled from 'styled-components';
import theme from '../../styled/theme';

export const Console = styled.div`
  width: fit-content;
  height: fit-content;

  display: flex;
  flex-direction: column;

  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.115);
  margin-bottom: 20px;
`;

export const ConsoleHeader = styled.div`
  // scale to 16:9 with max width of 1000px
  width: 100%;
  height: fit-content;
  max-width: 600px;

  position: relative;

  * {
    user-select: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
export const ConsoleHeaderControls = styled.div`
  // this is an overlay for the images to show the controls
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  div {
    height: 100%;
    width: fit-content;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: 0.2s;

    padding: 0 20px;

    svg {
      width: 30px;
      height: 30px;
      color: ${theme.colors.accent.hex};
      filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5));
    }

    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, 0.5);
    }
  }
`;

export const ConsoleTitlebar = styled.div`
  width: 100%;
  height: fit-content;

  background: ${theme.colors.lightBackground.hex};
  padding: 10px;

  h1 {
    font-size: 20px;
    font-weight: 500;
    color: ${theme.text.accent.hex};
  }

  p {
    font-size: 15px;
    font-weight: 500;
    color: ${theme.text.primary.hex};
  }
`;

export const ConsoleBody = styled.div`
  width: 100%;
  height: fit-content;

  background: ${theme.colors.darkBackground.hex};
  padding: 10px;

  display: flex;
  flex-direction: row;
  justify-content: center;

  p {
    font-size: 15px;
    font-weight: 500;
    color: ${theme.text.accent.hex};
    letter-spacing: -0.5px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    span {
      color: ${theme.text.primary.hex};
      font-weight: 600;
      margin-left: 10px;
    }
  }
`;

export const ConsoleBodyDivider = styled.div`
  width: 100%;
  height: fit-content;

  margin: 0 10px;
`;
