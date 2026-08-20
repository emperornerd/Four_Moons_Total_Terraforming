# Developer Guide — Four Moons Total Terraforming

## Project Structure

```
opencode draft 9/
├── index.html          # Main HTML shell (minimal — loads CSS / data / JS)
├── css/
│   └── style.css       # All game styles
├── js/
│   ├── config.js        # GAME TUNING — pacing/balance live here
│   ├── buildings.js     # Content: BUILDINGS, NPC_TYPES, CARVE_UP_ASSETS, REX_LOW_POINTS
│   ├── events_apply.js  # Content: EVENTS_APPLY (executable per-event effects)
│   ├── flavor_text.js   # Content: LEGAL_EVENT_TEXTS, GARGOYLE_FLIP_TEXTS, VICTORY_TEXTS, AMBIENT fallback
│   ├── render.js        # Render/engine: drawWorld, drawPlayer, map gen, particles, camera, minimap
│   ├── game.js          # Game logic (loop, systems, input, init)
│   └── touch.js         # Mobile/touch input (joystick, ACT button, touch HUD)
├── data/               # Editable data, loaded as scripts before game.js
│   ├── ambient.js      # Atmospheric toast messages (window.AMBIENT)
│   ├── fake_policies.js# Random fake policies (window.FAKE_POLICIES)
│   ├── greetings.js    # NPC greeting dialogue by type (window.GREETINGS)
│   └── events.js       # Event text/metadata (window.EVENTS_DATA)
├── archive/            # Older, stale data files (not loaded — kept for reference)
│   ├── ambient.json
│   ├── fake_policies.json
│   ├── greetings.json
│   └── events.json
├── img/
│   └── rex.jpg         # Player portrait
├── README.md           # Player-facing documentation
└── DEVELOPER.md        # This file
```

Data files are plain `.js` (not `.json`) so they load via `<script>` tags — this works both when
the page is opened directly (`file://`, no web server needed) and over HTTP. Each assigns a
global that `js/game.js` reads at startup via `buildRuntimeData()`.

**Load order matters.** Everything shares one global scope (no modules/bundler), so files must load
in dependency order. `index.html` loads: `config.js` → `data/*.js` → `js/buildings.js` →
`js/events_apply.js` → `js/flavor_text.js` → `js/render.js` → `js/game.js` → `js/touch.js`. `game.js` holds the logic;
the other `js/*.js` files assign the big content constants and render helpers (`BUILDINGS`,
`EVENTS_APPLY`, `VICTORY_TEXTS`, `drawWorld`, etc.) that `game.js` references at parse time and
calls at runtime.

## Editing Game Text

Editable player-facing text lives in `data/` as `.js` files (content is JSON-shaped). You can edit these without touching the game code, and there is no build step — refresh the page to see changes. The game reads the values at startup and falls back to in-code defaults if a data file is missing.

### data/ambient.js
Assigns `window.AMBIENT`, an array of strings. Atmospheric messages that appear randomly during gameplay.

### data/fake_policies.js
Assigns `window.FAKE_POLICIES`, an array of objects with `policy` and `result` fields. Used by the "Announce Fake Policy" event choice.

### data/greetings.js
Assigns `window.GREETINGS`, an object keyed by NPC type (`supporter`, `citizen`, `protester`, `reporter`, `judge`, `oligarch`, `general`, `goon`). Each value is an array of greeting strings.

### data/events.js
Assigns `window.EVENTS_DATA`, an array of event objects. Each entry has `slug`, `phase`, `title`, `desc`, an optional `doNothing` block, and a `choices` array. Each choice has `label`, `ap` (cost), `cost`, and `eff` (description). The **executable effects** (the `apply` functions that change stats and produce outcome text) live in `js/game.js` under `EVENTS_APPLY`, keyed by the same `slug` + choice index. At startup `buildRuntimeEvents()` merges the two into the runtime `EVENTS` array.

