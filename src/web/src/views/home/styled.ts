import styled from 'styled-components';
import theme from '../../styled/theme';

export const Home = styled.div`
  width: 100vw;
  height: 100vh;

  overflow-y: auto;

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
      background: rgba(255, 255, 255, 0.6);
      border-radius: 5px;
    }
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const Header = styled.div`
  width: 100%;
  height: 80px;
`;

export const Body = styled.div`
  width: 100%;
  height: calc(100% - 170px);

  overflow-y: auto;
`;

export const Hero = styled.div`
  width: 100%;
  height: 500px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const HeroContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const HeroAnnouncement = styled.div`
  width: fit-content;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 5px 15px;
  color: ${theme.text.primary.hex};
  border: 1px solid rgba(230, 230, 230, 0.5);
  border-radius: 50px;
  font-size: 0.9rem;
  font-family: 'Montserrat', sans-serif;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  span {
    color: rgb(0, 255, 166);
    font-weight: bold;
  }

  &:hover {
    border: 1px solid rgba(230, 230, 230, 0.2);
  }
`;
export const HeroHeader = styled.div`
  width: calc(100% - 20px);
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    max-width: 1000px;
    text-align: center;
    font-size: 3.6rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    user-select: none;
    color: #ff0059;
    margin-left: 10px;
    margin-right: 10px;
    background-image: -webkit-linear-gradient(0deg, #00fbff 30%, #00ffa6 70%);
    background-clip: text;
    -webkit-background-clip: text;
    text-fill-color: transparent;
    -webkit-text-fill-color: transparent;

    @media (max-width: 600px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.15rem;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
    user-select: none;
    margin-left: 10px;
    margin-right: 10px;
    color: rgb(230, 230, 230);

    @media (max-width: 600px) {
      font-size: 1rem;
    }
  }

  div {
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    margin-top: 20px;

    button {
      width: fit-content;

      margin: 0 10px;
    }
  }
`;

export const ProjectsList = styled.div`
  width: calc(100% - 20px);
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-left: 10px;
`;

export const Paragraph = styled.div`
  width: calc(100% - 20px);
  height: fit-content;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 20px;

  p {
    max-width: 1000px;
    font-family: 'Montserrat', sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: ${theme.text.primary.hex};
  }
`;

export const AccountForm = styled.div`
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-left: 10px;
  margin-right: 10px;
`;
export const Form = styled.div`
  max-width: 500px;
  width: calc(100% - 20px);

  p {
    font-size: 1rem;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
    color: ${theme.text.primary.hex};
    user-select: none;
    color: ${theme.text.error.hex};
    background-color: ${theme.colors.error.hex};
    border-radius: 6px;
    padding: 5px 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export const ConsoleList = styled.div`
  width: calc(100% - 20px);
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const Footer = styled.div`
  width: 100%;
  height: 90px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background-color: rgba(
    ${theme.colors.primary.rawRgb[0]},
    ${theme.colors.primary.rawRgb[1]},
    ${theme.colors.primary.rawRgb[2]},
    0.2
  );
  border-top: 1px solid rgba(230, 230, 230, 0.2);
`;
export const FooterColumn = styled.div`
  width: 100%;
  height: calc(100% - 20px);

  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 1rem;
    font-weight: bold;
    font-family: 'Montserrat', sans-serif;
    color: ${theme.text.primary.hex};
    user-select: none;
  }

  p {
    font-size: 0.8rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    color: ${theme.text.primary.hex};

    &:hover {
      color: ${theme.text.accent.hex};
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;

export const AboutMe = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 30px;
  margin-bottom: 30px;
`;
export const AboutMeSection = styled.div`
  width: 100%;
  max-width: 80%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    max-width: 1000px;
    text-align: center;
    font-size: 3.6rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    user-select: none;
    color: #ff0059;
    margin-left: 10px;
    margin-right: 10px;
    background-image: -webkit-linear-gradient(0deg, #00fbff 30%, #00ffa6 70%);
    background-clip: text;
    -webkit-background-clip: text;
    text-fill-color: transparent;
    -webkit-text-fill-color: transparent;

    @media (max-width: 600px) {
      font-size: 2.5rem;
    }
  }

  p {
    max-width: 1000px;
    font-family: 'Montserrat', sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: ${theme.text.primary.hex};
  }
`;
