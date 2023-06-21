import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch: () => Zvyezda.Client.AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<Zvyezda.Client.RootState> = useSelector;
