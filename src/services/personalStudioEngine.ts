/**
 * HOLLYWOOD RISING - PERSONAL STUDIO ENGINE V2
 * Full studio pipeline: Overview -> Content (Development/Production/Distribution/Release)
 * -> Launch Content (scripts + renewals) -> Financials -> Equipment.
 * All numbers real, derived from player choices. Persisted in localStorage.
 */

import {
  PersonalStudioState,
  StudioScript,
  StudioProject,
  StudioBudgetAlloc,
  StudioCastOffer,
  StudioLocation,
  StudioFinancialEntry,
} from '../types/game';
import { Player } from '../types/game';

const KEY = 'HR_PERSONAL_STUDIO_V2';

export const STUDIO_UNLOCK = {
  principalRoles: 20,
  fameXp: 5000,
  moviesReleased: 15,
  cash: 50000000,
};

export const MIN_BUDGET = 2000000;
export const MAX_BUDGET = 10000000000;
export const MIN_CAST_FEE = 75000;
export const MAX_CAST_FEE = 40000000;
export const MAX_EQUIPMENT_LEVEL = 20;
export const MAX_BOOST = 40;
export const MIN_BOOST = 4;
export const DIST_MIN_WEEKS = 5;
export const DIST_MAX_WEEKS = 20;
export const REL_MIN_WEEKS = 10;
export const REL_MAX_WEEKS = 40;

// 8 equipment departments (original names)
export const EQUIPMENT_DEFS = [
  { id: 'eq_1', name: 'The Silver Screen Wing', stat: 'exhibition' },
  { id: 'eq_2', name: 'The Lens Vault', stat: 'cinematography' },
  { id: 'eq_3', name: 'The Wardrobe Atelier', stat: 'productionValue' },
  { id: 'eq_4', name: 'The Lumière Hall', stat: 'visualPolish' },
  { id: 'eq_5', name: 'The Resonance Chamber', stat: 'sound' },
  { id: 'eq_6', name: 'The Cutting Gallery', stat: 'postProduction' },
  { id: 'eq_7', name: 'The Backlot Pavilions', stat: 'efficiency' },
  { id: 'eq_8', name: 'The Atlas Fleet', stat: 'distributionReach' },
];

