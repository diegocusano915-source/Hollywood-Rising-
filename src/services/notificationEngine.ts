/**
 * HOLLYWOOD RISING - NOTIFICATION ENGINE (REAL EVENTS ONLY)
 * Derives every notification from real game state: offers, bids, deadlines,
 * runs, contracts and the player's actual stats. Nothing is simulated.
 */

import { SaveData, HrNotificationItem, HrNotificationKind } from '../types/game';
import { loadStreamingState } from './streamingEngine';
import { loadTvOffers, loadRadioOffers } from './tvInterviewEngine';
import { loadStudioState } from './personalStudioEngine';
import { INITIAL_TV_STATIONS, INITIAL_RADIO_STATIONS } from '../database/worldDatabase';
import { RepresentationService } from './representationService';
import { NetworkService } from './networkService';

const fmt$ = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

// Real box-office fame multipliers (mirrors GameContext advanceWeek)
const FAME_TIERS: { min: number; mult: number }[] = [
  { min: 100000, mult: 100 },
  { min: 50000, mult: 50 },
  { min: 25000, mult: 25 },
  { min: 10000, mult: 12 },
  { min: 5000, mult: 6 },
  { min: 2000, mult: 3 },
  { min: 500, mult: 1.5 },
];

const TV_NAMES: Record<string, string> = {};
INITIAL_TV_STATIONS.forEach((s) => (TV_NAMES[(s as any).id] = (s as any).name));
const RADIO_NAMES: Record<string, string> = {};
INITIAL_RADIO_STATIONS.forEach((s) => (RADIO_NAMES[(s as any).id] = (s as any).name));

function makeItem(
  save: SaveData,
  kind: HrNotificationKind,
  tag: string,
  icon: string,
  title: string,
  body: string,
  urgency: 'high' | 'medium' | 'low',
  refWeek?: number
): HrNotificationItem {
  return { id: `hrn_${kind}_${tag}`, tag, kind, icon, title, body, urgency, refWeek: refWeek ?? save.player?.dateWeek };
}

