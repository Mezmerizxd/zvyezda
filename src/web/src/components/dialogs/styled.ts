import styled from 'styled-components';
import theme from '../../styled/theme';

export const Dialog = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.25);
`;
export const DialogHeader = styled.div`
  width: 100%;
  height: fit-content;

  margin-bottom: 20px;

  color: ${theme.text.primary.hex};
`;
export const DialogBody = styled.div``;
export const DialogActions = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const YesNo = styled.div`
  width: fit-content;
  height: fit-content;

  background: rgba(${theme.colors.darkBackground.rgb}, 1);

  padding: 10px;
  border-radius: 2px;
  border: 1px rgba(255, 255, 255, 0.115) solid;

  button {
    width: fit-content;
    height: fit-content;

    padding: 5px 15px;
    border-radius: 2px;

    color: ${theme.text.secondary.hex};
    font-weight: 600;
  }

  #yes {
    background: ${theme.colors.accent.hex};
  }

  #no {
    background: ${theme.text.error.hex};
  }
`;
