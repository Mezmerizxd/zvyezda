import * as rqa from 'react-query-auth';

import { engine } from './engine';
import storage from './storage';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

async function loadUser() {
  if (engine.profile !== null) {
    return engine.profile;
  } else if (storage.getToken() !== null) {
    return (await engine.GetProfile()).data;
  }
  return null;
}

async function loginFn(data: LoginCredentials) {
  // const response = await loginWithEmailAndPassword(data);
  // const user = await handleUserResponse(response);
  // return user;
  return null;
}

async function registerFn(data: RegisterCredentials) {
  // const response = await loginWithEmailAndPassword(data);
  // const user = await handleUserResponse(response);
  // return user;
  return null;
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
    return <div className="w-screen h-screen flex justify-center items-center">{/* <Spinner size="xl" /> */}</div>;
  },
};

export const { AuthProvider, useAuth } = rqa.initReactQueryAuth<
  Profile | null,
  unknown,
  LoginCredentials,
  RegisterCredentials
>(authConfig);
