/**
 * HOLLYWOOD RISING - Box Office Engine Service (Phase 5)
 * Comprehensive Box Office & Release Simulation Engine.
 * Features:
 * - Permanent Top 200 Box Office
 * - Weekly ranking strictly based on CURRENT WEEKLY GROSS
 * - Realistic decay (Word of Mouth, Reviews, Competition, Franchise, Marketing, Seasonality, Awards)
 * - Continuous NPC Studio Releases & Progression
 * - Weekly Movements (NEW, ▲ Up, ▼ Down, → Same, OUT)
 * - All-Time Box Office Records (Highest Opening, Highest Gross, Longest #1, Flops, ROI, Fastest to $100M/$500M)
 * - Studio Performance Tracking (Hits, Flops, Market Share, Average Gross, Reputation)
 */

import { BoxOfficeItem, BoxOfficeRecordItem, StudioPerformance } from '../types/world';
import { ReleasedMovie } from '../types/game';
import { AWARD_ACTOR_POOL } from '../database/representationDatabase';

// REALISTIC THEATER FLOOR: a movie stops earning when weekly gross drops below this
// (theaters drop slow titles). The chart floor equals the run floor - no junk on the chart.
const THEATER_FLOOR_WEEKLY_GROSS = 1250000;
const MIN_CHART_WEEKLY_GROSS = THEATER_FLOOR_WEEKLY_GROSS;
// Player theatrical runs: up to 20 weeks (sequel greenlight window), extended to 26 with LEGS
const PLAYER_MAX_WEEKS = 20;
const PLAYER_MAX_EXTENDED_WEEKS = 26;
// NPC theatrical runs: 10 weeks, extended to 12 with LEGS
const NPC_MAX_WEEKS = 10;
const NPC_MAX_EXTENDED_WEEKS = 12;

const STORAGE_KEY = 'HOLLYWOOD_BOX_OFFICE_STATE_V1';

export interface BoxOfficeState {
  version: number;
  lastProcessedWeek: number;
  lastProcessedYear: number;
  items: BoxOfficeItem[];
  records: BoxOfficeRecordItem[];
  studios: StudioPerformance[];
  weeklyLogs: string[];
}

