import { about_me, skills, deeper_dive_into_my_skills_and_experience } from '../../data/about_me';

import { Body, AboutMe, AboutMeSection } from './styled';

export default () => {
  return (
    <Body>
      <title>Zvyezda - About Me</title>
      <AboutMe>
        <AboutMeSection>
          <h1>About Me</h1>
          <p>{about_me}</p>
        </AboutMeSection>
      </AboutMe>

      <AboutMe>
        <AboutMeSection>
          <h1>Skills</h1>
          <p>{skills}</p>
        </AboutMeSection>
      </AboutMe>

      <AboutMe>
        <AboutMeSection>
          <h1>Deeper Dive Into My Skills and Experience</h1>
          <p>{deeper_dive_into_my_skills_and_experience}</p>
        </AboutMeSection>
      </AboutMe>
    </Body>
  );
};
