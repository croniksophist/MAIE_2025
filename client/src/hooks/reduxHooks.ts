import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';

// Typed selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
