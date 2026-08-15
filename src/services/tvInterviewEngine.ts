/**
 * HOLLYWOOD RISING - TV INTERVIEW QUESTION ENGINE
 * Real questions drawn from the player's ACTUAL career (movies, box office,
 * awards, scandals, relationships, endorsements). Per-station-type banks,
 * rotation so nothing repeats, max 5 questions, 3 answer choices each.
 */

import { TvQuestion, TvStationType, TvInterviewResult, TvAnswerChoice } from '../types/world';
import { Player } from '../types/game';

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

const fmtM = (n: number) => (n >= 1000000000 ? `$${(n / 1000000000).toFixed(1)}B` : `$${(n / 1000000).toFixed(0)}M`);

// Build questions dynamically from REAL player state (never fake)
export function buildQuestions(ctx: TvInterviewContext, stationType: TvStationType, excludeIds: string[]): TvQuestion[] {
  const qs: TvQuestion[] = [];
  const p = ctx.player;
  const movie = ctx.latestMovie;
  const pName = `${p.firstName || 'Actor'} ${p.lastName || ''}`.trim();
  const movieTitle = movie?.movieTitle || '';
  const gross = ctx.totalGross || 0;

  // ---- MOVIE / CAREER CONTEXT (only if the player has done it) ----
  if (movieTitle && gross > 0) {
    qs.push({
      id: 'mv_1', question: `Let's talk about "${movieTitle}" — it's pulled in ${fmtM(gross)} worldwide. What was the moment you knew it was working?`, context: 'movie',
      answers: [
        { text: 'Opening weekend numbers came in and I just stared at my phone — surreal.', style: 'HUMBLE', repChange: 2, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'The crowd loves that honest answer!' },
        { text: 'Honestly? I knew from day one on set. I told my agent to clear my schedule.', style: 'WITTY', repChange: 1, fansMult: 1.6, scandalRisk: 0.02, crowdReaction: 'Big laugh from the studio audience!' },
        { text: 'The studio knew before I did. They were printing money from the trailers.', style: 'CONTROVERSIAL', repChange: -2, fansMult: 2.0, scandalRisk: 0.12, crowdReaction: 'Oof — that one might get clipped.' },
      ],
    });
    qs.push({
      id: 'mv_2', question: `Critics gave "${movieTitle}" ${movie?.criticRating || 80}%. Do you read your reviews?`, context: 'movie',
      answers: [
        { text: 'I read every single one. Even the harsh ones — they keep me sharp.', style: 'HUMBLE', repChange: 2, fansMult: 1.2, scandalRisk: 0, crowdReaction: 'Respect. That is a professional.' },
        { text: 'I read the good ones twice and the bad ones once, then I call my therapist.', style: 'WITTY', repChange: 1, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Ha! The audience is with you.' },
        { text: 'Critics are just people with opinions and keyboards. I trust the box office.', style: 'CONTROVERSIAL', repChange: -3, fansMult: 1.8, scandalRisk: 0.15, crowdReaction: 'Yikes. That will make headlines.' },
      ],
    });
  }
  if (movieTitle) {
    qs.push({
      id: 'mv_3', question: `What was the hardest scene to shoot in "${movieTitle}"?`, context: 'movie',
      answers: [
        { text: 'A quiet two-page monologue — no music, no tricks. Just me and the camera.', style: 'HUMBLE', repChange: 2, fansMult: 1.2, scandalRisk: 0, crowdReaction: 'That kind of craft is why fans love you.' },
        { text: 'The craft services line. I kept reaching for the donuts between takes.', style: 'WITTY', repChange: 1, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'The studio audience is cracking up!' },
        { text: 'Working with my co-star, honestly. We did not exactly click.', style: 'CONTROVERSIAL', repChange: -2, fansMult: 1.6, scandalRisk: 0.2, crowdReaction: 'Whoa — we will circle back to that.' },
      ],
    });
  }

  // ---- AWARDS (only if won) ----
  if (ctx.awardsWon > 0) {
    qs.push({
      id: 'aw_1', question: `You've won ${ctx.awardsWon} award${ctx.awardsWon > 1 ? 's' : ''} now. Where do you keep the trophies?`, context: 'award',
      answers: [
        { text: 'On a shelf in my office — right where I can see them before auditions.', style: 'HUMBLE', repChange: 2, fansMult: 1.2, scandalRisk: 0, crowdReaction: 'Wholesome. The audience loves it.' },
        { text: 'They make great doorstops in my trailer.', style: 'WITTY', repChange: 1, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Ha! You have to love that.' },
        { text: 'Somewhere in storage, honestly. Awards are nice but they do not pay the rent.', style: 'CONTROVERSIAL', repChange: -2, fansMult: 1.5, scandalRisk: 0.1, crowdReaction: 'The academy might have opinions on that.' },
      ],
    });
  }

  // ---- SCANDAL (only if real) ----
  if (ctx.hasScandal) {
    qs.push({
      id: 'sc_1', question: `I have to ask — there's been talk about that recent situation in the tabloids. What really happened?`, context: 'scandal',
      answers: [
        { text: 'It was blown out of proportion. I own my part, and I am moving forward.', style: 'HUMBLE', repChange: 3, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'Graceful. The audience is applauding.' },
        { text: 'The truth? The truth is I was set up by a "source" who wanted a payday.', style: 'WITTY', repChange: 0, fansMult: 1.8, scandalRisk: 0.1, crowdReaction: 'Bold claim. Lawyers are taking notes.' },
        { text: 'You know what? Ask my lawyer. I am done talking about it.', style: 'CONTROVERSIAL', repChange: -2, fansMult: 1.3, scandalRisk: 0.25, crowdReaction: 'Awkward silence in the studio...' },
      ],
    });
  }

  // ---- FUN / PERSONAL (always available) ----
  qs.push({
    id: 'fun_1', question: `Rapid fire: what's the first thing you do after wrapping a movie?`, context: 'fun',
    answers: [
      { text: 'Sleep for three days, then call my mom.', style: 'HUMBLE', repChange: 1, fansMult: 1.2, scandalRisk: 0, crowdReaction: 'Relatable! The audience cheers.' },
      { text: 'Book a flight somewhere with no paparazzi and no Wi-Fi.', style: 'WITTY', repChange: 1, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'Ha — sign us up for that trip.' },
      { text: 'Negotiate my next contract. The work never stops.', style: 'CONTROVERSIAL', repChange: 0, fansMult: 1.2, scandalRisk: 0.05, crowdReaction: 'Grinder mentality. Respect.' },
    ],
  });
  qs.push({
    id: 'fun_2', question: `If you weren't acting, what would you be doing?`, context: 'fun',
    answers: [
      { text: 'Probably teaching. I love breaking down scenes for young actors.', style: 'HUMBLE', repChange: 2, fansMult: 1.2, scandalRisk: 0, crowdReaction: 'That is genuinely inspiring.' },
      { text: 'A chef. I make a mean pasta and terrible decisions in the kitchen.', style: 'WITTY', repChange: 1, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The audience is laughing!' },
      { text: 'Owning a studio. I have opinions about how this town works.', style: 'CONTROVERSIAL', repChange: 0, fansMult: 1.3, scandalRisk: 0.05, crowdReaction: 'Power move. The host raises an eyebrow.' },
    ],
  });
  qs.push({
    id: 'fun_3', question: `Fans want to know — what's on your watchlist right now?`, context: 'fun',
    answers: [
      { text: 'Everything my friends are in. I am everyone\'s biggest cheerleader.', style: 'HUMBLE', repChange: 2, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'What a great answer!' },
      { text: 'My own movies, obviously. Gotta study the craft.', style: 'WITTY', repChange: 1, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The audience laughs.' },
      { text: 'I do not watch much. I prefer to make it, not consume it.', style: 'CONTROVERSIAL', repChange: -1, fansMult: 1.2, scandalRisk: 0.08, crowdReaction: 'Bit of a hot take there!' },
    ],
  });

  // ---- STATION-TYPE SPECIFIC ----
  if (stationType === 'Sports') {
    qs.push({
      id: 'spr_1', question: `Stunt training for action roles — how much of it is really you?`, context: 'career',
      answers: [
        { text: 'I train months for every stunt. I want audiences to know it is real.', style: 'HUMBLE', repChange: 2, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The sports crowd respects that.' },
        { text: 'About 60% me, 40% a guy named Dave who is terrifyingly good.', style: 'WITTY', repChange: 1, fansMult: 1.5, scandalRisk: 0, crowdReaction: 'Ha! Dave deserves a raise.' },
        { text: 'All me. I do not do doubles. That is for the insurance companies to worry about.', style: 'CONTROVERSIAL', repChange: 0, fansMult: 1.8, scandalRisk: 0.1, crowdReaction: 'Big claim — the producers are sweating.' },
      ],
    });
  }
  if (stationType === 'News' || stationType === 'International') {
    qs.push({
      id: 'nws_1', question: `Your films reach audiences worldwide. How do you feel about that responsibility?`, context: 'career',
      answers: [
        { text: 'It is humbling. Stories connect people across borders, and I take that seriously.', style: 'HUMBLE', repChange: 3, fansMult: 1.3, scandalRisk: 0, crowdReaction: 'A thoughtful answer. Well said.' },
        { text: 'I mostly hear about it from my accountant, honestly. International money adds up.', style: 'WITTY', repChange: 1, fansMult: 1.4, scandalRisk: 0, crowdReaction: 'The news desk chuckles.' },
        { text: 'I make entertainment, not policy. I leave the world-changing to people who get paid more.', style: 'CONTROVERSIAL', repChange: -2, fansMult: 1.4, scandalRisk: 0.12, crowdReaction: 'That quote will be clipped for sure.' },
      ],
    });
  }

  // Filter: exclude already-asked, cap at 5, never empty
  let pool = qs.filter((q) => !excludeIds.includes(q.id));
  if (pool.length === 0) pool = qs;
  return pool.slice(0, 5);
}

// Compute interview result from chosen answers
export function computeInterviewResult(
  ctx: TvInterviewContext,
  station: any,
  questions: TvQuestion[],
  chosen: TvAnswerChoice[]
): TvInterviewResult {
  const p = ctx.player;
  const fame = p.fameXp || 0;
  // Fans scale SUB-LINEARLY with career progress: new players ~4-10k per
  // interview, veterans grow at square-root pace (4x fame = 2x fans).
  const fansBase = Math.floor(400 + Math.sqrt(fame) * 10); // per question
  const cash = Math.floor((station?.viewerBase || 2000000) * 0.0012 + Math.sqrt(fame) * 60);
  const fameTotalRaw = Math.floor(8 + fame * 0.004);

  let fans = 0, rep = 0, fameTotal = 0, scandal = false, cashFinal = cash;
  const reactions: string[] = [];

  chosen.forEach((c, i) => {
    const f = Math.floor(fansBase * (c.fansMult || 1) * (0.85 + Math.random() * 0.3));
    fans += f;
    rep += c.repChange || 0;
    reactions.push(`${questions[i]?.question ? 'Q' + (i + 1) : ''} ${c.crowdReaction} (+${f.toLocaleString()} fans)`);
    if (Math.random() < (c.scandalRisk || 0)) scandal = true;
  });

  // Base rewards scaled by questions answered
  const qMult = questions.length / 5;
  fans = Math.floor(fans * (0.7 + qMult * 0.3));
  cashFinal = Math.floor(cash * qMult);
  fameTotal = Math.max(1, Math.floor(fameTotalRaw * qMult));

  return {
    stationName: station?.name || 'TV Station',
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
// TV OFFER SCHEDULING + PERSISTENCE (localStorage)
// ============================================================
const OFFERS_KEY = 'HR_TV_OFFERS';

export interface TvOfferEntry {
  stationId: string;
  offer: any; // TvInterviewOffer
}

export function loadTvOffers(): TvOfferEntry[] {
  try {
    return JSON.parse(localStorage.getItem(OFFERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveTvOffers(offers: TvOfferEntry[]) {
  try {
    localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
  } catch {}
}

// Manager books an interview for the player (every 6 weeks) — schedules in 3 weeks.
// TV is manager-gated: no signed manager = no TV interviews, no inbox spam.
export function scheduleTvInterview(player: any): { subject: string; body: string; date: string; read: boolean }[] {
  const msgs: { subject: string; body: string; date: string; read: boolean }[] = [];
  if (!player?.representation?.manager?.signed) return msgs;
  const offers = loadTvOffers();
  const mgr = player?.representation?.manager;
  const stationId = mgr ? `tv_${1 + ((player?.dateWeek || 0) % 6)}` : 'tv_1';
  const existing = offers.find((o) => o.stationId === stationId && o.offer.status !== 'DONE');

  const offer = {
    id: `tv_int_${Date.now()}`,
    stationId,
    topic: 'Your career, latest film & what\'s next',
    status: 'PENDING',
    scheduledInWeeks: 3,
    fameXpReward: 15,
    cashReward: 3000,
    fansReward: 5000,
    source: 'MANAGER',
    bookedWeek: player?.dateWeek || 1,
    bookedYear: player?.dateYear || 2026,
  };

  if (!existing) {
    offers.push({ stationId, offer });
    saveTvOffers(offers);
    msgs.push({
      subject: '🎙️ TV INTERVIEW SCHEDULED — PREPARE!',
      body: `Your manager ${mgr?.name || 'booked'} you on a major TV interview in 3 weeks.\\n\\nWhen it airs, you'll sit for up to 5 questions with 3 answers each — your answers affect fans, reputation and your fee.\\n\\nTip: witty answers boost fans, humble answers build reputation, controversial answers are risky.`,
      date: `Week ${player?.dateWeek}, ${player?.dateYear}`,
      read: false,
    });
  }
  return msgs;
}

// Weekly processing: countdown -> READY + notifications; station invites on real news.
// TV is manager-gated: without a signed manager, stale offers are cleared and nothing new is created.
export function processTvOffersWeekly(player: any, newWeek: number, newYear: number): { subject: string; body: string; date: string; read: boolean }[] {
  const offers = loadTvOffers();
  const msgs: { subject: string; body: string; date: string; read: boolean }[] = [];
  let changed = false;

  // No signed manager -> TV is locked. Clear any stale offers so nothing lingers.
  if (!player?.representation?.manager?.signed) {
    const stale = offers.some((o) => o.offer && o.offer.status !== 'DONE');
    if (stale) {
      offers.forEach((o) => { if (o.offer) o.offer.status = 'DONE'; });
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
      msgs.push({
        subject: '🔴 INTERVIEW AIRING TODAY!',
        body: `Your interview is ready to go live right now!\\n\\nOpen World → TV Stations and hit GO LIVE. Up to 5 questions — your answers shape fans, reputation and your appearance fee.`,
        date: `Week ${newWeek}, ${newYear}`,
        read: false,
      });
    } else if (o.scheduledInWeeks === 1) {
      msgs.push({
        subject: '⏰ INTERVIEW TOMORROW — LAST CALL TO PREPARE',
        body: `Your TV interview airs next week. Be ready to answer questions about your career, films and Hollywood life.`,
        date: `Week ${newWeek}, ${newYear}`,
        read: false,
      });
    }
  });

  // Station invites: when the player has real news (fresh release or award) and no active offer
  const hasNews = (player?.moviesCompleted || 0) > 0 && (player?.dateWeek || 0) % 4 === 0;
  if (hasNews) {
    const activeCount = offers.filter((o) => o.offer.status === 'PENDING' || o.offer.status === 'READY').length;
    if (activeCount < 2 && offers.length < 6) {
      const sid = `tv_${3 + ((player?.dateWeek || 0) % 5)}`; // entertainment/late-night stations
      if (!offers.some((o) => o.stationId === sid && o.offer.status !== 'DONE')) {
        offers.push({
          stationId: sid,
          offer: {
            id: `tv_int_${Date.now()}`,
            stationId: sid,
            topic: 'Your latest news & box office run',
            status: 'PENDING',
            scheduledInWeeks: 2,
            fameXpReward: 12,
            cashReward: 2500,
            fansReward: 4000,
            source: 'STATION',
            bookedWeek: newWeek,
            bookedYear: newYear,
          },
        });
        changed = true;
        msgs.push({
          subject: '📺 STATION INVITATION: TV INTERVIEW OFFERED',
          body: `A TV network noticed your recent success and wants you on the show — airing in 2 weeks. Open TV Stations to track it.`,
          date: `Week ${newWeek}, ${newYear}`,
          read: false,
        });
      }
    }
  }

  if (changed) saveTvOffers(offers);
  return msgs;
}

// Merge persisted offers into the station list for the view
export function mergeOffersIntoStations(stations: any[]): any[] {
  const offers = loadTvOffers();
  return stations.map((st) => {
    const entry = offers.find((o) => o.stationId === st.id);
    if (entry) return { ...st, activeInterviewOffer: entry.offer };
    return { ...st, activeInterviewOffer: undefined };
  });
}

// Mark an offer DONE after the interview completes
export function completeTvOffer(stationId: string) {
  const offers = loadTvOffers();
  const entry = offers.find((o) => o.stationId === stationId);
  if (entry && entry.offer) {
    entry.offer.status = 'DONE';
    saveTvOffers(offers);
  }
}

// ============================================================
// RADIO INTERVIEW ENGINE (agent-handled, same show mechanics)
// ============================================================
const RADIO_OFFERS_KEY = 'HR_RADIO_OFFERS';

export interface RadioOfferEntry {
  stationId: string;
  offer: any;
}

export function loadRadioOffers(): RadioOfferEntry[] {
  try { return JSON.parse(localStorage.getItem(RADIO_OFFERS_KEY) || '[]'); } catch { return []; }
}
export function saveRadioOffers(offers: RadioOfferEntry[]) {
  try { localStorage.setItem(RADIO_OFFERS_KEY, JSON.stringify(offers)); } catch {}
}

// AGENT books a radio interview (every 4 weeks) — scheduled in 3 weeks.
// Radio is agent-gated: no signed agent = no radio interviews, no inbox spam.
export function scheduleRadioInterview(player: any): { subject: string; body: string; date: string; read: boolean }[] {
  const msgs: { subject: string; body: string; date: string; read: boolean }[] = [];
  if (!player?.representation?.agent?.signed) return msgs;
  const offers = loadRadioOffers();
  const agent = player?.representation?.agent;
  const stationId = `rad_${1 + ((player?.dateWeek || 0) % 4)}`;
  const existing = offers.find((o) => o.stationId === stationId && o.offer.status !== 'DONE');
  if (existing) return msgs;

  const offer = {
    id: `rad_int_${Date.now()}`,
    stationId,
    topic: 'Your career, latest film & what\'s next',
    status: 'PENDING',
    scheduledInWeeks: 3,
    fameXpReward: 8,
    cashReward: 1800,
    fansReward: 3000,
    source: 'AGENT',
    bookedWeek: player?.dateWeek || 1,
    bookedYear: player?.dateYear || 2026,
  };
  offers.push({ stationId, offer });
  saveRadioOffers(offers);
  msgs.push({
    subject: '🎙️ RADIO INTERVIEW SCHEDULED BY YOUR AGENT — PREPARE!',
    body: `Your agent ${agent?.name || ''} (${agent?.agencyName || ''}) booked you on a radio interview in 3 weeks.\\n\\nSame format as TV: up to 5 questions, 3 answers each — your answers affect fans, reputation and your appearance fee.`,
    date: `Week ${player?.dateWeek}, ${player?.dateYear}`,
    read: false,
  });
  return msgs;
}

// Weekly processing for radio offers (countdown -> READY).
// Radio is agent-gated: without a signed agent, stale offers are cleared.
export function processRadioOffersWeekly(player: any, newWeek: number, newYear: number): { subject: string; body: string; date: string; read: boolean }[] {
  const offers = loadRadioOffers();
  const msgs: { subject: string; body: string; date: string; read: boolean }[] = [];
  let changed = false;

  if (!player?.representation?.agent?.signed) {
    const stale = offers.some((o) => o.offer && o.offer.status !== 'DONE');
    if (stale) {
      offers.forEach((o) => { if (o.offer) o.offer.status = 'DONE'; });
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
      msgs.push({
        subject: '🔴 RADIO INTERVIEW LIVE NOW!',
        body: `Your radio interview is ready — open World → Radio Stations and GO LIVE. Up to 5 questions!`,
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
