/**
 * HOLLYWOOD RISING — TV & RADIO INTERVIEW ENGINE (rebuild)
 * GHOST-NOTICE FIX: every inbox message originates here and ONLY fires when
 * a real offer is created or goes live. Offers REPLACE per-station (no DONE
 * shadowing), booking targets any UNLOCKED station by fame, and invitations
 * on locked stations stay visible ("held warm") in the views.
 *
 * Q&A: SEPARATE endless pools — TV questions use TV archetypes
 * (HUMBLE/WITTY/BOLD/DEFLECT/POLISHED), radio uses a different set
 * (DEADPAN/PLAYFUL/CANDID/BLUNT/SINCERE) with different copy. All content
 * is drawn from the player's REAL career state. Rewards are toned down
 * (~60% lower than the old engine) and radio fees use listenerBase.
 */

import { TvQuestion, TvStationType, TvInterviewResult, TvAnswerChoice } from '../types/world';
import { Player } from '../types/game';
import { FAME_XP_MULTIPLIER } from './fameService';
import { INITIAL_TV_STATIONS, INITIAL_RADIO_STATIONS } from '../database/worldDatabase';

export interface TvInterviewContext {
  player: Player;
  latestMovie?: any;
  totalGross?: number;
  awardsWon: number;
  hasScandal: boolean;
  fans: number;
  isUnionMember: boolean;
  relationships?: any[];
}

const fmtM = (n: number) => (n >= 1000000000 ? `$${(n / 1000000).toFixed(0)}M` : `$${(n / 1000000).toFixed(0)}M`);

