import { Context } from './styled';
import { useAppSelector } from '../../hooks/reduxHooks';
import Roles from '../../data/roles';

import Users from '../../models/dashboard/users';
import CreateUser from '../../models/dashboard/createUser';
import CreateAccountPortal from '../../models/dashboard/createAccountPortal';

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);

  return (
    <Context>
      {state.session.role === Roles.Admin && <CreateUser />}
      {state.session.role === Roles.Admin && <CreateAccountPortal />}
      {state.session.role === Roles.Admin && <Users />}
    </Context>
  );
};
