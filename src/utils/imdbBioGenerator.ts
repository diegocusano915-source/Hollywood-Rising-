/**
 * HOLLYWOOD RISING - IMDb Dynamic Biography Generator
 * Generates an authentic, evolving IMDb actor biography based on player achievements.
 */

import { Player, ReleasedMovie } from '../types/game';

export function generateImdbBiography(player: Player, releasedMovies: ReleasedMovie[]): string {
  const fullName = `${player.firstName} ${player.lastName}`.toUpperCase();
  const yearsActive = Math.max(1, player.dateYear - 2026 + 1);

  // If no movies completed yet
  if (!releasedMovies || releasedMovies.length === 0) {
    return `${fullName} is an aspiring actor beginning their journey in Hollywood. They are currently building their career and searching for their breakthrough role. Born in ${player.country}, ${player.firstName} moved to Los Angeles with $2,500 in savings and an unyielding commitment to cinematic excellence.`;
  }

  // Identify key films
  const firstFilm = releasedMovies[releasedMovies.length - 1]; // First completed film
  const leadFilms = releasedMovies.filter(m => m.roleType === 'Lead');
  
  // Find highest grossing film (blockbuster)
  const blockbuster = [...releasedMovies].sort((a, b) => b.worldwideGross - a.worldwideGross)[0];

  // Calculate total worldwide gross
  const totalGross = releasedMovies.reduce((acc, m) => acc + m.worldwideGross, 0);
  const totalGrossMillions = (totalGross / 1000000).toFixed(1);

  // Paragraph 1: Introduction & Origin
  let bio = `${fullName} is an acclaimed ${player.country}-born actor who has been active in the motion picture industry for ${yearsActive} ${yearsActive === 1 ? 'year' : 'years'}. `;

  if (player.isUnionMember) {
    bio += `As an official member of SAG-AFTRA, ${player.firstName} has established a formidable presence across Hollywood studios. `;
  } else {
    bio += `Beginning as an independent talent in Los Angeles, ${player.firstName} quickly gained recognition through dedicated performances. `;
  }

  // Paragraph 2: Filmography & Breakthroughs
  if (releasedMovies.length === 1) {
    bio += `\n\n${player.firstName} made their official feature film debut in "${firstFilm.movieTitle}", delivering a memorable performance as a ${firstFilm.roleType} role.`;
  } else {
    bio += `\n\n${player.firstName} made their theatrical debut in "${firstFilm.movieTitle}". `;
    if (leadFilms.length > 0) {
      bio += `Their breakthrough came with leading roles in high-profile productions, demonstrating exceptional versatility in ${player.personality.toLowerCase()} characters. `;
    }
    if (blockbuster && blockbuster.worldwideGross > 10000000) {
      const grossM = (blockbuster.worldwideGross / 1000000).toFixed(1);
      bio += `Their most commercially successful release to date, "${blockbuster.movieTitle}", grossed an astounding $${grossM} million worldwide at the box office. `;
    }
  }

  // Paragraph 3: Statistics, Awards & Industry Reputation
  bio += `\n\nTo date, ${player.firstName} has starred in ${releasedMovies.length} feature ${releasedMovies.length === 1 ? 'film' : 'films'}, accumulating over $${totalGrossMillions} million in global box office gross. `;

  if (player.awardsWon > 0) {
    bio += `Their critically praised performances have earned them ${player.awardsWon} major Industry Award ${player.awardsWon === 1 ? 'win' : 'wins'}. `;
  }

  if (player.fans > 10000) {
    bio += `With a passionate international fan base of over ${player.fans.toLocaleString()} followers, ${player.firstName} remains one of Hollywood's most watched talents.`;
  } else {
    bio += `Continuing to collaborate with top directors and studio executives, ${player.firstName} continues to elevate their standing as a rising Hollywood star.`;
  }

  return bio;
}

export function getCareerStatusTier(player: Player, releasedMoviesCount: number): {
  title: string;
  badgeColor: string;
} {
  if (player.awardsWon >= 3 || (player.leadRolesCount >= 10 && player.isUnionMember)) {
    return { title: 'A-List Cinema Legend', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
  }
  if (player.leadRolesCount >= 4 || releasedMoviesCount >= 6) {
    return { title: 'Established Hollywood Talent', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  }
  if (releasedMoviesCount >= 2) {
    return { title: 'Breakout Film Actor', badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
  }
  return { title: 'Rising Newcomer', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
}