export const SCRIPT_POOL: StudioScript[] = [
  { id: 'sc_1', title: 'Midnight in the Badlands', type: 'Movie', genre: 'Western', qualityRating: 72, estimatedBudget: 80000000, potentialAudience: '20M', askingPrice: 1500000, owned: false },
  { id: 'sc_2', title: 'The Last Signal', type: 'Movie', genre: 'Sci-Fi Thriller', qualityRating: 81, estimatedBudget: 140000000, potentialAudience: '45M', askingPrice: 3500000, owned: false },
  { id: 'sc_3', title: 'Paper Crowns', type: 'Movie', genre: 'Drama', qualityRating: 88, estimatedBudget: 60000000, potentialAudience: '30M', askingPrice: 5000000, owned: false },
  { id: 'sc_4', title: 'Velocity Protocol', type: 'Movie', genre: 'Action', qualityRating: 69, estimatedBudget: 120000000, potentialAudience: '50M', askingPrice: 2200000, owned: false },
  { id: 'sc_5', title: 'The Quiet Storm', type: 'Movie', genre: 'Romance', qualityRating: 76, estimatedBudget: 45000000, potentialAudience: '25M', askingPrice: 1800000, owned: false },
  { id: 'sc_6', title: 'Neon Horizon', type: 'Movie', genre: 'Cyberpunk', qualityRating: 85, estimatedBudget: 150000000, potentialAudience: '60M', askingPrice: 4200000, owned: false },
  { id: 'sc_7', title: 'The Lighthouse Keeper', type: 'Movie', genre: 'Mystery', qualityRating: 74, estimatedBudget: 35000000, potentialAudience: '15M', askingPrice: 1200000, owned: false },
  { id: 'sc_8', title: 'Ember & Ash', type: 'Movie', genre: 'Fantasy', qualityRating: 79, estimatedBudget: 130000000, potentialAudience: '55M', askingPrice: 3000000, owned: false },
  { id: 'sc_9', title: 'The Understudy', type: 'Movie', genre: 'Comedy', qualityRating: 65, estimatedBudget: 40000000, potentialAudience: '22M', askingPrice: 900000, owned: false },
  { id: 'sc_10', title: 'Steel Rivers', type: 'Movie', genre: 'Crime Drama', qualityRating: 82, estimatedBudget: 90000000, potentialAudience: '35M', askingPrice: 3800000, owned: false },
  { id: 'sc_11', title: 'Hollow Empire', type: 'Series', genre: 'Political Thriller', qualityRating: 87, estimatedBudget: 180000000, potentialAudience: '70M', askingPrice: 6000000, owned: false },
  { id: 'sc_12', title: 'Starfall Academy', type: 'Series', genre: 'Teen Fantasy', qualityRating: 78, estimatedBudget: 120000000, potentialAudience: '65M', askingPrice: 3200000, owned: false },
  { id: 'sc_13', title: 'The Divide', type: 'Series', genre: 'Drama', qualityRating: 84, estimatedBudget: 150000000, potentialAudience: '50M', askingPrice: 4500000, owned: false },
  { id: 'sc_14', title: 'Ghost Protocol 2.0', type: 'Series', genre: 'Action', qualityRating: 71, estimatedBudget: 160000000, potentialAudience: '60M', askingPrice: 2500000, owned: false },
  { id: 'sc_15', title: 'The Orchard', type: 'Series', genre: 'Family Drama', qualityRating: 75, estimatedBudget: 90000000, potentialAudience: '40M', askingPrice: 2100000, owned: false },
];

// Actor pool: 50-96 simulated actors with ratings 10-100 and salary scales (75K - 40M)
export interface StudioActor {
  id: string;
  name: string;
  gender: 'M' | 'F';
  rating: number;
  baseFee: number;
  imageUrl: string;
}

const ACTOR_IMG = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=512&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=512&auto=format&fit=crop',
];

export const ACTOR_POOL: StudioActor[] = (() => {
  const names: [string, 'M' | 'F'][] = [
    ['Marcus Hayes', 'M'], ['Seraphina Sterling', 'F'], ['Damon Kincaid', 'M'], ['Chloe Laurent', 'F'],
    ['Alexander Vance', 'M'], ['Sophia Sterling', 'F'], ['Gabriel Stone', 'M'], ['Victoria Reign', 'F'],
    ['Julian Cross', 'M'], ['Isadora Vega', 'F'], ['Caspian Cole', 'M'], ['Nadia Frost', 'F'],
    ['Theo Blackwood', 'M'], ['Riley Quinn', 'F'], ['Anya Petrova', 'F'], ['Lorenzo Diaz', 'M'],
    ['Margot Vance', 'F'], ['Silas Monroe', 'M'], ['Callie Winters', 'F'], ['Devon Pierce', 'M'],
    ['Athena Cole', 'F'], ['Remington Fox', 'M'], ['Scarlett Rain', 'F'], ['Ezra Knight', 'M'],
    ['Dahlia Monroe', 'F'], ['Finn Callahan', 'M'], ['Ivy Laurent', 'F'], ['Oscar Bennett', 'M'],
    ['Petra Novak', 'F'], ['Hugo Steele', 'M'], ['Lila Fontaine', 'F'], ['Roman Ash', 'M'],
    ['Nina Vale', 'F'], ['Cyrus Dawn', 'M'], ['Freya Storm', 'F'], ['Julian Mercer', 'M'],
    ['Camille Noir', 'F'], ['Dante Rivera', 'M'], ['Elara Vance', 'F'], ['Miles Calloway', 'M'],
    ['Tessa Quinn', 'F'], ['Blaise Carter', 'M'], ['Sienna Brooks', 'F'], ['Orion Blake', 'M'],
    ['Wren Holloway', 'F'], ['Ace Morrison', 'M'], ['Luna Castellanos', 'F'], ['Kane Douglas', 'M'],
    ['Prima Solis', 'F'], ['Evan Sterling', 'M'], ['Mara Klein', 'F'], ['Rex Donovan', 'M'],
  ];
  // ratings 10-100 spread, fee scales linearly 75K-40M
  const fees: number[] = [];
  for (let i = 0; i < names.length; i++) {
    const rating = Math.max(10, Math.min(100, Math.round(10 + (i / names.length) * 90 + (Math.random() * 6 - 3))));
    const fee = Math.round(MIN_CAST_FEE + ((rating - 10) / 90) * (MAX_CAST_FEE - MIN_CAST_FEE));
    fees.push(fee);
  }
  return names.map(([name, gender], i) => ({
    id: `actor_${i + 1}`,
    name,
    gender,
    rating: Math.max(10, Math.min(100, 10 + ((i * 7) % 91))),
    baseFee: Math.round(MIN_CAST_FEE + ((Math.max(10, Math.min(100, 10 + ((i * 7) % 91))) - 10) / 90) * (MAX_CAST_FEE - MIN_CAST_FEE)),
    imageUrl: ACTOR_IMG[i % ACTOR_IMG.length],
  }));
})();

