import { emitter } from '../../lib/emitter';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSession, setHomePage } from '../../reducers/global';
import github_projects from '../../data/github_projects';

import {
  Home,
  Container,
  Header,
  Body,
  Hero,
  HeroContainer,
  HeroAnnouncement,
  HeroHeader,
  ProjectsList,
  Footer,
  FooterColumn,
} from './styled';

import StandardButton from '../../components/buttons/StandardButton';
import SubtleButton from '../../components/buttons/SubtleButton';

import Navigation from '../../models/navigation';
import Project from '../../models/project';

import Projects from './Projects';
import AboutMe from './AboutMe';
import News from './News';
import Login from './Login';
import { useEffect } from 'react';

export enum Pages {
  Home,
  Projects,
  AboutMe,
  News,
  Login,
}

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  const prj = github_projects[Math.floor(Math.random() * github_projects.length)];

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
      }
    });
  }, []);

  return (
    <Home>
      <Container>
        <Header>
          <Navigation />
        </Header>
        {state.home.page === Pages.Home && (
          <Body>
            <Hero>
              <title>Zvyezda - Home</title>
              <HeroContainer>
                <HeroAnnouncement>
                  <p onClick={() => dispatch(setHomePage(Pages.News))}>
                    Announcing my new project soon! <span>Read more</span>
                  </p>
                </HeroAnnouncement>
                <HeroHeader>
                  <h1>Welcome to Zvyezda</h1>
                  <p>Zvyezda Is the home of my projects, I am a full stack developer.</p>
                  <div>
                    <StandardButton text="Projects" onClick={() => dispatch(setHomePage(Pages.Projects))} />
                    <SubtleButton text="About me" onClick={() => dispatch(setHomePage(Pages.AboutMe))} />
                  </div>
                </HeroHeader>
              </HeroContainer>
            </Hero>

            <ProjectsList>
              {
                <Project
                  project={prj.project}
                  title={prj.title}
                  description={prj.description}
                  image={prj.image}
                  links={prj.links}
                />
              }
            </ProjectsList>
          </Body>
        )}

        {state.home.page === Pages.Projects && <Projects />}

        {state.home.page === Pages.AboutMe && <AboutMe />}

        {state.home.page === Pages.News && <News />}

        {state.home.page === Pages.Login && <Login />}

        <Footer>
          <FooterColumn>
            <h1>Social Media</h1>
            <p>
              <a href="#">Twitter</a>
            </p>
          </FooterColumn>
          <FooterColumn>
            <h1>Legals</h1>
            <p>
              <a href="#">Privacy & Cookies</a>
            </p>
            <p>
              <a href="#">Terms & Conditions</a>
            </p>
          </FooterColumn>
        </Footer>
      </Container>
    </Home>
  );
};
