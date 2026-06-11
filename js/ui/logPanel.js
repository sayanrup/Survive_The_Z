// Renders the running event log as a chat-style history, oldest first.
export function renderLog(state) {
  const entries = state.log.slice(-30);
  if (entries.length === 0) {
    return '<p class="empty">Your story will appear here.</p>';
  }

  return entries
    .map((msg) => {
      const isPlayerAction = msg.startsWith('> ');
      const text = isPlayerAction ? msg.slice(2) : msg;
      const role = isPlayerAction ? 'player' : 'narrator';
      return `<div class="chat-message ${role}"><div class="chat-bubble">${text}</div></div>`;
    })
    .join('');
}
