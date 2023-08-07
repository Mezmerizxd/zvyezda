import { useEffect } from 'react';
import { emitter } from '../../lib/emitter';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSession, setDashboardSidebar, setDashboardContext, setDashboardVersions } from '../../reducers/global';
import { sidebar_items, Contexts } from '../../data/sidebar_items';

import {
  Dashboard,
  Container,
  TitlebarContainer,
  SidebarContainer,
  Titlebar,
  TitlebarHandle,
  TitlebarTitle,
  TitlebarVersions,
  Context,
} from './styled';
import { MdMenu } from 'react-icons/md';

import Sidebar from '../../components/sidebar';
import Consoles from '../../models/dashboard/consoles';
import XboxHacking from './XboxHacking';
import Discussion from './Discussion';
import Surveillance from './Surveillance';
import Users from './Users';

import Dialogs from '../../models/dashboard/dialogs';

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(async () => {
      const isTokenValid = await emitter.validateToken();
      if (isTokenValid) {
        const profile = await emitter.api('/account/get-profile', true, null);
        if (profile.server.success === false) {
          alert('Unauthorized Access!');
          window.location.href = '/';
        }

        dispatch(
          setSession({
            connected: true,
            token: localStorage.getItem('token'),
            id: profile.data.id,
            username: profile.data.username,
            email: profile.data.email,
            avatar: profile.data.avatar,
            role: profile.data.role,
          }),
        );
      } else {
        alert('Unauthorized Access!');
        window.location.href = '/';
      }

      const versions = await emitter.api('/get-version', false, null);
      if (versions.server.success !== false) {
        dispatch(setDashboardVersions(versions.data));
      }
    });
  }, []);

  return (
    <>
      <Dialogs />
      <Dashboard>
        <title>Zvyezda - Dashboard</title>
        <TitlebarContainer>
          <Titlebar>
            <TitlebarHandle onClick={() => dispatch(setDashboardSidebar(!state.dashboard.sidebar))}>
              <MdMenu />
            </TitlebarHandle>
            <TitlebarTitle>
              <h1 id="LogoText">Zvyezda Dashboard</h1>
            </TitlebarTitle>
            <TitlebarVersions>
              <p id="LogoText">server: v{state.dashboard.serverVersion}</p>
              <p id="LogoText">client: v{state.dashboard.clientVersion}</p>
            </TitlebarVersions>
          </Titlebar>
        </TitlebarContainer>

        <Container>
          <SidebarContainer sidebar={state.dashboard.sidebar}>
            <Sidebar
              items={sidebar_items}
              sidebar={state.dashboard.sidebar}
              selected={state.dashboard.context}
              onClick={(contextId) => dispatch(setDashboardContext(contextId))}
            />
          </SidebarContainer>
          {state.dashboard.context === Contexts.Default && (
            <Context>
              <Consoles />
            </Context>
          )}
          {state.dashboard.context === Contexts.Discussion && <Discussion />}
          {state.dashboard.context === Contexts.Surveillance && <Surveillance />}
          {state.dashboard.context === Contexts.Xbox_Hacking && <XboxHacking />}
          {state.dashboard.context === Contexts.Users && <Users />}
        </Container>
      </Dashboard>
    </>
  );
};
