/**
 * HOLLYWOOD RISING — Rivalry Engine ("War Room")
 *
 * Doctrine (same as every rebuilt system):
 *  - NO FAKE SIMULATION: rivals never act on render. They act when a real week
 *    advances (processRivalriesWeek) or when the player executes a real action.
 *  - EVERYTHING CONNECTED: rival power is generated relative to the player's
 *    REAL career (fame XP, fans, live social followers, best box office gross,
 *    awards won). Win odds are computed from those same numbers and shown to
 *    the player. Major events file real stories into the Hollywood Insider.
 *  - ENDLESS: 26x26 name banks x 6 role archetypes with tiered careers/causes.
 */

import { Player } from '../types/game';
import { EmpireFullState, RivalryNPC, RivalPower, RivalryLevel } from '../types/empire';
import { SocialsService } from './socialsService';
import { HollywoodInsiderService } from './hollywoodInsiderService';

// ---------------------------------------------------------------------------
// POOLS — endless combinatorial rival generation
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  'Xavier', 'Sienna', 'Devon', 'Camila', 'Maximilian', 'Aurora', 'Lucian', 'Priya',
  'Roman', 'Isabella', 'Kai', 'Seraphina', 'Dominic', 'Elena', 'Jaxon', 'Margot',
  'Apollo', 'Francesca', 'Rex', 'Nadia', 'Cassius', 'Bianca', 'Orion', 'Valentina',
  'Dante', 'Simone',
];

const LAST_NAMES = [
  'Vance', 'Sterling', 'Kincaid', 'Laurent', 'Thorne', 'Mercer', 'Blackwood', 'Vega',
  'Ashford', 'Cruz', 'Devereux', 'Marchetti', 'Holloway', 'Sinclair', 'Draven', 'Okonkwo',
  'Fairbanks', 'Marlowe', 'Castellano', 'Whitmore', 'Nova', 'Bardot', 'St. James', 'Renault',
  'Kessler', 'Delacroix',
];

const PORTRAITS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
];

type RivalRole = RivalryNPC['role'];

interface RoleArchetype {
  careers: string[]; // index 0-1 early tier, 2-3 mid, 4-5 elite
  causes: string[];
  strikes: string[]; // what they do when they hit back on a real week
}

const ROLE_ARCHETYPES: Record<RivalRole, RoleArchetype> = {
  Actor: {
    careers: ['Indie Scene Regular', 'Working TV Actor', 'Streaming Series Lead', 'Franchise Star', 'A-List Leading Man', 'Oscar-Winning Legend'],
    causes: [
      'you beat them to a career-defining lead role',
      'their agent pitched you the same franchise reboot',
      'a magazine ranked you above them on the "Next Big Thing" list',
      'they blame you for a recast after a table-read blowup',
    ],
    strikes: [
      'took a pointed jab at your acting range on a late-night couch',
      'signed the supporting role you were circling, purely out of spite',
      'told a podcast your last performance was "ambitious"',
      'walked out of an interview when your name came up',
    ],
  },
  Director: {
    careers: ['Short Film Festival Darling', 'Music Video Auteur', 'Mid-Budget Craftsman', 'Festival Prize Winner', 'Blockhouse Tentpole Director', 'Palme d\u2019Or Winner'],
    causes: [
      'you passed on their passion project for a studio paycheck',
      'they auditioned you twice and cast someone else',
      'your improvised line made their final cut \u2014 and the trailers',
      'a critic compared your screen presence unfavorably to their muse',
    ],
    strikes: [
      'described your process as "factory work" in a directors\u2019 roundtable',
      'cut your best scene to protect their favorite take',
      'told a festival Q&A they would "never" work with you',
      'posted a behind-the-scenes photo cropping you out of frame',
    ],
  },
  Producer: {
    careers: ['B-Movie Hustler', 'Reality TV Producer', 'Mid-Studio Producer', 'Franchise Producer', 'Independent Powerhouse', 'Multi-Oscar Producing Legend'],
    causes: [
      'you killed their package deal by demanding a rewrite',
      'they lowballed your quote and you walked',
      'a shared project\u2019s credit arbitration went your way',
      'they spread a rumor you were "difficult on set"',
    ],
    strikes: [
      'quietly buried your film\u2019s marketing budget in a spreadsheet',
      'attached a rival star to a script written for you',
      'told two studios you blow up schedules',
      'leaked your salary ask to a trade blog',
    ],
  },
  'Studio Executive': {
    careers: ['Development Assistant', 'Creative Executive', 'VP of Production', 'Senior VP of Production', 'Studio Chief', 'Legendary Studio Chief'],
    causes: [
      'you escalated a dispute over their cut of your film',
      'they shelved your labor-of-love project for tax reasons',
      'a streaming-window fight went public',
      'they renegotiated your deal worse after your last opening',
    ],
    strikes: [
      'moved your release date against a guaranteed rival opener',
      'pulled your film from 800 screens mid-run',
      'froze your project in "development" out of spite',
      'greenlit a competing script the same week as yours',
    ],
  },
  'Tech Billionaire': {
    careers: ['Startup Founder', 'Streaming Platform Founder', 'AI Studio Backer', 'Media Conglomerate Owner', 'Streaming Empire Founder', 'Trillion-Dollar Visionary'],
    causes: [
      'a bidding war for a studio lot got personal',
      'their algorithm buried your content after a keynote joke',
      'they poached your creative partner with a mega-deal',
      'a leaked email called you "legacy media"',
    ],
    strikes: [
      'tweaked the recommendation algorithm to bury your title art',
      'outbid your production company on a prized IP package',
      'joked about "actors of the past" at a product launch',
      'bought the theater chain hosting your premiere',
    ],
  },
  'Pop Star': {
    careers: ['Viral Sensation', 'Charting Artist', 'Arena Tour Headliner', 'Global Stadium Act', 'Billboard #1 Artist', 'Century-Defining Icon'],
    causes: [
      'you both claimed the same red-carpet endorsement',
      'their fans brigaded your movie\u2019s review scores',
      'a leaked DM made a collaboration impossible',
      'you got the Super Bowl slot they campaigned for',
    ],
    strikes: [
      'released a diss lyric with your name beeped but obvious',
      'wore a parody of your film\u2019s costume to the Met Gala',
      'had their fan army review-bomb your trailer',
      'posted (and deleted) a meme at your expense',
    ],
  },
};

