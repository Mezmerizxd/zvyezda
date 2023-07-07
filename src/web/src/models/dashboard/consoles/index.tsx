import { useEffect, useState } from 'react';
import { emitter } from '../../../lib/emitter';
import { useAppSelector, useAppDispatch } from '../../../hooks/reduxHooks';
import { setDashboardXboxHackingRefresh } from '../../../reducers/global';

import {
  StandardContext,
  StandardContextHeader,
  StandardContextBody,
  StandardContextNotice,
} from '../../../components/contexts/StandardContext';

import ConsoleEditor from '../../../components/consoleEditor';

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
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

  return (
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
  );
};
