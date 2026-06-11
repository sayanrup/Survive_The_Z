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

## AI Game Master

The "AI Game Master" panel lets you hand control over to a live LLM via
[OpenRouter](https://openrouter.ai/). Type any free-text action (e.g.
"search the kitchen for supplies" or "barricade the door") and the AI
narrates the outcome and can adjust your stats, inventory, location, and
XP accordingly.

Modes:

- **Classic (offline, no AI)** - default. No API key needed; the game
  uses the built-in local narrative templates only.
- **Pick a model (OpenRouter)** - choose from five preset models
  (Gemini 2.5 Flash Lite, Kimi K2, Qwen 2.5 72B Instruct, GPT-4o mini,
  DeepSeek V3), each shown with its per-million-token pricing.
- **Custom model / BYOK** - bring your own OpenRouter API key and enter
  any OpenRouter model ID (e.g. `anthropic/claude-3.5-haiku`).
- **Free OpenRouter models (auto)** - routes across several `:free`
  OpenRouter models with automatic fallback, at $0 cost.

An OpenRouter API key is required for all modes except Classic. The key
and model selection are stored only in your browser's localStorage
(`survive_the_z_ai_settings`), separate from your save file, so they are
never included when you export a save.

The panel also tracks cumulative token usage and an estimated USD cost
for the current playthrough (free-tier models always show $0).

## Save export / import

Use **Export Save** to download your current game state as a JSON file,
and **Import Save** to load a previously exported save. This is handy
for backing up progress or moving a save between browsers/devices.

## About me

I'm a product manager with 5+ years of experience, and this project is
"vibe coded" - built by describing what I wanted and iterating with an
AI coding assistant rather than writing the code by hand.

## Copyright

&copy; 2026 Sayan - an AI-enthusiastic PM
