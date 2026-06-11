// Renders the running event log, most recent message first.
export function renderLog(state) {
  const entries = state.log
    .slice(-20)
    .reverse()
    .map((msg) => `<li>${msg}</li>`)
    .join('');
  return `<h3>Log</h3><ul class="log-list">${entries}</ul>`;
}
