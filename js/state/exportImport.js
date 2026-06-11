// Export/import the game save as a portable JSON file.
export function exportSaveToFile(state) {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);

  const a = document.createElement('a');
  a.href = url;
  a.download = `survive-the-z-save-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importSaveFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const state = JSON.parse(reader.result);
        if (!state || !state.player || !state.world) {
          reject(new Error('That file is not a valid Survive The Z save.'));
          return;
        }
        resolve(state);
      } catch (err) {
        reject(new Error('Could not parse save file.'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read save file.'));
    reader.readAsText(file);
  });
}
