// Renders information about the player's current location.
import { LOCATIONS } from '../data/locations.js';

export function renderLocation(state) {
  const loc = LOCATIONS[state.world.currentLocation];
  const tag = loc.safe
    ? '<span class="tag tag-safe">Safe Zone</span>'
    : `<span class="tag tag-danger">Danger Level ${loc.danger}</span>`;
  return `
    <h3>${loc.name} ${tag}</h3>
    <p>${loc.description}</p>
  `;
}
