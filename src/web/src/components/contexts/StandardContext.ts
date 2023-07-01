import styled from 'styled-components';
import theme from '../../styled/theme';

export const StandardContext = styled.div`
  width: fit-content;
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  margin: 10px;
  border-radius: 2px;
  background-color: ${theme.colors.darkBackground.hex};
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

export const StandardContextHeader = styled.div`
  width: 100%;
  height: 40px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  h1 {
    font-size: 15px;
    font-weight: 500;
    color: ${theme.text.primary.hex};
    margin: 0 10px;
  }
`;

export const StandardContextBody = styled.div`
  width: 100%;
  height: 100%;

  padding: 10px;

  color: ${theme.text.primary.hex};
`;
