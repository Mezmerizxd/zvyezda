import { TableContainer, Table, TableRowActions } from './styled';

import SubtleButton from '../buttons/SubtleButton';

export default ({
  headers,
  actions,
  data,
}: {
  headers: Zvyezda.Client.Models.Tables.TableHeaders[];
  actions: Zvyezda.Client.Models.Tables.TableActions[];
  data: any[];
}) => {
  return (
    <TableContainer>
      <Table>
        <table cellSpacing={0}>
          <thead>
            <tr>
              {headers.map((header, index) => {
                return (
                  <th key={index} className={header.id}>
                    {header.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => {
              return (
                <tr key={index}>
                  {Object.keys(d).map((key, index) => {
                    return (
                      <td key={index} className={key}>
                        {d[key]}
                      </td>
                    );
                  })}
                  <TableRowActions>
                    {actions.map((action, index) => {
                      return (
                        <SubtleButton
                          key={index}
                          text={action.name}
                          margin="5px 5px"
                          onClick={() => action.func(data)}
                        />
                      );
                    })}
                  </TableRowActions>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Table>
    </TableContainer>
  );
};
