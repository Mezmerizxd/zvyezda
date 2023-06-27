import github_projects from '../../data/github_projects';

import { Body, Hero, HeroContainer, HeroHeader, ProjectsList } from './styled';
import Project from '../../models/project';

export default () => {
  return (
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
  );
};
