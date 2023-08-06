import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Body, Hero, HeroContainer, HeroHeader, AccountForm, Form } from '../home/styled';
import IconInput from '../../components/inputs/StandardInput';
import { FaImage, FaKey, FaParagraph, FaUser, FaUserCircle } from 'react-icons/fa';
import ComboInput from '../../components/inputs/ComboInput';
import { xbox_types } from '../../data/xbox_hacking';
import { emitter } from '../../lib/emitter';
import ButtonInput from '../../components/inputs/ButtonInput';
import StandardButton from '../../components/buttons/StandardButton';

export default () => {
  const [query] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const [create, setCreate] = useState<{
    email: string;
    username: string;
    password: string;
    role?: string;
    avatar?: string;
    biography?: string;
  }>({
    email: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    const token = query.get('token');

    if (!token) {
      setError('A Token is required!');
    }
  }, []);

  async function submit() {
    setError(null);
    const token = query.get('token');
    const r = await emitter.api('/account/create-account-portal', false, {
      token: token,
      email: create.email,
      username: create.username,
      password: create.password,
      avatar: create.avatar,
      biography: create.biography,
    });

    if (r.server.success === false) {
      setError(r.server.error);
    } else {
      if (r.data.token) {
        localStorage.setItem('token', r.data.token);
        window.location.href = '/dashboard';
      }
    }
  }

  return (
    <Body>
      <title>Create Account Portal</title>
      <Hero style={{ height: '140px' }}>
        <HeroContainer>
          <HeroHeader>
            <h1>Create Account</h1>
          </HeroHeader>
        </HeroContainer>
      </Hero>

      <AccountForm>
        <Form>
          {query.get('token') ? (
            <>
              <IconInput
                icon={<FaUser />}
                placeholder="Email"
                type="email"
                onChange={(e) => setCreate({ ...create, email: e.target.value })}
                value={create?.email}
                margin="10px 0"
              />
              <IconInput
                icon={<FaUserCircle />}
                placeholder="Username"
                type="text"
                onChange={(e) => setCreate({ ...create, username: e.target.value })}
                value={create?.username}
                margin="10px 0"
              />
              <IconInput
                icon={<FaKey />}
                placeholder="Password"
                type="text"
                onChange={(e) => setCreate({ ...create, password: e.target.value })}
                value={create?.password}
                margin="10px 0"
              />
              <IconInput
                icon={<FaImage />}
                placeholder="Avatar"
                type="text"
                onChange={(e) => setCreate({ ...create, avatar: e.target.value })}
                value={create?.avatar}
                margin="10px 0"
              />
              <IconInput
                icon={<FaParagraph />}
                placeholder="Biography"
                type="text"
                onChange={(e) => setCreate({ ...create, biography: e.target.value })}
                value={create?.biography}
                margin="10px 0"
              />
              <StandardButton text="Create" margin="5px 2.5px" onClick={submit} />
              {error && <p>{error}</p>}
            </>
          ) : (
            <p>{error}</p>
          )}
        </Form>
      </AccountForm>
    </Body>
  );
};