/** Collects ALL live notification items from real game state. */
export function collectNotificationItems(save: SaveData): HrNotificationItem[] {
  const items: HrNotificationItem[] = [];
  if (!save?.player) return items;
  const p = save.player;
  const week = p.dateWeek || 1;

  // ============ DEADLINES (REAL COUNTDOWNS) ============

  // 1. Streaming platform bids awaiting a reply (real offers, real expiry)
  try {
    const stream = loadStreamingState();
    const bids = stream.pendingBids.filter((b) => b.status === 'PENDING');
    bids.forEach((b) => {
      const platform = stream.platforms.find((x) => x.id === b.platformId);
      const left = Math.max(0, b.weeksLeft ?? 3);
      items.push(
        makeItem(
          save,
          'DEADLINE',
          `bid_${b.id}`,
          '💰',
          `${platform?.name || 'A platform'} bid expiring`,
          `${platform?.name || 'A platform'} put ${fmt$(b.upfront)} on the table for "${b.projectTitle}". Answer before it expires — ${left} week${left === 1 ? '' : 's'} left.`,
          left <= 1 ? 'high' : 'medium',
          week + left
        )
      );
    });
  } catch {}

  // 2. Auditions awaiting a decision (real countdown)
  const auditions = save.auditions || [];
  if (auditions.length > 0) {
    const minLeft = Math.min(...auditions.map((a) => a.weeksRemaining ?? 1));
    items.push(
      makeItem(
        save,
        'DEADLINE',
        'auditions',
        '🎬',
        `${auditions.length} audition${auditions.length === 1 ? '' : 's'} awaiting your answer`,
        auditions.length === 1
          ? `Your audition for "${auditions[0].movieTitle}" needs a decision — ${minLeft} week${minLeft === 1 ? '' : 's'} left.`
          : `${auditions.length} auditions need decisions — the next one closes in ${minLeft} week${minLeft === 1 ? '' : 's'}.`,
        minLeft <= 1 ? 'high' : 'medium',
        week + minLeft
      )
    );
  }

  // 3. Personal Studio cast offers (real 3-week accept windows)
  try {
    const studio = loadStudioState();
    const pendingCast = (studio.projects || [])
      .filter((pr) => pr.stage === 'Production')
      .flatMap((pr) =>
        (pr.cast || [])
          .filter((c) => c.status === 'PENDING' && (c.weeksRemaining ?? 0) > 0)
          .map((c) => ({ pr, c }))
      );
    if (pendingCast.length > 0) {
      const minLeft = Math.min(...pendingCast.map((x) => x.c.weeksRemaining ?? 1));
      const names = pendingCast.slice(0, 2).map((x) => x.c.name.split(' ')[0]);
      items.push(
        makeItem(
          save,
          'DEADLINE',
          'cast_offers',
          '🎭',
          `${pendingCast.length} actor${pendingCast.length === 1 ? '' : 's'} haven't answered your offer`,
          `${names.join(' & ')}${pendingCast.length > 2 ? ` +${pendingCast.length - 2} more` : ''} haven't accepted yet — shortest window: ${minLeft} week${minLeft === 1 ? '' : 's'} left.`,
          minLeft <= 1 ? 'high' : 'medium',
          week + minLeft
        )
      );
    }
  } catch {}

  // 4. Sequel offers waiting in the Production Hub (real greenlit offers)
  const sequelActed = (save.bookedProjects || []).some((b) => (b as any).isSequel);
  const sequelReleased = (save.releasedMovies || []).some((m) => m.isSequel);
  const sequelOffers = (save.releasedMovies || []).filter(
    (m) => m.sequelOffered && !(sequelActed || sequelReleased)
  );
  sequelOffers.slice(0, 2).forEach((m) => {
    const part = m.sequelOfferedPart || (m.franchisePart || 1) + 1;
    items.push(
      makeItem(
        save,
        'DEADLINE',
        `sequel_${m.id}`,
        '📈',
        `Sequel offer waiting`,
        `"${m.movieTitle}" hit its sequel numbers — Part ${part} offer is in the Production Hub. Talk to your manager before it cools off.`,
        'high',
        week
      )
    );
  });

  // 5. TV interviews (real scheduled countdown)
  try {
    const tvOffers = loadTvOffers().filter((o) => o.offer && (o.offer.status === 'PENDING' || o.offer.status === 'READY'));
    if (tvOffers.length > 0) {
      const ready = tvOffers.some((o) => o.offer.status === 'READY');
      const minLeft = ready
        ? 0
        : Math.min(...tvOffers.map((o) => o.offer.scheduledInWeeks ?? 1));
      const stationName = TV_NAMES[tvOffers[0].stationId] || 'a major station';
      items.push(
        makeItem(
          save,
          'DEADLINE',
          'tv_interview',
          '🎙️',
          ready ? 'Your TV interview is ready to go live' : `TV interview airing in ${minLeft} week${minLeft === 1 ? '' : 's'}`,
          ready
            ? `${stationName} is live RIGHT NOW — open World → TV Stations and hit GO LIVE.`
            : `${stationName} has you scheduled — prepare your answers, it airs in ${minLeft} week${minLeft === 1 ? '' : 's'}.`,
          ready ? 'high' : 'medium',
          week + minLeft
        )
      );
    }
  } catch {}

  // 6. Radio interviews (real scheduled countdown)
  try {
    const radioOffers = loadRadioOffers().filter((o) => o.offer && (o.offer.status === 'PENDING' || o.offer.status === 'READY'));
    if (radioOffers.length > 0) {
      const ready = radioOffers.some((o) => o.offer.status === 'READY');
      const minLeft = ready ? 0 : Math.min(...radioOffers.map((o) => o.offer.scheduledInWeeks ?? 1));
      const stationName = RADIO_NAMES[radioOffers[0].stationId] || 'your radio station';
      items.push(
        makeItem(
          save,
          'DEADLINE',
          'radio_interview',
          '📻',
          ready ? 'Your radio interview is ready' : `Radio interview in ${minLeft} week${minLeft === 1 ? '' : 's'}`,
          ready
            ? `${stationName} is live now — head to World → Radio Stations.`
            : `${stationName} airs your interview in ${minLeft} week${minLeft === 1 ? '' : 's'}.`,
          ready ? 'high' : 'medium',
          week + minLeft
        )
      );
    }
  } catch {}

  // 7. Limited merch drops ending (real drop countdown)
  try {
    const merch = (RepresentationService.getState()?.merchandise || []).filter(
      (m) => m.limitedDrop && (m.dropWeeksLeft ?? 0) > 0
    );
    merch.slice(0, 2).forEach((m) => {
      items.push(
        makeItem(
          save,
          'DEADLINE',
          `drop_${m.id}`,
          '🔥',
          `"${m.name}" drop ending`,
          `Your limited drop closes in ${m.dropWeeksLeft} week${m.dropWeeksLeft === 1 ? '' : 's'} — ${m.totalSold.toLocaleString()} sold so far.`,
          (m.dropWeeksLeft ?? 4) <= 2 ? 'high' : 'medium',
          week + (m.dropWeeksLeft ?? 0)
        )
      );
    });
  } catch {}

  // 8. Loan payments nearing the end (real loan terms)
  try {
    const loans = (NetworkService.getState()?.bankAccount?.activeLoans || []).filter(
      (l) => l.status === 'ACTIVE' && (l.weeksRemaining ?? 0) > 0
    );
    if (loans.length > 0) {
      const minLeft = Math.min(...loans.map((l) => l.weeksRemaining ?? 1));
      if (minLeft <= 3) {
        items.push(
          makeItem(
            save,
            'DEADLINE',
            'loan_final',
            '🏦',
            `Loan payoff in ${minLeft} week${minLeft === 1 ? '' : 's'}`,
            `${loans.length === 1 ? 'Your loan' : 'A loan'} is almost paid off — final payments of ${fmt$(loans[0].weeklyPayment)}/week. Keep the streak clean for your credit score.`,
            'high',
            week + minLeft
          )
        );
      }
    }
  } catch {}

  // ============ STATUS (REAL CURRENT STATE) ============

  // 9. Movies still in theaters (real runs)
  const inCinemas = (save.releasedMovies || []).filter((m) => m.inCinemas);
  inCinemas.slice(0, 3).forEach((m) => {
    items.push(
      makeItem(
        save,
        'STATUS',
        `theaters_${m.id}`,
        '🎥',
        `"${m.movieTitle}" still in theaters`,
        `Week ${m.weeksInCinemas || 1} of its run — lifetime ${fmt$(m.worldwideGross || 0)} worldwide.`,
        'medium',
        week
      )
    );
  });

  // 10. Exclusive streaming deals nearing the end (real deal terms)
  try {
    const stream = loadStreamingState();
    const ending = (stream.platforms || [])
      .flatMap((pl) => (pl.activeDeals || []).map((d) => ({ pl, d })))
      .filter((x) => x.d.exclusive && (x.d.weeksRemaining ?? 0) > 0 && x.d.weeksRemaining <= 8);
    ending.slice(0, 2).forEach((x) => {
      items.push(
        makeItem(
          save,
          'STATUS',
          `deal_${x.d.id}`,
          '📺',
          `Exclusive ${x.pl.name} deal ending`,
          `"${x.d.projectTitle}" has ${x.d.weeksRemaining} week${x.d.weeksRemaining === 1 ? '' : 's'} left on its exclusive window — renewals land here after.`,
          'medium',
          week + x.d.weeksRemaining
        )
      );
    });
  } catch {}

  // ============ PROGRESS (REAL STATS, REAL THRESHOLDS) ============

  // 11. Next box-office fame multiplier tier
  const fame = p.fameXp || 0;
  const nextTier = FAME_TIERS.find((t) => fame < t.min);
  if (nextTier) {
    items.push(
      makeItem(
        save,
        'PROGRESS',
        'fame_tier',
        '🚀',
        `${(nextTier.min - fame).toLocaleString()} fame to ${nextTier.mult}× box office power`,
        `You're at ${fame.toLocaleString()} fame — crossing ${nextTier.min.toLocaleString()} unlocks a ${nextTier.mult}× multiplier on your theatrical gross.`,
        'low',
        week
      )
    );
  }

  // 12. Personal Studio unlock progress (real requirements: 20 principal / 5,000 fame / 15 movies / $50M)
  try {
    const studio = loadStudioState();
    if (!studio.unlocked && !studio.sold) {
      const needMovies = Math.max(0, 15 - (p.moviesCompleted || 0));
      const needPrincipal = Math.max(0, 20 - (p.principalRolesCount || 0));
      const needFame = Math.max(0, 5000 - fame);
      const needMoney = Math.max(0, 50000000 - (p.money || 0));
      const gaps = [
        needMovies > 0 ? `${needMovies} movie${needMovies === 1 ? '' : 's'}` : null,
        needPrincipal > 0 ? `${needPrincipal} principal role${needPrincipal === 1 ? '' : 's'}` : null,
        needFame > 0 ? `${needFame.toLocaleString()} fame` : null,
        needMoney > 0 ? fmt$(needMoney) : null,
      ].filter(Boolean);
      if (gaps.length > 0) {
        items.push(
          makeItem(
            save,
            'PROGRESS',
            'studio_unlock',
            '🏢',
            'Personal Studio unlock progress',
            `Still need ${gaps.join(', ')} to open your own studio.`,
            'low',
            week
          )
        );
      }
    }
  } catch {}

  // 13. Agent unlock (4 Principal Roles OR 4 Movies)
  if (!p.representation?.agent) {
    const needPrincipal = Math.max(0, 4 - (p.principalRolesCount || 0));
    const needMovies = Math.max(0, 4 - (p.moviesCompleted || 0));
    if (needPrincipal > 0 && needMovies > 0) {
      items.push(
        makeItem(
          save,
          'PROGRESS',
          'agent_unlock',
          '🎬',
          `${needPrincipal} principal role${needPrincipal === 1 ? '' : 's'} (or ${needMovies} movie${needMovies === 1 ? '' : 's'}) to unlock agents`,
          `Agents start pitching you roles once you book ${needPrincipal} more principal role${needPrincipal === 1 ? '' : 's'} or ${needMovies} more movie${needMovies === 1 ? '' : 's'}.`,
          'low',
          week
        )
      );
    }
  }

  // 14. SAG-AFTRA membership (4 lead roles)
  if (!p.isUnionMember) {
    const needLeads = Math.max(0, 4 - (p.leadRolesCount || 0));
    if (needLeads > 0) {
      items.push(
        makeItem(
          save,
          'PROGRESS',
          'sag_unlock',
          '🛡️',
          `${needLeads} lead role${needLeads === 1 ? '' : 's'} to SAG-AFTRA`,
          `Union membership unlocks bigger paydays — you need ${needLeads} more lead role${needLeads === 1 ? '' : 's'}.`,
          'low',
          week
        )
      );
    }
  }

  const order = { high: 0, medium: 1, low: 2 };
  return items.sort((a, b) => order[a.urgency] - order[b.urgency]);
}

