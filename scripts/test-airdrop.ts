/**
 * AIRDROP + TOKENOMICS TEST — every path exercised with real state.
 * 1. Tokenomics validation  2. Launch w/ airdrop allocation
 * 3. Airdrop effects (holders/trust/buzz)  4. Cooldown + fatigue
 * 5. Buzz decay weekly  6. Slippage estimate preview
 */
(globalThis as any).localStorage = {
  _s: new Map<string, string>(),
  getItem(k: string) { return this._s.has(k) ? this._s.get(k)! : null; },
  setItem(k: string, v: string) { this._s.set(k, v); },
  removeItem(k: string) { this._s.delete(k); },
  clear() { this._s.clear(); },
};
import { MarketEngineService, fmtTokens } from '../src/services/marketEngineService';

let pass = 0, fail = 0;
const ok = (cond: boolean, label: string) => { if (cond) { pass++; console.log(`  ✅ ${label}`); } else { fail++; console.log(`  ❌ ${label}`); } };

// ---- 1. TOKENOMICS VALIDATION ----
console.log('\n[1] TOKENOMICS VALIDATION');
const badSum = MarketEngineService.launchPlayerCrypto('Bad Split', 'BAD', 1, 5000, 1000000, { totalSupply: 1000000000, founderPct: 50, airdropPct: 20, liquidityPct: 20 });
ok(!badSum.success, `rejects non-100% split: ${badSum.message.slice(0, 70)}...`);
const lowFounder = MarketEngineService.launchPlayerCrypto('Low Founder', 'LOW', 1, 5000, 1000000, { totalSupply: 1000000000, founderPct: 5, airdropPct: 85, liquidityPct: 10 });
ok(!lowFounder.success, 'rejects founder < 10%');

// ---- 2. LAUNCH WITH AIRDROP ALLOCATION ----
console.log('\n[2] LAUNCH — 1B SUPPLY · 70/15/15 SPLIT');
const launch = MarketEngineService.launchPlayerCrypto('Star Power', 'STARX', 0.5, 5000, 1000000, { totalSupply: 1000000000, founderPct: 70, airdropPct: 15, liquidityPct: 15 });
ok(launch.success, `launched: ${launch.message.slice(0, 90)}...`);
let coin = MarketEngineService.getMyCoinStatus().coin!;
ok(coin.playerHoldings === 700000000, `founder holds ${fmtTokens(coin.playerHoldings)} (70%)`);
ok(coin.communityAirdropped === 150000000, `launch airdrop ${fmtTokens(coin.communityAirdropped!)} (15%)`);
ok((coin.airdropHolders || 0) > 0, `${(coin.airdropHolders || 0).toLocaleString()} launch holders`);
console.log(`  fmtTokens checks: ${fmtTokens(150000000)}, ${fmtTokens(1200000)}, ${fmtTokens(9400)}, ${fmtTokens(42)}`);
ok(fmtTokens(150000000) === '150.0M' && fmtTokens(1200000) === '1.2M' && fmtTokens(9400) === '9.4K', 'K/M/B formatting correct');

// ---- 3. ONGOING AIRDROP ----
console.log('\n[3] COMMUNITY AIRDROP');
const absWeek = 2026 * 52 + 12;
const trustBefore = coin.communityStrength;
const holdBefore = coin.playerHoldings;
const air = MarketEngineService.airdropToCommunity('STARX', 50000000, absWeek);
ok(air.success, `airdrop executed: ${air.message.slice(0, 85)}...`);
ok(air.socialText && air.socialText.includes('$STARX'), `social post text ready: "${air.socialText!.slice(0, 60)}..."`);
coin = MarketEngineService.getMyCoinStatus().coin!;
ok(coin.playerHoldings === holdBefore - 50000000, `founder wallet reduced: ${fmtTokens(holdBefore)} → ${fmtTokens(coin.playerHoldings)}`);
ok((coin.airdropHolders || 0) >= 50000 + air.holdersGained - 1, `holders grew to ${(coin.airdropHolders || 0).toLocaleString()} (50K launch + ${air.holdersGained.toLocaleString()} drop)`);
ok(coin.buzzWeeksLeft === 3, `buzz set to 3 weeks (${coin.buzzWeeksLeft})`);

// ---- 4. COOLDOWN ----
console.log('\n[4] COOLDOWN + FATIGUE');
const blocked = MarketEngineService.airdropToCommunity('STARX', 1000000, absWeek + 1);
ok(!blocked.success, `cooldown blocks week+1: ${blocked.message.slice(0, 60)}...`);
const allowed = MarketEngineService.airdropToCommunity('STARX', 10000000, absWeek + 2);
ok(allowed.success, 'cooldown clears after 2 weeks — second airdrop accepted');
const fatigue = MarketEngineService.airdropToCommunity('STARX', 10000000, absWeek + 4);
ok(fatigue.success, `third consecutive drop accepted but dimmed: ${fatigue.holdersGained} holders vs second's ${allowed.holdersGained}`);
ok(fatigue.holdersGained < allowed.holdersGained, `fatigue enforced (${fatigue.holdersGained} < ${allowed.holdersGained})`);

// ---- 5. BUZZ DECAY WEEKLY ----
console.log('\n[5] BUZZ DECAY IN WEEKLY ENGINE');
for (let w = 0; w < 3; w++) {
  MarketEngineService.processEndWeek(14 + w, 2026, 1000000, {
    fameXp: 6000, fameDeltaPct: 2, lastReleasePerformance: 0, fanCount: 400000,
  });
  const c = MarketEngineService.getMyCoinStatus().coin!;
  console.log(`  W${14 + w}: buzz=${c.buzzWeeksLeft} price=$${c.price.toFixed(4)} news="${(c.news || '').slice(0, 55)}"`);
}
const afterBuzz = MarketEngineService.getMyCoinStatus().coin!;
ok(afterBuzz.buzzWeeksLeft !== undefined && afterBuzz.buzzWeeksLeft! <= 0, 'buzz fully decayed after 3 weeks');

// ---- 6. SLIPPAGE ESTIMATE PREVIEW ----
console.log('\n[6] FOUNDER SELL IMPACT PREVIEW');
const small = MarketEngineService.estimateFounderSellImpact('STARX', coin.circulatingSupply * 0.01);
ok(small !== null && small.slipPct === 0, `1% of supply: no slippage flagged (${small!.slipPct}%)`);
const huge = MarketEngineService.estimateFounderSellImpact('STARX', Math.floor(coin.playerHoldings * 0.5));
ok(huge !== null && huge.slipPct > 30, `half the founder wallet: −${huge!.slipPct}% slippage shown BEFORE confirm`);
ok(huge!.revenue < huge!.slipPct * 0 + coin.price * coin.playerHoldings * 0.5, 'preview revenue reflects the haircut');

console.log(`\n========== ${pass} passed / ${fail} failed ==========`);
process.exit(fail > 0 ? 1 : 0);
