/**
 * FOUNDER COIN SYSTEM TEST — no fake numbers, every path exercised.
 * 1. Launch → 2. inject cash pump → 3. fame-driven weekly moves
 * 4. founder dump slippage → 5. rugpull consequences → 6. blacklist
 */
(globalThis as any).localStorage = {
  _s: new Map<string, string>(),
  getItem(k: string) { return this._s.has(k) ? this._s.get(k)! : null; },
  setItem(k: string, v: string) { this._s.set(k, v); },
  removeItem(k: string) { this._s.delete(k); },
  clear() { this._s.clear(); },
};
import { MarketEngineService } from '../src/services/marketEngineService';

let pass = 0, fail = 0;
const ok = (cond: boolean, label: string) => { if (cond) { pass++; console.log(`  ✅ ${label}`); } else { fail++; console.log(`  ❌ ${label}`); } };

// ---- 1. LAUNCH ----
console.log('\n[1] LAUNCH');
const launch = MarketEngineService.launchPlayerCrypto('Star Power', 'STARX', 0.5, 5000, 1000000);
ok(launch.success, `launch succeeds (${launch.message.slice(0, 50)}...)`);
const st1 = MarketEngineService.getMyCoinStatus();
ok(!!st1.coin && st1.rank > 0, `live on exchange, rank #${st1.rank}/${st1.totalLive}, leader $${st1.leader?.symbol}`);
ok(st1.coin!.playerHoldings === 1000000, 'founder allocation 1,000,000 tokens');

// ---- 2. INJECT CASH PUMP ----
console.log('\n[2] LIQUIDITY INJECTION');
const priceBefore = st1.coin!.price;
const mcapBefore = st1.coin!.marketCap;
const inj = MarketEngineService.injectCashIntoMyCoin('STARX', 500000, 2000000);
ok(inj.success, `injection accepted: ${inj.message.slice(0, 90)}...`);
ok(inj.newPrice > priceBefore, `price pumped $${priceBefore.toFixed(4)} → $${inj.newPrice.toFixed(4)}`);
const st2 = MarketEngineService.getMyCoinStatus();
ok(st2.coin!.marketCap > mcapBefore, `market cap grew $${(mcapBefore / 1e6).toFixed(2)}M → $${(st2.coin!.marketCap / 1e6).toFixed(2)}M`);
const injTooSmall = MarketEngineService.injectCashIntoMyCoin('STARX', 5000, 2000000);
ok(!injTooSmall.success, 'rejects injections under $10k');
const injNoFunds = MarketEngineService.injectCashIntoMyCoin('STARX', 500000, 100000);
ok(!injNoFunds.success, 'rejects injection without cash');

// ---- 3. FAME-DRIVEN WEEKLY MOVES ----
console.log('\n[3] CAREER-DRIVEN PRICE (fame + box office + fans)');
const p3 = MarketEngineService.getMyCoinStatus().coin!.price;
let totalDrift = 0;
for (let w = 0; w < 8; w++) {
  const hot = w % 2 === 0;
  MarketEngineService.processEndWeek(10 + w, 2026, 1000000, {
    fameXp: 5000 + w * 400,
    fameDeltaPct: hot ? 8 : -2,
    lastReleasePerformance: hot ? 0.9 : -0.4,
    fanCount: 800000,
  });
  const now = MarketEngineService.getMyCoinStatus().coin!;
  totalDrift += now.change24h;
  console.log(`  W${10 + w}: ${hot ? 'HOT ' : 'cold'} career → $${now.price.toFixed(4)} (${now.change24h >= 0 ? '+' : ''}${now.change24h.toFixed(1)}%) rank #${MarketEngineService.getMyCoinStatus().rank} trust ${now.communityStrength}`);
}
const p3after = MarketEngineService.getMyCoinStatus().coin!.price;
ok(p3after !== p3, `price moved with career over 8 weeks: $${p3.toFixed(4)} → $${p3after.toFixed(4)} (cum ${totalDrift.toFixed(0)}%)`);

// ---- 4. FOUNDER DUMP SLIPPAGE ----
console.log('\n[4] FOUNDER DUMP SLIPPAGE (the old free-500k path)');
const st4 = MarketEngineService.getMyCoinStatus().coin!;
const smallSell = MarketEngineService.sellCrypto('STARX', st4.circulatingSupply * 0.005); // 0.5% — under threshold
ok(smallSell.success, `small sell fills at spot: $${smallSell.totalDollarRevenue.toFixed(2)}`);
// snapshot BEFORE the big dump (the service mutates the same coin object)
const preDump = MarketEngineService.getMyCoinStatus().coin!;
const prePrice = preDump.price;
const preTrust = preDump.communityStrength;
const dumpAmt = preDump.playerHoldings * 0.5; // dump HALF the founder allocation (5% of supply)
const spotValue = dumpAmt * prePrice;
const bigSell = MarketEngineService.sellCrypto('STARX', dumpAmt);
ok(bigSell.success, `founder dump executed: $${bigSell.totalDollarRevenue.toFixed(0)} vs spot $${spotValue.toFixed(0)}`);
ok(bigSell.totalDollarRevenue < spotValue * 0.55, `massive slippage — got ${((bigSell.totalDollarRevenue / spotValue) * 100).toFixed(0)}% of spot value (no free spot exit)`);
const st4c = MarketEngineService.getMyCoinStatus().coin!;
ok(st4c.price < prePrice, `price crashed on the dump: $${prePrice.toFixed(4)} → $${st4c.price.toFixed(4)}`);
ok(st4c.communityStrength < preTrust, `community damaged: ${preTrust} → ${st4c.communityStrength}`);
ok(st4c.playerHoldings > 0, `founder still holds ${Math.round(st4c.playerHoldings).toLocaleString()} tokens for the rug test`);

// ---- 5. RUGPULL ----
console.log('\n[5] RUG PULL + CONSEQUENCES');
const st5 = MarketEngineService.getMyCoinStatus().coin!;
const rug = MarketEngineService.rugPullMyCoin();
ok(rug.success, `rug executed: ${rug.message.slice(0, 80)}...`);
ok(rug.proceeds > 0 && rug.consequences, `netted $${rug.proceeds.toLocaleString()} after slippage, fine $${rug.consequences!.fine.toLocaleString()}, fans -${rug.consequences!.fansLostPct}%, fame -${rug.consequences!.fameHitPct}%`);
const st6 = MarketEngineService.getMyCoinStatus();
ok(st6.coin === null, 'coin is dead — no longer on the live exchange');
ok(st6.blacklisted, 'founder is blacklisted');

// ---- 6. BLACKLIST ----
console.log('\n[6] BLACKLIST');
const relaunch = MarketEngineService.launchPlayerCrypto('Star Power 2', 'STAR2', 0.5, 5000, 1000000);
ok(!relaunch.success, `relaunch blocked: ${relaunch.message.slice(0, 60)}...`);
const injDead = MarketEngineService.injectCashIntoMyCoin('STAR2', 500000, 2000000);
ok(!injDead.success, 'cannot inject into a non-existent token');

console.log(`\n========== ${pass} passed / ${fail} failed ==========`);
process.exit(fail > 0 ? 1 : 0);
