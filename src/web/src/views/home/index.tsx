import { useState } from 'react';
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
  Footer,
  FooterColumn,
} from './styled';

import StandardButton from '../../components/buttons/StandardButton';
import SubtleButton from '../../components/buttons/SubtleButton';

import Navigation from '../../models/navigation';
import Project from '../../models/project';

export enum Pages {
  Home,
  Projects,
  AboutMe,
  News,
}

export default () => {
  const [page, setPage] = useState(Pages.Home);

  const prj = github_projects[Math.floor(Math.random() * github_projects.length)];

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
