/**
 * HOLLYWOOD RISING - Living Hollywood Simulation Engine (Phase 5)
 * Comprehensive, dynamic living ecosystem simulating:
 * - NPC Actors (debuts, aging, agency shifts, career highs/lows, relationships, retirement, passing)
 * - Directors (rising stars, legendary status, flops, retirement)
 * - Writers (Originals, Sequels, Franchises, Remakes, TV & Book adaptations)
 * - Producers (net worth growth, Billionaire Mogul status, bankruptcy)
 * - Studios (Major Studios + NPC Studios launching, IPOs, mergers, bankruptcies, player buyouts)
 * - Industry News (believable weekly news, no fake player claims)
 * - Annual Awards Ceremonies (Oscars, Golden Globes, SAG, BAFTA, Independent Spirit)
 * - Industry Rankings (Top Actors, Directors, Studios, Producers, Writers)
 */

import { Player } from '../types/game';
import { SocialPost } from '../types/world';

const LIVING_WORLD_STORAGE_KEY = 'HOLLYWOOD_LIVING_WORLD_STATE_V1';

export interface NpcActor {
  id: string;
  name: string;
  category: 'Actor';
  fame: number; // 0-100
  age: number;
  nationality: string;
  talent: number; // 0-100
  popularity: number; // 0-100
  studio: string;
  agency: string;
  strengths: string[];
  weaknesses: string[];
  currentProjects: string[];
  relationshipStatus: 'Single' | 'Dating' | 'Married' | 'Divorced';
  partnerName?: string;
  childrenCount: number;
  awardsCount: number;
  isRetired: boolean;
  isDeceased?: boolean;
  avatarUrl: string;
  handle: string;
  origin?: 'Child Actor Grown Up' | 'TV Breakout' | 'Broadway Theatre' | 'International Star' | 'Hollywood Debutant' | 'A-List Veteran';
}

export interface NpcDirector {
  id: string;
  name: string;
  age: number;
  specialty: string;
  reputation: number; // 0-100
  studio: string;
  awardsCount: number;
  status: 'Rising Star' | 'Established' | 'Legendary' | 'Flop Magnet' | 'Retired' | 'Deceased';
  isRetired: boolean;
  isDeceased?: boolean;
  currentProject?: string;
  hitsCount: number;
  flopsCount: number;
  handle: string;
  avatarUrl: string;
}

export interface NpcWriter {
  id: string;
  name: string;
  age: number;
  genreSpecialty: string;
  reputation: number; // 0-100
  notableScriptsCount: number;
  currentScriptType?: 'Original' | 'Sequel' | 'Franchise' | 'Remake' | 'TV Adaptation' | 'Book Adaptation';
  handle: string;
}

export interface NpcProducer {
  id: string;
  name: string;
  age: number;
  netWorth: number;
  reputation: number; // 0-100
  projectsFinanced: number;
  status: 'Active' | 'Billionaire Mogul' | 'Bankrupt' | 'Retired';
  handle: string;
}

export interface StudioInfo {
  id: string;
  name: string;
  cashReserve: number;
  valuation: number;
  activeProjectsCount: number;
  headExecutive: string;
  marketSharePct: number;
  status: 'Active' | 'Public (IPO)' | 'Acquired' | 'Distressed' | 'Bankrupt';
  isNpcCreated?: boolean;
  isPlayerOwned?: boolean;
  purchasePrice?: number;
  handle: string;
  logoUrl?: string;
}

export interface StreamingPlatformInfo {
  id: string;
  name: string;
  subscribersMillions: number;
  activeSeries: string[];
  handle: string;
}

export interface AnnualAwardRecord {
  id: string;
  year: number;
  eventName: 'Oscars' | 'Golden Globes' | 'SAG Awards' | 'BAFTA' | 'Independent Spirit';
  category: string;
  winnerTitle: string;
  winnerName: string;
  isPlayerWinner?: boolean;
}

