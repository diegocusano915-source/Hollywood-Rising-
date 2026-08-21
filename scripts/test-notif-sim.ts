/**
 * Offline notification pool verification — real events only.
 * Run: npx tsx scripts/test-notif-sim.ts
 */
(globalThis as any).localStorage = {
  _d: new Map<string, string>(),
  getItem(k: string) { return this._d.get(k) ?? null; },
  setItem(k: string, v: string) { this._d.set(k, v); },
  removeItem(k: string) { this._d.delete(k); },
};

import { SaveData } from '../src/types/game';
import { collectRichPool, buildBatchMessages, collectNotificationItems } from '../src/services/notificationEngine';

let pass = 0, fail = 0;
const check = (n: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  \u2713 ${n}`); } else { fail++; console.log(`  \u2717 ${n} ${d}`); }
};

// Seed the persistent engines with real-looking state
localStorage.setItem('HOLLYWOOD_RISING_MARKET_ENGINE_V2', JSON.stringify({
  stocks: [{ id: 's1', name: 'Meridian Pictures', ticker: 'MRDN', changePct: 7.4, sharePrice: 88, playerSharesOwned: 4000, industry: 'Film', ceo: 'x', logo: '', prevPrice: 82, marketCap: 1e10, sharesOutstanding: 1e8, revenue: 1e9 }],
  cryptoCoins: [{ id: 'c1', name: 'Starcoin', symbol: 'STAR', price: 4.2, change24h: -11.3, playerHoldings: 25000, prevPrice: 4.7, change7d: -5, marketCap: 1e9, circulatingSupply: 1e8, volume24h: 1e7, popularity: 60, communityStrength: 55 }],
}));
localStorage.setItem('HOLLYWOOD_SOCIALS_FULL_STATE_V3', JSON.stringify({
  writers: [{ id: 'w1', name: 'Dorian Ash', agencyName: 'Silverline Media', hired: true, contractWeeksRemaining: 9, postsThisWeek: 2, tier: 'Elite', weeklyCost: 2000, postsPerWeek: 2, qualityBoost: 0.2 }],
  followers: {}, youtubeVideos: [], youtubeAlgorithm: {}, instagramPosts: [],
}));
localStorage.setItem('hollywood_rising_empire_save_v1', JSON.stringify({
  rivalries: [{ id: 'rv1', name: 'Xavier Vance', heatLevel: 'Feud', rivalryScore: 62, resolved: false, lastEventDescription: 'took a jab on late-night', cause: 'role rivalry' }],
  eliteClub: { isMember: true },
}));


// Empty save: rich pool may only contain living-market items (the market
// exists for every player); nothing else may be invented.
const emptySave = { player: { firstName: 'Ari', lastName: 'Stone', dateWeek: 10, dateYear: 2026, fameXp: 100, fans: 0, money: 500 } } as any as SaveData;
const emptyPool = collectRichPool(emptySave);
console.log(`  empty pool titles: ${emptyPool.map((r) => r.title).join(' | ') || '(none)'}`);
// Engine-state items (market/rivalry/writer/society) come from the seeded
// engines above and are real state; a save with no career must not invent
// CAREER facts (milestones, pregnancies) out of nothing.
check('empty career invents no career facts',
  emptyPool.every((m) => !m.title.includes('crossed') && !m.title.includes('baby')));
const emptyBatch = buildBatchMessages(emptySave, 24, 0);
check('empty save batch has no invented career facts', emptyBatch.every((m) => !m.title.includes('crossed') && !m.title.includes('baby')), JSON.stringify(emptyBatch[0]));

// Rich save: every system firing at once
const richSave = {
  player: {
    firstName: 'Ari', lastName: 'Stone', dateWeek: 42, dateYear: 2027,
    fameXp: 22000, fans: 900000, money: 45000000, netWorth: 120000000,
    moviesCompleted: 12, leadRolesCount: 6, principalRolesCount: 9,
    auditions: [{ movieTitle: 'Aster City', weeksRemaining: 2 }],
  },
  releasedMovies: [{ id: 'm1', movieTitle: 'Neon Dynasty', inCinemas: true, worldwideGross: 187000000, weeksInCinemas: 4 }],
  relationships: [{ id: 'r1', name: 'Selene Marchetti', pregnancy: { weeksUntilBirth: 8, totalWeeks: 38, childName: 'Iris', childGender: 'Female', conceivedWeek: 12, conceivedYear: 2027 } }],
} as any as SaveData;

const rich = collectRichPool(richSave);
const titles = rich.map((r) => r.title).join(' | ');
console.log(`  rich pool size: ${rich.length}`);
check('rivalry escalation item', titles.includes('Xavier Vance'));
check('box office milestone item ($150M)', titles.includes('$150M'));
check('crypto swing item (STAR -11.3%)', titles.includes('STAR'));
check('stock swing item fires (hottest real mover)', rich.some((r) => r.title.startsWith('\u{1F4C8}')), rich.find((r) => r.title.startsWith('\u{1F4C8}'))?.title);
check('pregnancy countdown item', titles.includes('Selene'));
check('hired writer item', titles.includes('Dorian Ash'));
check('society member item', titles.includes('Society') || titles.includes('\u{1F516}') || titles.includes('concierge'));

const batch = buildBatchMessages(richSave, 24, 0);
check('hourly batch built from real pool', batch.length >= 16 && batch.length <= 24, `len=${batch.length}`);
const fillers = batch.filter((m) => m.title === '\u{1F4EC} Still waiting for you').length;
check('filler reminders capped at 3', fillers <= 3, `fillers=${fillers}`);
const uniqueTitles = new Set(batch.map((m) => m.title)).size;
check('batch titles mostly unique', uniqueTitles >= Math.min(batch.length - 3, 16), `unique=${uniqueTitles}/${batch.length}`);
const rot = buildBatchMessages(richSave, 24, 3);
check('rotation offset changes the batch order', rot[0].title !== batch[0].title || rot[3].title !== batch[3].title);

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
