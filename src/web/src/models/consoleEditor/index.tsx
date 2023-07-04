import { useState } from 'react';
import { xbox_types, motherboard_types, nand_types, rgh_versions, glitch_chip_types } from '../../data/xbox_hacking';

import { ConsoleEditor } from './styled';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';

import { StandardContextDivider } from '../../components/contexts/StandardContext';

import IconInput from '../../components/inputs/StandardInput';
import StandardButton from '../../components/buttons/StandardButton';
import ComboInput from '../../components/inputs/ComboInput';
import AdvancedAccordion from '../../components/accordion/AdvancedAccordion';

export default ({ xbox, uuid }: { xbox: Zvyezda.Client.HackedConsole; uuid: string }) => {
  const [newXbox, setNewXbox] = useState<Zvyezda.Client.HackedConsole>(xbox);

  return (
    <ConsoleEditor id={uuid}>
      <AdvancedAccordion
        title={xbox.title}
        icon={{
          open: <AiFillEdit />,
          closed: <AiFillEdit />,
        }}
        content={
          <>
            <IconInput
              placeholder="Title"
              type="text"
              margin="5px 0"
              value={newXbox.title}
              onChange={(e) => setNewXbox({ ...newXbox, title: e.target.value })}
            />
            <IconInput
              placeholder="Description"
              type="text"
              margin="5px 0"
              value={newXbox.description}
              onChange={(e) => setNewXbox({ ...newXbox, description: e.target.value })}
            />
            <IconInput
              placeholder="Serial Number"
              type="text"
              value={newXbox.serialNumber}
              onChange={(e) => setNewXbox({ ...newXbox, serialNumber: e.target.value })}
            />
            <StandardContextDivider>
              <ComboInput
                placeholder="Xbox Type"
                options={xbox_types}
                margin="5px 0"
                value={newXbox.xboxType}
                onChange={(e) => setNewXbox({ ...newXbox, xboxType: e.target.value })}
              />
              <IconInput
                placeholder="Xbox Colour"
                type="text"
                margin="0 5px"
                value={newXbox.xboxColour}
                onChange={(e) => setNewXbox({ ...newXbox, xboxColour: e.target.value })}
              />
              <ComboInput
                placeholder="Motherboard Type"
                options={motherboard_types}
                margin="0 0"
                value={newXbox.motherboardType}
                onChange={(e) => setNewXbox({ ...newXbox, motherboardType: e.target.value })}
              />
            </StandardContextDivider>
            <StandardContextDivider>
              <ComboInput
                placeholder="Nand Size"
                options={nand_types}
                margin="0 0"
                value={newXbox.nandSize}
                onChange={(e) => setNewXbox({ ...newXbox, nandSize: e.target.value })}
              />
              <IconInput
                placeholder="MFR Date"
                type="date"
                margin="0 5px"
                value={newXbox.mfrDate.toISOString().split('T')[0].toString()}
                onChange={(e) => setNewXbox({ ...newXbox, mfrDate: new Date(e.target.value) })}
              />
              <IconInput
                placeholder="Model"
                type="text"
                margin="0 0"
                value={newXbox.model}
                onChange={(e) => setNewXbox({ ...newXbox, model: e.target.value })}
              />
            </StandardContextDivider>
            <StandardContextDivider>
              <ComboInput
                placeholder="RGH Version"
                options={rgh_versions}
                margin="5px 0"
                value={newXbox.rghVersion}
                onChange={(e) => setNewXbox({ ...newXbox, rghVersion: e.target.value })}
              />
              <ComboInput
                placeholder="RGH Glitch Type"
                options={glitch_chip_types}
                margin="5px 0 5px 5px"
                value={newXbox.rghGlitchType}
                onChange={(e) => setNewXbox({ ...newXbox, rghGlitchType: e.target.value })}
              />
            </StandardContextDivider>
            <StandardButton text="Edit" margin="5px 0" onClick={() => {}} />
          </>
        }
        margin="0 0 5px 0"
      />
    </ConsoleEditor>
  );
};