// Locations: 50-70 countries/cities
export const LOCATION_POOL = [
  'Los Angeles, USA', 'New York, USA', 'Atlanta, USA', 'New Orleans, USA', 'Chicago, USA', 'Austin, USA', 'Miami, USA', 'Hawaii, USA', 'Alaska, USA', 'Vegas, USA',
  'London, UK', 'Manchester, UK', 'Edinburgh, UK', 'Paris, France', 'Nice, France', 'Berlin, Germany', 'Munich, Germany', 'Rome, Italy', 'Venice, Italy', 'Milan, Italy',
  'Madrid, Spain', 'Barcelona, Spain', 'Seville, Spain', 'Lisbon, Portugal', 'Amsterdam, Netherlands', 'Brussels, Belgium', 'Zurich, Switzerland', 'Vienna, Austria', 'Prague, Czechia', 'Warsaw, Poland',
  'Athens, Greece', 'Istanbul, Turkey', 'Dubai, UAE', 'Doha, Qatar', 'Tel Aviv, Israel', 'Cairo, Egypt', 'Marrakech, Morocco', 'Cape Town, South Africa', 'Nairobi, Kenya', 'Lagos, Nigeria',
  'Mumbai, India', 'New Delhi, India', 'Bangkok, Thailand', 'Singapore', 'Kuala Lumpur, Malaysia', 'Jakarta, Indonesia', 'Manila, Philippines', 'Hong Kong', 'Shanghai, China', 'Beijing, China',
  'Seoul, South Korea', 'Busan, South Korea', 'Tokyo, Japan', 'Osaka, Japan', 'Kyoto, Japan', 'Sydney, Australia', 'Melbourne, Australia', 'Auckland, NZ', 'Wellington, NZ', 'Rio de Janeiro, Brazil',
  'São Paulo, Brazil', 'Buenos Aires, Argentina', 'Santiago, Chile', 'Lima, Peru', 'Bogotá, Colombia', 'Mexico City, Mexico', 'Cancún, Mexico', 'Toronto, Canada', 'Vancouver, Canada', 'Montreal, Canada',
];

// STORAGE
export function defaultStudioState(): PersonalStudioState {
  return {
    unlocked: false,
    active: false,
    name: '',
    description: '',
    level: 1,
    studioValue: 0,
    scripts: [],
    projects: [],
    equipment: EQUIPMENT_DEFS.map((e) => ({ id: e.id, name: e.name, level: 1, stat: e.stat })),
    financials: [],
    sold: false,
  };
}