const STRIKE_HEADLINES = [
  'TMZ: {R} escalates the feud \u2014 {detail}',
  'Page Six: {R} turns up the heat \u2014 {detail}',
  'PopCrave: {R} stirs the pot again \u2014 {detail}',
  'Variety: Tension rises as {R} {detail}',
];

const WIN_HEADLINES = [
  'Hollywood Reporter: {P} scores a decisive win over {R}!',
  'Deadline: {P} just won the room \u2014 {R} silent after defeat',
  ' Variety Exclusive: {P} takes the round against {R}',
  'Entertainment Tonight: {P} humbles {R} in their long-running feud',
];

const LOSS_HEADLINES = [
  'TMZ: Ouch \u2014 {P} takes the L as {R} wins the round',
  'Page Six: {R} gets the last laugh against {P}',
  'PopCrave: {P} stumbles \u2014 {R} claims victory this round',
  'Deadline: {R} walks away victorious against {P}',
];

// ---------------------------------------------------------------------------
// CORE HELPERS
// ---------------------------------------------------------------------------

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Player's REAL power block, live from the save file. */
export function getPlayerPower(player: Player, bestGross: number): RivalPower {
  let followers = 0;
  try {
    const soc = SocialsService.getState();
    followers = Object.values(soc?.followers || {}).reduce((a, b) => a + (b || 0), 0);
  } catch {
    followers = 0;
  }
  return {
    fame: Math.max(0, player.fameXp || 0),
    fans: Math.max(0, player.fans || 0),
    followers,
    boxOffice: Math.max(0, bestGross || 0),
    awards: Math.max(0, player.awardsWon || 0),
  };
}

const HEAT_BANDS: Array<{ min: number; level: RivalryLevel }> = [
  { min: 90, level: 'Legendary Rival' },
  { min: 70, level: 'Arch Rival' },
  { min: 50, level: 'Feud' },
  { min: 30, level: 'Rival' },
  { min: 15, level: 'Tension' },
  { min: 0, level: 'Calm' },
];

export function scoreToHeat(score: number): RivalryLevel {
  const s = Math.min(100, Math.max(0, Math.round(score)));
  for (const b of HEAT_BANDS) if (s >= b.min) return b.level;
  return 'Calm';
}

export function heatIndex(level: RivalryLevel): number {
  return HEAT_BANDS.findIndex((b) => b.level === level);
}

function clampOdds(o: number, lo = 0.15, hi = 0.85): number {
  return Math.min(hi, Math.max(lo, o));
}

