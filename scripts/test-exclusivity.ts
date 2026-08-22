/**
 * Exclusivity engine verification — real clauses, real penalties, real locks.
 * Run: npx tsx scripts/test-exclusivity.ts
 */
(globalThis as any).localStorage = {
  _d: new Map<string, string>(),
  getItem(k: string) { return this._d.get(k) ?? null; },
  setItem(k: string, v: string) { this._d.set(k, v); },
  removeItem(k: string) { this._d.delete(k); },
  clear() { this._d.clear(); },
};

let pass = 0, fail = 0;
const check = (n: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  \u2713 ${n}`); } else { fail++; console.log(`  \u2717 ${n} ${d}`); }
};

const { ExclusivityService } = await import('../src/services/exclusivityService');

console.log('== 1. CLAUSE CREATION ==');
{
  localStorage.clear();
  ExclusivityService.resetCache();
  ExclusivityService.recordClause({
    source: 'ENDORSEMENT', brandName: 'Nike', category: 'Athletics',
    startWeek: 10, startYear: 2026, durationWeeks: 52,
    dealFee: 42000, linkedDealId: 'deal_nike_1',
    description: 'Endorsement: Nike (Athletics) \u2014 $42,000/yr',
  });
  check('clause recorded', ExclusivityService.getState().clauses.length === 1);
  check('penalty = 2x fee', ExclusivityService.getState().clauses[0].penaltyAmount === 84000);
  check('category locked', ExclusivityService.activeClauses(10, 2026).some(c => c.category === 'Athletics'));
}

console.log('== 2. COMPETING OFFERS FULLY LOCKED ==');
{
  check('Adidas (same category) blocked with reason', ExclusivityService.offerBlockReason('Adidas', 'Athletics', 12, 2026)?.includes('Exclusive to Nike'));
  check('Nike itself (same brand) NOT blocked', ExclusivityService.offerBlockReason('Nike', 'Athletics', 12, 2026) === null);
  check('different category NOT blocked', ExclusivityService.offerBlockReason('Apple', 'Tech', 12, 2026) === null);
  const w = ExclusivityService.offerBlockReason('Adidas', 'Athletics', 12, 2026)!;
  check('reason shows weeks + penalty', w.includes('week') && w.includes('$84,000'));
  check('expired clause no longer blocks', ExclusivityService.offerBlockReason('Adidas', 'Athletics', 63, 2027) === null);
}

console.log('== 3. BREACH = PENALTIES + BAD REPUTATION ==');
{
  localStorage.clear();
  ExclusivityService.resetCache();
  ExclusivityService.recordClause({
    source: 'ENDORSEMENT', brandName: 'Nike', category: 'Athletics',
    startWeek: 10, startYear: 2026, durationWeeks: 52,
    dealFee: 42000, linkedDealId: 'deal_nike_1',
    description: 'Endorsement: Nike',
  });
  const player: any = { money: 200000, publicReputation: 70, industryRespect: 65, dateWeek: 20, dateYear: 2026 };
  let terminatedId = '';
  const res = ExclusivityService.applyBreach(
    ExclusivityService.activeClauses(20, 2026)[0],
    'a rival-partnered film: "SpeedRun 3"',
    player,
    (id) => { terminatedId = id; }
  );
  check('cash penalty taken (2x fee)', res.penaltyPaid === 84000 && player.money === 116000);
  check('reputation -5', player.publicReputation === 65);
  check('industry respect -5', player.industryRespect === 60);
  check('linked deal terminated', terminatedId === 'deal_nike_1');
  check('brand blacklisted ~18 months', ExclusivityService.isBlacklisted('Nike', 20, 2026) && !ExclusivityService.isBlacklisted('Nike', 20, 2028));
  check('clause removed after breach', ExclusivityService.activeClauses(20, 2026).length === 0);
  check('breach recorded in history', ExclusivityService.getState().breaches.length === 1);
  check('blacklisted brand offers blocked', ExclusivityService.offerBlockReason('Nike', 'Athletics', 21, 2026)?.includes('blacklisted'));
}

console.log('== 4. STREAMING SERIES LOCK ==');
{
  localStorage.clear();
  ExclusivityService.resetCache();
  ExclusivityService.recordClause({
    source: 'STREAMING_SERIES', brandName: 'Netstar', category: 'Streaming',
    startWeek: 5, startYear: 2026, durationWeeks: 8 + 12,
    dealFee: 250000,
    description: 'Streaming series lock: "Neon Dynasty"',
  });
  check('streaming category locked', ExclusivityService.offerBlockReason('HBO Max', 'Streaming', 10, 2026) !== null);
  check('other categories unaffected', ExclusivityService.offerBlockReason('Adidas', 'Athletics', 10, 2026) === null);
}

console.log('== 5. WEEKLY TICK (expiry is real) ==');
{
  localStorage.clear();
  ExclusivityService.resetCache();
  ExclusivityService.recordClause({
    source: 'MOVIE_PARTNER', brandName: 'Coca-Cola', category: 'Beverage',
    startWeek: 10, startYear: 2026, durationWeeks: 20, dealFee: 100000,
    description: 'Brand integration: Coca-Cola on "SpeedRun"',
  });
  const none = ExclusivityService.processWeek(20, 2026);
  check('no expiry before term', none.length === 0 && ExclusivityService.activeClauses(20, 2026).length === 1);
  const notes = ExclusivityService.processWeek(31, 2026);
  check('expiry fires on the real week', notes.length === 1 && notes[0].includes('expired'));
  check('category freed after expiry', ExclusivityService.offerBlockReason('Pepsi', 'Beverage', 31, 2026) === null);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
