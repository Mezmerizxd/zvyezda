import styled from 'styled-components';
import theme from '../../styled/theme';

export const StandardButton = styled.button`
  width: 100%;
  height: 40px;

  border: none;
  outline: none;
  border-radius: 6px;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;
  background-color: ${theme.colors.accent.hex};
  color: ${theme.text.secondary.hex};
  font-size: 14px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.5px;
  cursor: pointer;
  padding: 0 15px;
  transition: all 0.2s ease-in-out;
  user-select: none;

  &:hover {
    background-color: ${theme.colors.accentDarken.hex};
  }
`;

export const IconButton = styled.button`
  width: 100%;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  border: none;
  outline: none;
  border-radius: 6px;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;
  background-color: ${theme.colors.accent.hex};
  color: ${theme.text.primary.hex};
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;

  svg {
    margin-right: 5px;
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: ${theme.colors.accentDarken.hex};
  }
`;

export const SubtleButton = styled.button`
  width: 100%;
  height: 40px;

  border: none;
  outline: none;
  border-radius: 6px;
  background-color: ${theme.colors.background.hex};
  color: ${theme.text.accent.hex};
  font-size: 14px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.5px;
  cursor: pointer;
  padding: 0 15px;
  transition: all 0.2s ease-in-out;
  user-select: none;

  &:hover {
    background-color: ${theme.colors.lightBackground.hex};
  }
`;
