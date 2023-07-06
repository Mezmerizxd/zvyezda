import { useState } from 'react';
import {
  Console,
  ConsoleHeader,
  ConsoleTitlebar,
  ConsoleBody,
  ConsoleBodyDivider,
  ConsoleHeaderControls,
} from './styled';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default ({ xbox }: { xbox: Zvyezda.Client.HackedConsole }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  return (
    <Console>
      {xbox?.images?.length > 0 && (
        <ConsoleHeader>
          <img src={xbox.images[selectedImage]} />
          <ConsoleHeaderControls>
            <div
              onClick={() => {
                if (selectedImage === 0) {
                  setSelectedImage(xbox.images.length - 1);
                } else {
                  setSelectedImage(selectedImage - 1);
                }
              }}
            >
              <FaArrowLeft />
            </div>
            <div
              onClick={() => {
                if (selectedImage === xbox.images.length - 1) {
                  setSelectedImage(0);
                } else {
                  setSelectedImage(selectedImage + 1);
                }
              }}
            >
              <FaArrowRight />
            </div>
          </ConsoleHeaderControls>
        </ConsoleHeader>
      )}
      <ConsoleTitlebar>
        <h1>{xbox.title}</h1>
        <p>{xbox.description}</p>
      </ConsoleTitlebar>
      <ConsoleBody>
        <ConsoleBodyDivider>
          <p>
            Xbox Type <span>{xbox.xboxType}</span>
          </p>
          <p>
            Xbox Colour <span>{xbox.xboxColour}</span>
          </p>
          <p>
            Motherboard Type <span>{xbox.motherboardType}</span>
          </p>
          <p>
            Serial Number <span>{xbox.serialNumber}</span>
          </p>
          <p>
            MFR Date{' '}
            <span>
              {new Date(xbox.mfrDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </p>
          <p>
            Model Number <span>{xbox.model}</span>
          </p>
        </ConsoleBodyDivider>
        <ConsoleBodyDivider>
          <p>
            Nand Size <span>{xbox.nandSize}</span>
          </p>
          <p>
            RGH Version <span>{xbox.rghVersion}</span>
          </p>
          <p>
            RGH Glitch Type <span>{xbox.rghGlitchType}</span>
          </p>
        </ConsoleBodyDivider>
      </ConsoleBody>
    </Console>
  );
};