export function loadStudioState(): PersonalStudioState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const def = defaultStudioState();
      return { ...def, ...parsed, equipment: parsed.equipment?.length ? parsed.equipment : def.equipment };
    }
  } catch {}
  const def = defaultStudioState();
  saveStudioState(def);
  return def;
}

export function saveStudioState(state: PersonalStudioState) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function canUnlockStudio(player: Player): boolean {
  return (
    (player.principalRolesCount || 0) >= STUDIO_UNLOCK.principalRoles &&
    (player.fameXp || 0) >= STUDIO_UNLOCK.fameXp &&
    (player.moviesCompleted || 0) >= STUDIO_UNLOCK.moviesReleased &&
    (player.money || 0) >= STUDIO_UNLOCK.cash
  );
}

export function unlockStudio(state: PersonalStudioState, name: string, description: string): PersonalStudioState {
  state.unlocked = true;
  state.active = true;
  state.name = name;
  state.description = description;
  state.level = 1;
  state.studioValue = 50000000;
  saveStudioState(state);
  return state;
}

// Buy a script -> moves to owned; player then opens Content -> Development
export function buyScript(state: PersonalStudioState, scriptId: string, money: number): { success: boolean; message: string; newMoney: number } {
  const script = SCRIPT_POOL.find((s) => s.id === scriptId);
  if (!script) return { success: false, message: 'Script not found.', newMoney: money };
  if (state.scripts.some((s) => s.id === scriptId)) return { success: false, message: 'You already own this script.', newMoney: money };
  if (money < script.askingPrice) return { success: false, message: `Insufficient funds — script costs $${script.askingPrice.toLocaleString()}.`, newMoney: money };
  state.scripts.push({ ...script, owned: true });
  state.financials.unshift({ id: `fin_${Date.now()}`, type: 'COST', category: 'Script', projectTitle: script.title, amount: script.askingPrice, week: 1, year: 2026 });
  saveStudioState(state);
  return { success: true, message: `Acquired script "${script.title}" — it's now in Content → Development.`, newMoney: money - script.askingPrice };
}

// Create project from owned script (enters Development)
export function startDevelopment(state: PersonalStudioState, scriptId: string, director: string): { success: boolean; message: string; project?: StudioProject } {
  const script = state.scripts.find((s) => s.id === scriptId && s.owned);
  if (!script) return { success: false, message: 'Script not found in your library.' };
  if (state.projects.some((p) => p.scriptId === scriptId && p.status === 'ACTIVE')) return { success: false, message: 'This script already has an active project.' };
  const project: StudioProject = {
    id: `proj_${Date.now()}`,
    scriptId: script.id,
    title: script.title,
    type: script.type,
    genre: script.genre,
    description: `A ${script.genre} ${script.type === 'Series' ? 'series' : 'film'} from a script rated ${script.qualityRating}/100.`,
    scriptQuality: script.qualityRating,
    director,
    stage: 'Development',
    totalBudget: 0,
    allocations: { principalCast: 25, distributionMarketing: 25, postProduction: 25, locationSet: 25 },
    cast: [],
    locations: [],
    distributionWeeks: 10,
    distributionWeeksElapsed: 0,
    boost: 4,
    releaseWeeks: 20,
    releaseWeeksElapsed: 0,
    marketingBudget: 0,
    networkPitchPcts: {},
    bids: [],
    ratings: { castCrew: 0, directing: 0, editingSoundVfx: 0, equipment: 0, locationSet: 0, screenplay: script.qualityRating },
    overallRating: script.qualityRating,
    renewalCount: 0,
    status: 'ACTIVE',
  };
  state.projects.unshift(project);
  saveStudioState(state);
  return { success: true, message: 'Project created — set the budget in Development.', project };
}

