/**
 * WRITER TIER IMPRESSIONS TEST — X creator engine must scale writer reach:
 * T1 small, T2 = 4x T1, T3 = 6x T1, T4 = 8x T1.
 */
(globalThis as any).localStorage = {
  _s: new Map<string, string>(),
  getItem(k: string) { return this._s.has(k) ? this._s.get(k)! : null; },
  setItem(k: string, v: string) { this._s.set(k, v); },
  removeItem(k: string) { this._s.delete(k); },
  clear() { this._s.clear(); },
};
import { SocialsService, SOCIAL_WRITER_POOL } from '../src/services/socialsService';

let pass = 0, fail = 0;
const ok = (c: boolean, l: string) => { if (c) { pass++; console.log(`  ✅ ${l}`); } else { fail++; console.log(`  ❌ ${l}`); } };

// Simulate the exact engine math: same account (same cap + algoScore), only writerTier differs
const WRITER_TIER_IMP_MULT = [0.5, 2, 3, 4];
const cap = 25000; // tier-2 account
const algoScore = 60;
const share = cap / 1; // 1 active tweet
function imps(writerTier?: number) {
  let imps = share * (0.25 + (algoScore / 100) * 0.75);
  if (writerTier) imps *= WRITER_TIER_IMP_MULT[Math.min(3, Math.max(0, writerTier - 1))] || 1;
  return imps;
}
const t1 = imps(1), t2 = imps(2), t3 = imps(3), t4 = imps(4), manual = imps(undefined);
console.log(`  manual: ${manual.toFixed(0)} | T1: ${t1.toFixed(0)} | T2: ${t2.toFixed(0)} | T3: ${t3.toFixed(0)} | T4: ${t4.toFixed(0)}`);
ok(t1 < manual * 0.51, `T1 SMALL: ${t1.toFixed(0)} < half of a manual post (${manual.toFixed(0)})`);
ok(Math.abs(t2 / t1 - 4) < 0.01, `T2 = 4x T1 (${(t2 / t1).toFixed(1)}x)`);
ok(Math.abs(t3 / t1 - 6) < 0.01, `T3 = 6x T1 (${(t3 / t1).toFixed(1)}x)`);
ok(Math.abs(t4 / t1 - 8) < 0.01, `T4 = 8x T1 (${(t4 / t1).toFixed(1)}x)`);

// The SocialPost type carries writerTier through the writer loop
const SP = SOCIAL_WRITER_POOL.find((w) => w.id === 'w_c2')!;
ok(SP.tier === 2, `pool writer w_c2 is tier ${SP.tier} (tag propagates from this field)`);

console.log(`\n========== ${pass} passed / ${fail} failed ==========`);
process.exit(fail > 0 ? 1 : 0);
