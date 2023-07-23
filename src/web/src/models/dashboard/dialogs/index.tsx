import YesNo from '../../../components/dialogs/YesNo';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { setDialogDeleteUser, setDashboardUsersRefresh } from '../../../reducers/global';
import { emitter } from '../../../lib/emitter';

export default () => {
  const state: Zvyezda.Client.Reducers.GlobalState = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  return (
    <>
      {state.dialogs.deleteUser.show === true && (
        <YesNo
          title={`Are you sure you want to delete ${state.dialogs.deleteUser?.username}?`}
          onYes={async () => {
            const r = await emitter.api('/account/delete', true, {
              userId: state.dialogs.deleteUser?.id,
            });

            if (r.server.success === true) {
              dispatch(
                setDialogDeleteUser({
                  show: false,
                }),
              );
              dispatch(setDashboardUsersRefresh(true));
            }
          }}
          onNo={() => {
            dispatch(
              setDialogDeleteUser({
                show: false,
              }),
            );
          }}
        />
      )}
    </>
  );
};
