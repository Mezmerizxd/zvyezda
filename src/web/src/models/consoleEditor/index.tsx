import { useEffect, useState } from 'react';
import { emitter } from '../../lib/emitter';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { xbox_types, motherboard_types, nand_types, rgh_versions, glitch_chip_types } from '../../data/xbox_hacking';
import { setDashboardXboxHackingRefresh } from '../../reducers/global';

import { ConsoleEditor } from './styled';
import { AiFillEdit } from 'react-icons/ai';
import { FaImage, FaTrash } from 'react-icons/fa';

import { StandardContextDivider } from '../../components/contexts/StandardContext';

import IconInput from '../../components/inputs/StandardInput';
import StandardButton from '../../components/buttons/StandardButton';
import SubtleButton from '../../components/buttons/SubtleButton';
import ComboInput from '../../components/inputs/ComboInput';
import AdvancedAccordion from '../../components/accordion/AdvancedAccordion';
import ButtonInput from '../../components/inputs/ButtonInput';

export default ({ xbox, uuid }: { xbox: Zvyezda.Client.HackedConsole; uuid: string }) => {
  const dispatch = useAppDispatch();

  console.log(xbox);

  const [error, setError] = useState<string>(null);
  const [isAddingImages, setIsAddingImages] = useState<boolean>(xbox?.images !== null && xbox?.images?.length > 0);
  const [images, setImages] = useState<{ id: number; link: string }[]>(
    xbox?.images?.map((x, i) => ({ id: i, link: x })),
  );
  const [newXbox, setNewXbox] = useState<Zvyezda.Client.HackedConsole>(xbox);

  useEffect(() => {
    console.log(images);
  }, [images]);

  function checks(): boolean {
    setError(null);

    if (!xbox.title) {
      setError('Title is required');
      return false;
    }
    if (!xbox.description) {
      setError('Description is required');
      return false;
    }
    if (!xbox.serialNumber) {
      setError('Serial Number is required');
      return false;
    }
    if (!xbox.xboxType) {
      setError('Xbox Type is required');
      return false;
    }
    if (!xbox.xboxColour) {
      setError('Xbox Colour is required');
      return false;
    }
    if (!xbox.motherboardType) {
      setError('Motherboard Type is required');
      return false;
    }
    if (!xbox.nandSize) {
      setError('Nand Size is required');
      return false;
    }
    if (!xbox.mfrDate) {
      setError('MFR Date is required');
      return false;
    }
    if (!xbox.model) {
      setError('Model is required');
      return false;
    }
    if (!xbox.rghVersion) {
      setError('RGH Version is required');
      return false;
    }
    if (!xbox.rghGlitchType) {
      setError('RGH Glitch Type is required');
      return false;
    }

    if (isAddingImages) {
      for (const image of images) {
        if (!image.link) {
          setError('All images must have a link');
          return;
        }
      }
    }

    return true;
  }

  function edit() {
    if (!checks()) return;

    let newImages: string[] = null;
    if (isAddingImages) {
      newImages = images.map((x) => x.link);
    }

    emitter.api('/xbox-hacking/edit', true, {
      xbox: {
        id: uuid,
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
        images: newImages ? newImages : null,
      },
    });

    dispatch(setDashboardXboxHackingRefresh(true));
  }

  function del() {
    emitter.api('/xbox-hacking/delete', true, {
      id: uuid,
    });

    dispatch(setDashboardXboxHackingRefresh(true));
  }

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
                icon={<p>MFR</p>}
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

                            if (images.length === 1) {
                              setIsAddingImages(false);
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
            <StandardContextDivider>
              <StandardButton text="Edit" margin="5px 2.5px" onClick={edit} />
              <SubtleButton text="Delete" margin="5px 2.5px" onClick={del} />
            </StandardContextDivider>
          </>
        }
        margin="0 0 5px 0"
      />
    </ConsoleEditor>
  );
};
