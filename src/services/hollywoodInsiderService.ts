/**
 * HOLLYWOOD RISING - Hollywood Insider Service
 * Central Manager & Real Game Event Engine for Hollywood Insider News Platform.
 * Generates rich, detailed (250-700 words) trade articles from actual gameplay events with 50-150 NPC comments.
 */

import {
  HollywoodInsiderArticle,
  HollywoodInsiderState,
  NewsCategory,
  NPCComment,
  NPCAuthorType,
  RelatedEntities,
} from '../types/hollywoodInsider';
import { Player, ReleasedMovie, BookedProject } from '../types/game';
import { WORLD_MOVIES, WORLD_STUDIOS } from '../database/worldDatabase';

const STORAGE_KEY = 'hollywood_insider_state_v1';

// Journalist Pool for authentic Variety/Deadline/THR feel
const TRADE_REPORTERS = [
  { name: 'Mike Fleming Jr.', role: 'Co-Editor-in-Chief, Film' },
  { name: 'Borys Kit', role: 'Senior Film Reporter' },
  { name: 'Matt Belloni', role: 'Chief Hollywood Analyst' },
  { name: 'Justin Kroll', role: 'Senior Film Writer' },
  { name: 'Tatiana Siegel', role: 'Executive Editor' },
  { name: 'Anthony D\'Alessandro', role: 'Box Office Editor' },
  { name: 'Rebecca Ford', role: 'Senior Awards Correspondent' },
  { name: 'Brodie Cooper', role: 'Industry Legal Correspondent' },
];

