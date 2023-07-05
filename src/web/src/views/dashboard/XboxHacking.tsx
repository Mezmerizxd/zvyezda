import { useEffect, useState } from 'react';
import { emitter } from '../../lib/emitter';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { xbox_types, motherboard_types, nand_types, rgh_versions, glitch_chip_types } from '../../data/xbox_hacking';
import { setDashboardXboxHackingRefresh } from '../../reducers/global';

import { Context } from './styled';
import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextDivider,
  StandardContextNotice,
} from '../../components/contexts/StandardContext';
import { FaImage, FaTrash } from 'react-icons/fa';

import IconInput from '../../components/inputs/StandardInput';
import StandardButton from '../../components/buttons/StandardButton';
import SubtleButton from '../../components/buttons/SubtleButton';
import ComboInput from '../../components/inputs/ComboInput';
import ButtonInput from '../../components/inputs/ButtonInput';
import ConsoleEditor from '../../models/consoleEditor';

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>(null);
  const [xbox, setXbox] = useState<Zvyezda.Client.HackedConsole>({
    title: '',
    description: '',
    serialNumber: '',
    xboxType: '',
    xboxColour: '',
    motherboardType: '',
    nandSize: '',
    mfrDate: null,
    model: '',
    rghVersion: '',
    rghGlitchType: '',
  });
  const [isAddingImages, setIsAddingImages] = useState<boolean>(false);
  const [images, setImages] = useState<{ id: number; link: string }[]>(null);
  const [consoles, setConsoles] = useState<Zvyezda.Client.HackedConsole[]>(null);

  useEffect(() => {
    dispatch(setDashboardXboxHackingRefresh(false));
    setTimeout(async () => {
      const r = await emitter.api('/xbox-hacking/get-consoles', true, null);
      if (r.server.success === true) {
        setConsoles(r.data.consoles);
      }
    });
  }, [state.dashboard.xboxHacking.refresh === true]);

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

    const imagesArray: string[] = [];

    if (isAddingImages) {
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
      images: imagesArray,
    });

    if (r.server.success === true) {
      window.location.href = '/dashboard';
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
            value={xbox.title}
          />
          <IconInput
            placeholder="Description"
            type="text"
            margin="5px 0"
            onChange={(e) => setXbox({ ...xbox, description: e.target.value })}
            value={xbox.description}
          />
          <IconInput
            placeholder="Serial Number"
            type="text"
            onChange={(e) => setXbox({ ...xbox, serialNumber: e.target.value })}
            value={xbox.serialNumber}
          />
          <StandardContextDivider>
            <ComboInput
              placeholder="Xbox Type"
              options={xbox_types}
              margin="5px 0"
              onChange={(e) => setXbox({ ...xbox, xboxType: e.target.value })}
              value={xbox.xboxType}
            />
            <IconInput
              placeholder="Xbox Colour"
              type="text"
              margin="0 5px"
              onChange={(e) => setXbox({ ...xbox, xboxColour: e.target.value })}
              value={xbox.xboxColour}
            />
            <ComboInput
              placeholder="Motherboard Type"
              options={motherboard_types}
              margin="0 0"
              onChange={(e) => setXbox({ ...xbox, motherboardType: e.target.value })}
              value={xbox.motherboardType}
            />
          </StandardContextDivider>
          <StandardContextDivider>
            <ComboInput
              placeholder="Nand Size"
              options={nand_types}
              margin="0 0"
              onChange={(e) => setXbox({ ...xbox, nandSize: e.target.value })}
              value={xbox.nandSize}
            />
            <IconInput
              placeholder="MFR Date"
              type="date"
              margin="0 5px"
              icon={<p>MFR</p>}
              onChange={(e) => setXbox({ ...xbox, mfrDate: new Date(e.target.value) })}
              value={xbox.mfrDate !== null ? xbox?.mfrDate.toISOString().split('T')[0] : null}
            />
            <IconInput
              placeholder="Model"
              type="text"
              margin="0 0"
              onChange={(e) => setXbox({ ...xbox, model: e.target.value })}
              value={xbox.model}
            />
          </StandardContextDivider>
          <StandardContextDivider>
            <ComboInput
              placeholder="RGH Version"
              options={rgh_versions}
              margin="5px 0"
              onChange={(e) => setXbox({ ...xbox, rghVersion: e.target.value })}
              value={xbox.rghVersion}
            />
            <ComboInput
              placeholder="RGH Glitch Type"
              options={glitch_chip_types}
              margin="5px 0 5px 5px"
              onChange={(e) => setXbox({ ...xbox, rghGlitchType: e.target.value })}
              value={xbox.rghGlitchType}
            />
          </StandardContextDivider>
          {!isAddingImages ? (
            <SubtleButton
              text="Add Images"
              margin="5px 0"
              onClick={() => {
                setIsAddingImages(true);
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
                            setIsAddingImages(false);
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
                      images: xbox.images ? xbox.images : null,
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
