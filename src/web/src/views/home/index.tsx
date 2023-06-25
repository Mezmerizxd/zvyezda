import { useState } from 'react';
import { emitter } from '../../lib/emitter';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { setSession } from '../../reducers/global';
import github_projects from '../../data/github_projects';
import { about_me, skills, deeper_dive_into_my_skills_and_experience } from '../../data/about_me';

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
  Paragraph,
  AccountForm,
  Footer,
  FooterColumn,
  Form,
} from './styled';

import StandardButton from '../../components/buttons/StandardButton';
import SubtleButton from '../../components/buttons/SubtleButton';
import IconInput from '../../components/inputs/IconInput';
import { FaUser, FaKey } from 'react-icons/fa';

import Navigation from '../../models/navigation';
import Project from '../../models/project';

export enum Pages {
  Home,
  Projects,
  AboutMe,
  News,
  Login,
}

export default () => {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(Pages.Home);
  const [loginForm, setLoginForm] = useState<{ username: string; password: string; error: string }>(null);

  const prj = github_projects[Math.floor(Math.random() * github_projects.length)];

  setTimeout(async () => {
    const isTokenValid = await emitter.api('/account/check-token', false, {
      token: localStorage.getItem('token'),
    });

    if (isTokenValid?.server?.error) {
      localStorage.removeItem('token');
    } else if (isTokenValid?.data?.valid === true) {
      dispatch(
        setSession({
          connected: true,
          token: localStorage.getItem('token'),
        }),
      );
    }
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
          setPage(Pages.Home);
        }
      });
  }

  return (
    <Home>
      <Container>
        <Header>
          <Navigation setPage={setPage} />
        </Header>
        {page === Pages.Home && (
          <Body>
            <Hero>
              <title>Zvyezda - Home</title>
              <HeroContainer>
                <HeroAnnouncement>
                  <p onClick={() => setPage(Pages.News)}>
                    Announcing my new project soon! <span>Read more</span>
                  </p>
                </HeroAnnouncement>
                <HeroHeader>
                  <h1>Welcome to Zvyezda</h1>
                  <p>Zvyezda Is the home of my projects, I am a full stack developer.</p>
                  <div>
                    <StandardButton text="Projects" onClick={() => setPage(Pages.Projects)} />
                    <SubtleButton text="About me" onClick={() => setPage(Pages.AboutMe)} />
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

        {page === Pages.Projects && (
          <Body>
            <title>Zvyezda - Projects</title>
            <Hero style={{ height: '200px' }}>
              <title>Zvyezda - Home</title>
              <HeroContainer>
                <HeroHeader>
                  <h1>Projects</h1>
                </HeroHeader>
              </HeroContainer>
            </Hero>

            <ProjectsList>
              {github_projects.map((project, index) => (
                <Project
                  key={index}
                  project={project.project}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  links={project.links}
                />
              ))}
            </ProjectsList>
          </Body>
        )}

        {page === Pages.AboutMe && (
          <Body>
            <title>Zvyezda - About Me</title>
            <Hero style={{ height: '140px' }}>
              <HeroContainer>
                <HeroHeader>
                  <h1>About Me</h1>
                </HeroHeader>
              </HeroContainer>
            </Hero>
            <Paragraph>
              <p>{about_me}</p>
            </Paragraph>

            <Hero style={{ height: '140px' }}>
              <HeroContainer>
                <HeroHeader>
                  <h1>Skills</h1>
                </HeroHeader>
              </HeroContainer>
            </Hero>
            <Paragraph>
              <p>{skills}</p>
            </Paragraph>

            <Hero style={{ height: '140px' }}>
              <HeroContainer>
                <HeroHeader>
                  <h1>Deeper Dive Into My Skills and Experience</h1>
                </HeroHeader>
              </HeroContainer>
            </Hero>
            <Paragraph>
              <p>{deeper_dive_into_my_skills_and_experience}</p>
            </Paragraph>
          </Body>
        )}

        {page === Pages.News && (
          <Body>
            <title>Zvyezda - News</title>
          </Body>
        )}

        {page === Pages.Login && (
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
        )}

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
