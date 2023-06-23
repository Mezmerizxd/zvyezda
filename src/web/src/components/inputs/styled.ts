import styled from 'styled-components';
import theme from '../../styled/theme';

export const IconInput = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  width: 100%;
  height: 45px;

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;

  .Icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    svg {
      color: ${theme.text.primary.hex};
    }
  }

  .InputField {
    padding-right: 5px;

    input {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: ${theme.colors.background.hex}};
      color: ${theme.text.accent.hex};
      font-size: 16px;
      font-weight: 500;

      &::placeholder {
        color: ${theme.text.primary.hex};
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
`;
