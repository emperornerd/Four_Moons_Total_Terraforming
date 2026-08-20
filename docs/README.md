# Four Moons Total Terraforming
## A Galactic Fascism Simulator

Blovius Rex is a failed would-be fascist who lost the galactic election. Now he must claw his way back to power, break the institutions, cleanse the population, and sell everything to his friends.

### How to Play

1. Open `index.html` in a web browser
2. Read the intro on the title screen
3. Click "BEGIN THE ASCENSION"

### Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move Rex around the city |
| E / Space | Interact with buildings and NPCs |
| M | Toggle the minimap |
| P | Pause / open **STATS &amp; GOALS** (click any stat, or ? for what it does) |
| ? (Slash) | Toggle the help screen |
| Escape | Close menus |

### Tips

- Walk to buildings marked **ENTRY** and press E to take actions
- You get **6 Action Points (AP)** per day (tunable in `js/config.js`) — spend them wisely
- Walk near NPCs (colored circles with icons) for free quick interactions
- A golden arrow points toward the nearest building
- Some building actions cost **0 AP** — always check
- Events pop up randomly — you must respond. In random events, "Do Nothing" is almost always bad (it costs you a point or two). An AP-costing event response usually hits **bigger** (higher reward and/or cost/risk); a free 0-AP event *response* is smaller but not a bad pick.
- Legal bills pile up over time — settle them at the Courthouse. Paying off your own judgments costs **1 AP per visit** (whatever the amount), so it competes with your daily AP. Gargoyliani's bailout is just money.
- Leaving legal trouble unresolved invites consequences (and letting institutions recover makes them worse)
- Some actions are crimes and come with paperwork — the heavier the crime, the likelier it's noticed
- Gargoyliani's lawyers need settling too — the Courthouse handles his bills before he flips
- Military-spending moves cost real troops now — you need enough to pull them off
- Low on troops? The Military Base's **0-AP "Recruit 'Volunteers'"** (the $6 one) bumps military without costing AP
- **Keep your media up.** Lose the narrative and approval AND fear drain on a sliding scale — propaganda and the press will keep it in line (see MEDIA in `js/config.js`)
- Press **?** for the help page

### Danger

- Keep your **military at 10+** — while it's lower, each game-hour there's a chance
  the military overthrows you, and the chance rises sharply as it drops
  (≈2% at 9, 40% at 1, 50% at 0). The bar turns **red below 10**.
- **Fear** steers that risk: high fear keeps the army in line (up to −50%),
  low fear makes a coup more likely (up to +50%).
- Badly depleted military (<5) also triggers warning messages.

### Goal

Advance through 4 phases by meeting stat requirements:
- **Phase I** — Approval 50+ and Loyalty 35+
- **Phase II** — Institutions below 25
- **Phase III** — Population below 50
- **Phase IV** — Sell all 5 assets at the **Fire Sale Emporium** (left side of the map) and hit 500+ credits. The sales bank ~400 of it. The galaxy is a fire sale; everything must go.

### Credits

A satirical work of fiction. Any resemblance to real persons, living or sufficiently orange, is entirely intentional.
