// Renders the People tab: survivors and NPCs encountered so far.
export function renderPeople(state) {
  const npcs = state.npcs || [];

  if (npcs.length === 0) {
    return `
      <h3>People</h3>
      <p class="empty">You haven't met anyone else yet. Keep exploring.</p>
    `;
  }

  const itemsHtml = npcs
    .map(
      (npc) => `
      <li class="npc-item">
        <div class="item-info">
          <span class="item-name">${npc.name}</span>
          <span class="item-qty">Day ${npc.firstSeenDay}</span>
        </div>
        <div class="item-desc">${npc.description}</div>
      </li>
    `
    )
    .join('');

  return `
    <h3>People</h3>
    <ul class="npc-list">${itemsHtml}</ul>
  `;
}
