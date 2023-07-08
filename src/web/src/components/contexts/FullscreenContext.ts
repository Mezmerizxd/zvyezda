import styled from 'styled-components';
import theme from '../../styled/theme';

export const FullscreenContext = styled.div`
  width: calc(100% - 20px);
  height: calc(100% - 20px);

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  margin: 10px;

  border-radius: 2px;
  background-color: ${theme.colors.darkBackground.hex};
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

export const FullscreenContextHeader = styled.div`
  width: 100%;
  height: 40px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;

  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  h1 {
    font-size: 15px;
    font-weight: 500;
    color: ${theme.text.primary.hex};
    margin: 0 10px;
    user-select: none;
  }
`;

export const FullscreenContextBody = styled.div`
  width: 100%;
  max-height: 100%;

  color: ${theme.text.primary.hex};
  overflow-y: auto;
  padding: 10px;

  #error {
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

export const FullscreenContextBodyDivider = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