function fmtM(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

function fmtN(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}

/** Career tier index (0-5) from the player's REAL fame XP. */
function careerTier(fameXp: number): number {
  if (fameXp >= 20000) return 5;
  if (fameXp >= 12000) return 4;
  if (fameXp >= 5000) return 3;
  if (fameXp >= 2000) return 2;
  if (fameXp >= 600) return 1;
  return 0;
}

// ---------------------------------------------------------------------------
// RIVAL SPAWNING — power locked relative to the player's real stats
// ---------------------------------------------------------------------------

function generateName(taken: Set<string>): { first: string; last: string } {
  for (let t = 0; t < 200; t++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    if (!taken.has(`${first} ${last}`)) return { first, last };
  }
  return { first: pick(FIRST_NAMES), last: `${pick(LAST_NAMES)} ${romanize(1 + Math.floor(Math.random() * 50))}` };
}

function romanize(n: number): string {
  const map: Array<[number, string]> = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  let v = n;
  for (const [val, sym] of map) while (v >= val) { out += sym; v -= val; }
  return out || 'I';
}

/**
 * Spawn a rival whose stats are locked to a competitive band around the
 * player's real numbers (0.6x - 1.5x). A nobody gets indie rivals; a legend
 * gets legends. The block is stored on the record and never re-rolled.
 */
export function spawnRival(player: Player, existing: RivalryNPC[], bestGross: number, provoked: boolean): RivalryNPC {
  const taken = new Set(existing.map((r) => r.name));
  const { first, last } = generateName(taken);
  const role = pick(Object.keys(ROLE_ARCHETYPES) as RivalRole[]);
  const arch = ROLE_ARCHETYPES[role];
  const tier = careerTier(player.fameXp || 0);
  // Career sits at the player's tier or one above — never a nobody fighting a god.
  const career = arch.careers[Math.min(arch.careers.length - 1, tier + (Math.random() < 0.35 ? 1 : 0))];

  const pp = getPlayerPower(player, bestGross);
  const scale = (v: number, lo: number, hi: number) => Math.max(1, Math.round(v * rand(lo, hi)));
  const power: RivalPower = {
    fame: scale(Math.max(pp.fame, 400), 0.6, 1.5),
    fans: scale(Math.max(pp.fans, 5000), 0.6, 1.5),
    followers: scale(Math.max(pp.followers, 3000), 0.6, 1.5),
    boxOffice: bestGross > 0 ? scale(bestGross, 0.6, 1.5) : Math.round(rand(2, 40) * 1_000_000),
    awards: Math.max(0, Math.round((pp.awards + (Math.random() < 0.5 ? 1 : 0)) * rand(0.5, 1.6))),
  };

  const startScore = provoked ? 40 : 35;
  const cause = pick(arch.causes);
  const hashtag = `#${first}${last.replace(/[^A-Za-z]/g, '')}Vs${(player.lastName || 'Player').replace(/[^A-Za-z]/g, '')}`;

  return {
    id: `rival_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: `${first} ${last}`,
    role,
    avatarUrl: pick(PORTRAITS),
    relationshipLevel: 'Tension',
    heatLevel: 'Tension',
    rivalryScore: startScore,
    cause,
    weekStarted: player.dateWeek,
    yearStarted: player.dateYear,
    career,
    moviesTogether: [],
    awardsCompared: { playerWon: 0, rivalWon: 0 },
    socialMediaActivity: {
      followersCount: power.followers,
      sentiment: provoked ? 'Aggressive' : 'Passive-Aggressive',
      trendingHashtag: hashtag,
    },
    timeline: [
      {
        id: `tl_${Date.now()}_0`,
        week: player.dateWeek,
        year: player.dateYear,
        eventText: provoked
          ? `You publicly challenged ${first} ${last} \u2014 feud sparked over ${cause}.`
          : `Feud sparked: ${first} ${last} (${career}) resents that ${cause}.`,
        category: 'General',
      },
    ],
    fansCount: power.fans,
    legalHistory: [],
    businessHistory: [],
    lastEventDescription: provoked
      ? `${first} ${last} accepted your public challenge on a Variety cover story.`
      : `${first} ${last} made subtle jabs on a podcast about your recent work.`,
    mediaHeadlines: [
      provoked
        ? `Variety Exclusive: ${first} ${last} accepts ${player.firstName} ${player.lastName}'s public challenge!`
        : `Hollywood Reporter: Tension brewing between ${first} ${last} and ${player.firstName} ${player.lastName}!`,
    ],
    directorSupport: 'Divided studio executives',
    studioReaction: 'Monitoring public sentiment',
    power,
    playerWins: 0,
    rivalWins: 0,
    draws: 0,
    nextStrikeWeek: (player.dateWeek || 1) + 3 + Math.floor(Math.random() * 3),
    lastEventWeek: player.dateWeek,
    resolved: false,
  };
}

/** Old-save migration: rivals created before the rebuild get a power block
 *  snapshotted from the player's CURRENT real stats. Runs once, then saved. */
export function ensureRivalPower(rival: RivalryNPC, player: Player, bestGross: number): RivalPower {
  if (rival.power) return rival.power;
  const pp = getPlayerPower(player, bestGross);
  const scale = (v: number, lo: number, hi: number) => Math.max(1, Math.round(v * rand(lo, hi)));
  const power: RivalPower = {
    fame: scale(Math.max(pp.fame, 400), 0.7, 1.3),
    fans: Math.max(rival.fansCount || 0, scale(Math.max(pp.fans, 5000), 0.7, 1.3)),
    followers: Math.max(rival.socialMediaActivity?.followersCount || 0, scale(Math.max(pp.followers, 3000), 0.7, 1.3)),
    boxOffice: bestGross > 0 ? scale(bestGross, 0.7, 1.3) : Math.round(rand(2, 40) * 1_000_000),
    awards: Math.max(rival.awardsCompared?.rivalWon || 0, Math.round(pp.awards * rand(0.6, 1.4))),
  };
  rival.power = power;
  return power;
}

// ---------------------------------------------------------------------------
// ACTIONS — resolved against real stats, odds shown to the player
// ---------------------------------------------------------------------------

export type RivalryActionType =
  | 'TRUCE_SUMMIT'
  | 'SOCIAL_CLAPBACK'
  | 'LEAKED_SCOOP'
  | 'AWARD_LOBBY'
  | 'BOX_OFFICE_SHOWDOWN'
  | 'CEASE_DESIST';

export interface RivalryActionMeta {
  type: RivalryActionType;
  emoji: string;
  label: string;
  cost: number;
  blurb: string;
  category: 'Peace' | 'Social Media' | 'Business' | 'Award' | 'Legal';
  /** null = no roll (guaranteed), otherwise 0..1 win probability. */
  accent: string; // tailwind accent classes for the card
}

