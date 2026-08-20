// ============================================================
// GAME TUNING CONFIG
// Edit these values to rebalance pacing without touching game logic.
// Loaded before js/game.js and exposed as window.GAME_CONFIG.
// ============================================================
window.GAME_CONFIG = {

  // Action Points granted each day. Set to 4, 6, 10, etc. freely.
  AP_PER_DAY: 6,

  // Time speed multiplier. 1 = TWICE as fast as the original default
  // (original: 600 frames per game hour). Higher = faster, e.g.
  //   0.5 = original speed (600 f/hr)
  //   1   = 2x (300 f/hr)
  //   2   = 4x (150 f/hr)
  //   4   = 8x (75 f/hr)
  TIME_SPEED: 1,

  // Starting values for every stat (what the campaign begins with).
  STARTING: {
    credits: 100,
    approval: 25,
    fear: 15,
    loyalty: 30,
    military: 25,
    institutions: 90,
    population: 120,
    media: 30,
  },

  // Max value each stat clamps to (also drives the HUD bar scaling).
  // NOTE: Phase IV's win condition reads credits, so if you raise
  // credits here above 500 you should raise PHASE_GOALS[3].credits too.
  // (The win ALSO requires selling all Fire Sale Emporium assets — see
  // CARVE_UP_ASSETS in js/game.js. Keep PHASE_GOALS[3].credits at or
  // below STAT_MAXES.credits or the credit half of the win is impossible.)
  STAT_MAXES: {
    credits: 500,
    approval: 100,
    fear: 100,
    loyalty: 100,
    military: 50,
    institutions: 100,
    population: 150,
    media: 100,
  },

  // Progress thresholds for each phase. Advance triggers when the
  // listed stat crosses the listed value (>= for most, <= for the
  // institutions and population "break down" goals).
  PHASE_GOALS: {
    0: { approval: 50, loyalty: 35 },   // build support
    1: { institutions: 25 },            // break institutions BELOW this
    2: { population: 50 },              // reduce population BELOW this
    3: { credits: 500 },                // accumulate credits (win ALSO needs all assets sold)
  },

  // Lose / game-over conditions.
  LOSE: {
    bankruptcy: -150,        // credits at or below this = game over
    bankruptcyClamp: -200,   // lowest credits can clamp to
    approvalFearFloor: 20,   // approval<=0 only loses if fear below this
    legalOverload: 200,      // part of the legal game-over: when total owed exceeds credits + this...
    legalOverloadCount: 5,   // ...AND this many separate issues are open = game over
  },

  // Military overthrow danger. While military is below the danger zone,
  // each game-hour there is a chance the military overthrows you.
  MILITARY: {
    dangerZoneBelow: 10,     // 0% overthrow chance at/above this military value
    chanceAtDanger: 2,       // base %/hr at military 9 (just entering the zone)
    chanceAtMin: 40,         // base %/hr at military 1 ("never let it get to 1")
    chanceAtZero: 50,        // base %/hr at military 0 (max; NOT instant death)
    fearBaseline: null,      // null => STARTING.fear (15) treated as x1.0
    modifierCap: 0.5,        // fear multiplier clamp: 0.5x - 1.5x (max +/-50%)
    rollEveryHours: 1,       // roll cadence in game-hours
    warnBelow: 5,            // extra warning messages when military is below this
    warnEveryHours: 2,       // warning cadence in game-hours
    coupInPhase4: true,      // if true, the military can still overthrow you during Phase IV (the carve-up). Set false to make Phase IV a clean victory lap.
    messages: {
      warnLow: 'Your military is dangerously low. The troops are going to mutiny.',
      warnCritical: 'Your military is nearly non-existent. Overthrow is imminent.',
      overthrown: 'The military has had enough. They stormed the tower and dragged you out by your feet, still shouting about the size of your crowd. The four moons watched. So did everyone else. Total terraforming: FAILED.',
    },
  },

  // Daily upkeep (base cost and the thresholds that add to it). Subtracted
  // from credits at the end of every day via: cost = base + floor(military/div)
  // + (loyalty above floor)/div + (fear above floor)/div. Raising any of these
  // DIVISORS makes upkeep cheaper (needs more of the stat to add $1); lowering
  // them makes it more expensive.
  UPKEEP: {
    base: 5,             // flat daily cost, always subtracted
    militaryDiv: 5,      // adds floor(military/5) — each ~5 troops = +$1/day
    loyaltyFloor: 30,    // loyalty only adds cost when it's above this
    loyaltyDiv: 5,       // adds floor((loyalty-30)/5) when over the floor
    fearFloor: 40,       // fear only adds cost when it's above this
    fearDiv: 10,         // adds floor((fear-40)/10) when over the floor
  },

  // Gargoyliani's legal-exposure gauge.
  GARGOYLIANI: {
    max: 100,                // gauge capacity
    billRate: 0.3,           // fraction of credits spent added to his gauge
    flipFloor: 50,           // gauge % at which he starts considering flipping
    flipMaxChance: 95,       // per-day flip chance (%) when the gauge is full
    settleCap: 25,           // max $ paid per Courthouse defense-fund click
  },

  // Institutional regeneration. Suspended until Phase III, then institutions
  // slowly claw back toward 100 on a game-hour tick. A high institution count
  // makes legal trouble more frequent (see LEGAL.inst*), so letting it recover
  // is dangerous.
  INSTITUTIONS: {
    regenPerTick: 1,         // +institutions per tick
    regenEveryHours: 4,      // tick cadence in game-hours
    regenStartPhase: 2,      // regen begins in this phase (2 = Phase III)
    regenCap: 100,           // institutions stop regenerating at this value
  },

  // Media pressure. If your media control is low, the press runs wild and
  // both approval and fear slowly drain (the sliding scale). If it's high,
  // the narrative holds and approval is spared. Keep your media up.
  MEDIA: {
    tickEveryHours: 4,       // tick cadence in game-hours (aligns with the drift tick)
    bufferFloor: 30,         // media at/below this -> approval & fear drain
    bufferCeil: 65,          // media at/above this -> approval held / slight gain
    approvalDrain: 1,        // approval drained per low-media tick
    fearDrain: 1,            // fear drained per low-media tick
    approvalGain: 1,         // approval gained per high-media tick
  },

  // Player legal-exposure system.
  LEGAL: {
    noEventsDay1: true,          // suppress legal events entirely on day 1
    exposureMax: 250,            // $ total-owed cap the legal-exposure bar fills against
    dangerPct: 75,               // % of exposureMax at which the bar turns red (a display warning — the actual loss is LOSE.legalOverload)
    eventIntervalMin: 18000,     // base min frames between the legal-event scheduler rolls
    eventIntervalMax: 36000,     // base max frames between the legal-event scheduler rolls
    // NOTE on scheduling: these two are only the scheduler cadence. Whether a
    // scheduled roll actually FIRES a consequence also passes the frequency
    // gate (debt × institutions × phaseWeight × 0.5), so this is not a guarantee.
    // ~1 roll every 5-10 min at 60fps when you owe the law something.
    phaseWeight: [0.5, 0.5, 1, 1], // per-phase legal-event frequency multiplier (0=I,1=II,2=III,3=IV). Lower = gentler early game.
    upkeepPerSevPoint: 2,        // extra daily upkeep per outstanding severity point
    sevLow: 1,                   // severity point value: low
    sevMed: 2,                   // severity point value: med
    sevHigh: 3,                  // severity point value: high
    settleCap: 50,               // max $ paid per Courthouse own-judgment click
    // AP cost to pay off your OWN judgments at the Courthouse: a flat 1 AP per
    // click (regardless of $ amount — usually the $50 settleCap, or a lower
    // remaining balance). AP is the real limiter: you can appear in court as
    // many times a day as you're willing to spend AP. Set to 0 to make settling
    // free again. Gargoyliani's defense fund is money-only and unaffected.
    legalPayAtb: 1,
    // Institutions scale BOTH how often legal events fire and how severe they
    // are. There is a floor so wiping the courts never removes the dynamic.
    instFreqFloor: 0.5,          // xfrequency multiplier when institutions <= instCalmBelow
    instFreqMax: 4.0,            // xfrequency multiplier at institutions == 100
    instSeverityFloor: 0.8,      // xseverity multiplier when institutions <= instCalmBelow
    instSeverityMax: 2.0,        // xseverity multiplier at institutions == 100
    instCalmBelow: 25,           // institutions at/below this = calm floor (Phase II pass)
    // Per-consequence weight in the pool.
    eventWeights: {
      exposure: 1,               // approval + media hit
      seizure: 1,                // a chunk of credits vanishes
      ally: 1,                   // loyalty drop
      caseExpansion: 1,          // a new/higher-severity issue filed
      warrant: 1,                // rare — pushes toward the game-over threshold
    },
    // Crime-driven legal exposure. Certain actions (murder, deportation, etc.)
    // have a chance of being filed as a specific legal issue. Weights are per
    // severity of crime — heavier crimes are far more likely to be noticed.
    crimeSpawnChance: {
      murder: 0.85,              // silencing, public executions, raids
      deportation: 0.8,          // deporting/expelling dissidents
      suppression: 0.55,         // intimidating, vote suppression, cracking down
      swindling: 0.45,           // grifting, extortion, nationalization
      election: 0.6,             // election tampering, court packing
    },
    // Map each crime tag to the legal issue(s) it can surface. An open issue
    // for that tag blocks a second one (no duplicate stacking).
    crimeTemplates: {
      murder: ['Civil Rights Complaint','Incitement Charges','Obstruction of Justice'],
      deportation: ['Civil Rights Complaint','Incitement Charges'],
      suppression: ['Obstruction of Justice','Perjury Allegation'],
      swindling: ['Embezzlement Investigation','Bribery Indictment','Racketeering Probe','Tax Evasion Audit'],
      election: ['Campaign Finance Violation','Bribery Indictment'],
    },
  },


  // Random-event cadence (frames; frame-based so it does not scale
  // with TIME_SPEED). The game draws the next delay from this range.
  EVENT: {
    intervalMin: 2000,
    intervalMax: 4000,

    // "Do Nothing" — the 0-AP passive response every event exposes.
    // Doing nothing is always a net negative; spending AP is usually good.
    doNothing: {
      // Fallback label + penalty if an event omits its own doNothing block.
      defaultLabel: 'Do Nothing (0 AP)',
      defaultPenalty: { approval: -2, loyalty: -1 },
      // Which stat BUFFERS (softens) penalties on the keyed stat. Fear is the
      // master safety valve: a scared public doesn't fully turn on you.
      buffering: {
        approval: 'fear',
        fear: 'fear',
        loyalty: 'loyalty',
        military: 'military',
        population: 'fear',
        media: 'approval',
        institutions: 'approval',
      },
      // Range thresholds as fractions of STAT_MAXES for the buffer stat.
      rangeLow: 0.34,       // buffer at/below this = penalty worsens
      rangeHigh: 0.66,      // buffer at/above this = penalty softens
      // Penalty point adjustment. "point shift": at high buffer, penalty is
      // reduced by shiftHigh; at low buffer, penalty worsens by shiftLow.
      shiftHigh: 1,
      shiftLow: 1,
      // Optional per-authored "worsens when high" stats (rare, thematic only).
      // Populated via each event's doNothing.badAt and applied in applyDoNothing.
    },
  },

  // NPC density (spawned at start + drip-fed up to a cap).
  NPC: {
    startingCount: 46,
    maxCount: 60,
    // Per-type spawn cap. Key by NPC type; a type at its cap won't spawn
    // (neither at start nor via the drip-feed) until one of that type leaves.
    // Omit a type (or set null) for no cap. E.g. cap the spy at 1 and
    // oligarchs at 2.
    maxPerType: {
      'spy': 1,
      'oligarch': 2,
    },
  },

  // HUD "danger" flash thresholds — when a stat is at or below this,
  // its icon pulses red in the top bar.
  DANGER: {
    credits: -120,
    approval: 3,
    loyalty: 3,
    military: 10,
    population: 5,
  },

  // Stat metadata for the Stats & Goals window (opened by clicking a stat
  // or pressing P). `icon` and `label` are display names; `desc` explains what
  // the stat actually does in-game. Editable — refresh to see changes.
  STAT_INFO: {
    credits:       { icon:'t',  label:'Credits',      desc:'Your money. Spend it on actions, and the Fire Sale Emporium in Phase IV. Bankruptcy at -150 ends the game. Phase IV needs 500+ and every asset sold.' },
    approval:      { icon:'\u2665',label:'Approval',    desc:'Public support. The headline popularity stat; Phase I needs 50+. If it hits 0 while fear is low, you lose.' },
    fear:          { icon:'\u2620',label:'Fear',        desc:'Intimidation. Keeps the military and opposition in line and softens lose-conditions. Fades slowly, so remind them now and then.' },
    loyalty:       { icon:'\u2605',label:'Loyalty',     desc:'Inner-circle support. Phase I needs 35+. At 0, everyone abandons you — instant loss.' },
    military:      { icon:'\u2694',label:'Military',    desc:'Your troops. Below 10 there is a growing risk of a coup each game-hour; high fear lowers that risk. Some actions cost military.' },
    institutions:  { icon:'\u2696',label:'Institutions',desc:'Courts, press and law. Phase II needs you to break them to 25 or below. They regenerate slowly from Phase III onward; a high count invites more legal trouble.' },
    population:    { icon:'\uD83D\uDC65',label:'Population', desc:'Your citizens. Phase III needs you to reduce them below 50. They grow back slowly. At 0, nobody is left to rule.' },
    media:         { icon:'\uD83D\uDCFA',label:'Media',      desc:'Press control. Boosts approval when high; hurt by attacks and helped by bribes and propaganda.' },
  },
};