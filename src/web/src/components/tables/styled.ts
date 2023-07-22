import styled from 'styled-components';
import theme from '../../styled/theme';

export const TableContainer = styled.table`
  width: 100%;
  height: 100%;

  overflow: auto;
`;
export const Table = styled.table`
  width: 100%;
  height: 100%;

  table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    thead {
      width: 100%;
      height: 100%;

      font-weight: bold;
      font-size: 15px;
      text-align: left;

      color: ${theme.text.accent.hex};

      th {
        padding: 5px;
      }
    }

    tbody {
      width: 100%;
      height: 100%;

      font-size: 14px;
      color: ${theme.text.primary.hex};

      tr {
        border-bottom: 1px solid ${theme.colors.lightBackground.hex};
        td {
          padding: 5px;
        }
      }
    }
  }
`;
export const TableRowActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button {
    padding: 0;

    background: none;
    border: none;

    &:hover {
      background: none;
      color: ${theme.colors.accentDarken.hex};
    }
  }
`;