Every event exposes a **0-AP "Do Nothing"** response (auto-appended if a choice doesn't already offer one). This guarantees a player with no AP is never soft-locked and means every event demands a response. Doing nothing is always a net negative. The optional `doNothing` block tunes it per event:

```js
doNothing: {
  label: 'Do Nothing (0 AP)',        // optional; defaults to the config label
  flavor: 'You do nothing and the galaxy notices.',
  stats: { approval: -3, loyalty: -2 },   // base penalties (negative)
  badAt: { approval: 1 },            // rare: stat that WORSENS the penalty when high
}
```

The actual penalty applied to each stat is nudged by the player's current **buffer stat** (see `EVENT.doNothing` in config): high fear keeps a scared crowd from fully turning (so approval/fear penalties soften by a point); low buffer worsens it by a point. `badAt` is rare, thematic-only — a stat whose *high* value increases the penalty instead. Keep `doNothing` penalties modest (a point or two). This note is **specific to random events**: in these, "Do Nothing" is almost always bad (a net penalty), and AP-costing responses usually have a **bigger** impact. That shouldn't be read as "every 0-AP option in the game is bad" — free options outside random events (building/NPC actions, event *choices* that aren't "Do Nothing") are often perfectly good, smaller choices.

## Adding New Content

### New Events
1. Add an event to `data/events.js` (EVENTS_DATA) with a unique `slug`, `phase`, `title`, `desc`, and `choices` (each with `label`, `ap`, `eff`, and optional `cost`).
2. Add the matching apply effects to the `EVENTS_APPLY` object in `js/game.js`, under the same `slug`, giving one `s=>{...}` function per choice.
   - `phase`: array of phase indices where the event can appear (0=I, 1=II, 2=III, 3=IV)
   - `apply` function mutates the stats object `s` and returns a string shown to the player.
   - **Resource costs are enforced.** If an action lists a military/fear cost (e.g. `cost:'2 military'` or `cost:'3 fear, 2 military'`), the choice button is disabled unless you have that many military/fear, and the apply's own `s.military-=x` / `s.fear-=x` deducts it. Keep `cost` strings and the apply deduction in sync. Credit costs (`$N`) are NOT gated — you may overspend and rely on the bankruptcy lose condition.

### New Fake Policies
Add entries to `data/fake_policies.js` (window.FAKE_POLICIES). The in-code `FAKE_POLICIES` default is only a fallback and is replaced at startup when the data file is present.

### New NPC Types
Add the type to `data/greetings.js` (window.GREETINGS) and to the `NPC_TYPES` array in `js/game.js`. Greetings are loaded from `data/greetings.js` at startup; the `greet` arrays in `js/game.js` are fallbacks only.

Each NPC defines a `quickEff(s)` (free, always shown) and a `fullApply(s)` (costs `fullCost` AP) plus a `quickEff`/`fullEff` text description. If a generic (`fullApply`) NPC's full action costs money, add a `cost` field (e.g. `cost:'$8'`) so the button shows the price — money costs always display on action buttons (only AP and `$` are shown; military/fear/loyalty resource tokens are hidden). Alternatively, an NPC can define a `fullActions` **array** instead of a single `fullApply` — each entry `{label, ap, cost, eff, apply, legalExposure}` renders as its own gated AP-costing button, and the free quick-action label comes from `quickLabel` (falls back to the `fullEff` name). The **Real Scientist** (`real_scientist`) is the reference example: one free "Suppress Data" `quickEff` plus two `fullActions` ("Bribe", "Menace"). Effects must return the *actual* rolled value in the flavor text so the toast matches the metric that was changed. An optional `legalExposure` tag (see `LEGAL.crimeTemplates`) can file a legal issue when you take the full action. Note the Judge's quick action is intentionally randomized (slightly positive bias: ~50% good, ~30% neutral, ~20% a bit of institutional pushback) rather than a flat effect.

NPCs spawn procedurally from `NPC_TYPES` via the weighted `pickType()` helper (in `js/game.js`). Each type may carry an optional `weight` (default `1`); raise it to make that type show up more often. Greetings come from `data/greetings.js`. Current roster: supporter, citizen, protester, reporter, judge, oligarch, general, goon, plus the added **real_scientist** (free suppress / bribe / menace — see above for the multi-action layout), **scientist** (Quack Scientist — publishes fake papers), **spy** (fear/credits/institutions, legal), **influencer** (media/approval), and **unionboss** (credits/population, legal).

### New Buildings
Add a `BUILDINGS` entry in `js/game.js` with `x`,`y`,`w`,`h` (tiles), a `door`, `unlockPhase` (0-3), and an `actions` array. Map placement is manual — pick a tile region clear of other buildings. Gating, the golden arrow, and the "LOCKED until Phase X" label all work automatically from `unlockPhase`. The **Bureau of Tremendous Science** (`bureau`, unlockPhase 1, bottom-right) is the reference example; the **Fire Sale Emporium** (`firesale`, unlockPhase 3) shows one-time `once`/`asset` sales.

## Game Systems

### Tuning (js/config.js)

Everything below is controlled from `js/config.js` (`window.GAME_CONFIG`); no game-logic edits needed. If a key is missing, the game falls back to its default value.

- `AP_PER_DAY` — Action Points granted each day (default `6`). Set to `4`, `10`, etc. freely. All AP UI (HUD pips, panel readouts, day reset) reads this automatically.
- `TIME_SPEED` — Time speed multiplier where `1` = twice as fast as the original default. Lower = slower, higher = faster (`0.5` = original, `1` = 2x, `2` = 4x, ...). Backing formula: `FRAMES_PER_GAME_HOUR = round(600 / (TIME_SPEED*2))`.
- `STARTING` — starting value of every stat (credits, approval, fear, loyalty, military, institutions, population, media).
- `STAT_MAXES` — max each stat clamps to; also drives HUD bar scaling (single source of truth).
- `PHASE_GOALS` — per-phase progress thresholds (phase 0 = approval/loyalty, 1 = institutions, 2 = population, 3 = credits). Note: Phase IV (the Carve-Up) additionally requires selling **all** the Fire Sale Emporium assets before the win fires — see "Phase IV / The Carve-Up" below.
- `LOSE` — game-over thresholds (bankruptcy, fear floors, legal overload).
- `MILITARY` — the rolling military-overthrow danger. While `military < dangerZoneBelow` (10), each game-hour there is a chance the military overthrows you:
  - Base chance (pre-fear): `chanceAtDanger` (2%, at military 9) up to `chanceAtZero` (50%, at military 0), with `chanceAtMin` (40%) anchoring military 1. Interior values interpolate linearly. Military ≥ `dangerZoneBelow` is 0%.
  - **Fear modifier** multiplies the base chance, clamped to `[1-modifierCap, 1+modifierCap]` (±50%). `STARTING.fear` (15) is the `fearBaseline` = ×1.0. Higher fear lowers the chance (fear 25 ≈ ×0.9); lower fear raises it faster (fear 5 ≈ ×1.25). Military 0 is NOT instant death — just the max roll, every `rollEveryHours` game-hour.
  - When `1 <= military < warnBelow` (5), warning messages fire every `warnEveryHours` game-hours. `messages` holds the toast/log text.
  - `DANGER.military` (10) turns the HUD bar red below the danger zone.
  - `coupInPhase4` (default `true`) — whether the military can still overthrow you during Phase IV (the carve-up). Set `false` for a clean victory lap.
  - Recovery: the Military Base has a 0-AP, $6 "Recruit 'Volunteers'" action (+1-2 military) so you can rebuild between danger rolls without burning AP. Military-spending actions (e.g. Intimidate, Declare Emergency, event crackdowns) are gated on having enough military/fear (see New Events above).
- `UPKEEP` — daily upkeep base cost and the scaling thresholds.
- `GARGOYLIANI` — gauge capacity, bill-accrual rate (fraction of credits spent), and flip countdown range.
- `LEGAL.phaseWeight` — per-phase multiplier on how often passive legal events fire (array indexed by phase: 0=I, 1=II, 2=III, 3=IV). Default `[0.5, 0.5, 1, 1]` — legal consequences are gentler (half as likely to land) in the early phases so you can get started, and full pressure in Phases III/IV. Applied inside `fireLegalEvent()` to the existing frequency gate (debt × institution × phaseWeight × 0.5).
- `LEGAL.legalPayAtb` — AP cost per Courthouse click when paying off your OWN judgments. A flat **1 AP per visit** (regardless of the $ amount — usually the `$50` settleCap, or a lower remaining balance), so AP is the real limiter: you can appear in court as many times a day as you're willing to spend AP. Set to `0` to make settling free again. Gargoyliani's defense fund is money-only and unaffected.
- `EVENT` — random-event cadence in frames (intentionally does NOT scale with `TIME_SPEED`).
  - `EVENT.doNothing` — tuning for the 0-AP passive event response: `defaultPenalty`, `buffering` (which stat softens penalties on which), `rangeLow`/`rangeHigh` (buffer thresholds as fractions of `STAT_MAXES`), and `shiftHigh`/`shiftLow` (point adjustment). See "data/events.js" for per-event overrides.
- `NPC` — starting count, spawn cap, and optional `maxPerType` per-type spawn caps. `maxPerType` is an object keyed by NPC `type` mapping to the max number of that type alive at once (e.g. `{ 'spy': 1, 'oligarch': 2 }`). A type at its cap won't spawn (neither at start nor via the drip-feed) until one of that type leaves the map; omit a type (or set the value to `0`/`null`) for no cap. This is enforced in `pickUncappedType()` in `js/game.js`, which `initGame` and the game-loop drip-feed both use.
- `DANGER` — HUD "danger flash" thresholds per stat.
- `MEDIA` — media-pressure tuning (see "Media dynamics" below).

> Note: Phase IV's win trigger in `js/game.js` (`checkPhase`) requires **both** `PHASE_GOALS[3].credits` reached **and** every asset in the Fire Sale Emporium sold (`CARVE_UP_ASSETS`). Since `PHASE_GOALS[3].credits` and `STAT_MAXES.credits` are related (the win fires when credits clamp to the goal), keep the goal at or below the credits max.

### Phase IV — The Carve-Up

Phase IV is a comedic victory lap, not a grinding challenge. When it unlocks, a new building appears on the left side of the map:
- `The Fire Sale Emporium of Tremendous Bargains (Everything Must Go)` — a `BUILDINGS` entry with `unlockPhase: 3`, so it only shows up in Phase IV (existing `phase>=b.unlockPhase` gating handles it for free).
- Its actions are **one-time asset sales**: each has `once:true` and a unique `asset` key. Selling marks it in the persistent `soldAssets` set (NOT the daily `usedActions`, so it never resets). The button disables and shows **SOLD** afterward.
- The five sale `asset` keys live in the `CARVE_UP_ASSETS` array in `js/game.js` (`pentagon`, `moons`, `wall`, `oceans`, `letter`). To add/remove a sale, edit that array **and** the matching action's `asset` field — they must stay in sync or the win can never fire.
- Sales are 0 AP and mostly-payoff (the whole phase is the joke). Combined they bank ~$400 of the $500 win; the player supplies the rest from the credits they carried out of Phase III.
- `soldAssetCount()` / `allAssetsSold()` drive the live "Sold X/5 assets" readout in the Phase IV HUD goal line. `initGame()` resets `soldAssets={}` on a fresh run.
- **Winning** — the moment all assets are sold AND `S.credits >= PHASE_GOALS[3].credits`, `winGame()` fires a dedicated victory overlay (`#victory` in the DOM) that **stops the game** and pulls a random condemnatory closer from `VICTORY_TEXTS` (it's a satire — every ending rubs in how awful the player is). No more `phase++` past the array, no crash.

### Day Cycle
- Each game hour = `FRAMES_PER_GAME_HOUR` frames (~5 seconds at 60fps at the default `TIME_SPEED: 1`)
- Day runs from 8:00 to 22:00 (14 hours), and 14 hours elapse faster as `TIME_SPEED` rises
- AP resets at the start of each day
- Daily upkeep costs scale with institutions and military
- Periodic timers (stat drift, NPC spawns, ambient toasts) are expressed in game-hours, so they track the day cycle at any speed
- Institutions regenerate on a game-hour tick starting in **Phase III** (`INSTITUTIONS.regenStartPhase: 2`) — the purge phase — so breaking them isn't a permanent one-way street.

### Media Dynamics
Media is an active resource, not decoration. On a periodic tick (every `MEDIA.tickEveryHours` game-hours, default 4, aligned with the existing approval/fear drift tick), your **media control** steers the sliding scale:
- `S.media < MEDIA.bufferFloor` (30) → **approval and fear drain** (`MEDIA.approvalDrain` / `MEDIA.fearDrain`). The press runs wild; a drained fear also raises your coup-vulnerability.
- `S.media > MEDIA.bufferCeil` (65) → **approval is held** (and gains `MEDIA.approvalGain` per tick).
- Between the two, no media effect.
Keep media up by controlling the press (Media Tower actions, courting/vanquishing the Reporter NPC, select events). All values live in `MEDIA` in `js/config.js`.

### Events
- Fire randomly every `EVENT.intervalMin`-`EVENT.intervalMax` frames
- Deduplication: events won't repeat until all eligible events have fired
- Events are filtered by current phase

### Stats
| Stat | Starting | Max | Notes |
|------|----------|-----|-------|
| Credits | 100 | 500 | Goes negative — bankruptcy at -150 |
| Approval | 25 | 100 | Lose at 0 if fear < 20 |
| Fear | 15 | 100 | Modifies military-overthrow chance (see MILITARY tuning) |
| Loyalty | 30 | 100 | Lose at 0 |
| Military | 25 | 50 | Overthrow danger below 10 (see MILITARY tuning) |
| Institutions | 90 | 100 | Regenerates slowly |
| Population | 120 | 150 | Grows slowly, lose at 0 |
| Media | 30 | 100 | Low media drains approval & fear; high media holds them (see Media Dynamics) |

## Tech Stack
- Pure HTML5 Canvas (no frameworks)
- Vanilla JavaScript
- Google Fonts (Press Start 2P, VT323)
- Runs at 60fps via requestAnimationFrame

## Mobile / Touch Support (`js/touch.js`)

The game is keyboard-first, but the renderer is resolution-agnostic (canvases resize to the viewport), so a mobile layer is mostly additive:

- **Virtual joystick** — a fixed bottom-left pad (`#joystick` + `#joystick-knob`). Drags feed a normalized vector (`JOY.dx/dy`) exposed via `window.getJoyVector()`, which `updatePlayer()` in `js/game.js` reads in addition to the keyboard. Perfect 8-way movement (values are rounded to -1/0/1 like the keys).
- **ACT button** (`#interact-btn`) — the touch equivalent of `E`/Space. Game.js's `updatePrompt()` calls `window.setActTarget(target)` each frame to show/hide it and set its label; tapping it mirrors the E-key handler (opens building or NPC panel).
- **Touch HUD** (`#touch-hud`) — on-screen `P`, `?`, `M` shortcuts and a universal close (`✕`) button, replacing the keyboard-only toggles.
- **Gesture control** — `touch-action:none` on the canvas prevents page scroll/pinch on the game surface, but DOM overlays (log/help/stats) keep normal touch scrolling. Long-press context menu is suppressed.
- **Responsive layout** — `css/style.css` has `@media (max-width:820px)` / `@media (max-width:480px)` queries that reflow the HUD (stack, wrap, shrink), move the gauges off fixed right offsets, fit panels/overlays to the viewport, and enlarge tap targets.
- The touch UI is shown when `isTouchDevice` is true **or** the window is ≤820px wide (toggle `body.touch-mode`). Desktop keyboard play is completely unaffected.

