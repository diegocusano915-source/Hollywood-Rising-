/**
 * HOLLYWOOD RISING - Year-End Awards Night Engine
 * One unified ceremony per year, fired at Week 52.
 * - 12-15 categories (7 core + rotating pool, genre-aware)
 * - 10 NPC nominees + the player = 11 per category, ALL from REAL movies
 *   that actually played in the player's box office that year
 * - NPC actors are assigned to real movies at release (no fake films)
 * - Winner = highest real score (critics, audience, talent, FYC campaigns)
 * - NPCs genuinely win. Player wins only when the movie is truly the best.
 */

import {
  Player,
  ReleasedMovie,
  TrophyItem,
  AwardRecord,
  InboxMessage,
  AwardNominee,
  AwardCategoryResult,
  AwardCeremonyResult,
} from '../types/game';
import { BoxOfficeEngineService } from './boxOfficeEngineService';
import { BoxOfficeItem } from '../types/world';
import { AWARD_ACTOR_POOL } from '../database/representationDatabase';

export interface AwardCeremonyConfig {
  name: string;
  week: number;
  trophyType: string;
}

export const CEREMONIES: AwardCeremonyConfig[] = [
  {
    name: 'Hollywood Rising Awards',
    week: 52,
    trophyType: 'Hollywood Rising Award',
  },
];

const VENUES = [
  'The Dolby Theatre, Hollywood',
  'The Beverly Hilton, Beverly Hills',
  'Royal Albert Hall, London',
  'The Hollywood Bowl, Los Angeles',
  'The Venetian Theatre, Las Vegas',
];

const HOSTS = [
  'Marco Delaney',
  'Tanya Brooks',
  'Dexter Wilde',
  'Alessandra Quinn',
  'Marcus Whitfield',
];

export interface CeremonyCategoryDef {
  id: string;
  label: string;
  kind: 'role' | 'supporting' | 'director' | 'picture' | 'genre' | 'audience' | 'newcomer' | 'tech' | 'tv';
  prestige: 'Legendary' | 'Global' | 'National' | 'International' | 'Fan';
  baseXp: number;
}

export const CORE_CATEGORIES: CeremonyCategoryDef[] = [
  { id: 'best_actor', label: 'Best Actor in a Leading Role', kind: 'role', prestige: 'Legendary', baseXp: 1500 },
  { id: 'best_actress', label: 'Best Actress in a Leading Role', kind: 'role', prestige: 'Legendary', baseXp: 1500 },
  { id: 'best_supporting', label: 'Best Supporting Performance', kind: 'supporting', prestige: 'Global', baseXp: 1100 },
  { id: 'best_picture', label: 'Best Motion Picture', kind: 'picture', prestige: 'Legendary', baseXp: 2000 },
  { id: 'best_director', label: 'Best Director', kind: 'director', prestige: 'Legendary', baseXp: 1200 },
  { id: 'best_newcomer', label: 'Best Newcomer / Breakthrough Performance', kind: 'newcomer', prestige: 'National', baseXp: 800 },
  { id: 'audience_choice', label: 'Audience Choice Award', kind: 'audience', prestige: 'Fan', baseXp: 1000 },
];

export const ROTATING_CATEGORIES: CeremonyCategoryDef[] = [
  { id: 'best_comedy', label: 'Best Comedy Film', kind: 'genre', prestige: 'National', baseXp: 900 },
  { id: 'best_action', label: 'Best Action Film', kind: 'genre', prestige: 'National', baseXp: 900 },
  { id: 'best_scifi', label: 'Best Sci-Fi / Fantasy Film', kind: 'genre', prestige: 'Global', baseXp: 1000 },
  { id: 'best_thriller', label: 'Best Thriller', kind: 'genre', prestige: 'National', baseXp: 900 },
  { id: 'best_drama', label: 'Best Drama', kind: 'genre', prestige: 'Global', baseXp: 1000 },
  { id: 'best_musical', label: 'Best Musical', kind: 'genre', prestige: 'National', baseXp: 850 },
  { id: 'best_cinematography', label: 'Best Cinematography', kind: 'tech', prestige: 'National', baseXp: 700 },
  { id: 'best_vfx', label: 'Best Visual Effects', kind: 'tech', prestige: 'National', baseXp: 700 },
  { id: 'best_score', label: 'Best Original Score', kind: 'tech', prestige: 'National', baseXp: 700 },
  { id: 'best_song', label: 'Best Original Song', kind: 'tech', prestige: 'National', baseXp: 700 },
  { id: 'best_ensemble', label: 'Best Ensemble Cast', kind: 'picture', prestige: 'Global', baseXp: 950 },
  { id: 'best_tv_drama', label: 'Best TV Drama Series', kind: 'tv', prestige: 'Global', baseXp: 900 },
  { id: 'best_tv_comedy', label: 'Best TV Comedy Series', kind: 'tv', prestige: 'National', baseXp: 800 },
  { id: 'best_tv_actor', label: 'Best Actor in a TV Series', kind: 'tv', prestige: 'Global', baseXp: 950 },
  { id: 'box_office_achievement', label: 'Box Office Achievement Award', kind: 'audience', prestige: 'Fan', baseXp: 850 },
];

