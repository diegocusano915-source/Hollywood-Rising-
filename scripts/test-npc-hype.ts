/**
 * NPC COIN HYPE TEST — airdrop ignites crypto personas + weekly chatter decays.
 */
(globalThis as any).localStorage = {
  _s: new Map<string, string>(),
  getItem(k: string) { return this._s.has(k) ? this._s.get(k)! : null; },
  setItem(k: string, v: string) { this._s.set(k, v); },
  removeItem(k: string) { this._s.delete(k); },
  clear() { this._s.clear(); },
};
import { SocialsService } from '../src/services/socialsService';
import { MarketEngineService } from '../src/services/marketEngineService';

let pass = 0, fail = 0;
const ok = (cond: boolean, label: string) => { if (cond) { pass++; console.log(`  ✅ ${label}`); } else { fail++; console.log(`  ❌ ${label}`); } };

// launch a coin so hype ties to something real
MarketEngineService.launchPlayerCrypto('Star Power', 'STARX', 0.5, 5000, 1000000, { totalSupply: 500000000, founderPct: 70, airdropPct: 15, liquidityPct: 15 });
const coin = MarketEngineService.getMyCoinStatus().coin!;

console.log('\n[1] IGNITE — claim posts fire instantly');
const feedBefore = (SocialsService.getState().playerPosts.Twitter || []).length;
SocialsService.igniteCoinHype({ symbol: 'STARX', coinName: 'Star Power', holders: coin.airdropHolders || 12000 });
let feed = SocialsService.getState().playerPosts.Twitter || [];
const added = feed.slice(0, feed.length - feedBefore);
ok(added.length >= 4 && added.length <= 6, `${added.length} NPC posts on ignition (3-5 claims + 1 analyst)`);
ok(added.filter((p) => p.tab === 'NPC_FEED' && p.text.includes('CLAIMED')).length >= 2, 'claim posts present with real claim language');
ok(SocialsService.getState().playerCoinHype?.symbol === 'STARX', `hype queue armed (${SocialsService.getState().playerCoinHype?.weeksLeft} weeks)`);

console.log('\n[2] WEEKLY TICKS — chatter continues then dies');
for (let w = 0; w < 5; w++) {
  const lines = SocialsService.tickCoinHype({ pricePct: 4.2, rank: 8, holders: coin.airdropHolders });
  const h = SocialsService.getState().playerCoinHype;
  console.log(`  W${w}: ${lines.length} recap line(s), weeksLeft=${h ? h.weeksLeft : 0}`);
}
ok(!SocialsService.getState().playerCoinHype, 'hype queue fully decayed after 4 weeks (no fake infinite hype)');
const afterDecay = SocialsService.tickCoinHype();
ok(afterDecay.length === 0, 'no chatter once decayed');

console.log(`\n========== ${pass} passed / ${fail} failed ==========`);
process.exit(fail > 0 ? 1 : 0);