// ============================================================
// TV QUESTION POOL — archetypes: HUMBLE / WITTY / BOLD / DEFLECT / POLISHED
// ============================================================
export function buildTvQuestions(ctx: TvInterviewContext, stationType: TvStationType, excludeIds: string[]): TvQuestion[] {
  const qs: TvQuestion[] = [];
  const p = ctx.player;
  const movie = ctx.latestMovie;
  const movieTitle = movie?.movieTitle || '';
  const gross = ctx.totalGross || 0;
  const dir = movie?.director || 'the director';

  if (movieTitle && gross > 0) {
    qs.push({
      id: 'tv_mv_1', context: 'movie',
      question: `"${movieTitle}" has now crossed ${fmtM(gross)} worldwide. When did it hit you that this thing was real?`,
      answers: [
        { text: 'Opening weekend. I stared at my phone, called my mom, and she asked if I was eating enough.', style: 'HUMBLE', repChange: 3, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'The studio audience melts.' },
        { text: 'When my accountant started answering my calls on the first ring.', style: 'WITTY', repChange: 1, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'Big laugh across the desk.' },
        { text: 'When the studio called the sequel a "franchise." That word costs extra.', style: 'BOLD', repChange: -1, fansMult: 1.9, scandalRisk: 0.08, crowdReaction: 'The host leans back — that is a clip.' },
      ],
    });
    qs.push({
      id: 'tv_mv_2', context: 'movie',
      question: `Critics scored "${movieTitle}" at ${movie?.criticRating || 80}%. Do you actually read your own reviews?`,
      answers: [
        { text: 'Every one. The harsh ones hurt, and they should — that is how I grow.', style: 'HUMBLE', repChange: 3, fansMult: 1.2, scandalRisk: 0, crowdReaction: 'The desk nods with respect.' },
        { text: 'The good ones twice, the bad ones never, the Medium ones framed.', style: 'WITTY', repChange: 1, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'Laughing — and hashtag incoming.' },
        { text: 'The box office is the only review that deposits money.', style: 'BOLD', repChange: -2, fansMult: 1.8, scandalRisk: 0.12, crowdReaction: 'Oof. Critics are typing.' },
        { text: 'My team reads them and tells me the weather. Sunny, always sunny.', style: 'DEFLECT', repChange: 1, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'Smooth pivot — the host smiles.' },
      ],
    });
    qs.push({
      id: 'tv_mv_3', context: 'movie',
      question: `What was the single hardest scene to shoot in "${movieTitle}"?`,
      answers: [
        { text: 'A quiet two-page monologue. No music, no cuts — just me and the lens.', style: 'HUMBLE', repChange: 2, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'Craft talk — the actors at home cheer.' },
        { text: 'The running scene. Take fourteen. I still hear the director counting.', style: 'WITTY', repChange: 1, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'The audience cracks up.' },
        { text: 'Every scene with a certain co-star. Chemistry is a post-production miracle sometimes.', style: 'BOLD', repChange: -3, fansMult: 1.7, scandalRisk: 0.2, crowdReaction: 'The host circles back — trap sprung.' },
      ],
    });
    qs.push({
      id: 'tv_mv_4', context: 'movie',
      question: `${dir} runs a famously tight set. Give us one behind-the-scenes secret from "${movieTitle}".`,
      answers: [
        { text: 'The secret is there is no secret. Preparation, sunrise to sunset, every day.', style: 'POLISHED', repChange: 2, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'A pro talking like a pro.' },
        { text: 'Craft services had a strict "no donuts after act two" policy. We suffered for art.', style: 'WITTY', repChange: 2, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'The studio roars.' },
        { text: 'Half the explosions you saw were the producer losing his temper.', style: 'BOLD', repChange: -1, fansMult: 1.8, scandalRisk: 0.1, crowdReaction: 'That is going in the promo.' },
      ],
    });
  }

  if (ctx.awardsWon > 0) {
    qs.push({
      id: 'tv_aw_1', context: 'award',
      question: `${ctx.awardsWon} major award${ctx.awardsWon > 1 ? 's' : ''} on the shelf. Where do they actually live?`,
      answers: [
        { text: 'In my office, facing the door — so every audition walks in with me.', style: 'HUMBLE', repChange: 3, fansMult: 1.2, scandalRisk: 0, crowdReaction: 'The audience applauds.' },
        { text: 'One on the shelf, one holding the door, one scaring my mailman.', style: 'WITTY', repChange: 1, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'Ha! Relatable royalty.' },
        { text: 'Awards are furniture. The work is the only trophy that talks back.', style: 'BOLD', repChange: -2, fansMult: 1.6, scandalRisk: 0.1, crowdReaction: 'The academy raises an eyebrow.' },
      ],
    });
  }

  if (ctx.hasScandal) {
    qs.push({
      id: 'tv_sc_1', context: 'scandal',
      question: `I have to ask about the tabloid story making the rounds. Set the record straight — what really happened?`,
      answers: [
        { text: 'It was exaggerated. I own my part of it, and I am moving forward.', style: 'HUMBLE', repChange: 4, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'Grace under lights — the room exhales.' },
        { text: 'The record is warped, the needle is bent, and the DJ was paid.', style: 'WITTY', repChange: 1, fansMult: 1.7, scandalRisk: 0.05, crowdReaction: 'Lawyers take notes, fans take clips.' },
        { text: 'Ask my lawyer — I am done feeding that machine.', style: 'BOLD', repChange: -3, fansMult: 1.3, scandalRisk: 0.25, crowdReaction: 'Awkward silence... then applause.' },
        { text: 'What happened is I made a movie and someone needed a headline.', style: 'DEFLECT', repChange: 2, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Smooth — the host moves on.' },
      ],
    });
  }

  qs.push({
    id: 'tv_fun_1', context: 'fun',
    question: 'Rapid fire: first thing you do the morning after a movie wraps?',
    answers: [
      { text: 'Sleep until Tuesday, then call my mother.', style: 'HUMBLE', repChange: 2, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'The crowd cheers.' },
      { text: 'Book a flight somewhere the paparazzi need a visa.', style: 'WITTY', repChange: 1, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Ha — take us with you!' },
      { text: 'Read the next contract. Momentum does not take vacations.', style: 'BOLD', repChange: 0, fansMult: 1.3, scandalRisk: 0.05, crowdReaction: 'Grinder respect.' },
    ],
  });
  qs.push({
    id: 'tv_fun_2', context: 'fun',
    question: 'If the phone stopped ringing tomorrow — plan B?',
    answers: [
      { text: 'Teaching. Breaking down scenes with young actors is my favorite conversation.', style: 'HUMBLE', repChange: 3, fansMult: 1.2, scandalRisk: 0, crowdReaction: 'Genuinely inspiring.' },
      { text: 'Chef. My pasta is elite; my smoke alarm agrees.', style: 'WITTY', repChange: 2, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'The audience is laughing.' },
      { text: 'Run a studio. I have notes about this town and a printer.', style: 'BOLD', repChange: -1, fansMult: 1.4, scandalRisk: 0.05, crowdReaction: 'Power-move energy.' },
      { text: 'I would tell you, but then plan B would need a publicist.', style: 'DEFLECT', repChange: 1, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'Cheeky — the host grins.' },
    ],
  });
  qs.push({
    id: 'tv_career_1', context: 'career',
    question: 'Hollywood loves an overnight success. How long was YOUR overnight?',
    answers: [
      { text: 'Years of noes. Every yes I get still has their voices in it.', style: 'HUMBLE', repChange: 3, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The room goes quiet, then claps.' },
      { text: 'About eleven years — ten of them in traffic on the 101.', style: 'WITTY', repChange: 1, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'LA viewers feel that one.' },
      { text: 'Still waiting. Wake me when it is over.', style: 'POLISHED', repChange: 2, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'Humble AND smooth.' },
    ],
  });
  qs.push({
    id: 'tv_fun_3', context: 'fun',
    question: 'Your phone blows up when a trailer drops. Who gets the first text?',
    answers: [
      { text: 'My family group chat. They rate everything out of ten, brutally.', style: 'HUMBLE', repChange: 2, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'Wholesome — the audience loves it.' },
      { text: 'My stunt double. He did most of it and deserves the panic.', style: 'WITTY', repChange: 2, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Big laugh!' },
      { text: 'My agent. First text, last text, every text.', style: 'BOLD', repChange: 0, fansMult: 1.2, scandalRisk: 0.02, crowdReaction: 'Honest to a fault.' },
    ],
  });

  if (stationType === 'Sports') {
    qs.push({
      id: 'tv_spr_1', context: 'career',
      question: 'The action sequences — how much is really you up there on screen?',
      answers: [
        { text: 'Months of training per stunt. When it is me, I want you to KNOW it is me.', style: 'HUMBLE', repChange: 3, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The sports desk respects it.' },
        { text: 'Sixty percent me, forty percent a maniac named Dave.', style: 'WITTY', repChange: 2, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Dave deserves a raise!' },
        { text: 'One hundred percent. The insurance company weeps; I do not.', style: 'BOLD', repChange: -1, fansMult: 1.8, scandalRisk: 0.1, crowdReaction: 'Producers everywhere just gasped.' },
      ],
    });
  }
  if (stationType === 'News' || stationType === 'International') {
    qs.push({
      id: 'tv_nws_1', context: 'career',
      question: 'Your films play in a hundred countries. Do you feel the weight of that platform?',
      answers: [
        { text: 'Deeply. Stories cross borders that politics cannot, and I take that seriously.', style: 'HUMBLE', repChange: 4, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'A statesman answer. Well said.' },
        { text: 'I feel it mostly through my accountant. International residuals are poetic.', style: 'WITTY', repChange: 1, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The news desk chuckles.' },
        { text: 'I entertain. Policymaking I leave to people with worse tailors.', style: 'BOLD', repChange: -2, fansMult: 1.5, scandalRisk: 0.12, crowdReaction: 'That quote will run all week.' },
      ],
    });
  }

  let pool = qs.filter((q) => !excludeIds.includes(q.id));
  if (pool.length < 3) pool = qs;
  return shuffle(pool).slice(0, 5);
}

// ============================================================
// RADIO QUESTION POOL — archetypes: DEADPAN / PLAYFUL / CANDID / BLUNT / SINCERE
// Completely different questions AND answers from TV. No repeats across media.
// ============================================================
export function buildRadioQuestions(ctx: TvInterviewContext, stationType: any, excludeIds: string[]): TvQuestion[] {
  const qs: TvQuestion[] = [];
  const movie = ctx.latestMovie;
  const movieTitle = movie?.movieTitle || '';
  const gross = ctx.totalGross || 0;

  if (movieTitle && gross > 0) {
    qs.push({
      id: 'rad_mv_1', context: 'movie',
      question: `Caller line one! "${movieTitle}" made ${fmtM(gross)} — caller wants to know what you bought yourself first.`,
      answers: [
        { text: 'A mattress. Hero of my life. Zero regrets.', style: 'DEADPAN', repChange: 2, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The host loses it.' },
        { text: 'Depends who is asking... and caller one sounds lovely tonight.', style: 'PLAYFUL', repChange: 1, fansMult: 1.7, scandalRisk: 0.08, crowdReaction: 'The switchboard lights up.' },
        { text: 'Groceries. Fame smells great but it does not cook.', style: 'CANDID', repChange: 3, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'Real ones agree loudly.' },
      ],
    });
    qs.push({
      id: 'rad_mv_2', context: 'movie',
      question: `Your clip from the "${movieTitle}" press junket went viral for the wrong reason. Word for word — what did you mean?`,
      answers: [
        { text: 'I meant it. The edit lost the question; the outrage kept the ad breaks.', style: 'BLUNT', repChange: -1, fansMult: 1.8, scandalRisk: 0.12, crowdReaction: 'Radio gold — phones are lighting up.' },
        { text: 'I meant buy tickets to the movie. That is the quote. That is the whole quote.', style: 'DEADPAN', repChange: 2, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'The host cackles.' },
        { text: 'I meant that clip was thirty seconds of a two-hour conversation.', style: 'SINCERE', repChange: 3, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'Even the producer nods.' },
      ],
    });
    qs.push({
      id: 'rad_mv_3', context: 'movie',
      question: `Drive-time truth: was there a take on "${movieTitle}" so bad the crew still brings it up?`,
      answers: [
        { text: 'Take forty-one of a two-line scene. The boom operator has it memorized.', style: 'DEADPAN', repChange: 2, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Traffic is laughing with you.' },
        { text: 'I once called "action" on myself. The director still sends it on my birthday.', style: 'PLAYFUL', repChange: 2, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'The whole studio loses it.' },
        { text: 'There was a take where I forgot my own character name. In my own movie.', style: 'CANDID', repChange: 2, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Honestly? Iconic.' },
      ],
    });
  }

  if (ctx.awardsWon > 0) {
    qs.push({
      id: 'rad_aw_1', context: 'award',
      question: `You won ${ctx.awardsWon} trophy${ctx.awardsWon > 1 ? 's' : ''} — did the speech go as rehearsed?`,
      answers: [
        { text: 'I rehearsed gratitude. I delivered a hostage video.', style: 'DEADPAN', repChange: 2, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'The host is WHEEZING.' },
        { text: 'There was a teleprompter. It blinked. I freestyled. History.', style: 'PLAYFUL', repChange: 1, fansMult: 1.7, scandalRisk: 0.05, crowdReaction: 'Listeners are dying.' },
        { text: 'The speech was fine. The stairs were the real performance.', style: 'BLUNT', repChange: 0, fansMult: 1.5, scandalRisk: 0.05, crowdReaction: 'Harsh but fair.' },
      ],
    });
  }

  if (ctx.hasScandal) {
    qs.push({
      id: 'rad_sc_1', context: 'scandal',
      question: `The blogs had a FIELD day with you last month. Free therapy hour — what is the untold version?`,
      answers: [
        { text: 'The untold version is shorter than the blog post and less profitable.', style: 'DEADPAN', repChange: 2, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'Mic drop energy.' },
        { text: 'There were witnesses. They were cats. They will not testify.', style: 'PLAYFUL', repChange: 2, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'The switchboard explodes.' },
        { text: 'I was in the wrong place, at the wrong hour, with the right intentions.', style: 'SINCERE', repChange: 4, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The room softens.' },
      ],
    });
  }

  qs.push({
    id: 'rad_fun_1', context: 'fun',
    question: 'Fame hit fast. Caller from Pasadena asks: what did nobody warn you about?',
    answers: [
      { text: 'That loneliness gets a stylist. It looks great; it is still lonely.', style: 'SINCERE', repChange: 4, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The host goes quiet. Powerful radio.' },
      { text: 'Nobody warned my bank account about my taste in cars.', style: 'DEADPAN', repChange: 2, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Laughs all over the freeway.' },
      { text: 'That everyone who doubted me suddenly remembers my birthday.', style: 'BLUNT', repChange: 0, fansMult: 1.8, scandalRisk: 0.08, crowdReaction: 'Savage — callers LOVE it.' },
    ],
  });
  qs.push({
    id: 'rad_fun_2', context: 'fun',
    question: 'Traffic is brutal out there. What is actually playing in YOUR car?',
    answers: [
      { text: 'Voice memos of me practicing accents. Terrifying passengers since 2019.', style: 'CANDID', repChange: 3, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The host plays a fake voice memo.' },
      { text: 'The same six songs. We do not discuss the playlist.', style: 'DEADPAN', repChange: 2, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'Relatable honks.' },
      { text: 'Depends on the night... and who is in the passenger seat.', style: 'PLAYFUL', repChange: 1, fansMult: 1.8, scandalRisk: 0.1, crowdReaction: 'The phones WILL NOT stop.' },
    ],
  });
  qs.push({
    id: 'rad_career_1', context: 'career',
    question: 'Word association: I say "Hollywood," you say...?',
    answers: [
      { text: 'Parking.', style: 'DEADPAN', repChange: 2, fansMult: 1.7, scandalRisk: 0, crowdReaction: 'ONE WORD. Devastating. The host howls.' },
      { text: 'A beautiful lie with great lighting.', style: 'PLAYFUL', repChange: 2, fansMult: 1.6, scandalRisk: 0.05, crowdReaction: 'That is a billboard quote.' },
      { text: 'The town that bet against me and pays me to talk about it.', style: 'BLUNT', repChange: 0, fansMult: 1.7, scandalRisk: 0.1, crowdReaction: 'Callers are SCREAMING.' },
    ],
  });
  qs.push({
    id: 'rad_fun_3', context: 'fun',
    question: 'Last question before the news: karaoke song. The floor is yours.',
    answers: [
      { text: 'Something slow. My range is "emotional" to "more emotional."', style: 'SINCERE', repChange: 3, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The host awws audibly.' },
      { text: 'Whatever the room is drinking, the song follows.', style: 'PLAYFUL', repChange: 1, fansMult: 1.7, scandalRisk: 0.05, crowdReaction: 'Chaotic legend behavior.' },
      { text: 'I do not karaoke. I audition. There is a difference.', style: 'DEADPAN', repChange: 2, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'The producer spits out his coffee.' },
    ],
  });
  qs.push({
    id: 'rad_career_2', context: 'career',
    question: 'Callers want the hustle story. What were you doing the day your big break call came?',
    answers: [
      { text: 'Serving tables. I tipped myself with the news.', style: 'DEADPAN', repChange: 2, fansMult: 1.6, scandalRisk: 0, crowdReaction: 'Every server listening screams.' },
      { text: 'Hiding in a stairwell so the landlord would not hear my phone ring.', style: 'SINCERE', repChange: 4, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'Real talk. The show stops for it.' },
      { text: 'Pretending to be busy for a casting office that was also pretending to be busy.', style: 'CANDID', repChange: 3, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Hollywood in one sentence.' },
    ],
  });

  let pool = qs.filter((q) => !excludeIds.includes(q.id));
  if (pool.length < 3) pool = qs;
  return shuffle(pool).slice(0, 5);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Compat alias — TV is the default medium
export const buildQuestions = buildTvQuestions;

// ============================================================
// REWARDS — toned down ~60% from the old engine; radio uses listenerBase
// ============================================================
export function computeInterviewResult(
  ctx: TvInterviewContext,
  station: any,
  questions: TvQuestion[],
  chosen: TvAnswerChoice[],
  medium: 'TV' | 'RADIO' = 'TV'
): TvInterviewResult {
  const p = ctx.player;
  const fame = p.fameXp || 0;
  const audienceBase = medium === 'RADIO'
    ? (station?.listenerBase || station?.viewerBase || 1000000)
    : (station?.viewerBase || 1000000);
  // ~60% cut vs old engine
  const fansBase = Math.floor(160 + Math.sqrt(fame) * 4);
  const cash = Math.floor(audienceBase * 0.0005 + Math.sqrt(fame) * 24);
  const fameTotalRaw = Math.max(1, Math.floor((8 + fame * 0.004) * FAME_XP_MULTIPLIER));

  let fans = 0, rep = 0, fameTotal = 0, scandal = false, cashFinal = cash;
  const reactions: string[] = [];

  chosen.forEach((c, i) => {
    const f = Math.floor(fansBase * (c.fansMult || 1) * (0.85 + Math.random() * 0.3));
    fans += f;
    rep += c.repChange || 0;
    reactions.push(`${questions[i] ? 'Q' + (i + 1) : ''} ${c.crowdReaction} (+${f.toLocaleString()} fans)`);
    if (Math.random() < (c.scandalRisk || 0)) scandal = true;
  });

  const qMult = questions.length / 5;
  fans = Math.floor(fans * (0.7 + qMult * 0.3));
  cashFinal = Math.floor(cash * qMult);
  fameTotal = Math.max(1, Math.floor(fameTotalRaw * qMult));

  return {
    stationName: station?.name || (medium === 'RADIO' ? 'Radio Station' : 'TV Station'),
    host: station?.host || 'The Host',
    questionsAsked: chosen.length,
    cashEarned: cashFinal,
    fansGained: fans,
    fameXpGained: fameTotal,
    reputationChange: rep,
    scandalTriggered: scandal,
    reactions,
  };
}

// ============================================================
// OFFER SCHEDULING + PERSISTENCE — one entry per station, REPLACED on
// re-book (DONE entries never shadow new offers). All notifications
// originate here and ONLY when a real offer exists.
// ============================================================
type EngineMsg = { subject: string; body: string; date: string; read: boolean };
const OFFERS_KEY = 'HR_TV_OFFERS';

export interface TvOfferEntry { stationId: string; offer: any; }

export function loadTvOffers(): TvOfferEntry[] {
  try { return JSON.parse(localStorage.getItem(OFFERS_KEY) || '[]'); } catch { return []; }
}
export function saveTvOffers(offers: TvOfferEntry[]) {
  try { localStorage.setItem(OFFERS_KEY, JSON.stringify(offers)); } catch {}
}

/** Pick a random station the player has UNLOCKED (fame + movies) */
function pickEligibleTvStation(player: any, excludeIds: string[]): any | null {
  const fame = player?.fameXp || 0;
  const movies = player?.moviesCompleted || 0;
  const eligible = INITIAL_TV_STATIONS.filter(
    (st) => fame >= st.minFame && movies >= st.minMovies && !excludeIds.includes(st.id)
  );
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

/** Replace (never shadow) the entry for a station */
function upsertOffer(offers: TvOfferEntry[], stationId: string, offer: any) {
  const idx = offers.findIndex((o) => o.stationId === stationId);
  if (idx >= 0) offers[idx] = { stationId, offer };
  else offers.push({ stationId, offer });
}

// Manager books a TV interview on a random ELIGIBLE station (every 6 weeks).
// The ONLY inbox message is the one returned here — created iff an offer exists.
export function scheduleTvInterview(player: any): EngineMsg[] {
  const msgs: EngineMsg[] = [];
  if (!player?.representation?.manager?.signed) return msgs;
  const offers = loadTvOffers();
  const active = offers.filter((o) => o.offer && o.offer.status !== 'DONE').map((o) => o.stationId);
  const station = pickEligibleTvStation(player, active);
  if (!station) return msgs; // nothing unlocked free → NO offer, NO message

  const mgr = player?.representation?.manager;
  upsertOffer(offers, station.id, {
    id: `tv_int_${Date.now()}`,
    stationId: station.id,
    topic: 'Your career, latest film & what\'s next',
    status: 'PENDING',
    scheduledInWeeks: 3,
    source: 'MANAGER',
    bookedWeek: player?.dateWeek || 1,
    bookedYear: player?.dateYear || 2026,
  });
  saveTvOffers(offers);
  msgs.push({
    subject: `🎙️ BOOKED: ${station.name} — "${station.showName}"`,
    body: `Your manager booked you on ${station.name} ("${station.showName}", host ${station.host}) — airing in 3 weeks.\n\n${station.viewerReach}. When it airs you'll sit for up to 5 questions; your answers shape fans, reputation and your fee.`,
    date: `Week ${player?.dateWeek}, ${player?.dateYear}`,
    read: false,
  });
  return msgs;
}

// Weekly TV processing: countdown → READY; station invitations when the
// player has real news. Invitations may land on LOCKED stations — the views
// show them as "held warm" so nothing is invisible.
export function processTvOffersWeekly(player: any, newWeek: number, newYear: number): EngineMsg[] {
  const offers = loadTvOffers();
  const msgs: EngineMsg[] = [];
  let changed = false;

  if (!player?.representation?.manager?.signed) {
    const stale = offers.some((o) => o.offer && o.offer.status !== 'DONE');
    if (stale) {
      offers.forEach((o) => { if (o.offer && o.offer.status !== 'DONE') o.offer.status = 'DONE'; });
      saveTvOffers(offers);
    }
    return msgs;
  }

  offers.forEach((entry) => {
    const o = entry.offer;
    if (!o || o.status !== 'PENDING') return;
    o.scheduledInWeeks = (o.scheduledInWeeks || 1) - 1;
    changed = true;
    if (o.scheduledInWeeks <= 0) {
      o.status = 'READY';
      const st = INITIAL_TV_STATIONS.find((s) => s.id === entry.stationId);
      msgs.push({
        subject: `🔴 ON AIR NOW: ${st?.name || 'TV interview'} is ready to go live`,
        body: `${st?.name || 'Your show'} is waiting — open World → TV Stations and hit GO LIVE. Up to 5 questions; your answers shape fans, reputation and your appearance fee.`,
        date: `Week ${newWeek}, ${newYear}`,
        read: false,
      });
    } else if (o.scheduledInWeeks === 1) {
      const st = INITIAL_TV_STATIONS.find((s) => s.id === entry.stationId);
      msgs.push({
        subject: `⏰ TOMORROW: ${st?.name || 'TV interview'} airs next week`,
        body: `${st?.name || 'Your interview'} is one week out. Be ready to talk about your career, films and Hollywood life.`,
        date: `Week ${newWeek}, ${newYear}`,
        read: false,
      });
    }
  });

  // Station invitations: real news (a completed movie) invites a random
  // station — including ones above the player's fame (held warm).
  const hasNews = (player?.moviesCompleted || 0) > 0 && (player?.dateWeek || 0) % 4 === 0;
  if (hasNews) {
    const activeCount = offers.filter((o) => o.offer.status === 'PENDING' || o.offer.status === 'READY').length;
    if (activeCount < 2 && offers.length < 6) {
      const taken = offers.map((o) => o.stationId);
      const pool = INITIAL_TV_STATIONS.filter((st) => !taken.includes(st.id));
      if (pool.length > 0) {
        const st = pool[Math.floor(Math.random() * pool.length)];
        const fame = player?.fameXp || 0;
        const movies = player?.moviesCompleted || 0;
        const locked = fame < st.minFame || movies < st.minMovies;
        upsertOffer(offers, st.id, {
          id: `tv_int_${Date.now()}`,
          stationId: st.id,
          topic: 'Your latest news & box office run',
          status: 'PENDING',
          scheduledInWeeks: 2,
          source: 'STATION',
          locked,
          bookedWeek: newWeek,
          bookedYear: newYear,
        });
        changed = true;
        msgs.push({
          subject: locked
            ? `📺 INVITATION HELD: ${st.name} wants you (unlocks at ${st.minFame.toLocaleString()} fame)`
            : `📺 STATION INVITATION: ${st.name} wants you on air`,
          body: locked
            ? `${st.name} ("${st.showName}") invited you — the offer is HELD WARM until you reach ${st.minFame.toLocaleString()} fame XP and ${st.minMovies} completed movies. You can track it on the channel card.`
            : `${st.name} ("${st.showName}", host ${st.host}) invited you on air — airing in 2 weeks. ${st.viewerReach}.`,
          date: `Week ${newWeek}, ${newYear}`,
          read: false,
        });
      }
    }
  }

  if (changed) saveTvOffers(offers);
  return msgs;
}

export function mergeOffersIntoStations(stations: any[]): any[] {
  const offers = loadTvOffers();
  return stations.map((st) => {
    const entry = offers.find((o) => o.stationId === st.id);
    return { ...st, activeInterviewOffer: entry?.offer };
  });
}

export function completeTvOffer(stationId: string) {
  const offers = loadTvOffers();
  const entry = offers.find((o) => o.stationId === stationId);
  if (entry && entry.offer) {
    entry.offer.status = 'DONE';
    saveTvOffers(offers);
  }
}

// ============================================================
// RADIO — same hygiene: one entry per station, replaced on re-book,
// booking targets any UNLOCKED station, engine-only notifications.
// ============================================================
const RADIO_OFFERS_KEY = 'HR_RADIO_OFFERS';

export interface RadioOfferEntry { stationId: string; offer: any; }

export function loadRadioOffers(): RadioOfferEntry[] {
  try { return JSON.parse(localStorage.getItem(RADIO_OFFERS_KEY) || '[]'); } catch { return []; }
}
export function saveRadioOffers(offers: RadioOfferEntry[]) {
  try { localStorage.setItem(RADIO_OFFERS_KEY, JSON.stringify(offers)); } catch {}
}

function pickEligibleRadioStation(player: any, excludeIds: string[]): any | null {
  const fame = player?.fameXp || 0;
  const movies = player?.moviesCompleted || 0;
  const eligible = INITIAL_RADIO_STATIONS.filter(
    (st) => fame >= st.minFame && movies >= st.minMovies && !excludeIds.includes(st.id)
  );
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export function scheduleRadioInterview(player: any): EngineMsg[] {
  const msgs: EngineMsg[] = [];
  if (!player?.representation?.agent?.signed) return msgs;
  const offers = loadRadioOffers();
  const active = offers.filter((o) => o.offer && o.offer.status !== 'DONE').map((o) => o.stationId);
  const station = pickEligibleRadioStation(player, active);
  if (!station) return msgs;

  const agent = player?.representation?.agent;
  upsertRadioOffer(offers, station.id, {
    id: `rad_int_${Date.now()}`,
    stationId: station.id,
    topic: 'Your career, latest film & what\'s next',
    status: 'PENDING',
    scheduledInWeeks: 3,
    source: 'AGENT',
    bookedWeek: player?.dateWeek || 1,
    bookedYear: player?.dateYear || 2026,
  });
  saveRadioOffers(offers);
  msgs.push({
    subject: `📻 BOOKED: ${station.name} with ${station.host}`,
    body: `Your agent ${agent?.name || ''} (${agent?.agencyName || ''}) booked you on ${station.name} — on air in 3 weeks. ${station.listeners}.\n\nUp to 5 questions; your answers shape fans, reputation and your appearance fee.`,
    date: `Week ${player?.dateWeek}, ${player?.dateYear}`,
    read: false,
  });
  return msgs;
}

function upsertRadioOffer(offers: RadioOfferEntry[], stationId: string, offer: any) {
  const idx = offers.findIndex((o) => o.stationId === stationId);
  if (idx >= 0) offers[idx] = { stationId, offer };
  else offers.push({ stationId, offer });
}

export function processRadioOffersWeekly(player: any, newWeek: number, newYear: number): EngineMsg[] {
  const offers = loadRadioOffers();
  const msgs: EngineMsg[] = [];
  let changed = false;

  if (!player?.representation?.agent?.signed) {
    const stale = offers.some((o) => o.offer && o.offer.status !== 'DONE');
    if (stale) {
      offers.forEach((o) => { if (o.offer && o.offer.status !== 'DONE') o.offer.status = 'DONE'; });
      saveRadioOffers(offers);
    }
    return msgs;
  }

  offers.forEach((entry) => {
    const o = entry.offer;
    if (!o || o.status !== 'PENDING') return;
    o.scheduledInWeeks = (o.scheduledInWeeks || 1) - 1;
    changed = true;
    if (o.scheduledInWeeks <= 0) {
      o.status = 'READY';
      const st = INITIAL_RADIO_STATIONS.find((s) => s.id === entry.stationId);
      msgs.push({
        subject: `🔴 ON AIR NOW: ${st?.name || 'Radio interview'} is live`,
        body: `${st?.name || 'Your station'} is waiting — open World → Radio Stations and hit GO LIVE.`,
        date: `Week ${newWeek}, ${newYear}`,
        read: false,
      });
    } else if (o.scheduledInWeeks === 1) {
      msgs.push({
        subject: '⏰ RADIO INTERVIEW TOMORROW',
        body: `Your radio interview airs next week. Be ready!`,
        date: `Week ${newWeek}, ${newYear}`,
        read: false,
      });
    }
  });

  // Producer invitations with real news — may land on locked stations (held warm)
  const hasNews = (player?.moviesCompleted || 0) > 0 && (player?.dateWeek || 0) % 5 === 0;
  if (hasNews) {
    const activeCount = offers.filter((o) => o.offer.status === 'PENDING' || o.offer.status === 'READY').length;
    if (activeCount < 2 && offers.length < 6) {
      const taken = offers.map((o) => o.stationId);
      const pool = INITIAL_RADIO_STATIONS.filter((st) => !taken.includes(st.id));
      if (pool.length > 0) {
        const st = pool[Math.floor(Math.random() * pool.length)];
        const fame = player?.fameXp || 0;
        const movies = player?.moviesCompleted || 0;
        const locked = fame < st.minFame || movies < st.minMovies;
        upsertRadioOffer(offers, st.id, {
          id: `rad_int_${Date.now()}`,
          stationId: st.id,
          topic: 'Your latest news',
          status: 'PENDING',
          scheduledInWeeks: 2,
          source: 'PRODUCER',
          locked,
          bookedWeek: newWeek,
          bookedYear: newYear,
        });
        changed = true;
        msgs.push({
          subject: locked
            ? `📻 INVITATION HELD: ${st.name} (unlocks at ${st.minFame.toLocaleString()} fame)`
            : `📻 PRODUCER INVITE: ${st.name} wants you in the booth`,
          body: locked
            ? `${st.name}'s producer invited you — the offer is HELD WARM until you reach ${st.minFame.toLocaleString()} fame XP and ${st.minMovies} completed movies. Track it on the station card.`
            : `${st.name} (${st.host}) wants you in the booth — recording in 2 weeks. ${st.listeners}.`,
          date: `Week ${newWeek}, ${newYear}`,
          read: false,
        });
      }
    }
  }

  if (changed) saveRadioOffers(offers);
  return msgs;
}

export function mergeRadioOffersIntoStations(stations: any[]): any[] {
  const offers = loadRadioOffers();
  return stations.map((st) => {
    const entry = offers.find((o) => o.stationId === st.id);
    return entry ? { ...st, activeInterviewOffer: entry.offer } : { ...st, activeInterviewOffer: undefined };
  });
}

export function completeRadioOffer(stationId: string) {
  const offers = loadRadioOffers();
  const entry = offers.find((o) => o.stationId === stationId);
  if (entry && entry.offer) { entry.offer.status = 'DONE'; saveRadioOffers(offers); }
}