// Set budget -> moves to Production
export function setBudgetAndToProduction(state: PersonalStudioState, projectId: string, budget: number, alloc: StudioBudgetAlloc): { success: boolean; message: string } {
  const proj = state.projects.find((p) => p.id === projectId);
  if (!proj) return { success: false, message: 'Project not found.' };
  const total = (alloc.principalCast || 0) + (alloc.distributionMarketing || 0) + (alloc.postProduction || 0) + (alloc.locationSet || 0);
  if (budget < MIN_BUDGET || budget > MAX_BUDGET) return { success: false, message: `Budget must be between $2M and $10B.` };
  if (Math.abs(total - 100) > 0.01) return { success: false, message: `Allocation must total exactly 100% (currently ${total}%).` };

  // PRODUCTION CAP: max 3 projects in production at once, and only ONE series.
  // Prevents an overcrowded hub — you can run 3 movies, or 2 movies + 1 series.
  const inProduction = state.projects.filter((p) => p.stage === 'Production');
  if (inProduction.length >= 3) {
    return { success: false, message: `Production hub is full (${inProduction.length}/3). Finish a project before starting another.` };
  }
  if (proj.type === 'Series' && inProduction.some((p) => p.type === 'Series')) {
    return { success: false, message: 'A series is already in production — only one series at a time.' };
  }

  proj.totalBudget = budget;
  proj.allocations = { ...alloc };
  proj.stage = 'Production';
  state.financials.unshift({ id: `fin_${Date.now()}`, projectId, projectTitle: proj.title, type: 'COST', category: 'Budget', amount: budget, week: 1, year: 2026 });
  saveStudioState(state);
  return { success: true, message: 'Budget set! Project moved to Production.' };
}

// Cast offer status color: green if within budget & >= actor fee, gray if close, red if too low
export function castOfferStatus(actorFee: number, offer: number, royaltyPct: number): 'GREEN' | 'GRAY' | 'RED' {
  const value = offer + (royaltyPct / 100) * 100000000 * 0.1;
  if (value >= actorFee * 1.1) return 'GREEN';
  if (value >= actorFee * 0.75) return 'GRAY';
  return 'RED';
}

// Submit cast offer -> pending; deducts fee only when accepted
export function submitCastOffer(state: PersonalStudioState, projectId: string, actorId: string, role: StudioCastOffer['role'], cashOffer: number, royaltyPct: number): { success: boolean; message: string } {
  const proj = state.projects.find((p) => p.id === projectId);
  if (!proj) return { success: false, message: 'Project not found.' };
  const actor = ACTOR_POOL.find((a) => a.id === actorId);
  if (!actor) return { success: false, message: 'Actor not found.' };
  if (proj.cast.some((c) => c.actorId === actorId)) return { success: false, message: 'You already sent an offer to this actor.' };
  proj.cast.push({
    actorId, name: actor.name, role, cashOffer, royaltyPct,
    status: 'PENDING', weeksRemaining: 3, fee: actor.baseFee,
  });
  saveStudioState(state);
  return { success: true, message: `Offer submitted to ${actor.name} — they respond within 3 weeks.` };
}