export const RIVALRY_ACTIONS: RivalryActionMeta[] = [
  {
    type: 'SOCIAL_CLAPBACK',
    emoji: '\u{1F4F1}',
    label: 'Viral Clapback',
    cost: 15000,
    blurb: 'Win the internet for a week. Odds scale with your REAL total social followers vs theirs.',
    category: 'Social Media',
    accent: 'sky',
  },
  {
    type: 'BOX_OFFICE_SHOWDOWN',
    emoji: '\u{1F37F}',
    label: 'Box Office Showdown',
    cost: 100000,
    blurb: 'Head-to-head opening battle. Uses your best REAL worldwide gross vs their star power.',
    category: 'Business',
    accent: 'red',
  },
  {
    type: 'AWARD_LOBBY',
    emoji: '\u{1F3C5}',
    label: 'Awards Season Lobby',
    cost: 40000,
    blurb: 'Campaign the voters. Requires at least 1 real award won; critic reputation tips the scale.',
    category: 'Award',
    accent: 'amber',
  },
  {
    type: 'LEAKED_SCOOP',
    emoji: '\u{1F4F0}',
    label: 'Leaked Studio Memo',
    cost: 30000,
    blurb: 'Feed a damaging memo to the trades. Industry respect raises your odds \u2014 but leaks can backfire.',
    category: 'Business',
    accent: 'orange',
  },
  {
    type: 'CEASE_DESIST',
    emoji: '\u2696\uFE0F',
    label: 'Cease & Desist',
    cost: 75000,
    blurb: 'Elite trial attorneys, LA Superior Court. Big win potential, big heat, no takebacks.',
    category: 'Legal',
    accent: 'purple',
  },
  {
    type: 'TRUCE_SUMMIT',
    emoji: '\u{1F91D}',
    label: 'Chateau Marmont Truce',
    cost: 50000,
    blurb: 'Confidential dinner to de-escalate. Only after the feud has simmered 4+ weeks. Always cools heat.',
    category: 'Peace',
    accent: 'emerald',
  },
];

export function getActionMeta(type: RivalryActionType): RivalryActionMeta {
  return RIVALRY_ACTIONS.find((a) => a.type === type) || RIVALRY_ACTIONS[0];
}

/**
 * Win odds (0..1) for every action, from the player's REAL stat block vs the
 * rival's locked power. Displayed live in the UI \u2014 nothing hidden.
 */
export function computeActionOdds(
  playerPower: RivalPower,
  rivalPower: RivalPower,
  type: RivalryActionType,
  extra: { criticRep?: number; industryRespect?: number; netWorth?: number }
): number {
  switch (type) {
    case 'SOCIAL_CLAPBACK':
      return clampOdds(playerPower.followers / (playerPower.followers + rivalPower.followers + 1));
    case 'BOX_OFFICE_SHOWDOWN':
      return clampOdds(playerPower.boxOffice / (playerPower.boxOffice + rivalPower.boxOffice + 1));
    case 'AWARD_LOBBY': {
      const awardEdge = 0.5 + 0.07 * (playerPower.awards - rivalPower.awards) + 0.003 * ((extra.criticRep ?? 50) - 50);
      return clampOdds(awardEdge);
    }
    case 'LEAKED_SCOOP':
      return clampOdds(0.52 + 0.004 * ((extra.industryRespect ?? 50) - 50), 0.25, 0.8);
    case 'CEASE_DESIST':
      return clampOdds(0.58 + 0.003 * ((extra.industryRespect ?? 50) - 50) + 0.00000002 * (extra.netWorth || 0), 0.4, 0.85);
    case 'TRUCE_SUMMIT':
      return 1; // guaranteed, gated by feud age instead
  }
}

/** Why an action can't run right now (cooldown / missing real prerequisites). */
export function getActionLock(
  rival: RivalryNPC,
  type: RivalryActionType,
  playerPower: RivalPower,
  currentWeek: number
): string | null {
  if (rival.resolved) return 'Feud resolved';
  if ((rival.cooldownUntilWeek || 0) > currentWeek) return `Cooling down until W${rival.cooldownUntilWeek}`;
  const age = currentWeek - (rival.weekStarted || currentWeek);
  if (type === 'TRUCE_SUMMIT') {
    if (age < 4) return `Needs feud age 4+ wks (now ${age})`;
    if ((rival.rivalryScore || 0) < 15) return 'Feud already cold';
  }
  if (type === 'BOX_OFFICE_SHOWDOWN' && playerPower.boxOffice <= 0) return 'Release a movie first';
  if (type === 'AWARD_LOBBY' && playerPower.awards < 1) return 'Win an award first';
  return null;
}

export interface RivalryActionResult {
  ok: boolean;
  message: string;
  state: EmpireFullState;
  fansDelta: number;
  fameXpDelta: number;
  repDelta: number;
}

function headline(template: string, player: Player, rival: RivalryNPC): string {
  return template.replace('{P}', `${player.firstName} ${player.lastName}`).replace('{R}', rival.name);
}

