import { useEffect, useState } from 'react';
import { emitter } from '../../../lib/emitter';

import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextNotice,
} from '../../../components/contexts/StandardContext';

import Table from '../../../components/tables/Table';

export default () => {
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
    setTimeout(async () => {
      const r = await emitter.api('/account/get-accounts', true, null);
      if (r.server.success === true) {
        setUsers(r.data.accounts);
      }
    });
  }, []);

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
                name: 'Email',
                id: 'email',
              },
              {
                name: 'Username',
                id: 'username',
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
              {
                name: 'Edit',
                func: (data) => console.log(data),
              },
              {
                name: 'Delete',
                func: (data) => console.log(data),
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
