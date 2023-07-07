import { useState } from 'react';
import { Project, NarrowContainer, WideContainer, WideHeader, WideHeaderActions, Thumbnail, Body } from './styled';

export default ({ project, title, description, image, links }: Zvyezda.Client.Models.ProjectProps) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  window.addEventListener('resize', () => {
    setScreenWidth(window.innerWidth);
  });

  return (
    <Project id={project}>
      {screenWidth > 750 && (
        <WideContainer>
          <Thumbnail>
            <img src={image} alt={image} />
          </Thumbnail>
          <div>
            <WideHeader>
              <h1>{title}</h1>
              <WideHeaderActions>{links}</WideHeaderActions>
            </WideHeader>
            <Body>
              {Array.isArray(description) ? (
                description.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{description}</p>
              )}
            </Body>
          </div>
        </WideContainer>
      )}

      {screenWidth < 750 && (
        <NarrowContainer>
          <Thumbnail>
            <img src={image} alt={image} />
          </Thumbnail>
          <div>
            <WideHeader>
              <h1>{title}</h1>
              <WideHeaderActions>{links}</WideHeaderActions>
            </WideHeader>
            <Body>
              {Array.isArray(description) ? (
                description.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{description}</p>
              )}
            </Body>
          </div>
        </NarrowContainer>
      )}
    </Project>
  );
};
