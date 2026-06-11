// Renders the Events tab: a "memory map" of key story moments.
export function renderEvents(state) {
  const events = state.events || [];

  if (events.length === 0) {
    return `
      <h3>Events</h3>
      <p class="empty">No key events recorded yet. Your story will be written here.</p>
    `;
  }

  const itemsHtml = events
    .slice()
    .reverse()
    .map(
      (ev) => `
      <li class="event-item">
        <span class="event-day">Day ${ev.day}</span>
        <span class="event-text">${ev.text}</span>
      </li>
    `
    )
    .join('');

  return `
    <h3>Events</h3>
    <ul class="event-list">${itemsHtml}</ul>
  `;
}
