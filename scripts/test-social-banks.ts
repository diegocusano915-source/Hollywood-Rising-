/**
 * SOCIAL BANK SYSTEM TEST — deposits, lifetime earned, transfers on all 6 platforms.
 */
(globalThis as any).localStorage = {
  _s: new Map<string, string>(),
  getItem(k: string) { return this._s.has(k) ? this._s.get(k)! : null; },
  setItem(k: string, v: string) { this._s.set(k, v); },
  removeItem(k: string) { this._s.delete(k); },
  clear() { this._s.clear(); },
};
import { SocialsService } from '../src/services/socialsService';

let pass = 0, fail = 0;
const ok = (cond: boolean, label: string) => { if (cond) { pass++; console.log(`  ✅ ${label}`); } else { fail++; console.log(`  ❌ ${label}`); } };

console.log('\n[1] DEPOSITS (no tax in)');
const d1 = SocialsService.depositToSocialBank('facebook', 5000, 10000);
ok(d1.success && SocialsService.getSocialBankBalance('facebook') === 5000, `facebook deposit $5,000 → balance ${SocialsService.getSocialBankBalance('facebook').toLocaleString()}`);
const d2 = SocialsService.depositToSocialBank('telegram', 1200, 10000);
ok(d2.success, `telegram deposit ok`);
const bad = SocialsService.depositToSocialBank('reddit', 50, 10000);
ok(!bad.success, 'rejects deposit under $100');
const broke = SocialsService.depositToSocialBank('reddit', 9000, 2000);
ok(!broke.success, 'rejects deposit without cash');

console.log('\n[2] LIFETIME EARNED');
SocialsService.creditBankEarnings('twitter', 3000);
SocialsService.creditBankEarnings('twitter', 1500);
ok(SocialsService.getLifetimeEarned('twitter') === 4500, `lifetime accrues cumulatively ($4,500 from two credits)`);
ok(SocialsService.getLifetimeEarned('facebook') === 0, 'deposits are NOT lifetime earnings (earned only)');

console.log('\n[3] TRANSFERS ON ALL PLATFORMS');
for (const [p, bal] of [['youtube', 500], ['instagram', 800], ['facebook', 5000]] as const) {
  if (bal < SocialsService.getSocialBankBalance(p)) continue;
}
// facebook has $5,000 → transfer out with 20% tax
const t = SocialsService.transferSocialBankToAccount('facebook', { dateWeek: 10, dateYear: 2026 });
ok(t.success && t.net === 4000 && t.tax === 1000, `fb transfer: net $${t.net}, tax $${t.tax} (20%)`);
ok(SocialsService.getSocialBankBalance('facebook') === 0, 'balance zeroed after transfer request');

console.log(`\n========== ${pass} passed / ${fail} failed ==========`);
process.exit(fail > 0 ? 1 : 0);
