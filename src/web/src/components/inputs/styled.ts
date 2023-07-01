import styled from 'styled-components';
import theme from '../../styled/theme';

export const Input = styled.div`
  display: grid;
  ${(props: { icon?: boolean }) => (props.icon ? 'grid-template-columns: 40px 1fr' : 'grid-template-columns: 1fr')};
  width: 100%;
  height: 45px;

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: ${theme.colors.background.hex}};

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
    ${(props: { icon?: boolean }) => (props.icon ? '' : 'padding-left: 5px')};

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
      font-family: 'Montserrat', sans-serif;

      &::placeholder {
        color: ${theme.text.primary.hex};
        font-size: 15px;
        font-weight: 500;
      }
    }

    select {
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

      select:invalid {
        // make text lighter colour
        color: ${theme.text.lightPrimary.hex};
      }
    }


  }
`;
