import { useEffect } from 'react';
import { emitter } from '../../lib/emitter';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSession, setDashboardSidebar, setDashboardContext } from '../../reducers/global';
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
} from './styled';
import { MdMenu } from 'react-icons/md';

import Sidebar from '../../models/sidebar';

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
    });
  }, []);

  return (
    <Dashboard>
      <TitlebarContainer>
        <Titlebar>
          <TitlebarHandle onClick={() => dispatch(setDashboardSidebar(!state.dashboard.sidebar))}>
            <MdMenu />
          </TitlebarHandle>
          <TitlebarTitle>
            <h1 id="LogoText">Zvyezda Dashboard</h1>
          </TitlebarTitle>
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
          {state.dashboard.context === Contexts.Default && <>DEFAULT</>}
          {state.dashboard.context === Contexts.Xbox_Hacking && <>XBOX HACKING</>}
        </ContextContainer>
      </Container>
    </Dashboard>
  );
};
