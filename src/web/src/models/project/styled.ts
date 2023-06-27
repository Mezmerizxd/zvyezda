import styled from 'styled-components';
import theme from '../../styled/theme';

export const Project = styled.div`
  width: fit-content;
  height: fit-content;

  margin: 10px 0;
`;

export const NarrowContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  height: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.5fr fit-content;
  grid-column-gap: 0px;
  grid-row-gap: 0px;

  background-color: ${theme.colors.lightBackground.hex};
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const WideContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  height: 100%;

  display: grid;
  grid-template-columns: 0.8fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;

  background-color: ${theme.colors.lightBackground.hex};
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Thumbnail = styled.div`
  width: 100%;
  height: 300px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const WideHeader = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-left: 10px;
  margin-top: 5px;

  h1 {
    font-size: 30px;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
    color: ${theme.colors.accent.hex};
  }
`;
export const WideHeaderActions = styled.div`
  width: fit-content;
  height: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  margin-right: 20px;

  svg {
    width: 25px;
    height: 25px;
    color: ${theme.colors.accent.hex};
    cursor: pointer;
  }
`;

export const Body = styled.div`
  width: 100%;
  height: fit-content;

  padding: 10px;

  p {
    font-size: 16px;
    font-weight: 400;
    font-family: 'Montserrat', sans-serif;
    color: ${theme.text.primary.hex};

    text-align: justify;
    word-break: break-word;
  }
`;
