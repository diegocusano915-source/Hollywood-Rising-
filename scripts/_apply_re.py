import io, re

# ---- types ----
p = 'src/types/empire.ts'
src = io.open(p, encoding='utf-8').read()

old = """export interface CommercialRealEstate {
  id: string;
  name: string;
  type: RealEstateType;
  location: string;
  purchasePrice: number;
  currentValuation: number;
  weeklyRentalIncome: number;
  weeklyMaintenanceCost: number;
  occupancyRate: number; // percent
  occupancyStatus?: PropertyOccupancyStatus;
  tierLevel: number; // 1 - 5
  isLeased: boolean;
  imageUrl: string;
}"""
new = """export interface CommercialRealEstate {
  id: string;
  name: string;
  type: RealEstateType;
  location: string;
  purchasePrice: number;
  currentValuation: number;
  weeklyRentalIncome: number;
  weeklyMaintenanceCost: number;
  occupancyRate: number; // percent
  occupancyStatus?: PropertyOccupancyStatus;
  tierLevel: number; // 1 - 5
  isLeased: boolean;
  imageUrl: string;
  /** Weekly valuation snapshots (newest last, 26 weeks) for the sparkline */
  valuationHistory?: number[];
  /** Renovations applied over the property's life */
  upgradesDone?: number;
}

export type RealEstatePhase = 'Hot' | 'Stable' | 'Cooling' | 'Slump';

/** Living commercial property market \u2014 phase shifts every 3-4 weeks */
export interface RealEstateMarketState {
  phase: RealEstatePhase;
  weeksUntilShift: number;
}"""
assert old in src
src = src.replace(old, new, 1)

old2 = "  realEstate: CommercialRealEstate[];"
assert old2 in src
src = src.replace(old2, old2 + "\n  realEstateMarket?: RealEstateMarketState;", 1)
io.open(p, 'w', encoding='utf-8', newline='\n').write(src)
print('types done')

# ---- service ----
p = 'src/services/empireService.ts'
src = io.open(p, encoding='utf-8').read()

old_tick = """    // 2. COMMERCIAL REAL ESTATE SIMULATION
    let totalRentalIncome = 0;
    let totalPropertyMaintenance = 0;

    state.realEstate = state.realEstate.map((prop) => {
      const netRent = prop.weeklyRentalIncome - prop.weeklyMaintenanceCost;
      totalRentalIncome += prop.weeklyRentalIncome;
      totalPropertyMaintenance += prop.weeklyMaintenanceCost;

      // Real estate value appreciates ~0.1% per week
      const updatedValuation = Math.floor(prop.currentValuation * (1 + 0.001 * (0.8 + Math.random() * 0.4)));

      return {
        ...prop,
        currentValuation: updatedValuation,
      };
    });"""
new_tick = r"""    // 2. COMMERCIAL REAL ESTATE — LIVING MARKET (phase shifts every 3-4
    //    weeks; prices rise AND fall like the real market)
    let totalRentalIncome = 0;
    let totalPropertyMaintenance = 0;

    if (!state.realEstateMarket) state.realEstateMarket = { phase: 'Stable', weeksUntilShift: 4 };
    const reMarket = state.realEstateMarket;
    reMarket.weeksUntilShift -= 1;
    if (reMarket.weeksUntilShift <= 0) {
      const phases: RealEstatePhase[] = ['Hot', 'Stable', 'Cooling', 'Slump'];
      reMarket.phase = phases[Math.floor(Math.random() * phases.length)];
      reMarket.weeksUntilShift = 3 + Math.floor(Math.random() * 2); // 3-4 weeks
      const phaseNews: Record<RealEstatePhase, string> = {
        Hot: '\u{1F525} PROPERTY MARKET: rate cuts + tech relocations — commercial real estate is HOT. Values climbing fast.',
        Stable: '\u{1F3E0} PROPERTY MARKET: steady hands — valuations holding a stable drift.',
        Cooling: '\u{1F327}\uFE0F PROPERTY MARKET: higher financing costs — commercial values are COOLING.',
        Slump: '\u{1F4C9} PROPERTY MARKET: credit squeeze — a Slump is on. Values sliding week over week.',
      };
      logMessages.push(phaseNews[reMarket.phase]);
    }
    const driftByPhase: Record<RealEstatePhase, [number, number]> = {
      Hot: [0.008, 0.016],
      Stable: [0.0005, 0.003],
      Cooling: [-0.005, -0.002],
      Slump: [-0.012, -0.006],
    };
    const [driftLo, driftHi] = driftByPhase[reMarket.phase];
    const yieldByType: Record<RealEstateType, number> = {
      Hotel: 0.0016, 'Office Tower': 0.0014, 'Shopping Mall': 0.0013, 'Film Lot': 0.0019,
      'Apartment Complex': 0.0012, Resort: 0.0015, 'Industrial Building': 0.0010, Warehouse: 0.0009,
    };

    state.realEstate = state.realEstate.map((prop) => {
      // Valuation drifts with the market phase + small property noise
      const drift = driftLo + Math.random() * (driftHi - driftLo);
      const noise = (Math.random() - 0.5) * 0.002;
      const updatedValuation = Math.max(100000, Math.floor(prop.currentValuation * (1 + drift + noise)));

      // Occupancy breathes weekly for leased properties (real vacancy risk)
      let occupancy = prop.occupancyRate;
      if (prop.isLeased) {
        occupancy = Math.min(100, Math.max(55, Math.round(occupancy + (Math.random() - 0.45) * 6)));
      } else {
        occupancy = 0;
      }

      // Rent is earned ONLY when leased out, priced off live valuation
      const weeklyRent = prop.isLeased
        ? Math.max(1, Math.floor(updatedValuation * (yieldByType[prop.type] || 0.0012) * (occupancy / 100) * (1 + (prop.tierLevel - 1) * 0.1)))
        : 0;
      totalRentalIncome += weeklyRent;
      totalPropertyMaintenance += prop.weeklyMaintenanceCost;

      const history = [...(prop.valuationHistory || [prop.purchasePrice]), updatedValuation].slice(-26);

      return {
        ...prop,
        currentValuation: updatedValuation,
        weeklyRentalIncome: weeklyRent,
        occupancyRate: occupancy,
        occupancyStatus: prop.isLeased ? 'Rented' : 'Vacant',
        valuationHistory: history,
      };
    });"""
assert old_tick in src, 'old real estate tick not found'
src = src.replace(old_tick, new_tick, 1)

m2 = re.search(r"import \{([^]*?)\} from '\.\./types/empire';", src)
if m2 and 'RealEstatePhase' not in m2.group(1):
    src = src.replace(m2.group(0), m2.group(0).replace('import {', 'import { RealEstatePhase, RealEstateType,', 1), 1)
    print('import extended')

io.open(p, 'w', encoding='utf-8', newline='\n').write(src)
print('living real estate tick done')
