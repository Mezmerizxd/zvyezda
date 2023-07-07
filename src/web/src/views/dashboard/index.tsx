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
  ContextContainer,
  Titlebar,
  TitlebarHandle,
  TitlebarTitle,
  TitlebarVersions,
} from './styled';
import { MdMenu } from 'react-icons/md';

import Sidebar from '../../components/sidebar';
import Consoles from '../../models/dashboard/consoles';
import XboxHacking from './XboxHacking';

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(async () => {
      const isTokenValid = await emitter.validateToken();
      if (isTokenValid) {
        dispatch(
          setSession({
            connected: true,
            token: localStorage.getItem('token'),
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
        <ContextContainer>
          {state.dashboard.context === Contexts.Default && (
            <>
              <Consoles />
            </>
          )}
          {state.dashboard.context === Contexts.Xbox_Hacking && <XboxHacking />}
        </ContextContainer>
      </Container>
    </Dashboard>
  );
};