// Verified NPC Pool for comments
const VERIFIED_NPCS: { name: string; handle: string; avatar: string; type: NPCAuthorType; role: string }[] = [
  { name: 'Ari Gold', handle: '@AriGoldCAA', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop', type: 'EXECUTIVE', role: 'CAA Managing Partner' },
  { name: 'Denis Villeneuve', handle: '@DenisVilleneuve', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'A-List Director' },
  { name: 'Margot Robbie', handle: '@MargotRobbie', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'Producer & Actress' },
  { name: 'Christopher Nolan', handle: '@NolanOfficial', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'Visionary Director' },
  { name: 'Kevin Feige', handle: '@KFeigeMarvel', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop', type: 'STUDIO_HEAD', role: 'Marvel Studios President' },
  { name: 'David Zaslav', handle: '@DZaslavWB', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop', type: 'STUDIO_HEAD', role: 'Warner Bros Discovery CEO' },
  { name: 'Peter Debruge', handle: '@DebrugeVariety', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop', type: 'CRITIC', role: 'Chief Film Critic' },
  { name: 'Zendaya Coleman', handle: '@Zendaya', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'A-List Actress' },
  { name: 'Timothée Chalamet', handle: '@TChalamet', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'Lead Actor' },
  { name: 'Greta Gerwig', handle: '@GretaGerwig', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop', type: 'VERIFIED_CELEBRITY', role: 'Director' },
];

const CASUAL_FAN_USERNAMES = [
  'CinephileMax', 'HollywoodBuff99', 'MovieGeek_2026', 'A24_Stan', 'OscarPredictor',
  'BoxOfficeNerd', 'ReelTalkSam', 'StarlightWatcher', 'CinemaObsessed', 'FilmNerd_LA',
  'WestCoastViewer', 'PopcornPass', 'ScreenRantFan', 'IndieFilmLover', 'BlockbusterKing',
];

export class HollywoodInsiderService {
  private static cachedState: HollywoodInsiderState | null = null;

  public static getState(): HollywoodInsiderState {
    if (this.cachedState) return this.cachedState;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HollywoodInsiderState;
        this.cachedState = parsed;
        return this.cachedState;
      }
    } catch (e) {
      console.error('Error loading Hollywood Insider state:', e);
    }

    // Initial state setup with baseline historical articles from actual world database
    const initialState = this.bootstrapInitialArticles();
    this.saveState(initialState);
    return initialState;
  }

  public static saveState(state: HollywoodInsiderState): void {
    this.cachedState = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving Hollywood Insider state:', e);
    }
  }

  /**
   * Generates between 50 to 150 NPC comments for any given article topic
   */
  public static generateNPCComments(
    articleTitle: string,
    category: NewsCategory,
    entities?: RelatedEntities,
    countTarget = 85
  ): NPCComment[] {
    const comments: NPCComment[] = [];
    const movie = entities?.movieTitle || 'this project';
    const actor = entities?.actorName || 'the lead star';
    const studio = entities?.studioName || 'the studio';

    // 1. Add top verified industry & celebrity comments
    const selectedVerified = [...VERIFIED_NPCS].sort(() => 0.5 - Math.random()).slice(0, 12);

    selectedVerified.forEach((v, idx) => {
      let text = '';
      if (v.type === 'EXECUTIVE' || v.type === 'STUDIO_HEAD') {
        text = `From an executive standpoint, ${studio}'s execution here is top tier. ${actor} is proving to be a true box office draw in ${movie}.`;
      } else if (v.type === 'VERIFIED_CELEBRITY') {
        text = `So proud to see ${actor} shining in ${movie}! Incredible work from the whole crew and creative team. 🔥`;
      } else if (v.type === 'CRITIC') {
        text = `A masterful piece of entertainment journalism. The narrative arc surrounding ${movie} will be studied for years in film school.`;
      }

      const commentId = `comment_v_${Date.now()}_${idx}`;
      comments.push({
        id: commentId,
        authorName: v.name,
        authorHandle: v.handle,
        authorAvatar: v.avatar,
        authorType: v.type,
        isVerified: true,
        roleBadge: v.role,
        text,
        likesCount: Math.floor(Math.random() * 4000) + 1200,
        isTopComment: idx < 3,
        timeAgo: `${idx + 1}h ago`,
        replies: [
          {
            id: `${commentId}_reply_1`,
            authorName: 'CinephileMax',
            authorHandle: '@CinephileMax',
            authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
            authorType: 'FAN',
            text: `100% agree with ${v.name}! The theatrical momentum is insane.`,
            likesCount: Math.floor(Math.random() * 400) + 50,
            timeAgo: `${idx + 1}h ago`,
          },
          {
            id: `${commentId}_reply_2`,
            authorName: 'BoxOfficeNerd',
            authorHandle: '@BoxOfficeNerd',
            authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop',
            authorType: 'FAN',
            text: `The international holds on this are going to be massive.`,
            likesCount: Math.floor(Math.random() * 250) + 20,
            timeAgo: `${idx + 1}h ago`,
          },
        ],
      });
    });

    // 2. Add casual fan, critic, and industry commentary (reaching total target between 50-150)
    const totalFanComments = Math.max(50, Math.min(150, countTarget)) - comments.length;

    const fanCommentTemplates = [
      `Honestly blown away by ${movie}. ${actor} gave one of the best performances of the year!`,
      `The production values on ${movie} were off the charts. ${studio} didn't cut any corners.`,
      `Does anyone else think this is locked for Awards season nominations? Absolutely deserved.`,
      `Hollywood Insider always breaks the best stories. Great deep dive into the business side of ${movie}.`,
      `I bought tickets for IMAX this weekend. The audience reaction was electric! 🍿`,
      `The box office numbers on this are wild. Cinema is officially back!`,
      `I was skeptical when this was first announced, but the finished cut completely surpassed expectations.`,
      `Big win for ${actor}! Their talent representation really packaged this project brilliantly.`,
      `The backend percentage deal on this must be staggering. Huge financial success for all involved.`,
      `Can we talk about the cinematography in ${movie}? Breathtaking visuals from start to finish.`,
      `The commentary thread here is hilarious 😂 But seriously, ${movie} is a modern classic.`,
      `I've seen it twice already. Will easily surpass the $500M worldwide mark.`,
      `Great reporting by the Hollywood Insider team as always. Clear, objective, and detailed.`,
      `This is why we go to the movie theaters. Nothing compares to the big screen experience!`,
    ];

    for (let i = 0; i < totalFanComments; i++) {
      const username = CASUAL_FAN_USERNAMES[i % CASUAL_FAN_USERNAMES.length] + Math.floor(Math.random() * 99);
      const randomText = fanCommentTemplates[i % fanCommentTemplates.length];
      const avatarId = (i % 8) + 1;
      const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&sig=${avatarId}`;

      const commentId = `comment_f_${Date.now()}_${i}`;
      const hasReply = i % 4 === 0;

      comments.push({
        id: commentId,
        authorName: username,
        authorHandle: `@${username}`,
        authorAvatar: avatar,
        authorType: 'FAN',
        text: randomText,
        likesCount: Math.floor(Math.random() * 800) + 15,
        isTopComment: false,
        timeAgo: `${(i % 12) + 1}h ago`,
        replies: hasReply
          ? [
              {
                id: `${commentId}_r1`,
                authorName: 'ReelTalkSam',
                authorHandle: '@ReelTalkSam',
                authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop',
                authorType: 'FAN',
                text: 'Agreed! Rewatching this weekend for sure.',
                likesCount: Math.floor(Math.random() * 120) + 5,
                timeAgo: `${(i % 12) + 1}h ago`,
              },
            ]
          : undefined,
      });
    }

    return comments;
  }

  /**
   * Creates initial historical articles from real worldDatabase movies so Hollywood Insider starts populated
   */
  private static bootstrapInitialArticles(): HollywoodInsiderState {
    const articles: HollywoodInsiderArticle[] = [];

    // 1. Dune: Part Two / Blockbuster Feature
    const duneComments = this.generateNPCComments('Dune: Part Two Box Office Surge', 'Box Office', {
      movieTitle: 'Dune: Part Two',
      actorName: 'Timothée Chalamet & Zendaya',
      studioName: 'Warner Bros. Pictures',
      directorName: 'Denis Villeneuve',
      grossAmount: 711000000,
    }, 95);

    articles.push({
      id: 'art_dune_part_2',
      headline: "BOX OFFICE PHENOMENON: Warner Bros & Legendary's 'Dune: Part Two' Surpasses $700M Global Box Office Milestone",
      subHeadline: "Denis Villeneuve's sci-fi epic delivers unprecedented IMAX ticket demand and establishes a new theatrical gold standard.",
      category: 'Box Office',
      publisher: 'Hollywood Insider',
      publishDate: 'Week 4, Year 1',
      weekNumber: 4,
      yearNumber: 1,
      readTimeMinutes: 5,
      heroImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop',
      imageCaption: 'Theatrical audiences worldwide pack IMAX auditoriums for Denis Villeneuve\'s sci-fi masterpiece.',
      excerpt: "Inside the staggering financial trajectory of 'Dune: Part Two', from its $190M production budget to its historic international theatrical run.",
      authorName: 'Mike Fleming Jr.',
      authorRole: 'Co-Editor-in-Chief, Film',
      relatedEntities: {
        movieTitle: 'Dune: Part Two',
        actorName: 'Timothée Chalamet & Zendaya',
        studioName: 'Warner Bros. Pictures',
        directorName: 'Denis Villeneuve',
        grossAmount: 711000000,
      },
      viewsCount: 482000,
      likesCount: 38400,
      sharesCount: 12900,
      commentCount: duneComments.length,
      isTrending: true,
      isBreaking: true,
      isHeadlineBanner: true,
      contentParagraphs: [
        "HOLLYWOOD — In what studio executives are calling a watershed moment for theatrical cinema, Warner Bros. and Legendary Entertainment's sci-fi juggernaut 'Dune: Part Two' has officially crossed $711 million at the worldwide box office. The milestone solidifies director Denis Villeneuve's adaptation as one of the most commercially and critically lucrative film franchises of the modern era.",

        "Sailing into theaters with an official production budget of $190 million, the sequel generated immediate consensus across both domestic exhibitor circuits and international markets. Backed by powerhouse performances from Timothée Chalamet, Zendaya, Austin Butler, and Rebecca Ferguson, ticket sales surged past initial tracking models by over 35% during its opening weekend, driven largely by premium large format (PLF) and 70mm IMAX bookings.",

        "According to senior distribution analysts, over $140 million of the film's total gross has originated directly from IMAX screens globally—a record-breaking percentage that highlights shifting consumer preferences toward event-driven cinema. Studio distribution chief Jeff Goldstein commented on the result: 'Denis Villeneuve didn't just make a movie; he delivered an immersive cultural event that demanded to be experienced on the largest screen imaginable.'",

        "Critical reception mirrored the financial triumph, with the picture holding a formidable 93% Certified Fresh rating on Rotten Tomatoes and an A CinemaScore from opening night audiences. Behind the scenes, talent representation firms WME and CAA negotiated lucrative backend gross points for key talent, yielding tens of millions in secondary bonuses for lead cast members and producers.",

        "As 'Dune: Part Two' continues its strong theatrical hold across international territories including the UK, Germany, China, and Japan, Warner Bros. has already quietly begun development on the trilogy's conclusion, 'Dune Messiah', with Villeneuve expected to return following a brief hiatus. For an industry hungry for reliable non-superhero tentpoles, Arrakis has proven to be pure box office gold."
      ],
      comments: duneComments,
    });

    // 2. Oppenheimer Award Season Sweep
    const oppenheimerComments = this.generateNPCComments('Oppenheimer Oscar Triumph', 'Awards', {
      movieTitle: 'Oppenheimer',
      actorName: 'Cillian Murphy',
      studioName: 'Universal Pictures',
      directorName: 'Christopher Nolan',
      awardName: 'Best Picture',
      grossAmount: 957000000,
    }, 82);

    articles.push({
      id: 'art_oppenheimer_awards',
      headline: "AWARDS SEASON RECAP: Christopher Nolan's 'Oppenheimer' Dominates Industry Ceremonies With 7 Academy Awards",
      subHeadline: "Universal Pictures achieves historic prestige victory as $957M biopic completes sweeping awards campaign.",
      category: 'Awards',
      publisher: 'Hollywood Insider',
      publishDate: 'Week 2, Year 1',
      weekNumber: 2,
      yearNumber: 1,
      readTimeMinutes: 4,
      heroImageUrl: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200&auto=format&fit=crop',
      imageCaption: 'Universal Pictures executives and creative teams celebrate sweeping Academy Award victories in Los Angeles.',
      excerpt: "How Christopher Nolan and Universal orchestrated one of the most successful commercial and prestige awards campaigns in Hollywood history.",
      authorName: 'Rebecca Ford',
      authorRole: 'Senior Awards Correspondent',
      relatedEntities: {
        movieTitle: 'Oppenheimer',
        actorName: 'Cillian Murphy',
        studioName: 'Universal Pictures',
        directorName: 'Christopher Nolan',
        awardName: 'Best Picture',
        grossAmount: 957000000,
      },
      viewsCount: 320000,
      likesCount: 29100,
      sharesCount: 8400,
      commentCount: oppenheimerComments.length,
      isTrending: true,
      isHeadlineBanner: false,
      contentParagraphs: [
        "LOS ANGELES — The culmination of a flawless 8-month awards campaign reached its crescendo at the Dolby Theatre as Christopher Nolan's 'Oppenheimer' claimed seven Academy Awards, including Best Picture, Best Director for Nolan, and Best Actor for lead Cillian Murphy. The Universal Pictures release completed an extraordinary sweep that spanned SAG, Golden Globe, and BAFTA accolades.",

        "Budgeted at $100 million and grossing a staggering $957 million worldwide, 'Oppenheimer' stands as the highest-grossing biographical drama in film history. Studio chair Donna Langley hailed the victory during post-show galas: 'This project represents the apex of studio filmmaking—uncompromising artistic integrity paired with massive global audience connection.'",

        "Industry insiders note that the victory represents a major win for Universal's talent acquisition strategy, having lured Nolan away from his long-time studio home Warner Bros. in 2021 with guaranteed theatrical windows, final cut rights, and 20% first-dollar gross terms. Nolan's agency WME brokered the landmark pact, which has now paid off exponentially for both artist and distributor.",

        "With critical scores topping 93% and universal acclaim across international critics guilds, 'Oppenheimer' has reset industry expectations for three-hour adult dramas. As streaming services re-evaluate their film budgets, traditional legacy studios are taking note: auteur-driven cinema with event presentation remains the industry's premier crown jewel."
      ],
      comments: oppenheimerComments,
    });

    // 3. Studio Merger / Industry News
    const studioComments = this.generateNPCComments('Major Studio Expansion', 'Studios', {
      studioName: 'Paramount Global & Skydance',
      directorName: 'David Ellison',
    }, 70);

    articles.push({
      id: 'art_studio_merger_skydance',
      headline: "STUDIO LANDSCAPE: Skydance & Paramount Merge in $8 Billion Power Deal to Reshape Hollywood Major Slate",
      subHeadline: "David Ellison takes the helm as chief executive, pledging $1.5B capital injection into theatrical tentpoles and streaming IP.",
      category: 'Studios',
      publisher: 'Hollywood Insider',
      publishDate: 'Week 1, Year 1',
      weekNumber: 1,
      yearNumber: 1,
      readTimeMinutes: 6,
      heroImageUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&auto=format&fit=crop',
      imageCaption: 'Paramount Pictures iconic studio lot gate in Hollywood as new corporate leadership takes control.',
      excerpt: "An in-depth structural analysis of the Skydance-Paramount transaction and what it means for talent agencies, greenlight budgets, and slate production.",
      authorName: 'Matt Belloni',
      authorRole: 'Chief Hollywood Analyst',
      relatedEntities: {
        studioName: 'Paramount Global & Skydance',
        directorName: 'David Ellison',
      },
      viewsCount: 215000,
      likesCount: 14200,
      sharesCount: 4900,
      commentCount: studioComments.length,
      isTrending: false,
      isHeadlineBanner: false,
      contentParagraphs: [
        "HOLLYWOOD — In a seismic structural shift for the entertainment industry, David Ellison's Skydance Media has officially finalized its $8 billion acquisition and merger with Paramount Global. The deal unites the historic 112-year-old studio lot on Melrose Avenue with Skydance's high-octane production machinery behind franchises like 'Top Gun: Maverick' and 'Mission: Impossible'.",

        "Under the terms of the transaction approved by regulators, RedBird Capital and the Ellison family are injecting $1.5 billion in primary capital directly onto Paramount's balance sheet to eliminate legacy debt and bolster theatrical production slates. Ellison will serve as Chairman and CEO, bringing in former NBCUniversal chief Jeff Shell as President.",

        "For talent agencies CAA, WME, and UTA, the merger promises a resurgence in greenlight decisions. Skydance leadership has pledged to produce between 15 to 20 theatrical features annually while refocusing Paramount+ on profitable licensing models rather than unsustainable subscriber growth at all costs.",

        "Industry legal analysts at powerhouse law firms note that the deal sets a precedent for upcoming media consolidation. As legacy studios contend with shifting advertising markets and theatrical recovery, capital-rich indie buyers are stepping in to rebuild the classic Hollywood studio system for the next generation."
      ],
      comments: studioComments,
    });

    return {
      articles,
      bookmarkedIds: [],
    };
  }

  // =========================================================================
  // REAL GAMEPLAY EVENT ARTICLE GENERATORS
  // =========================================================================

  /**
   * Called whenever a Player or NPC releases a movie
   */
  public static onMovieReleased(
    movie: ReleasedMovie,
    player: Player,
    isPlayerMovie = false
  ): void {
    const state = this.getState();
    const reporter = TRADE_REPORTERS[Math.floor(Math.random() * TRADE_REPORTERS.length)];

    const title = movie.title || 'Untitled Feature';
    const studio = movie.studio || 'Indie Distributor';
    const director = movie.directorName || 'A-List Filmmaker';
    const budget = movie.budget || 25000000;
    const actorName = isPlayerMovie ? (player.stageName || player.name) : (movie.coStarNames?.[0] || 'Starring Actor');
    const criticScore = movie.criticScore || 78;
    const audienceScore = movie.audienceScore || 82;

    const category: NewsCategory = isPlayerMovie ? 'Movies' : 'Box Office';
    const headline = isPlayerMovie
      ? `BREAKING PREMIERE: ${actorName} Stars in ${studio}'s High-Stakes Feature '${title}'`
      : `THEATRICAL DEBUT: '${title}' Arrives in Theaters Worldwide via ${studio}`;

    const subHeadline = `${studio} rolls out ${title} with $${(budget / 1000000).toFixed(1)}M budget, targeting global audiences with ${criticScore}% Rotten Tomatoes score.`;

    const comments = this.generateNPCComments(`Release of ${title}`, category, {
      movieTitle: title,
      actorName,
      studioName: studio,
      directorName: director,
      grossAmount: movie.worldwideGross || budget * 2.5,
    }, Math.floor(Math.random() * 40) + 60);

    const newArticle: HollywoodInsiderArticle = {
      id: `art_rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      headline,
      subHeadline,
      category,
      publisher: 'Hollywood Insider',
      publishDate: `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`,
      weekNumber: player.dateWeek || 1,
      yearNumber: player.dateYear || 1,
      readTimeMinutes: 4,
      heroImageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop',
      imageCaption: `Official publicity poster for '${title}', currently in nationwide theatrical release.`,
      excerpt: `An inside look at the theatrical premiere of '${title}', starring ${actorName} and backed by ${studio}.`,
      authorName: reporter.name,
      authorRole: reporter.role,
      relatedEntities: {
        movieTitle: title,
        actorName,
        studioName: studio,
        directorName: director,
      },
      viewsCount: Math.floor(Math.random() * 180000) + 90000,
      likesCount: Math.floor(Math.random() * 15000) + 3000,
      sharesCount: Math.floor(Math.random() * 4000) + 800,
      commentCount: comments.length,
      isTrending: true,
      isBreaking: isPlayerMovie,
      isHeadlineBanner: isPlayerMovie,
      contentParagraphs: [
        `HOLLYWOOD — The entertainment industry turned its spotlight toward theaters this weekend as ${studio} officially launched '${title}', the $${(budget / 1000000).toFixed(1)} million feature starring ${actorName} and directed by ${director}. The release arrives accompanied by significant buzz from early guild screenings.`,

        `Critics have responded enthusiastically, awarding the film a ${criticScore}% Certified Fresh rating on Rotten Tomatoes, with audience exit polling sitting at a strong ${audienceScore}%. Reviews specifically praised ${actorName}'s compelling screen presence and emotional resonance, cementing their position among Hollywood's most versatile performers.`,

        `Behind the camera, ${studio} spared no expense during principal photography, utilizing state-of-the-art camera systems and high-end visual effects suites. Producer sources confirm that aggressive international publicity tours across London, Paris, and Tokyo have laid the foundation for strong holdovers in foreign territories.`,

        `Industry analysts at Hollywood Insider project '${title}' will comfortably recoup its production investment through multi-window distribution, including theatrical grosses, premium PVOD, and syndication licensing. As ticket sales build momentum, all eyes remain on the coming weekend box office chart rankings.`
      ],
      comments,
    };

    state.articles.unshift(newArticle);
    this.saveState(state);
  }

  /**
   * Called during weekly box office calculation
   */
  public static onBoxOfficeWeeklyResults(
    topMovieTitle: string,
    topMovieGross: number,
    studioName: string,
    playerWeek: number,
    playerYear: number
  ): void {
    const state = this.getState();
    const reporter = TRADE_REPORTERS[5]; // Anthony D'Alessandro (Box Office Editor)

    const grossM = (topMovieGross / 1000000).toFixed(1);
    const headline = `WEEKEND BOX OFFICE: '${topMovieTitle}' Retains #1 Spot With $${grossM}M Global Revenue`;

    const comments = this.generateNPCComments(`Box Office ${topMovieTitle}`, 'Box Office', {
      movieTitle: topMovieTitle,
      studioName,
      grossAmount: topMovieGross,
    }, Math.floor(Math.random() * 30) + 50);

    const newArticle: HollywoodInsiderArticle = {
      id: `art_bo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      headline,
      subHeadline: `Exhibitor charts confirm strong theatrical attendance as ${studioName} leads global multiplex revenues.`,
      category: 'Box Office',
      publisher: 'Hollywood Insider',
      publishDate: `Week ${playerWeek}, Year ${playerYear}`,
      weekNumber: playerWeek,
      yearNumber: playerYear,
      readTimeMinutes: 3,
      heroImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop',
      imageCaption: 'Moviegoers queue outside urban multiplex theaters for weekend showtimes.',
      excerpt: `Weekly box office numbers confirm '${topMovieTitle}' dominates worldwide ticket receipts with $${grossM}M gross.`,
      authorName: reporter.name,
      authorRole: reporter.role,
      relatedEntities: {
        movieTitle: topMovieTitle,
        studioName,
        grossAmount: topMovieGross,
      },
      viewsCount: Math.floor(Math.random() * 120000) + 50000,
      likesCount: Math.floor(Math.random() * 9000) + 2000,
      sharesCount: Math.floor(Math.random() * 2000) + 400,
      commentCount: comments.length,
      isTrending: false,
      isHeadlineBanner: false,
      contentParagraphs: [
        `LOS ANGELES — Multiplex attendance remained robust across North America and overseas markets this week as ${studioName}'s blockbuster '${topMovieTitle}' continued its theatrical dominance, adding $${grossM} million to its global receipts.`,

        `Distribution executives noted minimal week-over-week drop-offs, attributing the sustained momentum to strong word-of-mouth commentary and repeat viewings on premium format screens including IMAX and Dolby Cinema.`,

        `Exhibitor relations teams report that international holds in key markets such as Germany, Australia, and Brazil outperformed conservative studio projections by over 18%, providing a solid buffer heading into next week's competitive new releases.`
      ],
      comments,
    };

    state.articles.unshift(newArticle);
    this.saveState(state);
  }

  /**
   * Called when player or NPC wins an award
   */
  public static onAwardWon(
    actorName: string,
    awardTitle: string,
    ceremonyName: string,
    movieTitle: string,
    playerWeek: number,
    playerYear: number
  ): void {
    const state = this.getState();
    const reporter = TRADE_REPORTERS[6]; // Rebecca Ford

    const headline = `AWARDS TRIUMPH: ${actorName} Wins ${awardTitle} at The Annual ${ceremonyName}`;

    const comments = this.generateNPCComments(`Award Victory ${actorName}`, 'Awards', {
      actorName,
      movieTitle,
      awardName: awardTitle,
    }, Math.floor(Math.random() * 40) + 65);

    const newArticle: HollywoodInsiderArticle = {
      id: `art_awd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      headline,
      subHeadline: `A standing ovation greets ${actorName}'s victory for their unforgettable portrayal in '${movieTitle}'.`,
      category: 'Awards',
      publisher: 'Hollywood Insider',
      publishDate: `Week ${playerWeek}, Year ${playerYear}`,
      weekNumber: playerWeek,
      yearNumber: playerYear,
      readTimeMinutes: 4,
      heroImageUrl: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200&auto=format&fit=crop',
      imageCaption: `Golden statuettes and trophy honors presented during the ${ceremonyName} gala ceremony.`,
      excerpt: `Full awards coverage as ${actorName} takes home ${awardTitle} for their standout performance in '${movieTitle}'.`,
      authorName: reporter.name,
      authorRole: reporter.role,
      relatedEntities: {
        actorName,
        movieTitle,
        awardName: awardTitle,
      },
      viewsCount: Math.floor(Math.random() * 210000) + 80000,
      likesCount: Math.floor(Math.random() * 22000) + 5000,
      sharesCount: Math.floor(Math.random() * 6000) + 1200,
      commentCount: comments.length,
      isTrending: true,
      isHeadlineBanner: true,
      contentParagraphs: [
        `HOLLYWOOD — In one of the evening's most emotional moments, ${actorName} was officially honored with the ${awardTitle} at the ${ceremonyName} gala, receiving a rousing standing ovation from peers and industry legends inside the auditorium.`,

        `The recognition comes as a crowning achievement for ${actorName}'s work in '${movieTitle}', a role that critics previously heralded as a career-defining turn. Voting members praised the depth, nuance, and dedication brought to the character.`,

        `Accepting the statuette onstage, ${actorName} expressed gratitude to the film's creative team, studio supporters, and talent representation, noting that the project represented a labor of passion from day one. The victory significantly boosts market value and prestige status heading into upcoming casting seasons.`
      ],
      comments,
    };

    state.articles.unshift(newArticle);
    this.saveState(state);
  }

  /**
   * Called when player or actor signs contract or switches talent agency / lawyer
   */
  public static onContractOrAgencySigned(
    actorName: string,
    agencyName: string,
    salary: number,
    projectTitle: string,
    playerWeek: number,
    playerYear: number
  ): void {
    const state = this.getState();
    const reporter = TRADE_REPORTERS[1]; // Borys Kit

    const headline = `TALENT SIGNING: ${actorName} Inks Major Deal With ${agencyName} for '${projectTitle}'`;
    const salaryText = salary > 0 ? `$${salary.toLocaleString()}` : 'competitive multi-million dollar';

    const comments = this.generateNPCComments(`Signing ${actorName}`, 'Casting', {
      actorName,
      movieTitle: projectTitle,
      agencyName,
    }, Math.floor(Math.random() * 30) + 55);

    const newArticle: HollywoodInsiderArticle = {
      id: `art_rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      headline,
      subHeadline: `${agencyName} secures key representation rights as ${actorName} prepares for lead production role in '${projectTitle}'.`,
      category: 'Casting',
      publisher: 'Hollywood Insider',
      publishDate: `Week ${playerWeek}, Year ${playerYear}`,
      weekNumber: playerWeek,
      yearNumber: playerYear,
      readTimeMinutes: 4,
      heroImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop',
      imageCaption: 'Beverly Hills talent agency headquarters where high-stakes deals are finalized.',
      excerpt: `Details on ${actorName}'s new deal brokered by ${agencyName} featuring a ${salaryText} salary structure.`,
      authorName: reporter.name,
      authorRole: reporter.role,
      relatedEntities: {
        actorName,
        movieTitle: projectTitle,
        agencyName,
      },
      viewsCount: Math.floor(Math.random() * 140000) + 40000,
      likesCount: Math.floor(Math.random() * 11000) + 2500,
      sharesCount: Math.floor(Math.random() * 3000) + 500,
      commentCount: comments.length,
      isTrending: false,
      isHeadlineBanner: false,
      contentParagraphs: [
        `BEVERLY HILLS — In a major move on the agency landscape, ${actorName} has officially aligned representation with powerhouse talent firm ${agencyName}, finalizing terms for a key starring role in upcoming feature '${projectTitle}'.`,

        `Sources close to the deal confirm the pact was negotiated with premium terms, securing a ${salaryText} compensation package alongside backend gross participation points and priority billing credits.`,

        `The signing marks a significant strategic win for ${agencyName}, which continues to expand its roster of top-tier film talent. Production on '${projectTitle}' is slated to commence shortly following pre-production rehearsals.`
      ],
      comments,
    };

    state.articles.unshift(newArticle);
    this.saveState(state);
  }

  /**
   * Called when a PR scandal occurs or PR campaign finishes
   */
  public static onPRScandalOrCampaign(
    scandalTitle: string,
    actorName: string,
    impactDescription: string,
    playerWeek: number,
    playerYear: number
  ): void {
    const state = this.getState();
    const reporter = TRADE_REPORTERS[4]; // Tatiana Siegel

    const headline = `HOLLYWOOD SPOTLIGHT: ${scandalTitle} Involving ${actorName} Draws Industry Attention`;

    const comments = this.generateNPCComments(`Scandal ${actorName}`, 'Scandals', {
      actorName,
    }, Math.floor(Math.random() * 45) + 70);

    const newArticle: HollywoodInsiderArticle = {
      id: `art_scn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      headline,
      subHeadline: `Public relations teams move quickly as controversy surrounding ${actorName} prompts public debate.`,
      category: 'Scandals',
      publisher: 'Hollywood Insider',
      publishDate: `Week ${playerWeek}, Year ${playerYear}`,
      weekNumber: playerWeek,
      yearNumber: playerYear,
      readTimeMinutes: 4,
      heroImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop',
      imageCaption: 'Press microphones and news cameras gather during public statements in Los Angeles.',
      excerpt: `Public relations analysis as ${actorName} addresses recent industry updates and public reputation statements.`,
      authorName: reporter.name,
      authorRole: reporter.role,
      relatedEntities: {
        actorName,
      },
      viewsCount: Math.floor(Math.random() * 260000) + 110000,
      likesCount: Math.floor(Math.random() * 19000) + 4000,
      sharesCount: Math.floor(Math.random() * 8000) + 1500,
      commentCount: comments.length,
      isTrending: true,
      isHeadlineBanner: false,
      contentParagraphs: [
        `HOLLYWOOD — High-profile public relations crisis teams were mobilized in Los Angeles this week following breaking news regarding '${scandalTitle}' involving actor ${actorName}.`,

        `Industry publicists and brand crisis consultants have been actively shaping media messaging, issuing official statements aimed at clarifying details and preserving key endorsement partnerships and studio relationships.`,

        `Social media commentary surged across platforms, with fans and industry observers exchanging opinions. As PR representatives coordinate next steps, the situation serves as a vivid reminder of the speed at which public perception shifts in modern entertainment culture.`
      ],
      comments,
    };

    state.articles.unshift(newArticle);
    this.saveState(state);
  }

  /**
   * Bookmark or unbookmark article
   */
  public static toggleBookmark(articleId: string): void {
    const state = this.getState();
    if (!state.bookmarkedIds) state.bookmarkedIds = [];

    const index = state.bookmarkedIds.indexOf(articleId);
    if (index > -1) {
      state.bookmarkedIds.splice(index, 1);
    } else {
      state.bookmarkedIds.push(articleId);
    }

    state.articles = state.articles.map((art) => {
      if (art.id === articleId) {
        return { ...art, userBookmarked: index === -1 };
      }
      return art;
    });

    this.saveState(state);
  }

  /**
   * Like an article
   */
  public static toggleLikeArticle(articleId: string): void {
    const state = this.getState();
    state.articles = state.articles.map((art) => {
      if (art.id === articleId) {
        const currentlyLiked = art.userLiked;
        return {
          ...art,
          userLiked: !currentlyLiked,
          likesCount: currentlyLiked ? art.likesCount - 1 : art.likesCount + 1,
        };
      }
      return art;
    });
    this.saveState(state);
  }

  /**
   * Add player comment to an article
   */
  public static addPlayerComment(articleId: string, player: Player, text: string): void {
    if (!text.trim()) return;

    const state = this.getState();
    state.articles = state.articles.map((art) => {
      if (art.id === articleId) {
        const playerName = player.stageName || player.name || 'Star Player';
        const playerHandle = `@${playerName.replace(/\s+/g, '')}`;

        const playerComment: NPCComment = {
          id: `comment_player_${Date.now()}`,
          authorName: playerName,
          authorHandle: playerHandle,
          authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
          authorType: 'VERIFIED_CELEBRITY',
          isVerified: true,
          roleBadge: 'Hollywood Actor',
          text: text.trim(),
          likesCount: 1,
          isTopComment: false,
          timeAgo: 'Just now',
          userLiked: true,
        };

        const updatedComments = [playerComment, ...art.comments];
        return {
          ...art,
          comments: updatedComments,
          commentCount: updatedComments.length,
        };
      }
      return art;
    });

    this.saveState(state);
  }
}
