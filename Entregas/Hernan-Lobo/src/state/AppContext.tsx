import { createContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState } from '../types';
import type { AppAction } from './actions';
import { appReducer } from './appReducer';
import { saveState, loadState } from './localStorage';
import { initialAppState } from '../data/initialData';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Intenta restaurar estado guardado; si no hay, usa los datos iniciales
  const saved = loadState();
  const initialState: AppState = saved ?? initialAppState;
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persiste automáticamente en localStorage cada vez que el estado cambia
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
