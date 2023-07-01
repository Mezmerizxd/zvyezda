import { xbox_types, motherboard_types, nand_types, rgh_versions, glitch_chip_types } from '../../data/xbox_hacking';

import { Context } from './styled';
import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextDivider,
} from '../../components/contexts/StandardContext';

import { MdTitle } from 'react-icons/md';
import { FaParagraph } from 'react-icons/fa';

import IconInput from '../../components/inputs/StandardInput';
import StandardButton from '../../components/buttons/StandardButton';
import ComboInput from '../../components/inputs/ComboInput';

export default () => {
  return (
    <Context>
      <StandardContext wide>
        <StandardContextHeader>
          <h1>Create</h1>
        </StandardContextHeader>
        <StandardContextBody>
          <IconInput placeholder="Title" type="text" margin="5px 0" />
          <IconInput placeholder="Description" type="text" margin="5px 0" />
          <IconInput placeholder="Serial Number" type="text" />
          <StandardContextDivider>
            <ComboInput placeholder="Xbox Type" options={xbox_types} margin="5px 0" />
            <IconInput placeholder="Xbox Colour" type="text" margin="0 5px" />
            <ComboInput placeholder="Motherboard Type" options={motherboard_types} margin="0 0" />
          </StandardContextDivider>
          <StandardContextDivider>
            <ComboInput placeholder="Nand Size" options={nand_types} margin="0 0" />
            <IconInput placeholder="MFR Date" type="date" margin="0 5px" />
            <IconInput placeholder="Model" type="text" margin="0 0" />
          </StandardContextDivider>
          <StandardContextDivider>
            <ComboInput placeholder="RGH Version" options={rgh_versions} margin="5px 0" />
            <ComboInput placeholder="RGH Glitch Type" options={glitch_chip_types} margin="5px 0 5px 5px" />
          </StandardContextDivider>
          <StandardButton text="Create" margin="5px 0" />
        </StandardContextBody>
      </StandardContext>
    </Context>
  );
};
