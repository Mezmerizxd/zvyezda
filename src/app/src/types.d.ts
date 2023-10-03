type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

type GlobalState = {
  session: {
    connected: boolean;
    token: string;
    profile: Profile;
  };
};
