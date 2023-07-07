import { useState } from 'react';
import { FaImage, FaTrash } from 'react-icons/fa';
import { xbox_types, motherboard_types, nand_types, rgh_versions, glitch_chip_types } from '../../../data/xbox_hacking';
import { emitter } from '../../../lib/emitter';

import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextDivider,
} from '../../../components/contexts/StandardContext';

import IconInput from '../../../components/inputs/StandardInput';
import StandardButton from '../../../components/buttons/StandardButton';
import SubtleButton from '../../../components/buttons/SubtleButton';
import ComboInput from '../../../components/inputs/ComboInput';
import ButtonInput from '../../../components/inputs/ButtonInput';

export default () => {
  const [newXbox, setNewXbox] = useState<Zvyezda.Client.HackedConsole>({
    title: '',
    description: '',
    serialNumber: '',
    xboxType: null,
    xboxColour: '',
    motherboardType: null,
    nandSize: null,
    mfrDate: null,
    model: '',
    rghVersion: null,
    rghGlitchType: null,
  });
  const [hasImages, setHasImages] = useState(false);
  const [images, setImages] = useState<{ id: number; link: string }[]>(null);
  const [error, setError] = useState<string>(null);

  async function create() {
    setError(null);

    if (!newXbox.title) {
      setError('Title is required');
      return;
    }
    if (!newXbox.description) {
      setError('Description is required');
      return;
    }
    if (!newXbox.serialNumber) {
      setError('Serial Number is required');
      return;
    }
    if (!newXbox.xboxType) {
      setError('Xbox Type is required');
      return;
    }
    if (!newXbox.xboxColour) {
      setError('Xbox Colour is required');
      return;
    }
    if (!newXbox.motherboardType) {
      setError('Motherboard Type is required');
      return;
    }
    if (!newXbox.nandSize) {
      setError('Nand Size is required');
      return;
    }
    if (!newXbox.mfrDate) {
      setError('MFR Date is required');
      return;
    }
    if (!newXbox.model) {
      setError('Model is required');
      return;
    }
    if (!newXbox.rghVersion) {
      setError('RGH Version is required');
      return;
    }
    if (!newXbox.rghGlitchType) {
      setError('RGH Glitch Type is required');
      return;
    }

    const imagesArray: string[] = [];

    if (hasImages) {
      for (const image of images) {
        if (!image.link) {
          setError('All images must have a link');
          return;
        }
      }

      for (const image of images) {
        imagesArray.push(image.link);
      }
    }

    const r = await emitter.api('/xbox-hacking/create', true, {
      title: newXbox.title,
      description: newXbox.description,
      serialNumber: newXbox.serialNumber,
      xboxType: newXbox.xboxType,
      xboxColour: newXbox.xboxColour,
      motherboardType: newXbox.motherboardType,
      nandSize: newXbox.nandSize,
      mfrDate: newXbox.mfrDate,
      model: newXbox.model,
      rghVersion: newXbox.rghVersion,
      rghGlitchType: newXbox.rghGlitchType,
      images: imagesArray,
    });

    if (r.server.success === true) {
      window.location.href = '/dashboard';
    }
  }

  return (
    <StandardContext max="800px" wide>
      <StandardContextHeader>
        <h1>Create</h1>
      </StandardContextHeader>
      <StandardContextBody>
        <IconInput
          placeholder="Title"
          type="text"
          margin="5px 0"
          onChange={(e) => setNewXbox({ ...newXbox, title: e.target.value })}
          value={newXbox.title}
        />
        <IconInput
          placeholder="Description"
          type="text"
          margin="5px 0"
          onChange={(e) => setNewXbox({ ...newXbox, description: e.target.value })}
          value={newXbox.description}
        />
        <IconInput
          placeholder="Serial Number"
          type="text"
          onChange={(e) => setNewXbox({ ...newXbox, serialNumber: e.target.value })}
          value={newXbox.serialNumber}
        />
        <StandardContextDivider>
          <ComboInput
            placeholder="Xbox Type"
            options={xbox_types}
            margin="5px 0"
            onChange={(e) => setNewXbox({ ...newXbox, xboxType: e.target.value })}
            value={newXbox.xboxType}
          />
          <IconInput
            placeholder="Xbox Colour"
            type="text"
            margin="0 5px"
            onChange={(e) => setNewXbox({ ...newXbox, xboxColour: e.target.value })}
            value={newXbox.xboxColour}
          />
          <ComboInput
            placeholder="Motherboard Type"
            options={motherboard_types}
            margin="0 0"
            onChange={(e) => setNewXbox({ ...newXbox, motherboardType: e.target.value })}
            value={newXbox.motherboardType}
          />
        </StandardContextDivider>
        <StandardContextDivider>
          <ComboInput
            placeholder="Nand Size"
            options={nand_types}
            margin="0 0"
            onChange={(e) => setNewXbox({ ...newXbox, nandSize: e.target.value })}
            value={newXbox.nandSize}
          />
          <IconInput
            placeholder="MFR Date"
            type="date"
            margin="0 5px"
            icon={<p>MFR</p>}
            onChange={(e) => setNewXbox({ ...newXbox, mfrDate: new Date(e.target.value) })}
            value={newXbox.mfrDate !== null ? newXbox?.mfrDate.toISOString().split('T')[0] : null}
          />
          <IconInput
            placeholder="Model"
            type="text"
            margin="0 0"
            onChange={(e) => setNewXbox({ ...newXbox, model: e.target.value })}
            value={newXbox.model}
          />
        </StandardContextDivider>
        <StandardContextDivider>
          <ComboInput
            placeholder="RGH Version"
            options={rgh_versions}
            margin="5px 0"
            onChange={(e) => setNewXbox({ ...newXbox, rghVersion: e.target.value })}
            value={newXbox.rghVersion}
          />
          <ComboInput
            placeholder="RGH Glitch Type"
            options={glitch_chip_types}
            margin="5px 0 5px 5px"
            onChange={(e) => setNewXbox({ ...newXbox, rghGlitchType: e.target.value })}
            value={newXbox.rghGlitchType}
          />
        </StandardContextDivider>
        {!hasImages ? (
          <SubtleButton
            text="Add Images"
            margin="5px 0"
            onClick={() => {
              setHasImages(true);
              setImages([{ id: 0, link: '' }]);
            }}
          />
        ) : (
          <>
            {images?.length > 0 &&
              images?.map((image) => (
                <ButtonInput
                  placeholder="Link"
                  type="text"
                  margin="5px 0"
                  icon={<FaImage />}
                  onChange={(e) => {
                    setImages(
                      images.map((x) => {
                        if (x.id === image.id) {
                          return { ...x, link: e.target.value };
                        }
                        return x;
                      }),
                    );
                  }}
                  value={image.link}
                  buttons={[
                    {
                      icon: <FaTrash />,
                      onClick: () => {
                        setImages(images.filter((x) => x.id !== image.id));
                        if (images?.length === 1) {
                          setHasImages(false);
                          setImages(null);
                        }
                      },
                    },
                  ]}
                />
              ))}
            <SubtleButton
              text="Add"
              margin="5px 0"
              onClick={() => {
                setImages([...images, { id: images.length, link: '' }]);
              }}
            />
          </>
        )}
        <StandardButton text="Create" margin="5px 0" onClick={create} />
        {error && <p id="error">{error}</p>}
      </StandardContextBody>
    </StandardContext>
  );
};