export interface LivingWorldState {
  week: number;
  year: number;
  actors: NpcActor[];
  directors: NpcDirector[];
  writers: NpcWriter[];
  producers: NpcProducer[];
  studios: StudioInfo[];
  streamingPlatforms: StreamingPlatformInfo[];
  awardRecords: AnnualAwardRecord[];
  newsHistory: string[];
  socialPosts: SocialPost[];
}

const INITIAL_NPC_ACTORS: NpcActor[] = [
  {
    id: 'act_1',
    name: 'Marcus Hayes',
    category: 'Actor',
    fame: 92,
    age: 34,
    nationality: 'American',
    talent: 90,
    popularity: 92,
    studio: 'Silver Peak Studios',
    agency: 'CAA',
    strengths: ['Dramatic Depth', 'Screen Presence'],
    weaknesses: ['Publicity Shy'],
    currentProjects: ['Cyberpunk 2099', 'Shadow City'],
    relationshipStatus: 'Single',
    childrenCount: 0,
    awardsCount: 3,
    isRetired: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    handle: '@marcushayes_official',
    origin: 'A-List Veteran',
  },
  {
    id: 'act_2',
    name: 'Seraphina Sterling',
    category: 'Actor',
    fame: 95,
    age: 29,
    nationality: 'British',
    talent: 94,
    popularity: 95,
    studio: 'Paramount Pictures',
    agency: 'WME',
    strengths: ['Method Acting', 'Accents'],
    weaknesses: ['Stunt Averse'],
    currentProjects: ['Eternity Odyssey'],
    relationshipStatus: 'Dating',
    partnerName: 'Marcus Hayes',
    childrenCount: 0,
    awardsCount: 5,
    isRetired: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    handle: '@seraphina_s',
    origin: 'Broadway Theatre',
  },
  {
    id: 'act_3',
    name: 'Pedro Pascal',
    category: 'Actor',
    fame: 90,
    age: 49,
    nationality: 'Chilean-American',
    talent: 92,
    popularity: 91,
    studio: 'HBO',
    agency: 'UTA',
    strengths: ['Charisma', 'Action Choreography'],
    weaknesses: ['Niche Comedy'],
    currentProjects: ['Gladiator II', 'The Last of Us S2'],
    relationshipStatus: 'Single',
    childrenCount: 0,
    awardsCount: 2,
    isRetired: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    handle: '@pascal_pedro',
    origin: 'TV Breakout',
  },
  {
    id: 'act_4',
    name: 'Zendaya Coleman',
    category: 'Actor',
    fame: 96,
    age: 28,
    nationality: 'American',
    talent: 93,
    popularity: 97,
    studio: 'Warner Bros.',
    agency: 'CAA',
    strengths: ['Fashion Icon', 'Emotional Range'],
    weaknesses: ['Selective Roles'],
    currentProjects: ['Dune: Part Three', 'Euphoria S3'],
    relationshipStatus: 'Dating',
    partnerName: 'Tom Holland',
    childrenCount: 0,
    awardsCount: 4,
    isRetired: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    handle: '@zendaya',
    origin: 'Child Actor Grown Up',
  },
  {
    id: 'act_5',
    name: 'Florence Pugh',
    category: 'Actor',
    fame: 88,
    age: 28,
    nationality: 'British',
    talent: 91,
    popularity: 88,
    studio: 'Universal Pictures',
    agency: 'Gersh',
    strengths: ['Intense Drama', 'Vulnerability'],
    weaknesses: ['On-Set Temper'],
    currentProjects: ['Thunderbolts'],
    relationshipStatus: 'Single',
    childrenCount: 0,
    awardsCount: 1,
    isRetired: false,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    handle: '@florencepugh',
    origin: 'International Star',
  },
  {
    id: 'act_6',
    name: 'Timothée Chalamet',
    category: 'Actor',
    fame: 94,
    age: 28,
    nationality: 'French-American',
    talent: 92,
    popularity: 95,
    studio: 'Warner Bros.',
    agency: 'UTA',
    strengths: ['Auteur Appeal', 'Deep Concentration'],
    weaknesses: ['Physical Stunts'],
    currentProjects: ['A Complete Unknown'],
    relationshipStatus: 'Single',
    childrenCount: 0,
    awardsCount: 3,
    isRetired: false,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    handle: '@tchalamet',
    origin: 'Hollywood Debutant',
  },
  {
    id: 'act_7',
    name: 'Austin Butler',
    category: 'Actor',
    fame: 89,
    age: 33,
    nationality: 'American',
    talent: 89,
    popularity: 90,
    studio: 'Sony Pictures',
    agency: 'WME',
    strengths: ['Vocal Transformation', 'Intensity'],
    weaknesses: ['Method Strain'],
    currentProjects: ['City on Fire'],
    relationshipStatus: 'Single',
    childrenCount: 0,
    awardsCount: 2,
    isRetired: false,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    handle: '@austinbutler',
    origin: 'TV Breakout',
  },
  {
    id: 'act_8',
    name: 'Harrison Ford',
    category: 'Actor',
    fame: 99,
    age: 82,
    nationality: 'American',
    talent: 95,
    popularity: 98,
    studio: 'Lucasfilm',
    agency: 'ICM',
    strengths: ['Living Legend', 'Mass Box Office Draw'],
    weaknesses: ['Press Interviews'],
    currentProjects: ['Captain America: Brave New World'],
    relationshipStatus: 'Married',
    partnerName: 'Calista Flockhart',
    childrenCount: 4,
    awardsCount: 12,
    isRetired: false,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    handle: '@harrisonford_real',
    origin: 'A-List Veteran',
  },
];

