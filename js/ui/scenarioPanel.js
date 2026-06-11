// Renders the storyline selection grid shown on the pre-game scenario screen.
import { SCENARIOS } from '../data/scenarios.js';

const DIFFICULTY_TAG = {
  easy: 'tag-safe',
  medium: 'tag-warning',
  hard: 'tag-danger',
};

export function renderScenarioGrid(selectedId) {
  return SCENARIOS.map((s) => {
    const tagClass = DIFFICULTY_TAG[s.difficulty] || 'tag-warning';
    return `
      <div class="scenario-card ${selectedId === s.id ? 'selected' : ''}" data-action="select-scenario" data-scenario="${s.id}">
        <div class="scenario-icon">${s.icon}</div>
        <h3>${s.title}</h3>
        <p class="scenario-source">${s.source}</p>
        <p class="scenario-desc">${s.description}</p>
        <div class="scenario-tags">${s.tags.map((t) => `<span class="tag ${tagClass}">${t}</span>`).join('')}</div>
      </div>
    `;
  }).join('');
}
