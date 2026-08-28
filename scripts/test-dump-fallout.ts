/**
 * FOUNDER DUMP FALLOUT TEST — dumpReport + audit + chatter chain.
 */
(globalThis as any).localStorage = {
  _s: new Map<string, string>(),
  getItem(k: string) { return this._s.has(k) ? this._s.get(k)! : null; },
  setItem(k: string, v: string) { this._s.set(k, v); },
  removeItem(k: string) { this._s.delete(k); },
  clear() { this._s.clear(); },
};
import { MarketEngineService } from '../src/services/marketEngineService';
import { SocialsService } from '../src/services/socialsService';
import { flagEmergencyCryptoAudit } from '../src/services/taxEngine';

let pass = 0, fail = 0;
const ok = (c: boolean, l: string) => { if (c) { pass++; console.log(`  ✅ ${l}`); } else { fail++; console.log(`  ❌ ${l}`); } };

console.log('\n[1] DUMP REPORT');
MarketEngineService.launchPlayerCrypto('Star Power', 'STARX', 0.5, 5000, 1000000, { totalSupply: 1000000000, founderPct: 70, airdropPct: 15, liquidityPct: 15 });
const coin = MarketEngineService.getMyCoinStatus().coin!;
const prePrice = coin.price;
const dumpAmt = coin.playerHoldings * 0.4; // 28% of supply
const res = MarketEngineService.sellCrypto('STARX', dumpAmt);
ok(res.success && !!res.dumpReport, 'sell returns a dumpReport');
const d = res.dumpReport!;
ok(d.supplyPct >= 25 && d.supplyPct <= 30, `supplyPct = ${d.supplyPct.toFixed(1)}%`);
ok(d.priceAfter < d.priceBefore * 0.5, `price crashed $${prePrice.toFixed(4)} → $${d.priceAfter.toFixed(4)}`);
ok(d.trustAfter < d.trustBefore, `trust damaged ${d.trustBefore} → ${d.trustAfter}`);
ok(d.proceeds < dumpAmt * prePrice * 0.6, `proceeds $${d.proceeds.toLocaleString()} — slippage haircut applied (${d.slipPct}%)`);

console.log('\n[2] EMERGENCY AUDIT');
// exchange flags the LIQUIDATION: max(realized gain, 40% of proceeds)
const flaggedBase = Math.max(Math.max(0, d.proceeds - dumpAmt * coin.playerAvgBuyPrice), Math.floor(d.proceeds * 0.4));
const noRep = flagEmergencyCryptoAudit({ week: 10, year: 2026, gainAmount: flaggedBase, accountantTier: 'None', lawyerActive: false, symbol: 'STARX' });
ok(noRep.subject.includes('EMERGENCY TAX AUDIT'), `audit ALWAYS opens: "${noRep.subject.slice(0, 45)}..."`);
ok(noRep.penalty === Math.floor(flaggedBase * 0.18), `no-representation penalty = 18% of flagged base $${flaggedBase.toLocaleString()} → $${noRep.penalty.toLocaleString()}`);
const elite = flagEmergencyCryptoAudit({ week: 10, year: 2026, gainAmount: flaggedBase, accountantTier: 'Elite Offshore Tax Attorneys', lawyerActive: false, symbol: 'STARX' });
ok(elite.penalty <= Math.floor(flaggedBase * 0.18 * 0.4) + 1, `elite accountants soften it ($${elite.penalty.toLocaleString()})`);

console.log('\n[3] NPC CHATTER + FOLLOWER DIP');
const st = SocialsService.getState();
st.followers.Twitter = 1000000;
SocialsService.saveState(st);
const feedBefore = (SocialsService.getState().playerPosts.Twitter || []).length;
const lines = SocialsService.spawnFounderDumpChatter({ symbol: 'STARX', supplyPct: d.supplyPct, slipPct: d.slipPct, priceBefore: prePrice, priceAfter: d.priceAfter });
const feed = SocialsService.getState().playerPosts.Twitter || [];
ok(feed.length > feedBefore, `${feed.length - feedBefore} NPC dump posts fired`);
ok(feed[0].text.includes('STARX'), `top post is about the dump: "${feed[0].text.slice(0, 60)}..."`);
ok(feed.some((p) => p.sentiment === 'Criticism'), 'posts are critical sentiment');
ok(SocialsService.getState().followers.Twitter < 1000000, `X followers dipped to ${SocialsService.getState().followers.Twitter.toLocaleString()}`);
ok(lines.length === 2, `recap lines returned (${lines[0].slice(0, 50)}...)`);

console.log(`\n========== ${pass} passed / ${fail} failed ==========`);
process.exit(fail > 0 ? 1 : 0);
