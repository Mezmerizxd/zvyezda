import { useEffect } from 'react';
import { emitter } from '../../lib/emitter';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { setSession } from '../../reducers/global';

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
          <TitlebarHandle>
            <MdMenu />
          </TitlebarHandle>
          <TitlebarTitle>
            <h1 id="LogoText">Zvyezda Dashboard</h1>
          </TitlebarTitle>
        </Titlebar>
      </TitlebarContainer>

      <Container>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
        <ContextContainer>b</ContextContainer>
      </Container>
    </Dashboard>
  );
};
