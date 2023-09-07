import { useEffect, useState } from 'react';
import { emitter } from '../../../lib/emitter';
import { engine } from '../../../lib/engine';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { setDashboardUsersRefresh, setDialogDeleteUser } from '../../../reducers/global';

import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextNotice,
} from '../../../components/contexts/StandardContext';

import Table from '../../../components/tables/Table';

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  const [users, setUsers] = useState<
    {
      id: string;
      email: string;
      username: string;
      role: string;
      createdAt: string;
    }[]
  >(null);

  useEffect(() => {
    dispatch(setDashboardUsersRefresh(false));
    setTimeout(async () => {
      if (engine.forceEngine) {
        const accounts = await engine.GetAllAccounts();
        if (accounts.data) {
          let list: any[] = [];
          accounts.data.forEach((account) => {
            list.push({
              id: account.id,
              email: account.email,
              username: account.username,
              role: account.role,
              createdAt: account.createdAt,
            });
          });
          setUsers(list);
        }
      } else {
        const r = await emitter.api('/account/get-accounts', true, null);
        if (r.server.success === true) {
          setUsers(r.data.accounts);
        }
      }
    });
  }, [state.dashboard.users.refresh]);

  return (
    <StandardContext max="800px" wide>
      <StandardContextHeader>
        <h1>Users</h1>
      </StandardContextHeader>

      {users && users?.length > 0 ? (
        <StandardContextBody>
          <Table
            headers={[
              {
                name: 'ID',
                id: 'id',
              },
              {
                name: 'Username',
                id: 'username',
              },
              {
                name: 'Email',
                id: 'email',
              },
              {
                name: 'role',
                id: 'role',
              },
              {
                name: 'Created',
                id: 'createdAt',
              },
            ]}
            actions={[
              // {
              //   name: 'Edit',
              //   func: (data) => console.log(data),
              // },
              {
                name: 'Delete',
                func: (data) => {
                  dispatch(
                    setDialogDeleteUser({
                      show: true,
                      ...data,
                    }),
                  );
                },
              },
            ]}
            data={users}
          />
        </StandardContextBody>
      ) : (
        <StandardContextBody>
          <StandardContextNotice>
            <h1>No Users Found</h1>
          </StandardContextNotice>
        </StandardContextBody>
      )}
    </StandardContext>
  );
};
