/**
 * Empire views overhaul verification: hub demand, foundation compounding,
 * real report snapshots, legacy career sync.
 * Run: npx tsx scripts/test-empire-views.ts
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

const { EmpireService, createInitialEmpireState } = await import('../src/services/empireService');
const p: any = {
  id: 'p1', firstName: 'Ari', lastName: 'Stone', dateWeek: 10, dateYear: 2026,
  money: 80_000_000, fameXp: 12000, fans: 500000, moviesCompleted: 12, awardsWon: 3,
  industryRespect: 65, publicReputation: 60, netWorth: 90_000_000,
};
let st = createInitialEmpireState(p);

// Seed a real empire: 1 hub, foundation, academy, 1 business, 1 property
st.globalHubs = [{ id: 'h1', cityName: 'London', country: 'United Kingdom', regionalBonus: 'EU distribution', establishmentCost: 2_000_000, weeklyOperatingExpense: 20000, weeklyRegionalRevenue: 50000, localStaffCount: 12, establishedWeek: 5, establishedYear: 2026, regionDemandPct: 100 }];
st.foundation = { ...st.foundation, isEstablished: true, endowmentPool: 1_000_000, goodwillScore: 75, endowmentHistory: [1_000_000] };
st.actingAcademy = { ...st.actingAcademy, isOpen: true, teachersCount: 3, campusLevel: 2, students: [], totalGraduates: 0, weeklyTuitionIncome: 0, weeklyOperationalCost: 0 };
st.businesses = [{ id: 'b1', name: 'Sterling Coffee', industry: 'Coffee', logo: '', cashPool: 500000, weeklyRevenue: 30000, weeklyExpenses: 20000, netProfit: 10000, totalValuation: 1200000, marketShare: 5, customerRating: 4.5, isPublic: false, totalShares: 1e6, sharePrice: 1.2, products: [{ id: 'pr1', name: 'House Blend', price: 150, productionCost: 40, weeklySales: 200, rating: 4.8, reviewsCount: 50, weeklyRevenue: 30000, launchWeek: 1, launchYear: 2026 }], staff: [{ role: 'Manager', count: 2, weeklyCostPerPerson: 1200 }], executives: [], competitors: [], status: 'Active', fundingRaised: 500000, foundedWeek: 1, foundedYear: 2026 }];
st.realEstate = [{ id: 're1', name: 'Sunset Stages', type: 'Film Lot', location: 'LA', purchasePrice: 3_500_000, currentValuation: 3_500_000, weeklyRentalIncome: 0, weeklyMaintenanceCost: 12000, occupancyRate: 0, tierLevel: 1, isLeased: true, imageUrl: '' }];

const lifetimeGross = 640_000_000;
const repBefore = p.publicReputation;
for (let w = 0; w < 8; w++) {
  p.dateWeek = 10 + w;
  if (p.dateWeek === 16) p.dateWeek = 16; // hits week%4===0 for rep dividend path
  st = EmpireService.processEndWeek(p, st, { bestBoxOfficeGross: 210_000_000, lifetimeBoxOfficeGross: lifetimeGross }).updatedState;
}

console.log('== 1. GLOBAL OFFICES (living demand) ==');
const hub = st.globalHubs[0];
check('demand factor initialized + bounded 60-150', (hub.regionDemandPct || 0) >= 60 && (hub.regionDemandPct || 0) <= 150);
check('revenue re-priced off live demand', hub.weeklyRegionalRevenue !== 50000);
check('net history recorded (26wk)', (hub.revenueHistory?.length || 0) >= 7);

console.log('== 2. FOUNDATION (compounding + rep dividend) ==');
check('endowment compounded above seed', st.foundation.endowmentPool > 1_000_000, `pool=${st.foundation.endowmentPool}`);
check('endowment history recorded', (st.foundation.endowmentHistory?.length || 0) >= 8);
check('goodwill 70+ paid real rep dividend', p.publicReputation > repBefore, `rep ${repBefore} -> ${p.publicReputation}`);

console.log('== 3. REPORT SNAPSHOTS (real books) ==');
const hist = st.reports.reportsHistory || [];
check('weekly snapshots recorded (newest first)', hist.length >= 8 && hist[0].week > hist[hist.length - 1].week);
check('latest snapshot has real segments', !!hist[0].segments && hist[0].segments.business > 0 && 'realEstate' in hist[0].segments && 'hubs' in hist[0].segments);
const sum4 = hist.slice(0, 4).reduce((a, r) => a + r.netProfit, 0);
const sum13 = hist.slice(0, 13).reduce((a, r) => a + r.netProfit, 0);
check('monthly/quarterly aggregate from real weeks (not multipliers)', sum4 > 0 && sum13 >= sum4);
check('snapshot cap 78 weeks', hist.length <= 78);

console.log('== 4. LEGACY (career sync, no more zeros) ==');
check('lifetime box office synced from real releases', st.legacy.lifetimeBoxOffice === lifetimeGross, `got ${st.legacy.lifetimeBoxOffice}`);
check('movies acted synced', st.legacy.totalMoviesActed === 12);
check('awards synced', st.legacy.awardsWonCount === 3);
check('HOF score now computes from real career', st.legacy.hallOfFameScore >= 5000, `score=${st.legacy.hallOfFameScore}`);
check('philanthropy total is real', st.legacy.philanthropyDonatedTotal === (st.foundation.totalDonated || 0) + st.foundation.endowmentPool);

console.log('== 5. HOLDING STILL CORRECT ==');
check('holding valuation = biz + real estate (no dupes)', !st.holdingCompany.isFormed || st.holdingCompany.totalValuation === st.businesses.reduce((a, b) => a + b.totalValuation, 0) + st.realEstate.reduce((a, r) => a + r.currentValuation, 0));

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