/** "While you were away" digest — top real items, reframed for a return. */
export function collectDigestItems(save: SaveData): HrNotificationItem[] {
  const live = collectNotificationItems(save);
  const now = Date.now();
  return live
    .filter((i) => i.urgency !== 'low')
    .slice(0, 6)
    .map((i) => ({
      ...i,
      kind: 'DIGEST' as HrNotificationKind,
      title: i.title,
      body: i.body,
      read: false,
      ts: now,
    }));
}

/** Real counts used in phone nudge copy. */
export function getPendingCounts(save: SaveData): {
  bids: number;
  auditions: number;
  sequels: number;
  deadlines: number;
} {
  let bids = 0;
  try {
    bids = loadStreamingState().pendingBids.filter((b) => b.status === 'PENDING').length;
  } catch {}
  const auditions = (save.auditions || []).length;
  const sequels = (save.releasedMovies || []).filter((m) => m.sequelOffered).length;
  return { bids, auditions, sequels, deadlines: bids + auditions + sequels };
}

/** The phone nudge — short, punchy, always referencing real pending items. */
export function buildNudge(save: SaveData): { title: string; body: string } {
  const p = save.player;
  const counts = getPendingCounts(save);
  const items = collectNotificationItems(save);
  const top = items.find((i) => i.urgency === 'high') || items[0];
  const name = p?.firstName || 'Star';
  const weekRef = `Week ${p?.dateWeek || 1}, ${p?.dateYear || 2026}`;

  if (top) {
    return {
      title: `📬 ${top.icon} ${top.title}`,
      body: `Come online — ${top.body} ${weekRef}.`,
    };
  }
  if (counts.deadlines > 0) {
    return {
      title: `📬 ${counts.deadlines} thing${counts.deadlines === 1 ? '' : 's'} waiting for you`,
      body: `Come online — ${counts.bids} bid${counts.bids === 1 ? '' : 's'}, ${counts.auditions} audition${counts.auditions === 1 ? '' : 's'}${counts.sequels ? `, ${counts.sequels} sequel offer${counts.sequels === 1 ? '' : 's'}` : ''} are still on the table. ${weekRef}.`,
    };
  }
  return {
    title: `🎬 ${name}, the cameras are waiting`,
    body: `Come online — ${weekRef} is live and your next big break is one decision away.`,
  };
}

