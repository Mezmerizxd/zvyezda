import { useState } from 'react';
import { emitter } from '../../lib/emitter';
import { setHomePage } from '../../reducers/global';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { Pages } from './index';

import { Body, Hero, HeroContainer, HeroHeader, AccountForm, Form } from './styled';
import { FaKey, FaUser } from 'react-icons/fa';
import IconInput from '../../components/inputs/IconInput';
import StandardButton from '../../components/buttons/StandardButton';

export default () => {
  const dispatch = useAppDispatch();

  const [loginForm, setLoginForm] = useState<{ username: string; password: string; error: string }>({
    username: '',
    password: '',
    error: null,
  });

  async function Login() {
    setLoginForm({ ...loginForm, error: null });

    if (loginForm?.password === undefined || loginForm?.password === null || loginForm?.password === '') {
      setLoginForm({ ...loginForm, error: 'Please enter a password' });
    }
    if (loginForm?.username === undefined || loginForm?.username === null || loginForm?.username === '') {
      setLoginForm({ ...loginForm, error: 'Please enter a username' });
    }

    await emitter
      .api('/account/login', false, {
        username: loginForm.username,
        password: loginForm.password,
      })
      .then((res) => {
        if (res?.server?.error) {
          setLoginForm({ ...loginForm, error: res.server.error });
        } else {
          localStorage.setItem('token', res.data.token);
          window.location.href = '/dashboard';
        }
      });
  }

  return (
    <Body>
      <title>Zvyezda - Login</title>
      <Hero style={{ height: '140px' }}>
        <HeroContainer>
          <HeroHeader>
            <h1>Login</h1>
          </HeroHeader>
        </HeroContainer>
      </Hero>

      <AccountForm>
        <Form>
          <IconInput
            icon={<FaUser />}
            placeholder="Username"
            type="email"
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            value={loginForm?.username}
            margin="10px 0"
          />
          <IconInput
            icon={<FaKey />}
            placeholder="Password"
            type="password"
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            value={loginForm?.password}
          />
          <StandardButton text="Login" margin="10px 0" onClick={Login} />
          {loginForm?.error && <p>{loginForm.error}</p>}
        </Form>
      </AccountForm>
    </Body>
  );
};