function fileInsiderStory(
  player: Player,
  rival: RivalryNPC,
  category: Parameters<typeof HollywoodInsiderService.fileStory>[0]['category'],
  headlineText: string,
  sub: string,
  source: string
): void {
  try {
    HollywoodInsiderService.fileStory({
      category,
      headline: headlineText,
      sub,
      source,
      entities: { actorName: rival.name, studioName: undefined, movieTitle: undefined, grossAmount: undefined },
      week: player.dateWeek,
      year: player.dateYear,
      breaking: true,
    });
  } catch {
    // Insider is a bonus layer \u2014 never break the rivalry action on it
  }
}

/** Fame XP reward, heat-weighted and slow-burn by design. */
function fameReward(action: RivalryActionType, rival: RivalryNPC): number {
  const base: Record<RivalryActionType, number> = {
    SOCIAL_CLAPBACK: 60,
    LEAKED_SCOOP: 90,
    AWARD_LOBBY: 130,
    BOX_OFFICE_SHOWDOWN: 220,
    CEASE_DESIST: 170,
    TRUCE_SUMMIT: 30,
  };
  const hi = heatIndex(rival.heatLevel);
  const mult = 0.6 + 0.2 * Math.max(0, hi); // Tension 0.6x \u2192 Legendary 1.6x
  return Math.round(base[action] * mult * rand(0.85, 1.2));
}

function fanGain(player: Player, rival: RivalryNPC): number {
  const base = player.fans > 0 ? Math.round(player.fans * rand(0.015, 0.03)) : Math.round(rand(200, 600));
  const hi = heatIndex(rival.heatLevel);
  return Math.max(base, Math.round(base * (0.7 + 0.15 * Math.max(0, hi))));
}

/**
 * Execute a strategic action against a rival. All costs are real money, all
 * outcomes roll against odds computed from real stats, and every result writes
 * a permanent timeline event + trade headline.
 */
