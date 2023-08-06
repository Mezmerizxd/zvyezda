import { useEffect, useState } from 'react';
import { emitter } from '../../../lib/emitter';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { setDashboardUsersRefresh } from '../../../reducers/global';

import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextNotice,
  StandardContextDivider,
} from '../../../components/contexts/StandardContext';

import StandardButton from '../../../components/buttons/StandardButton';
import Table from '../../../components/tables/Table';
import { copyTextToClipboard } from '../../../lib/utils';

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const [tokens, setTokens] = useState<
    {
      id: number;
      token: string;
    }[]
  >(null);

  useEffect(() => {
    setTimeout(async () => {
      let fetchedTokens: {
        id: number;
        token: string;
      }[] = [];
      const r = await emitter.api('/account/get-portal-tokens', true, {});
      if (r.server.success === true) {
        r.data?.tokens?.forEach((t, i) => {
          fetchedTokens.push({
            id: i,
            token: t,
          });
        });
      }
      setTokens(fetchedTokens);
    });
  }, [state.dashboard.users.refresh]);

  async function generateToken() {
    const r = await emitter.api('/account/create-portal-token', true, {});
    if (r.server.success === true) {
      setTokens([
        ...tokens,
        {
          id: tokens.length || 0,
          token: r.data.token,
        },
      ]);
    }
  }

  return (
    <StandardContext max="800px" wide>
      <StandardContextHeader>
        <h1>Create Account Portal</h1>
      </StandardContextHeader>

      <StandardContextBody>
        <StandardButton text="Generate Token" margin="5px 0" onClick={generateToken} />
        {tokens && tokens.length > 0 && (
          <Table
            headers={[
              {
                name: 'ID',
                id: 'id',
              },
              {
                name: 'Token',
                id: 'token',
              },
            ]}
            actions={[
              {
                name: 'Copy',
                func: (data) => {
                  const { protocol, host, port } = window.location;
                  let url;
                  if (port === '8080') {
                    url = `http://localhost:8080/create-account-portal?token=${data.token}`;
                  } else {
                    url = `${protocol}//${host}/create-account-portal?token=${data.token}`;
                  }
                  copyTextToClipboard(url);
                },
              },
              {
                name: 'Delete',
                func: async (data) => {
                  const r = await emitter.api('/account/delete-portal-token', true, {
                    token: data.token,
                  });
                  if (r.server.success === true) {
                    dispatch(setDashboardUsersRefresh(true));
                  }
                },
              },
            ]}
            data={tokens}
          />
        )}
      </StandardContextBody>
    </StandardContext>
  );
};
