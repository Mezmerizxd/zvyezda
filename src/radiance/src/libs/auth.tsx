import * as rqa from 'react-query-auth';

import { engine } from './engine';
import storage from './storage';
import { Spinner } from '../components/Elements';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

interface AuthConfig {
  profile: Profile | null;
  error: string | null;
}

async function loadUser(): Promise<AuthConfig> {
  if (engine.profile !== null) {
    return {
      profile: engine.profile,
      error: null,
    };
  } else if (storage.getToken() !== null) {
    const profile = await engine.GetProfile();
    if (profile.data) {
      return {
        profile: profile.data,
        error: null,
      };
    } else {
      return {
        profile: null,
        error: profile.server.error,
      };
    }
  }
  return null;
}

async function loginFn(data: LoginCredentials): Promise<AuthConfig> {
  const account = await engine.LoginAccount(data);
  if (!account.data) {
    return {
      profile: null,
      error: account.server.error,
    };
  }
  storage.setToken(account.data.token);
  return {
    profile: account.data,
    error: null,
  };
}

async function registerFn(data: RegisterCredentials): Promise<AuthConfig> {
  const account = await engine.CreateAccount(data);
  if (!account.data) {
    return {
      profile: null,
      error: account.server.error,
    };
  }
  storage.setToken(account.data.token);
  return {
    profile: account.data,
    error: null,
  };
}

async function logoutFn() {
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  LoaderComponent() {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  },
};

export const { AuthProvider, useAuth } = rqa.initReactQueryAuth<
  AuthConfig,
  unknown,
  LoginCredentials,
  RegisterCredentials
>(authConfig);