/** Short summary used for the repeating phone reminder. */
export function buildRepeatSummary(save: SaveData): string {
  const counts = getPendingCounts(save);
  const parts: string[] = [];
  if (counts.bids > 0) parts.push(`${counts.bids} bid${counts.bids === 1 ? '' : 's'}`);
  if (counts.auditions > 0) parts.push(`${counts.auditions} audition${counts.auditions === 1 ? '' : 's'}`);
  if (counts.sequels > 0) parts.push(`${counts.sequels} sequel offer${counts.sequels === 1 ? '' : 's'}`);
  if (parts.length === 0) return `Your career is still live — Week ${save.player?.dateWeek || 1}, ${save.player?.dateYear || 2026}. Come back and keep it moving.`;
  return `Still waiting for you: ${parts.join(', ')}. Come online before they expire.`;
}

/**
 * ROTATING OFFLINE BATCH (every 46-50 min while away).
 * Builds `count` DIFFERENT notifications from a pool of real-event messages,
 * rotating the starting point each time the player leaves so no two batches
 * look the same. Everything derives from the player's real state.
 */
export function buildBatchMessages(save: SaveData, count: number, offset: number = 0): { title: string; body: string }[] {
  const items = collectNotificationItems(save);
  const p = save.player;
  const counts = getPendingCounts(save);
  const name = p?.firstName || 'Star';
  const weekRef = `Week ${p?.dateWeek || 1}, ${p?.dateYear || 2026}`;
  const fame = p?.fameXp || 0;
  const pool: { title: string; body: string }[] = [];

  // 1. Top urgent real item (bid/offer/deadline)
  const top = items.find((i) => i.urgency === 'high') || items[0];
  if (top) pool.push({ title: `📬 ${top.icon} ${top.title}`, body: `Come online — ${top.body}` });

  // 2. Real pending counts
  if (counts.deadlines > 0) {
    pool.push({
      title: `📬 ${counts.deadlines} thing${counts.deadlines === 1 ? '' : 's'} waiting for you`,
      body: `${counts.bids} bid${counts.bids === 1 ? '' : 's'}, ${counts.auditions} audition${counts.auditions === 1 ? '' : 's'}${counts.sequels ? `, ${counts.sequels} sequel offer${counts.sequels === 1 ? '' : 's'}` : ''} still on the table. ${weekRef}.`,
    });
  }

  // 3. Real current stats
  pool.push({
    title: `⭐ ${name}, your numbers right now`,
    body: `Fame ${fame.toLocaleString()} · Cash $${(p?.money || 0).toLocaleString()} · ${(p?.fans || 0).toLocaleString()} fans · ${weekRef}.`,
  });

  // 4. Next box-office fame tier (real threshold)
  const nextTier = FAME_TIERS.find((t) => fame < t.min);
  if (nextTier) {
    pool.push({
      title: `🚀 ${(nextTier.min - fame).toLocaleString()} fame to ${nextTier.mult}× box office`,
      body: `Cross ${nextTier.min.toLocaleString()} fame to multiply your theatrical power. ${weekRef}.`,
    });
  }

  // 5. Week is live
  pool.push({
    title: `🎬 ${name}, the cameras are waiting`,
    body: `${weekRef} is live — your next big break is one decision away.`,
  });

  // 6. Movie still in theaters (real run)
  const inCinemas = (save.releasedMovies || []).filter((m) => m.inCinemas);
  if (inCinemas.length > 0) {
    pool.push({
      title: `🎥 "${inCinemas[0].movieTitle}" still in theaters`,
      body: `Week ${inCinemas[0].weeksInCinemas || 1} of its run — lifetime $${(inCinemas[0].worldwideGross || 0).toLocaleString()}. ${weekRef}.`,
    });
  }

  // 7. Career progress (real counts)
  pool.push({
    title: `🏆 ${p?.moviesCompleted || 0} film${(p?.moviesCompleted || 0) === 1 ? '' : 's'} completed`,
    body: `${p?.leadRolesCount || 0} lead roles · ${p?.principalRolesCount || 0} principal roles — keep building. ${weekRef}.`,
  });

  // 8. Fans
  pool.push({
    title: `👥 ${(p?.fans || 0).toLocaleString()} fans and counting`,
    body: `Your audience is growing — give them something to cheer. ${weekRef}.`,
  });

  // Build the batch, rotating through the pool from `offset`, no repeats until
  // the pool is exhausted (then honest "still waiting" reminders).
  const result: { title: string; body: string }[] = [];
  const used: number[] = [];
  for (let i = 0; i < count; i++) {
    let idx = (offset + i) % pool.length;
    if (used.includes(idx)) {
      result.push({ title: '📬 Still waiting for you', body: buildRepeatSummary(save) });
      continue;
    }
    used.push(idx);
    result.push(pool[idx]);
  }
  return result;
}
