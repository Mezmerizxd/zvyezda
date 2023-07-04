import styled from 'styled-components';
import theme from '../../styled/theme';

export const Accordion = styled.div``;
export const AccordionBody = styled.div`
  width: 100%;
  height: fit-content;

  background-color: ${theme.colors.darkBackground.hex};
  border-radius: 1px;
  padding: 0 5px;
`;

export const AdvancedAccordion = styled.div``;
export const AdvancedHeader = styled.div`
  width: 100%;
  height: 45px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: ${theme.colors.background.hex};
  border-radius: 1px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: 0.15s;
  padding: 0 10px;

  * {
    user-select: none;
  }

  &:hover {
    background-color: ${theme.colors.lightBackground.hex};
  }
`;
export const AdvancedTitle = styled.div`
  width: fit-content;
  height: fit-content;
`;
export const AdvancedButtons = styled.div`
  width: fit-content;
  height: fit-content;

  svg {
    width: 20px;
    height: 20px;
  }
`;