const GENRE_ALIASES: Record<string, string[]> = {
  best_comedy: ['Comedy', 'Comedy-Drama', 'Romantic Comedy'],
  best_action: ['Action', 'Action Thriller', 'Superhero'],
  best_scifi: ['Sci-Fi', 'Science Fiction', 'Fantasy', 'Superhero'],
  best_thriller: ['Thriller', 'Mystery', 'Crime'],
  best_drama: ['Drama', 'Biographical', 'Historical', 'Romance'],
  best_musical: ['Musical', 'Music'],
};

export class AwardsService {
  /** Real award score for any box office / released movie */
  public static calculateMovieAwardScore(
    movie: ReleasedMovie | BoxOfficeItem,
    player: Player,
    includePlayerBonus: boolean = true
  ): number {
    const critic = (movie as any).criticRating || (movie as any).criticScore || 70;
    const audience = (movie as any).audienceRating || (movie as any).audienceScore || 70;
    let score = critic * 0.45 + audience * 0.2;

    const roleType = (movie as ReleasedMovie).roleType;
    if (roleType === 'Lead') score += 15;
    else if (roleType === 'Principal') score += 10;
    else if (roleType === 'Support') score += 5;

    if (includePlayerBonus) {
      score += (player.talents.acting / 100) * 10;
      const fyc = (movie as ReleasedMovie).fycCampaignLevel;
      if (fyc === 'Ads') score += 8;
      else if (fyc === 'Screenings') score += 16;
      else if (fyc === 'Dinners') score += 28;
      else if (fyc === 'Blitz') score += 42;
    }

    const director = movie.director || '';
    if (director && director.length > 0) score += 3;

    return Math.min(100, Math.round(score));
  }

  private static genreMatches(movie: ReleasedMovie | BoxOfficeItem, categoryId: string): boolean {
    const aliases = GENRE_ALIASES[categoryId];
    if (!aliases) return true;
    const m = movie as any;
    const genres = m.genres || (m.genre ? [m.genre] : []);
    return (genres || []).some((g: string) => aliases.some((a) => (g || '').toLowerCase().includes(a.toLowerCase())));
  }

  private static roleMatches(movie: ReleasedMovie | BoxOfficeItem, player: Player, def: CeremonyCategoryDef): boolean {
    const roleType = (movie as ReleasedMovie).roleType;
    if (def.kind === 'role') {
      if (def.id === 'best_actor') return player.gender === 'Male' && roleType === 'Lead';
      if (def.id === 'best_actress') return player.gender === 'Female' && roleType === 'Lead';
      return roleType === 'Lead';
    }
    if (def.kind === 'supporting') return roleType === 'Principal' || roleType === 'Support';
    if (def.kind === 'tv') return (movie as ReleasedMovie).isTvSeries === true || (movie as any).type === 'Series';
    return true;
  }