const INITIAL_NPC_DIRECTORS: NpcDirector[] = [
  {
    id: 'dir_1',
    name: 'Sofia Fischer',
    age: 41,
    specialty: 'Sci-Fi Thrillers',
    reputation: 88,
    studio: 'Universal Pictures',
    awardsCount: 4,
    status: 'Established',
    isRetired: false,
    currentProject: 'Singularity Protocol',
    hitsCount: 5,
    flopsCount: 1,
    handle: '@sofia_fischer_dir',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'dir_2',
    name: 'Denis Villeneuve',
    age: 56,
    specialty: 'Epic Sci-Fi Worldbuilding',
    reputation: 96,
    studio: 'Warner Bros.',
    awardsCount: 6,
    status: 'Legendary',
    isRetired: false,
    currentProject: 'Dune: Messiah',
    hitsCount: 8,
    flopsCount: 0,
    handle: '@denis_villeneuve',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'dir_3',
    name: 'Christopher Nolan',
    age: 53,
    specialty: 'Non-Linear Blockbusters',
    reputation: 98,
    studio: 'Universal Pictures',
    awardsCount: 8,
    status: 'Legendary',
    isRetired: false,
    currentProject: 'Untitled 2026 IMAX Event',
    hitsCount: 11,
    flopsCount: 0,
    handle: '@nolan_cinema',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'dir_4',
    name: 'Greta Gerwig',
    age: 40,
    specialty: 'Character-Driven Spectacle',
    reputation: 94,
    studio: 'Sony Pictures',
    awardsCount: 5,
    status: 'Established',
    isRetired: false,
    currentProject: 'Chronicles of Narnia',
    hitsCount: 4,
    flopsCount: 0,
    handle: '@greta_gerwig',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'dir_5',
    name: 'Quentin Tarantino',
    age: 61,
    specialty: 'Dialogue & Crime Auteur',
    reputation: 97,
    studio: 'Independent',
    awardsCount: 9,
    status: 'Legendary',
    isRetired: false,
    currentProject: 'The Movie Critic',
    hitsCount: 9,
    flopsCount: 0,
    handle: '@qt_official',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
];

const INITIAL_WRITERS: NpcWriter[] = [
  {
    id: 'wri_1',
    name: 'Aaron Sorkin',
    age: 62,
    genreSpecialty: 'Political & Legal Drama',
    reputation: 95,
    notableScriptsCount: 12,
    currentScriptType: 'Original',
    handle: '@aaron_sorkin',
  },
  {
    id: 'wri_2',
    name: 'Taylor Sheridan',
    age: 54,
    genreSpecialty: 'Neo-Western Franchises',
    reputation: 92,
    notableScriptsCount: 9,
    currentScriptType: 'Franchise',
    handle: '@tsheridan_official',
  },
  {
    id: 'wri_3',
    name: 'Phoebe Waller-Bridge',
    age: 39,
    genreSpecialty: 'Dark Comedy & Spy Thrillers',
    reputation: 91,
    notableScriptsCount: 6,
    currentScriptType: 'Book Adaptation',
    handle: '@pwb_writer',
  },
];

const INITIAL_PRODUCERS: NpcProducer[] = [
  {
    id: 'prod_1',
    name: 'Kevin Feige',
    age: 51,
    netWorth: 850000000,
    reputation: 96,
    projectsFinanced: 34,
    status: 'Billionaire Mogul',
    handle: '@kfeige_marvel',
  },
  {
    id: 'prod_2',
    name: 'Jason Blum',
    age: 55,
    netWorth: 450000000,
    reputation: 92,
    projectsFinanced: 85,
    status: 'Active',
    handle: '@jason_blum',
  },
  {
    id: 'prod_3',
    name: 'Kathleen Kennedy',
    age: 70,
    netWorth: 620000000,
    reputation: 89,
    projectsFinanced: 65,
    status: 'Active',
    handle: '@kkennedy_prod',
  },
];

const INITIAL_STUDIOS: StudioInfo[] = [
  {
    id: 'std_disney',
    name: 'Walt Disney Studios',
    cashReserve: 3500000000,
    valuation: 180000000000,
    activeProjectsCount: 28,
    headExecutive: 'Bob Iger',
    marketSharePct: 22.4,
    status: 'Public (IPO)',
    isNpcCreated: false,
    handle: '@disney_studios',
    logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop',
  },
  {
    id: 'std_wb',
    name: 'Warner Bros. Pictures',
    cashReserve: 2100000000,
    valuation: 42000000000,
    activeProjectsCount: 24,
    headExecutive: 'David Zaslav',
    marketSharePct: 18.2,
    status: 'Public (IPO)',
    isNpcCreated: false,
    handle: '@warnerbros',
    logoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150&auto=format&fit=crop',
  },
  {
    id: 'std_universal',
    name: 'Universal Pictures',
    cashReserve: 2800000000,
    valuation: 65000000000,
    activeProjectsCount: 26,
    headExecutive: 'Donna Langley',
    marketSharePct: 19.5,
    status: 'Public (IPO)',
    isNpcCreated: false,
    handle: '@universalpics',
    logoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=150&auto=format&fit=crop',
  },
  {
    id: 'std_a24',
    name: 'A24 Films',
    cashReserve: 420000000,
    valuation: 3500000000,
    activeProjectsCount: 14,
    headExecutive: 'Daniel Katz',
    marketSharePct: 4.8,
    status: 'Active',
    isNpcCreated: false,
    purchasePrice: 450000000,
    handle: '@a24',
    logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=150&auto=format&fit=crop',
  },
  {
    id: 'std_silverpeak',
    name: 'Silver Peak Pictures',
    cashReserve: 650000000,
    valuation: 1400000000,
    activeProjectsCount: 8,
    headExecutive: 'Marcus Vance',
    marketSharePct: 3.2,
    status: 'Public (IPO)',
    isNpcCreated: true,
    purchasePrice: 280000000,
    handle: '@silverpeakpics',
  },
  {
    id: 'std_moonlight',
    name: 'Moonlight Productions',
    cashReserve: 180000000,
    valuation: 450000000,
    activeProjectsCount: 5,
    headExecutive: 'Elena Rostova',
    marketSharePct: 1.8,
    status: 'Active',
    isNpcCreated: true,
    purchasePrice: 120000000,
    handle: '@moonlight_prod',
  },
];

const INITIAL_STREAMING: StreamingPlatformInfo[] = [
  { id: 'str_1', name: 'NovaStream', subscribersMillions: 140, activeSeries: ['Shadow City', 'Cyberpunk 2099', 'Neon Knights'], handle: '@novastream_app' },
  { id: 'str_2', name: 'Netstar', subscribersMillions: 275, activeSeries: ['Stranger Things', 'The Crown', 'Squid Game'], handle: '@netstar' },
  { id: 'str_3', name: 'HBO Max', subscribersMillions: 105, activeSeries: ['House of the Dragon', 'Euphoria', 'The Last of Us'], handle: '@hbomax' },
];

export class LivingWorldService {
  private static state: LivingWorldState | null = null;

  public static getState(): LivingWorldState {
    if (this.state) return this.state;

    try {
      const raw = localStorage.getItem(LIVING_WORLD_STORAGE_KEY);
      if (raw) {
        this.state = JSON.parse(raw);
        // Defaults for seamless save compatibility
        if (!this.state!.writers) this.state!.writers = INITIAL_WRITERS;
        if (!this.state!.producers) this.state!.producers = INITIAL_PRODUCERS;
        if (!this.state!.awardRecords) this.state!.awardRecords = [];
        return this.state!;
      }
    } catch (e) {
      console.warn('Failed to parse Living World State', e);
    }

    this.state = {
      week: 1,
      year: 2026,
      actors: INITIAL_NPC_ACTORS,
      directors: INITIAL_NPC_DIRECTORS,
      writers: INITIAL_WRITERS,
      producers: INITIAL_PRODUCERS,
      studios: INITIAL_STUDIOS,
      streamingPlatforms: INITIAL_STREAMING,
      awardRecords: [],
      newsHistory: [],
      socialPosts: [],
    };
    this.saveState(this.state);
    return this.state;
  }

  public static saveState(state: LivingWorldState): void {
    this.state = state;
    try {
      localStorage.setItem(LIVING_WORLD_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save Living World state', e);
    }
  }

  /**
   * Main End Week Living World Engine simulation step.
   */
  public static advanceWorldWeek(
    week: number,
    year: number,
    player: Player
  ): { worldNews: string[]; socialPosts: SocialPost[] } {
    const state = this.getState();
    const isNewYear = year > state.year;
    state.week = week;
    state.year = year;

    const generatedNews: string[] = [];
    const generatedPosts: SocialPost[] = [];
    const dateStr = `Week ${week}, ${year}`;

    // 1. ANNUAL AGEING & RETIREMENT CYCLE (Every 52 weeks / New Year)
    if (isNewYear) {
      state.actors.forEach((actor) => {
        actor.age += 1;
        // Retirement check for actors over 68
        if (actor.age >= 68 && !actor.isRetired && Math.random() < 0.25) {
          actor.isRetired = true;
          generatedNews.push(
            `RETIREMENT: Beloved Hollywood icon ${actor.name} (age ${actor.age}) officially announces retirement after decades of acclaimed performances.`
          );
        }
      });

      state.directors.forEach((dir) => {
        dir.age += 1;
        if (dir.age >= 72 && !dir.isRetired && Math.random() < 0.3) {
          dir.isRetired = true;
          dir.status = 'Retired';
          generatedNews.push(
            `DIRECTOR RETIREMENT: Legendary director ${dir.name} announces retirement from feature film production.`
          );
        }
      });
    }

    // 2. NEW NPC ACTOR DEBUTS (Every ~3 weeks)
    if (Math.random() < 0.35) {
      const origins: NpcActor['origin'][] = [
        'Child Actor Grown Up',
        'TV Breakout',
        'Broadway Theatre',
        'International Star',
        'Hollywood Debutant',
      ];
      const chosenOrigin = origins[Math.floor(Math.random() * origins.length)];
      const firstNames = ['Lucas', 'Aria', 'Mateo', 'Chloe', 'Julian', 'Sienna', 'Gabriel', 'Eliana', 'Dante', 'Maya'];
      const lastNames = ['Vance', 'Sterling', 'Cross', 'Mercer', 'Rousseau', 'Hawthorne', 'Sloan', 'Kavanagh', 'Chen', 'Moretti'];
      const newName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const agencies = ['CAA', 'WME', 'UTA', 'Gersh', 'Paradigm'];
      const chosenAgency = agencies[Math.floor(Math.random() * agencies.length)];

      const newActor: NpcActor = {
        id: `npc_act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: newName,
        category: 'Actor',
        fame: Math.floor(25 + Math.random() * 35),
        age: chosenOrigin === 'Child Actor Grown Up' ? 19 : Math.floor(22 + Math.random() * 12),
        nationality: chosenOrigin === 'International Star' ? 'British' : 'American',
        talent: Math.floor(65 + Math.random() * 30),
        popularity: Math.floor(30 + Math.random() * 40),
        studio: 'Independent',
        agency: chosenAgency,
        strengths: ['Natural Presence', 'Expressive Eyes'],
        weaknesses: ['Publicity Inexperience'],
        currentProjects: [],
        relationshipStatus: 'Single',
        childrenCount: 0,
        awardsCount: 0,
        isRetired: false,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
        handle: `@${newName.toLowerCase().replace(/\s+/g, '')}_official`,
        origin: chosenOrigin,
      };

      state.actors.push(newActor);
      generatedNews.push(
        `NEW TALENT: Emerging actor ${newActor.name} (${chosenOrigin}) signs with ${chosenAgency} Talent Agency!`
      );
    }

    // 3. DIRECTOR & WRITER EVENTS
    if (Math.random() < 0.4) {
      const activeDirs = state.directors.filter((d) => !d.isRetired);
      if (activeDirs.length > 0) {
        const dir = activeDirs[Math.floor(Math.random() * activeDirs.length)];
        const projectTypes = ['Sci-Fi Spectacle', 'Psychological Drama', 'Historical Epic', 'Action Thriller'];
        const chosenType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
        generatedNews.push(
          `PRODUCTION: Director ${dir.name} greenlights new $120M ${chosenType} feature with ${dir.studio}.`
        );
      }
    }

    // 4. NPC STUDIO EVOLUTION & IPOs
    if (Math.random() < 0.3) {
      // Launch new NPC Studio
      const npcStudioNames = ['Nova Entertainment', 'Atlas Studios', 'Empire Vision', 'Vanguard Films', 'Pinnacle Pictures'];
      const existingNames = new Set(state.studios.map((s) => s.name));
      const unlaunched = npcStudioNames.filter((n) => !existingNames.has(n));

      if (unlaunched.length > 0) {
        const studioName = unlaunched[0];
        const newStudio: StudioInfo = {
          id: `std_npc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: studioName,
          cashReserve: 250000000,
          valuation: 650000000,
          activeProjectsCount: 4,
          headExecutive: 'Victoria Vance',
          marketSharePct: 1.5,
          status: 'Active',
          isNpcCreated: true,
          purchasePrice: 180000000,
          handle: `@${studioName.toLowerCase().replace(/\s+/g, '')}`,
        };
        state.studios.push(newStudio);
        generatedNews.push(
          `INDUSTRY LAUNCH: Independent studio '${studioName}' officially launches in Hollywood with $250M initial funding!`
        );
      } else {
        // Dynamic Studio IPO or Merger
        const privateStudios = state.studios.filter((s) => s.status === 'Active' && s.valuation >= 1000000000);
        if (privateStudios.length > 0) {
          const ipoStudio = privateStudios[0];
          ipoStudio.status = 'Public (IPO)';
          generatedNews.push(
            `WALL STREET: ${ipoStudio.name} completes massive $1.2B Initial Public Offering (IPO) on NYSE!`
          );
        }
      }
    }

    // 5. HOLLYWOOD NEWS (Believable Industry News, NO Fake Player Stories)
    const believableHeadlines = [
      'Disney delays major summer Marvel feature to refine visual effects.',
      'Warner Bros. Discovery announces strategic expansion of Burbank soundstages.',
      'Universal Pictures signs multi-year exclusive theatrical distribution deal.',
      'Paramount greenlights $180M sci-fi original franchise.',
      'Independent drama wins Grand Jury Prize at Sundance Film Festival.',
      'Netflix signs $80M exclusive output deal for European distribution.',
      'Apple Original Films secures global rights to Cannes award-winning drama.',
      'SAG-AFTRA guild announces new residual rate adjustments for streaming releases.',
    ];
    if (generatedNews.length === 0 || Math.random() < 0.6) {
      const headline = believableHeadlines[Math.floor(Math.random() * believableHeadlines.length)];
      generatedNews.push(`HOLLYWOOD PULSE: ${headline}`);
    }

    // 6. ANNUAL AWARDS SIMULATION (Week 2, 6, 8, 9, 10)
    // Golden Globes (W2), SAG (W6), BAFTA (W8), Indie Spirit (W9), Oscars (W10)
    if ([2, 6, 8, 9, 10].includes(week)) {
      const eventName =
        week === 2
          ? 'Golden Globes'
          : week === 6
          ? 'SAG Awards'
          : week === 8
          ? 'BAFTA'
          : week === 9
          ? 'Independent Spirit'
          : 'Oscars';

      const ceremonyNews = `AWARDS CEREMONY: The ${year} ${eventName} officially honors the finest cinematic features of the year!`;
      generatedNews.push(ceremonyNews);

      // Record award in history
      state.awardRecords.unshift({
        id: `aw_rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        year,
        eventName: eventName as any,
        category: 'Best Picture',
        winnerTitle: 'Oppenheimer Sequel',
        winnerName: 'Christopher Nolan',
        isPlayerWinner: false,
      });
    }

    // Save and return
    state.newsHistory.unshift(...generatedNews);
    state.socialPosts.unshift(...generatedPosts);
    this.saveState(state);

    return {
      worldNews: generatedNews,
      socialPosts: generatedPosts,
    };
  }

  /**
   * Buy out an NPC Studio if player has sufficient funds.
   */
  public static buyStudio(studioId: string, playerMoney: number): { success: boolean; message: string; cost?: number } {
    const state = this.getState();
    const studio = state.studios.find((s) => s.id === studioId);

    if (!studio) {
      return { success: false, message: 'Studio not found.' };
    }

    if (studio.isPlayerOwned) {
      return { success: false, message: 'You already own this studio!' };
    }

    const price = studio.purchasePrice || Math.round(studio.valuation * 0.35);
    if (playerMoney < price) {
      return {
        success: false,
        message: `Insufficient funds! Acquisition requires $${price.toLocaleString()} (You have $${playerMoney.toLocaleString()}).`,
      };
    }

    studio.isPlayerOwned = true;
    studio.headExecutive = 'Player Empire';
    this.saveState(state);

    return {
      success: true,
      message: `Congratulations! You have successfully acquired ${studio.name} for $${price.toLocaleString()}!`,
      cost: price,
    };
  }

  /**
   * Get dynamic Industry Rankings across Actors, Directors, Studios, Producers.
   */
  public static getIndustryRankings() {
    const state = this.getState();

    const topActors = [...state.actors].sort((a, b) => b.fame - a.fame).slice(0, 10);
    const topDirectors = [...state.directors].sort((a, b) => b.reputation - a.reputation).slice(0, 10);
    const topStudios = [...state.studios].sort((a, b) => b.marketSharePct - a.marketSharePct).slice(0, 10);
    const topProducers = [...(state.producers || [])].sort((a, b) => b.netWorth - a.netWorth).slice(0, 10);

    return {
      topActors,
      topDirectors,
      topStudios,
      topProducers,
    };
  }
}
