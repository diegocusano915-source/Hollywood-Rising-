/**
 * Rivalry War Room engine verification — no fake simulation audit.
 * Run: npx tsx scripts/test-rivalry-sim.ts
 */
(globalThis as any).localStorage = {
  _d: new Map<string, string>(),
  getItem(k: string) { return this._d.get(k) ?? null; },
  setItem(k: string, v: string) { this._d.set(k, v); },
  removeItem(k: string) { this._d.delete(k); },
};

import { Player } from '../src/types/game';
import { EmpireFullState, RivalryNPC } from '../src/types/empire';
import {
  spawnRival,
  getPlayerPower,
  computeActionOdds,
  getActionLock,
  executeRivalryAction,
  processRivalriesWeek,
  ensureRivalPower,
  scoreToHeat,
} from '../src/services/rivalryService';
import { HollywoodInsiderService } from '../src/services/hollywoodInsiderService';

const mkPlayer = (over: Partial<Player> = {}): Player => ({
  id: 'p1', firstName: 'Ari', lastName: 'Stone', gender: 'Male' as any, age: 24,
  country: 'USA', city: 'LA', avatarUrl: '', personality: {} as any,
  dateWeek: 10, dateYear: 2026, money: 5_000_000, energy: 100, maxEnergy: 100,
  fans: 250_000, fameXp: 8_000, moviesCompleted: 6, awardsWon: 2, leadRolesCount: 4,
  principalRolesCount: 2, isUnionMember: true, talents: {} as any, activeCourses: [],
  netWorth: 12_000_000, industryRespect: 60, publicReputation: 70, criticReputation: 65,
  ...over,
} as Player);

const emptyState = (): EmpireFullState => ({ rivalries: [] } as any as EmpireFullState);

let pass = 0; let fail = 0;
const check = (name: string, cond: boolean, detail = '') => {
  if (cond) { pass++; console.log(`  \u2713 ${name}`); }
  else { fail++; console.log(`  \u2717 ${name} ${detail}`); }
};

console.log('== 1. NO FAKE SPAWN (fame gate) ==');
{
  const p = mkPlayer({ fameXp: 200 });
  const st = emptyState();
  const r1 = processRivalriesWeek(st, p, 0, 10, 2026);
  check('below fame gate never spawns', r1.spawned === false && st.rivalries.length === 0);

  const p2 = mkPlayer({ fameXp: 8_000 });
  let spawned = 0;
  for (let w = 0; w < 400; w++) {
    const r = processRivalriesWeek(st, p2, 0, 10 + w, 2026);
    if (r.spawned) spawned++;
  }
  check('fame-gated player spawns rivals over time', spawned > 10, `spawned=${spawned}`);
  check('endless pool: 400 weeks, no name repeats', new Set(st.rivalries.map((r) => r.name)).size === st.rivalries.length);
  const active = st.rivalries.filter((r) => !r.resolved).length;
  check('active rivals capped at 25', active <= 25, `active=${active}`);
}

console.log('== 2. RIVAL POWER = PLAYER-RELATIVE ==');
{
  const p = mkPlayer();
  const best = 180_000_000;
  const pp = getPlayerPower(p, best);
  check('player power is real', pp.fame === 8_000 && pp.fans === 250_000 && pp.awards === 2 && pp.boxOffice === best);
  const r = spawnRival(p, [], best, true);
  check('rival fame within competitive band (0.6-1.5x + floor)', r.power!.fame >= 0.5 * 8_000 && r.power!.fame <= 1.6 * 8_000, String(r.power!.fame));
  check('provoked starts at Tension/40', r.rivalryScore === 40 && r.heatLevel === 'Tension');
  check('rival has strike schedule + record fields', (r.nextStrikeWeek ?? 0) > 10 && r.playerWins === 0);

  const oldRival: RivalryNPC = {
    id: 'legacy', name: 'Xavier Vance', role: 'Actor', avatarUrl: '', relationshipLevel: 'Feud', heatLevel: 'Feud',
    rivalryScore: 60, cause: 'legacy', weekStarted: 1, yearStarted: 2026, career: 'Legacy Star', moviesTogether: [],
    awardsCompared: { playerWon: 0, rivalWon: 0 },
    socialMediaActivity: { followersCount: 4_000_000, sentiment: 'Aggressive', trendingHashtag: '#x' },
    timeline: [], fansCount: 1_500_000, legalHistory: [], businessHistory: [], lastEventDescription: '', mediaHeadlines: [],
    directorSupport: '', studioReaction: '',
  };
  const pw = ensureRivalPower(oldRival, p, best);
  check('legacy rival migrated with power block', pw.fame > 0 && oldRival.power === pw);
  check('migration keeps their real listed followers', pw.followers === 4_000_000);
}

