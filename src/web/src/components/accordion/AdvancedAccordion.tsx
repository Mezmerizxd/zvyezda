import { useState } from 'react';
import { AdvancedAccordion, AccordionBody, AdvancedHeader, AdvancedTitle, AdvancedButtons } from './styled';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

export default ({
  title,
  content,
  icon,
  margin,
  padding,
}: {
  title: string;
  content?: any;
  icon?: { open: any; closed: any };
  margin?: string;
  padding?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <AdvancedAccordion style={{ margin: margin, padding: padding }}>
      <AdvancedHeader onClick={() => setOpen(!open)}>
        <AdvancedTitle>{title}</AdvancedTitle>
        <AdvancedButtons>
          {icon ? open ? icon.open : icon.closed : open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </AdvancedButtons>
      </AdvancedHeader>
      {open && <AccordionBody>{content}</AccordionBody>}
    </AdvancedAccordion>
  );
};