// Weekly processing (called from GameContext advanceWeek)
export function processStudioWeek(state: PersonalStudioState, player: Player): { messages: string[]; moneyDelta: number } {
  const messages: string[] = [];
  let moneyDelta = 0;
  if (!state.active) return { messages, moneyDelta };

  // 25% energy drain per week
  player.energy = Math.max(0, (player.energy || 0) - 25);
  messages.push('🏢 Personal Studio active: -25% energy this week.');

  // Cast decisions: 3-week window
  state.projects.forEach((proj) => {
    if (proj.stage !== 'Production') return;
    proj.cast.forEach((c) => {
      if (c.status === 'PENDING') {
        c.weeksRemaining -= 1;
        if (c.weeksRemaining <= 0) {
          const status = castOfferStatus(c.fee, c.cashOffer, c.royaltyPct);
          if (status === 'GREEN') {
            c.status = 'ACCEPTED';
            state.financials.unshift({ id: `fin_${Date.now()}`, projectId: proj.id, projectTitle: proj.title, type: 'COST', category: 'Cast', amount: c.cashOffer, week: 1, year: 2026 });
            messages.push(`🎭 ${c.name} ACCEPTED your offer for "${proj.title}" (${c.role}) — $${c.cashOffer.toLocaleString()} + ${c.royaltyPct}% royalty.`);
          } else if (status === 'GRAY') {
            c.status = 'ACCEPTED';
            state.financials.unshift({ id: `fin_${Date.now()}`, projectId: proj.id, projectTitle: proj.title, type: 'COST', category: 'Cast', amount: c.cashOffer, week: 1, year: 2026 });
            messages.push(`🎭 ${c.name} accepted your offer after negotiation (${c.role}) — $${c.cashOffer.toLocaleString()}.`);
          } else {
            c.status = 'DECLINED';
            messages.push(`❌ ${c.name} DECLINED your offer for "${proj.title}" — the deal was too low.`);
          }
        }
      }
    });
  });

  // Distribution countdown
  state.projects.forEach((proj) => {
    if (proj.stage === 'Distribution') {
      proj.distributionWeeksElapsed += 1;
      if (proj.distributionWeeksElapsed >= proj.distributionWeeks) {
        proj.stage = 'Release';
        messages.push(`📦 "${proj.title}" finished distribution — it's ready for the Release window!`);
      }
    } else if (proj.stage === 'Release') {
      proj.releaseWeeksElapsed += 1;
      if (proj.releaseWeeksElapsed >= proj.releaseWeeks) {
        proj.status = 'COMPLETED';
        // Box office backend income based on ratings + budget + boost
        const backend = Math.floor(proj.totalBudget * (proj.overallRating / 100) * (1 + proj.boost / 100) * (0.6 + Math.random() * 0.8));
        moneyDelta += backend;
        state.financials.unshift({ id: `fin_${Date.now()}`, projectId: proj.id, projectTitle: proj.title, type: 'INCOME', category: 'BoxOffice', amount: backend, week: 1, year: 2026 });
        messages.push(`🎬 "${proj.title}" RELEASED! Box office backend earned: +$${backend.toLocaleString()}.`);
        // Streaming network promotes on socials (tie-in)
        if (proj.winningNetwork) {
          messages.push(`📺 ${proj.winningNetwork} is promoting "${proj.title}" across their platforms!`);
        }
      }
    }
  });

  saveStudioState(state);
  return { messages, moneyDelta };
}

// Buy equipment upgrade (cash, max level 20)
export function upgradeEquipment(state: PersonalStudioState, equipmentId: string, money: number): { success: boolean; message: string; newMoney: number } {
  const eq = state.equipment.find((e) => e.id === equipmentId);
  if (!eq) return { success: false, message: 'Equipment not found.', newMoney: money };
  if (eq.level >= MAX_EQUIPMENT_LEVEL) return { success: false, message: `${eq.name} is already max level (20).`, newMoney: money };
  const cost = Math.floor(50000 * Math.pow(1.6, eq.level - 1));
  if (money < cost) return { success: false, message: `Insufficient funds — upgrade costs $${cost.toLocaleString()}.`, newMoney: money };
  eq.level += 1;
  state.financials.unshift({ id: `fin_${Date.now()}`, type: 'COST', category: 'Equipment', projectTitle: eq.name, amount: cost, week: 1, year: 2026 });
  saveStudioState(state);
  return { success: true, message: `${eq.name} upgraded to Level ${eq.level}! (+stat boost)`, newMoney: money - cost };
}

// Sell studio
export function sellStudio(state: PersonalStudioState): number {
  const payout = Math.floor(state.studioValue * 0.8);
  state.active = false;
  state.sold = true;
  saveStudioState(state);
  return payout;
}

// Close studio (stops drain)
export function closeStudio(state: PersonalStudioState) {
  state.active = false;
  saveStudioState(state);
}

// ============================================================
// BEST-IDEAS PASS: real ratings, start filming, crew deductions,
// renewals (×2/×3 targets, part 7 / 20 seasons, legacy follow-ups)
// ============================================================