export function executeRivalryAction(
  state: EmpireFullState,
  player: Player,
  rivalId: string,
  type: RivalryActionType,
  bestGross: number
): RivalryActionResult {
  const rival = state.rivalries.find((r) => r.id === rivalId);
  if (!rival) return { ok: false, message: 'Rival not found.', state, fansDelta: 0, fameXpDelta: 0, repDelta: 0 };

  const meta = getActionMeta(type);
  const pp = getPlayerPower(player, bestGross);
  const rp = ensureRivalPower(rival, player, bestGross);

  if (player.money < meta.cost) {
    return { ok: false, message: `Insufficient funds \u2014 ${meta.label} costs ${fmtM(meta.cost)}.`, state, fansDelta: 0, fameXpDelta: 0, repDelta: 0 };
  }
  const lock = getActionLock(rival, type, pp, player.dateWeek);
  if (lock) {
    return { ok: false, message: `${meta.label} locked: ${lock}.`, state, fansDelta: 0, fameXpDelta: 0, repDelta: 0 };
  }

  player.money -= meta.cost;
  const next: EmpireFullState = { ...state, rivalries: state.rivalries.map((r) => (r.id === rivalId ? { ...r } : r)) };
  const rv = next.rivalries.find((r) => r.id === rivalId)!;

  let fansDelta = 0;
  let fameXpDelta = 0;
  let repDelta = 0;
  let eventText = '';
  let headlineText = '';
  let resultLabel = '';

  if (type === 'TRUCE_SUMMIT') {
    const prev = rv.rivalryScore || 0;
    rv.rivalryScore = Math.max(0, prev - 20 - Math.floor(Math.random() * 8));
    rv.heatLevel = scoreToHeat(rv.rivalryScore);
    rv.relationshipLevel = rv.heatLevel;
    rv.peaceProposed = true;
    fameXpDelta = fameReward(type, rv);
    eventText = `Hosted a private peace summit at Chateau Marmont with ${rv.name}. Public truce declared.`;
    headlineText = headline('TMZ: {P} and {R} spotted sharing a peace toast at Chateau Marmont', player, rv);
    resultLabel = `\u{1F91D} TRUCE HOLDING \u2014 heat down ${prev - rv.rivalryScore} points. +${fameXpDelta} Fame XP for classing it up.`;
    if (rv.rivalryScore <= 5) {
      rv.resolved = true;
      rv.resolution = 'Peace brokered at Chateau Marmont.';
      resultLabel += ' The feud is RESOLVED.';
    }
  } else {
    const odds = computeActionOdds(pp, rp, type, {
      criticRep: player.criticReputation,
      industryRespect: player.industryRespect,
      netWorth: player.netWorth,
    });
    const roll = Math.random();
    const isDraw = (type === 'BOX_OFFICE_SHOWDOWN' || type === 'SOCIAL_CLAPBACK') && Math.abs(odds - 0.5) < 0.04 && roll < 0.3;
    const won = !isDraw && roll < odds;

    if (type === 'SOCIAL_CLAPBACK') {
      if (isDraw) {
        rv.draws = (rv.draws || 0) + 1;
        eventText = `Clapback war with ${rv.name} ended in a draw \u2014 both posts trended, nobody blinked.`;
        headlineText = headline('PopCrave: {P} vs {R} \u2014 the internet calls it a draw', player, rv);
        resultLabel = '\u{1F937} DRAW \u2014 trended together, no winner. Heat holds.';
      } else if (won) {
        rv.playerWins = (rv.playerWins || 0) + 1;
        fansDelta = fanGain(player, rv);
        fameXpDelta = fameReward(type, rv);
        eventText = `Posted a viral clapback that flattened ${rv.name} \u2014 ${fmtN(fansDelta)} new fans poured in.`;
        headlineText = headline(pick(WIN_HEADLINES), player, rv);
        resultLabel = `\u{1F525} YOU WON THE INTERNET \u2014 +${fmtN(fansDelta)} fans, +${fameXpDelta} Fame XP.`;
        fileInsiderStory(player, rv, 'Social Media', headlineText, `${player.firstName} ${player.lastName}'s post out-performed ${rv.name}'s across every platform metric.`, 'Rivalry action: Viral Clapback');
      } else {
        rv.rivalWins = (rv.rivalWins || 0) + 1;
        repDelta = -1;
        eventText = `Your clapback against ${rv.name} flopped \u2014 ratio\u2019d within the hour.`;
        headlineText = headline(pick(LOSS_HEADLINES), player, rv);
        resultLabel = '\u{1F62A} OUT-CLAPPED \u2014 ratio\u2019d hard. Reputation -1.';
      }
    } else if (type === 'BOX_OFFICE_SHOWDOWN') {
      const yourGross = pp.boxOffice;
      const theirGross = Math.round(rp.boxOffice * rand(0.85, 1.15));
      if (isDraw) {
        rv.draws = (rv.draws || 0) + 1;
        eventText = `Showdown with ${rv.name} ended in a photo finish: ${fmtM(yourGross)} vs ${fmtM(theirGross)}.`;
        headlineText = headline('Box Office: Photo finish \u2014 {P} and {R} split the weekend', player, rv);
        resultLabel = `\u{1F396}\uFE0F DEAD HEAT \u2014 ${fmtM(yourGross)} vs ${fmtM(theirGross)}. Both camps claim victory.`;
      } else if (won) {
        rv.playerWins = (rv.playerWins || 0) + 1;
        fansDelta = fanGain(player, rv);
        fameXpDelta = fameReward(type, rv);
        repDelta = 1;
        eventText = `Box office showdown WON: your ${fmtM(yourGross)} beat ${rv.name}'s ${fmtM(theirGross)} opening.`;
        headlineText = headline('Hollywood Reporter: BOX OFFICE WAR \u2014 {P} destroys {R} head-to-head!', player, rv);
        resultLabel = `\u{1F3AF} SHOWDOWN WON \u2014 ${fmtM(yourGross)} vs ${fmtM(theirGross)}. +${fmtN(fansDelta)} fans, +${fameXpDelta} XP, +1 rep.`;
        fileInsiderStory(player, rv, 'Box Office', headlineText, `${fmtM(yourGross)} against ${fmtM(theirGross)} \u2014 analysts call it a career-defining weekend for ${player.lastName}.`, 'Rivalry action: Box Office Showdown');
      } else {
        rv.rivalWins = (rv.rivalWins || 0) + 1;
        repDelta = -2;
        eventText = `Box office showdown LOST: ${rv.name}'s ${fmtM(theirGross)} out-grossed your ${fmtM(yourGross)}.`;
        headlineText = headline('Box Office: {R} wins the weekend war against {P}', player, rv);
        resultLabel = `\u{1F480} SHOWDOWN LOST \u2014 ${fmtM(theirGross)} vs ${fmtM(yourGross)}. Reputation -2. Fans are asking questions.`;
        fileInsiderStory(player, rv, 'Box Office', headlineText, `${rv.name}'s ${fmtM(theirGross)} opening dwarfed ${player.lastName}'s ${fmtM(yourGross)} in the head-to-head.`, 'Rivalry action: Box Office Showdown');
      }
    } else if (type === 'AWARD_LOBBY') {
      if (won) {
        rv.playerWins = (rv.playerWins || 0) + 1;
        fameXpDelta = fameReward(type, rv);
        repDelta = 1;
        eventText = `Awards season lobby paid off \u2014 voters sided with you over ${rv.name} at the reception circuit.`;
        headlineText = headline('Variety: Awards voters side with {P} as {R} campaign crumbles', player, rv);
        resultLabel = `\u{1F3C6} LOBBY WON \u2014 +${fameXpDelta} Fame XP, +1 reputation.`;
        fileInsiderStory(player, rv, 'Awards', headlineText, `The reception circuit whispered, and the whispering favored ${player.lastName}.`, 'Rivalry action: Awards Season Lobby');
      } else {
        rv.rivalWins = (rv.rivalWins || 0) + 1;
        repDelta = -1;
        eventText = `Awards lobby backfired \u2014 ${rv.name} charmed the voters\u2019 brunch circuit instead.`;
        headlineText = headline('Variety: {R} sweeps the voters\u2019 brunch as {P} lobby stalls', player, rv);
        resultLabel = '\u{1F3C5}\u200D\u{1F3AB} OUT-LOBBIED \u2014 reputation -1.';
      }
    } else if (type === 'LEAKED_SCOOP') {
      if (won) {
        rv.playerWins = (rv.playerWins || 0) + 1;
        fameXpDelta = fameReward(type, rv);
        eventText = `Leaked a studio memo exposing ${rv.name}'s on-set friction \u2014 trades ran it front page.`;
        headlineText = headline('Deadline Exclusive: Leaked memo reveals studio friction involving {R}!', player, rv);
        resultLabel = `\u{1F4F0} SCOOP LANDED \u2014 +${fameXpDelta} Fame XP. ${rv.name} is furious.`;
        fileInsiderStory(player, rv, 'Scandals', headlineText, `A memo nobody was supposed to see \u2014 and now everyone has.`, 'Rivalry action: Leaked Studio Memo');
      } else {
        rv.rivalWins = (rv.rivalWins || 0) + 1;
        repDelta = -2;
        eventText = `The "leak" traced back to your publicist \u2014 ${rv.name} played the victim brilliantly.`;
        headlineText = headline('Page Six: Traced leak embarrasses {P} \u2014 {R} plays the victim', player, rv);
        resultLabel = '\u{1F4A5} LEAK TRACED \u2014 reputation -2. Sloppy.';
      }
    } else if (type === 'CEASE_DESIST') {
      if (won) {
        rv.playerWins = (rv.playerWins || 0) + 1;
        fansDelta = fanGain(player, rv);
        fameXpDelta = fameReward(type, rv);
        eventText = `Cease & desist upheld \u2014 ${rv.name} forced into a public correction and legal fees.`;
        headlineText = headline('Variety: {P} wins cease & desist order against {R}!', player, rv);
        resultLabel = `\u2696\uFE0F LEGAL VICTORY \u2014 +${fmtN(fansDelta)} fans, +${fameXpDelta} XP. ${rv.name} issues public correction.`;
        fileInsiderStory(player, rv, 'Legal News', headlineText, `LA Superior Court filings confirm the order; ${rv.name}'s camp declines comment.`, 'Rivalry action: Cease & Desist');
      } else {
        rv.rivalWins = (rv.rivalWins || 0) + 1;
        repDelta = -2;
        rv.legalHistory = [...(rv.legalHistory || []), `W${player.dateWeek} Y${player.dateYear}: your C&D dismissed \u2014 nuisance filing`];
        eventText = `Your cease & desist was dismissed as a nuisance filing \u2014 ${rv.name}'s lawyers humiliated yours.`;
        headlineText = headline('Legal News: {P}\u2019s lawsuit against {R} tossed by LA Superior Court', player, rv);
        resultLabel = '\u2696\uFE0F CASE DISMISSED \u2014 reputation -2, legal fees gone.';
      }
    }

    // Competitive actions push the score toward heat (win = press war, loss = grudge)
    const push = type === 'CEASE_DESIST' ? 18 : type === 'BOX_OFFICE_SHOWDOWN' ? 15 : 10;
    rv.rivalryScore = Math.min(100, Math.max(0, (rv.rivalryScore || 0) + push));
    rv.heatLevel = scoreToHeat(rv.rivalryScore);
    rv.relationshipLevel = rv.heatLevel;

    if (rv.heatLevel === 'Arch Rival' || rv.heatLevel === 'Legendary Rival') {
      fileInsiderStory(
        player, rv, 'Industry News',
        headline('Industry News: {P} vs {R} is now officially Hollywood\u2019s nastiest feud', player, rv),
        `Insiders brace for fallout as the rivalry reaches ${rv.heatLevel} status.`,
        'Rivalry escalation'
      );
    }
  }

  rv.timeline = [
    { id: `tl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, week: player.dateWeek, year: player.dateYear, eventText, category: meta.category },
    ...(rv.timeline || []),
  ].slice(0, 60);
  rv.mediaHeadlines = [headlineText, ...(rv.mediaHeadlines || [])].slice(0, 8);
  rv.lastEventDescription = eventText;
  rv.lastEventWeek = player.dateWeek;
  rv.cooldownUntilWeek = (player.dateWeek || 1) + 2;
  rv.nextStrikeWeek = Math.max(rv.nextStrikeWeek || 0, (player.dateWeek || 1) + 2); // they retaliate after cooling
  if (fansDelta !== 0) rv.fansCount = Math.max(0, (rv.fansCount || 0) - Math.round(fansDelta * 0.5));
  if (type === 'AWARD_LOBBY' || type === 'BOX_OFFICE_SHOWDOWN') {
    rv.awardsCompared = {
      playerWon: (rv.playerWins || 0),
      rivalWon: (rv.rivalWins || 0),
    };
  }

  return { ok: true, message: resultLabel, state: next, fansDelta, fameXpDelta, repDelta };
}

// ---------------------------------------------------------------------------
// WEEKLY TICK — feuds live between weeks (rivals strike, heat decays, resolves)
// ---------------------------------------------------------------------------

export interface RivalryWeekResult {
  logMessages: string[];
  fansDelta: number;
  fameXpDelta: number;
  repDelta: number;
  spawned: boolean;
}

/**
 * Real-time weekly processing. Called ONCE per advanceWeek from
 * EmpireService.processEndWeek \u2014 never from a render.
 */
export function processRivalriesWeek(
  state: EmpireFullState,
  player: Player,
  bestGross: number,
  week: number,
  year: number
): RivalryWeekResult {
  const res: RivalryWeekResult = { logMessages: [], fansDelta: 0, fameXpDelta: 0, repDelta: 0, spawned: false };
  if (!Array.isArray(state.rivalries)) state.rivalries = [];

  for (const rival of state.rivalries) {
    if (rival.resolved) continue;
    ensureRivalPower(rival, player, bestGross);

    // 1. RIVAL STRIKES BACK (only at Feud+ heat, on their scheduled real week)
    const strikeWeek = rival.nextStrikeWeek ?? (rival.weekStarted + 4);
    const hot = ['Feud', 'Arch Rival', 'Legendary Rival'].includes(rival.heatLevel);
    if (week >= strikeWeek && hot) {
      const arch = ROLE_ARCHETYPES[rival.role] || ROLE_ARCHETYPES.Actor;
      const detail = pick(arch.strikes);
      const fansHit = player.fans > 500 ? Math.round(player.fans * rand(0.004, 0.012)) : 0;
      const repHit = Math.random() < 0.5 ? -1 : 0;

      res.fansDelta -= fansHit;
      res.repDelta += repHit;
      rival.rivalryScore = Math.min(100, (rival.rivalryScore || 0) + Math.floor(rand(3, 7)));
      rival.heatLevel = scoreToHeat(rival.rivalryScore);
      rival.relationshipLevel = rival.heatLevel;
      rival.socialMediaActivity = {
        ...rival.socialMediaActivity,
        followersCount: Math.round((rival.socialMediaActivity?.followersCount || rival.power?.followers || 100000) * rand(1.0, 1.01)),
        sentiment: pick(['Aggressive', 'Mocking', 'Passive-Aggressive'] as const),
      };

      const eventText = `${rival.name} ${detail}${fansHit > 0 ? ` \u2014 you shed ${fmtN(fansHit)} fans in the fallout` : ''}.`;
      rival.timeline = [
        { id: `tl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, week, year, eventText, category: pick(['Interview', 'Social Media', 'General'] as const) },
        ...(rival.timeline || []),
      ].slice(0, 60);
      rival.mediaHeadlines = [
        pick(STRIKE_HEADLINES).replace('{R}', rival.name).replace('{detail}', detail),
        ...(rival.mediaHeadlines || []),
      ].slice(0, 8);
      rival.lastEventDescription = eventText;
      rival.lastEventWeek = week;
      rival.nextStrikeWeek = week + 3 + Math.floor(Math.random() * 3);

      res.logMessages.push(`\u2694\uFE0F ${rival.name} struck: ${detail}${fansHit > 0 ? ` (-${fmtN(fansHit)} fans)` : ''}.`);
    }

    // 2. HEAT DECAY when a feud goes quiet for 6+ real weeks
    const quietWeeks = week - (rival.lastEventWeek ?? rival.weekStarted);
    if (quietWeeks >= 6) {
      rival.rivalryScore = Math.max(0, (rival.rivalryScore || 0) - 3);
      rival.heatLevel = scoreToHeat(rival.rivalryScore);
      rival.relationshipLevel = rival.heatLevel;
      rival.lastEventWeek = week;
      if (rival.rivalryScore <= 5) {
        rival.resolved = true;
        rival.resolution = 'Faded out \u2014 the press moved on.';
        rival.heatLevel = 'Calm';
        rival.relationshipLevel = 'Calm';
        res.fameXpDelta += 40;
        res.logMessages.push(`\u{1F3F0} Feud with ${rival.name} faded peacefully (+40 Fame XP).`);
      }
    }

    // 3. Head-to-head dominance check: 3+ win lead while cold = rivalry ends
    const lead = (rival.playerWins || 0) - (rival.rivalWins || 0);
    if (!rival.resolved && lead >= 3 && (rival.rivalryScore || 0) < 30) {
      rival.resolved = true;
      rival.resolution = `You won the war ${rival.playerWins}-${rival.rivalWins}.`;
      rival.heatLevel = 'Calm';
      rival.relationshipLevel = 'Calm';
      rival.socialMediaActivity = { ...rival.socialMediaActivity, sentiment: 'Respectful' };
      res.fameXpDelta += 150;
      res.logMessages.push(`\u{1F3C6} RIVALRY WON: ${rival.name} conceded ${rival.playerWins}-${rival.rivalWins} (+150 Fame XP).`);
      fileInsiderStory(player, rival, 'Industry News',
        `Industry News: ${rival.name} concedes the long feud to ${player.firstName} ${player.lastName}`,
        `A ${rival.playerWins}-${rival.rivalWins} head-to-head record ended the war of attrition.`,
        'Rivalry resolution \u2014 dominance');
    }
  }

  // 4. NATURAL SPAWN \u2014 fame-gated, endless pool (same doctrine as before)
  const activeCount = state.rivalries.filter((r) => !r.resolved).length;
  if ((player.fameXp || 0) > 300 && Math.random() < 0.12 && activeCount < 25) {
    const fresh = spawnRival(player, state.rivalries, bestGross, false);
    state.rivalries.push(fresh);
    res.spawned = true;
    res.logMessages.push(`\u2694\uFE0F NEW RIVALRY: ${fresh.name} (${fresh.career}) \u2014 ${fresh.cause}.`);
  }

  return res;
}
