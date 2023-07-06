import { useEffect, useState } from 'react';
import { ConsoleList, Hero, HeroContainer, HeroHeader } from './styled';
import { Body } from './styled';
import { emitter } from '../../lib/emitter';

import Console from '../../models/console';

export default () => {
  const [consoles, setConsoles] = useState<Zvyezda.Client.HackedConsole[]>([]);

  useEffect(() => {
    setTimeout(async () => {
      const r = await emitter.api('/xbox-hacking/get-public-consoles', false, null);
      if (r.server.success !== false) {
        for (const xbox of r.data.consoles) {
          setConsoles((c) => [...c, xbox]);
        }
      }
    });
  }, []);

  return (
    <Body>
      <title>Zvyezda - Xbox Hacking</title>
      <Hero style={{ height: '200px' }}>
        <HeroContainer>
          <HeroHeader>
            <h1>Xbox Hacking</h1>
          </HeroHeader>
        </HeroContainer>
      </Hero>

      <ConsoleList>
        {consoles.map((console, index) => (
          <Console key={index} xbox={console} />
        ))}
      </ConsoleList>
    </Body>
  );
};
