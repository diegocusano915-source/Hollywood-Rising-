/**
 * HOLLYWOOD RISING - Awards & Trophy Simulation Engine (Phase 6)
 * Simulates Oscars, Golden Globes, BAFTA, SAG, Emmys, Critics Choice, Independent Spirit, Festivals.
 * Handles campaign boosts (FYC), nominations, speech outcomes, and permanent award history.
 */

import { Player, ReleasedMovie, TrophyItem, AwardRecord, InboxMessage } from '../types/game';
import { FameService } from './fameService';

export interface AwardCeremonyConfig {
  name: 'Oscars' | 'Golden Globes' | 'BAFTA' | 'SAG Awards' | 'Emmys' | 'Critics Choice' | 'Independent Spirit';
  week: number;
  trophyType: 'Academy Award' | 'Golden Globe' | 'BAFTA' | 'SAG Award' | 'Emmy' | 'Critics Choice' | 'Independent Spirit';
  minScoreForNomination: number;
  minScoreForWin: number;
  nominationXp: number;
  winXp: number;
}

export const CEREMONIES: AwardCeremonyConfig[] = [
  {
    name: 'Golden Globes',
    week: 2,
    trophyType: 'Golden Globe',
    minScoreForNomination: 75,
    minScoreForWin: 88,
    nominationXp: 250,
    winXp: 500,
  },
  {
    name: 'SAG Awards',
    week: 6,
    trophyType: 'SAG Award',
    minScoreForNomination: 78,
    minScoreForWin: 90,
    nominationXp: 250,
    winXp: 500,
  },
  {
    name: 'BAFTA',
    week: 8,
    trophyType: 'BAFTA',
    minScoreForNomination: 80,
    minScoreForWin: 91,
    nominationXp: 300,
    winXp: 600,
  },
  {
    name: 'Independent Spirit',
    week: 9,
    trophyType: 'Independent Spirit',
    minScoreForNomination: 70,
    minScoreForWin: 85,
    nominationXp: 200,
    winXp: 400,
  },
  {
    name: 'Oscars',
    week: 10,
    trophyType: 'Academy Award',
    minScoreForNomination: 82,
    minScoreForWin: 93,
    nominationXp: 500,
    winXp: 1000,
  },
];

