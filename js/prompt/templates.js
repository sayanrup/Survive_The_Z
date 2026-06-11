// Local narrative templates. Each entry returns a list of phrasing variants
// for a given situation; one is picked at random by api/aiClient.js.
// This is the seam where a live LLM-driven narrator can later replace
// (or augment) these static templates without changing calling code.
export const TEMPLATES = {
  combatStart: ({ enemyName }) => [
    `A ${enemyName} lurches into view, drawn by the noise.`,
    `You freeze as a ${enemyName} blocks your path.`,
    `Out of the shadows, a ${enemyName} comes for you.`,
  ],
  combatVictory: ({ enemyName }) => [
    `The ${enemyName} collapses and stops moving.`,
    `You finish off the ${enemyName} with a final blow.`,
    `The ${enemyName} drops, finally still.`,
  ],
  combatFleeSuccess: ({ enemyName }) => [
    `You break away from the ${enemyName} and put distance between you.`,
    `You slip past the ${enemyName} and run.`,
  ],
  combatFleeFail: ({ enemyName }) => [
    `You try to flee, but the ${enemyName} is too close.`,
    `Your escape attempt fails - the ${enemyName} blocks the way.`,
  ],
  travelArrive: ({ locationName }) => [
    `You make your way to ${locationName}.`,
    `After a tense walk, you arrive at ${locationName}.`,
    `You reach ${locationName}, senses on alert.`,
  ],
  scavengeFound: ({ itemName }) => [
    `You search the area and find ${itemName}.`,
    `Tucked behind some debris, you spot ${itemName}.`,
    `Your search pays off - you grab ${itemName}.`,
  ],
  scavengeNothing: () => [
    `You search the area but come up empty-handed.`,
    `Nothing useful here. You move on.`,
    `The area has already been picked clean.`,
  ],
  restAtCamp: () => [
    `You settle in at camp and rest through the night.`,
    `The camp is quiet. You take the chance to recover.`,
  ],
};

export function pickVariant(templateName, context = {}) {
  const generator = TEMPLATES[templateName];
  if (!generator) return '';
  const variants = generator(context);
  if (!variants || variants.length === 0) return '';
  const text = variants[Math.floor(Math.random() * variants.length)];
  const flavor = scenarioReminder(context.scenario);
  return flavor ? `${text} ${flavor}` : text;
}

// Occasionally weaves a line drawn from the active scenario's threats or
// unique mechanics into the narration, so storyline flavor (e.g. "Dead in
// the Mall") shows up even in offline/Classic narration.
function scenarioReminder(scenario) {
  if (!scenario) return '';
  const lines = [...(scenario.threats || []), ...(scenario.uniqueMechanics || [])];
  if (lines.length === 0) return '';
  if (Math.random() > 0.4) return '';
  const line = lines[Math.floor(Math.random() * lines.length)];
  return `You can't shake the thought: ${line.toLowerCase()}.`;
}
