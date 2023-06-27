import { about_me, skills, deeper_dive_into_my_skills_and_experience } from '../../data/about_me';

import { Body, Hero, HeroContainer, HeroHeader, Paragraph } from './styled';

export default () => {
  return (
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
  );
};
