import { useEffect, useState } from 'react';
import { emitter } from '../../../lib/emitter';
import { engine } from '../../../lib/engine';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { setDashboardUsersRefresh } from '../../../reducers/global';

import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextNotice,
  StandardContextDivider,
} from '../../../components/contexts/StandardContext';

import IconInput from '../../../components/inputs/StandardInput';
import StandardButton from '../../../components/buttons/StandardButton';
import SubtleButton from '../../../components/buttons/SubtleButton';
import ComboInput from '../../../components/inputs/ComboInput';
import ButtonInput from '../../../components/inputs/ButtonInput';
import { rgh_versions } from '../../../data/xbox_hacking';

export default () => {
  const dispatch = useAppDispatch();

  const [newUser, setNewUser] = useState<Zvyezda.Client.User>({
    email: '',
    username: '',
    password: '',
  });
  const [cPassword, setCPassword] = useState<string>('');
  const [error, setError] = useState<string>(null);

  async function create() {
    setError(null);

    if (!newUser.email) {
      setError('Email is required');
    }
    if (!newUser.username) {
      setError('Username is required');
    }
    if (!newUser.password) {
      setError('Password is required');
    }
    if (!cPassword) {
      setError('Confirm Password is required');
    }
    if (cPassword !== newUser.password) {
      setError('Passwords Must match');
    }

    if (engine.forceEngine) {
      const account = await engine.CreateAccount({
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
      });
      if (account.data) {
        dispatch(setDashboardUsersRefresh(true));
      } else {
        setError(account.server.error);
      }
    } else {
      const r = await emitter.api('/account/create', true, newUser);
      if (r.server.success === true) {
        dispatch(setDashboardUsersRefresh(true));
      } else {
        setError(r.server.error);
      }
    }
  }

  return (
    <StandardContext max="800px" wide>
      <StandardContextHeader>
        <h1>Create User</h1>
      </StandardContextHeader>

      <StandardContextBody>
        <IconInput
          placeholder="Email *"
          type="text"
          margin="5px 0"
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          value={newUser.email}
        />
        <IconInput
          placeholder="Username *"
          type="text"
          margin="5px 0"
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          value={newUser.username}
        />
        <StandardContextDivider>
          <IconInput
            placeholder="Password *"
            type="text"
            margin="0 0"
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            value={newUser.password}
          />
          <IconInput
            placeholder="Confirm Password *"
            type="text"
            margin="0 0 0 5px"
            onChange={(e) => setCPassword(e.target.value)}
            value={cPassword}
          />
        </StandardContextDivider>
        <IconInput
          placeholder="Avatar"
          type="text"
          margin="5px 0"
          onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
          value={newUser.avatar}
        />
        <IconInput
          placeholder="Biography"
          type="text"
          margin="5px 0"
          onChange={(e) => setNewUser({ ...newUser, biography: e.target.value })}
          value={newUser.biography}
        />
        <ComboInput
          placeholder="Role"
          options={[
            {
              text: 'User',
              value: 'USER',
            },
            {
              text: 'Developer',
              value: 'DEVELOPER',
            },
            {
              text: 'Admin',
              value: 'ADMIN',
            },
          ]}
          margin="5px 0"
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          value={newUser.role}
        />
        <StandardButton text="Create" margin="5px 0" onClick={create} />
        {error && <p id="error">{error}</p>}
      </StandardContextBody>
    </StandardContext>
  );
};