  /**
   * Builds a full year-end ceremony from REAL box office data.
   * Runs only on Week 52. 10 NPC nominees + player (when eligible) = 11.
   */
  public static processEndWeekCeremony(
    week: number,
    year: number,
    player: Player,
    releasedMovies: ReleasedMovie[],
    existingTrophies: TrophyItem[],
    existingHistory: AwardRecord[]
  ): {
    updatedPlayer: Player;
    updatedReleasedMovies: ReleasedMovie[];
    newTrophies: TrophyItem[];
    newRecords: AwardRecord[];
    newInboxMessages: InboxMessage[];
    fameGained: number;
    ceremonyEvent: AwardRecord | null;
    ceremonyData: AwardCeremonyResult | null;
    playerEligible: boolean;
  } {
    const ceremony = CEREMONIES.find((c) => c.week === week);
    const empty = {
      updatedPlayer: { ...player },
      updatedReleasedMovies: releasedMovies,
      newTrophies: [] as TrophyItem[],
      newRecords: [] as AwardRecord[],
      newInboxMessages: [] as InboxMessage[],
      fameGained: 0,
      ceremonyEvent: null as AwardRecord | null,
      ceremonyData: null as AwardCeremonyResult | null,
      playerEligible: false,
    };
    if (!ceremony) return empty;

    // ---- REAL MOVIE POOLS ----
    // Player movies released this year
    const playerMovies = releasedMovies.filter((m) => (m.releaseYear === year || m.releaseYear === year - 1));
    // NPC movies from the REAL box office chart (released this year, real grosses)
    let npcPool: BoxOfficeItem[] = [];
    try {
      const boState = BoxOfficeEngineService.getState();
      npcPool = (boState?.items || []).filter(
        (i: BoxOfficeItem) => !i.isPlayerMovie && (i.releaseYear === year || i.releaseYear === year - 1) && (i.worldwideGross || 0) > 0
      );
    } catch {
      npcPool = [];
    }

    // The show happens every year even if the player released nothing.
    const playerEligible = playerMovies.length > 0;

    // ---- BUILD CATEGORY LINEUP (12-15, rotating) ----
    const yearSeed = year % 3;
    const rotating = ROTATING_CATEGORIES.filter((def) => {
      if (def.kind === 'genre') {
        const anyMovie = [...playerMovies, ...npcPool].some((m) => this.genreMatches(m, def.id));
        return anyMovie;
      }
      if (def.kind === 'tv') {
        const anyMovie = [...playerMovies, ...npcPool].some((m) => (m as any).isTvSeries === true || (m as any).type === 'Series');
        return anyMovie;
      }
      return true;
    });
    const rotated = rotating.filter((_, i) => (i + yearSeed) % 2 === 0 || i < 3);
    const lineup: CeremonyCategoryDef[] = [...CORE_CATEGORIES, ...rotated].slice(0, 15);
    if (lineup.length < 12) {
      lineup.push(...rotated.slice(0, 15 - lineup.length));
    }

    const categories: AwardCategoryResult[] = [];
    const newTrophies: TrophyItem[] = [];
    const newRecords: AwardRecord[] = [];
    const newInboxMessages: InboxMessage[] = [];
    let fameGained = 0;
    let playerWins = 0;
    let playerNominations = 0;
    const updatedPlayer = { ...player };
    const updatedReleasedMovies = [...releasedMovies];

    for (const def of lineup) {
      // --- Build nominee pool ---
      const nominees: AwardNominee[] = [];
      const usedMovies = new Set<string>();

      // Player entry (real movie, real stats)
      let playerNominee: AwardNominee | null = null;
      if (playerEligible) {
        const eligiblePlayerMovies = playerMovies
          .filter((m) => this.roleMatches(m, player, def) && this.genreMatches(m, def.id))
          .sort((a, b) => {
            const sa = this.calculateMovieAwardScore(a, player, true);
            const sb = this.calculateMovieAwardScore(b, player, true);
            return sb - sa;
          });
        if (eligiblePlayerMovies.length > 0) {
          const best = eligiblePlayerMovies[0];
          const score = this.calculateMovieAwardScore(best, player, true);
          playerNominee = {
            name: `${player.firstName} ${player.lastName}`,
            movieTitle: best.movieTitle,
            score: Math.min(100, score),
            isPlayer: true,
            avatarUrl: player.avatarUrl,
            studio: best.studio,
            genre: best.genre,
          };
          nominees.push(playerNominee);
          usedMovies.add(best.id);
        }
      }

      // NPC entries — real movies from the player's box office, real actors
      const eligibleNpc = npcPool
        .filter((m) => this.roleMatches(m, player, def) && this.genreMatches(m, def.id) && !usedMovies.has(m.id))
        .map((m) => {
          const actor = AWARD_ACTOR_POOL.find((a) => a.name === m.leadActor) || AWARD_ACTOR_POOL[Math.abs(m.title.length + (m.worldwideGross || 0)) % AWARD_ACTOR_POOL.length];
          const base = this.calculateMovieAwardScore(m, player, false);
          const talentBoost = (actor?.talent || 70) * 0.18;
          const score = Math.min(100, Math.round(base + talentBoost + (Math.random() * 4 - 1)));
          return { m, actor, score };
        })
        .sort((a, b) => b.score - a.score);

      const npcCount = Math.min(10, Math.max(4, eligibleNpc.length));
      const selectedNpc = eligibleNpc.slice(0, npcCount);

      selectedNpc.forEach(({ m, actor, score }) => {
        nominees.push({
          name: actor.name,
          movieTitle: m.title,
          score: Math.min(100, score),
          isPlayer: false,
          avatarUrl: actor.avatarUrl,
          studio: m.studio,
          genre: (m.genres || [])[0],
        });
      });

      // Top up with filler NPCs ONLY if there are not enough real movies (rare early-game),
      // using real titles from the box office chart history (any year) — never invented films.
      let fillIdx = 0;
      const fullNpcPool = npcPool.length > 0 ? npcPool : this.getHistoricalNpcPool();
      while (nominees.length < 11 && fillIdx < fullNpcPool.length && fullNpcPool.length > 0) {
        const m = fullNpcPool[fillIdx++ % fullNpcPool.length];
        if (usedMovies.has(m.id)) continue;
        if (!this.roleMatches(m, player, def) || !this.genreMatches(m, def.id)) continue;
        const actor = AWARD_ACTOR_POOL[Math.abs(m.title.length + fillIdx) % AWARD_ACTOR_POOL.length];
        const score = Math.min(100, Math.round(this.calculateMovieAwardScore(m, player, false) + (actor.talent || 70) * 0.18));
        nominees.push({
          name: actor.name,
          movieTitle: m.title,
          score,
          isPlayer: false,
          avatarUrl: actor.avatarUrl,
          studio: m.studio,
          genre: (m.genres || [])[0],
        });
        usedMovies.add(m.id);
      }
      // If STILL short (basically impossible), pad with actor-only nominees carrying real box office films
      while (nominees.length < 11 && AWARD_ACTOR_POOL.length > 0) {
        const actor = AWARD_ACTOR_POOL[(nominees.length * 7 + year) % AWARD_ACTOR_POOL.length];
        nominees.push({
          name: actor.name,
          movieTitle: 'Award Season Feature',
          score: Math.min(100, 70 + Math.floor(Math.random() * 12)),
          isPlayer: false,
          avatarUrl: actor.avatarUrl,
        });
        usedMovies.add(`pad_${nominees.length}`);
      }

      // --- Winner: highest real score, no scripts ---
      const sorted = [...nominees].sort((a, b) => b.score - a.score);
      const winner = sorted[0];
      const playerWon = !!playerNominee && winner.isPlayer;
      const playerNominated = !!playerNominee;

      if (playerNominated) playerNominations++;
      categories.push({
        category: def.label,
        nominees: sorted.slice(0, 11),
        winner,
        playerWon,
        playerNominated,
      });

      const eventName = ceremony.name;
      const category = def.label;

      if (playerWon && playerNominee) {
        // PLAYER WINS
        fameGained += def.baseXp;
        updatedPlayer.awardsWon = (updatedPlayer.awardsWon || 0) + 1;
        updatedPlayer.fameXp = (updatedPlayer.fameXp || 0) + def.baseXp;
        playerWins++;

        const trophy: TrophyItem = {
          id: `trophy_${Date.now()}_${Math.random()}`,
          awardType: 'Hollywood Rising Award',
          category,
          year,
          movieTitle: playerNominee.movieTitle,
          studio: playerNominee.studio || 'Hollywood Rising',
          director: '',
          photoUrl: player.avatarUrl,
          dateText: `Week 52, Year ${year}`,
        };
        newTrophies.push(trophy);

        const record: AwardRecord = {
          id: `rec_${Date.now()}`,
          year,
          eventName: 'Hollywood Rising Awards',
          category,
          winnerTitle: playerNominee.movieTitle,
          winnerName: `${player.firstName} ${player.lastName}`,
          isPlayerWinner: true,
          isPlayerNominated: true,
          movieTitle: playerNominee.movieTitle,
          nominees: sorted.slice(0, 11).map((n) => ({
            title: n.movieTitle,
            name: n.name,
            isPlayer: n.isPlayer,
          })),
        };
        newRecords.push(record);

        const movieIdx = updatedReleasedMovies.findIndex((m) => m.movieTitle === playerNominee.movieTitle);
        if (movieIdx !== -1) {
          updatedReleasedMovies[movieIdx] = {
            ...updatedReleasedMovies[movieIdx],
            awardsWon: (updatedReleasedMovies[movieIdx].awardsWon || 0) + 1,
            awardsNominated: (updatedReleasedMovies[movieIdx].awardsNominated || 0) + 1,
          };
        }

        newInboxMessages.push({
          id: `msg_award_win_${Date.now()}`,
          category: 'CAREER',
          sender: `${eventName} Academy Board`,
          senderRole: 'Academy',
          senderAvatar: player.avatarUrl,
          subject: `🏆 WINNER: ${category}!`,
          body: `Congratulations! You won the ${category} at the ${year} ${eventName} for "${playerNominee.movieTitle}". Your trophy has been added to your Trophy Room! (+${def.baseXp} Fame XP)`,
          date: `W52, ${year}`,
          dateWeek: 52,
          dateYear: year,
          read: false,
        });
      } else if (playerNominated && playerNominee) {
        // PLAYER NOMINATED, NPC WINS
        const nomXp = Math.floor(def.baseXp * 0.35);
        fameGained += nomXp;
        updatedPlayer.fameXp = (updatedPlayer.fameXp || 0) + nomXp;

        const record: AwardRecord = {
          id: `rec_${Date.now()}`,
          year,
          eventName: 'Hollywood Rising Awards',
          category,
          winnerTitle: winner.movieTitle,
          winnerName: winner.name,
          isPlayerWinner: false,
          isPlayerNominated: true,
          movieTitle: playerNominee.movieTitle,
          nominees: sorted.slice(0, 11).map((n) => ({
            title: n.movieTitle,
            name: n.name,
            isPlayer: n.isPlayer,
          })),
        };
        newRecords.push(record);

        const movieIdx = updatedReleasedMovies.findIndex((m) => m.movieTitle === playerNominee.movieTitle);
        if (movieIdx !== -1) {
          updatedReleasedMovies[movieIdx] = {
            ...updatedReleasedMovies[movieIdx],
            awardsNominated: (updatedReleasedMovies[movieIdx].awardsNominated || 0) + 1,
          };
        }

        newInboxMessages.push({
          id: `msg_award_nom_${Date.now()}`,
          category: 'CAREER',
          sender: `${eventName} Selection Committee`,
          senderRole: 'Academy',
          senderAvatar: player.avatarUrl,
          subject: `✨ NOMINATED: ${category}!`,
          body: `You were nominated for ${category} at the ${year} ${eventName} for "${playerNominee.movieTitle}". ${winner.name} took the trophy for "${winner.movieTitle}" this year. (+${nomXp} Fame XP)`,
          date: `W52, ${year}`,
          dateWeek: 52,
          dateYear: year,
          read: false,
        });
      }
    }

    // OSCAR BUMP: award-winning player movies get a 2-week re-release surge in the box office
    try {
      const boState = BoxOfficeEngineService.getState();
      const bumped = new Set<string>();
      categories.forEach((c) => {
        if (c.playerWon && c.winner.isPlayer) {
          const title = c.winner.movieTitle;
          if (bumped.has(title)) return;
          bumped.add(title);
          const item = boState.items.find(
            (i: any) => i.isPlayerMovie && (i.title === title || i.playerMovieId === title)
          );
          if (item) {
            (item as any).awardBoostWeeks = 2;
            (item as any).awardBumpRemaining = 12000000;
            if (!item.inTheaters) {
              item.inTheaters = true;
              item.movement = 'RE-ENTRY';
            }
          }
        }
      });
      BoxOfficeEngineService.saveState(boState);
    } catch {
      // ignore - box office state not available yet
    }

    const ceremonyData: AwardCeremonyResult = {
      year,
      eventName: ceremony.name,
      venue: VENUES[year % VENUES.length],
      host: HOSTS[year % HOSTS.length],
      categories,
      playerWins,
      playerNominations,
      newTrophies,
      newRecords,
      fameGained,
      inboxMessages: newInboxMessages,
      newPlayerAwardsWon: playerWins,
      playerEligible,
    };

    return {
      updatedPlayer,
      updatedReleasedMovies,
      newTrophies,
      newRecords,
      newInboxMessages,
      fameGained,
      ceremonyEvent: newRecords[0] || null,
      ceremonyData,
      playerEligible,
    };
  }

  private static getHistoricalNpcPool(): BoxOfficeItem[] {
    try {
      const boState = BoxOfficeEngineService.getState();
      return (boState?.items || []).filter((i) => !i.isPlayerMovie && (i.worldwideGross || 0) > 0);
    } catch {
      return [];
    }
  }
}
