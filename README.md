# Survive The Z

A turn-based, browser-based zombie survival RPG. Scavenge for supplies,
craft gear, fight off the infected, and manage your hunger, thirst,
stamina, and health to stay alive as long as possible.

Built as vanilla HTML/CSS/JS (ES modules) with no build step or
dependencies.

## Running locally

Because the game uses ES modules, it needs to be served over HTTP (not
opened as a `file://` URL):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Project structure

```
index.html          Entry point / page shell
css/style.css        Styling
js/
  app.js             App bootstrap, event handling, game loop wiring
  state/             Game state shape, save/load (localStorage)
  data/              Static game data: items, recipes, locations, enemies, events
  core/              Game logic: survival, exploration, combat, crafting, inventory
  ui/                DOM rendering for each panel (stats, inventory, log, actions, location)
  api/                Narrative generation client
  prompt/            Local narrative templates
```

## Gameplay

- **Explore**: travel between locations on the map. Riskier areas have
  higher chances of zombie encounters but better loot.
- **Survive**: keep your hunger, thirst, and stamina up. Resting at the
  Survivor Camp restores stamina and health and advances to the next day.
- **Fight**: turn-based combat against walkers, runners, bloaters, and
  worse. Equip weapons and armor found in the world.
- **Scavenge & Craft**: find materials and combine them into bandages,
  improved weapons, and medical kits.

## Narrative generation

`js/api/aiClient.js` and `js/prompt/templates.js` provide a small,
swappable narration layer. Today it picks from local text templates so
the game runs fully offline. The `AI_CONFIG` object in `aiClient.js` is
a seam for later wiring up a live LLM API to generate dynamic narrative
text without changing any calling code.
