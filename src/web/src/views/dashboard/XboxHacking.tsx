import { useState } from 'react';
import { xbox_types, motherboard_types, nand_types, rgh_versions, glitch_chip_types } from '../../data/xbox_hacking';

import { Context } from './styled';
import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextDivider,
} from '../../components/contexts/StandardContext';

import IconInput from '../../components/inputs/StandardInput';
import StandardButton from '../../components/buttons/StandardButton';
import ComboInput from '../../components/inputs/ComboInput';

export default () => {
  const [error, setError] = useState<string>(null);
  const [xbox, setXbox] = useState<Zvyezda.Client.CreateHackedXbox>({
    title: '',
    description: '',
    serialNumber: '',
    xboxType: '',
    xboxColour: '',
    motherboardType: '',
    nandSize: '',
    mfrDate: '',
    model: '',
    rghVersion: '',
    rghGlitchType: '',
  });

  function create() {
    setError(null);

    if (!xbox.title) {
      setError('Title is required');
      return;
    }
    if (!xbox.description) {
      setError('Description is required');
      return;
    }
    if (!xbox.serialNumber) {
      setError('Serial Number is required');
      return;
    }
    if (!xbox.xboxType) {
      setError('Xbox Type is required');
      return;
    }
    if (!xbox.xboxColour) {
      setError('Xbox Colour is required');
      return;
    }
    if (!xbox.motherboardType) {
      setError('Motherboard Type is required');
      return;
    }
    if (!xbox.nandSize) {
      setError('Nand Size is required');
      return;
    }
    if (!xbox.mfrDate) {
      setError('MFR Date is required');
      return;
    }
    if (!xbox.model) {
      setError('Model is required');
      return;
    }
    if (!xbox.rghVersion) {
      setError('RGH Version is required');
      return;
    }
    if (!xbox.rghGlitchType) {
      setError('RGH Glitch Type is required');
      return;
    }
  }

  return (
    <Context>
      <StandardContext max="800px" wide>
        <StandardContextHeader>
          <h1>Create</h1>
        </StandardContextHeader>
        <StandardContextBody>
          <IconInput
            placeholder="Title"
            type="text"
            margin="5px 0"
            onChange={(e) => setXbox({ ...xbox, title: e.target.value })}
          />
          <IconInput
            placeholder="Description"
            type="text"
            margin="5px 0"
            onChange={(e) => setXbox({ ...xbox, description: e.target.value })}
          />
          <IconInput
            placeholder="Serial Number"
            type="text"
            onChange={(e) => setXbox({ ...xbox, serialNumber: e.target.value })}
          />
          <StandardContextDivider>
            <ComboInput
              placeholder="Xbox Type"
              options={xbox_types}
              margin="5px 0"
              onChange={(e) => setXbox({ ...xbox, xboxType: e.target.value })}
            />
            <IconInput
              placeholder="Xbox Colour"
              type="text"
              margin="0 5px"
              onChange={(e) => setXbox({ ...xbox, xboxColour: e.target.value })}
            />
            <ComboInput
              placeholder="Motherboard Type"
              options={motherboard_types}
              margin="0 0"
              onChange={(e) => setXbox({ ...xbox, motherboardType: e.target.value })}
            />
          </StandardContextDivider>
          <StandardContextDivider>
            <ComboInput
              placeholder="Nand Size"
              options={nand_types}
              margin="0 0"
              onChange={(e) => setXbox({ ...xbox, nandSize: e.target.value })}
            />
            <IconInput
              placeholder="MFR Date"
              type="date"
              margin="0 5px"
              onChange={(e) => setXbox({ ...xbox, mfrDate: e.target.value })}
            />
            <IconInput
              placeholder="Model"
              type="text"
              margin="0 0"
              onChange={(e) => setXbox({ ...xbox, model: e.target.value })}
            />
          </StandardContextDivider>
          <StandardContextDivider>
            <ComboInput
              placeholder="RGH Version"
              options={rgh_versions}
              margin="5px 0"
              onChange={(e) => setXbox({ ...xbox, rghVersion: e.target.value })}
            />
            <ComboInput
              placeholder="RGH Glitch Type"
              options={glitch_chip_types}
              margin="5px 0 5px 5px"
              onChange={(e) => setXbox({ ...xbox, rghGlitchType: e.target.value })}
            />
          </StandardContextDivider>
          <StandardButton text="Create" margin="5px 0" onClick={create} />
          {error && <p id="error">{error}</p>}
        </StandardContextBody>
      </StandardContext>
    </Context>
  );
};
