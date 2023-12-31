import { Context } from './styled';

import ConsoleCreator from '../../models/dashboard/consoleCreator';
import Consoles from '../../models/dashboard/consoles';

export default () => {
  return (
    <Context>
      <ConsoleCreator />
      <Consoles />
    </Context>
  );
};