// REAL RATING MATH — everything derives from actual player choices
export function computeProjectRatings(proj: StudioProject, state: PersonalStudioState): StudioProject['ratings'] {
  const acceptedCast = proj.cast.filter((c) => c.status === 'ACCEPTED');
  // Cast & Crew: average of accepted actor ratings (no cast = weak)
  const castAvg = acceptedCast.length
    ? Math.round(acceptedCast.reduce((a, c) => a + (ACTOR_POOL.find((x) => x.id === c.actorId)?.rating || 50), 0) / acceptedCast.length)
    : 30;

  // Directing & Production: director baseline + production allocation share
  const directing = Math.min(100, Math.round(45 + (proj.allocations.principalCast || 0) * 0.3 + (proj.allocations.distributionMarketing || 0) * 0.2));

  // Editing Sound & VFX: postProduction allocation + equipment (Cutting Gallery + Resonance Chamber)
  const eqPost = state.equipment.find((e) => e.stat === 'postProduction')?.level || 1;
  const eqSound = state.equipment.find((e) => e.stat === 'sound')?.level || 1;
  const editingSoundVfx = Math.min(100, Math.round((proj.allocations.postProduction || 0) * 0.5 + (eqPost + eqSound) * 1.2));

  // Equipment: average level across all 8 departments * 5 (max 100)
  const eqAvg = Math.round(state.equipment.reduce((a, e) => a + e.level, 0) / Math.max(1, state.equipment.length));
  const equipment = Math.min(100, eqAvg * 5);

  // Location Set & Design: allocation + number of locations chosen
  const locationPct = Math.min(100, Math.round((proj.allocations.locationSet || 0) * 0.6 + proj.locations.length * 4));
  const locationSet = Math.max(10, locationPct);

  // Screenplay: script quality (fixed)
  const screenplay = proj.scriptQuality;

  return { castCrew: castAvg, directing, editingSoundVfx, equipment, locationSet, screenplay };
}

export function computeOverallRating(ratings: StudioProject['ratings']): number {
  return Math.min(100, Math.round(
    ratings.castCrew * 0.25 +
    ratings.directing * 0.15 +
    ratings.editingSoundVfx * 0.15 +
    ratings.equipment * 0.15 +
    ratings.locationSet * 0.1 +
    ratings.screenplay * 0.2
  ));
}

// Set a location with allocation % (locations sum their own 100% pool)
export function toggleLocation(proj: StudioProject, name: string, allocationPct: number): { success: boolean; message: string } {
  const idx = proj.locations.findIndex((l) => l.name === name);
  if (idx !== -1) {
    proj.locations.splice(idx, 1);
    return { success: true, message: `${name} removed from the shoot.` };
  }
  const currentTotal = proj.locations.reduce((a, l) => a + l.allocationPct, 0);
  if (currentTotal + allocationPct > 100) return { success: false, message: 'Location allocation would exceed 100%.' };
  proj.locations.push({ name, allocationPct });
  return { success: true, message: `${name} added (${allocationPct}%).` };
}

// START FILMING: validates cast accepted + locations set, computes ratings, moves to Distribution
export function startFilming(state: PersonalStudioState, projectId: string): { success: boolean; message: string } {
  const proj = state.projects.find((p) => p.id === projectId);
  if (!proj) return { success: false, message: 'Project not found.' };
  if (proj.cast.length === 0) return { success: false, message: 'Hire at least one actor first.' };
  if (proj.cast.some((c) => c.status === 'PENDING')) return { success: false, message: 'Wait for all cast to respond (3-week window).' };
  if (!proj.cast.some((c) => c.status === 'ACCEPTED')) return { success: false, message: 'No cast accepted yet — improve your offers.' };
  if (proj.locations.length === 0) return { success: false, message: 'Choose at least one filming location.' };

  // Compute real ratings
  proj.ratings = computeProjectRatings(proj, state);
  proj.overallRating = computeOverallRating(proj.ratings);
  proj.stage = 'Distribution';
  saveStudioState(state);
  return { success: true, message: `🎬 Filming wrapped! "${proj.title}" moved to Distribution (Rating ${proj.overallRating}/100).` };
}

