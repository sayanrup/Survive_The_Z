// Flavor events that can occur while traveling or scavenging (non-combat).
export const EVENTS = [
  {
    id: 'twisted_ankle',
    text: 'You stumble over rubble and twist your ankle.',
    effect: { stamina: -10 },
  },
  {
    id: 'found_cache',
    text: 'You spot a hidden cache tucked behind some debris.',
    effect: { bonusLoot: true },
  },
  {
    id: 'distant_howl',
    text: 'A distant howl echoes. You press on, nerves on edge.',
    effect: {},
  },
  {
    id: 'rainstorm',
    text: 'A sudden rainstorm soaks you to the bone, sapping your energy.',
    effect: { stamina: -5, thirst: 5 },
  },
  {
    id: 'quiet_moment',
    text: 'For a moment, everything is quiet. You catch your breath.',
    effect: { stamina: 5 },
  },
];

export function getRandomEvent() {
  return EVENTS[Math.floor(Math.random() * EVENTS.length)];
}