export class AwardsService {
  /**
   * Calculates a movie's total award score considering quality, FYC campaigns, director, role.
   */
  public static calculateMovieAwardScore(movie: ReleasedMovie, player: Player): number {
    let score = movie.criticRating * 0.45 + movie.audienceRating * 0.20;

    // Role weighting
    if (movie.roleType === 'Lead') score += 15;
    else if (movie.roleType === 'Principal') score += 10;
    else if (movie.roleType === 'Support') score += 5;

    // Talent bonus
    score += (player.talents.acting / 100) * 10;

    // Campaign FYC boost
    if (movie.fycCampaignLevel === 'Ads') score += 8;
    else if (movie.fycCampaignLevel === 'Screenings') score += 16;
    else if (movie.fycCampaignLevel === 'Dinners') score += 28;
    else if (movie.fycCampaignLevel === 'Blitz') score += 42;

    // A-list Director reputation bonus
    if (movie.director === 'Christopher Nolan' || movie.director === 'Denis Villeneuve' || movie.director === 'Martin Scorsese') {
      score += 10;
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Runs award processing for current week if an award show is scheduled.
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
  } {
    const ceremony = CEREMONIES.find((c) => c.week === week);
    if (!ceremony) {
      return {
        updatedPlayer: player,
        updatedReleasedMovies: releasedMovies,
        newTrophies: [],
        newRecords: [],
        newInboxMessages: [],
        fameGained: 0,
        ceremonyEvent: null,
      };
    }

    // Eligible movies from current or previous year
    const eligibleMovies = releasedMovies.filter(
      (m) => (m.releaseYear === year || m.releaseYear === year - 1) && m.roleType !== 'Background' && m.roleType !== 'Cameo'
    );

    if (eligibleMovies.length === 0) {
      return {
        updatedPlayer: player,
        updatedReleasedMovies: releasedMovies,
        newTrophies: [],
        newRecords: [],
        newInboxMessages: [],
        fameGained: 0,
        ceremonyEvent: null,
      };
    }

    // Best movie contender
    let bestMovie = eligibleMovies[0];
    let bestScore = this.calculateMovieAwardScore(bestMovie, player);

    for (const movie of eligibleMovies) {
      const score = this.calculateMovieAwardScore(movie, player);
      if (score > bestScore) {
        bestScore = score;
        bestMovie = movie;
      }
    }

    let fameGained = 0;
    const newTrophies: TrophyItem[] = [];
    const newRecords: AwardRecord[] = [];
    const newInboxMessages: InboxMessage[] = [];
    let updatedPlayer = { ...player };
    const updatedReleasedMovies = [...releasedMovies];

    const isNominated = bestScore >= ceremony.minScoreForNomination;
    const isWinner = isNominated && bestScore >= ceremony.minScoreForWin;

    // NPC Competitors
    const npcs = [
      { name: 'Marcus Hayes', title: 'The Shadows of Innocence', score: 89 },
      { name: 'Seraphina Sterling', title: 'Whispers in Venice', score: 87 },
      { name: 'Leonardo DiCaprio', title: 'The Great Horizon', score: 91 },
      { name: 'Cillian Murphy', title: 'Atomic Midnight', score: 92 },
    ];

    const category = bestMovie.roleType === 'Lead' ? 'Best Actor in a Leading Role' : 'Best Actor in a Supporting Role';

    if (isWinner) {
      // WINNER!
      fameGained += ceremony.winXp;
      updatedPlayer.awardsWon = (updatedPlayer.awardsWon || 0) + 1;
      updatedPlayer.fameXp = (updatedPlayer.fameXp || 0) + ceremony.winXp;

      // Trophy Item
      const trophy: TrophyItem = {
        id: `trophy_${Date.now()}_${Math.random()}`,
        awardType: ceremony.trophyType,
        category,
        year,
        movieTitle: bestMovie.movieTitle,
        studio: bestMovie.studio || 'Paramount Pictures',
        director: bestMovie.director || 'Denis Villeneuve',
        photoUrl: bestMovie.posterUrl,
        dateText: `Week ${week}, Year ${year}`,
      };
      newTrophies.push(trophy);

      // Award Record
      const record: AwardRecord = {
        id: `rec_${Date.now()}`,
        year,
        eventName: ceremony.name,
        category,
        winnerTitle: bestMovie.movieTitle,
        winnerName: `${player.firstName} ${player.lastName}`,
        isPlayerWinner: true,
        isPlayerNominated: true,
        movieTitle: bestMovie.movieTitle,
        nominees: [
          { title: bestMovie.movieTitle, name: `${player.firstName} ${player.lastName}`, isPlayer: true },
          ...npcs.slice(0, 3).map((n) => ({ title: n.title, name: n.name, isPlayer: false })),
        ],
      };
      newRecords.push(record);

      // Update movie stats
      const movieIdx = updatedReleasedMovies.findIndex((m) => m.id === bestMovie.id);
      if (movieIdx !== -1) {
        updatedReleasedMovies[movieIdx] = {
          ...updatedReleasedMovies[movieIdx],
          awardsWon: (updatedReleasedMovies[movieIdx].awardsWon || 0) + 1,
          awardsNominated: (updatedReleasedMovies[movieIdx].awardsNominated || 0) + 1,
        };
      }

      // Inbox message
      newInboxMessages.push({
        id: `msg_award_win_${Date.now()}`,
        category: 'CAREER',
        sender: `${ceremony.name} Academy Board`,
        subject: `🏆 WINNER: ${ceremony.name} - ${category}!`,
        body: `Congratulations! You have officially won the ${ceremony.name} award for ${category} for your outstanding performance in "${bestMovie.movieTitle}". Your trophy has been added to your Trophy Room! (+${ceremony.winXp} Fame XP)`,
        date: `W${week}, ${year}`,
        dateWeek: week,
        dateYear: year,
        read: false,
      });

      return {
        updatedPlayer,
        updatedReleasedMovies,
        newTrophies,
        newRecords,
        newInboxMessages,
        fameGained,
        ceremonyEvent: record,
      };
    } else if (isNominated) {
      // NOMINATED ONLY
      fameGained += ceremony.nominationXp;
      updatedPlayer.fameXp = (updatedPlayer.fameXp || 0) + ceremony.nominationXp;

      const topNpc = npcs[0];
      const record: AwardRecord = {
        id: `rec_${Date.now()}`,
        year,
        eventName: ceremony.name,
        category,
        winnerTitle: topNpc.title,
        winnerName: topNpc.name,
        isPlayerWinner: false,
        isPlayerNominated: true,
        movieTitle: bestMovie.movieTitle,
        nominees: [
          { title: bestMovie.movieTitle, name: `${player.firstName} ${player.lastName}`, isPlayer: true },
          ...npcs.map((n) => ({ title: n.title, name: n.name, isPlayer: false })),
        ],
      };
      newRecords.push(record);

      const movieIdx = updatedReleasedMovies.findIndex((m) => m.id === bestMovie.id);
      if (movieIdx !== -1) {
        updatedReleasedMovies[movieIdx] = {
          ...updatedReleasedMovies[movieIdx],
          awardsNominated: (updatedReleasedMovies[movieIdx].awardsNominated || 0) + 1,
        };
      }

      newInboxMessages.push({
        id: `msg_award_nom_${Date.now()}`,
        category: 'CAREER',
        sender: `${ceremony.name} Selection Committee`,
        subject: `✨ OFFICIAL NOMINATION: ${ceremony.name}!`,
        body: `You have received an official nomination for ${category} at the ${ceremony.name} for "${bestMovie.movieTitle}"! (+${ceremony.nominationXp} Fame XP)`,
        date: `W${week}, ${year}`,
        dateWeek: week,
        dateYear: year,
        read: false,
      });

      return {
        updatedPlayer,
        updatedReleasedMovies,
        newTrophies: [],
        newRecords,
        newInboxMessages,
        fameGained,
        ceremonyEvent: record,
      };
    }

    return {
      updatedPlayer,
      updatedReleasedMovies,
      newTrophies: [],
      newRecords: [],
      newInboxMessages: [],
      fameGained: 0,
      ceremonyEvent: null,
    };
  }
}