// RENEWAL CHECK: movie ×2 / series ×3 target on completion
export function checkRenewalEligibility(state: PersonalStudioState, player: Player): { eligible: boolean; reason: string } {
  const last = state.projects.find((p) => p.status === 'COMPLETED');
  if (!last) return { eligible: false, reason: 'No completed project yet.' };
  const earned = state.financials.filter((f) => f.projectId === last.id && f.type === 'INCOME').reduce((a, f) => a + f.amount, 0);
  const target = last.type === 'Series' ? last.totalBudget * 3 : last.totalBudget * 2;
  if (earned < target) return { eligible: false, reason: `"${last.title}" earned $${(earned / 1000000).toFixed(0)}M — needs ${last.type === 'Series' ? '×3' : '×2'} target ($${(target / 1000000).toFixed(0)}M).` };
  if (last.type === 'Movie' && last.renewalCount >= 7) return { eligible: false, reason: 'Movies renew up to Part 7 — a legacy follow-up may return in 2-3 years.' };
  if (last.type === 'Series' && last.renewalCount >= 20) return { eligible: false, reason: 'Series renew up to 20 seasons.' };
  return { eligible: true, reason: `"${last.title}" met its target — eligible for renewal!` };
}

// Accept renewal funding -> creates next part/season project back in Development
export function acceptRenewal(state: PersonalStudioState, money: number): { success: boolean; message: string; newMoney: number } {
  const last = state.projects.find((p) => p.status === 'COMPLETED');
  if (!last) return { success: false, message: 'No completed project to renew.', newMoney: money };
  const elig = checkRenewalEligibility(state, {} as Player);
  if (!elig.eligible) return { success: false, message: elig.reason, newMoney: money };
  const nextCount = last.renewalCount + 1;
  const funding = Math.floor(last.totalBudget * (last.type === 'Series' ? 0.45 : 0.4) * (1 + nextCount * 0.15));
  if (money < funding) return { success: false, message: `Renewal funding costs $${funding.toLocaleString()} — you need that cash.`, newMoney: money };

  const nextLabel = last.type === 'Series' ? `Season ${nextCount}` : nextCount === 2 ? 'Part 2: The Sequel' : nextCount === 3 ? 'Part 3: Trilogy Climax' : `Part ${nextCount}`;
  const renewed: StudioProject = {
    ...last,
    id: `proj_${Date.now()}`,
    title: last.type === 'Series' ? `${last.title.replace(/:\s*Season \d+$/, '')}: Season ${nextCount}` : `${last.title} (${nextLabel})`,
    stage: 'Development',
    totalBudget: 0,
    allocations: { principalCast: 25, distributionMarketing: 25, postProduction: 25, locationSet: 25 },
    cast: [],
    locations: [],
    distributionWeeks: 10,
    distributionWeeksElapsed: 0,
    boost: 4,
    releaseWeeks: 20,
    releaseWeeksElapsed: 0,
    marketingBudget: 0,
    networkPitchPcts: {},
    bids: [],
    renewalCount: nextCount,
    renewedFromId: last.id,
    status: 'ACTIVE',
    scriptQuality: Math.min(100, last.scriptQuality + 3),
  };
  renewed.ratings = { castCrew: 0, directing: 0, editingSoundVfx: 0, equipment: 0, locationSet: 0, screenplay: renewed.scriptQuality };
  renewed.overallRating = renewed.scriptQuality;
  state.projects.unshift(renewed);
  state.financials.unshift({ id: `fin_${Date.now()}`, projectId: renewed.id, projectTitle: renewed.title, type: 'INCOME', category: 'Renewal', amount: funding, week: 1, year: 2026 });
  saveStudioState(state);
  return { success: true, message: `${renewed.title} funded ($${funding.toLocaleString()})! It's in Development — set its budget.`, newMoney: money - funding };
}