console.log('== 3. ACTION LOCKS + ODDS ARE REAL ==');
{
  const p = mkPlayer({ fameXp: 8_000 });
  const st = emptyState();
  const r = spawnRival(p, [], 180_000_000, true);
  st.rivalries.push(r);
  const pp = getPlayerPower(p, 180_000_000);
  const rp = r.power!;

  const clapOdds = computeActionOdds(pp, rp, 'SOCIAL_CLAPBACK', {});
  const expected = pp.followers / (pp.followers + rp.followers + 1);
  check('clapback odds exactly follower ratio (clamped)', Math.abs(clapOdds - Math.min(0.85, Math.max(0.15, expected))) < 1e-9);

  check('showdown locked with no released movie', getActionLock(r, 'BOX_OFFICE_SHOWDOWN', getPlayerPower(p, 0), 10) === 'Release a movie first');
  check('award lobby locked with 0 awards', getActionLock(r, 'AWARD_LOBBY', getPlayerPower(mkPlayer({ awardsWon: 0 }), 0), 10) === 'Win an award first');
  check('truce locked before 4 weeks', (getActionLock(r, 'TRUCE_SUMMIT', pp, 10) || '').includes('age'));

  const res = executeRivalryAction(st, p, r.id, 'SOCIAL_CLAPBACK', 180_000_000);
  check('clapback executes and deducts cost', res.ok && p.money === 5_000_000 - 15_000);
  const rvAfter = res.state.rivalries[0];
  check('timeline + headline written', rvAfter.timeline.length === 2 && rvAfter.mediaHeadlines.length === 2);
  check('cooldown locks next action for 2 weeks', getActionLock(rvAfter, 'LEAKED_SCOOP', pp, 11) !== null && getActionLock(rvAfter, 'LEAKED_SCOOP', pp, 13) === null);
  const before = p.fameXp;
  if (res.fameXpDelta > 0) { p.fameXp += res.fameXpDelta; }
  check('win pays real fame xp (slow-burn scaled)', res.fameXpDelta === 0 || (p.fameXp - before === res.fameXpDelta && res.fameXpDelta <= 400));

  const resTruce = executeRivalryAction(st, p, r.id, 'TRUCE_SUMMIT', 180_000_000);
  check('truce blocked during cooldown', !resTruce.ok);
}

console.log('== 4. SHOWDOWN FILES INSIDER STORY + REAL GROSS ==');
{
  const p = mkPlayer();
  const st = emptyState();
  const r = spawnRival(p, [], 180_000_000, true);
  st.rivalries.push(r);
  const articlesBefore = HollywoodInsiderService.getState().articles.length;
  let sawDecisive = false;
  let lastRes: ReturnType<typeof executeRivalryAction> | null = null;
  for (let t = 0; t < 60 && !sawDecisive; t++) {
    p.dateWeek = 20; r.cooldownUntilWeek = 0; // test-only: clear cooldown between attempts
    const res = executeRivalryAction(st, p, r.id, 'BOX_OFFICE_SHOWDOWN', 180_000_000);
    if (res.ok) { lastRes = res; if (!res.message.includes('DRAW')) sawDecisive = true; }
    if (p.money < 100_000) break;
  }
  const articlesAfter = HollywoodInsiderService.getState().articles.length;
  check('showdown ran decisively', sawDecisive);
  check('showdown filed real Hollywood Insider coverage', articlesAfter > articlesBefore, `${articlesBefore}->${articlesAfter}`);
  check('their gross quoted against your real $180M', (lastRes?.state.rivalries[0].lastEventDescription || '').includes('$180'));
}

console.log('== 5. WEEKLY STRIKES, DECAY, RESOLUTION ==');
{
  const p = mkPlayer();
  const st = emptyState();
  const r = spawnRival(p, [], 0, false);
  r.rivalryScore = 55; r.heatLevel = scoreToHeat(55); r.relationshipLevel = r.heatLevel;
  r.nextStrikeWeek = 12; r.lastEventWeek = 10; r.weekStarted = 10;
  st.rivalries.push(r);

  const fansBefore = p.fans;
  const w11 = processRivalriesWeek(st, { ...p, fameXp: 0 }, 0, 11, 2026); // zero fame: no natural spawns
  check('no strike before scheduled week', !w11.logMessages.some((m) => m.includes('struck')) && w11.fansDelta === 0);

  const w12 = processRivalriesWeek(st, p, 0, 12, 2026);
  check('strike fires on scheduled real week', w12.logMessages.some((m) => m.includes('struck')));
  check('strike reports real fan loss for caller to apply', w12.fansDelta < 0, `delta=${w12.fansDelta}`);
  p.fans = Math.max(0, p.fans + w12.fansDelta); // caller (EmpireService) applies deltas
  check('applied strike actually steals fans', p.fans < fansBefore);
  check('strike reschedules + writes timeline', (r.nextStrikeWeek ?? 0) > 12 && r.timeline.length >= 2);

  // quiet decay: no events for 6+ weeks
  r.lastEventWeek = 20; r.rivalryScore = 8; r.heatLevel = scoreToHeat(8);
  const w27 = processRivalriesWeek(st, { ...p, fameXp: 0 }, 0, 27, 2026);
  check('quiet feud decays and resolves at low score', r.resolved === true && !!r.resolution);

  // dominance resolution: 3-win lead while cold
  const r2 = spawnRival(p, [], 0, false);
  r2.playerWins = 3; r2.rivalWins = 0; r2.rivalryScore = 10; r2.heatLevel = scoreToHeat(10);
  r2.lastEventWeek = 30; r2.nextStrikeWeek = 999;
  st.rivalries.push(r2);
  processRivalriesWeek(st, { ...p, fameXp: 0 }, 0, 40, 2026);
  check('3-win dominance resolves the war', r2.resolved === true && (r2.resolution || '').includes('3-0'));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
