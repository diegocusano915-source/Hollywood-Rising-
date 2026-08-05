/**
 * HOLLYWOOD RISING - IMDb Dynamic Biography Generator
 * Generates an authentic, evolving IMDb actor biography based on player achievements.
 */

import { Player, ReleasedMovie, BookedProject, AuditionApplication, TimelineEvent, AwardRecord } from '../types/game';
import { FameService } from '../services/fameService';

export interface ImdbBioDataSources {
  bookedProjects?: BookedProject[];
  auditions?: AuditionApplication[];
  careerTimeline?: TimelineEvent[];
  awardHistory?: AwardRecord[];
}

export function generateImdbBiography(
  player: Player,
  releasedMovies: ReleasedMovie[] = [],
  dataSources?: ImdbBioDataSources
): string {
  const firstName = player.firstName || 'Actor';
  const lastName = player.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim().toUpperCase();
  const yearsActive = Math.max(1, (player.dateYear || 2026) - 2026 + 1);
  const fameInfo = FameService.getFameLevelDetails(player.fameXp || 0);

  const booked = dataSources?.bookedProjects || [];
  const auditions = dataSources?.auditions || [];
  const timeline = dataSources?.careerTimeline || [];
  const awards = dataSources?.awardHistory || [];

  // Paragraph 1: Origin, Persona & Guild Status
  let p1 = `${fullName} is a ${player.country || 'American'}-born performer who has been active in the motion picture industry for ${yearsActive} ${yearsActive === 1 ? 'year' : 'years'}. `;
  p1 += `Known for a ${player.personality ? player.personality.toLowerCase() : 'dedicated'} screen presence, ${firstName} is currently recognized at Career Level ${fameInfo.level} (${fameInfo.title}) with ${player.fameXp || 0} Fame XP. `;

  if (player.isUnionMember) {
    p1 += `As a card-carrying member of SAG-AFTRA, ${firstName} is qualified for principal and lead roles across all major Hollywood studio productions. `;
  } else {
    p1 += `Beginning as an unrepresented independent talent, ${firstName} continues to work towards full SAG-AFTRA guild eligibility. `;
  }

  // Audition history
  const auditionEvents = timeline.filter((e) => e.title && e.title.includes('Audition'));
  const firstAudition = auditionEvents[auditionEvents.length - 1] || timeline.find((e) => e.category === 'ROLE');
  if (firstAudition) {
    p1 += `Their recorded Hollywood journey began with an audition for "${firstAudition.title.replace('Audition Attended: ', '').replace('Audition Decision: ', '')}". `;
  } else if (auditions.length > 0) {
    p1 += `Their audition history includes ${auditions.length} project submission(s) tracked on casting rosters. `;
  }

  // Paragraph 2: Filmography, Role Progression & Genre Specialization
  let p2 = '';
  const totalFilms = releasedMovies.length;

  if (totalFilms === 0) {
    p2 = `To date, ${firstName} has no credited feature film releases on IMDb. `;
    const activeBooking = booked.find((b) => b.status === 'Filming' || b.status === 'Pre-Production' || b.status === 'Post Production');
    if (activeBooking) {
      p2 += `However, they are currently in production on "${activeBooking.movieTitle}" as ${activeBooking.roleType} under ${activeBooking.studio || 'Hollywood Studio'} (Contract Salary: $${(activeBooking.salary || 0).toLocaleString()}).`;
    } else {
      p2 += `They are actively submitting tapes via Callboard and training to secure their breakthrough feature debut.`;
    }
  } else {
    const leadCount = player.leadRolesCount || releasedMovies.filter((m) => m.roleType === 'Lead').length;
    const principalCount = player.principalRolesCount || releasedMovies.filter((m) => m.roleType === 'Principal').length;
    const supportCount = Math.max(0, totalFilms - leadCount - principalCount);

    p2 = `With ${totalFilms} completed theatrical release${totalFilms === 1 ? '' : 's'}, ${firstName}'s filmography comprises ${leadCount} lead, ${principalCount} principal, and ${supportCount} supporting or cameo performance${supportCount === 1 ? '' : 's'}. `;

    // First film release
    const firstFilm = releasedMovies[releasedMovies.length - 1];
    if (firstFilm) {
      p2 += `${firstName} made their official feature film debut in "${firstFilm.movieTitle}" (${firstFilm.releaseYear || 2026}) playing a ${firstFilm.roleType} role for ${firstFilm.studio || 'an independent studio'}. `;
    }

    // Genre specialization
    const genreCounts: Record<string, number> = {};
    releasedMovies.forEach((m) => {
      if (m.genre) {
        genreCounts[m.genre] = (genreCounts[m.genre] || 0) + 1;
      }
    });
    const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    if (topGenres.length > 0) {
      p2 += `Genre-wise, ${firstName} has specialized heavily in ${topGenres.map(([g]) => g).join(' and ')} productions. `;
    }
  }

  // Paragraph 3: Box Office Hits, Commercial Stumbling Blocks & Records
  let p3 = '';
  if (totalFilms > 0) {
    const totalGross = releasedMovies.reduce((acc, m) => acc + (m.worldwideGross || 0), 0);
    const totalGrossMillions = (totalGross / 1000000).toFixed(1);

    p3 = `Across their filmography, ${firstName} has accumulated over $${totalGrossMillions}M in cumulative worldwide box office gross. `;

    // Highest grossing film (Hit)
    const sortedByGross = [...releasedMovies].sort((a, b) => (b.worldwideGross || 0) - (a.worldwideGross || 0));
    const hitMovie = sortedByGross[0];
    if (hitMovie && hitMovie.worldwideGross > 0) {
      const grossM = (hitMovie.worldwideGross / 1000000).toFixed(1);
      const openingM = ((hitMovie.openingWeekendGross || 0) / 1000000).toFixed(1);
      p3 += `Their commercially highest-grossing film to date, "${hitMovie.movieTitle}", opened at $${openingM}M and achieved a $${grossM}M global box office finish. `;
    }

    // Number 1 hits
    const numberOneHits = releasedMovies.filter((m) => m.boxOfficePosition === 1);
    if (numberOneHits.length > 0) {
      p3 += `They have scored ${numberOneHits.length} #1 Box Office hit${numberOneHits.length === 1 ? '' : 's'} ("${numberOneHits.map((m) => m.movieTitle).join('", "')}"). `;
    }

    // Critical or Commercial Flops (where gross < budget or critic < 50)
    const flops = releasedMovies.filter((m) => (m.budget && m.worldwideGross < m.budget) || (m.criticRating && m.criticRating < 45));
    if (flops.length > 0) {
      const flop = flops[0];
      const budgetM = ((flop.budget || 0) / 1000000).toFixed(1);
      const grossM = ((flop.worldwideGross || 0) / 1000000).toFixed(1);
      p3 += `In terms of box office stumbling blocks, "${flop.movieTitle}" encountered commercial headwinds, grossing $${grossM}M worldwide against its $${budgetM}M budget (Critic Score: ${flop.criticRating || 0}%). `;
    }
  }

  // Paragraph 4: Representation, Studio Ownership, Awards, Fans & Net Worth
  let p4 = '';
  const rep = player.representation;
  if (rep?.agent) {
    p4 += `${firstName} is represented by ${rep.agent.name} at ${rep.agent.agencyName}. `;
  }

  if (player.empire?.indieStudioOwned) {
    p4 += `Expanding into film production, ${firstName} founded their own independent studio banner, "${player.empire.studioName || 'Indie Studio'}", managing real estate and business assets. `;
  }

  if (player.awardsWon > 0 || awards.length > 0) {
    const totalWins = Math.max(player.awardsWon, awards.filter((a) => a.isPlayerWinner).length);
    p4 += `To date, ${firstName} has earned ${totalWins} major industry award win${totalWins === 1 ? '' : 's'}. `;
  }

  if (player.fans > 0) {
    p4 += `With an international fan following of ${player.fans.toLocaleString()} verified followers, `;
  } else {
    p4 += `Building their international audience, `;
  }

  const netWorthVal = player.netWorth || player.money || 0;
  p4 += `${firstName} maintains a verified career net worth of $${netWorthVal.toLocaleString()}.`;

  // Paragraph 5: Active Slate & Current Production Pipeline
  let p5 = '';
  const activeBookings = booked.filter((b) => !b.isFilmingComplete && b.status !== 'Released');
  if (activeBookings.length > 0) {
    p5 = `\n\nCURRENT PRODUCTION SLATE: ${firstName} is actively engaged in ${activeBookings.length} project contract${activeBookings.length === 1 ? '' : 's'}: ${activeBookings.map((b) => `"${b.movieTitle}" (${b.roleType} for ${b.studio || 'Studio'}, Status: ${b.status || 'In Production'})`).join('; ')}.`;
  }

  return [p1, p2, p3, p4, p5].filter((p) => p.trim().length > 0).join('\n\n');
}

export function getCareerStatusTier(
  player: Player,
  releasedMoviesCount: number
): {
  title: string;
  badgeColor: string;
} {
  const fame = player.fameXp || 0;
  if (fame >= 12000 || player.awardsWon >= 3) {
    return { title: 'A-List Cinema Legend', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
  }
  if (fame >= 5000 || player.leadRolesCount >= 4) {
    return { title: 'International Superstar', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  }
  if (fame >= 2000 || player.leadRolesCount >= 2) {
    return { title: 'Hollywood Star', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  }
  if (fame >= 750 || releasedMoviesCount >= 2) {
    return { title: 'Recognized Film Talent', badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
  }
  return { title: 'Emerging Talent', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
}

