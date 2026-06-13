import type { AppState } from '../types';

const STORAGE_KEY = 'fixture-mundial-state';

/**
 * Guarda el estado completo en localStorage como JSON.
 * Si falla (por ejemplo, almacenamiento lleno), solo loguea
 * una advertencia sin romper la app.
 */
export function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    console.warn('Failed to save state to localStorage');
  }
}

/**
 * Restaura el estado desde localStorage.
 * Devuelve null si no hay datos guardados o si el JSON es inválido.
 */
export function loadState(): AppState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as AppState;
  } catch {
    console.warn('Failed to load state from localStorage');
    return null;
  }
}

