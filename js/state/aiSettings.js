// Settings for the AI Game Master, persisted separately from the game save
// so API keys never end up in exported save files.
const SETTINGS_KEY = 'survive_the_z_ai_settings';

export const AI_MODES = {
  CLASSIC: 'classic',
  SELECTED: 'selected',
  CUSTOM: 'custom',
  FREE_AUTO: 'free-auto',
};

export function defaultAiSettings() {
  return {
    mode: AI_MODES.CLASSIC,
    apiKey: '',
    model: 'google/gemini-2.5-flash-lite',
    customModel: '',
  };
}

export function loadAiSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultAiSettings();
    return { ...defaultAiSettings(), ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load AI settings:', err);
    return defaultAiSettings();
  }
}

export function saveAiSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save AI settings:', err);
  }
}
