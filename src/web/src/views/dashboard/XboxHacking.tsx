import { useEffect, useState } from 'react';
import { emitter } from '../../lib/emitter';
import { xbox_types, motherboard_types, nand_types, rgh_versions, glitch_chip_types } from '../../data/xbox_hacking';

import { Context } from './styled';
import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextDivider,
  StandardContextNotice,
} from '../../components/contexts/StandardContext';

import IconInput from '../../components/inputs/StandardInput';
import StandardButton from '../../components/buttons/StandardButton';
import ComboInput from '../../components/inputs/ComboInput';
import ConsoleEditor from '../../models/consoleEditor';

export default () => {
  const [update, setUpdate] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [xbox, setXbox] = useState<Zvyezda.Client.HackedConsole>({
    title: '',
    description: '',
    serialNumber: '',
    xboxType: '',
    xboxColour: '',
    motherboardType: '',
    nandSize: '',
    mfrDate: new Date(''),
    model: '',
    rghVersion: '',
    rghGlitchType: '',
  });
  const [consoles, setConsoles] = useState<Zvyezda.Client.HackedConsole[]>(null);

  useEffect(() => {
    setUpdate(false);
    setTimeout(async () => {
      const r = await emitter.api('/xbox-hacking/get-consoles', true, null);
      if (r.server.success === true) {
        setConsoles(r.data.consoles);
      }
    });
  }, [update === true]);

  async function create() {
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

    const r = await emitter.api('/xbox-hacking/create', true, {
      title: xbox.title,
      description: xbox.description,
      serialNumber: xbox.serialNumber,
      xboxType: xbox.xboxType,
      xboxColour: xbox.xboxColour,
      motherboardType: xbox.motherboardType,
      nandSize: xbox.nandSize,
      mfrDate: xbox.mfrDate,
      model: xbox.model,
      rghVersion: xbox.rghVersion,
      rghGlitchType: xbox.rghGlitchType,
    });

    if (r.server.success === true) {
      setXbox(null);
      setUpdate(true);
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
              onChange={(e) => setXbox({ ...xbox, mfrDate: new Date(e.target.value) })}
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

      <StandardContext max="800px" wide>
        <StandardContextHeader>
          <h1>Consoles</h1>
        </StandardContextHeader>
        {consoles && consoles?.length > 0 ? (
          <StandardContextBody>
            {consoles &&
              consoles.map((xbox) => {
                return (
                  <ConsoleEditor
                    xbox={{
                      title: xbox.title,
                      description: xbox.description,
                      serialNumber: xbox.serialNumber,
                      xboxType: xbox.xboxType,
                      xboxColour: xbox.xboxColour,
                      motherboardType: xbox.motherboardType,
                      nandSize: xbox.nandSize,
                      mfrDate: new Date(xbox.mfrDate),
                      model: xbox.model,
                      rghVersion: xbox.rghVersion,
                      rghGlitchType: xbox.rghGlitchType,
                    }}
                    uuid={xbox.id}
                  />
                );
              })}
          </StandardContextBody>
        ) : (
          <StandardContextNotice>No Consoles Found.</StandardContextNotice>
        )}
      </StandardContext>
    </Context>
  );
};
