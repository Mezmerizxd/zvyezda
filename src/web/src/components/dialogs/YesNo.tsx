import { Dialog, DialogHeader, DialogBody, DialogActions, YesNo } from './styled';

import StandardButton from '../buttons/StandardButton';

export default ({
  title,
  body,
  onYes,
  onNo,
}: {
  title: string;
  body?: string;
  onYes: () => void;
  onNo: () => void;
}) => {
  return (
    <Dialog onClick={() => onNo()}>
      <YesNo onClick={(e) => e.stopPropagation()}>
        <DialogHeader>{title}</DialogHeader>
        <DialogBody>{body}</DialogBody>
        <DialogActions>
          <button id="no" onClick={() => onNo()}>
            No
          </button>
          <button id="yes" onClick={() => onYes()}>
            Yes
          </button>
        </DialogActions>
      </YesNo>
    </Dialog>
  );
};