export const HOLLYWOOD_STUDIOS = [
  { id: 'st_disney', name: 'Walt Disney Studios', logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop', reputation: 95 },
  { id: 'st_wb', name: 'Warner Bros. Pictures', logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150&auto=format&fit=crop', reputation: 92 },
  { id: 'st_universal', name: 'Universal Pictures', logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=150&auto=format&fit=crop', reputation: 90 },
  { id: 'st_paramount', name: 'Paramount Pictures', logo: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=150&auto=format&fit=crop', reputation: 88 },
  { id: 'st_sony', name: 'Sony Pictures', logo: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=150&auto=format&fit=crop', reputation: 85 },
  { id: 'st_a24', name: 'A24', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=150&auto=format&fit=crop', reputation: 94 },
  { id: 'st_lionsgate', name: 'Lionsgate Films', logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=150&auto=format&fit=crop', reputation: 80 },
  { id: 'st_netflix', name: 'Netflix Studios', logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=150&auto=format&fit=crop', reputation: 86 },
  { id: 'st_apple', name: 'Apple Original Films', logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&auto=format&fit=crop', reputation: 89 },
];

const MOVIE_TITLE_PREFIXES = [
  'Chronicles of', 'Shadows of', 'The Last', 'Legacy of', 'Dawn of', 'Beyond the', 'Echoes of',
  'Secrets of', 'Rise of', 'The Golden', 'Infinite', 'Project', 'Kingdom of', 'The Dark', 'Furious',
  'Operation', 'Agent', 'Guardians of', 'Tales from', 'The Mystery of', 'Reign of'
];

const MOVIE_TITLE_NOUNS = [
  'Aethelgard', 'Nebula', 'Valhalla', 'Tomorrow', 'Eternity', 'Horizon', 'Steel', 'Vengeance',
  'Titan', 'Oasis', 'Paradise', 'Odyssey', 'Apex', 'Thunder', 'Protocol', 'Cipher', 'Dominion',
  'Eclipse', 'Spectrum', 'Immortal', 'Dynasty', 'Quantum', 'Gladiator'
];

const DIRECTORS = [
  'Denis Villeneuve', 'Christopher Nolan', 'Greta Gerwig', 'Steven Spielberg', 'James Cameron',
  'Ryan Coogler', 'Guillermo del Toro', 'Quentin Tarantino', 'Jordan Peele', 'Chloé Zhao',
  'Ridley Scott', 'Joseph Kosinski', 'Chad Stahelski', 'Jon Favreau', 'Martin Scorsese'
];

const GENRES_LIST = [
  ['Action', 'Sci-Fi'], ['Drama', 'Thriller'], ['Comedy', 'Romance'], ['Horror', 'Mystery'],
  ['Action', 'Adventure'], ['Sci-Fi', 'Drama'], ['Animation', 'Family'], ['Crime', 'Action'],
  ['Fantasy', 'Adventure'], ['Historical', 'Drama']
];

const POSTERS = [
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop'
];

// INITIAL SEED TOP 200 CATALOG
const SEED_BOX_OFFICE_ITEMS: BoxOfficeItem[] = [
  {
    id: 'bo_seed_1',
    title: 'Avatar: Fire and Ash',
    type: 'Movie',
    currentRank: 1,
    previousRank: 1,
    weeklyGross: 45000000,
    domesticGross: 710000000,
    internationalGross: 1410000000,
    worldwideGross: 2120000000,
    lifetimeGross: 2120000000,
    weeksReleased: 14,
    weeksInRelease: 14,
    movement: 'STABLE',
    studio: 'Walt Disney Studios',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    posterUrl: POSTERS[0],
    budget: 250000000,
    marketing: 150000000,
    criticRating: 88,
    audienceRating: 92,
    wordOfMouth: 92,
    inTheaters: true,
    openingWeekendGross: 185000000,
    director: 'James Cameron',
  },
  {
    id: 'bo_seed_2',
    title: 'Avengers: Secret Wars',
    type: 'Movie',
    currentRank: 2,
    previousRank: 2,
    weeklyGross: 38000000,
    domesticGross: 680000000,
    internationalGross: 1300000000,
    worldwideGross: 1980000000,
    lifetimeGross: 1980000000,
    weeksReleased: 10,
    weeksInRelease: 10,
    movement: 'STABLE',
    studio: 'Walt Disney Studios',
    genres: ['Action', 'Sci-Fi', 'Superhero'],
    posterUrl: POSTERS[1],
    budget: 300000000,
    marketing: 180000000,
    criticRating: 84,
    audienceRating: 90,
    wordOfMouth: 90,
    inTheaters: true,
    openingWeekendGross: 210000000,
    director: 'Ryan Coogler',
  },
  {
    id: 'bo_seed_3',
    title: 'Dune: Messiah',
    type: 'Movie',
    currentRank: 3,
    previousRank: 3,
    weeklyGross: 22000000,
    domesticGross: 320000000,
    internationalGross: 620000000,
    worldwideGross: 940000000,
    lifetimeGross: 940000000,
    weeksReleased: 8,
    weeksInRelease: 8,
    movement: 'STABLE',
    studio: 'Warner Bros. Pictures',
    genres: ['Sci-Fi', 'Drama'],
    posterUrl: POSTERS[2],
    budget: 190000000,
    marketing: 110000000,
    criticRating: 94,
    audienceRating: 95,
    wordOfMouth: 95,
    inTheaters: true,
    openingWeekendGross: 125000000,
    director: 'Denis Villeneuve',
  },
  {
    id: 'bo_seed_4',
    title: 'Gladiator III: Empire of Blood',
    type: 'Movie',
    currentRank: 4,
    previousRank: 5,
    weeklyGross: 18000000,
    domesticGross: 290000000,
    internationalGross: 490000000,
    worldwideGross: 780000000,
    lifetimeGross: 780000000,
    weeksReleased: 6,
    weeksInRelease: 6,
    movement: 'UP',
    studio: 'Paramount Pictures',
    genres: ['Action', 'Historical', 'Drama'],
    posterUrl: POSTERS[3],
    budget: 210000000,
    marketing: 100000000,
    criticRating: 82,
    audienceRating: 86,
    wordOfMouth: 86,
    inTheaters: true,
    openingWeekendGross: 95000000,
    director: 'Ridley Scott',
  },
  {
    id: 'bo_seed_5',
    title: 'The Batman: Part II',
    type: 'Movie',
    currentRank: 5,
    previousRank: 4,
    weeklyGross: 14000000,
    domesticGross: 450000000,
    internationalGross: 700000000,
    worldwideGross: 1150000000,
    lifetimeGross: 1150000000,
    weeksReleased: 12,
    weeksInRelease: 12,
    movement: 'DOWN',
    studio: 'Warner Bros. Pictures',
    genres: ['Action', 'Crime', 'Thriller'],
    posterUrl: POSTERS[4],
    budget: 200000000,
    marketing: 120000000,
    criticRating: 89,
    audienceRating: 91,
    wordOfMouth: 91,
    inTheaters: true,
    openingWeekendGross: 140000000,
    director: 'Matt Reeves',
  },
  {
    id: 'bo_seed_6',
    title: 'Stranger Things: Season 5',
    type: 'Series',
    currentRank: 6,
    previousRank: 7,
    weeklyGross: 0,
    domesticGross: 0,
    internationalGross: 0,
    worldwideGross: 0,
    lifetimeGross: 0,
    weeksReleased: 5,
    weeksInRelease: 5,
    movement: 'UP',
    studio: 'Netflix Studios',
    genres: ['Horror', 'Sci-Fi', 'Drama'],
    posterUrl: POSTERS[5],
    viewership: 145000000,
    seriesSeason: 5,
  },
  {
    id: 'bo_seed_7',
    title: 'The Last of Us: Season 2',
    type: 'Series',
    currentRank: 7,
    previousRank: 7,
    weeklyGross: 0,
    domesticGross: 0,
    internationalGross: 0,
    worldwideGross: 0,
    lifetimeGross: 0,
    weeksReleased: 7,
    weeksInRelease: 7,
    movement: 'STABLE',
    studio: 'Warner Bros. Pictures',
    genres: ['Drama', 'Post-Apocalyptic'],
    posterUrl: POSTERS[6],
    viewership: 98000000,
    seriesSeason: 2,
  },
  {
    id: 'bo_seed_8',
    title: 'Oppenheimer: The Aftermath',
    type: 'Movie',
    currentRank: 8,
    previousRank: 6,
    weeklyGross: 9500000,
    domesticGross: 320000000,
    internationalGross: 630000000,
    worldwideGross: 950000000,
    lifetimeGross: 950000000,
    weeksReleased: 16,
    weeksInRelease: 16,
    movement: 'DOWN',
    studio: 'Universal Pictures',
    genres: ['Biography', 'Drama', 'History'],
    posterUrl: POSTERS[2],
    budget: 100000000,
    marketing: 70000000,
    criticRating: 96,
    audienceRating: 94,
    wordOfMouth: 94,
    inTheaters: true,
    openingWeekendGross: 82000000,
    director: 'Christopher Nolan',
  },
];

// Generate additional initial seed items to reach 200 total items
const GENERATE_FULL_SEED_CHART = (): BoxOfficeItem[] => {
  const chart: BoxOfficeItem[] = [...SEED_BOX_OFFICE_ITEMS];

  for (let i = chart.length + 1; i <= 200; i++) {
    const isMovie = Math.random() > 0.25;
    const studioObj = HOLLYWOOD_STUDIOS[Math.floor(Math.random() * HOLLYWOOD_STUDIOS.length)];
    const genres = GENRES_LIST[Math.floor(Math.random() * GENRES_LIST.length)];
    const prefix = MOVIE_TITLE_PREFIXES[Math.floor(Math.random() * MOVIE_TITLE_PREFIXES.length)];
    const noun = MOVIE_TITLE_NOUNS[Math.floor(Math.random() * MOVIE_TITLE_NOUNS.length)];
    const title = `${prefix} ${noun}`;
    const budget = Math.floor((15 + Math.random() * 180) * 1000000);
    const marketing = Math.floor(budget * (0.4 + Math.random() * 0.4));
    const criticRating = Math.floor(55 + Math.random() * 42);
    const audienceRating = Math.floor(50 + Math.random() * 46);
    const multiplier = 1.2 + Math.random() * 4.5;
    const worldwide = Math.floor((budget + marketing) * multiplier);
    const domestic = Math.floor(worldwide * (0.35 + Math.random() * 0.2));
    const international = worldwide - domestic;

    chart.push({
      id: `bo_seed_gen_${i}`,
      title,
      type: isMovie ? 'Movie' : 'Series',
      currentRank: i,
      previousRank: i + Math.floor(Math.random() * 5 - 2),
      weeklyGross: isMovie ? Math.floor((1 + Math.random() * 8) * 1000000) : 0,
      domesticGross: isMovie ? domestic : 0,
      internationalGross: isMovie ? international : 0,
      worldwideGross: isMovie ? worldwide : 0,
      lifetimeGross: isMovie ? worldwide : 0,
      weeksReleased: Math.floor(1 + Math.random() * 12),
      weeksInRelease: Math.floor(1 + Math.random() * 12),
      movement: 'STABLE',
      studio: studioObj.name,
      genres,
      posterUrl: POSTERS[i % POSTERS.length],
      budget: isMovie ? budget : undefined,
      marketing: isMovie ? marketing : undefined,
      criticRating,
      audienceRating,
      wordOfMouth: audienceRating,
      inTheaters: isMovie && i <= 35,
      openingWeekendGross: isMovie ? Math.floor(worldwide * 0.25) : 0,
      viewership: !isMovie ? Math.floor((10 + Math.random() * 80) * 1000000) : undefined,
      director: DIRECTORS[i % DIRECTORS.length],
    });
  }

  return chart;
};

// Initial Records Data
export const INITIAL_BOX_OFFICE_RECORDS: BoxOfficeRecordItem[] = [
  {
    id: 'rec_1',
    recordType: 'Highest Opening Weekend',
    movieTitle: 'Avengers: Endgame',
    studio: 'Walt Disney Studios',
    valueFormatted: '$357.1 Million',
    numericValue: 357100000,
    year: 2019,
    posterUrl: POSTERS[1],
    description: 'Broke all global theatrical records with unprecedented multi-screen IMAX debut.',
  },
  {
    id: 'rec_2',
    recordType: 'Highest Lifetime Gross',
    movieTitle: 'Avatar',
    studio: 'Walt Disney Studios',
    valueFormatted: '$2.923 Billion',
    numericValue: 2923000000,
    year: 2009,
    posterUrl: POSTERS[0],
    description: 'James Cameron 3D masterpiece remains the highest grossing theatrical motion picture in cinema history.',
  },
  {
    id: 'rec_3',
    recordType: 'Longest #1',
    movieTitle: 'Titanic',
    studio: 'Paramount Pictures',
    valueFormatted: '15 Consecutive Weeks',
    numericValue: 15,
    year: 1997,
    posterUrl: POSTERS[3],
    description: 'Dominated North American theatrical box office at #1 for 15 straight weeks.',
  },
  {
    id: 'rec_4',
    recordType: 'Biggest Flop',
    movieTitle: 'The Flash',
    studio: 'Warner Bros. Pictures',
    valueFormatted: '-$155 Million Loss',
    numericValue: -155000000,
    year: 2023,
    posterUrl: POSTERS[4],
    description: 'High production & marketing overhead vs disappointing theatrical turnout led to record studio write-down.',
  },
  {
    id: 'rec_5',
    recordType: 'Highest ROI',
    movieTitle: 'The Blair Witch Project',
    studio: 'Lionsgate Films',
    valueFormatted: '4,000x Return on Budget',
    numericValue: 4000,
    year: 1999,
    posterUrl: POSTERS[5],
    description: 'Micro-budget $60k indie film grossed over $248 Million worldwide.',
  },
  {
    id: 'rec_6',
    recordType: 'Fastest to $100M',
    movieTitle: 'Avengers: Endgame',
    studio: 'Walt Disney Studios',
    valueFormatted: '17 Hours (Day 1)',
    numericValue: 1,
    year: 2019,
    posterUrl: POSTERS[1],
    description: 'Crossed $100M domestic in under 24 hours from Thursday night previews.',
  },
  {
    id: 'rec_7',
    recordType: 'Fastest to $500M',
    movieTitle: 'Avengers: Endgame',
    studio: 'Walt Disney Studios',
    valueFormatted: '8 Days Worldwide',
    numericValue: 8,
    year: 2019,
    posterUrl: POSTERS[1],
    description: 'Smashed the $500M global milestone in just over a single week.',
  },
];

export class BoxOfficeEngineService {
  private static stateCache: BoxOfficeState | null = null;

  public static getState(): BoxOfficeState {
    if (this.stateCache && this.stateCache.items && this.stateCache.items.length >= 200) {
      return this.stateCache;
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: BoxOfficeState = JSON.parse(data);
        if (parsed.items && parsed.items.length > 0) {
          // Top up active items if under 200
          parsed.items = this.ensureTop200Full(parsed.items, parsed.lastProcessedWeek || 1, parsed.lastProcessedYear || 2026);
          this.stateCache = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // Default Fallback Initial State
    const seedChart = GENERATE_FULL_SEED_CHART();
    const initialState: BoxOfficeState = {
      version: 1,
      lastProcessedWeek: 1,
      lastProcessedYear: 2026,
      items: seedChart,
      records: INITIAL_BOX_OFFICE_RECORDS,
      studios: this.calculateStudioPerformances(seedChart),
      weeklyLogs: ['Hollywood Box Office & Release System initialized.'],
    };

    this.saveState(initialState);
    return initialState;
  }

  // Ensure Top 200 is always filled with 200 active movies
  private static ensureTop200Full(
    items: BoxOfficeItem[],
    week: number,
    year: number
  ): BoxOfficeItem[] {
    // Active movies (inTheaters && weeklyGross >= realistic floor) - dynamic run caps
    let validActive = items.filter((item) => {
      if (!item.inTheaters) return false;
      if ((item.weeklyGross || 0) < MIN_CHART_WEEKLY_GROSS && !item.isPlayerMovie) return false;
      if (item.isPlayerMovie) {
        return (item.weeksReleased || 1) <= ((item as any).extendedRun ? PLAYER_MAX_EXTENDED_WEEKS : PLAYER_MAX_WEEKS);
      }
      return (item.weeksReleased || 1) <= ((item as any).extendedRun ? NPC_MAX_EXTENDED_WEEKS : NPC_MAX_WEEKS);
    });

    const activeIds = new Set(validActive.map((i) => i.id));

    // Top up to 200 items if under 200
    while (validActive.length < 200) {
      const newIndex = validActive.length + 1;
      const studioObj = HOLLYWOOD_STUDIOS[Math.floor(Math.random() * HOLLYWOOD_STUDIOS.length)];
      const genres = GENRES_LIST[Math.floor(Math.random() * GENRES_LIST.length)];
      const prefix = MOVIE_TITLE_PREFIXES[Math.floor(Math.random() * MOVIE_TITLE_PREFIXES.length)];
      const noun = MOVIE_TITLE_NOUNS[Math.floor(Math.random() * MOVIE_TITLE_NOUNS.length)];
      const title = `${prefix} ${noun}`;
      const director = DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)];

      const budget = Math.floor((40 + Math.random() * 210) * 1000000);
      const marketing = Math.floor(budget * (0.4 + Math.random() * 0.5));
      const criticRating = Math.floor(52 + Math.random() * 44);
      const audienceRating = Math.floor(55 + Math.random() * 42);
      const actor = AWARD_ACTOR_POOL[Math.floor(Math.random() * AWARD_ACTOR_POOL.length)];

      // Estimate weekly gross based on target rank position - REALISTIC FLOOR
      const targetRank = newIndex;
      const baseWeekly = Math.max(MIN_CHART_WEEKLY_GROSS, Math.floor(95000000 / Math.pow(targetRank, 1.22)));
      const openingGross = Math.max(baseWeekly * 2.2, Math.floor(budget * (0.18 + Math.random() * 0.35)));
      const weeksReleased = Math.floor(1 + Math.random() * 9);

      const newItem: BoxOfficeItem = {
        id: `npc_fill_w${week}_y${year}_${newIndex}_${Math.random().toString(36).substring(2, 6)}`,
        title,
        type: 'Movie',
        currentRank: targetRank,
        previousRank: targetRank,
        weeklyGross: baseWeekly,
        openingWeekendGross: openingGross,
        domesticGross: Math.floor(openingGross * 1.8 + baseWeekly * weeksReleased * 0.5),
        internationalGross: Math.floor(openingGross * 2.2 + baseWeekly * weeksReleased * 0.6),
        worldwideGross: 0,
        lifetimeGross: 0,
        weeksReleased,
        weeksInRelease: weeksReleased,
        movement: 'NEW',
        studio: studioObj.name,
        genres,
        posterUrl: POSTERS[newIndex % POSTERS.length],
        budget,
        marketing,
        criticRating,
        audienceRating,
        wordOfMouth: audienceRating,
        inTheaters: true,
        releaseWeek: Math.max(1, week - weeksReleased + 1),
        releaseYear: year,
        director,
        leadActor: actor.name,
      };
      newItem.worldwideGross = newItem.domesticGross + newItem.internationalGross;
      newItem.lifetimeGross = newItem.worldwideGross;

      validActive.push(newItem);
      activeIds.add(newItem.id);
    }

    // Re-sort by weeklyGross descending
    validActive.sort((a, b) => b.weeklyGross - a.weeklyGross);

    // Reassign ranks 1 through 200
    validActive.forEach((item, index) => {
      item.currentRank = index + 1;
    });

    return validActive;
  }

  /**
   * THEATER EXPANSION: player pays marketing to halve the weekly drop for 2 weeks.
   * Cooldown: 4 weeks. Real effect, real money, no fake simulation.
   */
  public static launchTheaterExpansion(
    playerMovieId: string,
    week: number,
    cost: number
  ): { success: boolean; message: string } {
    const state = this.getState();
    const item = state.items.find(
      (i) => i.isPlayerMovie && (i.playerMovieId === playerMovieId || i.id === `player_bo_${playerMovieId}`)
    );
    if (!item || !item.inTheaters) {
      return { success: false, message: 'This movie is not currently in theaters.' };
    }
    if ((item as any).expansionWeeksLeft && (item as any).expansionWeeksLeft > 0) {
      return { success: false, message: 'A theater expansion is already active for this movie.' };
    }
    if ((item as any).expansionCooldownWeek && week - (item as any).expansionCooldownWeek < 4) {
      const wait = 4 - (week - (item as any).expansionCooldownWeek);
      return { success: false, message: `Theater expansion on cooldown — ${wait} week(s) left.` };
    }
    (item as any).expansionWeeksLeft = 2;
    (item as any).expansionCooldownWeek = week;
    this.saveState(state);
    return {
      success: true,
      message: `📈 Theater expansion launched! Weekly drop halved for 2 weeks ($${cost.toLocaleString()} marketing).`,
    };
  }

  /** Run status for the player film cards: current week, max weeks, projected weeks left. */
  public static getPlayerMovieRunInfo(movieId: string): {
    week: number;
    maxWeeks: number;
    projectedWeeksLeft: number;
    belowFloor: boolean;
    expanded: boolean;
  } | null {
    try {
      const state = this.getState();
      const item = state.items.find(
        (i) => i.isPlayerMovie && (i.playerMovieId === movieId || i.id === `player_bo_${movieId}`)
      );
      if (!item) return null;
      const week = item.weeksReleased || item.weeksInRelease || 1;
      const maxWeeks = (item as any).extendedRun ? PLAYER_MAX_EXTENDED_WEEKS : PLAYER_MAX_WEEKS;
      const prev = (item as any).previousWeeklyGross || item.weeklyGross || 0;
      const cur = item.weeklyGross || 0;
      let projectedWeeksLeft = 0;
      if (cur > 0 && prev >= cur) {
        const dropPct = Math.max(0.15, 1 - cur / Math.max(1, prev));
        let proj = cur;
        while (proj >= THEATER_FLOOR_WEEKLY_GROSS && projectedWeeksLeft < 20) {
          proj = Math.floor(proj * (1 - dropPct));
          projectedWeeksLeft += 1;
        }
      } else if (cur > 0) {
        projectedWeeksLeft = Math.max(1, maxWeeks - week);
      }
      return {
        week,
        maxWeeks,
        projectedWeeksLeft,
        belowFloor: cur < THEATER_FLOOR_WEEKLY_GROSS,
        expanded: !!((item as any).expansionWeeksLeft && (item as any).expansionWeeksLeft > 0),
      };
    } catch {
      return null;
    }
  }

  public static saveState(state: BoxOfficeState): void {
    try {
      this.stateCache = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  // Generate 1-3 New NPC Theatrical Releases
  private static generateNpcReleases(week: number, year: number): BoxOfficeItem[] {
    const releasesCount = Math.floor(1 + Math.random() * 2.5);
    const newReleases: BoxOfficeItem[] = [];

    for (let i = 0; i < releasesCount; i++) {
      const studioObj = HOLLYWOOD_STUDIOS[Math.floor(Math.random() * HOLLYWOOD_STUDIOS.length)];
      const genres = GENRES_LIST[Math.floor(Math.random() * GENRES_LIST.length)];
      const prefix = MOVIE_TITLE_PREFIXES[Math.floor(Math.random() * MOVIE_TITLE_PREFIXES.length)];
      const noun = MOVIE_TITLE_NOUNS[Math.floor(Math.random() * MOVIE_TITLE_NOUNS.length)];
      const title = `${prefix} ${noun}`;
      const director = DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)];

      const budget = Math.floor((40 + Math.random() * 210) * 1000000);
      const marketing = Math.floor(budget * (0.4 + Math.random() * 0.5));
      const criticRating = Math.floor(50 + Math.random() * 46);
      const audienceRating = Math.floor(55 + Math.random() * 42);
      const actor = AWARD_ACTOR_POOL[Math.floor(Math.random() * AWARD_ACTOR_POOL.length)];

      // Opening Weekend Calculation based on budget, marketing, ratings & seasonality
      const isSummerOrHoliday = (week >= 20 && week <= 35) || (week >= 48 && week <= 52);
      const seasonMult = isSummerOrHoliday ? 1.35 : 1.0;
      const baseOpening = (budget * 0.16) + (marketing * 0.25);
      const ratingMult = (criticRating * 0.4 + audienceRating * 0.6) / 100;
      const openingGross = Math.max(4000000, Math.floor(baseOpening * ratingMult * seasonMult * (0.8 + Math.random() * 0.5)));

      const item: BoxOfficeItem = {
        id: `npc_rel_w${week}_y${year}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        title,
        type: 'Movie',
        currentRank: 0,
        previousRank: null,
        weeklyGross: openingGross,
        domesticGross: Math.floor(openingGross * 1.8),
        internationalGross: Math.floor(openingGross * 2.4),
        worldwideGross: Math.floor(openingGross * 4.2),
        lifetimeGross: Math.floor(openingGross * 4.2),
        weeksReleased: 1,
        weeksInRelease: 1,
        movement: 'NEW',
        studio: studioObj.name,
        genres,
        posterUrl: POSTERS[Math.floor(Math.random() * POSTERS.length)],
        budget,
        marketing,
        criticRating,
        audienceRating,
        wordOfMouth: audienceRating,
        inTheaters: true,
        releaseWeek: week,
        releaseYear: year,
        openingWeekendGross: openingGross,
        director,
        leadActor: actor.name,
      };

      newReleases.push(item);
    }

    return newReleases;
  }

  // Main End Week Simulation Tick
  public static processEndWeek(
    currentWeek: number,
    currentYear: number,
    playerReleasedMovies: ReleasedMovie[] = []
  ): BoxOfficeState {
    const state = this.getState();
    const logs: string[] = [];

    // 1. Synchronize Player Released Movies into Box Office System
    const existingPlayerMovieIds = new Set(
      state.items.filter((i) => i.isPlayerMovie).map((i) => i.playerMovieId || i.id)
    );

    const mergedItems: BoxOfficeItem[] = [...state.items];

    playerReleasedMovies.forEach((pMovie) => {
      const pId = pMovie.id;
      if (!existingPlayerMovieIds.has(pId)) {
        // Fresh Player Movie entering Box Office!
        const opening = pMovie.openingWeekendGross || 25000000;
        const dom = pMovie.domesticGross || Math.floor(opening * 2.5);
        const ww = pMovie.worldwideGross || Math.floor(opening * 5.2);
        const intl = ww - dom;

        const playerItem: BoxOfficeItem = {
          id: `player_bo_${pMovie.id}`,
          playerMovieId: pMovie.id,
          title: pMovie.movieTitle,
          type: 'Movie',
          currentRank: pMovie.boxOfficePosition || 1,
          previousRank: null,
          weeklyGross: opening,
          domesticGross: dom,
          internationalGross: intl,
          worldwideGross: ww,
          lifetimeGross: ww,
          weeksReleased: pMovie.weeksInCinemas || 1,
          weeksInRelease: pMovie.weeksInCinemas || 1,
          movement: 'NEW',
          studio: pMovie.studio || 'Player Independent Production',
          genres: [pMovie.genre || 'Blockbuster'],
          posterUrl: pMovie.posterUrl || POSTERS[0],
          isPlayerMovie: true,
          budget: pMovie.budget || 30000000,
          marketing: Math.floor((pMovie.budget || 30000000) * 0.5),
          criticRating: pMovie.criticRating || 85,
          audienceRating: pMovie.audienceRating || 88,
          wordOfMouth: pMovie.audienceRating || 88,
          inTheaters: pMovie.inCinemas ?? true,
          releaseWeek: pMovie.releaseWeek || currentWeek,
          releaseYear: pMovie.releaseYear || currentYear,
          openingWeekendGross: opening,
          director: pMovie.director || 'Player Director',
        };
        (playerItem as any).isFirstWeek = true;

        mergedItems.unshift(playerItem);
        logs.push(`🎬 PLAYER RELEASE: '${pMovie.movieTitle}' opened with $${(opening / 1000000).toFixed(1)}M!`);
      } else {
        // Sync player movie state
        const itemIdx = mergedItems.findIndex((i) => i.playerMovieId === pId || i.id === `player_bo_${pId}`);
        if (itemIdx !== -1) {
          mergedItems[itemIdx].inTheaters = (pMovie.weeksInCinemas && pMovie.weeksInCinemas > PLAYER_MAX_WEEKS) ? false : pMovie.inCinemas;
          if (pMovie.awardsWon) {
            mergedItems[itemIdx].criticRating = Math.min(100, (mergedItems[itemIdx].criticRating || 80) + 2);
          }
        }
      }
    });

    // 2. Generate Continuous NPC Studio Releases
    const npcReleases = this.generateNpcReleases(currentWeek, currentYear);
    npcReleases.forEach((rel) => {
      (rel as any).isFirstWeek = true;
      mergedItems.unshift(rel);
      logs.push(`📽️ HOLLYWOOD RELEASE: ${rel.studio} released '${rel.title}' ($${(rel.openingWeekendGross! / 1000000).toFixed(1)}M Opening).`);
    });

    // 3. Process Weekly Decay & Leg Simulation for Active Theatrical Releases
    const isSummerOrHoliday = (currentWeek >= 20 && currentWeek <= 35) || (currentWeek >= 48 && currentWeek <= 52);
    const seasonFactor = isSummerOrHoliday ? 1.25 : 1.0;

    mergedItems.forEach((item) => {
      if (item.type !== 'Movie') return;

      // AWARD RE-RELEASE (Oscar bump): award-winning movies re-enter theaters for 2 weeks
      const awardBoost = (item as any).awardBoostWeeks || 0;
      if (awardBoost > 0 && !item.inTheaters) {
        item.inTheaters = true;
        item.movement = 'RE-ENTRY';
        logs.push(`🏆 OSCAR BUMP: '${item.title}' re-enters theaters after its award win!`);
      }

      if (item.inTheaters) {
        if ((item as any).isFirstWeek === true) {
          // First week opening
          item.weeksReleased = 1;
          item.weeksInRelease = 1;
          (item as any).isFirstWeek = false;
          item.movement = 'NEW';
        } else {
          // Week 2+ Decay Calculation & Cumulative Gross Increase
          item.weeksReleased = (item.weeksReleased || item.weeksInRelease || 1) + 1;
          item.weeksInRelease = item.weeksReleased;

          // Word of Mouth (Audience Score) determines drop %
          const wom = item.wordOfMouth || item.audienceRating || 70;
          // High WOM (90+) gives lower drop (~32%), Low WOM (40) gives higher drop (~68%)
          const baseDropPct = Math.max(0.28, Math.min(0.72, 0.82 - (wom * 0.0055)));

          // Critic Rating bonus
          const criticBonus = ((item.criticRating || 70) > 80) ? 0.08 : 0;
          let decayMult = Math.max(0.20, (1 - baseDropPct) + criticBonus) * seasonFactor;

          // THEATER EXPANSION (player agency): halves the weekly drop for 2 weeks
          if ((item as any).expansionWeeksLeft && (item as any).expansionWeeksLeft > 0) {
            decayMult = (1 + decayMult) / 2; // half the drop
            (item as any).expansionWeeksLeft -= 1;
          }

          const oldWeekly = item.weeklyGross || 5000000;
          (item as any).previousWeeklyGross = oldWeekly;
          const newWeekly = Math.round(oldWeekly * decayMult);
          item.weeklyGross = newWeekly;

          // AWARD RE-RELEASE BUMP (Oscar bump): winning movies surge for 2 weeks
          const awardBoostWeeks = (item as any).awardBoostWeeks || 0;
          if (awardBoostWeeks > 0) {
            const bump = (item as any).awardBumpRemaining || 12000000;
            item.weeklyGross = Math.max(item.weeklyGross, bump);
            (item as any).awardBoostWeeks = awardBoostWeeks - 1;
            (item as any).awardBumpRemaining = Math.floor(bump * 0.55);
          }

          // Accumulate domestic, international, worldwide, and lifetime gross
          const addDom = Math.round(newWeekly * 0.45);
          const addIntl = Math.round(newWeekly * 0.55);
          const prevDom = item.domesticGross || item.grossDomestic || 0;
          const prevIntl = item.internationalGross || item.grossInternational || 0;
          const prevWW = item.worldwideGross || item.grossWorldwide || item.lifetimeGross || 0;

          // Enforce $5 Billion lifetime cap on movies
          const MAX_MOVIE_LIFETIME = 500000000000;
          item.domesticGross = Math.min(MAX_MOVIE_LIFETIME * 0.45, prevDom + addDom);
          item.internationalGross = Math.min(MAX_MOVIE_LIFETIME * 0.55, prevIntl + addIntl);
          item.worldwideGross = Math.min(MAX_MOVIE_LIFETIME, Math.max(prevWW, item.domesticGross + item.internationalGross));
          item.lifetimeGross = item.worldwideGross;

          // DYNAMIC THEATRICAL RUNS: movies leave when they stop earning (realistic).
          // Flops die fast, hits run long, blockbusters earn LEGS, awards extend runs.
          const isPlayerMovie = !!item.isPlayerMovie;
          const maxWeeks = isPlayerMovie
            ? ((item as any).extendedRun ? PLAYER_MAX_EXTENDED_WEEKS : PLAYER_MAX_WEEKS)
            : ((item as any).extendedRun ? NPC_MAX_EXTENDED_WEEKS : NPC_MAX_WEEKS);

          // LEGS: blockbusters earn extended runs
          if (!(item as any).extendedRun) {
            if (isPlayerMovie && item.weeksReleased >= 18 && (item.weeklyGross || 0) >= 8000000) {
              (item as any).extendedRun = true;
              logs.push(`🦵 LEGS! '${item.title}' still pulls $${((item.weeklyGross || 0) / 1000000).toFixed(1)}M weekly — extended to ${PLAYER_MAX_EXTENDED_WEEKS} weeks!`);
            } else if (!isPlayerMovie && item.weeksReleased >= 8 && (item.weeklyGross || 0) >= 10000000) {
              (item as any).extendedRun = true;
              logs.push(`🦵 LEGS! '${item.title}' extends its run to ${NPC_MAX_EXTENDED_WEEKS} weeks!`);
            }
          }

          // Below the theater floor the movie stops earning; flops still get a short run (min 2-3 weeks)
          const belowFloor = (item.weeklyGross || 0) < THEATER_FLOOR_WEEKLY_GROSS;
          const minRunWeeks = isPlayerMovie ? 3 : 2;
          const boosting = ((item as any).awardBoostWeeks || 0) > 0;
          if (!boosting && (item.weeksReleased >= maxWeeks || (belowFloor && item.weeksReleased >= minRunWeeks))) {
            item.inTheaters = false;
            item.weeklyGross = 0;
            item.movement = 'OUT';
            logs.push(`🏛️ THEATRICAL RUN CONCLUDED: '${item.title}' ends its ${item.weeksReleased}-week run with $${(item.worldwideGross / 1000000).toFixed(1)}M Total Gross.`);
          }
        }
      } else {
        item.weeklyGross = 0;
      }

      // Mandatory Cap Enforcement (dynamic: extended runs allowed, floor enforced for NPC)
      const hardMax = item.isPlayerMovie
        ? ((item as any).extendedRun ? PLAYER_MAX_EXTENDED_WEEKS : PLAYER_MAX_WEEKS)
        : ((item as any).extendedRun ? NPC_MAX_EXTENDED_WEEKS : NPC_MAX_WEEKS);
      const isBoosting = ((item as any).awardBoostWeeks || 0) > 0;
      if (!isBoosting && ((item.weeksReleased && item.weeksReleased >= hardMax) ||
          (item.weeksInRelease && item.weeksInRelease >= hardMax) ||
          (!item.isPlayerMovie && (item.weeklyGross || 0) < MIN_CHART_WEEKLY_GROSS && (item.weeksReleased || 0) >= 2))) {
        item.inTheaters = false;
        item.weeklyGross = 0;
        item.movement = 'OUT';
      }
    });

    // 4. Sort Active Theatrical Releases ONLY for the active Box Office Chart!
    let activeTheatrical = mergedItems.filter((i) => i.type === 'Movie' && i.inTheaters && i.weeklyGross > 0);

    // Top up to 200 items if needed
    activeTheatrical = this.ensureTop200Full(activeTheatrical, currentWeek, currentYear);

    // Assign Ranks & Movements for Active Chart
    activeTheatrical.forEach((item, index) => {
      const newRank = index + 1;
      const prevRank = item.currentRank;

      item.previousRank = prevRank || null;
      item.currentRank = newRank;

      if ((item as any).isFirstWeek || item.weeksReleased === 1) {
        item.movement = 'NEW';
      } else if (prevRank && newRank < prevRank) {
        item.movement = 'UP';
      } else if (prevRank && newRank > prevRank) {
        item.movement = 'DOWN';
      } else {
        item.movement = 'STABLE';
      }

      // Legacy field fallbacks
      item.weeksInRelease = item.weeksReleased;
      item.grossWorldwide = item.worldwideGross;
      item.grossDomestic = item.domesticGross;
      item.grossInternational = item.internationalGross;
    });

    // Update Box Office Records and Studio Performance Metrics using ALL movies (active + historical)
    const updatedRecords = this.updateRecords(mergedItems, state.records, currentYear);
    const updatedStudios = this.calculateStudioPerformances(mergedItems);

    const newState: BoxOfficeState = {
      version: 1,
      lastProcessedWeek: currentWeek,
      lastProcessedYear: currentYear,
      items: activeTheatrical, // Always contains 200 ACTIVE movies
      records: updatedRecords,
      studios: updatedStudios,
      weeklyLogs: logs,
    };

    this.saveState(newState);
    return newState;
  }

  // Update All-Time Records
  private static updateRecords(
    chart: BoxOfficeItem[],
    currentRecords: BoxOfficeRecordItem[],
    currentYear: number
  ): BoxOfficeRecordItem[] {
    const recordsMap: Record<string, BoxOfficeRecordItem> = {};
    currentRecords.forEach((r) => {
      recordsMap[r.recordType] = { ...r };
    });

    chart.forEach((item) => {
      if (item.type !== 'Movie') return;

      const totalBudget = (item.budget || 30000000) + (item.marketing || 15000000);
      const roi = item.worldwideGross / Math.max(100000, totalBudget);

      // Highest Opening Weekend
      if (item.openingWeekendGross && item.openingWeekendGross > (recordsMap['Highest Opening Weekend']?.numericValue || 0)) {
        recordsMap['Highest Opening Weekend'] = {
          id: `rec_ow_${item.id}`,
          recordType: 'Highest Opening Weekend',
          movieTitle: item.title,
          studio: item.studio,
          valueFormatted: `$${(item.openingWeekendGross / 1000000).toFixed(1)} Million`,
          numericValue: item.openingWeekendGross,
          year: item.releaseYear || currentYear,
          posterUrl: item.posterUrl,
          isPlayerMovie: item.isPlayerMovie,
          description: `Set record-breaking opening weekend box office gross.`,
        };
      }

      // Highest Lifetime Gross
      if (item.worldwideGross > (recordsMap['Highest Lifetime Gross']?.numericValue || 0)) {
        recordsMap['Highest Lifetime Gross'] = {
          id: `rec_lg_${item.id}`,
          recordType: 'Highest Lifetime Gross',
          movieTitle: item.title,
          studio: item.studio,
          valueFormatted: `$${(item.worldwideGross / 1000000000).toFixed(3)} Billion`,
          numericValue: item.worldwideGross,
          year: item.releaseYear || currentYear,
          posterUrl: item.posterUrl,
          isPlayerMovie: item.isPlayerMovie,
          description: `All-time highest grossing theatrical movie in global cinema.`,
        };
      }

      // Longest #1
      if (item.currentRank === 1 && item.weeksReleased > (recordsMap['Longest #1']?.numericValue || 0)) {
        recordsMap['Longest #1'] = {
          id: `rec_l1_${item.id}`,
          recordType: 'Longest #1',
          movieTitle: item.title,
          studio: item.studio,
          valueFormatted: `${item.weeksReleased} Consecutive Weeks`,
          numericValue: item.weeksReleased,
          year: item.releaseYear || currentYear,
          posterUrl: item.posterUrl,
          isPlayerMovie: item.isPlayerMovie,
          description: `Held the #1 spot on the worldwide box office chart for ${item.weeksReleased} consecutive weeks.`,
        };
      }

      // Biggest Flop
      const netLoss = totalBudget - item.worldwideGross;
      if (netLoss > (recordsMap['Biggest Flop']?.numericValue || 0)) {
        recordsMap['Biggest Flop'] = {
          id: `rec_flop_${item.id}`,
          recordType: 'Biggest Flop',
          movieTitle: item.title,
          studio: item.studio,
          valueFormatted: `-$${(netLoss / 1000000).toFixed(1)} Million Loss`,
          numericValue: netLoss,
          year: item.releaseYear || currentYear,
          posterUrl: item.posterUrl,
          isPlayerMovie: item.isPlayerMovie,
          description: `Heaviest financial studio write-down relative to overall budget and marketing expenses.`,
        };
      }

      // Highest ROI
      if (roi > (recordsMap['Highest ROI']?.numericValue || 0)) {
        recordsMap['Highest ROI'] = {
          id: `rec_roi_${item.id}`,
          recordType: 'Highest ROI',
          movieTitle: item.title,
          studio: item.studio,
          valueFormatted: `${roi.toFixed(1)}x Return on Investment`,
          numericValue: Math.round(roi),
          year: item.releaseYear || currentYear,
          posterUrl: item.posterUrl,
          isPlayerMovie: item.isPlayerMovie,
          description: `Massive return on investment relative to original production and publicity overhead.`,
        };
      }

      // Fastest to $100M
      if (item.worldwideGross >= 100000000 && item.weeksReleased < (recordsMap['Fastest to $100M']?.numericValue || 999)) {
        recordsMap['Fastest to $100M'] = {
          id: `rec_100m_${item.id}`,
          recordType: 'Fastest to $100M',
          movieTitle: item.title,
          studio: item.studio,
          valueFormatted: `${item.weeksReleased} Week${item.weeksReleased > 1 ? 's' : ''}`,
          numericValue: item.weeksReleased,
          year: item.releaseYear || currentYear,
          posterUrl: item.posterUrl,
          isPlayerMovie: item.isPlayerMovie,
          description: `Fastest theatrical release to surpass $100 Million global box office.`,
        };
      }

      // Fastest to $500M
      if (item.worldwideGross >= 500000000 && item.weeksReleased < (recordsMap['Fastest to $500M']?.numericValue || 999)) {
        recordsMap['Fastest to $500M'] = {
          id: `rec_500m_${item.id}`,
          recordType: 'Fastest to $500M',
          movieTitle: item.title,
          studio: item.studio,
          valueFormatted: `${item.weeksReleased} Week${item.weeksReleased > 1 ? 's' : ''}`,
          numericValue: item.weeksReleased,
          year: item.releaseYear || currentYear,
          posterUrl: item.posterUrl,
          isPlayerMovie: item.isPlayerMovie,
          description: `Blistered past $500 Million global gross in record time.`,
        };
      }
    });

    return Object.values(recordsMap);
  }

  // Calculate Studio Performances & Market Share
  public static calculateStudioPerformances(chart: BoxOfficeItem[]): StudioPerformance[] {
    const studioStats: Record<string, {
      releases: number;
      hits: number;
      flops: number;
      totalGross: number;
      topGross: number;
      topTitle: string;
      logo: string;
    }> = {};

    HOLLYWOOD_STUDIOS.forEach((st) => {
      studioStats[st.name] = {
        releases: 0,
        hits: 0,
        flops: 0,
        totalGross: 0,
        topGross: 0,
        topTitle: 'N/A',
        logo: st.logo,
      };
    });

    chart.forEach((item) => {
      const stName = item.studio || 'Universal Pictures';
      if (!studioStats[stName]) {
        studioStats[stName] = {
          releases: 0,
          hits: 0,
          flops: 0,
          totalGross: 0,
          topGross: 0,
          topTitle: 'N/A',
          logo: POSTERS[0],
        };
      }

      const st = studioStats[stName];
      st.releases += 1;
      const gross = item.worldwideGross || item.grossWorldwide || 0;
      st.totalGross += gross;

      if (gross > st.topGross) {
        st.topGross = gross;
        st.topTitle = item.title;
      }

      const budget = (item.budget || 20000000) + (item.marketing || 10000000);
      const roi = gross / budget;
      if (roi >= 3.0) st.hits += 1;
      else if (roi < 0.8) st.flops += 1;
    });

    const grandTotalGross = Object.values(studioStats).reduce((sum, s) => sum + s.totalGross, 0) || 1;

    return Object.entries(studioStats).map(([sName, data], index) => {
      const marketSharePct = Number(((data.totalGross / grandTotalGross) * 100).toFixed(1));
      const averageGross = data.releases > 0 ? Math.round(data.totalGross / data.releases) : 0;
      const reputationScore = Math.min(100, Math.max(50, Math.round(60 + (data.hits * 5) - (data.flops * 4) + (marketSharePct * 1.5))));

      return {
        id: `studio_perf_${index}`,
        studioName: sName,
        logoUrl: data.logo,
        totalReleases: data.releases,
        hitsCount: data.hits,
        flopsCount: data.flops,
        totalWorldwideGross: data.totalGross,
        marketSharePct,
        averageGross,
        reputationScore,
        topReleaseTitle: data.topTitle,
      };
    }).sort((a, b) => b.totalWorldwideGross - a.totalWorldwideGross);
  }
}
