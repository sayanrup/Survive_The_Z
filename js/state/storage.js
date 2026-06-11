// Persistence layer: save/load the game state to localStorage.
const SAVE_KEY = 'survive_the_z_save';

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save game:', err);
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to load game:', err);
    return null;
  }
}

export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
